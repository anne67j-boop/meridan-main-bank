import React from 'react';
import { LayoutDashboard, Wallet, PieChart, ArrowRightLeft, Settings, ShieldCheck, LogOut, FileText, Phone, Target } from 'lucide-react';
import { USER_NAME } from '../constants';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onContactAdvisor: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onContactAdvisor, onLogout }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Wallet, label: 'Accounts' },
    { icon: ArrowRightLeft, label: 'Transfers' },
    { icon: PieChart, label: 'Investments' },
    { icon: ShieldCheck, label: 'Security' },
    { icon: Settings, label: 'Settings' },
  ];

  const quickLinks = [
    { icon: FileText, label: 'My Portfolio', action: 'Investments' },
    { icon: Phone, label: 'Contact Advisor', action: 'contact' },
    { icon: Target, label: 'Financial Goals', action: 'Investments' },
  ];

  const handleLinkClick = (item: { label: string, action?: string }) => {
    if (item.action === 'contact') {
      onContactAdvisor();
    } else {
      onNavigate(item.action || item.label);
    }
  };

  return (
    <div className="flex flex-col w-72 bg-slate-900 text-white h-screen transition-all duration-300 border-r border-slate-800 shadow-xl z-50">
      {/* Brand Section - Private Client */}
      <div className="p-6 pb-2">
        <button onClick={() => onNavigate('Dashboard')} className="flex items-center space-x-2 group outline-none w-full">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:bg-blue-500 transition-colors">
                <span className="font-serif font-bold text-lg">M</span>
            </div>
            <div className="text-left">
                <h1 className="text-xl font-serif font-bold tracking-wide group-hover:text-blue-400 transition-colors">MERIDIAN</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-slate-300">Private Client</p>
            </div>
        </button>
      </div>

      {/* Profile Picture/Info Section - Requested Hierarchy */}
      <div className="px-4 py-4">
        <div 
          onClick={() => onNavigate('Settings')}
          className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-center space-x-3 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer group"
        >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md border border-blue-400/20 group-hover:scale-105 transition-transform">
                {USER_NAME.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-blue-200 transition-colors">{USER_NAME}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] text-slate-400 truncate font-medium">Verified Member</p>
                </div>
            </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.label;
            return (
              <li key={item.label}>
                <button 
                  onClick={() => onNavigate(item.label)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick Links Section */}
        <div className="pt-2">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Links</p>
            <ul className="space-y-1">
            {quickLinks.map((item) => (
                <li key={item.label}>
                <button 
                    onClick={() => handleLinkClick(item)}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white group"
                >
                    <item.icon size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    <span className="font-medium text-sm">{item.label}</span>
                </button>
                </li>
            ))}
            </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
            onClick={onLogout}
            className="flex items-center justify-center space-x-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full py-3 rounded-lg group"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};