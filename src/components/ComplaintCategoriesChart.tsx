import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Quote, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { ComplaintCategoryBreakdown } from '../types';

interface ComplaintCategoriesChartProps {
  categories: ComplaintCategoryBreakdown[];
  onSyncComplaintsAI?: () => Promise<void>;
  isSyncing?: boolean;
  lastSyncedAt?: string;
  totalAnalyzed?: number;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#6366f1', '#8b5cf6', '#ec4899'];

export const ComplaintCategoriesChart: React.FC<ComplaintCategoriesChartProps> = ({
  categories,
  onSyncComplaintsAI,
  isSyncing = false,
  lastSyncedAt,
  totalAnalyzed,
}) => {
  const totalIssues = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8 transition-all hover:shadow-2xl" id="kategori-keluhan">
      
      {/* Title & Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              4. Categorization & Deep-Dive Analisis Keluhan
            </h3>
            {lastSyncedAt ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi Real Reviews & AI
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Klaster Ulasan Nyata
              </span>
            )}
            {lastSyncedAt && (
              <span className="text-[11px] text-slate-500 font-medium">
                (Terakhir Diperbarui: {lastSyncedAt})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Pengelompokan pola komplain konsumen dari seluruh cabang berdasarkan frekuensi nyata, persentase, dan tingkat keparahan (severity).
          </p>
        </div>

        {/* Sync Button */}
        {onSyncComplaintsAI && (
          <div className="flex items-center gap-3">
            <button
              onClick={onSyncComplaintsAI}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Kumpulkan seluruh ulasan komplain aktual di database dan minta AI mengelompokkan pola keluhan"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Mengelompokkan & AI Analisis...' : 'Analisis & Klasifikasi Keluhan AI'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Visual Donut Chart Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/90 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Distribusi Kategori Komplain Utama (%)
            </h4>
            <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              Total: {totalIssues} Isu
            </span>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="percentage"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={4}
                  label={({ category, percentage }) => `${category.split(' ')[0]} ${percentage}%`}
                  labelLine={false}
                >
                  {categories.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value}% (${Math.round((Number(value) / 100) * totalIssues)} Isu)`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-200 text-[11px]">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate text-slate-700 font-semibold">{cat.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all">
              
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <h4 className="text-sm font-bold text-slate-900">
                    {cat.category}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    {cat.count} Isu ({cat.percentage}%)
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    cat.severity === 'High' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : cat.severity === 'Medium' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {cat.severity} Severity
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
                <div 
                  className="h-2.5 rounded-full transition-all duration-700" 
                  style={{ 
                    width: `${cat.percentage}%`, 
                    backgroundColor: COLORS[idx % COLORS.length] 
                  }}
                />
              </div>

              {/* Sample Customer Quote */}
              {cat.sampleQuotes && cat.sampleQuotes.length > 0 && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="italic text-slate-800 font-medium">
                    "{cat.sampleQuotes[0]}"
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
