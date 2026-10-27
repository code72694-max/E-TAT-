import React from 'react';
import { FileCheck, Upload, CheckCircle2, Trash2 } from 'lucide-react';
import { getDocTemplates } from './types';

interface Step4KelengkapanDokumenProps {
  jenisPengajuan: string;
  uploadedDocIds: string[];
  uploadedDocUrls: Record<string, string>;
  uploadedDocNames: Record<string, string>;
  uploadingDocId: string | null;
  handleFileUpload: (docId: string, file: File) => void;
  handleRemoveDoc: (docId: string) => void;
}

export const Step4KelengkapanDokumen: React.FC<Step4KelengkapanDokumenProps> = ({
  jenisPengajuan,
  uploadedDocIds,
  uploadedDocUrls,
  uploadedDocNames,
  uploadingDocId,
  handleFileUpload,
  handleRemoveDoc,
}) => {
  const docTemplates = getDocTemplates(jenisPengajuan);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-bold text-white text-sm">Checklist Dokumen Lampiran Pengajuan</span>
          </div>
          <span className="text-xs text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20">
            {uploadedDocIds.length} Terunggah
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          Berdasarkan SOP TAT &amp; Perber 2014, lampirkan dokumen administratif yang dibutuhkan. Dokumen bertanda{' '}
          <span className="text-rose-400 font-bold">Wajib</span> harus dilengkapi dengan menekan tombol{' '}
          <strong className="text-white">Unggah</strong> untuk verifikasi Sekretariat.
        </p>
      </div>

      <div className="space-y-3">
        {docTemplates.map((doc, idx) => {
          const isUploaded = uploadedDocIds.includes(doc.id) && Boolean(uploadedDocUrls[doc.id] || uploadedDocNames[doc.id]);
          return (
            <div
              key={doc.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                isUploaded
                  ? 'border-emerald-500/40 bg-[#081528]'
                  : 'border-[#1b3459] bg-[#0b172a]'
              }`}
            >
              <div className="flex items-start sm:items-center space-x-3.5">
                {/* Sequence / Indicator */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 sm:mt-0 ${
                  isUploaded
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-[#10223b] border border-[#1b3860] text-[#D4AF37]'
                }`}>
                  {isUploaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : String(idx + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-xs md:text-sm">{doc.nama}</span>
                    {doc.wajib ? (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-semibold">
                        Wajib
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">
                        Bila Ada
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold border ${
                      isUploaded
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700'
                    }`}>
                      {isUploaded ? 'Telah Diunggah' : 'Belum Dilampirkan'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{doc.keterangan}</span>
                  {isUploaded && uploadedDocNames[doc.id] && (
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="truncate max-w-[260px] sm:max-w-md">{uploadedDocNames[doc.id]}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                {isUploaded && uploadedDocUrls[doc.id] && (
                  <a
                    href={uploadedDocUrls[doc.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 underline font-semibold px-2 py-1 rounded hover:bg-sky-500/10 transition-colors"
                    title="Buka dan lihat berkas yang diunggah"
                  >
                    Lihat
                  </a>
                )}

                {isUploaded && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors flex items-center space-x-1"
                    title="Hapus lampiran ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                )}

                <label
                  className={`cursor-pointer px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border flex items-center space-x-1.5 transition-colors text-xs ${
                    uploadingDocId === doc.id
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                      : isUploaded
                      ? 'bg-[#142642] border-[#234475] text-slate-300 hover:text-white'
                      : 'bg-[#1b3459] border-[#2d5289] text-[#D4AF37] hover:bg-[#284c80]'
                  }`}
                >
                  <Upload className={`w-3.5 h-3.5 ${uploadingDocId === doc.id ? 'animate-bounce' : ''}`} />
                  <span className="font-semibold text-xs">
                    {uploadingDocId === doc.id ? 'Proses...' : isUploaded ? 'Ganti' : 'Unggah'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    disabled={uploadingDocId === doc.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(doc.id, file);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
