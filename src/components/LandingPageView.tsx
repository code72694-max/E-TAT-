import React, { useState } from 'react';
import { PermohonanAsesmen } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
import {
  ShieldCheck,
  ArrowRight,
  LogIn,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  Stethoscope,
  Scale,
  FileSignature,
  Share2,
  Activity,
  BookOpen,
  Building2,
  FileCheck,
  AlertCircle,
  ChevronRight,
  Shield,
  LifeBuoy,
  HeartHandshake
} from 'lucide-react';

interface LandingPageViewProps {
  onGoToLogin: (presetRole?: string) => void;
  permohonanList: PermohonanAsesmen[];
  onOpenPermohonanDetail?: (id: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGoToLogin,
  permohonanList
}) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedResult, setTrackedResult] = useState<PermohonanAsesmen | null | 'not_found'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    const query = trackingNumber.trim().toLowerCase();
    const found = permohonanList.find(
      p =>
        p.nomorPermohonan.toLowerCase().includes(query) ||
        p.id.toLowerCase() === query ||
        p.terperiksa.namaLengkap.toLowerCase().includes(query)
    );

    setTrackedResult(found || 'not_found');
  };

  const sampleNumbers = ['TAT-089', 'TAT-074', 'TAT-068', 'TAT-055'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      {/* Main Clean Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Lockup */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <PoliceEmblem size="sm" />
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-slate-900 font-['Cinzel',serif] truncate">
                E-TAT <span className="text-[#B89326]">PRESISI</span>
              </span>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-600">
                SEKORNA <span className="text-slate-400 font-normal">· Asesmen Terpadu</span>
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <a href="#gerakan-sekorna" className="hover:text-slate-950 transition-colors flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89326]" />
              <span>Inisiatif SEKORNA</span>
            </a>
            <a href="#alur-layanan" className="hover:text-slate-950 transition-colors">
              Alur SOP
            </a>
            <a href="#lacak-berkas" className="hover:text-slate-950 transition-colors">
              Lacak Berkas
            </a>
            <a href="#pengawasan" className="hover:text-slate-950 transition-colors">
              Pengawasan
            </a>
            <a href="#dasar-hukum" className="hover:text-slate-950 transition-colors">
              Dasar Regulasi
            </a>
          </nav>

          {/* Primary Action Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onGoToLogin()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-800"
            >
              <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Masuk Portal</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Subnav Bar (Horizontal Scrollable, Clean & Minimal) */}
        <div className="md:hidden flex items-center space-x-4 px-4 py-2 bg-slate-50/90 border-t border-slate-200 overflow-x-auto scrollbar-none text-[11px] font-semibold text-slate-600 whitespace-nowrap">
          <a href="#gerakan-sekorna" className="hover:text-slate-900 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89326]" />
            <span>Inisiatif SEKORNA</span>
          </a>
          <span className="text-slate-300">·</span>
          <a href="#alur-layanan" className="hover:text-slate-900">
            Alur SOP
          </a>
          <span className="text-slate-300">·</span>
          <a href="#lacak-berkas" className="hover:text-slate-900">
            Lacak Berkas
          </a>
          <span className="text-slate-300">·</span>
          <a href="#pengawasan" className="hover:text-slate-900">
            Pengawasan
          </a>
          <span className="text-slate-300">·</span>
          <a href="#dasar-hukum" className="hover:text-slate-900">
            Dasar Regulasi
          </a>
        </div>
      </header>

      {/* HERO SECTION - Ultra Clean, Centered, Authoritative & Focused (Full Screen Viewport) */}
      <section className="relative overflow-hidden min-h-[calc(100vh-65px)] flex flex-col justify-center items-center py-10 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 my-auto">
          {/* Acronym Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-800 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#B89326]" />
            <span className="font-extrabold text-[#B89326] font-mono tracking-wider">SEKORNA</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700">Sentra Asesmen Terpadu Narkotika</span>
          </div>

          {/* Grand Centered Headline - STRICTLY LOCKED TO EXACTLY 2 LINES */}
          <h1 className="text-[clamp(1.15rem,3.5vw,2.85rem)] font-extrabold text-slate-900 tracking-tight sm:tracking-wider leading-[1.3] font-['Cinzel',serif] max-w-full mx-auto px-1">
            <span className="block whitespace-nowrap">
              SELAMATKAN KORBAN, <span className="text-[#B89326]">PULIHKAN</span>
            </span>
            <span className="block whitespace-nowrap">
              <span className="text-[#B89326]">MASA DEPAN,</span> SIKAT HABIS SINDIKAT.
            </span>
          </h1>

          {/* Concise, High-Impact Description */}
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal px-2">
            Sinergi penegakan hukum terpadu: Merehabilitasi korban penyalahguna secara medis dan sosial, serta menindak tegas pengedar demi kepastian hukum.
          </p>

          {/* Action Buttons (Centered) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 pt-2 w-full sm:w-auto">
            <button
              onClick={() => onGoToLogin()}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-800 hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4 text-[#D4AF37]" />
              <span>Akses Portal Petugas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#lacak-berkas"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-2xs"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Lacak Berkas Perkara</span>
            </a>
          </div>
        </div>
      </section>

      {/* GERAKAN SEKORNA PHILOSOPHY & ACRONYM SECTION */}
      <section id="gerakan-sekorna" className="py-10 sm:py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg border border-slate-200">
              <LifeBuoy className="w-3.5 h-3.5 text-[#B89326]" />
              <span>DOKTRIN & FILOSOFI PENYELAMATAN GENERASI</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Cinzel',serif] px-1">
              Inisiatif <span className="text-[#B89326]">SEKORNA</span>: SElamatkan KORban NArkotika
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto px-2">
              Singkatan kata <strong>SEKORNA</strong> merangkum tekad moral Tim Asesmen Terpadu Polri & BNN: <em>memulihkan korban kecanduan dengan rehabilitasi, seraya menumpas pengedar dan bandar tanpa kompromi</em>.
            </p>
          </div>

          {/* 3 Pillar Cards Deconstructing the Acronym */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* SE - Selamatkan */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 bg-white border border-slate-200 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-2xs">
                  SE
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  PILAR PERTAMA
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  SElamatkan Jiwa & Hak Hidup
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Penyalahguna dan pecandu adalah korban zat adiktif yang sedang sakit dan membutuhkan intervensi medis serta psikologis sesegera mungkin (maksimal 1x24 jam sejak diamankan). Menyelamatkan mereka berarti menyelamatkan masa depan keluarga dan bangsa.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center space-x-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-slate-500" />
                <span>Amanat Pasal 54 UU No. 35/2009</span>
              </div>
            </div>

            {/* KOR - Korban Dipulihkan */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 bg-white border border-slate-200 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-2xs">
                  KOR
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B89326] bg-[#D4AF37]/15 px-2.5 py-1 rounded-md border border-[#D4AF37]/30">
                  PILAR KEDUA
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  KORban Dilindungi, Bukan Dikriminalisasi
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Melalui instrumen WHO ASSIST dan uji laboratorium toksikologi, Tim Asesmen memverifikasi status tersangka secara objektif. Korban murni diarahkan ke rehabilitasi medis dan sosial, menghindarkan mereka dari penularan kriminalitas lapas.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Keadilan Restoratif Perpol 08/2021</span>
              </div>
            </div>

            {/* NA - Narkotika Diberantas */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 bg-white border border-slate-200 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-2xs">
                  NA
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  PILAR KETIGA
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  NArkotika Diberantas, Bandar Dihukum Maksimal
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Penyelamatan korban berjalan beriringan dengan penegakan hukum tanpa ampun terhadap produsen dan pengedar gelap narkotika. Batas ketat berat barang bukti (SEMA 04/2010) memastikan sindikat tidak dapat menyamar sebagai korban.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>SEMA 04/2010 & UU 35/2009</span>
              </div>
            </div>
          </div>

          {/* Moral Manifesto Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 border border-slate-800 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <LifeBuoy className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block font-mono">
                  KOMITMEN MORAL PENEGAK HUKUM INDONESIA
                </span>
                <h4 className="text-sm sm:text-lg font-bold text-white mt-0.5">
                  "Satu Nyawa yang Kita Pulihkan adalah Satu Masa Depan Bangsa yang Kita Selamatkan."
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Rehabilitasi adalah wujud kehadiran negara melindungi generasi penerus dari kehancuran narkotika.
                </p>
              </div>
            </div>

            <button
              onClick={() => onGoToLogin()}
              className="w-full md:w-auto bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shrink-0 transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
            >
              <span>Akses Portal Penanganan Berkas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* TRACKING DOCK SECTION - Clean Docket Search */}
      <section id="lacak-berkas" className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-6 sm:mb-7">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-white px-3 py-1 rounded-md border border-slate-200">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>TERMINAL PELACAKAN DOKET PERKARA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pemeriksaan Status Berkas Asesmen Terpadu
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto px-2">
              Akses transparan bagi Penyidik Satresnarkoba, Kejaksaan, dan penasihat hukum untuk memeriksa status pemenuhan berkas serta jadwal sidang pleno.
            </p>
          </div>

          <form onSubmit={handleTrack} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Ketik Nomor Permohonan (misal: TAT-089 atau nama)..."
                  className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-slate-800 font-medium placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-all shrink-0"
              >
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>Cari Doket</span>
              </button>
            </div>

            {/* Quick Sample Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs pt-1">
              <span className="text-slate-500 text-[11px] sm:text-xs">Contoh Doket:</span>
              {sampleNumbers.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setTrackingNumber(num);
                    const found = permohonanList.find(p => p.nomorPermohonan.includes(num));
                    setTrackedResult(found || 'not_found');
                  }}
                  className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 px-2.5 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </form>

          {/* Search Result Display - Clean Docket Style */}
          {trackedResult && trackedResult !== 'not_found' && (
            <div className="mt-5 sm:mt-6 p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-4 sm:space-y-5 animate-in fade-in duration-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm sm:text-base text-slate-900">{trackedResult.nomorPermohonan}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                      {trackedResult.statusProsesUtama.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Terperiksa: <strong className="text-slate-900">{trackedResult.terperiksa.namaLengkap}</strong> · Instansi: <span className="text-slate-700">{trackedResult.instansiPengaju}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right text-xs">
                  <span className="text-slate-500">Tanggal Pengajuan:</span>
                  <div className="font-bold text-slate-800 font-mono">{trackedResult.tanggalPengajuan}</div>
                </div>
              </div>

              {/* Progress 3 Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Kepatuhan Formil Legalitas</span>
                  <span className="font-bold text-slate-900 block mt-1 font-mono">
                    {trackedResult.dokumenList.filter(d => d.statusVerifikasi === 'sesuai').length} / 7 Dokumen Sah
                  </span>
                </div>
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Asesmen Medis & Hukum</span>
                  <span className="font-bold text-slate-900 block mt-1">
                    {trackedResult.asesmenMedis && trackedResult.asesmenHukum ? 'Selesai Dilaksanakan' : 'Dalam Proses Telaah'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Status Rekomendasi</span>
                  <span className="font-bold text-slate-900 block mt-1">
                    {trackedResult.rekomendasiResmi ? 'Sah Diterbitkan (QR Siber)' : 'Menunggu Sidang Pleno'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onGoToLogin()}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Buka Berkas di Portal Petugas</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          )}

          {trackedResult === 'not_found' && (
            <div className="mt-4 p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start sm:items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <span>Nomor registrasi doket perkara atau nama tersangka tidak ditemukan dalam basis data e-TAT. Mohon periksa kembali nomor permohonan Anda.</span>
            </div>
          )}
        </div>
      </section>

      {/* 8 STAGES OF WORKFLOW SOP - Clean White Grid */}
      <section id="alur-layanan" className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              STANDAR OPERASIONAL PROSEDUR (SOP)
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Cinzel',serif] px-1">
              8 Tahapan Alur Terpadu Penanganan Perkara e-TAT
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 px-2">
              Siklus akuntabilitas penegakan hukum dari pendaftaran tangkapan 1x24 jam hingga pengawasan pasca asesmen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                step: '01',
                title: 'Registrasi Tangkapan 1x24 Jam',
                actor: 'Penyidik Satresnarkoba / BNN',
                desc: 'Maksimal 1x24 jam sejak tersangka diamankan dengan unggah 7 berkas formil persyaratan hukum.',
                icon: <FileCheck className="w-5 h-5 text-slate-700" />
              },
              {
                step: '02',
                title: 'Uji Formil Berkas Legalitas',
                actor: 'Sekretariat TAT',
                desc: 'Pemeriksaan keabsahan Sprintik, BAP, BA Penangkapan, BA Penggeledahan, dan Surat Permohonan.',
                icon: <CheckCircle2 className="w-5 h-5 text-slate-700" />
              },
              {
                step: '03',
                title: 'Disposisi Surat Perintah Asesmen',
                actor: 'Sekretariat & Koordinator',
                desc: 'Penetapan Surat Perintah Tugas Asesor Medis, Asesor Hukum, ruang klinis, dan jadwal waktu.',
                icon: <Calendar className="w-5 h-5 text-slate-700" />
              },
              {
                step: '04',
                title: 'Pemeriksaan Forensik & Yuridis',
                actor: 'Tim Asesor Medis & Hukum',
                desc: 'Wawancara instrumen WHO ASSIST, uji skrining urin laboratorium, serta telaah batas berat SEMA 04/2010.',
                icon: <Stethoscope className="w-5 h-5 text-slate-700" />
              },
              {
                step: '05',
                title: 'Sidang Pleno Komparatif',
                actor: 'Koordinator & Seluruh Asesor',
                desc: 'Musyawarah pleno menyatukan diagnosis medis dan status hukum peran perkara tersangka.',
                icon: <Users className="w-5 h-5 text-slate-700" />
              },
              {
                step: '06',
                title: 'Pengesahan Rekomendasi Terpadu',
                actor: '3 Pihak: Koordinator, Medis, Hukum',
                desc: 'Penandatanganan digital resmi dan penerbitan sertifikat QR Code anti-pemalsuan siber.',
                icon: <FileSignature className="w-5 h-5 text-slate-700" />
              },
              {
                step: '07',
                title: 'Koordinasi Rujukan & Eksekusi',
                actor: 'Balai Rehabilitasi & Penyidik',
                desc: 'Konfirmasi kuota kamar, pengawalan tersangka ke balai rehabilitasi, serta pelimpahan berkas P-21.',
                icon: <Share2 className="w-5 h-5 text-slate-700" />
              },
              {
                step: '08',
                title: 'Pengawasan Kepatuhan Pasca TAT',
                actor: 'Konselor, Penyidik & Bapas',
                desc: 'Pemantauan wajib lapor mingguan, uji skrining urin acak bebas relapse, sanksi SP, dan SKSP kelulusan.',
                icon: <Activity className="w-5 h-5 text-slate-700" />
              }
            ].map(item => (
              <div
                key={item.step}
                className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 space-y-2.5 hover:bg-white hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono font-extrabold text-xs sm:text-sm text-slate-400 group-hover:text-slate-900 transition-colors">{item.step}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wide">{item.actor}</span>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-1">{item.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PENGAWASAN PASCA TAT - Clean White Box */}
      <section id="pengawasan" className="py-10 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                  PENEGAKAN INTEGRITAS KLIEN (AFTERCARE)
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Cinzel',serif]">
                  Mekanisme Pengawasan Kepatuhan & Sanksi Pencabutan Restorative Justice
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Penyelesaian perkara melalui Keadilan Restoratif bukanlah pembebasan tanpa syarat. Tersangka wajib menjalani program rehabilitasi dengan kepatuhan penuh. Sistem e-TAT mencatat buku monitoring wajib lapor berkala, uji urin acak bebas relapse, dan sanksi Surat Peringatan (SP-1, SP-2, SP-3) hingga rekomendasi pelimpahan kembali ke proses peradilan pidana jika melanggar komitmen.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2 text-xs font-semibold">
                  <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-900 font-bold block text-xs sm:text-sm">Wajib Lapor</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Mingguan / Berkala</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-900 font-bold block text-xs sm:text-sm">Uji Toksikologi</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Acak Bebas Relapse</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-amber-800 font-bold block text-xs sm:text-sm">Sanksi SP-1/3</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Pencabutan Hak RJ</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-emerald-800 font-bold block text-xs sm:text-sm">Sertifikat SKSP</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Kelulusan Resmi</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
                <button
                  onClick={() => onGoToLogin()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 sm:py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                >
                  <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  <span>Buka Buku Pengawasan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASAR REGULASI RESMI - Clean Cards */}
      <section id="dasar-hukum" className="py-10 sm:py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center justify-center space-x-2 font-['Cinzel',serif] px-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89326] shrink-0" />
              <span>Landasan Hukum Operasional Perkara</span>
            </h2>
            <p className="text-xs text-slate-500 px-2">
              Dasar yuridis formal yang mengikat seluruh instansi dalam Tim Asesmen Terpadu Republik Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-xs sm:text-sm">UU No. 35 Tahun 2009</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">Pasal 54 & 103: Mandat rehabilitasi medis & sosial bagi pecandu dan korban penyalahgunaan narkotika.</p>
            </div>
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-xs sm:text-sm">SEMA No. 04 Tahun 2010</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">Pedoman batasan berat barang bukti untuk pemakaian 1 hari (sabu maksimal 1 gram).</p>
            </div>
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-xs sm:text-sm">Perpol No. 08 Tahun 2021</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">Penerapan Keadilan Restoratif (Restorative Justice) dalam penanganan tindak pidana di lingkungan Polri.</p>
            </div>
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-xs sm:text-sm">Perja No. 15 Tahun 2020</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">Penghentian penuntutan perkara pidana berdasarkan keadilan restoratif pada Kejaksaan RI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 sm:py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <PoliceEmblem size="md" />
            <div>
              <span className="font-bold text-white block text-xs sm:text-sm font-['Cinzel',serif]">
                E-TAT PRESISI · INISIATIF SEKORNA
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#D4AF37]">
                SElamatkan KORban NArkotika · Sentra Terpadu Polri & BNN
              </span>
            </div>
          </div>

          <div className="sm:text-right text-[10px] sm:text-[11px] space-y-0.5">
            <p className="text-slate-300">© {new Date().getFullYear()} Kepolisian Negara Republik Indonesia & Badan Narkotika Nasional.</p>
            <p className="text-slate-500">Rastra Sewakotama · Abdi Utama daripada Nusa dan Bangsa</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
