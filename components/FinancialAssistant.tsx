import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Sparkles, Send, X, Bot, User, ArrowRight } from 'lucide-react';
import { getFinancialInsight } from '../services/geminiService';
import { ChatMessage } from '../types';

export interface FinancialAssistantRef {
  addMessage: (message: ChatMessage) => void;
}

interface FinancialAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialAssistant = forwardRef<FinancialAssistantRef, FinancialAssistantProps>(({ isOpen, onClose }, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: 'Good morning, Mr. Woods. I am your Meridian personal concierge. How may I assist you with your accounts today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    addMessage: (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    }
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const responseText = await getFinancialInsight(userMsg.text);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Meridian Concierge</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini 2.5</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <div className="text-center py-4">
             <p className="text-xs text-slate-400 uppercase tracking-widest">Today</p>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
                  msg.role === 'user' 
                    ? 'bg-slate-200 dark:bg-slate-700 ml-2' 
                    : 'bg-blue-100 dark:bg-blue-900/40 mr-2'
                }`}>
                  {msg.role === 'user' 
                    ? <User size={14} className="text-slate-600 dark:text-slate-300"/> 
                    : <Bot size={14} className="text-blue-600 dark:text-blue-400"/>
                  }
                </div>
                <div>
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                    }`}>
                    {msg.text}
                    </div>
                    {msg.role === 'model' && (
                        <p className="text-[10px] text-slate-400 mt-1 ml-1">Meridian AI • Just now</p>
                    )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="flex justify-start">
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm ml-10">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`ml-2 p-2 rounded-lg transition-all duration-200 ${
                inputValue.trim() 
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                    : 'bg-transparent text-slate-300 dark:text-slate-600'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3">
             AI responses are for informational purposes only.
          </p>
        </div>
    </div>
  );
});

FinancialAssistant.displayName = 'FinancialAssistant';