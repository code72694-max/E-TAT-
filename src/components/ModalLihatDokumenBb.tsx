import React, { useState } from 'react';
import { PermohonanAsesmen, DokumenPersyaratan, BarangBukti } from '../types';
import {
  X,
  FileText,
  Package,
  Eye,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  FileCheck,
  Calendar,
  User,
  Scale,
  Activity,
  Image as ImageIcon
} from 'lucide-react';

interface ModalLihatDokumenBbProps {
  isOpen: boolean;
  onClose: () => void;
  permohonan: PermohonanAsesmen | null;
}

export const ModalLihatDokumenBb: React.FC<ModalLihatDokumenBbProps> = ({
  isOpen,
  onClose,
  permohonan
}) => {
  const [activeTab, setActiveTab] = useState<'dokumen' | 'barang_bukti'>('dokumen');
  const [previewFile, setPreviewFile] = useState<{ title: string; type: 'pdf' | 'image'; url?: string } | null>(null);

  if (!isOpen || !permohonan) return null;

  const defaultMockDocs: DokumenPersyaratan[] = [
    {
      id: 'doc-1',
      nama: 'Surat Permohonan Resmi TAT dari Penyidik',
      wajib: true,
      fileName: 'Surat_Permohonan_TAT_Polresta_0128.pdf',
      fileSize: '1.8 MB',
      uploadedAt: permohonan.createdAt || '2026-09-08 09:30',
      statusVerifikasi: 'sesuai',
      versi: 1
    },
    {
      id: 'doc-2',
      nama: 'Fotokopi KTP / Identitas Terperiksa',
      wajib: true,
      fileName: 'KTP_Terperiksa_38720199201.jpg',
      fileSize: '840 KB',
      uploadedAt: permohonan.createdAt || '2026-09-08 09:32',
      statusVerifikasi: 'sesuai',
      versi: 1
    },
    {
      id: 'doc-3',
      nama: 'Laporan Polisi (LP / LKN)',
      wajib: true,
      fileName: 'Laporan_Polisi_LP-A-128-VIII-2026.pdf',
      fileSize: '2.4 MB',
      uploadedAt: permohonan.createdAt || '2026-09-08 09:35',
      statusVerifikasi: 'sesuai',
      versi: 1
    },
    {
      id: 'doc-4',
      nama: 'Berita Acara Interogasi / BAP Tersangka',
      wajib: true,
      fileName: 'BAP_Tersangka_Tindak_Pidana_Narkotika.pdf',
      fileSize: '3.1 MB',
      uploadedAt: permohonan.createdAt || '2026-09-08 09:40',
      statusVerifikasi: 'sesuai',
      versi: 1
    },
    {
      id: 'doc-5',
      nama: 'Surat Perintah Penangkapan & Penggeledahan',
      wajib: true,
      fileName: 'SP_Kap_Dah_Sita_Resnarkoba.pdf',
      fileSize: '1.9 MB',
      uploadedAt: permohonan.createdAt || '2026-09-08 09:42',
      statusVerifikasi: 'sesuai',
      versi: 1
    },
    {
      id: 'doc-6',
      nama: 'Berita Acara Penyitaan Barang Bukti',
      wajib: true,
      fileName: 'BA_Penyitaan_BB_Sabu_042g.pdf',
      fileSize: '1.4 MB',
      uploadedAt: permohonan.createdAt || '2026-09-08 09:45',
      statusVerifikasi: 'sesuai',
      versi: 1
    },
    {
      id: 'doc-7',
      nama: 'Surat Keterangan Hasil Pemeriksaan Urine (SKHPU)',
      wajib: true,
      fileName: 'SKHPU_Lab_Toksikologi_BNN_MET_Positif.pdf',
      fileSize: '1.1 MB',
      uploadedAt: permohonan.createdAt || '2026-09-08 10:00',
      statusVerifikasi: 'sesuai',
      versi: 1
    }
  ];

  const docs = permohonan.dokumenList && permohonan.dokumenList.length > 0 ? permohonan.dokumenList : defaultMockDocs;
  const barangBuktiList = permohonan.perkara.barangBuktiList || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#0b172a] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#1b3459] shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-[#1b3459] bg-[#0c1a30] flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#142642] border border-[#234475] flex items-center justify-center shrink-0 text-[#d4af37]">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm sm:text-base leading-tight truncate">
                Berkas Dokumen &amp; Barang Bukti Perkara
              </h2>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {permohonan.terperiksa.namaLengkap} • <span className="font-mono text-[#d4af37]">{permohonan.nomorPermohonan}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-4 sm:px-5 pt-3 border-b border-[#1b3459] bg-[#091426]">
          <button
            type="button"
            onClick={() => setActiveTab('dokumen')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'dokumen'
                ? 'border-[#d4af37] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-[#d4af37]" />
            <span>Dokumen Persyaratan &amp; Berkas Perkara ({docs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('barang_bukti')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'barang_bukti'
                ? 'border-[#d4af37] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Barang Bukti Sitaan ({barangBuktiList.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#071326]">
          
          {/* TAB 1: DOKUMEN PERSYARATAN & PENYIDIKAN */}
          {activeTab === 'dokumen' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]/60">
                <span className="text-xs text-slate-400">
                  Daftar dokumen resmi yang dilampirkan oleh penyidik pengaju untuk penelaahan TAT:
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  Semua Berkas Terverifikasi
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {docs.map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    className="p-3.5 bg-[#0b172a] border border-[#1b3459] hover:border-[#234475] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className="p-2 rounded-lg bg-[#142642] text-[#d4af37] shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold text-white truncate">{doc.nama}</p>
                          {doc.wajib && (
                            <span className="text-[9px] font-mono uppercase bg-rose-950/60 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800 shrink-0">
                              Wajib
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                          {doc.fileName || 'Dokumen_Berkas_Perkara.pdf'} • {doc.fileSize || '2.1 MB'} • Diunggah: {doc.uploadedAt || '2026-09-08'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewFile({ title: doc.nama, type: 'pdf', url: doc.fileName })}
                        className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-[#234475] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Lihat Dokumen</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BARANG BUKTI */}
          {activeTab === 'barang_bukti' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]/60">
                <span className="text-xs text-slate-400">
                  Data sitaan barang bukti narkotika &amp; non-narkotika dari TKP penangkapan:
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  LP: {permohonan.perkara.nomorLaporanPolisi}
                </span>
              </div>

              {barangBuktiList.length === 0 ? (
                <div className="text-center py-10 bg-[#0b172a] rounded-xl border border-[#1b3459] text-slate-400 text-xs">
                  Tidak ada barang bukti terdaftar (Kasus Penangkapan Tanpa BB).
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barangBuktiList.map((bb, idx) => (
                    <div
                      key={bb.id || idx}
                      className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 space-y-3 shadow-md"
                    >
                      <div className="flex items-start justify-between pb-2 border-b border-[#1b3459]">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Item BB #{idx + 1}</span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{bb.jenisZat}</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-600/50">
                          {bb.statusKategoriBb || 'Memenuhi Batas SEMA'}
                        </span>
                      </div>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-[#050e1c] rounded-xl border border-[#1b3459]">
                          <span className="text-[10px] text-slate-400 block">Berat Bersih (Netto):</span>
                          <span className="text-sm font-extrabold text-[#d4af37] font-mono">{bb.beratBersihGram} Gram</span>
                        </div>
                        <div className="p-2.5 bg-[#050e1c] rounded-xl border border-[#1b3459]">
                          <span className="text-[10px] text-slate-400 block">Berat Kotor (Bruto):</span>
                          <span className="text-sm font-extrabold text-slate-200 font-mono">{bb.beratKotorGram || bb.beratBersihGram + 0.15} Gram</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <p><strong>Status Uji Lab:</strong> <span className="text-emerald-400 font-bold uppercase">{bb.statusUjiLab || 'Positif Metamfetamina'}</span></p>
                        <p><strong>Nomor Surat Uji Lab:</strong> <span className="font-mono text-slate-300">{bb.nomorSuratLab || 'LAB-FOR/098/VIII/2026/SAMARINDA'}</span></p>
                        <p><strong>Tanggal Uji Lab:</strong> <span className="text-slate-300">{bb.tanggalSuratLab || '08 September 2026'}</span></p>
                      </div>

                      {/* Foto Dokumentasi BB Card Preview */}
                      <div className="pt-2 border-t border-[#1b3459]">
                        <button
                          type="button"
                          onClick={() => setPreviewFile({ title: `Foto Dokumentasi Barang Bukti ${bb.jenisZat}`, type: 'image' })}
                          className="w-full py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-[#234475]"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Lihat Foto Dokumentasi Sitaan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1b3459] bg-[#0c1a30] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#142642] hover:bg-[#1b3459] text-white font-bold rounded-xl text-xs border border-[#234475] transition-colors cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>

      {/* Lightbox / Preview Submodal */}
      {previewFile && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
          <div className="bg-[#0b172a] rounded-2xl border border-[#234475] p-5 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-bold text-sm text-white">{previewFile.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document / Image Simulation Mock Viewer */}
            <div className="bg-[#050e1c] rounded-xl border border-[#1b3459] p-6 text-center space-y-3 min-h-[260px] flex flex-col items-center justify-center">
              {previewFile.type === 'image' ? (
                <div className="space-y-3">
                  <div className="w-48 h-32 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center mx-auto text-slate-400">
                    <ImageIcon className="w-12 h-12 text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">Foto Dokumentasi Timbangan &amp; Klip Sitaan Barang Bukti</p>
                  <p className="text-[11px] text-slate-500 font-mono">Resolusi: 1920x1080 • Geotag: Polresta Samarinda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <FileText className="w-12 h-12 text-[#d4af37] mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">Pratinjau Berkas Dokumen Resmi Tersertifikasi</p>
                  <p className="text-[11px] text-slate-500 font-mono">Format PDF Digital • Ditandatangani Elektronik (BSrE)</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => alert(`Mengunduh salinan berkas: ${previewFile.title}`)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-2 border border-[#234475] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Unduh Salinan Berkas</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-[#0d1f38] text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
