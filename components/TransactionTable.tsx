import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  Coffee, Briefcase, Plane, ShoppingBag, TrendingUp, TrendingDown, Zap, 
  X, Download, AlertCircle, CheckCircle2, Clock, 
  ChevronDown, ChevronUp, FileText, Building, Calendar, FilterX, Eye, ArrowRightLeft, ShieldCheck, Lock
} from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onVerifyTransaction?: (txId: string) => void;
}

const getIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'dining': return <Coffee size={18} />;
    case 'investment': return <TrendingUp size={18} />;
    case 'travel': return <Plane size={18} />;
    case 'groceries': return <ShoppingBag size={18} />;
    case 'income': return <Briefcase size={18} />;
    case 'transfer': return <ArrowRightLeft size={18} />;
    default: return <Zap size={18} />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onVerifyTransaction }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'pending'>('all');
  
  // Verification Modal State
  const [verifyTxId, setVerifyTxId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  const closeModal = () => setSelectedTx(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleOpenModal = (tx: Transaction) => {
    setSelectedTx(tx);
  };

  const handleVerifyClick = (e: React.MouseEvent, txId: string) => {
    e.stopPropagation();
    setVerifyTxId(txId);
    setOtpCode('');
    setOtpError('');
  };

  const submitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === '123456') {
        if (onVerifyTransaction && verifyTxId) {
            onVerifyTransaction(verifyTxId);
        }
        setVerifyTxId(null);
        setOtpCode('');
    } else {
        setOtpError('Code expired or incorrect. Request a new one or try again.');
    }
  };

  // Filter transactions based on date range and status
  const filteredTransactions = transactions.filter(tx => {
    // Status Filter
    if (statusFilter !== 'all' && tx.status !== statusFilter) {
      return false;
    }

    // Date Filter
    if (!startDate && !endDate) return true;
    
    const txDate = new Date(tx.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) {
      // Set start time to beginning of day
      start.setHours(0, 0, 0, 0);
      if (txDate < start) return false;
    }
    
    if (end) {
      // Set end time to end of day
      end.setHours(23, 59, 59, 999);
      if (txDate > end) return false;
    }

    return true;
  });

  // Calculate totals
  const totalCredits = filteredTransactions
    .filter(tx => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebits = filteredTransactions
    .filter(tx => tx.type === 'debit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netFlow = totalCredits - totalDebits;

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Amount', 'Type', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => {
        const amount = tx.type === 'debit' ? -tx.amount : tx.amount;
        return [
          tx.id,
          tx.date,
          `"${tx.description.replace(/"/g, '""')}"`,
          tx.category,
          amount,
          tx.type,
          tx.status
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        {/* Header with Filters */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Recent Activity</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             {/* Status Filter */}
             <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'posted' | 'pending')}
                  className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="posted">Posted</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             </div>

             <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shadow-sm">
                <Calendar size={14} className="text-slate-400" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none p-0 text-xs font-medium text-slate-600 dark:text-slate-300 focus:ring-0 outline-none w-24 placeholder-slate-400"
                  placeholder="Start"
                />
                <span className="text-slate-300 dark:text-slate-600">-</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none p-0 text-xs font-medium text-slate-600 dark:text-slate-300 focus:ring-0 outline-none w-24"
                />
             </div>
             
             {(startDate || endDate || statusFilter !== 'all') && (
               <button 
                onClick={clearFilters}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
                title="Clear Filters"
               >
                 <FilterX size={16} />
               </button>
             )}

             <button 
                onClick={handleExportCSV}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm ml-2"
                title="Export to CSV"
            >
                <Download size={14} />
                <span>Export</span>
            </button>
             
             <button className="hidden sm:block text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-2">View All</button>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4 flex items-center justify-between md:justify-start md:space-x-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">Total Income</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCredits)}</p>
            </div>
          </div>
          <div className="px-6 py-4 flex items-center justify-between md:justify-start md:space-x-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
              <TrendingDown size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">Total Expenses</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(totalDebits)}</p>
            </div>
          </div>
          <div className="px-6 py-4 flex items-center justify-between md:justify-start md:space-x-4">
            <div className={`p-2 rounded-full ${netFlow >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">Net Flow</p>
              <p className={`text-lg font-bold ${netFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-12"></th>
                <th className="px-6 py-4 font-semibold">Transaction</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">Category</th>
                <th className="px-6 py-4 font-semibold hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const isExpanded = expandedId === tx.id;
                  return (
                    <React.Fragment key={tx.id}>
                      <tr 
                        onClick={() => toggleExpand(tx.id)}
                        className={`transition-colors cursor-pointer group border-l-4 ${
                          isExpanded 
                            ? 'bg-slate-50 dark:bg-slate-800/50 border-blue-600 dark:border-blue-500' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
                        }`}
                      >
                        <td 
                          className="px-6 py-4 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={(e) => { e.stopPropagation(); toggleExpand(tx.id); }}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-4 transition-colors shadow-sm ${
                              tx.type === 'credit' 
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {getIcon(tx.category)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tx.description}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium text-sm ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                          {tx.type === 'debit' ? '-' : '+'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                      
                      {/* Expanded Detail Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50 dark:bg-slate-800/30 animate-in fade-in slide-in-from-top-2 duration-200">
                          <td colSpan={5} className="px-6 pb-6 pt-2">
                            <div className="ml-0 md:ml-16 bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex items-start space-x-4">
                                  {tx.merchantLogo ? (
                                    <img src={tx.merchantLogo} alt="Merchant" className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                                  ) : (
                                    <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                                      <Building size={24} />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Merchant Details</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tx.description}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">San Francisco, CA • {tx.category}</p>
                                    <div className="mt-3 flex items-center space-x-4">
                                      <div className="text-xs">
                                        <span className="text-slate-400">Status:</span>
                                        <span className={`ml-1 font-medium ${tx.status === 'posted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                                          {tx.status === 'posted' ? 'Posted' : 'Pending'}
                                        </span>
                                      </div>
                                      <div className="text-xs">
                                        <span className="text-slate-400">ID:</span>
                                        <span className="ml-1 font-mono text-slate-600 dark:text-slate-300">{tx.id.toUpperCase()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 self-end md:self-center">
                                  {/* Verification Button for Pending Transactions */}
                                  {tx.status === 'pending' && (
                                    <button
                                      onClick={(e) => handleVerifyClick(e, tx.id)}
                                      className="flex items-center space-x-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors"
                                    >
                                      <ShieldCheck size={16} />
                                      <span>Verify</span>
                                    </button>
                                  )}

                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(tx); }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                  >
                                    <FileText size={16} />
                                    <span>View Receipt</span>
                                  </button>
                                  <button 
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                  >
                                    <AlertCircle size={16} />
                                    <span>Dispute</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                       <FilterX size={32} className="text-slate-300 dark:text-slate-600" />
                       <p className="text-sm font-medium">No transactions found</p>
                       <p className="text-xs">Try adjusting your date range filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal (Replaces window.prompt) */}
      {verifyTxId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setVerifyTxId(null)}
            ></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setVerifyTxId(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X size={20} />
                </button>
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verify Transaction</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Enter the 6-digit code we sent to your mobile device ending in ••88. It expires in 10 minutes.
                    </p>
                </div>
                
                <form onSubmit={submitVerification} className="space-y-4">
                    <div className="flex justify-center">
                        <input 
                            type="text" 
                            value={otpCode}
                            onChange={(e) => { setOtpCode(e.target.value); setOtpError(''); }}
                            placeholder="000000"
                            maxLength={6}
                            className="w-64 text-center text-3xl font-mono tracking-[1em] py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-transparent focus:border-amber-500 outline-none text-slate-900 dark:text-white transition-colors"
                            autoFocus
                        />
                    </div>
                    {otpError && <p className="text-xs text-red-500 text-center font-medium bg-red-50 dark:bg-red-900/10 py-1.5 rounded">{otpError}</p>}
                    
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-amber-600/20">
                        Confirm Identity
                    </button>
                    <p className="text-xs text-center text-slate-400">
                        Did not receive code? <button type="button" className="text-blue-500 hover:underline">Resend</button>
                    </p>
                </form>
            </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={closeModal}
          ></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Details</h3>
              <button 
                onClick={closeModal}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Amount Display */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-4 rounded-full mb-4 ${
                  selectedTx.type === 'credit' 
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {React.cloneElement(getIcon(selectedTx.category), { size: 32 })}
                </div>
                <h2 className={`text-3xl font-bold tracking-tight ${selectedTx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {selectedTx.type === 'debit' ? '-' : '+'}{formatCurrency(selectedTx.amount)}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{selectedTx.description}</p>
              </div>

              {/* Detail Grid */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                  <span className={`flex items-center text-sm font-medium ${selectedTx.status === 'posted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                    {selectedTx.status === 'posted' ? <CheckCircle2 size={14} className="mr-1.5"/> : <Clock size={14} className="mr-1.5"/>}
                    {selectedTx.status === 'posted' ? 'Posted' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Date</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(selectedTx.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Category</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedTx.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Transaction ID</span>
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400 text-xs">{selectedTx.id.toUpperCase()}</span>
                </div>

                {/* Merchant Info Section */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {selectedTx.merchantLogo ? (
                            <img src={selectedTx.merchantLogo} alt="Merchant" className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                <Building size={20} />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Merchant Details</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTx.description}</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              {/* Verify Action in Modal as well */}
              {selectedTx.status === 'pending' && (
                <button 
                  onClick={(e) => {
                      closeModal();
                      handleVerifyClick(e, selectedTx.id);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-600 text-white hover:bg-amber-700 py-3 rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  <ShieldCheck size={18} />
                  <span>Verify Transaction</span>
                </button>
              )}

              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-lg font-medium text-sm transition-colors shadow-sm">
                <Eye size={18} />
                <span>View Receipt</span>
              </button>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg font-medium text-sm transition-colors">
                  <Download size={16} />
                  <span>Download Receipt</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 py-2.5 rounded-lg font-medium text-sm transition-colors">
                  <AlertCircle size={16} />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};