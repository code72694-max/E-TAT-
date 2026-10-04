import React, { useState, useMemo } from 'react';
import { PermohonanAsesmen, StatusProsesUtama, UserProfile } from '../types';
import {
  Search,
  Filter,
  Clock,
  User,
  Plus,
  ArrowRight,
  Shield,
  FileText,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  History
} from 'lucide-react';

interface PermohonanListProps {
  permohonanList: PermohonanAsesmen[];
  currentUser?: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onOpenNewModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateToRiwayat?: () => void;
}

export const PermohonanList: React.FC<PermohonanListProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onOpenNewModal,
  searchQuery,
  onSearchChange,
  onNavigateToRiwayat
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSla, setSelectedSla] = useState<string>('all');

  const role = currentUser?.role || 'sekretariat';

  const filteredList = useMemo(() => {
    return permohonanList.filter(item => {
      // Role-specific scoping
      if (role === 'rehabilitasi') {
        // Only show items that have recommendation for rehabilitation or in referral stage
        if (!item.tindakLanjut && item.statusProsesUtama !== 'rekomendasi_terbit' && item.statusProsesUtama !== 'selesai_tindak_lanjut') {
          return false;
        }
      }

      // Search match
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        item.nomorPermohonan.toLowerCase().includes(query) ||
        item.terperiksa.namaLengkap.toLowerCase().includes(query) ||
        item.perkara.nomorLaporanPolisi.toLowerCase().includes(query) ||
        item.perkara.pasalDipersangkakan.toLowerCase().includes(query);

      // Stage match
      let matchStage = true;
      if (selectedStage !== 'all') {
        if (selectedStage === 'terverifikasi') {
          const verifiedStages = ['penugasan_jadwal', 'asesmen_berlangsung', 'siap_pleno', 'pembahasan_pleno', 'pengesahan_rekomendasi', 'rekomendasi_terbit', 'selesai_tindak_lanjut'];
          matchStage = verifiedStages.includes(item.statusProsesUtama) || item.applicationStatus === 'VERIFIED';
        } else {
          matchStage = item.statusProsesUtama === selectedStage;
        }
      }

      // SLA match
      const matchSla =
        selectedSla === 'all' ||
        (selectedSla === 'mendekati' && item.isMendekatiTenggat) ||
        (selectedSla === 'melewati' && item.isMelewatiTenggat);

      return matchSearch && matchStage && matchSla;
    });
  }, [permohonanList, searchQuery, selectedStage, selectedSla, role]);

  const getStageBadge = (item: PermohonanAsesmen) => {
    // Prioritas: gunakan applicationStatus kanonis, fallback ke statusProsesUtama lama
    const appStatus = item.applicationStatus;
    const legacyStatus = item.statusProsesUtama;

    type StatusConfig = { label: string; cls: string };

    const statusMap: Record<string, StatusConfig> = {
      // Kanonis baru
      DRAFT: { label: 'Draf', cls: 'bg-slate-800 text-slate-300 border-slate-600' },
      SUBMITTED: { label: 'Diajukan', cls: 'bg-blue-900/60 text-blue-200 border-blue-700' },
      ADMIN_REVIEW: { label: 'Verifikasi Admin', cls: 'bg-indigo-900/60 text-indigo-200 border-indigo-700' },
      NEEDS_CORRECTION: { label: 'Perlu Perbaikan', cls: 'bg-amber-900/60 text-amber-200 border-amber-700' },
      AWAITING_DISPOSITION: { label: 'Menunggu Keputusan', cls: 'bg-orange-900/60 text-orange-200 border-orange-700' },
      APPROVED: { label: 'Disetujui', cls: 'bg-emerald-900/60 text-emerald-200 border-emerald-700' },
      SCHEDULED: { label: 'Dijadwalkan', cls: 'bg-cyan-900/60 text-cyan-200 border-cyan-700' },
      ASSESSMENT_ACTIVE: { label: 'Asesmen Berlangsung', cls: 'bg-teal-900/60 text-teal-200 border-teal-700' },
      READY_FOR_CONFERENCE: { label: 'Siap Pleno', cls: 'bg-violet-900/60 text-violet-200 border-violet-700' },
      CONFERENCE_HELD: { label: 'Pembahasan', cls: 'bg-purple-900/60 text-purple-200 border-purple-700' },
      CONFERENCE_CLARIFICATION_REQUIRED: { label: 'Klarifikasi Pleno', cls: 'bg-fuchsia-900/60 text-fuchsia-200 border-fuchsia-700' },
      OUTCOME_RECORDED_FOR_DRAFT: { label: 'Hasil Dicatat', cls: 'bg-pink-900/60 text-pink-200 border-pink-700' },
      AWAITING_SIGNED_OUTPUTS: { label: 'Menunggu Dok. Resmi', cls: 'bg-rose-900/60 text-rose-200 border-rose-700' },
      RESULTS_ISSUED: { label: 'Hasil Terbit', cls: 'bg-green-900/60 text-green-200 border-green-700' },
      REJECTED: { label: 'Ditolak', cls: 'bg-red-900/60 text-red-200 border-red-700' },
      OUT_OF_SCOPE_REFERRED: { label: 'Dirujuk (Non-TAT)', cls: 'bg-gray-800 text-gray-300 border-gray-600' },
      // Backward compat lama
      draf: { label: 'Draf', cls: 'bg-slate-800 text-slate-300 border-slate-600' },
      diajukan: { label: 'Diajukan', cls: 'bg-blue-900/60 text-blue-200 border-blue-700' },
      verifikasi_berkas: { label: 'Verifikasi Berkas', cls: 'bg-indigo-900/60 text-indigo-200 border-indigo-700' },
      perlu_perbaikan: { label: 'Perlu Perbaikan', cls: 'bg-amber-900/60 text-amber-200 border-amber-700' },
      penugasan_jadwal: { label: 'Penugasan & Jadwal', cls: 'bg-cyan-900/60 text-cyan-200 border-cyan-700' },
      asesmen_berlangsung: { label: 'Asesmen Berlangsung', cls: 'bg-teal-900/60 text-teal-200 border-teal-700' },
      siap_pleno: { label: 'Siap Pleno', cls: 'bg-violet-900/60 text-violet-200 border-violet-700' },
      pembahasan_pleno: { label: 'Pembahasan Pleno', cls: 'bg-purple-900/60 text-purple-200 border-purple-700' },
      pengesahan_rekomendasi: { label: 'Menunggu Dok. Resmi', cls: 'bg-rose-900/60 text-rose-200 border-rose-700' },
      rekomendasi_terbit: { label: 'Hasil Terbit', cls: 'bg-green-900/60 text-green-200 border-green-700' },
      selesai_tindak_lanjut: { label: 'Selesai', cls: 'bg-green-900/80 text-green-100 border-green-600' },
    };

    const key = appStatus || legacyStatus || 'draf';
    let config = statusMap[key] || { label: key, cls: 'bg-slate-800 text-slate-300 border-slate-600' };

    // Simplify labels for Admin role to match the tabs
    if (role === 'sekretariat' || role === 'ADMIN' || role === 'admin') {
      const verifiedStages = ['penugasan_jadwal', 'asesmen_berlangsung', 'siap_pleno', 'pembahasan_pleno', 'pengesahan_rekomendasi', 'rekomendasi_terbit', 'selesai_tindak_lanjut'];
      const isVerified = verifiedStages.includes(legacyStatus) || ['APPROVED', 'SCHEDULED', 'ASSESSMENT_ACTIVE', 'READY_FOR_CONFERENCE', 'CONFERENCE_HELD', 'AWAITING_SIGNED_OUTPUTS', 'RESULTS_ISSUED'].includes(appStatus || '');
      
      if (isVerified) {
        config = { label: 'Terverifikasi (Diproses)', cls: 'bg-emerald-900/60 text-emerald-200 border-emerald-700' };
      } else if (key === 'verifikasi_berkas' || key === 'SUBMITTED' || key === 'diajukan') {
        config = { label: 'Menunggu Verifikasi', cls: 'bg-indigo-900/60 text-indigo-200 border-indigo-700' };
      }
    }

    return (
      <span className={`${config.cls} border px-2.5 py-0.5 rounded text-xs font-mono font-medium`}>
        {config.label}
      </span>
    );
  };

  const getRoleHeaderInfo = () => {
    switch (role) {
      case 'PENGAJU':
      case 'pengaju':
        return {
          title: 'Berkas Pengajuan Asesmen Saya',
          desc: 'Daftar permohonan yang diajukan oleh unit kerja Anda. Lacak progres, penuhi koreksi, dan unduh rekomendasi resmi.',
          canCreate: true,
          createLabel: 'Pengajuan Asesmen Baru'
        };
      case 'ADMIN':
      case 'sekretariat':
        return {
          title: 'Antrean Permohonan & Administrasi',
          desc: 'Pemeriksaan kelengkapan berkas, penugasan asesor, penjadwalan sesi, pencatatan keputusan Ketua, dan penerbitan dokumen resmi.',
          canCreate: true,
          createLabel: 'Input Permohonan (Loket)'
        };
      case 'MEDIS':
      case 'medis':
        return {
          title: 'Daftar Kasus Ditugaskan (Asesor Medis)',
          desc: 'Perkara yang ditugaskan untuk pemeriksaan riwayat penggunaan zat, status fisik, evaluasi kejiwaan, dan skrining toksikologi (ASI).',
          canCreate: false,
          createLabel: ''
        };
      case 'HUKUM':
      case 'hukum':
        return {
          title: 'Daftar Kasus Ditugaskan (Asesor Hukum)',
          desc: 'Perkara yang ditugaskan untuk telaah LP/BAP, analisis peran penyalahguna vs pengedar, analisis gramatur SEMA, dan kesimpulan hukum.',
          canCreate: false,
          createLabel: ''
        };
      case 'koordinator':
        return {
          title: 'Ringkasan Permohonan & Hambatan Kasus TAT',
          desc: 'Kendali penyelesaian berkas, kesiapan pembahasan tim pleno, dan dokumen yang menunggu pengesahan mandat.',
          canCreate: false,
          createLabel: ''
        };
      case 'pimpinan':
        return {
          title: 'Pengawasan Berkas Berjalan Eksekutif',
          desc: 'Pengawasan menyeluruh terhadap pergerakan berkas, keterlambatan SLA, dan hambatan pelayanan terpadu.',
          canCreate: false,
          createLabel: ''
        };
      case 'rehabilitasi':
        return {
          title: 'Daftar Klien Rujukan Fasilitas',
          desc: 'Perkara dengan rekomendasi resmi layanan rehabilitasi medis atau rehabilitasi sosial di fasilitas mitra.',
          canCreate: false,
          createLabel: ''
        };
      case 'admin':
        return {
          title: 'Data Registrasi Berkas Sistem',
          desc: 'Metadata dan nomor registrasi perkara asesmen terpadu untuk monitoring integritas sistem e-TAT.',
          canCreate: false,
          createLabel: ''
        };
      default:
        return {
          title: 'Daftar Permohonan Asesmen Terpadu',
          desc: 'Penelusuran status berkas permohonan asesmen terpadu.',
          canCreate: false,
          createLabel: ''
        };
    }
  };

  const headerInfo = getRoleHeaderInfo();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <span>{headerInfo.title}</span>
            <span className="text-xs bg-[#0b172a] text-[#D4AF37] border border-[#1b3459] font-semibold px-2 py-0.5 rounded-full font-mono">
              {filteredList.length} Berkas
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {headerInfo.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onNavigateToRiwayat && (
            <button
              onClick={onNavigateToRiwayat}
              className="bg-[#081224] hover:bg-[#142642] text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all shrink-0 border border-[#1b3459] hover:border-[#234475] cursor-pointer"
              title="Buka Arsip Riwayat Permohonan"
            >
              <History className="w-4 h-4 text-[#d4af37]" />
              <span>Riwayat Permohonan</span>
            </button>
          )}

          {headerInfo.canCreate && (
            <button
              id="btn-tambah-permohonan"
              onClick={onOpenNewModal}
              className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all shrink-0 border border-[#235594] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{headerInfo.createLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-4 shadow-lg shadow-black/20">
        
        {/* Horizontal Status Tabs */}
        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-thin scrollbar-thumb-[#1b3459] scrollbar-track-transparent">
          {[
            { id: 'all', label: 'Semua Berkas' },
            { id: 'verifikasi_berkas', label: 'Menunggu Verifikasi' },
            { id: 'perlu_perbaikan', label: 'Perlu Perbaikan' },
            { id: 'terverifikasi', label: 'Terverifikasi (Jadwal/Asesmen)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStage(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedStage === tab.id 
                  ? 'bg-[#133863] text-white border-[#D4AF37] shadow-lg shadow-[#133863]/40' 
                  : 'bg-[#081224] text-slate-400 border-[#1b3459] hover:bg-[#0d1f38] hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nomor permohonan (misal: TAT/2026/09/089), nama terperiksa, atau no LP..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#081224] border border-[#1b3459] text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium bg-[#081224] border border-[#1b3459] rounded-xl px-3 py-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSla}
                onChange={(e) => setSelectedSla(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none focus:ring-0 outline-none cursor-pointer"
              >
                <option value="all">Semua Waktu SLA</option>
                <option value="mendekati">Mendekati Batas Waktu</option>
                <option value="melewati">Melewati Target</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Cards / List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-12 text-center shadow-lg shadow-black/20">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">Tidak ada permohonan yang sesuai kriteria filter.</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#D4AF37] rounded-xl p-4 transition-all cursor-pointer group shadow-md shadow-black/10 hover:shadow-cyan-950/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                {/* Left: Identification & Stages */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors font-mono">
                      {item.nomorPermohonan}
                    </span>
                    {getStageBadge(item)}
                    {item.terperiksa.statusIdentitasKhusus === 'anak_berhadapan_hukum' && (
                      <span className="bg-[#081224] text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-[#1b3459]">
                        ABH (Anak)
                      </span>
                    )}
                    {item.isMendekatiTenggat && (
                      <span className="bg-[#081224] text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1 border border-[#1b3459]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Mendekati Batas SLA</span>
                      </span>
                    )}
                  </div>

                  {/* Terperiksa & Perkara Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong> ({item.terperiksa.usia} th, {item.terperiksa.jenisKelamin})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-300">Pengaju: <span className="text-white">{item.instansiPengaju}</span></span>
                    </div>
                  </div>

                  {/* Barang Bukti Preview */}
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-0.5">
                    <span className="font-medium text-slate-300">Barang Bukti:</span>
                    <span className="text-slate-200">
                      {item.perkara.barangBuktiList.map(bb => `${bb.jenisZat} (${bb.beratBersihGram} gr)`).join('; ')}
                    </span>
                  </div>
                </div>

                {/* Right: Next Step & Responsibility Callout */}
                <div className="lg:w-80 bg-[#081224] rounded-lg p-3 border border-[#1b3459] flex flex-col justify-between shrink-0">
                  <div className="text-[11px] text-slate-400 font-medium">Tindakan Berikutnya:</div>
                  <div className="text-xs font-semibold text-white mt-0.5 line-clamp-2">
                    {item.tindakanBerikutnyaLabel}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1b3459] text-[11px]">
                    <span className="text-slate-400">Penanggung Jawab:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                      {item.penanggungJawabBerikutnya.split('(')[0]}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center pl-2">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
