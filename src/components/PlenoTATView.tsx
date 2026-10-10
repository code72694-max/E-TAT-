import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Users, ArrowRight, FileText, Edit } from 'lucide-react';
import { BeritaAcaraModal } from './BeritaAcaraModal';
import { FormHasilPlenoModal } from './FormHasilPlenoModal';
import { sidangPlenoApi } from '../services/api';

interface PlenoTATViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onUpdatePermohonan?: (id: string, updated: any) => void;
}

export const PlenoTATView: React.FC<PlenoTATViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onUpdatePermohonan
}) => {
  const [baPermohonan, setBaPermohonan] = useState<PermohonanAsesmen | null>(null);
  const [formPlenoItem, setFormPlenoItem] = useState<PermohonanAsesmen | null>(null);

  const handleSavePleno = async (permohonanId: string, payload: any) => {
    try {
      const response = await sidangPlenoApi.simpanHasil(permohonanId, payload);
      
      if (response.success && onUpdatePermohonan) {
        // Find existing permohonan to merge
        const existing = permohonanList.find(p => p.id === permohonanId);
        if (existing) {
          const updatedPermohonan = {
            ...existing,
            sidangPleno: response.data,
            statusProsesUtama: payload.statusPleno === 'selesai_sepakat' 
              ? 'pengesahan_rekomendasi' 
              : existing.statusProsesUtama,
            applicationStatus: payload.statusPleno === 'selesai_sepakat' 
              ? 'RESULTS_ISSUED' 
              : existing.applicationStatus
          };
          onUpdatePermohonan(permohonanId, updatedPermohonan);
        }
      }
      setFormPlenoItem(null);
    } catch (error) {
      console.error("Failed to save hasil pleno", error);
      alert("Gagal menyimpan hasil pleno.");
    }
  };

  const handleUploadBA = async (permohonanId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await sidangPlenoApi.uploadBeritaAcara(permohonanId, formData);
      if (response.success && onUpdatePermohonan) {
        const existing = permohonanList.find(p => p.id === permohonanId);
        if (existing) {
          onUpdatePermohonan(permohonanId, { ...existing, sidangPleno: response.data });
        }
        alert('Berita Acara berhasil diunggah.');
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Gagal mengunggah Berita Acara.");
    }
  };

  const plenoList = permohonanList.filter(p => 
    ['siap_pleno', 'pembahasan_pleno', 'pengesahan_rekomendasi', 'rekomendasi_terbit'].includes(p.statusProsesUtama)
  );

  return (
    <div className="space-y-5">
      {baPermohonan && (
        <BeritaAcaraModal
          permohonan={baPermohonan}
          onClose={() => setBaPermohonan(null)}
        />
      )}

      {formPlenoItem && (
        <FormHasilPlenoModal
          permohonan={formPlenoItem}
          onClose={() => setFormPlenoItem(null)}
          onSave={handleSavePleno}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#d4af37]" />
            <span>Sidang Pleno Musyawarah Tim Asesmen Terpadu</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Forum musyawarah terpadu antara Tim Medis, Tim Hukum, dan Penyidik untuk merumuskan rekomendasi resmi bersama.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plenoList.map(item => {
          const isDone = item.sidangPleno?.statusPleno === 'selesai';
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#d4af37]/60 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer space-y-3 shadow-md group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-mono font-bold text-xs text-[#d4af37] group-hover:underline">{item.nomorPermohonan}</span>
                    <span className="text-xs text-slate-300">&bull; Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong></span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No. Berita Acara: <strong className="text-slate-200">{item.sidangPleno?.nomorBeritaAcara || 'Menunggu Penyusunan'}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isDone ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[#142642] text-slate-200 border-[#234475]'
                  }`}>
                    {isDone ? 'Pleno Selesai' : 'Siap Diperiksa / Berlangsung'}
                  </span>
                </div>
              </div>

              {/* Side by side preview Medis vs Hukum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#d4af37] block">ASPEK MEDIS:</span>
                  <p className="font-semibold text-white leading-snug">{item.asesmenMedis?.diagnosisKlinisIcd || 'Dalam proses'}</p>
                  <p className="text-slate-400 text-[11px]">Usulan: {item.asesmenMedis?.kebutuhanRawat} ({item.asesmenMedis?.durasiUsulanBulan} Bulan)</p>
                </div>

                <div className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#d4af37] block">ASPEK HUKUM:</span>
                  <p className="font-semibold text-white leading-snug">{item.asesmenHukum?.analisisPeran || 'Dalam proses'}</p>
                  <p className="text-slate-400 text-[11px]">Rekomendasi: {item.asesmenHukum?.rekomendasiHukum}</p>
                </div>
              </div>

              {/* Kesepakatan Final + Tombol BA */}
              {item.sidangPleno?.kesepakatanRekomendasi && (
                <div className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#d4af37] block">KESEPAKATAN MUSYAWARAH PLENO:</span>
                    <span className="font-semibold text-white text-xs leading-snug block">{item.sidangPleno.kesepakatanRekomendasi}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                    <label className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer border border-[#234475] transition-colors flex-1 sm:flex-none">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadBA(item.id, file);
                          e.target.value = '';
                        }}
                      />
                      <span>{item.sidangPleno.fileBeritaAcaraSigned ? 'Ubah BA Tersimpan' : 'Unggah BA TTD'}</span>
                    </label>
                    <button
                      onClick={(e) => { e.stopPropagation(); setBaPermohonan(item); }}
                      className="bg-[#d4af37] hover:bg-[#e8c84a] text-[#0b172a] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shrink-0 transition-colors flex-1 sm:flex-none"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{item.sidangPleno.fileBeritaAcaraSigned ? 'Lihat Draf / Cetak' : 'Lihat Berita Acara'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {item.sidangPleno.fileBeritaAcaraSigned && (
                       <a 
                         href={item.sidangPleno.fileBeritaAcaraSigned} 
                         target="_blank" 
                         rel="noreferrer"
                         onClick={e => e.stopPropagation()}
                         className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shrink-0 transition-colors flex-1 sm:flex-none"
                       >
                         Lihat PDF Final
                       </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tombol Input Hasil Pleno / BA */}
              {!item.sidangPleno?.kesepakatanRekomendasi ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setFormPlenoItem(item); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#1b3459] text-white hover:bg-[#234475] transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Input Hasil Pleno
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setBaPermohonan(item); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-[#1b3459] text-slate-300 hover:border-[#d4af37]/50 hover:text-[#d4af37] transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    Draft Berita Acara
                  </button>
                </div>
              ) : (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setFormPlenoItem(item); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#1b3459] text-white hover:bg-[#234475] transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Revisi Pleno
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
