import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BookOpen, Flame, BarChart3, CheckCircle2, ArrowRight, Zap, Target, TrendingUp, Star, ChevronDown } from 'lucide-react';

// Animated particle canvas
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.pulse += 0.01;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${alpha})`;
        ctx.fill();
      });
      // draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Animated counter
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const duration = 1800;
    const fps = 60;
    const total = Math.ceil(duration / (1000 / fps));
    const timer = setInterval(() => {
      frame++;
      const progress = frame / total;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (frame >= total) clearInterval(timer);
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [started, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const features = [
  {
    icon: <Flame size={28} />,
    title: 'Streak Tracking',
    desc: 'Build unstoppable momentum with daily streaks that keep you accountable and motivated.',
    color: 'from-orange-500/20 to-red-500/10',
    border: 'border-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Deep Analytics',
    desc: 'Visualize your growth with beautiful charts. Spot patterns, optimize your schedule.',
    color: 'from-brand-500/20 to-indigo-500/10',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: <Target size={28} />,
    title: 'Daily Goals',
    desc: 'Set hourly targets and celebrate hitting them with satisfying milestone animations.',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: <Zap size={28} />,
    title: 'Smart Insights',
    desc: 'AI-powered recommendations based on your habits to maximize your focus time.',
    color: 'from-amber-500/20 to-yellow-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: <CheckCircle2 size={28} />,
    title: 'Task Planner',
    desc: 'Organize daily focus tasks alongside your logs to stay sharp and intentional.',
    color: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Weekly Reports',
    desc: 'Review your best subjects, busiest days, and completion rates every week.',
    color: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
];

const testimonials = [
  { name: 'Aanya Sharma', role: 'CS Student', text: 'StudyFlow transformed how I track my prep. My streak is at 47 days!', stars: 5 },
  { name: 'Rohan Mehra', role: 'Software Engineer', text: 'The analytics helped me realize I was wasting 2hrs daily. Fixed it in a week.', stars: 5 },
  { name: 'Priya Nair', role: 'DSA Enthusiast', text: 'Nothing beats the feeling of hitting your daily goal and seeing that trophy pop up.', stars: 5 },
];

export default function Landing() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 overflow-x-hidden relative" style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Background layers */}
      <ParticleField />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-600/8 blur-[120px]" />
        <div className="absolute top-[10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[30%] w-[500px] h-[500px] rounded-full bg-cyan-600/6 blur-[120px]" />
      </div>

      {/* NAV */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4"
      >
        <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5">
          <BookOpen className="text-indigo-400" size={22} />
          <span className="text-lg font-bold tracking-tight text-white">StudyFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-white/5"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
          >
            Get started
          </Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 font-medium mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Built for serious learners
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6"
          >
            <span className="text-white">Master every</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              study session.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light"
          >
            Log hours, track streaks, analyze patterns. StudyFlow turns your grind into visible, 
            measurable progress — one session at a time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/signup"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50 active:scale-95"
            >
              Start for free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold text-base rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Sign in
            </Link>
          </motion.div>
        </motion.div>

        {/* Mock Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mt-20 max-w-4xl mx-auto w-full"
        >
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-purple-600/10 blur-3xl rounded-3xl scale-95" />
          
          <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            {/* Mock header bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 h-6 bg-white/5 rounded-lg" />
            </div>
            {/* Mock dashboard content */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total Hours', val: '247.5h', color: 'indigo' },
                { label: 'Today', val: '4.0h', color: 'cyan' },
                { label: 'Streak', val: '12 days', color: 'orange' },
                { label: 'Best Streak', val: '28 days', color: 'rose' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 font-medium mb-1">{s.label}</p>
                  <p className="text-base font-bold text-white">{s.val}</p>
                </div>
              ))}
            </div>
            {/* Mock bar chart */}
            <div className="bg-white/5 border border-white/8 rounded-xl p-4 h-28 flex items-end gap-2">
              {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1.0 + i * 0.07, duration: 0.4, ease: 'backOut' }}
                  style={{ height: `${h}%`, originY: 1 }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Explore</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative z-10 py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { val: 50000, suffix: '+', label: 'Hours Logged' },
            { val: 8200, suffix: '+', label: 'Active Learners' },
            { val: 99, suffix: '%', label: 'Satisfaction' },
            { val: 3, suffix: 'M+', label: 'Tasks Completed' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl font-extrabold text-white tracking-tight mb-1">
                <Counter target={s.val} suffix={s.suffix} />
              </p>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Built for the focused mind
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Every feature designed with one goal: help you study smarter, not longer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`relative group bg-gradient-to-br ${f.color} border ${f.border} backdrop-blur-sm rounded-2xl p-6 overflow-hidden transition-all duration-300 cursor-default`}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-300 rounded-2xl" />
                <div className={`${f.iconColor} mb-4 opacity-90`}>{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Community love</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Learners who made it stick
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.04] border border-white/8 backdrop-blur-sm rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative z-10 py-28 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/25 via-purple-600/20 to-cyan-600/15 blur-3xl rounded-3xl" />
          <div className="relative bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent border border-indigo-500/20 rounded-3xl p-12 sm:p-16 text-center overflow-hidden">
            {/* Decorative orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
            
            <BookOpen className="text-indigo-400 mx-auto mb-6" size={40} />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Your next streak starts today.
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
              Join thousands building consistent study habits with StudyFlow. Free, always.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="group flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all hover:scale-105 hover:shadow-indigo-500/60 active:scale-95"
              >
                Create free account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-10 py-4 bg-white/8 hover:bg-white/12 border border-white/10 text-slate-300 hover:text-white font-semibold text-base rounded-2xl backdrop-blur-sm transition-all hover:scale-105"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-indigo-400" size={18} />
            <span className="text-slate-400 font-semibold text-sm">StudyFlow</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 StudyFlow. Built for learners who mean it.</p>
          <div className="flex gap-5 text-sm text-slate-600">
            <Link to="/login" className="hover:text-slate-400 transition-colors">Sign in</Link>
            <Link to="/signup" className="hover:text-slate-400 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
