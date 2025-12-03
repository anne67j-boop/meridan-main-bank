import React from 'react';
import { Account } from '../types';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

interface AccountCardProps {
  account: Account;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const isPositive = account.change >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2 sm:mb-4 gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{account.type}</p>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 truncate pr-2" title={account.name}>{account.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 sm:mt-1 font-mono truncate">{account.accountNumber}</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0 p-1 -mr-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="mt-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
          {formatCurrency(account.balance)}
        </h2>
        
        {account.change !== 0 && (
          <div className={`flex items-center mt-2 text-xs sm:text-sm font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? <ArrowUpRight size={14} className="mr-0.5 sm:mr-1" /> : <ArrowDownRight size={14} className="mr-0.5 sm:mr-1" />}
            {Math.abs(account.change)}%
            <span className="text-slate-400 font-normal ml-1">vs last month</span>
          </div>
        )}
      </div>
      
      {/* Decorative gradient bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
    </div>
  );
};