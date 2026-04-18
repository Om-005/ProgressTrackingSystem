import React, { useMemo } from 'react';
import { Clock, Flame, Activity, LayoutDashboard } from 'lucide-react';
import { useStudyData } from '../contexts/StudyDataContext';
import { StatCard } from '../components/ui/StatCard';
import { ChartWrapper } from '../components/charts/ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { TasksWidget } from '../components/dashboard/TasksWidget';
import { WeeklySummaryCard } from '../components/dashboard/WeeklySummaryCard';
import { InsightsCard } from '../components/dashboard/InsightsCard';
import { EmptyState } from '../components/ui/EmptyState';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { logs, stats, loading, CATEGORIES } = useStudyData();

  const weeklyChartData = useMemo(() => {
      const weekDataMap = {};
      for(let i=6; i>=0; i--) {
         const d = new Date();
         d.setDate(d.getDate() - i);
         weekDataMap[d.toISOString().split('T')[0]] = 0;
      }
      
      logs.forEach(log => {
          if(weekDataMap[log.date] !== undefined) {
              weekDataMap[log.date] += parseFloat(log.hours);
          }
      });
      
      return Object.entries(weekDataMap).map(([date, hours]) => {
          const d = new Date(date);
          return {
              name: d.toLocaleDateString('en-US', { weekday: 'short' }),
              hours
          }
      });
  }, [logs]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LoadingSkeleton className="h-32" />
          <LoadingSkeleton className="h-32" />
          <LoadingSkeleton className="h-32" />
          <LoadingSkeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LoadingSkeleton className="h-[400px] lg:col-span-2" />
            <LoadingSkeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* Motivation Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-brand-500/20">
         <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
             <LayoutDashboard size={200} />
         </div>
         <div className="relative z-10 max-w-2xl">
             <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Welcome back to StudyFlow.</h1>
             <p className="text-brand-100 text-lg opacity-90">
                You're on a <span className="font-bold text-white">{stats.currentStreak} day streak</span>. Keep pushing forward!
             </p>
         </div>
      </motion.div>

      {/* Top Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Hours" 
          value={`${stats.totalHours.toFixed(1)}h`}
          icon={<Clock className="text-brand-500" />}
          trend="up"
          trendValue="+All Time"
          className="glass-panel border-0"
        />
        <StatCard 
          title="Hours Today" 
          value={`${stats.todayHours.toFixed(1)}h`}
          icon={<Activity className="text-accent-500" />}
          trend={stats.todayHours > 0 ? 'up' : 'neutral'}
          trendValue={stats.todayHours > 0 ? "You're active today!" : "Start studying!"}
          className="glass-panel border-0"
        />
        <StatCard 
          title="Current Streak" 
          value={`${stats.currentStreak} days`}
          icon={<Flame className={stats.currentStreak > 0 ? "text-orange-500" : "text-slate-400"} />}
          trend={stats.currentStreak > 2 ? 'up' : 'neutral'}
          trendValue={stats.currentStreak > 2 ? "You're on fire! 🔥" : "Keep it going"}
          className="glass-panel border-0"
        />
        <StatCard 
          title="Best Streak" 
          value={`${stats.bestStreak} days`}
          icon={<Flame className="text-rose-500" />}
          trend="neutral"
          trendValue="Your personal best"
          className="glass-panel border-0"
        />
      </motion.div>

      {/* Middle Grid - Widgets */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1 h-[320px]">
            <TasksWidget />
         </div>
         <div className="lg:col-span-1 h-[320px]">
            <WeeklySummaryCard />
         </div>
         <div className="lg:col-span-1 h-[320px]">
            <InsightsCard />
         </div>
      </motion.div>

      {/* Bottom Grid - Charts & Activities */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartWrapper title="Activity Timeline" className="lg:col-span-2 glass-panel border-0 shadow-md">
          {weeklyChartData.every(d => d.hours === 0) ? (
             <EmptyState 
                icon={<Activity size={32} />}
                title="No recent activity"
                description="Start logging your study hours to see your timeline build up over the week."
             />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--tw-prose-invert, #1e293b)', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="hours" radius={[6, 6, 6, 6]} maxBarSize={40}>
                    {weeklyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours > 0 ? 'url(#colorHours)' : '#e2e8f0'} className="dark:fill-slate-800" />
                    ))}
                </Bar>
                <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>
                </BarChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>

        <Card className="glass-panel border-0 shadow-md h-full flex flex-col">
          <CardHeader className="pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {logs.slice(0, 5).map(log => {
                const categoryInfo = CATEGORIES.find(c => c.id === log.category) || CATEGORIES[1];
                return (
                  <div key={log.id} className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0 group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryInfo.color}`}>
                              {categoryInfo.name}
                          </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{log.date} • {log.notes || 'No notes'}</p>
                    </div>
                    <div className="font-semibold text-sm bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-lg group-hover:scale-110 transition-transform">
                      {log.hours}h
                    </div>
                  </div>
                )
              })}
              {logs.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No activity yet. Let's change that!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
