import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { PelaksanaanRehab, JenisLaporanKontrol, MonitoringTindakLanjut } from '../../types';

export const genId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
export const today = () => new Date().toISOString().slice(0, 10);

export interface SaveConfirmInfo {
  title: string;
  description: string;
  nextStepLabel?: string;
  nextTab?: 'pelaksanaan' | 'laporan' | 'wajib_lapor' | 'akhir';
}

export const STATUS_PELAKSANAAN_LABELS: Record<PelaksanaanRehab['statusPelaksanaan'], string> = {
  perlu_konfirmasi: 'Perlu Konfirmasi',
  koordinasi_berjalan: 'Koordinasi Berjalan',
  serah_terima_selesai: 'Serah Terima Selesai',
  klien_mulai_layanan: 'Klien Mulai Layanan',
  terkendala_eskalasi: 'Terkendala / Eskalasi',
};

export const STATUS_MONITORING_LABELS: Record<MonitoringTindakLanjut['statusMonitoring'], string> = {
  menunggu_pelaksanaan: 'Menunggu Pelaksanaan',
  berjalan: 'Berjalan (Aktif)',
  terkendala: 'Terkendala / Eskalasi',
  selesai: 'Selesai Program (Lulus)',
  tidak_terlaksana: 'Tidak Terlaksana',
};

export const JENIS_LAPORAN_OPTIONS: JenisLaporanKontrol[] = [
  'Laporan Kemajuan Periodik',
  'Laporan Kunjungan Kontrol',
  'Laporan Evaluasi Klinis',
  'Laporan Wajib Lapor',
  'Laporan Kejadian Khusus',
  'Laporan Akhir Layanan',
];

export const SectionHeader: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className="flex items-start gap-3 pb-3.5 border-b border-slate-800/80">
    <div className="p-2 bg-slate-800/80 border border-slate-700/60 text-slate-300 rounded-lg shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

export const InfoBadge: React.FC<{ label: string; color?: 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'purple' }> = ({ label, color = 'slate' }) => {
  const colorMap = {
    blue: 'bg-slate-800 text-blue-300 border-slate-700',
    green: 'bg-slate-800 text-emerald-300 border-slate-700',
    amber: 'bg-slate-800 text-amber-300 border-slate-700',
    red: 'bg-slate-800 text-rose-300 border-slate-700',
    purple: 'bg-slate-800 text-purple-300 border-slate-700',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/70',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${colorMap[color]}`}>
      {label}
    </span>
  );
};

export const FieldGroup: React.FC<{ label: string; required?: boolean; hint?: string; children: React.ReactNode }> = ({ label, required, hint, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-300 block">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    {children}
  </div>
);

export const SaveConfirmModal: React.FC<{
  info: SaveConfirmInfo;
  onClose: () => void;
  onNavigateTab: (tab: 'pelaksanaan' | 'laporan' | 'wajib_lapor' | 'akhir') => void;
}> = ({ info, onClose, onNavigateTab }) => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    style={{ background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)' }}
  >
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">{info.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{info.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-all"
        >
          Tutup
        </button>
        {info.nextTab && (
          <button
            type="button"
            onClick={() => onNavigateTab(info.nextTab!)}
            className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all"
          >
            {info.nextStepLabel || 'Lanjut Tahap Berikutnya'}
          </button>
        )}
      </div>
    </div>
  </div>
);
