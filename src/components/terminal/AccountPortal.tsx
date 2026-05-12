import React, { useState } from 'react';
import { X, Wallet, ClipboardList, Smartphone, User, Landmark, Heart, Headphones, FileText, ChevronRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usePortfolioStore } from '../../store/portfolio-store';

interface AccountPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PortalView = 'main' | 'funds';

export function AccountPortal({ isOpen, onClose }: AccountPortalProps) {
  const [view, setView] = useState<PortalView>('main');
  const summary = usePortfolioStore((state) => state.summary);
  const adjustCash = usePortfolioStore((state) => state.adjustCash);
  
  const [amountInput, setAmountInput] = useState<string>('');

  if (!isOpen) return null;

  const currentBalance = summary.cashBalance;

  const handleAddFunds = () => {
    const val = parseFloat(amountInput);
    if (!isNaN(val) && val > 0) {
      adjustCash(val);
      setAmountInput('');
    }
  };

  const handleWithdrawFunds = () => {
    const val = parseFloat(amountInput);
    if (!isNaN(val) && val > 0 && val <= currentBalance) {
      adjustCash(-val);
      setAmountInput('');
    }
  };

  const fmtCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(val);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Portal Panel (Slide-in Drawer style for Dashboard consistency) */}
      <div className="fixed inset-y-0 right-0 z-[101] w-[380px] bg-[#0c0e12] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 select-none text-zinc-100">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          {view === 'funds' ? (
            <button onClick={() => setView('main')} className="p-1 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          ) : (
            <span className="font-bold font-mono text-xs text-zinc-500 tracking-widest uppercase">Account Nexus</span>
          )}
          
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors ml-auto">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {view === 'main' && (
            <div className="flex flex-col">
              {/* Profile Avatar Region */}
              <div className="flex flex-col items-center pt-8 pb-6">
                <div className="relative">
                   <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-3xl font-bold text-emerald-400 border-2 border-black">
                         BK
                      </div>
                   </div>
                   {/* The dynamic badge text overlay style */}
                   <div className="absolute -inset-2 rounded-full border border-dashed border-emerald-500/30 animate-[spin_20s_linear_infinite]" />
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-tight">Benjamin Koshy Alex</h2>
                <p className="text-[10px] font-mono text-emerald-500/60 mt-1 tracking-widest uppercase">Member Since May'26</p>
              </div>

              {/* Balance Card */}
              <div className="mx-4 mb-6 bg-[#161b22] border border-white/5 rounded-xl p-4 flex flex-col gap-4 relative group overflow-hidden transition-all hover:border-emerald-500/20">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/5 rounded-lg text-zinc-400">
                          <Wallet className="w-5 h-5" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] text-zinc-400">Stocks, F&O Balance</span>
                          <span className="text-xl font-bold font-mono mt-0.5">{fmtCurrency(currentBalance)}</span>
                       </div>
                    </div>
                    
                    <button 
                       onClick={() => setView('funds')}
                       className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                    >
                       <Plus className="w-3.5 h-3.5" /> Add money
                    </button>
                 </div>
              </div>

              {/* Menu Options list mimicking user reference exactly */}
              <div className="flex flex-col px-2">
                {[
                  { icon: ClipboardList, label: 'Orders' },
                  { icon: Smartphone, label: 'UPI' },
                  { icon: User, label: 'Account details' },
                  { icon: Landmark, label: 'Banks & AutoPay' },
                  { icon: Heart, label: 'Refer & Invite' },
                  { icon: Headphones, label: 'Customer support 24x7' },
                  { icon: FileText, label: 'Reports' }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    className="flex items-center justify-between px-4 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                      <span className="text-sm text-zinc-300 font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === 'funds' && (
            <div className="flex flex-col p-5 h-full">
              <h3 className="text-xs text-zinc-400 uppercase font-mono tracking-wider mb-1">Balance Strategy</h3>
              <h2 className="text-3xl font-bold tracking-tight mb-8 font-mono">{fmtCurrency(currentBalance)}</h2>

              <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 flex flex-col gap-4 shadow-inner">
                 <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-sm text-zinc-300">Available Cash</span>
                    <span className="font-bold font-mono">{fmtCurrency(currentBalance)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                       <span className="text-sm text-zinc-300">Pledge</span>
                       <span className="text-[10px] text-zinc-500">Add balance by pledging holdings</span>
                    </div>
                    <button className="text-emerald-400 font-bold text-sm hover:underline">Add</button>
                 </div>
              </div>

              {/* Numerical Manipulator Pad (Added functionality for actual usability) */}
              <div className="mt-auto pb-6 flex flex-col gap-6 mt-10">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">Simulation Injection Amount</label>
                    <div className="relative flex items-center bg-black border border-white/10 rounded-lg focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                       <span className="pl-4 pr-2 text-zinc-500 font-bold">₹</span>
                       <input 
                          type="number" 
                          placeholder="0.00"
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          className="w-full bg-transparent py-4 outline-none font-mono text-lg text-white placeholder:text-zinc-700"
                       />
                    </div>
                    {/* quick tags */}
                    <div className="flex gap-2 mt-1">
                       {['500', '1000', '5000'].map(tag => (
                          <button 
                             key={tag} 
                             onClick={() => setAmountInput(tag)}
                             className="text-[10px] px-3 py-1 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-white/5"
                          >
                             +₹{tag}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <button 
                       onClick={handleWithdrawFunds}
                       disabled={!amountInput}
                       className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 font-bold text-zinc-300 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <Minus className="w-4 h-4" /> Withdraw
                    </button>
                    <button 
                       onClick={handleAddFunds}
                       disabled={!amountInput}
                       className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_10px_20px_rgba(16,185,129,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <Plus className="w-4 h-4" /> Add money
                    </button>
                 </div>
                 
                 <p className="text-[9px] text-zinc-500 font-mono text-center mt-2">NOTE: This adjusts Paper Trading simulation capital only.</p>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
