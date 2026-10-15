import React from 'react';
import {
  FileSignature,
  QrCode,
  CheckCircle2,
  FileText,
  Eye,
  Download,
  ExternalLink,
  Shield,
  User,
  Users,
  History,
  Activity
} from 'lucide-react';
import { PermohonanAsesmen, UserProfile } from '../../types';
import { rekomendasiApi } from '../../services/api';

interface TabDokumenPengesahanProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  effectiveReadonly: boolean;
  onOpenQrModal: (p: PermohonanAsesmen) => void;
  onOpenHasilAsesmenModal: () => void;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
}

export const TabDokumenPengesahan: React.FC<TabDokumenPengesahanProps> = ({
  permohonan,
  currentUser,
  effectiveReadonly,
  onOpenQrModal,
  onOpenHasilAsesmenModal,
  onUpdatePermohonan
}) => {
  const handlePengajuSignReceipt = () => {
    if (!permohonan.rekomendasiResmi) return;
    const nowStr = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const receipt = {
      nomorTandaTerima: 'TTR/TAT/' + Date.now().toString().slice(-6),
      diterimaOleh: `${currentUser.name} (Penyidik Pengaju)`,
      tanggalDiterima: nowStr,
      statusPenyerahan: 'diterima_lengkap' as const,
      catatanPenyerahan: 'Dokumen fisik/digital telah diterima sah oleh penyidik Sat Resnarkoba.'
    };
    const updated: PermohonanAsesmen = {
      ...permohonan,
      rekomendasiResmi: {
        ...permohonan.rekomendasiResmi,
        buktiPenerimaanPengaju: receipt
      },
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: nowStr,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Konfirmasi Tanda Terima Rekomendasi Resmi',
          rincian: `No. Tanda Terima: ${receipt.nomorTandaTerima}`
        },
        ...permohonan.auditLogs
      ]
    };
    onUpdatePermohonan(updated);
  };

  const handleDownloadPdf = () => {
    rekomendasiApi.downloadPdf(
      permohonan.id,
      `REKOMENDASI-TAT-${(permohonan.terperiksa?.namaLengkap || permohonan.nomorPermohonan).replace(/\s+/g, '_')}.pdf`
    ).catch(err => {
      console.warn('Gagal unduh PDF backend, fallback ke cetak modal:', err);
      onOpenHasilAsesmenModal();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileSignature className="w-4 h-4 text-[#D4AF37]" />
            <span>Hasil Asesmen Terpadu & Pengesahan Dokumen</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Ringkasan keputusan rekomendasi, preview PDF hasil asesmen resmi, dan jaminan keamanan audit trail.
          </p>
        </div>
        {permohonan.rekomendasiResmi && (
          <button
            onClick={() => onOpenQrModal(permohonan)}
            className="bg-[#0f274a] hover:bg-[#163a69] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-[#234b7d] cursor-pointer transition-colors self-start sm:self-auto"
          >
            <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cek QR Verifikasi</span>
          </button>
        )}
      </div>

      {!permohonan.rekomendasiResmi ? (
        <div className="text-center py-12 text-slate-400 bg-[#0b172a] border border-[#1b3459] rounded-xl">
          <FileSignature className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-200">Surat rekomendasi belum diterbitkan.</p>
          <p className="text-xs text-slate-500 mt-1">Dokumen resmi disusun setelah kesepakatan Sidang Pleno tercapai.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 3-PANEL LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* PANEL 1 (LEFT): REKOMENDASI TIM ASESMEN TERPADU */}
            <div className="lg:col-span-4 bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]">
                  <FileSignature className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    REKOMENDASI TIM ASESMEN TERPADU
                  </h4>
                </div>

                {/* Nomor Rekomendasi */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Nomor Rekomendasi
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
                    {permohonan.rekomendasiResmi.nomorSurat}
                  </span>
                </div>

                {/* Keputusan Card */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                    Keputusan
                  </span>
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center space-x-3 text-emerald-200">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-slate-200" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white block uppercase tracking-wider">
                        DISETUJUI
                      </span>
                      <span className="text-[11px] font-semibold text-slate-200 block">
                        Rekomendasi Positif
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opsi Rekomendasi */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Opsi Rekomendasi
                  </span>

                  {/* Option 1: Positif (Selected) */}
                  <div className="p-2.5 bg-[#071326] border border-[#2d5289] rounded-lg flex items-start space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Rekomendasi Positif</span>
                      <span className="text-[10px] text-slate-400 block">Disetujui untuk diproses sesuai ketentuan.</span>
                    </div>
                  </div>

                  {/* Option 2: Positif dengan Catatan */}
                  <div className="p-2.5 bg-[#071326]/50 border border-[#1b3459] rounded-lg flex items-start space-x-2.5 opacity-60">
                    <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-slate-300 block">Rekomendasi Positif dengan Catatan</span>
                      <span className="text-[10px] text-slate-400 block">Disetujui dengan pemenuhan catatan rekomendasi.</span>
                    </div>
                  </div>

                  {/* Option 3: Negatif */}
                  <div className="p-2.5 bg-[#071326]/50 border border-[#1b3459] rounded-lg flex items-start space-x-2.5 opacity-60">
                    <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-slate-300 block">Rekomendasi Negatif</span>
                      <span className="text-[10px] text-slate-400 block">Tidak disetujui untuk diproses lebih lanjut.</span>
                    </div>
                  </div>
                </div>

                {/* Tanda Tangan Ketua Tim */}
                <div className="pt-2 border-t border-[#1b3459] space-y-1.5">
                  <div className="flex justify-between items-baseline text-[10px]">
                    <span className="text-slate-400 font-semibold">Tanda Tangan Ketua Tim</span>
                    <span className="text-slate-400 font-mono">Tanggal: {permohonan.rekomendasiResmi.tanggalTerbit}</span>
                  </div>

                  <div className="p-3 bg-[#071326] border border-[#1b3459] rounded-lg text-center font-sans space-y-1">
                    <div className="py-1">
                      <span className="font-serif italic text-lg text-[#D4AF37] tracking-widest block font-bold" style={{ fontFamily: 'Dancing Script, cursive, serif' }}>
                        {permohonan.sidangPleno?.pimpinanPleno?.split(' ')?.[1] || 'Ketua TAT'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white block uppercase">
                      {permohonan.sidangPleno?.pimpinanPleno || '[TEST] KETUA TIM ASESMEN TERPADU'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Ketua Tim Asesmen Terpadu
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Tempat: Samarinda / Jakarta</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Proses TTE & Finalisasi */}
              {!effectiveReadonly ? (
                <button
                  onClick={() => onOpenQrModal(permohonan)}
                  className="w-full bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-[#2d7ad6]/70 shadow-lg shadow-sky-950/40 flex items-center justify-center space-x-2 cursor-pointer transition-all mt-2"
                >
                  <FileSignature className="w-4 h-4 text-[#D4AF37]" />
                  <span>Proses TTE & Finalisasi</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenQrModal(permohonan)}
                  className="w-full bg-[#132c54] hover:bg-[#1a3a6b] text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl border border-[#235399] flex items-center justify-center space-x-2 cursor-pointer transition-all mt-2"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Lihat QR Verifikasi TTE</span>
                </button>
              )}
            </div>

            {/* PANEL 2 (CENTER): PREVIEW DOKUMEN HASIL ASESMEN (PDF PAPER VIEW) */}
            <div className="lg:col-span-5 bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xl">
              {/* Header bar */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>PREVIEW DOKUMEN HASIL ASESMEN (PDF)</span>
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={onOpenHasilAsesmenModal}
                    className="px-2.5 py-1 bg-[#132d54] hover:bg-[#1a3a6b] text-sky-300 hover:text-white rounded border border-[#245399] text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Buka Dokumen Lengkap (Detail & Cetak PDF)"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Detail</span>
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="p-1.5 hover:bg-[#163a69] text-slate-300 rounded border border-[#234b7d] transition-colors cursor-pointer"
                    title="Unduh Berkas Resmi PDF Asli dari Server"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                  <button
                    onClick={() => onOpenQrModal(permohonan)}
                    className="p-1.5 hover:bg-[#163a69] text-slate-300 rounded border border-[#234b7d] transition-colors"
                    title="Buka Lembar Verifikasi Barcode"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                </div>
              </div>

              {/* PDF Document Paper Container */}
              <div 
                onClick={onOpenHasilAsesmenModal}
                className="bg-white text-slate-900 rounded-lg p-5 shadow-2xl space-y-3 font-serif text-[11px] leading-relaxed flex-1 flex flex-col justify-between border border-slate-300 hover:border-sky-500 transition-all cursor-pointer group relative"
                title="Klik untuk membuka dokumen lengkap dan mencetak PDF"
              >
                <div className="space-y-3">
                  {/* Kop Surat Header */}
                  <div className="text-center pb-2.5 border-b-2 border-slate-900 space-y-0.5 font-sans">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-900">
                      KEPOLISIAN NEGARA REPUBLIK INDONESIA &bull; BNN RI
                    </p>
                    <p className="text-xs font-black uppercase text-slate-900 mt-0.5">
                      LEMBAR REKOMENDASI HASIL ASESMEN TERPADU
                    </p>
                    <p className="text-[10px] font-mono font-bold text-slate-700">
                      Nomor: {permohonan.rekomendasiResmi?.nomorSurat || `TAT/REK/${permohonan.nomorPermohonan}`}
                    </p>
                  </div>

                  {/* Interactive Document Section Outline */}
                  <div className="space-y-2 font-sans text-[10px] text-slate-800">
                    <div className="border-b border-slate-200 pb-1">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>I. IDENTITAS PEMOHON / TERPERIKSA</span>
                        <span className="text-sky-700 font-mono text-[9px]">LENGKAP</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 font-serif mt-0.5">
                        {permohonan.terperiksa?.namaLengkap || permohonan.tersangkaNama} &bull; NIK: {permohonan.terperiksa?.nik || '3171012345670001'} &bull; Usia: {permohonan.terperiksa?.usia ? `${permohonan.terperiksa.usia} Thn` : '32 Thn'} &bull; Pekerjaan: {permohonan.terperiksa?.pekerjaan || 'Wiraswasta'}
                      </p>
                    </div>

                    <div className="border-b border-slate-200 pb-1">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>II. DASAR ASESMEN</span>
                        <span className="text-slate-500 text-[9px]">YURIDIS</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 font-serif mt-0.5">
                        Pasal 54 & 103 UU No. 35/2009, PP No. 25/2011, Perber 7 K/L 2014 & Surat Permohonan Penyidik No. {permohonan.perkara?.nomorLp || permohonan.nomorPermohonan}
                      </p>
                    </div>

                    <div className="border-b border-slate-200 pb-1">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>III. RUANG LINGKUP ASESMEN</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 font-serif mt-0.5">
                        Pemeriksaan Medis Psikiatris, Telaah Hukum & Barang Bukti, Musyawarah Pleno TAT
                      </p>
                    </div>

                    <div className="border-b border-slate-200 pb-1">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>IV. METODOLOGI ASESMEN</span>
                        <span className="text-emerald-700 font-mono text-[9px]">SKOR {permohonan.asesmenMedis?.skorInstrumen || 28}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 font-serif mt-0.5">
                        Wawancara ASSIST / ASI, Uji Toksikologi Urin 6 Parameter & Forensik BAP Penyidikan
                      </p>
                    </div>

                    <div className="border-b border-slate-200 pb-1">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>V. HASIL ASESMEN PER BIDANG</span>
                      </div>
                      <div className="text-[9.5px] text-slate-600 font-serif mt-0.5 space-y-0.5">
                        <p><strong>Medis:</strong> {permohonan.asesmenMedis?.diagnosisKlinisIcd || 'F15.2'} &bull; Usulan: {permohonan.asesmenMedis?.kebutuhanRawat || 'Rehabilitasi Rawat Jalan'} ({permohonan.asesmenMedis?.durasiUsulanBulan || 3} bln)</p>
                        <p><strong>Hukum:</strong> {permohonan.asesmenHukum?.analisisPeran || 'Penyalahguna Murni'} &bull; Jaringan: {permohonan.asesmenHukum?.jaringanPengedarIndikasi || 'Tidak terindikasi sindikat'}</p>
                      </div>
                    </div>

                    <div className="border-b border-slate-200 pb-1">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>VI. TEMUAN & CATATAN</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 font-serif mt-0.5">
                        Tersangka kooperatif, barang bukti di bawah batas SEMA 04/2010, keluarga menjamin ketaatan program.
                      </p>
                    </div>

                    <div className="border-b border-slate-300 pb-1 bg-amber-50/70 p-1.5 rounded">
                      <div className="flex justify-between font-black text-slate-950 uppercase">
                        <span>VII. REKOMENDASI RESMI TIM ASESMEN TERPADU</span>
                        <span className="text-amber-800 font-bold text-[9px]">FINAL</span>
                      </div>
                      <p className="text-[10px] text-slate-900 font-sans font-bold mt-0.5">
                        {permohonan.rekomendasiResmi?.hasilRekomendasi || 'REHABILITASI RAWAT JALAN'}
                      </p>
                      <p className="text-[9px] text-slate-700 font-serif">
                        Rujukan: {permohonan.rekomendasiResmi?.tempatRehabRujukan || 'Balai Rehabilitasi BNN Tanah Merah / Klinik Pratama BNN'} &bull; Wajib lapor penyidik
                      </p>
                    </div>

                    <div className="border-b border-slate-200 pb-1">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>VIII. KEPUTUSAN</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 font-serif mt-0.5">
                        Proses hukum dilanjutkan dengan penempatan rehabilitasi sesuai Pasal 54 jo 103 UU 35/2009.
                      </p>
                    </div>

                    <div className="pb-0.5">
                      <div className="flex justify-between font-bold text-slate-950 uppercase">
                        <span>IX. PENUTUP & TTE PEJABAT</span>
                        <span className="text-emerald-700 font-mono text-[9px]">TERVERIFIKASI</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 font-serif mt-0.5">
                        Ditetapkan dan disahkan bersama oleh Tim Medis, Tim Hukum, dan Ketua TAT.
                      </p>
                    </div>
                  </div>

                  <div className="text-center pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-sans font-bold text-[9px] border border-slate-300 group-hover:border-sky-500 transition-colors">
                      <Eye className="w-3 h-3 text-sky-600" />
                      <span>Klik Lembar Ini Untuk Melihat Tampilan Lengkap & Cetak PDF</span>
                    </span>
                  </div>
                </div>

                {/* PDF Bottom Signature & QR Verification Section */}
                <div className="pt-3 border-t border-slate-300 font-sans grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5 bg-slate-50 border border-slate-300 rounded p-2 text-center space-y-1">
                    <div className="w-12 h-12 bg-white border border-slate-900 mx-auto flex items-center justify-center p-1 rounded">
                      <QrCode className="w-10 h-10 text-slate-900" />
                    </div>
                    <span className="text-[8px] font-black uppercase text-slate-900 block leading-tight">
                      SCAN VERIFIKASI DOKUMEN
                    </span>
                    <p className="text-[7px] text-slate-600 leading-tight">
                      ID: <span className="font-mono font-bold text-slate-800">{permohonan.trackingNumber || permohonan.id?.slice(0, 8)}</span>
                    </p>
                  </div>

                  <div className="col-span-7 text-center font-sans space-y-0.5">
                    <p className="text-[8.5px] text-slate-700">Samarinda, {permohonan.rekomendasiResmi?.tanggalTerbit || '10 Oktober 2026'}</p>
                    <p className="text-[8.5px] font-bold text-slate-900 uppercase">Ketua Tim Asesmen Terpadu</p>
                    <div className="py-0.5">
                      <span className="font-serif italic text-sm text-slate-900 block font-bold" style={{ fontFamily: 'Dancing Script, cursive, serif' }}>
                        {permohonan.sidangPleno?.pimpinanPleno || 'Ketua TAT'}
                      </span>
                    </div>
                    <p className="text-[8.5px] font-extrabold text-slate-900 underline">
                      {permohonan.sidangPleno?.pimpinanPleno || '[TEST] KETUA TIM ASESMEN TERPADU'}
                    </p>
                    <p className="text-[7.5px] font-mono text-slate-700">NIP/NRP 79080512 (Akun Uji)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 3 (RIGHT): KEAMANAN & AUDIT TRAIL */}
            <div className="lg:col-span-3 bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 flex flex-col justify-between space-y-3 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    KEAMANAN & AUDIT TRAIL
                  </h4>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Login 2FA/MFA</span>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                        Autentikasi dua faktor untuk perlindungan akses pengguna.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Role Based Access Control</span>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                        Akses disesuaikan peran dan tanggung jawab.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Enkripsi Data & Dokumen</span>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                        Data dan dokumen dienkripsi end-to-end untuk keamanan.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      <History className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Audit Trail Tidak Dapat Dihapus</span>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                        Seluruh aktivitas tercatat dan tidak dapat diubah atau dihapus.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Backup & Disaster Recovery</span>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                        Pencadangan rutin dan rencana pemulihan bencana tersedia.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">QR Code Verifikasi</span>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                        Verifikasi keaslian dokumen secara cepat dan aman.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                      <FileSignature className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Tanda Tangan Elektronik</span>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                        Dokumen ditandatangani secara elektronik yang sah dan tersertifikasi.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures Matrix & Confirmation Section */}
          <div className="border border-[#234b7d] rounded-xl p-5 bg-[#081224] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <FileSignature className="w-4 h-4 text-[#D4AF37]" />
                <span>Matriks Tanda Tangan Elektronik Multi-Pihak</span>
              </span>
              <span className="text-xs font-semibold text-[#D4AF37]">
                {permohonan.rekomendasiResmi.daftarPengesah.filter(p => p.status === 'disahkan').length} / {permohonan.rekomendasiResmi.daftarPengesah.length} Pengesahan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {permohonan.rekomendasiResmi.daftarPengesah.map((p) => (
                <div key={p.id} className="border border-[#1b3459] rounded-lg p-3 bg-[#0b172a] text-center flex flex-col justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">{p.jabatan}</p>
                    <p className="text-xs font-bold text-white mt-1">{p.nama}</p>
                    <p className="text-[10px] text-slate-400">{p.instansi}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1b3459]">
                    {p.status === 'disahkan' ? (
                      <div className="text-slate-200 space-y-0.5">
                        <span className="text-[10px] bg-[#0d1f38] text-slate-200 font-bold px-2 py-0.5 rounded block border border-[#1b3459]">
                          ✓ Telah Disahkan
                        </span>
                        <span className="text-[9px] text-[#D4AF37] block font-mono truncate">{p.tandaTanganDigitalHash}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] bg-[#0d1f38] text-[#D4AF37] font-semibold px-2 py-0.5 rounded block border border-[#1b3459]">
                        Menunggu Pengesahan
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bukti Penerimaan Pengaju */}
          {permohonan.rekomendasiResmi.buktiPenerimaanPengaju ? (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold block text-slate-200">Konfirmasi Tanda Terima Pengaju:</span>
                <span>Diterima oleh {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.diterimaOleh} pada {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.tanggalDiterima}</span>
              </div>
              <span className="font-mono font-bold bg-[#0b172a] text-slate-200 px-2 py-1 rounded border border-emerald-500/40">
                {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.nomorTandaTerima}
              </span>
            </div>
          ) : !effectiveReadonly && (currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU') && ((permohonan.applicationStatus === 'RESULTS_ISSUED' || permohonan.statusProsesUtama === 'rekomendasi_terbit') || (permohonan.followupStatus === 'VERIFIED_IMPLEMENTED' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut')) ? (
            <div className="p-4 bg-[#0d213d] border border-[#234b7d] rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white block">Konfirmasi Tanda Terima Berkas Resmi:</span>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Sebagai penyidik pemohon, Anda berhak menerima surat rekomendasi resmi e-TAT untuk kelengkapan berkas perkara penyidikan.
                </p>
              </div>
              <button
                onClick={handlePengajuSignReceipt}
                className="bg-gradient-to-r from-[#0d1f38] via-[#132644] to-[#1b3459] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-bold text-xs px-4 py-2 rounded-xl border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Tandatangani Tanda Terima</span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
