import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StudyDataProvider } from '../../contexts/StudyDataContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AddEntryDrawer } from '../ui/AddEntryDrawer';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);

  return (
    <ThemeProvider>
      <StudyDataProvider>
        <div className="flex h-screen bg-transparent overflow-hidden text-slate-900 dark:text-slate-50">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static lg:block transition duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar 
              onClose={() => setSidebarOpen(false)} 
              onAddClick={() => {
                setSidebarOpen(false);
                setIsAddEntryOpen(true);
              }} 
            />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              onMenuClick={() => setSidebarOpen(true)} 
              onAddClick={() => setIsAddEntryOpen(true)}
            />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative">
              <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl relative z-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

        <AddEntryDrawer 
          isOpen={isAddEntryOpen} 
          onClose={() => setIsAddEntryOpen(false)} 
        />
      </StudyDataProvider>
    </ThemeProvider>
  );
};
