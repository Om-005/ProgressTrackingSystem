import React from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { Lightbulb, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const InsightsCard = () => {
  const { insights } = useStudyData();

  const getIcon = (type) => {
    switch(type) {
        case 'positive': return <TrendingUp size={18} className="text-emerald-500" />;
        case 'tip': return <Lightbulb size={18} className="text-amber-500" />;
        case 'alert': return <AlertCircle size={18} className="text-rose-500" />;
        default: return <Info size={18} className="text-brand-500" />;
    }
  };

  const getBgStyle = (type) => {
      switch(type) {
        case 'positive': return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
        case 'tip': return 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
        case 'alert': return 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
        default: return 'bg-brand-50 dark:bg-brand-500/10 border-brand-100 dark:border-brand-500/20';
      }
  };

  return (
    <Card className="glass-panel h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl -ml-10 -mt-10" />
      <CardHeader className="pb-4 relative z-10 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-1">
          <Lightbulb size={18} />
          <span className="font-semibold text-xs tracking-wide uppercase">AI Assistant</span>
        </div>
        <CardTitle className="text-xl">Smart Insights</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pt-4 relative z-10 space-y-3 pr-2">
        <AnimatePresence>
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-xl border ${getBgStyle(insight.type)}`}
            >
              <div className="mt-0.5 shadow-sm rounded-full bg-white dark:bg-slate-900 p-1.5 flex-shrink-0">
                  {getIcon(insight.type)}
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                {insight.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {insights.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 h-full opacity-60">
                <Lightbulb size={32} className="mb-2" />
                <p className="text-sm">More data needed for insights.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
};
