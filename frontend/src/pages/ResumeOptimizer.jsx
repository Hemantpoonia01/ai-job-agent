import { useState } from 'react';
import { FileText, Copy, Check, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { optimizeResume } from '../utils/api';
import { copyToClipboard } from '../utils/helpers';

export default function ResumeOptimizer() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!resume.trim() || !jd.trim()) { setError('Please enter both resume and job description.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await optimizeResume(resume, jd, targetRole);
      setResult(res.data);
    } catch (e) {
      setError('Optimization failed. Make sure the backend is running and your API key is set.');
    } finally { setLoading(false); }
  };

  const handleCopy = async () => {
    if (await copyToClipboard(result.optimized_resume)) {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Resume Optimizer</div>
        <div className="page-subtitle">AI-powered ATS optimization tailored to each job description</div>
      </div>

      <div className="page-body">
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="input-group">
            <label className="input-label">Your Resume *</label>
            <textarea placeholder="Paste your resume..." value={resume} onChange={e => setResume(e.target.value)} style={{ minHeight: 240 }} />
          </div>
          <div className="input-group">
            <label className="input-label">Job Description *</label>
            <textarea placeholder="Paste the job description..." value={jd} onChange={e => setJd(e.target.value)} style={{ minHeight: 240 }} />
          </div>
        </div>

        <div className="input-group" style={{ maxWidth: 400, marginBottom: 16 }}>
          <label className="input-label">Target Role (optional)</label>
          <input type="text" placeholder="e.g. Senior React Developer" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--red)', fontSize: 14, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={handleOptimize} disabled={loading}>
          {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Optimizing...</> : <><FileText size={16} /> Optimize Resume</>}
        </button>

        {result && (
          <div className="fade-in" style={{ marginTop: 32 }}>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-title">ATS Score Improvement</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: 'var(--red)', lineHeight: 1 }}>{result.ats_score_before}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Before</div>
                  </div>
                  <ArrowRight size={24} color="var(--text-dim)" />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>{result.ats_score_after}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>After</div>
                  </div>
                  <div style={{ flex: 1, paddingLeft: 8 }}>
                    <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600, marginBottom: 4 }}>
                      +{(result.ats_score_after - result.ats_score_before)} point improvement
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${result.ats_score_after}%`, background: 'var(--green)' }} />
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{ marginBottom: 24 }}>
                  <div>
                    <div className="result-section-title">Changes Made</div>
                    <div className="stack" style={{ gap: 8 }}>
                      {result.changes_made?.map((c, i) => (
                        <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                          <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{i+1}.</span>{c}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="result-section-title">Keywords Added</div>
                    <div className="chips">
                      {result.keywords_added?.map(k => <span key={k} className="chip chip-accent">{k}</span>)}
                    </div>
                    <div className="result-section-title" style={{ marginTop: 16 }}>Formatting Tips</div>
                    <div className="stack" style={{ gap: 6 }}>
                      {result.formatting_tips?.map((t, i) => (
                        <div key={i} style={{ fontSize: 12, color: 'var(--text-muted)' }}>• {t}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Optimized Resume</div>
                <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                  {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
              <div className="card-body">
                <div className="text-output">{result.optimized_resume}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
