import React, { useState, useEffect } from 'react';
import { X, Cpu, Key, Globe, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Layers, Sparkles, Server } from 'lucide-react';
import { AIConfig, AIProvider } from '../types';
import { PROVIDER_MODELS, testAIConnection } from '../services/aiProvider';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (newConfig: AIConfig) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<AIConfig>(config);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    let initialConfig = { ...config };
    if (initialConfig.baseUrl.includes('api.sumopod.com')) {
      initialConfig.baseUrl = initialConfig.baseUrl.replace('api.sumopod.com', 'ai.sumopod.com');
    }
    setFormData(initialConfig);
    setTestResult(null);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (provider: AIProvider) => {
    const defaultModel = PROVIDER_MODELS[provider]?.[0]?.id || '';
    const defaultBaseUrl = provider === 'sumopod' ? 'https://ai.sumopod.com/v1' : 'https://api.openai.com/v1';
    setFormData((prev) => ({
      ...prev,
      provider,
      model: defaultModel,
      baseUrl: provider === 'gemini' ? prev.baseUrl : defaultBaseUrl,
    }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testAIConnection(formData);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-300/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Pengaturan Engine AI & API Key
              </h2>
              <p className="text-xs text-slate-500">
                Pilih provider, model, dan kunci API sebagai mesin analitis aplikasi
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Choice: AI Provider */}
          <div>
            <label className="block text-slate-700 font-semibold mb-2">
              Pilih Provider AI (Mesin Utama)
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Gemini Provider */}
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  formData.provider === 'gemini'
                    ? 'bg-blue-100/60 border-blue-500 ring-2 ring-blue-500/30 text-white'
                    : 'bg-slate-50/50 border-slate-300/70 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Google Gemini</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Gemini 3.6 Flash & Grounding Search</div>
                </div>
              </button>

              {/* Sumopod Provider */}
              <button
                type="button"
                onClick={() => handleProviderChange('sumopod')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  formData.provider === 'sumopod'
                    ? 'bg-indigo-100/60 border-indigo-500 ring-2 ring-indigo-500/30 text-white'
                    : 'bg-slate-50/50 border-slate-300/70 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-600 shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Sumopod AI</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">GPT-4o, Claude 3.5 & DeepSeek API</div>
                </div>
              </button>

            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Pilih Model AI
            </label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            >
              {PROVIDER_MODELS[formData.provider]?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — ({m.description})
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" /> API Key ({formData.provider.toUpperCase()})
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Disimpan lokal di browser
              </span>
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder={
                  formData.provider === 'gemini'
                    ? 'Masukkan Gemini API Key (AIzaSy...)'
                    : 'Masukkan Sumopod API Key (sk-...)'
                }
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              *Jika dikosongkan, sistem akan mencoba menggunakan API Key default dari environment server.
            </p>
          </div>

          {/* Base URL Input (For Sumopod / OpenAI) */}
          {(formData.provider === 'sumopod' || formData.provider === 'openai') && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Custom Base URL API (OpenAI Compatible)
              </label>
              <input
                type="text"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="https://ai.sumopod.com/v1"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Multi-Agent Orchestration Switch */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-300/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  Orkestrasi Multi-Agent AI (Spesialis Skill)
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 text-[10px] font-extrabold uppercase">
                    Rekomendasi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Membagi pekerjaan ke 5 Agen AI spesialis (Geo, Sentiment, Traffic, Social, Strategic) untuk pemrosesan super cepat.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={formData.useOrchestration}
                onChange={(e) => setFormData({ ...formData, useOrchestration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Auto-Sync Performance AI Interval */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-300/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-800 font-bold text-xs flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                Interval Auto-Sync Performance AI
              </label>
              <select
                value={formData.autoSyncPerformanceInterval || 'off'}
                onChange={(e) => setFormData({ ...formData, autoSyncPerformanceInterval: e.target.value as any })}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="off">Matikan (Manual Trigger Sahaja)</option>
                <option value="15m">Setiap 15 Menit</option>
                <option value="1h">Setiap 1 Jam</option>
                <option value="6h">Setiap 6 Jam</option>
                <option value="24h">Setiap 24 Jam</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Menentukan seberapa sering AI menarik & memperbarui statistik rating/ulasan/komplain cabang secara otomatis di latar belakang.
            </p>
          </div>

          {/* Connection Test Output Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                testResult.success
                  ? 'bg-emerald-100/60 border-emerald-500/60 text-emerald-800'
                  : 'bg-rose-100/60 border-rose-500/60 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons inside Form */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl text-xs border border-slate-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Menguji Koneksi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Uji Koneksi API Key</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-500 hover:text-slate-900 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                Simpan & Terapkan
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
