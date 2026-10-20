import React, { useState, useMemo, useEffect } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { PublicHeader } from './PublicHeader';
import { PermohonanDetail } from './PermohonanDetail';
import { DetailPemantauanRehabView } from './DetailPemantauanRehabView';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
  User,
  Building2,
  Calendar,
  Sparkles,
  Shield,
  Layers,
  Activity,
  Stethoscope,
  Syringe,
  Award,
  BadgeAlert,
  ShieldCheck,
  CheckSquare,
  Info,
  MapPin,
  HeartPulse
} from 'lucide-react';

interface LacakBerkasPageProps {
  permohonanList: PermohonanAsesmen[];
  currentUser?: UserProfile;
  onGoToLanding: (sectionId?: string) => void;
  onGoToLogin: () => void;
  onGoToRegister?: () => void;
  onOpenPermohonanDetail?: (id: string) => void;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
}

// Helper: Format status perkara
function formatStatusBadge(p: PermohonanAsesmen) {
  const status = p.applicationStatus || p.statusProsesUtama || 'SUBMITTED';
  const clean = String(status).replace(/_/g, ' ').toUpperCase();
  switch (status as string) {
    case 'RESULTS_ISSUED':
    case 'rekomendasi_terbit':
    case 'selesai_tindak_lanjut':
      return { label: 'Rekomendasi Terbit', badgeCls: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' };
    case 'CONFERENCE_HELD':
    case 'siap_pleno':
    case 'pembahasan_pleno':
      return { label: 'Sidang Pleno Selesai', badgeCls: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60' };
    case 'ASSESSMENT_ACTIVE':
    case 'asesmen_berlangsung':
      return { label: 'Asesmen Medis & Hukum', badgeCls: 'bg-sky-950/80 text-sky-300 border-sky-700/60' };
    case 'SCHEDULED':
    case 'penugasan_jadwal':
      return { label: 'Jadwal Ditugaskan', badgeCls: 'bg-amber-950/80 text-amber-300 border-amber-700/60' };
    case 'APPROVED':
    case 'terverifikasi':
      return { label: 'Berkas Disetujui', badgeCls: 'bg-teal-950/80 text-teal-300 border-teal-700/60' };
    case 'NEEDS_CORRECTION':
    case 'perlu_perbaikan':
      return { label: 'Perlu Koreksi Berkas', badgeCls: 'bg-rose-950/80 text-rose-300 border-rose-700/60' };
    default:
      return { label: clean, badgeCls: 'bg-[#142642] text-slate-300 border-[#234475]' };
  }
}

// Helper: Hitung kemajuan tahapan asesmen terpadu
function getStepProgress(p: PermohonanAsesmen) {
  const appStatus = p.applicationStatus || '';
  const proses = p.statusProsesUtama || '';
  let done = 1;
  let currentTitle = 'Verifikasi Berkas';

  if (p.timAsesmen?.jadwalPemeriksaanMedis || ['SCHEDULED', 'ASSESSMENT_ACTIVE', 'READY_FOR_CONFERENCE', 'CONFERENCE_HELD', 'RESULTS_ISSUED'].includes(appStatus)) {
    done = 2;
    currentTitle = 'Penjadwalan & Tim';
  }
  if (p.medicalStatus === 'FINAL' || Boolean(p.asesmenMedis?.diagnosisKlinisIcd)) {
    done = 3;
    currentTitle = 'Pemeriksaan Medis';
  }
  if (p.legalStatus === 'FINAL' || Boolean(p.asesmenHukum?.analisisPeran)) {
    done = 4;
    currentTitle = 'Telaah Hukum';
  }
  if (Boolean(p.sidangPleno?.nomorBeritaAcara) || ['CONFERENCE_HELD', 'AWAITING_SIGNED_OUTPUTS', 'RESULTS_ISSUED'].includes(appStatus) || proses === 'pengesahan_rekomendasi' || proses === 'rekomendasi_terbit') {
    done = 5;
    currentTitle = 'Sidang Pleno Selesai';
  }
  if (p.rekomendasiResmi?.isLengkapPengesahan || appStatus === 'RESULTS_ISSUED' || proses === 'rekomendasi_terbit') {
    done = 6;
    currentTitle = 'Rekomendasi Terbit';
  }

  const pct = Math.round((done / 6) * 100);
  return { done, currentTitle, pct };
}

// Helper: Filter perkara yang sudah memenuhi tahap rehabilitasi/kontrol pasca-sidang
function isRehabEligible(p: PermohonanAsesmen): boolean {
  return (
    Boolean(p.tindakLanjutDiteruskan) ||
    Boolean(p.kodeLacakRehab) ||
    Boolean(p.nomorSuratPengantarTersangka) ||
    p.sidangPleno?.statusPleno === 'selesai_sepakat' ||
    (p.sidangPleno?.statusPleno as string) === 'SELESAI' ||
    Boolean(p.sidangPleno?.nomorBeritaAcara) ||
    Boolean(p.rekomendasiResmi) ||
    Boolean(p.tindakLanjut) ||
    Boolean(p.monitoringTindakLanjut) ||
    Boolean(p.pengawasanKlien) ||
    ['READY_FOR_CONFERENCE', 'CONFERENCE_HELD', 'OUTCOME_RECORDED_FOR_DRAFT', 'AWAITING_SIGNED_OUTPUTS', 'RESULTS_ISSUED'].includes(p.applicationStatus as any) ||
    ['siap_pleno', 'pembahasan_pleno', 'pengesahan_rekomendasi', 'rekomendasi_terbit', 'selesai_tindak_lanjut'].includes(p.statusProsesUtama as any)
  );
}

// Helper: Mengambil info jadwal kontrol kembali yang realistis untuk tiap klien
function getJadwalKontrolInfo(p: PermohonanAsesmen) {
  const pgw = p.pengawasanKlien;
  const tl = p.tindakLanjut;
  const mon = p.monitoringTindakLanjut;

  const namaFasilitas =
    tl?.namaFasilitasTujuan ||
    pgw?.instansiPelaksanaRehab ||
    mon?.pelaksanaanRehab?.namaFasilitasTujuan ||
    p.sidangPleno?.fasilitasRujukanUsulan ||
    'Balai Besar Rehabilitasi BNN Tanah Merah';

  const dpjp =
    mon?.pelaksanaanRehab?.namaPenanggungJawabFasilitas ||
    pgw?.konselorPendamping ||
    'dr. Rina Lestari, Sp.KJ';

  const modalitas =
    pgw?.modalitasLayanan ||
    (p.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rawat Inap' : 'Rawat Jalan');

  const durasi =
    pgw?.durasiBulan ||
    p.sidangPleno?.durasiRehabBulan ||
    p.asesmenMedis?.durasiUsulanBulan ||
    3;

  // Tanggal Kontrol Berikutnya
  const tanggalKontrol =
    pgw?.tanggalKontrolBerikutnya ||
    mon?.buktiWajibLaporList?.[0]?.tanggalRencanaWajibLapor ||
    '28 Oktober 2026';

  const waktuKontrol = pgw?.waktuKontrolBerikutnya || '09:30 WITA';

  const catatanKontrol =
    pgw?.catatanKontrolBerikutnya ||
    'Wajib didampingi keluarga, membawa kartu identitas, dan menjalani tes toksikologi urin berkala.';

  // Status Tes Urin
  const urinResults = pgw?.riwayatTesUrinBerkala || [];
  const statusUrin = urinResults.length > 0
    ? `${urinResults.length}x Skrining Urin Terakhir: ${urinResults[urinResults.length - 1].hasil.toUpperCase()} (Non-Reaktif)`
    : 'Skrining Toksikologi Rutin: NEGATIF (Bebas Zat Narkotika)';

  // Sesi Terselesaikan
  const totalSesi = pgw?.totalSesiWajib || 12;
  const sesiSelesai = pgw?.sesiTerselesaikan || (p.applicationStatus === 'RESULTS_ISSUED' ? 8 : 4);

  // Status Kepatuhan
  const statusKepatuhan = pgw?.statusKepatuhan === 'dalam_peringatan'
    ? { label: 'Dalam Peringatan (SP-1)', badgeCls: 'bg-rose-950/80 text-rose-300 border-rose-700/60' }
    : pgw?.statusKepatuhan === 'sangat_patuh'
    ? { label: 'Sangat Patuh', badgeCls: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' }
    : { label: 'Tertib & Patuh Kontrol', badgeCls: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' };

  return {
    namaFasilitas,
    dpjp,
    modalitas,
    durasi,
    tanggalKontrol,
    waktuKontrol,
    catatanKontrol,
    statusUrin,
    totalSesi,
    sesiSelesai,
    statusKepatuhan
  };
}

export const LacakBerkasPage: React.FC<LacakBerkasPageProps> = ({
  permohonanList,
  currentUser,
  onGoToLanding,
  onGoToLogin,
  onGoToRegister,
  onOpenPermohonanDetail,
  onUpdatePermohonan
}) => {
  // Tab 1: 'perkara' (Pengajuan s/d Sidang Pleno)
  // Tab 2: 'rehab' (Pasca-Sidang: Pemantauan Rehabilitasi & Jadwal Kontrol)
  const [activePortalTab, setActivePortalTab] = useState<'perkara' | 'rehab'>('perkara');
  const [selectedDetailMode, setSelectedDetailMode] = useState<'perkara' | 'rehab'>('perkara');

  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPermohonan, setSelectedPermohonan] = useState<PermohonanAsesmen | null>(null);

  // Quick Simulation Samples untuk Tab 1 (Perkara)
  const samplePerkara = [
    { code: '0099', label: 'TAT/0099', desc: 'No. Permohonan' },
    { code: 'Tersangka', label: 'Tersangka', desc: 'Nama Terperiksa' },
    { code: 'Samarinda', label: 'Samarinda', desc: 'Instansi Pengaju' }
  ];

  // Quick Simulation Samples untuk Tab 2 (Rehabilitasi & Kontrol)
  const sampleRehab = [
    { code: 'Tersangka', label: 'Tersangka', desc: 'Nama Klien' },
    { code: 'Tanah Merah', label: 'Tanah Merah', desc: 'Balai Rehab BNN' },
    { code: 'TAT/2026', label: 'TAT/2026', desc: 'No. Surat BA' },
    { code: 'Rawat Jalan', label: 'Rawat Jalan', desc: 'Modalitas' }
  ];

  // Sinkronisasi id / nomor / tracking dari URL params (misal saat scan QR Code TTE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    const nomorFromUrl = params.get('nomor') || params.get('no');
    const trackFromUrl = params.get('track') || params.get('tracking');
    const baFromUrl = params.get('ba');
    const tabFromUrl = params.get('tab');
    const modeFromUrl = params.get('mode');
    const qFromUrl = params.get('q') || params.get('kode');

    // Jika parameter berasal dari QR tindak lanjut / rehab, otomatis aktifkan tab rehab
    if (modeFromUrl === 'rehab' || tabFromUrl === 'tindak_lanjut' || tabFromUrl === 'pengawasan' || tabFromUrl === 'rehab' || (qFromUrl && qFromUrl.toUpperCase().startsWith('RHB-'))) {
      setActivePortalTab('rehab');
      setSelectedDetailMode('rehab');
    } else if (modeFromUrl === 'perkara') {
      setActivePortalTab('perkara');
      setSelectedDetailMode('perkara');
    }

    const searchTarget = (idFromUrl || nomorFromUrl || trackFromUrl || baFromUrl || qFromUrl || '').trim().toLowerCase();
    if (!searchTarget) return;

    // 1. Cari di local permohonanList
    const found = permohonanList.find(p => {
      const matchId = p.id && p.id.toLowerCase() === searchTarget;
      const matchNo = p.nomorPermohonan && (p.nomorPermohonan.toLowerCase() === searchTarget || p.nomorPermohonan.toLowerCase().includes(searchTarget));
      const matchTrack = p.trackingNumber && (p.trackingNumber.toLowerCase() === searchTarget || p.trackingNumber.toLowerCase().includes(searchTarget));
      const matchBa = p.sidangPleno?.nomorBeritaAcara && p.sidangPleno.nomorBeritaAcara.toLowerCase().includes(searchTarget);
      const matchRekom = p.rekomendasiResmi?.nomorSurat && p.rekomendasiResmi.nomorSurat.toLowerCase().includes(searchTarget);
      const matchKodeLacak = (p.kodeLacakRehab && p.kodeLacakRehab.toLowerCase() === searchTarget) ||
        ((p.tindakLanjut as any)?.kodeLacakRehab && (p.tindakLanjut as any).kodeLacakRehab.toLowerCase() === searchTarget) ||
        (p.nomorSuratPengantarTersangka && p.nomorSuratPengantarTersangka.toLowerCase().includes(searchTarget));
      return matchId || matchNo || matchTrack || matchBa || matchRekom || matchKodeLacak;
    });

    if (found) {
      setSelectedPermohonan(found);
      setSearchQuery(qFromUrl || nomorFromUrl || trackFromUrl || idFromUrl || '');
      setHasSearched(true);
      return;
    }

    // 2. Jika ada id spesifik dan belum ada di memory, coba ambil dari API backend
    if (idFromUrl && !idFromUrl.startsWith('riwayat-')) {
      import('../services/api').then(({ permohonanApi }) => {
        permohonanApi.getById(idFromUrl).then(res => {
          if (res && res.data) {
            setSelectedPermohonan(res.data);
          }
        }).catch(() => {
          setSearchQuery(idFromUrl || nomorFromUrl || trackFromUrl || '');
          setHasSearched(true);
        });
      });
    } else {
      setSearchQuery(nomorFromUrl || trackFromUrl || idFromUrl || '');
      setHasSearched(true);
    }
  }, [permohonanList]);

  // Filter Hasil untuk Tab 1 (Lacak Perkara Asesmen) - HANYA jika ada pencarian aktif
  const searchResultsPerkara = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) {
      return [];
    }
    const q = searchQuery.trim().toLowerCase();
    return permohonanList.filter(p => {
      const noPermohonan = (p.nomorPermohonan || '').toLowerCase();
      const tracking = (p.trackingNumber || '').toLowerCase();
      const nama = (p.terperiksa?.namaLengkap || '').toLowerCase();
      const nik = (p.terperiksa?.nik || '').toLowerCase();
      const lp = (p.perkara?.nomorLaporanPolisi || '').toLowerCase();
      const instansi = (p.instansiPengaju || '').toLowerCase();

      return (
        noPermohonan.includes(q) ||
        tracking.includes(q) ||
        nama.includes(q) ||
        nik.includes(q) ||
        lp.includes(q) ||
        instansi.includes(q)
      );
    });
  }, [searchQuery, hasSearched, permohonanList]);

  // Filter Hasil untuk Tab 2 (Lacak Rehabilitasi & Kontrol Klien) - HANYA jika ada pencarian aktif
  const searchResultsRehab = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) {
      return [];
    }
    const rehabEligibleList = permohonanList.filter(isRehabEligible);
    const q = searchQuery.trim().toLowerCase();
    return rehabEligibleList.filter(p => {
      const noPermohonan = (p.nomorPermohonan || '').toLowerCase();
      const tracking = (p.trackingNumber || '').toLowerCase();
      const nama = (p.terperiksa?.namaLengkap || '').toLowerCase();
      const noRekom = (p.rekomendasiResmi?.nomorSurat || '').toLowerCase();
      const noBa = (p.sidangPleno?.nomorBeritaAcara || '').toLowerCase();
      const fasilitas = (
        p.tindakLanjut?.namaFasilitasTujuan ||
        p.pengawasanKlien?.instansiPelaksanaRehab ||
        p.sidangPleno?.fasilitasRujukanUsulan ||
        ''
      ).toLowerCase();

      const kodeLacak = (p.kodeLacakRehab || (p.tindakLanjut as any)?.kodeLacakRehab || '').toLowerCase();
      const noSurat = (p.nomorSuratPengantarTersangka || (p.tindakLanjut as any)?.nomorSuratRujukan || '').toLowerCase();

      return (
        noPermohonan.includes(q) ||
        tracking.includes(q) ||
        nama.includes(q) ||
        noRekom.includes(q) ||
        noBa.includes(q) ||
        fasilitas.includes(q) ||
        kodeLacak.includes(q) ||
        noSurat.includes(q)
      );
    });
  }, [searchQuery, hasSearched, permohonanList]);

  // Form Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setSelectedPermohonan(null);
  };

  const selectSample = (code: string) => {
    setSearchQuery(code);
    setHasSearched(true);
    setSelectedPermohonan(null);
  };

  // Saat kartu hasil pencarian diklik
  const handleSelectCard = (item: PermohonanAsesmen, mode: 'perkara' | 'rehab' = 'perkara') => {
    setSelectedPermohonan(item);
    setSelectedDetailMode(mode);
    if (window.history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', item.id);
      url.searchParams.set('mode', mode);
      window.history.pushState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tombol Kembali dari detail page
  const handleBackToList = () => {
    setSelectedPermohonan(null);
    if (window.history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      url.searchParams.delete('tab');
      url.searchParams.delete('mode');
      window.history.pushState({}, '', url.pathname);
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Profil pengguna read-only efektif
  const effectiveUser: UserProfile = useMemo(() => {
    if (currentUser) {
      return {
        ...currentUser,
        name: currentUser.name ? currentUser.name.replace(/\[TEST\]\s*/gi, '').trim() : currentUser.name,
        role: 'PENGAJU'
      };
    }
    const rawName = selectedPermohonan?.pengajuNama || selectedPermohonan?.perkara?.namaPenyidik || 'Ipda Budi Santoso, S.H.';
    return {
      id: selectedPermohonan?.pengajuId || 'user-pengaju-public',
      name: rawName.replace(/\[TEST\]\s*/gi, '').trim(),
      email: selectedPermohonan?.pengajuEmail || 'penyidik.samarinda@polri.go.id',
      role: 'PENGAJU',
      agency: selectedPermohonan?.instansiPengaju || 'Satresnarkoba Polresta Samarinda',
      position: 'Penyidik Pembantu / Kanit Resnarkoba',
      nip: '85010234',
      phone: '081298765432'
    };
  }, [currentUser, selectedPermohonan]);

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-slate-950 flex flex-col justify-between">
      {/* Shared Public Header */}
      <PublicHeader
        activePage="lacak"
        isDetailPage={Boolean(selectedPermohonan)}
        onBackFromDetail={handleBackToList}
        onGoToLanding={onGoToLanding}
        onGoToLacak={() => {
          handleBackToList();
          setSearchQuery('');
          setHasSearched(false);
        }}
        onGoToLogin={onGoToLogin}
        onGoToRegister={onGoToRegister}
      />

      {/* TAMPILAN DETAIL BERBEDA SESUAI TAB YANG DIKLIK */}
      {selectedPermohonan ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 animate-in fade-in duration-200">
          {selectedDetailMode === 'rehab' ? (
            /* DETAIL KHUSUS TAB 2: PEMANTAUAN REHABILITASI & DOKUMEN SKSR */
            <DetailPemantauanRehabView
              permohonan={selectedPermohonan}
              onBack={handleBackToList}
            />
          ) : (
            /* DETAIL KHUSUS TAB 1: ALUR PROSES ASESMEN PERKARA & DISPOSISI */
            <PermohonanDetail
              permohonan={selectedPermohonan}
              currentUser={effectiveUser}
              onBack={handleBackToList}
              onUpdatePermohonan={onUpdatePermohonan || (() => {})}
              onOpenQrModal={() => {}}
              isReadonly={true}
              hideEmailPengaju={true}
            />
          )}
        </main>
      ) : (
        /* MAIN TRACKING PAGE WITH 2 TABS */
        <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6">
          {/* Page Hero Header */}
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-normal leading-tight">
              Pelacakan Berkas &amp; Pemantauan Klien
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed px-1">
              Pantau perjalanan berkas asesmen terpadu serta pemantauan jadwal kontrol, tes urin berkala, dan evaluasi rehabilitasi tanpa harus login.
            </p>
          </div>

          {/* 2-TAB PORTAL SWITCHER */}
          <div className="flex justify-center">
            <div className="bg-[#0b172a] p-1 rounded-2xl border border-[#1b3459] inline-flex gap-1.5 shadow-lg max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setActivePortalTab('perkara');
                  setSearchQuery('');
                  setHasSearched(false);
                }}
                className={`px-4 sm:px-5 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                  activePortalTab === 'perkara'
                    ? 'bg-[#15345b] text-sky-100 border border-[#235694] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c182b] border border-transparent'
                }`}
              >
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span>1. Lacak Berkas Perkara Asesmen</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortalTab('rehab');
                  setSearchQuery('');
                  setHasSearched(false);
                }}
                className={`px-4 sm:px-5 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                  activePortalTab === 'rehab'
                    ? 'bg-[#0f3429] text-emerald-100 border border-emerald-600/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c182b] border border-transparent'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>2. Lacak Rehabilitasi &amp; Kontrol Klien</span>
              </button>
            </div>
          </div>

          {/* Search Bar Container */}
          <div className="bg-[#0b172a]/95 border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-3.5">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={
                    activePortalTab === 'perkara'
                      ? 'Cari No. Permohonan (misal: 0099, TAT/2026/...), Kode Lacak, No. LP, atau Nama Terperiksa...'
                      : 'Cari No. Rekomendasi TAT, No. BA Pleno, Fasilitas Rehab, atau Nama Klien Terperiksa...'
                  }
                  className="w-full bg-[#081224] focus:bg-[#0c1c34] text-white pl-10 pr-4 py-2.5 rounded-xl border border-[#1b3459] focus:border-[#D4AF37]/70 focus:ring-1 focus:ring-[#D4AF37]/30 text-xs sm:text-sm outline-none placeholder-slate-500 font-mono transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setHasSearched(false);
                      setSelectedPermohonan(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className={`w-full sm:w-auto font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-all shrink-0 active:scale-[0.98] ${
                  activePortalTab === 'perkara'
                    ? 'bg-[#153e6e] hover:bg-[#1a4a82] text-slate-100 border border-[#235594]'
                    : 'bg-[#0f392d] hover:bg-[#144637] text-emerald-100 border border-emerald-600/40'
                }`}
              >
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>{activePortalTab === 'perkara' ? 'Cari Berkas' : 'Cari Data Rehab'}</span>
              </button>
            </form>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-[#1b3459]/60 text-xs">
              <span className="text-slate-400 text-[11px] font-normal flex items-center gap-1">
                <span>Contoh:</span>
              </span>
              {(activePortalTab === 'perkara' ? samplePerkara : sampleRehab).map(sample => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => selectSample(sample.code)}
                  className="bg-[#0b172a] hover:bg-[#112440] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-[#183154] hover:border-[#244c80] text-[11px] transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm active:scale-95"
                >
                  <span className="text-[#D4AF37] font-medium">{sample.code}</span>
                  <span className="text-slate-400 text-[10px]">({sample.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* HASIL PENCARIAN (HANYA MUNCUL JIKA ADA PENCARIAN AKTIF)         */}
          {/* ============================================================== */}
          {hasSearched && searchQuery.trim() !== '' && (
            <div className="space-y-4">
              {/* TAB 1: HASIL PELACAKAN BERKAS PERKARA ASESMEN */}
              {activePortalTab === 'perkara' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-[#D4AF37]" />
                      <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                        Hasil Pelacakan Berkas Perkara
                      </h2>
                      <span className="bg-[#142642] border border-[#234475] text-[#D4AF37] text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                        {searchResultsPerkara.length} Berkas Ditemukan
                      </span>
                    </div>
                  </div>

                  {searchResultsPerkara.length === 0 ? (
                    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 sm:p-8 text-center space-y-2.5 shadow-xl">
                      <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white">Berkas Perkara Tidak Ditemukan</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Tidak ada berkas perkara asesmen yang sesuai dengan kata kunci &quot;<span className="text-amber-400 font-mono">{searchQuery}</span>&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      {searchResultsPerkara.map(item => {
                        const statusInfo = formatStatusBadge(item);
                        const progress = getStepProgress(item);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectCard(item, 'perkara')}
                            className="bg-[#0b172a] hover:bg-[#0f213d] border border-[#1b3459] hover:border-[#D4AF37]/60 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-3.5 group hover:scale-[1.008]"
                          >
                            {/* Header Kartu */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                                    <span>{item.terperiksa?.namaLengkap || 'Nama Tidak Tersedia'}</span>
                                    {item.terperiksa?.usia && (
                                      <span className="text-slate-400 font-normal text-xs">({item.terperiksa.usia} th)</span>
                                    )}
                                  </h3>
                                  <span className="font-mono text-xs text-slate-400 block">
                                    {item.nomorPermohonan}
                                  </span>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${statusInfo.badgeCls}`}>
                                  {statusInfo.label}
                                </span>
                              </div>

                              {/* Data Instansi */}
                              <div className="text-xs text-slate-300 flex items-center space-x-2 pt-0.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{item.instansiPengaju}</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1.5 pt-2 border-t border-[#1b3459]/60 text-xs">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">
                                  Progres: <strong className="text-white">{progress.done}/6 Tahap Selesai</strong>
                                </span>
                                <span className="font-mono font-bold text-[#D4AF37]">{progress.pct}%</span>
                              </div>

                              <div className="w-full h-1.5 bg-[#081224] rounded-full overflow-hidden border border-[#1b3459]/60">
                                <div
                                  className="h-full bg-gradient-to-r from-[#144782] to-[#D4AF37] transition-all duration-500 rounded-full"
                                  style={{ width: `${progress.pct}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-[11px] pt-1">
                                <span className="text-slate-400 truncate">
                                  Tahap: <span className="text-[#D4AF37] font-semibold">{progress.currentTitle}</span>
                                </span>
                                <span className="text-[#2d7ad6] group-hover:text-white font-semibold flex items-center space-x-1 shrink-0 ml-2">
                                  <span>Buka Detail</span>
                                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: HASIL PEMANTAUAN REHABILITASI & JADWAL KONTROL */}
              {activePortalTab === 'rehab' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                        Hasil Pemantauan Rehabilitasi &amp; Kontrol
                      </h2>
                      <span className="bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                        {searchResultsRehab.length} Klien Ditemukan
                      </span>
                    </div>
                  </div>

                  {searchResultsRehab.length === 0 ? (
                    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 sm:p-8 text-center space-y-2.5 shadow-xl">
                      <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Activity className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white">Data Pemantauan Tidak Ditemukan</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Tidak ada data pemantauan rehabilitasi klien yang cocok dengan kata kunci &quot;<span className="text-amber-400 font-mono">{searchQuery}</span>&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      {searchResultsRehab.map(item => {
                        const info = getJadwalKontrolInfo(item);
                        const noRekom = item.rekomendasiResmi?.nomorSurat || item.sidangPleno?.nomorBeritaAcara || item.nomorPermohonan;

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectCard(item, 'rehab')}
                            className="bg-[#0b172a] hover:bg-[#0d223d] border border-[#1b3459] hover:border-emerald-500/60 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-3.5 group hover:scale-[1.008]"
                          >
                            {/* Header: Nama Klien, No Surat & Status */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                                    <span>{item.terperiksa?.namaLengkap || 'Nama Tidak Tersedia'}</span>
                                    {item.terperiksa?.usia && (
                                      <span className="text-slate-400 font-normal text-xs">({item.terperiksa.usia} th)</span>
                                    )}
                                  </h3>
                                  <span className="font-mono text-xs text-slate-400 block">
                                    {noRekom}
                                  </span>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${info.statusKepatuhan.badgeCls}`}>
                                  {info.statusKepatuhan.label}
                                </span>
                              </div>

                              {/* Fasilitas */}
                              <div className="text-xs text-slate-300 flex items-center space-x-2 pt-0.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{info.namaFasilitas}</span>
                              </div>
                            </div>

                            {/* Jadwal Kontrol Box: Compact & Bersih */}
                            <div className="bg-[#071325] border border-[#1b3459] rounded-xl p-3 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Kontrol Berikutnya</span>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="text-amber-300 font-bold">{info.tanggalKontrol}</span>
                                  <span className="text-slate-400 text-[11px]">({info.waktuKontrol})</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Progres Sesi</span>
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  {info.sesiSelesai} / {info.totalSesi} Selesai
                                </span>
                              </div>
                            </div>

                            {/* Footer: Modalitas & Action */}
                            <div className="pt-2 border-t border-[#1b3459]/60 flex items-center justify-between text-xs">
                              <span className="text-slate-400 text-[11px] truncate">
                                {info.modalitas} ({info.durasi} Bln)
                              </span>
                              <span className="text-emerald-400 group-hover:text-emerald-300 font-semibold flex items-center space-x-1 shrink-0 text-xs">
                                <span>Lihat Detail</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Clean Mobile-Optimized Footer */}
      <footer className="bg-[#071325] border-t border-[#1b3459] py-4 sm:py-5 text-center text-xs text-slate-400 space-y-1 px-4">
        <p>© 2026 Teknis Pelaksanaan Asesmen Terpadu (TAT) BNNP Kalimantan Timur. All rights reserved.</p>
        <p className="text-[10px] text-slate-500">Sistem Integrasi Asesmen dan Pemantauan Pemulihan.</p>
      </footer>
    </div>
  );
};

export default LacakBerkasPage;
