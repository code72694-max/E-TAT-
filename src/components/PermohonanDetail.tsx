import React, { useState, useMemo, useEffect } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
  UserRole
} from '../types';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Shield,
  User,
  Calendar,
  Stethoscope,
  Scale,
  Users,
  FileSignature,
  History,
  Activity,
  FileCheck,
  AlertCircle,
  X,
  Lock,
  Info,
  ChevronDown,
  Layers,
  Share2,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { BeritaAcaraModal } from './BeritaAcaraModal';
import { DokumenHasilAsesmenModal } from './DokumenHasilAsesmenModal';
import { SuratJawabanModal } from './SuratJawabanModal';

// Sub-komponen modular hasil pemecahan PermohonanDetail
import { TabRingkasan } from './permohonan-detail/TabRingkasan';
import { TabAdministrasi } from './permohonan-detail/TabAdministrasi';
import { TabPenugasanJadwal } from './permohonan-detail/TabPenugasanJadwal';
import { TabAsesmenMedis } from './permohonan-detail/TabAsesmenMedis';
import { TabAsesmenHukum } from './permohonan-detail/TabAsesmenHukum';
import { TabSidangPleno } from './permohonan-detail/TabSidangPleno';
import { TabDokumenPengesahan } from './permohonan-detail/TabDokumenPengesahan';
import { TabTindakLanjut } from './permohonan-detail/TabTindakLanjut';
import { TabPengawasan } from './permohonan-detail/TabPengawasan';
import { TabKlarifikasi } from './permohonan-detail/TabKlarifikasi';
import { TabRiwayatLog } from './permohonan-detail/TabRiwayatLog';

import { permohonanApi, rekomendasiApi } from '../services/api';

export type DetailTab =
  | 'ringkasan'
  | 'administrasi'
  | 'jadwal'
  | 'medis'
  | 'hukum'
  | 'pleno'
  | 'dokumen'
  | 'tindak_lanjut'
  | 'pengawasan'
  | 'klarifikasi'
  | 'riwayat';

interface PermohonanDetailProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onBack: () => void;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onOpenQrModal: (permohonan: PermohonanAsesmen) => void;
  isReadonly?: boolean;
  hideEmailPengaju?: boolean;
}

