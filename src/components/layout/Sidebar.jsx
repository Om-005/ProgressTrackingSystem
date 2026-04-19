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
      "w-64 flex flex-col h-full border-r border-white/[0.06]",
      className
    )} style={{ background: 'rgba(8,14,30,0.92)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
        <BookOpen className="text-[#00E5FF] mr-2.5" size={24} />
        <span 
          className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00E5FF] to-[#7B61FF]"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800 }}
        >
          StudyFlow
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group",
              isActive 
                ? "text-[#00E5FF] shadow-sm" 
                : "text-slate-400 hover:text-slate-200 hover:pl-4"
            )}
            style={({ isActive }) => isActive ? {
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.15)',
              boxShadow: '0 0 20px rgba(0,229,255,0.05)',
            } : { border: '1px solid transparent' }}
          >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">{link.icon}</span>
            <span className="ml-3">{link.label}</span>
          </NavLink>
        ))}

        {/* Add Entry Button */}
        <div className="pt-4 mt-4 border-t border-white/[0.06]">
          <button
            onClick={onAddClick}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #00E5FF, #7B61FF)',
              boxShadow: '0 4px 20px rgba(0,229,255,0.2)',
            }}
          >
            <PlusCircle size={20} className="mr-2" />
            Add Entry
          </button>
        </div>
      </nav>
      
      {/* Daily Goal Progress */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.08)' }}>
          <div className="flex justify-between items-center mb-2">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)' }}>
              Daily Goal
            </p>
            <p className="text-xs font-bold text-[#00E5FF]" style={{ fontFamily: "'Inter', sans-serif", fontVariantNumeric: 'tabular-nums' }}>
              {progress >= 100 ? '✓' : `${Math.round(progress)}%`}
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div 
              className="h-full rounded-full transition-all duration-700" 
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00E5FF, #7B61FF)',
              }} 
            />
          </div>
          <p className="text-xs mt-2 text-right" style={{ fontFamily: "'Inter', sans-serif", fontVariantNumeric: 'tabular-nums', color: 'rgba(148,163,184,0.5)' }}>
            {stats?.todayHours || 0} / {goal} hrs
          </p>
        </div>
      </div>
    </aside>
  );
};
