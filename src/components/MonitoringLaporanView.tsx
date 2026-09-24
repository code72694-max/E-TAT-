import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { CommandCenterAnalytics } from './CommandCenterAnalytics';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  Download,
  ShieldCheck,
  Building,
  Users
} from 'lucide-react';

interface MonitoringLaporanViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
}

export const MonitoringLaporanView: React.FC<MonitoringLaporanViewProps> = ({
  permohonanList,
  currentUser
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Monitoring Kinerja & 8 Indikator Keberhasilan Layanan e-TAT</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengukuran kepatuhan SLA, kualitas verifikasi berkas, soliditas musyawarah pleno, dan keterlaksanaan rujukan rehabilitasi.
          </p>
        </div>

        <button
          onClick={() => alert('Laporan Kinerja e-TAT Periode September 2026 diekspor ke format PDF/Excel.')}
          className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all"
        >
          <Download className="w-4 h-4 text-[#F1C40F]" />
          <span>Unduh Laporan Kinerja (PDF/XLS)</span>
        </button>
      </div>

      {/* Real-time Command Center Live Analytics Board */}
      <div className="bg-[#071326] p-4 sm:p-6 rounded-2xl border border-[#1b3459] shadow-xl">
        <div className="mb-4 pb-2 border-b border-[#1b3459] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Cinzel',serif]">
              PUSAT KENDALI OPERASIONAL TERPADU (LIVE COMMAND CENTER)
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            SYNC DATA: OTOMATIS
          </span>
        </div>
        <CommandCenterAnalytics />
      </div>

      {/* 8 Indikator Keberhasilan (Dokumen 1 Bab 8.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Indikator 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 1</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Target: ≤ 6 Hari</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Rata-rata Waktu Layanan</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">4.8 Hari</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">✓ Sesuai standar SLA Tim Asesmen</p>
        </div>

        {/* Indikator 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 2</span>
            <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">Target: &lt; 20%</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Berkas Perlu Perbaikan Pertama</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-2">16.7%</div>
          <p className="text-[11px] text-slate-500 mt-1">1 dari 6 pengajuan butuh koreksi berkas</p>
        </div>

        {/* Indikator 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 3</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded">Target: ≤ 2 Hari</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Kecepatan Perbaikan Pengaju</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">1.2 Hari</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Penyidik responsif merespons catatan</p>
        </div>

        {/* Indikator 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 4</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Target: &gt; 90%</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Kepatuhan Jadwal Asesor</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">94.2%</div>
          <p className="text-[11px] text-slate-500 mt-1">Kehadiran tepat waktu sesi medis & hukum</p>
        </div>

        {/* Indikator 5 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 5</span>
            <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.2 rounded">Soliditas Pleno</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Kesepakatan Pleno Aklamasi</span>
          <div className="text-2xl font-extrabold text-indigo-900 mt-2">85.7%</div>
          <p className="text-[11px] text-slate-500 mt-1">14.3% mencatat dissenting opinion</p>
        </div>

        {/* Indikator 6 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 6</span>
            <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded">Target: ≤ 24 Jam</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Kecepatan Terbit Rekomendasi</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">6.4 Jam</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Sejak penutupan berita acara pleno</p>
        </div>

        {/* Indikator 7 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 7</span>
            <span className="text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded">Target: &gt; 80%</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Keterlaksanaan Rujukan Klien</span>
          <div className="text-2xl font-extrabold text-teal-800 mt-2">81.5%</div>
          <p className="text-[11px] text-slate-500 mt-1">Klien berhasil admisi di fasilitas rehab</p>
        </div>

        {/* Indikator 8 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Indikator 8</span>
            <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.2 rounded">Kasus Tertahan</span>
          </div>
          <span className="text-xs font-bold text-slate-800 block">Kasus Tertahan (Bottleneck)</span>
          <div className="text-2xl font-extrabold text-rose-700 mt-2">1 Kasus</div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Penyebab: Kuota Balai Lido penuh</p>
        </div>
      </div>

      {/* SLA & Stage Bottleneck Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Sebaran Kasus Berdasarkan Waktu Layanan SLA</span>
          </h3>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700">Tepat Waktu / Aman (&lt; 4 Hari)</span>
                <span className="text-slate-800">4 Kasus (66.7%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[66.7%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700">Mendekati Batas SLA (Hari ke 5-6)</span>
                <span className="text-slate-800">1 Kasus (16.7%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[16.7%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700">Melewati Target SLA (&gt; 6 Hari)</span>
                <span className="text-slate-800">1 Kasus (16.7%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full w-[16.7%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Fasilitas Rehabilitasi Terbanyak Menerima Rujukan</span>
          </h3>
          <div className="space-y-2.5 pt-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Balai Besar Rehabilitasi BNN Lido</span>
                <span className="text-[11px] text-slate-500">Bogor, Jawa Barat (Rawat Inap Medis)</span>
              </div>
              <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">18 Klien</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Klinik Pratama BNNP Jawa Barat</span>
                <span className="text-[11px] text-slate-500">Bandung (Rawat Jalan Intensif)</span>
              </div>
              <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">14 Klien</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">RSKO Cibubur</span>
                <span className="text-[11px] text-slate-500">Jakarta Timur (Detoksifikasi & Psikiatri)</span>
              </div>
              <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">8 Klien</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
