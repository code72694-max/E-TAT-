import React, { useState } from 'react';
import { RegistrasiPengguna, UserProfile, UserRole } from '../types';
import { registrasiApi, authApi } from '../services/api';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  FileText,
  Search,
  Filter,
  Eye,
  ZoomIn,
  X,
  AlertCircle,
  BadgeCheck,
  Shield,
  RotateCcw,
  Check,
  Briefcase,
  ExternalLink,
  Calendar,
  UserPlus,
  Lock,
  Loader2
} from 'lucide-react';

interface VerifikasiAkunViewProps {
  registrations: RegistrasiPengguna[];
  onUpdateRegistration: (updated: RegistrasiPengguna) => void;
  onApproveRegistration?: (reg: RegistrasiPengguna) => void;
  currentUser?: UserProfile;
}

export const VerifikasiAkunView: React.FC<VerifikasiAkunViewProps> = ({
  registrations,
  onUpdateRegistration,
  onApproveRegistration,
  currentUser
}) => {
  // Tab State: 'menunggu' (Pending) or 'daftar' (All Accounts)
  const [activeTab, setActiveTab] = useState<'menunggu' | 'daftar'>('menunggu');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');
  const [instansiFilter, setInstansiFilter] = useState<string>('all');

  // Detail Modal & Actions
  const [selectedRegDetail, setSelectedRegDetail] = useState<RegistrasiPengguna | null>(null);
  const [rejectModalTarget, setRejectModalTarget] = useState<RegistrasiPengguna | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Direct User Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  const [newUserRole, setNewUserRole] = useState<UserRole>('MEDIS');
  const [newUserNip, setNewUserNip] = useState('');
  const [newUserAgency, setNewUserAgency] = useState('');
  const [newUserPosition, setNewUserPosition] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');

  // Stats
  const pendingRegistrations = registrations.filter(r => r.status === 'pending');
  const approvedRegistrations = registrations.filter(r => r.status === 'approved');
  const rejectedRegistrations = registrations.filter(r => r.status === 'rejected');

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleApprove = async (reg: RegistrasiPengguna) => {
    const verifikatorName = currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Sekretariat TAT POLRI';
    const note = reg.catatanAdmin || 'Dokumen KTP, KTA, dan Surat Penunjukan telah diverifikasi sah & valid.';
    
    let updated: RegistrasiPengguna = {
      ...reg,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: verifikatorName,
      catatanAdmin: note
    };

    try {
      const res = await registrasiApi.approve(reg.id, note);
      if (res.data) {
        updated = { ...updated, ...res.data };
      }
    } catch (err) {
      console.warn('Backend approve error, using state:', err);
    }

    if (onApproveRegistration) {
      onApproveRegistration(updated);
    } else {
      onUpdateRegistration(updated);
    }

    if (selectedRegDetail?.id === reg.id) {
      setSelectedRegDetail(updated);
    }

    showToast(`Akun ${getFormattedOfficerName(reg.pangkat, reg.namaLengkap)} (${reg.instansi}) BERHASIL DISETUJUI!`);
  };

  const handleOpenRejectModal = (reg: RegistrasiPengguna) => {
    setRejectModalTarget(reg);
    setRejectReasonInput('');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalTarget) return;

    const note = rejectReasonInput.trim() || 'Dokumen persyaratan dinas tidak lengkap atau tidak valid.';
    let updated: RegistrasiPengguna = {
      ...rejectModalTarget,
      status: 'rejected',
      catatanAdmin: note
    };

    try {
      const res = await registrasiApi.reject(rejectModalTarget.id, note);
      if (res.data) {
        updated = { ...updated, ...res.data };
      }
    } catch (err) {
      console.warn('Backend reject error, using state:', err);
    }

    onUpdateRegistration(updated);

    if (selectedRegDetail?.id === rejectModalTarget.id) {
      setSelectedRegDetail(updated);
    }

    showToast(`Pendaftaran akun untuk ${getFormattedOfficerName(rejectModalTarget.pangkat, rejectModalTarget.namaLengkap)} telah DITOLAK.`);
    setRejectModalTarget(null);
    setRejectReasonInput('');
  };

  const handleResetToPending = (reg: RegistrasiPengguna) => {
    const updated: RegistrasiPengguna = {
      ...reg,
      status: 'pending',
      approvedAt: undefined,
      approvedBy: undefined,
      catatanAdmin: undefined
    };

    onUpdateRegistration(updated);

    if (selectedRegDetail?.id === reg.id) {
      setSelectedRegDetail(updated);
    }

    showToast(`Status pendaftaran ${reg.namaLengkap} dikembalikan ke antrean Menunggu Verifikasi.`);
  };

  const handleDirectCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      showToast('Nama, Email, dan Kata Sandi wajib diisi!');
      return;
    }

    setIsSubmittingUser(true);
    try {
      const res = await authApi.createUser({
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        password: newUserPassword,
        role: newUserRole,
        nip: newUserNip.trim() || undefined,
        agency: newUserAgency.trim() || undefined,
        position: newUserPosition.trim() || undefined,
        phone: newUserPhone.trim() || undefined,
      });

      if (res.data) {
        showToast(`Akun ${res.data.name} (${res.data.role}) BERHASIL DIBUAT di database!`);
        setIsCreateModalOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('password123');
        setNewUserNip('');
        setNewUserAgency('');
        setNewUserPosition('');
        setNewUserPhone('');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat akun.');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  // Helper formatting to avoid duplicate ranks (e.g. "AKBP AKBP Budi")
  const getFormattedOfficerName = (pangkat?: string, namaLengkap?: string) => {
    if (!namaLengkap) return '-';
    if (!pangkat) return namaLengkap;
    const cleanNama = namaLengkap.trim();
    const cleanPangkat = pangkat.trim();
    if (cleanNama.toLowerCase().startsWith(cleanPangkat.toLowerCase())) {
      return cleanNama;
    }
    return `${cleanPangkat} ${cleanNama}`;
  };

  const formatTanggal = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      return new Date(isoString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return isoString;
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'pengaju': return 'Penyidik / Pengaju Asesmen';
      case 'sekretariat': return 'Sekretariat TAT';
      case 'medis': return 'Tim Asesmen Medis';
      case 'hukum': return 'Tim Asesmen Hukum';
      case 'koordinator': return 'Ketua / Koordinator TAT';
      case 'pimpinan': return 'Pimpinan Satwil / Pengawas';
      case 'rehabilitasi': return 'Petugas Fasilitas Rehabilitasi';
      default: return role || 'Pengguna Kedinasan';
    }
  };

  // Filtered List for "Daftar Akun" tab
  const filteredDaftarAkun = registrations.filter(reg => {
    if (statusFilter !== 'all' && reg.status !== statusFilter) return false;
    if (instansiFilter !== 'all' && reg.kategoriInstansi !== instansiFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = reg.namaLengkap.toLowerCase().includes(q);
      const matchNrp = reg.nrp.toLowerCase().includes(q);
      const matchInstansi = reg.instansi.toLowerCase().includes(q);
      const matchNomorReg = reg.nomorRegistrasi.toLowerCase().includes(q);
      const matchEmail = reg.email.toLowerCase().includes(q);
      const matchJabatan = reg.jabatan.toLowerCase().includes(q);
      const matchWilayah = reg.wilayahHukum.toLowerCase().includes(q);
      return matchName || matchNrp || matchInstansi || matchNomorReg || matchEmail || matchJabatan || matchWilayah;
    }
    return true;
  });

  const categoryOptions = Array.from(new Set(registrations.map(r => r.kategoriInstansi).filter(Boolean)));

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0c1a30] border border-[#234475] text-slate-200 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-medium backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Clean Top Bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1a2e4c] pb-4">
        {/* Simple Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#091426] p-1 rounded-xl border border-[#1a2e4c]">
          {/* Tab 1: Menunggu Verifikasi */}
          <button
            onClick={() => {
              setActiveTab('menunggu');
              setStatusFilter('all');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'menunggu'
                ? 'bg-[#142642] text-white border border-[#234475]'
                : 'text-slate-400 hover:text-white hover:bg-[#142642]/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Menunggu Verifikasi</span>
            {pendingRegistrations.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#1b3459] text-[#d4af37] border border-[#234475]">
                {pendingRegistrations.length}
              </span>
            )}
          </button>

          {/* Tab 2: Daftar Akun */}
          <button
            onClick={() => setActiveTab('daftar')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'daftar'
                ? 'bg-[#142642] text-white border border-[#234475]'
                : 'text-slate-400 hover:text-white hover:bg-[#142642]/40'
            }`}
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Daftar Akun</span>
            <span className="px-1.5 py-0.2 text-[10px] font-medium rounded-full bg-[#142642] text-slate-400 border border-[#1a2e4c]">
              {registrations.length}
            </span>
          </button>
        </div>

        {/* Right Section: Create User Button & Search Input */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] hover:text-[#f3e5ab] text-xs font-bold rounded-xl border border-[#d4af37]/30 transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Buat Akun Petugas</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, NRP, instansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#091426] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-7 py-2 rounded-xl border border-[#1a2e4c] focus:outline-none focus:border-[#234475] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MENUNGGU VERIFIKASI (CLEAN VERTICAL STACK) */}
      {/* ========================================================= */}
      {activeTab === 'menunggu' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              Permohonan Registrasi Akun Menunggu Persetujuan ({pendingRegistrations.length})
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline-block">
              Klik salah satu akun untuk melihat dokumen & rincian data
            </span>
          </div>

          {pendingRegistrations.length === 0 ? (
            <div className="bg-[#091426] border border-[#1a2e4c] rounded-xl p-8 text-center text-slate-400 text-xs">
              Tidak ada pendaftaran akun baru yang menunggu verifikasi.
            </div>
          ) : (
            /* BERJAJAR KE BAWAH (VERTICAL LIST) */
            <div className="flex flex-col space-y-2.5">
              {pendingRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => setSelectedRegDetail(reg)}
                  className="bg-[#091426] hover:bg-[#0c1a30] border border-[#1a2e4c] hover:border-[#234475] rounded-xl p-3.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 cursor-pointer group shadow-sm"
                >
                  {/* Left: Officer & Rank */}
                  <div className="flex items-center space-x-3 min-w-0 md:w-4/12">
                    <div className="w-10 h-10 rounded-lg bg-[#142642] border border-[#1a2e4c] overflow-hidden shrink-0">
                      <img
                        src={reg.fotoKtaUrl || reg.fotoKtpUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'}
                        alt={reg.namaLengkap}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
                          {getFormattedOfficerName(reg.pangkat, reg.namaLengkap)}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono">NRP: {reg.nrp}</span>
                        <span>•</span>
                        <span className="truncate">{reg.jabatan}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                        {reg.nomorRegistrasi}
                      </span>
                    </div>
                  </div>

                  {/* Center: Instansi & Kontak */}
                  <div className="min-w-0 md:w-5/12 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-200 truncate">{reg.instansi}</span>
                      <span className="text-[10px] text-slate-400">({reg.wilayahHukum})</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 truncate font-mono">
                      <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{reg.email}</span>
                      <span>•</span>
                      <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{reg.phone}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 shrink-0 md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#1a2e4c]" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedRegDetail(reg)}
                      className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 hover:text-white text-xs font-medium rounded-lg border border-[#234475] transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Detail</span>
                    </button>

                    <button
                      onClick={() => handleApprove(reg)}
                      className="px-3 py-1.5 bg-[#17382d] hover:bg-[#1e473a] text-emerald-300 hover:text-emerald-200 text-xs font-semibold rounded-lg border border-emerald-700/50 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>

                    <button
                      onClick={() => handleOpenRejectModal(reg)}
                      className="px-3 py-1.5 bg-[#26161b] hover:bg-[#341b24] text-rose-300 hover:text-rose-200 text-xs font-semibold rounded-lg border border-rose-800/50 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DAFTAR AKUN (CLEAN TABLE) */}
      {/* ========================================================= */}
      {activeTab === 'daftar' && (
        <div className="space-y-3">
          {/* Sub-Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-[#091426] p-1 rounded-lg border border-[#1a2e4c]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-[#142642] text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua ({registrations.length})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'approved' ? 'bg-[#142642] text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Disetujui ({approvedRegistrations.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-[#142642] text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pending ({pendingRegistrations.length})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'rejected' ? 'bg-[#142642] text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ditolak ({rejectedRegistrations.length})
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-xs hidden sm:inline">Kategori:</span>
              <select
                value={instansiFilter}
                onChange={(e) => setInstansiFilter(e.target.value)}
                className="bg-[#091426] text-xs text-slate-200 border border-[#1a2e4c] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#091426] text-slate-200">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#091426] border border-[#1a2e4c] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060e1a] text-slate-400 border-b border-[#1a2e4c] font-semibold text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Nama & NRP</th>
                    <th className="px-4 py-3">Instansi & Wilayah</th>
                    <th className="px-4 py-3">Jabatan & Peran</th>
                    <th className="px-4 py-3">Kontak</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tgl Daftar</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a2e4c]/70 text-slate-300">
                  {filteredDaftarAkun.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-xs">
                        Tidak ada data akun yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDaftarAkun.map((reg) => (
                      <tr
                        key={reg.id}
                        onClick={() => setSelectedRegDetail(reg)}
                        className="hover:bg-[#0c1a30] transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3">
                          <span className="font-bold text-white group-hover:text-[#d4af37] transition-colors block">
                            {getFormattedOfficerName(reg.pangkat, reg.namaLengkap)}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            NRP: {reg.nrp} • {reg.nomorRegistrasi}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-200 block">{reg.instansi}</span>
                          <span className="text-[11px] text-slate-400">{reg.wilayahHukum}</span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-slate-200 block">{reg.jabatan}</span>
                          <span className="text-[10px] text-slate-400">{getRoleLabel(reg.peranSistem)}</span>
                        </td>

                        <td className="px-4 py-3 font-mono text-[11px]">
                          <span className="text-slate-300 block">{reg.email}</span>
                          <span className="text-slate-500">{reg.phone}</span>
                        </td>

                        <td className="px-4 py-3">
                          {reg.status === 'approved' && (
                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aktif</span>
                            </span>
                          )}
                          {reg.status === 'pending' && (
                            <span className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </span>
                          )}
                          {reg.status === 'rejected' && (
                            <span className="text-[11px] text-rose-400 font-semibold flex items-center space-x-1">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Ditolak</span>
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-400 text-[11px]">
                          {formatTanggal(reg.tanggalDaftar)}
                        </td>

                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedRegDetail(reg)}
                            className="px-2.5 py-1 bg-[#142642] hover:bg-[#1b3459] text-slate-200 hover:text-white text-xs rounded-lg border border-[#234475] transition-colors cursor-pointer"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETAIL DATA LENGKAP REGISTRASI */}
      {/* ========================================================= */}
      {selectedRegDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#091426] border border-[#1a2e4c] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#060e1a] border-b border-[#1a2e4c] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">
                    {selectedRegDetail.nomorRegistrasi}
                  </span>
                  <h2 className="text-sm font-bold text-white">
                    Detail Data Registrasi Akun
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {selectedRegDetail.status === 'approved' && (
                  <span className="px-2.5 py-0.5 bg-[#17382d] text-emerald-300 border border-emerald-700/50 rounded-lg text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Disetujui / Aktif</span>
                  </span>
                )}
                {selectedRegDetail.status === 'pending' && (
                  <span className="px-2.5 py-0.5 bg-[#2d2415] text-amber-300 border border-amber-700/50 rounded-lg text-xs font-semibold flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Menunggu Verifikasi</span>
                  </span>
                )}
                {selectedRegDetail.status === 'rejected' && (
                  <span className="px-2.5 py-0.5 bg-[#26161b] text-rose-300 border border-rose-800/50 rounded-lg text-xs font-semibold flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>Ditolak</span>
                  </span>
                )}

                <button
                  onClick={() => setSelectedRegDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#142642] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-slate-300 text-xs">
              {/* Profile Card */}
              <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-4 flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-[#142642] border border-[#234475] overflow-hidden shrink-0">
                  <img
                    src={selectedRegDetail.fotoKtaUrl || selectedRegDetail.fotoKtpUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'}
                    alt={selectedRegDetail.namaLengkap}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white">
                    {getFormattedOfficerName(selectedRegDetail.pangkat, selectedRegDetail.namaLengkap)}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    NRP/NIP: <span className="text-slate-200 font-mono">{selectedRegDetail.nrp}</span> • {selectedRegDetail.jabatan}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {selectedRegDetail.instansi} ({selectedRegDetail.wilayahHukum})
                  </p>
                </div>
              </div>

              {/* Data Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Satwil / Instansi */}
                <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-white border-b border-[#1a2e4c] pb-1.5 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instansi & Satuan Kerja</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Instansi:</span>
                      <p className="text-slate-200 font-medium">{selectedRegDetail.instansi}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Kategori & Wilayah:</span>
                      <p className="text-slate-200">{selectedRegDetail.kategoriInstansi || 'Polres / Polresta'} • {selectedRegDetail.wilayahHukum}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Alamat Kantor:</span>
                      <p className="text-slate-300 leading-relaxed">{selectedRegDetail.alamatKantor || '-'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Telepon Kantor:</span>
                      <p className="text-slate-300 font-mono">{selectedRegDetail.teleponKantor || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Role & Kontak */}
                <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-white border-b border-[#1a2e4c] pb-1.5 flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hak Akses & Kontak</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Peran Sistem:</span>
                      <p className="text-slate-200 font-semibold">{getRoleLabel(selectedRegDetail.peranSistem)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Spesialisasi Tugas:</span>
                      <p className="text-slate-300">
                        {selectedRegDetail.spesialisasiTugas && selectedRegDetail.spesialisasiTugas.length > 0
                          ? selectedRegDetail.spesialisasiTugas.join(', ')
                          : 'Penyidik Reguler'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Email Kedinasan:</span>
                      <p className="text-slate-200 font-mono">{selectedRegDetail.email}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">No. Handphone:</span>
                      <p className="text-slate-200 font-mono">{selectedRegDetail.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dokumen Lampiran */}
              <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-3.5 space-y-2.5">
                <h4 className="text-xs font-bold text-white border-b border-[#1a2e4c] pb-1.5 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dokumen Verifikasi Identitas</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* KTA */}
                  <div className="bg-[#091426] border border-[#1a2e4c] rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                      <span>KTA Kedinasan</span>
                      <button
                        onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtaUrl, title: `KTA: ${selectedRegDetail.namaLengkap}` })}
                        className="text-slate-400 hover:text-white"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div
                      onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtaUrl, title: `KTA: ${selectedRegDetail.namaLengkap}` })}
                      className="h-20 rounded bg-[#060e1a] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={selectedRegDetail.fotoKtaUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'}
                        alt="KTA"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* KTP */}
                  <div className="bg-[#091426] border border-[#1a2e4c] rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                      <span>KTP Sipil</span>
                      <button
                        onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtpUrl, title: `KTP: ${selectedRegDetail.namaLengkap}` })}
                        className="text-slate-400 hover:text-white"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div
                      onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtpUrl, title: `KTP: ${selectedRegDetail.namaLengkap}` })}
                      className="h-20 rounded bg-[#060e1a] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={selectedRegDetail.fotoKtpUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'}
                        alt="KTP"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Surat Penunjukan */}
                  <div className="bg-[#091426] border border-[#1a2e4c] rounded-lg p-2.5 space-y-2 flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-300">
                      Surat Penunjukan
                    </div>
                    <div className="text-center py-2">
                      <FileText className="w-6 h-6 text-slate-400 mx-auto" />
                      <span className="text-[10px] text-slate-400 truncate block mt-1">
                        {selectedRegDetail.suratPenunjukanName || 'Surat_Penunjukan.pdf'}
                      </span>
                    </div>
                    <a
                      href={selectedRegDetail.suratPenunjukanUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-1 bg-[#142642] hover:bg-[#1b3459] text-slate-200 text-center rounded text-[11px] border border-[#234475] flex items-center justify-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka File</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Riwayat Validasi */}
              {(selectedRegDetail.approvedBy || selectedRegDetail.catatanAdmin) && (
                <div className="bg-[#060e1a] border border-[#1a2e4c] rounded-xl p-3 text-xs space-y-1">
                  {selectedRegDetail.approvedBy && (
                    <p className="text-slate-400">
                      Diverifikasi oleh: <strong className="text-slate-200">{selectedRegDetail.approvedBy}</strong> pada {formatTanggal(selectedRegDetail.approvedAt)}
                    </p>
                  )}
                  {selectedRegDetail.catatanAdmin && (
                    <p className="text-slate-300">
                      Catatan: {selectedRegDetail.catatanAdmin}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#060e1a] border-t border-[#1a2e4c] flex items-center justify-between shrink-0">
              <div>
                {selectedRegDetail.status !== 'pending' && (
                  <button
                    onClick={() => handleResetToPending(selectedRegDetail)}
                    className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-300 hover:text-white rounded-lg text-xs border border-[#234475] cursor-pointer flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset ke Pending</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedRegDetail(null)}
                  className="px-3.5 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-300 hover:text-white rounded-lg text-xs border border-[#234475] cursor-pointer"
                >
                  Tutup
                </button>

                {selectedRegDetail.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(selectedRegDetail)}
                    className="px-3.5 py-1.5 bg-[#17382d] hover:bg-[#1e473a] text-emerald-300 hover:text-emerald-200 rounded-lg text-xs font-semibold border border-emerald-700/50 cursor-pointer flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Setujui Akun</span>
                  </button>
                )}

                {selectedRegDetail.status !== 'rejected' && (
                  <button
                    onClick={() => handleOpenRejectModal(selectedRegDetail)}
                    className="px-3.5 py-1.5 bg-[#26161b] hover:bg-[#341b24] text-rose-300 hover:text-rose-200 rounded-lg text-xs font-semibold border border-rose-800/50 cursor-pointer flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#091426] border border-[#1a2e4c] rounded-xl w-full max-w-md p-5 space-y-3.5 shadow-2xl">
            <div>
              <h3 className="text-sm font-bold text-white">Tolak Pendaftaran Akun</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {getFormattedOfficerName(rejectModalTarget.pangkat, rejectModalTarget.namaLengkap)} ({rejectModalTarget.instansi})
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 block">Alasan Penolakan:</label>
              <textarea
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder="Misal: Dokumen KTA buram, silakan upload ulang."
                rows={3}
                className="w-full bg-[#060e1a] text-xs text-slate-200 border border-[#1a2e4c] focus:border-[#234475] rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={() => setRejectModalTarget(null)}
                className="px-3 py-1.5 bg-[#142642] text-slate-300 hover:text-white rounded-lg text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-semibold"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#091426] border border-[#1a2e4c] rounded-xl max-w-xl w-full p-3.5 space-y-2 shadow-2xl cursor-default"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1a2e4c]">
              <span className="text-xs font-semibold text-slate-200">{previewImage.title}</span>
              <button onClick={() => setPreviewImage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] rounded bg-black flex items-center justify-center overflow-hidden">
              <img src={previewImage.url} alt="Preview" className="max-h-[65vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL BUAT AKUN PETUGAS LANGSUNG (ADMIN/SEKRETARIAT) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#091426] border border-[#1a2e4c] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-4 bg-[#060e1a] border-b border-[#1a2e4c] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Buat Akun Petugas Baru</h3>
                  <p className="text-[11px] text-slate-400">Tambahkan akun Tim TAT (Medis, Hukum, Admin, atau Penyidik)</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmittingUser}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#142642] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDirectCreateUserSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-3">
                {/* Peran / Role */}
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Peran / Hak Akses Sistem <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-[#060e1a] text-slate-200 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
                  >
                    <option value="MEDIS">Tim Asesmen Medis (Dokter/Psikiater)</option>
                    <option value="HUKUM">Tim Asesmen Hukum (BNN/Penyidik/Jaksa)</option>
                    <option value="ADMIN">Sekretariat / Administrator TAT</option>
                    <option value="PENGAJU">Penyidik Satwil (Pengaju Asesmen)</option>
                  </select>
                </div>

                {/* Nama Lengkap & Gelar */}
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Nama Lengkap & Gelar <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: dr. Amanda Prasetyo, Sp.KJ"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-[#060e1a] text-slate-200 placeholder-slate-500 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Email Kedinasan <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@polri.go.id / bnn.go.id"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-[#060e1a] text-slate-200 placeholder-slate-500 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Kata Sandi Awal <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Minimal 6 karakter"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-[#060e1a] text-slate-200 placeholder-slate-500 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* NRP / NIP */}
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      NRP / NIP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor identitas kedinasan"
                      value={newUserNip}
                      onChange={(e) => setNewUserNip(e.target.value)}
                      className="w-full bg-[#060e1a] text-slate-200 placeholder-slate-500 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  {/* No Handphone */}
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="text"
                      placeholder="081234567890"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full bg-[#060e1a] text-slate-200 placeholder-slate-500 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Instansi */}
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Instansi / Satuan Kerja
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: RS Bhayangkara / BNNP"
                      value={newUserAgency}
                      onChange={(e) => setNewUserAgency(e.target.value)}
                      className="w-full bg-[#060e1a] text-slate-200 placeholder-slate-500 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Jabatan */}
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Jabatan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dokter Psikiatri Forensik"
                      value={newUserPosition}
                      onChange={(e) => setNewUserPosition(e.target.value)}
                      className="w-full bg-[#060e1a] text-slate-200 placeholder-slate-500 border border-[#1a2e4c] focus:border-[#d4af37]/60 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#1a2e4c]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmittingUser}
                  className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-[#234475] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-4 py-2 bg-[#d4af37] hover:bg-[#c49f2e] text-[#060e1a] rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmittingUser ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke DB...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Akun Petugas</span>
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
