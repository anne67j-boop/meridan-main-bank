import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FinancialAssistant, FinancialAssistantRef } from './components/FinancialAssistant';
import { 
  DashboardView, 
  AccountsView, 
  TransfersView, 
  InvestmentsView, 
  SecurityView, 
  SettingsView,
  LoginView 
} from './components/Views';
import { ACCOUNTS, RECENT_TRANSACTIONS } from './constants';
import { Account, Transaction } from './types';

export const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const assistantRef = useRef<FinancialAssistantRef>(null);

  // Application State
  // Ensure default accounts are active
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS.map(a => ({ ...a, status: 'active' })));
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);

  // Toggle dark mode class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('Dashboard');
    setIsAssistantOpen(false);
  };

  const handleContactAdvisor = () => {
    setIsAssistantOpen(true);
    // Add a small delay to make it feel natural
    setTimeout(() => {
      assistantRef.current?.addMessage({
        id: Date.now().toString(),
        role: 'model',
        text: "I noticed you're interested in contacting your advisor. Would you like me to schedule a consultation regarding your portfolio strategy?"
      });
    }, 300);
  };

  // --- Account Management Handlers ---
  const handleAddAccount = (newAccount: Account) => {
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleVerifyAccount = (accountId: string) => {
    setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? { ...acc, status: 'active' } : acc
    ));
  };

  // --- Transfer Handlers ---
  const handleTransfer = (fromAccountId: string, recipient: string, amount: number): string | null => {
    const accountIndex = accounts.findIndex(a => a.id === fromAccountId);
    if (accountIndex === -1) return null;

    const account = accounts[accountIndex];
    if (account.balance < amount) {
      return null; // Insufficient funds
    }

    // Update Account Balance (Funds held immediately)
    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...account,
      balance: account.balance - amount
    };
    setAccounts(updatedAccounts);

    // Create New Transaction with Pending Status
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      description: `Transfer to ${recipient}`,
      category: 'Transfer',
      amount: amount,
      type: 'debit',
      status: 'pending', // Default to pending until OTP verified
      merchantLogo: '' 
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction.id;
  };

  const handleVerifyTransaction = (txId: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === txId ? { ...tx, status: 'posted' } : tx
    ));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return (
          <DashboardView 
            isDarkMode={isDarkMode} 
            onContactAdvisor={handleContactAdvisor} 
            onNavigate={setCurrentView}
            accounts={accounts}
            transactions={transactions}
            onVerifyTransaction={handleVerifyTransaction}
          />
        );
      case 'Accounts':
        return (
          <AccountsView 
            accounts={accounts} 
            onAddAccount={handleAddAccount}
            onVerifyAccount={handleVerifyAccount}
          />
        );
      case 'Transfers':
        return (
          <TransfersView 
            accounts={accounts} 
            onTransfer={handleTransfer} 
            onVerifyTransaction={handleVerifyTransaction}
            onAddAccount={handleAddAccount}
            onVerifyAccount={handleVerifyAccount}
          />
        );
      case 'Investments':
        return <InvestmentsView isDarkMode={isDarkMode} />;
      case 'Security':
        return <SecurityView />;
      case 'Settings':
        return <SettingsView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      default:
        return (
          <DashboardView 
            isDarkMode={isDarkMode} 
            onContactAdvisor={handleContactAdvisor} 
            onNavigate={setCurrentView}
            accounts={accounts}
            transactions={transactions}
            onVerifyTransaction={handleVerifyTransaction}
          />
        );
    }
  };

  // Render Login View if not authenticated
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className={`h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} overflow-hidden`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed inset-y-0 left-0 lg:static z-50 flex-shrink-0`}>
        <Sidebar 
            currentView={currentView} 
            onNavigate={(view) => { setCurrentView(view); setSidebarOpen(false); }} 
            onContactAdvisor={handleContactAdvisor}
            onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onNavigate={setCurrentView}
          onToggleAssistant={toggleAssistant}
          isAssistantOpen={isAssistantOpen}
        />

        {/* Content & Assistant Column Layout */}
        <div className="flex-1 flex overflow-hidden relative">
            <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {renderContent()}
            </main>

            {/* Right Column: Financial Assistant */}
            <div 
              className={`${
                isAssistantOpen ? 'translate-x-0' : 'translate-x-full'
              } absolute lg:static inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out z-40 flex flex-col flex-shrink-0`}
            >
                <FinancialAssistant 
                    ref={assistantRef} 
                    isOpen={isAssistantOpen}
                    onClose={() => setIsAssistantOpen(false)}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;