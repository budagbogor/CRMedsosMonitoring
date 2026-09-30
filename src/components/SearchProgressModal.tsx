import React from 'react';
import { Sparkles, Building2, Search, MessageSquare, Share2, FileCheck, RefreshCw } from 'lucide-react';
import { SearchState } from '../types';

interface SearchProgressModalProps {
  searchState: SearchState;
  targetQuery: string;
}

export const SearchProgressModal: React.FC<SearchProgressModalProps> = ({ searchState, targetQuery }) => {
  if (!searchState.isLoading) return null;

  const steps = [
    { key: 'mapping_network', label: 'Mapping Network & Branch Discovery', icon: Building2, desc: 'Mencari lokasi cabang & alamat resmi...' },
    { key: 'fetching_reviews', label: 'Extracting Google Reviews & Ratings', icon: Search, desc: 'Mengambil data rating & volume ulasan per cabang...' },
    { key: 'analyzing_complaints', label: 'Complaint Mining & Positive Extraction', icon: MessageSquare, desc: 'Menganalisis poin keluhan & keunggulan layanan...' },
    { key: 'tracking_social', label: 'Social Sentiment & Media Search', icon: Share2, desc: 'Melacak isu viral & persepsi publik di media sosial...' },
    { key: 'synthesizing', label: 'Executive Synthesis & Recommendations', icon: FileCheck, desc: 'Menyusun laporan komparatif & aksi strategis...' }
  ];

  const getCurrentStepIndex = () => {
    switch (searchState.step) {
      case 'mapping_network': return 0;
      case 'fetching_reviews': return 1;
      case 'analyzing_complaints': return 2;
      case 'tracking_social': return 3;
      case 'synthesizing': return 4;
      default: return 0;
    }
  };

  const currentIdx = getCurrentStepIndex();

  return (
    <div className="fixed inset-0 z-50 bg-slate-100/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        
        {/* Animated Glow Accent */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>

        <div className="relative text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
            <RefreshCw className="w-7 h-7 text-slate-950 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Memproses Deep-Search Grounding
          </h3>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            "{targetQuery}"
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Menghubungkan ke Google Search Engine & Gemini AI untuk ekstraksi real-time.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-50 rounded-full h-2 mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${searchState.progressPercent}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-3 text-xs">
          {steps.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            const isCurrent = idx === currentIdx;
            const isCompleted = idx < currentIdx;

            return (
              <div 
                key={stepItem.key}
                className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  isCurrent 
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 font-bold' 
                    : isCompleted 
                      ? 'bg-slate-50/40 border-slate-300/50 text-emerald-600 font-medium' 
                      : 'bg-slate-100/40 border-slate-200/40 text-slate-500'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent 
                    ? 'bg-amber-500 text-slate-950 font-bold animate-bounce' 
                    : isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-600' 
                      : 'bg-slate-50 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{stepItem.label}</span>
                    {isCompleted && <span className="text-[10px] text-emerald-600 font-bold">SELESAI ✓</span>}
                    {isCurrent && <span className="text-[10px] text-amber-600 font-bold animate-pulse">PROSES...</span>}
                  </div>
                  {isCurrent && (
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">{stepItem.desc}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
