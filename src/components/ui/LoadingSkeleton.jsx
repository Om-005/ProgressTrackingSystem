import React from 'react';
import { cn } from '../../utils/helpers';

export const LoadingSkeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-xl", className)}
      style={{ background: 'rgba(255,255,255,0.04)' }}
      {...props}
    />
  );
};
