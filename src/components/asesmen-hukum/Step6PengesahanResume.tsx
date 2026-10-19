import React from 'react';
import { FileSignature, CheckCircle2, Save } from 'lucide-react';
import { UserProfile } from '../../types';
import { FormDataHukum, FaktaItem } from './types';

interface Step6PengesahanResumeProps {
  formData: FormDataHukum;
  faktaList: FaktaItem[];
  currentUser: UserProfile;
  isReadOnlyView: boolean;
  onSaveDraft: () => void;
  onFinalize: () => void;
  onCloseCase: () => void;
}

export const Step6PengesahanResume: React.FC<Step6PengesahanResumeProps> = ({
  formData,
  faktaList,
  currentUser,
  isReadOnlyView,
  onSaveDraft,
  onFinalize,
  onCloseCase,
}) => {
  return (
    <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-5 shadow-md">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
        <FileSignature className="w-4 h-4 text-blue-400" />
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Pengesahan Lembar Telaah Asesmen Hukum TAT</h3>
      </div>

      {/* Summary Review Card */}
      <div className="bg-[#050e1c] p-4 rounded-xl border border-[#1b3459] space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-3 border-b border-[#1b3459]">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Kualifikasi Peran</span>
            <p className="text-base font-extrabold text-[#d4af37] mt-0.5">{formData.analisisPeran}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Kesesuaian SEMA 04/2010</span>
            <p className="text-xs font-bold text-emerald-400 mt-0.5">{formData.totalBeratBersihGram} Gram (Memenuhi SEMA)</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Rekomendasi Tindak Lanjut</span>
            <p className="text-xs font-bold text-blue-300 mt-0.5">{formData.rekomendasiHukum}</p>
          </div>
        </div>

        <div className="text-slate-300 text-[11px] leading-relaxed">
          <p><strong>Fakta Terverifikasi:</strong> {faktaList.filter(f => f.checked).length} dari {faktaList.length} Indikator Terpenuhi</p>
          <p className="mt-1"><strong>Kesimpulan Yuridis:</strong> {formData.kesimpulanHukum}</p>
          <p className="mt-1"><strong>Penelaah Hukum:</strong> {currentUser.name} ({currentUser.agency})</p>
        </div>
      </div>

      {/* Actions */}
      {isReadOnlyView ? (
        <div className="bg-blue-950/40 border border-blue-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Asesmen Hukum Telah Difinalisasi</h4>
              <p className="text-[11px] text-blue-300/80">
                Berkas telaah yuridis ini telah selesai dan tersimpan di Riwayat Asesmen Hukum (Siap Pleno TAT).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseCase}
            className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Kembali ke Daftar
          </button>
        </div>
      ) : (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-slate-400 text-xs italic">
            * Simpan draf jika telaah belum rampung, atau Finalisasi jika sudah siap dibawa ke Sidang Pleno TAT.
          </span>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onSaveDraft}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 border border-[#234475] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-300" />
              <span>Simpan Draf Hukum</span>
            </button>
            <button
              type="button"
              onClick={onFinalize}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalisasi &amp; Teruskan ke Pleno</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
