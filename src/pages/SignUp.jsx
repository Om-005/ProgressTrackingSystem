import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';

const Orb = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

const GridLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
    <div className="absolute inset-0" style={{
      backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }} />
  </div>
);

// Password strength checker
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#f87171' };
  if (score <= 2) return { score, label: 'Fair', color: '#fb923c' };
  if (score <= 3) return { score, label: 'Good', color: '#facc15' };
  return { score, label: 'Strong', color: '#34d399' };
};

// Perk item on the right panel
const Perk = ({ text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start gap-3"
  >
    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
    <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
  </motion.div>
);

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
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

      {/* Background */}
      <Orb style={{ width: 700, height: 700, top: '-25%', right: '-15%', background: 'radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%)' }} />
      <Orb style={{ width: 500, height: 500, bottom: '-15%', left: '-10%', background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)' }} />
      <Orb style={{ width: 350, height: 350, top: '40%', left: '35%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />
      <GridLines />

      {/* LEFT PANEL — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 order-1 lg:order-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create account</h1>
              <p className="text-slate-400 text-sm">
                Already have one?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Sign in
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
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Full name</label>
                <div className={`rounded-2xl transition-all duration-200 ${focusedField === 'name' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/60 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email address</label>
                <div className={`rounded-2xl transition-all duration-200 ${focusedField === 'email' ? 'ring-2 ring-indigo-500/50' : ''}`}>
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

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <div className={`relative rounded-2xl transition-all duration-200 ${focusedField === 'password' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Min. 6 characters"
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

                {/* Password strength bar */}
                <AnimatePresence>
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2.5"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all duration-500"
                            style={{
                              background: i <= strength.score
                                ? strength.color
                                : 'rgba(255,255,255,0.08)',
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium" style={{ color: strength.color }}>
                        {strength.label} password
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Start for free
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Terms */}
            <p className="text-center text-slate-600 text-xs mt-5 leading-relaxed">
              By creating an account you agree to our{' '}
              <span className="text-slate-400 hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
              {' '}and{' '}
              <span className="text-slate-400 hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>.
            </p>
          </div>

          {/* Back to landing */}
          <div className="text-center mt-6">
            <Link to="/welcome" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL — branding */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="hidden lg:flex flex-col justify-between w-[460px] flex-shrink-0 relative z-10 p-12 border-l border-white/5"
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
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4">Join the community</p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                stay consistent.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              A focused learner with the right tools outperforms a talented one without them. StudyFlow gives you both.
            </p>
          </motion.div>

          <div className="space-y-4">
            <Perk text="Track every study session with categories, hours, and notes." delay={0.5} />
            <Perk text="Build streaks and hit daily goals with satisfying milestone animations." delay={0.6} />
            <Perk text="Visualize your growth with beautiful analytics and weekly reports." delay={0.7} />
            <Perk text="Manage daily focus tasks alongside your logs in one place." delay={0.8} />
            <Perk text="Get AI-powered insights based on your actual study patterns." delay={0.9} />
          </div>
        </div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/[0.04] border border-white/8 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Today's goal</p>
            <span className="text-emerald-400 text-xs font-bold">4 / 5 hrs</span>
          </div>
          <div className="h-2 w-full bg-white/8 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}
            />
          </div>
          <p className="text-slate-500 text-xs">1 more hour to hit your daily target 🎯</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
