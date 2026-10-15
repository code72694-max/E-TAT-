import React, { useState, useMemo, useEffect } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { PublicHeader } from './PublicHeader';
import { PermohonanDetail } from './PermohonanDetail';
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
  Activity
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

// Helper: Format status secara aman tanpa resiko undefined.replace()
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

export const LacakBerkasPage: React.FC<LacakBerkasPageProps> = ({
  permohonanList,
  currentUser,
  onGoToLanding,
  onGoToLogin,
  onGoToRegister,
  onOpenPermohonanDetail,
  onUpdatePermohonan
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPermohonan, setSelectedPermohonan] = useState<PermohonanAsesmen | null>(null);

  // Quick Simulation Samples
  const sampleNumbers = [
    { code: '0099', label: 'TAT/0099 (Pleno Selesai)', desc: 'Dedi Kurniawan' },
    { code: '0103', label: 'TAT/0103 (Asesmen Medis)', desc: 'Fitriani Rahayu' },
    { code: '0012', label: 'TAT/0012 (Selesai Terbit)', desc: 'Budi Hermawan' },
    { code: '089', label: 'TAT/089 (Aktif)', desc: 'Rizky Pratama' }
  ];

  // Sinkronisasi id dari URL params saat pertama kali dimuat
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      const found = permohonanList.find(p => p.id === idFromUrl);
      if (found) {
        setSelectedPermohonan(found);
      }
    }
  }, [permohonanList]);

  // Search Results Filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return permohonanList;
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
  }, [searchQuery, permohonanList]);

  // Handle Form Submit
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

  // Saat salah satu kartu hasil pencarian diklik -> Buka Detail Page
  const handleSelectCard = (item: PermohonanAsesmen) => {
    setSelectedPermohonan(item);
    if (window.history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', item.id);
      window.history.pushState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Saat tombol "Kembali" pada halaman detail diklik
  const handleBackToList = () => {
    setSelectedPermohonan(null);
    if (window.history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.pathname);
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Profil pengguna yang efektif untuk tampilan PermohonanDetail (mode Pengaju read-only)
  const effectiveUser: UserProfile = useMemo(() => {
    if (currentUser) {
      return {
        ...currentUser,
        role: 'PENGAJU'
      };
    }
    return {
      id: selectedPermohonan?.pengajuId || 'user-pengaju-public',
      name: selectedPermohonan?.pengajuNama || selectedPermohonan?.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju Satresnarkoba',
      email: selectedPermohonan?.pengajuEmail || 'pengaju@gmail.com',
      role: 'PENGAJU',
      agency: selectedPermohonan?.instansiPengaju || 'Satresnarkoba Polresta Samarinda',
      avatarUrl: ''
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

      {/* TAMPILAN DETAIL PERMOHONAN (PERSIS SEPERTI DETAIL ASESMEN AKTIF DI PENGAJU) */}
      {selectedPermohonan ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 animate-in fade-in duration-200">
          <PermohonanDetail
            permohonan={selectedPermohonan}
            currentUser={effectiveUser}
            onBack={handleBackToList}
            onUpdatePermohonan={onUpdatePermohonan || (() => {})}
            onOpenQrModal={() => {}}
            isReadonly={true}
            hideEmailPengaju={true}
          />
        </main>
      ) : (
        /* MAIN TRACKING SEARCH & CARDS PAGE CONTENT */
        <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6">
          {/* Page Hero Header */}
          <div className="text-center space-y-2 sm:space-y-2.5">
            <div className="inline-flex items-center space-x-2 bg-[#0b172a] border border-[#1b3459] px-3 py-1 rounded-full text-[11px] font-semibold text-[#D4AF37] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Portal Pelacakan Publik Transparan E-TAT</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pelacakan Berkas Perkara Asesmen Terpadu
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed px-1">
              Pantau status berkas permohonan asesmen terpadu, tahapan verifikasi, pemeriksaan medis/hukum, musyawarah pleno, hingga pengesahan rekomendasi resmi.
            </p>
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
                  placeholder="Cari No. Permohonan (misal: 0099, TAT/2026/...), Kode Lacak, atau Nama Terperiksa..."
                  className="w-full bg-[#081224] focus:bg-[#0c1c34] text-white pl-10 pr-4 py-3 rounded-xl border border-[#1b3459] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 text-xs sm:text-sm outline-none placeholder-slate-500 font-mono transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
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
                className="w-full sm:w-auto bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#175194] hover:to-[#2274d4] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-[#2d7ad6]/70 shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all shrink-0 active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>Cari Berkas</span>
              </button>
            </form>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-[#1b3459]/60 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                <span>Contoh Cepat:</span>
              </span>
              {sampleNumbers.map(sample => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => selectSample(sample.code)}
                  className="bg-[#0e1d35] hover:bg-[#17335c] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-[#1e3e6b] text-[11px] font-mono transition-all cursor-pointer flex items-center space-x-1 shadow-sm active:scale-95"
                >
                  <span className="text-[#D4AF37] font-bold">{sample.code}</span>
                  <span className="text-slate-400 text-[10px]">({sample.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* VIEW HASIL PENCARIAN (CARDS LIST) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Daftar Berkas Perkara Ditemukan
                </h2>
                <span className="bg-[#142642] border border-[#234475] text-[#D4AF37] text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {searchResults.length} Berkas
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Klik kartu perkara untuk membuka rincian lengkap asesmen
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-8 sm:p-12 text-center space-y-3 shadow-xl">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Berkas Perkara Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Tidak ada permohonan yang sesuai dengan kata kunci &quot;<span className="text-amber-400 font-mono">{searchQuery}</span>&quot;. Silakan periksa kembali nomor permohonan, nama lengkap terperiksa, atau gunakan tombol contoh cepat.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setHasSearched(false);
                  }}
                  className="mt-2 px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold rounded-xl border border-[#234475] transition-all cursor-pointer"
                >
                  Tampilkan Semua Berkas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {searchResults.map(item => {
                  const statusInfo = formatStatusBadge(item);
                  const progress = getStepProgress(item);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectCard(item)}
                      className="bg-[#0b172a] hover:bg-[#0f213d] border border-[#1b3459] hover:border-[#D4AF37]/60 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-3.5 group hover:scale-[1.01]"
                    >
                      {/* Header Kartu: Nomor & Status Badge */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-white text-sm sm:text-base group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                              <span>{item.nomorPermohonan}</span>
                            </span>
                            {item.trackingNumber && (
                              <span className="text-[10px] text-slate-400 font-mono block">
                                Lacak: {item.trackingNumber}
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${statusInfo.badgeCls}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Nama Terperiksa & Instansi */}
                        <div className="text-xs space-y-1 pt-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-white font-semibold truncate text-sm">
                              {item.terperiksa?.namaLengkap || 'Nama Tidak Tersedia'}
                            </span>
                            {item.terperiksa?.usia && (
                              <span className="text-slate-400 text-[11px]">({item.terperiksa.usia} th)</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-slate-300">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.instansiPengaju}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Tgl Pengajuan: {item.tanggalPengajuan || '-'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar & Tahapan Progres */}
                      <div className="space-y-2 pt-2 border-t border-[#1b3459]/60 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">
                            Progres: <strong className="text-white">{progress.done}/6 Tahap Selesai</strong>
                          </span>
                          <span className="font-mono font-bold text-[#D4AF37]">{progress.pct}%</span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-1.5 bg-[#081224] rounded-full overflow-hidden border border-[#1b3459]/60">
                          <div
                            className="h-full bg-gradient-to-r from-[#144782] to-[#D4AF37] transition-all duration-500 rounded-full"
                            style={{ width: `${progress.pct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-400 truncate">
                            Tahap Berjalan: <span className="text-[#D4AF37] font-semibold">{progress.currentTitle}</span>
                          </span>
                          <span className="text-[#2d7ad6] group-hover:text-white font-bold flex items-center space-x-1 shrink-0 ml-2">
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
