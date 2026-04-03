import React from 'react';
import { cn } from '../../utils/helpers';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:focus:ring-brand-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
