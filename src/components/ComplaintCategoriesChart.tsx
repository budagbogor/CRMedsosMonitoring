import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AlertTriangle, Quote, MessageCircleWarning, ShieldAlert } from 'lucide-react';
import { ComplaintCategoryBreakdown } from '../types';

interface ComplaintCategoriesChartProps {
  categories: ComplaintCategoryBreakdown[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#6366f1', '#8b5cf6', '#ec4899'];

export const ComplaintCategoriesChart: React.FC<ComplaintCategoriesChartProps> = ({ categories }) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              4. Categorization & Deep-Dive Analisis Keluhan
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelompokan pola komplain konsumen dari seluruh cabang berdasarkan frekuensi, persentase, dan tingkat keparahan (severity).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Visual Chart Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-100/60 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
            Distribusi Kategori Komplain Utama (%)
          </h4>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="percentage"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ category, percentage }) => `${category.split(' ')[0]} ${percentage}%`}
                  labelLine={false}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Persentase']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 text-[11px]">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate text-slate-700 font-medium">{cat.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs">
              
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <h4 className="text-sm font-bold text-slate-900">
                    {cat.category}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    {cat.count} Isu ({cat.percentage}%)
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    cat.severity === 'High' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : cat.severity === 'Medium' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cat.severity} Severity
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${cat.percentage}%`, 
                    backgroundColor: COLORS[idx % COLORS.length] 
                  }}
                />
              </div>

              {/* Sample Customer Quote */}
              {cat.sampleQuotes && cat.sampleQuotes.length > 0 && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <p className="italic text-slate-700">
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
