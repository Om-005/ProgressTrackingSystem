import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const ChartWrapper = ({ title, children, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80 w-full min-h-[300px]">
        {children}
      </CardContent>
    </Card>
  );
};
