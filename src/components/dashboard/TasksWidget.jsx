import React, { useState } from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { CheckCircle2, Circle, ListTodo, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TasksWidget = () => {
  const { tasks, toggleTask, addTask, updateTask, deleteTask } = useStudyData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    await addTask({ title: newTaskTitle, date: today });
    setNewTaskTitle('');
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setDeletingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    await updateTask(id, { title: editTitle.trim() });
    setEditingId(null);
    setEditTitle('');
  };

  const confirmDelete = async (id) => {
    await deleteTask(id);
    setDeletingId(null);
  };

  return (
    <div 
      className="h-full flex flex-col rounded-2xl p-6 overflow-hidden"
      style={{ background: 'rgba(8,14,30,0.72)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)' }}
    >
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.05] mb-4">
        <div className="flex items-center gap-2 text-[#00E5FF] mb-1">
          <ListTodo size={16} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Daily Goals</span>
        </div>
        <h3 className="text-white text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800 }}>Focus Tasks</h3>
      </div>
      
      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
              style={{
                background: task.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                border: task.completed ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => { if (!task.completed) e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = task.completed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'; }}
            >
              {/* Delete confirmation mode */}
              {deletingId === task._id ? (
                <div className="flex items-center justify-between w-full gap-2">
                  <span className="text-xs text-rose-400 font-medium">Delete this task?</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => confirmDelete(task._id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110"
                      style={{ background: 'rgba(244,63,94,0.25)', border: '1px solid rgba(244,63,94,0.4)' }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 transition-all hover:text-slate-200"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : editingId === task._id ? (
                /* Edit mode */
                <div className="flex items-center gap-2 w-full">
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(task._id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="flex-1 bg-white/[0.06] border border-[#00E5FF]/30 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-[#00E5FF]/30"
                  />
                  <button
                    onClick={() => saveEdit(task._id)}
                    className="text-[#00D68F] hover:scale-110 transition-transform p-0.5"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-slate-500 hover:text-slate-300 hover:scale-110 transition-all p-0.5"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                /* Normal display mode */
                <>
                  <button 
                    onClick={() => toggleTask(task._id)}
                    className="flex-shrink-0 focus:outline-none"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="text-[#00D68F]" size={20} />
                    ) : (
                      <Circle className="text-slate-600 hover:text-[#00E5FF] transition-colors" size={20} />
                    )}
                  </button>
                  <span className={`flex-1 text-sm font-medium transition-all ${task.completed ? 'line-through text-slate-600 opacity-50' : 'text-slate-200'}`}>
                    {task.title}
                  </span>
                  {/* Edit/Delete buttons - show on hover */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-1 rounded-md text-slate-500 hover:text-[#00E5FF] hover:bg-white/[0.06] transition-all"
                      title="Edit task"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => { setDeletingId(task._id); setEditingId(null); }}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Delete task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-600" style={{ fontSize: 12 }}>No tasks for today. Set a goal!</p>
          </div>
        )}
      </div>

      {/* Add task form */}
      <form onSubmit={handleAddTask} className="mt-4 relative">
        <input 
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#00E5FF]/40 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-[#00E5FF]/20"
        />
        <button 
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00E5FF] disabled:text-slate-700 hover:scale-110 active:scale-95 transition-all p-1"
        >
          <Plus size={20} />
        </button>
      </form>
    </div>
  );
};
