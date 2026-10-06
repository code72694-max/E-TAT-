import React, { useState } from 'react';
import { PermohonanAsesmen } from '../types';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  Stethoscope,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Scale,
  Building2,
  Award,
  ChevronRight,
  FileCheck2,
  Users,
  Check,
  Activity,
  History
} from 'lucide-react';

interface JadwalKlienDetailViewProps {
  scheduleId: string;
  permohonan: PermohonanAsesmen;
  onBack: () => void;
}

export const JadwalKlienDetailView: React.FC<JadwalKlienDetailViewProps> = ({
  scheduleId,
  permohonan,
  onBack
}) => {
  // Tab 1 is default: 'detail' (Detail Jadwal & Data Klien), Tab 2: 'riwayat' (Riwayat Proses e-TAT)
  const [activeTab, setActiveTab] = useState<'detail' | 'riwayat'>('detail');

  // Form state
  const [tglAktual, setTglAktual] = useState(new Date().toISOString().slice(0, 10));
  const [statusPelaksanaan, setStatusPelaksanaan] = useState('terlaksana');
  const [catatanEvaluasi, setCatatanEvaluasi] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Determine if it's Wajib Lapor or Kontrol Medis
  const isWajibLapor = !scheduleId.startsWith('kontrol-');
  
  let scheduleData = null;
  if (isWajibLapor) {
    const wl = permohonan.monitoringTindakLanjut?.buktiWajibLaporList?.find(w => w.id === scheduleId);
    if (wl) {
      scheduleData = {
        id: wl.id,
        jenisKegiatan: 'Wajib Lapor',
        detailKegiatan: wl.kegiatanRehabTerkait || 'Wajib Lapor Rutin Penyidik',
        tanggalRencana: wl.tanggalRencanaWajibLapor,
        lokasi: wl.instansiPenyidik,
        penanggungJawab: wl.namaPenyidikPenerima,
        status: wl.statusKonfirmasi,
      };
    }
  } else {
    scheduleData = {
      id: scheduleId,
      jenisKegiatan: 'Kontrol Medis',
      detailKegiatan: permohonan.pengawasanKlien?.catatanKontrolBerikutnya || 'Kontrol Medis & Konseling Berkala',
      tanggalRencana: permohonan.pengawasanKlien?.tanggalKontrolBerikutnya,
      lokasi: permohonan.pengawasanKlien?.instansiPelaksanaRehab,
      penanggungJawab: permohonan.pengawasanKlien?.konselorPendamping || 'Konselor / DPJP Balai Rehab',
      status: 'terjadwal',
    };
  }

  // Generate complete chronological stages of this case
  const timelineStages = [
    {
      step: 1,
      title: 'Pendaftaran & Pengajuan Permohonan Asesmen',
      subtitle: 'Penyerahan berkas perkara oleh Kasat/Kanit Penyidik ke Sekretariat TAT',
      tanggal: permohonan.tanggalPermohonan || permohonan.tanggalPengajuan || '10 September 2026',
      petugas: `${permohonan.instansiPengaju} — Penyidik: ${permohonan.pengajuNama || 'Bripka Heru Susanto'}`,
      status: 'Selesai',
      isCompleted: true,
      icon: <FileText className="w-4 h-4 text-slate-300" />,
      details: [
        `Nomor Permohonan: ${permohonan.nomorPermohonan}`,
        `Nomor Laporan Polisi: ${permohonan.perkara?.nomorLaporanPolisi || 'LP/A/142/IX/2026/SPKT.SATRESNARKOBA'}`,
        `Pasal Sangkaan: ${permohonan.perkara?.pasalDipersangkakan || 'Pasal 127 ayat (1) UU RI No. 35 Tahun 2009'}`,
        `Barang Bukti Sitaan: ${permohonan.perkara?.barangBuktiText || '0.38 gram Metamfetamina'}`
      ]
    },
    {
      step: 2,
      title: 'Verifikasi Berkas & Admisi Sekretariat TAT',
      subtitle: 'Pemeriksaan kelengkapan administrasi dan legalitas persyaratan formal',
      tanggal: permohonan.verifikasiBerkas?.tanggalVerifikasi || '11 September 2026',
      petugas: 'Bripka Tri Wahyudi (Admin Sekretariat TAT Polresta)',
      status: 'Memenuhi Syarat (MS)',
      isCompleted: true,
      icon: <ShieldCheck className="w-4 h-4 text-slate-300" />,
      details: [
        'Surat Pengantar Permohonan Resmi: Sah & Terdaftar',
        'Berita Acara Penangkapan & Penyitaan: Lengkap',
        'Surat Hasil Uji Lab Toksikologi Awal: Positif Zat Narkotika (Urin)',
        'Status Verifikasi: Lolos Verifikasi Administrasi'
      ]
    },
    {
      step: 3,
      title: 'Pelaksanaan Asesmen Medis & Psikiatri',
      subtitle: 'Pemeriksaan komprehensif tingkat keparahan adiksi dan status klinis terperiksa',
      tanggal: permohonan.asesmenMedis?.tanggal || '12 September 2026',
      petugas: 'dr. Rina Lestari, Sp.KJ (Dokter Spesialis Kedokteran Jiwa / Tim Medis TAT)',
      status: 'Selesai & Direkomendasikan',
      isCompleted: true,
      icon: <Stethoscope className="w-4 h-4 text-slate-300" />,
      details: [
        `Diagnosa Ketergantungan: ${permohonan.asesmenMedis?.diagnosis || 'F15.2 (Ketergantungan Stimulan Sedang-Berat)'}`,
        `Skor WHO-ASSIST: Skor 24 (Kategori Penggunaan Berisiko Sedang)`,
        `Rekomendasi Layanan Medis: ${permohonan.asesmenMedis?.kebutuhanRawat || 'Rehabilitasi Rawat Inap 3 Bulan'}`,
        'Kondisi Fisik & Psikis: Tidak ditemukan gangguan komorbiditas berat'
      ]
    },
    {
      step: 4,
      title: 'Pelaksanaan Asesmen Hukum & Profil Kriminalitas',
      subtitle: 'Pendalaman peran tersangka, rekam jejak kriminal, dan jaringan peredaran',
      tanggal: permohonan.asesmenHukum?.tanggal || '12 September 2026',
      petugas: 'Kompol Susanto, S.H. (Penyidik Hukum Ditresnarkoba / Tim Hukum TAT)',
      status: 'Selesai & Clear',
      isCompleted: true,
      icon: <Scale className="w-4 h-4 text-slate-300" />,
      details: [
        'Kategori Pelaku: Korban Penyalahgunaan Narkotika (Bukan Bandar/Pengedar)',
        'Keterlibatan Sindikat: Tidak terafiliasi dengan jaringan peredaran gelap',
        'Riwayat Residivisme: Pelaku Pertama Kali (Non-Residivis)',
        'Rekomendasi Hukum: Memenuhi syarat penyelesaian perkara melalui Restorative Justice (RJ)'
      ]
    },
    {
      step: 5,
      title: 'Sidang Pleno Terpadu (TAT) & Rekomendasi Bersama',
      subtitle: 'Musyawarah pleno tim medis, tim hukum, dan kejaksaan untuk penetapan rekomendasi',
      tanggal: permohonan.plenoAssesmen?.tanggalPleno || '14 September 2026',
      petugas: 'Ketua Tim Asesmen Terpadu & Anggota Tim Panel Pleno TAT',
      status: 'Pleno Selesai Mufakat',
      isCompleted: true,
      icon: <Users className="w-4 h-4 text-slate-300" />,
      details: [
        'Hasil Sidang: Mufakat bulat merekomendasikan rehabilitasi medis dan sosial',
        `Kebutuhan Rehabilitasi: ${permohonan.asesmenMedis?.kebutuhanRawat || 'Rawat Inap'} di Fasilitas Rujukan Mitra Resmi`,
        'Penetapan Rencana Pengawasan: Sesi Kontrol Rutin + Wajib Lapor Mingguan ke Penyidik',
        'Status Pleno: Rekomendasi Disahkan Tim Ahli'
      ]
    },
    {
      step: 6,
      title: 'Pengesahan Surat Rekomendasi Resmi TAT',
      subtitle: 'Penerbitan surat keputusan hasil asesmen resmi bertandatangan digital kedinasan',
      tanggal: permohonan.rekomendasiResmi?.tanggalSurat || '15 September 2026',
      petugas: 'KOMBES POL AHMAD RIFA\'I, S.I.K. (Ketua Tim Asesmen Terpadu)',
      status: 'Surat Terbit & Sah',
      isCompleted: true,
      icon: <Award className="w-4 h-4 text-slate-300" />,
      details: [
        `Nomor Surat: ${permohonan.rekomendasiResmi?.nomorSurat || 'REK-TAT/2026/09/' + permohonan.id.slice(-4)}`,
        'Verifikasi QR Code Kedinasan: Aktif & Tervalidasi',
        'Surat Diteruskan Kepada: Penyidik Satresnarkoba, Kejaksaan Negeri, dan Fasilitas Rehab',
        'Status Berkas: Berkas Rekomendasi Resmi Selesai'
      ]
    },
    {
      step: 7,
      title: 'Admisi & Serah Terima ke Fasilitas Rehabilitasi',
      subtitle: 'Penyerahan terperiksa ke lembaga rehabilitasi rujukan dengan Berita Acara resmi',
      tanggal: permohonan.monitoringTindakLanjut?.pelaksanaanRehab?.tanggalMasukLayananTerkonfirmasi || permohonan.pengawasanKlien?.tanggalMulai || '16 September 2026',
      petugas: `${permohonan.monitoringTindakLanjut?.pelaksanaanRehab?.namaFasilitasTujuan || permohonan.pengawasanKlien?.instansiPelaksanaRehab || 'Balai Rehabilitasi BNN Tanah Merah'}`,
      status: 'Klien Masuk Layanan',
      isCompleted: true,
      icon: <Building2 className="w-4 h-4 text-slate-300" />,
      details: [
        `Fasilitas Pelaksana: ${permohonan.monitoringTindakLanjut?.pelaksanaanRehab?.namaFasilitasTujuan || permohonan.pengawasanKlien?.instansiPelaksanaRehab || 'Balai Rehabilitasi BNN Tanah Merah'}`,
        'Penanggung Jawab Fasilitas: dr. Rina Lestari, Sp.KJ (DPJP Balai Rehab)',
        'Dokumen Berita Acara: BA Serah Terima Klien Terlampir Lengkap',
        'Status Registrasi Rehab: Pasien Aktif Terdaftar'
      ]
    },
    {
      step: 8,
      title: 'Pengawasan, Kontrol Medis & Wajib Lapor Berkala',
      subtitle: 'Monitoring kehadiran sesi terapi, evaluasi klinis DPJP, dan skrining tes urin berkala',
      tanggal: 'September 2026 — Berjalan Aktif',
      petugas: `Penyidik Pengawas & Konselor Pendamping (${permohonan.instansiPengaju})`,
      status: 'Tahap Berjalan (Aktif)',
      isCompleted: true,
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      details: [
        `Progress Sesi Kontrol: ${permohonan.pengawasanKlien?.sesiTerselesaikan || 12} dari ${permohonan.pengawasanKlien?.totalSesiWajib || 12} Sesi Diselesaikan`,
        'Uji Toksikologi Urin: 3x Pemeriksaan Berkala Seluruhnya Non-Reaktif (Negatif)',
        'Kepatuhan Wajib Lapor: Sangat Patuh (Nihil Mangkir / Absen Izin Sah)',
        'Status Pengawasan: Dalam Pengawasan Disiplin'
      ]
    },
    {
      step: 9,
      title: 'Penerbitan Surat Keterangan Selesai Rehabilitasi (SKSR)',
      subtitle: 'Kelulusan program rehabilitasi dan rekomendasi final penyelesaian hukum perkara',
      tanggal: permohonan.monitoringTindakLanjut?.akhirLayanan?.tanggalAkhirLayananAktual || 'Tahap Akhir',
      petugas: 'Ketua Tim Asesmen Terpadu & DPJP Fasilitas',
      status: permohonan.monitoringTindakLanjut?.akhirLayanan ? 'Lulus Program' : 'Siap Terbit',
      isCompleted: !!permohonan.monitoringTindakLanjut?.akhirLayanan,
      icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
      details: [
        'Predikat Evaluasi: Pulih, Mandiri & Produktif',
        'Hasil Akhir Toksikologi: Bebas Zat Narkotika (Clean)',
        'Rekomendasi Hukum Akhir: Memenuhi syarat penyelesaian penghentian penuntutan / Vonis Rehab',
        'Dokumen: SKSR Siap Dicetak untuk Kejaksaan & Pengadilan'
      ]
    }
  ];

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
  };

  return (
    <div className="space-y-4 text-slate-100 font-sans">
      {/* Top Header Row with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>Detail Jadwal &amp; Riwayat e-TAT Terperiksa</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen pelaporan jadwal kontrol/lapor dan kronologi tahapan proses penanganan e-TAT.
          </p>
        </div>

        {/* Tab Navigation (Tab 1: Detail Jadwal & Data Klien, Tab 2: Riwayat e-TAT) */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('detail')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'detail'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>1. Detail Data &amp; Jadwal Lapor</span>
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'riwayat'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>2. Riwayat Proses e-TAT</span>
          </button>
        </div>
      </div>

      {/* Summary Client Card Banner */}
      <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-200 font-bold text-sm shrink-0">
              {permohonan.terperiksa.namaLengkap.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">{permohonan.terperiksa.namaLengkap}</h2>
                <span className="font-mono text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {permohonan.nomorPermohonan}
                </span>
                <span className="text-[11px] bg-slate-800/80 text-emerald-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Sidang Pleno Selesai
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mt-1">
                <span>NIK: <strong className="text-slate-300 font-mono font-normal">{permohonan.terperiksa.nik || '-'}</strong></span>
                <span>•</span>
                <span>Usia: <strong className="text-slate-300 font-normal">{permohonan.terperiksa.usia} Tahun</strong></span>
                <span>•</span>
                <span>Instansi Pengaju: <strong className="text-slate-300 font-normal">{permohonan.instansiPengaju}</strong></span>
              </div>
            </div>
          </div>

          {scheduleData && (
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 text-xs">
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Jadwal Aktif</span>
                <span className="text-slate-200 font-medium">{scheduleData.jenisKegiatan} — {scheduleData.tanggalRencana}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: DETAIL JADWAL, DATA KLIEN & FORMULIR LAPORAN */}
      {activeTab === 'detail' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Detail Data Klien & Jadwal */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Identitas &amp; Perkara Terperiksa</span>
              </h3>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Nama Lengkap</span>
                  <span className="text-slate-200 font-medium">{permohonan.terperiksa.namaLengkap}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">NIK Terverifikasi</span>
                  <span className="font-mono text-slate-200">{permohonan.terperiksa.nik || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Nomor Rekomendasi TAT</span>
                  <span className="font-mono text-slate-300">{permohonan.rekomendasiResmi?.nomorSurat || 'REK-TAT/2026/09/' + permohonan.id.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Laporan Polisi (LP)</span>
                  <span className="font-mono text-slate-300">{permohonan.perkara?.nomorLaporanPolisi || 'LP/A/142/IX/2026/SPKT.SATRESNARKOBA'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Informasi Rencana Lapor / Kontrol</span>
              </h3>
              
              {scheduleData && (
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Jenis Kegiatan</span>
                    <span className="text-slate-200 font-medium">{scheduleData.jenisKegiatan}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Rencana Tanggal Lapor</span>
                    <span className="font-mono text-slate-100 font-bold">{scheduleData.tanggalRencana}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Tempat / Instansi Pelaporan</span>
                    <span className="text-slate-300">{scheduleData.lokasi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Penyidik / Petugas Penerima</span>
                    <span className="text-slate-300">{scheduleData.penanggungJawab}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Keterangan / Rencana Kegiatan</span>
                    <span className="text-slate-300">{scheduleData.detailKegiatan}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form Update Pelaksanaan */}
          <div className="lg:col-span-2 space-y-3">
            <form onSubmit={handleSaveReport} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-slate-400" />
                  <span>Formulir Pelaporan Pelaksanaan Jadwal</span>
                </h3>
                {isSaved && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Laporan Tersimpan
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tanggal Pelaksanaan Aktual (Realisasi)</label>
                  <input
                    type="date"
                    value={tglAktual}
                    onChange={(e) => setTglAktual(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-slate-600 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Status Kehadiran &amp; Pelaksanaan</label>
                  <select
                    value={statusPelaksanaan}
                    onChange={(e) => setStatusPelaksanaan(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-slate-600"
                  >
                    <option value="terlaksana">Hadir &amp; Terlaksana Penuh</option>
                    <option value="terlaksana_sebagian">Terlaksana Sebagian</option>
                    <option value="izin_sah">Izin Sakit / Keterangan Sah</option>
                    <option value="tidak_terlaksana">Tidak Hadir / Mangkir</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-medium">Catatan Hasil &amp; Evaluasi Pelaksanaan</label>
                <textarea
                  rows={4}
                  value={catatanEvaluasi}
                  onChange={(e) => setCatatanEvaluasi(e.target.value)}
                  placeholder="Klien hadir tepat waktu, menjalani sesi konseling dengan kooperatif dan hasil uji tes urin negatif..."
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-slate-600 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 text-xs font-medium rounded-lg transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Laporan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: FULL KRONOLOGI RIWAYAT e-TAT */}
      {activeTab === 'riwayat' && (
        <div className="space-y-3">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <span>Kronologi &amp; Riwayat Proses Penanganan e-TAT (Dari Pendaftaran Sampai Selesai)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Rekam jejak setiap tahapan hukum dan medis yang telah dilalui klien terperiksa.
              </p>
            </div>

            {/* Timeline Stepper */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {timelineStages.map((stage) => (
                <div key={stage.step} className="relative group">
                  {/* Step bullet */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 group-hover:border-slate-500 transition-colors">
                    {stage.step}
                  </div>

                  {/* Step Card Content */}
                  <div className="bg-slate-950/50 hover:bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/90 rounded-xl p-3.5 sm:p-4 transition-all space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
                          {stage.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-100">{stage.title}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{stage.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {stage.tanggal}
                        </span>
                        <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {stage.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      <span className="text-[11px] text-slate-500 block mb-1">Aktor / Pejabat Penanggung Jawab: <strong className="text-slate-300 font-normal">{stage.petugas}</strong></span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                        {stage.details.map((det, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-1.5 text-slate-300 bg-slate-900/40 px-2.5 py-1 rounded border border-slate-800/60">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{det}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalKlienDetailView;
