import React from 'react';
import { Menu, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header = ({ onMenuClick, onAddClick }) => {
  const { logout } = useAuth();

  return (
    <header 
      className="h-16 border-b border-white/[0.06] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6"
      style={{ background: 'rgba(8,14,30,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center lg:hidden">
        <button 
          onClick={onMenuClick} 
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors mr-2"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center justify-end w-full space-x-2">
        <button 
          onClick={onAddClick} 
          className="lg:hidden p-2 rounded-lg text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={logout} 
          aria-label="Log out" 
          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
