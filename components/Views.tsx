import React, { useState, useEffect } from 'react';
import { Account, Transaction } from '../types';
import { AccountCard } from './AccountCard';
import { TransactionTable } from './TransactionTable';
import { SpendingChart } from './SpendingChart';
import { 
  Shield, Smartphone, Lock, Eye, Bell, Moon, Sun, 
  ChevronRight, CreditCard, RefreshCw, TrendingUp, 
  DollarSign, CheckCircle, ArrowRight, ArrowRightLeft, User, AlertTriangle, ShieldCheck, X, FileText, Globe, Building2, Landmark, Link, Loader2, Building, PlusCircle, Zap, Info, Search, ArrowLeft, Check, Copy, ScanFace
} from 'lucide-react';
import { USER_NAME } from '../constants';

// --- Shared Components ---

export const VerifyAccountModal = ({ isOpen, onClose, onVerify }: { isOpen: boolean, onClose: () => void, onVerify: (otp: string, amounts: {d1: string, d2: string}) => void }) => {
  const [step, setStep] = useState<'otp' | 'amounts'>('otp');
  const [otp, setOtp] = useState('');
  const [deposit1, setDeposit1] = useState('');
  const [deposit2, setDeposit2] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
        setStep('amounts');
        setError('');
    } else {
        setError('Code expired or incorrect. Request a new one or try again.');
    }
  };

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp, { d1: deposit1, d2: deposit2 });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verify Account</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {step === 'otp' ? 'For your safety, we require OTP before verifying deposits.' : 'Enter the two exact amounts deposited into your account.'}
                </p>
            </div>

            {step === 'otp' ? (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                     <div className="flex justify-center">
                        <input 
                            type="text" 
                            value={otp}
                            onChange={(e) => { setOtp(e.target.value); setError(''); }}
                            placeholder="000000"
                            maxLength={6}
                            className="w-48 text-center text-2xl font-mono tracking-widest py-2 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 outline-none"
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors">
                        Verify Identity
                    </button>
                    <p className="text-xs text-center text-slate-400">Code sent to ••88 (expires in 10 mins)</p>
                </form>
            ) : (
                <form onSubmit={handleAmountSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Deposit 1</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="0.00"
                                    value={deposit1}
                                    onChange={(e) => setDeposit1(e.target.value)}
                                    className="w-full pl-6 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Deposit 2</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="0.00"
                                    value={deposit2}
                                    onChange={(e) => setDeposit2(e.target.value)}
                                    className="w-full pl-6 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors">
                        Complete Verification
                    </button>
                </form>
            )}
        </div>
    </div>
  );
};

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Account) => void;
}

