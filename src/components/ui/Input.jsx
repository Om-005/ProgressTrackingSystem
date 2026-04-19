import React from 'react';
import { cn } from '../../utils/helpers';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/20 focus:border-[#00E5FF]/40 hover:border-white/[0.15] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      style={{ colorScheme: 'dark' }}
      {...props}
    />
  );
});
Input.displayName = "Input";
