import React from 'react';
import { FileCheck, Upload } from 'lucide-react';
import { getDocTemplates } from './types';

interface Step4KelengkapanDokumenProps {
  jenisPengajuan: string;
  uploadedDocIds: string[];
  toggleDocUpload: (docId: string) => void;
  uploadedDocUrls: Record<string, string>;
  uploadedDocNames: Record<string, string>;
  uploadingDocId: string | null;
  handleFileUpload: (docId: string, file: File) => void;
}

export const Step4KelengkapanDokumen: React.FC<Step4KelengkapanDokumenProps> = ({
  jenisPengajuan,
  uploadedDocIds,
  toggleDocUpload,
  uploadedDocUrls,
  uploadedDocNames,
  uploadingDocId,
  handleFileUpload,
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
          <span className="text-rose-400 font-bold">Wajib</span> harus dilengkapi untuk verifikasi Sekretariat.
        </p>
      </div>

      <div className="space-y-3">
        {docTemplates.map((doc) => {
          const isChecked = uploadedDocIds.includes(doc.id);
          return (
            <div
              key={doc.id}
              onClick={() => toggleDocUpload(doc.id)}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                isChecked
                  ? 'border-[#D4AF37] bg-[#081224]'
                  : 'border-[#1b3459] bg-[#0b172a] hover:bg-[#081224]'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="rounded text-[#D4AF37] accent-[#D4AF37] w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs md:text-sm">{doc.nama}</span>
                    {doc.wajib && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-semibold">
                        Wajib
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 block">{doc.keterangan}</span>
                  {isChecked && uploadedDocNames[doc.id] && (
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="truncate max-w-[260px] sm:max-w-md">{uploadedDocNames[doc.id]}</span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="flex items-center space-x-2 sm:space-x-3 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {isChecked && uploadedDocUrls[doc.id] && (
                  <a
                    href={uploadedDocUrls[doc.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 underline font-semibold px-2 py-1 rounded hover:bg-sky-500/10 transition-colors"
                    title="Buka dan lihat berkas yang tersimpan"
                  >
                    Lihat
                  </a>
                )}
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    uploadingDocId === doc.id
                      ? 'text-amber-400 animate-pulse'
                      : isChecked
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {uploadingDocId === doc.id
                    ? 'Mengunggah ke Cloud...'
                    : isChecked
                    ? 'Sudah Diunggah'
                    : 'Belum Dilampirkan'}
                </span>
                <label
                  className={`cursor-pointer px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border flex items-center space-x-1.5 transition-colors text-xs ${
                    uploadingDocId === doc.id
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                      : isChecked
                      ? 'bg-[#142642] border-[#234475] text-slate-300 hover:text-white'
                      : 'bg-[#1b3459] border-[#2d5289] text-[#D4AF37] hover:bg-[#284c80]'
                  }`}
                >
                  <Upload className={`w-3.5 h-3.5 ${uploadingDocId === doc.id ? 'animate-bounce' : ''}`} />
                  <span className="font-semibold text-xs">
                    {uploadingDocId === doc.id ? 'Proses...' : isChecked ? 'Ganti' : 'Unggah'}
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
