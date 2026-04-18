import React from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { Activity, Target, Clock, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const WeeklySummaryCard = () => {
  const { stats } = useStudyData();
  const summary = stats?.weeklySummary;

  return (
    <Card className="glass-panel overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-1">
          <Activity size={18} />
          <span className="font-semibold text-xs tracking-wide uppercase">Performance</span>
        </div>
        <CardTitle className="text-xl">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1.5">
              <Clock size={14} className="mr-1.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Hours</span>
            </div>
            <p className="text-xl font-bold">{summary?.hours.toFixed(1) || 0}h</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1.5">
              <Target size={14} className="mr-1.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Focus</span>
            </div>
            <p className="text-sm font-bold truncate" title={summary?.mostFocused}>{summary?.mostFocused || 'None'}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 p-0.5 rounded-xl">
          <div className="bg-white dark:bg-slate-900 rounded-[10px] p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Task Completion</p>
              <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">
                {summary?.completionRate || 0}%
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
              <Zap size={20} className="text-brand-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
