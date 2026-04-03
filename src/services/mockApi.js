export const CATEGORIES = [
  { id: 'dsa', name: 'DSA', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { id: 'development', name: 'Development', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'cs-core', name: 'CS Core', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { id: 'ai-ml', name: 'AI/ML', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  { id: 'learning', name: 'Learning', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
];

const INITIAL_DATA = [
  { id: '1', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], category: 'development', hours: 3, notes: 'Studied React hooks' },
  { id: '2', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], category: 'dsa', hours: 2, notes: 'Arrays and Strings' },
  { id: '3', date: new Date().toISOString().split('T')[0], category: 'development', hours: 4, notes: 'Tailwind CSS grid' },
];

const INITIAL_TASKS = [
  { id: 't1', title: 'Complete LeetCode Daily', date: new Date().toISOString().split('T')[0], completed: false },
  { id: 't2', title: 'Read System Design chapter', date: new Date().toISOString().split('T')[0], completed: true },
];

let logs = [...INITIAL_DATA];
let tasks = [...INITIAL_TASKS];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getLogs: async () => {
    await delay(300);
    return [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  
  addLog: async (log) => {
    await delay(300);
    const newLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
    };
    logs.push(newLog);
    return newLog;
  },

  getTasks: async () => {
    await delay(200);
    return [...tasks];
  },

  addTask: async (task) => {
    await delay(200);
    const newTask = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      completed: false
    };
    tasks.push(newTask);
    return newTask;
  },

  toggleTask: async (id) => {
    await delay(200);
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    return tasks;
  },
  
  getStats: async () => {
    await delay(300);
    const totalHours = logs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
    
    const today = new Date().toISOString().split('T')[0];
    const todayHours = logs
      .filter(log => log.date === today)
      .reduce((sum, log) => sum + parseFloat(log.hours), 0);
      
    const uniqueDates = [...new Set(logs.map(log => log.date))].sort((a, b) => new Date(b) - new Date(a));
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0) {
            tempStreak = 1;
        } else {
            const diff = (new Date(uniqueDates[i - 1]) - new Date(uniqueDates[i])) / 86400000;
            if (diff === 1) {
                tempStreak++;
            } else {
                if (tempStreak > bestStreak) bestStreak = tempStreak;
                tempStreak = 1;
            }
        }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;

    let currentDate = new Date();
    if (!uniqueDates.includes(today)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dateStr)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyLogs = logs.filter(log => new Date(log.date) >= oneWeekAgo);
    const weeklyHours = weeklyLogs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
    
    const catHours = {};
    weeklyLogs.forEach(log => {
      catHours[log.category] = (catHours[log.category] || 0) + parseFloat(log.hours);
    });
    
    let mostFocusedCategory = 'None';
    let maxCatHours = 0;
    Object.entries(catHours).forEach(([cat, hours]) => {
      if (hours > maxCatHours) {
        maxCatHours = hours;
        mostFocusedCategory = CATEGORIES.find(c => c.id === cat)?.name || cat;
      }
    });

    const completionRate = tasks.length > 0 
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        : 0;

    return { 
      totalHours, 
      todayHours, 
      currentStreak, 
      bestStreak,
      weeklySummary: {
          hours: weeklyHours,
          mostFocused: mostFocusedCategory,
          completionRate
      }
    };
  },

  getInsights: async () => {
     await delay(200);
     return [
         { id: 1, text: "You've been incredibly consistent this week. Keep the momentum!", type: 'positive' },
         { id: 2, text: "Development seems to be your primary focus right now.", type: 'neutral' },
         { id: 3, text: "Try scheduling your study sessions in the morning for better focus.", type: 'tip' }
     ];
  }
};
