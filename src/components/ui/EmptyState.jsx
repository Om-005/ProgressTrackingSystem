import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-10 text-center glass-panel rounded-2xl min-h-[300px] border border-dashed border-slate-300 dark:border-slate-700"
    >
      <div className="h-20 w-20 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-brand-100 dark:border-brand-500/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
            {action}
        </div>
      )}
    </motion.div>
  );
};
