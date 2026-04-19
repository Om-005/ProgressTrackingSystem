import React from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { ChartWrapper } from '../components/charts/ChartWrapper';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { PieChart as PieChartIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const STYLES = `
  .sf-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-weight: 800; }
  .sf-mono    { font-family: 'Inter', sans-serif; font-variant-numeric: tabular-nums; }
`;

const CAT_COLORS = {
  'dsa': '#10b981',
  'development': '#00E5FF',
  'cs-core': '#7B61FF',
  'ai-ml': '#f43f5e',
  'learning': '#FF9500',
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(8,14,30,0.95)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 14, padding: '10px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)', marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: '#00E5FF' }}>
        {payload[0].value.toFixed(1)}<span style={{ fontSize: 13, color: 'rgba(148,163,184,0.7)', marginLeft: 4 }}>hrs</span>
      </p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(8,14,30,0.95)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 14, padding: '10px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)', marginBottom: 4 }}>{payload[0].name}</p>
      <p style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: payload[0].payload.fill }}>
        {payload[0].value.toFixed(1)}<span style={{ fontSize: 13, color: 'rgba(148,163,184,0.7)', marginLeft: 4 }}>hrs</span>
      </p>
    </div>
  );
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
      return { date: `${d.getMonth()+1}/${d.getDate()}`, hours };
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
    
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const totalHours = Object.values(categoryMap).reduce((a, b) => a + b, 0);
  const topCategory = pieData.sort((a, b) => b.value - a.value)[0];

  return (
    <>
      <style>{STYLES}</style>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
        
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0,229,255,0.6)', marginBottom: 8 }}>
            STUDYFLOW · ANALYTICS
          </div>
          <h1 className="sf-display text-white" style={{ fontSize: 'clamp(26px, 4vw, 38px)', lineHeight: 1.1 }}>
            Deep Analytics
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Deep dive into your study metrics and performance.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sf-card rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.07) 0%, rgba(8,14,30,0.85) 100%)', border: '1px solid rgba(0,229,255,0.18)' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)', marginBottom: 8 }}>Total Hours</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #00E5FF, #7B61FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
              {totalHours.toFixed(1)}<span style={{ fontSize: 14, opacity: 0.6 }}>h</span>
            </p>
          </div>
          <div className="sf-card rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(124,98,255,0.09) 0%, rgba(8,14,30,0.85) 100%)', border: '1px solid rgba(124,98,255,0.18)' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)', marginBottom: 8 }}>Categories</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #7B61FF, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
              {pieData.length}
            </p>
          </div>
          <div className="sf-card rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,163,0,0.07) 0%, rgba(8,14,30,0.85) 100%)', border: '1px solid rgba(255,163,0,0.18)' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)', marginBottom: 8 }}>Sessions</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #FF9500, #FFD60A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
              {logs.length}
            </p>
          </div>
          <div className="sf-card rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(0,214,143,0.07) 0%, rgba(8,14,30,0.85) 100%)', border: '1px solid rgba(0,214,143,0.18)' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)', marginBottom: 8 }}>Top Focus</p>
            <p className="text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 16, fontWeight: 700 }}>
              {topCategory?.name || 'None'}
            </p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="h-full flex flex-col">
            <ChartWrapper title="Category Distribution" className="h-full flex flex-col">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity" style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' }} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={<PieChartIcon size={24} />} title="No Category Data" description="Log hours to see your distribution." />
              )}
            </ChartWrapper>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full flex flex-col">
            <ChartWrapper title="Focus Trends" className="h-full flex flex-col">
              {areaData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                      </linearGradient>
                      <filter id="analyticsGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11, fontFamily: 'Inter' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11, fontFamily: 'Inter' }} />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(0,229,255,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="hours" stroke="#00E5FF" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsGrad)" filter="url(#analyticsGlow)" dot={{ r: 4, fill: '#00E5FF', strokeWidth: 2, stroke: '#060d1f' }} activeDot={{ r: 6, fill: '#00E5FF', stroke: '#7B61FF', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={<Activity size={24} />} title="No Trend Data" description="Log hours over multiple days to see trends." />
              )}
            </ChartWrapper>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};
