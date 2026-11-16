import { useState, useEffect } from 'react';
import { Briefcase, Search, ExternalLink, MapPin, Clock, DollarSign, AlertCircle, RefreshCw, Wifi } from 'lucide-react';
import { findJobs, getScrapeStatus } from '../utils/api';
import { getScoreClass, getPlatformClass, formatDaysAgo } from '../utils/helpers';

const PLATFORMS = ['All', 'LinkedIn', 'Indeed', 'Glassdoor', 'Naukri', 'AngelList'];
const LEVELS = ['Fresher', 'Junior', 'Mid', 'Senior', 'Lead'];

export default function JobFinder() {
  const [resume, setResume] = useState('');
  const [roles, setRoles] = useState('');
  const [location, setLocation] = useState('Remote');
  const [level, setLevel] = useState('Mid');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [scrapeStatus, setScrapeStatus] = useState(null);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    getScrapeStatus().then(r => setScrapeStatus(r.data)).catch(() => {});
  }, []);

  const handleFind = async () => {
    if (!resume.trim()) { setError('Please paste your resume to find matching jobs.'); return; }
    setLoading(true); setError(''); setJobs([]);
    try {
      const preferredRoles = roles.split(',').map(r => r.trim()).filter(Boolean);
      const res = await findJobs(resume, preferredRoles, location, level);
      setJobs(res.data.jobs || []);
      setSummary(res.data.search_summary || '');
    } catch (e) {
      setError('Job search failed. Make sure the backend is running and your API key is set.');
    } finally { setLoading(false); }
  };

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.platform === filter);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Job Finder</div>
        <div className="page-subtitle">AI matches your resume to jobs across LinkedIn, Indeed, Glassdoor, Naukri and more</div>
      </div>

      <div className="page-body">
        {scrapeStatus && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wifi size={14} /> Platform Status
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{scrapeStatus.total_jobs_indexed?.toLocaleString()} jobs indexed</div>
            </div>
            <div className="card-body" style={{ paddingTop: 16, paddingBottom: 16 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {scrapeStatus.platforms?.map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={`status-dot ${p.status === 'active' ? 'status-active' : ''}`} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{p.last_scraped}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><div className="card-title">Search Preferences</div></div>
          <div className="card-body">
            <div className="input-group">
              <label className="input-label">Your Resume *</label>
              <textarea placeholder="Paste your resume to get AI-matched job recommendations..." value={resume} onChange={e => setResume(e.target.value)} style={{ minHeight: 140 }} />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Preferred Roles (comma separated)</label>
                <input type="text" placeholder="e.g. React Developer, Frontend Engineer" value={roles} onChange={e => setRoles(e.target.value)} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Location</label>
                <input type="text" placeholder="e.g. Remote, Bangalore, Delhi" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Experience Level</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {LEVELS.map(l => (
                  <button key={l} className={`filter-chip ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>{l}</button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--red)', fontSize: 14, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <button className="btn btn-primary" onClick={handleFind} disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Finding jobs...</> : <><Search size={16} /> Find Matching Jobs</>}
            </button>
          </div>
        </div>

        {(jobs.length > 0 || loading) && (
          <div className="fade-in">
            {summary && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, padding: '10px 16px', background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                🔍 {summary}
              </div>
            )}

            <div className="filter-bar">
              <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 500 }}>Platform:</span>
              {PLATFORMS.map(p => (
                <button key={p} className={`filter-chip ${filter === p ? 'active' : ''}`} onClick={() => setFilter(p)}>
                  {p} {p !== 'All' && jobs.filter(j => j.platform === p).length > 0 && `(${jobs.filter(j => j.platform === p).length})`}
                </button>
              ))}
            </div>

            {loading && (
              <div className="loading-overlay">
                <div className="spinner" style={{ width: 28, height: 28 }} />
                <div>Searching across platforms...</div>
              </div>
            )}

            <div className="stack">
              {filtered.map((job, i) => (
                <div key={job.id || i} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <div className="job-title">{job.title}</div>
                      <div className="job-company">{job.company}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span className={`match-score-pill ${getScoreClass(job.match_score)}`}>
                        {job.match_score}% match
                      </span>
                      <span className={`platform-badge ${getPlatformClass(job.platform)}`}>{job.platform}</span>
                    </div>
                  </div>

                  <div className="job-meta">
                    {job.location && <span className="chip chip-muted" style={{ fontSize: 12 }}><MapPin size={10} />{job.location}</span>}
                    {job.job_type && <span className="chip chip-muted" style={{ fontSize: 12 }}>{job.job_type}</span>}
                    {job.salary_range && <span className="chip chip-muted" style={{ fontSize: 12 }}><DollarSign size={10} />{job.salary_range}</span>}
                    {job.posted_days_ago !== undefined && <span style={{ fontSize: 12, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{formatDaysAgo(job.posted_days_ago)}</span>}
                  </div>

                  {job.description_snippet && <div className="job-snippet">{job.description_snippet}</div>}

                  {job.required_skills?.length > 0 && (
                    <div className="chips" style={{ marginBottom: 12 }}>
                      {job.required_skills.slice(0, 5).map(s => <span key={s} className="chip chip-muted" style={{ fontSize: 11 }}>{s}</span>)}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    {job.apply_url && (
                      <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        <ExternalLink size={12} /> Apply Now
                      </a>
                    )}
                    <button className="btn btn-ghost btn-sm">Save Job</button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No jobs found for "{filter}"</div>
                <div className="text-sm text-muted" style={{ marginTop: 4 }}>Try selecting "All" platforms or adjust your preferences.</div>
              </div>
            )}
          </div>
        )}

        {jobs.length === 0 && !loading && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon"><Briefcase size={32} style={{ opacity: 0.3 }} /></div>
              <div className="empty-state-title">No jobs searched yet</div>
              <div className="text-sm text-muted" style={{ marginTop: 4 }}>Paste your resume above and click "Find Matching Jobs".</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
