import React from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { ChartWrapper } from '../components/charts/ChartWrapper';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { PieChart as PieChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const CAT_COLORS = {
  'dsa': '#10b981', // emerald
  'development': '#3b82f6', // blue
  'cs-core': '#a855f7', // purple
  'ai-ml': '#f43f5e', // rose
  'learning': '#f59e0b', // amber
};

export const Analytics = () => {
  const { logs, loading, CATEGORIES } = useStudyData();

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton className="h-96" />
          <LoadingSkeleton className="h-96" />
        </div>
      </div>
    );
  }

  const categoryMap = {};
  logs.forEach(log => {
    categoryMap[log.category] = (categoryMap[log.category] || 0) + parseFloat(log.hours);
  });
  
  const pieData = Object.entries(categoryMap).map(([catId, value]) => {
      const cat = CATEGORIES.find(c => c.id === catId);
      return { 
          name: cat ? cat.name : catId, 
          value,
          fill: CAT_COLORS[catId] || '#6366f1'
      };
  });

  const dateMap = {};
  logs.forEach(log => {
      dateMap[log.date] = (dateMap[log.date] || 0) + parseFloat(log.hours);
  });
  
  const areaData = Object.entries(dateMap)
    .sort((a,b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, hours]) => {
      const d = new Date(date);
      return {
        date: `${d.getMonth()+1}/${d.getDate()}`,
        hours
      };
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
    
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your study metrics and performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="h-full flex flex-col">
            <ChartWrapper title="Category Distribution" className="glass-panel border-0 shadow-md h-full flex flex-col">
            {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-sm hover:opacity-80 transition-opacity" />
                    ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--tw-prose-invert, #1e293b)', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <EmptyState icon={<PieChartIcon size={24} />} title="No Category Data" description="Log hours to see your distribution." />
            )}
            </ChartWrapper>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full flex flex-col">
            <ChartWrapper title="Focus Trends" className="glass-panel border-0 shadow-md h-full flex flex-col">
            {areaData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorHoursTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--tw-prose-invert, #1e293b)', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorHoursTrend)" activeDot={{r: 6, strokeWidth: 0, fill: '#4f46e5'}} />
                </AreaChart>
                </ResponsiveContainer>
            ) : (
                <EmptyState icon={<PieChartIcon size={24} />} title="No Trend Data" description="Log hours over multiple days to see trends." />
            )}
            </ChartWrapper>
        </motion.div>
      </div>
    </motion.div>
  );
};
