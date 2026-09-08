import React, { useState, useMemo, useEffect } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
  UserRole,
  StatusProsesUtama,
  DokumenPersyaratan
} from '../types';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Shield,
  User,
  Building2,
  Calendar,
  Stethoscope,
  Scale,
  Users,
  FileSignature,
  Share2,
  History,
  MessageSquare,
  QrCode,
  Download,
  Upload,
  AlertCircle,
  ExternalLink,
  Edit3,
  Send
} from 'lucide-react';

interface PermohonanDetailProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onBack: () => void;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onOpenQrModal: (permohonan: PermohonanAsesmen) => void;
}

export type DetailTab =
  | 'ringkasan'
  | 'administrasi'
  | 'jadwal'
  | 'medis'
  | 'hukum'
  | 'pleno'
  | 'dokumen'
  | 'tindak_lanjut'
  | 'klarifikasi'
  | 'riwayat';

export const PermohonanDetail: React.FC<PermohonanDetailProps> = ({
  permohonan,
  currentUser,
  onBack,
  onUpdatePermohonan,
  onOpenQrModal
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('ringkasan');

  // Role-specific available tabs
  const availableTabs = useMemo(() => {
    const role = currentUser.role;
    switch (role) {
      case 'pengaju': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Ringkasan & Status', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Berkas & Perbaikan', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Jadwal Pemeriksaan', icon: <Calendar className="w-3.5 h-3.5" /> },
        ];
        if (permohonan.rekomendasiResmi && (permohonan.statusProsesUtama === 'rekomendasi_terbit' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut')) {
          tabs.push({ id: 'dokumen', label: 'Rekomendasi Resmi Diterima', icon: <FileSignature className="w-3.5 h-3.5" /> });
        }
        tabs.push({ id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> });
        return tabs;
      }
      case 'sekretariat':
        return [
          { id: 'ringkasan', label: 'Ringkasan & Identitas', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Penugasan & Jadwal', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Persiapan Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Distribusi Dokumen', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Koordinasi Rujukan', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail', icon: <History className="w-3.5 h-3.5" /> }
        ];
      case 'medis':
        return [
          { id: 'ringkasan', label: 'Identitas Terperiksa', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Jadwal Pemeriksaan Klinis', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'medis', label: 'Asesmen Medis & Klinis', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Klarifikasi Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> }
        ];
      case 'hukum':
        return [
          { id: 'ringkasan', label: 'Identitas & Perkara', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Dokumen Perkara (BAP/LP)', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Jadwal Pemeriksaan', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'hukum', label: 'Asesmen Hukum & Telaah', icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Klarifikasi Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> }
        ];
      case 'koordinator':
        return [
          { id: 'ringkasan', label: 'Ringkasan & Kendali Kasus', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Kesiapan Jadwal Tim', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Sidang Pleno TAT', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Pengesahan Rekomendasi Mandat', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Monitoring Rujukan', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail Lengkap', icon: <History className="w-3.5 h-3.5" /> }
        ];
      case 'pimpinan':
        return [
          { id: 'ringkasan', label: 'Ringkasan Perkara & SLA', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Jadwal & Progres', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Berita Acara Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Rekomendasi Terbit', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Realisasi Rujukan', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail Pengawasan', icon: <History className="w-3.5 h-3.5" /> }
        ];
      case 'rehabilitasi':
        return [
          { id: 'ringkasan', label: 'Informasi Klien Rujukan', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Dokumen Rekomendasi Legal', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Konfirmasi Admisi & Tindak Lanjut', icon: <Share2 className="w-3.5 h-3.5" /> }
        ];
      case 'admin':
        return [
          { id: 'ringkasan', label: 'Metadata Registrasi Berkas', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail & Keamanan', icon: <History className="w-3.5 h-3.5" /> }
        ];
      default:
        return [
          { id: 'ringkasan', label: 'Ringkasan', icon: <User className="w-3.5 h-3.5" /> }
        ];
    }
  }, [currentUser.role, permohonan]);

  // Ensure activeTab is always one of the permitted tabs for current role
  useEffect(() => {
    if (!availableTabs.some(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0]?.id || 'ringkasan');
    }
  }, [availableTabs, activeTab]);

  // Check if current user is mandated to sign this recommendation
  const userCanSignNow = useMemo(() => {
    if (!permohonan.rekomendasiResmi || permohonan.statusProsesUtama !== 'pengesahan_rekomendasi') return false;
    return permohonan.rekomendasiResmi.daftarPengesah.some(signer => {
      if (signer.status === 'disahkan') return false;
      if (currentUser.role === 'koordinator' && signer.jabatan.includes('Ketua')) return true;
      if (currentUser.role === 'medis' && signer.jabatan.includes('Medis')) return true;
      if (currentUser.role === 'hukum' && signer.jabatan.includes('Hukum')) return true;
      if (currentUser.role === 'pengaju' && signer.jabatan.includes('Penyidik')) return true;
      return false;
    });
  }, [permohonan, currentUser]);

  // Local state for inline clarification message
  const [pertanyaanInput, setPertanyaanInput] = useState('');
  const [tujuanPeran, setTujuanPeran] = useState<UserRole>('sekretariat');

  // Local state for document re-upload / correction by Pengaju
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [correctionNote, setCorrectionNote] = useState('');

  // Handle Pengaju confirming receipt of recommendation
  const handlePengajuSignReceipt = () => {
    if (!permohonan.rekomendasiResmi) return;
    const nowStr = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const receipt = {
      nomorTandaTerima: 'TTR/TAT/' + Date.now().toString().slice(-6),
      diterimaOleh: `${currentUser.name} (Penyidik Pengaju)`,
      tanggalDiterima: nowStr,
      statusPenyerahan: 'diterima_lengkap' as const,
      catatanPenyerahan: 'Dokumen fisik/digital telah diterima sah oleh penyidik Sat Resnarkoba.'
    };
    const updated: PermohonanAsesmen = {
      ...permohonan,
      rekomendasiResmi: {
        ...permohonan.rekomendasiResmi,
        buktiPenerimaanPengaju: receipt
      },
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: nowStr,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Konfirmasi Tanda Terima Rekomendasi Resmi',
          rincian: `No. Tanda Terima: ${receipt.nomorTandaTerima}`
        },
        ...permohonan.auditLogs
      ]
    };
    onUpdatePermohonan(updated);
  };

  // Handle Rehabilitation action (rehabilitasi role)
  const handleRehabAction = (action: 'terima' | 'admisi' | 'penuh', catatan?: string) => {
    if (!permohonan.tindakLanjut) return;
    const nowStr = new Date().toLocaleDateString('id-ID');
    const updatedTindakLanjut = {
      ...permohonan.tindakLanjut,
      statusRujukan: (action === 'terima'
        ? 'diterima_fasilitas'
        : action === 'admisi'
        ? 'klien_mulai_layanan'
        : 'kapasitas_penuh') as any,
      tanggalKonfirmasiFasilitas: action === 'terima' ? nowStr : permohonan.tindakLanjut.tanggalKonfirmasiFasilitas,
      tanggalMulaiLayanan: action === 'admisi' ? nowStr : permohonan.tindakLanjut.tanggalMulaiLayanan,
      hambatanPelaksanaan: action === 'penuh' ? (catatan || 'Kapasitas kamar rawat inap sedang penuh 100%.') : undefined
    };
    const updated: PermohonanAsesmen = {
      ...permohonan,
      statusProsesUtama: action === 'admisi' ? 'selesai_tindak_lanjut' : permohonan.statusProsesUtama,
      tindakLanjut: updatedTindakLanjut,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: action === 'terima' ? 'Konfirmasi Penerimaan Rujukan' : action === 'admisi' ? 'Admisi Klien Memulai Layanan' : 'Laporan Kapasitas Fasilitas Penuh',
          rincian: `${permohonan.tindakLanjut.namaFasilitasTujuan}: status rujukan diperbarui ke ${updatedTindakLanjut.statusRujukan}`
        },
        ...permohonan.auditLogs
      ]
    };
    onUpdatePermohonan(updated);
  };

  // Handle Pengaju fixing a document
  const handleFixDocument = (docId: string) => {
    const updatedDocs = permohonan.dokumenList.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          statusVerifikasi: 'sesuai' as const,
          catatanKoreksi: 'Telah diperbaiki oleh penyidik pada ' + new Date().toLocaleDateString('id-ID'),
          versi: doc.versi + 1,
          uploadedAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return doc;
    });

    const isAllValid = updatedDocs.every(d => !d.wajib || d.statusVerifikasi === 'sesuai');

    const updated: PermohonanAsesmen = {
      ...permohonan,
      dokumenList: updatedDocs,
      statusProsesUtama: isAllValid ? 'verifikasi_berkas' : permohonan.statusProsesUtama,
      tindakanBerikutnyaLabel: isAllValid
        ? 'Perbaikan berkas telah diunggah. Menunggu verifikasi ulang oleh Sekretariat TAT.'
        : permohonan.tindakanBerikutnyaLabel,
      penanggungJawabBerikutnya: isAllValid ? 'Sekretariat TAT' : permohonan.penanggungJawabBerikutnya,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Unggah Perbaikan Berkas',
          rincian: `Memperbaiki dokumen ID: ${docId}`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
  };

  // Handle Sekretariat verifying a document
  const handleVerifyDocumentItem = (docId: string, status: 'sesuai' | 'perlu_perbaikan', note?: string) => {
    const updatedDocs = permohonan.dokumenList.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          statusVerifikasi: status,
          catatanKoreksi: note || doc.catatanKoreksi
        };
      }
      return doc;
    });

    const hasErrors = updatedDocs.some(d => d.wajib && d.statusVerifikasi === 'perlu_perbaikan');
    const allApproved = updatedDocs.filter(d => d.wajib).every(d => d.statusVerifikasi === 'sesuai');

    const updated: PermohonanAsesmen = {
      ...permohonan,
      dokumenList: updatedDocs,
      statusProsesUtama: hasErrors ? 'perlu_perbaikan' : allApproved ? 'penugasan_jadwal' : 'verifikasi_berkas',
      penanggungJawabBerikutnya: hasErrors ? 'Penyidik Pengaju' : allApproved ? 'Sekretariat TAT' : 'Sekretariat TAT',
      tindakanBerikutnyaLabel: hasErrors
        ? 'Daftar perbaikan berkas diterbitkan. Menunggu unggah ulang dari penyidik.'
        : allApproved
        ? 'Administrasi lengkap & diverifikasi. Menunggu penetapan jadwal dan tim asesor.'
        : 'Sedang dalam proses verifikasi berkas oleh Sekretariat.',
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Verifikasi Administrasi Berkas',
          rincian: `Dokumen ${docId} diverifikasi dengan status: ${status}`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
  };

  // Handle digital signing by authorized signer
  const handleDigitalSign = () => {
    if (!permohonan.rekomendasiResmi) return;

    const updatedSigners = permohonan.rekomendasiResmi.daftarPengesah.map(signer => {
      if (
        (currentUser.role === 'koordinator' && signer.jabatan.includes('Ketua')) ||
        (currentUser.role === 'medis' && signer.jabatan.includes('Medis')) ||
        (currentUser.role === 'hukum' && signer.jabatan.includes('Hukum')) ||
        (currentUser.role === 'pengaju' && signer.jabatan.includes('Penyidik'))
      ) {
        return {
          ...signer,
          status: 'disahkan' as const,
          tanggalPengesahan: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          tandaTanganDigitalHash: 'SHA256:' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        };
      }
      return signer;
    });

    const isAllSigned = updatedSigners.every(s => s.status === 'disahkan');

    const updated: PermohonanAsesmen = {
      ...permohonan,
      statusProsesUtama: isAllSigned ? 'rekomendasi_terbit' : permohonan.statusProsesUtama,
      statusDokumen: isAllSigned ? 'resmi_terbit' : 'menunggu_pengesahan',
      penanggungJawabBerikutnya: isAllSigned ? 'Penyidik & Fasilitas Rehabilitasi' : permohonan.penanggungJawabBerikutnya,
      tindakanBerikutnyaLabel: isAllSigned
        ? 'Rekomendasi resmi e-TAT telah disahkan lengkap & diterbitkan. Siap didistribusikan.'
        : 'Menunggu tanda tangan digital dari pengesah yang tersisa.',
      rekomendasiResmi: {
        ...permohonan.rekomendasiResmi,
        daftarPengesah: updatedSigners,
        isLengkapPengesahan: isAllSigned
      },
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pengesahan Tanda Tangan Digital',
          rincian: `Mengesahkan rekomendasi resmi No. ${permohonan.rekomendasiResmi.nomorSurat}`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
  };

  // Handle submitting targeted clarification
  const handleSendKlarifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pertanyaanInput.trim()) return;

    const newKlarifikasi = {
      id: 'klar-' + Date.now(),
      dariNama: currentUser.name,
      dariPeran: currentUser.role,
      kepadaPeran: tujuanPeran,
      pertanyaan: pertanyaanInput.trim(),
      tanggalTanya: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'menunggu_tanggapan' as const
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      klarifikasiList: [newKlarifikasi, ...permohonan.klarifikasiList],
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pengiriman Klarifikasi Terarah',
          rincian: `Mengirim pertanyaan kepada ${tujuanPeran}`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
    setPertanyaanInput('');
  };

  // Helper label for Status Utama
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Case Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Kembali ke Daftar Permohonan"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Berkas Asesmen Terpadu
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">Diajukan: {permohonan.tanggalPengajuan}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2 mt-0.5">
              <span>{permohonan.nomorPermohonan}</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-800">{permohonan.terperiksa.namaLengkap}</span>
            </h1>
          </div>
        </div>

        {/* Quick QR code button if recommendation is ready */}
        {permohonan.rekomendasiResmi && (
          <button
            onClick={() => onOpenQrModal(permohonan)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-2 border border-slate-800 transition-all shrink-0"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>Verifikasi Keabsahan (QR)</span>
          </button>
        )}
      </div>

      {/* Compact Status & Action Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        {/* 4 Statuses in a clean, minimal row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Proses Utama</span>
            <span className="text-xs font-bold text-blue-700 mt-0.5 block truncate">
              {formatStatus(permohonan.statusProsesUtama)}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Telaah Medis & Hukum</span>
            <div className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center space-x-1.5 truncate">
              <span className="text-emerald-700">M: {formatStatus(permohonan.statusMedis)}</span>
              <span className="text-slate-300">|</span>
              <span className="text-purple-700">H: {formatStatus(permohonan.statusHukum)}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dokumen Rekomendasi</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
              {formatStatus(permohonan.statusDokumen)}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Tindak Lanjut</span>
            <span className={`text-xs font-bold mt-0.5 block truncate ${permohonan.statusTindakLanjut === 'terhambat' ? 'text-rose-700' : 'text-slate-800'}`}>
              {formatStatus(permohonan.statusTindakLanjut)}
            </span>
          </div>
        </div>

        {/* Clean Action Strip */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Langkah Selanjutnya:</span>
            <span className="font-semibold text-slate-900">{permohonan.tindakanBerikutnyaLabel}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">PJ: <strong className="text-slate-700">{permohonan.penanggungJawabBerikutnya}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">SLA: <strong className="text-slate-700">{permohonan.tenggatSlaTanggal}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {permohonan.statusProsesUtama === 'perlu_perbaikan' && currentUser.role === 'pengaju' && (
              <button
                onClick={() => setActiveTab('administrasi')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Perbaikan</span>
              </button>
            )}

            {permohonan.statusProsesUtama === 'verifikasi_berkas' && currentUser.role === 'sekretariat' && (
              <button
                onClick={() => setActiveTab('administrasi')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verifikasi Dokumen</span>
              </button>
            )}

            {permohonan.statusProsesUtama === 'pengesahan_rekomendasi' && userCanSignNow && (
              <button
                onClick={handleDigitalSign}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Tandatangani Rekomendasi</span>
              </button>
            )}

            {currentUser.role === 'rehabilitasi' && permohonan.tindakLanjut && (
              <button
                onClick={() => setActiveTab('tindak_lanjut')}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Konfirmasi Rujukan</span>
              </button>
            )}

            {currentUser.role === 'pengaju' && permohonan.rekomendasiResmi && (permohonan.statusProsesUtama === 'rekomendasi_terbit' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') && (
              <button
                onClick={() => setActiveTab('dokumen')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Rekomendasi Resmi</span>
              </button>
            )}

            {availableTabs.some(t => t.id === 'klarifikasi') && (
              <button
                onClick={() => setActiveTab('klarifikasi')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Klarifikasi ({permohonan.klarifikasiList.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Filtered dynamically per role */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {availableTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 min-h-[420px]">
        {/* TAB 1: RINGKASAN & IDENTITAS (Separation of Person, Case, and Application) */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom 1: Terperiksa (Data Orang) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">Data Terperiksa</h3>
                  </div>
                  {permohonan.terperiksa.isNikVerified ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                      NIK Terverifikasi
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300">
                      NIK Perlu Verifikasi
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Nama Lengkap</span>
                    <span className="col-span-2 font-bold text-slate-900">{permohonan.terperiksa.namaLengkap}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Nama Panggilan/Alias</span>
                    <span className="col-span-2 text-slate-700">{permohonan.terperiksa.alias || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">NIK / Identitas</span>
                    <span className="col-span-2 font-mono text-slate-900">{permohonan.terperiksa.nik || 'Tidak ada (Dibuatkan ID Khusus)'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Tempat, Tgl Lahir</span>
                    <span className="col-span-2 text-slate-700">{permohonan.terperiksa.tempatLahir}, {permohonan.terperiksa.tanggalLahir} ({permohonan.terperiksa.usia} Tahun)</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Jenis Kelamin</span>
                    <span className="col-span-2 text-slate-700">{permohonan.terperiksa.jenisKelamin}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Pekerjaan</span>
                    <span className="col-span-2 text-slate-700">{permohonan.terperiksa.pekerjaan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Alamat KTP</span>
                    <span className="col-span-2 text-slate-700">{permohonan.terperiksa.alamatKtp}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Wali / Pendamping</span>
                    <span className="col-span-2 text-slate-700">{permohonan.terperiksa.namaWaliPendamping} ({permohonan.terperiksa.kontakWali})</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Perkara Hukum Terkait (Data Perkara) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-slate-900">Data Perkara</h3>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                    Penyidikan Aktif
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Nomor LP</span>
                    <span className="col-span-2 font-mono font-bold text-slate-900">{permohonan.perkara.nomorLaporanPolisi}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Tanggal LP</span>
                    <span className="col-span-2 text-slate-700">{permohonan.perkara.tanggalLp}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Instansi Penyidik</span>
                    <span className="col-span-2 font-semibold text-slate-900">{permohonan.perkara.instansiPenyidik}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Nama Penyidik</span>
                    <span className="col-span-2 text-slate-700">{permohonan.perkara.namaPenyidik} ({permohonan.perkara.nomorHpPenyidik})</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Pasal Sangkaan</span>
                    <span className="col-span-2 font-bold text-slate-900 bg-amber-50 p-1 rounded border border-amber-200">
                      {permohonan.perkara.pasalDipersangkakan}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Waktu Penangkapan</span>
                    <span className="col-span-2 text-slate-700">{permohonan.perkara.tanggalWaktuPenangkapan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">TKP</span>
                    <span className="col-span-2 text-slate-700">{permohonan.perkara.tempatKejadianPerkara}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500">Kronologi Singkat</span>
                    <span className="col-span-2 text-slate-700 italic">{permohonan.perkara.kronologiSingkat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barang Bukti Sub-Section */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Barang Bukti & Uji Lab</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-2.5">Jenis Zat / Narkotika</th>
                      <th className="p-2.5">Berat Bersih (Netto)</th>
                      <th className="p-2.5">Status Uji Lab Toksikologi</th>
                      <th className="p-2.5">Nomor Surat Hasil Lab</th>
                      <th className="p-2.5">Evaluasi Ambang Batas (SEMA 04/2010)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {permohonan.perkara.barangBuktiList.map(bb => (
                      <tr key={bb.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{bb.jenisZat}</td>
                        <td className="p-2.5 font-semibold text-slate-800">{bb.beratBersihGram} Gram</td>
                        <td className="p-2.5">
                          {bb.statusUjiLab === 'positif' ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                              Positif Lab
                            </span>
                          ) : bb.statusUjiLab === 'proses_lab' ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                              Sedang Diuji Lab
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                              Belum Uji
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-slate-700">{bb.nomorSuratLab || 'Menunggu dari Puslabfor'}</td>
                        <td className="p-2.5 text-slate-600">{bb.keterangan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMINISTRASI & VERIFIKASI BERKAS */}
        {activeTab === 'administrasi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Kelengkapan Berkas Persyaratan</h3>
              <span className="text-xs text-slate-500">Role: <strong className="text-blue-700 capitalize">{currentUser.role}</strong></span>
            </div>

            <div className="space-y-3">
              {permohonan.dokumenList.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={`border rounded-xl p-4 transition-all ${
                    doc.statusVerifikasi === 'perlu_perbaikan'
                      ? 'border-amber-300 bg-amber-50/40'
                      : doc.statusVerifikasi === 'sesuai'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                        <span className="text-sm font-bold text-slate-900">{doc.nama}</span>
                        {doc.wajib && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1.5 py-0.2 rounded">
                            Wajib
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">Versi {doc.versi}</span>
                      </div>

                      {doc.fileName && (
                        <div className="flex items-center space-x-3 text-xs text-slate-600 pt-0.5">
                          <span className="font-mono text-blue-700 underline cursor-pointer">{doc.fileName}</span>
                          <span className="text-slate-400">• {doc.fileSize}</span>
                          <span className="text-slate-400">• Diunggah: {doc.uploadedAt}</span>
                        </div>
                      )}

                      {/* Targeted Correction Note from Secretariat */}
                      {doc.catatanKoreksi && (
                        <div className="mt-2 p-2.5 bg-amber-100/70 border border-amber-300 rounded-lg text-xs text-amber-900">
                          <div className="font-semibold flex items-center space-x-1.5 text-amber-950 mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            <span>Catatan Koreksi dari Sekretariat TAT:</span>
                          </div>
                          <p>{doc.catatanKoreksi}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex flex-col sm:flex-row items-end md:items-center space-y-2 sm:space-y-0 sm:space-x-2 shrink-0">
                      {doc.statusVerifikasi === 'sesuai' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-lg border border-emerald-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sesuai</span>
                        </span>
                      ) : doc.statusVerifikasi === 'perlu_perbaikan' ? (
                        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-lg border border-amber-300 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Perlu Perbaikan</span>
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-lg">
                          Belum Diperiksa
                        </span>
                      )}

                      {/* Action for Pengaju: Fix Document */}
                      {currentUser.role === 'pengaju' && doc.statusVerifikasi === 'perlu_perbaikan' && (
                        <button
                          onClick={() => handleFixDocument(doc.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-amber-700"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah File Perbaikan</span>
                        </button>
                      )}

                      {/* Action for Sekretariat: Verify buttons */}
                      {currentUser.role === 'sekretariat' && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleVerifyDocumentItem(doc.id, 'sesuai')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => {
                              const note = prompt('Tuliskan catatan koreksi spesifik untuk dokumen ini:');
                              if (note) handleVerifyDocumentItem(doc.id, 'perlu_perbaikan', note);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors"
                          >
                            Minta Koreksi
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PENUGASAN & JADWAL */}
        {activeTab === 'jadwal' && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Penugasan Tim Asesor & Jadwal Koordinasi</h3>
              <p className="text-xs text-slate-500">
                Alokasi asesor medis & hukum lintas instansi, konfirmasi ketersediaan, dan pengaturan jadwal sidang pleno bersama.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-500">Tim Asesor Medis Ditugaskan</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{permohonan.timAsesmen?.asesorMedisNama || 'Belum Ditetapkan'}</p>
                <div className="mt-3 text-xs space-y-1 text-slate-600">
                  <p>Jadwal Pemeriksaan: <strong>{permohonan.timAsesmen?.jadwalPemeriksaanMedis || 'Menunggu penetapan'}</strong></p>
                  <p>Lokasi: <strong>{permohonan.timAsesmen?.lokasiPemeriksaan || 'Klinik / Ruang TAT'}</strong></p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-500">Tim Asesor Hukum Ditugaskan</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{permohonan.timAsesmen?.asesorHukumNama || 'Belum Ditetapkan'}</p>
                <div className="mt-3 text-xs space-y-1 text-slate-600">
                  <p>Jadwal Telaah Perkara: <strong>{permohonan.timAsesmen?.jadwalPemeriksaanHukum || 'Menunggu penetapan'}</strong></p>
                  <p>Instansi: <strong>Kejaksaan Negeri / Ahli Hukum BNN</strong></p>
                </div>
              </div>
            </div>

            <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-700">Agenda Sidang Pleno Bersama</span>
                  <p className="text-sm font-bold text-indigo-950 mt-1">
                    {permohonan.timAsesmen?.jadwalPleno || 'Belum dijadwalkan (Menunggu kedua asesmen selesai)'}
                  </p>
                </div>
                <span className="text-xs bg-indigo-200 text-indigo-900 px-2.5 py-1 rounded-full font-semibold">
                  {permohonan.sidangPleno?.statusPleno ? formatStatus(permohonan.sidangPleno.statusPleno) : 'Menunggu Kesiapan'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASESMEN MEDIS & PSIKOLOGIS TERSTRUKTUR */}
        {activeTab === 'medis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Hasil Pemeriksaan Medis & Psikologis Terstruktur</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Fakta klinis, pemeriksaan laboratorium urine, instrumen ASSIST/ASI, dan usulan intervensi rehabilitasi.
                </p>
              </div>
              {permohonan.asesmenMedis && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-300">
                  Asesor: {permohonan.asesmenMedis.asesorNama}
                </span>
              )}
            </div>

            {!permohonan.asesmenMedis ? (
              <div className="text-center py-12 text-slate-500">
                <Stethoscope className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">Asesmen medis belum diisi atau sedang berlangsung.</p>
                {currentUser.role === 'medis' && (
                  <p className="text-xs text-emerald-700 mt-1">Anda dapat memulai wawancara klinis dan pengisian formulir.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Instrumen ASSIST & Diagnosis Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">Skor Instrumen ASSIST</span>
                    <div className="text-xl font-extrabold text-emerald-950 mt-1">
                      {permohonan.asesmenMedis.skorInstrumen} Poin
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      Tingkat Risiko: {permohonan.asesmenMedis.tingkatRisikoInstrumen}
                    </span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-blue-800">Diagnosis Klinis ICD-10</span>
                    <div className="text-xs font-bold text-blue-950 mt-1">
                      {permohonan.asesmenMedis.diagnosisKlinisIcd}
                    </div>
                    <span className="text-[11px] text-blue-700">Komorbid: {permohonan.asesmenMedis.komorbiditasMedis}</span>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-purple-800">Usulan Intervensi Medis</span>
                    <div className="text-sm font-extrabold text-purple-950 mt-1">
                      {permohonan.asesmenMedis.kebutuhanRawat} ({permohonan.asesmenMedis.durasiUsulanBulan} Bulan)
                    </div>
                    <span className="text-[11px] text-purple-700">Sesuai standar klinis BNN & Kemenkes</span>
                  </div>
                </div>

                {/* Riwayat Penggunaan & Toksikologi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 mb-2">Riwayat Penggunaan Zat</h4>
                    {permohonan.asesmenMedis.riwayatZat.map((rz, i) => (
                      <div key={i} className="space-y-1 text-slate-700">
                        <p>Zat: <strong className="text-slate-900">{rz.jenisZat}</strong></p>
                        <p>Cara Pakai: {rz.caraPakai} • Frekuensi: {rz.frekuensi}</p>
                        <p>Lama Pemakaian: {rz.lamaPemakaianBulan} Bulan • Terakhir Pakai: {rz.terakhirPakai}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 mb-2">Hasil Laboratorium Urin Toksikologi</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permohonan.asesmenMedis.hasilUrin.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-200">
                          <span className="font-mono text-slate-700">{u.parameter}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${u.hasil === 'Positif' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {u.hasil}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interpretasi Klinis */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs">
                  <h4 className="font-bold text-slate-900 mb-1">Interpretasi Klinis Asesor Medis:</h4>
                  <p className="text-slate-700 leading-relaxed">{permohonan.asesmenMedis.interpretasiKlinis}</p>
                  {permohonan.asesmenMedis.catatanKhusus && (
                    <div className="mt-2 text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <strong>Catatan Khusus:</strong> {permohonan.asesmenMedis.catatanKhusus}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ASESMEN HUKUM */}
        {activeTab === 'hukum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Telaah Yuridis & Analisis Peran Terperiksa</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pemisahan antara fakta terverifikasi vs dugaan, telaah barang bukti (SEMA 04/2010), dan simpulan hukum.
                </p>
              </div>
              {permohonan.asesmenHukum && (
                <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded-lg border border-purple-300">
                  Asesor: {permohonan.asesmenHukum.asesorNama}
                </span>
              )}
            </div>

            {!permohonan.asesmenHukum ? (
              <div className="text-center py-12 text-slate-500">
                <Scale className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">Asesmen hukum belum tersedia atau menunggu klarifikasi penyidikan.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Peran & Rekomendasi Hukum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase text-purple-800">Hasil Analisis Peran Terperiksa</span>
                    <div className="text-base font-extrabold text-purple-950 mt-1">
                      {permohonan.asesmenHukum.analisisPeran}
                    </div>
                    <p className="text-xs text-purple-900 mt-2 leading-relaxed">
                      {permohonan.asesmenHukum.argumentasiPeran}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase text-blue-800">Rekomendasi Aspek Hukum</span>
                    <div className="text-base font-extrabold text-blue-950 mt-1">
                      {permohonan.asesmenHukum.rekomendasiHukum}
                    </div>
                    <p className="text-xs text-blue-900 mt-2 leading-relaxed">
                      {permohonan.asesmenHukum.kesimpulanHukum}
                    </p>
                  </div>
                </div>

                {/* Fakta Terverifikasi vs Belum Terverifikasi (Dokumen 1 Section 4.5) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-emerald-200 rounded-xl p-3.5 bg-emerald-50/30">
                    <h4 className="font-bold text-emerald-950 mb-2 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fakta Pendukung yang Terverifikasi:</span>
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {permohonan.asesmenHukum.faktaPendukung.map((fp, i) => (
                        <li key={i}>{fp}</li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-2 border-t border-emerald-200 text-slate-600">
                      <strong>Riwayat Residivisme:</strong> {permohonan.asesmenHukum.riwayatResidivisme.keteranganPerkaraLalu}
                    </div>
                  </div>

                  <div className="border border-amber-200 rounded-xl p-3.5 bg-amber-50/30">
                    <h4 className="font-bold text-amber-950 mb-2 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Catatan Informasi yang Belum Terverifikasi / Perlu Pendalaman:</span>
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {permohonan.asesmenHukum.catatanBelumTerverifikasi || 'Seluruh data pokok perkara telah tervalidasi.'}
                    </p>
                    <div className="mt-3 pt-2 border-t border-amber-200 text-slate-600">
                      <strong>Analisis Barang Bukti SEMA:</strong> {permohonan.asesmenHukum.analisisBarangBukti}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SIDANG PLENO TAT */}
        {activeTab === 'pleno' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Musyawarah Sidang Pleno Tim Asesmen Terpadu</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Forum sinkronisasi kesimpulan medis dan hukum, pencatatan dissenting opinion, dan perumusan rekomendasi bersama.
                </p>
              </div>
              {permohonan.sidangPleno && (
                <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-1 rounded-lg border border-indigo-300">
                  No. BA: {permohonan.sidangPleno.nomorBeritaAcara}
                </span>
              )}
            </div>

            {!permohonan.sidangPleno ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">Sidang Pleno belum diagendakan.</p>
                <p className="text-xs text-slate-400 mt-1">Pleno diselenggarakan setelah hasil medis & telaah hukum dinyatakan siap dibahas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pleno Meta */}
                <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-indigo-950 text-sm">{permohonan.sidangPleno.pimpinanPleno}</span>
                    <span className="bg-indigo-200 text-indigo-900 px-2.5 py-0.5 rounded font-bold">
                      {formatStatus(permohonan.sidangPleno.statusPleno)}
                    </span>
                  </div>
                  <p className="text-slate-600">Waktu & Tempat: {permohonan.sidangPleno.tanggalPleno} ({permohonan.sidangPleno.waktu}) • {permohonan.sidangPleno.tempat}</p>
                </div>

                {/* Pokok Bahasan & Kesepakatan Rekomendasi */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Pokok Bahasan Sidang Pleno:</h4>
                    <p className="text-slate-700">{permohonan.sidangPleno.pokokBahasan}</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-950 mb-1">Kesepakatan Rekomendasi Final:</h4>
                    <p className="text-blue-900 font-medium">{permohonan.sidangPleno.kesepakatanRekomendasi}</p>
                    <div className="flex items-center space-x-3 mt-2 text-[11px] text-blue-800">
                      <span>Jenis: <strong>{permohonan.sidangPleno.jenisRekomendasiFinal}</strong></span>
                      {permohonan.sidangPleno.durasiRehabBulan && (
                        <span>• Durasi: <strong>{permohonan.sidangPleno.durasiRehabBulan} Bulan</strong></span>
                      )}
                      {permohonan.sidangPleno.fasilitasRujukanUsulan && (
                        <span>• Usulan Rujukan: <strong>{permohonan.sidangPleno.fasilitasRujukanUsulan}</strong></span>
                      )}
                    </div>
                  </div>

                  {permohonan.sidangPleno.catatanPerbedaanPendapat && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                      <strong>Catatan Perbedaan Pendapat (Dissenting Opinions):</strong> {permohonan.sidangPleno.catatanPerbedaanPendapat}
                    </div>
                  )}
                </div>

                {/* Daftar Hadir Peserta Pleno */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs">
                  <h4 className="font-bold text-slate-900 mb-2">Daftar Kehadiran Anggota Tim Pleno:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {permohonan.sidangPleno.daftarHadir.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                        <div>
                          <p className="font-bold text-slate-900">{p.nama}</p>
                          <p className="text-[10px] text-slate-500">{p.peran} • {p.instansi}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Hadir
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: REKOMENDASI & PENGESAHAN DOKUMEN RESMI */}
        {activeTab === 'dokumen' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <FileSignature className="w-4 h-4 text-purple-600" />
                  <span>Surat Rekomendasi Resmi & Pengesahan Multi-Pihak</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dokumen resmi produk layanan TAT yang ditandatangani secara elektronik berjenjang.
                </p>
              </div>
              {permohonan.rekomendasiResmi && (
                <button
                  onClick={() => onOpenQrModal(permohonan)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Cek QR Verifikasi</span>
                </button>
              )}
            </div>

            {!permohonan.rekomendasiResmi ? (
              <div className="text-center py-12 text-slate-500">
                <FileSignature className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">Surat rekomendasi belum diterbitkan.</p>
                <p className="text-xs text-slate-400 mt-1">Dokumen resmi disusun setelah kesepakatan Sidang Pleno tercapai.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Official Letter Preview Card */}
                <div className="border border-slate-300 rounded-xl p-6 bg-white font-serif">
                  <div className="text-center pb-4 border-b-2 border-slate-900 space-y-0.5 font-sans">
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-600">
                      TIM ASESMEN TERPADU (TAT) KORBAN PENYALAHGUNAAN NARKOTIKA
                    </p>
                    <p className="text-sm font-extrabold uppercase text-slate-900">
                      PROVINSI JAWA BARAT
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Sekretariat: Kantor BNNP Jawa Barat, Jl. H. Hasan No. 1, Bandung
                    </p>
                  </div>

                  <div className="text-center my-4 font-sans">
                    <h3 className="font-bold text-sm uppercase underline text-slate-900">
                      SURAT REKOMENDASI ASESMEN TERPADU
                    </h3>
                    <p className="text-xs font-mono text-slate-600 mt-0.5">
                      Nomor: {permohonan.rekomendasiResmi.nomorSurat}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-800 font-sans">
                    <p>
                      Berdasarkan hasil asesmen medis dan asesmen hukum terhadap Terperiksa <strong>{permohonan.terperiksa.namaLengkap}</strong> terkait perkara dugaan tindak pidana narkotika Nomor: <strong>{permohonan.perkara.nomorLaporanPolisi}</strong>, bersama ini Tim Asesmen Terpadu menyampaikan simpulan pertimbangan sebagai berikut:
                    </p>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                      <p><strong>1. Ringkasan Medis:</strong> {permohonan.rekomendasiResmi.ringkasanMedis}</p>
                      <p><strong>2. Ringkasan Hukum:</strong> {permohonan.rekomendasiResmi.ringkasanHukum}</p>
                      <p className="pt-2 border-t border-slate-200 text-blue-950 font-bold">
                        <strong>3. Rekomendasi Akhir:</strong> {permohonan.rekomendasiResmi.rekomendasiFinalText}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      Surat rekomendasi ini diterbitkan untuk digunakan sebagai pertimbangan penyidik, penuntut umum, dan hakim sesuai ketentuan perundang-undangan.
                    </p>
                  </div>

                  {/* Signatures Matrix */}
                  <div className="mt-6 pt-4 border-t border-slate-200 font-sans">
                    <p className="text-xs font-bold text-slate-900 mb-3 text-center">
                      DAFTAR PENGESAHAN DOKUMEN (TANDA TANGAN ELEKTRONIK TERSERTIFIKASI)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {permohonan.rekomendasiResmi.daftarPengesah.map((p) => (
                        <div key={p.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 text-center flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold">{p.jabatan}</p>
                            <p className="text-xs font-bold text-slate-900 mt-1">{p.nama}</p>
                            <p className="text-[10px] text-slate-500">{p.instansi}</p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200">
                            {p.status === 'disahkan' ? (
                              <div className="text-emerald-700 space-y-0.5">
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded block">
                                  Telah Disahkan
                                </span>
                                <span className="text-[9px] text-slate-400 block font-mono truncate">{p.tandaTanganDigitalHash}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded block">
                                Menunggu Pengesahan
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bukti Penerimaan Pengaju */}
                {permohonan.rekomendasiResmi.buktiPenerimaanPengaju ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Konfirmasi Tanda Terima Pengaju:</span>
                      <span>Diterima oleh {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.diterimaOleh} pada {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.tanggalDiterima}</span>
                    </div>
                    <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-emerald-300">
                      {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.nomorTandaTerima}
                    </span>
                  </div>
                ) : currentUser.role === 'pengaju' && (permohonan.statusProsesUtama === 'rekomendasi_terbit' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-blue-950 block">Konfirmasi Tanda Terima Berkas Resmi:</span>
                      <p className="text-blue-800 text-[11px] mt-0.5">
                        Sebagai penyidik pemohon, Anda berhak menerima surat rekomendasi resmi e-TAT untuk kelengkapan berkas perkara penyidikan.
                      </p>
                    </div>
                    <button
                      onClick={handlePengajuSignReceipt}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg border border-blue-700 flex items-center space-x-1.5 shrink-0 shadow-none transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandatangani Tanda Terima</span>
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: RUJUKAN & TINDAK LANJUT LAYANAN */}
        {activeTab === 'tindak_lanjut' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-teal-600" />
                <span>Pemantauan Rujukan & Realisasi Tindak Lanjut</span>
              </h3>
              <p className="text-xs text-slate-500">
                Memastikan layanan tidak berhenti saat surat diterbitkan; melacak penerimaan fasilitas, tanggal masuk, dan hambatan penempatan.
              </p>
            </div>

            {!permohonan.tindakLanjut ? (
              <div className="text-center py-12 text-slate-500">
                <Share2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">Tindak lanjut belum dapat diproses.</p>
                <p className="text-xs text-slate-400 mt-1">Rujukan dikoordinasikan setelah rekomendasi resmi diterbitkan.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Status Rujukan Banner */}
                <div className={`p-4 rounded-xl border ${
                  permohonan.tindakLanjut.statusRujukan === 'kapasitas_penuh'
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : permohonan.tindakLanjut.statusRujukan === 'klien_mulai_layanan'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase block tracking-wider">Status Koordinasi Rujukan</span>
                      <span className="text-base font-bold mt-0.5 block">
                        {formatStatus(permohonan.tindakLanjut.statusRujukan)}
                      </span>
                    </div>
                    <span className="text-xs bg-white/80 px-3 py-1 rounded-full font-semibold border border-current">
                      Fasilitas: {permohonan.tindakLanjut.namaFasilitasTujuan || 'Belum Ditentukan'}
                    </span>
                  </div>

                  {permohonan.tindakLanjut.hambatanPelaksanaan && (
                    <div className="mt-3 p-3 bg-white/90 border border-rose-200 rounded-lg text-rose-900">
                      <strong>Hambatan Nyata:</strong> {permohonan.tindakLanjut.hambatanPelaksanaan}
                    </div>
                  )}
                </div>

                {/* Facility Action Box for Rehabilitasi Role */}
                {(currentUser.role === 'rehabilitasi' || currentUser.role === 'sekretariat') && (
                  <div className="border border-teal-200 bg-teal-50/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-950 text-xs flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-700" />
                        <span>Aksi Khusus Petugas Fasilitas Rehabilitasi:</span>
                      </span>
                      <span className="text-[10px] bg-teal-100 text-teal-900 font-semibold px-2 py-0.5 rounded">
                        Mandat Layanan
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {permohonan.tindakLanjut.statusRujukan !== 'diterima_fasilitas' && permohonan.tindakLanjut.statusRujukan !== 'klien_mulai_layanan' && (
                        <button
                          onClick={() => handleRehabAction('terima')}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-teal-700 transition-all shadow-none"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Konfirmasi Ketersediaan Kuota & Jadwal Terima</span>
                        </button>
                      )}

                      {permohonan.tindakLanjut.statusRujukan !== 'klien_mulai_layanan' && (
                        <button
                          onClick={() => handleRehabAction('admisi')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-emerald-700 transition-all shadow-none"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Konfirmasi Klien Masuk Layanan (Admisi Selesai)</span>
                        </button>
                      )}

                      {permohonan.tindakLanjut.statusRujukan !== 'kapasitas_penuh' && (
                        <button
                          onClick={() => {
                            const reason = window.prompt('Masukkan catatan kendala / kuota penuh:', 'Kapasitas ruang rawat inap sedang terisi penuh 100%.');
                            if (reason) handleRehabAction('penuh', reason);
                          }}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-rose-300 transition-all shadow-none"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Laporkan Kuota Penuh / Kendala</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Rincian Tindak Lanjut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <h4 className="font-bold text-slate-900">Pelaksanaan Rujukan Rehabilitasi</h4>
                    <p>Fasilitas Rujukan: <strong>{permohonan.tindakLanjut.namaFasilitasTujuan}</strong></p>
                    <p>Kontak: {permohonan.tindakLanjut.kontakFasilitas}</p>
                    <p>Rujukan Dikirim: {permohonan.tindakLanjut.tanggalRujukanDikirim || '-'}</p>
                    <p>Konfirmasi Fasilitas: {permohonan.tindakLanjut.tanggalKonfirmasiFasilitas || '-'}</p>
                    <p>Tanggal Masuk Layanan: <strong>{permohonan.tindakLanjut.tanggalMulaiLayanan || 'Menunggu ketersediaan kuota'}</strong></p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <h4 className="font-bold text-slate-900">Status Proses Perkara Hukum Terkait</h4>
                    <p className="text-slate-700 leading-relaxed">
                      {permohonan.tindakLanjut.statusProsesHukumTerkait || 'Penyidikan berjalan sesuai ketentuan hukum berkeadilan restoratif.'}
                    </p>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                      Penanggung Jawab Tindak Lanjut: <strong>{permohonan.tindakLanjut.penanggungJawabTindakLanjut}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: KLARIFIKASI TERARAH (Targeted Q&A per Role) */}
        {activeTab === 'klarifikasi' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Klarifikasi Terarah Melekat pada Berkas</span>
              </h3>
              <p className="text-xs text-slate-500">
                Komunikasi resmi antar-penyidik, sekretariat, asesor medis, dan asesor hukum yang terdokumentasi dalam audit trail.
              </p>
            </div>

            {/* Kirim Pertanyaan Baru */}
            <form onSubmit={handleSendKlarifikasi} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">Ajukan Klarifikasi / Pertanyaan Dokumen</span>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500">Tujukan Kepada:</span>
                  <select
                    value={tujuanPeran}
                    onChange={(e) => setTujuanPeran(e.target.value as UserRole)}
                    className="border border-slate-300 rounded px-2 py-1 bg-white font-medium text-slate-800"
                  >
                    <option value="pengaju">Penyidik Pengaju</option>
                    <option value="sekretariat">Sekretariat TAT</option>
                    <option value="medis">Tim Asesor Medis</option>
                    <option value="hukum">Tim Asesor Hukum</option>
                    <option value="koordinator">Ketua Tim TAT</option>
                    <option value="rehabilitasi">Fasilitas Rehabilitasi</option>
                  </select>
                </div>
              </div>

              <textarea
                value={pertanyaanInput}
                onChange={(e) => setPertanyaanInput(e.target.value)}
                placeholder="Tuliskan permintaan klarifikasi substantif atau administrasi secara spesifik..."
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!pertanyaanInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 border border-blue-700"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Klarifikasi</span>
                </button>
              </div>
            </form>

            {/* List of Clarifications */}
            <div className="space-y-3">
              {permohonan.klarifikasiList.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">Belum ada percakapan klarifikasi untuk berkas ini.</p>
              ) : (
                permohonan.klarifikasiList.map(item => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{item.dariNama}</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium capitalize">
                          {item.dariPeran}
                        </span>
                        <span>→ Kepada: <strong className="capitalize">{item.kepadaPeran}</strong></span>
                      </div>
                      <span>{item.tanggalTanya}</span>
                    </div>

                    <p className="text-slate-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-200">
                      "{item.pertanyaan}"
                    </p>

                    {item.jawaban ? (
                      <div className="mt-2 pl-4 border-l-2 border-blue-500 bg-blue-50/50 p-2.5 rounded-r">
                        <div className="flex items-center justify-between text-[10px] text-blue-900 font-semibold mb-1">
                          <span>Jawaban oleh {item.dijawabOleh}</span>
                          <span>{item.tanggalJawab}</span>
                        </div>
                        <p className="text-slate-800">{item.jawaban}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-amber-700 font-medium pt-1">
                        <span>Menunggu tanggapan dari {item.kepadaPeran}...</span>
                        {currentUser.role === item.kepadaPeran && (
                          <button
                            onClick={() => {
                              const ans = prompt(`Jawab klarifikasi untuk ${item.dariNama}:`);
                              if (ans) {
                                const updatedKlarifikasi = permohonan.klarifikasiList.map(k => {
                                  if (k.id === item.id) {
                                    return {
                                      ...k,
                                      jawaban: ans,
                                      dijawabOleh: currentUser.name,
                                      tanggalJawab: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                                      status: 'selesai' as const
                                    };
                                  }
                                  return k;
                                });
                                onUpdatePermohonan({
                                  ...permohonan,
                                  klarifikasiList: updatedKlarifikasi
                                });
                              }
                            }}
                            className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded font-semibold"
                          >
                            Tanggapi Sekarang
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 10: RIWAYAT & AUDIT TRAIL */}
        {activeTab === 'riwayat' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Catatan Riwayat Aktivitas & Jejak Audit (Audit Trail)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Rekaman perubahan status, aktor yang bertindak, dan waktu kejadian yang tidak dapat diubah (immutable log).
              </p>
            </div>

            <div className="space-y-3">
              {permohonan.auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.aksi}</span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{log.rincian}</p>
                    <span className="text-[10px] text-blue-700 font-semibold mt-1 inline-block">
                      Oleh: {log.actorNama} ({log.actorPeran})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
