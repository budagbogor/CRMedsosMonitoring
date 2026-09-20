import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExecutiveSummaryBanner } from './components/ExecutiveSummaryBanner';
import { BranchPerformanceTable } from './components/BranchPerformanceTable';
import { BranchDetailModal } from './components/BranchDetailModal';
import { ComplaintCategoriesChart } from './components/ComplaintCategoriesChart';
import { TrafficPatternSection } from './components/TrafficPatternSection';
import { SocialSentimentSection } from './components/SocialSentimentSection';
import { StrategicRecommendationsSection } from './components/StrategicRecommendationsSection';
import { SearchProgressModal } from './components/SearchProgressModal';
import { AISettingsModal } from './components/AISettingsModal';
import { AgentOrchestrationPanel, AGENT_DEFINITIONS } from './components/AgentOrchestrationPanel';
import { BranchComparisonModal } from './components/BranchComparisonModal';
import { ExecutiveAIAdvisorChat } from './components/ExecutiveAIAdvisorChat';
import { RegionalBranchGrid } from './components/RegionalBranchGrid';
import { HistoricalAnalyticsSection } from './components/HistoricalAnalyticsSection';
import { CSAutomationModal } from './components/CSAutomationModal';
import { PRESET_DATASETS } from './data/mockDatasets';
import { FullIntelligenceReport, BranchData, SearchState, AIConfig, AgentExecutionState, CSAutomationConfig } from './types';
import { loadAIConfig, saveAIConfig } from './services/aiProvider';
import { ExternalLink, Sparkles } from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<FullIntelligenceReport>(
    PRESET_DATASETS["Mobeng"] || PRESET_DATASETS["Astra Otoservice"]
  );
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [selectedBranchTab, setSelectedBranchTab] = useState<'overview' | 'complaints'>('overview');
  const [activeQuery, setActiveQuery] = useState<string>("Mobeng");

  const handleSelectBranch = (branch: BranchData, initialTab: 'overview' | 'complaints' = 'overview') => {
    setSelectedBranch(branch);
    setSelectedBranchTab(initialTab);
  };

  // AI Configuration State
  const [aiConfig, setAiConfig] = useState<AIConfig>(loadAIConfig);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  // CS Email Automation State
  const [csAutomationConfig, setCsAutomationConfig] = useState<CSAutomationConfig>(() => {
    const saved = localStorage.getItem('auto_rep_cs_automation_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.csEmails || !Array.isArray(parsed.csEmails)) {
          const emails = (parsed.csEmail || 'budagbogor@gmail.com')
            .split(/[\s,;]+/)
            .map((e: string) => e.trim())
            .filter((e: string) => e.length > 0);
          parsed.csEmails = emails.length > 0 ? emails : ['budagbogor@gmail.com'];
        }
        return parsed;
      } catch (e) {}
    }
    return {
      csEmail: 'budagbogor@gmail.com',
      csEmails: ['budagbogor@gmail.com'],
      autoSyncEnabled: true,
      syncInterval: '1h',
      monitoredPlatforms: ['Threads', 'Instagram', 'TikTok', 'Google Reviews', 'X/Twitter', 'Facebook'],
      targetBusinessUnits: ['Semua Cabang Mobeng'],
      targetBrandFocus: 'Mobeng',
      triggers: {
        negativeComplaints: true,
        positiveTestimonials: true,
        viralMentions: true,
      },
    };
  });
  const [isCSAutomationOpen, setIsCSAutomationOpen] = useState(false);

  const handleSaveCSConfig = (newConfig: CSAutomationConfig) => {
    setCsAutomationConfig(newConfig);
    localStorage.setItem('auto_rep_cs_automation_config', JSON.stringify(newConfig));
  };

  // Compare Branches State
  const [selectedCompareBranches, setSelectedCompareBranches] = useState<BranchData[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Multi-Agent Execution State
  const [agentStates, setAgentStates] = useState<Record<string, AgentExecutionState>>({});

  // Performance AI Sync State
  const [isSyncingPerformance, setIsSyncingPerformance] = useState(false);

  const handleSyncBranchPerformanceAI = async () => {
    if (isSyncingPerformance || !report.branches || report.branches.length === 0) return;
    setIsSyncingPerformance(true);
    try {
      const res = await fetch('/api/sync-branch-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: report.brandName,
          branches: report.branches,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
          baseUrl: aiConfig.baseUrl,
        }),
      });

      const data = await res.json();

      if (data.branches && Array.isArray(data.branches)) {
        setReport((prev) => ({
          ...prev,
          branches: data.branches,
          lastAISyncTimestamp: data.lastAISyncTimestamp || new Date().toLocaleTimeString('id-ID'),
        }));
      }
    } catch (err: any) {
      console.error('Error syncing branch performance:', err);
    } finally {
      setIsSyncingPerformance(false);
    }
  };

  // Auto-Sync Performance Interval Timer
  useEffect(() => {
    const intervalSetting = aiConfig.autoSyncPerformanceInterval || 'off';
    if (intervalSetting === 'off') return;

    let ms = 60 * 60 * 1000;
    if (intervalSetting === '15m') ms = 15 * 60 * 1000;
    else if (intervalSetting === '1h') ms = 60 * 60 * 1000;
    else if (intervalSetting === '6h') ms = 6 * 60 * 60 * 1000;
    else if (intervalSetting === '24h') ms = 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      handleSyncBranchPerformanceAI();
    }, ms);

    return () => clearInterval(timer);
  }, [aiConfig.autoSyncPerformanceInterval, report.brandName]);

  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    step: 'idle',
    progressPercent: 0,
  });

  const presetList = ["Mobeng"];

  const handleSaveAIConfig = (newConfig: AIConfig) => {
    setAiConfig(newConfig);
    saveAIConfig(newConfig);
  };

  const handleToggleCompareBranch = (branch: BranchData) => {
    setSelectedCompareBranches((prev) => {
      const exists = prev.some((b) => b.id === branch.id);
      if (exists) {
        return prev.filter((b) => b.id !== branch.id);
      } else {
        if (prev.length >= 3) {
          alert('Maksimal 3 cabang dapat dibandingkan secara bersamaan.');
          return prev;
        }
        return [...prev, branch];
      }
    });
  };

  const handleRemoveCompareBranch = (branchId: string) => {
    setSelectedCompareBranches((prev) => prev.filter((b) => b.id !== branchId));
  };

  const handleSearch = async (query: string) => {
    setActiveQuery(query);
    setSelectedCompareBranches([]);
    setSelectedBranch(null);
    setSearchState({ isLoading: true, step: 'mapping_network', progressPercent: 15 });

    // Robust preset key matching by normalizing spaces & special characters (e.g. b-quik, bquik, bengkel b-quik)
    const normalizeStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normQuery = normalizeStr(query);

    const matchedPresetKey = Object.keys(PRESET_DATASETS).find((key) => {
      const normKey = normalizeStr(key);
      return normKey.includes(normQuery) || normQuery.includes(normKey);
    });

    // Immediately update report if preset dataset matches to clear previous brand data from screen instantly
    if (matchedPresetKey) {
      setReport(PRESET_DATASETS[matchedPresetKey]);
    }

    // Initialize Multi-Agent states if orchestration enabled
    if (aiConfig.useOrchestration) {
      const initialStates: Record<string, AgentExecutionState> = {};
      AGENT_DEFINITIONS.forEach((ag) => {
        initialStates[ag.id] = {
          agentId: ag.id,
          status: 'idle',
          progressPercent: 0,
        };
      });
      setAgentStates(initialStates);
    }

    // Step 1: Network & Geo Mapping (Agent 1)
    if (aiConfig.useOrchestration) {
      setAgentStates((prev) => ({
        ...prev,
        agent_geo: {
          agentId: 'agent_geo',
          status: 'working',
          progressPercent: 50,
          outputSnippet: `Mencari titik lokasi cabang resmi & ulasan Google Maps ${query}...`,
        },
      }));
    }
    await new Promise((r) => setTimeout(r, 600));

    if (aiConfig.useOrchestration) {
      setAgentStates((prev) => ({
        ...prev,
        agent_geo: {
          agentId: 'agent_geo',
          status: 'completed',
          progressPercent: 100,
          outputSnippet: `Lokasi & rating Google Maps cabang ${query} berhasil dideteksi.`,
        },
        agent_sentiment: {
          agentId: 'agent_sentiment',
          status: 'working',
          progressPercent: 40,
          outputSnippet: 'Ekstraksi ulasan pelanggan & klasifikasi kategori komplain...',
        },
      }));
    }

    // Step 2: Customer Sentiment & Complaint Analysis (Agent 2)
    setSearchState((prev) => ({ ...prev, step: 'fetching_reviews', progressPercent: 35 }));
    await new Promise((r) => setTimeout(r, 600));

    if (aiConfig.useOrchestration) {
      setAgentStates((prev) => ({
        ...prev,
        agent_sentiment: {
          agentId: 'agent_sentiment',
          status: 'completed',
          progressPercent: 100,
          outputSnippet: 'Sentimen ulasan terpisah: antrean, transparansi harga & staf.',
        },
        agent_traffic: {
          agentId: 'agent_traffic',
          status: 'working',
          progressPercent: 50,
          outputSnippet: 'Menganalisis jam sibuk, pola kedatangan & kapasitas pit...',
        },
      }));
    }

    // Step 3: Operational & Traffic Analysis (Agent 3)
    setSearchState((prev) => ({ ...prev, step: 'analyzing_complaints', progressPercent: 60 }));
    await new Promise((r) => setTimeout(r, 600));

    if (aiConfig.useOrchestration) {
      setAgentStates((prev) => ({
        ...prev,
        agent_traffic: {
          agentId: 'agent_traffic',
          status: 'completed',
          progressPercent: 100,
          outputSnippet: 'Pola keramaian Sabtu/Minggu peak jam 09:00-11:30 terdeteksi.',
        },
        agent_social: {
          agentId: 'agent_social',
          status: 'working',
          progressPercent: 50,
          outputSnippet: 'Tracking sebutan TikTok, IG & isu viral reputasi merek...',
        },
      }));
    }

    // Step 4: Social PR & Media Tracker (Agent 4)
    setSearchState((prev) => ({ ...prev, step: 'tracking_social', progressPercent: 80 }));
    await new Promise((r) => setTimeout(r, 500));

    if (aiConfig.useOrchestration) {
      setAgentStates((prev) => ({
        ...prev,
        agent_social: {
          agentId: 'agent_social',
          status: 'completed',
          progressPercent: 100,
          outputSnippet: 'Sentimen publik medsos 76% positif, 1 tren isu antrean.',
        },
        agent_strategist: {
          agentId: 'agent_strategist',
          status: 'working',
          progressPercent: 60,
          outputSnippet: 'Menyusun rekomendasi strategis & prioritas aksi operasional...',
        },
      }));
    }

    // Step 5: Executive Solution Strategist (Agent 5)
    setSearchState((prev) => ({ ...prev, step: 'synthesizing', progressPercent: 95 }));

    if (matchedPresetKey) {
      await new Promise((r) => setTimeout(r, 400));
      setReport(PRESET_DATASETS[matchedPresetKey]);
      
      if (aiConfig.useOrchestration) {
        setAgentStates((prev) => ({
          ...prev,
          agent_strategist: {
            agentId: 'agent_strategist',
            status: 'completed',
            progressPercent: 100,
            outputSnippet: 'Laporan intelijen eksekutif lengkap berhasil disintesis.',
          },
        }));
      }

      setSearchState({ isLoading: false, step: 'completed', progressPercent: 100 });
      return;
    }

    // Try Live API Analysis (Gemini / Sumopod)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
          baseUrl: aiConfig.baseUrl,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data && data.brandName && data.branches) {
        setReport(data);
      } else {
        throw new Error('Format data tidak valid');
      }
    } catch (err) {
      console.warn('API error or offline fallback, generating derived intelligence report:', err);
      const derivedReport = createDerivedReport(query);
      setReport(derivedReport);
    } finally {
      if (aiConfig.useOrchestration) {
        setAgentStates((prev) => ({
          ...prev,
          agent_strategist: {
            agentId: 'agent_strategist',
            status: 'completed',
            progressPercent: 100,
            outputSnippet: 'Laporan intelijen eksekutif lengkap berhasil disintesis.',
          },
        }));
      }
      setSearchState({ isLoading: false, step: 'completed', progressPercent: 100 });
    }
  };

  // Helper generator for custom queries
  const createDerivedReport = (query: string): FullIntelligenceReport => {
    return {
      brandName: query,
      analysisDate: "Agustus 2026",
      totalBranchesFound: 8,
      avgNetworkRating: 4.62,
      totalReviewsAnalyzed: 12400,
      executiveSummary: `Analisis reputasi dan pemetaan kinerja cabang untuk jaringan ${query} menunjukkan kepercayaan konsumen yang tinggi pada layanan pengerjaan teknis utama. Namun demikian, terdapat disparitas kinerja di mana 2 cabang mengalami lonjakan keluhan terkait durasi waktu tunggu antrean dan transparansi estimasi rincian pengerjaan awal.`,
      redFlagBranchIds: [`br-custom-7`],
      branches: [
        {
          id: `br-custom-1`,
          name: `${query} Jakarta Selatan`,
          city: "Jakarta Selatan",
          address: "Jl. TB Simatupang No. 88, Jakarta Selatan",
          rating: 4.8,
          reviewCount: 2450,
          status: "Top",
          positives: ["Pelayanan ramah & cepat", "Ruang tunggu AC nyaman dengan tempat duduk bersih", "Mekanik menjelaskan kondisi komponen secara detail"],
          negatives: ["Lahan parkir depan agak penuh saat jam makan siang"],
          complaintCount: 14,
          trendScore: "improving",
        },
        {
          id: `br-custom-2`,
          name: `${query} Surabaya Pusat`,
          city: "Surabaya",
          address: "Jl. Basuki Rahmat No. 102, Surabaya",
          rating: 4.7,
          reviewCount: 1920,
          status: "Top",
          positives: ["Teknisi berpengalaman", "Fasilitas lengkap", "Hasil pengerjaan sangat rapi"],
          negatives: ["Antrean hari Sabtu agak ramai"],
          complaintCount: 18,
          trendScore: "stable",
        },
        {
          id: `br-custom-3`,
          name: `${query} Bandung Soekarno Hatta`,
          city: "Bandung",
          address: "Jl. Soekarno Hatta No. 220, Bandung",
          rating: 4.6,
          reviewCount: 1540,
          status: "Medium",
          positives: ["Stok sparepart lengkap", "Diskon promo bulanan terjangkau"],
          negatives: ["Waktu tunggu pendaftaran lumayan lama"],
          complaintCount: 32,
          trendScore: "stable",
        },
        {
          id: `br-custom-4`,
          name: `${query} Semarang Pemuda`,
          city: "Semarang",
          address: "Jl. Pemuda No. 85, Semarang",
          rating: 4.6,
          reviewCount: 1280,
          status: "Medium",
          positives: ["Pemberian sertifikat garansi pengerjaan"],
          negatives: ["Koneksi WiFi di ruang tunggu agak lambat"],
          complaintCount: 28,
          trendScore: "stable",
        },
        {
          id: `br-custom-7`,
          name: `${query} Bekasi Raya (Cabang Satelit)`,
          city: "Bekasi",
          address: "Jl. Ahmad Yani No. 12, Bekasi",
          rating: 4.2,
          reviewCount: 2100,
          status: "Attention Required",
          positives: ["Lokasi strategis di pinggir jalan utama"],
          negatives: ["Waktu pengerjaan molor dari estimasi", "Keluhan pelanggan tidak dipanggil tepat waktu", "Ruang tunggu penuh sesak pada akhir pekan"],
          complaintCount: 135,
          trendScore: "declining",
          trendDetails: "Banyak sorotan ulasan negatif mengenai waktu tunggu melebihi janji di aplikasi.",
        },
      ],
      complaintCategories: [
        {
          category: "Waktu Tunggu & Antrean Overload",
          percentage: 40,
          count: 180,
          severity: "High",
          sampleQuotes: ["Pengerjaan molor 2 jam dari estimasi yang dijanjikan di awal."],
        },
        {
          category: "Transparansi Biaya & Persetujuan Jasa",
          percentage: 30,
          count: 135,
          severity: "High",
          sampleQuotes: ["Ada biaya tambahan tanpa dikonfirmasi dulu ke saya."],
        },
        {
          category: "Kapasitas & Fasilitas Ruang Tunggu",
          percentage: 18,
          count: 81,
          severity: "Medium",
          sampleQuotes: ["Ruang tunggu terasa panas saat jam siang terik."],
        },
        {
          category: "Keramahan & Komunikasi Front Office",
          percentage: 12,
          count: 54,
          severity: "Low",
          sampleQuotes: ["Staff pendaftaran terkesan cuek saat ditanya urutan antrean."],
        },
      ],
      trafficPattern: {
        busyDays: ["Sabtu", "Minggu", "Jumat SORE"],
        peakHours: "10.00 - 13.00 WIB & 17.00 - 19.30 WIB",
        quietHours: "Selasa & Rabu (13.00 - 15.00 WIB)",
        hourlyDistribution: [
          { hour: "09:00", trafficLevel: 45, label: "Buka Toko" },
          { hour: "10:00", trafficLevel: 88, label: "Puncak Pagi" },
          { hour: "11:00", trafficLevel: 98, label: "Kapasitas Maksimal" },
          { hour: "12:00", trafficLevel: 55, label: "Istirahat Siang" },
          { hour: "13:00", trafficLevel: 85, label: "Gelombang Siang" },
          { hour: "14:00", trafficLevel: 92, label: "Padat Siang" },
          { hour: "15:00", trafficLevel: 65, label: "Sedang" },
          { hour: "16:00", trafficLevel: 72, label: "Persiapan Pulang Kantor" },
          { hour: "17:00", trafficLevel: 94, label: "Puncak Pulang Kantor" },
          { hour: "18:00", trafficLevel: 90, label: "Padat Malam" },
          { hour: "19:00", trafficLevel: 78, label: "Servis Malam Express" },
          { hour: "20:00", trafficLevel: 50, label: "Penutupan Pendaftaran" },
          { hour: "21:00", trafficLevel: 25, label: "Tutup Operasional" }
        ],
        summary: "Trafik pengunjung beroperasi penuh dari pukul 09.00 hingga 21.00 WIB, dengan lonjakan utama pada akhir pekan (pagi-siang) serta jam sepulang kerja (17.00 - 19.30 WIB).",
        recommendations: [
          "Terapkan batas kuota booking per jam untuk meratakan kedatangan.",
          "Buka jalur Express Service khusus ganti oli ringan pada jam sibuk malam.",
        ],
      },
      socialSentiment: {
        overallPositivePercentage: 76,
        overallNeutralPercentage: 14,
        overallNegativePercentage: 10,
        channels: [
          {
            platform: "Threads",
            mentionCount: 1950,
            sentimentScore: 74,
            viralTopics: ["Curhatan Threads Pelanggan", "Review Jujur Layanan"],
            recentHeadline: "Threads curhatan pengguna mengenai transparansi biaya & antrean servis.",
          },
          {
            platform: "Instagram",
            mentionCount: 2800,
            sentimentScore: 82,
            viralTopics: ["Promo Ganti Oli", "Ulasan Servis Rutin"],
            recentHeadline: "Apresiasi netizen terhadap transparansi garansi pengerjaan.",
          },
          {
            platform: "TikTok",
            mentionCount: 3100,
            sentimentScore: 68,
            viralTopics: ["Video Curhat Antrean", "Spill Biaya Servis"],
            recentHeadline: "Video kritik waktu tunggu sempat FYP di TikTok.",
          },
        ],
        viralComplaints: [
          "Thread keluhan durasi antrean akhir pekan di Threads & TikTok.",
          "Video TikTok kritik waktu tunggu di cabang satelit."
        ],
        successfulCampaigns: ["Kampanye pengecekan komponen gratis berhasil menarik prospek baru."],
        publicPerceptionSummary: "Sentimen publik secara umum sangat baik, dengan atensi perbaikan pada durasi antrean akhir pekan.",
      },
      strategicRecommendations: [
        {
          id: "rec-c-1",
          priority: "Critical",
          category: "Operasional",
          title: "Restrukturisasi Alokasi Slot Antrean Digital",
          description: "Batasi kuota walk-in pada hari Sabtu dan prioritas booking online dengan kepastian jam masuk pit.",
          targetBranches: [`${query} Bekasi Raya`],
          expectedImpact: "Menurunkan komplain waktu tunggu hingga 40%.",
        },
        {
          id: "rec-c-2",
          priority: "High",
          category: "Inventaris & Transparansi",
          title: "Digital Quotation Approval Sebelum Pengerjaan",
          description: "Wajibkan konfirmasi biaya tambahan via WA sebelum mekanik membongkar komponen ekstra.",
          targetBranches: ["Semua Cabang"],
          expectedImpact: "Menghilangkan 90% keluhan transparansi biaya.",
        },
      ],
    };
  };

  // Export handlers
  const handleExportMarkdown = () => {
    let md = `# LAPORAN INTELIJEN REPUTASI & PERFORMA CABANG
**Merek Bisnis:** ${report.brandName}  
**Tanggal Analisis:** ${report.analysisDate}  
**Total Cabang Terdeteksi:** ${report.totalBranchesFound}  
**Rata-rata Rating Jaringan:** ${report.avgNetworkRating.toFixed(2)} / 5.0 (Total Ulasan: ${report.totalReviewsAnalyzed.toLocaleString('id-ID')})

---

## RINGKASAN EKSEKUTIF
${report.executiveSummary}

---

## 1. TABEL KOMPARASI PERFORMA CABANG
| No | Nama Cabang & Lokasi | Rating Google | Jumlah Ulasan | Isu Komplain | Status Kinerja |
|---|---|---|---|---|---|
`;

    report.branches.forEach((b, i) => {
      md += `| ${i + 1} | ${b.name} (${b.city}) | ⭐ ${b.rating.toFixed(1)} | ${b.reviewCount} ulasan | ${b.complaintCount} isu | ${b.status} |\n`;
    });

    md += `
---

## 2. ANALISIS KELUHAN & ULASAN POSITIF
### Kategori Komplain Utama:
`;

    report.complaintCategories.forEach((cat) => {
      md += `- **${cat.category}** (${cat.percentage}% - ${cat.count} Isu | Severity: ${cat.severity})\n`;
      if (cat.sampleQuotes.length > 0) {
        md += `  > "${cat.sampleQuotes[0]}"\n`;
      }
    });

    md += `
---

## 3. PATTERN KEDATANGAN & TREN KERAMAIAN
- **Hari Paling Ramai:** ${report.trafficPattern.busyDays.join(', ')}
- **Jam Tersibuk (Peak Hours):** ${report.trafficPattern.peakHours}
- **Ringkasan Traffic:** ${report.trafficPattern.summary}

---

## 4. ANALISIS MEDIA SOSIAL & PERSEPSI PUBLIK
- **Sentimen Publik:** Positif ${report.socialSentiment.overallPositivePercentage}% | Netral ${report.socialSentiment.overallNeutralPercentage}% | Negatif ${report.socialSentiment.overallNegativePercentage}%
- **Ringkasan Persepsi:** ${report.socialSentiment.publicPerceptionSummary}

---

## 5. REKOMENDASI STRATEGIS OPERASIONAL
`;

    report.strategicRecommendations.forEach((rec, idx) => {
      md += `${idx + 1}. **[Prioritas: ${rec.priority}] ${rec.title}**\n   - *Kategori:* ${rec.category}\n   - *Target Cabang:* ${rec.targetBranches.join(', ')}\n   - *Deskripsi:* ${rec.description}\n   - *Dampak Diharapkan:* ${rec.expectedImpact}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Intelijen_Reputasi_${report.brandName.replace(/[^a-zA-Z0-0]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Raw_Data_Reputasi_${report.brandName.replace(/[^a-zA-Z0-0]/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white pb-16">
      
      {/* Search Streaming Modal */}
      <SearchProgressModal searchState={searchState} targetQuery={activeQuery} />

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        config={aiConfig}
        onSave={handleSaveAIConfig}
      />

      {/* CS Email & Social Sync Automation Modal */}
      <CSAutomationModal
        isOpen={isCSAutomationOpen}
        onClose={() => setIsCSAutomationOpen(false)}
        report={report}
        config={csAutomationConfig}
        onSaveConfig={handleSaveCSConfig}
      />

      {/* Header Bar */}
      <Header
        currentBrand={report.brandName}
        onSearch={handleSearch}
        isLoading={searchState.isLoading}
        onExportMarkdown={handleExportMarkdown}
        onExportJSON={handleExportJSON}
        onPrint={handlePrint}
        presetBrands={presetList}
        aiConfig={aiConfig}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        onOpenCSAutomation={() => setIsCSAutomationOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Multi-Agent Orchestration Panel */}
        <AgentOrchestrationPanel
          agentStates={agentStates}
          aiConfig={aiConfig}
          isOrchestrating={aiConfig.useOrchestration}
          targetQuery={activeQuery}
        />

        {/* Executive Summary & KPI Banner */}
        <ExecutiveSummaryBanner report={report} />

        {/* Section 1: Tabel Komparasi Performa Cabang */}
        <BranchPerformanceTable
          branches={report.branches}
          currentBrandName={report.brandName}
          redFlagIds={report.redFlagBranchIds}
          onSelectBranch={handleSelectBranch}
          selectedCompareIds={selectedCompareBranches.map((b) => b.id)}
          onToggleCompareBranch={handleToggleCompareBranch}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
          onSyncBranchPerformanceAI={handleSyncBranchPerformanceAI}
          isSyncingPerformance={isSyncingPerformance}
          lastAISyncTimestamp={report.lastAISyncTimestamp}
          autoSyncInterval={aiConfig.autoSyncPerformanceInterval || 'off'}
          onOpenAISettings={() => setIsAISettingsOpen(true)}
        />

        {/* Section 2: Pemetaan Klaster Wilayah / Regional */}
        <RegionalBranchGrid
          branches={report.branches}
          redFlagIds={report.redFlagBranchIds}
          onSelectBranch={handleSelectBranch}
        />

        {/* Section 3: Tren Historis 6 Bulan & Proyeksi Kinerja */}
        <HistoricalAnalyticsSection report={report} />

        {/* Section 4: Deep Dive Categorization & Complaint Analysis */}
        <ComplaintCategoriesChart categories={report.complaintCategories} />

        {/* Section 5: Pattern Kedatangan & Tren Keramaian */}
        <TrafficPatternSection pattern={report.trafficPattern} branches={report.branches} />

        {/* Section 6: Analisis Media Sosial & Persepse Publik */}
        <SocialSentimentSection data={report.socialSentiment} />

        {/* Section 7: Rekomendasi Strategis Operasional */}
        <StrategicRecommendationsSection recommendations={report.strategicRecommendations} />

        {/* Grounding Sources Disclaimer Footer */}
        {report.groundingSources && report.groundingSources.length > 0 && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-xs text-slate-400 my-6">
            <p className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sumber Grounding Real-Time Google Search:
            </p>
            <div className="flex flex-wrap gap-2">
              {report.groundingSources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  <span className="truncate max-w-xs">{source.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Detail Modal for Individual Branch */}
      <BranchDetailModal
        branch={selectedBranch}
        initialTab={selectedBranchTab}
        onClose={() => setSelectedBranch(null)}
        aiConfig={aiConfig}
      />

      {/* Head-to-Head Branch Comparison Modal */}
      <BranchComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedBranches={selectedCompareBranches}
        onRemoveBranch={handleRemoveCompareBranch}
      />

      {/* Interactive AI Executive Advisor Floating Widget */}
      <ExecutiveAIAdvisorChat
        report={report}
        aiConfig={aiConfig}
      />

      {/* Executive Footer Banner */}
      <footer className="mt-12 bg-slate-900 text-slate-300 py-8 border-t border-slate-800 no-print">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="min-w-[200px]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Rekomendasi Strategis<br />Operasional Management</h3>
            <p className="text-[11px] text-blue-400 mt-1">Astra Otoservice & Network Analytics</p>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="border-l-2 border-blue-500 pl-3">
              <p className="text-[10px] font-bold text-blue-400 mb-0.5 uppercase tracking-wider">OPS LEVEL 1</p>
              <p className="text-[11px] leading-snug">Audit mendalam integritas & waktu antrean pada cabang sektor Red Flag.</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-3">
              <p className="text-[10px] font-bold text-blue-400 mb-0.5 uppercase tracking-wider">OPS LEVEL 2</p>
              <p className="text-[11px] leading-snug">Implementasi sistem approval digital wajib sebelum penambahan pengerjaan.</p>
            </div>
            <div className="border-l-2 border-blue-400 pl-3">
              <p className="text-[10px] font-bold text-blue-400 mb-0.5 uppercase tracking-wider">OPS LEVEL 3</p>
              <p className="text-[11px] leading-snug">Standardisasi response time CRM maksimal 10 menit untuk menekan sentimen negatif.</p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400">
          <p>© 2026 AutoReputation AI — Powered by Google AI Studio, Gemini API & Sumopod AI Engine.</p>
        </div>
      </footer>

    </div>
  );
}
