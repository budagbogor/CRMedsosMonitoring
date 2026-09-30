import React, { useState } from 'react';
import {
  X,
  Mail,
  BellRing,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Building,
  Check,
  Layers,
  FileText,
  Plus
} from 'lucide-react';
import { CSAutomationConfig, FullIntelligenceReport } from '../types';

interface CSAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FullIntelligenceReport;
  config: CSAutomationConfig;
  onSaveConfig: (newConfig: CSAutomationConfig) => void;
}

export const CSAutomationModal: React.FC<CSAutomationModalProps> = ({
  isOpen,
  onClose,
  report,
  config,
  onSaveConfig,
}) => {
  const initialEmails = Array.isArray(config.csEmails) && config.csEmails.length > 0
    ? config.csEmails
    : (config.csEmail ? config.csEmail.split(/[\s,;]+/).filter(Boolean) : ['budagbogor@gmail.com']);

  const [formData, setFormData] = useState<CSAutomationConfig>({
    ...config,
    csEmails: initialEmails,
    csEmail: initialEmails.join(', ')
  });

  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    success: boolean;
    sentTo: string;
    timestamp: string;
    sampleItem: {
      platform: string;
      branch: string;
      customerName: string;
      rating: number;
      type: 'complaint' | 'testimonial' | 'viral';
      text: string;
      urgency: 'HIGH' | 'MEDIUM' | 'LOW';
    };
  } | null>(null);

  if (!isOpen) return null;

  const availablePlatforms = ['Threads', 'Instagram', 'TikTok', 'Google Reviews', 'X/Twitter', 'Facebook', 'YouTube'];

  const handleTogglePlatform = (platform: string) => {
    setFormData((prev) => {
      const exists = prev.monitoredPlatforms.includes(platform);
      const updated = exists
        ? prev.monitoredPlatforms.filter((p) => p !== platform)
        : [...prev.monitoredPlatforms, platform];
      return { ...prev, monitoredPlatforms: updated };
    });
  };

  const handleAddEmail = () => {
    if (!newEmailInput.trim()) return;

    const rawEntries = newEmailInput.split(/[\s,;\n]+/);
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const currentEmails = formData.csEmails || [];
    
    const newEmails: string[] = [];
    let hasInvalid = false;

    for (const raw of rawEntries) {
      const email = raw.trim().toLowerCase();
      if (!email) continue;
      if (!validEmailRegex.test(email)) {
        hasInvalid = true;
        continue;
      }
      if (!currentEmails.includes(email) && !newEmails.includes(email)) {
        newEmails.push(email);
      }
    }

    if (hasInvalid && newEmails.length === 0) {
      setEmailError('Format email tidak valid. Contoh: cs@mobeng.id');
      return;
    }

    if (newEmails.length === 0) {
      setEmailError('Email tersebut sudah ada dalam daftar.');
      return;
    }

    const updatedEmails = [...currentEmails, ...newEmails];
    setFormData((prev) => ({
      ...prev,
      csEmails: updatedEmails,
      csEmail: updatedEmails.join(', ')
    }));

    setNewEmailInput('');
    setEmailError('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmails = (formData.csEmails || []).filter((e) => e !== emailToRemove);
    setFormData((prev) => ({
      ...prev,
      csEmails: updatedEmails,
      csEmail: updatedEmails.join(', ')
    }));
  };

  const handleKeyDownEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      // Pick a sample complaint/review based on report data
      const sampleBranch = report.branches[0] || { name: 'Cabang Jakarta Selatan', rating: 3.2 };
      const sampleQuote = report.complaintCategories[0]?.sampleQuotes[0] || 'Waktu tunggu antrean lama sekali melebihi 2 jam tanpa kepastian slot booking.';

      const targetEmails = (formData.csEmails && formData.csEmails.length > 0)
        ? formData.csEmails.join(', ')
        : (formData.csEmail || 'budagbogor@gmail.com');

      setIsSimulating(false);
      setSimulationResult({
        success: true,
        sentTo: targetEmails,
        timestamp: new Date().toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'medium',
        }),
        sampleItem: {
          platform: 'TikTok & Google Reviews',
          branch: sampleBranch.name,
          customerName: '@BudiPratama_99',
          rating: 2.0,
          type: 'complaint',
          text: sampleQuote,
          urgency: 'HIGH',
        },
      });
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalEmails = formData.csEmails || [];

    // Jika user memasukkan email baru di text box tapi belum menekan tombol Tambah
    if (newEmailInput.trim()) {
      const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const rawEntries = newEmailInput.split(/[\s,;\n]+/);
      for (const raw of rawEntries) {
        const email = raw.trim().toLowerCase();
        if (email && validEmailRegex.test(email) && !finalEmails.includes(email)) {
          finalEmails = [...finalEmails, email];
        }
      }
    }

    if (finalEmails.length === 0) {
      finalEmails = ['budagbogor@gmail.com'];
    }

    const updatedConfig: CSAutomationConfig = {
      ...formData,
      csEmails: finalEmails,
      csEmail: finalEmails.join(', '),
      lastSyncTimestamp: new Date().toISOString(),
    };

    onSaveConfig(updatedConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-300/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
              <BellRing className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Otomasi Sync Medsos & Notifikasi CS Email
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
                  AUTO-SYNC READY
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Penarikan data medsos secara berkala & pengiriman alert ke Customer Service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Target Business Unit Brand Focus */}
          <div className="bg-slate-50/80 border border-blue-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-800 font-bold flex items-center gap-2 text-xs">
                <Building className="w-4 h-4 text-amber-600" />
                Fokus Utama Unit Bisnis / Merek (Default: Mobeng)
              </label>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 text-[10px] font-extrabold uppercase border border-blue-500/30">
                DEFAULT: MOBENG
              </span>
            </div>
            <select
              value={formData.targetBrandFocus || 'Mobeng'}
              onChange={(e) => setFormData({ ...formData, targetBrandFocus: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            >
              <option value="Mobeng">🏆 Mobeng (PT Surga Mobil Indonesia) — Default Utama</option>
              <option value="Astra Otoservice">🚗 Astra Otoservice</option>
              <option value="Shop & Drive">🛒 Shop & Drive</option>
              <option value="B-Quik">⚡ B-Quik Indonesia</option>
              <option value="Bengkel BOS">🔧 Bengkel BOS</option>
            </select>
            <p className="text-[11px] text-slate-500">
              💡 Seluruh pencarian otomatis ulasan, pertanyaan netizen di CS Response Desk, dan notifikasi email CS akan memprioritaskan unit bisnis yang Anda pilih di atas.
            </p>
          </div>

          {/* Email Customer Service Field - Support Multiple Emails */}
          <div className="bg-slate-50/80 border border-slate-300/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-800 font-bold flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4 text-blue-600" />
                Alamat Email Customer Service (CS Target)
              </label>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 text-[10px] font-extrabold font-mono border border-blue-500/30">
                  {(formData.csEmails || []).length} Email Terdaftar
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Dapat direvisi kapan saja</span>
              </div>
            </div>

            {/* List Chip Email Terdaftar */}
            {(formData.csEmails || []).length > 0 && (
              <div className="flex flex-wrap gap-2 p-2.5 bg-slate-100/60 rounded-lg border border-slate-200">
                {(formData.csEmails || []).map((email, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-750 text-blue-700 text-xs font-mono border border-blue-500/30 transition-colors shadow-sm group"
                  >
                    <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-slate-500 transition-colors"
                      title={`Hapus ${email}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input Tambah Email Baru */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newEmailInput}
                  onChange={(e) => {
                    setNewEmailInput(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onKeyDown={handleKeyDownEmail}
                  placeholder="Tambah email (contoh: cs@mobeng.id, manager@mobeng.id)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleAddEmail}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Email</span>
              </button>
            </div>

            {emailError && (
              <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {emailError}
              </p>
            )}

            <p className="text-[11px] text-slate-500">
              💡 Anda dapat memasukkan <strong>lebih dari 1 alamat email</strong> (pisahkan dengan koma atau tekan Enter). Setiap kali sistem menemukan <strong>keluhan baru, ulasan bintang 1-3, atau testimoni viral</strong>, notifikasi detail langsung dikirim ke seluruh alamat email terdaftar di atas.
            </p>
          </div>

          {/* Status Switch & Sync Interval */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Auto Sync Toggle */}
            <div className="bg-slate-50/60 border border-slate-300/60 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <RefreshCw className={`w-4 h-4 ${formData.autoSyncEnabled ? 'text-emerald-600 animate-spin' : 'text-slate-500'}`} />
                  Status Otomasi Penarikan Data
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, autoSyncEnabled: !formData.autoSyncEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.autoSyncEnabled ? 'bg-emerald-600' : 'bg-slate-100'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {formData.autoSyncEnabled
                  ? '✅ Otomasi AKTIF: AI & Background Crawler bekerja menarik ulasan terbaru secara terus-menerus.'
                  : '⚠️ Otomasi NONAKTIF: Penarikan data hanya dilakukan saat tombol pencarian ditekan secara manual.'}
              </p>
            </div>

            {/* Sync Interval Picker */}
            <div className="bg-slate-50/60 border border-slate-300/60 rounded-xl p-4 space-y-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Interval Penarikan Data (Auto-Fetch)
              </label>
              <select
                value={formData.syncInterval}
                onChange={(e) => setFormData({ ...formData, syncInterval: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15m">⏱️ Setiap 15 Menit (Ultra-Fast Monitoring)</option>
                <option value="1h">🕒 Setiap 1 Jam (Sangat Direkomendasikan)</option>
                <option value="6h">🕕 Setiap 6 Jam (Standard Business Hours)</option>
                <option value="24h">📅 Setiap 24 Jam (Rangkuman Harian)</option>
                <option value="realtime">⚡ Real-Time Webhook Streaming (Instant)</option>
              </select>
            </div>
          </div>

          {/* Monitored Platforms */}
          <div className="bg-slate-50/60 border border-slate-300/60 rounded-xl p-4 space-y-3">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Platform Medsos & Jaringan yang Dipantau ({formData.monitoredPlatforms.length} Terpilih)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availablePlatforms.map((platform) => {
                const isSelected = formData.monitoredPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handleTogglePlatform(platform)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-700 shadow-sm'
                        : 'bg-white border-slate-300/80 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{platform}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Email Filters */}
          <div className="bg-slate-50/60 border border-slate-300/60 rounded-xl p-4 space-y-3">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Kriteria Pengiriman Email Notifikasi ke CS
            </label>

            <div className="space-y-2">
              {/* Trigger 1: Red Flag Complaints */}
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-slate-300/60 cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.triggers.negativeComplaints}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      triggers: { ...formData.triggers, negativeComplaints: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-red-400 flex items-center gap-1">
                    🚨 Keluhan & Ulasan Negatif Baru (Rating Bintang 1-3)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Kirim email peringatan darurat secara instant agar tim CS langsung merespons pelanggan.
                  </p>
                </div>
              </label>

              {/* Trigger 2: Positive Testimonials */}
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-slate-300/60 cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.triggers.positiveTestimonials}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      triggers: { ...formData.triggers, positiveTestimonials: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    💬 Testimoni & Pujian Pelanggan Baru (Rating Bintang 5)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Kirim draf apresiasi atau materi konten promosi dari ulasan positif pelanggan.
                  </p>
                </div>
              </label>

              {/* Trigger 3: Viral Mentions */}
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-slate-300/60 cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.triggers.viralMentions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      triggers: { ...formData.triggers, viralMentions: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    🔥 Sebutan Viral & Postingan Tren Reputasi Bisnis
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Notifikasi ketika terdapat postingan TikTok/Instagram yang mendapat lonjakan interaksi netizen tinggi.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Kunci Integrasi API Medsos Live & Mode Direct Auto-Reply */}
          <div className="bg-slate-50/80 border border-indigo-500/40 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                <Send className="w-4 h-4 text-indigo-600" />
                🔑 Kunci Integrasi API Medsos Live (Instagram, TikTok & Google Reviews)
              </label>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-700 text-[10px] font-extrabold uppercase border border-indigo-500/30">
                DIRECT API DISPATCH
              </span>
            </div>
            
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Masukkan kunci API akun medsos resmi merek Anda agar aplikasi ini dapat menarik pertanyaan netizen secara real-time dan <strong>langsung mengirimkan balasan AI ke komentar/DM netizen</strong> dari dashboard ini.
            </p>

            {/* Input 1: Meta Page Access Token (Instagram & Facebook) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>📸 Meta Page Access Token (Instagram Business & Facebook)</span>
                <span className="text-[10px] font-normal text-slate-500">Graph API v20.0</span>
              </label>
              <input
                type="password"
                value={formData.metaAccessToken || ''}
                onChange={(e) => setFormData({ ...formData, metaAccessToken: e.target.value })}
                placeholder="Masukkan Meta Graph API Access Token (EAABw...)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Input 2: TikTok Business Access Token */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>🎵 TikTok Business Open API Access Token</span>
                <span className="text-[10px] font-normal text-slate-500">TikTok Developer API</span>
              </label>
              <input
                type="password"
                value={formData.tikTokAccessToken || ''}
                onChange={(e) => setFormData({ ...formData, tikTokAccessToken: e.target.value })}
                placeholder="Masukkan TikTok Access Token (act.example...)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Input 3: Google Places / Business Profile API Key */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>🗺️ Google Places & Business Profile API Key</span>
                <span className="text-[10px] font-normal text-slate-500">Google Cloud Console</span>
              </label>
              <input
                type="password"
                value={formData.googleBusinessApiKey || ''}
                onChange={(e) => setFormData({ ...formData, googleBusinessApiKey: e.target.value })}
                placeholder="Masukkan Google API Key (AIzaSy...)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mode Direct Reply Choice */}
            <div className="pt-2 border-t border-slate-300/60 space-y-2">
              <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Mode Pengiriman Balasan AI ke Medsos:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, directReplyMode: 'approval' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    (formData.directReplyMode || 'approval') === 'approval'
                      ? 'bg-blue-100/60 border-blue-500 text-blue-900 ring-1 ring-blue-500/40'
                      : 'bg-white border-slate-300/80 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    <span>1. Mode Approval CS (Rekomendasi)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    AI membuat draf balasan, CS meninjau lalu menekan tombol <strong>"🚀 Kirim Balasan Langsung"</strong>.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, directReplyMode: 'auto_direct' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.directReplyMode === 'auto_direct'
                      ? 'bg-emerald-100/60 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500/40'
                      : 'bg-white border-slate-300/80 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1 text-emerald-700">
                    <span>2. Mode Auto-Reply AI Direct (24/7)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    AI langsung mengirimkan balasan ke akun netizen secara otomatis saat pertanyaan masuk.
                  </p>
                </button>
              </div>
            </div>

          </div>

          {/* Simulation & Demo Section */}
          <div className="border border-indigo-500/40 rounded-xl p-4 bg-indigo-100/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-indigo-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  Uji Simulasi Auto-Sync & Kirim Email Test CS
                </h4>
                <p className="text-[11px] text-slate-700">
                  Uji alur penarikan data ulasan baru dari medsos dan verifikasi draf email ke CS.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Data...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Uji Kirim Email CS</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulation Preview Result */}
            {simulationResult && (
              <div className="mt-3 p-3.5 bg-slate-100 border border-emerald-500/40 rounded-xl space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between text-emerald-600 font-bold text-xs border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    SIMULASI BERHASIL: Alert Diteruskan ke CS ({simulationResult.sentTo})
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Status: 200 OK • {simulationResult.timestamp}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">
                      Target Email: <strong className="text-slate-900 font-mono">{simulationResult.sentTo}</strong>
                    </span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[9px] font-extrabold">
                      URGENCY: {simulationResult.sampleItem.urgency}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    <strong>Cabang:</strong> {simulationResult.sampleItem.branch} ({simulationResult.sampleItem.platform})
                  </div>
                  <div className="text-[11px] text-slate-700 italic bg-slate-100 p-2 rounded border border-slate-200">
                    "{simulationResult.sampleItem.text}"
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Rekomendasi AI ke CS: Segera hubungi pelanggan & berikan slot booking prioritas dalam 60 menit.
                  </div>
                </div>
              </div>
            )}
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white/90 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
          >
            <Check className="w-4 h-4" />
            Simpan Konfigurasi CS & Otomasi
          </button>
        </div>

      </div>
    </div>
  );
};
