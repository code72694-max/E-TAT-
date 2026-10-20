import React, { useState } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
} from '../../types';
import {
  FileText,
  User,
  Shield,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Phone,
  Briefcase,
  Layers,
  Scale,
  Activity,
  FileCheck2,
  Share2,
  Eye,
  ZoomIn,
  ExternalLink,
  Image as ImageIcon,
  X,
  History,
  ShieldCheck,
} from 'lucide-react';

interface TabRingkasanProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onNavigateTab: (tab: any) => void;
  onOpenQrModal: (permohonan: PermohonanAsesmen) => void;
}

export const TabRingkasan: React.FC<TabRingkasanProps> = ({
  permohonan,
  currentUser,
  onNavigateTab,
  onOpenQrModal,
}) => {
  const tr = permohonan.terperiksa;
  const pk = permohonan.perkara;
  const bbList = pk?.barangBuktiList || [];
  const hukum = permohonan.asesmenHukum;

  const [previewModalImg, setPreviewModalImg] = useState<{
    url: string;
    title: string;
    subtitle?: string;
    isLab?: boolean;
    zat?: string;
    berat?: number;
    statusLab?: string;
    noSuratLab?: string;
  } | null>(null);

  // Status Kasus / Residivisme Logic
  const isResidivis =
    hukum?.riwayatResidivisme?.pernahDitangkap ??
    (permohonan as any)?.statusResidivis?.startsWith('residivis') ??
    false;

  const keteranganKasus =
    hukum?.riwayatResidivisme?.keteranganPerkaraLalu ||
    (isResidivis
      ? 'Tercatat pernah memiliki riwayat perkara tindak pidana narkotika sebelumnya.'
      : 'Belum pernah dihukum pidana sebelumnya (Pelaku Pertama / Kasus Pertama). Tidak terdaftar dalam basis data residivis kriminal Ditresnarkoba Polda Kaltim & Kejaksaan.');

  const terverifikasiDb = hukum?.riwayatResidivisme?.terverifikasiDatabase ?? true;

  return (
    <div className="space-y-6">
      {/* SLA & Action Required Alert Banner */}
      <div className="bg-gradient-to-r from-[#0d1e38] via-[#0b172a] to-[#081224] border border-[#1b3459] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-[#132c52] border border-[#234b80] rounded-xl text-[#D4AF37] shrink-0 mt-0.5">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#D4AF37]">
                Status Tindakan Berikutnya (SLA 3 Hari Kerja)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                Tepat Waktu
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1 leading-snug">
              {permohonan.tindakanBerikutnyaLabel || 'Menunggu pemrosesan tahapan asesmen terpadu.'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Penanggung Jawab: <strong className="text-slate-200">{permohonan.penanggungJawabBerikutnya || 'Sekretariat TAT'}</strong> &bull; Tenggat: <span className="font-mono text-slate-300">{permohonan.tenggatSlaTanggal || '3 Hari Pasca Pengajuan'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {permohonan.rekomendasiResmi && (
            <button
              onClick={() => onOpenQrModal(permohonan)}
              className="bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234475] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Verifikasi QR</span>
            </button>
          )}
          <button
            onClick={() => onNavigateTab('administrasi')}
            className="bg-[#D4AF37] hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-lg shadow-amber-950/30 cursor-pointer"
          >
            <span>Lanjut Proses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Columns: Identitas Terperiksa & Info Perkara */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Identitas Terperiksa */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Identitas Terperiksa (Klien)</h4>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
              NIK Terverifikasi
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-slate-400">Nama Lengkap</span>
              <span className="font-bold text-white text-right">
                {tr?.namaLengkap || '-'} {tr?.alias ? `(Alias: ${tr.alias})` : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Nomor Induk Kependudukan (NIK)</span>
              <span className="font-mono text-slate-200 font-bold">{tr?.nik || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tempat, Tanggal Lahir</span>
              <span className="text-slate-200">
                {tr?.tempatLahir || '-'}, {tr?.tanggalLahir ? new Date(tr.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} ({tr?.usia || '-'} Thn)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Jenis Kelamin / Pekerjaan</span>
              <span className="text-slate-200">{tr?.jenisKelamin || '-'} / {tr?.pekerjaan || '-'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-400">Alamat Domisili KTP</span>
              <span className="text-slate-200 text-right max-w-[260px] leading-relaxed">
                {tr?.alamatDomisili || tr?.alamatKtp || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#1b3459]/60">
              <span className="text-slate-400">Wali / Kuasa Hukum</span>
              <span className="text-slate-200 font-medium">
                {tr?.namaWaliPendamping || '-'} ({tr?.kontakWali || '-'})
              </span>
            </div>
          </div>
        </div>

        {/* Info Perkara & Penangkapan */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Perkara Pidana & Penangkapan</h4>
            </div>
            <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-bold">
              {permohonan.jenisPengajuan?.replace(/_/g, ' ').toUpperCase() || 'PENANGKAPAN DENGAN BB'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-slate-400">Nomor Laporan Polisi (LP)</span>
              <span className="font-mono font-bold text-white text-right">{pk?.nomorLaporanPolisi || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tanggal Laporan Polisi</span>
              <span className="text-slate-200">{pk?.tanggalLp ? new Date(pk.tanggalLp).toLocaleDateString('id-ID') : '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Instansi & Penyidik Kasus</span>
              <span className="text-slate-200 text-right">
                {pk?.namaPenyidik || permohonan.pengajuNama || '-'} ({pk?.instansiPenyidik || permohonan.instansiPengaju || '-'})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Kontak HP Penyidik</span>
              <span className="font-mono text-slate-200">{pk?.nomorHpPenyidik || '-'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-400">Pasal yang Dipersangkakan</span>
              <span className="font-semibold text-rose-300 text-right max-w-[250px]">
                {pk?.pasalDipersangkakan || 'Pasal 127 ayat (1) UU No. 35/2009'}
              </span>
            </div>
            <div className="flex justify-between items-start pt-2 border-t border-[#1b3459]/60">
              <span className="text-slate-400">Tempat Kejadian Perkara (TKP)</span>
              <span className="text-slate-200 text-right">{pk?.tempatKejadianPerkara || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rekam Jejak Pidana & Status Kasus Terperiksa */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1b3459] gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#132c52] border border-[#234b80] rounded-xl text-[#D4AF37]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Rekam Jejak Pidana &amp; Status Kasus Terperiksa
              </h4>
              <p className="text-[11px] text-slate-400">
                Pemeriksaan silang basis data kriminal Ditresnarkoba, BNN, dan riwayat perkara peradilan
              </p>
            </div>
          </div>
          {isResidivis ? (
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Residivis / Pernah Terjerat Kasus</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pelaku Pertama (Bukan Residivis)</span>
            </span>
          )}
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Status Kasus Terperiksa
            </span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isResidivis ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
              <span className="font-bold text-white text-xs">
                {isResidivis ? 'Pernah Terjerat Kasus Hukum' : 'Pertama Kali Ada Kasus (Kasus Pertama)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isResidivis
                ? 'Tercatat dalam penanganan perkara narkotika sebelumnya.'
                : 'Belum pernah tersangkut tindak pidana penyalahgunaan zat sebelumnya.'}
            </p>
          </div>

          <div className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Verifikasi Basis Data Terpadu
            </span>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-emerald-300 text-xs">
                {terverifikasiDb ? 'Terverifikasi Bersih / Sinkron' : 'Menunggu Sinkronisasi'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sinkronisasi NIK {tr?.nik || '-'} pada database Ditresnarkoba &amp; BNNP Kaltim.
            </p>
          </div>

          <div className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Kesesuaian SEMA No. 04/2010
            </span>
            <div className="flex items-center space-x-2">
              <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-bold text-[#D4AF37] text-xs">
                {isResidivis ? 'Perlu Pendalaman Telaah' : 'Kategori Pelaku Pemula'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isResidivis
                ? 'Analisis lanjutan keterlibatan jaringan pengedar oleh Tim Asesor Hukum.'
                : 'Memenuhi syarat formil untuk usulan program rehabilitasi medis/sosial.'}
            </p>
          </div>
        </div>

        {/* Detail Catatan Riwayat */}
        <div className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl flex items-start space-x-3 text-xs">
          <div className="p-1.5 bg-[#132c52] rounded-lg text-[#D4AF37] shrink-0 mt-0.5">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1 w-full">
            <span className="font-bold text-slate-300 text-xs block">Keterangan Riwayat Perkara &amp; Rekam Kriminal:</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {keteranganKasus}
            </p>
          </div>
        </div>
      </div>

      {/* Barang Bukti Sitaan Real Time */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Barang Bukti Narkotika &amp; Hasil Uji Laboratorium ({bbList.length} Item)
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">SEMA No. 04/2010 Compliance</span>
        </div>

        {bbList.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            Tidak ada barang bukti narkotika disita (Kategori Penangkapan Tanpa BB / Lapor Diri).
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bbList.map((bb: any, idx: number) => {
              const fotoBb = bb.fotoBarangBuktiUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
              const fotoLab = bb.fotoUjiLabUrl;

              return (
                <div key={bb.id || idx} className="bg-[#050e1c] border border-[#1b3459] rounded-xl overflow-hidden flex flex-col justify-between shadow-lg hover:border-[#2a5084] transition-all">
                  {/* Foto Thumbnail Container */}
                  <div className="relative group overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border-b border-[#1b3459]">
                    <img
                      src={fotoBb}
                      alt={bb.jenisZat}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex items-end justify-between p-3">
                      <span className="text-[10px] font-bold bg-black/60 text-slate-200 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                        {bb.fotoBarangBuktiUrl ? 'Foto Barang Bukti' : 'Dokumentasi Sampel'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewModalImg({
                          url: fotoBb,
                          title: `Barang Bukti: ${bb.jenisZat}`,
                          subtitle: `No. LP: ${pk?.nomorLaporanPolisi || '-'} • Berat Bersih: ${bb.beratBersihGram} Gram`,
                          zat: bb.jenisZat,
                          berat: bb.beratBersihGram,
                          statusLab: bb.statusUjiLab,
                          noSuratLab: bb.nomorSuratLab
                        })}
                        className="bg-[#D4AF37] hover:bg-amber-400 text-slate-900 p-1.5 rounded-lg text-xs font-bold transition-all shadow cursor-pointer flex items-center space-x-1"
                        title="Perbesar Foto Barang Bukti"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Perbesar</span>
                      </button>
                    </div>
                  </div>

                  {/* Info Rincian */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{bb.jenisZat}</span>
                      <span className="font-mono text-[#D4AF37] font-bold text-xs bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                        {bb.beratBersihGram} Gram
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-400">
                      {bb.beratKotorGram && (
                        <div className="flex items-center justify-between text-[10px]">
                          <span>Berat Kotor:</span>
                          <span className="font-mono text-slate-300">{bb.beratKotorGram} Gram</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Status Uji Lab:</span>
                        <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                          bb.statusUjiLab === 'positif' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {bb.statusUjiLab === 'positif' ? 'Positif Puslabfor' : bb.statusUjiLab === 'proses_lab' ? 'Dalam Proses Lab' : 'Belum Diuji'}
                        </span>
                      </div>
                      {bb.nomorSuratLab && (
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          No. Lab: {bb.nomorSuratLab}
                        </div>
                      )}
                    </div>

                    {/* Foto Uji Lab Button / Link if available */}
                    <div className="pt-2 border-t border-[#1b3459]/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewModalImg({
                          url: fotoBb,
                          title: `Barang Bukti: ${bb.jenisZat}`,
                          subtitle: `No. LP: ${pk?.nomorLaporanPolisi || '-'} • Berat Bersih: ${bb.beratBersihGram} Gram`,
                          zat: bb.jenisZat,
                          berat: bb.beratBersihGram,
                          statusLab: bb.statusUjiLab,
                          noSuratLab: bb.nomorSuratLab
                        })}
                        className="text-[11px] text-slate-300 hover:text-white bg-[#142642] hover:bg-[#1a345a] border border-[#234475] px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer flex-1 justify-center"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Lihat Foto BB</span>
                      </button>

                      {fotoLab && (
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg({
                            url: fotoLab,
                            title: `Surat Uji Laboratorium: ${bb.nomorSuratLab || bb.jenisZat}`,
                            subtitle: `Status: ${bb.statusUjiLab === 'positif' ? 'Positif Narkotika' : 'Hasil Uji Lab'}`,
                            isLab: true,
                            zat: bb.jenisZat,
                            berat: bb.beratBersihGram,
                            statusLab: bb.statusUjiLab,
                            noSuratLab: bb.nomorSuratLab
                          })}
                          className="text-[11px] text-sky-300 hover:text-sky-200 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer flex-1 justify-center"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>Scan Lab</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4 Pilar Progress Tracker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pilar 1: Administrasi */}
        <div
          onClick={() => onNavigateTab('administrasi')}
          className="p-4 bg-[#081224] hover:bg-[#0d1f38] border border-[#1b3459] hover:border-sky-500 rounded-2xl cursor-pointer transition-all space-y-2 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">1. Administrasi Formil</span>
            <FileCheck2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {permohonan.dokumenList?.filter(d => d.statusVerifikasi === 'sesuai').length || 0} / {permohonan.dokumenList?.length || 7} Berkas Valid
          </div>
          <p className="text-[11px] text-slate-400">Verifikasi kelengkapan berkas penyidik.</p>
        </div>

        {/* Pilar 2: Medis */}
        <div
          onClick={() => onNavigateTab('medis')}
          className="p-4 bg-[#081224] hover:bg-[#0d1f38] border border-[#1b3459] hover:border-emerald-500 rounded-2xl cursor-pointer transition-all space-y-2 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">2. Asesmen Medis</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {permohonan.asesmenMedis?.status === 'FINAL' ? 'Difinalisasi' : permohonan.asesmenMedis ? 'Draf Medis Ada' : 'Belum Diperiksa'}
          </div>
          <p className="text-[11px] text-slate-400">Diagnosis klinis ICD-10 & skrining toksikologi.</p>
        </div>

        {/* Pilar 3: Hukum */}
        <div
          onClick={() => onNavigateTab('hukum')}
          className="p-4 bg-[#081224] hover:bg-[#0d1f38] border border-[#1b3459] hover:border-amber-500 rounded-2xl cursor-pointer transition-all space-y-2 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">3. Asesmen Hukum</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {permohonan.asesmenHukum?.status === 'FINAL' ? 'Difinalisasi' : permohonan.asesmenHukum ? 'Draf Hukum Ada' : 'Belum Ditelaah'}
          </div>
          <p className="text-[11px] text-slate-400">Analisis peran SEMA & kepemilikan BB.</p>
        </div>

        {/* Pilar 4: Pleno & Rekomendasi */}
        <div
          onClick={() => onNavigateTab(permohonan.rekomendasiResmi ? 'dokumen' : 'pleno')}
          className="p-4 bg-[#081224] hover:bg-[#0d1f38] border border-[#1b3459] hover:border-[#D4AF37] rounded-2xl cursor-pointer transition-all space-y-2 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">4. Pleno & TTE</span>
            <Shield className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-sm font-bold text-white">
            {permohonan.rekomendasiResmi?.isLengkapPengesahan ? 'TTE Lengkap 100%' : permohonan.rekomendasiResmi ? 'Menunggu Pengesahan' : 'Menunggu Sidang'}
          </div>
          <p className="text-[11px] text-slate-400">Penerbitan surat rekomendasi resmi.</p>
        </div>
      </div>

      {/* Lightbox Modal Pratinjau Foto Barang Bukti & Hasil Lab */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="bg-[#081224] border border-[#234475] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1b3459] bg-[#050e1c]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#132c52] border border-[#234b80] rounded-xl text-[#D4AF37]">
                  {previewModalImg.isLab ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {previewModalImg.title}
                  </h3>
                  {previewModalImg.subtitle && (
                    <p className="text-xs text-slate-400">{previewModalImg.subtitle}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-[#142642] hover:bg-[#1a345a] rounded-lg border border-[#234475] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="p-4 bg-black/60 flex items-center justify-center overflow-auto max-h-[66vh]">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.title}
                className="max-h-[62vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-[#1b3459]"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-[#1b3459] bg-[#050e1c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dokumentasi Resmi e-TAT</span>
                </span>
                {previewModalImg.zat && (
                  <>
                    <span>&bull;</span>
                    <span className="font-semibold text-slate-200">{previewModalImg.zat} ({previewModalImg.berat} gr)</span>
                  </>
                )}
                {previewModalImg.noSuratLab && (
                  <>
                    <span>&bull;</span>
                    <span className="font-mono text-slate-400">Lab: {previewModalImg.noSuratLab}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                <a
                  href={previewModalImg.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-300 hover:text-white bg-[#142642] hover:bg-[#1a345a] border border-[#234475] px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Buka Tab Baru</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalImg(null)}
                  className="text-xs font-semibold text-slate-900 bg-[#D4AF37] hover:bg-amber-400 px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

