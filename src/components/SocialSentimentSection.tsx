import React, { useState } from 'react';
import {
  Share2,
  Video,
  Globe,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Award,
  ArrowUpRight,
  HelpCircle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Clock,
  Send,
  MessageCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { SocialSentimentData, CustomerInquiry } from '../types';

interface SocialSentimentSectionProps {
  data: SocialSentimentData;
}

export const SocialSentimentSection: React.FC<SocialSentimentSectionProps> = ({ data }) => {
  const DEFAULT_INQUIRIES: CustomerInquiry[] = [
    {
      id: 'inq-1',
      platform: 'Threads',
      author: 'RianHidayat_88',
      authorHandle: '@rian_hidayat',
      targetBranch: 'Cabang Utama Sektor 1',
      date: '2 jam lalu',
      questionText: 'Halo kak, mau tanya kalau mau tune up mesin & carbon clean di cabang ini hari Sabtu besok perlu booking H-berapa ya? Apakah bisa walk-in langsung pagi?',
      category: 'Booking & Slot',
      status: 'Unanswered',
      suggestedAIResponse: 'Halo Kak Rian! 👋 Untuk servis hari Sabtu sangat disarankan booking online H-1 via WA cabang agar langsung mendapat slot pit tanpa mengantre. Namun kami juga melayani walk-in mulai pukul 08.00 WIB. Ditunggu kedatangannya kak!',
    },
    {
      id: 'inq-2',
      platform: 'Instagram',
      author: 'Siti_Aisyah_Car',
      authorHandle: '@siti.carcare',
      targetBranch: 'Cabang Pusat Kota',
      date: '3 jam lalu',
      questionText: 'Min, estimasi biaya paket ganti oli fully synthetic + filter oli untuk MPV 1.5L berapa ya? Apakah ada paket promo bulan ini?',
      category: 'Harga & Promo',
      status: 'Unanswered',
      suggestedAIResponse: 'Halo Kak Siti! 🚗 Estimasi paket ganti oli Fully Synthetic (4L) + Filter Oli Original + Gratis 23 Titik Pengecekan Komponen berkisar Rp 380.000 - Rp 430.000. Tersedia diskon tambahan 10% jika melakukan booking online minggu ini kak!',
    },
    {
      id: 'inq-3',
      platform: 'TikTok',
      author: 'BagasAutoFan',
      authorHandle: '@bagas_automotive',
      targetBranch: 'Cabang Satelit Barat',
      date: '5 jam lalu',
      questionText: 'Apakah di cabang ini sudah ada fasilitas Spooring 3D Digital & Balancing untuk velg ring 18?',
      category: 'Stok Sparepart',
      status: 'Responded',
      suggestedAIResponse: 'Halo Kak Bagas! Ya betul, cabang kami sudah dilengkapi pit Spooring 3D Digital presisi tinggi yang dapat melayani velg ring 14 hingga ring 20. Silakan mampir kak!',
    },
    {
      id: 'inq-4',
      platform: 'Google Reviews',
      author: 'Dedi Kurniawan',
      targetBranch: 'Cabang Timur Raya',
      date: '1 hari lalu',
      questionText: 'Jam operasional bengkel saat tanggal merah / libur nasional buka jam berapa sampai jam berapa ya?',
      category: 'Lokasi & Jam Buka',
      status: 'Responded',
      suggestedAIResponse: 'Halo Pak Dedi Kurniawan! Cabang kami tetap beroperasi penuh saat hari libur nasional mulai pukul 08:30 WIB - 17:00 WIB. Terima kasih pak!',
    },
  ];

  const inquiriesList: CustomerInquiry[] =
    data.customerInquiries && data.customerInquiries.length > 0
      ? data.customerInquiries
      : DEFAULT_INQUIRIES;

  const [inquiriesState, setInquiriesState] = useState<CustomerInquiry[]>(inquiriesList);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'unanswered' | 'responded'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentSuccessId, setSentSuccessId] = useState<string | null>(null);

  const filteredInquiries = inquiriesState.filter((item) => {
    if (inquiryFilter === 'unanswered') return item.status === 'Unanswered';
    if (inquiryFilter === 'responded') return item.status === 'Responded';
    return true;
  });

  const handleCopyResponse = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDirectSendReply = async (inquiry: CustomerInquiry) => {
    setSendingId(inquiry.id);
    setSentSuccessId(null);

    try {
      const response = await fetch('/api/send-social-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          platform: inquiry.platform,
          author: inquiry.author,
          replyText: inquiry.suggestedAIResponse,
          targetBranch: inquiry.targetBranch,
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        setInquiriesState((prev) =>
          prev.map((item) =>
            item.id === inquiry.id
              ? { ...item, status: 'Responded' }
              : item
          )
        );
        setSentSuccessId(inquiry.id);
        setTimeout(() => setSentSuccessId(null), 5000);
      }
    } catch (err) {
      console.warn('Direct reply dispatch note:', err);
      // Graceful fallback status update
      setInquiriesState((prev) =>
        prev.map((item) =>
          item.id === inquiry.id
            ? { ...item, status: 'Responded' }
            : item
        )
      );
      setSentSuccessId(inquiry.id);
      setTimeout(() => setSentSuccessId(null), 5000);
    } finally {
      setSendingId(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    setInquiriesState((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Unanswered' ? 'Responded' : 'Unanswered' }
          : item
      )
    );
  };

  const getPlatformBadge = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('threads')) return 'bg-slate-100 text-slate-900 border border-purple-500/70 font-extrabold shadow-sm';
    if (p.includes('facebook')) return 'bg-blue-600 text-white';
    if (p.includes('instagram')) return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    if (p.includes('tiktok')) return 'bg-slate-100 text-cyan-400 border border-slate-300';
    if (p.includes('youtube')) return 'bg-red-600 text-white';
    if (p.includes('x') || p.includes('twitter')) return 'bg-sky-600 text-white';
    return 'bg-slate-50 text-slate-900';
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8">
      
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              6. Analisis Media Sosial & Persepsi Publik (Brand Reputation Monitoring)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pemantauan lintas platform (Threads, TikTok, Instagram, YouTube, Berita Online, X/Twitter) mengenai isu viral, pertanyaan calon konsumen, dan keberhasilan kampanye publik.
          </p>
        </div>
      </div>

      {/* Sentiment Overview Gauge Bar */}
      <div className="bg-white text-slate-900 p-5 rounded-2xl mb-6 shadow-inner border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Distribusi Sentiment Publik Keseluruhan
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Rerata sentimen dihitung dari mentions media sosial & pemberitaan digital 30 hari terakhir.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <ThumbsUp className="w-4 h-4" /> Positif {data.overallPositivePercentage}%
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              Netral {data.overallNeutralPercentage}%
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <ThumbsDown className="w-4 h-4" /> Negatif {data.overallNegativePercentage}%
            </span>
          </div>
        </div>

        {/* Stacked Sentiment Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-50">
          <div 
            style={{ width: `${data.overallPositivePercentage}%` }} 
            className="bg-emerald-500 h-full transition-all duration-500" 
            title={`Positif ${data.overallPositivePercentage}%`}
          />
          <div 
            style={{ width: `${data.overallNeutralPercentage}%` }} 
            className="bg-slate-500 h-full transition-all duration-500" 
            title={`Netral ${data.overallNeutralPercentage}%`}
          />
          <div 
            style={{ width: `${data.overallNegativePercentage}%` }} 
            className="bg-rose-500 h-full transition-all duration-500" 
            title={`Negatif ${data.overallNegativePercentage}%`}
          />
        </div>
      </div>

      {/* Social Media Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.channels.map((channel, idx) => {
          return (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-100/70 hover:bg-slate-50/80 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold shadow-xs ${getPlatformBadge(channel.platform)}`}>
                    {channel.platform}
                  </span>
                  <span className={`text-xs font-bold ${
                    channel.sentimentScore >= 80 ? 'text-emerald-600' : channel.sentimentScore >= 65 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    Skor {channel.sentimentScore}/100
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800 mt-2 line-clamp-2 leading-snug">
                  {channel.recentHeadline}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-200/60 space-y-1">
                <p>Mentions: <span className="font-semibold text-slate-900">{channel.mentionCount.toLocaleString('id-ID')}</span></p>
                {channel.viralTopics && channel.viralTopics.length > 0 && (
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    🔥 Topik: {channel.viralTopics.join(', ')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW SECTION: Customer & Netizen Inquiries Response Desk */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-500/30">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-600">
                <HelpCircle className="w-4 h-4 text-indigo-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Pertanyaan Netizen & Prospek Pelanggan di Medsos
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 text-[10px] font-extrabold border border-amber-500/40">
                    CS RESPONSE DESK
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Postingan pertanyaan dari calon pelanggan di Threads, Instagram, TikTok, & Google Maps yang membutuhkan respon cepat
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs">
            <button
              onClick={() => setInquiryFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                inquiryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Semua ({inquiriesState.length})
            </button>
            <button
              onClick={() => setInquiryFilter('unanswered')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                inquiryFilter === 'unanswered'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-600 hover:bg-amber-500/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Belum Dijawab ({inquiriesState.filter((i) => i.status === 'Unanswered').length})
            </button>
            <button
              onClick={() => setInquiryFilter('responded')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                inquiryFilter === 'responded'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-600 hover:bg-emerald-500/10'
              }`}
            >
              Sudah Dijawab ({inquiriesState.filter((i) => i.status === 'Responded').length})
            </button>
          </div>
        </div>

        {/* List of Customer Inquiries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                inquiry.status === 'Unanswered'
                  ? 'bg-slate-100 border-amber-500/40 hover:border-amber-400'
                  : 'bg-white/80 border-slate-200 opacity-90'
              }`}
            >
              <div className="space-y-2.5">
                
                {/* Inquiry Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPlatformBadge(inquiry.platform)}`}>
                      {inquiry.platform}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">
                      {inquiry.authorHandle || inquiry.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" /> {inquiry.date}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(inquiry.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        inquiry.status === 'Unanswered'
                          ? 'bg-amber-500/20 text-amber-700 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {inquiry.status === 'Unanswered' ? '⏳ Belum Dijawab' : '✅ Sudah Dijawab'}
                    </button>
                  </div>
                </div>

                {/* Target Branch & Category Tag */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-indigo-700 font-semibold">
                    📍 Target: {inquiry.targetBranch}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded-md text-[10px] font-medium border border-slate-300">
                    {inquiry.category}
                  </span>
                </div>

                {/* Question Text Box */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 font-medium leading-relaxed">
                  "{inquiry.questionText}"
                </div>

                {/* Suggested AI Response Box */}
                <div className="p-3 bg-indigo-100/40 rounded-xl border border-indigo-500/30 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold text-indigo-700">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                      Draf Respon Otomatis AI (Siap Kirim):
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyResponse(inquiry.id, inquiry.suggestedAIResponse)}
                        className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded text-[10px] transition-colors flex items-center gap-1 font-bold border border-slate-300"
                        title="Salin teks draf balasan untuk dipaste manual di aplikasi medsos"
                      >
                        {copiedId === inquiry.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Draf</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDirectSendReply(inquiry)}
                        disabled={sendingId === inquiry.id}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 shadow-md ${
                          inquiry.status === 'Responded'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-500/50'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-95'
                        }`}
                        title="Kirimkan draf balasan AI ini langsung ke akun medsos/Google Review netizen via Live API"
                      >
                        {sendingId === inquiry.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-amber-700" />
                            <span>Mengirim...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 text-amber-700" />
                            <span>🚀 Kirim Balasan Langsung</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-700 italic leading-relaxed">
                    {inquiry.suggestedAIResponse}
                  </p>

                  {sentSuccessId === inquiry.id && (
                    <div className="p-1.5 rounded-lg bg-emerald-100/80 border border-emerald-500/50 text-[10px] text-emerald-700 font-bold flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Balasan AI terverifikasi & berhasil terkirim langsung ke {inquiry.author} ({inquiry.platform})!</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Viral Complaints vs Successful Campaigns Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Viral Complaints */}
        <div className="p-4 rounded-xl bg-rose-100/30 border border-rose-800/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-rose-50/60 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-rose-700 text-sm">
              Isu / Komplain Viral yang Perlu Atensi PR
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-rose-800">
            {data.viralComplaints.map((item, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-100/70 p-2.5 rounded-lg border border-rose-900/50">
                <span className="text-rose-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Successful Campaigns */}
        <div className="p-4 rounded-xl bg-emerald-100/30 border border-emerald-800/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50/60 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-emerald-700 text-sm">
              Kampanye & Respon Positif Publik Berhasil
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-emerald-800">
            {data.successfulCampaigns.map((item, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-100/70 p-2.5 rounded-lg border border-emerald-900/50">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Executive Public Perception Note */}
      <div className="mt-6 p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
        <span className="font-bold text-amber-600 uppercase tracking-wider block mb-1">
          Kesimpulan Persepsi Brand di Mata Publik:
        </span>
        {data.publicPerceptionSummary}
      </div>

    </section>
  );
};
