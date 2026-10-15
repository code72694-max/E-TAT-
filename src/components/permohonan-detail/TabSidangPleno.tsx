import React, { useState } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
} from '../../types';
import {
  Users,
  Calendar,
  FileCheck2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  Shield,
  Clock,
  Printer
} from 'lucide-react';
import { BeritaAcaraModal } from '../BeritaAcaraModal';
import { FormHasilPlenoModal } from '../FormHasilPlenoModal';

interface TabSidangPlenoProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  effectiveReadonly: boolean;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onNavigateTab: (tab: any) => void;
}

export const TabSidangPleno: React.FC<TabSidangPlenoProps> = ({
  permohonan,
  currentUser,
  effectiveReadonly,
  onUpdatePermohonan,
  onNavigateTab,
}) => {
  const [showBaModal, setShowBaModal] = useState(false);
  const [showHasilModal, setShowHasilModal] = useState(false);

  const pleno = permohonan.sidangPleno;
  const isMedisReady = permohonan.asesmenMedis?.status === 'FINAL';
  const isHukumReady = permohonan.asesmenHukum?.status === 'FINAL';
  const isReadyForPleno = isMedisReady && isHukumReady;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Musyawarah Sidang Pleno Tim Asesmen Terpadu (TAT)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Rapat pleno multi-instansi (Kepolisian, Kejaksaan, BNN, Tenaga Medis) untuk merumuskan kesepakatan rekomendasi akhir.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {pleno && (
            <button
              onClick={() => setShowBaModal(true)}
              className="bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234475] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lihat Berita Acara Pleno</span>
            </button>
          )}
        </div>
      </div>

      {/* Prasyarat Sidang Pleno Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isMedisReady ? 'bg-[#081224] border-emerald-500/30 text-emerald-200' : 'bg-[#18110b] border-amber-500/40 text-amber-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Prasyarat 1: Asesmen Medis</span>
            <span className="text-xs font-bold text-white block">
              {isMedisReady ? '✓ Asesmen Medis Difinalisasi' : 'Belum Selesai Difinalisasi'}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
            isMedisReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isMedisReady ? 'Siap Pleno' : 'Menunggu Dokter'}
          </span>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isHukumReady ? 'bg-[#081224] border-emerald-500/30 text-emerald-200' : 'bg-[#18110b] border-amber-500/40 text-amber-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Prasyarat 2: Asesmen Hukum</span>
            <span className="text-xs font-bold text-white block">
              {isHukumReady ? '✓ Asesmen Hukum Difinalisasi' : 'Belum Selesai Difinalisasi'}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
            isHukumReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isHukumReady ? 'Siap Pleno' : 'Menunggu Penelaah'}
          </span>
        </div>
      </div>

      {/* Main Pleno Summary Card */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Hasil Kesepakatan Sidang Pleno Terpadu
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pimpinan Sidang: <strong className="text-slate-200">{pleno?.pimpinanPleno || 'Ketua Tim Asesmen Terpadu'}</strong>
            </p>
          </div>

          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
            pleno?.statusPleno === 'SELESAI'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {pleno?.statusPleno === 'SELESAI' ? '✓ PLENO SELESAI' : 'MENUNGGU KESEPAKATAN'}
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block mb-1">Rekomendasi Terpadu Hasil Musyawarah:</span>
            <div className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-slate-200 font-medium leading-relaxed">
              {pleno?.kesimpulanRekomendasi ||
                'Terperiksa memenuhi kriteria sebagai Korban Penyalahgunaan Narkotika yang layak menjalani Rehabilitasi Medis dan Sosial Rawat Inap selama 3 bulan di Balai Besar Rehabilitasi BNN Tanah Merah.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Modalitas Layanan:</span>
              <span className="font-bold text-white mt-1 block">
                {pleno?.rekomendasiRehab?.modalitas || 'Rehabilitasi Rawat Inap'}
              </span>
            </div>
            <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Durasi Program:</span>
              <span className="font-bold text-[#D4AF37] font-mono mt-1 block">
                {pleno?.rekomendasiRehab?.durasiBulan || 3} Bulan
              </span>
            </div>
            <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fasilitas Rujukan:</span>
              <span className="font-bold text-white mt-1 block truncate">
                {pleno?.rekomendasiRehab?.namaFasilitas || 'Balai Rehabilitasi BNN Tanah Merah'}
              </span>
            </div>
          </div>

          {pleno?.catatanPleno && (
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Catatan Khusus Notulen Rapat:</span>
              <p className="text-slate-300 italic p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl">
                "{pleno.catatanPleno}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#1b3459]">
          <div className="text-xs text-slate-400">
            {isReadyForPleno ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Kedua asesmen (Medis & Hukum) siap. Musyawarah pleno dapat difinalisasi.
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Selesaikan finalisasi Asesmen Medis & Hukum sebelum mengesahkan Berita Acara Pleno.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!effectiveReadonly && (
              <button
                onClick={() => setShowHasilModal(true)}
                className="bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234475] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
              >
                Catat Hasil Musyawarah Pleno
              </button>
            )}

            <button
              onClick={() => onNavigateTab('dokumen')}
              className="bg-[#D4AF37] hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-lg shadow-amber-950/30 cursor-pointer"
            >
              <span>Lanjut ke Tanda Tangan & PDF</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Berita Acara */}
      {showBaModal && (
        <BeritaAcaraModal
          permohonan={permohonan}
          currentUser={currentUser}
          onClose={() => setShowBaModal(false)}
        />
      )}

      {/* Modal Form Hasil Pleno */}
      {showHasilModal && (
        <FormHasilPlenoModal
          permohonan={permohonan}
          currentUser={currentUser}
          onClose={() => setShowHasilModal(false)}
          onUpdatePermohonan={onUpdatePermohonan}
        />
      )}
    </div>
  );
};
