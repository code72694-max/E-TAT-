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
  X,
  Send,
  ArrowRight,
  ShieldCheck,
  Mail,
  Info
} from 'lucide-react';
import { permohonanApi, authApi } from '../../services/api';
import { sendPenjadwalanEmailNotification } from '../../services/emailService';

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

  // Form State for dynamic scheduling & destination email
  const [selectedAssessorId, setSelectedAssessorId] = useState<string>('');
  const [targetEmailInput, setTargetEmailInput] = useState<string>('');
  const [lokasiInput, setLokasiInput] = useState<string>('Klinik Pratama BNNP Kaltim');
  const [jadwalInput, setJadwalInput] = useState<string>('');
  const [catatanInput, setCatatanInput] = useState<string>('');

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

  const openModal = (type: 'medis' | 'hukum' | 'pleno') => {
    setModalType(type);
    setCatatanInput('');

    if (type === 'medis') {
      const existing = medisUsers.find(u => u.name === tim?.asesorMedisNama || u.id === tim?.asesorMedisId);
      const chosen = existing || medisUsers[0];
      setSelectedAssessorId(chosen?.id || '');
      setTargetEmailInput(tim?.asesorMedisEmail || (tim as any)?.asesorMedis?.email || chosen?.email || '');
      setLokasiInput(tim?.lokasiPemeriksaan || 'Klinik Pratama BNNP Kaltim');
      setJadwalInput(tim?.jadwalPemeriksaanMedis ? tim.jadwalPemeriksaanMedis.replace(' WIB', '') : '');
    } else if (type === 'hukum') {
      const existing = hukumUsers.find(u => u.name === tim?.asesorHukumNama || u.id === tim?.asesorHukumId);
      const chosen = existing || hukumUsers[0];
      setSelectedAssessorId(chosen?.id || '');
      setTargetEmailInput(tim?.asesorHukumEmail || (tim as any)?.asesorHukum?.email || chosen?.email || '');
      setJadwalInput(tim?.jadwalPemeriksaanHukum ? tim.jadwalPemeriksaanHukum.replace(' WIB', '') : '');
    } else {
      // Pleno: otomatis gabungkan email asesor medis, asesor hukum, dan pengaju
      const defaultTargets = Array.from(
        new Set(
          [
            tim?.asesorMedisEmail || (tim as any)?.asesorMedis?.email || medisUsers[0]?.email,
            tim?.asesorHukumEmail || (tim as any)?.asesorHukum?.email || hukumUsers[0]?.email,
            permohonan.pengajuEmail || (permohonan as any)?.pengaju?.email,
          ].filter(Boolean) as string[]
        )
      );
      setTargetEmailInput(defaultTargets.join(', '));
      setJadwalInput(tim?.jadwalPleno ? tim.jadwalPleno.replace(' WIB', '') : '');
    }
  };

  const handleAssessorSelectChange = (userId: string) => {
    setSelectedAssessorId(userId);
    const list = modalType === 'medis' ? medisUsers : hukumUsers;
    const user = list.find(u => u.id === userId);
    if (user?.email) {
      setTargetEmailInput(user.email);
    }
  };

  const handleSavePenugasan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const lokasi = (formData.get('lokasi') as string) || lokasiInput;
    const jadwal = (formData.get('jadwal') as string) || jadwalInput;
    const dynamicEmails = targetEmailInput.trim();

    let formattedDate = jadwal;
    if (jadwal) {
      const d = new Date(jadwal);
      if (!isNaN(d.getTime())) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} WIB`;
      }
    }

    let assessorId: string | undefined = undefined;
    let assessorNama = '';
    let assessorEmail = '';

    if (modalType === 'medis') {
      const found = medisUsers.find(u => u.id === selectedAssessorId);
      if (found) {
        assessorId = found.id;
        assessorNama = `${found.name} (${found.agency || 'Faskes TAT'})`;
        assessorEmail = found.email;
      } else {
        assessorNama = (formData.get('customAsesor') as string) || tim?.asesorMedisNama || '[TEST] Dokter Asesor Medis TAT';
        assessorEmail = dynamicEmails.split(/[,;\s]+/)[0] || '';
      }
    } else if (modalType === 'hukum') {
      const found = hukumUsers.find(u => u.id === selectedAssessorId);
      if (found) {
        assessorId = found.id;
        assessorNama = `${found.name} (${found.agency || 'Instansi Penegak Hukum'})`;
        assessorEmail = found.email;
      } else {
        assessorNama = (formData.get('customAsesor') as string) || tim?.asesorHukumNama || '[TEST] Jaksa Asesor Hukum TAT';
        assessorEmail = dynamicEmails.split(/[,;\s]+/)[0] || '';
      }
    }

    const updatedTim = {
      ...(tim as any),
      ...(modalType === 'medis'
        ? {
            asesorMedisId: assessorId || tim?.asesorMedisId,
            asesorMedisNama: assessorNama,
            asesorMedisEmail: dynamicEmails || assessorEmail || tim?.asesorMedisEmail,
            lokasiPemeriksaan: lokasi || tim?.lokasiPemeriksaan,
            jadwalPemeriksaanMedis: formattedDate,
          }
        : modalType === 'hukum'
        ? {
            asesorHukumId: assessorId || tim?.asesorHukumId,
            asesorHukumNama: assessorNama,
            asesorHukumEmail: dynamicEmails || assessorEmail || tim?.asesorHukumEmail,
            jadwalPemeriksaanHukum: formattedDate,
          }
        : {
            jadwalPleno: formattedDate,
          }),
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      applicationStatus: 'ASSESSMENT_ACTIVE',
      statusProsesUtama: 'asesmen_berlangsung',
      timAsesmen: updatedTim,
    };

    onUpdatePermohonan(updated);

    // Kirim notifikasi email ke alamat tujuan dinamis yang ditentukan admin
    let emailStatusNote = '';
    try {
      const emailRes = await sendPenjadwalanEmailNotification({
        permohonan: updated,
        tipe: modalType!,
        targetRecipients: dynamicEmails || assessorEmail,
        asesorNama: assessorNama || (modalType === 'pleno' ? 'Seluruh Tim Asesor TAT' : 'Asesor Terpilih'),
        asesorEmail: assessorEmail || dynamicEmails.split(/[,;\s]+/)[0],
        jadwal: formattedDate,
        lokasi: lokasi || updatedTim.lokasiPemeriksaan,
        catatan: catatanInput,
      });

      if (emailRes.success) {
        emailStatusNote = ` & Notifikasi email dikirim ke ${dynamicEmails || assessorEmail}`;
      } else if (emailRes.error) {
        console.warn('Notice email penugasan:', emailRes.error);
        emailStatusNote = ` (Info email: ${emailRes.error})`;
      }
    } catch (err) {
      console.warn('Gagal memproses kirim email:', err);
    }

    if (permohonan.id) {
      try {
        await permohonanApi.tugaskan(permohonan.id, {
          ...(modalType === 'medis'
            ? {
                asesorMedisId: assessorId,
                asesorMedisNama: assessorNama,
                lokasiPemeriksaan: lokasi,
                jadwalPemeriksaanMedis: jadwal ? new Date(jadwal).toISOString() : undefined,
              }
            : modalType === 'hukum'
            ? {
                asesorHukumId: assessorId,
                asesorHukumNama: assessorNama,
                jadwalPemeriksaanHukum: jadwal ? new Date(jadwal).toISOString() : undefined,
              }
            : {
                jadwalPleno: jadwal ? new Date(jadwal).toISOString() : undefined,
              }),
        });
      } catch (err) {
        console.warn('Backend tugaskan notice:', err);
      }
    }

    setToastMsg(`Penugasan ${modalType?.toUpperCase()} berhasil ditetapkan${emailStatusNote}!`);
    setTimeout(() => setToastMsg(null), 5000);
    setIsSubmitting(false);
    setModalType(null);
  };

  const handleKirimKeMedis = async () => {
    setIsSubmitting(true);
    const nowStr = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    const defaultMedis = tim?.asesorMedisNama || medisUsers[0]?.name || '[TEST] Dokter Asesor Medis TAT';
    const defaultHukum = tim?.asesorHukumNama || hukumUsers[0]?.name || '[TEST] Jaksa Asesor Hukum TAT';
    const defaultMedisId = tim?.asesorMedisId || medisUsers[0]?.id;
    const defaultHukumId = tim?.asesorHukumId || hukumUsers[0]?.id;
    const defaultMedisEmail = tim?.asesorMedisEmail || (tim as any)?.asesorMedis?.email || medisUsers[0]?.email;
    const defaultHukumEmail = tim?.asesorHukumEmail || (tim as any)?.asesorHukum?.email || hukumUsers[0]?.email;
    const defaultPengajuEmail = permohonan.pengajuEmail || (permohonan as any)?.pengaju?.email;
    const defaultLokasi = tim?.lokasiPemeriksaan || 'Klinik Pratama BNNP Kaltim';
    const defaultJadwalMedis = tim?.jadwalPemeriksaanMedis || `${new Date().toISOString().split('T')[0]} 09:30 WIB`;
    const defaultJadwalHukum = tim?.jadwalPemeriksaanHukum || `${new Date().toISOString().split('T')[0]} 13:30 WIB`;

    const updatedTim = {
      ...(tim as any),
      asesorMedisId: defaultMedisId,
      asesorMedisNama: defaultMedis,
      asesorMedisEmail: defaultMedisEmail,
      asesorHukumId: defaultHukumId,
      asesorHukumNama: defaultHukum,
      asesorHukumEmail: defaultHukumEmail,
      lokasiPemeriksaan: defaultLokasi,
      jadwalPemeriksaanMedis: defaultJadwalMedis,
      jadwalPemeriksaanHukum: defaultJadwalHukum,
      dikirimKeMedis: true,
      tanggalKirimMedis: nowStr,
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      applicationStatus: 'ASSESSMENT_ACTIVE',
      statusProsesUtama: 'asesmen_berlangsung',
      timAsesmen: updatedTim,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: nowStr,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pelimpahan Berkas ke Tim Medis',
          rincian: `Admin mengesahkan penugasan dan mengirimkan berkas perkara ke Tim Medis (${defaultMedis}) serta Tim Hukum (${defaultHukum}).`
        },
        ...(permohonan.auditLogs || [])
      ]
    };

    onUpdatePermohonan(updated);

    // Kirim notifikasi email dinamis ke tim medis, hukum, dan pengaju
    const targets = Array.from(
      new Set([defaultMedisEmail, defaultHukumEmail, defaultPengajuEmail].filter(Boolean) as string[])
    );

    if (targets.length > 0) {
      sendPenjadwalanEmailNotification({
        permohonan: updated,
        tipe: 'medis',
        targetRecipients: targets,
        asesorNama: defaultMedis,
        asesorEmail: defaultMedisEmail,
        jadwal: defaultJadwalMedis,
        lokasi: defaultLokasi,
        catatan: 'Pelimpahan berkas perkara resmi dari Admin Sekretariat TAT. Formulir pemeriksaan klinis kini dapat diakses.',
      }).catch(err => console.warn('Email notice kirim medis:', err));
    }

    if (permohonan.id) {
      try {
        await permohonanApi.tugaskan(permohonan.id, {
          asesorMedisId: defaultMedisId,
          asesorMedisNama: defaultMedis,
          asesorHukumId: defaultHukumId,
          asesorHukumNama: defaultHukum,
          lokasiPemeriksaan: defaultLokasi,
          jadwalPemeriksaanMedis: new Date().toISOString(),
          jadwalPemeriksaanHukum: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Backend tugaskan notice:', err);
      }
    }

    setToastMsg(`Berkas Berhasil Dikirimkan ke Tim Medis (${defaultMedis})! Tahapan Asesmen kini aktif.`);
    setIsSubmitting(false);
    setTimeout(() => {
      onNavigateTab('medis');
    }, 900);
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
            Penetapan dokter asesor medis, jaksa/penelaah hukum, faskes lokasi pemeriksaan, dan jadwal sidang pleno dengan routing email tujuan dinamis.
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
                {tim?.asesorMedisEmail && (
                  <span className="text-[11px] text-sky-400 font-mono flex items-center gap-1 mt-0.5 break-all">
                    <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>{tim.asesorMedisEmail}</span>
                  </span>
                )}
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
              onClick={() => openModal('medis')}
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
                {tim?.asesorHukumEmail && (
                  <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1 mt-0.5 break-all">
                    <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{tim.asesorHukumEmail}</span>
                  </span>
                )}
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
                  Uji Bukti SEMA 04/2010 &amp; Kualifikasi Pasal Pidana
                </span>
              </div>
            </div>
          </div>

          {!effectiveReadonly && (
            <button
              onClick={() => openModal('hukum')}
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
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tanggal &amp; Waktu Sidang Pleno:</span>
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
              onClick={() => openModal('pleno')}
              className="w-full py-2 bg-[#1b3459] hover:bg-[#234475] text-[#D4AF37] border border-[#2d5289] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer mt-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{tim?.jadwalPleno ? 'Ubah Jadwal Pleno' : 'Jadwalkan Sidang Pleno'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Dispatch Section: Kirimkan ke Tim Medis & Aktifkan Alur Asesmen */}
      {!effectiveReadonly && (
        <div className="bg-gradient-to-r from-[#0d2240] via-[#09182d] to-[#081224] border-2 border-[#D4AF37]/40 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="text-sm font-bold text-white tracking-wide">
                Pelimpahan Berkas &amp; Aktivasi Tahapan Asesmen Medis
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Pastikan berkas telah diverifikasi lengkap. Tombol ini akan mengesahkan pelimpahan berkas perkara secara resmi ke Dokter Asesor Medis 
              (<strong className="text-[#D4AF37]">{tim?.asesorMedisNama || '[TEST] Dokter Asesor Medis TAT'}</strong>) dan mengirimkan notifikasi jadwal otomatis ke email tujuan.
            </p>
            {tim?.dikirimKeMedis && (
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Status: Telah diteruskan ke Tim Medis pada {tim.tanggalKirimMedis || 'Tahap Sebelumnya'}.</span>
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleKirimKeMedis}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{tim?.dikirimKeMedis ? 'Perbarui & Kirim Ulang ke Medis' : 'Kirimkan & Lanjutkan ke Medis'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Form Penugasan & Penjadwalan */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#1b3459] flex items-center justify-between bg-gradient-to-r from-[#0d1f38] to-[#0b172a]">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {modalType === 'medis'
                    ? 'Penugasan & Jadwal Dokter Asesor Medis'
                    : modalType === 'hukum'
                    ? 'Penugasan & Jadwal Penelaah Hukum'
                    : 'Penjadwalan Sidang Pleno Terpadu (TAT)'}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePenugasan} className="p-5 space-y-4 text-xs">
              {/* Asesor Selection (Medis / Hukum) */}
              {modalType !== 'pleno' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pilih Akun Asesor Terdaftar: *
                  </label>
                  <select
                    name="asesorSelect"
                    value={selectedAssessorId}
                    onChange={(e) => handleAssessorSelectChange(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">-- Pilih Akun Asesor dari Sistem --</option>
                    {modalType === 'medis' ? (
                      <>
                        {medisUsers.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} — {u.agency || 'Klinik / RS BNN'} ({u.email})
                          </option>
                        ))}
                        {medisUsers.length === 0 && (
                          <>
                            <option value="test-medis-1">[TEST] Dokter Asesor Medis TAT (medis@gmail.com)</option>
                            <option value="test-medis-2">[TEST] Dokter Spesialis Jiwa RSJD (spesialis.jiwa@rsjd.go.id)</option>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {hukumUsers.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} — {u.agency || 'Kejaksaan / BNNP'} ({u.email})
                          </option>
                        ))}
                        {hukumUsers.length === 0 && (
                          <>
                            <option value="test-hukum-1">[TEST] Jaksa Asesor Hukum TAT (etatsiappulih@gmail.com)</option>
                            <option value="test-hukum-2">[TEST] Tim Penelaah Hukum BNNP (penelaah.hukum@bnnp.go.id)</option>
                          </>
                        )}
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Notification Target Email (Read-only based on selected assessor/participants) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Alamat Email Notifikasi Tujuan: *</span>
                  <span className="text-[10px] text-sky-400 font-normal">Otomatis (Read-Only)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={targetEmailInput}
                    readOnly
                    required
                    placeholder={
                      modalType === 'pleno'
                        ? 'Otomatis: Email Tim Medis, Tim Hukum & Pengaju'
                        : 'Otomatis sesuai asesor yang dipilih'
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-[#060f1e]/80 border border-[#1b3459]/80 rounded-xl text-slate-300 outline-none font-mono text-xs cursor-not-allowed select-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>
                    Email pemberitahuan jadwal &amp; akses permohonan otomatis dikirimkan ke alamat email akun yang dipilih.
                  </span>
                </p>
              </div>

              {/* Lokasi Pemeriksaan (khusus Medis) */}
              {modalType === 'medis' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Lokasi Faskes Pemeriksaan: *
                  </label>
                  <select
                    name="lokasi"
                    value={lokasiInput}
                    onChange={(e) => setLokasiInput(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Klinik Pratama BNNP Kaltim">Klinik Pratama BNNP Kaltim</option>
                    <option value="Klinik Pratama BNNK Samarinda">Klinik Pratama BNNK Samarinda</option>
                    <option value="RS Bhayangkara Balikpapan">RS Bhayangkara Balikpapan</option>
                    <option value="RSJD Atma Husada Mahakam">RSJD Atma Husada Mahakam</option>
                    <option value="RSUD AW Sjahranie Samarinda">RSUD AW Sjahranie Samarinda</option>
                    <option value="Ruang TAT Gedung Ditresnarkoba Polda">Ruang TAT Gedung Ditresnarkoba Polda</option>
                  </select>
                </div>
              )}

              {/* Tanggal & Waktu Pemeriksaan */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pilih Tanggal &amp; Jam Pelaksanaan: *
                </label>
                <input
                  type="datetime-local"
                  name="jadwal"
                  value={jadwalInput}
                  onChange={(e) => setJadwalInput(e.target.value)}
                  required
                  className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-[#D4AF37] font-mono [color-scheme:dark]"
                />
              </div>

              {/* Catatan / Instruksi Tambahan */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Catatan / Instruksi Khusus (Opsional):
                </label>
                <textarea
                  rows={2}
                  value={catatanInput}
                  onChange={(e) => setCatatanInput(e.target.value)}
                  placeholder="Contoh: Harap membawa resume medis sebelumnya / Uji skrining 6 parameter..."
                  className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-[#D4AF37] text-xs resize-none"
                />
              </div>

              {/* Action Buttons */}
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
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Menyimpan &amp; Mengirim...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Simpan &amp; Kirim Notifikasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
