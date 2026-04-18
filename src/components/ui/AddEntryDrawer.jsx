import React, { useState } from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { Card, CardContent } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Trophy, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Close drawer if celebration completes or just let user manually close it? 
  // Based on requirement: "add a satisfying Success animation upon submission"
  
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-background-light dark:bg-background-dark shadow-2xl z-50 overflow-y-auto border-l border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Add Entry</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Log your focus session</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-10 w-10 p-0 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <X size={20} />
                </Button>
              </div>

              <AnimatePresence>
                {showCelebration && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl p-5 text-white shadow-lg flex items-center gap-4"
                  >
                    <div className="bg-white/20 p-2 rounded-full">
                      <Trophy size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Daily Goal Hit! 🎉</h3>
                      <p className="text-sm opacity-90">Outstanding work today.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-6 flex-1">
                  
                  {/* Category Selection (Pills) */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                       {CATEGORIES.map(cat => (
                           <button
                             type="button"
                             key={cat.id}
                             onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                             className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                 formData.category === cat.id 
                                 ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 scale-105' 
                                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                             }`}
                           >
                              {cat.name}
                           </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hours Studied</label>
                    <Input 
                      type="number" 
                      step="0.5"
                      min="0.5"
                      max="24"
                      name="hours"
                      placeholder="e.g. 2.5"
                      value={formData.hours}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">What did you learn? (Optional)</label>
                    <textarea 
                      name="notes"
                      placeholder="Note down key takeaways..."
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full flex min-h-[100px] h-24 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
                    />
                  </div>

                  <div className="glass-panel p-4 rounded-xl">
                     <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Goal Progress</span>
                        <span className="text-slate-500 dark:text-slate-400">{stats?.todayHours || 0} / {goal} hrs</span>
                     </div>
                     <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-brand-400 to-accent-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                     </div>
                  </div>

                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                  <Button type="submit" className="w-full relative group overflow-hidden" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (
                       <span className="flex items-center justify-center">
                         <CheckCircle2 size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                         Save Entry
                       </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
