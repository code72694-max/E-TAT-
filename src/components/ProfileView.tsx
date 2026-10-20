import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, PetugasLainnyaItem } from '../types';
import {
  User,
  UserCheck,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  ArrowLeftRight,
  CheckCircle2,
  Building2,
  Users,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  AlertCircle,
  Award,
  Briefcase,
  Hash,
  BadgeCheck
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
  users?: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onGoToLogin?: () => void;
  onGoToLanding?: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

const normalizePetugas = (list?: (string | PetugasLainnyaItem)[]): PetugasLainnyaItem[] => {
  if (!Array.isArray(list)) return [];
  return list.map(item => {
    if (typeof item === 'string') {
      const isPol = item.includes('Pol') || item.includes('Kombes') || item.includes('Ipda') || item.includes('Kompol');
      return {
        nama: item,
        tipeIdentitas: isPol ? 'NRP' : 'NIP',
        nomorIdentitas: item.includes('Polri') || item.includes('Andi') ? '76090412' : item.includes('Penyidik') || item.includes('Budi') ? '85010234' : '198603152012011002'
      };
    }
    return {
      nama: item.nama || '',
      tipeIdentitas: item.tipeIdentitas || (item.nama?.includes('Pol') ? 'NRP' : 'NIP'),
      nomorIdentitas: item.nomorIdentitas || ''
    };
  });
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  users = [],
  onSelectUser,
  onGoToLogin,
  onGoToLanding,
  onUpdateUser
}) => {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Normalized Role checks
  const roleUpper = (currentUser.role || '').toUpperCase();
  const isMedisOrHukum = roleUpper === 'MEDIS' || roleUpper === 'HUKUM';

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name || '',
    tipeIdentitas: currentUser.tipeIdentitas || (roleUpper === 'PENGAJU' || currentUser.name?.includes('Pol') ? 'NRP' : 'NIP'),
    nip: currentUser.nip || '',
    pangkat: currentUser.pangkat || '',
    position: currentUser.position || '',
    agency: currentUser.agency || '',
    email: currentUser.email || '',
    phone: currentUser.phone || ''
  });

  // Additional Officers State (Petugas Lainnya) - Max 2 additional (Total 3 with main examiner)
  const [petugasList, setPetugasList] = useState<PetugasLainnyaItem[]>(() => {
    return normalizePetugas(currentUser.petugasLainnya);
  });

  // Form input for new officer
  const [newPetugasNama, setNewPetugasNama] = useState('');
  const [newPetugasTipe, setNewPetugasTipe] = useState<string>(
    roleUpper === 'HUKUM' ? 'NRP' : 'NIP'
  );
  const [newPetugasNomor, setNewPetugasNomor] = useState('');

  // Editing existing officer inline
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPetugasNama, setEditPetugasNama] = useState('');
  const [editPetugasTipe, setEditPetugasTipe] = useState<string>('NRP');
  const [editPetugasNomor, setEditPetugasNomor] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync state whenever currentUser changes
  useEffect(() => {
    setProfileForm({
      name: currentUser.name || '',
      tipeIdentitas: currentUser.tipeIdentitas || (roleUpper === 'PENGAJU' || currentUser.name?.includes('Pol') ? 'NRP' : 'NIP'),
      nip: currentUser.nip || '',
      pangkat: currentUser.pangkat || '',
      position: currentUser.position || '',
      agency: currentUser.agency || '',
      email: currentUser.email || '',
      phone: currentUser.phone || ''
    });
    setPetugasList(normalizePetugas(currentUser.petugasLainnya));
  }, [currentUser, roleUpper]);

  // Cohesive, professional rank badges
  const getRoleBadge = (role: UserRole) => {
    const r = (role || '').toUpperCase();
    switch (r) {
      case 'PIMPINAN':
        return { label: 'PATI BINTANG 1', color: 'bg-[#1b2b48] text-[#d4af37] border-[#d4af37]/40' };
      case 'KOORDINATOR':
        return { label: 'PAMEN MELATI 3', color: 'bg-[#1b2b48] text-[#d4af37] border-[#d4af37]/40' };
      case 'HUKUM':
        return { label: 'TIM ASESOR HUKUM TAT', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'PENGAJU':
        return { label: 'PENYIDIK PENGAJU (POLRI / BNN)', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'MEDIS':
        return { label: 'TIM ASESOR MEDIS TAT', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'SEKRETARIAT':
      case 'ADMIN':
        return { label: 'SEKRETARIAT TAT / KOORDINATOR', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'REHABILITASI':
        return { label: 'PETUGAS BALAI REHABILITASI', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      default:
        return { label: 'ADMINISTRATOR PUSDATIN SIBER', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
    }
  };

  const getRoleCapabilities = (role: UserRole) => {
    const r = (role || '').toUpperCase();
    switch (r) {
      case 'PENGAJU':
        return {
          title: 'Penyidik Satresnarkoba Polri / BNN',
          capabilities: [
            'Mengajukan permohonan asesmen terpadu digital maksimal 1x24 jam pasca penangkapan',
            'Mengunggah 7 dokumen persyaratan formil (LP, Sprintik, BAP, Uji Lab, KTP, dsb.)',
            'Memperbaiki dokumen formil jika terdapat koreksi administrasi dari Sekretariat',
            'Mengunduh bukti tanda terima pendaftaran dan dokumen Surat Rekomendasi Resmi ber-QR'
          ]
        };
      case 'ADMIN':
      case 'SEKRETARIAT':
        return {
          title: 'Sekretariat Bersama TAT (Gatekeeper Operasional)',
          capabilities: [
            'Verifikasi keabsahan & kelengkapan 7 dokumen permohonan yang diunggah penyidik',
            'Menugaskan tim asesor medis dan asesor hukum berdasarkan ketersediaan',
            'Menetapkan jadwal pemeriksaan terperiksa & jadwal Sidang Pleno Terpadu',
            'Pengesahan akhir TTE Surat Rekomendasi Resmi ber-QR dan Berita Acara Pleno'
          ]
        };
      case 'MEDIS':
        return {
          title: 'Tim Asesor Medis & Kedokteran Kepolisian',
          capabilities: [
            'Melakukan wawancara klinis menggunakan instrumen baku WHO ASSIST / ASI',
            'Menentukan diagnosis ICD-10 ketergantungan narkotika (kode F10-F19)',
            'Menetapkan usulan modalitas rehabilitasi (Rawat Jalan / Rawat Inap & durasi)',
            'Penandatanganan TTE mandat medis pada lembar rekomendasi resmi & Berita Acara'
          ]
        };
      case 'HUKUM':
        return {
          title: 'Tim Asesor Hukum & Kejaksaan',
          capabilities: [
            'Penelaahan kualifikasi yuridis peran terperiksa (Pengguna Murni vs Pengedar/Jaringan)',
            'Pengujian gramatur barang bukti terhadap batas kepemilikan 1 hari pakai SEMA 04/2010',
            'Pemeriksaan keabsahan BAP saksi penangkap dan status residivis',
            'Penandatanganan TTE mandat hukum pada lembar rekomendasi resmi & Berita Acara'
          ]
        };
      default:
        return {
          title: 'Administrator Sistem & Pusdatin Siber',
          capabilities: [
            'Pengelolaan akun pengguna dan otorisasi akses berbasis peran (RBAC)',
            'Pengaturan master data parameter gramatur zat dan fasilitas mitra',
            'Pemantauan integritas kunci verifikasi QR kriptografis dan audit log forensik'
          ]
        };
    }
  };

  const badgeInfo = getRoleBadge(currentUser.role);
  const roleInfo = getRoleCapabilities(currentUser.role);

  // Handle Save Main Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      alert('Nama lengkap tidak boleh kosong.');
      return;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      name: profileForm.name.trim(),
      tipeIdentitas: profileForm.tipeIdentitas,
      nip: profileForm.nip.trim(),
      pangkat: profileForm.pangkat.trim(),
      position: profileForm.position.trim(),
      agency: profileForm.agency.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim()
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setShowEditProfileModal(false);
    setNotification({
      type: 'success',
      message: 'Data identitas kedinasan dan jabatan berhasil diperbarui!'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Add Additional Officer (Petugas Lainnya) with NIP/NRP support
  const handleAddPetugas = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNama = newPetugasNama.trim();
    if (!cleanNama) return;

    if (petugasList.length >= 2) {
      setNotification({
        type: 'error',
        message: 'Batas maksimal 3 personel pemeriksa telah terpenuhi (1 Akun Utama + 2 Petugas Lainnya).'
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    if (petugasList.some(p => p.nama.toLowerCase() === cleanNama.toLowerCase()) || cleanNama.toLowerCase() === currentUser.name.toLowerCase()) {
      setNotification({
        type: 'error',
        message: 'Nama petugas tersebut sudah terdaftar dalam tim pemeriksa.'
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const newOfficer: PetugasLainnyaItem = {
      nama: cleanNama,
      tipeIdentitas: newPetugasTipe,
      nomorIdentitas: newPetugasNomor.trim()
    };

    const updated = [...petugasList, newOfficer];
    setPetugasList(updated);
    setNewPetugasNama('');
    setNewPetugasNomor('');

    const updatedUser: UserProfile = {
      ...currentUser,
      petugasLainnya: updated
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setNotification({
      type: 'success',
      message: `Petugas "${cleanNama}" (${newPetugasTipe}: ${newPetugasNomor.trim() || '-'}) berhasil ditambahkan ke tim pemeriksa.`
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Start Editing Officer
  const handleStartEdit = (idx: number) => {
    const item = petugasList[idx];
    setEditingIndex(idx);
    setEditPetugasNama(item.nama);
    setEditPetugasTipe((item.tipeIdentitas as any) || 'NRP');
    setEditPetugasNomor(item.nomorIdentitas || '');
  };

  // Save Edited Officer
  const handleSaveEdit = (idx: number) => {
    if (!editPetugasNama.trim()) return;

    const updated = [...petugasList];
    updated[idx] = {
      ...updated[idx],
      nama: editPetugasNama.trim(),
      tipeIdentitas: editPetugasTipe,
      nomorIdentitas: editPetugasNomor.trim()
    };

    setPetugasList(updated);
    setEditingIndex(null);

    const updatedUser: UserProfile = {
      ...currentUser,
      petugasLainnya: updated
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setNotification({
      type: 'success',
      message: 'Perubahan data petugas pemeriksa berhasil disimpan.'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Remove Additional Officer
  const handleRemovePetugas = (indexToRemove: number) => {
    const updated = petugasList.filter((_, idx) => idx !== indexToRemove);
    setPetugasList(updated);

    const updatedUser: UserProfile = {
      ...currentUser,
      petugasLainnya: updated
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setNotification({
      type: 'success',
      message: 'Petugas pemeriksa berhasil dihapus dari daftar tim.'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const userTipeLabel = currentUser.tipeIdentitas || (roleUpper === 'PENGAJU' || currentUser.name.includes('Pol') ? 'NRP' : 'NIP');

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Profile Header */}
      <div className="bg-[#0b172a] border border-[#1c355e] rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#13243d] border border-[#274675] flex items-center justify-center shrink-0 shadow-inner">
              <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded border ${badgeInfo.color}`}>
                  {badgeInfo.label}
                </span>
                <span className="text-[10px] text-slate-300 font-mono font-medium bg-[#14243e] px-2 py-0.5 rounded border border-[#234168] flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-[#d4af37] inline" />
                  <span>TERVERIFIKASI PUSDATIN</span>
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-white mt-1 tracking-tight truncate">
                {currentUser.name}
              </h1>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300 font-medium mt-0.5 flex-wrap gap-y-1">
                {currentUser.pangkat && (
                  <span className="text-[#d4af37] font-semibold">{currentUser.pangkat}</span>
                )}
                {currentUser.pangkat && currentUser.position && <span>•</span>}
                {currentUser.position && (
                  <span className="text-slate-300 truncate max-w-md">{currentUser.position}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {currentUser.agency}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#1c355e]">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(true)}
              className="bg-[#1b2b48] hover:bg-[#23385d] text-[#d4af37] text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#d4af37]/40 transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil &amp; Jabatan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content: Identitas & Hak Akses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Data Identitas Kedinasan */}
        <div className="lg:col-span-1 bg-[#0b172a] border border-[#1c355e] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-[#1c355e] flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4 text-[#d4af37]" />
              <span>Data Identitas Kedinasan</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowEditProfileModal(true)}
              className="text-[11px] font-semibold text-[#d4af37] hover:underline cursor-pointer flex items-center space-x-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Ubah</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">Nama Lengkap &amp; Gelar</span>
              <span className="font-semibold text-white text-xs sm:text-sm block">{currentUser.name}</span>
            </div>

            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">Pangkat / Golongan</span>
              <span className="font-semibold text-[#d4af37] text-xs sm:text-sm block flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{currentUser.pangkat || 'Belum diisi'}</span>
              </span>
            </div>

            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">Jabatan Kedinasan Resmi</span>
              <span className="font-semibold text-slate-200 text-xs sm:text-sm block flex items-center space-x-1.5 leading-snug">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{currentUser.position || 'Pejabat Tim Asesmen Terpadu'}</span>
              </span>
            </div>

            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium block">Nomor Identitas ({userTipeLabel})</span>
                <span className="text-[9px] font-mono bg-[#142642] text-[#d4af37] border border-[#234475] px-1.5 py-0.2 rounded font-bold">
                  {userTipeLabel}
                </span>
              </div>
              <span className="font-mono font-semibold text-slate-200 text-xs sm:text-sm block">
                {currentUser.nip}
              </span>
            </div>

            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">Unit Satuan Kerja / Instansi</span>
              <span className="font-medium text-slate-300 block leading-snug">{currentUser.agency}</span>
            </div>

            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">Email Kedinasan Resmi</span>
              <span className="font-mono text-slate-300 text-xs flex items-center space-x-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </span>
            </div>

            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">Nomor Telepon Kontak</span>
              <span className="font-mono text-slate-300 text-xs flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{currentUser.phone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Tim Pemeriksa Lainnya (Khusus Hukum & Medis), Hak Akses, Keamanan */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card Khusus: Daftar Petugas Tim Pemeriksa (HANYA UNTUK ROLE HUKUM & MEDIS) */}
          {isMedisOrHukum && (
            <div className="bg-[#0b172a] border-2 border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1c355e] gap-2">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#d4af37]" />
                    <span>Daftar Petugas Tim Pemeriksa {roleUpper === 'HUKUM' ? 'Hukum' : 'Medis'} TAT</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Nama &amp; Nomor Identitas (NIP/NRP) rekan pemeriksa untuk tanda tangan resmi Berita Acara &amp; Rekomendasi.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    petugasList.length + 1 >= 3
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}>
                    KUOTA: {petugasList.length + 1} / 3 PEMERIKSA
                  </span>
                </div>
              </div>

              {/* Informative Guidance */}
              <div className="bg-[#081224] border border-[#1e3a6a] rounded-xl p-3.5 text-xs text-slate-300 space-y-1">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Pemeriksa Utama:</strong> Hanya akun Anda yang bertindak sebagai Pemeriksa 1. Tambahkan hingga maksimal 2 petugas pemeriksa lainnya (total maks 3 pemeriksa) beserta tipe dan nomor identitas dinasnya (NIP / NRP).
                  </p>
                </div>
              </div>

              {/* Tim Pemeriksa List: Slot 1, Slot 2, Slot 3 */}
              <div className="space-y-2.5">
                {/* Slot 1: Pemeriksa Utama (Akun ini - Fixed) */}
                <div className="bg-[#10223d] border border-[#d4af37]/40 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center shrink-0">
                      <span className="font-bold text-xs text-[#d4af37]">1</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                        <span className="font-bold text-xs sm:text-sm text-white truncate">{currentUser.name}</span>
                        <span className="text-[9px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 font-mono font-bold px-2 py-0.5 rounded">
                          AKUN UTAMA (PEMERIKSA 1)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                        {currentUser.position || 'Pemeriksa Tim TAT'} {currentUser.pangkat ? `(${currentUser.pangkat})` : ''} •{' '}
                        <span className="font-mono text-[#d4af37] font-semibold">{userTipeLabel}. {currentUser.nip}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono italic shrink-0 hidden sm:inline">
                    Akun Login Aktif
                  </span>
                </div>

                {/* Slot 2 & Slot 3: Petugas Lainnya */}
                {[0, 1].map((slotIdx) => {
                  const item = petugasList[slotIdx];
                  const slotNumber = slotIdx + 2;

                  if (item) {
                    const isEditingThis = editingIndex === slotIdx;

                    if (isEditingThis) {
                      return (
                        <div key={slotIdx} className="bg-[#081224] border border-[#d4af37] rounded-xl p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#d4af37]">Edit Petugas Pendamping {slotNumber}</span>
                            <button
                              type="button"
                              onClick={() => setEditingIndex(null)}
                              className="text-slate-400 hover:text-white p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="space-y-2 text-xs">
                            <input
                              type="text"
                              value={editPetugasNama}
                              onChange={(e) => setEditPetugasNama(e.target.value)}
                              placeholder="Nama Lengkap & Gelar Petugas"
                              className="w-full bg-[#10223d] border border-[#234475] text-white px-3 py-2 rounded-lg outline-none"
                            />
                            <div className="flex items-center space-x-2">
                              <select
                                value={editPetugasTipe}
                                onChange={(e) => setEditPetugasTipe(e.target.value)}
                                className="bg-[#10223d] border border-[#234475] text-[#d4af37] font-bold px-2.5 py-2 rounded-lg outline-none"
                              >
                                <option value="NRP">NRP</option>
                                <option value="NIP">NIP</option>
                                <option value="NIP/NRP">NIP/NRP</option>
                                <option value="NIK">NIK</option>
                                <option value="SIP / STR">SIP/STR</option>
                              </select>
                              <input
                                type="text"
                                value={editPetugasNomor}
                                onChange={(e) => setEditPetugasNomor(e.target.value)}
                                placeholder="Nomor Angka (Contoh: 76090412)"
                                className="flex-1 bg-[#10223d] border border-[#234475] text-white px-3 py-2 rounded-lg outline-none font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(slotIdx)}
                                className="bg-[#d4af37] text-slate-900 font-bold px-3 py-2 rounded-lg hover:bg-[#e5c158] transition-colors"
                              >
                                Simpan
                              </button>
                            </div>
                            <div className="bg-[#10223d] border border-[#234475] rounded-lg px-3 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                              <span className="text-slate-400 flex items-center space-x-1">
                                <BadgeCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                                <span>Pratinjau Format Dokumen:</span>
                              </span>
                              <span className="font-mono font-bold text-[#d4af37]">
                                {editPetugasNama.trim() ? `${editPetugasNama.trim()} • ` : ''}
                                {editPetugasTipe}. {editPetugasNomor.trim() || '________'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={slotIdx} className="bg-[#081224] border border-[#1c355e] hover:border-slate-500 rounded-xl p-3.5 flex items-center justify-between gap-3 transition-colors">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#142642] border border-[#234475] flex items-center justify-center shrink-0">
                            <span className="font-bold text-xs text-slate-300">{slotNumber}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                              <span className="font-semibold text-xs sm:text-sm text-white truncate">{item.nama}</span>
                              <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 font-mono font-medium px-2 py-0.5 rounded">
                                ASESOR PENDAMPING {slotNumber}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-0.5">
                              Identitas:{' '}
                              {item.nomorIdentitas ? (
                                <span className="font-mono text-[#d4af37] font-semibold">
                                  {item.tipeIdentitas || 'NIP/NRP'}. {item.nomorIdentitas}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">Nomor belum diisi</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(slotIdx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#d4af37] hover:bg-white/5 transition-colors cursor-pointer"
                            title="Edit nama dan NIP/NRP"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePetugas(slotIdx)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-950/60 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                            title="Hapus petugas ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={slotIdx} className="bg-[#081224]/50 border border-dashed border-[#1c355e] rounded-xl p-3 text-center text-xs text-slate-500">
                      Slot Asesor {slotNumber} Kosong {slotNumber === 3 ? '(Opsional)' : '— Gunakan form di bawah untuk menambahkan'}
                    </div>
                  );
                })}
              </div>

              {/* Form Tambah Petugas (Hanya jika kuota belum 2 petugas tambahan) */}
              {petugasList.length < 2 ? (
                <form onSubmit={handleAddPetugas} className="pt-3 border-t border-[#1c355e] space-y-2.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Tambah Petugas Pemeriksa Lainnya (Nama Lengkap &amp; NIP/NRP):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {/* Input Nama Petugas */}
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={newPetugasNama}
                        onChange={(e) => setNewPetugasNama(e.target.value)}
                        placeholder={
                          roleUpper === 'HUKUM'
                            ? 'Contoh: Nama & Gelar Asesor Hukum'
                            : 'Contoh: Nama & Gelar Asesor Medis'
                        }
                        className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none transition-colors"
                      />
                    </div>

                    {/* Selector Tipe Identitas: NIP / NRP / NIP/NRP / NIK */}
                    <div className="sm:col-span-3">
                      <select
                        value={newPetugasTipe}
                        onChange={(e) => setNewPetugasTipe(e.target.value)}
                        className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-[#d4af37] font-bold text-xs px-2.5 py-2.5 rounded-xl outline-none"
                      >
                        <option value="NRP">NRP (Polri)</option>
                        <option value="NIP">NIP (ASN/Jaksa/Medis)</option>
                        <option value="NIP/NRP">NIP/NRP</option>
                        <option value="NIK">NIK (KTP)</option>
                        <option value="SIP / STR">SIP / STR (Medis)</option>
                      </select>
                    </div>

                    {/* Input Nomor / Angka Identitas */}
                    <div className="sm:col-span-3 flex items-center space-x-2">
                      <input
                        type="text"
                        value={newPetugasNomor}
                        onChange={(e) => setNewPetugasNomor(e.target.value)}
                        placeholder="Nomor Angka (76090412)"
                        className="flex-1 bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl outline-none font-mono"
                      />
                      <button
                        type="submit"
                        disabled={!newPetugasNama.trim()}
                        className="bg-[#142642] hover:bg-[#1b3459] disabled:opacity-40 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#234475] hover:border-[#d4af37]/60 transition-all flex items-center justify-center space-x-1 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </div>

                  {/* Realtime Live Preview */}
                  {(newPetugasNama.trim() || newPetugasNomor.trim()) && (
                    <div className="bg-[#10223d] border border-[#234475] rounded-xl px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5 animate-in fade-in duration-150">
                      <span className="text-slate-300 flex items-center space-x-1.5 font-medium">
                        <BadgeCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                        <span>Pratinjau Format Dokumen:</span>
                      </span>
                      <span className="font-mono font-bold text-[#d4af37]">
                        {newPetugasNama.trim() ? `${newPetugasNama.trim()} • ` : ''}
                        {newPetugasTipe}. {newPetugasNomor.trim() || '________'}
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400">
                    * Format resmi: tipe identitas (NIP/NRP/NIK) dicantumkan di depan nomor angka, dan akan tertera otomatis di Berita Acara &amp; Dokumen Rekomendasi TAT.
                  </p>
                </form>
              ) : (
                <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-center text-xs text-emerald-300">
                  ✓ Kuota maksimal 3 pemeriksa dalam tim telah terpenuhi. Jika ingin mengganti nama atau NIP/NRP, silakan gunakan tombol edit atau hapus di atas.
                </div>
              )}
            </div>
          )}

          {/* Hak Akses Card */}
          <div className="bg-[#0b172a] border border-[#1c355e] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-[#1c355e] flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Hak Akses &amp; Wewenang Operasional ({roleInfo.title})</span>
              </h2>
              <span className="text-[10px] text-slate-300 font-mono font-medium bg-[#14243e] px-2 py-0.5 rounded border border-[#234168]">
                OTORITAS SIBER
              </span>
            </div>

            <div className="space-y-2">
              {roleInfo.capabilities.map((cap, idx) => (
                <div key={idx} className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 font-normal leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keamanan Sesi Card */}
          <div className="bg-[#0b172a] border border-[#1c355e] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-[#1c355e] flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <Lock className="w-4 h-4 text-slate-300" />
                <span>Keamanan Sesi &amp; Integrity Audit</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                STATUS: AKTIF
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">Enkripsi Sesi</span>
                <span className="font-mono font-semibold text-slate-200 text-xs block">AES-256 Bit</span>
                <span className="text-[10px] text-slate-400 block">End-to-End Cryptography</span>
              </div>
              <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">Koneksi Lembaga</span>
                <span className="font-mono font-semibold text-slate-200 text-xs block">BNNP KALTIM</span>
                <span className="text-[10px] text-slate-400 block">Interkoneksi Terverifikasi</span>
              </div>
              <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">Status Audit Log</span>
                <span className="font-mono font-semibold text-slate-200 text-xs block">100% Valid</span>
                <span className="text-[10px] text-slate-400 block">Immutable Forensics</span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="bg-[#0b172a] border border-[#1c355e] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c355e]">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <ArrowLeftRight className="w-4 h-4 text-[#d4af37]" />
                <span>Simulasi Switch Akun Role (Pengujian System)</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="text-xs font-semibold text-[#d4af37] hover:underline cursor-pointer"
              >
                {showRoleSwitcher ? 'Sembunyikan' : 'Tampilkan Akun'}
              </button>
            </div>

            {showRoleSwitcher && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {(users && users.length > 0 ? users : [currentUser]).map((user) => {
                  const isActive = user.id === currentUser.id;
                  const rank = getRoleBadge(user.role);
                  return (
                    <button
                      key={user.id}
                      onClick={() => onSelectUser(user)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-start space-x-3 ${
                        isActive
                          ? 'bg-[#142642] border-[#d4af37]/60 text-white'
                          : 'bg-[#081224] hover:bg-[#101e36] border-[#1c355e] text-slate-300'
                      }`}
                    >
                      <UserCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-[#d4af37]' : 'text-slate-500'}`} />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-xs block text-white truncate">{user.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{user.agency}</span>
                        <span className={`inline-block mt-1 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border ${rank.color}`}>
                          {rank.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Edit Data Identitas & Jabatan */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0b172a] border border-[#1c355e] rounded-2xl w-full max-w-xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c355e]">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-base font-bold text-white">Edit Data Profil &amp; Jabatan Kedinasan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Nama Lengkap &amp; Gelar Resmi *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Contoh: Nama Lengkap & Gelar Resmi"
                  className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white px-3.5 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-slate-300 font-semibold block">Tipe Identitas *</label>
                  <select
                    value={profileForm.tipeIdentitas}
                    onChange={(e) => setProfileForm({ ...profileForm, tipeIdentitas: e.target.value })}
                    className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-[#d4af37] font-bold px-3 py-2.5 rounded-xl outline-none"
                  >
                    <option value="NRP">NRP (Polri)</option>
                    <option value="NIP">NIP (PNS/Dokter/Jaksa)</option>
                    <option value="NIP/NRP">NIP/NRP (Umum)</option>
                    <option value="NIK">NIK (KTP)</option>
                    <option value="SIP / STR">SIP / STR (Medis)</option>
                  </select>
                </div>

                <div className="sm:col-span-8 space-y-1">
                  <label className="text-slate-300 font-semibold block">Nomor Angka ({profileForm.tipeIdentitas}) *</label>
                  <input
                    type="text"
                    value={profileForm.nip}
                    onChange={(e) => setProfileForm({ ...profileForm, nip: e.target.value })}
                    placeholder="Contoh: 198205122008012001 atau 79080512"
                    className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white px-3.5 py-2.5 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              {/* Realtime Live Preview Akun Utama */}
              <div className="bg-[#10223d] border border-[#234475] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
                <span className="text-slate-300 flex items-center space-x-1.5 font-medium">
                  <BadgeCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Format Tanda Tangan Dokumen:</span>
                </span>
                <span className="font-mono font-bold text-[#d4af37]">
                  {profileForm.name || currentUser.name} • {profileForm.tipeIdentitas}. {profileForm.nip || '________'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Pangkat / Golongan *</label>
                  <input
                    type="text"
                    value={profileForm.pangkat}
                    onChange={(e) => setProfileForm({ ...profileForm, pangkat: e.target.value })}
                    placeholder="Contoh: Pembina / Penata Tk. I (IV/b) atau Jaksa Muda (III/d)"
                    className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Jabatan Kedinasan Resmi *</label>
                  <input
                    type="text"
                    value={profileForm.position}
                    onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                    placeholder="Contoh: Dokter Spesialis Kedokteran Jiwa / Asesor Medis TAT"
                    className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Unit Satuan Kerja / Instansi</label>
                <input
                  type="text"
                  value={profileForm.agency}
                  onChange={(e) => setProfileForm({ ...profileForm, agency: e.target.value })}
                  placeholder="Contoh: BNNP Kalimantan Timur / Kejaksaan Tinggi Kaltim"
                  className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white px-3.5 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Email Kedinasan</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white px-3.5 py-2.5 rounded-xl outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Nomor Telepon Kontak</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#081224] border border-[#1c355e] focus:border-[#d4af37] text-white px-3.5 py-2.5 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c355e] flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#1c355e] text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#142642] hover:bg-[#1b3459] text-white font-bold border border-[#234475] hover:border-[#d4af37]/60 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4 text-[#d4af37]" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
