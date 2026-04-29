import React, { useState } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { Search, Calendar, Clock, BookOpen, Pencil, Trash2, X, Check } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

const DOT_COLORS = {
  'dsa': '#10B981',
  'development': '#00E5FF',
  'cs-core': '#7B61FF',
  'ai-ml': '#F43F5E',
  'learning': '#FF9500',
};

export const Logs = () => {
  const { logs, loading, CATEGORIES, updateLog, deleteLog } = useStudyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.date.includes(searchTerm) || log.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const startEdit = (log) => {
    setEditingId(log._id);
    setEditData({
      date: log.date,
      category: log.category,
      hours: log.hours,
      notes: log.notes || '',
    });
    setDeletingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    if (!editData.date || !editData.category || !editData.hours) return;
    await updateLog(id, editData);
    setEditingId(null);
    setEditData({});
  };

  const confirmDelete = async (id) => {
    await deleteLog(id);
    setDeletingId(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0,229,255,0.6)', marginBottom: 8 }}>
          STUDYFLOW · TIMELINE
        </div>
        <h1 className="text-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, lineHeight: 1.1 }}>
          Timeline
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Review your study history and milestones.
        </p>
      </div>

      {/* Filters */}
      <div 
        className="rounded-2xl p-4 sm:p-5 sticky top-20 z-20"
        style={{ background: 'rgba(8,14,30,0.85)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              placeholder="Search notes or date..." 
              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#00E5FF]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-[#00E5FF]/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto flex overflow-x-auto pb-2 sm:pb-0 gap-2" style={{ scrollbarWidth: 'none' }}>
            <button 
              onClick={() => setCategoryFilter('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all tracking-wide ${
                categoryFilter === 'All' 
                  ? 'text-[#00E5FF] shadow-md' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={categoryFilter === 'All' ? { background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              ALL
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all tracking-wide ${
                  categoryFilter === cat.id 
                    ? 'text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={categoryFilter === cat.id 
                  ? { background: `${DOT_COLORS[cat.id] || '#6366f1'}22`, border: `1px solid ${DOT_COLORS[cat.id] || '#6366f1'}44`, color: DOT_COLORS[cat.id] || '#6366f1' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {!loading && filteredLogs.length === 0 ? (
        <EmptyState 
          icon={<BookOpen size={32} />}
          title="No logs found"
          description="Try adjusting your search or filters. If you haven't logged anything yet, add a new entry!"
        />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative ml-4 md:ml-8 space-y-6"
        >
          {/* Timeline line */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-px" 
            style={{ background: 'linear-gradient(180deg, rgba(0,229,255,0.3) 0%, rgba(123,97,255,0.2) 50%, rgba(0,229,255,0.05) 100%)' }} 
          />

          {filteredLogs.map((log, idx) => {
            const catInfo = CATEGORIES.find(c => c.id === log.category) || CATEGORIES[1];
            const dotColor = DOT_COLORS[log.category] || '#6366f1';
            return (
              <motion.div key={log._id || log.id} variants={itemVariants} className="relative pl-8 md:pl-12">
                {/* Timeline dot */}
                <div 
                  className="absolute top-5 left-[-5px] h-[11px] w-[11px] rounded-full"
                  style={{ 
                    background: dotColor, 
                    boxShadow: `0 0 10px ${dotColor}80, 0 0 20px ${dotColor}30`,
                    border: '2px solid #060B18',
                  }} 
                />
                
                {/* Card */}
                <div 
                  className="group rounded-2xl p-5 sm:p-6 hover:translate-y-[-2px] transition-all duration-300"
                  style={{ 
                    background: 'rgba(8,14,30,0.72)', 
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${dotColor}30`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                >
                  {/* Delete confirmation */}
                  {deletingId === (log._id || log.id) ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-rose-400 font-medium">Delete this entry?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmDelete(log._id || log.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110"
                          style={{ background: 'rgba(244,63,94,0.25)', border: '1px solid rgba(244,63,94,0.4)' }}
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 transition-all hover:text-slate-200"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : editingId === (log._id || log.id) ? (
                    /* Edit mode */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Date</label>
                          <input
                            type="date"
                            value={editData.date}
                            onChange={e => setEditData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Category</label>
                          <select
                            value={editData.category}
                            onChange={e => setEditData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20"
                            style={{ colorScheme: 'dark' }}
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat.id} value={cat.id} style={{ background: '#0a1020' }}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Hours</label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={editData.hours}
                            onChange={e => setEditData(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Notes</label>
                        <textarea
                          value={editData.notes}
                          onChange={e => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                          rows={2}
                          className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none resize-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20"
                          placeholder="Add notes..."
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => saveEdit(log._id || log.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
                          style={{ background: 'rgba(0,214,143,0.2)', border: '1px solid rgba(0,214,143,0.3)', color: '#00D68F' }}
                        >
                          <Check size={13} /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal display mode */
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span 
                            className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
                            style={{ background: `${dotColor}15`, color: dotColor, border: `1px solid ${dotColor}25` }}
                          >
                            {catInfo.name}
                          </span>
                          <span className="text-sm text-slate-500 flex items-center" style={{ fontSize: 12 }}>
                            <Calendar size={12} className="mr-1.5 opacity-60" />
                            {log.date}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-sm">
                          {log.notes || <span className="italic text-slate-600">No additional notes provided.</span>}
                        </p>
                      </div>
                      
                      {/* Hours badge + action buttons */}
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <div 
                          className="flex items-center sm:flex-col sm:items-end gap-2 px-4 py-3 rounded-xl sm:min-w-[90px] justify-center"
                          style={{ background: `${dotColor}08`, border: `1px solid ${dotColor}15` }}
                        >
                          <Clock size={18} className="hidden sm:block opacity-40 mb-1" style={{ color: dotColor }} />
                          <span style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 28, fontWeight: 800, color: dotColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                            {log.hours}
                          </span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)', marginTop: 2 }}>
                            HOURS
                          </span>
                        </div>
                        {/* Edit/Delete buttons */}
                        <div className="flex sm:flex-row gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => startEdit(log)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#00E5FF] hover:bg-white/[0.06] transition-all"
                            title="Edit entry"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => { setDeletingId(log._id || log.id); setEditingId(null); }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Delete entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
