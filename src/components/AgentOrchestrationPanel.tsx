import React from 'react';
import { AgentDefinition, AgentExecutionState, AIConfig } from '../types';
import { Cpu, CheckCircle2, RefreshCw, AlertCircle, Sparkles, Layers, ShieldAlert, MapPin, MessageSquareText, TrendingUp, Share2, Target } from 'lucide-react';

export const AGENT_DEFINITIONS: AgentDefinition[] = [
  {
    id: 'agent_geo',
    name: 'Agent 1: Geo & Network Mapper',
    role: 'Pakar Pemetaan Cabang & Lokasi',
    skill: 'Audit Lokasi Google Maps & Rating Cabang',
    avatar: '🗺️',
    color: 'from-blue-500 to-cyan-600',
    description: 'Mencari lokasi fisik cabang asli di seluruh Indonesia, mengekstrak rating Google Maps & jumlah ulasan.',
  },
  {
    id: 'agent_sentiment',
    name: 'Agent 2: Sentiment & Review Miner',
    role: 'Pakar Tambang Ulasan Customer',
    skill: 'Deep Extraction Keluhan & Positive Highlights',
    avatar: '💬',
    color: 'from-amber-500 to-orange-600',
    description: 'Menganalisis ribuan ulasan pelanggan, mengkategorikan komplain (antrean, transparansi harga, kualitas mekanik).',
  },
  {
    id: 'agent_traffic',
    name: 'Agent 3: Operational & Traffic Analyst',
    role: 'Analys Jam Sibuk & Kapasitas Bengkel',
    skill: 'Pola Keramaian & Bottleneck Operasional',
    avatar: '📊',
    color: 'from-emerald-500 to-teal-600',
    description: 'Mendeteksi jam tersibuk, hari tersibuk, waktu tunggu rata-rata, dan kapasitas produktivitas pit.',
  },
  {
    id: 'agent_social',
    name: 'Agent 4: Social PR & Media Tracker',
    role: 'Pakar Monitoring Sentimen Medsos',
    skill: 'Tracking Konten Viral TikTok/IG & PR Crisis',
    avatar: '📱',
    color: 'from-purple-500 to-indigo-600',
    description: 'Monitoring sebutan merek di TikTok, Instagram, News, dan mendeteksi isu viral komplain publik.',
  },
  {
    id: 'agent_strategist',
    name: 'Agent 5: Executive Solution Strategist',
    role: 'Pakar Strategi Operasional Eksekutif',
    skill: 'Sintesis Laporan & Matrix Rekomendasi',
    avatar: '🎯',
    color: 'from-rose-500 to-pink-600',
    description: 'Menggabungkan hasil kerja Agent 1-4 untuk menyusun rekomendasi tindakan konkret dengan prioritas dampak tinggi.',
  },
];

interface AgentOrchestrationPanelProps {
  agentStates: Record<string, AgentExecutionState>;
  aiConfig: AIConfig;
  isOrchestrating: boolean;
  targetQuery: string;
}

export const AgentOrchestrationPanel: React.FC<AgentOrchestrationPanelProps> = ({
  agentStates,
  aiConfig,
  isOrchestrating,
  targetQuery,
}) => {
  if (!isOrchestrating && Object.keys(agentStates).length === 0) {
    return null;
  }

  const completedCount = (Object.values(agentStates) as AgentExecutionState[]).filter(
    (s: AgentExecutionState) => s.status === 'completed'
  ).length;
  const overallProgress = Math.round((completedCount / AGENT_DEFINITIONS.length) * 100);

  return (
    <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-xl my-6 animate-fadeIn">
      
      {/* Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                ORKESTRASI MULTI-AGENT AI (5 SPESIALIS SKILL)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Engine: {aiConfig.provider.toUpperCase()} ({aiConfig.model})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemrosesan terorkestrasi untuk analisis bisnis: <span className="text-blue-700 font-bold">"{targetQuery}"</span>
            </p>
          </div>
        </div>

        {/* Overall Progress Meter */}
        <div className="flex items-center gap-3 bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-300/70">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">STATUS PIPELINE</div>
            <div className="text-xs font-extrabold text-emerald-600">
              {completedCount} / {AGENT_DEFINITIONS.length} AGENT SELESAI ({overallProgress}%)
            </div>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" className="text-slate-700" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                className="text-emerald-500 transition-all duration-500"
                fill="transparent"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * overallProgress) / 100}
              />
            </svg>
            <span className="absolute text-[10px] font-extrabold text-slate-900">{overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Grid 5 Specialized AI Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4">
        {AGENT_DEFINITIONS.map((agent) => {
          const state = agentStates[agent.id] || { status: 'idle', progressPercent: 0 };
          const isWorking = state.status === 'working';
          const isCompleted = state.status === 'completed';
          const isError = state.status === 'error';

          return (
            <div
              key={agent.id}
              className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between relative overflow-hidden ${
                isWorking
                  ? 'bg-blue-100/40 border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                  : isCompleted
                  ? 'bg-slate-50/80 border-emerald-500/60'
                  : isError
                  ? 'bg-rose-100/40 border-rose-500/60'
                  : 'bg-slate-50/40 border-slate-300/60 opacity-70'
              }`}
            >
              {/* Agent Title & Skill Header */}
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-xl" role="img" aria-label={agent.name}>
                    {agent.avatar}
                  </span>
                  <div className="flex items-center gap-1">
                    {isWorking && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 text-[10px] font-bold animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Bekerja...
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                      </span>
                    )}
                    {isError && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 text-[10px] font-bold">
                        <AlertCircle className="w-3 h-3 text-rose-600" /> Gagal
                      </span>
                    )}
                    {state.status === 'idle' && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-semibold">
                        Menunggu
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">
                  {agent.name}
                </h4>
                <div className="text-[10px] font-semibold text-blue-600 mt-0.5 line-clamp-1">
                  {agent.role}
                </div>

                {/* Skill Badge */}
                <div className="mt-2 bg-white/80 border border-slate-300/70 rounded px-2 py-1 text-[10px] text-slate-700 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span className="truncate">{agent.skill}</span>
                </div>
              </div>

              {/* Progress & Output Snippet */}
              <div className="mt-3 pt-2.5 border-t border-slate-300/50">
                <div className="w-full bg-slate-100/60 rounded-full h-1.5 overflow-hidden mb-1.5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isError
                        ? 'bg-rose-500'
                        : 'bg-blue-500 animate-pulse'
                    }`}
                    style={{ width: `${state.progressPercent || 0}%` }}
                  />
                </div>

                {state.outputSnippet && (
                  <p className="text-[10px] text-slate-700 font-sans italic line-clamp-2 bg-slate-100/60 p-1.5 rounded border border-slate-200/80">
                    "{state.outputSnippet}"
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
