import { FileSearch, FileText, Mail, Briefcase, TrendingUp, Clock, CheckCircle, Target } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const stats = [
    { icon: FileSearch, label: 'Analyses Run', value: '0', color: 'var(--accent)', bg: 'rgba(124,111,247,0.12)' },
    { icon: Target, label: 'Avg Match Score', value: '—', color: 'var(--cyan)', bg: 'rgba(34,211,238,0.1)' },
    { icon: Mail, label: 'Cover Letters', value: '0', color: 'var(--green)', bg: 'var(--green-dim)' },
    { icon: Briefcase, label: 'Jobs Found', value: '0', color: 'var(--amber)', bg: 'var(--amber-dim)' },
  ];

  const quickActions = [
    { id: 'analyzer', icon: FileSearch, title: 'Analyze JD Match', desc: 'Upload your resume and paste a job description to get an instant match score.', color: 'var(--accent)' },
    { id: 'optimizer', icon: FileText, title: 'Optimize Resume', desc: 'Let AI rewrite your resume to beat ATS filters for a specific job.', color: 'var(--cyan)' },
    { id: 'cover-letter', icon: Mail, title: 'Generate Cover Letter', desc: 'Get a personalized, compelling cover letter in seconds.', color: 'var(--green)' },
    { id: 'jobs', icon: Briefcase, title: 'Find Matching Jobs', desc: 'Discover jobs across LinkedIn, Indeed, Glassdoor, Naukri and more.', color: 'var(--amber)' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">Your intelligent job application hub</div>
      </div>

      <div className="page-body">
        <div className="hero" style={{ marginBottom: 28 }}>
          <div className="hero-title">Welcome to AI Job Agent 🚀</div>
          <div className="hero-subtitle">
            Paste your resume once, then let AI analyze job descriptions, optimize your applications, generate cover letters, and find matching jobs across multiple platforms — all in one place.
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('analyzer')}>
              <FileSearch size={16} /> Start Analyzing
            </button>
            <button className="btn btn-ghost" onClick={() => onNavigate('jobs')}>
              <Briefcase size={16} /> Browse Jobs
            </button>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: 28, gridTemplateColumns: 'repeat(4,1fr)' }}>
          {stats.map(({ icon: Icon, label, value, color, bg }) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon" style={{ background: bg }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>Quick Actions</div>
        </div>

        <div className="grid-2" style={{ marginBottom: 28 }}>
          {quickActions.map(({ id, icon: Icon, title, desc, color }) => (
            <div
              key={id}
              className="card"
              style={{ cursor: 'pointer', transition: 'all 0.25s', padding: 0 }}
              onClick={() => onNavigate(id)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
            >
              <div className="card-body" style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={15} /> Recent Activity
            </div>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No activity yet</div>
            <div className="text-sm text-muted" style={{ marginTop: 4 }}>Start by analyzing a job description or finding matching jobs.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
