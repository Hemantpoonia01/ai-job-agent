import { useState } from 'react';
import { Mail, Copy, Check, AlertCircle, Sparkles } from 'lucide-react';
import { generateCoverLetter } from '../utils/api';
import { copyToClipboard } from '../utils/helpers';

const TONES = ['professional', 'enthusiastic', 'concise', 'creative'];

export default function CoverLetter() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resume.trim() || !jd.trim()) { setError('Please enter both resume and job description.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await generateCoverLetter(resume, jd, company, name, tone);
      setResult(res.data);
    } catch (e) {
      setError('Generation failed. Make sure the backend is running and your API key is set.');
    } finally { setLoading(false); }
  };

  const handleCopy = async () => {
    if (await copyToClipboard(result.cover_letter)) {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Cover Letter Generator</div>
        <div className="page-subtitle">AI-crafted, personalized cover letters that stand out</div>
      </div>

      <div className="page-body">
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="input-group">
            <label className="input-label">Your Resume *</label>
            <textarea placeholder="Paste your resume..." value={resume} onChange={e => setResume(e.target.value)} style={{ minHeight: 220 }} />
          </div>
          <div className="input-group">
            <label className="input-label">Job Description *</label>
            <textarea placeholder="Paste the job description..." value={jd} onChange={e => setJd(e.target.value)} style={{ minHeight: 220 }} />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="input-group">
            <label className="input-label">Company Name</label>
            <input type="text" placeholder="e.g. Google, Infosys, Startup XYZ" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Your Name</label>
            <input type="text" placeholder="e.g. Gopi Saraswat" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 20 }}>
          <label className="input-label">Tone</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TONES.map(t => (
              <button
                key={t}
                className={`filter-chip ${tone === t ? 'active' : ''}`}
                onClick={() => setTone(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--red)', fontSize: 14, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Generating...</> : <><Sparkles size={16} /> Generate Cover Letter</>}
        </button>

        {result && (
          <div className="fade-in" style={{ marginTop: 32 }}>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-title">Suggested Subject Line</div>
              </div>
              <div className="card-body">
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{result.subject_line}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => copyToClipboard(result.subject_line)}>
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-title">Key Highlights</div>
              </div>
              <div className="card-body">
                <div className="chips">
                  {result.key_highlights?.map((h, i) => <span key={i} className="chip chip-accent"><Check size={10} />{h}</span>)}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Mail size={15} /> Your Cover Letter
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>({result.word_count} words)</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                  {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
              <div className="card-body">
                <div className="text-output">{result.cover_letter}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
