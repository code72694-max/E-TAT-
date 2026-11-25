import React, { useState } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
} from '../../types';
import {
  Users,
  Calendar,
  FileCheck2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  Shield,
  Clock,
  Printer,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { BeritaAcaraModal } from '../BeritaAcaraModal';
import { FormHasilPlenoModal } from '../FormHasilPlenoModal';
import { sidangPlenoApi } from '../../services/api';
import { uploadToCloudinary } from '../../services/cloudinary';

interface TabSidangPlenoProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  effectiveReadonly: boolean;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onNavigateTab: (tab: any) => void;
}

export const TabSidangPleno: React.FC<TabSidangPlenoProps> = ({
  permohonan,
  currentUser,
  effectiveReadonly,
  onUpdatePermohonan,
  onNavigateTab,
}) => {
  const [showBaModal, setShowBaModal] = useState(false);
  const [showHasilModal, setShowHasilModal] = useState(false);
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);

  const pleno = permohonan.sidangPleno;
  const isMedisReady = permohonan.asesmenMedis?.status === 'FINAL' || permohonan.medicalStatus === 'FINAL';
  const isHukumReady = permohonan.asesmenHukum?.status === 'FINAL' || permohonan.legalStatus === 'FINAL';
  const isReadyForPleno = isMedisReady && isHukumReady;

  const loadFotoList = (): { url: string; keterangan?: string }[] => {
    if (Array.isArray(pleno?.fotoKehadiranList) && pleno.fotoKehadiranList.length > 0) {
      return pleno.fotoKehadiranList;
    }
    try {
      const raw =
        localStorage.getItem(`etat_pleno_foto_list_${permohonan.id}`) ||
        (permohonan.nomorPermohonan ? localStorage.getItem(`etat_pleno_foto_list_${permohonan.nomorPermohonan}`) : null);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const legacyUrl =
        pleno?.fotoKehadiranUrl ||
        localStorage.getItem(`etat_pleno_foto_kehadiran_${permohonan.id}`) ||
        (permohonan.nomorPermohonan ? localStorage.getItem(`etat_pleno_foto_kehadiran_${permohonan.nomorPermohonan}`) : '');
      if (legacyUrl) {
        return [{ url: legacyUrl, keterangan: pleno?.fotoKehadiranKeterangan || 'Dokumentasi Kehadiran Sidang Pleno TAT' }];
      }
    } catch {}
    return [];
  };

  const [fotoKehadiranList, setFotoKehadiranList] = useState<{ url: string; keterangan?: string }[]>(loadFotoList);

  const persistFotoList = (nextList: { url: string; keterangan?: string }[]) => {
    setFotoKehadiranList(nextList);
    try {
      if (nextList.length > 0) {
        localStorage.setItem(`etat_pleno_foto_list_${permohonan.id}`, JSON.stringify(nextList));
        localStorage.setItem(`etat_pleno_foto_kehadiran_${permohonan.id}`, nextList[0].url);
        if (permohonan.nomorPermohonan) {
          localStorage.setItem(`etat_pleno_foto_list_${permohonan.nomorPermohonan}`, JSON.stringify(nextList));
          localStorage.setItem(`etat_pleno_foto_kehadiran_${permohonan.nomorPermohonan}`, nextList[0].url);
        }
      } else {
        localStorage.removeItem(`etat_pleno_foto_list_${permohonan.id}`);
        localStorage.removeItem(`etat_pleno_foto_kehadiran_${permohonan.id}`);
        if (permohonan.nomorPermohonan) {
          localStorage.removeItem(`etat_pleno_foto_list_${permohonan.nomorPermohonan}`);
          localStorage.removeItem(`etat_pleno_foto_kehadiran_${permohonan.nomorPermohonan}`);
        }
      }
    } catch {}

    onUpdatePermohonan({
      ...permohonan,
      sidangPleno: {
        ...(permohonan.sidangPleno || {
          id: `pleno-${Date.now()}`,
          tanggalPleno: new Date().toISOString().split('T')[0],
          waktu: '09.30 WITA',
          tempat: 'Ruang Sidang Sekretariat TAT BNNP Kaltim',
          nomorBeritaAcara: `BA/${(permohonan.nomorPermohonan || 'TAT').replace(/[^a-zA-Z0-9]/g, '')}/TAT/${new Date().getFullYear()}`,
          pimpinanPleno: 'Ketua Tim Asesmen Terpadu',
          daftarHadir: [],
          pokokBahasan: '',
          kesepakatanRekomendasi: '',
          jenisRekomendasiFinal: 'Rehabilitasi Rawat Inap',
          statusPleno: 'terjadwal',
        }),
        fotoKehadiranList: nextList,
        fotoKehadiranUrl: nextList[0]?.url || undefined,
        fotoKehadiranKeterangan: nextList[0]?.keterangan || undefined,
      } as any,
    });
  };

  const handleUploadFotoKehadiran = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    setIsUploadingFoto(true);
    let updatedList = [...fotoKehadiranList];
    try {
      for (const file of fileArray) {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
        if (file.size > 10 * 1024 * 1024) continue;

        let uploadedUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(URL.createObjectURL(file));
          reader.readAsDataURL(file);
        });

        try {
          const res = await uploadToCloudinary(file, 'pleno-kehadiran');
          if (res?.url) uploadedUrl = res.url;
        } catch (err) {
          console.warn('Upload foto kehadiran fallback ke lokal:', err);
        }

        updatedList = [
          ...updatedList,
          { url: uploadedUrl, keterangan: 'Dokumentasi Kehadiran Sidang Pleno TAT' },
        ];
      }
      persistFotoList(updatedList);
    } finally {
      setIsUploadingFoto(false);
    }
  };

  const handleSaveHasilPleno = async (permohonanId: string, payload: any) => {
    try {
      const response = await sidangPlenoApi.simpanHasil(permohonanId, payload);
      if (response.success) {
        const mergedList = payload.fotoKehadiranList || fotoKehadiranList;
        if (mergedList.length > 0) persistFotoList(mergedList);
        onUpdatePermohonan({
          ...permohonan,
          sidangPleno: {
            ...response.data,
            fotoKehadiranList: mergedList,
            fotoKehadiranUrl: mergedList[0]?.url || response.data?.fotoKehadiranUrl,
            fotoKehadiranKeterangan: mergedList[0]?.keterangan || response.data?.fotoKehadiranKeterangan,
          },
          statusProsesUtama:
            payload.statusPleno === 'selesai_sepakat' ? 'pengesahan_rekomendasi' : permohonan.statusProsesUtama,
        });
      }
      setShowHasilModal(false);
    } catch (error) {
      console.error('Failed to save hasil pleno', error);
      alert('Gagal menyimpan hasil pleno.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Musyawarah Sidang Pleno Tim Asesmen Terpadu (TAT)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Rapat pleno multi-instansi (Kepolisian, Kejaksaan, BNN, Tenaga Medis) untuk merumuskan kesepakatan rekomendasi akhir.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {pleno && (
            <button
              onClick={() => setShowBaModal(true)}
              className="bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234475] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lihat Berita Acara Pleno</span>
            </button>
          )}
        </div>
      </div>

      {/* Prasyarat Sidang Pleno Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isMedisReady ? 'bg-[#081224] border-emerald-500/30 text-emerald-200' : 'bg-[#18110b] border-amber-500/40 text-amber-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Prasyarat 1: Asesmen Medis</span>
            <span className="text-xs font-bold text-white block">
              {isMedisReady ? '✓ Asesmen Medis Difinalisasi' : 'Belum Selesai Difinalisasi'}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
            isMedisReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isMedisReady ? 'Siap Pleno' : 'Menunggu Dokter'}
          </span>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isHukumReady ? 'bg-[#081224] border-emerald-500/30 text-emerald-200' : 'bg-[#18110b] border-amber-500/40 text-amber-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Prasyarat 2: Asesmen Hukum</span>
            <span className="text-xs font-bold text-white block">
              {isHukumReady ? '✓ Asesmen Hukum Difinalisasi' : 'Belum Selesai Difinalisasi'}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
            isHukumReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isHukumReady ? 'Siap Pleno' : 'Menunggu Penelaah'}
          </span>
        </div>
      </div>

      {/* Main Pleno Summary Card */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Hasil Kesepakatan Sidang Pleno Terpadu
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pimpinan Sidang: <strong className="text-slate-200">{pleno?.pimpinanPleno || 'Ketua Tim Asesmen Terpadu'}</strong>
            </p>
          </div>

          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
            pleno?.statusPleno === 'SELESAI'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {pleno?.statusPleno === 'SELESAI' ? '✓ PLENO SELESAI' : 'MENUNGGU KESEPAKATAN'}
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block mb-1">Rekomendasi Terpadu Hasil Musyawarah:</span>
            <div className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-slate-200 font-medium leading-relaxed">
              {pleno?.kesimpulanRekomendasi ||
                'Terperiksa memenuhi kriteria sebagai Korban Penyalahgunaan Narkotika yang layak menjalani Rehabilitasi Medis dan Sosial Rawat Inap selama 3 bulan di Balai Besar Rehabilitasi BNN Tanah Merah.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Modalitas Layanan:</span>
              <span className="font-bold text-white mt-1 block">
                {pleno?.rekomendasiRehab?.modalitas || 'Rehabilitasi Rawat Inap'}
              </span>
            </div>
            <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Durasi Program:</span>
              <span className="font-bold text-[#D4AF37] font-mono mt-1 block">
                {pleno?.rekomendasiRehab?.durasiBulan || 3} Bulan
              </span>
            </div>
            <div className="p-3 bg-[#050e1c] border border-[#1b3459] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fasilitas Rujukan:</span>
              <span className="font-bold text-white mt-1 block truncate">
                {pleno?.rekomendasiRehab?.namaFasilitas || 'Balai Rehabilitasi BNN Tanah Merah'}
              </span>
            </div>
          </div>

          {pleno?.catatanPleno && (
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Catatan Khusus Notulen Rapat:</span>
              <p className="text-slate-300 italic p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl">
                "{pleno.catatanPleno}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#1b3459]">
          <div className="text-xs text-slate-400">
            {isReadyForPleno ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Kedua asesmen (Medis & Hukum) siap. Musyawarah pleno dapat difinalisasi.
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Selesaikan finalisasi Asesmen Medis & Hukum sebelum mengesahkan Berita Acara Pleno.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!effectiveReadonly && (
              <button
                onClick={() => setShowHasilModal(true)}
                className="bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234475] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
              >
                Catat Hasil Musyawarah Pleno
              </button>
            )}

            <button
              onClick={() => onNavigateTab('dokumen')}
              className="bg-[#D4AF37] hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-lg shadow-amber-950/30 cursor-pointer"
            >
              <span>Lanjut ke Tanda Tangan & PDF</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lampiran Foto Bukti Kehadiran Sidang Pleno (Multi-Upload) */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3459]">
          <div>
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>Lampiran Foto Bukti Kehadiran Sidang Pleno</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Unggah satu atau beberapa foto dokumentasi kehadiran rapat pleno. Foto otomatis tampil sebagai lembar lampiran pada Berita Acara.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#050e1c] border border-[#1b3459] text-slate-300 shrink-0">
            {fotoKehadiranList.length} Foto Terlampir
          </span>
        </div>

        {fotoKehadiranList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {fotoKehadiranList.map((foto, idx) => (
              <div key={idx} className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Lampiran Foto #{idx + 1}</span>
                  </span>
                  {!effectiveReadonly && (
                    <button
                      type="button"
                      onClick={() => persistFotoList(fotoKehadiranList.filter((_, i) => i !== idx))}
                      className="text-[11px] bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
                <div className="rounded-lg overflow-hidden border border-[#1b3459] bg-[#0b172a] flex items-center justify-center p-1.5 h-40">
                  <img
                    src={foto.url}
                    alt={`Bukti Kehadiran Pleno ${idx + 1}`}
                    className="max-h-full w-auto object-contain rounded"
                  />
                </div>
                <input
                  type="text"
                  disabled={effectiveReadonly}
                  value={foto.keterangan || ''}
                  onChange={(e) => {
                    const next = fotoKehadiranList.map((item, i) =>
                      i === idx ? { ...item, keterangan: e.target.value } : item
                    );
                    persistFotoList(next);
                  }}
                  placeholder={`Keterangan foto #${idx + 1}...`}
                  className="w-full bg-[#0b172a] border border-[#1b3459] focus:border-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none disabled:opacity-60"
                />
              </div>
            ))}
          </div>
        )}

        {!effectiveReadonly && (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#234475] hover:border-[#D4AF37]/70 bg-[#050e1c] rounded-xl p-5 cursor-pointer transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#142642] border border-[#234475] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="text-xs font-semibold text-white">
              {isUploadingFoto
                ? 'Mengunggah foto...'
                : fotoKehadiranList.length > 0
                ? 'Tambah Foto Bukti Kehadiran Lainnya (Bisa pilih beberapa foto sekaligus)'
                : 'Klik untuk Upload Foto Bukti Kehadiran Pleno (Bisa beberapa foto sekaligus)'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Format JPG, PNG, WEBP (Maks. 10 MB per foto)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              disabled={isUploadingFoto}
              onChange={(e) => {
                if (e.target.files) handleUploadFotoKehadiran(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
        )}
      </div>

      {/* Modal Berita Acara */}
      {showBaModal && (
        <BeritaAcaraModal
          permohonan={permohonan}
          currentUser={currentUser}
          onClose={() => setShowBaModal(false)}
        />
      )}

      {/* Modal Form Hasil Pleno */}
      {showHasilModal && (
        <FormHasilPlenoModal
          permohonan={permohonan}
          onClose={() => setShowHasilModal(false)}
          onSave={handleSaveHasilPleno}
        />
      )}
    </div>
  );
};
