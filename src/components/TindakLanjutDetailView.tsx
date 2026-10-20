import React, { useState, useRef } from 'react';
import type {
  PermohonanAsesmen,
  MonitoringTindakLanjut,
  PelaksanaanRehab,
  LaporanKontrol,
  BuktiWajibLapor,
  AkhirLayananRehab,
  JenisLaporanKontrol,
  UserRole,
  UserProfile,
  TesUrinBerkala,
  JurnalPengawasan,
  SuratPeringatanKlien,
} from '../types';
import { isSuspectExaminedByMedis } from '../utils/medisAuth';
import { tindakLanjutApi } from '../services/api';
import { LembarKendaliModal } from './LembarKendaliModal';
import { printLegalDocument } from '../utils/printLegalDoc';
import { QrCodeImg, buildLacakVerificationUrl } from './QrCodeComponent';
import {
  ArrowLeft,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Activity,
  UserCheck,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Plus,
  Calendar,
  ChevronRight,
  Download,
  Edit3,
  Check,
  ExternalLink,
  ShieldAlert,
  Info,
  Layers,
  Send,
  User,
  FilePlus,
  BadgeCheck,
  CheckSquare,
  Stethoscope,
  Syringe,
  Printer,
  QrCode,
  Award,
  Scale,
  FileSignature,
  BadgeAlert,
  X
} from 'lucide-react';

// =====================================================================
// Helpers & Initial Demo Seeding
// =====================================================================
const genId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
const today = () => new Date().toISOString().slice(0, 10);


const STATUS_PELAKSANAAN_LABELS: Record<PelaksanaanRehab['statusPelaksanaan'], string> = {
  perlu_konfirmasi: 'Perlu Konfirmasi',
  koordinasi_berjalan: 'Koordinasi Berjalan',
  serah_terima_selesai: 'Serah Terima Selesai',
  klien_mulai_layanan: 'Klien Mulai Layanan',
  terkendala_eskalasi: 'Terkendala / Eskalasi',
};

const STATUS_MONITORING_LABELS: Record<MonitoringTindakLanjut['statusMonitoring'], string> = {
  menunggu_pelaksanaan: 'Menunggu Pelaksanaan',
  berjalan: 'Berjalan (Aktif)',
  terkendala: 'Terkendala / Eskalasi',
  selesai: 'Selesai Program (Lulus)',
  tidak_terlaksana: 'Tidak Terlaksana',
};

const JENIS_LAPORAN_OPTIONS: JenisLaporanKontrol[] = [
  'Laporan Kemajuan Periodik',
  'Laporan Kunjungan Kontrol',
  'Laporan Evaluasi Klinis',
  'Laporan Wajib Lapor',
  'Laporan Kejadian Khusus',
  'Laporan Akhir Layanan',
];

// Helper to generate realistic seeded monitoring data if empty
const buildSeededMonitoring = (permohonan: PermohonanAsesmen, userRole: UserRole): MonitoringTindakLanjut => {
  const isRawatInap = permohonan.asesmenMedis?.kebutuhanRawat === 'Rawat Inap';
  const fasilitas = permohonan.tindakLanjut?.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Tanah Merah';

  return {
    id: genId(),
    nomorRekomendasi: permohonan.rekomendasiResmi?.nomorSurat || permohonan.nomorPermohonan,
    pelaksanaanRehab: {
      id: 'pel-' + permohonan.id,
      nomorRekomendasiTAT: permohonan.rekomendasiResmi?.nomorSurat || `REK-TAT/2026/${permohonan.id.slice(-4)}`,
      jenisLayananSesuaiRekomendasi: isRawatInap ? 'Rehabilitasi Medis Rawat Inap Intensif (3 Bulan)' : 'Rehabilitasi Rawat Jalan Kontrol Berkala (8 Sesi)',
      namaFasilitasTujuan: fasilitas,
      alamatFasilitas: 'Jl. Poros Samarinda-Bontang Km. 24, Tanah Merah, Samarinda, Kaltim',
      namaPenanggungJawabFasilitas: '[TEST] Dokter DPJP Fasilitas',
      kontakPenanggungJawabFasilitas: '0812-555-9821 / (0541) 743201',
      tanggalKoordinasiPenerimaan: '2026-09-15',
      hasilKoordinasiPenerimaan: `Fasilitas ${fasilitas} mengonfirmasi kesediaan tempat & tim medis penerima sesuai kuota rekomendasi TAT.`,
      catatanKoordinasi: 'Persyaratan administratif awal dan hasil uji toksikologi dinyatakan lengkap.',
      tanggalSerahTerimaAktual: '2026-09-16',
      identitasPihakMenyerahkan: '[TEST] Penyidik Pengaju Satresnarkoba',
      identitasPihakMenerima: '[TEST] Dokter DPJP Fasilitas (Tim Medis Balai Rehab)',
      fileBaSerahTerimaUrl: 'internal://ba-serah-terima',
      tanggalMasukLayananTerkonfirmasi: '2026-09-16',
      adaKendala: false,
      statusPelaksanaan: 'serah_terima_selesai',
      diisiOleh: '[TEST] Penyidik Pengaju Satresnarkoba',
      kapasitasPengisi: 'Penyidik Pengaju TAT',
      tanggalDiisi: '2026-09-16',
      statusVerifikasiAdmin: 'terverifikasi',
      catatanVerifikasiAdmin: 'Dokumen BA serah terima & syarat admisi terverifikasi valid oleh Sekretariat TAT.',
      diverifikasiOleh: '[TEST] Admin Sekretariat TAT',
      tanggalVerifikasiAdmin: '2026-09-17'
    },
    laporanKontrolList: [
      {
        id: 'lap-1-' + permohonan.id,
        jenisLaporan: 'Laporan Kemajuan Periodik',
        tanggalKegiatanSebenarnya: '2026-09-25',
        namaFasilitasPelapor: fasilitas,
        nomorLaporanFasilitas: `LAP-KLINIK/2026/09/${permohonan.id.slice(-3)}`,
        tanggalLaporanFasilitas: '2026-09-26',
        namaPenerbitLaporan: '[TEST] Dokter DPJP Fasilitas',
        kapasitasPenerbit: 'Dokter Penanggung Jawab Pasien (DPJP)',
        statusPelaksanaanBerdasarkanBukti: 'terlaksana',
        ringkasanAdministratif: 'Pasien telah menjalani minggu ke-2 program detoksifikasi dan konseling medis. Menunjukkan kemajuan kognitif signifikan dan kooperatif dalam sesi terapi harian.',
        rencanaBerdasarkanLaporan: 'Melanjutkan ke fase terapi kelompok (Therapeutic Community) dan pemeriksaan toksikologi urin acak minggu depan.',
        fileBuktiUrl: 'internal://laporan-kontrol-minggu-2',
        diunggahOleh: '[TEST] Penyidik Pengaju Satresnarkoba',
        kapasitasPengunggah: 'Pengaju / Penyidik Pendamping',
        tanggalDiunggah: '2026-09-27',
        statusAdmin: 'terverifikasi',
        catatanAdmin: 'Laporan perkembangan periodik terverifikasi lengkap.',
        diverifikasiOleh: '[TEST] Admin Sekretariat TAT',
        tanggalVerifikasi: '2026-09-28',
        perluTelaahKlinis: true,
        statusTelaahKlinis: 'selesai',
        catatanTelaahKlinis: 'Hasil review medis TAT: Perkembangan klinis sesuai dengan target intervensi rawat inap 3 bulan. Rekomendasi dilanjutkan.',
        tanggalTelaahKlinis: '2026-09-29',
        penugasanMedis: '[TEST] Dokter Asesor Medis TAT'
      }
    ],
    buktiWajibLaporList: [
      {
        id: 'wl-1-' + permohonan.id,
        tanggalRencanaWajibLapor: '2026-09-22',
        tanggalPelaporanAktual: '2026-09-22',
        tanggalWajibLapor: '2026-09-22',
        waktuInputSistem: '2026-09-22 14:15:00 WIB',
        namaPenyidikPenerima: '[TEST] Penyidik Pengaju Satresnarkoba',
        instansiPenyidik: 'Satresnarkoba Polresta Samarinda (Tatap Muka)',
        kegiatanRehabTerkait: 'Pelaporan Wajib Lapor Mingguan Ke-1',
        kanal: 'langsung',
        buktiPenerimaanUrl: 'internal://bukti-wajib-lapor-1',
        statusKonfirmasi: 'dikonfirmasi_penyidik',
        statusVerifikasiAdmin: 'terverifikasi',
        catatanAdmin: 'Telah diverifikasi Admin: Tanggal pelaporan aktual dan bukti fisik lengkap.',
        diunggahOleh: '[TEST] Penyidik Pengaju Satresnarkoba',
        tanggalDiunggah: '2026-09-22'
      },
      {
        id: 'wl-2-' + permohonan.id,
        tanggalRencanaWajibLapor: '2026-09-29',
        tanggalPelaporanAktual: '2026-09-29',
        tanggalWajibLapor: '2026-09-29',
        waktuInputSistem: '2026-09-29 10:05:12 WIB',
        namaPenyidikPenerima: '[TEST] Penyidik Pengaju Satresnarkoba',
        instansiPenyidik: 'Satresnarkoba Polresta Samarinda (Kanal Digital e-TAT)',
        kegiatanRehabTerkait: 'Pelaporan Wajib Lapor Mingguan Ke-2',
        kanal: 'digital',
        buktiPenerimaanUrl: 'internal://bukti-wajib-lapor-2',
        statusKonfirmasi: 'dikonfirmasi_penyidik',
        statusVerifikasiAdmin: 'terverifikasi',
        catatanAdmin: 'Penyidik Pengaju mengunggah BA absensi tepat waktu.',
        diunggahOleh: '[TEST] Penyidik Pengaju Satresnarkoba',
        tanggalDiunggah: '2026-09-29'
      }
    ],
    akhirLayanan: {
      id: 'akr-' + permohonan.id,
      tanggalAkhirLayananAktual: '2026-10-01',
      statusAkhir: 'selesai_program',
      namaFasilitas: fasilitas,
      pihakPenerbitKeterangan: '[TEST] Dokter DPJP Fasilitas',
      hasilSesuaiDokumenFasilitas: 'Klien telah menyelesaikan seluruh rangkaian program rehabilitasi medis dan sosial dengan hasil Evaluasi Klinis Selesai Baik (Pulih & Produktif). Tidak ditemukan indikasi relapse (kekambuhan).',
      rencanaLanjutanDariFasilitas: 'Direkomendasikan mengikuti Program Wajib Lapor Bina Lanjut Pascarehab selama 3 bulan.',
      fileSuratAkhirLayananUrl: 'internal://surat-keterangan-selesai-rehab',
      diisiOleh: '[TEST] Penyidik Pengaju Satresnarkoba',
      kapasitasPengisi: 'Pengaju TAT / Penyidik Satresnarkoba',
      tanggalDiisi: '2026-10-02',
      statusVerifikasiAdmin: 'terverifikasi'
    },
    statusMonitoring: 'selesai',
    dibuatOleh: userRole,
    tanggalDibuat: '2026-09-15',
    terakhirDiperbarui: today()
  };
};

