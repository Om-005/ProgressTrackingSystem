import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, List, PlusCircle, BookOpen } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useStudyData } from '../../contexts/StudyDataContext';

export const Sidebar = ({ className, onClose, onAddClick }) => {
  const { stats, goal } = useStudyData();
  const progress = Math.min(((stats?.todayHours || 0) / goal) * 100, 100);

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/analytics', icon: <PieChart size={20} />, label: 'Analytics' },
    { to: '/logs', icon: <List size={20} />, label: 'Activity Logs' },
  ];

  return (
    <aside className={cn(
      "w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col h-full",
      className
    )}>
      <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <BookOpen className="text-brand-500 mr-2" size={24} />
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-400">StudyFlow</span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
              isActive 
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50 hover:pl-4"
            )}
          >
            {link.icon}
            <span className="ml-3">{link.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={onAddClick}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle size={20} className="mr-2" />
            Add Entry
          </button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Daily Goal Progress</p>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-400 to-accent-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs font-medium mt-2 text-right text-slate-700 dark:text-slate-300">
            {stats?.todayHours || 0} / {goal} hrs
          </p>
        </div>
      </div>
    </aside>
  );
};
