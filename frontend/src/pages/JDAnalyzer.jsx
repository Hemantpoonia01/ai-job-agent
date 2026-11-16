import { useState } from 'react';
import { FileSearch, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { analyzeMatch } from '../utils/api';
import { getScoreColor } from '../utils/helpers';

export default function JDAnalyzer() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resume.trim() || !jd.trim()) { setError('Please enter both resume and job description.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await analyzeMatch(resume, jd);
      setResult(res.data);
    } catch (e) {
      setError('Analysis failed. Make sure the backend is running and your API key is set.');
    } finally { setLoading(false); }
  };

  const score = result?.match_score ?? 0;
  const scoreColor = getScoreColor(score);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">JD Analyzer</div>
        <div className="page-subtitle">Compare your resume against any job description and get an instant match score</div>
      </div>

      <div className="page-body">
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="input-group">
            <label className="input-label">Your Resume *</label>
            <textarea
              placeholder="Paste your full resume text here..."
              value={resume}
              onChange={e => setResume(e.target.value)}
              style={{ minHeight: 280 }}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Job Description *</label>
            <textarea
              placeholder="Paste the job description here..."
              value={jd}
              onChange={e => setJd(e.target.value)}
              style={{ minHeight: 280 }}
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--red)', fontSize: 14, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Analyzing...</> : <><FileSearch size={16} /> Analyze Match</>}
        </button>

        {result && (
          <div className="fade-in" style={{ marginTop: 32 }}>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-title">Match Analysis Results</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 28 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Match Score</div>
                    <div style={{ marginTop: 8 }}>
                      <div className="progress-bar-wrap" style={{ width: 120 }}>
                        <div className="progress-bar-fill" style={{ width: `${score}%`, background: scoreColor }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, padding: '12px 16px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      💡 {result.recommendation}
                    </div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="result-section">
                    <div className="result-section-title">✅ Matched Skills</div>
                    <div className="chips">
                      {result.matched_skills?.map(s => <span key={s} className="chip chip-green"><CheckCircle size={10} />{s}</span>)}
                    </div>
                  </div>
                  <div className="result-section">
                    <div className="result-section-title">❌ Missing Skills</div>
                    <div className="chips">
                      {result.missing_skills?.map(s => <span key={s} className="chip chip-red"><XCircle size={10} />{s}</span>)}
                    </div>
                  </div>
                  <div className="result-section">
                    <div className="result-section-title">💪 Strengths</div>
                    <div className="stack" style={{ gap: 8 }}>
                      {result.strengths?.map(s => (
                        <div key={s} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <CheckCircle size={13} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />{s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="result-section">
                    <div className="result-section-title">⚠️ Gaps to Address</div>
                    <div className="stack" style={{ gap: 8 }}>
                      {result.gaps?.map(s => (
                        <div key={s} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <AlertCircle size={13} color="var(--amber)" style={{ marginTop: 2, flexShrink: 0 }} />{s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
