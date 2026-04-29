import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Clock, Flame, Activity, Award, BookOpen, TrendingUp, Zap, Target, Pencil, Check, X } from 'lucide-react';
import { useStudyData } from '../contexts/StudyDataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { TasksWidget } from '../components/dashboard/TasksWidget';
import { WeeklySummaryCard } from '../components/dashboard/WeeklySummaryCard';
import { InsightsCard } from '../components/dashboard/InsightsCard';
import { EmptyState } from '../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
  .sf-display  { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-weight: 800; }
  .sf-mono     { font-family: 'Inter', sans-serif; font-variant-numeric: tabular-nums; }

  .sf-card {
    background: rgba(8, 14, 30, 0.72);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
  }
  .sf-card-teal {
    background: linear-gradient(135deg, rgba(0,229,255,0.07) 0%, rgba(8,14,30,0.85) 100%);
    border: 1px solid rgba(0,229,255,0.18);
  }
  .sf-card-amber {
    background: linear-gradient(135deg, rgba(255,163,0,0.07) 0%, rgba(8,14,30,0.85) 100%);
    border: 1px solid rgba(255,163,0,0.18);
  }
  .sf-card-violet {
    background: linear-gradient(135deg, rgba(124,98,255,0.09) 0%, rgba(8,14,30,0.85) 100%);
    border: 1px solid rgba(124,98,255,0.18);
  }
  .sf-card-emerald {
    background: linear-gradient(135deg, rgba(0,214,143,0.07) 0%, rgba(8,14,30,0.85) 100%);
    border: 1px solid rgba(0,214,143,0.18);
  }

  .sf-num-teal {
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-weight: 800;
    font-variant-numeric: tabular-nums;
    background: linear-gradient(135deg, #00E5FF 0%, #7B61FF 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .sf-num-amber {
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-weight: 800;
    font-variant-numeric: tabular-nums;
    background: linear-gradient(135deg, #FF9500 0%, #FFD60A 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: sf-shimmer 3s linear infinite;
    background-size: 200% auto;
  }
  .sf-num-violet {
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-weight: 800;
    font-variant-numeric: tabular-nums;
    background: linear-gradient(135deg, #7B61FF 0%, #C084FC 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .sf-label {
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(148,163,184,0.7);
  }

  @keyframes sf-shimmer {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  @keyframes sf-orb-drift {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-20px) scale(1.08); }
    66%      { transform: translate(-20px,15px) scale(0.95); }
  }
  @keyframes sf-spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .sf-orb1 { animation: sf-orb-drift 14s ease-in-out infinite; }
  .sf-orb2 { animation: sf-orb-drift 18s ease-in-out infinite reverse; }
  .sf-orb3 { animation: sf-orb-drift 22s ease-in-out infinite 4s; }

  .sf-ticker::after {
    content: '';
    display: inline-block;
    width: 2px; height: 1em;
    background: #00E5FF;
    margin-left: 4px;
    animation: sf-blink 1s step-end infinite;
    vertical-align: middle;
  }
  @keyframes sf-blink { 0%,100%{opacity:1} 50%{opacity:0} }

  .sf-progress-track { stroke: rgba(255,255,255,0.06); }
  .sf-bar-hover:hover { filter: brightness(1.3); transition: filter 0.2s; }
  .sf-recent-item { border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sf-recent-item:last-child { border-bottom: none; }

  .sf-hero-grid {
    background-image:
      linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`;

// ─── Animated Counter ─────────────────────────────────────────────────────────
function useAnimatedCounter(target, decimals = 1, duration = 1400) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(parseFloat((target * eased).toFixed(decimals)));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, decimals, duration]);
  return val;
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct = 0, size = 108, stroke = 7, gradId = 'g1', c1 = '#00E5FF', c2 = '#7B61FF' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      />
    </svg>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(8,14,30,0.95)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 14, padding: '10px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p className="sf-label" style={{ marginBottom: 6 }}>{label}</p>
      <p className="sf-mono" style={{ fontSize: 22, fontWeight: 700, color: '#00E5FF' }}>{payload[0].value.toFixed(1)}<span style={{ fontSize: 13, color: 'rgba(148,163,184,0.7)', marginLeft: 4 }}>hrs</span></p>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit = '', icon, colorClass = 'sf-num-teal', cardClass = 'sf-card', delay = 0, extra }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={`${cardClass} rounded-2xl p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="sf-label">{label}</span>
        <div style={{ opacity: 0.5 }}>{icon}</div>
      </div>
      <div>
        <div className={`${colorClass} sf-display`} style={{ fontSize: 38, lineHeight: 1, fontWeight: 800 }}>
          {value}<span style={{ fontSize: 16, marginLeft: 4, opacity: 0.7 }}>{unit}</span>
        </div>
        {extra && <div className="sf-label mt-2" style={{ color: 'rgba(100,116,139,0.8)' }}>{extra}</div>}
      </div>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const { logs, stats, loading, CATEGORIES, goal, setGoal } = useStudyData();
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);

  const weeklyData = useMemo(() => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[d.toISOString().split('T')[0]] = 0;
    }
    logs.forEach(l => { if (map[l.date] !== undefined) map[l.date] += parseFloat(l.hours); });
    return Object.entries(map).map(([date, hours]) => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      hours,
    }));
  }, [logs]);

  const todayPct  = Math.min((stats.todayHours / goal) * 100, 100);
  const totalHrs  = useAnimatedCounter(stats.totalHours, 1);
  const todayHrs  = useAnimatedCounter(stats.todayHours, 1);
  const streak    = useAnimatedCounter(stats.currentStreak, 0);
  const best      = useAnimatedCounter(stats.bestStreak, 0);
  const weeklyHrs = useAnimatedCounter(stats.weeklySummary?.hours ?? 0, 1);

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-5 pb-12">
        <LoadingSkeleton className="h-52 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LoadingSkeleton className="h-80 rounded-2xl lg:col-span-2" />
          <LoadingSkeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stagger = (i) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 } });

  return (
    <>
      <style>{STYLES}</style>

      <div className="space-y-4 pb-14">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <motion.div {...stagger(0)}
          className="relative overflow-hidden rounded-3xl sf-hero-grid"
          style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0b1428 60%, #070e20 100%)', minHeight: 220 }}
        >
          {/* Glowing orbs */}
          <div className="sf-orb1 absolute pointer-events-none" style={{ width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)', top: -100, left: -60, filter: 'blur(10px)' }} />
          <div className="sf-orb2 absolute pointer-events-none" style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.2) 0%, transparent 70%)', top: -80, right: 80, filter: 'blur(8px)' }} />
          <div className="sf-orb3 absolute pointer-events-none" style={{ width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,149,0,0.14) 0%, transparent 70%)', bottom: -60, right: 240, filter: 'blur(12px)' }} />

          {/* Decorative ring */}
          <div className="absolute pointer-events-none" style={{ width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(0,229,255,0.08)', top: -120, right: -60 }} />
          <div className="absolute pointer-events-none" style={{ width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(124,98,255,0.1)', top: -60, right: -10 }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 sm:p-9">
            <div>
              <div className="sf-label mb-3" style={{ color: 'rgba(0,229,255,0.6)' }}>STUDYFLOW · DASHBOARD</div>
              <h1 className="sf-display text-white mb-2" style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1 }}>
                Welcome back,<br />
                <span style={{ background: 'linear-gradient(90deg,#00E5FF,#7B61FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  keep the fire alive.
                </span>
              </h1>
              <p className="sf-label mt-4" style={{ color: 'rgba(148,163,184,0.7)', fontSize: 12 }}>
                {stats.currentStreak > 0
                  ? `🔥 ${stats.currentStreak}-day streak · ${stats.todayHours.toFixed(1)}h logged today`
                  : 'Start logging to build your streak.'}
              </p>
            </div>

            {/* Today goal widget */}
            <div className="flex-shrink-0 flex items-center gap-5 sf-card-teal rounded-2xl px-6 py-4" style={{ minWidth: 200 }}>
              <div className="relative">
                <ProgressRing pct={todayPct} size={96} stroke={7} gradId="hero-ring" c1="#00E5FF" c2="#7B61FF" />
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'none' }}>
                  <span className="sf-mono" style={{ fontSize: 18, fontWeight: 700, color: '#00E5FF', lineHeight: 1 }}>{Math.round(todayPct)}%</span>
                  <span className="sf-label" style={{ fontSize: 9, marginTop: 2 }}>GOAL</span>
                </div>
              </div>
              <div>
                <div className="sf-label mb-1 flex items-center gap-2">
                  Daily Goal
                  {!editingGoal && (
                    <button
                      onClick={() => { setEditingGoal(true); setTempGoal(goal); }}
                      className="text-slate-500 hover:text-[#00E5FF] transition-colors p-0.5 rounded"
                      title="Edit daily goal"
                    >
                      <Pencil size={11} />
                    </button>
                  )}
                </div>
                {editingGoal ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.5"
                      max="24"
                      step="0.5"
                      value={tempGoal}
                      onChange={e => setTempGoal(parseFloat(e.target.value) || 0)}
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') { setGoal(tempGoal); setEditingGoal(false); }
                        if (e.key === 'Escape') setEditingGoal(false);
                      }}
                      className="w-16 bg-white/[0.08] border border-[#00E5FF]/30 rounded-lg px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-[#00E5FF]/30 sf-mono"
                      style={{ fontWeight: 700 }}
                    />
                    <span className="text-slate-500 text-xs">hrs</span>
                    <button
                      onClick={() => { setGoal(tempGoal); setEditingGoal(false); }}
                      className="text-[#00D68F] hover:scale-110 transition-transform p-0.5"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingGoal(false)}
                      className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="sf-mono" style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{todayHrs.toFixed(1)}<span style={{ color: 'rgba(148,163,184,0.6)', fontSize: 13 }}>/{goal}h</span></div>
                    <div className="sf-label mt-1" style={{ color: todayPct >= 100 ? '#00D68F' : 'rgba(148,163,184,0.5)' }}>
                      {todayPct >= 100 ? '✓ ACHIEVED' : `${(goal - stats.todayHours).toFixed(1)}h remaining`}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Hours */}
          <motion.div {...stagger(1)} className="sf-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden" style={{ minHeight: 140 }}>
            <div className="flex items-start justify-between">
              <span className="sf-label">Total Hours</span>
              <Clock size={16} style={{ color: '#00E5FF', opacity: 0.6 }} />
            </div>
            <div>
              <div className="sf-num-teal sf-display" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
                {totalHrs.toFixed(1)}<span style={{ fontSize: 15, marginLeft: 3, opacity: 0.6 }}>h</span>
              </div>
              <div className="sf-label mt-1.5">all time logged</div>
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
          </motion.div>

          {/* Weekly Hours */}
          <motion.div {...stagger(2)} className="sf-card-violet rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden" style={{ minHeight: 140 }}>
            <div className="flex items-start justify-between">
              <span className="sf-label">This Week</span>
              <TrendingUp size={16} style={{ color: '#7B61FF', opacity: 0.7 }} />
            </div>
            <div>
              <div className="sf-num-violet sf-display" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
                {weeklyHrs.toFixed(1)}<span style={{ fontSize: 15, marginLeft: 3, opacity: 0.6 }}>h</span>
              </div>
              <div className="sf-label mt-1.5" style={{ color: 'rgba(124,98,255,0.7)' }}>
                {stats.weeklySummary?.mostFocused && stats.weeklySummary.mostFocused !== 'None'
                  ? `top: ${stats.weeklySummary.mostFocused}`
                  : 'start logging to track'}
              </div>
            </div>
          </motion.div>

          {/* Current Streak */}
          <motion.div {...stagger(3)} className="sf-card-amber rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden" style={{ minHeight: 140 }}>
            <div className="flex items-start justify-between">
              <span className="sf-label">Streak</span>
              <Flame size={16} style={{ color: '#FF9500', opacity: 0.8 }} />
            </div>
            <div>
              <div className="sf-num-amber sf-display" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
                {Math.round(streak)}<span style={{ fontSize: 15, marginLeft: 3, opacity: 0.6 }}>days</span>
              </div>
              <div className="sf-label mt-1.5" style={{ color: 'rgba(255,149,0,0.7)' }}>
                {stats.currentStreak > 2 ? '🔥 on fire' : 'keep going'}
              </div>
            </div>
            {stats.currentStreak > 2 && (
              <div className="absolute top-3 right-3 text-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(255,149,0,0.8))' }}>🔥</div>
            )}
          </motion.div>

          {/* Best Streak */}
          <motion.div {...stagger(4)} className="sf-card-emerald rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden" style={{ minHeight: 140 }}>
            <div className="flex items-start justify-between">
              <span className="sf-label">Best Streak</span>
              <Award size={16} style={{ color: '#00D68F', opacity: 0.7 }} />
            </div>
            <div>
              <div className="sf-display" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, fontFamily: "'Space Mono', monospace", background: 'linear-gradient(135deg,#00D68F,#00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {Math.round(best)}<span style={{ fontSize: 15, marginLeft: 3, opacity: 0.6 }}>days</span>
              </div>
              <div className="sf-label mt-1.5" style={{ color: 'rgba(0,214,143,0.7)' }}>personal best</div>
            </div>
          </motion.div>
        </div>

        {/* ── CHART + RECENT ACTIVITY ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Area Chart */}
          <motion.div {...stagger(5)} className="sf-card rounded-2xl p-6 lg:col-span-2" style={{ minHeight: 320 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="sf-display text-white" style={{ fontSize: 18, fontWeight: 700 }}>Activity Timeline</h2>
                <p className="sf-label mt-1">last 7 days</p>
              </div>
              <div className="sf-card-teal rounded-xl px-3 py-1.5 flex items-center gap-2">
                <Activity size={13} style={{ color: '#00E5FF' }} />
                <span className="sf-label" style={{ color: '#00E5FF' }}>WEEKLY</span>
              </div>
            </div>

            {weeklyData.every(d => d.hours === 0) ? (
              <EmptyState icon={<Activity size={28} />} title="No activity yet" description="Start logging study sessions to visualize your timeline." />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={weeklyData} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11, fontFamily: 'Space Mono' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11, fontFamily: 'Space Mono' }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(0,229,255,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone" dataKey="hours"
                    stroke="#00E5FF" strokeWidth={2.5}
                    fill="url(#chartGrad)"
                    filter="url(#glow)"
                    dot={{ r: 4, fill: '#00E5FF', strokeWidth: 2, stroke: '#060d1f' }}
                    activeDot={{ r: 6, fill: '#00E5FF', stroke: '#7B61FF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div {...stagger(6)} className="sf-card rounded-2xl p-6 flex flex-col" style={{ minHeight: 320 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="sf-display text-white" style={{ fontSize: 18, fontWeight: 700 }}>Recent</h2>
              <BookOpen size={15} style={{ color: 'rgba(148,163,184,0.4)' }} />
            </div>

            {logs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="sf-label text-center" style={{ color: 'rgba(148,163,184,0.4)' }}>No sessions logged yet.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: 260 }}>
                <AnimatePresence>
                  {logs.slice(0, 6).map((log, i) => {
                    const cat = CATEGORIES.find(c => c.id === log.category) || CATEGORIES[1];
                    const dotColors = {
                      'dsa': '#10B981', 'development': '#3B82F6',
                      'cs-core': '#A855F7', 'ai-ml': '#F43F5E', 'learning': '#F59E0B'
                    };
                    const dotColor = dotColors[log.category] || '#6366F1';
                    return (
                      <motion.div
                        key={log._id || log.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="sf-recent-item flex items-center justify-between py-2.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0, boxShadow: `0 0 6px ${dotColor}` }} />
                          <div className="min-w-0">
                            <div className="sf-label truncate" style={{ color: 'rgba(226,232,240,0.8)', fontSize: 11 }}>{cat.name}</div>
                            <div className="sf-label truncate" style={{ color: 'rgba(100,116,139,0.6)', fontSize: 10, marginTop: 1 }}>{log.date}</div>
                          </div>
                        </div>
                        <div className="sf-mono flex-shrink-0 ml-2" style={{ fontSize: 15, fontWeight: 700, color: dotColor }}>
                          {log.hours}h
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Category breakdown mini pills */}
            {logs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {CATEGORIES.filter(c => logs.some(l => l.category === c.id)).map(c => (
                  <span key={c.id} className="sf-label rounded-full px-2.5 py-1" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(148,163,184,0.7)' }}>{c.name}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── WIDGETS ROW ──────────────────────────────────────────────── */}
        <motion.div {...stagger(7)} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-80"><TasksWidget /></div>
          <div className="h-80"><WeeklySummaryCard /></div>
          <div className="h-80"><InsightsCard /></div>
        </motion.div>

        {/* ── COMPLETION RATE BANNER ────────────────────────────────────── */}
        {stats.weeklySummary?.completionRate !== undefined && (
          <motion.div {...stagger(8)}
            className="relative overflow-hidden rounded-2xl flex items-center justify-between px-7 py-5 gap-6"
            style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(123,97,255,0.1) 50%, rgba(255,149,0,0.06) 100%)', border: '1px solid rgba(0,229,255,0.12)' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 flex items-center gap-5">
              <div style={{ fontSize: 32 }}>⚡</div>
              <div>
                <h3 className="sf-display text-white" style={{ fontSize: 17, fontWeight: 700 }}>
                  {stats.weeklySummary.completionRate}% Task Completion Rate
                </h3>
                <p className="sf-label mt-1">
                  {stats.weeklySummary.completionRate >= 80
                    ? 'Outstanding performance this week!'
                    : stats.weeklySummary.completionRate >= 50
                    ? 'Good progress — keep pushing.'
                    : 'Stay consistent, you\'ve got this.'}
                </p>
              </div>
            </div>
            <div className="relative z-10 flex-shrink-0">
              <ProgressRing pct={stats.weeklySummary.completionRate} size={72} stroke={5} gradId="comp-ring" c1="#00E5FF" c2="#7B61FF" />
            </div>
          </motion.div>
        )}

      </div>
    </>
  );
};
