import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_USERS } from '../data/initialData';
import {
  User,
  UserCheck,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  ArrowLeftRight,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onGoToLogin?: () => void;
  onGoToLanding?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onSelectUser,
  onGoToLogin,
  onGoToLanding
}) => {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Cohesive, professional rank badges (muted gold / dark navy theme)
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'pimpinan':
        return { label: 'PATI BINTANG 1', color: 'bg-[#1b2b48] text-[#d4af37] border-[#d4af37]/40' };
      case 'koordinator':
        return { label: 'PAMEN MELATI 3', color: 'bg-[#1b2b48] text-[#d4af37] border-[#d4af37]/40' };
      case 'hukum':
        return { label: 'PAMEN MELATI 1 / JAKSA SENIOR', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'pengaju':
        return { label: 'PAMA BALAK 3 (PENYIDIK)', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'medis':
        return { label: 'DOKTER SPESIALIS / ASESOR MEDIS', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'sekretariat':
        return { label: 'KOORDINATOR SEKRETARIAT TAT', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      case 'rehabilitasi':
        return { label: 'PETUGAS BALAI REHABILITASI', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
      default:
        return { label: 'ADMINISTRATOR PUSDATIN SIBER', color: 'bg-[#14243e] text-slate-200 border-[#234168]' };
    }
  };

  const getRoleCapabilities = (role: UserRole) => {
    switch (role) {
      case 'pengaju':
        return {
          title: 'Penyidik Satresnarkoba Polri / BNN',
          capabilities: [
            'Mengajukan permohonan asesmen terpadu digital maksimal 1x24 jam pasca penangkapan',
            'Mengunggah 7 dokumen persyaratan formil (LP, Sprintik, BAP, Uji Lab, KTP, dsb.)',
            'Memperbaiki dokumen formil jika terdapat koreksi administrasi dari Sekretariat',
            'Mengunduh bukti tanda terima pendaftaran dan dokumen Surat Rekomendasi Resmi ber-QR'
          ]
        };
      case 'sekretariat':
        return {
          title: 'Sekretariat Bersama TAT (Gatekeeper Operasional)',
          capabilities: [
            'Verifikasi keabsahan & kelengkapan 7 dokumen permohonan yang diunggah penyidik',
            'Menugaskan tim asesor medis dan asesor hukum berdasarkan ketersediaan',
            'Menetapkan jadwal pemeriksaan terperiksa & jadwal Sidang Pleno Terpadu',
            'Memfasilitasi rujukan admisi fasilitas rehabilitasi medis/sosial mitra'
          ]
        };
      case 'medis':
        return {
          title: 'Tim Asesor Medis & Kedokteran Kepolisian',
          capabilities: [
            'Melakukan wawancara klinis menggunakan instrumen baku WHO ASSIST / ASI',
            'Menentukan diagnosis ICD-10 ketergantungan narkotika (kode F10-F19)',
            'Menetapkan usulan modalitas rehabilitasi (Rawat Jalan / Rawat Inap & durasi)',
            'Penandatanganan TTE mandat medis pada lembar rekomendasi resmi'
          ]
        };
      case 'hukum':
        return {
          title: 'Tim Asesor Hukum & Kejaksaan',
          capabilities: [
            'Penelaahan kualifikasi yuridis peran terperiksa (Pengguna Murni vs Pengedar/Jaringan)',
            'Pengujian gramatur barang bukti terhadap batas kepemilikan 1 hari pakai SEMA 04/2010',
            'Pemeriksaan keabsahan BAP saksi penangkap dan status residivis',
            'Penandatanganan TTE mandat hukum pada lembar rekomendasi resmi'
          ]
        };
      case 'koordinator':
        return {
          title: 'Ketua / Koordinator Tim Asesmen Terpadu',
          capabilities: [
            'Memimpin musyawarah Sidang Pleno Terpadu 3 Pihak (Polri, BNN, Kejaksaan)',
            'Persetujuan draf konsensus rekomendasi terpadu hasil pleno',
            'Pengesahan akhir TTE Surat Rekomendasi Resmi ber-QR',
            'Memantau kepatuhan batas waktu SLA 6 hari kerja'
          ]
        };
      case 'pimpinan':
        return {
          title: 'Pimpinan Satuan & Pengawas Perkara',
          capabilities: [
            'Monitoring executive dashboard perkara asesmen wilayah hukum Kaltim',
            'Pengawasan indikator kepatuhan SLA 6 hari kerja dan hambatan rujukan',
            'Akses laporan analitik statistik penanganan perkara narkotika daerah'
          ]
        };
      case 'rehabilitasi':
        return {
          title: 'Petugas Rujukan & Balai Rehabilitasi Mitra',
          capabilities: [
            'Pencatatan konfirmasi penerimaan admisi terperiksa di balai rehabilitasi',
            'Mengunggah laporan berkala kemajuan program terapi/rehabilitasi klien',
            'Pemantauan pengawasan pasca-TAT & rehabilitasi medis/sosial'
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

  return (
    <div className="space-y-5 pb-10">
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
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 truncate">
                {currentUser.agency}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#1c355e]">
            {onGoToLogin && (
              <button
                type="button"
                onClick={onGoToLogin}
                className="bg-[#142642] hover:bg-[#1a3359] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#234475] transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Ganti Otoritas Role</span>
              </button>
            )}
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
            <span className="text-[10px] text-slate-400 font-mono">ID: {currentUser.id}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">Nama Lengkap &amp; Gelar</span>
              <span className="font-semibold text-white text-xs sm:text-sm block">{currentUser.name}</span>
            </div>

            <div className="bg-[#081224] border border-[#1c355e] rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">NIP / Nomor Registrasi Anggota</span>
              <span className="font-mono font-semibold text-slate-200 text-xs sm:text-sm block">{currentUser.nip}</span>
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

        {/* Right Column: Hak Akses & Keamanan Sesi */}
        <div className="lg:col-span-2 space-y-5">
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
                {MOCK_USERS.map((user) => {
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
    </div>
  );
};
