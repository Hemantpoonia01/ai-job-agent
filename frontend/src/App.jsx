import { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import JDAnalyzer from './pages/JDAnalyzer';
import ResumeOptimizer from './pages/ResumeOptimizer';
import CoverLetter from './pages/CoverLetter';
import JobFinder from './pages/JobFinder';

const PAGES = {
  dashboard: Dashboard,
  analyzer: JDAnalyzer,
  optimizer: ResumeOptimizer,
  'cover-letter': CoverLetter,
  jobs: JobFinder,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const PageComponent = PAGES[page] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="main-content">
        <PageComponent onNavigate={setPage} />
      </main>
    </div>
  );
}
