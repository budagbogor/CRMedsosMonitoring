import React, { useState } from 'react';
import { Target, CheckSquare, Square, TrendingUp, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { StrategicRecommendation } from '../types';

interface StrategicRecommendationsSectionProps {
  recommendations: StrategicRecommendation[];
  onSyncRecommendationsAI?: () => Promise<void>;
  isSyncing?: boolean;
  lastSyncedAt?: string;
}

export const StrategicRecommendationsSection: React.FC<StrategicRecommendationsSectionProps> = ({
  recommendations,
  onSyncRecommendationsAI,
  isSyncing = false,
  lastSyncedAt,
}) => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8 transition-all hover:shadow-2xl" id="rekomendasi-strategis">
      
      {/* Title Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              7. Rekomendasi Strategis Operasional Manajemen
            </h3>
            {lastSyncedAt ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi AI Executive Strategist
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Actionable Insights
              </span>
            )}
            {lastSyncedAt && (
              <span className="text-[11px] text-slate-500 font-medium">
                (Sinkronisasi: {lastSyncedAt})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Langkah aksi operasional konkret yang diprioritaskan berdasarkan dampak pada kepuasan pelanggan dan perbaikan rating.
          </p>
        </div>

        {/* Right Action & Progress */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Progress Eksekusi: <span className="font-bold text-emerald-700">{Object.values(completedMap).filter(Boolean).length} / {recommendations.length}</span> Selesai
          </div>

          {onSyncRecommendationsAI && (
            <button
              onClick={onSyncRecommendationsAI}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Rumuskan ulang rekomendasi aksi operasional berbasis data keluhan terbaru"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Merumuskan Strategi AI...' : 'Rekomendasi Strategis AI Baru'}
            </button>
          )}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isDone = completedMap[rec.id] || false;

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-xl border transition-all ${
                isDone 
                  ? 'bg-emerald-50/50 border-emerald-300 opacity-80 border-l-4 border-l-emerald-600 shadow-xs' 
                  : rec.priority === 'Critical' 
                    ? 'bg-white border-slate-200 hover:border-red-300 shadow-sm border-l-4 border-l-rose-600' 
                    : rec.priority === 'High'
                      ? 'bg-white border-slate-200 hover:border-amber-300 shadow-sm border-l-4 border-l-amber-500'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm border-l-4 border-l-blue-500'
              }`}
            >
              <div className="flex items-start gap-4">
                
                {/* Checkbox toggle for execution */}
                <button
                  onClick={() => toggleComplete(rec.id)}
                  className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none cursor-pointer"
                  title="Tandai Selesai Dieksekusi"
                >
                  {isDone ? (
                    <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Rekomendasi #{index + 1}
                    </span>

                    {/* Priority Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      rec.priority === 'Critical' 
                        ? 'bg-rose-600 text-white' 
                        : rec.priority === 'High' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold' 
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      Prioritas: {rec.priority}
                    </span>

                    {/* Category Badge */}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {rec.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className={`text-base font-bold text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}`}>
                    {rec.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Target Branches & Impact Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    
                    {/* Target Branches */}
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Target Cabang:</span>
                      <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        {rec.targetBranches.join(', ')}
                      </span>
                    </div>

                    {/* Expected Impact */}
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dampak Diharapkan: {rec.expectedImpact}</span>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
