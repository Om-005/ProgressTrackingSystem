import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const Button = React.forwardRef(({ 
  className, variant = 'primary', size = 'md', children, ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 focus:ring-offset-2 focus:ring-offset-[#060B18] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-white hover:brightness-110 shadow-lg shadow-[#00E5FF]/15",
    secondary: "bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] border border-white/[0.08]",
    outline: "border border-white/[0.1] bg-transparent hover:bg-white/[0.05] text-slate-200",
    ghost: "bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-white",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";
