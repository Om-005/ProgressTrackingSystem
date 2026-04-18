import React, { useState } from 'react';
import { useStudyData } from '../../contexts/StudyDataContext';
import { CheckCircle2, Circle, ListTodo, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const TasksWidget = () => {
  const { tasks, toggleTask, addTask } = useStudyData();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    await addTask({ title: newTaskTitle, date: today });
    setNewTaskTitle('');
  };

  return (
    <Card className="glass-panel h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-1">
          <ListTodo size={18} />
          <span className="font-semibold text-xs tracking-wide uppercase">Daily Goals</span>
        </div>
        <CardTitle className="text-xl">Focus Tasks</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col pt-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                  task.completed 
                    ? 'bg-slate-50 border-slate-200 dark:bg-slate-800/30 dark:border-slate-800/50 text-slate-400' 
                    : 'bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500/50'
                }`}
              >
                <button 
                  onClick={() => toggleTask(task._id)}
                  className="flex-shrink-0 focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  ) : (
                    <Circle className="text-slate-300 hover:text-brand-400 transition-colors" size={20} />
                  )}
                </button>
                <span className={`text-sm font-medium transition-all ${task.completed ? 'line-through decoration-slate-300 dark:decoration-slate-600 opacity-60' : ''}`}>
                  {task.title}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {tasks.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">No tasks for today. Set a goal!</p>
            </div>
          )}
        </div>

        <form onSubmit={handleAddTask} className="mt-4 relative">
          <input 
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-shadow"
          />
          <button 
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-500 disabled:text-slate-400 hover:text-brand-600 transform hover:scale-110 active:scale-95 transition-all p-1"
          >
            <Plus size={20} />
          </button>
        </form>
      </CardContent>
    </Card>
  );
};
