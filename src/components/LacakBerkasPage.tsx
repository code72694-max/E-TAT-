import React, { useState } from 'react';
import { PermohonanAsesmen } from '../types';
import { PublicHeader } from './PublicHeader';
import { BeritaAcaraModal } from './BeritaAcaraModal';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSignature,
  ArrowRight,
  Printer,
  ChevronRight,
  ShieldCheck,
  X,
  FileText,
  User,
  Building2,
  Calendar,
  ExternalLink,
  Info,
  Stethoscope,
  Scale,
  Users
} from 'lucide-react';

interface LacakBerkasPageProps {
  permohonanList: PermohonanAsesmen[];
  onGoToLanding: (sectionId?: string) => void;
  onGoToLogin: () => void;
  onGoToRegister?: () => void;
  onOpenPermohonanDetail: (id: string) => void;
}

export const LacakBerkasPage: React.FC<LacakBerkasPageProps> = ({
  permohonanList,
  onGoToLanding,
  onGoToLogin,
  onGoToRegister,
  onOpenPermohonanDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('TAT-074');
  const [searchedPermohonan, setSearchedPermohonan] = useState<PermohonanAsesmen | null>(
    permohonanList.find(p => p.nomorPermohonan.includes('074')) || permohonanList[0] || null
  );
  const [hasSearched, setHasSearched] = useState(true);
  const [selectedStepModal, setSelectedStepModal] = useState<number | null>(null);
  const [showBAModal, setShowBAModal] = useState(false);

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
        (p.terperiksa.nik && p.terperiksa.nik.includes(q))
    );

    setSearchedPermohonan(found || null);
    setHasSearched(true);
    setSelectedStepModal(null);
  };

  const selectSample = (num: string) => {
    setSearchQuery(num);
    const found = permohonanList.find(p => p.nomorPermohonan.includes(num.replace('TAT-', '')));
    setSearchedPermohonan(found || null);
    setHasSearched(true);
    setSelectedStepModal(null);
  };

  // Stepper calculations
  const getStepStatus = (p: PermohonanAsesmen, stepIndex: number) => {
    const mainStatus = p.statusProsesUtama;
    const stepOrder = [
      ['diajukan', 'menunggu_verifikasi'],
      ['verifikasi_berkas', 'perlu_perbaikan', 'diterima_lengkap'],
      ['proses_asesmen', 'asesmen_berlangsung', 'medis_selesai', 'hukum_selesai'],
      ['siap_pleno', 'pembahasan_pleno', 'pleno_selesai'],
      ['pengesahan_rekomendasi', 'rekomendasi_terbit'],
      ['selesai_tindak_lanjut']
    ];

    const currentStepIndex = stepOrder.findIndex(arr => arr.includes(mainStatus));
    if (currentStepIndex === -1) {
      if (mainStatus === 'rekomendasi_terbit' || mainStatus === 'selesai_tindak_lanjut') {
        return stepIndex <= 4 ? 'completed' : stepIndex === 5 && mainStatus === 'selesai_tindak_lanjut' ? 'completed' : 'current';
      }
      return 'pending';
    }

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  // Step Detail Checklist Content
  const getStepDetailData = (stepNumber: number, p: PermohonanAsesmen) => {
    const st = getStepStatus(p, stepNumber - 1);
    switch (stepNumber) {
      case 1:
        return {
          title: 'Langkah 1: Registrasi & Pendaftaran Perkara',
          subtitle: 'Penyerahan Berkas Perkara oleh Penyidik ke Sekretariat TAT',
          status: st,
          pj: `${p.instansiPengaju} (Penyidik: ${p.pengajuNama})`,
          timestamp: p.tanggalPengajuan,
          items: [
            { label: 'Surat Permohonan Asesmen Resmi dari Kasat/Kanit Penyidik', checked: true },
            { label: `Laporan Polisi: ${p.perkara?.nomorLaporanPolisi || '-'}`, checked: true },
            { label: `Data Pokok Terperiksa: ${p.terperiksa.namaLengkap} (${p.terperiksa.usia} Th / ${p.terperiksa.jenisKelamin})`, checked: true },
            { label: `Pasal Sangkaan: ${p.perkara?.pasalDipersangkakan || '-'}`, checked: true },
            { label: `Wali / Pendamping: ${p.terperiksa.namaWaliPendamping || 'Terdaftar'}`, checked: true }
          ]
        };
      case 2:
        return {
          title: 'Langkah 2: Verifikasi Administrasi Berkas',
          subtitle: 'Pemeriksaan Keabsahan 7 Berkas Formil oleh Sekretariat TAT',
          status: st,
          pj: 'Sekretariat TAT BNNP Kaltim',
          timestamp: st === 'completed' ? '8 September 2026 10:00' : 'Sedang Diverifikasi',
          items: [
            { label: 'Pemeriksaan Keabsahan LP, Sp.Sidik, Sp.Tangkap & BAP', checked: st === 'completed' || st === 'current' },
            { label: 'Verifikasi Hasil Skrining Lab Toksikologi Urin Awal', checked: st === 'completed' || st === 'current' },
            { label: 'Validasi Identitas NIK / KTP Terperiksa', checked: st === 'completed' },
            { label: 'Penerbitan Surat Perintah Penugasan Tim Asesor', checked: st === 'completed' },
            { label: 'Penetapan Jadwal Asesmen Terpadu', checked: st === 'completed' }
          ]
        };
      case 3:
        return {
          title: 'Langkah 3: Asesmen Spesialis (Medis & Hukum)',
          subtitle: 'Pemeriksaan Klinis Adiksi & Kualifikasi Yuridis Perkara',
          status: st,
          pj: 'Tim Asesor Medis & Tim Asesor Hukum',
          timestamp: st === 'completed' ? '9 September 2026 14:30' : 'Dalam Proses Asesmen',
          items: [
            { label: 'Skrining WHO ASSIST & Evaluasi Psikologi Klinik', checked: st === 'completed' },
            { label: 'Uji Toksikologi Urin 5 Parameter (Metamfetamina, THC, MDMA, Morphine, Benzodiazepine)', checked: st === 'completed' },
            { label: 'Analisis Peran Terperiksa (Penyalahguna Murni vs Indikasi Pengedar)', checked: st === 'completed' },
            { label: 'Verifikasi Batas Gramatur SEMA No. 04 Tahun 2010', checked: st === 'completed' },
            { label: 'Penyusunan Lembar Hasil Asesmen Medis & Hukum', checked: st === 'completed' }
          ]
        };
      case 4:
        return {
          title: 'Langkah 4: Sidang Pleno Musyawarah TAT',
          subtitle: 'Musyawarah Integrasi Tim Medis, Hukum & Ketua TAT',
          status: st,
          pj: 'Ketua Pleno TAT, Dokter Sp.KJ & Jaksa Penuntut',
          timestamp: st === 'completed' ? '10 September 2026 11:00' : 'Menunggu Sidang Pleno',
          items: [
            { label: 'Paparan Diagnosa Medis & Opini Hukum', checked: st === 'completed' },
            { label: 'Musyawarah Pengambilan Kesepakatan Rekomendasi', checked: st === 'completed' },
            { label: 'Penetapan Modalitas Layanan (Rawat Inap / Rawat Jalan / Proses Hukum)', checked: st === 'completed' },
            { label: 'Penyusunan Draf Berita Acara Asesmen Terpadu (BA-TAT)', checked: st === 'completed' },
            { label: 'Konfirmasi Kesepakatan Seluruh Anggota Panel Pleno', checked: st === 'completed' }
          ]
        };
      case 5:
        return {
          title: 'Langkah 5: Pengesahan Rekomendasi & Berita Acara',
          subtitle: 'Penandatanganan TTE 3-Panel & Barcode Verifikasi QR',
          status: st,
          pj: 'Pimpinan BNNP Kaltim & Ditresnarkoba Polda Kaltim',
          timestamp: st === 'completed' ? '11 September 2026 16:00' : 'Proses Pengesahan TTE',
          items: [
            { label: 'Pengesahan TTE Digital Tim Medis', checked: st === 'completed' },
            { label: 'Pengesahan TTE Digital Tim Hukum', checked: st === 'completed' },
            { label: 'Pengesahan TTE Digital Ketua Tim TAT', checked: st === 'completed' },
            { label: 'Penerbitan Surat Rekomendasi Resmi BNN Ber-Barcode QR', checked: st === 'completed' },
            { label: 'Penerbitan Berita Acara Pelaksanaan Asesmen Terpadu', checked: st === 'completed' }
          ]
        };
      case 6: {
        // Prepare dynamic checked states and labels based on actual data
        const isAsamCompleted = !!p.instrumenKriteriaPlasemen && p.instrumenKriteriaPlasemen.statusPengisian === 'divalidasi';
        const isPengawasanActive = !!p.pengawasanKlien;
        const totalSesi = p.pengawasanKlien?.totalSesiWajib || 12;
        const sesiSelesai = p.pengawasanKlien?.sesiTerselesaikan || 0;

        return {
          title: 'Langkah 6: Pemantauan Pasca Rehabilitasi & SKSP',
          subtitle: 'Pengawasan Kepatuhan Klien & Penilaian Instrumen Kriteria Penempatan (ASAM)',
          status: st,
          pj: 'Konselor Pascarehab & Penyidik Pengawas',
          timestamp: st === 'completed' ? 'Selesai Dilaksanakan' : isPengawasanActive ? 'Dalam Pengawasan' : 'Menunggu Pelaksanaan',
          items: [
            { 
              label: p.instrumenKriteriaPlasemen 
                ? `Penilaian Dimensi ASAM Selesai (Rekomendasi Level ${p.instrumenKriteriaPlasemen.hasil?.levelRekomendasiAkhir})` 
                : 'Penilaian Instrumen Kriteria Penempatan Klien (Adaptasi ASAM)', 
              checked: isAsamCompleted,
              details: isAsamCompleted ? (
                <div className="text-[10px] space-y-1 mt-1 text-slate-300 bg-[#071326] p-2 rounded-lg border border-[#1b3459]">
                  {p.instrumenKriteriaPlasemen!.penilaianPerDimensi.map(d => (
                    <div key={d.dimensi} className="flex justify-between items-center border-b border-[#1b3459]/50 last:border-0 pb-1 last:pb-0">
                      <span className="capitalize">{d.dimensi.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-[#D4AF37]">Lv {d.levelDipilih}</span>
                    </div>
                  ))}
                  <div className="mt-1 pt-1 border-t border-[#1b3459]/50 text-[#D4AF37] font-semibold">
                    Ket: {p.instrumenKriteriaPlasemen!.hasil?.justifikasiRekomendasi}
                  </div>
                </div>
              ) : null
            },
            { 
              label: 'Serah Terima Klien ke Balai / Fasilitas Rehabilitasi', 
              checked: isPengawasanActive,
              details: isPengawasanActive ? (
                <div className="text-[10px] mt-1 text-slate-300">
                  Fasilitas: <strong className="text-white">{p.pengawasanKlien!.instansiPelaksanaRehab}</strong>
                </div>
              ) : null
            },
            { 
              label: isPengawasanActive 
                ? `Pelaksanaan Program Rehabilitasi & Konseling (Selesai ${sesiSelesai} dari ${totalSesi} Sesi Wajib)` 
                : 'Pelaksanaan Program Rehabilitasi dengan Kepatuhan Penuh', 
              checked: isPengawasanActive && sesiSelesai > 0,
              details: isPengawasanActive && p.pengawasanKlien!.jurnalPengawasan.length > 0 ? (
                <div className="text-[10px] space-y-1 mt-1 text-slate-300 bg-[#071326] p-2 rounded-lg border border-[#1b3459]">
                  <span className="text-[#D4AF37] font-semibold">Log Jurnal Terakhir:</span>
                  {p.pengawasanKlien!.jurnalPengawasan.slice(-2).map(j => (
                    <div key={j.id} className="flex justify-between border-b border-[#1b3459]/50 last:border-0 pb-1 last:pb-0">
                      <span>{j.tanggal} ({j.jenisKegiatan})</span>
                      <span className={j.statusKehadiran === 'Hadir' ? 'text-emerald-400' : 'text-rose-400'}>{j.statusKehadiran}</span>
                    </div>
                  ))}
                </div>
              ) : null
            },
            { 
              label: p.pengawasanKlien?.riwayatTesUrinBerkala?.length 
                ? `Wajib Lapor & Uji Toksikologi Acak (${p.pengawasanKlien.riwayatTesUrinBerkala.length} Kali Pemeriksaan)` 
                : 'Wajib Lapor Berkala & Uji Toksikologi Acak', 
              checked: !!p.pengawasanKlien?.riwayatTesUrinBerkala?.length,
              details: p.pengawasanKlien?.riwayatTesUrinBerkala?.length ? (
                <div className="text-[10px] space-y-1 mt-1 text-slate-300 bg-[#071326] p-2 rounded-lg border border-[#1b3459]">
                  {p.pengawasanKlien.riwayatTesUrinBerkala.map(t => (
                    <div key={t.id} className="flex justify-between border-b border-[#1b3459]/50 last:border-0 pb-1 last:pb-0">
                      <span>Tahap {t.tahapKe} - {t.tanggalTes}</span>
                      <span className={t.hasil === 'Negatif' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{t.hasil}</span>
                    </div>
                  ))}
                </div>
              ) : null
            },
            { 
              label: 'Penerbitan Sertifikat SKSP (Surat Keterangan Selesai Program)', 
              checked: st === 'completed',
              details: st === 'completed' && p.pengawasanKlien?.suratKeteranganSelesai ? (
                <div className="text-[10px] mt-1 text-slate-300 bg-emerald-900/30 p-2 rounded-lg border border-emerald-500/30">
                  <p>No: {p.pengawasanKlien.suratKeteranganSelesai.nomorSurat}</p>
                  <p>Predikat: <strong className="text-emerald-400">{p.pengawasanKlien.suratKeteranganSelesai.predikat}</strong></p>
                </div>
              ) : null
            }
          ]
        };
      }
      default:
        return null;
    }
  };

  const isBaReady = searchedPermohonan && (
    searchedPermohonan.statusProsesUtama === 'rekomendasi_terbit' ||
    searchedPermohonan.statusProsesUtama === 'selesai_tindak_lanjut' ||
    searchedPermohonan.statusProsesUtama === 'pengesahan_rekomendasi' ||
    searchedPermohonan.sidangPleno?.kesepakatanRekomendasi ||
    searchedPermohonan.rekomendasiResmi
  );

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-slate-950 flex flex-col justify-between">
      {/* Shared Public Header */}
      <PublicHeader
        activePage="lacak"
        onGoToLanding={onGoToLanding}
        onGoToLacak={() => {}}
        onGoToLogin={onGoToLogin}
        onGoToRegister={onGoToRegister}
      />

      {/* MAIN TRACKING PAGE CONTENT */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0d1f38] border border-[#1b3459] text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            <Search className="w-3 h-3 text-[#D4AF37]" />
            <span>PORTAL PELACAKAN TRANSPARAN E-TAT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide font-['Cinzel',serif]">
            Halaman Lacak Berkas Perkara TAT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Pantau posisi berkas permohonan asesmen terpadu, tahapan verifikasi, asesmen medis/hukum, hingga penerbitan Berita Acara &amp; Rekomendasi Resmi.
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
                  Nomor permohonan "<span className="font-mono text-[#D4AF37]">{searchQuery}</span>" belum terdaftar pada sistem E-TAT SIAP PULIH. Pastikan format nomor permohonan sudah sesuai.
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
                  </div>
                </div>

                {/* Progress Stepper Flow */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>Perkembangan Posisi Berkas (Klik Langkah untuk Detail)</span>
                    </h4>
                    <span className="text-[10px] text-[#D4AF37] font-semibold italic">
                      💡 Klik pada kartu langkah untuk melihat detail centang &amp; progres
                    </span>
                  </div>

                  {/* 6 Clean Monochromatic Interactive Step Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
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
                        <button
                          key={item.step}
                          type="button"
                          onClick={() => setSelectedStepModal(item.step)}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer relative group ${
                            st === 'completed'
                              ? 'bg-[#081224] border-[#1b3459] hover:border-slate-400 hover:bg-[#0d1e38]'
                              : st === 'current'
                              ? 'bg-[#0f274a] border-[#D4AF37] hover:bg-[#143360]'
                              : 'bg-[#050c18] border-[#1b3459]/60 text-slate-500 opacity-60 hover:opacity-100 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono font-bold text-slate-400">Langkah {item.step}</span>
                            {st === 'completed' ? (
                              <span className="w-2 h-2 rounded-full bg-slate-300" />
                            ) : st === 'current' ? (
                              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-600" />
                            )}
                          </div>

                          <div>
                            <span className={`text-xs font-bold block ${st === 'current' ? 'text-[#D4AF37]' : 'text-white'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10px] block text-slate-400 mt-0.5">{item.sub}</span>
                          </div>

                          <div className="pt-2 border-t border-[#1b3459]/60 text-[10px] font-semibold flex items-center justify-between">
                            <span className={st === 'completed' ? 'text-slate-300' : st === 'current' ? 'text-[#D4AF37]' : 'text-slate-500'}>
                              {st === 'completed' ? '✓ Selesai' : st === 'current' ? '⚡ Berlangsung' : 'Menunggu'}
                            </span>
                            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* STEP DETAIL MODAL */}
      {selectedStepModal !== null && searchedPermohonan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-[#0b172a] border border-[#1b3459] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {(() => {
              const dt = getStepDetailData(selectedStepModal, searchedPermohonan);
              if (!dt) return null;
              return (
                <>
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-[#1b3459] flex items-center justify-between bg-[#081224] shrink-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        dt.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : dt.status === 'current'
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {selectedStepModal}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-['Cinzel',serif]">{dt.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{dt.subtitle}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStepModal(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#133863] transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto space-y-4 text-slate-200 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#071325] p-3.5 rounded-xl border border-[#1b3459]">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Penanggung Jawab:</span>
                        <span className="text-slate-200 font-semibold">{dt.pj}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Waktu / Status Progres:</span>
                        <span className="font-mono text-[#D4AF37] font-semibold">{dt.timestamp}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                        Rincian Check-list Tahapan ({dt.items.filter(i => i.checked).length}/{dt.items.length} Selesai):
                      </span>
                      <div className="space-y-2">
                        {dt.items.map((item: any, i: number) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs flex flex-col space-y-2 ${
                              item.checked
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                                : 'bg-[#071325] border-[#1b3459] text-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {item.checked ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                                )}
                                <span className={item.checked ? 'font-medium text-slate-200' : 'text-slate-500'}>
                                  {item.label}
                                </span>
                              </div>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                item.checked
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-500'
                              }`}>
                                {item.checked ? '✓ Terverifikasi' : 'Menunggu'}
                              </span>
                            </div>
                            {item.details && (
                              <div className="pl-7 pt-1">
                                {item.details}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-3.5 border-t border-[#1b3459] bg-[#081224] flex items-center justify-between shrink-0">
                    <span className="text-xs text-slate-400 font-mono">
                      Sistem Pelacakan Transparan E-TAT POLRI/BNN
                    </span>
                    <div className="flex items-center space-x-2">
                      {(selectedStepModal === 4 || selectedStepModal === 5 || selectedStepModal === 6) && isBaReady && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStepModal(null);
                            setShowBAModal(true);
                          }}
                          className="bg-[#D4AF37] hover:bg-[#e5bd38] text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Cetak Berita Acara</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedStepModal(null)}
                        className="bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#235594]"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* BERITA ACARA TAT PRINT MODAL */}
      {showBAModal && searchedPermohonan && (
        <BeritaAcaraModal
          permohonan={searchedPermohonan}
          onClose={() => setShowBAModal(false)}
        />
      )}

      {/* Clean Footer */}
      <footer className="bg-[#071325] border-t border-[#1b3459] py-6 text-center text-xs text-slate-400 space-y-1">
        <p>© 2026 Teknis Pelaksanaan Asesmen Terpadu (TAT) BNNP Kalimantan Timur. All rights reserved.</p>
        <p className="text-[10px] text-slate-400">Sistem Integrasi Asesmen dan Pemantauan Pemulihan.</p>
      </footer>
    </div>
  );
};
