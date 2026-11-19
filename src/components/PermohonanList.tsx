import React, { useState, useMemo } from 'react';
import { PermohonanAsesmen, StatusProsesUtama, UserProfile } from '../types';
import { getKodeLacakRehab, normalizeSearchCode } from '../utils/getKodeLacak';
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

  // Hitung jumlah kasus untuk masing-masing 3 status resmi antrean verifikasi
  const counts = useMemo(() => {
    let menungguCount = 0;
    let perbaikanCount = 0;
    let disetujuiCount = 0;

    permohonanList.forEach(item => {
      // Role scope check: Untuk role Pengaju, hanya hitung berkas milik sendiri
      if ((role || '').toUpperCase() === 'PENGAJU') {
        const isOwner =
          (currentUser?.id && item.pengajuId === currentUser.id) ||
          (item.pengajuId === 'user-pengaju') ||
          (currentUser?.email && item.pengajuEmail && item.pengajuEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser?.name && item.pengajuNama && item.pengajuNama.toLowerCase().includes(currentUser.name.toLowerCase())) ||
          (currentUser?.name && item.perkara?.namaPenyidik && item.perkara.namaPenyidik.toLowerCase().includes(currentUser.name.toLowerCase())) ||
          (currentUser?.agency && item.instansiPengaju && item.instansiPengaju.toLowerCase().includes(currentUser.agency.toLowerCase())) ||
          (currentUser?.agency && item.perkara?.instansiPenyidik && item.perkara.instansiPenyidik.toLowerCase().includes(currentUser.agency.toLowerCase()));
        if (!isOwner) return;
      }

      const st = item.applicationStatus;
      const leg = item.statusProsesUtama;
      if (st === 'NEEDS_CORRECTION' || leg === 'perlu_perbaikan') {
        perbaikanCount++;
      } else if (
        st === 'APPROVED' || 
        st === 'SCHEDULED' || 
        st === 'ASSESSMENT_ACTIVE' ||
        leg === 'penugasan_jadwal' || 
        leg === 'asesmen_berlangsung'
      ) {
        disetujuiCount++;
      } else {
        // Default untuk status SUBMITTED, ADMIN_REVIEW, diajukan, verifikasi_berkas, DRAFT
        menungguCount++;
      }
    });

    return {
      all: menungguCount + perbaikanCount + disetujuiCount,
      menunggu: menungguCount,
      perlu_perbaikan: perbaikanCount,
      disetujui: disetujuiCount,
    };
  }, [permohonanList, role, currentUser]);

  const filteredList = useMemo(() => {
    return permohonanList.filter(item => {
      const st = item.applicationStatus;
      const leg = item.statusProsesUtama;

      // Role-specific scoping: Untuk role Pengaju, hanya tampilkan berkas yang diajukan oleh akun tsb
      const isPengajuRole = (role || '').toUpperCase() === 'PENGAJU';
      if (isPengajuRole) {
        const isOwner =
          (currentUser?.id && item.pengajuId === currentUser.id) ||
          (item.pengajuId === 'user-pengaju') ||
          (currentUser?.email && item.pengajuEmail && item.pengajuEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser?.name && item.pengajuNama && item.pengajuNama.toLowerCase().includes(currentUser.name.toLowerCase())) ||
          (currentUser?.name && item.perkara?.namaPenyidik && item.perkara.namaPenyidik.toLowerCase().includes(currentUser.name.toLowerCase())) ||
          (currentUser?.agency && item.instansiPengaju && item.instansiPengaju.toLowerCase().includes(currentUser.agency.toLowerCase())) ||
          (currentUser?.agency && item.perkara?.instansiPenyidik && item.perkara.instansiPenyidik.toLowerCase().includes(currentUser.agency.toLowerCase()));

        if (!isOwner) {
          return false;
        }
      }

      if (role === 'rehabilitasi') {
        if (!item.tindakLanjut && leg !== 'rekomendasi_terbit' && leg !== 'selesai_tindak_lanjut') {
          return false;
        }
      }

      // Search match
      const query = searchQuery.toLowerCase();
      const qClean = normalizeSearchCode(query);
      const kode = getKodeLacakRehab(item).toLowerCase();
      const cleanKode = normalizeSearchCode(kode);

      const matchSearch =
        !query ||
        (item.nomorPermohonan && (item.nomorPermohonan.toLowerCase().includes(query) || normalizeSearchCode(item.nomorPermohonan).includes(qClean))) ||
        (item.terperiksa?.namaLengkap && item.terperiksa.namaLengkap.toLowerCase().includes(query)) ||
        (item.terperiksa?.nik && item.terperiksa.nik.includes(query)) ||
        (item.perkara?.nomorLaporanPolisi && item.perkara.nomorLaporanPolisi.toLowerCase().includes(query)) ||
        (item.perkara?.pasalDipersangkakan && item.perkara.pasalDipersangkakan.toLowerCase().includes(query)) ||
        kode.includes(query) ||
        (cleanKode && qClean && (cleanKode.includes(qClean) || qClean.includes(cleanKode))) ||
        (item.id && (item.id.toLowerCase().includes(query) || normalizeSearchCode(item.id).includes(qClean)));

      // Stage match (Hanya 3 status resmi: Menunggu, Perlu Perbaikan, Disetujui)
      let matchStage = true;
      if (selectedStage !== 'all') {
        if (selectedStage === 'menunggu') {
          matchStage = 
            st === 'SUBMITTED' || 
            st === 'ADMIN_REVIEW' || 
            st === 'DRAFT' ||
            leg === 'diajukan' || 
            leg === 'verifikasi_berkas' ||
            leg === 'draf' ||
            (!st && !leg);
        } else if (selectedStage === 'perlu_perbaikan') {
          matchStage = 
            st === 'NEEDS_CORRECTION' || 
            leg === 'perlu_perbaikan';
        } else if (selectedStage === 'disetujui') {
          matchStage = 
            st === 'APPROVED' || 
            st === 'SCHEDULED' || 
            st === 'ASSESSMENT_ACTIVE' ||
            leg === 'penugasan_jadwal' ||
            leg === 'asesmen_berlangsung';
        }
      }

      // SLA match
      const matchSla =
        selectedSla === 'all' ||
        (selectedSla === 'mendekati' && item.isMendekatiTenggat) ||
        (selectedSla === 'melewati' && item.isMelewatiTenggat);

      return matchSearch && matchStage && matchSla;
    });
  }, [permohonanList, searchQuery, selectedStage, selectedSla, role, currentUser]);

  const getStageBadge = (item: PermohonanAsesmen) => {
    const appStatus = item.applicationStatus;
    const legacyStatus = item.statusProsesUtama;
    const key = appStatus || legacyStatus || 'SUBMITTED';

    // 3 Status Kanonis untuk Antrean Verifikasi:
    if (key === 'NEEDS_CORRECTION' || key === 'perlu_perbaikan') {
      return (
        <span className="bg-amber-900/60 text-amber-200 border-amber-700 border px-2.5 py-0.5 rounded text-xs font-mono font-medium">
          Perlu Perbaikan
        </span>
      );
    }

    if (
      key === 'APPROVED' ||
      key === 'SCHEDULED' ||
      key === 'penugasan_jadwal' ||
      key === 'ASSESSMENT_ACTIVE' ||
      key === 'READY_FOR_CONFERENCE' ||
      key === 'CONFERENCE_HELD' ||
      key === 'RESULTS_ISSUED' ||
      key === 'selesai_tindak_lanjut'
    ) {
      return (
        <span className="bg-emerald-900/60 text-emerald-200 border-emerald-700 border px-2.5 py-0.5 rounded text-xs font-mono font-medium">
          Disetujui
        </span>
      );
    }

    // Default untuk permohonan yang menunggu verifikasi
    return (
      <span className="bg-indigo-900/60 text-indigo-200 border-indigo-700 border px-2.5 py-0.5 rounded text-xs font-mono font-medium">
        Menunggu Verifikasi
      </span>
    );
  };

  const getRoleHeaderInfo = () => {
    switch (role) {
      case 'PENGAJU':
      case 'pengaju':
        return {
          title: 'Permohonan Asesmen Saya',
          desc: 'Daftar permohonan yang diajukan oleh akun Anda. Lacak progres, penuhi koreksi, dan pantau status berkas.',
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
        
        {/* Horizontal Status Tabs (3 Status Resmi: Menunggu, Perlu Perbaikan, Disetujui) */}
        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-thin scrollbar-thumb-[#1b3459] scrollbar-track-transparent">
          {[
            { id: 'all', label: `Semua Antrean Verifikasi (${counts.all})` },
            { id: 'menunggu', label: `Menunggu Verifikasi (${counts.menunggu})` },
            { id: 'perlu_perbaikan', label: `Perlu Perbaikan (${counts.perlu_perbaikan})` },
            { id: 'disetujui', label: `Disetujui (${counts.disetujui})` },
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
                      {item.nomorPermohonan || 'TAT/PENDING'}
                    </span>
                    {getStageBadge(item)}
                    {item.terperiksa?.statusIdentitasKhusus === 'anak_berhadapan_hukum' && (
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
                        Terperiksa: <strong className="text-white">{item.terperiksa?.namaLengkap || '-'}</strong>
                        {item.terperiksa?.usia ? ` (${item.terperiksa.usia} th, ${item.terperiksa.jenisKelamin || '-'})` : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-300">Pengaju: <span className="text-white">{item.instansiPengaju || item.pengaju?.agency || '-'}</span></span>
                    </div>
                  </div>

                  {/* Barang Bukti Preview */}
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-0.5">
                    <span className="font-medium text-slate-300">Barang Bukti:</span>
                    <span className="text-slate-200 truncate">
                      {item.perkara?.barangBuktiList && item.perkara.barangBuktiList.length > 0
                        ? item.perkara.barangBuktiList.map(bb => `${bb.jenisZat} (${bb.beratBersihGram} gr)`).join('; ')
                        : 'Belum ada data barang bukti'}
                    </span>
                  </div>
                </div>

                {/* Right: Next Step & Responsibility Callout */}
                <div className="lg:w-80 bg-[#081224] rounded-lg p-3 border border-[#1b3459] flex flex-col justify-between shrink-0">
                  <div className="text-[11px] text-slate-400 font-medium">Tindakan Berikutnya:</div>
                  <div className="text-xs font-semibold text-white mt-0.5 line-clamp-2">
                    {item.tindakanBerikutnyaLabel || 'Menunggu verifikasi administrasi'}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1b3459] text-[11px]">
                    <span className="text-slate-400">Penanggung Jawab:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                      {(item.penanggungJawabBerikutnya || 'Sekretariat TAT').split('(')[0]}
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
