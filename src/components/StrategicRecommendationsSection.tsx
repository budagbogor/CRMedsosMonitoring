import React, { useState } from 'react';
import { Target, CheckSquare, Square, AlertCircle, TrendingUp, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { StrategicRecommendation } from '../types';

interface StrategicRecommendationsSectionProps {
  recommendations: StrategicRecommendation[];
}

export const StrategicRecommendationsSection: React.FC<StrategicRecommendationsSectionProps> = ({
  recommendations
}) => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8" id="rekomendasi-strategis">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              7. Rekomendasi Strategis Operasional Manajemen
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Langkah aksi operasional konkret yang diprioritaskan berdasarkan dampak pada kepuasan pelanggan dan perbaikan rating.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Progress Eksekusi: <span className="font-bold text-slate-900">{Object.values(completedMap).filter(Boolean).length} / {recommendations.length}</span> Selesai
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isDone = completedMap[rec.id] || false;

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-xl border border-slate-200 transition-all ${
                isDone 
                  ? 'bg-emerald-50/40 border-emerald-300 opacity-75 border-l-4 border-l-emerald-500' 
                  : rec.priority === 'Critical' 
                    ? 'bg-red-50/20 border-red-200 hover:border-red-300 shadow-2xs border-l-4 border-l-red-600' 
                    : rec.priority === 'High'
                      ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs border-l-4 border-l-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs border-l-4 border-l-slate-400'
              }`}
            >
              <div className="flex items-start gap-4">
                
                {/* Checkbox toggle for execution */}
                <button
                  onClick={() => toggleComplete(rec.id)}
                  className="mt-1 text-slate-500 hover:text-emerald-600 transition-colors focus:outline-none"
                  title="Tandai Selesai Dieksekusi"
                >
                  {isDone ? (
                    <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-700 hover:text-slate-500" />
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
                          ? 'bg-amber-500 text-slate-950 font-extrabold' 
                          : 'bg-slate-200 text-slate-800'
                    }`}>
                      Prioritas: {rec.priority}
                    </span>

                    {/* Category Badge */}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-slate-900">
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
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    
                    {/* Target Branches */}
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Target Cabang:</span>
                      <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
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