export const LinkAccountModal: React.FC<LinkAccountModalProps> = ({ isOpen, onClose, onAddAccount }) => {
  const [view, setView] = useState<'select_method' | 'plaid_flow' | 'manual_flow'>('select_method');
  
  // Plaid Flow State
  const [plaidStep, setPlaidStep] = useState<'initializing' | 'institution_select' | 'login' | 'mfa' | 'account_select' | 'loading' | 'success'>('institution_select');
  const [selectedInstitution, setSelectedInstitution] = useState<{name: string, color: string} | null>(null);
  const [plaidUsername, setPlaidUsername] = useState('');
  const [plaidPassword, setPlaidPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [plaidMfa, setPlaidMfa] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(['acc_1']); 

  // Manual Form State
  const [manualStep, setManualStep] = useState<'form' | 'otp'>('form');
  const [routingNum, setRoutingNum] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [manualBankName, setManualBankName] = useState('');
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // --- PLAID CONFIGURATION ---
  const PLAID_CONFIG = {
    client_name: selectedInstitution?.name || "Meridian Private Client",
    products: ["auth"], // Verifies account ownership
    country_codes: ["US"],
    user: {
        client_user_id: "a57d3304",
        phone_number: "+19162255887"
    }
  };

  // Mock Plaid Institutions
  const institutions = [
    { name: 'Chase', color: 'bg-blue-600' },
    { name: 'Bank of America', color: 'bg-red-600' },
    { name: 'Wells Fargo', color: 'bg-yellow-600' },
    { name: 'Citi', color: 'bg-blue-500' },
    { name: 'USAA', color: 'bg-slate-700' },
    { name: 'Capital One', color: 'bg-blue-800' },
    { name: 'US Bank', color: 'bg-blue-700' },
    { name: 'PNC', color: 'bg-orange-600' },
  ];

  // Mock Accounts found at bank
  const mockFoundAccounts = [
    { id: 'acc_1', name: 'Total Checking', mask: '8832', type: 'Checking', balance: 4250.00 },
    { id: 'acc_2', name: 'Premier Savings', mask: '1920', type: 'Savings', balance: 12500.00 },
    { id: 'acc_3', name: 'Credit Card', mask: '4451', type: 'Credit', balance: -450.20 },
  ];

  const resetState = () => {
    setView('select_method');
    setPlaidStep('institution_select');
    setSelectedInstitution(null);
    setPlaidUsername('');
    setPlaidPassword('');
    setLoginError('');
    setPlaidMfa('');
    setMfaError('');
    setManualStep('form');
    setRoutingNum('');
    setAccountNum('');
    setManualBankName('');
    setConsent(false);
    setOtp('');
    setOtpError('');
    setSelectedAccountIds(['acc_1']);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 300);
  };

  // --- Plaid Handlers ---

  const startPlaidFlow = () => {
    setView('plaid_flow');
    setPlaidStep('initializing');
    setLoadingText('Initializing Link Token...');
    setTimeout(() => {
        setPlaidStep('institution_select');
    }, 1500);
  };

  const handleInstitutionClick = (inst: {name: string, color: string}) => {
    setSelectedInstitution(inst);
    setLoadingText(`Connecting to ${inst.name}...`);
    setPlaidStep('loading');
    setTimeout(() => {
        setPlaidStep('login');
    }, 800);
  };

  const handlePlaidLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Authentic Credentials Check
    if (plaidUsername === 'user_good' && plaidPassword === 'pass_good') {
        setLoadingText('Verifying credentials...');
        setPlaidStep('loading');
        setTimeout(() => {
            setPlaidStep('mfa');
        }, 1500);
    } else {
        setLoginError('Invalid credentials. Please use the authentic demo credentials below.');
    }
  };

  const handlePlaidMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError('');

    if (plaidMfa === '123456') {
        setLoadingText('Authenticating...');
        setPlaidStep('loading');
        setTimeout(() => {
            setPlaidStep('account_select');
        }, 1500);
    } else {
        setMfaError('Invalid code. Please enter 123456.');
    }
  };

  const handleAccountSelection = () => {
    setLoadingText(`Verifying ownership with ${PLAID_CONFIG.client_name}...`);
    setPlaidStep('loading');
    setTimeout(() => {
        // Add selected accounts
        mockFoundAccounts.filter(acc => selectedAccountIds.includes(acc.id)).forEach(acc => {
             const newAccount: Account = {
                id: `ext-${Date.now()}-${acc.id}`,
                name: `${selectedInstitution?.name} ${acc.name}`,
                type: 'External',
                accountNumber: `•••• ${acc.mask}`,
                balance: acc.balance,
                change: 0,
                status: 'active',
                institution: selectedInstitution?.name || 'External Bank'
            };
            onAddAccount(newAccount);
        });
        setPlaidStep('success');
    }, 2000);
  };

  const toggleAccountSelection = (id: string) => {
    setSelectedAccountIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // --- Manual Handlers ---

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setManualStep('otp'); // Gate submission with OTP
  };

  const handleManualOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
        const newAccount: Account = {
            id: `ext-${Date.now()}`,
            name: `${manualBankName} Checking`,
            type: 'External',
            accountNumber: `•••• ${accountNum.slice(-4)}`,
            balance: 0, 
            change: 0,
            status: 'pending_verification',
            institution: manualBankName
        };
        onAddAccount(newAccount);
        handleClose();
    } else {
        setOtpError('Code expired or incorrect. Request a new one or try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose}></div>
        <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                    {view !== 'select_method' && (
                        <button onClick={() => setView('select_method')} className="mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    {view === 'plaid_flow' ? (
                         <span className="bg-black text-white px-2 py-0.5 font-mono font-bold text-sm tracking-wide rounded">PLAID</span>
                    ) : (
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white">Link Account</h3>
                    )}
                </div>
                <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
                
                {/* 1. SELECT METHOD */}
                {view === 'select_method' && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Link size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connect a Bank Account</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select a method to securely link your external account.</p>
                        </div>
                        
                        <button 
                            onClick={startPlaidFlow}
                            className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-black dark:hover:border-white hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-black text-white rounded-lg">
                                    <Zap size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-900 dark:text-white">Instant Verification</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Securely sign in via Plaid (Recommended)</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
                        </button>

                        <button 
                            onClick={() => { setView('manual_flow'); setManualStep('form'); }}
                            className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                                    <Building size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-900 dark:text-white">Manual Entry (ACH)</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Use routing & account number (1-2 days)</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-400 group-hover:text-slate-600" />
                        </button>
                    </div>
                )}

                {/* 2. PLAID FLOW */}
                {view === 'plaid_flow' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                         {/* Loading/Initializing State */}
                         {(plaidStep === 'loading' || plaidStep === 'initializing') && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 size={48} className="text-black dark:text-white animate-spin mb-6" />
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{loadingText}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    {plaidStep === 'initializing' ? 'Contacting Plaid servers...' : 'Secure connection established.'}
                                </p>
                            </div>
                        )}

                        {plaidStep === 'institution_select' && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search" 
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Most Popular</p>
                                    <p className="text-xs text-slate-400">Client: {PLAID_CONFIG.client_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {institutions.map(inst => (
                                        <button 
                                            key={inst.name}
                                            onClick={() => handleInstitutionClick(inst)}
                                            className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-black dark:hover:border-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2"
                                        >
                                            <div className={`w-8 h-8 rounded-full ${inst.color} flex items-center justify-center text-white text-xs font-bold`}>
                                                {inst.name[0]}
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white text-center">{inst.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => handleInstitutionClick({ name: 'Other Bank', color: 'bg-slate-500' })}
                                    className="w-full mt-2 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-dashed border-slate-300 dark:border-slate-700"
                                >
                                    Don't see your bank? View all institutions
                                </button>
                            </div>
                        )}

                        {plaidStep === 'login' && selectedInstitution && (
                            <form onSubmit={handlePlaidLogin} className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className={`w-16 h-16 mx-auto rounded-xl ${selectedInstitution.color} flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg`}>
                                        {selectedInstitution.name[0]}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sign in with {selectedInstitution.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Enter your credentials to link to <strong className="text-slate-900 dark:text-white">{PLAID_CONFIG.client_name}</strong>.
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">User ID</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={plaidUsername}
                                            onChange={(e) => setPlaidUsername(e.target.value)}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-black dark:focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={plaidPassword}
                                            onChange={(e) => setPlaidPassword(e.target.value)}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-black dark:focus:border-white transition-colors"
                                        />
                                    </div>

                                    {/* AUTHENTIC CREDENTIALS HINT */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wide flex items-center gap-1">
                                            <Info size={12} /> Authentic Demo Credentials
                                        </p>
                                        <div className="flex gap-4 text-xs text-slate-700 dark:text-slate-300 font-mono">
                                            <span>User: <strong>user_good</strong></span>
                                            <span>Pass: <strong>pass_good</strong></span>
                                        </div>
                                    </div>

                                    {loginError && (
                                        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded text-center">
                                            {loginError}
                                        </p>
                                    )}
                                </div>

                                <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                                    Submit
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <Lock size={12} />
                                    <span>Secured by Plaid</span>
                                </div>
                            </form>
                        )}

                        {plaidStep === 'mfa' && (
                             <form onSubmit={handlePlaidMfa} className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-600 dark:text-slate-300">
                                        <Smartphone size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verify Identity</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Enter the code sent to your mobile ending in {PLAID_CONFIG.user.phone_number.slice(-4)}
                                    </p>
                                </div>
                                
                                <div className="flex justify-center flex-col items-center">
                                    <input 
                                        type="text" 
                                        required
                                        autoFocus
                                        placeholder="000000"
                                        maxLength={6}
                                        value={plaidMfa}
                                        onChange={(e) => { 
                                            const val = e.target.value.replace(/\D/g, '');
                                            setPlaidMfa(val);
                                            setMfaError('');
                                        }}
                                        className="w-48 text-center text-2xl font-mono tracking-widest p-3 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 outline-none focus:border-black dark:focus:border-white"
                                    />
                                    {mfaError && (
                                        <p className="text-xs text-red-500 mt-2">{mfaError}</p>
                                    )}
                                </div>

                                <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                                    Verify Code
                                </button>
                             </form>
                        )}

                        {plaidStep === 'account_select' && (
                            <div className="space-y-6">
                                <div className="text-center mb-4">
                                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Accounts</h3>
                                     <p className="text-sm text-slate-500 dark:text-slate-400">Choose the accounts you want to link to {PLAID_CONFIG.client_name}.</p>
                                </div>
                                
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {mockFoundAccounts.map(acc => {
                                        const isSelected = selectedAccountIds.includes(acc.id);
                                        return (
                                            <div 
                                                key={acc.id}
                                                onClick={() => toggleAccountSelection(acc.id)}
                                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                                                    isSelected 
                                                    ? 'border-black dark:border-white bg-slate-50 dark:bg-slate-800' 
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-slate-300'}`}>
                                                        {isSelected && <Check size={14} className="text-white dark:text-black" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{acc.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">•••• {acc.mask}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-mono text-slate-600 dark:text-slate-300">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(acc.balance)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button 
                                    onClick={handleAccountSelection}
                                    disabled={selectedAccountIds.length === 0}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {plaidStep === 'success' && (
                            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                                    <Check size={32} className="text-white dark:text-black" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Success!</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                                    Your accounts have been verified and securely linked to {PLAID_CONFIG.client_name}.
                                </p>
                                <button onClick={handleClose} className="mt-8 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm">
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. MANUAL FLOW */}
                {view === 'manual_flow' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {manualStep === 'otp' ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Smartphone size={32} className="text-slate-600 dark:text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verify Request</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
                                    Enter the code sent to your mobile to authorize this ACH setup.
                                </p>
                                <form onSubmit={handleManualOtpVerify} className="space-y-4">
                                    <div className="flex justify-center">
                                        <input 
                                            type="text" 
                                            value={otp}
                                            onChange={(e) => { setOtp(e.target.value); setOtpError(''); }}
                                            placeholder="000000"
                                            maxLength={6}
                                            className="w-48 text-center text-2xl font-mono tracking-widest py-2 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700">
                                        Verify & Link
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <form onSubmit={handleManualFormSubmit} className="space-y-4">
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30 text-xs text-amber-800 dark:text-amber-300 mb-2">
                                    Enter your routing and account number to set up ACH. You’ll confirm two micro‑deposits to verify ownership.
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={manualBankName}
                                        onChange={(e) => setManualBankName(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500"
                                        placeholder="e.g. Local Credit Union"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Routing Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        maxLength={9}
                                        value={routingNum}
                                        onChange={(e) => setRoutingNum(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500"
                                        placeholder="9 digits"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={accountNum}
                                        onChange={(e) => setAccountNum(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500"
                                        placeholder="Account Number"
                                    />
                                </div>
                                
                                <label className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={consent}
                                        onChange={(e) => setConsent(e.target.checked)}
                                        className="mt-0.5"
                                    />
                                    <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                                        I authorize ACH debits/credits for this account. I understand this may take 1–2 business days.
                                    </span>
                                </label>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setView('select_method')} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Back</button>
                                    <button 
                                        type="submit" 
                                        disabled={!consent}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

// --- Login View ---

export const LoginView = ({ onLogin }: { onLogin: () => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isScanning, setIsScanning] = useState(false);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onLogin();
    };
  
    const handleBiometric = () => {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        onLogin();
      }, 1500);
    };
  
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
              <span className="font-serif font-bold text-3xl text-white">M</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">MERIDIAN</h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest mt-2">Private Client Access</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
  
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-blue-900/50">
              Sign In Securely
            </button>
          </form>
  
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-500">Or sign in with</span>
            </div>
          </div>
  
          <button 
            onClick={handleBiometric}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-3 group"
          >
            {isScanning ? (
              <Loader2 className="animate-spin text-blue-500" size={20} />
            ) : (
              <ScanFace size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
            )}
            {isScanning ? 'Scanning...' : 'Face ID'}
          </button>
        </div>
      </div>
    );
};

// --- Dashboard View ---
interface DashboardViewProps {
  isDarkMode: boolean;
  onContactAdvisor: () => void;
  onNavigate: (view: string) => void;
  accounts: Account[];
  transactions: Transaction[];
  onVerifyTransaction: (txId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ isDarkMode, onContactAdvisor, onNavigate, accounts, transactions, onVerifyTransaction }) => {
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Net Worth */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Good Morning, Howard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your financial overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Liquidity</p>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBalance)}
          </h2>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {accounts.filter(a => a.type !== 'External').map((account) => (
          <div key={account.id} onClick={() => onNavigate('Accounts')} className="cursor-pointer">
             <AccountCard account={account} />
          </div>
        ))}
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Transactions */}
        <div className="xl:col-span-2 space-y-8">
            <TransactionTable transactions={transactions} onVerifyTransaction={onVerifyTransaction} />
            
            {/* Promo Area */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl p-8 text-white relative overflow-hidden shadow-lg border border-blue-800">
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-bold mb-2">Meridian Private Wealth Management</h3>
                <p className="text-blue-100 max-w-lg mb-6">Schedule a consultation with your dedicated advisor to discuss your Q3 portfolio strategy and estate planning goals.</p>
                <button 
                  onClick={onContactAdvisor}
                  className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
                >
                  Contact Advisor
                </button>
              </div>
              <div className="absolute -right-20 -top-40 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
            </div>
        </div>

        {/* Right Column: Chart & Widgets */}
        <div className="xl:col-span-1 space-y-8">
          <div className="h-80">
            <SpendingChart isDarkMode={isDarkMode} />
          </div>
          
          {/* Quick Transfer Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">Quick Transfer</h3>
                  <button onClick={() => onNavigate('Transfers')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                <div onClick={() => onNavigate('Transfers')} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors group">
                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors">JW</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">James Woods</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Son - College Fund</p>
                      </div>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Send</span>
                </div>
                <div onClick={() => onNavigate('Transfers')} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors group">
                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors">RE</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Real Estate</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Management Corp</p>
                      </div>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Send</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Accounts View ---
interface AccountsViewProps {
  accounts: Account[];
  onAddAccount: (account: Account) => void;
  onVerifyAccount: (accountId: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onAddAccount, onVerifyAccount }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState<string | null>(null);
  
  const externalAccounts = accounts.filter(a => a.type === 'External');
  const internalAccounts = accounts.filter(a => a.type !== 'External');

  const handleVerifySuccess = (otp: string, amounts: {d1: string, d2: string}) => {
    if (showVerifyModal) {
        onVerifyAccount(showVerifyModal);
        setShowVerifyModal(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Accounts</h2>
        <button 
            onClick={() => setShowLinkModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
            <PlusCircle size={18} />
            <span>Link External Account</span>
        </button>
      </div>

      {/* Internal Accounts */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Meridian Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internalAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>

      {/* External Accounts */}
      <div>
         <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Linked External Accounts</h3>
         {externalAccounts.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {externalAccounts.map(account => (
                        <div key={account.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                    <Building2 size={24} className="text-slate-500 dark:text-slate-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-900 dark:text-white">{account.institution || 'External Bank'}</p>
                                        {account.status === 'pending_verification' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                Pending Verification
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{account.name} • {account.accountNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {account.status === 'active' ? (
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.balance)}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
                                            <CheckCircle size={12} className="text-emerald-500" />
                                            Active
                                        </p>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setShowVerifyModal(account.id)}
                                        className="px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Verify Trial Deposits
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         ) : (
             <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                 <Link size={32} className="text-slate-400 mx-auto mb-3" />
                 <p className="text-slate-500 dark:text-slate-400 font-medium">No external accounts linked</p>
                 <button onClick={() => setShowLinkModal(true)} className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1">Link an account now</button>
             </div>
         )}
      </div>

      <LinkAccountModal 
        isOpen={showLinkModal} 
        onClose={() => setShowLinkModal(false)}
        onAddAccount={onAddAccount}
      />

      <VerifyAccountModal 
        isOpen={!!showVerifyModal}
        onClose={() => setShowVerifyModal(null)}
        onVerify={handleVerifySuccess}
      />
    </div>
  );
};

// --- Transfers View ---
interface TransfersViewProps {
  accounts: Account[];
  onTransfer: (fromAccountId: string, recipient: string, amount: number) => string | null;
  onVerifyTransaction: (txId: string) => void;
  onAddAccount: (account: Account) => void;
  onVerifyAccount: (accountId: string) => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({ accounts, onTransfer, onVerifyTransaction, onAddAccount, onVerifyAccount }) => {
  const [transferType, setTransferType] = useState<'internal' | 'wire'>('internal');
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [recipient, setRecipient] = useState('James Woods (Son)');
  
  // Wire specific state
  const [wireBeneficiary, setWireBeneficiary] = useState('');
  const [wireBank, setWireBank] = useState('');
  const [wireAccountNum, setWireAccountNum] = useState('');
  const [wireRouting, setWireRouting] = useState('');

  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'success' | 'pending-alert'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  // OTP State
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  // Modals
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVerifyAccountModal, setShowVerifyAccountModal] = useState<string | null>(null);

  // Filter accounts for transfer source (must be active)
  const activeAccounts = accounts.filter(a => a.status === 'active' || !a.status);
  const pendingAccounts = accounts.filter(a => a.status === 'pending_verification');

  // Recent 3rd Party Activity Mock Data
  const recentWires = [
    { id: 'w1', date: 'Oct 24', beneficiary: 'Tesla Motors', amount: 84500.00, status: 'Completed' },
    { id: 'w2', date: 'Sep 12', beneficiary: 'Sotheby’s Auction', amount: 125000.00, status: 'Completed' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid positive amount.');
      return;
    }

    const recipientName = transferType === 'internal' ? recipient : wireBeneficiary || 'External Beneficiary';

    // onTransfer creates the transaction with 'pending' status
    const txId = onTransfer(fromAccountId, recipientName, numAmount);
    
    if (txId) {
      setCurrentTxId(txId);
      // Immediately require OTP
      setStep('otp');
      setErrorMessage('');
      setResendMsg('');
      setOtp('');
    } else {
      setErrorMessage('Insufficient funds in the selected account.');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') { 
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        // Only verify (post) the transaction if OTP is correct
        if (currentTxId) onVerifyTransaction(currentTxId);
        setStep('success');
        setOtp('');
        setTimeout(() => {
            setStep('form');
            setAmount('');
            setCurrentTxId(null);
            setWireBeneficiary('');
            setWireBank('');
            setWireAccountNum('');
            setWireRouting('');
        }, 3000);
      }, 1000);
    } else {
      setErrorMessage('Code expired or incorrect. Request a new one or try again.');
    }
  };

  const handleResendOtp = () => {
    setResendMsg('New code sent.');
    setTimeout(() => setResendMsg(''), 3000);
  };

  const handleCancelOtp = () => {
    // If user cancels OTP, the transaction remains in 'pending' state created by onTransfer
    setStep('pending-alert');
    setOtp('');
    setErrorMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 relative">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Move Money</h2>
            <button 
                onClick={() => setShowLinkModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
                <PlusCircle size={16} />
                <span>Link External Account</span>
            </button>
        </div>

        {/* Pending Account Alert */}
        {pendingAccounts.length > 0 && (
            <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Action Required</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {pendingAccounts.length} account(s) pending verification. Verify trial deposits to enable transfers.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowVerifyAccountModal(pendingAccounts[0].id)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                    Verify Now
                </button>
            </div>
        )}
        
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 relative overflow-hidden">
            
            {/* Transfer Type Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setTransferType('internal')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors relative ${
                      transferType === 'internal' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                    <ArrowRightLeft size={18} />
                    <span>Internal Transfer</span>
                    {transferType === 'internal' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                    )}
                </button>
                <button 
                   onClick={() => setTransferType('wire')}
                   className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors relative ${
                      transferType === 'wire' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                    <Globe size={18} />
                    <span>Wire / 3rd Party</span>
                    {transferType === 'wire' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                    )}
                </button>
            </div>

            <div className="p-8">
            {/* OTP Modal Overlay */}
            {step === 'otp' && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center p-6 animate-in fade-in duration-200">
                 <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm p-8 border border-slate-200 dark:border-slate-700">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security Verification</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Enter the 6-digit code sent to your mobile device ending in ••88. It expires in 10 minutes.</p>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 mt-3 rounded border border-blue-100 dark:border-blue-800/30">
                         <p className="text-[10px] text-blue-800 dark:text-blue-300 flex items-center justify-center gap-1">
                            <Info size={12} /> For your safety, we require OTP before submitting transfers.
                         </p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="flex justify-center">
                          <input 
                            type="text" 
                            value={otp}
                            onChange={(e) => { setOtp(e.target.value); setErrorMessage(''); }}
                            placeholder="000000"
                            maxLength={6}
                            className="w-48 text-center text-2xl font-mono tracking-widest py-2 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-colors"
                            autoFocus
                          />
                      </div>
                      {errorMessage && <p className="text-xs text-red-500 text-center font-medium bg-red-50 dark:bg-red-900/10 py-2 rounded">{errorMessage}</p>}
                      <button type="submit" disabled={isVerifying} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                         {isVerifying ? <Loader2 className="animate-spin" size={16} /> : 'Verify Transfer'}
                      </button>
                      <button type="button" onClick={handleResendOtp} className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs mt-2">
                        {resendMsg || "I didn't receive a code"}
                      </button>
                      <button type="button" onClick={handleCancelOtp} className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs mt-1 underline">
                        Cancel
                      </button>
                    </form>
                 </div>
              </div>
            )}

            {step === 'success' && (
                <div className="text-center py-12 animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Transfer Verified</h3>
                    <p className="text-slate-500 dark:text-slate-400">Your funds have been successfully sent to {transferType === 'internal' ? recipient : wireBeneficiary}.</p>
                </div>
            )}

            {step === 'pending-alert' && (
              <div className="text-center py-12 animate-in zoom-in duration-300">
                 <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Action Required</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">The transfer is currently <strong>Pending</strong> awaiting verification.</p>
                  <button 
                    onClick={() => { setStep('form'); setAmount(''); setCurrentTxId(null); }}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Start new transfer
                  </button>
              </div>
            )}

            {step === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {(errorMessage && !otp) && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center text-sm">
                        <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* FROM COLUMN */}
                        <div className="space-y-6">
                             <h4 className="font-semibold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Source</h4>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">From Account</label>
                                <select 
                                value={fromAccountId}
                                onChange={(e) => setFromAccountId(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {activeAccounts.map(a => (
                                        <option key={a.id} value={a.id}>
                                        {a.name} (•••• {a.accountNumber.slice(-4)})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 text-right">
                                    Available: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activeAccounts.find(a => a.id === fromAccountId)?.balance || 0)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => {
                                        setErrorMessage('');
                                        setAmount(e.target.value);
                                        }}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-10 pr-4 py-3 text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* TO COLUMN */}
                        <div className={`space-y-6 ${transferType === 'wire' ? 'bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50' : ''}`}>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Destination</h4>
                            
                            {transferType === 'internal' ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Recipient</label>
                                    <select 
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>James Woods (Son)</option>
                                        <option>Real Estate Mgmt Corp</option>
                                        <option>External - Fidelity</option>
                                        <option>Private Client - Checking 2</option>
                                        {/* Dynamically add verified external accounts to recipient list */}
                                        {accounts.filter(a => a.type === 'External' && a.status === 'active').map(a => (
                                            <option key={a.id} value={a.id}>
                                                External - {a.institution} (•••• {a.accountNumber.slice(-4)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Beneficiary Name</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={16} /></span>
                                            <input 
                                                type="text" 
                                                value={wireBeneficiary}
                                                onChange={(e) => setWireBeneficiary(e.target.value)}
                                                placeholder="Enter full legal name"
                                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bank Name</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Landmark size={16} /></span>
                                            <input 
                                                type="text" 
                                                value={wireBank}
                                                onChange={(e) => setWireBank(e.target.value)}
                                                placeholder="e.g. Chase Bank, NA"
                                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Routing (ABA)</label>
                                            <input 
                                                type="text" 
                                                value={wireRouting}
                                                onChange={(e) => setWireRouting(e.target.value)}
                                                placeholder="9 digits"
                                                maxLength={9}
                                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Number</label>
                                            <input 
                                                type="text" 
                                                value={wireAccountNum}
                                                onChange={(e) => setWireAccountNum(e.target.value)}
                                                placeholder="Account #"
                                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {transferType === 'internal' ? 'Transfer Funds' : 'Initiate Wire Transfer'}
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4">
                            {transferType === 'internal' 
                                ? 'Internal transfers are processed immediately.' 
                                : 'Wire transfers initiated after 4:00 PM EST will be processed the next business day.'}
                        </p>
                    </div>
                </form>
            )}
            </div>
        </div>

        {/* Recent 3rd Party Activity Section */}
        {transferType === 'wire' && (
            <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Recent 3rd Party Activity</h3>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Beneficiary</th>
                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                                <th className="px-6 py-3 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentWires.map(wire => (
                                <tr key={wire.id} className="text-sm">
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{wire.date}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{wire.beneficiary}</td>
                                    <td className="px-6 py-4 text-right text-slate-900 dark:text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(wire.amount)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            {wire.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        <LinkAccountModal 
            isOpen={showLinkModal}
            onClose={() => setShowLinkModal(false)}
            onAddAccount={onAddAccount}
        />
        
        <VerifyAccountModal 
            isOpen={!!showVerifyAccountModal}
            onClose={() => setShowVerifyAccountModal(null)}
            onVerify={(otp, amounts) => {
                if (showVerifyAccountModal) onVerifyAccount(showVerifyAccountModal);
                setShowVerifyAccountModal(null);
            }}
        />
    </div>
  );
};

// --- Investments View ---
export const InvestmentsView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [showTradeModal, setShowTradeModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
       <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Investment Portfolio</h2>
            <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Export Report</button>
                <button 
                    onClick={() => setShowTradeModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Trade
                </button>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96">
                <SpendingChart isDarkMode={isDarkMode} />
            </div>
            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">Asset Allocation</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'US Equities', val: '45%', color: 'bg-blue-600' },
                            { label: 'Intl Equities', val: '20%', color: 'bg-indigo-500' },
                            { label: 'Fixed Income', val: '25%', color: 'bg-emerald-500' },
                            { label: 'Cash & Alts', val: '10%', color: 'bg-amber-500' }
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{item.val}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: item.val }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
       </div>
       
       {showTradeModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTradeModal(false)}></div>
               <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
                   <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Quick Trade</h3>
                   <div className="space-y-3 mb-6">
                       <input type="text" placeholder="Symbol (e.g. AAPL)" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
                       <div className="flex gap-2">
                           <input type="number" placeholder="Shares" className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
                           <select className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-600 dark:text-slate-300">
                               <option>Buy</option>
                               <option>Sell</option>
                           </select>
                       </div>
                   </div>
                   <div className="flex gap-2">
                       <button onClick={() => setShowTradeModal(false)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                       <button onClick={() => setShowTradeModal(false)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Execute</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

// --- Security View ---
export const SecurityView = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Security Center</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Account Protection</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Status: Secure</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-3">
                            <Smartphone size={18} className="text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">2-Factor Authentication</span>
                        </div>
                        <div 
                            onClick={() => setMfaEnabled(!mfaEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${mfaEnabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${mfaEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-3">
                            <Lock size={18} className="text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">Password Last Changed</span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">30 days ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center space-x-3">
                            <Eye size={18} className="text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">Face ID Login</span>
                        </div>
                        <div 
                            onClick={() => setFaceIdEnabled(!faceIdEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${faceIdEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${faceIdEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Logins</h3>
                <div className="space-y-4">
                    {[
                        { device: 'iPhone 15 Pro', loc: 'San Francisco, CA', time: 'Current Session' },
                        { device: 'MacBook Pro', loc: 'San Francisco, CA', time: 'Yesterday at 4:20 PM' },
                        { device: 'iPad Air', loc: 'Palo Alto, CA', time: 'May 20 at 9:15 AM' }
                    ].map((login, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{login.device}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{login.loc}</p>
                            </div>
                            <span className="text-xs text-slate-400">{login.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

// --- Settings View ---
interface SettingsViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings & Preferences</h2>
        
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
             
             {/* Profile Section */}
             <div className="p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-white dark:border-slate-700">
                   {USER_NAME.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{USER_NAME}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Private Client Member</p>
                    <p className="text-xs text-slate-400 mt-1">Client ID: 8842-1939-22</p>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-95">Edit Profile</button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95">Manage Access</button>
                    </div>
                </div>
             </div>

             {/* Appearance */}
             <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" onClick={toggleTheme}>
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                        {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Appearance</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Current theme: {isDarkMode ? 'Dark' : 'Light'}</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
             </div>

             {/* Notifications */}
             <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                        <Bell size={22} />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Notifications</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage alerts for transactions and security</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
             </div>

             {/* Documents */}
             <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                        <FileText size={22} />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Statements & Documents</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">View tax forms and monthly statements</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
             </div>
        </div>
    </div>
  );
};
