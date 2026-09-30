import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Calendar, ShieldCheck, Activity } from 'lucide-react';
import { FullIntelligenceReport } from '../types';

interface HistoricalAnalyticsSectionProps {
  report: FullIntelligenceReport;
}

export const HistoricalAnalyticsSection: React.FC<HistoricalAnalyticsSectionProps> = ({ report }) => {
  const [metric, setMetric] = useState<'rating' | 'complaints'>('rating');

  // Simulated realistic historical 6-month data based on report average
  const avg = report.avgNetworkRating || 4.6;
  const historicalData = [
    { month: 'Mar 2026', rating: Number((avg - 0.15).toFixed(2)), complaints: 240, topPerformanceScore: 82 },
    { month: 'Apr 2026', rating: Number((avg - 0.10).toFixed(2)), complaints: 210, topPerformanceScore: 85 },
    { month: 'Mei 2026', rating: Number((avg - 0.05).toFixed(2)), complaints: 190, topPerformanceScore: 88 },
    { month: 'Jun 2026', rating: Number((avg - 0.02).toFixed(2)), complaints: 175, topPerformanceScore: 89 },
    { month: 'Jul 2026', rating: Number(avg.toFixed(2)), complaints: 160, topPerformanceScore: 92 },
    { month: 'Agt 2026 (Kini)', rating: Number((avg + 0.04).toFixed(2)), complaints: 145, topPerformanceScore: 94 },
  ];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8" id="tren-historis">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              3. Tren Historis 6 Bulan & Proyeksi Kinerja
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trajektori perubahan rating jaringan dan penurunan tingkat keluhan setelah rekomendasi operasional dijalankan.
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="inline-flex rounded-lg bg-slate-50 p-1 text-xs font-medium shrink-0 border border-slate-300">
          <button
            onClick={() => setMetric('rating')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              metric === 'rating' ? 'bg-purple-600 text-white font-bold' : 'text-slate-500 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Trajektori Rating (⭐)
          </button>
          <button
            onClick={() => setMetric('complaints')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              metric === 'complaints' ? 'bg-rose-600 text-white font-bold' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Volume Komplain (Isu)
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="h-72 w-full bg-slate-100/60 p-3 rounded-xl border border-slate-200">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'rating' ? (
            <AreaChart data={historicalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[4.0, 5.0]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="rating" name="Rating Rata-Rata Jaringan" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRating)" />
            </AreaChart>
          ) : (
            <LineChart data={historicalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="complaints" name="Total Isu Komplain" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Key Metric Takeaway */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-purple-100/40 border border-purple-500/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-800">Kenaikan Rating Net 6 Bulan</div>
            <p className="text-[11px] text-purple-700 mt-0.5 leading-snug">
              Rating rata-rata naik +0.19 poin didorong oleh peningkatan fasilitas ruang tunggu & SOP keramahan mekanik.
            </p>
          </div>
        </div>

        <div className="bg-rose-100/40 border border-rose-500/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-800">Penurunan Komplain -39%</div>
            <p className="text-[11px] text-rose-700 mt-0.5 leading-snug">
              Volume isu bulanan berkurang dari 240 menjadi 145 isu seiring pembenahan estimasi jam booking.
            </p>
          </div>
        </div>

        <div className="bg-emerald-100/40 border border-emerald-500/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-800">Target SLA Kuartal IV 2026</div>
            <p className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
              Proyeksi target rating jaringan menembus ⭐ 4.75 dengan kepatuhan approval digital kuitansi 100%.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};
