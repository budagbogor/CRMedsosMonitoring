import React, { useState } from 'react';
import { Search, Sparkles, Building2, Download, Printer, RefreshCw, Cpu, Layers, BellRing, Mail } from 'lucide-react';
import { AIConfig } from '../types';

interface HeaderProps {
  currentBrand: string;
  onSearch: (brandName: string) => void;
  isLoading: boolean;
  presetBrands: string[];
  aiConfig: AIConfig;
  onOpenAISettings: () => void;
  onOpenCSAutomation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBrand,
  onSearch,
  isLoading,
  presetBrands,
  aiConfig,
  onOpenAISettings,
  onOpenCSAutomation,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const getProviderIcon = () => {
    if (aiConfig.provider === 'sumopod') return '🚀';
    if (aiConfig.provider === 'openai') return '⚡';
    return '🤖';
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xl">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
        
        {/* Main Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
              <Building2 className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  ANALISIS PERFORMA KOMPREHENSIF
                </h1>
                <div className="hidden sm:flex items-center gap-1 bg-blue-600/20 border border-blue-500/40 rounded px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" /> CONFIDENTIAL
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AutoReputation AI • Multi-Location Business & Reputation Intelligence
              </p>
            </div>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-lg">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ketik nama bisnis / bengkel (Tekan Ctrl+K untuk cari)..."
                className="w-full pl-10 pr-28 py-2 bg-slate-50/90 border border-slate-300/80 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <span>Deep Search</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Settings Trigger & Export Buttons */}
          <div className="flex items-center space-x-2 justify-end">
            
            {/* CS Email Automation Settings Button */}
            <button
              onClick={onOpenCSAutomation}
              title="Pengaturan Otomasi Sync Medsos & Email CS (budagbogor@gmail.com)"
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-100/80 hover:bg-amber-50 text-amber-800 border border-amber-500/50 transition-all gap-1.5 shadow-md ring-1 ring-amber-500/20"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-600" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                Email CS & Otomasi
              </span>
            </button>

            {/* AI Engine Button */}
            <button
              onClick={onOpenAISettings}
              title="Pengaturan Engine AI, Model, & Key"
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-100/80 hover:bg-indigo-50 text-indigo-800 border border-indigo-500/50 transition-all gap-1.5 shadow-md ring-1 ring-indigo-500/20"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {getProviderIcon()} {aiConfig.provider.toUpperCase()}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Presets & AI Engine Summary */}
        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-500" /> Preset Fast-Load:
            </span>
            {presetBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => onSearch(brand)}
                disabled={isLoading}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all shrink-0 border ${
                  currentBrand.toLowerCase().includes(brand.toLowerCase())
                    ? 'bg-blue-600/30 text-blue-700 border-blue-500/50 font-bold ring-1 ring-blue-500/40'
                    : 'bg-slate-50/60 text-slate-700 border-slate-300/60 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-700 font-mono">
              <Cpu className="w-3 h-3 text-blue-600" /> Model: <strong className="text-slate-900">{aiConfig.model}</strong>
            </span>
            {aiConfig.useOrchestration && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-bold flex items-center gap-1 border border-emerald-500/30">
                <Layers className="w-3 h-3" /> Multi-Agent 5 Skill Aktif
              </span>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

