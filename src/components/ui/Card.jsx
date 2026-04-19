import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "rounded-xl border overflow-hidden",
        "bg-[rgba(8,14,30,0.72)] border-white/[0.07] backdrop-blur-[28px] shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>{children}</div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)} {...props}>{children}</h3>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>
);
