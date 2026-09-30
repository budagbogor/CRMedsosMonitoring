import React, { useState } from 'react';
import { MapPin, Star, AlertTriangle, CheckCircle, ChevronRight, Building } from 'lucide-react';
import { BranchData } from '../types';

interface RegionalBranchGridProps {
  branches: BranchData[];
  redFlagIds: string[];
  onSelectBranch: (branch: BranchData, initialTab?: 'overview' | 'complaints') => void;
}

export const RegionalBranchGrid: React.FC<RegionalBranchGridProps> = ({
  branches,
  redFlagIds,
  onSelectBranch,
}) => {
  // Helper to categorize city into regions
  const categorizeRegion = (city: string) => {
    const c = city.toLowerCase();
    if (c.includes('jakarta') || c.includes('bekasi') || c.includes('tangerang') || c.includes('depok') || c.includes('bogor')) {
      return 'Jabodetabek';
    }
    if (c.includes('bandung') || c.includes('cirebon') || c.includes('sukabumi') || c.includes('tasik')) {
      return 'Jawa Barat';
    }
    if (c.includes('semarang') || c.includes('solo') || c.includes('yogyakarta') || c.includes('jogja') || c.includes('magelang')) {
      return 'Jawa Tengah & DIY';
    }
    if (c.includes('surabaya') || c.includes('malang') || c.includes('sidoarjo') || c.includes('jember')) {
      return 'Jawa Timur';
    }
    return 'Luar Jawa & Regional Lain';
  };

  // Group branches by region
  const initialGroups: Record<string, BranchData[]> = {};
  const regionalGroups = branches.reduce((acc, branch) => {
    const region = categorizeRegion(branch.city);
    if (!acc[region]) acc[region] = [];
    acc[region].push(branch);
    return acc;
  }, initialGroups);

  const [activeTab, setActiveTab] = useState<string>('ALL');

  const regionNames = Object.keys(regionalGroups);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8" id="klaster-wilayah">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              2. Pemetaan Klaster Wilayah & Klaster Regional
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelompokan persebaran jaringan cabang berdasarkan zona wilayah operasional dan tingkat kesehatan per zona.
          </p>
        </div>

        {/* Region Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Semua Wilayah ({branches.length})
          </button>
          {regionNames.map((r) => (
            <button
              key={r}
              onClick={() => setActiveTab(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === r
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {r} ({regionalGroups[r].length})
            </button>
          ))}
        </div>
      </div>

      {/* Regional Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionNames
          .filter((r) => activeTab === 'ALL' || activeTab === r)
          .map((region) => {
            const groupBranches = regionalGroups[region];
            const avgRating = groupBranches.reduce((sum, b) => sum + b.rating, 0) / groupBranches.length;
            const totalReviews = groupBranches.reduce((sum, b) => sum + b.reviewCount, 0);
            const redFlags = groupBranches.filter((b) => redFlagIds.includes(b.id) || b.status === 'Attention Required');

            return (
              <div
                key={region}
                className="bg-slate-100/60 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Region Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-600 border border-blue-500/30">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{region}</h4>
                        <div className="text-[11px] text-slate-500">{groupBranches.length} Cabang Terdaftar</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-amber-600 flex items-center gap-1 justify-end">
                        ⭐ {avgRating.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">Rata-Rata Zona</div>
                    </div>
                  </div>

                  {/* Branch Items list */}
                  <div className="space-y-2">
                    {groupBranches.map((b) => {
                      const isRF = redFlagIds.includes(b.id) || b.status === 'Attention Required';
                      return (
                        <div
                          key={b.id}
                          onClick={() => onSelectBranch(b, isRF ? 'complaints' : 'overview')}
                          title={isRF ? "Klik untuk melihat detail list isu komplain Red Flag" : "Klik untuk melihat analisis detail cabang"}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isRF
                              ? 'bg-rose-100/40 border-rose-500/50 text-rose-800 hover:bg-rose-50/60'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5 text-slate-900">
                              <span>{b.name}</span>
                              {isRF && (
                                <span className="px-1 py-0.2 rounded bg-rose-600 text-white font-extrabold text-[9px] uppercase">
                                  RED FLAG
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              ⭐ {b.rating.toFixed(1)} • {b.reviewCount} ulasan
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer Summary */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Total ulasan: <strong className="text-slate-800">{totalReviews.toLocaleString('id-ID')}</strong>
                  </span>
                  {redFlags.length > 0 ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {redFlags.length} Cabang Red Flag
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Zona Aman
                    </span>
                  )}
                </div>

              </div>
            );
          })}
      </div>

    </section>
  );
};
