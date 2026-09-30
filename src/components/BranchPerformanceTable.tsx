import React, { useState, useMemo } from 'react';
import { Star, ArrowUpDown, Search, AlertCircle, CheckCircle, HelpCircle, Eye, AlertTriangle, TrendingUp, TrendingDown, Minus, ArrowRightLeft, Sparkles, RefreshCw, Clock } from 'lucide-react';
import { BranchData, BranchStatus } from '../types';

interface BranchPerformanceTableProps {
  branches: BranchData[];
  redFlagIds: string[];
  onSelectBranch: (branch: BranchData, initialTab?: 'overview' | 'complaints') => void;
  selectedCompareIds: string[];
  onToggleCompareBranch: (branch: BranchData) => void;
  onOpenCompareModal: () => void;
  currentBrandName?: string;
  onSyncBranchPerformanceAI?: () => void;
  isSyncingPerformance?: boolean;
  lastAISyncTimestamp?: string;
  autoSyncInterval?: string;
  onOpenAISettings?: () => void;
}

export const BranchPerformanceTable: React.FC<BranchPerformanceTableProps> = ({
  branches,
  redFlagIds,
  onSelectBranch,
  selectedCompareIds,
  onToggleCompareBranch,
  onOpenCompareModal,
  currentBrandName,
  onSyncBranchPerformanceAI,
  isSyncingPerformance = false,
  lastAISyncTimestamp,
  autoSyncInterval = 'off',
  onOpenAISettings,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'rating' | 'reviewCount' | 'complaintCount'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [scrapingBranchId, setScrapingBranchId] = useState<string | null>(null);

  const handleRowScrape = async (branch: BranchData) => {
    if (scrapingBranchId) return; // Prevent multiple clicks
    setScrapingBranchId(branch.id);
    const url = branch.mapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(branch.name + ' ' + branch.city)}`;
    try {
      const response = await fetch('/api/scrape-google-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, branchName: branch.name }),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert(`Gagal scrape ${branch.name}: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Gagal menghubungi server: ${err.message}`);
    } finally {
      setScrapingBranchId(null);
    }
  };

  // Strict Brand Isolation + Filter & Sort
  const sortedAndFilteredBranches = useMemo(() => {
    let result = [...branches];

    // Filter by Brand Isolation if brandName is supplied
    if (currentBrandName) {
      const clean = currentBrandName.toLowerCase().replace(/[^a-z0-9]/g, '');
      let brandKey = '';
      if (clean.includes('bquik')) brandKey = 'bquik';
      else if (clean.includes('mobeng')) brandKey = 'mobeng';
      else if (clean.includes('astra')) brandKey = 'astra';
      else if (clean.includes('shop')) brandKey = 'shop';
      else if (clean.includes('bos')) brandKey = 'bos';
      else if (clean.includes('nasmoco')) brandKey = 'nasmoco';

      if (brandKey) {
        result = result.filter((b) => {
          const bClean = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return bClean.includes(brandKey);
        });
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          (b.address && b.address.toLowerCase().includes(q))
      );
    }

    // Filter by Status
    if (statusFilter !== 'ALL') {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [branches, searchQuery, statusFilter, sortField, sortOrder, currentBrandName]);

  const handleSort = (field: 'rating' | 'reviewCount' | 'complaintCount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: BranchStatus, isRedFlag: boolean) => {
    if (isRedFlag || status === 'Attention Required') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-bold text-[9px] uppercase tracking-wider inline-flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          CRITICAL ISSUE
        </span>
      );
    }
    if (status === 'Top') {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold text-[9px] uppercase tracking-wider inline-flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-600" />
          TOP PERFORMANCE
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-[9px] uppercase tracking-wider inline-flex items-center gap-1">
        <HelpCircle className="w-3 h-3 text-blue-600" />
        MEDIUM
      </span>
    );
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8" id="tabel-komparasi">
      
      {/* Section Title Header & AI Trigger Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              1. Tabel Komparasi Performa Cabang
            </h3>
            {lastAISyncTimestamp && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-100/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-emerald-600" />
                Ditarik AI: {lastAISyncTimestamp}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Seluruh cabang terdeteksi diurutkan dari rating Google Review tertinggi hingga terendah untuk identifikasi pemetaan jaringan.
          </p>
        </div>

        {/* AI Performance Sync Button & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onSyncBranchPerformanceAI && (
            <button
              onClick={onSyncBranchPerformanceAI}
              disabled={isSyncingPerformance}
              title="Tarik & perbarui rating, jumlah ulasan, serta komplain setiap cabang langsung menggunakan Google Search Grounding AI"
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg inline-flex items-center gap-2 transition-all ${
                isSyncingPerformance
                  ? 'bg-slate-50 text-amber-600 border border-amber-500/50 cursor-wait'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20 active:scale-95'
              }`}
            >
              {isSyncingPerformance ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>AI Sedang Menarik Performance...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>🤖 Tarik Performance Cabang via AI</span>
                </>
              )}
            </button>
          )}

          {autoSyncInterval !== 'off' && (
            <button
              onClick={onOpenAISettings}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-amber-500/30 rounded-xl text-[11px] font-semibold text-amber-700 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-Sync AI: {autoSyncInterval}
            </button>
          )}
        </div>
      </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Table Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari cabang / kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="inline-flex rounded-lg bg-slate-50 p-1 text-xs font-medium border border-slate-300">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'ALL' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Semua ({branches.length})
            </button>
            <button
              onClick={() => setStatusFilter('Top')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'Top' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              Top (⭐ 4.7+)
            </button>
            <button
              onClick={() => setStatusFilter('Medium')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'Medium' ? 'bg-amber-600 text-white font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setStatusFilter('Attention Required')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'Attention Required' ? 'bg-rose-600 text-white font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              Red Flag ({redFlagIds.length})
            </button>
          </div>

          {/* Trigger Compare Modal Button */}
          {selectedCompareIds.length > 0 && (
            <button
              onClick={onOpenCompareModal}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5 animate-bounce"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Bandingkan ({selectedCompareIds.length}/3)</span>
            </button>
          )}

        </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100/80 text-xs uppercase text-slate-500 font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="py-3.5 px-3 w-10 text-center">
                Pilih
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[220px]">
                Nama Cabang / Lokasi
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap"
                onClick={() => handleSort('rating')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Rating Google</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap"
                onClick={() => handleSort('reviewCount')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Jumlah Ulasan</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap"
                onClick={() => handleSort('complaintCount')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Isu / Komplain</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap">
                Status Kinerja
              </th>
              <th scope="col" className="py-3.5 px-4 text-right whitespace-nowrap">
                Aksi Deep-Dive
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white/60">
            {sortedAndFilteredBranches.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                  Tidak ada cabang yang memenuhi kriteria pencarian.
                </td>
              </tr>
            ) : (
              sortedAndFilteredBranches.map((branch, index) => {
                const isRedFlag = redFlagIds.includes(branch.id) || branch.status === 'Attention Required';
                const isSelectedForCompare = selectedCompareIds.includes(branch.id);

                return (
                  <tr
                    key={branch.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isRedFlag ? 'bg-rose-100/30' : ''
                    } ${isSelectedForCompare ? 'bg-amber-100/40 font-semibold' : ''}`}
                  >
                    {/* Column 0: Compare Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelectedForCompare}
                        onChange={() => onToggleCompareBranch(branch)}
                        title="Pilih untuk membandingkan cabang"
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                      />
                    </td>
                    {/* Column 1: Branch Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs font-mono font-bold text-slate-500 mt-0.5 min-w-[18px]">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{branch.name}</span>
                            {isRedFlag && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                                RED FLAG
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            📍 {branch.city} {branch.address ? `• ${branch.address}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Google Review Rating */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-base font-extrabold ${
                          branch.rating >= 4.7 ? 'text-emerald-600' : branch.rating >= 4.5 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {branch.rating.toFixed(1)}
                        </span>
                        <div className="flex text-amber-600">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Review Count */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {branch.reviewCount.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">ulasan</span>
                    </td>

                    {/* Column 4: Complaint Count & Trend */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectBranch(branch, 'complaints')}
                          title="Klik untuk melihat detail list ulasan komplain unit usaha ini"
                          className={`px-2 py-0.5 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer hover:scale-105 hover:underline ${
                            branch.complaintCount > 50 
                              ? 'bg-rose-500/20 text-rose-700 border border-rose-500/40 hover:bg-rose-500/30' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>{branch.complaintCount} Ulasan Komplain &raquo;</span>
                        </button>

                        {/* Trend indicator */}
                        {branch.trendScore === 'improving' && (
                          <span className="text-emerald-600 flex items-center text-xs font-medium" title="Tren Meningkat (3 bulan)">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +3m
                          </span>
                        )}
                        {branch.trendScore === 'declining' && (
                          <span className="text-rose-600 flex items-center text-xs font-bold animate-pulse" title="Tren Penurunan (3 bulan)">
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -3m
                          </span>
                        )}
                        {branch.trendScore === 'stable' && (
                          <span className="text-slate-500 flex items-center text-xs" title="Stabil">
                            <Minus className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Status Kinerja */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(branch.status, isRedFlag)}
                    </td>

                    {/* Column 6: Action Button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleRowScrape(branch)}
                          disabled={scrapingBranchId === branch.id}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-xs gap-1 disabled:opacity-50"
                          title="Scrape Data Google Maps Cabang Ini"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${scrapingBranchId === branch.id ? 'animate-spin' : ''}`} />
                          <span>Scrape</span>
                        </button>
                        <button
                          onClick={() => onSelectBranch(branch, 'overview')}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors shadow-xs gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>Ringkasan</span>
                        </button>
                        <button
                          onClick={() => onSelectBranch(branch, 'complaints')}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-100/80 text-rose-700 border border-rose-800 hover:bg-rose-50 transition-colors shadow-xs gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Detail Isu</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