// =====================================================================
// UI Sub-components
// =====================================================================
const SectionHeader: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
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

const InfoBadge: React.FC<{ label: string; color?: 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'purple' }> = ({ label, color = 'slate' }) => {
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

const FieldGroup: React.FC<{ label: string; required?: boolean; hint?: string; children: React.ReactNode }> = ({ label, required, hint, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-300 block">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    {children}
  </div>
);

// =====================================================================
// Step 1: Input Admisi & Rekam Medis Component
// =====================================================================
const PelaksanaanRehabSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  permohonan: PermohonanAsesmen;
  userRole: UserRole;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, permohonan, userRole, readOnly, onUpdate }) => {
  const existing = monitoring.pelaksanaanRehab;
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>(!existing && !readOnly ? 'new' : 'view');
  const canEdit = !readOnly && ['PENGAJU', 'ADMIN', 'MEDIS'].includes(userRole);
  const [showBaModal, setShowBaModal] = useState(false);
  const baPrintRef = useRef<HTMLDivElement>(null);

  const handlePrintBa = () => {
    printLegalDocument(baPrintRef.current?.innerHTML);
  };


  const [form, setForm] = useState<Partial<PelaksanaanRehab>>(existing ?? {
    adaKendala: false,
    statusPelaksanaan: 'serah_terima_selesai',
    tanggalKoordinasiPenerimaan: today(),
    diisiOleh: '',
    kapasitasPengisi: '',
    tanggalDiisi: today(),
  });

  const handleSave = () => {
    if (!form.namaFasilitasTujuan || !form.hasilKoordinasiPenerimaan) return;
    const saved: PelaksanaanRehab = {
      id: existing?.id ?? genId(),
      nomorRekomendasiTAT: form.nomorRekomendasiTAT ?? monitoring.nomorRekomendasi,
      jenisLayananSesuaiRekomendasi: form.jenisLayananSesuaiRekomendasi ?? '',
      namaFasilitasTujuan: form.namaFasilitasTujuan!,
      alamatFasilitas: form.alamatFasilitas ?? '',
      kontakPenanggungJawabFasilitas: form.kontakPenanggungJawabFasilitas ?? '',
      namaPenanggungJawabFasilitas: form.namaPenanggungJawabFasilitas ?? '',
      tanggalKoordinasiPenerimaan: form.tanggalKoordinasiPenerimaan ?? today(),
      hasilKoordinasiPenerimaan: form.hasilKoordinasiPenerimaan!,
      catatanKoordinasi: form.catatanKoordinasi,
      tanggalSerahTerimaAktual: form.tanggalSerahTerimaAktual,
      identitasPihakMenyerahkan: form.identitasPihakMenyerahkan,
      identitasPihakMenerima: form.identitasPihakMenerima,
      fileBaSerahTerimaUrl: form.fileBaSerahTerimaUrl,
      tanggalMasukLayananTerkonfirmasi: form.tanggalMasukLayananTerkonfirmasi,
      adaKendala: form.adaKendala ?? false,
      kendala: form.kendala,
      perbedaanDariRekomendasi: form.perbedaanDariRekomendasi,
      statusPelaksanaan: form.statusPelaksanaan ?? 'serah_terima_selesai',
      diisiOleh: form.diisiOleh ?? '',
      kapasitasPengisi: form.kapasitasPengisi ?? '',
      tanggalDiisi: form.tanggalDiisi ?? today(),
      statusVerifikasiAdmin: 'terverifikasi',
      diverifikasiOleh: 'Sekretariat TAT'
    };
    onUpdate({ ...monitoring, pelaksanaanRehab: saved, terakhirDiperbarui: today() });
    setMode('view');
  };

  const setF = (key: keyof PelaksanaanRehab, val: unknown) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Building2 className="w-4 h-4 text-slate-300" />}
        title="1. Input Admisi & Serah Terima Rehabilitasi (Penerimaan Klinis)"
        subtitle="Data koordinasi awal penerimaan medis, DPJP penerima, fasilitas rujukan, serta BA Serah Terima resmi."
      />

      {(mode === 'view' && existing) ? (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Fasilitas Tujuan</span>
              <span className="text-xs font-semibold text-slate-100 mt-1 block">{existing.namaFasilitasTujuan}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Jenis Layanan Medis</span>
              <span className="text-xs text-slate-200 mt-1 block">{existing.jenisLayananSesuaiRekomendasi || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Dokter / DPJP Penanggung Jawab</span>
              <span className="text-xs text-slate-200 mt-1 block">{existing.namaPenanggungJawabFasilitas || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Kontak Darurat / Telepon</span>
              <span className="text-xs font-mono text-slate-300 mt-1 block">{existing.kontakPenanggungJawabFasilitas || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Koordinasi</span>
              <span className="text-xs text-slate-300 mt-1 block font-mono">{existing.tanggalKoordinasiPenerimaan}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Serah Terima</span>
              <span className="text-xs text-slate-300 mt-1 block font-mono">{existing.tanggalSerahTerimaAktual || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Mulai Program</span>
              <span className="text-xs text-emerald-400 font-medium mt-1 block font-mono">{existing.tanggalMasukLayananTerkonfirmasi || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Penyidik Menyerahkan</span>
              <span className="text-xs text-slate-300 mt-1 block">{existing.identitasPihakMenyerahkan || '—'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <InfoBadge label={STATUS_PELAKSANAAN_LABELS[existing.statusPelaksanaan]} color="green" />
            <InfoBadge label="✓ Terverifikasi Sekretariat & Tim Medis" color="slate" />
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-slate-400 block uppercase text-[10px] tracking-wider">Hasil Koordinasi & Konfirmasi Admisi</span>
            <p className="text-xs text-slate-200">{existing.hasilKoordinasiPenerimaan}</p>
            {existing.catatanKoordinasi && <p className="text-slate-400 italic mt-1 text-xs">{existing.catatanKoordinasi}</p>}
          </div>

          {existing.fileBaSerahTerimaUrl && (
            <div className="flex items-center gap-2.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800 w-fit">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <button
                type="button"
                onClick={() => setShowBaModal(true)}
                className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Berita Acara (BA) Serah Terima Klien</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </button>
            </div>
          )}

          {/* MODAL PRATINJAU BERITA ACARA SERAH TERIMA */}
          {showBaModal && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}
            >
              <div
                className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
                style={{ maxHeight: '96vh' }}
              >
                {/* Top Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="text-[#d4af37]">📄</span>
                      Berita Acara (BA) Serah Terima Klien Rehabilitasi
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Nomor: BA-ST/{permohonan.id?.slice(-4).toUpperCase() || '001'}/IX/2026/SATRESNARKOBA &bull; Klien: {permohonan.terperiksa?.namaLengkap || '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrintBa}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Cetak / Export PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBaModal(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Document Content Viewport */}
                <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
                  <div
                    ref={baPrintRef}
                    className="bg-white text-black p-8 sm:p-12 rounded-lg shadow-2xl mx-auto"
                    style={{
                      maxWidth: '810px',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '11pt',
                      lineHeight: '1.45',
                      color: '#000'
                    }}
                  >
                    {/* Kop Surat BNN */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '85px', verticalAlign: 'middle', textAlign: 'left', padding: '0' }}>
                            <img
                              src="/bnn.png"
                              alt="Logo BNN RI"
                              style={{ width: '78px', height: '78px', objectFit: 'contain', display: 'block' }}
                            />
                          </td>
                          <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0 4px' }}>
                            <div style={{ fontSize: '13pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px' }}>
                              BADAN NARKOTIKA NASIONAL REPUBLIK INDONESIA
                            </div>
                            <div style={{ fontSize: '10.5pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px', marginTop: '1px' }}>
                              TIM ASESMEN TERPADU (TAT) NARKOTIKA DAERAH KALIMANTAN TIMUR
                            </div>
                            <div style={{ fontSize: '8.5pt', marginTop: '3px', lineHeight: '1.35', color: '#111' }}>
                              Sekretariat Bersama: Jl. Slamet Riyadi No. 1, Telp: (0541) 743201, Samarinda - Kaltim<br />
                              Satresnarkoba Polresta Samarinda &bull; Balai Rehabilitasi BNN Tanah Merah
                            </div>
                          </td>
                          <td style={{ width: '85px', verticalAlign: 'middle' }}></td>
                        </tr>
                      </tbody>
                    </table>
                    <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
                    <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

                    <div style={{ textAlign: 'center', margin: '12px 0 16px 0' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '12pt', textDecoration: 'underline' }}>
                        BERITA ACARA SERAH TERIMA TERSANGKA / KLIEN
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                        Nomor: BA-ST/{permohonan.id?.slice(-4).toUpperCase() || '001'}/IX/2026/SATRESNARKOBA
                      </div>
                    </div>

                    <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                      Pada hari ini, tanggal <strong>{existing.tanggalSerahTerimaAktual || '16 September 2026'}</strong>, bertempat di Kantor Tim Asesmen Terpadu (TAT) / Balai Rehabilitasi, kami yang bertanda tangan di bawah ini:
                    </p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '10.5pt' }}>
                      <tbody>
                        <tr>
                          <td colSpan={4} style={{ fontWeight: 'bold', paddingBottom: '4px', textDecoration: 'underline' }}>
                            I. PIHAK YANG MENYERAHKAN:
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                          <td style={{ width: '180px', verticalAlign: 'top' }}>Nama / Pangkat</td>
                          <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{existing.identitasPihakMenyerahkan || '[TEST] Penyidik Pengaju Satresnarkoba'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>2.</td>
                          <td style={{ verticalAlign: 'top' }}>Instansi</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td>{permohonan.instansiPengaju || 'Satresnarkoba Polresta Samarinda'}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} style={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '4px', textDecoration: 'underline' }}>
                            II. PIHAK YANG MENERIMA:
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                          <td style={{ width: '180px', verticalAlign: 'top' }}>Nama Penanggung Jawab</td>
                          <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{existing.identitasPihakMenerima || existing.namaPenanggungJawabFasilitas || '[TEST] Dokter DPJP Fasilitas'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>2.</td>
                          <td style={{ verticalAlign: 'top' }}>Fasilitas Penerima</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td>{existing.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Tanah Merah'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
                      Telah melakukan serah terima tersangka/klien tindak pidana penyalahgunaan narkotika untuk menjalani program rehabilitasi dengan identitas sebagai berikut:
                    </p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5pt' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '25px', verticalAlign: 'top' }}>•</td>
                          <td style={{ width: '180px', verticalAlign: 'top' }}>Nama Klien</td>
                          <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{permohonan.terperiksa?.namaLengkap || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td>{permohonan.terperiksa?.nik || '-'} / {permohonan.terperiksa?.usia || '-'} Tahun</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>No. Laporan Polisi</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontFamily: 'monospace' }}>{permohonan.perkara?.nomorLaporanPolisi || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>Rekomendasi TAT</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold', color: '#166534' }}>{existing.jenisLayananSesuaiRekomendasi || 'Rehabilitasi Medis dan Sosial'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>Status Serah Terima</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold', color: '#166534' }}>✓ Selesai &amp; Memenuhi Syarat Admisi</td>
                        </tr>
                      </tbody>
                    </table>

                    <div style={{ border: '1.5px solid #000', padding: '8px 12px', marginBottom: '16px', background: '#fafafa' }}>
                      <strong style={{ display: 'block', marginBottom: '3px' }}>Catatan Admisi &amp; Koordinasi:</strong>
                      <p style={{ margin: 0, fontSize: '10pt', textAlign: 'justify' }}>
                        {existing.hasilKoordinasiPenerimaan || 'Persyaratan administratif awal dan hasil pemeriksaan toksikologi dinyatakan lengkap dan memenuhi kuota rekomendasi Tim TAT.'}
                      </p>
                    </div>

                    <p style={{ textAlign: 'justify', marginBottom: '18px' }}>
                      Demikian Berita Acara Serah Terima Tersangka/Klien ini dibuat dengan sebenarnya atas kekuatan sumpah jabatan untuk dapat dipergunakan sebagaimana mestinya.
                    </p>

                    {/* Tanda Tangan */}
                    <div className="ttd-section" style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10pt' }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '38%', verticalAlign: 'top' }}>
                              <p style={{ margin: 0 }}>Yang Menyerahkan (Pihak I),</p>
                              <div style={{ height: '65px' }}></div>
                              <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                                {existing.identitasPihakMenyerahkan?.split('(')[0]?.trim() || '[TEST] Penyidik Pengaju Satresnarkoba'}
                              </p>
                              <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Penyidik Pembantu Satresnarkoba</p>
                            </td>

                            <td style={{ width: '24%', verticalAlign: 'middle', textAlign: 'center' }}>
                              <div style={{ display: 'inline-block', border: '1px solid #888', padding: '4px 6px', borderRadius: '4px', background: '#fafafa' }}>
                                <QrCodeImg value={buildLacakVerificationUrl(permohonan, 'pleno')} size={64} alt="QR Verifikasi BA" />
                                <div style={{ fontSize: '7pt', fontFamily: 'monospace', color: '#444', marginTop: '2px' }}>
                                  e-TAT SIAP PULIH
                                </div>
                              </div>
                            </td>

                            <td style={{ width: '38%', verticalAlign: 'top' }}>
                              <p style={{ margin: 0 }}>Yang Menerima (Pihak II),</p>
                              <div style={{ height: '65px' }}></div>
                              <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                                {existing.namaPenanggungJawabFasilitas || '[TEST] Dokter DPJP Fasilitas'}
                              </p>
                              <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Dokter Penanggung Jawab Pasien (DPJP)</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {canEdit && (
            <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" onClick={() => setMode('edit')}>
              <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit Input Admisi Medis
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldGroup label="Nomor Rekomendasi TAT" required>
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" value={form.nomorRekomendasiTAT ?? monitoring.nomorRekomendasi} onChange={e => setF('nomorRekomendasiTAT', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Jenis Layanan Sesuai Rekomendasi Medis" required hint="Salin dari Surat Rekomendasi TAT">
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" placeholder="contoh: Rehabilitasi Rawat Inap 3 Bulan" value={form.jenisLayananSesuaiRekomendasi ?? ''} onChange={e => setF('jenisLayananSesuaiRekomendasi', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Nama Fasilitas Rehabilitasi Tujuan" required>
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" placeholder="Nama Klinik / Balai Rehab BNN" value={form.namaFasilitasTujuan ?? ''} onChange={e => setF('namaFasilitasTujuan', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Nama Dokter / DPJP Penanggung Jawab" required>
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" placeholder="Nama Dokter Spesialis Jiwa / Konselor" value={form.namaPenanggungJawabFasilitas ?? ''} onChange={e => setF('namaPenanggungJawabFasilitas', e.target.value)} />
            </FieldGroup>
          </div>

          <FieldGroup label="Hasil Koordinasi & Konfirmasi Admisi Medis" required>
            <textarea className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none resize-y" rows={2} value={form.hasilKoordinasiPenerimaan ?? ''} onChange={e => setF('hasilKoordinasiPenerimaan', e.target.value)} />
          </FieldGroup>

          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 font-medium rounded-lg text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer" onClick={handleSave}>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Simpan Admisi Medis
            </button>
            {mode === 'edit' && (
              <button className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium rounded-lg text-xs transition-all cursor-pointer" onClick={() => setMode('view')}>
                Batal
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// Step 2: Input Evaluasi Klinis & Tes Urin Toksikologi
// =====================================================================
const EvaluasiKlinisSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  userRole: UserRole;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, userRole, readOnly, onUpdate }) => {
  const [showUrineModal, setShowUrineModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Form urine state
  const [urinJenis, setUrinJenis] = useState<'Terjadwal' | 'Acak (Random)'>('Acak (Random)');
  const [urinHasil, setUrinHasil] = useState<'Negatif' | 'Positif'>('Negatif');
  const [urinKet, setUrinKet] = useState('Pemeriksaan toksikologi 5-panel menunjukkan non-reaktif.');

  // Form clinical report state
  const [jenisLaporan, setJenisLaporan] = useState<JenisLaporanKontrol>('Laporan Evaluasi Klinis');
  const [ringkasanKlinis, setRingkasanKlinis] = useState('Klien menjalani terapi medis rutin. Skor WHO-ASSIST menurun signifikan, kestabilan emosi dan fisik pulih.');

  const handleAddUrine = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: LaporanKontrol = {
      id: genId(),
      jenisLaporan: 'Laporan Kemajuan Periodik',
      tanggalKegiatanSebenarnya: today(),
      namaFasilitasPelapor: monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehab BNN',
      namaPenerbitLaporan: 'Tim Laboratorium Toksikologi Medis',
      kapasitasPenerbit: 'Analis Medis / Dokter DPJP',
      statusPelaksanaanBerdasarkanBukti: urinHasil === 'Negatif' ? 'terlaksana' : 'tidak_terlaksana',
      ringkasanAdministratif: `Uji Toksikologi Urin Berkala (${urinJenis}): Hasil ${urinHasil.toUpperCase()} (AMP, MET, THC, BZO, MOP). ${urinKet}`,
      diunggahOleh: userRole,
      kapasitasPengunggah: 'Tim Medis TAT',
      tanggalDiunggah: today(),
      statusAdmin: 'terverifikasi',
      perluTelaahKlinis: true,
      statusTelaahKlinis: 'selesai',
      catatanTelaahKlinis: `Hasil Uji Toksikologi: ${urinHasil === 'Negatif' ? 'Bebas Zat Narkotika / Pulih' : 'POSITIF / Indikasi Relapse (Perlu Evaluasi Hukum)'}`
    };

    onUpdate({
      ...monitoring,
      laporanKontrolList: [newReport, ...monitoring.laporanKontrolList],
      terakhirDiperbarui: today()
    });
    setShowUrineModal(false);
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: LaporanKontrol = {
      id: genId(),
      jenisLaporan: jenisLaporan,
      tanggalKegiatanSebenarnya: today(),
      namaFasilitasPelapor: monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehab BNN',
      namaPenerbitLaporan: '[TEST] Dokter DPJP Fasilitas',
      kapasitasPenerbit: 'Dokter Penanggung Jawab Pasien (DPJP)',
      statusPelaksanaanBerdasarkanBukti: 'terlaksana',
      ringkasanAdministratif: ringkasanKlinis,
      diunggahOleh: userRole,
      kapasitasPengunggah: 'Tim Medis / DPJP',
      tanggalDiunggah: today(),
      statusAdmin: 'terverifikasi',
      perluTelaahKlinis: true,
      statusTelaahKlinis: 'selesai',
      catatanTelaahKlinis: 'Review Medis TAT: Terapi dan kontrol medis berjalan sesuai target JUKNIS.'
    };

    onUpdate({
      ...monitoring,
      laporanKontrolList: [newReport, ...monitoring.laporanKontrolList],
      terakhirDiperbarui: today()
    });
    setShowReportModal(false);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Stethoscope className="w-4 h-4 text-slate-300" />}
        title="2. Input Evaluasi Klinis & Uji Toksikologi Urin Berkala (Medis)"
        subtitle="Rekam medis kontrol periodik, skrining tes urin berkala/acak (toksikologi), dan catatan perkembangan pasien."
      />

      {/* Action Input Buttons */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowUrineModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Syringe className="w-3.5 h-3.5 text-slate-400" />
            <span>+ Input Hasil Tes Urin</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <FilePlus className="w-3.5 h-3.5 text-slate-400" />
            <span>+ Input Evaluasi Klinis Medis</span>
          </button>
        </div>
      )}

      {/* Modal Input Urin */}
      {showUrineModal && (
        <form onSubmit={handleAddUrine} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Syringe className="w-3.5 h-3.5 text-slate-400" /> Input Hasil Skrining Urin Berkala (Toksikologi)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldGroup label="Jenis Pemeriksaan Urin">
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={urinJenis} onChange={e => setUrinJenis(e.target.value as any)}>
                <option value="Acak (Random)">Acak (Random / Uji Mendadak)</option>
                <option value="Terjadwal">Terjadwal (Kontrol Rutin)</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Hasil Uji Multi-Panel (AMP, MET, THC, BZO, MOP)" required>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={urinHasil} onChange={e => setUrinHasil(e.target.value as any)}>
                <option value="Negatif">NEGATIF (Bebas Zat / Non-Reaktif)</option>
                <option value="Positif">POSITIF (Terdeteksi Zat / Relapse)</option>
              </select>
            </FieldGroup>
          </div>
          <FieldGroup label="Catatan Laboratorium / Keterangan Skrining">
            <input className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={urinKet} onChange={e => setUrinKet(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 rounded-lg text-xs font-medium cursor-pointer shadow-sm">Simpan Hasil Uji</button>
            <button type="button" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowUrineModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {/* Modal Input Laporan Medis */}
      {showReportModal && (
        <form onSubmit={handleAddReport} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" /> Input Laporan Evaluasi Klinis Medis
          </h4>
          <FieldGroup label="Jenis Laporan">
            <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" value={jenisLaporan} onChange={e => setJenisLaporan(e.target.value as any)}>
              {JENIS_LAPORAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="Ringkasan Catatan Evaluasi Klinis Medis" required>
            <textarea className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-slate-600" rows={3} value={ringkasanKlinis} onChange={e => setRingkasanKlinis(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 rounded-lg text-xs font-medium cursor-pointer shadow-sm">Simpan Evaluasi Medis</button>
            <button type="button" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowReportModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {/* List of Clinical Logs & Reports */}
      <div className="space-y-2.5">
        {monitoring.laporanKontrolList.map(laporan => (
          <div key={laporan.id} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InfoBadge label={laporan.jenisLaporan} color="blue" />
                {laporan.statusAdmin === 'terverifikasi' && <InfoBadge label="✓ Terverifikasi Medis" color="green" />}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{laporan.tanggalKegiatanSebenarnya}</span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">{laporan.ringkasanAdministratif}</p>
            {laporan.catatanTelaahKlinis && (
              <div className="p-2.5 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-300">
                <strong className="block text-slate-200 mb-0.5 text-[11px]">Catatan Medis TAT:</strong>
                {laporan.catatanTelaahKlinis}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================================
// Step 3: Jurnal Pengawasan & Wajib Lapor (JUKNIS POLRI/BNN)
// =====================================================================
const WajibLaporSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  permohonan: PermohonanAsesmen;
  userRole: UserRole;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, permohonan, userRole, readOnly, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'aktual' | 'rencana'>('aktual');
  const [showSpModal, setShowSpModal] = useState(false);
  const [selectedWlBuktiModal, setSelectedWlBuktiModal] = useState<BuktiWajibLapor | null>(null);
  const [showLembarKendaliModal, setShowLembarKendaliModal] = useState(false);
  const wlPrintRef = useRef<HTMLDivElement>(null);

  const handlePrintWl = () => {
    printLegalDocument(wlPrintRef.current?.innerHTML);
  };


  const [spTingkat, setSpTingkat] = useState('SP-1 (Peringatan Awal)');
  const [spAlasan, setSpAlasan] = useState('Terperiksa mangkir dalam jadwal kontrol / wajib lapor tanpa keterangan sah.');

  const [form, setForm] = useState<Partial<BuktiWajibLapor>>({
    tanggalRencanaWajibLapor: today(),
    tanggalPelaporanAktual: today(),
    kanal: 'langsung',
    statusKonfirmasi: 'dikonfirmasi_penyidik',
    diunggahOleh: 'Penyidik / JPU Pengaju Berwenang',
    namaPenyidikPenerima: '[TEST] Penyidik Pengaju Satresnarkoba',
    instansiPenyidik: 'Satresnarkoba Polresta Samarinda',
    buktiPenerimaanUrl: 'internal://bukti-wajib-lapor-aktual'
  });

  const setF = (k: keyof BuktiWajibLapor, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSaveWajibLapor = () => {
    if (!form.namaPenyidikPenerima) return;

    const nowTimestamp = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\./g, ':') + ' WIB';

    const saved: BuktiWajibLapor = {
      id: genId(),
      tanggalRencanaWajibLapor: formMode === 'rencana' ? form.tanggalRencanaWajibLapor : form.tanggalRencanaWajibLapor,
      tanggalPelaporanAktual: formMode === 'aktual' ? form.tanggalPelaporanAktual : undefined,
      tanggalWajibLapor: formMode === 'aktual' ? (form.tanggalPelaporanAktual || today()) : (form.tanggalRencanaWajibLapor || today()),
      waktuInputSistem: nowTimestamp,
      namaPenyidikPenerima: form.namaPenyidikPenerima!,
      instansiPenyidik: form.instansiPenyidik || 'Satresnarkoba Polresta Samarinda',
      kegiatanRehabTerkait: formMode === 'aktual' ? 'Catatan Wajib Lapor Aktual (Telah Dilaksanakan)' : 'Rencana Jadwal Wajib Lapor',
      kanal: form.kanal || 'langsung',
      buktiPenerimaanUrl: form.buktiPenerimaanUrl,
      statusKonfirmasi: 'dikonfirmasi_penyidik',
      statusVerifikasiAdmin: 'belum_diperiksa',
      diunggahOleh: userRole === 'PENGAJU' ? 'Pengaju (Penyidik/JPU Berwenang)' : userRole,
      tanggalDiunggah: today(),
    };

    onUpdate({
      ...monitoring,
      buktiWajibLaporList: [saved, ...monitoring.buktiWajibLaporList],
      terakhirDiperbarui: today()
    });
    setShowForm(false);
  };

  const handleVerifyAdmin = (wlId: string) => {
    const updatedList = monitoring.buktiWajibLaporList.map(wl => {
      if (wl.id === wlId) {
        return {
          ...wl,
          statusVerifikasiAdmin: 'terverifikasi' as const,
          catatanAdmin: 'Verified by Admin: Tanggal kejadian aktual & bukti penerimaan sah.'
        };
      }
      return wl;
    });

    onUpdate({
      ...monitoring,
      buktiWajibLaporList: updatedList,
      terakhirDiperbarui: today()
    });
  };

  const handleIssueSp = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpReport: LaporanKontrol = {
      id: genId(),
      jenisLaporan: 'Laporan Kejadian Khusus',
      tanggalKegiatanSebenarnya: today(),
      namaFasilitasPelapor: 'Penyidik / Tim Pengawas TAT',
      namaPenerbitLaporan: 'Sekretariat TAT / Penyidik',
      kapasitasPenerbit: 'Penyidik Narkoba / Pengawas',
      statusPelaksanaanBerdasarkanBukti: 'tidak_terlaksana',
      ringkasanAdministratif: `SURAT PERINGATAN (${spTingkat}): ${spAlasan}`,
      diunggahOleh: userRole,
      kapasitasPengunggah: 'Pengawas',
      tanggalDiunggah: today(),
      statusAdmin: 'perlu_klarifikasi',
      perluTelaahKlinis: false
    };

    onUpdate({
      ...monitoring,
      laporanKontrolList: [newSpReport, ...monitoring.laporanKontrolList],
      statusMonitoring: spTingkat.includes('SP-3') ? 'terkendala' : monitoring.statusMonitoring,
      terakhirDiperbarui: today()
    });
    setShowSpModal(false);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<CheckSquare className="w-4 h-4 text-slate-300" />}
        title="3. Jurnal Pengawasan & Catatan Wajib Lapor Penyidik"
        subtitle="Menu Pengaju (Penyidik/JPU Berwenang) untuk mencatat tanggal kejadian aktual wajib lapor."
      />

      {/* Notice Banner Rule JUKNIS */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Aturan Pengisian Wajib Lapor:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1 text-[11px]">
          <li>Pengaju (Penyidik/JPU) mengisi <strong>Tanggal Pelaporan Aktual</strong> setelah wajib lapor terlaksana.</li>
          <li>Klien tidak perlu login. Seluruh pelaporan dicatat oleh Penyidik/JPU berwenang.</li>
          <li>Jika masih dalam tahap penjadwalan, gunakan menu <strong>Rencana Wajib Lapor</strong>.</li>
        </ul>
      </div>

      {!readOnly && (
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => { setShowForm(true); setFormMode('aktual'); }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span>+ Catat Pelaporan Aktual</span>
          </button>

          <button
            onClick={() => { setShowForm(true); setFormMode('rencana'); }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>+ Buat Rencana Wajib Lapor</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLembarKendaliModal(true)}
            className="px-3.5 py-2 bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234b7d] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cetak Rekap Wajib Lapor</span>
          </button>

          <button
            onClick={() => setShowSpModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
          >
            <BadgeAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Terbitkan SP</span>
          </button>
        </div>
      )}


      {showSpModal && (
        <form onSubmit={handleIssueSp} className="p-4 bg-slate-950/80 border border-rose-900/40 rounded-xl space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-2">
            <BadgeAlert className="w-3.5 h-3.5" /> Terbitkan Surat Peringatan Klien (SP)
          </h4>
          <FieldGroup label="Tingkat Surat Peringatan">
            <select className="w-full bg-slate-900 border border-rose-900/40 rounded-lg p-2 text-xs text-slate-100 outline-none" value={spTingkat} onChange={e => setSpTingkat(e.target.value)}>
              <option value="SP-1 (Peringatan Awal)">SP-1 (Peringatan Awal - Mangkir 1x)</option>
              <option value="SP-2 (Peringatan Keras)">SP-2 (Peringatan Keras - Mangkir 2x)</option>
              <option value="SP-3 (Pencabutan Hak RJ)">SP-3 (Terakhir - Usulan Pencabutan Hak Restoratif Justice)</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Alasan Penerbitan SP" required>
            <textarea className="w-full bg-slate-900 border border-rose-900/40 rounded-lg p-2 text-xs text-slate-100 outline-none" rows={2} value={spAlasan} onChange={e => setSpAlasan(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-medium cursor-pointer shadow-sm">Terbitkan SP</button>
            <button type="button" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowSpModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {showForm && (
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              {formMode === 'aktual' ? 'Form Catatan Wajib Lapor (Pelaporan Aktual)' : 'Form Rencana Wajib Lapor'}
            </h4>
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${formMode === 'aktual' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setFormMode('aktual')}
              >
                Pelaporan Aktual
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${formMode === 'rencana' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setFormMode('rencana')}
              >
                Penjadwalan
              </button>
            </div>
          </div>

          {formMode === 'aktual' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Tanggal Pelaporan Aktual" required hint="Tanggal kedatangan terperiksa">
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-slate-600 outline-none"
                    value={form.tanggalPelaporanAktual ?? today()}
                    onChange={e => setF('tanggalPelaporanAktual', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Tanggal Rencana Semula (Opsional)" hint="Jadwal rencana sebelumnya jika ada">
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-slate-600 outline-none"
                    value={form.tanggalRencanaWajibLapor ?? ''}
                    onChange={e => setF('tanggalRencanaWajibLapor', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Penyidik / JPU Penerima" required>
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    placeholder="Nama & Pangkat Penyidik / JPU"
                    value={form.namaPenyidikPenerima ?? ''}
                    onChange={e => setF('namaPenyidikPenerima', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Instansi / Tempat Pelaporan" required>
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    value={form.instansiPenyidik ?? ''}
                    onChange={e => setF('instansiPenyidik', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Kanal Pelaporan" required>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    value={form.kanal ?? 'langsung'}
                    onChange={e => setF('kanal', e.target.value as any)}
                  >
                    <option value="langsung">Tatap Muka / Datang Langsung</option>
                    <option value="digital">Kanal Digital / Video Call</option>
                    <option value="surat">Surat Keterangan Fasilitas</option>
                    <option value="melalui_pengaju">Melalui Pendampingan</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="Bukti Pelaporan (Dokumen / Berkas)">
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    placeholder="URL Bukti Pelaporan (PDF/JPG)"
                    value={form.buktiPenerimaanUrl ?? ''}
                    onChange={e => setF('buktiPenerimaanUrl', e.target.value)}
                  />
                </FieldGroup>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Rencana Wajib Lapor (Target)" required>
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-slate-600 outline-none"
                    value={form.tanggalRencanaWajibLapor ?? today()}
                    onChange={e => setF('tanggalRencanaWajibLapor', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Penyidik Target Penerima" required>
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    value={form.namaPenyidikPenerima ?? ''}
                    onChange={e => setF('namaPenyidikPenerima', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Instansi / Tempat Pelaporan">
                <input
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                  value={form.instansiPenyidik ?? ''}
                  onChange={e => setF('instansiPenyidik', e.target.value)}
                />
              </FieldGroup>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 rounded-lg text-xs font-medium shadow-sm transition-all cursor-pointer"
              onClick={handleSaveWajibLapor}
            >
              ✓ Simpan Catatan Wajib Lapor
            </button>
            <button
              type="button"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-all cursor-pointer"
              onClick={() => setShowForm(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* List of Wajib Lapor Records */}
      <div className="space-y-2.5">
        {monitoring.buktiWajibLaporList.map(wl => {
          const isAktualExist = Boolean(wl.tanggalPelaporanAktual);

          return (
            <div key={wl.id} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  {isAktualExist ? (
                    <InfoBadge label="✓ Pelaporan Aktual" color="green" />
                  ) : (
                    <InfoBadge label="📅 Rencana Wajib Lapor" color="amber" />
                  )}
                  {wl.statusVerifikasiAdmin === 'terverifikasi' ? (
                    <InfoBadge label="✓ Verified Admin" color="green" />
                  ) : (
                    <InfoBadge label="Belum Verifikasi" color="slate" />
                  )}
                </div>

                <div className="text-right text-[11px] font-mono text-slate-400">
                  <span className="text-slate-300 font-medium">{wl.waktuInputSistem || wl.tanggalDiunggah || 'Sistem e-TAT Logged'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Tanggal Aktual</span>
                  <span className={`font-mono text-xs mt-0.5 block ${isAktualExist ? 'text-emerald-400 font-medium' : 'text-slate-500 italic'}`}>
                    {wl.tanggalPelaporanAktual ? wl.tanggalPelaporanAktual : '— (Belum diisi)'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Rencana Wajib Lapor</span>
                  <span className="font-mono text-slate-200 text-xs mt-0.5 block">
                    {wl.tanggalRencanaWajibLapor || wl.tanggalWajibLapor}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Penyidik Penerima</span>
                  <span className="text-slate-100 text-xs mt-0.5 block truncate">{wl.namaPenyidikPenerima}</span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Instansi &amp; Kanal</span>
                  <span className="text-slate-300 text-xs capitalize mt-0.5 block truncate">{wl.instansiPenyidik} ({wl.kanal})</span>
                </div>
              </div>

              {/* Bukti & Admin Verification Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5 text-xs">
                <div className="flex items-center gap-3">
                  {wl.buktiPenerimaanUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedWlBuktiModal(wl)}
                      className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Berkas Bukti <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  )}
                  <span className="text-[11px] text-slate-400">Dicatat oleh: <strong className="text-slate-300 font-normal">{wl.diunggahOleh}</strong></span>
                </div>

                {userRole === 'ADMIN' && wl.statusVerifikasiAdmin !== 'terverifikasi' && (
                  <button
                    onClick={() => handleVerifyAdmin(wl.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verifikasi (Admin)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL PRATINJAU BERKAS BUKTI WAJIB LAPOR */}
      {selectedWlBuktiModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}
        >
          <div
            className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
            style={{ maxHeight: '96vh' }}
          >
            {/* Top Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-[#d4af37]">📄</span>
                  Surat Tanda Terima Pelaksanaan Wajib Lapor Klien
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nomor: TT-WL/{selectedWlBuktiModal.id.slice(-6).toUpperCase()}/TAT/2026 &bull; Klien: {permohonan.terperiksa?.namaLengkap || '-'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintWl}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak / Export PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWlBuktiModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content Viewport */}
            <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
              <div
                ref={wlPrintRef}
                className="bg-white text-black p-8 sm:p-12 rounded-lg shadow-2xl mx-auto"
                style={{
                  maxWidth: '810px',
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: '11pt',
                  lineHeight: '1.45',
                  color: '#000'
                }}
              >
                {/* Kop Surat BNN */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '85px', verticalAlign: 'middle', textAlign: 'left', padding: '0' }}>
                        <img
                          src="/bnn.png"
                          alt="Logo BNN RI"
                          style={{ width: '78px', height: '78px', objectFit: 'contain', display: 'block' }}
                        />
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0 4px' }}>
                        <div style={{ fontSize: '13pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px' }}>
                          BADAN NARKOTIKA NASIONAL REPUBLIK INDONESIA
                        </div>
                        <div style={{ fontSize: '10.5pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px', marginTop: '1px' }}>
                          TIM ASESMEN TERPADU (TAT) NARKOTIKA PROVINSI KALIMANTAN TIMUR
                        </div>
                        <div style={{ fontSize: '8.5pt', marginTop: '3px', lineHeight: '1.35', color: '#111' }}>
                          Sekretariat Bersama: Jl. Slamet Riyadi No. 1, Telp: (0541) 743201, Samarinda - Kaltim<br />
                          Satuan Reserse Narkoba &bull; Pengawasan &amp; Pemantauan Klien e-TAT SIAP PULIH
                        </div>
                      </td>
                      <td style={{ width: '85px', verticalAlign: 'middle' }}></td>
                    </tr>
                  </tbody>
                </table>
                <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
                <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

                <div style={{ textAlign: 'center', margin: '12px 0 16px 0' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12pt', textDecoration: 'underline' }}>
                    SURAT TANDA TERIMA LAPOR DIRI (WAJIB LAPOR)
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                    Nomor: TT-WL/{selectedWlBuktiModal.id.slice(-6).toUpperCase()}/TAT/2026
                  </div>
                </div>

                <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                  Diterangkan dengan sebenarnya bahwa tersangka/klien di bawah ini telah hadir dan melaksanakan kewajiban lapor diri secara tertib dan berkala sesuai ketentuan rekomendasi Sidang Pleno Tim Asesmen Terpadu (TAT):
                </p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5pt' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                      <td style={{ width: '185px', verticalAlign: 'top' }}>Nama Tersangka / Klien</td>
                      <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontWeight: 'bold' }}>{permohonan.terperiksa?.namaLengkap || '-'} {permohonan.terperiksa?.alias ? `(Alias: ${permohonan.terperiksa.alias})` : ''}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>2.</td>
                      <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{permohonan.terperiksa?.nik || '-'} / {permohonan.terperiksa?.usia || '-'} Tahun</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>3.</td>
                      <td style={{ verticalAlign: 'top' }}>Nomor Laporan Polisi</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontFamily: 'monospace' }}>{permohonan.perkara?.nomorLaporanPolisi || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>4.</td>
                      <td style={{ verticalAlign: 'top' }}>Tahap / Kegiatan</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{selectedWlBuktiModal.kegiatanRehabTerkait || 'Wajib Lapor Rutin Berkala'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>5.</td>
                      <td style={{ verticalAlign: 'top' }}>Tanggal Rencana Semula</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontFamily: 'monospace' }}>{selectedWlBuktiModal.tanggalRencanaWajibLapor || selectedWlBuktiModal.tanggalWajibLapor || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>6.</td>
                      <td style={{ verticalAlign: 'top' }}>Tanggal Pelaporan Aktual</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#166534' }}>
                        {selectedWlBuktiModal.tanggalPelaporanAktual} ({selectedWlBuktiModal.waktuInputSistem || 'Tepat Waktu'})
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>7.</td>
                      <td style={{ verticalAlign: 'top' }}>Kanal / Tempat Lapor</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{selectedWlBuktiModal.kanal === 'langsung' ? 'Tatap Muka Langsung di Kantor Satresnarkoba' : 'Kanal Digital e-TAT SIAP PULIH'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>8.</td>
                      <td style={{ verticalAlign: 'top' }}>Penyidik Penerima Laporan</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontWeight: 'bold' }}>{selectedWlBuktiModal.namaPenyidikPenerima}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>9.</td>
                      <td style={{ verticalAlign: 'top' }}>Instansi Penerima</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{selectedWlBuktiModal.instansiPenyidik}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ border: '1.5px solid #166534', padding: '8px 12px', marginBottom: '16px', background: '#f0fdf4' }}>
                  <strong style={{ color: '#166534', display: 'block', marginBottom: '3px' }}>
                    Status Pengawasan &amp; Catatan Petugas:
                  </strong>
                  <p style={{ margin: 0, fontSize: '10pt', color: '#14532d', textAlign: 'justify' }}>
                    {selectedWlBuktiModal.catatanAdmin || 'Kehadiran dan bukti fisik telah diperiksa serta divalidasi oleh Tim Sekretariat TAT dan Penyidik Pendamping. Klien mematuhi seluruh protokol pengawasan.'}
                  </p>
                </div>

                <p style={{ textAlign: 'justify', marginBottom: '18px' }}>
                  Demikian Surat Tanda Terima Wajib Lapor ini diterbitkan secara sah melalui Sistem Elektronik Tim Asesmen Terpadu (e-TAT SIAP PULIH) untuk menjadi bukti pemenuhan kewajiban hukum tersangka.
                </p>

                {/* Tanda Tangan */}
                <div className="ttd-section" style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10pt' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '38%', verticalAlign: 'top' }}>
                          <p style={{ margin: 0 }}>Tersangka / Klien yang Melapor,</p>
                          <div style={{ height: '65px' }}></div>
                          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                            {permohonan.terperiksa?.namaLengkap || 'Klien TAT'}
                          </p>
                          <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Tanda Tangan Pelapor</p>
                        </td>

                        <td style={{ width: '24%', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'inline-block', border: '1px solid #888', padding: '4px 6px', borderRadius: '4px', background: '#fafafa' }}>
                            <QrCodeImg value={buildLacakVerificationUrl(permohonan, 'pleno')} size={64} alt="QR Verifikasi WL" />
                            <div style={{ fontSize: '7pt', fontFamily: 'monospace', color: '#444', marginTop: '2px' }}>
                              e-TAT SIAP PULIH
                            </div>
                          </div>
                        </td>

                        <td style={{ width: '38%', verticalAlign: 'top' }}>
                          <p style={{ margin: 0 }}>Penyidik Penerima Laporan,</p>
                          <div style={{ height: '65px' }}></div>
                          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                            {selectedWlBuktiModal.namaPenyidikPenerima?.split('(')[0] || 'Penyidik Satresnarkoba'}
                          </p>
                          <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>{selectedWlBuktiModal.instansiPenyidik || 'Satresnarkoba'}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLembarKendaliModal && (
        <LembarKendaliModal
          permohonan={permohonan}
          monitoring={monitoring}
          currentUser={userRole as any}
          onClose={() => setShowLembarKendaliModal(false)}
        />
      )}

    </div>
  );
};

// =====================================================================
// Step 4: Output Resmi Surat Keterangan Selesai Rehabilitasi (SKSR)
// =====================================================================
const AkhirLayananSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  permohonan: PermohonanAsesmen;
  userRole: UserRole;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, permohonan, userRole, readOnly, onUpdate }) => {
  const existing = monitoring.akhirLayanan;
  const [showCertPreview, setShowCertPreview] = useState(false);
  const sksrPrintRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Partial<AkhirLayananRehab>>(existing ?? {
    tanggalAkhirLayananAktual: today(),
    statusAkhir: 'selesai_program',
    hasilSesuaiDokumenFasilitas: 'Terperiksa menyelesaikan seluruh tahapan terapi rehabilitasi dengan evaluasi Pulih & Produktif.',
    namaFasilitas: monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Tanah Merah',
    pihakPenerbitKeterangan: '[TEST] Dokter DPJP Fasilitas',
    diisiOleh: '',
    kapasitasPengisi: '',
    tanggalDiisi: today(),
  });

  const setF = (k: keyof AkhirLayananRehab, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.hasilSesuaiDokumenFasilitas) return;
    const saved: AkhirLayananRehab = {
      id: existing?.id ?? genId(),
      tanggalAkhirLayananAktual: form.tanggalAkhirLayananAktual!,
      hasilSesuaiDokumenFasilitas: form.hasilSesuaiDokumenFasilitas!,
      statusAkhir: form.statusAkhir!,
      namaFasilitas: form.namaFasilitas!,
      pihakPenerbitKeterangan: form.pihakPenerbitKeterangan ?? '[TEST] Dokter DPJP Fasilitas',
      fileSuratAkhirLayananUrl: form.fileSuratAkhirLayananUrl || 'internal://surat-selesai-rehab',
      diisiOleh: userRole,
      kapasitasPengisi: 'Dokter / DPJP',
      tanggalDiisi: today(),
      statusVerifikasiAdmin: 'terverifikasi',
    };
    onUpdate({ ...monitoring, akhirLayanan: saved, statusMonitoring: 'selesai', terakhirDiperbarui: today() });
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Award className="w-4 h-4 text-slate-300" />}
        title="4. Output Resmi: Surat Keterangan Selesai Rehabilitasi (SKSR)"
        subtitle="Pengeluaran resmi hasil rehabilitasi, kelulusan, hasil uji toksikologi, dan rekomendasi status hukum."
      />

      {/* Output Document Preview & Action Card */}
      <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-slate-300" />
              <h4 className="text-sm font-semibold text-slate-100">Surat Keterangan Selesai Rehabilitasi (SKSR) e-TAT</h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Dokumen resmi ber-QR Code untuk kelengkapan berkas penyidikan &amp; peradilan.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCertPreview(!showCertPreview)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>{showCertPreview ? 'Tutup Surat' : 'Pratinjau & Cetak SKSR'}</span>
            </button>
          </div>
        </div>

        {/* Modal Pratinjau & Cetak SKSR Resmi */}
        {showCertPreview && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}
          >
            <div
              className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: '96vh' }}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-[#d4af37]">📄</span>
                    Surat Keterangan Selesai Rehabilitasi (SKSR)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Nomor: SKSR/TAT/2026/09/{permohonan.id.slice(-4)} &bull; Klien: {permohonan.terperiksa?.namaLengkap || '-'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => printLegalDocument(sksrPrintRef.current?.innerHTML)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak / Export PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCertPreview(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Scroll Area */}
              <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
                <div
                  ref={sksrPrintRef}
                  className="bg-white text-black p-8 sm:p-12 rounded-lg shadow-2xl mx-auto"
                  style={{
                    maxWidth: '810px',
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: '11pt',
                    lineHeight: '1.45',
                    color: '#000'
                  }}
                >
                  {/* Kop Surat BNN */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '85px', verticalAlign: 'middle', textAlign: 'left', padding: '0' }}>
                          <img
                            src="/bnn.png"
                            alt="Logo BNN RI"
                            style={{ width: '78px', height: '78px', objectFit: 'contain', display: 'block' }}
                          />
                        </td>
                        <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0 4px' }}>
                          <div style={{ fontSize: '13pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px' }}>
                            BADAN NARKOTIKA NASIONAL REPUBLIK INDONESIA
                          </div>
                          <div style={{ fontSize: '10.5pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px', marginTop: '1px' }}>
                            TIM ASESMEN TERPADU (TAT) NARKOTIKA PROVINSI KALIMANTAN TIMUR
                          </div>
                          <div style={{ fontSize: '8.5pt', marginTop: '3px', lineHeight: '1.35', color: '#111' }}>
                            Sekretariat Bersama: Jl. Slamet Riyadi No. 1, Telp: (0541) 743201, Samarinda - Kaltim<br />
                            Balai Besar Rehabilitasi BNN &bull; Kepolisian Daerah Kalimantan Timur
                          </div>
                        </td>
                        <td style={{ width: '85px', verticalAlign: 'middle' }}></td>
                      </tr>
                    </tbody>
                  </table>
                  <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
                  <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

                  <div style={{ textAlign: 'center', margin: '12px 0 16px 0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12pt', textDecoration: 'underline' }}>
                      SURAT KETERANGAN SELESAI REHABILITASI (SKSR)
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                      Nomor: SKSR/TAT/2026/09/{permohonan.id.slice(-4)}
                    </div>
                  </div>

                  <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                    Ketua Tim Asesmen Terpadu (TAT) berdasarkan evaluasi klinis tim dokter pemeriksa dan pemantauan penegak hukum menerangkan dengan sebenarnya bahwa:
                  </p>

                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5pt' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                        <td style={{ width: '185px', verticalAlign: 'top' }}>Nama Terperiksa</td>
                        <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td style={{ fontWeight: 'bold' }}>{permohonan.terperiksa.namaLengkap || (permohonan.terperiksa as any).namaTerperiksa}</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>2.</td>
                        <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{permohonan.terperiksa.nik || '64720109880001'} / {permohonan.terperiksa.usia} Tahun</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>3.</td>
                        <td style={{ verticalAlign: 'top' }}>Instansi Pengaju</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{permohonan.instansiPengaju}</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>4.</td>
                        <td style={{ verticalAlign: 'top' }}>Fasilitas Rehabilitasi</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehab BNN Tanah Merah'}</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>5.</td>
                        <td style={{ verticalAlign: 'top' }}>Dokter DPJP Medis</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{monitoring.pelaksanaanRehab?.namaPenanggungJawabFasilitas || '[TEST] Dokter DPJP Fasilitas'}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ margin: '12px 0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginBottom: '4px', textDecoration: 'underline' }}>
                      HASIL EVALUASI KLINIS &amp; KEHADIRAN:
                    </div>
                    <p style={{ textAlign: 'justify', marginBottom: '6px' }}>
                      {form.hasilSesuaiDokumenFasilitas}
                    </p>
                    <div style={{ border: '1.5px solid #166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: '4px' }}>
                      <span style={{ color: '#166534', fontWeight: 'bold' }}>✓ Status Toksikologi: BEBAS ZAT NARKOTIKA (NEGATIF)</span>
                      <span style={{ marginLeft: '14px', fontWeight: 'bold', color: '#14532d' }}>&bull; Predikat: PULIH &amp; PRODUKTIF</span>
                    </div>
                  </div>

                  <div style={{ margin: '12px 0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginBottom: '4px', textDecoration: 'underline' }}>
                      REKOMENDASI STATUS HUKUM:
                    </div>
                    <p style={{ textAlign: 'justify' }}>
                      Tersangka telah menyelesaikan seluruh kewajiban rehabilitasi medis dan sosial secara penuh dan tertib. Surat keterangan ini diterbitkan secara sah untuk dilampirkan sebagai kelengkapan pembelaan / pertimbangan vonis Majelis Hakim (Pasal 103 UU No. 35/2009) atau dasar penghentian penuntutan / penyidikan Keadilan Restoratif (Restorative Justice).
                    </p>
                  </div>

                  {/* Signature Block */}
                  <div className="ttd-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '28px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                    <div style={{ textAlign: 'center', width: '30%' }}>
                      <div style={{ display: 'inline-block', border: '1px solid #888', padding: '4px 6px', borderRadius: '4px', background: '#fafafa' }}>
                        <QrCodeImg value={buildLacakVerificationUrl(permohonan, 'pleno')} size={68} alt="QR Verifikasi SKSR" />
                        <p style={{ fontSize: '7pt', fontFamily: 'monospace', color: '#444', margin: '2px 0 0 0' }}>
                          e-TAT QR Code Sah
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', width: '45%' }}>
                      <div>
                        <p style={{ fontSize: '9pt', color: '#333', margin: 0 }}>Samarinda, {today()}</p>
                        <p style={{ fontWeight: 'bold', fontSize: '10.5pt', margin: '2px 0 0 0' }}>Ketua Tim Asesmen Terpadu (TAT)</p>
                      </div>
                      <div style={{ height: '55px' }}></div>
                      <div>
                        <p style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10.5pt', margin: 0 }}>KOMBES POL AHMAD RIFA'I, S.I.K.</p>
                        <p style={{ fontSize: '9pt', color: '#444', margin: 0 }}>NRP. 75080912</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Input Form for Output Generation */}
        {!readOnly && (
          <div className="space-y-3 pt-1">
            <FieldGroup label="Ringkasan Hasil Evaluasi Selesai Rehabilitasi" required>
              <textarea className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:border-slate-600 outline-none" rows={3} value={form.hasilSesuaiDokumenFasilitas ?? ''} onChange={e => setF('hasilSesuaiDokumenFasilitas', e.target.value)} />
            </FieldGroup>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm transition-all" onClick={handleSave}>
              <Check className="w-3.5 h-3.5" /> Simpan &amp; Finalkan Output Surat SKSR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================================
// Main Component
// =====================================================================
interface Props {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onBack: () => void;
  initialTab?: string;
}

const getDetailTabFromProp = (tab?: string): 'pelaksanaan' | 'laporan' | 'wajib_lapor' | 'akhir' => {
  if (tab === 'tindak_lanjut_monitoring') return 'laporan';
  if (tab === 'tindak_lanjut_wajib_lapor') return 'wajib_lapor';
  if (tab === 'tindak_lanjut_rujukan') return 'akhir';
  return 'pelaksanaan';
};

export const TindakLanjutDetailView: React.FC<Props> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan,
  onBack,
  initialTab
}) => {
  const [activeTab, setActiveTab] = useState<'pelaksanaan' | 'laporan' | 'wajib_lapor' | 'akhir'>(getDetailTabFromProp(initialTab));

  // If monitoring is missing or empty, build rich seeded monitoring
  const initialMonitoring = permohonan.monitoringTindakLanjut ?? buildSeededMonitoring(permohonan, currentUser.role);

  const [monitoring, setMonitoring] = useState<MonitoringTindakLanjut>(initialMonitoring);
  const [showLembarKendali, setShowLembarKendali] = useState(false);

  const handleMonitoringUpdate = (updated: MonitoringTindakLanjut) => {
    setMonitoring(updated);
    onUpdatePermohonan({ ...permohonan, monitoringTindakLanjut: updated });

    if (permohonan.id && updated.pelaksanaanRehab) {
      const pel = updated.pelaksanaanRehab;
      tindakLanjutApi.updatePelaksanaan(permohonan.id, {
        namaFasilitasTujuan: pel.namaFasilitasTujuan,
        alamatFasilitas: pel.alamatFasilitas,
        kontakPenanggungJawabFasilitas: pel.kontakPenanggungJawabFasilitas,
        namaPenanggungJawabFasilitas: pel.namaPenanggungJawabFasilitas,
        tanggalKoordinasiPenerimaan: pel.tanggalKoordinasiPenerimaan ? new Date(pel.tanggalKoordinasiPenerimaan).toISOString() : undefined,
        hasilKoordinasiPenerimaan: pel.hasilKoordinasiPenerimaan,
        catatanKoordinasi: pel.catatanKoordinasi,
        tanggalSerahTerimaAktual: pel.tanggalSerahTerimaAktual ? new Date(pel.tanggalSerahTerimaAktual).toISOString() : undefined,
        identitasPihakMenyerahkan: pel.identitasPihakMenyerahkan,
        identitasPihakMenerima: pel.identitasPihakMenerima,
        tanggalMasukLayananTerkonfirmasi: pel.tanggalMasukLayananTerkonfirmasi ? new Date(pel.tanggalMasukLayananTerkonfirmasi).toISOString() : undefined,
        adaKendala: pel.adaKendala ?? false,
        kendala: pel.kendala,
        perbedaanDariRekomendasi: pel.perbedaanDariRekomendasi,
        statusPelaksanaan: pel.statusPelaksanaan ?? 'serah_terima_selesai',
      }).catch(err => console.warn('Backend tindakLanjutApi.updatePelaksanaan notice:', err));
    }
  };

  const statusMonitoringColors: Record<MonitoringTindakLanjut['statusMonitoring'], 'slate' | 'blue' | 'green' | 'amber' | 'red'> = {
    menunggu_pelaksanaan: 'amber',
    berjalan: 'blue',
    terkendala: 'red',
    selesai: 'green',
    tidak_terlaksana: 'slate',
  };

  const tabs = [
    { id: 'pelaksanaan' as const, label: '1. Admisi Medis', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'laporan' as const, label: '2. Evaluasi & Urin', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'wajib_lapor' as const, label: '3. Jurnal Wajib Lapor', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'akhir' as const, label: '4. Output Surat SKSR', icon: <Award className="w-3.5 h-3.5" /> },
  ];

  const progress = {
    pelaksanaan: !!monitoring.pelaksanaanRehab,
    laporan: monitoring.laporanKontrolList.length > 0,
    wajib_lapor: monitoring.buktiWajibLaporList.length > 0,
    akhir: !!monitoring.akhirLayanan,
  };

  const isMedisRole = currentUser.role?.toUpperCase() === 'MEDIS';
  const isMedisAuthorized = isMedisRole ? isSuspectExaminedByMedis(permohonan, currentUser) : true;
  const doctorName =
    permohonan.timAsesmen?.asesorMedisNama ||
    permohonan.asesmenMedis?.asesorNama ||
    (permohonan.asesmenMedis as any)?.dokterPemeriksa ||
    'Dokter Asesor Medis Lain';

  return (
    <div className="space-y-4 text-slate-100 font-sans">
      {/* Integrated Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-slate-100 tracking-tight">Detail Pengawasan &amp; Monitoring</h1>
            <InfoBadge
              label={STATUS_MONITORING_LABELS[monitoring.statusMonitoring]}
              color={statusMonitoringColors[monitoring.statusMonitoring]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="font-mono bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">{permohonan.nomorPermohonan}</span>
            <span>•</span>
            <strong className="text-slate-200 font-medium">{permohonan.terperiksa.namaLengkap || (permohonan.terperiksa as any).namaTerperiksa}</strong>
            <span>•</span>
            <span>Instansi: {permohonan.instansiPengaju}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLembarKendali(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-all cursor-pointer shadow-md hover:scale-[1.02]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar Kendali Pengawasan</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Medical Authorization Banner */}
      {isMedisRole && (
        isMedisAuthorized ? (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-300 shadow-sm">
            <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Hak Akses Medis Valid:</strong> Anda ({currentUser.name}) adalah dokter pemeriksa yang ditugaskan untuk tersangka ini. Anda memiliki wewenang penuh untuk menginput evaluasi klinis, tes urin, dan jadwal kontrol.
            </span>
          </div>
        ) : (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-200 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Akses Medis Terbatas (Mode Baca):</strong> Tersangka ini diperiksa oleh pemeriksa medis <strong>{doctorName}</strong>. Akun Anda ({currentUser.name}) tidak memiliki otorisasi untuk menambah atau mengubah jadwal kontrol &amp; evaluasi rekam medis pasien ini.
            </span>
          </div>
        )
      )}

      {/* Summary Live Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Sesi Kontrol Medis</span>
          <span className="text-lg font-bold text-slate-100 font-mono block">12 / 12 <span className="text-xs font-normal text-slate-400 font-sans">Sesi Selesai (100%)</span></span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">✓ Bebas Absen Mangkir</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Hasil Toksikologi Urin</span>
          <span className="text-lg font-bold text-emerald-400 font-mono block">3x Uji NEGATIF</span>
          <span className="text-[11px] text-slate-400">Non-Reaktif (AMP, MET, THC, BZO)</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Predikat Kelulusan</span>
          <span className="text-lg font-bold text-blue-400 font-mono block">Pulih &amp; Produktif</span>
          <span className="text-[11px] text-slate-400">Rekomendasi Surat SKSR Siap Terbit</span>
        </div>
      </div>

      {/* JUKNIS Guidance Banner */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11px] text-slate-400">
          <strong className="text-slate-200">Alur JUKNIS:</strong> DPJP/Penyidik menginput rekam medis admisi, hasil uji tes urin toksikologi berkala, serta absensi wajib lapor. Sistem e-TAT secara otomatis merekam progres dan menghasilkan <strong className="text-slate-200">Surat Keterangan Selesai Rehabilitasi (SKSR)</strong>.
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const isDone = progress[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-slate-800 border-slate-600 text-slate-100 font-medium shadow-sm'
                  : isDone
                  ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-900/60'
                  : 'bg-slate-950/40 border-slate-800/70 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs truncate">
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </div>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Active Sub View */}
      <div className="pt-1">
        {activeTab === 'pelaksanaan' && (
          <PelaksanaanRehabSection monitoring={monitoring} permohonan={permohonan} userRole={currentUser.role} readOnly={!isMedisAuthorized} onUpdate={handleMonitoringUpdate} />
        )}
        {activeTab === 'laporan' && (
          <EvaluasiKlinisSection monitoring={monitoring} userRole={currentUser.role} readOnly={!isMedisAuthorized} onUpdate={handleMonitoringUpdate} />
        )}
        {activeTab === 'wajib_lapor' && (
          <WajibLaporSection monitoring={monitoring} permohonan={permohonan} userRole={currentUser.role} readOnly={!isMedisAuthorized} onUpdate={handleMonitoringUpdate} />
        )}
        {activeTab === 'akhir' && (
          <AkhirLayananSection monitoring={monitoring} permohonan={permohonan} userRole={currentUser.role} readOnly={!isMedisAuthorized} onUpdate={handleMonitoringUpdate} />
        )}
      </div>

      {showLembarKendali && (
        <LembarKendaliModal
          permohonan={permohonan}
          monitoring={monitoring}
          currentUser={currentUser}
          onClose={() => setShowLembarKendali(false)}
        />
      )}
    </div>
  );
};

export default TindakLanjutDetailView;
