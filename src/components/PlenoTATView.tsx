import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { Users, FileText, Edit, Clock, CheckCircle2, PenTool, Eye, Share2, Printer, ArrowRight, QrCode } from 'lucide-react';
import { BeritaAcaraModal } from './BeritaAcaraModal';
import { FormHasilPlenoModal } from './FormHasilPlenoModal';
import { ModalUploadTtdDigital } from './ModalUploadTtdDigital';
import { SuratPengantarTersangkaModal } from './SuratPengantarTersangkaModal';
import { sidangPlenoApi } from '../services/api';

interface PlenoTATViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
}

export const PlenoTATView: React.FC<PlenoTATViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onUpdatePermohonan
}) => {
  const [baPermohonan, setBaPermohonan] = useState<PermohonanAsesmen | null>(null);
  const [formPlenoItem, setFormPlenoItem] = useState<PermohonanAsesmen | null>(null);
  const [uploadTtdItem, setUploadTtdItem] = useState<PermohonanAsesmen | null>(null);
  const [suratPengantarItem, setSuratPengantarItem] = useState<PermohonanAsesmen | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat'>('aktif');

  // Check if viewing from role Hukum or /hukum route
  const isHukum = currentUser?.role?.toUpperCase() === 'HUKUM' || 
    (typeof window !== 'undefined' && window.location.pathname.includes('/hukum'));

  const handleTeruskanKeTindakLanjut = (item: PermohonanAsesmen) => {
    const kodeLacak = (item as any).kodeLacakRehab || `RHB-${item.id.slice(-6).toUpperCase()}`;
    const noSuratRujukan = (item.tindakLanjut as any)?.nomorSuratRujukan || `SR-TAT/2026/09/${item.id.slice(-4)}`;
    const faskes = item.sidangPleno?.fasilitasRujukanUsulan || 'Balai Besar Rehabilitasi BNN Tanah Merah';

    const updated: PermohonanAsesmen = {
      ...item,
      tindakLanjutDiteruskan: true,
      tanggalDiteruskanTindakLanjut: new Date().toISOString(),
      statusProsesUtama: 'selesai_tindak_lanjut',
      applicationStatus: 'RESULTS_ISSUED',
      kodeLacakRehab: kodeLacak,
      nomorSuratPengantarTersangka: noSuratRujukan,
      tindakLanjut: {
        ...(item.tindakLanjut || {
          id: `tl-${Date.now()}`,
          jenisTindakLanjut: 'Rujukan Rehabilitasi',
          statusRujukan: 'sedang_dikoordinasikan',
          namaFasilitasTujuan: faskes,
          penanggungJawabTindakLanjut: item.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju Satresnarkoba',
          terakhirDiperbarui: new Date().toISOString()
        }),
        nomorSuratRujukan: noSuratRujukan,
        kodeLacakRehab: kodeLacak,
        tanggalRujukanDikirim: new Date().toISOString()
      } as any,
      pengawasanKlien: item.pengawasanKlien || {
        id: `pgw-${Date.now()}`,
        statusKepatuhan: 'sangat_patuh',
        modalitasLayanan: (item.sidangPleno?.kesepakatanRekomendasi?.toLowerCase().includes('inap') ? 'Rawat Inap' : 'Rawat Jalan') as any,
        durasiBulan: 3,
        tanggalMulai: new Date().toISOString().slice(0, 10),
        tanggalTargetSelesai: '3 Bulan Sejak Masuk',
        instansiPelaksanaRehab: faskes,
        konselorPendamping: 'Konselor Adiksi BNN',
        penyidikPengawas: item.perkara?.namaPenyidik || 'Penyidik Pengawas',
        totalSesiWajib: 12,
        sesiTerselesaikan: 0,
        jumlahMangkir: 0,
        suratPeringatanList: [],
        riwayatTesUrinBerkala: [],
        jurnalPengawasan: [],
        rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
      },
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleString('id-ID'),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pelimpahan ke Modul Tindak Lanjut',
          rincian: `Hasil Sidang Pleno diteruskan ke modul Tindak Lanjut. Kode Lacak Klien: ${kodeLacak}. Surat Pengantar: ${noSuratRujukan}.`
        },
        ...(item.auditLogs || [])
      ]
    };

    if (onUpdatePermohonan) {
      onUpdatePermohonan(updated);
    }

    setToastMsg(`Berkas ${item.nomorPermohonan} (${item.terperiksa.namaLengkap}) Berhasil Diteruskan ke Menu Tindak Lanjut! Kode Lacak: ${kodeLacak}`);
    setSuratPengantarItem(updated);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const handleSavePleno = async (permohonanId: string, payload: any) => {
    try {
      const response = await sidangPlenoApi.simpanHasil(permohonanId, payload);
      
      if (response.success && onUpdatePermohonan) {
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

  const handleUploadBA = async (permohonanId: string, file: File): Promise<string> => {
    // Read file as Data URL for immediate local display and persistence
    const fileDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    });

    try {
      localStorage.setItem(`etat_ttd_hukum_${permohonanId}`, fileDataUrl);
      const existing = permohonanList.find(p => p.id === permohonanId);
      if (existing) {
        localStorage.setItem(`etat_ttd_hukum_${existing.nomorPermohonan}`, fileDataUrl);
      }
    } catch {}

    let uploadedUrl = fileDataUrl;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileBeritaAcara', file);

      const response = await sidangPlenoApi.uploadBeritaAcara(permohonanId, formData);
      if (response && response.success && response.data?.fileBeritaAcaraSigned) {
        uploadedUrl = response.data.fileBeritaAcaraSigned;
      }
    } catch (error) {
      console.warn("Backend upload notice, using client data URL:", error);
    }

    if (onUpdatePermohonan) {
      const existing = permohonanList.find(p => p.id === permohonanId);
      if (existing) {
        const updatedPermohonan = {
          ...existing,
          sidangPleno: {
            ...(existing.sidangPleno || {
              id: `pleno-${Date.now()}`,
              permohonanId,
              nomorBeritaAcara: `BA-PLENO/TAT/${new Date().getFullYear()}/${existing.nomorPermohonan.replace(/[^0-9]/g, '')}`,
              tanggalPleno: new Date().toISOString().split('T')[0],
              statusPleno: 'selesai',
              kesepakatanRekomendasi: 'Disepakati rekomendasi rehabilitasi medis rawat inap.'
            }),
            fileBeritaAcaraSigned: uploadedUrl,
            ttdHukumUrl: uploadedUrl,
            statusPleno: 'selesai' as any
          }
        };
        onUpdatePermohonan(updatedPermohonan);
      }
    }
    return uploadedUrl;
  };

  const plenoList = permohonanList.filter(p => 
    ['siap_pleno', 'pembahasan_pleno', 'pengesahan_rekomendasi', 'rekomendasi_terbit', 'selesai_tindak_lanjut'].includes(p.statusProsesUtama) ||
    Boolean(p.sidangPleno)
  );

  // Tab Filtering: Jika sudah upload TTD maka masuk ke Riwayat (beres)
  const aktifCases = plenoList.filter(p => !p.sidangPleno?.fileBeritaAcaraSigned);
  const riwayatCases = plenoList.filter(p => Boolean(p.sidangPleno?.fileBeritaAcaraSigned));

  const displayedCases = activeTab === 'aktif' ? aktifCases : riwayatCases;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {baPermohonan && (
        <BeritaAcaraModal
          permohonan={baPermohonan}
          currentUser={currentUser}
          onClose={() => setBaPermohonan(null)}
        />
      )}

      {suratPengantarItem && (
        <SuratPengantarTersangkaModal
          permohonan={suratPengantarItem}
          currentUser={currentUser}
          onClose={() => setSuratPengantarItem(null)}
        />
      )}

      {toastMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-in fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {formPlenoItem && (
        <FormHasilPlenoModal
          permohonan={formPlenoItem}
          onClose={() => setFormPlenoItem(null)}
          onSave={handleSavePleno}
        />
      )}

      {uploadTtdItem && (
        <ModalUploadTtdDigital
          isOpen={Boolean(uploadTtdItem)}
          onClose={() => setUploadTtdItem(null)}
          permohonanNomor={uploadTtdItem.nomorPermohonan}
          asesorNama={currentUser.name.replace(/\[TEST\]\s*/gi, '').trim()}
          peranTitle={currentUser.position || (currentUser.role?.toUpperCase() === 'HUKUM' ? 'Tim Asesor Hukum TAT' : 'Tim Asesor Medis TAT')}
          onSaveSignature={async (file) => {
            await handleUploadBA(uploadTtdItem.id, file);
          }}
          onOpenBeritaAcara={() => {
            const currentItem = permohonanList.find(p => p.id === uploadTtdItem.id) || uploadTtdItem;
            let sig: string | null = null;
            try {
              sig = localStorage.getItem(`etat_ttd_hukum_${currentItem.id}`) || localStorage.getItem(`etat_ttd_hukum_${currentItem.nomorPermohonan}`);
            } catch {}
            const updated = {
              ...currentItem,
              sidangPleno: {
                ...(currentItem.sidangPleno || {}),
                fileBeritaAcaraSigned: sig || currentItem.sidangPleno?.fileBeritaAcaraSigned,
                ttdHukumUrl: sig || (currentItem.sidangPleno as any)?.ttdHukumUrl,
                statusPleno: 'selesai' as any
              }
            };
            setUploadTtdItem(null);
            setBaPermohonan(updated as any);
          }}
        />
      )}

      {/* Header Info */}
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

      {/* 2 Tabs: Aktif vs Riwayat */}
      <div className="flex items-center space-x-2 border-b border-[#1b3459] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('aktif')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'aktif'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500'
              : 'bg-[#0b172a] text-slate-400 hover:text-slate-200 border border-[#1b3459] hover:bg-[#142642]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pleno Aktif / Menunggu TTD</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
            activeTab === 'aktif' ? 'bg-blue-800 text-white' : 'bg-[#142642] text-slate-300'
          }`}>
            {aktifCases.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riwayat')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'riwayat'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-500'
              : 'bg-[#0b172a] text-slate-400 hover:text-slate-200 border border-[#1b3459] hover:bg-[#142642]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Riwayat Pleno (Selesai TTD)</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
            activeTab === 'riwayat' ? 'bg-emerald-800 text-white' : 'bg-[#142642] text-slate-300'
          }`}>
            {riwayatCases.length}
          </span>
        </button>
      </div>

      {/* Case List Display */}
      <div className="grid grid-cols-1 gap-4">
        {displayedCases.length === 0 ? (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-10 text-center space-y-3">
            {activeTab === 'aktif' ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-emerald-400/80 mx-auto" />
                <h3 className="text-base font-bold text-white">Tidak Ada Pleno Aktif</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Semua berkas sidang pleno telah selesai diunggah tanda tangan (TTD) dan diarsipkan ke tab Riwayat.
                </p>
              </>
            ) : (
              <>
                <Clock className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">Belum Ada Riwayat Pleno Selesai</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Sidang pleno yang telah mengunggah berkas Berita Acara bertanda tangan akan otomatis masuk ke daftar ini.
                </p>
              </>
            )}
          </div>
        ) : (
          displayedCases.map(item => {
            const hasSignedBA = Boolean(item.sidangPleno?.fileBeritaAcaraSigned);

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
                      hasSignedBA
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : item.sidangPleno?.kesepakatanRekomendasi
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-[#142642] text-slate-200 border-[#234475]'
                    }`}>
                      {hasSignedBA
                        ? 'Pleno Selesai (TTD Sah)'
                        : item.sidangPleno?.kesepakatanRekomendasi
                        ? 'Menunggu Unggah TTD'
                        : 'Siap Diperiksa / Berlangsung'}
                    </span>
                  </div>
                </div>

                {/* Side by side preview Medis vs Hukum */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#d4af37] block">ASPEK MEDIS:</span>
                    <p className="font-semibold text-white leading-snug">{item.asesmenMedis?.diagnosisKlinisIcd || 'Dalam proses'}</p>
                    <p className="text-slate-400 text-[11px]">Usulan: {item.asesmenMedis?.kebutuhanRawat || '-'} ({item.asesmenMedis?.durasiUsulanBulan || 0} Bulan)</p>
                  </div>

                  <div className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#d4af37] block">ASPEK HUKUM:</span>
                    <p className="font-semibold text-white leading-snug">{item.asesmenHukum?.analisisPeran || 'Dalam proses'}</p>
                    <p className="text-slate-400 text-[11px]">Rekomendasi: {item.asesmenHukum?.rekomendasiHukum || '-'}</p>
                  </div>
                </div>

                {/* Kesepakatan Final + Tombol Aksi */}
                {item.sidangPleno?.kesepakatanRekomendasi && (
                  <div className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-[#d4af37] block">KESEPAKATAN MUSYAWARAH PLENO:</span>
                      <span className="font-semibold text-white text-xs leading-snug block">{item.sidangPleno.kesepakatanRekomendasi}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto flex-wrap">
                      {/* Tombol Buka Modal TTD Digital */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadTtdItem(item);
                        }}
                        className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer border border-[#234475] transition-colors flex-1 sm:flex-none shadow-sm"
                      >
                        <PenTool className="w-3.5 h-3.5 text-blue-400" />
                        <span>{hasSignedBA ? 'Ubah TTD Asesor' : 'Unggah TTD Digital'}</span>
                      </button>

                      {/* Lihat Berita Acara Draf - DIHIDE untuk /hukum/dashboard/pleno */}
                      {!isHukum && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setBaPermohonan(item); }}
                          className="bg-[#d4af37] hover:bg-[#e8c84a] text-[#0b172a] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shrink-0 transition-colors flex-1 sm:flex-none shadow-sm cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{hasSignedBA ? 'Lihat Draf / Cetak' : 'Lihat Berita Acara'}</span>
                        </button>
                      )}

                      {/* Tombol Lihat Berita Acara dengan TTD yang sudah tertempel */}
                      {hasSignedBA && (
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBaPermohonan(item);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shrink-0 transition-colors flex-1 sm:flex-none shadow-md shadow-emerald-950/40 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Berita Acara (TTD)</span>
                        </button>
                      )}

                      {/* Tombol Teruskan ke Tindak Lanjut (Selesai Pleno) */}
                      {hasSignedBA && !isHukum && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeruskanKeTindakLanjut(item);
                          }}
                          className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shrink-0 transition-all cursor-pointer shadow-md flex-1 sm:flex-none ${
                            item.tindakLanjutDiteruskan
                              ? 'bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 text-blue-300'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40'
                          }`}
                        >
                          <Share2 className="w-3.5 h-3.5 text-blue-200" />
                          <span>{item.tindakLanjutDiteruskan ? '✓ Diteruskan ke Tindak Lanjut' : 'Teruskan ke Tindak Lanjut'}</span>
                        </button>
                      )}

                      {/* Dokumen Surat Tersangka dengan Kode Lacak */}
                      {hasSignedBA && !isHukum && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSuratPengantarItem(item);
                          }}
                          className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 hover:text-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shrink-0 transition-colors shadow-sm cursor-pointer flex-1 sm:flex-none"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Dokumen Surat Tersangka</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tombol Input Hasil Pleno / Revisi */}
                {!item.sidangPleno?.kesepakatanRekomendasi ? (
                  <div className="flex flex-wrap justify-end gap-2 pt-1">
                    {!isHukum && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setFormPlenoItem(item); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#1b3459] text-white hover:bg-[#234475] transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        Input Hasil Pleno
                      </button>
                    )}
                    {!isHukum && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setBaPermohonan(item); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-[#1b3459] text-slate-300 hover:border-[#d4af37]/50 hover:text-[#d4af37] transition-colors cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        Draft Berita Acara
                      </button>
                    )}
                  </div>
                ) : (
                  !isHukum && (
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setFormPlenoItem(item); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#1b3459] text-white hover:bg-[#234475] transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        Revisi Pleno
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