export const PermohonanDetail: React.FC<PermohonanDetailProps> = ({
  permohonan: initialPermohonan,
  currentUser,
  onBack,
  onUpdatePermohonan,
  onOpenQrModal,
  isReadonly,
  hideEmailPengaju
}) => {
  // Local state permohonan untuk menampung data riil yang disinkronkan dari backend
  const [currentPermohonan, setCurrentPermohonan] = useState<PermohonanAsesmen>(initialPermohonan);

  const isMedisRole = currentUser.role?.toLowerCase() === 'medis';
  const isHukumRole = currentUser.role?.toLowerCase() === 'hukum';
  const isPengajuRole = currentUser.role?.toLowerCase() === 'pengaju';
  const effectiveReadonly = isReadonly !== undefined ? isReadonly : isPengajuRole;

  // Jika ada query param ?tab=pleno atau ?tab=riwayat (misal dari scan QR Berita Acara), utamakan tab tersebut
  const urlTab = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') as DetailTab | null : null;
  const initialTabByRole: DetailTab = 
    urlTab && ['ringkasan', 'administrasi', 'jadwal', 'medis', 'hukum', 'pleno', 'dokumen', 'tindak_lanjut', 'pengawasan', 'klarifikasi', 'riwayat'].includes(urlTab)
      ? urlTab
      : isMedisRole ? 'medis'
      : isHukumRole ? 'hukum'
      : 'ringkasan';

  const [activeTab, setActiveTab] = useState<DetailTab>(initialTabByRole);
  const [showBeritaAcara, setShowBeritaAcara] = useState(false);
  const [showHasilAsesmenModal, setShowHasilAsesmenModal] = useState(false);
  const [showSuratJawaban, setShowSuratJawaban] = useState(false);
  const [lockedDetailTab, setLockedDetailTab] = useState<{ id: DetailTab; label: string; reason: string } | null>(null);
  const [adminForceEditMap, setAdminForceEditMap] = useState<Record<string, boolean>>({});
  const [showDangerModal, setShowDangerModal] = useState<DetailTab | null>(null);

  // Sync props ke state jika ada perubahan dari parent
  useEffect(() => {
    setCurrentPermohonan(initialPermohonan);
  }, [initialPermohonan]);

  // Muat data riil terkini dari backend API saat komponen dipasang (lewati untuk seed mock riwayat-*)
  useEffect(() => {
    if (!initialPermohonan.id || initialPermohonan.id.startsWith('riwayat-')) return;

    let isMounted = true;
    const fetchLatestData = async () => {
      try {
        const res = await permohonanApi.getById(initialPermohonan.id);
        if (res && res.data && isMounted) {
          // Normalisasi data dari backend dengan tipe frontend
          const backendData = res.data;
          setCurrentPermohonan(prev => ({
            ...prev,
            ...backendData,
            // Pertahankan struktur objek relasional jika backend mengirimkannya
            terperiksa: backendData.terperiksa || prev.terperiksa,
            perkara: backendData.perkara || prev.perkara,
            dokumenList: backendData.dokumenList || prev.dokumenList,
            timAsesmen: backendData.timAsesmen || prev.timAsesmen,
            asesmenMedis: backendData.asesmenMedis || prev.asesmenMedis,
            asesmenHukum: backendData.asesmenHukum || prev.asesmenHukum,
            sidangPleno: backendData.sidangPleno || prev.sidangPleno,
            rekomendasiResmi: backendData.rekomendasiResmi || prev.rekomendasiResmi,
            tindakLanjut: backendData.tindakLanjut || prev.tindakLanjut,
            klarifikasiList: backendData.klarifikasiList || prev.klarifikasiList,
            auditLogs: backendData.auditLogs || prev.auditLogs
          }));
        }
      } catch (err) {
        console.warn('Sinkronisasi data permohonan dari backend notice:', err);
      }
    };

    fetchLatestData();

    return () => {
      isMounted = false;
    };
  }, [initialPermohonan.id]);

  // Handler update yang menyinkronkan state lokal dan parent
  const handleUpdate = (updated: PermohonanAsesmen) => {
    setCurrentPermohonan(updated);
    onUpdatePermohonan(updated);
  };

  // Deteksi apakah berkas masih dalam tahap Verifikasi Permohonan awal
  const isTahapPermohonan = useMemo(() => {
    const appStatus = currentPermohonan.applicationStatus;
    const prosesStatus = currentPermohonan.statusProsesUtama;
    const allDocsApproved = Boolean(
      currentPermohonan.dokumenList &&
      currentPermohonan.dokumenList.length > 0 &&
      currentPermohonan.dokumenList.filter(d => d.wajib).every(d => d.statusVerifikasi === 'sesuai')
    );

    // Jika berkas sudah disetujui, sudah dijadwalkan, atau berkas formil telah lengkap diverifikasi
    if (
      appStatus === 'APPROVED' ||
      appStatus === 'SCHEDULED' ||
      appStatus === 'IN_ASSESSMENT' ||
      appStatus === 'READY_FOR_CONFERENCE' ||
      appStatus === 'CONFERENCE_HELD' ||
      appStatus === 'AWAITING_SIGNED_OUTPUTS' ||
      appStatus === 'RESULTS_ISSUED' ||
      appStatus === 'AWAITING_DISPOSITION' ||
      prosesStatus === 'penjadwalan' ||
      prosesStatus === 'asesmen_berlangsung' ||
      prosesStatus === 'siap_pleno' ||
      prosesStatus === 'pleno_berlangsung' ||
      prosesStatus === 'pengesahan_rekomendasi' ||
      prosesStatus === 'rekomendasi_terbit' ||
      prosesStatus === 'selesai_tindak_lanjut' ||
      allDocsApproved
    ) {
      return false;
    }

    return (
      appStatus === 'SUBMITTED' ||
      appStatus === 'ADMIN_REVIEW' ||
      appStatus === 'NEEDS_CORRECTION' ||
      appStatus === 'DRAFT' ||
      prosesStatus === 'diajukan' ||
      prosesStatus === 'verifikasi_berkas' ||
      prosesStatus === 'perlu_perbaikan' ||
      prosesStatus === 'draf' ||
      (!appStatus && !prosesStatus)
    );
  }, [currentPermohonan.applicationStatus, currentPermohonan.statusProsesUtama, currentPermohonan.dokumenList]);

  // Daftar tab yang dapat diakses berdasarkan peran pengguna
  const availableTabs = useMemo(() => {
    if (isTahapPermohonan) {
      return [
        { id: 'ringkasan' as DetailTab, label: 'Ringkasan Perkara', icon: <User className="w-3.5 h-3.5" /> },
        { id: 'administrasi' as DetailTab, label: 'Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
        { id: 'riwayat' as DetailTab, label: 'Audit Log & Riwayat', icon: <History className="w-3.5 h-3.5" /> }
      ];
    }

    const isDispatchedToMedis = Boolean(
      currentPermohonan.timAsesmen?.dikirimKeMedis ||
      currentPermohonan.statusProsesUtama === 'asesmen_berlangsung' ||
      currentPermohonan.statusProsesUtama === 'medis_selesai' ||
      currentPermohonan.statusProsesUtama === 'telaah_hukum' ||
      currentPermohonan.statusProsesUtama === 'siap_pleno' ||
      currentPermohonan.statusProsesUtama === 'pleno_berlangsung' ||
      currentPermohonan.statusProsesUtama === 'pengesahan_rekomendasi' ||
      currentPermohonan.statusProsesUtama === 'rekomendasi_terbit' ||
      currentPermohonan.statusProsesUtama === 'selesai_tindak_lanjut' ||
      ['IN_ASSESSMENT', 'READY_FOR_CONFERENCE', 'CONFERENCE_HELD', 'AWAITING_SIGNED_OUTPUTS', 'RESULTS_ISSUED'].includes(currentPermohonan.applicationStatus || '') ||
      currentPermohonan.id?.startsWith('riwayat-') ||
      Boolean(currentPermohonan.asesmenMedis?.diagnosisKlinisIcd)
    );

    const role = currentUser.role?.toLowerCase();
    switch (role) {
      case 'pengaju': {
        if (!isDispatchedToMedis) {
          return [
            { id: 'ringkasan', label: 'Ringkasan Perkara', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'administrasi', label: 'Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'jadwal', label: 'Penjadwalan', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'riwayat', label: 'Audit Log & Riwayat', icon: <History className="w-3.5 h-3.5" /> }
          ];
        }
        return [
          { id: 'ringkasan', label: 'Ringkasan Perkara', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Penjadwalan', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'medis', label: 'Asesmen Medis', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          { id: 'hukum', label: 'Telaah Hukum', icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Sidang Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Rekomendasi TTE', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Rujukan & Tindak Lanjut', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'pengawasan', label: 'Pengawasan Klien', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: 'Klarifikasi Terarah', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Log & Riwayat', icon: <History className="w-3.5 h-3.5" /> }
        ];
      }
      case 'admin':
      case 'sekretariat': {
        if (!isDispatchedToMedis) {
          return [
            { id: 'ringkasan', label: '1. Ringkasan Perkara', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'administrasi', label: '2. Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'jadwal', label: '3. Penjadwalan & Penugasan', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'riwayat', label: 'Audit Log & Riwayat', icon: <History className="w-3.5 h-3.5" /> }
          ];
        }

        return [
          { id: 'ringkasan', label: '1. Ringkasan Perkara', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: '2. Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: '3. Penjadwalan', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'medis', label: '4. Asesmen Medis', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          { id: 'hukum', label: '5. Telaah Hukum', icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: '6. Sidang Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: '7. Rekomendasi TTE', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: '8. Rujukan & Tindak Lanjut', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'pengawasan', label: '9. Pengawasan Klien', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: '10. Klarifikasi Terarah', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Log & Riwayat', icon: <History className="w-3.5 h-3.5" /> }
        ];
      }
      case 'medis':
        return [
          { id: 'ringkasan', label: 'Identitas Klien', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'medis', label: 'Asesmen Medis', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          { id: 'pengawasan', label: 'Instrumen Pemulihan', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: 'Klarifikasi', icon: <MessageSquare className="w-3.5 h-3.5" /> }
        ];
      case 'hukum':
        return [
          { id: 'ringkasan', label: 'Identitas Klien', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Baca BAP/LP', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'hukum', label: 'Telaah Hukum', icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: 'Klarifikasi', icon: <MessageSquare className="w-3.5 h-3.5" /> }
        ];
      case 'koordinator': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Kendali Kasus', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Sidang Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Pengesahan TTE', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Tindak Lanjut', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail', icon: <History className="w-3.5 h-3.5" /> }
        ];
        return tabs;
      }
      case 'pimpinan': {
        return [
          { id: 'ringkasan', label: 'Ringkasan Kasus', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Pengesahan TTE', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail', icon: <History className="w-3.5 h-3.5" /> }
        ];
      }
      case 'rehabilitasi': {
        return [
          { id: 'ringkasan', label: 'Klien Rujukan', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Penerimaan Admisi', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'pengawasan', label: 'Log Pengawasan', icon: <Activity className="w-3.5 h-3.5" /> }
        ];
      }
      default:
        return [
          { id: 'ringkasan', label: 'Ringkasan', icon: <User className="w-3.5 h-3.5" /> }
        ];
    }
  }, [currentUser.role, currentPermohonan, isTahapPermohonan]);

  // Validasi tab aktif saat pergantian peran atau berkas
  useEffect(() => {
    if (!availableTabs.some(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0]?.id || 'ringkasan');
    }
  }, [availableTabs, activeTab]);

  // Info penguncian tab untuk tahapan yang belum selesai
  const getTabLockInfo = (tabId: DetailTab): { isLocked: boolean; reason: string } => {
    if (isTahapPermohonan) return { isLocked: false, reason: '' };
    if (tabId === 'pleno') {
      const medisDone = currentPermohonan.medicalStatus === 'FINAL' || Boolean(currentPermohonan.asesmenMedis?.diagnosisKlinisIcd);
      const hukumDone = currentPermohonan.legalStatus === 'FINAL' || Boolean(currentPermohonan.asesmenHukum?.analisisPeran);
      const hasPleno = Boolean(currentPermohonan.sidangPleno?.nomorBeritaAcara) || ['READY_FOR_CONFERENCE', 'CONFERENCE_HELD', 'AWAITING_SIGNED_OUTPUTS', 'RESULTS_ISSUED'].includes(currentPermohonan.applicationStatus || '');
      if (!hasPleno && (!medisDone || !hukumDone)) {
        return {
          isLocked: true,
          reason: 'Sidang Pleno TAT belum dapat diselenggarakan karena Asesmen Medis dan Telaah Hukum harus selesai difinalisasi terlebih dahulu.'
        };
      }
    }
    if (tabId === 'dokumen') {
      const hasPleno = Boolean(currentPermohonan.sidangPleno?.nomorBeritaAcara) || ['CONFERENCE_HELD', 'AWAITING_SIGNED_OUTPUTS', 'RESULTS_ISSUED'].includes(currentPermohonan.applicationStatus || '');
      const hasRek = Boolean(currentPermohonan.rekomendasiResmi?.nomorSurat);
      if (!hasPleno && !hasRek) {
        return {
          isLocked: true,
          reason: 'Rekomendasi Resmi (TTE) belum dapat diakses karena memerlukan Berita Acara Sidang Pleno TAT yang telah disepakati oleh seluruh unsur tim.'
        };
      }
    }
    return { isLocked: false, reason: '' };
  };

  const formatStatus = (status?: string | null) => {
    if (!status) return 'SELESAI';
    return String(status).replace(/_/g, ' ').toUpperCase();
  };

  const isAdminRole = currentUser.role?.toLowerCase() === 'admin' || currentUser.role?.toLowerCase() === 'sekretariat';
  const isStep4OrBeyond = ['medis', 'hukum', 'pleno', 'dokumen', 'tindak_lanjut', 'pengawasan', 'klarifikasi'].includes(activeTab);
  const isTabForceEdited = Boolean(adminForceEditMap[activeTab]);
  const currentTabReadonly = effectiveReadonly || (isAdminRole && isStep4OrBeyond && !isTabForceEdited);

  return (
    <div className="space-y-6 font-roboto">
      {/* Modals Pratinjau Dokumen & Berita Acara */}
      {showBeritaAcara && (
        <BeritaAcaraModal
          permohonan={currentPermohonan}
          currentUser={currentUser}
          onClose={() => setShowBeritaAcara(false)}
        />
      )}
      {showHasilAsesmenModal && (
        <DokumenHasilAsesmenModal
          permohonan={currentPermohonan}
          onClose={() => setShowHasilAsesmenModal(false)}
        />
      )}
      {showSuratJawaban && (
        <SuratJawabanModal
          permohonan={currentPermohonan}
          onClose={() => setShowSuratJawaban(false)}
        />
      )}

      {/* Header Bar: Key-Value Grid Identitas Berkas */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-3.5 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-[11px] sm:text-xs w-full">
          <div className="grid grid-cols-[115px_10px_1fr] items-center gap-y-1.5">
            <span className="text-slate-400 font-medium">No. Permohonan</span>
              <span className="text-slate-500 font-medium">:</span>
              <span className="font-semibold text-slate-100 font-mono">
                {currentPermohonan.nomorPermohonan}
              </span>

              <span className="text-slate-400 font-medium">Nama Pengaju</span>
              <span className="text-slate-500 font-medium">:</span>
              <span className="font-semibold text-slate-100">
                {currentPermohonan.pengajuNama || currentPermohonan.perkara?.namaPenyidik || 'Penyidik Sat Resnarkoba'}
              </span>

              {!hideEmailPengaju && (
                <>
                  <span className="text-slate-400 font-medium">Email Pengaju</span>
                  <span className="text-slate-500 font-medium">:</span>
                  <span className="font-semibold text-slate-100 truncate">
                    {currentPermohonan.pengajuEmail || 'etatsiappulih@gmail.com'}
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-[115px_10px_1fr] items-center gap-y-1.5">
              <span className="text-slate-400 font-medium">Tanggal Pengajuan</span>
              <span className="text-slate-500 font-medium">:</span>
              <span className="font-semibold text-slate-200">
                {currentPermohonan.tanggalPengajuan}
              </span>

              <span className="text-slate-400 font-medium">Status</span>
              <span className="text-slate-500 font-medium">:</span>
              <div className="flex items-center">
                {isTahapPermohonan ? (
                  currentPermohonan.applicationStatus === 'NEEDS_CORRECTION' || currentPermohonan.statusProsesUtama === 'perlu_perbaikan' ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>Perlu Diperbaiki</span>
                    </span>
                  ) : currentPermohonan.applicationStatus === 'APPROVED' ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Disetujui</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 shadow-sm">
                      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Menunggu Verifikasi Sekretariat</span>
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-950/80 text-sky-300 border border-sky-700/60 shadow-sm">
                    <Activity className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>{formatStatus(currentPermohonan.applicationStatus || currentPermohonan.statusProsesUtama)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Read-Only Mode Banner */}
      {effectiveReadonly && (
        <div className="bg-[#0b1d38] border border-[#1e4a87] rounded-xl p-3 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#122e56] border border-[#23589e] flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="font-bold text-white">Mode Pemantauan Perkara (Hanya Baca / Read Only)</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {isTahapPermohonan
                  ? 'Sebagai Pemohon Asesmen, Anda dapat memantau proses verifikasi berkas permohonan oleh Sekretariat TAT secara transparan.'
                  : 'Sebagai Pemohon Asesmen, Anda dapat memantau seluruh proses asesmen terpadu secara real-time.'}
              </p>
            </div>
          </div>
          <span className="bg-[#122e56] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-[#23589e] uppercase tracking-wider shrink-0 ml-3">
            Read Only
          </span>
        </div>
      )}

      {/* Mobile Tab Step Selector */}
      <div className="sm:hidden bg-[#0b172a] border border-[#1b3459] rounded-xl p-3 shadow-sm space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Tahapan Alur Berkas Perkara:</span>
          </span>
          <span className="font-mono text-slate-400">
            {availableTabs.findIndex(t => t.id === activeTab) + 1} / {availableTabs.length}
          </span>
        </div>
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => {
              const selectedId = e.target.value as DetailTab;
              const lockInfo = getTabLockInfo(selectedId);
              const selectedTabObj = availableTabs.find(t => t.id === selectedId);
              if (lockInfo.isLocked) {
                setLockedDetailTab({ id: selectedId, label: selectedTabObj?.label || 'Tab', reason: lockInfo.reason });
              } else {
                setActiveTab(selectedId);
              }
            }}
            className="w-full bg-[#081224] text-white font-bold text-xs py-2.5 pl-3 pr-9 rounded-lg border border-[#1b3459] focus:border-[#d4af37] focus:outline-none appearance-none cursor-pointer shadow-inner"
          >
            {availableTabs.map((tab, idx) => {
              const lockInfo = getTabLockInfo(tab.id);
              return (
                <option key={tab.id} value={tab.id} className="bg-[#0b172a] text-slate-100 py-1">
                  {idx + 1}. {tab.label} {lockInfo.isLocked ? '🔒 (Terkunci)' : ''}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown className="w-4 h-4 text-[#d4af37]" />
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Tab Navigation */}
      <div className="hidden sm:block bg-[#0b172a] p-1.5 rounded-xl border border-[#1b3459] shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x px-0.5 py-0.5">
          {availableTabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const lockInfo = getTabLockInfo(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (lockInfo.isLocked) {
                    setLockedDetailTab({ id: tab.id, label: tab.label, reason: lockInfo.reason });
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs transition-all whitespace-nowrap cursor-pointer select-none border shrink-0 ${
                  lockInfo.isLocked
                    ? 'bg-[#07101e]/80 border-[#142642] text-slate-500 hover:text-slate-300 hover:bg-[#0c182c] opacity-80'
                    : isActive
                    ? 'bg-[#17335c] border-[#386bb0] text-white font-bold shadow-sm'
                    : 'bg-[#0e1d35] border-[#1c3356] text-slate-300 hover:text-white hover:bg-[#142848] font-medium'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                  lockInfo.isLocked
                    ? 'bg-[#081224] text-slate-500 border border-[#142642]'
                    : isActive
                    ? 'bg-[#091426] text-[#d4af37] border border-[#386bb0]/60'
                    : 'bg-[#081224] text-slate-400'
                }`}>
                  {lockInfo.isLocked ? <Lock className="w-2.5 h-2.5 text-slate-500" /> : idx + 1}
                </div>
                <span className={isActive ? 'text-[#d4af37]' : lockInfo.isLocked ? 'text-slate-500' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span className="tracking-wide">{tab.label}</span>
                {lockInfo.isLocked && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#091426] text-slate-400 font-semibold border border-[#142642] flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                    Terkunci
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Tab Terkunci */}
      {lockedDetailTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#1b3459]/80 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                    Tahap Belum Dapat Diakses
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {lockedDetailTab.label}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockedDetailTab(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142642] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Alasan Tab Masih Terkunci:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {lockedDetailTab.reason}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b3459]/60">
              <button
                type="button"
                onClick={() => setLockedDetailTab(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272ce] rounded-xl shadow-md transition-all cursor-pointer border border-[#2d7ad6]/60"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Force-Edit Control Bar for Admin on Step 4+ */}
      {isAdminRole && isStep4OrBeyond && (
        <div className={`p-4 rounded-2xl border transition-all shadow-lg ${
          isTabForceEdited
            ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            : 'bg-[#091528] border-amber-500/40 text-amber-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 text-xs">
              {isTabForceEdited ? (
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 shrink-0">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 shrink-0">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
              )}
              <div>
                <span className="font-bold text-sm block sm:inline">
                  {isTabForceEdited ? 'Mode Pengeditan Darurat Administrator Aktif' : 'Tahapan Read-Only (Hanya Baca) untuk Admin:'}
                </span>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                  {isTabForceEdited
                    ? 'Anda telah membuka kunci pengeditan darurat untuk tahapan ini. Seluruh perubahan data klinis/teknis akan diaudit dan dicatat dalam sistem.'
                    : 'Secara default, tahapan asesmen teknis & pleno hanya dapat diubah oleh Tim Asesor (Medis/Hukum). Admin berada dalam mode baca untuk menjaga integritas hasil asesmen.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {isTabForceEdited ? (
                <button
                  type="button"
                  onClick={() => setAdminForceEditMap(prev => ({ ...prev, [activeTab]: false }))}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kunci Kembali (Mode Baca)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDangerModal(activeTab)}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40 border border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-200 animate-pulse" />
                  <span>⚠️ Aktifkan Pengeditan (Mode Khusus)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Bahaya Buka Pengeditan Admin */}
      {showDangerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0b172a] border-2 border-rose-500/80 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1b3459]">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded">
                  Peringatan Bahaya (Danger Action)
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Buka Kunci Pengeditan Admin?
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Anda akan membuka hak akses pengeditan langsung pada tahapan <strong>{availableTabs.find(t => t.id === showDangerModal)?.label || showDangerModal}</strong>. 
              Sesuai SOP e-TAT, perubahan data teknis klinis dan hukum hanya boleh dilakukan bila terdapat koreksi administratif darurat yang telah dikoordinasikan dengan tim terkait. Tindakan ini akan dicatat dalam Audit Log sistem.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1b3459]">
              <button
                type="button"
                onClick={() => setShowDangerModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminForceEditMap(prev => ({ ...prev, [showDangerModal]: true }));
                  const tabName = availableTabs.find(t => t.id === showDangerModal)?.label || showDangerModal;
                  setShowDangerModal(null);
                  handleUpdate({
                    ...currentPermohonan,
                    auditLogs: [
                      {
                        id: 'aud-' + Date.now(),
                        timestamp: new Date().toLocaleString('id-ID'),
                        actorNama: currentUser.name,
                        actorPeran: currentUser.role,
                        aksi: 'Buka Akses Pengeditan Darurat Admin',
                        rincian: `Administrator mengaktifkan mode pengeditan khusus pada tahapan ${tabName}.`
                      },
                      ...(currentPermohonan.auditLogs || [])
                    ]
                  });
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                ⚠️ Ya, Aktifkan Pengeditan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Tab Body: Render Komponen Modular */}
      <div className="space-y-6 min-h-[420px] pt-1">
        {activeTab === 'ringkasan' && (
          <TabRingkasan
            permohonan={currentPermohonan}
            currentUser={currentUser}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenQrModal={onOpenQrModal}
          />
        )}

        {activeTab === 'administrasi' && (
          <TabAdministrasi
            permohonan={currentPermohonan}
            currentUser={currentUser}
            effectiveReadonly={effectiveReadonly}
            onUpdatePermohonan={handleUpdate}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'jadwal' && (
          <TabPenugasanJadwal
            permohonan={currentPermohonan}
            currentUser={currentUser}
            effectiveReadonly={effectiveReadonly}
            onUpdatePermohonan={handleUpdate}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'medis' && (
          <TabAsesmenMedis
            permohonan={currentPermohonan}
            currentUser={currentUser}
            effectiveReadonly={currentTabReadonly}
            onUpdatePermohonan={handleUpdate}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'hukum' && (
          <TabAsesmenHukum
            permohonan={currentPermohonan}
            currentUser={currentUser}
            effectiveReadonly={currentTabReadonly}
            onUpdatePermohonan={handleUpdate}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'pleno' && (
          <TabSidangPleno
            permohonan={currentPermohonan}
            currentUser={currentUser}
            effectiveReadonly={currentTabReadonly}
            onUpdatePermohonan={handleUpdate}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'dokumen' && (
          <TabDokumenPengesahan
            permohonan={currentPermohonan}
            currentUser={currentUser}
            effectiveReadonly={currentTabReadonly}
            onOpenQrModal={onOpenQrModal}
            onOpenHasilAsesmenModal={() => setShowHasilAsesmenModal(true)}
            onUpdatePermohonan={handleUpdate}
          />
        )}

        {activeTab === 'tindak_lanjut' && (
          <TabTindakLanjut
            permohonan={currentPermohonan}
            currentUser={currentUser}
            onUpdatePermohonan={handleUpdate}
          />
        )}

        {activeTab === 'pengawasan' && (
          <TabPengawasan
            permohonan={currentPermohonan}
            currentUser={currentUser}
            onUpdatePermohonan={handleUpdate}
          />
        )}

        {activeTab === 'klarifikasi' && (
          <TabKlarifikasi
            permohonan={currentPermohonan}
            currentUser={currentUser}
            onUpdatePermohonan={handleUpdate}
          />
        )}

        {activeTab === 'riwayat' && (
          <TabRiwayatLog
            permohonan={currentPermohonan}
          />
        )}
      </div>
    </div>
  );
};
