export const getScoreColor = (score) => {
  if (score >= 75) return 'var(--green)';
  if (score >= 50) return 'var(--amber)';
  return 'var(--red)';
};

export const getScoreClass = (score) => {
  if (score >= 75) return 'score-high';
  if (score >= 50) return 'score-mid';
  return 'score-low';
};

export const getPlatformClass = (platform) => {
  const map = {
    'LinkedIn': 'platform-linkedin',
    'Indeed': 'platform-indeed',
    'Glassdoor': 'platform-glassdoor',
    'Naukri': 'platform-naukri',
    'AngelList': 'platform-angellist',
  };
  return map[platform] || 'chip-muted';
};

export const copyToClipboard = async (text) => {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
};

export const formatDaysAgo = (days) => {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};
