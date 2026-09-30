import React from 'react';
import { Star, AlertTriangle, ShieldCheck, TrendingUp, Calendar } from 'lucide-react';
import { FullIntelligenceReport } from '../types';

interface ExecutiveSummaryBannerProps {
  report: FullIntelligenceReport;
}

export const ExecutiveSummaryBanner: React.FC<ExecutiveSummaryBannerProps> = ({ report }) => {
  const redFlagCount = report.redFlagBranchIds.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8 relative overflow-hidden">
      {/* Blue accent top border line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-700 border border-blue-500/30">
              Laporan Analisis Performa
            </span>
            <span className="flex items-center text-xs text-slate-500 font-medium gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Periode Laporan: {report.analysisDate}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Entitas: {report.brandName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis Performa Komprehensif Pemetaan Jaringan Multi-Lokasi & Reputation Intelligence
          </p>
        </div>

        {/* Network Health Status Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-center">
            <span className="block text-[10px] uppercase font-bold text-blue-600 tracking-wider">Executive Summary</span>
            <span className="text-xs font-black text-slate-900 uppercase">CONFIDENTIAL</span>
          </div>
          
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 ${
            redFlagCount === 0 
              ? 'bg-emerald-100/60 border-emerald-500/50 text-emerald-700'
              : redFlagCount <= 2 
                ? 'bg-amber-100/60 border-amber-500/50 text-amber-700'
                : 'bg-rose-100/60 border-rose-500/50 text-rose-700'
          }`}>
            {redFlagCount === 0 ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Status Operasional
              </div>
              <div className="text-xs font-bold">
                {redFlagCount === 0 
                  ? 'Sangat Baik (Stabil)' 
                  : `${redFlagCount} Flag Cabang`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* Metric 1 */}
        <div className="bg-slate-100/60 p-4 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Rata-Rata Rating Google</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">{report.avgNetworkRating.toFixed(1)}</span>
            <span className="text-amber-600 text-xs font-bold pb-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-600" /> / 5.0
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-100/60 p-4 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Ulasan Terdeteksi</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">{report.totalReviewsAnalyzed.toLocaleString('id-ID')}</span>
            <span className="text-slate-500 text-xs pb-1 font-semibold">{report.totalBranchesFound} Cabang</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-100/60 p-4 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Sentimen Media Sosial</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-blue-600">Positif</span>
            <span className="text-slate-500 text-xs pb-1 font-bold">Net {report.socialSentiment?.overallPositivePercentage || 76}%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-100/60 p-4 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Status Kinerja Cabang</p>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-black ${redFlagCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {redFlagCount > 0 ? 'Perhatian' : 'Stabil'}
            </span>
            <span className="text-slate-500 text-xs pb-1">{redFlagCount} Flag</span>
          </div>
        </div>
      </div>

      {/* Ringkasan Eksekutif */}
      <div className="mt-4 p-4 rounded-xl bg-slate-100/80 text-slate-800 border border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-blue-600" /> Ringkasan Eksekutif Management Brief
        </h3>
        <p className="text-xs leading-relaxed text-slate-700 font-normal">
          {report.executiveSummary}
        </p>
      </div>
    </div>
  );
};
