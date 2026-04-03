import React, { useState } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Search, Calendar, Clock, BookOpen } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { motion } from 'framer-motion';

export const Logs = () => {
  const { logs, loading, CATEGORIES } = useStudyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredLogs = logs.filter(log => {
      const matchesSearch = log.date.includes(searchTerm) || log.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
      return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review your study history and milestones.</p>
      </div>

      <Card className="glass-panel border-0 mb-8 sticky top-20 z-20">
        <CardContent className="p-4 sm:p-6">
           <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                   placeholder="Search notes or date..." 
                   className="pl-10 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 rounded-xl"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2">
                 <button 
                    onClick={() => setCategoryFilter('All')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                        categoryFilter === 'All' 
                        ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md' 
                        : 'bg-white/50 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                 >
                     All
                 </button>
                 {CATEGORIES.map(cat => (
                     <button
                         key={cat.id}
                         onClick={() => setCategoryFilter(cat.id)}
                         className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                             categoryFilter === cat.id 
                             ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                             : 'bg-white/50 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700'
                         }`}
                     >
                         {cat.name}
                     </button>
                 ))}
              </div>
           </div>
        </CardContent>
      </Card>

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
             className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-8 space-y-8"
          >
             {filteredLogs.map(log => {
                 const catInfo = CATEGORIES.find(c => c.id === log.category) || CATEGORIES[1];
                 return (
                     <motion.div key={log.id} variants={itemVariants} className="relative pl-8 md:pl-12">
                         <div className={`absolute top-0 left-[-9px] h-4 w-4 rounded-full border-4 border-slate-50 dark:border-[#0B1120] bg-brand-500 shadow-sm`} />
                         <Card className="glass-panel border-0 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                             <CardContent className="p-5 sm:p-6">
                                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                     <div className="space-y-3">
                                         <div className="flex items-center gap-3">
                                             <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${catInfo.color}`}>
                                                 {catInfo.name}
                                             </span>
                                             <span className="text-sm font-medium text-slate-500 flex items-center">
                                                 <Calendar size={14} className="mr-1.5" />
                                                 {log.date}
                                             </span>
                                         </div>
                                         <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                                             {log.notes || <span className="italic opacity-50">No additional notes provided.</span>}
                                         </p>
                                     </div>
                                     <div className="flex items-center sm:flex-col sm:items-end gap-2 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 px-4 py-3 rounded-xl sm:min-w-[100px] justify-center sm:self-stretch group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
                                         <Clock size={20} className="hidden sm:block opacity-60 mb-1" />
                                         <span className="text-3xl font-black tracking-tight">{log.hours}</span>
                                         <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">Hours</span>
                                     </div>
                                 </div>
                             </CardContent>
                         </Card>
                     </motion.div>
                 );
             })}
          </motion.div>
      )}
    </div>
  );
};
