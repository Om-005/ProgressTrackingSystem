import React from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { Lightbulb, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InsightsCard = () => {
  const { insights } = useStudyData();

  const getIcon = (type) => {
    switch(type) {
      case 'positive': return <TrendingUp size={16} className="text-[#00D68F]" />;
      case 'tip': return <Lightbulb size={16} className="text-[#FF9500]" />;
      case 'alert': return <AlertCircle size={16} className="text-[#F43F5E]" />;
      default: return <Info size={16} className="text-[#00E5FF]" />;
    }
  };

  const getBorderColor = (type) => {
    switch(type) {
      case 'positive': return 'rgba(0,214,143,0.25)';
      case 'tip': return 'rgba(255,149,0,0.25)';
      case 'alert': return 'rgba(244,63,94,0.25)';
      default: return 'rgba(0,229,255,0.25)';
    }
  };

  const getBg = (type) => {
    switch(type) {
      case 'positive': return 'rgba(0,214,143,0.06)';
      case 'tip': return 'rgba(255,149,0,0.06)';
      case 'alert': return 'rgba(244,63,94,0.06)';
      default: return 'rgba(0,229,255,0.06)';
    }
  };

  return (
    <div 
      className="h-full flex flex-col rounded-2xl relative overflow-hidden"
      style={{ background: 'rgba(8,14,30,0.72)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)' }}
    >
      {/* Decorative orb */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,149,0,0.08) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      
      {/* Header */}
      <div className="p-6 pb-4 relative z-10 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 text-[#FF9500] mb-1">
          <Lightbulb size={16} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Assistant</span>
        </div>
        <h3 className="text-white text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800 }}>Smart Insights</h3>
      </div>
      
      {/* Insights list */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 relative z-10 space-y-3 pr-4">
        <AnimatePresence>
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ 
                background: getBg(insight.type), 
                borderLeft: `2px solid ${getBorderColor(insight.type)}`,
                border: `1px solid ${getBorderColor(insight.type)}20`,
                borderLeftWidth: 3,
                borderLeftColor: getBorderColor(insight.type),
              }}
            >
              <div className="mt-0.5 flex-shrink-0 rounded-full p-1.5" style={{ background: 'rgba(8,14,30,0.8)' }}>
                {getIcon(insight.type)}
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-300">
                {insight.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {insights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 h-full opacity-40">
            <Lightbulb size={32} className="mb-2 text-[#FF9500]" />
            <p className="text-sm text-slate-500" style={{ fontSize: 12 }}>More data needed for insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};
