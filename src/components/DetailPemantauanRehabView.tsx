import React, { useState } from 'react';
import { PermohonanAsesmen } from '../types';
import {
  ArrowLeft,
  Activity,
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  Syringe,
  CheckCircle2,
  AlertTriangle,
  Award,
  FileText,
  Printer,
  Download,
  ShieldCheck,
  User,
  Scale,
  BadgeAlert,
  Info,
  CheckSquare,
  QrCode,
  MapPin,
  ExternalLink,
  ChevronRight,
  HeartPulse,
  Sparkles
} from 'lucide-react';

interface DetailPemantauanRehabViewProps {
  permohonan: PermohonanAsesmen;
  onBack: () => void;
}

export const DetailPemantauanRehabView: React.FC<DetailPemantauanRehabViewProps> = ({
  permohonan,
  onBack
}) => {
  const [showSksrModal, setShowSksrModal] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'kontrol' | 'urin' | 'wajib_lapor'>('kontrol');

  const t = permohonan.terperiksa;
  const pgw = permohonan.pengawasanKlien;
  const tl = permohonan.tindakLanjut;
  const mon = permohonan.monitoringTindakLanjut;
  const pleno = permohonan.sidangPleno;
  const rekom = permohonan.rekomendasiResmi;

  // Resolusi data fasilitas & DPJP
  const namaFasilitas =
    tl?.namaFasilitasTujuan ||
    pgw?.instansiPelaksanaRehab ||
    mon?.pelaksanaanRehab?.namaFasilitasTujuan ||
    pleno?.fasilitasRujukanUsulan ||
    'Balai Besar Rehabilitasi BNN Tanah Merah Samarinda';

  const alamatFasilitas =
    mon?.pelaksanaanRehab?.alamatFasilitas ||
    'Jl. Poros Samarinda-Bontang Km. 24, Tanah Merah, Samarinda, Kalimantan Timur';

  const dpjp =
    mon?.pelaksanaanRehab?.namaPenanggungJawabFasilitas ||
    pgw?.konselorPendamping ||
    '[TEST] Dokter DPJP Fasilitas';

  const modalitas =
    pgw?.modalitasLayanan ||
    (permohonan.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rehabilitasi Rawat Inap' : 'Rehabilitasi Rawat Jalan');

  const durasiBulan =
    pgw?.durasiBulan ||
    pleno?.durasiRehabBulan ||
    permohonan.asesmenMedis?.durasiUsulanBulan ||
    3;

  const tanggalMulai =
    pgw?.tanggalMulai ||
    mon?.pelaksanaanRehab?.tanggalMasukLayananTerkonfirmasi ||
    tl?.tanggalMulaiLayanan ||
    '15 September 2026';

  const tanggalTargetSelesai =
    pgw?.tanggalTargetSelesai ||
    '15 Desember 2026';

  // Jadwal Kontrol Berikutnya
  const tanggalKontrolBerikutnya =
    pgw?.tanggalKontrolBerikutnya ||
    mon?.buktiWajibLaporList?.[0]?.tanggalRencanaWajibLapor ||
    '28 Oktober 2026';

  const waktuKontrolBerikutnya = pgw?.waktuKontrolBerikutnya || '09:30 WITA';

  const catatanKontrolBerikutnya =
    pgw?.catatanKontrolBerikutnya ||
    'Wajib didampingi keluarga penjamin, membawa kartu kontrol klien, serta menjalani evaluasi skrining toksikologi urin berkala.';

  // Sesi & Kepatuhan
  const totalSesi = pgw?.totalSesiWajib || 12;
  const sesiSelesai = pgw?.sesiTerselesaikan || 8;
  const persenSelesai = Math.round((sesiSelesai / totalSesi) * 100);

  // Riwayat Tes Urin
  const riwayatUrin = (pgw?.riwayatTesUrinBerkala && pgw.riwayatTesUrinBerkala.length > 0)
    ? pgw.riwayatTesUrinBerkala
    : [
        {
          id: 'urin-1',
          tanggalTes: '16 September 2026',
          tahapKe: 1,
          jenisPemeriksaan: 'Terjadwal (Admisi)',
          parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
          hasil: 'Negatif',
          petugasPemeriksa: '[TEST] Dokter DPJP Fasilitas',
          keterangan: 'Skrining awal saat klien admisi ke balai rehab. Non-reaktif 5-panel.'
        },
        {
          id: 'urin-2',
          tanggalTes: '30 September 2026',
          tahapKe: 2,
          jenisPemeriksaan: 'Acak (Random)',
          parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
          hasil: 'Negatif',
          petugasPemeriksa: 'Analis Lab Balai BNN',
          keterangan: 'Pemeriksaan toksikologi mendadak minggu ke-2. Tidak ditemukan zat narkotika.'
        },
        {
          id: 'urin-3',
          tanggalTes: '14 Oktober 2026',
          tahapKe: 3,
          jenisPemeriksaan: 'Terjadwal (Evaluasi)',
          parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
          hasil: 'Negatif',
          petugasPemeriksa: '[TEST] Dokter DPJP Fasilitas',
          keterangan: 'Evaluasi berkala bulan ke-1. Hasil non-reaktif, kondisi fisik & emosi stabil.'
        }
      ];

  // Riwayat Wajib Lapor
  const riwayatWajibLapor = (mon?.buktiWajibLaporList && mon.buktiWajibLaporList.length > 0)
    ? mon.buktiWajibLaporList
    : [
        {
          id: 'wl-1',
          tanggalPelaporanAktual: '22 September 2026',
          tanggalRencanaWajibLapor: '22 September 2026',
          tanggalWajibLapor: '22 September 2026',
          namaPenyidikPenerima: permohonan.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju Satresnarkoba',
          instansiPenyidik: 'Satresnarkoba Polresta Samarinda',
          kanal: 'langsung' as const,
          statusKonfirmasi: 'dikonfirmasi_penyidik' as const,
          statusVerifikasiAdmin: 'terverifikasi',
          diunggahOleh: 'Penyidik Satresnarkoba'
        },
        {
          id: 'wl-2',
          tanggalPelaporanAktual: '06 Oktober 2026',
          tanggalRencanaWajibLapor: '06 Oktober 2026',
          tanggalWajibLapor: '06 Oktober 2026',
          namaPenyidikPenerima: permohonan.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju Satresnarkoba',
          instansiPenyidik: 'Satresnarkoba Polresta Samarinda (Kanal Digital)',
          kanal: 'digital' as const,
          statusKonfirmasi: 'dikonfirmasi_penyidik' as const,
          statusVerifikasiAdmin: 'terverifikasi',
          diunggahOleh: 'Penyidik Satresnarkoba'
        }
      ];

  const noSuratRekom = rekom?.nomorSurat || pleno?.nomorBeritaAcara || `R-TAT/2026/${permohonan.id.slice(-4)}`;

  const handleDownloadPdf = () => {
    window.open(`/api/rekomendasi/${permohonan.id}/pdf`, '_blank');
  };

  const handlePrintSksr = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Main Title & Executive Badge */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-[#1b3459]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#142642] border border-[#234475] px-2.5 py-0.5 rounded-lg">
                {noSuratRekom}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SEDANG MENJALANI REHABILITASI</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pt-1">
              {t?.namaLengkap || 'Terperiksa'} {t?.alias ? `(${t.alias})` : ''}
            </h1>

            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
              <span>NIK: <strong className="text-slate-300 font-mono">{t?.nik || '64720109880001'}</strong></span>
              <span>&bull;</span>
              <span>Usia: <strong className="text-slate-300">{t?.usia || 28} Tahun</strong></span>
              <span>&bull;</span>
              <span>Instansi: <strong className="text-slate-300">{permohonan.instansiPengaju}</strong></span>
              <span>&bull;</span>
              <span>Penyidik: <strong className="text-slate-300">{permohonan.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju Satresnarkoba'}</strong></span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="text-left lg:text-right bg-[#081224] p-3 rounded-xl border border-[#1b3459] text-xs space-y-0.5 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Modalitas &amp; Masa Program</span>
              <span className="font-bold text-white text-sm block">{modalitas}</span>
              <span className="text-[#D4AF37] font-semibold block">{durasiBulan} Bulan Program Terpadu</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-3.5 py-1.5 bg-[#0f274a] hover:bg-[#163a69] text-sky-200 border border-[#234b7d] rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Unduh Rekomendasi (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSksrModal(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-slate-950" />
                <span>Pratinjau &amp; Cetak SKSR</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Sesi Terlaksana</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white font-mono">{sesiSelesai} / {totalSesi}</span>
              <span className="text-xs text-[#D4AF37] font-bold">({persenSelesai}%)</span>
            </div>
            <div className="w-full h-1 bg-[#142642] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-[#D4AF37] rounded-full" style={{ width: `${persenSelesai}%` }} />
            </div>
          </div>

          <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Hasil Toksikologi</span>
            <span className="text-base font-bold text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3x NEGATIF</span>
            </span>
            <span className="text-[10px] text-slate-400 block truncate">Non-Reaktif (Bebas Zat)</span>
          </div>

          <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Kepatuhan Klien</span>
            <span className="text-base font-bold text-emerald-300 block">Sangat Patuh</span>
            <span className="text-[10px] text-emerald-400 block">✓ Nihil Mangkir Sesi</span>
          </div>

          <div className="bg-[#081224] border border-amber-500/30 rounded-xl p-3.5 space-y-1 bg-gradient-to-b from-amber-500/5 to-transparent">
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3" /> Kontrol Terdekat
            </span>
            <span className="text-sm font-bold text-amber-300 font-mono block truncate">{tanggalKontrolBerikutnya}</span>
            <span className="text-[10px] text-slate-300 block">{waktuKontrolBerikutnya} WITA</span>
          </div>
        </div>
      </div>

      {/* 2 Main Columns: (Left) Jadwal Kontrol Utama & (Right) Fasilitas Rujukan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1: JADWAL KONTROL MEDIS & INSTRUKSI (7 COLS) */}
        <div className="lg:col-span-7 bg-[#0b172a] border-2 border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                  Jadwal Kontrol Medis &amp; Konseling Berikutnya
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full font-mono">
                WAJIB HADIR
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#061222] p-3 rounded-xl border border-amber-500/20">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">Tanggal Sesi:</span>
                <span className="text-sm font-bold font-mono text-white mt-0.5 block">{tanggalKontrolBerikutnya}</span>
                <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-1 font-mono">
                  <Clock className="w-3 h-3" /> Pukul {waktuKontrolBerikutnya}
                </span>
              </div>

              <div className="bg-[#061222] p-3 rounded-xl border border-amber-500/20">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">Dokter DPJP / Konselor:</span>
                <span className="text-sm font-bold text-slate-100 mt-0.5 block flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{dpjp}</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Spesialis Kedokteran Jiwa / Adiksi</span>
              </div>
            </div>

            <div className="bg-[#061222] p-3 rounded-xl border border-amber-500/20 text-xs space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Lokasi Pelaksanaan Kontrol:</span>
              <span className="font-bold text-slate-200 block flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{namaFasilitas}</span>
              </span>
              <span className="text-[11px] text-slate-400 block pl-5">{alamatFasilitas}</span>
            </div>

            <div className="p-3 bg-[#081a33] border border-[#234b7d] rounded-xl text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 text-xs">Instruksi Penting Bagi Tersangka / Penjamin:</strong>
                <p className="text-[11px] text-slate-300">{catatanKontrolBerikutnya}</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: FASILITAS & PENETAPAN REHAB (5 COLS) */}
        <div className="lg:col-span-5 bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Fasilitas &amp; Rujukan Resmi
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                {modalitas}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459]">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">Fasilitas Rujukan Sesuai Rekomendasi:</span>
                <span className="text-xs font-bold text-white block mt-0.5">{namaFasilitas}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Akreditasi Tingkat Nasional (BNN)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#081224] p-2.5 rounded-xl border border-[#1b3459]">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Tanggal Masuk:</span>
                  <span className="font-mono text-slate-200 font-bold mt-0.5 block">{tanggalMulai}</span>
                </div>
                <div className="bg-[#081224] p-2.5 rounded-xl border border-[#1b3459]">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Target Selesai:</span>
                  <span className="font-mono text-slate-200 font-bold mt-0.5 block">{tanggalTargetSelesai}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#081224] border border-[#1b3459] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Pemberian Rekomendasi Hukum:</span>
              <span className="text-[#D4AF37] font-bold">Keadilan Restoratif (RJ)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Memenuhi kriteria SEMA No. 4/2010 Pasal 127 UU 35/2009 untuk menjalani rehabilitasi dan tidak dipenjara.
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs Switcher: [1. Riwayat Skrining Urin] & [2. Catatan Wajib Lapor] */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTabSection('kontrol')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabSection === 'kontrol'
                  ? 'bg-gradient-to-r from-[#144782] to-[#1c64b8] text-white border border-[#2d7ad6]/70 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#0e1d35]'
              }`}
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>1. Rekam Toksikologi Urin ({riwayatUrin.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabSection('wajib_lapor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabSection === 'wajib_lapor'
                  ? 'bg-gradient-to-r from-[#144782] to-[#1c64b8] text-white border border-[#2d7ad6]/70 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#0e1d35]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>2. Jurnal Wajib Lapor Penyidik ({riwayatWajibLapor.length})</span>
            </button>
          </div>

          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
            ✓ Evaluasi Klinis Lengkap
          </span>
        </div>

        {/* Tab 1: Rekam Uji Toksikologi Urin */}
        {(activeTabSection === 'kontrol' || activeTabSection === 'urin') && (
          <div className="space-y-3">
            {riwayatUrin.map((urin, idx) => (
              <div
                key={urin.id}
                className="bg-[#081224] border border-[#1b3459] rounded-xl p-3.5 space-y-2 text-xs hover:border-[#234b7d] transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b3459]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white bg-[#142642] px-2 py-0.5 rounded text-[11px]">
                      Uji Ke-{idx + 1} &bull; {urin.jenisPemeriksaan}
                    </span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/90 border border-emerald-600/40 px-2.5 py-0.5 rounded text-[11px]">
                      ✓ HASIL: {urin.hasil.toUpperCase()} (NON-REAKTIF)
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{urin.tanggalTes}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-slate-300 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Parameter Skrining 5-Panel:</span>
                    <span className="font-mono font-bold text-slate-200 mt-0.5 block">
                      {Array.isArray(urin.parameter) ? urin.parameter.join(', ') : 'AMP, MET, THC, BZO, MOP'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dokter Pemeriksa / Analis:</span>
                    <span className="text-slate-200 font-medium mt-0.5 block">{urin.petugasPemeriksa}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Catatan Medis:</span>
                    <span className="text-slate-300 italic mt-0.5 block">{urin.keterangan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Catatan Wajib Lapor Penyidik */}
        {activeTabSection === 'wajib_lapor' && (
          <div className="space-y-3">
            {riwayatWajibLapor.map((wl, idx) => (
              <div
                key={wl.id}
                className="bg-[#081224] border border-[#1b3459] rounded-xl p-3.5 space-y-2 text-xs hover:border-[#234b7d] transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b3459]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[11px] border border-emerald-700/50">
                      ✓ Pelaporan Ke-{idx + 1} ({wl.kanal.toUpperCase()})
                    </span>
                    <span className="text-slate-300 font-medium text-[11px]">
                      Status: Dikonfirmasi &amp; Diverifikasi Penyidik
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {wl.tanggalPelaporanAktual || wl.tanggalWajibLapor}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-300 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Penyidik Penerima Laporan:</span>
                    <span className="text-white font-semibold">{wl.namaPenyidikPenerima}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Satuan / Instansi:</span>
                    <span className="text-slate-200">{wl.instansiPenyidik}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Status Administrasi:</span>
                    <span className="text-emerald-400 font-medium">✓ Hadir Tepat Waktu</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PRATINJAU RESMI SKSR (SURAT KETERANGAN SELESAI REHABILITASI) */}
      {showSksrModal && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] bg-[#071325]">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Surat Keterangan Selesai Rehabilitasi (SKSR)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dokumen resmi Tim Asesmen Terpadu (TAT) ber-QR Code untuk kelengkapan pembelaan di Pengadilan / Restorative Justice
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrintSksr}
                  className="px-3.5 py-1.5 bg-[#d4af37] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak SKSR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSksrModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Lembar Sertifikat SKSR Asli */}
            <div className="p-6 overflow-y-auto bg-slate-200 text-slate-900 font-serif leading-relaxed">
              <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl max-w-3xl mx-auto space-y-6 text-xs border-2 border-slate-300">
                {/* Kop Surat Resmi Kedinasan */}
                <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
                  <h2 className="text-sm sm:text-base font-extrabold tracking-wide uppercase font-sans text-slate-900">
                    TIM ASESMEN TERPADU (TAT) NARKOTIKA
                  </h2>
                  <p className="text-xs font-sans font-bold text-slate-700">
                    POLRESTA SAMARINDA / BNN PROVINSI KALIMANTAN TIMUR
                  </p>
                  <p className="text-[10px] font-sans text-slate-600">
                    Alamat: Jl. Slamet Riyadi No. 1, Samarinda &bull; Hotline Layanan e-TAT: (0541) 743201
                  </p>
                </div>

                <div className="text-center font-sans space-y-1">
                  <h3 className="text-sm font-bold underline uppercase tracking-wider text-slate-900">
                    SURAT KETERANGAN SELESAI REHABILITASI (SKSR)
                  </h3>
                  <p className="text-[11px] text-slate-700 font-mono">
                    Nomor: SKSR/TAT/2026/09/{permohonan.id.slice(-4)}
                  </p>
                </div>

                <p className="font-sans text-slate-800">
                  Ketua Tim Asesmen Terpadu (TAT) berdasarkan evaluasi klinis tim dokter pemeriksa dan pemantauan tim penelaah hukum menerangkan dengan sebenarnya bahwa:
                </p>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 font-sans space-y-1.5 text-[11px]">
                  <div className="grid grid-cols-3"><span className="font-semibold text-slate-700">Nama Lengkap</span><span className="col-span-2 font-bold text-slate-900">: {t?.namaLengkap || 'Terperiksa'}</span></div>
                  <div className="grid grid-cols-3"><span className="font-semibold text-slate-700">NIK / Usia</span><span className="col-span-2 text-slate-800">: {t?.nik || '64720109880001'} / {t?.usia || 28} Tahun</span></div>
                  <div className="grid grid-cols-3"><span className="font-semibold text-slate-700">Instansi Pengaju</span><span className="col-span-2 text-slate-800">: {permohonan.instansiPengaju}</span></div>
                  <div className="grid grid-cols-3"><span className="font-semibold text-slate-700">Fasilitas Rehabilitasi</span><span className="col-span-2 font-semibold text-slate-900">: {namaFasilitas}</span></div>
                  <div className="grid grid-cols-3"><span className="font-semibold text-slate-700">Dokter DPJP / Konselor</span><span className="col-span-2 text-slate-800">: {dpjp}</span></div>
                </div>

                <div className="space-y-2 font-sans">
                  <h4 className="font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase text-[10px]">
                    HASIL EVALUASI KLINIS &amp; KEHADIRAN:
                  </h4>
                  <p className="text-slate-800">
                    Klien terperiksa telah menyelesaikan seluruh rangkaian intervensi rehabilitasi medis dan sosial dengan hasil evaluasi klinis:
                  </p>
                  <div className="flex flex-wrap gap-4 font-bold text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-300 text-[11px]">
                    <span>✓ Status Toksikologi: BEBAS ZAT NARKOTIKA (NEGATIF)</span>
                    <span>&bull; Predikat Kelulusan: PULIH &amp; PRODUKTIF</span>
                  </div>
                </div>

                <div className="space-y-1 font-sans">
                  <h4 className="font-bold text-slate-900 uppercase text-[10px]">
                    REKOMENDASI STATUS HUKUM:
                  </h4>
                  <p className="text-slate-800 text-justify">
                    Tersangka telah menyelesaikan kewajiban rehabilitasi secara penuh dan tertib. Surat keterangan ini diterbitkan secara sah untuk dilampirkan sebagai kelengkapan pembelaan/pertimbangan vonis Majelis Hakim (Pasal 103 UU 35/2009) atau syarat penghentian penuntutan/penyidikan Keadilan Restoratif (Restorative Justice).
                  </p>
                </div>

                {/* Tanda Tangan & QR Code */}
                <div className="flex justify-between items-end pt-6 font-sans">
                  <div className="text-center space-y-1">
                    <QrCode className="w-16 h-16 mx-auto text-slate-800" />
                    <p className="text-[9px] text-slate-500 font-mono">TTE Sah Terverifikasi e-TAT</p>
                  </div>
                  <div className="text-center space-y-10">
                    <div>
                      <p className="text-[10px] text-slate-600">Samarinda, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="font-bold text-slate-900 text-[11px]">Ketua Tim Asesmen Terpadu (TAT)</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 underline text-[11px]">KOMBES POL AHMAD RIFA'I, S.I.K.</p>
                      <p className="text-[10px] text-slate-600">NRP. 75080912</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
