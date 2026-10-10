import React, { useState } from 'react';
import { UserProfile, RegistrasiPengguna } from '../types';
import {
  Settings,
  BookOpen,
  ShieldCheck,
  Scale,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Hash,
  Save,
  UserCheck,
  UserX,
  Clock,
  Search,
  Eye,
  X,
  BadgeCheck,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Activity
} from 'lucide-react';
import { ModalInputAsesmen } from './ModalInputAsesmen';

interface AdministrasiViewProps {
  currentUser: UserProfile;
  registrations?: RegistrasiPengguna[];
  onUpdateRegistration?: (updated: RegistrasiPengguna) => void;
  onApproveRegistration?: (reg: RegistrasiPengguna) => void;
}

export const AdministrasiView: React.FC<AdministrasiViewProps> = ({
  currentUser,
  registrations = [],
  onUpdateRegistration,
  onApproveRegistration
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'approval' | 'regulasi' | 'penomoran' | 'peran' | 'lembaga' | 'simulasi_asesmen'>('approval');
  const [polaNomorPermohonan, setPolaNomorPermohonan] = useState('TAT/{TAHUN}/{BULAN}/{NO_URUT}');
  const [polaNomorRekomendasi, setPolaNomorRekomendasi] = useState('REK-TAT/{NO_URUT}/{BULAN_ROMAWI}/{TAHUN}/BNNP-KALTIM');
  const [isSaved, setIsSaved] = useState(false);
  
  // Asesmen Modal States
  const [isAsesmenModalOpen, setIsAsesmenModalOpen] = useState(false);
  const [asesmenType, setAsesmenType] = useState<'medis' | 'hukum'>('medis');

  // Approval tab filters & search
  const [regFilterStatus, setRegFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [selectedRegDetail, setSelectedRegDetail] = useState<RegistrasiPengguna | null>(null);
  const [rejectReasonModal, setRejectReasonModal] = useState<RegistrasiPengguna | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  const handleSavePola = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleApprove = (reg: RegistrasiPengguna) => {
    const updated: RegistrasiPengguna = {
      ...reg,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      catatanAdmin: 'Dokumen KTP, KTA, dan Surat Tugas telah diverifikasi dan disetujui.'
    };

    if (onApproveRegistration) {
      onApproveRegistration(updated);
    } else if (onUpdateRegistration) {
      onUpdateRegistration(updated);
    }

    if (selectedRegDetail?.id === reg.id) {
      setSelectedRegDetail(updated);
    }

    setActionSuccessMessage(`Akun ${reg.pangkat} ${reg.namaLengkap} (${reg.instansi}) BERHASIL DISETUJUI dan dapat digunakan untuk login!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleConfirmReject = () => {
    if (!rejectReasonModal) return;
    const updated: RegistrasiPengguna = {
      ...rejectReasonModal,
      status: 'rejected',
      catatanAdmin: rejectReasonInput.trim() || 'Dokumen belum lengkap atau tidak memenuhi kualifikasi.'
    };

    if (onUpdateRegistration) {
      onUpdateRegistration(updated);
    }

    if (selectedRegDetail?.id === rejectReasonModal.id) {
      setSelectedRegDetail(updated);
    }

    setRejectReasonModal(null);
    setRejectReasonInput('');
    setActionSuccessMessage(`Pendaftaran akun ${rejectReasonModal.namaLengkap} telah ditolak.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleResetStatus = (reg: RegistrasiPengguna) => {
    const updated: RegistrasiPengguna = {
      ...reg,
      status: 'pending',
      approvedAt: undefined,
      approvedBy: undefined,
      catatanAdmin: undefined
    };

    if (onUpdateRegistration) {
      onUpdateRegistration(updated);
    }

    if (selectedRegDetail?.id === reg.id) {
      setSelectedRegDetail(updated);
    }

    setActionSuccessMessage(`Status pendaftaran ${reg.namaLengkap} dikembalikan ke Menunggu Verifikasi.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesFilter = regFilterStatus === 'all' || r.status === regFilterStatus;
    const q = regSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.namaLengkap.toLowerCase().includes(q) ||
      r.instansi.toLowerCase().includes(q) ||
      r.nomorRegistrasi.toLowerCase().includes(q) ||
      r.nrp.toLowerCase().includes(q) ||
      r.jabatan.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <Settings className="w-5 h-5 text-[#D4AF37]" />
            <span>Pengaturan & Administrasi Sistem e-TAT SIAP PULIH</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persetujuan akun Satwil / Kapolres baru, konfigurasi tata kelola, pola penomoran dokumen, dan manajemen peran pengguna.
          </p>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-slate-100 p-3.5 rounded-xl flex items-center space-x-2.5 text-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Navigation Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#1b3459] pb-3">
        <button
          onClick={() => setActiveSubTab('approval')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'approval'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Verifikasi Registrasi Satwil</span>
          {pendingCount > 0 && (
            <span className="bg-[#D4AF37] text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px] ml-1">
              {pendingCount} Baru
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('regulasi')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'regulasi'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Dasar Hukum & Regulasi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('penomoran')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'penomoran'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Pola Nomor & Template</span>
        </button>

        <button
          onClick={() => setActiveSubTab('peran')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'peran'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Matriks Peran Pengguna</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lembaga')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'lembaga'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Instansi Mitra BNNP Kaltim</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulasi_asesmen')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'simulasi_asesmen'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <Activity className="w-4 h-4 text-[#D4AF37]" />
          <span>Simulasi Form Asesmen TAT</span>
        </button>
      </div>

      {/* TAB 6: SIMULASI ASESMEN */}
      {activeSubTab === 'simulasi_asesmen' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 shadow-xl animate-in fade-in duration-200">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-xl font-bold text-white font-['Cinzel',serif]">Simulasi Formulir Tim Asesmen Terpadu</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Fitur ini merupakan pratinjau (mockup) dari form input data yang akan diisi oleh Tim Asesmen Medis dan Tim Asesmen Hukum berdasarkan standar Juknis TAT.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Medis Card */}
            <div className="bg-[#050e1c] border border-emerald-900/50 rounded-xl p-6 text-center space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Tim Asesmen Medis</h3>
              <p className="text-xs text-slate-400">Pemeriksaan fisik, tanda vital, lab toksikologi urin, dan asesmen ASSIST/ASI.</p>
              <button 
                onClick={() => { setAsesmenType('medis'); setIsAsesmenModalOpen(true); }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Buka Form Medis
              </button>
            </div>

            {/* Hukum Card */}
            <div className="bg-[#050e1c] border border-rose-900/50 rounded-xl p-6 text-center space-y-4 hover:border-rose-500/50 transition-colors">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Tim Asesmen Hukum</h3>
              <p className="text-xs text-slate-400">Analisa peran, telaah perkara/LPA, kualifikasi SEMA, dan rekomendasi hukum.</p>
              <button 
                onClick={() => { setAsesmenType('hukum'); setIsAsesmenModalOpen(true); }}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Buka Form Hukum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: APPROVAL REGISTRASI SATWIL / KAPOLRES */}
      {activeSubTab === 'approval' && (
        <div className="space-y-4">
          {/* Filter Bar & Search */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setRegFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  regFilterStatus === 'all'
                    ? 'bg-[#133863] text-white border border-[#235594]'
                    : 'bg-[#081224] text-slate-400 hover:text-white border border-[#1b3459]'
                }`}
              >
                Semua ({registrations.length})
              </button>

              <button
                onClick={() => setRegFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  regFilterStatus === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#081224] text-slate-400 hover:text-amber-300 border border-[#1b3459]'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Menunggu Persetujuan ({pendingCount})</span>
              </button>

              <button
                onClick={() => setRegFilterStatus('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  regFilterStatus === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#081224] text-slate-400 hover:text-emerald-300 border border-[#1b3459]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Disetujui ({registrations.filter(r => r.status === 'approved').length})</span>
              </button>

              <button
                onClick={() => setRegFilterStatus('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  regFilterStatus === 'rejected'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-[#081224] text-slate-400 hover:text-rose-300 border border-[#1b3459]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Ditolak ({registrations.filter(r => r.status === 'rejected').length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={regSearchQuery}
                onChange={e => setRegSearchQuery(e.target.value)}
                placeholder="Cari nama, NRP, satker..."
                className="w-full bg-[#081224] text-white pl-8 pr-3 py-1.5 rounded-lg border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Table List of Registrations */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1b3459] bg-[#081224] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3.5">No. Registrasi</th>
                    <th className="py-3 px-3.5">Pejabat & NRP</th>
                    <th className="py-3 px-3.5">Jabatan & Satker</th>
                    <th className="py-3 px-3.5">Wilayah Hukum</th>
                    <th className="py-3 px-3.5">KTP & KTA</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-right">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b3459]/50 text-slate-200">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada permohonan registrasi yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map(reg => (
                      <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3.5 font-mono text-[#D4AF37] font-semibold text-[11px]">
                          {reg.nomorRegistrasi}
                          <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                            {new Date(reg.tanggalDaftar).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-bold text-white">
                            {reg.pangkat} {reg.namaLengkap}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            NRP: {reg.nrp}
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-slate-200">{reg.jabatan}</div>
                          <div className="text-[11px] text-slate-400">{reg.instansi}</div>
                        </td>

                        <td className="py-3 px-3.5 text-slate-300 text-[11px]">
                          {reg.wilayahHukum}
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="flex items-center space-x-1.5">
                            {reg.fotoKtpUrl && (
                              <button
                                onClick={() => setPreviewImage({ url: reg.fotoKtpUrl, title: `Foto KTP - ${reg.namaLengkap}` })}
                                className="p-1 rounded bg-[#081224] hover:bg-[#133863] border border-[#1b3459] text-[#D4AF37] text-[10px] flex items-center space-x-1 cursor-pointer"
                                title="Lihat KTP"
                              >
                                <ImageIcon className="w-3 h-3" />
                                <span>KTP</span>
                              </button>
                            )}
                            {reg.fotoKtaUrl && (
                              <button
                                onClick={() => setPreviewImage({ url: reg.fotoKtaUrl, title: `Foto KTA - ${reg.namaLengkap}` })}
                                className="p-1 rounded bg-[#081224] hover:bg-[#133863] border border-[#1b3459] text-sky-400 text-[10px] flex items-center space-x-1 cursor-pointer"
                                title="Lihat KTA"
                              >
                                <BadgeCheck className="w-3 h-3" />
                                <span>KTA</span>
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-center">
                          {reg.status === 'pending' && (
                            <span className="inline-flex items-center space-x-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                              <Clock className="w-3 h-3" />
                              <span>PENDING</span>
                            </span>
                          )}
                          {reg.status === 'approved' && (
                            <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>DISETUJUI</span>
                            </span>
                          )}
                          {reg.status === 'rejected' && (
                            <span className="inline-flex items-center space-x-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                              <AlertCircle className="w-3 h-3" />
                              <span>DITOLAK</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => setSelectedRegDetail(reg)}
                              className="p-1.5 rounded-lg bg-[#081224] hover:bg-[#1b3459] text-slate-300 hover:text-white border border-[#1b3459] transition-colors cursor-pointer"
                              title="Detail Berkas Lengkap"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                            </button>

                            {reg.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(reg)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-[11px] transition-all flex items-center space-x-1 cursor-pointer"
                                  title="Setujui Akun"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Setujui</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setRejectReasonModal(reg);
                                    setRejectReasonInput('');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-[11px] transition-all flex items-center space-x-1 cursor-pointer"
                                  title="Tolak Pendaftaran"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Tolak</span>
                                </button>
                              </>
                            )}

                            {reg.status !== 'pending' && (
                              <button
                                onClick={() => handleResetStatus(reg)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors cursor-pointer"
                                title="Reset status ke pending"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODAL: DETAIL PENDAFTAR LENGKAP */}
          {selectedRegDetail && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <h3 className="font-bold text-white text-base font-['Cinzel',serif]">
                        Rincian Berkas Registrasi Satwil
                      </h3>
                      <span className="text-[11px] text-[#D4AF37] font-mono">
                        {selectedRegDetail.nomorRegistrasi}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRegDetail(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Badge in Modal */}
                <div className="flex items-center justify-between bg-[#081224] p-3 rounded-xl border border-[#1b3459]">
                  <span className="text-xs text-slate-400">Status Permohonan Akun:</span>
                  <div>
                    {selectedRegDetail.status === 'pending' && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold font-mono">
                        MENUNGGU PERSETUJUAN
                      </span>
                    )}
                    {selectedRegDetail.status === 'approved' && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold font-mono">
                        DISETUJUI OLEH ADMIN
                      </span>
                    )}
                    {selectedRegDetail.status === 'rejected' && (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-bold font-mono">
                        DITOLAK
                      </span>
                    )}
                  </div>
                </div>

                {/* Detail Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">Nama Lengkap & Gelar:</span>
                    <span className="text-white font-bold text-sm">
                      {selectedRegDetail.pangkat} {selectedRegDetail.namaLengkap}
                    </span>
                  </div>

                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">NRP / NIP:</span>
                    <span className="text-white font-mono font-bold text-sm">
                      {selectedRegDetail.nrp}
                    </span>
                  </div>

                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">Jabatan Resmi:</span>
                    <span className="text-slate-200 font-semibold">{selectedRegDetail.jabatan}</span>
                  </div>

                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">Satwil / Instansi:</span>
                    <span className="text-slate-200 font-semibold">{selectedRegDetail.instansi}</span>
                  </div>

                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">Wilayah Hukum:</span>
                    <span className="text-slate-200 font-semibold">{selectedRegDetail.wilayahHukum}</span>
                  </div>

                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">Email Kedinasan (Username):</span>
                    <span className="text-slate-200 font-semibold font-mono">{selectedRegDetail.email}</span>
                  </div>

                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">Nomor WhatsApp / HP:</span>
                    <span className="text-slate-200 font-semibold">{selectedRegDetail.phone}</span>
                  </div>

                  <div className="bg-[#081224] p-3 rounded-xl border border-[#1b3459] space-y-1">
                    <span className="text-slate-400 text-[11px] block">Alamat Mako / Satker:</span>
                    <span className="text-slate-200 font-semibold">{selectedRegDetail.alamatKantor}</span>
                  </div>
                </div>

                {/* Document Previews */}
                <div className="space-y-2 pt-2 border-t border-[#1b3459]">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Dokumen & Foto Terlampir:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* KTP */}
                    <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">Foto KTP</span>
                        <button
                          onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtpUrl, title: `Foto KTP - ${selectedRegDetail.namaLengkap}` })}
                          className="text-[#D4AF37] hover:underline cursor-pointer text-[10px]"
                        >
                          Perbesar
                        </button>
                      </div>
                      <div className="h-28 rounded-lg overflow-hidden border border-[#1b3459] bg-slate-950 flex items-center justify-center">
                        <img
                          src={selectedRegDetail.fotoKtpUrl}
                          alt="Foto KTP"
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtpUrl, title: `Foto KTP - ${selectedRegDetail.namaLengkap}` })}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono truncate block">{selectedRegDetail.fotoKtpName}</span>
                    </div>

                    {/* KTA */}
                    <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">Foto KTA Polri</span>
                        <button
                          onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtaUrl, title: `Foto KTA - ${selectedRegDetail.namaLengkap}` })}
                          className="text-sky-400 hover:underline cursor-pointer text-[10px]"
                        >
                          Perbesar
                        </button>
                      </div>
                      <div className="h-28 rounded-lg overflow-hidden border border-[#1b3459] bg-slate-950 flex items-center justify-center">
                        <img
                          src={selectedRegDetail.fotoKtaUrl}
                          alt="Foto KTA"
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setPreviewImage({ url: selectedRegDetail.fotoKtaUrl, title: `Foto KTA - ${selectedRegDetail.namaLengkap}` })}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono truncate block">{selectedRegDetail.fotoKtaName}</span>
                    </div>
                  </div>

                  {selectedRegDetail.suratPenunjukanName && (
                    <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-200 font-medium">{selectedRegDetail.suratPenunjukanName}</span>
                      </div>
                      <span className="text-[10px] text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                        Surat Keputusan Sah
                      </span>
                    </div>
                  )}
                </div>

                {/* Admin Audit Info */}
                {selectedRegDetail.approvedAt && (
                  <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-300 block">Riwayat Persetujuan Admin:</span>
                    <p className="text-slate-300 text-[11px]">
                      Disetujui oleh: {typeof selectedRegDetail.approvedBy === 'object' ? `${(selectedRegDetail.approvedBy as any).name || ''} (${((selectedRegDetail.approvedBy as any).role || '').toUpperCase()})` : selectedRegDetail.approvedBy} pada {new Date(selectedRegDetail.approvedAt).toLocaleString('id-ID')}
                    </p>
                    {selectedRegDetail.catatanAdmin && (
                      <p className="text-slate-400 text-[11px]">Catatan: {selectedRegDetail.catatanAdmin}</p>
                    )}
                  </div>
                )}

                {selectedRegDetail.status === 'rejected' && selectedRegDetail.catatanAdmin && (
                  <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-rose-300 block">Alasan Penolakan:</span>
                    <p className="text-slate-300 text-[11px]">{selectedRegDetail.catatanAdmin}</p>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1b3459]">
                  <button
                    onClick={() => setSelectedRegDetail(null)}
                    className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 cursor-pointer"
                  >
                    Tutup
                  </button>

                  <div className="flex items-center space-x-2">
                    {selectedRegDetail.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            handleApprove(selectedRegDetail);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span>Setujui Akun Satwil</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectReasonModal(selectedRegDetail);
                            setRejectReasonInput('');
                          }}
                          className="bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Tolak</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: ALASAN PENOLAKAN */}
          {rejectReasonModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold text-white text-base">Tolak Pendaftaran Akun</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Masukkan alasan penolakan pendaftaran untuk <strong>{rejectReasonModal.pangkat} {rejectReasonModal.namaLengkap}</strong> ({rejectReasonModal.instansi}).
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Alasan Penolakan:
                  </label>
                  <textarea
                    rows={3}
                    value={rejectReasonInput}
                    onChange={e => setRejectReasonInput(e.target.value)}
                    placeholder="Contoh: Foto KTP tidak jelas / Dokumen Surat Tugas belum ditandatangani pimpinan Satker..."
                    className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectReasonModal(null)}
                    className="text-xs text-slate-400 hover:text-white px-3 py-2 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReject}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Konfirmasi Penolakan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: IMAGE PREVIEW */}
          {previewImage && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full p-4 space-y-3 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
                  <span className="font-bold text-white text-xs font-mono">{previewImage.title}</span>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[70vh]">
                  <img src={previewImage.url} alt="Dokumen" className="w-full h-auto object-contain max-h-[70vh]" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Regulasi */}
      {activeSubTab === 'regulasi' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Landasan Yuridis Pelaksanaan Tim Asesmen Terpadu</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">1. UU No. 35 Tahun 2009 tentang Narkotika</span>
              <p className="text-slate-300">
                Pasal 54 (Kewajiban rehabilitasi medis dan sosial bagi pecandu dan korban), Pasal 103 (Kewenangan vonis hakim rehabilitasi), dan Pasal 127.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">2. Peraturan Bersama 7 K/L Tahun 2014</span>
              <p className="text-slate-300">
                Pedoman Terpadu Penanganan Pecandu dan Korban Penyalahgunaan Narkotika ke Lembaga Rehabilitasi antara MA, Kemenkumham, Kemenkes, Kemensos, Kejaksaan Agung, Polri, dan BNN.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">3. Surat Edaran Mahkamah Agung (SEMA) No. 04/2010</span>
              <p className="text-slate-300">
                Penetapan batas barang bukti pemakaian 1 hari (sabu &le; 1 gr, ganja &le; 5 gr, ekstasi &le; 8 butir/2.4 gr) untuk kualifikasi penyalahguna murni.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">4. Peraturan BNN No. 11 Tahun 2021</span>
              <p className="text-slate-300">
                Tata Cara Pelaksanaan Asesmen Terpadu bagi Pecandu dan Korban Narkotika dengan SLA penyelesaian maksimal 6 hari kerja.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">5. Peraturan Kepolisian (Perpol) No. 08 Tahun 2021</span>
              <p className="text-slate-300">
                Penanganan Tindak Pidana Berdasarkan Keadilan Restoratif (Restorative Justice) di lingkungan Kepolisian Negara Republik Indonesia.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">6. Peraturan Kejaksaan RI No. 15 Tahun 2020</span>
              <p className="text-slate-300">
                Penghentian Penuntutan Berdasarkan Keadilan Restoratif pada Kejaksaan Republik Indonesia bagi perkara yang memenuhi kualifikasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Penomoran & Template */}
      {activeSubTab === 'penomoran' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-5 shadow-lg shadow-black/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
              <Hash className="w-4 h-4 text-[#D4AF37]" />
              <span>Konfigurasi Pola Penomoran & Template Rekomendasi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Atur format generator nomor otomatis dan draf klausul penetapan rekomendasi resmi TAT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-[#081224] p-4 rounded-xl border border-[#1b3459]">
              <label className="font-bold text-slate-200 block">Pola Nomor Berkas Permohonan</label>
              <input
                type="text"
                value={polaNomorPermohonan}
                onChange={e => setPolaNomorPermohonan(e.target.value)}
                className="w-full bg-[#0b172a] border border-[#1b3459] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[11px] text-slate-400 block">
                Contoh hasil: <strong className="text-[#D4AF37] font-mono">TAT/2026/09/082</strong>
              </span>
            </div>

            <div className="space-y-2 bg-[#081224] p-4 rounded-xl border border-[#1b3459]">
              <label className="font-bold text-slate-200 block">Pola Nomor Surat Rekomendasi Resmi</label>
              <input
                type="text"
                value={polaNomorRekomendasi}
                onChange={e => setPolaNomorRekomendasi(e.target.value)}
                className="w-full bg-[#0b172a] border border-[#1b3459] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[11px] text-slate-400 block">
                Contoh hasil: <strong className="text-[#D4AF37] font-mono">REK-TAT/082/IX/2026/BNNP-KALTIM</strong>
              </span>
            </div>
          </div>

          <div className="bg-[#081224] p-4 rounded-xl border border-[#1b3459] space-y-2">
            <span className="font-bold text-slate-200 block text-xs">Klausul Standar Rekomendasi Pemulihan</span>
            <div className="bg-[#050e1c] p-3 rounded-lg border border-[#12233c] text-slate-300 font-mono text-[11px] leading-relaxed">
              &quot;Berdasarkan hasil asesmen medis dan asesmen hukum terpadu, terperiksa dikualifikasikan sebagai KORBAN PENYALAHGUNAAN NARKOTIKA murni dan direkomendasikan menjalani REHABILITASI MEDIS DAN SOSIAL selama jangka waktu yang ditentukan oleh fasilitas rujukan BNNP Kalimantan Timur.&quot;
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            {isSaved && (
              <span className="text-xs text-[#D4AF37] flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pola berhasil disimpan ke sistem!</span>
              </span>
            )}
            <button
              onClick={handleSavePola}
              className="bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs px-4 py-2 rounded-xl border border-[#235594] flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pola</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: Peran Pengguna */}
      {activeSubTab === 'peran' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>Matriks Kewenangan & Peran Pengguna (Role Permission)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pembagian tugas berlandaskan Bab 04 Proposal E-TAT SIAP PULIH BNNP Kalimantan Timur.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1b3459] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">Instansi Asal</th>
                  <th className="py-2.5 px-3">Kewenangan Utama</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b3459]/50 text-slate-200">
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Administrator / Sekretariat</td>
                  <td className="py-3 px-3 text-slate-300">BNNP Kalimantan Timur</td>
                  <td className="py-3 px-3 text-slate-300">Penerimaan, verifikasi kelengkapan berkas, jadwal penugasan, notulensi pleno & draf rekomendasi</td>
                  <td className="py-3 px-3 text-center"><span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Tim Asesor Medis</td>
                  <td className="py-3 px-3 text-slate-300">Dokter BNNP / RSUD / Sp.KJ</td>
                  <td className="py-3 px-3 text-slate-300">Pemeriksaan fisik, laboratorium toksikologi urin, pengisian WHO ASSIST, diagnosis klinis ICD</td>
                  <td className="py-3 px-3 text-center"><span className="bg-emerald-500/20 text-slate-200 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Tim Asesor Hukum</td>
                  <td className="py-3 px-3 text-slate-300">Kejati Kaltim / Polda Kaltim</td>
                  <td className="py-3 px-3 text-slate-300">Verifikasi kronologi, analisis peran tersangka, uji gramatur SEMA 04/2010, simpulan hukum</td>
                  <td className="py-3 px-3 text-center"><span className="bg-purple-500/20 text-slate-200 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Petugas Pemantauan / Rehab</td>
                  <td className="py-3 px-3 text-slate-300">Bidang Rehabilitasi BNNP Kaltim</td>
                  <td className="py-3 px-3 text-slate-300">Distribusi rujukan ke faskes, pemantauan berkala, jurnal bimbingan, uji urin acak & SP</td>
                  <td className="py-3 px-3 text-center"><span className="bg-amber-500/20 text-[#D4AF37] px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Penyidik Pengaju</td>
                  <td className="py-3 px-3 text-slate-300">Penyidik BNN / Resnarkoba Polri</td>
                  <td className="py-3 px-3 text-slate-300">Registrasi berkas 1x24 jam pasca penangkapan, perbaikan formil, penerima salinan rekomendasi</td>
                  <td className="py-3 px-3 text-center"><span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Pimpinan / Viewer</td>
                  <td className="py-3 px-3 text-slate-300">Kepala BNNP / Dirresnarkoba / Kajati</td>
                  <td className="py-3 px-3 text-slate-300">Akses baca eksekutif, pengawasan kepatuhan SLA 6 hari, pemantauan dashboard analitik</td>
                  <td className="py-3 px-3 text-center"><span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Lembaga Mitra */}
      {activeSubTab === 'lembaga' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Struktur Lembaga Mitra Tim Asesmen Terpadu BNNP Kalimantan Timur</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Institusi penegak hukum dan fasilitas rehabilitasi pemulihan yang terkoneksi di Provinsi Kalimantan Timur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1.5">
              <span className="font-bold text-sky-300 block">Sekretariat & Penyidikan</span>
              <p className="text-slate-300 font-semibold">BNNP Kalimantan Timur & Ditresnarkoba Polda Kaltim</p>
              <p className="text-[11px] text-slate-400">Jl. Rapak Indah No. 17, Karang Asam Ilir, Samarinda</p>
              <span className="text-[10px] text-slate-400 block font-mono border-t border-[#1b3459] pt-1 mt-2">
                Penyidik & Analis Hukum Terpadu
              </span>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1.5">
              <span className="font-bold text-slate-200 block">Penuntut Umum Terpadu</span>
              <p className="text-slate-300 font-semibold">Kejaksaan Tinggi Kalimantan Timur & Kejari Samarinda</p>
              <p className="text-[11px] text-slate-400">Jl. Bung Tomo, Samarinda Seberang</p>
              <span className="text-[10px] text-slate-400 block font-mono border-t border-[#1b3459] pt-1 mt-2">
                Asesor Aspek Hukum & Penuntutan Restoratif
              </span>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1.5">
              <span className="font-bold text-slate-200 block">Fasilitas Rujukan Pemulihan</span>
              <p className="text-slate-300 font-semibold">Balai Rehabilitasi BNN Tanah Merah & Klinik Pratama BNNP Kaltim</p>
              <p className="text-[11px] text-slate-400">Samarinda Utara & RSUD AW Sjahranie Samarinda</p>
              <span className="text-[10px] text-slate-400 block font-mono border-t border-[#1b3459] pt-1 mt-2">
                Rehabilitasi Medis, Sosial, & Tes Toksikologi
              </span>
            </div>
          </div>
        </div>
      )}
      {/* MODAL SIMULASI ASESMEN */}
      <ModalInputAsesmen
        isOpen={isAsesmenModalOpen}
        onClose={() => setIsAsesmenModalOpen(false)}
        tipeAsesmen={asesmenType}
        namaTerperiksa="Joni Setiawan bin Kardi (Simulasi)"
        nomorTat="TAT/2026/10/0042"
      />
    </div>
  );
};
