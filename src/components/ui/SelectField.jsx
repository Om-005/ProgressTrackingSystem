import React from 'react';
import { cn } from '../../utils/helpers';

export const SelectField = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-brand-500",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
SelectField.displayName = "SelectField";
