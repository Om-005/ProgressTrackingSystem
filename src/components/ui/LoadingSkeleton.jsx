import React from 'react';
import { cn } from '../../utils/helpers';

export const LoadingSkeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800", className)}
      {...props}
    />
  );
};
