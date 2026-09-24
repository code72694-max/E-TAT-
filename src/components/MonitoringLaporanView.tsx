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
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <BarChart3 className="w-5 h-5 text-slate-300" />
            <span>Monitoring Kinerja & 8 Indikator Keberhasilan Layanan e-TAT</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengukuran kepatuhan SLA, kualitas verifikasi berkas, soliditas musyawarah pleno, dan keterlaksanaan rujukan rehabilitasi.
          </p>
        </div>

        <button
          onClick={() => alert('Laporan Kinerja e-TAT Periode September 2026 diekspor ke format PDF/Excel.')}
          className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 border border-[#235594] shadow-md cursor-pointer transition-all"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Unduh Laporan Kinerja (PDF/XLS)</span>
        </button>
      </div>

      {/* Real-time Command Center Live Analytics Board */}
      <div className="bg-[#0b172a] p-4 sm:p-6 rounded-2xl border border-[#1b3459] shadow-xl">
        <div className="mb-4 pb-2 border-b border-[#1b3459] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
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

      {/* 8 Indikator Keberhasilan - Monochromatic & Disciplined */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Indikator 1 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 1</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Target: ≤ 6 Hari</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Rata-rata Waktu Layanan</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">4.8 Hari</div>
          <p className="text-[11px] text-slate-400 mt-1">Sesuai standar SLA Tim Asesmen</p>
        </div>

        {/* Indikator 2 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 2</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Target: &lt; 20%</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Berkas Perlu Perbaikan Pertama</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">16.7%</div>
          <p className="text-[11px] text-slate-400 mt-1">1 dari 6 pengajuan butuh koreksi berkas</p>
        </div>

        {/* Indikator 3 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 3</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Target: ≤ 2 Hari</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Kecepatan Perbaikan Pengaju</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">1.2 Hari</div>
          <p className="text-[11px] text-slate-400 mt-1">Penyidik responsif merespons catatan</p>
        </div>

        {/* Indikator 4 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 4</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Target: &gt; 90%</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Kepatuhan Jadwal Asesor</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">94.2%</div>
          <p className="text-[11px] text-slate-400 mt-1">Kehadiran tepat waktu sesi medis & hukum</p>
        </div>

        {/* Indikator 5 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 5</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Soliditas Pleno</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Kesepakatan Pleno Aklamasi</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">85.7%</div>
          <p className="text-[11px] text-slate-400 mt-1">14.3% mencatat dissenting opinion</p>
        </div>

        {/* Indikator 6 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 6</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Target: ≤ 24 Jam</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Kecepatan Terbit Rekomendasi</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">6.4 Jam</div>
          <p className="text-[11px] text-slate-400 mt-1">Sejak penutupan berita acara pleno</p>
        </div>

        {/* Indikator 7 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 7</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Target: &gt; 80%</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Keterlaksanaan Rujukan Klien</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">81.5%</div>
          <p className="text-[11px] text-slate-400 mt-1">Klien berhasil admisi di fasilitas rehab</p>
        </div>

        {/* Indikator 8 */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indikator 8</span>
            <span className="text-slate-300 font-mono text-[10px] bg-[#081224] border border-[#1b3459] px-2 py-0.5 rounded">Kasus Tertahan</span>
          </div>
          <span className="text-xs font-bold text-slate-200 block">Kasus Tertahan (Bottleneck)</span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">1 Kasus</div>
          <p className="text-[11px] text-slate-400 mt-1">Penyebab: Kuota Balai Lido penuh</p>
        </div>
      </div>

      {/* SLA & Stage Bottleneck Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-3 shadow-lg shadow-black/20">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Sebaran Kasus Berdasarkan Waktu Layanan SLA</span>
          </h3>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-200">Tepat Waktu / Aman (&lt; 4 Hari)</span>
                <span className="text-slate-300 font-mono">4 Kasus (66.7%)</span>
              </div>
              <div className="w-full h-2 bg-[#081224] rounded-full overflow-hidden border border-[#1b3459]">
                <div className="bg-[#38bdf8] h-full rounded-full w-[66.7%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Mendekati Batas SLA (Hari ke 5-6)</span>
                <span className="text-slate-300 font-mono">1 Kasus (16.7%)</span>
              </div>
              <div className="w-full h-2 bg-[#081224] rounded-full overflow-hidden border border-[#1b3459]">
                <div className="bg-[#204975] h-full rounded-full w-[16.7%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Melewati Target SLA (&gt; 6 Hari)</span>
                <span className="text-slate-300 font-mono">1 Kasus (16.7%)</span>
              </div>
              <div className="w-full h-2 bg-[#081224] rounded-full overflow-hidden border border-[#1b3459]">
                <div className="bg-[#1b3459] h-full rounded-full w-[16.7%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-3 shadow-lg shadow-black/20">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span>Fasilitas Rehabilitasi Terbanyak Menerima Rujukan</span>
          </h3>
          <div className="space-y-2.5 pt-2 text-xs">
            <div className="p-2.5 bg-[#081224] border border-[#1b3459] rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Balai Besar Rehabilitasi BNN Lido</span>
                <span className="text-[11px] text-slate-400">Bogor, Jawa Barat (Rawat Inap Medis)</span>
              </div>
              <span className="font-mono font-bold bg-[#0b172a] text-slate-200 px-2.5 py-1 rounded border border-[#1b3459]">18 Klien</span>
            </div>

            <div className="p-2.5 bg-[#081224] border border-[#1b3459] rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Klinik Pratama BNNP Jawa Barat</span>
                <span className="text-[11px] text-slate-400">Bandung (Rawat Jalan Intensif)</span>
              </div>
              <span className="font-mono font-bold bg-[#0b172a] text-slate-200 px-2.5 py-1 rounded border border-[#1b3459]">14 Klien</span>
            </div>

            <div className="p-2.5 bg-[#081224] border border-[#1b3459] rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">RSKO Cibubur</span>
                <span className="text-[11px] text-slate-400">Jakarta Timur (Detoksifikasi & Psikiatri)</span>
              </div>
              <span className="font-mono font-bold bg-[#0b172a] text-slate-200 px-2.5 py-1 rounded border border-[#1b3459]">8 Klien</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
