import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyData } from '../contexts/StudyDataContext';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SelectField } from '../components/ui/SelectField';
import { Button } from '../components/ui/Button';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECTS = ['React', 'DSA', 'Tailwind', 'Python', 'System Design', 'Other'];

export const AddEntry = () => {
  const navigate = useNavigate();
  const { addLog, stats, goal } = useStudyData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: 'React',
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
            navigate('/logs');
        }, 3000);
    } else {
        navigate('/logs');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const progress = Math.min(((stats?.todayHours || 0) / goal) * 100, 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Study Entry</h1>
        <p className="text-slate-500 mt-1">Log your hours to keep the streak alive.</p>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl p-6 text-white shadow-lg flex items-center gap-4"
          >
            <div className="bg-white/20 p-3 rounded-full">
              <Trophy size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Goal Achieved! 🎉</h3>
              <p className="text-emerald-50 opacity-90">Outstanding work! You've hit your daily study goal.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="text-sm font-medium">Subject</label>
                <SelectField 
                   name="subject"
                   value={formData.subject}
                   onChange={handleChange}
                >
                   {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </SelectField>
              </div>
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
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Input 
                type="text" 
                name="notes"
                placeholder="What did you learn?"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
               <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Daily Goal Progress</span>
                  <span className="text-slate-500">{stats?.todayHours || 0} / {goal} hrs</span>
               </div>
               <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
               </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (
                 <>
                   <CheckCircle2 size={18} className="mr-2" />
                   Save Entry
                 </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
