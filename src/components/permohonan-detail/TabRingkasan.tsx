import React from 'react';
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
  Share2
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

      {/* Barang Bukti Sitaan Real Time */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Barang Bukti Narkotika & Hasil Uji Laboratorium ({bbList.length} Item)
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">SEMA No. 04/2010 Compliance</span>
        </div>

        {bbList.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            Tidak ada barang bukti narkotika disita (Kategori Penangkapan Tanpa BB / Lapor Diri).
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bbList.map((bb: any, idx: number) => (
              <div key={bb.id || idx} className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{bb.jenisZat}</span>
                  <span className="font-mono text-[#D4AF37] font-bold text-xs bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                    {bb.beratBersihGram} Gram
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
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
            ))}
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
    </div>
  );
};
