import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../utils/helpers';

export const StatCard = ({ title, value, icon, trend, trendValue, className }) => {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          {icon && <div className="h-4 w-4 text-slate-400 dark:text-slate-500">{icon}</div>}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <p className={cn(
              "text-xs mt-1",
              trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-red-500" : "text-slate-500"
            )}>
              {trendValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
