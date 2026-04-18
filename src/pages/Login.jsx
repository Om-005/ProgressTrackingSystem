import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Loader2, Eye, EyeOff, Flame, BarChart3, CheckCircle2 } from 'lucide-react';

// Floating orb component
const Orb = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

// Animated grid lines
const GridLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
    <div className="absolute inset-0" style={{
      backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }} />
  </div>
);

// Stat pill shown on the side panel
const StatPill = ({ icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-3"
  >
    <div className="text-indigo-400">{icon}</div>
    <div>
      <p className="text-white font-bold text-sm">{value}</p>
      <p className="text-slate-500 text-xs">{label}</p>
    </div>
  </motion.div>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{ background: '#060B18', fontFamily: "'Sora', 'DM Sans', sans-serif" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Background atmosphere */}
      <Orb style={{ width: 600, height: 600, top: '-20%', left: '-10%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      <Orb style={{ width: 500, height: 500, bottom: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }} />
      <Orb style={{ width: 300, height: 300, top: '50%', left: '40%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
      <GridLines />

      {/* LEFT PANEL — branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative z-10 p-12 border-r border-white/5"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-500/15 border border-indigo-500/30 rounded-2xl p-2.5">
            <BookOpen className="text-indigo-400" size={22} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">StudyFlow</span>
        </div>

        {/* Center content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Welcome back</p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Your streak is{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                waiting.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              Every session logged is a step closer to your goal. Sign in and keep the momentum alive.
            </p>
          </motion.div>

          <div className="space-y-3">
            <StatPill icon={<Flame size={18} />} label="Average user streak" value="12 days" delay={0.5} />
            <StatPill icon={<BarChart3 size={18} />} label="Hours logged today" value="3,240 hrs" delay={0.6} />
            <StatPill icon={<CheckCircle2 size={18} />} label="Tasks completed today" value="8,100+" delay={0.7} />
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="border-l-2 border-indigo-500/40 pl-4"
        >
          <p className="text-slate-400 text-sm italic leading-relaxed">
            "An investment in knowledge pays the best interest."
          </p>
          <p className="text-slate-600 text-xs mt-1">— Benjamin Franklin</p>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="bg-indigo-500/15 border border-indigo-500/30 rounded-xl p-2">
              <BookOpen className="text-indigo-400" size={20} />
            </div>
            <span className="text-white font-bold text-lg">StudyFlow</span>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Sign in</h1>
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Create one free
                </Link>
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email address</label>
                <div className={`relative rounded-2xl transition-all duration-200 ${focusedField === 'email' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/60 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <div className={`relative rounded-2xl transition-all duration-200 ${focusedField === 'password' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/60 rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full relative group flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Sign in to StudyFlow
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-slate-600 text-xs font-medium">New here?</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-slate-300 hover:text-white text-sm font-semibold transition-all duration-200"
            >
              Create a free account
            </Link>
          </div>

          {/* Back to landing */}
          <div className="text-center mt-6">
            <Link to="/welcome" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
