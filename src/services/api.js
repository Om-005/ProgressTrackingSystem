// Using fetch for the real API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://progresstrackingsystem.onrender.com';

export const CATEGORIES = [
  { id: 'dsa', name: 'DSA', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { id: 'development', name: 'Development', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'cs-core', name: 'CS Core', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { id: 'ai-ml', name: 'AI/ML', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  { id: 'learning', name: 'Learning', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
];

const getToken = () => localStorage.getItem('token');

const request = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}/api${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
        // Handle unauthorized (maybe clear local storage and reload, or handled by context)
        // localStorage.removeItem('token');
        // window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'API Request failed');
  }

  return response.json();
};

export const api = {
  getLogs: () => request('/logs'),
  
  addLog: (log) => request('/logs', {
    method: 'POST',
    body: JSON.stringify(log),
  }),

  getTasks: () => request('/tasks'),

  addTask: (task) => request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),

  toggleTask: (id) => request(`/tasks/${id}/toggle`, {
    method: 'PATCH',
  }),
  
  getStats: () => request('/tasks/stats'),

  getInsights: async () => {
    // Generate some simple insights based on real stats
    try {
        const stats = await request('/tasks/stats');
        const insights = [];
        if (stats.currentStreak >= 3) {
            insights.push({ id: 1, text: `You're on a ${stats.currentStreak} day streak! Keep it up!`, type: 'positive' });
        }
        if (stats.weeklySummary.mostFocused !== 'None') {
            insights.push({ id: 2, text: `${stats.weeklySummary.mostFocused} seems to be your primary focus right now.`, type: 'neutral' });
        }
        insights.push({ id: 3, text: "Try scheduling your study sessions in the morning for better focus.", type: 'tip' });
        
        if (insights.length === 0) {
             insights.push({ id: 0, text: "Log some study sessions to get insights on your learning habit.", type: 'tip' });
        }
        return insights;
    } catch {
       return [ { id: 1, text: "Log some study sessions to get insights.", type: 'tip' } ];
    }
  }
};
