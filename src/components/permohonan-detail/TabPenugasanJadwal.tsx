import React, { useState, useEffect } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
} from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Stethoscope,
  Scale,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { permohonanApi, authApi } from '../../services/api';

interface TabPenugasanJadwalProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  effectiveReadonly: boolean;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onNavigateTab: (tab: any) => void;
}

export const TabPenugasanJadwal: React.FC<TabPenugasanJadwalProps> = ({
  permohonan,
  currentUser,
  effectiveReadonly,
  onUpdatePermohonan,
  onNavigateTab,
}) => {
  const [modalType, setModalType] = useState<'medis' | 'hukum' | 'pleno' | null>(null);
  const [medisUsers, setMedisUsers] = useState<UserProfile[]>([]);
  const [hukumUsers, setHukumUsers] = useState<UserProfile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const tim = permohonan.timAsesmen;

  // Load real assessor accounts from backend
  useEffect(() => {
    authApi.getAllUsers('medis')
      .then(res => { if (res.data) setMedisUsers(res.data); })
      .catch(() => {});
    authApi.getAllUsers('hukum')
      .then(res => { if (res.data) setHukumUsers(res.data); })
      .catch(() => {});
  }, []);

  const handleSavePenugasan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const asesor = formData.get('asesor') as string;
    const lokasi = formData.get('lokasi') as string;
    const jadwal = formData.get('jadwal') as string;

    let formattedDate = jadwal;
    if (jadwal) {
      const d = new Date(jadwal);
      const pad = (n: number) => n.toString().padStart(2, '0');
      formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} WIB`;
    }

    const updatedTim = {
      ...(tim as any),
      ...(modalType === 'medis'
        ? {
            asesorMedisNama: asesor,
            lokasiPemeriksaan: lokasi || tim?.lokasiPemeriksaan,
            jadwalPemeriksaanMedis: formattedDate,
          }
        : modalType === 'hukum'
        ? {
            asesorHukumNama: asesor,
            jadwalPemeriksaanHukum: formattedDate,
          }
        : {
            jadwalPleno: formattedDate,
          }),
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      applicationStatus: 'SCHEDULED',
      statusProsesUtama: 'asesmen_berlangsung',
      timAsesmen: updatedTim,
    };

    onUpdatePermohonan(updated);

    if (permohonan.id) {
      try {
        await permohonanApi.tugaskan(permohonan.id, {
          ...(modalType === 'medis'
            ? {
                asesorMedisNama: asesor,
                lokasiPemeriksaan: lokasi,
                jadwalPemeriksaanMedis: jadwal ? new Date(jadwal).toISOString() : undefined,
              }
            : modalType === 'hukum'
            ? {
                asesorHukumNama: asesor,
                jadwalPemeriksaanHukum: jadwal ? new Date(jadwal).toISOString() : undefined,
              }
            : {
                jadwalPleno: jadwal ? new Date(jadwal).toISOString() : undefined,
              }),
        });
        setToastMsg(`Penugasan ${modalType?.toUpperCase()} berhasil ditetapkan & notifikasi email dikirim!`);
        setTimeout(() => setToastMsg(null), 4000);
      } catch (err) {
        console.warn('Backend tugaskan notice:', err);
      }
    }

    setIsSubmitting(false);
    setModalType(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Penugasan Tim Asesor & Penjadwalan Pemeriksaan</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Penetapan dokter asesor medis, jaksa/penelaah hukum, faskes lokasi pemeriksaan, dan jadwal sidang pleno.
          </p>
        </div>
      </div>

      {/* 3 Cards: Asesor Medis, Asesor Hukum, Jadwal Pleno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Tim Medis */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Asesor Medis TAT</h4>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                tim?.asesorMedisNama ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {tim?.asesorMedisNama ? 'Ditugaskan' : 'Belum Ditunjuk'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dokter Pemeriksa:</span>
                <span className="font-bold text-white text-sm block mt-0.5">
                  {tim?.asesorMedisNama || 'Belum ada dokter ditugaskan'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jadwal Pemeriksaan Klinis:</span>
                <span className="font-mono text-slate-200 block mt-0.5">
                  {tim?.jadwalPemeriksaanMedis || 'Belum dijadwalkan'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lokasi Pemeriksaan / Faskes:</span>
                <span className="text-slate-200 block mt-0.5">
                  {tim?.lokasiPemeriksaan || 'Klinik Pratama BNNP / RS Bhayangkara'}
                </span>
              </div>
            </div>
          </div>

          {!effectiveReadonly && (
            <button
              onClick={() => setModalType('medis')}
              className="w-full py-2 bg-[#132c52] hover:bg-[#1a3c70] text-sky-200 border border-[#234b80] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{tim?.asesorMedisNama ? 'Ubah Penugasan Medis' : 'Tugaskan Asesor Medis'}</span>
            </button>
          )}
        </div>

        {/* Card 2: Tim Hukum */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Penelaah Hukum TAT</h4>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                tim?.asesorHukumNama ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {tim?.asesorHukumNama ? 'Ditugaskan' : 'Belum Ditunjuk'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Asesor Hukum / Jaksa:</span>
                <span className="font-bold text-white text-sm block mt-0.5">
                  {tim?.asesorHukumNama || 'Belum ada penelaah ditugaskan'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jadwal Telaah Perkara:</span>
                <span className="font-mono text-slate-200 block mt-0.5">
                  {tim?.jadwalPemeriksaanHukum || 'Belum dijadwalkan'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Materi Telaah:</span>
                <span className="text-slate-200 block mt-0.5">
                  Uji Bukti SEMA 04/2010 & Kualifikasi Pasal Pidana
                </span>
              </div>
            </div>
          </div>

          {!effectiveReadonly && (
            <button
              onClick={() => setModalType('hukum')}
              className="w-full py-2 bg-[#132c52] hover:bg-[#1a3c70] text-sky-200 border border-[#234b80] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{tim?.asesorHukumNama ? 'Ubah Penugasan Hukum' : 'Tugaskan Penelaah Hukum'}</span>
            </button>
          )}
        </div>

        {/* Card 3: Jadwal Sidang Pleno */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sidang Pleno TAT</h4>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                tim?.jadwalPleno ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {tim?.jadwalPleno ? 'Terjadwal' : 'Menunggu Asesmen'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tanggal & Waktu Sidang Pleno:</span>
                <span className="font-mono text-white text-sm font-bold block mt-0.5">
                  {tim?.jadwalPleno || 'Menunggu asesmen medis & hukum selesai'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ruang Rapat Pleno:</span>
                <span className="text-slate-200 block mt-0.5">
                  Ruang Sidang Sekretariat TAT Gedung Ditresnarkoba / Hybrid Zoom
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Peserta Wajib:</span>
                <span className="text-slate-200 block mt-0.5">
                  Ketua TAT, Tim Medis, Tim Hukum, Penyidik Pengaju
                </span>
              </div>
            </div>
          </div>

          {!effectiveReadonly && (
            <button
              onClick={() => setModalType('pleno')}
              className="w-full py-2 bg-[#1b3459] hover:bg-[#234475] text-[#D4AF37] border border-[#2d5289] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer mt-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{tim?.jadwalPleno ? 'Ubah Jadwal Pleno' : 'Jadwalkan Sidang Pleno'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal Form Penugasan */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#1b3459] flex items-center justify-between bg-gradient-to-r from-[#0d1f38] to-[#0b172a]">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {modalType === 'medis'
                    ? 'Tetapkan Penugasan Dokter Asesor Medis'
                    : modalType === 'hukum'
                    ? 'Tetapkan Penugasan Penelaah Hukum'
                    : 'Jadwalkan Sidang Pleno Terpadu'}
                </span>
              </h4>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePenugasan} className="p-5 space-y-4 text-xs">
              {modalType !== 'pleno' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pilih Akun Asesor Terdaftar: *
                  </label>
                  <select
                    name="asesor"
                    required
                    defaultValue={modalType === 'medis' ? tim?.asesorMedisNama : tim?.asesorHukumNama}
                    className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">-- Pilih Asesor dari Sistem --</option>
                    {modalType === 'medis' ? (
                      <>
                        {medisUsers.map(u => (
                          <option key={u.id} value={`${u.name} (${u.agency || 'Faskes TAT'})`}>
                            {u.name} — {u.agency || 'Klinik / RS BNN'}
                          </option>
                        ))}
                        <option value="dr. Haryono (BNNK Samarinda)">dr. Haryono (BNNK Samarinda)</option>
                        <option value="dr. Siti Aminah, Sp.KJ (RSJD Atma Husada)">dr. Siti Aminah, Sp.KJ (RSJD Atma Husada)</option>
                        <option value="dr. Sarah Amelia, Sp.KJ (RSUD AW Sjahranie)">dr. Sarah Amelia, Sp.KJ (RSUD AW Sjahranie)</option>
                      </>
                    ) : (
                      <>
                        {hukumUsers.map(u => (
                          <option key={u.id} value={`${u.name} (${u.agency || 'Instansi Penegak Hukum'})`}>
                            {u.name} — {u.agency || 'Kejaksaan / BNNP'}
                          </option>
                        ))}
                        <option value="Ahmad Fauzi, S.H., M.H. (Kejaksaan Tinggi Kaltim)">Ahmad Fauzi, S.H., M.H. (Kejaksaan Tinggi Kaltim)</option>
                        <option value="Tim Penelaah Hukum BNNP Kaltim">Tim Penelaah Hukum BNNP Kaltim</option>
                        <option value="Penyidik Pembantu Satresnarkoba">Penyidik Pembantu Satresnarkoba</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {modalType === 'medis' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Lokasi Faskes Pemeriksaan: *
                  </label>
                  <select
                    name="lokasi"
                    required
                    defaultValue={tim?.lokasiPemeriksaan || 'Klinik Pratama BNNP Kaltim'}
                    className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Klinik Pratama BNNP Kaltim">Klinik Pratama BNNP Kaltim</option>
                    <option value="Klinik Pratama BNNK Samarinda">Klinik Pratama BNNK Samarinda</option>
                    <option value="RS Bhayangkara Balikpapan">RS Bhayangkara Balikpapan</option>
                    <option value="RSJD Atma Husada Mahakam">RSJD Atma Husada Mahakam</option>
                    <option value="RSUD AW Sjahranie Samarinda">RSUD AW Sjahranie Samarinda</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pilih Tanggal & Jam Pemeriksaan: *
                </label>
                <input
                  type="datetime-local"
                  name="jadwal"
                  required
                  className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-[#D4AF37] font-mono [color-scheme:dark]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1b3459]">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Penugasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
