import React from 'react';
import { Menu, Moon, Sun, Plus, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Header = ({ onMenuClick, onAddClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center lg:hidden">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="mr-2">
          <Menu size={20} />
        </Button>
      </div>
      
      <div className="flex items-center justify-end w-full space-x-2">
        <Button variant="ghost" size="sm" onClick={onAddClick} className="lg:hidden text-brand-600 dark:text-brand-400">
          <Plus size={20} />
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
          {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-slate-700 dark:text-slate-300" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={logout} aria-label="Log out" className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
};
