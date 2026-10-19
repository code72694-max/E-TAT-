import React from 'react';
import {
  UploadCloud,
  FileCheck,
  BadgeCheck,
  Image as ImageIcon,
  FileText,
  Trash2
} from 'lucide-react';
import { formatFileSize } from './constants';

interface Section4UploadBerkasProps {
  fotoKtpUrl: string;
  fotoKtpName: string;
  fotoKtpSize: number;
  fotoKtaUrl: string;
  fotoKtaName: string;
  fotoKtaSize: number;
  suratPenunjukanUrl: string;
  suratPenunjukanName: string;
  suratPenunjukanSize: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'ktp' | 'kta' | 'surat') => void;
  onRemoveFile: (type: 'ktp' | 'kta' | 'surat') => void;
}

export const Section4UploadBerkas: React.FC<Section4UploadBerkasProps> = ({
  fotoKtpUrl,
  fotoKtpName,
  fotoKtpSize,
  fotoKtaUrl,
  fotoKtaName,
  fotoKtaSize,
  suratPenunjukanUrl,
  suratPenunjukanName,
  suratPenunjukanSize,
  onFileUpload,
  onRemoveFile
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
        <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
        <div>
          <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
            4. Unggah Berkas & Identitas Kedinasan
          </h2>
          <p className="text-[11px] text-slate-400">
            Wajib melampirkan Foto KTP dan KTA Polri / BNN resmi untuk validasi dan persetujuan oleh Administrator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload KTP */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Foto KTP Pendaftar</span>
            </span>
            <span className="text-[10px] text-rose-400 font-bold">*Wajib Diunggah</span>
          </div>

          {fotoKtpUrl ? (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-[#1b3459] h-32 bg-slate-900 flex items-center justify-center">
                <img
                  src={fotoKtpUrl}
                  alt="Preview KTP"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 truncate max-w-[130px] font-mono" title={fotoKtpName}>
                  {fotoKtpName}
                </span>
                <div className="flex items-center space-x-2">
                  <label className="text-[#D4AF37] hover:underline cursor-pointer font-medium">
                    Ganti
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={e => onFileUpload(e, 'ktp')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onRemoveFile('ktp')}
                    className="text-rose-400 hover:text-rose-300 p-0.5"
                    title="Hapus KTP"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {fotoKtpSize > 0 && (
                <span className="text-[10px] text-slate-500 block font-mono">
                  Ukuran: {formatFileSize(fotoKtpSize)}
                </span>
              )}
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#1b3459] hover:border-[#D4AF37]/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#050e1a]/50 h-32">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-[11px] font-semibold text-slate-300">Pilih Foto KTP</span>
              <span className="text-[10px] text-slate-500 mt-0.5">JPG / PNG / WEBP maks 5MB</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => onFileUpload(e, 'ktp')}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Upload KTA */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Foto KTA Polri / BNN</span>
            </span>
            <span className="text-[10px] text-rose-400 font-bold">*Wajib Diunggah</span>
          </div>

          {fotoKtaUrl ? (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-[#1b3459] h-32 bg-slate-900 flex items-center justify-center">
                <img
                  src={fotoKtaUrl}
                  alt="Preview KTA"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 truncate max-w-[130px] font-mono" title={fotoKtaName}>
                  {fotoKtaName}
                </span>
                <div className="flex items-center space-x-2">
                  <label className="text-[#D4AF37] hover:underline cursor-pointer font-medium">
                    Ganti
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={e => onFileUpload(e, 'kta')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onRemoveFile('kta')}
                    className="text-rose-400 hover:text-rose-300 p-0.5"
                    title="Hapus KTA"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {fotoKtaSize > 0 && (
                <span className="text-[10px] text-slate-500 block font-mono">
                  Ukuran: {formatFileSize(fotoKtaSize)}
                </span>
              )}
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#1b3459] hover:border-[#D4AF37]/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#050e1a]/50 h-32">
              <BadgeCheck className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-[11px] font-semibold text-slate-300">Pilih Foto KTA</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Kartu Tanda Anggota (Maks 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => onFileUpload(e, 'kta')}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Upload Surat Tugas */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Surat Tugas / Sprint</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Opsional / Disarankan</span>
          </div>

          {suratPenunjukanUrl ? (
            <div className="space-y-2">
              <div className="rounded-lg border border-[#1b3459] h-32 bg-[#050e1a] p-3 flex flex-col items-center justify-center text-center">
                <FileCheck className="w-8 h-8 text-emerald-400 mb-1" />
                <span className="text-[11px] font-medium text-slate-200 line-clamp-2" title={suratPenunjukanName}>
                  {suratPenunjukanName}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 text-[10px] font-semibold">Tersedia</span>
                <div className="flex items-center space-x-2">
                  <label className="text-[#D4AF37] hover:underline cursor-pointer font-medium">
                    Ganti
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => onFileUpload(e, 'surat')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onRemoveFile('surat')}
                    className="text-rose-400 hover:text-rose-300 p-0.5"
                    title="Hapus Surat Tugas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {suratPenunjukanSize > 0 && (
                <span className="text-[10px] text-slate-500 block font-mono">
                  Ukuran: {formatFileSize(suratPenunjukanSize)}
                </span>
              )}
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#1b3459] hover:border-[#D4AF37]/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#050e1a]/50 h-32">
              <FileText className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-[11px] font-semibold text-slate-300">Unggah Surat Tugas</span>
              <span className="text-[10px] text-slate-500 mt-0.5">PDF / JPG maks 10MB</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => onFileUpload(e, 'surat')}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
