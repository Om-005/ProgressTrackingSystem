import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const ChartWrapper = ({ title, children, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)' }}>
            Analytics
          </span>
        </div>
        <CardTitle style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 700 }}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80 w-full min-h-[300px]">
        {children}
      </CardContent>
    </Card>
  );
};
