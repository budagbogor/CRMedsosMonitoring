import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import Papa from 'papaparse';

interface BulkScrapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches?: any[];
}

export const BulkScrapeModal: React.FC<BulkScrapeModalProps> = ({ isOpen, onClose, branches = [] }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; taskId?: string } | null>(null);
  const [progress, setProgress] = useState<{current: number, total: number, status: string, error?: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (uploadResult?.success && uploadResult?.taskId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/scrape-status/${uploadResult.taskId}`);
          if (res.ok) {
            const data = await res.json();
            setProgress(data);
            if (data.status === 'completed' || data.status === 'error') {
              clearInterval(interval);
              setIsUploading(false);
              if (data.status === 'completed') {
                alert(`✅ Proses scraping selesai! Berhasil memproses ${data.total} cabang. Silakan refresh halaman.`);
              } else {
                alert("⚠️ Terjadi kesalahan saat scraping: " + data.error);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [uploadResult]);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent = "NamaCabang,Kota,URLGoogleMaps\nMobeng Cipondoh,Tangerang,https://www.google.com/maps/place/MOBENG+Cipondoh...\nMobeng BSD,Tangerang Selatan,https://www.google.com/maps/place/...";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Template_Bulk_Scrape_Cabang.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadResult(null);
      setProgress(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);
    setProgress(null);

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('/api/bulk-scrape', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setUploadResult({
        success: data.success,
        message: data.message || data.error,
        taskId: data.taskId
      });
      if (data.success) {
        setFile(null);
      } else {
        setIsUploading(false);
      }
    } catch (err: any) {
      setUploadResult({ success: false, message: 'Gagal menghubungi server: ' + err.message });
      setIsUploading(false);
    }
  };

  const handleScrapeAll = async () => {
    if (!branches || branches.length === 0) return;
    
    setIsUploading(true);
    setUploadResult(null);
    setProgress(null);

    try {
      const response = await fetch('/api/bulk-scrape-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branches }),
      });

      const data = await response.json();
      setUploadResult({
        success: data.success,
        message: data.message || data.error,
        taskId: data.taskId
      });
      
      if (!data.success) {
        setIsUploading(false);
      }
    } catch (err: any) {
      setUploadResult({ success: false, message: 'Gagal menghubungi server: ' + err.message });
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 shadow-inner">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Bulk Import & Scraping</h3>
              <p className="text-xs text-slate-500">Otomatisasi scraping banyak cabang sekaligus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4" /> Otomatis (Tanpa Upload)
            </h4>
            <p className="text-xs text-blue-800/80 mb-4">
              Scrape seluruh data cabang yang sudah ada di dalam tabel halaman utama secara otomatis. Sistem akan mencari data rating dan ulasan berdasarkan nama dan kota cabang.
            </p>
            <button
              onClick={handleScrapeAll}
              disabled={isUploading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              {isUploading ? 'Sedang Memproses...' : `Scrape Semua ${branches ? branches.length : 0} Cabang Sekarang`}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATAU VIA CSV</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-4 h-4" /> 1. Download Template CSV
            </h4>
            <p className="text-xs text-amber-700/80 mb-3">
              Gunakan template ini untuk mendaftarkan URL Google Maps cabang baru.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download Template.csv
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">2. Upload File CSV</h4>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${file ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
            >
              <Upload className={`w-8 h-8 mb-3 ${file ? 'text-blue-500' : 'text-slate-400'}`} />
              
              {file ? (
                <>
                  <p className="text-sm font-bold text-slate-700">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  <button 
                    onClick={() => setFile(null)}
                    className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Batal Pilih
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-600 mb-1">Tarik & lepas file CSV di sini, atau</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Pilih File
                  </button>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
          </div>

          {uploadResult && (
            <div className={`p-4 rounded-xl flex flex-col gap-3 border ${uploadResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                {uploadResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="w-full">
                  <h5 className={`text-sm font-bold ${uploadResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                    {progress?.status === 'completed' ? 'Proses Selesai!' : uploadResult.success ? 'Berhasil Masuk Antrean' : 'Proses Gagal'}
                  </h5>
                  <p className={`text-xs mt-1 ${uploadResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                    {progress?.status === 'completed' ? `Berhasil memproses ${progress.total} cabang.` : uploadResult.message}
                  </p>
                </div>
              </div>

              {progress && uploadResult.success && progress.status !== 'completed' && (
                <div className="w-full mt-2">
                  <div className="flex justify-between text-xs font-bold text-emerald-800 mb-1">
                    <span>Sedang memproses: {progress.current} dari {progress.total} cabang</span>
                    <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.max(3, (progress.current / progress.total) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Mulai Bulk Scraping
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
