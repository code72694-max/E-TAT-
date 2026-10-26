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
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('aktif')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs transition-all cursor-pointer ${
            activeTab === 'aktif'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-300" />
          <span>Pleno Aktif / Menunggu TTD</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
            activeTab === 'aktif' ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-slate-400'
          }`}>
            {aktifCases.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riwayat')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs transition-all cursor-pointer ${
            activeTab === 'riwayat'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
          <span>Riwayat Pleno (Selesai TTD)</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
            activeTab === 'riwayat' ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-slate-400'
          }`}>
            {riwayatCases.length}
          </span>
        </button>
      </div>

      {/* Case List Display */}
      <div className="grid grid-cols-1 gap-3.5">
        {displayedCases.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-10 text-center space-y-2">
            {activeTab === 'aktif' ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-200">Tidak Ada Pleno Aktif</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Semua berkas sidang pleno telah selesai diunggah tanda tangan (TTD) dan diarsipkan ke tab Riwayat.
                </p>
              </>
            ) : (
              <>
                <Clock className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-200">Belum Ada Riwayat Pleno Selesai</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Sidang pleno yang telah mengunggah berkas Berita Acara bertanda tangan akan otomatis masuk ke daftar ini.
                </p>
              </>
            )}
          </div>
        ) : (
          displayedCases.map(item => {
            const hasSignedBA = Boolean(item.sidangPleno?.fileBeritaAcaraSigned);
            const isDiteruskan = Boolean(item.tindakLanjutDiteruskan || (item as any).statusProsesUtama === 'selesai_tindak_lanjut' || Boolean(item.tindakLanjut));

            return (
              <div
                key={item.id}
                onClick={() => onSelectPermohonan(item.id)}
                className="bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all cursor-pointer space-y-3.5 shadow-sm group"
              >
                {/* Header: Client Info & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.terperiksa.namaLengkap.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-100">
                          {item.terperiksa.namaLengkap}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                          {item.nomorPermohonan}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                        <span>No. BA: <span className="text-slate-300 font-mono">{item.sidangPleno?.nomorBeritaAcara || 'Menunggu Penyusunan'}</span></span>
                        <span className="text-slate-600">•</span>
                        <span>Penyidik: <span className="text-slate-300">{item.perkara?.namaPenyidik || '-'}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:self-start">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                      hasSignedBA
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : item.sidangPleno?.kesepakatanRekomendasi
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {hasSignedBA ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Pleno Selesai (TTD Sah)</span>
                        </>
                      ) : item.sidangPleno?.kesepakatanRekomendasi ? (
                        <>
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Menunggu Unggah TTD</span>
                        </>
                      ) : (
                        <span>Siap Diperiksa</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Compact Aspek Medis & Hukum 2-Column Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Aspek Medis</span>
                    <p className="text-slate-200 font-medium truncate">{item.asesmenMedis?.diagnosisKlinisIcd || 'Dalam proses'}</p>
                    <p className="text-slate-400 text-[11px]">Usulan: {item.asesmenMedis?.kebutuhanRawat || '-'} ({item.asesmenMedis?.durasiUsulanBulan || 0} Bln)</p>
                  </div>

                  <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Aspek Hukum</span>
                    <p className="text-slate-200 font-medium truncate">{item.asesmenHukum?.analisisPeran || 'Dalam proses'}</p>
                    <p className="text-slate-400 text-[11px]">Rekomendasi: {item.asesmenHukum?.rekomendasiHukum || '-'}</p>
                  </div>
                </div>

                {/* Kesepakatan Final Musyawarah Pleno */}
                {item.sidangPleno?.kesepakatanRekomendasi && (
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Kesepakatan Musyawarah Pleno:</span>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {item.sidangPleno.kesepakatanRekomendasi}
                    </p>
                  </div>
                )}

                {/* Minimalist Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/70">
                  {/* Left: Status / Aksi Teruskan ke Tindak Lanjut */}
                  <div>
                    {hasSignedBA && !isHukum && (
                      isDiteruskan ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Diteruskan ke Tindak Lanjut</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeruskanKeTindakLanjut(item);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm border border-blue-500/30"
                        >
                          <Share2 className="w-3.5 h-3.5 text-blue-200" />
                          <span>Teruskan ke Tindak Lanjut</span>
                        </button>
                      )
                    )}
                  </div>

                  {/* Right: Unified Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Dokumen Surat Tersangka */}
                    {hasSignedBA && !isHukum && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSuratPengantarItem(item);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dokumen Surat Tersangka</span>
                      </button>
                    )}

                    {/* Berita Acara (Satu Tombol Jelas) */}
                    {!isHukum && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBaPermohonan(item);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{hasSignedBA ? 'Lihat Berita Acara (TTD)' : 'Draft Berita Acara'}</span>
                      </button>
                    )}

                    {/* Unggah / Ubah TTD */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadTtdItem(item);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <PenTool className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hasSignedBA ? 'Ubah TTD' : 'Unggah TTD'}</span>
                    </button>

                    {/* Input Pleno / Revisi */}
                    {!isHukum && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormPlenoItem(item);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          !item.sidangPleno?.kesepakatanRekomendasi
                            ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>{!item.sidangPleno?.kesepakatanRekomendasi ? 'Input Hasil Pleno' : 'Revisi'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
