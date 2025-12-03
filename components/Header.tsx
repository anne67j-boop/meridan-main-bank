import React from 'react';
import { Bell, Search, Menu, Moon, Sun, Sparkles } from 'lucide-react';
import { USER_NAME } from '../constants';

interface HeaderProps {
  onMenuClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (view: string) => void;
  onToggleAssistant: () => void;
  isAssistantOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
    onMenuClick, 
    isDarkMode, 
    toggleTheme, 
    onNavigate,
    onToggleAssistant,
    isAssistantOpen
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300 flex-shrink-0">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center lg:hidden">
          <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <Menu size={24} />
          </button>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search transactions, accounts, or services..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={onToggleAssistant}
            className={`p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isAssistantOpen 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            aria-label="Toggle Assistant"
            title="Meridian Concierge"
          >
            <Sparkles size={20} />
          </button>

          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          
          <button 
            onClick={() => onNavigate('Settings')}
            className="flex items-center space-x-3 pl-4 md:pl-6 border-l border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity text-left"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{USER_NAME}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Private Client</p>
            </div>
            <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-blue-900 dark:bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white dark:border-slate-800">
              {USER_NAME.charAt(0)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};