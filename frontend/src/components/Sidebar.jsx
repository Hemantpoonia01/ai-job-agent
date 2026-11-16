import { LayoutDashboard, FileSearch, FileText, Mail, Briefcase, Settings, Zap } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'analyzer', icon: FileSearch, label: 'JD Analyzer' },
  { id: 'optimizer', icon: FileText, label: 'Resume Optimizer' },
  { id: 'cover-letter', icon: Mail, label: 'Cover Letter' },
  { id: 'jobs', icon: Briefcase, label: 'Find Jobs', badge: 'NEW' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">🤖</div>
          <div>
            <div className="logo-text">AI Job Agent</div>
            <div className="logo-sub">Smart Applications</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Main</div>
        {navItems.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon className="nav-icon" />
            {label}
            {badge && <span className="nav-badge">{badge}</span>}
          </button>
        ))}

        <div className="nav-label">System</div>
        <button className="nav-item">
          <Settings className="nav-icon" />
          Settings
        </button>
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(124,111,247,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(124,111,247,0.15)' }}>
          <Zap size={14} color="var(--accent2)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent2)' }}>AI Powered</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Claude API</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
