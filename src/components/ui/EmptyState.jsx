import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-10 text-center rounded-2xl min-h-[300px] border border-dashed border-white/10"
      style={{ background: 'rgba(8,14,30,0.4)' }}
    >
      <div className="h-20 w-20 bg-[#00E5FF]/10 text-[#00E5FF] rounded-full flex items-center justify-center mb-6 border border-[#00E5FF]/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2 text-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800 }}>
        {title}
      </h3>
      <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
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
