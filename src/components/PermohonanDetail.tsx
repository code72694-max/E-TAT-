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
  Send,
  Activity
} from 'lucide-react';
import { PengawasanPascaTatSection } from './PengawasanPascaTatSection';

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
  | 'pengawasan'
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
        if (permohonan.pengawasanKlien || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') {
          tabs.push({ id: 'pengawasan', label: 'Pengawasan Pasca TAT', icon: <Activity className="w-3.5 h-3.5" /> });
        }
        tabs.push({ id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> });
        return tabs;
      }
      case 'sekretariat': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Ringkasan & Identitas', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Penugasan & Jadwal', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Persiapan Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Distribusi Dokumen', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Koordinasi Rujukan', icon: <Share2 className="w-3.5 h-3.5" /> },
        ];
        if (permohonan.pengawasanKlien || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') {
          tabs.push({ id: 'pengawasan', label: 'Pengawasan Pasca TAT', icon: <Activity className="w-3.5 h-3.5" /> });
        }
        tabs.push(
          { id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail', icon: <History className="w-3.5 h-3.5" /> }
        );
        return tabs;
      }
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
      case 'koordinator': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Ringkasan & Kendali Kasus', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Kesiapan Jadwal Tim', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Sidang Pleno TAT', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Pengesahan Rekomendasi Mandat', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Monitoring Rujukan', icon: <Share2 className="w-3.5 h-3.5" /> },
        ];
        if (permohonan.pengawasanKlien || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') {
          tabs.push({ id: 'pengawasan', label: 'Pengawasan Pasca TAT', icon: <Activity className="w-3.5 h-3.5" /> });
        }
        tabs.push(
          { id: 'klarifikasi', label: `Klarifikasi (${permohonan.klarifikasiList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail Lengkap', icon: <History className="w-3.5 h-3.5" /> }
        );
        return tabs;
      }
      case 'pimpinan': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Ringkasan Perkara & SLA', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Jadwal & Progres', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Berita Acara Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Rekomendasi Terbit', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Realisasi Rujukan', icon: <Share2 className="w-3.5 h-3.5" /> },
        ];
        if (permohonan.pengawasanKlien || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') {
          tabs.push({ id: 'pengawasan', label: 'Pengawasan Pasca TAT', icon: <Activity className="w-3.5 h-3.5" /> });
        }
        tabs.push(
          { id: 'riwayat', label: 'Audit Trail Pengawasan', icon: <History className="w-3.5 h-3.5" /> }
        );
        return tabs;
      }
      case 'rehabilitasi': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Informasi Klien Rujukan', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Dokumen Rekomendasi Legal', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'tindak_lanjut', label: 'Konfirmasi Admisi & Tindak Lanjut', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'pengawasan', label: 'Pengawasan Klien Pasca TAT', icon: <Activity className="w-3.5 h-3.5" /> }
        ];
        return tabs;
      }
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
      pengawasanKlien: action === 'admisi' && !permohonan.pengawasanKlien ? {
        id: 'pgw-' + Date.now(),
        statusKepatuhan: 'patuh',
        modalitasLayanan: permohonan.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rawat Inap' : 'Rawat Jalan',
        durasiBulan: permohonan.asesmenMedis?.durasiUsulanBulan || 3,
        tanggalMulai: nowStr,
        tanggalTargetSelesai: '3 Bulan Sejak Admisi',
        instansiPelaksanaRehab: permohonan.tindakLanjut.namaFasilitasTujuan || currentUser.agency,
        konselorPendamping: currentUser.name,
        penyidikPengawas: permohonan.perkara.namaPenyidik,
        totalSesiWajib: 12,
        sesiTerselesaikan: 1,
        jumlahMangkir: 0,
        suratPeringatanList: [],
        riwayatTesUrinBerkala: [
          {
            id: 'urin-' + Date.now(),
            tanggalTes: nowStr,
            tahapKe: 1,
            jenisPemeriksaan: 'Terjadwal',
            parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
            hasil: 'Negatif',
            keterangan: 'Skrining intake awal admisi rehabilitasi pasca rekomendasi TAT.',
            petugasPemeriksa: currentUser.name
          }
        ],
        jurnalPengawasan: [
          {
            id: 'jrn-' + Date.now(),
            tanggal: nowStr,
            jenisKegiatan: 'Konseling Individu',
            statusKehadiran: 'Hadir',
            catatanPerkembangan: 'Sesi intake admisi dan penandatanganan lembar komitmen program rehabilitasi pasca TAT.',
            petugasPengawas: currentUser.name,
            instansiPengawas: currentUser.agency
          }
        ],
        rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
      } : permohonan.pengawasanKlien,
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
            className="p-2 bg-[#0b172a] border border-[#1b3459] hover:bg-[#142642] rounded-lg text-slate-300 transition-colors cursor-pointer"
            title="Kembali ke Daftar Permohonan"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-semibold text-[#38bdf8] bg-[#142642] px-2 py-0.5 rounded border border-[#1e3c66]">
                Berkas Asesmen Terpadu
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Diajukan: {permohonan.tanggalPengajuan}</span>
            </div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2 mt-0.5">
              <span className="font-mono text-[#F1C40F]">{permohonan.nomorPermohonan}</span>
              <span className="text-slate-600 font-normal">|</span>
              <span className="text-white">{permohonan.terperiksa.namaLengkap}</span>
            </h1>
          </div>
        </div>

        {/* Quick QR code button if recommendation is ready */}
        {permohonan.rekomendasiResmi && (
          <button
            onClick={() => onOpenQrModal(permohonan)}
            className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-2 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all shrink-0"
          >
            <QrCode className="w-4 h-4 text-[#F1C40F]" />
            <span>Verifikasi Keabsahan (QR)</span>
          </button>
        )}
      </div>

      {/* Compact Status & Action Overview */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-3">
        {/* 4 Statuses in a clean, minimal row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="bg-[#081224] border border-[#1b3459] rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Proses Utama</span>
            <span className="text-xs font-bold text-[#38bdf8] mt-0.5 block truncate">
              {formatStatus(permohonan.statusProsesUtama)}
            </span>
          </div>

          <div className="bg-[#081224] border border-[#1b3459] rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Telaah Medis & Hukum</span>
            <div className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center space-x-1.5 truncate">
              <span className="text-emerald-400">M: {formatStatus(permohonan.statusMedis)}</span>
              <span className="text-slate-600">|</span>
              <span className="text-purple-300">H: {formatStatus(permohonan.statusHukum)}</span>
            </div>
          </div>

          <div className="bg-[#081224] border border-[#1b3459] rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dokumen Rekomendasi</span>
            <span className="text-xs font-bold text-white mt-0.5 block truncate">
              {formatStatus(permohonan.statusDokumen)}
            </span>
          </div>

          <div className="bg-[#081224] border border-[#1b3459] rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Tindak Lanjut</span>
            <span className={`text-xs font-bold mt-0.5 block truncate ${permohonan.statusTindakLanjut === 'terhambat' ? 'text-rose-400' : 'text-slate-200'}`}>
              {formatStatus(permohonan.statusTindakLanjut)}
            </span>
          </div>
        </div>

        {/* Clean Action Strip */}
        <div className="pt-2 border-t border-[#1b3459] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Langkah Selanjutnya:</span>
            <span className="font-semibold text-white">{permohonan.tindakanBerikutnyaLabel}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">PJ: <strong className="text-slate-200">{permohonan.penanggungJawabBerikutnya}</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">SLA: <strong className="text-[#F1C40F]">{permohonan.tenggatSlaTanggal}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {permohonan.statusProsesUtama === 'perlu_perbaikan' && currentUser.role === 'pengaju' && (
              <button
                onClick={() => setActiveTab('administrasi')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Perbaikan</span>
              </button>
            )}

            {permohonan.statusProsesUtama === 'verifikasi_berkas' && currentUser.role === 'sekretariat' && (
              <button
                onClick={() => setActiveTab('administrasi')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verifikasi Dokumen</span>
              </button>
            )}

            {permohonan.statusProsesUtama === 'pengesahan_rekomendasi' && userCanSignNow && (
              <button
                onClick={handleDigitalSign}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Tandatangani Rekomendasi</span>
              </button>
            )}

            {currentUser.role === 'rehabilitasi' && permohonan.tindakLanjut && (
              <button
                onClick={() => setActiveTab('tindak_lanjut')}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Konfirmasi Rujukan</span>
              </button>
            )}

            {currentUser.role === 'pengaju' && permohonan.rekomendasiResmi && (permohonan.statusProsesUtama === 'rekomendasi_terbit' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') && (
              <button
                onClick={() => setActiveTab('dokumen')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Rekomendasi Resmi</span>
              </button>
            )}

            {availableTabs.some(t => t.id === 'klarifikasi') && (
              <button
                onClick={() => setActiveTab('klarifikasi')}
                className="bg-[#1b3459] hover:bg-[#25487a] text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer border border-[#2d5289]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Klarifikasi ({permohonan.klarifikasiList.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Filtered dynamically per role */}
      <div className="border-b border-[#1b3459]">
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {availableTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-b-2 border-[#38bdf8] text-[#38bdf8] bg-[#0b172a]'
                    : 'text-slate-400 hover:text-white hover:bg-[#0b172a]/60'
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
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 min-h-[420px]">
        {/* TAB 1: RINGKASAN & IDENTITAS (Separation of Person, Case, and Application) */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom 1: Terperiksa (Data Orang) */}
              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224]">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b3459] mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#38bdf8]" />
                    <h3 className="text-sm font-bold text-white">Data Terperiksa</h3>
                  </div>
                  {permohonan.terperiksa.isNikVerified ? (
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-700/60">
                      NIK Terverifikasi
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-900/60 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-700/60">
                      NIK Perlu Verifikasi
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Nama Lengkap</span>
                    <span className="col-span-2 font-bold text-white">{permohonan.terperiksa.namaLengkap}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Nama Panggilan/Alias</span>
                    <span className="col-span-2 text-slate-300">{permohonan.terperiksa.alias || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">NIK / Identitas</span>
                    <span className="col-span-2 font-mono text-[#F1C40F]">{permohonan.terperiksa.nik || 'Tidak ada (Dibuatkan ID Khusus)'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Tempat, Tgl Lahir</span>
                    <span className="col-span-2 text-slate-300">{permohonan.terperiksa.tempatLahir}, {permohonan.terperiksa.tanggalLahir} ({permohonan.terperiksa.usia} Tahun)</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Jenis Kelamin</span>
                    <span className="col-span-2 text-slate-300">{permohonan.terperiksa.jenisKelamin}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Pekerjaan</span>
                    <span className="col-span-2 text-slate-300">{permohonan.terperiksa.pekerjaan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Alamat KTP</span>
                    <span className="col-span-2 text-slate-300">{permohonan.terperiksa.alamatKtp}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Wali / Pendamping</span>
                    <span className="col-span-2 text-slate-300">{permohonan.terperiksa.namaWaliPendamping} ({permohonan.terperiksa.kontakWali})</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Perkara Hukum Terkait (Data Perkara) */}
              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224]">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b3459] mb-3">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Data Perkara</h3>
                  </div>
                  <span className="text-[10px] bg-purple-900/60 text-purple-300 font-semibold px-2 py-0.5 rounded border border-purple-700/60">
                    Penyidikan Aktif
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Nomor LP</span>
                    <span className="col-span-2 font-mono font-bold text-white">{permohonan.perkara.nomorLaporanPolisi}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Tanggal LP</span>
                    <span className="col-span-2 text-slate-300">{permohonan.perkara.tanggalLp}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Instansi Penyidik</span>
                    <span className="col-span-2 font-semibold text-white">{permohonan.perkara.instansiPenyidik}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Nama Penyidik</span>
                    <span className="col-span-2 text-slate-300">{permohonan.perkara.namaPenyidik} ({permohonan.perkara.nomorHpPenyidik})</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Pasal Sangkaan</span>
                    <span className="col-span-2 font-bold text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-500/40 font-mono">
                      {permohonan.perkara.pasalDipersangkakan}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Waktu Penangkapan</span>
                    <span className="col-span-2 text-slate-300">{permohonan.perkara.tanggalWaktuPenangkapan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">TKP</span>
                    <span className="col-span-2 text-slate-300">{permohonan.perkara.tempatKejadianPerkara}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-400">Kronologi Singkat</span>
                    <span className="col-span-2 text-slate-300 italic">{permohonan.perkara.kronologiSingkat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barang Bukti Sub-Section */}
            <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#38bdf8]" />
                <span>Barang Bukti & Uji Lab</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#1b3459] rounded-lg overflow-hidden">
                  <thead className="bg-[#0b172a] text-slate-300 uppercase text-[10px] font-semibold border-b border-[#1b3459]">
                    <tr>
                      <th className="p-2.5">Jenis Zat / Narkotika</th>
                      <th className="p-2.5">Berat Bersih (Netto)</th>
                      <th className="p-2.5">Status Uji Lab Toksikologi</th>
                      <th className="p-2.5">Nomor Surat Hasil Lab</th>
                      <th className="p-2.5">Evaluasi Ambang Batas (SEMA 04/2010)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b3459]">
                    {permohonan.perkara.barangBuktiList.map(bb => (
                      <tr key={bb.id} className="hover:bg-[#0f213a]">
                        <td className="p-2.5 font-bold text-white">{bb.jenisZat}</td>
                        <td className="p-2.5 font-semibold text-slate-200">{bb.beratBersihGram} Gram</td>
                        <td className="p-2.5">
                          {bb.statusUjiLab === 'positif' ? (
                            <span className="bg-emerald-900/60 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700/60">
                              Positif Lab
                            </span>
                          ) : bb.statusUjiLab === 'proses_lab' ? (
                            <span className="bg-amber-900/60 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-700/60">
                              Sedang Diuji Lab
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                              Belum Uji
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-slate-300">{bb.nomorSuratLab || 'Menunggu dari Puslabfor'}</td>
                        <td className="p-2.5 text-slate-400">{bb.keterangan || '-'}</td>
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
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white">Kelengkapan Berkas Persyaratan</h3>
              <span className="text-xs text-slate-400">Role: <strong className="text-[#38bdf8] capitalize">{currentUser.role}</strong></span>
            </div>

            <div className="space-y-3">
              {permohonan.dokumenList.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={`border rounded-xl p-4 transition-all ${
                    doc.statusVerifikasi === 'perlu_perbaikan'
                      ? 'border-amber-500/50 bg-amber-950/20'
                      : doc.statusVerifikasi === 'sesuai'
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : 'border-[#1b3459] bg-[#081224]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                        <span className="text-sm font-bold text-white">{doc.nama}</span>
                        {doc.wajib && (
                          <span className="text-[10px] bg-red-900/60 text-red-300 font-semibold px-1.5 py-0.5 rounded border border-red-700/60">
                            Wajib
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">Versi {doc.versi}</span>
                      </div>

                      {doc.fileName && (
                        <div className="flex items-center space-x-3 text-xs text-slate-400 pt-0.5">
                          <span className="font-mono text-[#38bdf8] underline cursor-pointer">{doc.fileName}</span>
                          <span className="text-slate-500">• {doc.fileSize}</span>
                          <span className="text-slate-500">• Diunggah: {doc.uploadedAt}</span>
                        </div>
                      )}

                      {/* Targeted Correction Note from Secretariat */}
                      {doc.catatanKoreksi && (
                        <div className="mt-2 p-2.5 bg-amber-950/50 border border-amber-500/40 rounded-lg text-xs text-amber-200">
                          <div className="font-semibold flex items-center space-x-1.5 text-amber-300 mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Catatan Koreksi dari Sekretariat TAT:</span>
                          </div>
                          <p>{doc.catatanKoreksi}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex flex-col sm:flex-row items-end md:items-center space-y-2 sm:space-y-0 sm:space-x-2 shrink-0">
                      {doc.statusVerifikasi === 'sesuai' ? (
                        <span className="bg-emerald-900/60 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-lg border border-emerald-700/60 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Sesuai</span>
                        </span>
                      ) : doc.statusVerifikasi === 'perlu_perbaikan' ? (
                        <span className="bg-amber-900/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-lg border border-amber-700/60 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Perlu Perbaikan</span>
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 text-xs font-medium px-3 py-1 rounded-lg border border-slate-700">
                          Belum Diperiksa
                        </span>
                      )}

                      {/* Action for Pengaju: Fix Document */}
                      {currentUser.role === 'pengaju' && doc.statusVerifikasi === 'perlu_perbaikan' && (
                        <button
                          onClick={() => handleFixDocument(doc.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-amber-500 cursor-pointer transition-all"
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => {
                              const note = prompt('Tuliskan catatan koreksi spesifik untuk dokumen ini:');
                              if (note) handleVerifyDocumentItem(doc.id, 'perlu_perbaikan', note);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
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
            <div className="pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white">Penugasan Tim Asesor & Jadwal Koordinasi</h3>
              <p className="text-xs text-slate-400">
                Alokasi asesor medis & hukum lintas instansi, konfirmasi ketersediaan, dan pengaturan jadwal sidang pleno bersama.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224]">
                <span className="text-[10px] font-bold uppercase text-slate-400">Tim Asesor Medis Ditugaskan</span>
                <p className="text-sm font-bold text-white mt-1">{permohonan.timAsesmen?.asesorMedisNama || 'Belum Ditetapkan'}</p>
                <div className="mt-3 text-xs space-y-1 text-slate-300">
                  <p>Jadwal Pemeriksaan: <strong className="text-white">{permohonan.timAsesmen?.jadwalPemeriksaanMedis || 'Menunggu penetapan'}</strong></p>
                  <p>Lokasi: <strong className="text-white">{permohonan.timAsesmen?.lokasiPemeriksaan || 'Klinik / Ruang TAT'}</strong></p>
                </div>
              </div>

              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224]">
                <span className="text-[10px] font-bold uppercase text-slate-400">Tim Asesor Hukum Ditugaskan</span>
                <p className="text-sm font-bold text-white mt-1">{permohonan.timAsesmen?.asesorHukumNama || 'Belum Ditetapkan'}</p>
                <div className="mt-3 text-xs space-y-1 text-slate-300">
                  <p>Jadwal Telaah Perkara: <strong className="text-white">{permohonan.timAsesmen?.jadwalPemeriksaanHukum || 'Menunggu penetapan'}</strong></p>
                  <p>Instansi: <strong className="text-white">Kejaksaan Negeri / Ahli Hukum BNN</strong></p>
                </div>
              </div>
            </div>

            <div className="border border-[#234b7d] bg-[#0d213d] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#38bdf8]">Agenda Sidang Pleno Bersama</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {permohonan.timAsesmen?.jadwalPleno || 'Belum dijadwalkan (Menunggu kedua asesmen selesai)'}
                  </p>
                </div>
                <span className="text-xs bg-[#17375e] text-[#38bdf8] px-2.5 py-1 rounded-full font-semibold border border-[#234b7d]">
                  {permohonan.sidangPleno?.statusPleno ? formatStatus(permohonan.sidangPleno.statusPleno) : 'Menunggu Kesiapan'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASESMEN MEDIS & PSIKOLOGIS TERSTRUKTUR */}
        {activeTab === 'medis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Hasil Pemeriksaan Medis & Psikologis Terstruktur</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Fakta klinis, pemeriksaan laboratorium urine, instrumen ASSIST/ASI, dan usulan intervensi rehabilitasi.
                </p>
              </div>
              {permohonan.asesmenMedis && (
                <span className="text-xs bg-emerald-900/60 text-emerald-300 font-semibold px-2.5 py-1 rounded-lg border border-emerald-700/60">
                  Asesor: {permohonan.asesmenMedis.asesorNama}
                </span>
              )}
            </div>

            {!permohonan.asesmenMedis ? (
              <div className="text-center py-12 text-slate-400">
                <Stethoscope className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Asesmen medis belum diisi atau sedang berlangsung.</p>
                {currentUser.role === 'medis' && (
                  <p className="text-xs text-emerald-400 mt-1">Anda dapat memulai wawancara klinis dan pengisian formulir.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Instrumen ASSIST & Diagnosis Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-emerald-400">Skor Instrumen ASSIST</span>
                    <div className="text-xl font-extrabold text-white mt-1">
                      {permohonan.asesmenMedis.skorInstrumen} Poin
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300">
                      Tingkat Risiko: {permohonan.asesmenMedis.tingkatRisikoInstrumen}
                    </span>
                  </div>

                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-[#38bdf8]">Diagnosis Klinis ICD-10</span>
                    <div className="text-xs font-bold text-white mt-1">
                      {permohonan.asesmenMedis.diagnosisKlinisIcd}
                    </div>
                    <span className="text-[11px] text-blue-300">Komorbid: {permohonan.asesmenMedis.komorbiditasMedis}</span>
                  </div>

                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-purple-300">Usulan Intervensi Medis</span>
                    <div className="text-sm font-extrabold text-white mt-1">
                      {permohonan.asesmenMedis.kebutuhanRawat} ({permohonan.asesmenMedis.durasiUsulanBulan} Bulan)
                    </div>
                    <span className="text-[11px] text-purple-300">Sesuai standar klinis BNN & Kemenkes</span>
                  </div>
                </div>

                {/* Riwayat Penggunaan & Toksikologi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-[#1b3459] rounded-xl p-3 bg-[#081224]">
                    <h4 className="font-bold text-white mb-2">Riwayat Penggunaan Zat</h4>
                    {permohonan.asesmenMedis.riwayatZat.map((rz, i) => (
                      <div key={i} className="space-y-1 text-slate-300">
                        <p>Zat: <strong className="text-white">{rz.jenisZat}</strong></p>
                        <p>Cara Pakai: {rz.caraPakai} • Frekuensi: {rz.frekuensi}</p>
                        <p>Lama Pemakaian: {rz.lamaPemakaianBulan} Bulan • Terakhir Pakai: {rz.terakhirPakai}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-[#1b3459] rounded-xl p-3 bg-[#081224]">
                    <h4 className="font-bold text-white mb-2">Hasil Laboratorium Urin Toksikologi</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permohonan.asesmenMedis.hasilUrin.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-[#0b172a] rounded border border-[#1b3459]">
                          <span className="font-mono text-slate-300">{u.parameter}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${u.hasil === 'Positif' ? 'bg-red-900/60 text-red-300 border border-red-700/60' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'}`}>
                            {u.hasil}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interpretasi Klinis */}
                <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] text-xs">
                  <h4 className="font-bold text-white mb-1">Interpretasi Klinis Asesor Medis:</h4>
                  <p className="text-slate-300 leading-relaxed">{permohonan.asesmenMedis.interpretasiKlinis}</p>
                  {permohonan.asesmenMedis.catatanKhusus && (
                    <div className="mt-2 text-slate-300 bg-[#0b172a] p-2.5 rounded border border-[#1b3459]">
                      <strong className="text-white">Catatan Khusus:</strong> {permohonan.asesmenMedis.catatanKhusus}
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
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <span>Telaah Yuridis & Analisis Peran Terperiksa</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pemisahan antara fakta terverifikasi vs dugaan, telaah barang bukti (SEMA 04/2010), dan simpulan hukum.
                </p>
              </div>
              {permohonan.asesmenHukum && (
                <span className="text-xs bg-purple-900/60 text-purple-300 font-semibold px-2.5 py-1 rounded-lg border border-purple-700/60">
                  Asesor: {permohonan.asesmenHukum.asesorNama}
                </span>
              )}
            </div>

            {!permohonan.asesmenHukum ? (
              <div className="text-center py-12 text-slate-400">
                <Scale className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Asesmen hukum belum tersedia atau menunggu klarifikasi penyidikan.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Peran & Rekomendasi Hukum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase text-purple-300">Hasil Analisis Peran Terperiksa</span>
                    <div className="text-base font-extrabold text-white mt-1">
                      {permohonan.asesmenHukum.analisisPeran}
                    </div>
                    <p className="text-xs text-purple-200 mt-2 leading-relaxed">
                      {permohonan.asesmenHukum.argumentasiPeran}
                    </p>
                  </div>

                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase text-[#38bdf8]">Rekomendasi Aspek Hukum</span>
                    <div className="text-base font-extrabold text-white mt-1">
                      {permohonan.asesmenHukum.rekomendasiHukum}
                    </div>
                    <p className="text-xs text-blue-200 mt-2 leading-relaxed">
                      {permohonan.asesmenHukum.kesimpulanHukum}
                    </p>
                  </div>
                </div>

                {/* Fakta Terverifikasi vs Belum Terverifikasi (Dokumen 1 Section 4.5) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-emerald-500/30 rounded-xl p-3.5 bg-emerald-950/20">
                    <h4 className="font-bold text-emerald-300 mb-2 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Fakta Pendukung yang Terverifikasi:</span>
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {permohonan.asesmenHukum.faktaPendukung.map((fp, i) => (
                        <li key={i}>{fp}</li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-2 border-t border-emerald-800/60 text-slate-400">
                      <strong className="text-slate-300">Riwayat Residivisme:</strong> {permohonan.asesmenHukum.riwayatResidivisme.keteranganPerkaraLalu}
                    </div>
                  </div>

                  <div className="border border-amber-500/30 rounded-xl p-3.5 bg-amber-950/20">
                    <h4 className="font-bold text-amber-300 mb-2 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Catatan Informasi yang Belum Terverifikasi / Perlu Pendalaman:</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {permohonan.asesmenHukum.catatanBelumTerverifikasi || 'Seluruh data pokok perkara telah tervalidasi.'}
                    </p>
                    <div className="mt-3 pt-2 border-t border-amber-800/60 text-slate-400">
                      <strong className="text-slate-300">Analisis Barang Bukti SEMA:</strong> {permohonan.asesmenHukum.analisisBarangBukti}
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
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#38bdf8]" />
                  <span>Musyawarah Sidang Pleno Tim Asesmen Terpadu</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Forum sinkronisasi kesimpulan medis dan hukum, pencatatan dissenting opinion, dan perumusan rekomendasi bersama.
                </p>
              </div>
              {permohonan.sidangPleno && (
                <span className="text-xs bg-[#17375e] text-[#38bdf8] font-semibold px-2.5 py-1 rounded-lg border border-[#234b7d]">
                  No. BA: {permohonan.sidangPleno.nomorBeritaAcara}
                </span>
              )}
            </div>

            {!permohonan.sidangPleno ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Sidang Pleno belum diagendakan.</p>
                <p className="text-xs text-slate-500 mt-1">Pleno diselenggarakan setelah hasil medis & telaah hukum dinyatakan siap dibahas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pleno Meta */}
                <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">{permohonan.sidangPleno.pimpinanPleno}</span>
                    <span className="bg-[#17375e] text-[#38bdf8] px-2.5 py-0.5 rounded font-bold border border-[#234b7d]">
                      {formatStatus(permohonan.sidangPleno.statusPleno)}
                    </span>
                  </div>
                  <p className="text-slate-400">Waktu & Tempat: {permohonan.sidangPleno.tanggalPleno} ({permohonan.sidangPleno.waktu}) • {permohonan.sidangPleno.tempat}</p>
                </div>

                {/* Pokok Bahasan & Kesepakatan Rekomendasi */}
                <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] text-xs space-y-3">
                  <div>
                    <h4 className="font-bold text-white mb-1">Pokok Bahasan Sidang Pleno:</h4>
                    <p className="text-slate-300">{permohonan.sidangPleno.pokokBahasan}</p>
                  </div>

                  <div className="p-3 bg-[#0d213d] border border-[#234b7d] rounded-lg">
                    <h4 className="font-bold text-white mb-1">Kesepakatan Rekomendasi Final:</h4>
                    <p className="text-[#38bdf8] font-medium">{permohonan.sidangPleno.kesepakatanRekomendasi}</p>
                    <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-300">
                      <span>Jenis: <strong className="text-white">{permohonan.sidangPleno.jenisRekomendasiFinal}</strong></span>
                      {permohonan.sidangPleno.durasiRehabBulan && (
                        <span>• Durasi: <strong className="text-white">{permohonan.sidangPleno.durasiRehabBulan} Bulan</strong></span>
                      )}
                      {permohonan.sidangPleno.fasilitasRujukanUsulan && (
                        <span>• Usulan Rujukan: <strong className="text-white">{permohonan.sidangPleno.fasilitasRujukanUsulan}</strong></span>
                      )}
                    </div>
                  </div>

                  {permohonan.sidangPleno.catatanPerbedaanPendapat && (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-200">
                      <strong>Catatan Perbedaan Pendapat (Dissenting Opinions):</strong> {permohonan.sidangPleno.catatanPerbedaanPendapat}
                    </div>
                  )}
                </div>

                {/* Daftar Hadir Peserta Pleno */}
                <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] text-xs">
                  <h4 className="font-bold text-white mb-2">Daftar Kehadiran Anggota Tim Pleno:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {permohonan.sidangPleno.daftarHadir.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-[#0b172a] border border-[#1b3459]">
                        <div>
                          <p className="font-bold text-white">{p.nama}</p>
                          <p className="text-[10px] text-slate-400">{p.peran} • {p.instansi}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-700/60">
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
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileSignature className="w-4 h-4 text-[#38bdf8]" />
                  <span>Surat Rekomendasi Resmi & Pengesahan Multi-Pihak</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Dokumen resmi produk layanan TAT yang ditandatangani secara elektronik berjenjang.
                </p>
              </div>
              {permohonan.rekomendasiResmi && (
                <button
                  onClick={() => onOpenQrModal(permohonan)}
                  className="bg-[#0f274a] hover:bg-[#163a69] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-[#234b7d] cursor-pointer transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Cek QR Verifikasi</span>
                </button>
              )}
            </div>

            {!permohonan.rekomendasiResmi ? (
              <div className="text-center py-12 text-slate-400">
                <FileSignature className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Surat rekomendasi belum diterbitkan.</p>
                <p className="text-xs text-slate-500 mt-1">Dokumen resmi disusun setelah kesepakatan Sidang Pleno tercapai.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Official Letter Preview Card */}
                <div className="border border-[#234b7d] rounded-xl p-6 bg-[#081224] font-serif">
                  <div className="text-center pb-4 border-b-2 border-[#234b7d] space-y-0.5 font-sans">
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      TIM ASESMEN TERPADU (TAT) KORBAN PENYALAHGUNAAN NARKOTIKA
                    </p>
                    <p className="text-sm font-extrabold uppercase text-white">
                      PROVINSI JAWA BARAT
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Sekretariat: Kantor BNNP Jawa Barat, Jl. H. Hasan No. 1, Bandung
                    </p>
                  </div>

                  <div className="text-center my-4 font-sans">
                    <h3 className="font-bold text-sm uppercase underline text-white">
                      SURAT REKOMENDASI ASESMEN TERPADU
                    </h3>
                    <p className="text-xs font-mono text-[#38bdf8] mt-0.5">
                      Nomor: {permohonan.rekomendasiResmi.nomorSurat}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-300 font-sans">
                    <p>
                      Berdasarkan hasil asesmen medis dan asesmen hukum terhadap Terperiksa <strong className="text-white">{permohonan.terperiksa.namaLengkap}</strong> terkait perkara dugaan tindak pidana narkotika Nomor: <strong className="text-white">{permohonan.perkara.nomorLaporanPolisi}</strong>, bersama ini Tim Asesmen Terpadu menyampaikan simpulan pertimbangan sebagai berikut:
                    </p>

                    <div className="p-3 bg-[#0b172a] border border-[#1b3459] rounded space-y-2 text-slate-300">
                      <p><strong className="text-white">1. Ringkasan Medis:</strong> {permohonan.rekomendasiResmi.ringkasanMedis}</p>
                      <p><strong className="text-white">2. Ringkasan Hukum:</strong> {permohonan.rekomendasiResmi.ringkasanHukum}</p>
                      <p className="pt-2 border-t border-[#1b3459] text-[#38bdf8] font-bold">
                        <strong className="text-white">3. Rekomendasi Akhir:</strong> {permohonan.rekomendasiResmi.rekomendasiFinalText}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      Surat rekomendasi ini diterbitkan untuk digunakan sebagai pertimbangan penyidik, penuntut umum, dan hakim sesuai ketentuan perundang-undangan.
                    </p>
                  </div>

                  {/* Signatures Matrix */}
                  <div className="mt-6 pt-4 border-t border-[#1b3459] font-sans">
                    <p className="text-xs font-bold text-white mb-3 text-center">
                      DAFTAR PENGESAHAN DOKUMEN (TANDA TANGAN ELEKTRONIK TERSERTIFIKASI)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {permohonan.rekomendasiResmi.daftarPengesah.map((p) => (
                        <div key={p.id} className="border border-[#1b3459] rounded-lg p-3 bg-[#0b172a] text-center flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold">{p.jabatan}</p>
                            <p className="text-xs font-bold text-white mt-1">{p.nama}</p>
                            <p className="text-[10px] text-slate-400">{p.instansi}</p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#1b3459]">
                            {p.status === 'disahkan' ? (
                              <div className="text-emerald-300 space-y-0.5">
                                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-bold px-2 py-0.5 rounded block border border-emerald-700/60">
                                  Telah Disahkan
                                </span>
                                <span className="text-[9px] text-[#38bdf8] block font-mono truncate">{p.tandaTanganDigitalHash}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] bg-amber-900/60 text-amber-300 font-semibold px-2 py-0.5 rounded block border border-amber-700/60">
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
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold block text-emerald-300">Konfirmasi Tanda Terima Pengaju:</span>
                      <span>Diterima oleh {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.diterimaOleh} pada {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.tanggalDiterima}</span>
                    </div>
                    <span className="font-mono font-bold bg-[#0b172a] text-emerald-300 px-2 py-1 rounded border border-emerald-500/40">
                      {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.nomorTandaTerima}
                    </span>
                  </div>
                ) : currentUser.role === 'pengaju' && (permohonan.statusProsesUtama === 'rekomendasi_terbit' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut') ? (
                  <div className="p-4 bg-[#0d213d] border border-[#234b7d] rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">Konfirmasi Tanda Terima Berkas Resmi:</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        Sebagai penyidik pemohon, Anda berhak menerima surat rekomendasi resmi e-TAT untuk kelengkapan berkas perkara penyidikan.
                      </p>
                    </div>
                    <button
                      onClick={handlePengajuSignReceipt}
                      className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-bold text-xs px-4 py-2 rounded-xl border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F1C40F]" />
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
            <div className="pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-teal-400" />
                <span>Pemantauan Rujukan & Realisasi Tindak Lanjut</span>
              </h3>
              <p className="text-xs text-slate-400">
                Memastikan layanan tidak berhenti saat surat diterbitkan; melacak penerimaan fasilitas, tanggal masuk, dan hambatan penempatan.
              </p>
            </div>

            {!permohonan.tindakLanjut ? (
              <div className="text-center py-12 text-slate-400">
                <Share2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Tindak lanjut belum dapat diproses.</p>
                <p className="text-xs text-slate-500 mt-1">Rujukan dikoordinasikan setelah rekomendasi resmi diterbitkan.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Status Rujukan Banner */}
                <div className={`p-4 rounded-xl border ${
                  permohonan.tindakLanjut.statusRujukan === 'kapasitas_penuh'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : permohonan.tindakLanjut.statusRujukan === 'klien_mulai_layanan'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-[#0d213d] border-[#234b7d] text-white'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase block tracking-wider text-slate-300">Status Koordinasi Rujukan</span>
                      <span className="text-base font-bold mt-0.5 block text-white">
                        {formatStatus(permohonan.tindakLanjut.statusRujukan)}
                      </span>
                    </div>
                    <span className="text-xs bg-[#0b172a] px-3 py-1 rounded-full font-semibold border border-[#234b7d] text-[#38bdf8]">
                      Fasilitas: {permohonan.tindakLanjut.namaFasilitasTujuan || 'Belum Ditentukan'}
                    </span>
                  </div>

                  {permohonan.tindakLanjut.hambatanPelaksanaan && (
                    <div className="mt-3 p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-200">
                      <strong className="text-rose-100">Hambatan Nyata:</strong> {permohonan.tindakLanjut.hambatanPelaksanaan}
                    </div>
                  )}
                </div>

                {/* Facility Action Box for Rehabilitasi Role */}
                {(currentUser.role === 'rehabilitasi' || currentUser.role === 'sekretariat') && (
                  <div className="border border-teal-500/40 bg-teal-950/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-300 text-xs flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Aksi Khusus Petugas Fasilitas Rehabilitasi:</span>
                      </span>
                      <span className="text-[10px] bg-teal-900/60 text-teal-200 font-semibold px-2 py-0.5 rounded border border-teal-700/60">
                        Mandat Layanan
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {permohonan.tindakLanjut.statusRujukan !== 'diterima_fasilitas' && permohonan.tindakLanjut.statusRujukan !== 'klien_mulai_layanan' && (
                        <button
                          onClick={() => handleRehabAction('terima')}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-teal-500 cursor-pointer transition-all shadow-none"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Konfirmasi Ketersediaan Kuota & Jadwal Terima</span>
                        </button>
                      )}

                      {permohonan.tindakLanjut.statusRujukan !== 'klien_mulai_layanan' && (
                        <button
                          onClick={() => handleRehabAction('admisi')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-emerald-500 cursor-pointer transition-all shadow-none"
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
                          className="bg-rose-900/60 hover:bg-rose-900/80 text-rose-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-rose-500/50 cursor-pointer transition-all shadow-none"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Laporkan Kuota Penuh / Kendala</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Rincian Tindak Lanjut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-2 text-slate-300">
                    <h4 className="font-bold text-white">Pelaksanaan Rujukan Rehabilitasi</h4>
                    <p>Fasilitas Rujukan: <strong className="text-white">{permohonan.tindakLanjut.namaFasilitasTujuan}</strong></p>
                    <p>Kontak: <span className="text-slate-300">{permohonan.tindakLanjut.kontakFasilitas}</span></p>
                    <p>Rujukan Dikirim: <span className="text-slate-300">{permohonan.tindakLanjut.tanggalRujukanDikirim || '-'}</span></p>
                    <p>Konfirmasi Fasilitas: <span className="text-slate-300">{permohonan.tindakLanjut.tanggalKonfirmasiFasilitas || '-'}</span></p>
                    <p>Tanggal Masuk Layanan: <strong className="text-white">{permohonan.tindakLanjut.tanggalMulaiLayanan || 'Menunggu ketersediaan kuota'}</strong></p>
                  </div>

                  <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-2 text-slate-300">
                    <h4 className="font-bold text-white">Status Proses Perkara Hukum Terkait</h4>
                    <p className="text-slate-300 leading-relaxed">
                      {permohonan.tindakLanjut.statusProsesHukumTerkait || 'Penyidikan berjalan sesuai ketentuan hukum berkeadilan restoratif.'}
                    </p>
                    <div className="pt-2 border-t border-[#1b3459] text-[11px] text-slate-400">
                      Penanggung Jawab Tindak Lanjut: <strong className="text-white">{permohonan.tindakLanjut.penanggungJawabTindakLanjut}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB PENGAWASAN KLIEN PASCA TAT */}
        {activeTab === 'pengawasan' && (
          <PengawasanPascaTatSection
            permohonan={permohonan}
            currentUser={currentUser}
            onUpdatePermohonan={onUpdatePermohonan}
          />
        )}

        {/* TAB 9: KLARIFIKASI TERARAH (Targeted Q&A per Role) */}
        {activeTab === 'klarifikasi' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-[#38bdf8]" />
                <span>Klarifikasi Terarah Melekat pada Berkas</span>
              </h3>
              <p className="text-xs text-slate-400">
                Komunikasi resmi antar-penyidik, sekretariat, asesor medis, dan asesor hukum yang terdokumentasi dalam audit trail.
              </p>
            </div>

            {/* Kirim Pertanyaan Baru */}
            <form onSubmit={handleSendKlarifikasi} className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">Ajukan Klarifikasi / Pertanyaan Dokumen</span>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400">Tujukan Kepada:</span>
                  <select
                    value={tujuanPeran}
                    onChange={(e) => setTujuanPeran(e.target.value as UserRole)}
                    className="border border-[#1b3459] rounded px-2 py-1 bg-[#0b172a] font-medium text-white focus:outline-none focus:border-[#38bdf8]"
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
                className="w-full text-xs p-2.5 border border-[#1b3459] rounded-lg focus:outline-none focus:border-[#38bdf8] bg-[#0b172a] text-white placeholder-slate-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!pertanyaanInput.trim()}
                  className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#F1C40F]" />
                  <span>Kirim Klarifikasi</span>
                </button>
              </div>
            </form>

            {/* List of Clarifications */}
            <div className="space-y-3">
              {permohonan.klarifikasiList.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-6">Belum ada percakapan klarifikasi untuk berkas ini.</p>
              ) : (
                permohonan.klarifikasiList.map(item => (
                  <div key={item.id} className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{item.dariNama}</span>
                        <span className="bg-[#0b172a] text-[#38bdf8] px-1.5 py-0.5 rounded font-medium capitalize border border-[#1b3459]">
                          {item.dariPeran}
                        </span>
                        <span>→ Kepada: <strong className="capitalize text-white">{item.kepadaPeran}</strong></span>
                      </div>
                      <span>{item.tanggalTanya}</span>
                    </div>

                    <p className="text-slate-200 font-medium bg-[#0b172a] p-2.5 rounded border border-[#1b3459]">
                      "{item.pertanyaan}"
                    </p>

                    {item.jawaban ? (
                      <div className="mt-2 pl-4 border-l-2 border-[#38bdf8] bg-[#0d213d] p-2.5 rounded-r">
                        <div className="flex items-center justify-between text-[10px] text-[#38bdf8] font-semibold mb-1">
                          <span>Jawaban oleh {item.dijawabOleh}</span>
                          <span className="text-slate-400">{item.tanggalJawab}</span>
                        </div>
                        <p className="text-slate-200">{item.jawaban}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-amber-300 font-medium pt-1">
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
                            className="text-xs bg-[#17549c] hover:bg-[#1c64b8] text-white px-2.5 py-1 rounded font-semibold cursor-pointer border border-[#2d7ad6]"
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
            <div className="pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <History className="w-4 h-4 text-[#38bdf8]" />
                <span>Catatan Riwayat Aktivitas & Jejak Audit (Audit Trail)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Rekaman perubahan status, aktor yang bertindak, dan waktu kejadian yang tidak dapat diubah (immutable log).
              </p>
            </div>

            <div className="space-y-3">
              {permohonan.auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#081224] border border-[#1b3459] rounded-lg text-xs flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.aksi}</span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{log.rincian}</p>
                    <span className="text-[10px] text-[#38bdf8] font-semibold mt-1 inline-block">
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
