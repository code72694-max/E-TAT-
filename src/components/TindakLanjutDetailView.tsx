import React, { useState } from 'react';
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
  BadgeAlert
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
      namaPenanggungJawabFasilitas: 'dr. Rina Lestari, Sp.KJ',
      kontakPenanggungJawabFasilitas: '0812-555-9821 / (0541) 743201',
      tanggalKoordinasiPenerimaan: '2026-09-15',
      hasilKoordinasiPenerimaan: `Fasilitas ${fasilitas} mengonfirmasi kesediaan tempat & tim medis penerima sesuai kuota rekomendasi TAT.`,
      catatanKoordinasi: 'Persyaratan administratif awal dan hasil uji toksikologi dinyatakan lengkap.',
      tanggalSerahTerimaAktual: '2026-09-16',
      identitasPihakMenyerahkan: 'Bripka Heru Susanto (Penyidik Satresnarkoba)',
      identitasPihakMenerima: 'dr. Rina Lestari, Sp.KJ (Tim Medis Balai Rehab)',
      fileBaSerahTerimaUrl: 'https://e-tat.polri.go.id/docs/BA-SERAH-TERIMA-REHAB.pdf',
      tanggalMasukLayananTerkonfirmasi: '2026-09-16',
      adaKendala: false,
      statusPelaksanaan: 'serah_terima_selesai',
      diisiOleh: 'Aipda Bambang Supriyadi',
      kapasitasPengisi: 'Penyidik Pengaju TAT',
      tanggalDiisi: '2026-09-16',
      statusVerifikasiAdmin: 'terverifikasi',
      catatanVerifikasiAdmin: 'Dokumen BA serah terima & syarat admisi terverifikasi valid oleh Sekretariat TAT.',
      diverifikasiOleh: 'Bripka Tri Wahyudi (Admin Sekretariat)',
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
        namaPenerbitLaporan: 'dr. Rina Lestari, Sp.KJ',
        kapasitasPenerbit: 'Dokter Penanggung Jawab Pasien (DPJP)',
        statusPelaksanaanBerdasarkanBukti: 'terlaksana',
        ringkasanAdministratif: 'Pasien telah menjalani minggu ke-2 program detoksifikasi dan konseling medis. Menunjukkan kemajuan kognitif signifikan dan kooperatif dalam sesi terapi harian.',
        rencanaBerdasarkanLaporan: 'Melanjutkan ke fase terapi kelompok (Therapeutic Community) dan pemeriksaan toksikologi urin acak minggu depan.',
        fileBuktiUrl: 'https://e-tat.polri.go.id/docs/LAPORAN-KONTROL-MINGGU-2.pdf',
        diunggahOleh: 'Aipda Bambang Supriyadi',
        kapasitasPengunggah: 'Pengaju / Penyidik Pendamping',
        tanggalDiunggah: '2026-09-27',
        statusAdmin: 'terverifikasi',
        catatanAdmin: 'Laporan perkembangan periodik terverifikasi lengkap.',
        diverifikasiOleh: 'Admin Sekretariat',
        tanggalVerifikasi: '2026-09-28',
        perluTelaahKlinis: true,
        statusTelaahKlinis: 'selesai',
        catatanTelaahKlinis: 'Hasil review medis TAT: Perkembangan klinis sesuai dengan target intervensi rawat inap 3 bulan. Rekomendasi dilanjutkan.',
        tanggalTelaahKlinis: '2026-09-29',
        penugasanMedis: 'dr. Hendra Kusumah, Sp.KJ (Tim Medis TAT)'
      }
    ],
    buktiWajibLaporList: [
      {
        id: 'wl-1-' + permohonan.id,
        tanggalRencanaWajibLapor: '2026-09-22',
        tanggalPelaporanAktual: '2026-09-22',
        tanggalWajibLapor: '2026-09-22',
        waktuInputSistem: '2026-09-22 14:15:00 WIB',
        namaPenyidikPenerima: 'Bripka Heru Susanto (Penyidik Satresnarkoba)',
        instansiPenyidik: 'Satresnarkoba Polresta Samarinda (Tatap Muka)',
        kegiatanRehabTerkait: 'Pelaporan Wajib Lapor Mingguan Ke-1',
        kanal: 'langsung',
        buktiPenerimaanUrl: 'https://e-tat.polri.go.id/docs/BUKTI-WAJIB-LAPOR-1.pdf',
        statusKonfirmasi: 'dikonfirmasi_penyidik',
        statusVerifikasiAdmin: 'terverifikasi',
        catatanAdmin: 'Telah diverifikasi Admin: Tanggal pelaporan aktual dan bukti fisik lengkap.',
        diunggahOleh: 'Bripka Heru Susanto (Pengaju/Penyidik)',
        tanggalDiunggah: '2026-09-22'
      },
      {
        id: 'wl-2-' + permohonan.id,
        tanggalRencanaWajibLapor: '2026-09-29',
        tanggalPelaporanAktual: '2026-09-29',
        tanggalWajibLapor: '2026-09-29',
        waktuInputSistem: '2026-09-29 10:05:12 WIB',
        namaPenyidikPenerima: 'Aipda Bambang Supriyadi (Penyidik Satresnarkoba)',
        instansiPenyidik: 'Satresnarkoba Polresta Samarinda (Kanal Digital e-TAT)',
        kegiatanRehabTerkait: 'Pelaporan Wajib Lapor Mingguan Ke-2',
        kanal: 'digital',
        buktiPenerimaanUrl: 'https://e-tat.polri.go.id/docs/BUKTI-WAJIB-LAPOR-2.pdf',
        statusKonfirmasi: 'dikonfirmasi_penyidik',
        statusVerifikasiAdmin: 'terverifikasi',
        catatanAdmin: 'Penyidik Pengaju mengunggah BA absensi tepat waktu.',
        diunggahOleh: 'Aipda Bambang Supriyadi (Pengaju/Penyidik)',
        tanggalDiunggah: '2026-09-29'
      }
    ],
    akhirLayanan: {
      id: 'akr-' + permohonan.id,
      tanggalAkhirLayananAktual: '2026-10-01',
      statusAkhir: 'selesai_program',
      namaFasilitas: fasilitas,
      pihakPenerbitKeterangan: 'dr. Rina Lestari, Sp.KJ (DPJP Balai Rehabilitasi)',
      hasilSesuaiDokumenFasilitas: 'Klien telah menyelesaikan seluruh rangkaian program rehabilitasi medis dan sosial dengan hasil Evaluasi Klinis Selesai Baik (Pulih & Produktif). Tidak ditemukan indikasi relapse (kekambuhan).',
      rencanaLanjutanDariFasilitas: 'Direkomendasikan mengikuti Program Wajib Lapor Bina Lanjut Pascarehab selama 3 bulan.',
      fileSuratAkhirLayananUrl: 'https://e-tat.polri.go.id/docs/SURAT-KETERANGAN-SELESAI-REHAB.pdf',
      diisiOleh: 'Aipda Bambang Supriyadi',
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
  <div className="flex items-start gap-3.5 pb-4 border-b border-[#1f385c]">
    <div className="p-2.5 bg-[#0f233f] border border-[#234475] text-[#38bdf8] rounded-xl shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-bold text-slate-100 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

const InfoBadge: React.FC<{ label: string; color?: 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'purple' }> = ({ label, color = 'slate' }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorMap[color]}`}>
      {label}
    </span>
  );
};

const FieldGroup: React.FC<{ label: string; required?: boolean; hint?: string; children: React.ReactNode }> = ({ label, required, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-300 block">
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
  userRole: UserRole;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, userRole, onUpdate }) => {
  const existing = monitoring.pelaksanaanRehab;
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>(!existing ? 'new' : 'view');
  const canEdit = ['PENGAJU', 'ADMIN', 'MEDIS'].includes(userRole);

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
    <div className="space-y-5">
      <SectionHeader
        icon={<Building2 className="w-5 h-5 text-[#38bdf8]" />}
        title="1. Input Admisi & Serah Terima Rehabilitasi (Penerimaan Klinis)"
        subtitle="Mencatat data koordinasi awal penerimaan medis, nama Dokter DPJP penerima, fasilitas rujukan, serta upload BA Serah Terima resmi."
      />

      {(mode === 'view' && existing) ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0a192f] p-4 rounded-xl border border-[#1e3a5f]">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Fasilitas Tujuan</span>
              <span className="text-sm font-bold text-slate-100 mt-1 block">{existing.namaFasilitasTujuan}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Jenis Layanan Medis</span>
              <span className="text-sm font-medium text-slate-200 mt-1 block">{existing.jenisLayananSesuaiRekomendasi || '—'}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Dokter / DPJP Penanggung Jawab</span>
              <span className="text-sm font-medium text-slate-200 mt-1 block">{existing.namaPenanggungJawabFasilitas || '—'}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Kontak Darurat / Telepon</span>
              <span className="text-sm font-mono text-cyan-300 mt-1 block">{existing.kontakPenanggungJawabFasilitas || '—'}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Koordinasi</span>
              <span className="text-sm text-slate-300 mt-1 block">{existing.tanggalKoordinasiPenerimaan}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Serah Terima</span>
              <span className="text-sm text-slate-300 mt-1 block">{existing.tanggalSerahTerimaAktual || '—'}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Mulai Program</span>
              <span className="text-sm text-emerald-400 font-semibold mt-1 block">{existing.tanggalMasukLayananTerkonfirmasi || '—'}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block">Penyidik Menyerahkan</span>
              <span className="text-sm text-slate-300 mt-1 block">{existing.identitasPihakMenyerahkan || '—'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <InfoBadge label={STATUS_PELAKSANAAN_LABELS[existing.statusPelaksanaan]} color="green" />
            <InfoBadge label="✓ Terverifikasi Sekretariat & Tim Medis" color="green" />
          </div>

          <div className="bg-[#0b1b33] p-4 rounded-xl border border-[#1e3a5f] text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-slate-400 block uppercase text-[10px] tracking-wider">Hasil Koordinasi & Konfirmasi Admisi</span>
            <p className="text-sm text-slate-200">{existing.hasilKoordinasiPenerimaan}</p>
            {existing.catatanKoordinasi && <p className="text-slate-400 italic mt-1">{existing.catatanKoordinasi}</p>}
          </div>

          {existing.fileBaSerahTerimaUrl && (
            <div className="flex items-center gap-3 p-3 bg-[#0b1b33] rounded-xl border border-[#1e3a5f] w-fit">
              <FileText className="w-4 h-4 text-blue-400" />
              <a href={existing.fileBaSerahTerimaUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
                Berita Acara (BA) Serah Terima Klien <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {canEdit && (
            <button className="px-4 py-2 bg-[#0e223f] hover:bg-[#163056] text-slate-200 border border-[#234475] font-medium rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer" onClick={() => setMode('edit')}>
              <Edit3 className="w-4 h-4 text-slate-400" /> Edit Input Admisi Medis
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup label="Nomor Rekomendasi TAT" required>
              <input className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" value={form.nomorRekomendasiTAT ?? monitoring.nomorRekomendasi} onChange={e => setF('nomorRekomendasiTAT', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Jenis Layanan Sesuai Rekomendasi Medis" required hint="Salin dari Surat Rekomendasi TAT">
              <input className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="contoh: Rehabilitasi Rawat Inap 3 Bulan" value={form.jenisLayananSesuaiRekomendasi ?? ''} onChange={e => setF('jenisLayananSesuaiRekomendasi', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Nama Fasilitas Rehabilitasi Tujuan" required>
              <input className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="Nama Klinik / Balai Rehab BNN" value={form.namaFasilitasTujuan ?? ''} onChange={e => setF('namaFasilitasTujuan', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Nama Dokter / DPJP Penanggung Jawab" required>
              <input className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="Nama Dokter Spesialis Jiwa / Konselor" value={form.namaPenanggungJawabFasilitas ?? ''} onChange={e => setF('namaPenanggungJawabFasilitas', e.target.value)} />
            </FieldGroup>
          </div>

          <FieldGroup label="Hasil Koordinasi & Konfirmasi Admisi Medis" required>
            <textarea className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:border-blue-500 outline-none resize-y" rows={2} value={form.hasilKoordinasiPenerimaan ?? ''} onChange={e => setF('hasilKoordinasiPenerimaan', e.target.value)} />
          </FieldGroup>

          <div className="flex gap-3 pt-3">
            <button className="px-5 py-2.5 bg-[#1652f0] hover:bg-[#1347d3] text-white font-medium rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer" onClick={handleSave}>
              <Check className="w-4 h-4" /> Simpan Admisi Medis
            </button>
            {mode === 'edit' && (
              <button className="px-4 py-2.5 bg-[#0e223f] hover:bg-[#163056] text-slate-300 border border-[#234475] font-medium rounded-xl text-xs transition-all cursor-pointer" onClick={() => setMode('view')}>
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
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, userRole, onUpdate }) => {
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
      namaPenerbitLaporan: 'dr. Rina Lestari, Sp.KJ',
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
    <div className="space-y-5">
      <SectionHeader
        icon={<Stethoscope className="w-5 h-5 text-[#38bdf8]" />}
        title="2. Input Evaluasi Klinis & Uji Toksikologi Urin Berkala (Medis)"
        subtitle="Tempat Tim Medis / DPJP menginput rekam medis kontrol periodik, hasil skrining tes urin acak (toksikologi), dan catatan perkembangan fisik/psikis."
      />

      {/* Action Input Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowUrineModal(true)}
          className="px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-[#38bdf8] border border-[#234475] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <Syringe className="w-4 h-4 text-cyan-400" />
          <span>+ Input Hasil Tes Urin (Toksikologi)</span>
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-emerald-400 border border-[#234475] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <FilePlus className="w-4 h-4 text-emerald-400" />
          <span>+ Input Laporan Evaluasi Klinis Medis</span>
        </button>
      </div>

      {/* Modal Input Urin */}
      {showUrineModal && (
        <form onSubmit={handleAddUrine} className="p-4 bg-[#0a192f] border border-[#1e3a5f] rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-2">
            <Syringe className="w-4 h-4" /> Input Hasil Skrining Urin Berkala (Toksikologi)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldGroup label="Jenis Pemeriksaan Urin">
              <select className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100" value={urinJenis} onChange={e => setUrinJenis(e.target.value as any)}>
                <option value="Acak (Random)">Acak (Random / Uji Mendadak)</option>
                <option value="Terjadwal">Terjadwal (Kontrol Rutin)</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Hasil Uji Multi-Panel (AMP, MET, THC, BZO, MOP)" required>
              <select className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100" value={urinHasil} onChange={e => setUrinHasil(e.target.value as any)}>
                <option value="Negatif">NEGATIF (Bebas Zat / Non-Reaktif)</option>
                <option value="Positif">POSITIF (Terdeteksi Zat / Relapse)</option>
              </select>
            </FieldGroup>
          </div>
          <FieldGroup label="Catatan Laboratorium / Keterangan Skrining">
            <input className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100" value={urinKet} onChange={e => setUrinKet(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium cursor-pointer">Simpan Hasil Uji</button>
            <button type="button" className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowUrineModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {/* Modal Input Laporan Medis */}
      {showReportModal && (
        <form onSubmit={handleAddReport} className="p-4 bg-[#0a192f] border border-[#1e3a5f] rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4" /> Input Laporan Evaluasi Klinis Medis
          </h4>
          <FieldGroup label="Jenis Laporan">
            <select className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100" value={jenisLaporan} onChange={e => setJenisLaporan(e.target.value as any)}>
              {JENIS_LAPORAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="Ringkasan Catatan Evaluasi Klinis Medis" required>
            <textarea className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100" rows={3} value={ringkasanKlinis} onChange={e => setRingkasanKlinis(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium cursor-pointer">Simpan Evaluasi Medis</button>
            <button type="button" className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowReportModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {/* List of Clinical Logs & Reports */}
      <div className="space-y-3">
        {monitoring.laporanKontrolList.map(laporan => (
          <div key={laporan.id} className="bg-[#0a192f] border border-[#1e3a5f] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InfoBadge label={laporan.jenisLaporan} color="blue" />
                {laporan.statusAdmin === 'terverifikasi' && <InfoBadge label="✓ Terverifikasi Medis" color="green" />}
              </div>
              <span className="text-xs text-slate-400 font-mono">{laporan.tanggalKegiatanSebenarnya}</span>
            </div>
            <p className="text-xs text-slate-200 bg-[#0b1b33] p-3 rounded-lg border border-[#1e3a5f]">{laporan.ringkasanAdministratif}</p>
            {laporan.catatanTelaahKlinis && (
              <div className="p-2.5 bg-purple-950/30 border border-purple-800/40 rounded-lg text-xs text-purple-200">
                <strong className="block text-purple-300 mb-0.5">Catatan Medis TAT:</strong>
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
  userRole: UserRole;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, userRole, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'aktual' | 'rencana'>('aktual');
  const [showSpModal, setShowSpModal] = useState(false);

  const [spTingkat, setSpTingkat] = useState('SP-1 (Peringatan Awal)');
  const [spAlasan, setSpAlasan] = useState('Terperiksa mangkir dalam jadwal kontrol / wajib lapor tanpa keterangan sah.');

  const [form, setForm] = useState<Partial<BuktiWajibLapor>>({
    tanggalRencanaWajibLapor: today(),
    tanggalPelaporanAktual: today(),
    kanal: 'langsung',
    statusKonfirmasi: 'dikonfirmasi_penyidik',
    diunggahOleh: 'Penyidik / JPU Pengaju Berwenang',
    namaPenyidikPenerima: 'Bripka Heru Susanto',
    instansiPenyidik: 'Satresnarkoba Polresta Samarinda',
    buktiPenerimaanUrl: 'https://e-tat.polri.go.id/docs/BUKTI-WAJIB-LAPOR-AKTUAL.pdf'
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
    <div className="space-y-5">
      <SectionHeader
        icon={<CheckSquare className="w-5 h-5 text-emerald-400" />}
        title="3. Jurnal Pengawasan & Catatan Wajib Lapor Penyidik"
        subtitle="Menu Pengaju (Penyidik/JPU Berwenang) untuk menginput tanggal kejadian aktual wajib lapor setelah dilaksanakan. Klien tidak perlu login."
      />

      {/* Notice Banner Rule JUKNIS */}
      <div className="bg-[#0b1d38] border border-blue-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-blue-400">
          <Info className="w-4 h-4 shrink-0" />
          <span>Aturan Pengisian Wajib Lapor (JUKNIS POLRI & BNN):</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
          <li><strong>Pengaju (Penyidik/JPU)</strong> mengisi <strong>Tanggal Pelaporan Aktual</strong> setelah wajib lapor benar-benar dilakukan menggunakan tanggal kejadian sebenarnya (bukan otomatis tanggal input).</li>
          <li><strong>Klien TIDAK PERLU login</strong> ke sistem e-TAT. Semua pelaporan dicatat oleh Penyidik/JPU penerima.</li>
          <li><strong>Sistem menyimpan waktu input secara terpisah</strong> untuk audit log dan verifikasi Admin Sekretariat TAT.</li>
          <li>Apabila baru menjadwalkan, pilih <strong>"Rencana Wajib Lapor"</strong> dan <u>jangan isi Tanggal Pelaporan Aktual</u>.</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => { setShowForm(true); setFormMode('aktual'); }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Catatan Wajib Lapor (Pelaporan Aktual)</span>
        </button>

        <button
          onClick={() => { setShowForm(true); setFormMode('rencana'); }}
          className="px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-blue-400 border border-[#234475] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>+ Buat Rencana Wajib Lapor (Jadwal)</span>
        </button>

        <button
          onClick={() => setShowSpModal(true)}
          className="px-4 py-2.5 bg-[#2d1217] hover:bg-[#3d181f] text-rose-400 border border-rose-900/60 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ml-auto"
        >
          <BadgeAlert className="w-4 h-4 text-rose-400" />
          <span>Terbitkan Surat Peringatan (SP)</span>
        </button>
      </div>

      {showSpModal && (
        <form onSubmit={handleIssueSp} className="p-4 bg-[#1f0f13] border border-rose-900/60 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <BadgeAlert className="w-4 h-4" /> Terbitkan Surat Peringatan Klien (SP)
          </h4>
          <FieldGroup label="Tingkat Surat Peringatan">
            <select className="w-full bg-[#2b1419] border border-rose-900/60 rounded-lg p-2 text-xs text-rose-100" value={spTingkat} onChange={e => setSpTingkat(e.target.value)}>
              <option value="SP-1 (Peringatan Awal)">SP-1 (Peringatan Awal - Mangkir 1x)</option>
              <option value="SP-2 (Peringatan Keras)">SP-2 (Peringatan Keras - Mangkir 2x)</option>
              <option value="SP-3 (Pencabutan Hak RJ)">SP-3 (Terakhir - Usulan Pencabutan Hak Restoratif Justice)</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Alasan Penerbitan SP" required>
            <textarea className="w-full bg-[#2b1419] border border-rose-900/60 rounded-lg p-2 text-xs text-rose-100" rows={2} value={spAlasan} onChange={e => setSpAlasan(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-medium cursor-pointer">Terbitkan SP</button>
            <button type="button" className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowSpModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {showForm && (
        <div className="p-5 bg-[#0a192f] border border-emerald-500/40 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              {formMode === 'aktual' ? 'Form Catatan Wajib Lapor (Pengaju/Penyidik)' : 'Form Rencana Wajib Lapor (Penjadwalan)'}
            </h4>
            <div className="flex bg-[#071322] p-1 rounded-lg border border-[#1e3a5f]">
              <button
                type="button"
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${formMode === 'aktual' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setFormMode('aktual')}
              >
                Pelaporan Aktual (Sudah Terjadi)
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${formMode === 'rencana' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setFormMode('rencana')}
              >
                Penjadwalan Rencana
              </button>
            </div>
          </div>

          {formMode === 'aktual' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Tanggal Pelaporan Aktual (Kejadian Sebenarnya)" required hint="Tanggal saat klien benar-benar hadir melaporkan diri">
                  <input
                    type="date"
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-emerald-500 outline-none"
                    value={form.tanggalPelaporanAktual ?? today()}
                    onChange={e => setF('tanggalPelaporanAktual', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Tanggal Rencana Semula (Opsional)" hint="Kosongkan atau isi jika ada jadwal sebelumnya">
                  <input
                    type="date"
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-blue-500 outline-none"
                    value={form.tanggalRencanaWajibLapor ?? ''}
                    onChange={e => setF('tanggalRencanaWajibLapor', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Penyidik / JPU Penerima" required hint="Penyidik/JPU yang menerima kehadiran klien">
                  <input
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                    placeholder="Nama & Pangkat Penyidik / JPU"
                    value={form.namaPenyidikPenerima ?? ''}
                    onChange={e => setF('namaPenyidikPenerima', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Instansi / Tempat Pelaporan" required hint="Misal: Satresnarkoba Polresta Samarinda">
                  <input
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                    value={form.instansiPenyidik ?? ''}
                    onChange={e => setF('instansiPenyidik', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Kanal Pelaporan" required>
                  <select
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                    value={form.kanal ?? 'langsung'}
                    onChange={e => setF('kanal', e.target.value as any)}
                  >
                    <option value="langsung">Tatap Muka / Datang Langsung ke Kantor Penyidik</option>
                    <option value="digital">Kanal Digital / Video Call Konfirmasi</option>
                    <option value="surat">Surat Keterangan Resmi dari Fasilitas Rehab</option>
                    <option value="melalui_pengaju">Melalui Pendampingan Pengaju</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="Bukti Pelaporan (Dokumen / Berkas Lampiran)" hint="Upload Berita Acara / Lembar Absensi / Foto">
                  <input
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 focus:border-emerald-500 outline-none"
                    placeholder="URL Bukti Pelaporan (PDF/JPG)"
                    value={form.buktiPenerimaanUrl ?? ''}
                    onChange={e => setF('buktiPenerimaanUrl', e.target.value)}
                  />
                </FieldGroup>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                ⚠️ <strong>Perhatian:</strong> Menjadwalkan Rencana Wajib Lapor. <u>Jangan mengisi Tanggal Pelaporan Aktual</u> sebelum kegiatan dilaksanakan secara nyata.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Rencana Wajib Lapor (Tanggal Target)" required hint="Tanggal rencana kedatangan terperiksa">
                  <input
                    type="date"
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-blue-500 outline-none"
                    value={form.tanggalRencanaWajibLapor ?? today()}
                    onChange={e => setF('tanggalRencanaWajibLapor', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Penyidik Target Penerima" required>
                  <input
                    className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    value={form.namaPenyidikPenerima ?? ''}
                    onChange={e => setF('namaPenyidikPenerima', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Instansi / Tempat Pelaporan">
                <input
                  className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-lg p-2 text-xs text-slate-100 focus:border-blue-500 outline-none"
                  value={form.instansiPenyidik ?? ''}
                  onChange={e => setF('instansiPenyidik', e.target.value)}
                />
              </FieldGroup>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-[#1e3a5f]">
            <button
              type="button"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
              onClick={handleSaveWajibLapor}
            >
              ✓ Simpan Catatan Wajib Lapor
            </button>
            <button
              type="button"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all cursor-pointer"
              onClick={() => setShowForm(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* List of Wajib Lapor Records */}
      <div className="space-y-3">
        {monitoring.buktiWajibLaporList.map(wl => {
          const isAktualExist = Boolean(wl.tanggalPelaporanAktual);

          return (
            <div key={wl.id} className="bg-[#0a192f] border border-[#1e3a5f] rounded-xl p-4.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e3a5f] pb-3">
                <div className="flex items-center gap-2">
                  {isAktualExist ? (
                    <InfoBadge label="✓ Pelaporan Aktual (Terlaksana)" color="green" />
                  ) : (
                    <InfoBadge label="📅 Rencana Wajib Lapor (Belum Aktual)" color="amber" />
                  )}
                  {wl.statusVerifikasiAdmin === 'terverifikasi' ? (
                    <InfoBadge label="✓ Verified Admin" color="green" />
                  ) : (
                    <InfoBadge label="⏳ Belum Diverifikasi Admin" color="slate" />
                  )}
                </div>

                <div className="text-right text-[11px] font-mono text-slate-400">
                  <span className="block text-slate-400">Waktu Input Sistem:</span>
                  <span className="text-cyan-300 font-semibold">{wl.waktuInputSistem || wl.tanggalDiunggah || 'Sistem e-TAT Logged'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#0b1b33] p-2.5 rounded-lg border border-[#1e3a5f]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal Pelaporan Aktual</span>
                  <span className={`font-mono font-bold text-sm mt-0.5 block ${isAktualExist ? 'text-emerald-400' : 'text-slate-400 italic'}`}>
                    {wl.tanggalPelaporanAktual ? wl.tanggalPelaporanAktual : '— (Belum diisi)'}
                  </span>
                </div>

                <div className="bg-[#0b1b33] p-2.5 rounded-lg border border-[#1e3a5f]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Rencana Wajib Lapor</span>
                  <span className="font-mono text-slate-200 text-sm mt-0.5 block">
                    {wl.tanggalRencanaWajibLapor || wl.tanggalWajibLapor}
                  </span>
                </div>

                <div className="bg-[#0b1b33] p-2.5 rounded-lg border border-[#1e3a5f]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Penyidik / JPU Penerima</span>
                  <span className="font-semibold text-slate-100 mt-0.5 block">{wl.namaPenyidikPenerima}</span>
                </div>

                <div className="bg-[#0b1b33] p-2.5 rounded-lg border border-[#1e3a5f]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Instansi / Tempat / Kanal</span>
                  <span className="text-slate-300 capitalize mt-0.5 block">{wl.instansiPenyidik} ({wl.kanal})</span>
                </div>
              </div>

              {/* Bukti & Admin Verification Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="flex items-center gap-3">
                  {wl.buktiPenerimaanUrl && (
                    <a
                      href={wl.buktiPenerimaanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 bg-[#0e223f] px-3 py-1.5 rounded-lg border border-[#234475]"
                    >
                      <FileText className="w-3.5 h-3.5" /> Berkas Bukti Pelaporan <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <span className="text-[11px] text-slate-400">Dicatat oleh: <strong className="text-slate-300">{wl.diunggahOleh}</strong></span>
                </div>

                {userRole === 'ADMIN' && wl.statusVerifikasiAdmin !== 'terverifikasi' && (
                  <button
                    onClick={() => handleVerifyAdmin(wl.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verifikasi Pencatatan Ini (Admin)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
  onUpdate: (updated: MonitoringTindakLanjut) => void;
}> = ({ monitoring, permohonan, userRole, onUpdate }) => {
  const existing = monitoring.akhirLayanan;
  const [showCertPreview, setShowCertPreview] = useState(false);

  const [form, setForm] = useState<Partial<AkhirLayananRehab>>(existing ?? {
    tanggalAkhirLayananAktual: today(),
    statusAkhir: 'selesai_program',
    hasilSesuaiDokumenFasilitas: 'Terperiksa menyelesaikan seluruh tahapan terapi rehabilitasi dengan evaluasi Pulih & Produktif.',
    namaFasilitas: monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Tanah Merah',
    pihakPenerbitKeterangan: 'dr. Rina Lestari, Sp.KJ',
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
      pihakPenerbitKeterangan: form.pihakPenerbitKeterangan ?? 'dr. Rina Lestari, Sp.KJ',
      fileSuratAkhirLayananUrl: form.fileSuratAkhirLayananUrl || 'https://e-tat.polri.go.id/docs/SURAT-SELESAI-REHAB.pdf',
      diisiOleh: userRole,
      kapasitasPengisi: 'Dokter / DPJP',
      tanggalDiisi: today(),
      statusVerifikasiAdmin: 'terverifikasi',
    };
    onUpdate({ ...monitoring, akhirLayanan: saved, statusMonitoring: 'selesai', terakhirDiperbarui: today() });
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={<Award className="w-5 h-5 text-emerald-400" />}
        title="4. Output Resmi: Surat Keterangan Selesai Rehabilitasi (SKSR)"
        subtitle="Dokumen hasil pengeluaran resmi e-TAT yang memuat predikat kelulusan rehabilitasi, rekam uji toksikologi, dan rekomendasi status hukum."
      />

      {/* Output Document Preview & Action Card */}
      <div className="bg-[#0a192f] border border-emerald-500/30 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e3a5f]">
          <div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-100">Surat Keterangan Selesai Rehabilitasi (SKSR) e-TAT</h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Dokumen ber-QR Code resmi siap diterbitkan dan dicetak untuk kepentingan penyidikan & peradilan.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCertPreview(!showCertPreview)}
              className="px-4 py-2 bg-[#1652f0] hover:bg-[#1347d3] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>{showCertPreview ? 'Sembunyikan Surat' : 'Pratinjau & Cetak Surat SKSR'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Live Certificate Preview Document */}
        {showCertPreview && (
          <div className="bg-slate-100 text-slate-900 p-8 rounded-xl shadow-2xl font-serif max-w-3xl mx-auto space-y-6 text-xs leading-relaxed border-4 border-slate-300">
            {/* Kop Surat Resmi Kedinasan */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
              <h2 className="text-sm font-extrabold tracking-wide uppercase font-sans text-slate-900">TIM ASESMEN TERPADU (TAT) NARKOTIKA</h2>
              <p className="text-[11px] font-sans font-semibold text-slate-700">POLRESTsamarinda / BNN PROVINSI KALIMANTAN TIMUR</p>
              <p className="text-[10px] font-sans text-slate-600">Alamat: Jl. Slamet Riyadi No. 1, Samarinda • Hotline e-TAT: (0541) 743201</p>
            </div>

            <div className="text-center font-sans">
              <h3 className="text-xs font-bold underline uppercase tracking-wider">SURAT KETERANGAN SELESAI REHABILITASI (SKSR)</h3>
              <p className="text-[11px] text-slate-700 font-mono mt-0.5">Nomor: SKSR/TAT/2026/09/{permohonan.id.slice(-4)}</p>
            </div>

            <p className="font-sans">Ketua Tim Asesmen Terpadu (TAT) berdasarkan evaluasi klinis tim medis dan pengawasan tim hukum menerangkan bahwa:</p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 font-sans space-y-1.5 text-[11px]">
              <div className="grid grid-cols-3"><span className="font-semibold">Nama Terperiksa</span><span>: {permohonan.terperiksa.namaTerperiksa}</span></div>
              <div className="grid grid-cols-3"><span className="font-semibold">NIK / Usia</span><span>: {permohonan.terperiksa.nik || '64720109880001'} / {permohonan.terperiksa.usia} Tahun</span></div>
              <div className="grid grid-cols-3"><span className="font-semibold">Instansi Pengaju</span><span>: {permohonan.instansiPengaju}</span></div>
              <div className="grid grid-cols-3"><span className="font-semibold">Fasilitas Rehabilitasi</span><span>: {monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehab BNN Tanah Merah'}</span></div>
              <div className="grid grid-cols-3"><span className="font-semibold">Dokter DPJP Medis</span><span>: {monitoring.pelaksanaanRehab?.namaPenanggungJawabFasilitas || 'dr. Rina Lestari, Sp.KJ'}</span></div>
            </div>

            <div className="space-y-2 font-sans">
              <h4 className="font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase text-[10px]">HASIL EVALUASI KLINIS & KEHADIRAN:</h4>
              <p className="text-slate-800">{form.hasilSesuaiDokumenFasilitas}</p>
              <div className="flex gap-4 font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200 text-[11px]">
                <span>✓ Status Toksikologi: BEBAS ZAT (NEGATIF)</span>
                <span>• Predikat: PULIH & PRODUKTIF</span>
              </div>
            </div>

            <div className="space-y-1 font-sans">
              <h4 className="font-bold text-slate-900 uppercase text-[10px]">REKOMENDASI STATUS HUKUM:</h4>
              <p className="text-slate-800">Menyelesaikan kewajiban rehabilitasi secara penuh. Direkomendasikan mempertahankan hak Restoratif Justice (RJ) / Keterangan Selesai untuk pertimbangan Hakim.</p>
            </div>

            {/* Signature Block */}
            <div className="flex justify-between items-end pt-6 font-sans">
              <div className="text-center space-y-1">
                <QrCode className="w-14 h-14 mx-auto text-slate-800" />
                <p className="text-[9px] text-slate-500 font-mono">Verifikasi Resmi e-TAT QR Code</p>
              </div>
              <div className="text-center space-y-12">
                <div>
                  <p className="text-[10px] text-slate-600">Samarinda, {today()}</p>
                  <p className="font-bold text-slate-900 text-[11px]">Ketua Tim Asesmen Terpadu (TAT)</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline text-[11px]">KOMBES POL AHMAD RIFA'I, S.I.K.</p>
                  <p className="text-[10px] text-slate-600">NRP. 75080912</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Form for Output Generation */}
        <div className="space-y-3 pt-2">
          <FieldGroup label="Ringkasan Hasil Evaluasi Selesai Rehabilitasi" required>
            <textarea className="w-full bg-[#0b1b33] border border-[#1e3a5f] rounded-xl p-3 text-xs text-slate-100 focus:border-blue-500 outline-none" rows={3} value={form.hasilSesuaiDokumenFasilitas ?? ''} onChange={e => setF('hasilSesuaiDokumenFasilitas', e.target.value)} />
          </FieldGroup>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg" onClick={handleSave}>
            <Check className="w-4 h-4" /> Simpan & Finalkan Output Surat SKSR
          </button>
        </div>
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

  const handleMonitoringUpdate = (updated: MonitoringTindakLanjut) => {
    setMonitoring(updated);
    onUpdatePermohonan({ ...permohonan, monitoringTindakLanjut: updated });
  };

  const statusMonitoringColors: Record<MonitoringTindakLanjut['statusMonitoring'], 'slate' | 'blue' | 'green' | 'amber' | 'red'> = {
    menunggu_pelaksanaan: 'amber',
    berjalan: 'blue',
    terkendala: 'red',
    selesai: 'green',
    tidak_terlaksana: 'slate',
  };

  const tabs = [
    { id: 'pelaksanaan' as const, label: '1. Input Admisi Medis', icon: <Building2 className="w-4 h-4" /> },
    { id: 'laporan' as const, label: '2. Input Evaluasi & Urin', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'wajib_lapor' as const, label: '3. Jurnal & Wajib Lapor', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'akhir' as const, label: '4. Output Surat SKSR', icon: <Award className="w-4 h-4" /> },
  ];

  const progress = {
    pelaksanaan: !!monitoring.pelaksanaanRehab,
    laporan: monitoring.laporanKontrolList.length > 0,
    wajib_lapor: monitoring.buktiWajibLaporList.length > 0,
    akhir: !!monitoring.akhirLayanan,
  };

  return (
    <div className="space-y-5 text-slate-100 font-sans">
      {/* Integrated Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1f385c]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-[#142642] hover:bg-[#1b3459] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-[#234475] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-extrabold text-slate-100 tracking-tight">Tindak Lanjut & Monitoring Rehabilitasi</h1>
              <InfoBadge
                label={STATUS_MONITORING_LABELS[monitoring.statusMonitoring]}
                color={statusMonitoringColors[monitoring.statusMonitoring]}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="font-mono bg-[#0f233f] text-[#38bdf8] border border-[#234475] px-2 py-0.5 rounded font-medium">{permohonan.nomorPermohonan}</span>
              <span>•</span>
              <strong className="text-slate-200">{permohonan.terperiksa.namaTerperiksa}</strong>
              <span>•</span>
              <span>Instansi: {permohonan.instansiPengaju}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Live Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#0a192f] border border-[#1e3a5f] rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Sesi Kontrol Medis</span>
          <span className="text-lg font-extrabold text-[#38bdf8] block">12 / 12 Sesi Selesai (100%)</span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">✓ Bebas Absen Mangkir</span>
        </div>
        <div className="bg-[#0a192f] border border-[#1e3a5f] rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Hasil Toksikologi Urin</span>
          <span className="text-lg font-extrabold text-emerald-400 block">3x Uji NEGATIF</span>
          <span className="text-[11px] text-slate-400">Non-Reaktif (AMP, MET, THC, BZO)</span>
        </div>
        <div className="bg-[#0a192f] border border-[#1e3a5f] rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Predikat Kelulusan</span>
          <span className="text-lg font-extrabold text-purple-400 block">Sangat Baik (Pulih)</span>
          <span className="text-[11px] text-purple-300">Rekomendasi Surat SKSR Diterbitkan</span>
        </div>
      </div>

      {/* JUKNIS Guidance Banner */}
      <div className="bg-[#0f233f] border border-[#234475] rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#7dd3fc]">
        <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Alur Kerja Input & Output Medis JUKNIS:</strong> Tim Medis DPJP menginput rekam medis admisi, hasil uji tes urin toksikologi berkala, serta catatan perkembangan medis. Sistem e-TAT secara otomatis merekam progres dan menghasilkan **Output Resmi Surat Keterangan Selesai Rehabilitasi (SKSR)** ber-QR Code untuk peradilan.
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {tabs.map((tab) => {
          const isDone = progress[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-[#1652f0] border-[#38bdf8] text-white shadow-lg font-semibold'
                  : isDone
                  ? 'bg-[#0a192f] border-[#1e3a5f] text-emerald-400 hover:bg-[#0f233f]'
                  : 'bg-[#0a192f] border-[#1e3a5f] text-slate-400 hover:bg-[#0f233f] hover:text-slate-200'
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
      <div className="pt-2">
        {activeTab === 'pelaksanaan' && (
          <PelaksanaanRehabSection monitoring={monitoring} userRole={currentUser.role} onUpdate={handleMonitoringUpdate} />
        )}
        {activeTab === 'laporan' && (
          <EvaluasiKlinisSection monitoring={monitoring} userRole={currentUser.role} onUpdate={handleMonitoringUpdate} />
        )}
        {activeTab === 'wajib_lapor' && (
          <WajibLaporSection monitoring={monitoring} userRole={currentUser.role} onUpdate={handleMonitoringUpdate} />
        )}
        {activeTab === 'akhir' && (
          <AkhirLayananSection monitoring={monitoring} permohonan={permohonan} userRole={currentUser.role} onUpdate={handleMonitoringUpdate} />
        )}
      </div>
    </div>
  );
};

export default TindakLanjutDetailView;
