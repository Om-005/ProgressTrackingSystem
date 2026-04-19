import React from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { Activity, Target, Clock, Zap } from 'lucide-react';

export const WeeklySummaryCard = () => {
  const { stats } = useStudyData();
  const summary = stats?.weeklySummary;

  return (
    <div 
      className="rounded-2xl overflow-hidden relative h-full flex flex-col"
      style={{ background: 'rgba(8,14,30,0.72)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)' }}
    >
      {/* Decorative orb */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 text-[#7B61FF] mb-1">
          <Activity size={16} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Performance</span>
        </div>
        <h3 className="text-white text-lg font-bold mb-5" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800 }}>Weekly Summary</h3>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center text-slate-500 mb-1.5">
              <Clock size={13} className="mr-1.5" style={{ color: '#00E5FF' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Hours</span>
            </div>
            <p className="text-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{summary?.hours?.toFixed(1) || 0}<span style={{ fontSize: 12, opacity: 0.5 }}>h</span></p>
          </div>
          
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center text-slate-500 mb-1.5">
              <Target size={13} className="mr-1.5" style={{ color: '#7B61FF' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Focus</span>
            </div>
            <p className="text-white text-sm font-bold truncate" title={summary?.mostFocused}>{summary?.mostFocused || 'None'}</p>
          </div>
        </div>

        {/* Completion rate */}
        <div 
          className="rounded-xl p-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(123,97,255,0.08) 100%)', border: '1px solid rgba(0,229,255,0.12)' }}
        >
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.6)', marginBottom: 4 }}>Task Completion</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #00E5FF, #7B61FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {summary?.completionRate || 0}%
            </p>
          </div>
          <div className="h-11 w-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.15)' }}>
            <Zap size={20} className="text-[#00E5FF]" />
          </div>
        </div>
      </div>
    </div>
  );
};
