import React, { useState } from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { Input } from './Input';
import { Trophy, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STYLES = `
  .sf-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-weight: 800; }
  .sf-mono    { font-family: 'Inter', sans-serif; font-variant-numeric: tabular-nums; }
`;

const DOT_COLORS = {
  'dsa': '#10B981',
  'development': '#00E5FF',
  'cs-core': '#7B61FF',
  'ai-ml': '#F43F5E',
  'learning': '#FF9500',
};

export const AddEntryDrawer = ({ isOpen, onClose }) => {
  const { addLog, stats, goal, CATEGORIES } = useStudyData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'development',
    hours: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hours || isNaN(formData.hours) || formData.hours <= 0) return;
    
    setIsSubmitting(true);
    
    const numHours = parseFloat(formData.hours);
    await addLog({
       ...formData,
       hours: numHours
    });
    
    setIsSubmitting(false);

    if (stats.todayHours < goal && (stats.todayHours + numHours) >= goal) {
        setShowCelebration(true);
        setTimeout(() => {
            setShowCelebration(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                category: 'development',
                hours: '',
                notes: ''
            });
            onClose();
        }, 2000);
    } else {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            category: 'development',
            hours: '',
            notes: ''
        });
        onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const progress = Math.min(((stats?.todayHours || 0) / goal) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{STYLES}</style>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 right-0 w-full max-w-md shadow-2xl z-50 overflow-y-auto"
            style={{ background: '#060B18', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="sf-mono" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,229,255,0.6)', marginBottom: 4 }}>
                    NEW SESSION
                  </div>
                  <h2 className="sf-display text-white text-2xl font-bold tracking-tight">Add Entry</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="rounded-full h-10 w-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Celebration */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 rounded-xl p-5 text-white shadow-lg flex items-center gap-4"
                    style={{ background: 'linear-gradient(135deg, #00D68F, #00E5FF)', boxShadow: '0 4px 30px rgba(0,214,143,0.3)' }}
                  >
                    <div className="bg-white/20 p-2 rounded-full">
                      <Trophy size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold sf-display">Daily Goal Hit! 🎉</h3>
                      <p className="text-sm opacity-90">Outstanding work today.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-6 flex-1">
                  
                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-300">Category</label>
                    <div className="flex flex-wrap gap-2">
                       {CATEGORIES.map(cat => {
                         const color = DOT_COLORS[cat.id] || '#6366f1';
                         const isActive = formData.category === cat.id;
                         return (
                           <button
                             type="button"
                             key={cat.id}
                             onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                             className="px-3 py-1.5 rounded-full text-xs font-bold transition-all sf-mono tracking-wider"
                             style={isActive 
                               ? { background: `${color}22`, color: color, border: `1px solid ${color}55`, boxShadow: `0 0 12px ${color}20` }
                               : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }
                             }
                           >
                             {cat.name.toUpperCase()}
                           </button>
                         );
                       })}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#00E5FF]/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-[#00E5FF]/20"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  {/* Hours */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Hours Studied</label>
                    <input 
                      type="number" 
                      step="0.5"
                      min="0.5"
                      max="24"
                      name="hours"
                      placeholder="e.g. 2.5"
                      value={formData.hours}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#00E5FF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-[#00E5FF]/20"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">What did you learn? (Optional)</label>
                    <textarea 
                      name="notes"
                      placeholder="Note down key takeaways..."
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full min-h-[100px] h-24 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#00E5FF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-[#00E5FF]/20 resize-none"
                    />
                  </div>

                  {/* Goal Progress */}
                  <div 
                    className="rounded-xl p-4"
                    style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.1)' }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-300">Goal Progress</span>
                      <span className="sf-mono text-[#00E5FF]" style={{ fontSize: 12 }}>{stats?.todayHours || 0} / {goal} hrs</span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00E5FF, #7B61FF)' }} />
                    </div>
                  </div>

                </div>

                {/* Submit */}
                <div className="pt-6 mt-6 border-t border-white/[0.06]">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full relative group flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #00E5FF, #7B61FF)', boxShadow: '0 4px 20px rgba(0,229,255,0.2)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    {isSubmitting ? 'Saving...' : (
                      <span className="flex items-center justify-center">
                        <CheckCircle2 size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                        Save Entry
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
