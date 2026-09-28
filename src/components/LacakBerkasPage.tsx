import React, { useState } from 'react';
import { PermohonanAsesmen } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
import { PublicHeader } from './PublicHeader';
import {
  Search,
  LogIn,
  Menu,
  X,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  ArrowRight,
  User,
  Calendar,
  FileSignature,
  Building2,
  ExternalLink
} from 'lucide-react';

interface LacakBerkasPageProps {
  permohonanList: PermohonanAsesmen[];
  onGoToLanding: (sectionId?: string) => void;
  onGoToLogin: () => void;
  onOpenPermohonanDetail: (id: string) => void;
}

export const LacakBerkasPage: React.FC<LacakBerkasPageProps> = ({
  permohonanList,
  onGoToLanding,
  onGoToLogin,
  onOpenPermohonanDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('TAT-074');
  const [searchedPermohonan, setSearchedPermohonan] = useState<PermohonanAsesmen | null>(
    permohonanList.find(p => p.nomorPermohonan.includes('074')) || permohonanList[0] || null
  );
  const [hasSearched, setHasSearched] = useState(true);

  const sampleNumbers = ['TAT-074', 'TAT-089', 'TAT-068', 'TAT-055'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    const found = permohonanList.find(
      p =>
        p.nomorPermohonan.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.terperiksa.namaLengkap.toLowerCase().includes(q) ||
        p.terperiksa.nik.includes(q)
    );

    setSearchedPermohonan(found || null);
    setHasSearched(true);
  };

  const selectSample = (num: string) => {
    setSearchQuery(num);
    const found = permohonanList.find(p => p.nomorPermohonan.includes(num.replace('TAT-', '')));
    setSearchedPermohonan(found || null);
    setHasSearched(true);
  };

  // Stepper calculations
  const getStepStatus = (p: PermohonanAsesmen, stepIndex: number) => {
    const mainStatus = p.statusProsesUtama;
    const stepOrder = [
      ['diajukan', 'menunggu_verifikasi'],
      ['verifikasi_berkas', 'perlu_perbaikan', 'diterima_lengkap'],
      ['proses_asesmen', 'medis_selesai', 'hukum_selesai'],
      ['siap_pleno', 'pleno_selesai'],
      ['pengesahan_rekomendasi', 'rekomendasi_terbit'],
      ['selesai_tindak_lanjut']
    ];

    const currentStepIndex = stepOrder.findIndex(arr => arr.includes(mainStatus));
    if (currentStepIndex === -1) {
      if (mainStatus === 'rekomendasi_terbit' || mainStatus === 'selesai_tindak_lanjut') {
        return stepIndex <= 4 ? 'completed' : stepIndex === 5 && mainStatus === 'selesai_tindak_lanjut' ? 'completed' : 'active';
      }
      return 'pending';
    }

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-slate-950 flex flex-col justify-between">
      {/* Shared Public Header */}
      <PublicHeader
        activePage="lacak"
        onGoToLanding={onGoToLanding}
        onGoToLacak={() => {}}
        onGoToLogin={onGoToLogin}
      />

      {/* MAIN TRACKING PAGE CONTENT */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0d1f38] border border-[#1b3459] text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            <Search className="w-3 h-3 text-[#D4AF37]" />
            <span>PORTAL PELACAKAN TRANSPARAN E-TAT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide font-['Cinzel',serif]">
            Halaman Lacak Berkas Perkara TAT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Pantau posisi berkas permohonan asesmen terpadu, tahapan verifikasi, asesmen medis/hukum, hingga penerbitan surat rekomendasi resmi BNNP Kalimantan Timur.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 shadow-2xl space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Masukkan Nomor Permohonan (contoh: TAT-074) atau Nama Terperiksa..."
                className="w-full bg-[#071326] text-white pl-10 pr-4 py-3 rounded-xl border border-[#1b3459] text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] placeholder-slate-500 font-mono transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#175194] hover:to-[#2274d4] text-white font-bold text-xs px-6 py-3 rounded-xl border border-[#2d7ad6]/70 shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all shrink-0"
            >
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span>Cari Status Berkas</span>
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1b3459]/60 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Contoh Kasus Simulasi:</span>
            {sampleNumbers.map(num => (
              <button
                key={num}
                type="button"
                onClick={() => selectSample(num)}
                className={`font-mono text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                  searchQuery.includes(num)
                    ? 'bg-[#1b3459] text-[#D4AF37] border-[#D4AF37]/60 font-bold'
                    : 'bg-[#071326] text-slate-300 border-[#1b3459] hover:border-slate-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH RESULT DISPLAY */}
        {hasSearched && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {!searchedPermohonan ? (
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-12 text-center text-slate-400 space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Berkas Perkara Tidak Ditemukan</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Nomor permohonan "<span className="font-mono text-[#D4AF37]">{searchQuery}</span>" belum terdaftar pada sistem E-TAT SIAP PULIH BNNP Kaltim. Pastikan format nomor permohonan sudah sesuai.
                </p>
              </div>
            ) : (
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 space-y-6 shadow-2xl">
                {/* Header Information Bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#1b3459]">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base font-bold text-white font-mono">{searchedPermohonan.nomorPermohonan}</span>
                      <span className="text-xs bg-[#071326] text-[#D4AF37] font-bold px-2.5 py-0.5 rounded-full border border-[#1b3459]">
                        {searchedPermohonan.statusProsesUtama.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Terperiksa: <strong className="text-white">{searchedPermohonan.terperiksa.namaLengkap}</strong> • Instansi Pengaju: <span className="text-[#D4AF37]">{searchedPermohonan.instansiPengaju}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="p-2.5 bg-[#071326] rounded-xl border border-[#1b3459] text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Tanggal Pengajuan</span>
                      <span className="font-mono font-bold text-slate-200">{searchedPermohonan.tanggalPengajuan}</span>
                    </div>
                    <button
                      onClick={() => onOpenPermohonanDetail(searchedPermohonan.id)}
                      className="bg-[#132d54] hover:bg-[#1c4278] text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#2d5289] flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <span>Buka Ruang Kerja</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>

                {/* Progress Stepper Flow */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Perkembangan Posisi Berkas (SLA Operasional)</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
                    {[
                      { step: 1, label: 'Registrasi', sub: 'Pendaftaran LP/BAP' },
                      { step: 2, label: 'Verifikasi', sub: 'Administrasi Berkas' },
                      { step: 3, label: 'Asesmen', sub: 'Medis & Hukum' },
                      { step: 4, label: 'Sidang Pleno', sub: 'Musyawarah TAT' },
                      { step: 5, label: 'Rekomendasi', sub: 'Pengesahan TTE' },
                      { step: 6, label: 'Pemantauan', sub: 'Pasca Rehabilitasi' },
                    ].map((item, idx) => {
                      const st = getStepStatus(searchedPermohonan, idx);
                      return (
                        <div
                          key={item.step}
                          className={`p-3 rounded-xl border text-center flex flex-col justify-between space-y-2 transition-all ${
                            st === 'completed'
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                              : st === 'current'
                              ? 'bg-[#132d54] border-[#D4AF37] text-white shadow-lg'
                              : 'bg-[#071326] border-[#1b3459] text-slate-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono font-bold">Langkah {item.step}</span>
                            {st === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : st === 'current' ? (
                              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                            ) : null}
                          </div>

                          <div>
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[9px] block text-slate-400 mt-0.5">{item.sub}</span>
                          </div>

                          <div className="pt-1.5 border-t border-white/10 text-[9px] font-semibold">
                            {st === 'completed' ? '✓ Selesai' : st === 'current' ? '⚡ Sedang Berlangsung' : 'Menunggu'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Status Dokumen */}
                  <div className="p-4 bg-[#071326] border border-[#1b3459] rounded-xl space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">1. Kelengkapan Berkas</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-white font-mono">
                        {searchedPermohonan.dokumenList.filter(d => d.statusVerifikasi === 'sesuai').length} / 7
                      </span>
                      <span className="text-xs text-slate-300">Dokumen Formil Sesuai</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Verifikasi kelengkapan LP, BAP, & Uji Lab Puslabfor.</p>
                  </div>

                  {/* Status Asesmen */}
                  <div className="p-4 bg-[#071326] border border-[#1b3459] rounded-xl space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">2. Status Asesmen Spesialis</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#D4AF37]">
                        {searchedPermohonan.asesmenMedis && searchedPermohonan.asesmenHukum ? 'Medis & Hukum Lengkap' : 'Proses Pemeriksaan'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Skrining ASSIST Medis & Analisis Kualifikasi Perkara Hukum.</p>
                  </div>

                  {/* Status Rekomendasi & Barcode QR */}
                  <div className="p-4 bg-[#071326] border border-[#1b3459] rounded-xl space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">3. Rekomendasi Resmi & Barcode</span>
                    {searchedPermohonan.rekomendasiResmi ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-400 block">✓ Resmi Terbit & Sah TTE</span>
                        <span className="text-[10px] font-mono text-[#D4AF37] block truncate">
                          {searchedPermohonan.rekomendasiResmi.nomorSurat}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 block">Menunggu Sidang Pleno Final</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-[#071325] border-t border-[#1b3459] py-6 text-center text-xs text-slate-400 space-y-1">
        <p>© 2026 Tim Asesmen Terpadu (TAT) BNNP Kalimantan Timur. All rights reserved.</p>
        <p className="text-[10px] text-slate-400">Sistem Integrasi Asesmen dan Pantauan Pemulihan Penyalahguna Narkotika.</p>
      </footer>
    </div>
  );
};
