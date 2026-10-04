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
  ArrowRight,
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
  Activity,
  Mail,
  Camera,
  Eye,
  Image as ImageIcon,
  X,
  HeartPulse,
  Syringe,
  Save,
  CheckSquare,
  Square,
  Check,
  RotateCcw,
  Plus
} from 'lucide-react';
import { PengawasanPascaTatSection } from './PengawasanPascaTatSection';
import { InstrumenKriteriaPlasemenView } from './InstrumenKriteriaPlasemenView';
import { ModalInputAsesmen } from './ModalInputAsesmen';
import { BeritaAcaraModal } from './BeritaAcaraModal';
import { sendPengajuanEmailNotification } from '../services/emailService';

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
  const isMedisRole = currentUser.role === 'medis' || currentUser.role === 'MEDIS';
  const isHukumRole = currentUser.role === 'hukum' || currentUser.role === 'HUKUM';

  const initialTabByRole: DetailTab = 
    isMedisRole ? 'medis' :
    isHukumRole ? 'hukum' :
    'ringkasan';

  const [activeTab, setActiveTab] = useState<DetailTab>(initialTabByRole);
  const [showBeritaAcara, setShowBeritaAcara] = useState(false);
  const [modalAsesmenType, setModalAsesmenType] = useState<'medis' | 'hukum' | null>(null);
  const [modalJadwalType, setModalJadwalType] = useState<'medis' | 'hukum' | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Interactive Form State for Asesmen Medis
  const [isEditingMedis, setIsEditingMedis] = useState<boolean>(!permohonan.asesmenMedis || isMedisRole);
  const [medisSavedFeedback, setMedisSavedFeedback] = useState<string | null>(null);

  const [medisForm, setMedisForm] = useState({
    tekananDarah: '120/80',
    denyutNadi: '84',
    pernapasan: '18',
    suhuTubuh: '36.6',
    needleTracks: 'tidak_ada',
    kondisiIntoksikasi: 'stabil',
    komorbiditasMedis: permohonan.asesmenMedis?.komorbiditasMedis || 'Tidak ada komorbiditas fisik berat',
    skorInstrumen: permohonan.asesmenMedis?.skorInstrumen || 28,
    tingkatRisikoInstrumen: permohonan.asesmenMedis?.tingkatRisikoInstrumen || 'Tinggi (Ketergantungan)',
    diagnosisKlinisIcd: permohonan.asesmenMedis?.diagnosisKlinisIcd || 'F15.2 (Sindrom Ketergantungan Stimulansia)',
    kebutuhanRawat: permohonan.asesmenMedis?.kebutuhanRawat || 'Rawat Inap',
    durasiUsulanBulan: permohonan.asesmenMedis?.durasiUsulanBulan || 3,
    fasilitasRujukan: 'Balai Rehabilitasi BNN Tanah Merah',
    jenisZat: permohonan.asesmenMedis?.riwayatZat?.[0]?.jenisZat || 'Metamfetamina (Sabu)',
    caraPakai: permohonan.asesmenMedis?.riwayatZat?.[0]?.caraPakai || 'Dihisap (Bong)',
    frekuensi: permohonan.asesmenMedis?.riwayatZat?.[0]?.frekuensi || '4-5x Seminggu',
    lamaPemakaianBulan: permohonan.asesmenMedis?.riwayatZat?.[0]?.lamaPemakaianBulan || 12,
    terakhirPakai: permohonan.asesmenMedis?.riwayatZat?.[0]?.terakhirPakai || '2 hari lalu',
    interpretasiKlinis: permohonan.asesmenMedis?.interpretasiKlinis || 'Klien menunjukkan toleransi tinggi terhadap zat dan withdrawal syndrome jika berhenti. Perlu pemulihan medis rawat inap tertutup.',
    catatanKhusus: permohonan.asesmenMedis?.catatanKhusus || 'Siap dilanjutkan ke pembahasan Sidang Pleno TAT.'
  });

  const [urinTests, setUrinTests] = useState<Array<{ parameter: string; hasil: 'Positif' | 'Negatif' }>>(() => {
    if (permohonan.asesmenMedis?.hasilUrin && permohonan.asesmenMedis.hasilUrin.length > 0) {
      return permohonan.asesmenMedis.hasilUrin;
    }
    return [
      { parameter: 'MET (Metamfetamina / Sabu)', hasil: 'Positif' },
      { parameter: 'AMP (Amfetamina)', hasil: 'Positif' },
      { parameter: 'THC (Ganja / Kanabis)', hasil: 'Negatif' },
      { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' },
      { parameter: 'MOP (Morfin / Opiat)', hasil: 'Negatif' },
      { parameter: 'COC (Kokain)', hasil: 'Negatif' }
    ];
  });

  const toggleUrinResult = (index: number) => {
    setUrinTests(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, hasil: item.hasil === 'Positif' ? 'Negatif' : 'Positif' };
      }
      return item;
    }));
  };

  const handleSaveInlineMedis = (isFinal: boolean) => {
    let updated = { ...permohonan };
    const now = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    updated.asesmenMedis = {
      asesorNama: currentUser.name,
      skorInstrumen: Number(medisForm.skorInstrumen),
      tingkatRisikoInstrumen: medisForm.tingkatRisikoInstrumen,
      diagnosisKlinisIcd: medisForm.diagnosisKlinisIcd,
      komorbiditasMedis: medisForm.komorbiditasMedis,
      kebutuhanRawat: medisForm.kebutuhanRawat,
      durasiUsulanBulan: Number(medisForm.durasiUsulanBulan),
      riwayatZat: [
        {
          jenisZat: medisForm.jenisZat,
          caraPakai: medisForm.caraPakai,
          frekuensi: medisForm.frekuensi,
          lamaPemakaianBulan: Number(medisForm.lamaPemakaianBulan),
          terakhirPakai: medisForm.terakhirPakai
        }
      ],
      hasilUrin: urinTests,
      interpretasiKlinis: medisForm.interpretasiKlinis,
      catatanKhusus: isFinal ? (medisForm.catatanKhusus || 'Asesmen Medis telah difinalisasi dan siap dibawa ke Sidang Pleno') : (medisForm.catatanKhusus || 'Draf asesmen medis tersimpan')
    };

    if (isFinal) {
      if (updated.statusProsesUtama === 'asesmen_berlangsung' || updated.statusProsesUtama === 'hukum_selesai') {
        updated.statusProsesUtama = updated.asesmenHukum ? 'siap_pleno' : 'medis_selesai';
      }
      setIsEditingMedis(false);
    }

    updated.auditLogs = [
      ...updated.auditLogs,
      {
        id: `log-${Date.now()}`,
        timestamp: now,
        aksi: isFinal ? 'Finalisasi Asesmen Medis' : 'Simpan Draf Asesmen Medis',
        actorNama: currentUser.name,
        actorPeran: currentUser.role,
        rincian: isFinal ? `Asesmen medis diverifikasi lengkap dengan diagnosis ${medisForm.diagnosisKlinisIcd} dan rekomendasi ${medisForm.kebutuhanRawat}.` : `Draf asesmen medis diperbarui oleh ${currentUser.name}.`
      }
    ];

    onUpdatePermohonan(updated);
    setMedisSavedFeedback(isFinal ? 'Asesmen Medis Berhasil Difinalisasi & Disimpan!' : 'Draf Asesmen Medis Berhasil Disimpan!');
    setTimeout(() => setMedisSavedFeedback(null), 4000);
  };

  const handleSaveAsesmen = (data: any, isFinal: boolean) => {
    if (!modalAsesmenType) return;

    let updated = { ...permohonan };
    const now = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    if (modalAsesmenType === 'medis') {
      handleSaveInlineMedis(isFinal);
    } else {
      updated.asesmenHukum = {
        asesorNama: currentUser.name,
        analisisPeran: 'Pecandu dan Indikasi Pengedar Skala Kecil',
        analisisBarangBukti: 'Total BB 0.5g (Di bawah batas SEMA), namun ada indikasi penjualan dari chat HP',
        rekomendasiHukum: 'Proses hukum dapat dilanjutkan namun hak rehabilitasi tetap diberikan',
        catatanKhusus: isFinal ? 'Siap dibawa ke Pleno' : 'Draf hukum tersimpan'
      };
      
      if (isFinal) {
        if (updated.statusProsesUtama === 'asesmen_berlangsung' || updated.statusProsesUtama === 'medis_selesai') {
          updated.statusProsesUtama = updated.asesmenMedis ? 'siap_pleno' : 'hukum_selesai';
        }
      }

      updated.auditLogs = [
        ...updated.auditLogs,
        {
          id: `log-${Date.now()}`,
          timestamp: now,
          aksi: isFinal ? `Finalisasi Asesmen Hukum` : `Simpan Draf Asesmen Hukum`,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          rincian: isFinal ? `Data telah diverifikasi dan disiapkan untuk Sidang Pleno.` : `Draft asesmen disimpan ke sistem.`
        }
      ];

      onUpdatePermohonan(updated);
    }

    setModalAsesmenType(null);
  };

  // Role-specific available tabs
  const availableTabs = useMemo(() => {
    const role = currentUser.role;
    switch (role) {
      case 'pengaju': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Status Perkara', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Berkas (LP/BAP)', icon: <FileText className="w-3.5 h-3.5" /> },
        ];
        if (permohonan.rekomendasiResmi && ((permohonan.applicationStatus === 'RESULTS_ISSUED' || permohonan.statusProsesUtama === 'rekomendasi_terbit') || (permohonan.followupStatus === 'VERIFIED_IMPLEMENTED' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut'))) {
          tabs.push({ id: 'dokumen', label: 'Rekomendasi Terbit', icon: <FileSignature className="w-3.5 h-3.5" /> });
        }
        return tabs;
      }
      case 'admin':
      case 'ADMIN':
      case 'sekretariat':
      case 'SEKRETARIAT': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Ringkasan', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'jadwal', label: 'Penjadwalan', icon: <Calendar className="w-3.5 h-3.5" /> }
        ];
        return tabs;
      }
      case 'medis':
        return [
          { id: 'ringkasan', label: 'Identitas Klien', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'medis', label: 'Asesmen Medis', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          { id: 'pengawasan', label: 'Instrumen Pemulihan', icon: <Activity className="w-3.5 h-3.5" /> }
        ];
      case 'hukum':
        return [
          { id: 'ringkasan', label: 'Identitas Klien', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'administrasi', label: 'Baca BAP/LP', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'hukum', label: 'Telaah Hukum', icon: <Scale className="w-3.5 h-3.5" /> }
        ];
      case 'koordinator': {
        const tabs: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
          { id: 'ringkasan', label: 'Kendali Kasus', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'pleno', label: 'Sidang Pleno', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Pengesahan TTE', icon: <FileSignature className="w-3.5 h-3.5" /> },
          { id: 'riwayat', label: 'Audit Trail', icon: <History className="w-3.5 h-3.5" /> }
        ];
        return tabs;
      }
      case 'pimpinan': {
        return [
          { id: 'ringkasan', label: 'Ringkasan Kasus', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'dokumen', label: 'Pengesahan TTE', icon: <FileSignature className="w-3.5 h-3.5" /> },
        ];
      }
      case 'rehabilitasi': {
        return [
          { id: 'ringkasan', label: 'Klien Rujukan', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'pengawasan', label: 'Log Pengawasan', icon: <Activity className="w-3.5 h-3.5" /> }
        ];
      }

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
    if (!permohonan.rekomendasiResmi || (permohonan.applicationStatus !== 'AWAITING_SIGNED_OUTPUTS' && permohonan.statusProsesUtama !== 'pengesahan_rekomendasi')) return false;
    return permohonan.rekomendasiResmi.daftarPengesah.some(signer => {
      if (signer.status === 'disahkan') return false;
      if (currentUser.role === 'koordinator' && signer.jabatan.includes('Ketua')) return true;
      if ((currentUser.role === 'medis' || currentUser.role === 'MEDIS') && signer.jabatan.includes('Medis')) return true;
      if ((currentUser.role === 'hukum' || currentUser.role === 'HUKUM') && signer.jabatan.includes('Hukum')) return true;
      if ((currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU') && signer.jabatan.includes('Penyidik')) return true;
      return false;
    });
  }, [permohonan, currentUser]);

  // Local state for inline clarification message
  const [pertanyaanInput, setPertanyaanInput] = useState('');
  const [tujuanPeran, setTujuanPeran] = useState<UserRole>('sekretariat');

  // Local state for document re-upload / correction by Pengaju
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [correctionNote, setCorrectionNote] = useState('');

  // Email Notification State
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailBanner, setEmailBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSendEmailNotification = async () => {
    setIsSendingEmail(true);
    setEmailBanner(null);
    try {
      const res = await sendPengajuanEmailNotification(permohonan);
      if (res.success) {
        setEmailBanner({
          type: 'success',
          message: `Notifikasi email permohonan berhasil dikirim ke etatsiappulih@gmail.com! (Resend ID: ${res.id})`
        });
      } else {
        setEmailBanner({
          type: 'error',
          message: `Gagal mengirim email: ${res.error}`
        });
      }
    } catch (err: any) {
      setEmailBanner({
        type: 'error',
        message: `Error: ${err?.message || 'Terjadi kesalahan saat mengirim email'}`
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

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
      followupStatus: action === 'admisi' ? 'VERIFIED_IMPLEMENTED' : permohonan.followupStatus, statusProsesUtama: action === 'admisi' ? 'selesai_tindak_lanjut' : permohonan.statusProsesUtama,
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
      applicationStatus: isAllValid ? 'ADMIN_REVIEW' : permohonan.applicationStatus, statusProsesUtama: isAllValid ? 'verifikasi_berkas' : permohonan.statusProsesUtama,
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
      applicationStatus: hasErrors ? 'NEEDS_CORRECTION' : allApproved ? 'SCHEDULED' : 'ADMIN_REVIEW', statusProsesUtama: hasErrors ? 'perlu_perbaikan' : allApproved ? 'penugasan_jadwal' : 'verifikasi_berkas',
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
        ((currentUser.role === 'medis' || currentUser.role === 'MEDIS') && signer.jabatan.includes('Medis')) ||
        ((currentUser.role === 'hukum' || currentUser.role === 'HUKUM') && signer.jabatan.includes('Hukum')) ||
        ((currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU') && signer.jabatan.includes('Penyidik'))
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
      applicationStatus: isAllSigned ? 'RESULTS_ISSUED' : permohonan.applicationStatus, statusProsesUtama: isAllSigned ? 'rekomendasi_terbit' : permohonan.statusProsesUtama,
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
      {showBeritaAcara && (
        <BeritaAcaraModal
          permohonan={permohonan}
          onClose={() => setShowBeritaAcara(false)}
        />
      )}

      {/* Compact Status & Action Overview */}

      {/* Simple Header Bar: Nomor Permohonan & Tanggal */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center space-x-2 bg-[#081224] border border-[#1b3459] px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 font-medium">No. Permohonan:</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-[#d4af37]">
              {permohonan.nomorPermohonan}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-[#081224] border border-[#1b3459] px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Tanggal:</span>
            <span className="font-semibold text-slate-200">
              {permohonan.tanggalPengajuan}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {(permohonan.applicationStatus === 'NEEDS_CORRECTION' || permohonan.statusProsesUtama === 'perlu_perbaikan') && (currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU') && (
            <button
              onClick={() => setActiveTab('administrasi')}
              className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-[#234475] w-full sm:w-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Perbaikan</span>
            </button>
          )}

          {(permohonan.applicationStatus === 'SUBMITTED' || permohonan.applicationStatus === 'ADMIN_REVIEW' || permohonan.statusProsesUtama === 'verifikasi_berkas') && (currentUser.role === 'sekretariat' || currentUser.role === 'ADMIN') && (
            <>
              <button
                onClick={() => setActiveTab('administrasi')}
                className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-[#234475] w-full sm:w-auto"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verifikasi Dokumen</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin menyetujui seluruh berkas dan melanjutkan permohonan ini ke tahap Asesmen (Hukum/Medis)?')) {
                    if (onUpdatePermohonan) {
                      onUpdatePermohonan({
                        ...permohonan,
                        statusProsesUtama: 'asesmen_berlangsung'
                      });
                    }
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-emerald-500 w-full sm:w-auto"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Setujui Semua Berkas</span>
              </button>
            </>
          )}

          {(permohonan.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' || permohonan.statusProsesUtama === 'pengesahan_rekomendasi') && userCanSignNow && (
            <button
              onClick={handleDigitalSign}
              className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-[#234475] w-full sm:w-auto"
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>Tandatangani Rekomendasi</span>
            </button>
          )}

          {currentUser.role === 'rehabilitasi' && permohonan.tindakLanjut && (
            <button
              onClick={() => setActiveTab('tindak_lanjut')}
              className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-[#234475] w-full sm:w-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Konfirmasi Rujukan</span>
            </button>
          )}

          {(currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU') && permohonan.rekomendasiResmi && ((permohonan.applicationStatus === 'RESULTS_ISSUED' || permohonan.statusProsesUtama === 'rekomendasi_terbit') || (permohonan.followupStatus === 'VERIFIED_IMPLEMENTED' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut')) && (
            <button
              onClick={() => setActiveTab('dokumen')}
              className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-[#234475] w-full sm:w-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Rekomendasi Resmi</span>
            </button>
          )}
        </div>

        {emailBanner && (
          <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center justify-between ${
            emailBanner.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
          }`}>
            <div className="flex items-center space-x-2">
              {emailBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{emailBanner.message}</span>
            </div>
            <button
              onClick={() => setEmailBanner(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation - Pill & Button Style */}
      <div className="bg-[#0b172a] p-2 rounded-2xl border border-[#1b3459] shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {availableTabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] text-white border border-[#2d7ad6]/70 shadow-lg shadow-[#144782]/40 scale-[1.01]'
                    : 'bg-[#081224] text-slate-300 hover:text-white hover:bg-[#142642] border border-[#1b3459] hover:border-[#234475]'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold ${
                  isActive ? 'bg-white/20 text-[#d4af37]' : 'bg-[#142642] text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                <span className={isActive ? 'text-[#d4af37]' : 'text-slate-400'}>{tab.icon}</span>
                <span className="tracking-wide">{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="space-y-6 min-h-[420px] pt-3">
        {/* TAB 1: RINGKASAN & IDENTITAS (Separation of Person, Case, and Application) */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom 1: Terperiksa (Data Orang) */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b3459] mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-sm font-bold text-white">Data Terperiksa</h3>
                  </div>
                  {permohonan.terperiksa.isNikVerified ? (
                    <span className="text-[10px] bg-[#0d1f38] text-slate-200 font-bold px-2 py-0.5 rounded border border-[#1b3459]">
                      NIK Terverifikasi
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#0d1f38] text-[#D4AF37] font-bold px-2 py-0.5 rounded border border-[#1b3459]">
                      NIK Perlu Verifikasi
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Nama Lengkap</span>
                    <span className="sm:col-span-2 font-semibold text-white break-words">{permohonan.terperiksa.namaLengkap}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Nama Panggilan/Alias</span>
                    <span className="sm:col-span-2 text-slate-300 break-words">{permohonan.terperiksa.alias || '-'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">NIK / Identitas</span>
                    <span className="sm:col-span-2 font-mono text-[#d4af37] break-all">{permohonan.terperiksa.nik || 'Tidak ada (Dibuatkan ID Khusus)'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Tempat, Tgl Lahir</span>
                    <span className="sm:col-span-2 text-slate-300 break-words">{permohonan.terperiksa.tempatLahir}, {permohonan.terperiksa.tanggalLahir} ({permohonan.terperiksa.usia} Tahun)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Jenis Kelamin</span>
                    <span className="sm:col-span-2 text-slate-300">{permohonan.terperiksa.jenisKelamin}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Pekerjaan</span>
                    <span className="sm:col-span-2 text-slate-300 break-words">{permohonan.terperiksa.pekerjaan}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Alamat KTP</span>
                    <span className="sm:col-span-2 text-slate-300 break-words leading-relaxed">{permohonan.terperiksa.alamatKtp}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Wali / Pendamping</span>
                    <span className="sm:col-span-2 text-slate-300 break-words">{permohonan.terperiksa.namaWaliPendamping} ({permohonan.terperiksa.kontakWali})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1">
                    <span className="text-slate-400 font-medium flex items-center space-x-1">
                      <History className="w-3.5 h-3.5 text-sky-400" />
                      <span>Riwayat TAT/Perkara</span>
                    </span>
                    <span className="sm:col-span-2 text-slate-300">
                      {permohonan.asesmenHukum?.riwayatResidivisme?.pernahDitangkap ? (
                        <div className="text-rose-400 font-medium text-xs">
                          Pernah Terkait Perkara Sebelumnya
                          <p className="text-[10px] text-slate-400 mt-0.5 font-normal">
                            {permohonan.asesmenHukum.riwayatResidivisme.keteranganPerkaraLalu || "Terdapat catatan residivisme/TAT sebelumnya."}
                          </p>
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-medium text-xs flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Belum Pernah (Pertama Kali)</span>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Perkara Hukum Terkait (Data Perkara) */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="text-sm font-bold text-white">Data Perkara</h3>
                  </div>
                  <span className="text-[10px] bg-[#142642] text-slate-200 font-semibold px-2 py-0.5 rounded border border-[#234475]">
                    Penyidikan Aktif
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Nomor LP</span>
                    <span className="sm:col-span-2 font-mono font-bold text-white break-all leading-snug">{permohonan.perkara.nomorLaporanPolisi}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Tanggal LP</span>
                    <span className="sm:col-span-2 text-slate-300">{permohonan.perkara.tanggalLp}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Instansi Penyidik</span>
                    <span className="sm:col-span-2 font-semibold text-white break-words">{permohonan.perkara.instansiPenyidik}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Nama Penyidik</span>
                    <span className="sm:col-span-2 text-slate-300 break-words">{permohonan.perkara.namaPenyidik} ({permohonan.perkara.nomorHpPenyidik})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Pasal Sangkaan</span>
                    <div className="sm:col-span-2 font-bold text-[#d4af37] bg-[#081224] p-2 rounded-lg border border-[#1b3459] font-mono break-words leading-relaxed">
                      {permohonan.perkara.pasalDipersangkakan}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">Waktu Penangkapan</span>
                    <span className="sm:col-span-2 text-slate-300">{permohonan.perkara.tanggalWaktuPenangkapan}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1 border-b border-[#1b3459]/40">
                    <span className="text-slate-400 font-medium">TKP</span>
                    <span className="sm:col-span-2 text-slate-300 break-words leading-relaxed">{permohonan.perkara.tempatKejadianPerkara}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 py-1">
                    <span className="text-slate-400 font-medium">Kronologi Singkat</span>
                    <span className="sm:col-span-2 text-slate-300 italic break-words leading-relaxed">{permohonan.perkara.kronologiSingkat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barang Bukti & Uji Lab Sub-Section */}
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#d4af37]" />
                  <span>Barang Bukti &amp; Uji Laboratorium Puslabfor</span>
                </h3>
                <span className="text-[11px] text-slate-400">Total {permohonan.perkara.barangBuktiList.length} Barang Bukti</span>
              </div>
              <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
                <table className="w-full text-left text-xs border border-[#1b3459] rounded-lg overflow-hidden min-w-[760px]">
                  <thead className="bg-[#081224] text-slate-300 uppercase text-[10px] font-semibold border-b border-[#1b3459]">
                    <tr>
                      <th className="p-2.5 whitespace-nowrap">Jenis Zat / Narkotika</th>
                      <th className="p-2.5 whitespace-nowrap">Berat Bersih (Netto)</th>
                      <th className="p-2.5 whitespace-nowrap">Status Uji Lab</th>
                      <th className="p-2.5 whitespace-nowrap">Nomor Surat Lab</th>
                      <th className="p-2.5 whitespace-nowrap">Evaluasi SEMA 04/2010</th>
                      <th className="p-2.5 whitespace-nowrap text-center">Lihat Bukti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b3459]">
                    {permohonan.perkara.barangBuktiList.map(bb => {
                      const fotoBb = bb.fotoBarangBuktiUrl || (
                        bb.jenisZat.toLowerCase().includes('ganja')
                          ? 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?w=600&auto=format&fit=crop&q=80'
                          : bb.jenisZat.toLowerCase().includes('pipet') || bb.jenisZat.toLowerCase().includes('bong') || bb.jenisZat.toLowerCase().includes('konsumsi')
                          ? 'https://images.unsplash.com/photo-1583912267550-d44d95b54637?w=600&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
                      );
                      const fotoLab = bb.fotoUjiLabUrl || 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop&q=80';

                      return (
                        <tr key={bb.id} className="hover:bg-[#0f213a] transition-colors">
                          {/* Jenis Zat */}
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                              <span>{bb.jenisZat}</span>
                            </div>
                          </td>

                          {/* Berat Bersih */}
                          <td className="p-2.5 font-semibold text-[#d4af37] whitespace-nowrap">
                            {bb.beratBersihGram} Gram
                            {bb.beratKotorGram ? <span className="text-slate-400 font-normal text-[10px] block">Kotor: {bb.beratKotorGram}g</span> : null}
                          </td>

                          {/* Status Lab */}
                          <td className="p-2.5 whitespace-nowrap">
                            {bb.statusUjiLab === 'positif' ? (
                              <span className="bg-emerald-950/60 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-700">
                                Positif Lab
                              </span>
                            ) : bb.statusUjiLab === 'proses_lab' ? (
                              <span className="bg-[#142642] text-[#d4af37] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#d4af37]/30">
                                Sedang Diuji Lab
                              </span>
                            ) : (
                              <span className="bg-[#142642] text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-[#234475]">
                                Belum Uji
                              </span>
                            )}
                          </td>

                          {/* Nomor Surat Lab */}
                          <td className="p-2.5 whitespace-nowrap">
                            <span className="font-mono text-slate-200 text-xs block">
                              {bb.nomorSuratLab || 'Menunggu dari Puslabfor'}
                            </span>
                            {bb.tanggalSuratLab && (
                              <span className="text-[10px] text-slate-400 block">Tgl: {bb.tanggalSuratLab}</span>
                            )}
                          </td>

                          {/* Evaluasi */}
                          <td className="p-2.5 text-slate-300">{bb.keterangan || '-'}</td>

                          {/* KOLOM BARU: LIHAT BUKTI */}
                          <td className="p-2.5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              {/* Tombol Lihat Foto BB */}
                              <button
                                type="button"
                                onClick={() => setPreviewImage({ url: fotoBb, title: `Foto Fisik Barang Bukti: ${bb.jenisZat}` })}
                                className="px-2.5 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 hover:text-white rounded-lg border border-[#234475] flex items-center space-x-1 text-[11px] font-semibold transition-all cursor-pointer shadow-sm hover:border-[#d4af37]"
                                title="Klik untuk melihat foto fisik barang bukti"
                              >
                                <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
                                <span>Foto BB</span>
                              </button>

                              {/* Tombol Lihat Surat Hasil Lab */}
                              {bb.statusUjiLab !== 'belum_uji' && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewImage({ url: fotoLab, title: `Hasil Uji Lab: ${bb.nomorSuratLab || bb.jenisZat}` })}
                                  className="px-2.5 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 hover:text-white rounded-lg border border-teal-800/80 flex items-center space-x-1 text-[11px] font-semibold transition-all cursor-pointer shadow-sm hover:border-teal-500"
                                  title="Klik untuk melihat scan surat hasil uji laboratorium"
                                >
                                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Hasil Lab</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Navigasi ke Tab Berikutnya */}
            {(currentUser.role === 'sekretariat' || currentUser.role === 'admin' || currentUser.role === 'ADMIN' || currentUser.role === 'SEKRETARIAT') && (
              <div className="mt-6 pt-4 border-t border-[#1b3459] flex justify-end">
                <button
                  onClick={() => setActiveTab('administrasi')}
                  className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-[#133863]/40 transition-all cursor-pointer border border-[#235594]"
                >
                  <span>Lanjut ke Verifikasi Berkas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADMINISTRASI & VERIFIKASI BERKAS */}
        {activeTab === 'administrasi' && (() => {
          const validDocsCount = permohonan.dokumenList.filter(d => d.statusVerifikasi === 'sesuai').length;
          const invalidDocsCount = permohonan.dokumenList.filter(d => d.statusVerifikasi === 'perlu_perbaikan').length;
          const totalDocsCount = permohonan.dokumenList.length;
          const percentComplete = totalDocsCount > 0 ? Math.round((validDocsCount / totalDocsCount) * 100) : 0;

          return (
            <div className="space-y-4">
              {/* Completeness Summary Banner */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white uppercase font-['Cinzel',serif]">Status Kelengkapan Berkas Formil</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b172a] border border-[#1b3459] text-slate-300">
                      SOP BAB 09
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {validDocsCount} dari {totalDocsCount} berkas formil persyaratan dinyatakan valid oleh Sekretariat TAT BNNP Kaltim.
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="font-mono text-xl font-extrabold text-[#D4AF37] block">{percentComplete}%</span>
                    <span className="text-[10px] text-slate-400">
                      {validDocsCount} Sesuai &bull; {invalidDocsCount} Koreksi
                    </span>
                  </div>
                  <div className="w-28 bg-[#0b172a] h-2.5 rounded-full overflow-hidden border border-[#1b3459]">
                    <div
                      className={`h-full transition-all duration-300 ${percentComplete === 100 ? 'bg-emerald-400' : percentComplete >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                      style={{ width: `${percentComplete}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
                <h3 className="text-sm font-bold text-white">Daftar Dokumen Persyaratan Resmi</h3>
                <span className="text-xs text-slate-400">Role Anda: <strong className="text-[#D4AF37] capitalize">{currentUser.role}</strong></span>
              </div>

              <div className="space-y-3">
              {permohonan.dokumenList.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={`border rounded-xl p-4 transition-all ${
                    doc.statusVerifikasi === 'perlu_perbaikan'
                      ? 'border-[#1b3459] bg-amber-950/20'
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
                          <span 
                            className="font-mono text-[#D4AF37] underline cursor-pointer hover:text-amber-300 transition-colors"
                            onClick={() => alert(`Membuka dokumen: ${doc.fileName}`)}
                          >
                            {doc.fileName}
                          </span>
                          <span className="text-slate-500">• {doc.fileSize}</span>
                          <span className="text-slate-500">• Diunggah: {doc.uploadedAt}</span>
                          <button
                            onClick={() => alert(`Preview dokumen: ${doc.fileName}`)}
                            className="ml-2 bg-[#1b3459] hover:bg-[#234475] text-white px-2 py-1 rounded flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
                            title="Lihat Dokumen"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="font-medium text-[10px]">Lihat Dokumen</span>
                          </button>
                        </div>
                      )}

                      {/* Targeted Correction Note from Secretariat */}
                      {doc.catatanKoreksi && (
                        <div className="mt-2 p-2.5 bg-[#081224] border border-[#1b3459] rounded-lg text-xs text-amber-200">
                          <div className="font-semibold flex items-center space-x-1.5 text-[#D4AF37] mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Catatan Koreksi dari Sekretariat TAT:</span>
                          </div>
                          <p>{doc.catatanKoreksi}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex flex-col sm:flex-row items-end md:items-center space-y-2 sm:space-y-0 sm:space-x-2 shrink-0">
                      {doc.statusVerifikasi === 'sesuai' ? (
                        <span className="bg-[#0d1f38] text-slate-200 text-xs font-semibold px-3 py-1 rounded-lg border border-[#1b3459] flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Sesuai</span>
                        </span>
                      ) : doc.statusVerifikasi === 'perlu_perbaikan' ? (
                        <span className="bg-[#0d1f38] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-lg border border-[#1b3459] flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Perlu Perbaikan</span>
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 text-xs font-medium px-3 py-1 rounded-lg border border-slate-700">
                          Belum Diperiksa
                        </span>
                      )}

                      {/* Action for Pengaju: Fix Document */}
                      {(currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU') && doc.statusVerifikasi === 'perlu_perbaikan' && (
                        <button
                          onClick={() => handleFixDocument(doc.id)}
                          className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-amber-500 cursor-pointer transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah File Perbaikan</span>
                        </button>
                      )}

                      {/* Action for Sekretariat: Verify buttons */}
                      {(currentUser.role === 'sekretariat' || currentUser.role === 'ADMIN' || currentUser.role === 'admin' || currentUser.role === 'SEKRETARIAT') && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleVerifyDocumentItem(doc.id, 'sesuai')}
                            className="bg-[#133863] hover:bg-[#1a4a82] text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => {
                              const note = prompt('Tuliskan catatan koreksi spesifik untuk dokumen ini:');
                              if (note) handleVerifyDocumentItem(doc.id, 'perlu_perbaikan', note);
                            }}
                            className="bg-[#133863] hover:bg-[#1a4a82] text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            Minta Koreksi
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* FINALIZATION ACTION FOR ADMIN */}
              {(currentUser.role === 'sekretariat' || currentUser.role === 'ADMIN' || currentUser.role === 'admin' || currentUser.role === 'SEKRETARIAT') && percentComplete === 100 && (
                <div className="mt-4 pt-4 border-t border-[#1b3459] flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <button
                    onClick={() => {
                       alert('Berkas formil dinyatakan lengkap dan telah disetujui. Meneruskan ke tahap Penjadwalan Asesmen Medis & Hukum...');
                       onUpdatePermohonan(permohonan.id, {
                         applicationStatus: 'VERIFIED',
                         statusProsesUtama: 'penugasan_jadwal'
                       });
                       setActiveTab('jadwal');
                    }}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer border border-emerald-400/50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validasi Selesai & Lanjut ke Penjadwalan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Tim Asesor Medis Ditugaskan</span>
                  <p className="text-sm font-bold text-white mt-1">{permohonan.timAsesmen?.asesorMedisNama || 'Belum Ditetapkan'}</p>
                  <div className="mt-3 text-xs space-y-1 text-slate-300">
                    <p>Jadwal Pemeriksaan: <strong className="text-white">{permohonan.timAsesmen?.jadwalPemeriksaanMedis || 'Menunggu penetapan'}</strong></p>
                    <p>Lokasi: <strong className="text-white">{permohonan.timAsesmen?.lokasiPemeriksaan || 'Klinik / Ruang TAT'}</strong></p>
                  </div>
                </div>
                
                {(currentUser.role === 'sekretariat' || currentUser.role === 'admin' || currentUser.role === 'ADMIN' || currentUser.role === 'SEKRETARIAT') && (
                  <button 
                    onClick={() => setModalJadwalType('medis')}
                    className="mt-4 w-full py-1.5 bg-[#133863] hover:bg-[#1a4a82] text-xs font-semibold text-white rounded-lg border border-[#234b7d] transition-colors flex justify-center items-center space-x-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tetapkan Lokasi & Jadwal Medis</span>
                  </button>
                )}
              </div>

              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Tim Asesor Hukum Ditugaskan</span>
                  <p className="text-sm font-bold text-white mt-1">{permohonan.timAsesmen?.asesorHukumNama || 'Belum Ditetapkan'}</p>
                  <div className="mt-3 text-xs space-y-1 text-slate-300">
                    <p>Jadwal Telaah Perkara: <strong className="text-white">{permohonan.timAsesmen?.jadwalPemeriksaanHukum || 'Menunggu penetapan'}</strong></p>
                    <p>Instansi: <strong className="text-white">Kejaksaan Negeri / Ahli Hukum BNN</strong></p>
                  </div>
                </div>

                {(currentUser.role === 'sekretariat' || currentUser.role === 'admin' || currentUser.role === 'ADMIN' || currentUser.role === 'SEKRETARIAT') && (
                  <button 
                    onClick={() => setModalJadwalType('hukum')}
                    className="mt-4 w-full py-1.5 bg-[#133863] hover:bg-[#1a4a82] text-xs font-semibold text-white rounded-lg border border-[#234b7d] transition-colors flex justify-center items-center space-x-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tetapkan Penugasan Hukum</span>
                  </button>
                )}
              </div>
            </div>

            <div className="border border-[#234b7d] bg-[#0d213d] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#D4AF37]">Agenda Sidang Pleno Bersama</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {permohonan.timAsesmen?.jadwalPleno || 'Belum dijadwalkan (Menunggu kedua asesmen selesai)'}
                  </p>
                </div>
                <span className="text-xs bg-[#17375e] text-[#D4AF37] px-2.5 py-1 rounded-full font-semibold border border-[#234b7d]">
                  {permohonan.sidangPleno?.statusPleno ? formatStatus(permohonan.sidangPleno.statusPleno) : 'Menunggu Kesiapan'}
                </span>
              </div>
            </div>

            {/* Navigasi ke Tab Berikutnya (Kirim ke Medis) */}
            {(currentUser.role === 'sekretariat' || currentUser.role === 'admin' || currentUser.role === 'ADMIN' || currentUser.role === 'SEKRETARIAT') && (
              <div className="mt-6 pt-4 border-t border-[#1b3459] flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={() => {
                    alert('Penugasan berhasil dikirim! Asesor Medis & Hukum terkait akan menerima notifikasi untuk segera melakukan pemeriksaan.');
                    onUpdatePermohonan(permohonan.id, {
                      applicationStatus: 'SCHEDULED',
                      statusProsesUtama: 'asesmen_berjalan'
                    });
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer border border-emerald-400/50"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Penugasan ke Bagian Medis &amp; Hukum</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASESMEN MEDIS & PSIKOLOGIS TERSTRUKTUR (INTERAKTIF) */}
        {activeTab === 'medis' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1b3459] gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hasil Pemeriksaan Medis &amp; Psikologis Terstruktur</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fakta klinis, pemeriksaan laboratorium urine 6 parameter, instrumen ASSIST/ASI, dan usulan intervensi rehabilitasi.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {permohonan.asesmenMedis && (
                  <span className="text-xs bg-[#0d1f38] text-slate-200 font-semibold px-2.5 py-1 rounded-lg border border-[#1b3459]">
                    Asesor: {permohonan.asesmenMedis.asesorNama}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingMedis(!isEditingMedis)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#142642] hover:bg-[#1b3459] text-white border border-[#234475] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isEditingMedis ? 'Tutup Edit Form' : 'Edit / Input Data Medis'}</span>
                </button>
              </div>
            </div>

            {/* Saved Notification */}
            {medisSavedFeedback && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{medisSavedFeedback}</span>
              </div>
            )}

            {/* MODE 1: INTERACTIVE EDIT / INPUT FORM */}
            {isEditingMedis ? (
              <div className="space-y-6 bg-[#081224] p-4 sm:p-6 rounded-2xl border border-[#1b3459]">
                {/* Section 1: Pemeriksaan Fisik & Tanda Vital */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]/60">
                    <HeartPulse className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">1. Pemeriksaan Fisik &amp; Tanda Vital</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Tekanan Darah (mmHg)</label>
                      <input
                        type="text"
                        value={medisForm.tekananDarah}
                        onChange={(e) => setMedisForm({ ...medisForm, tekananDarah: e.target.value })}
                        placeholder="120/80"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Denyut Nadi (x/mnt)</label>
                      <input
                        type="text"
                        value={medisForm.denyutNadi}
                        onChange={(e) => setMedisForm({ ...medisForm, denyutNadi: e.target.value })}
                        placeholder="84"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Pernapasan (x/mnt)</label>
                      <input
                        type="text"
                        value={medisForm.pernapasan}
                        onChange={(e) => setMedisForm({ ...medisForm, pernapasan: e.target.value })}
                        placeholder="18"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Suhu Tubuh (°C)</label>
                      <input
                        type="text"
                        value={medisForm.suhuTubuh}
                        onChange={(e) => setMedisForm({ ...medisForm, suhuTubuh: e.target.value })}
                        placeholder="36.6"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Tanda Bekas Suntikan (Needle Track)</label>
                      <select
                        value={medisForm.needleTracks}
                        onChange={(e) => setMedisForm({ ...medisForm, needleTracks: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="tidak_ada">Tidak Ditemukan Bekas Suntikan</option>
                        <option value="ada_lama">Ada (Bekas Lama / Menghitam)</option>
                        <option value="ada_baru">Ada (Luka Baru / Merah / Aktif)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Status Gejala Putus Zat / Intoksikasi</label>
                      <select
                        value={medisForm.kondisiIntoksikasi}
                        onChange={(e) => setMedisForm({ ...medisForm, kondisiIntoksikasi: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="stabil">Normal / Stabil (Tidak Mengalami Sakau)</option>
                        <option value="intoksikasi">Terlihat Intoksikasi Ringan / Pengaruh Zat</option>
                        <option value="putus_zat">Mengalami Gejala Putus Zat (Sakau / Tremor / Gelisah)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Komorbiditas Medis / Penyakit Penyerta</label>
                      <input
                        type="text"
                        value={medisForm.komorbiditasMedis}
                        onChange={(e) => setMedisForm({ ...medisForm, komorbiditasMedis: e.target.value })}
                        placeholder="Contoh: Tidak ada penyerta berat / Riwayat Asma / Hepatitis"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Toksikologi Urin Forensik (Checklist & Toggles Interaktif) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]/60">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-[#D4AF37]" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">2. Uji Toksikologi Urin Laboratorium (SKHPU)</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 italic">Klik tombol status untuk mengubah Positif / Negatif</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {urinTests.map((item, idx) => {
                      const isPos = item.hasil === 'Positif';
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleUrinResult(idx)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isPos
                              ? 'bg-rose-950/40 border-rose-600/60 hover:bg-rose-950/60'
                              : 'bg-[#050e1c] border-[#1b3459] hover:bg-[#0b172a]'
                          }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={isPos}
                              onChange={() => toggleUrinResult(idx)}
                              className="w-4 h-4 accent-rose-600 cursor-pointer rounded"
                            />
                            <span className="text-xs font-semibold text-white truncate">{item.parameter}</span>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ml-2 shrink-0 ${
                            isPos ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.hasil}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Wawancara Riwayat Penggunaan Zat */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]/60">
                    <Syringe className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">3. Wawancara Riwayat Penggunaan Zat</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Jenis Zat Utama</label>
                      <select
                        value={medisForm.jenisZat}
                        onChange={(e) => setMedisForm({ ...medisForm, jenisZat: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Metamfetamina (Sabu)">Metamfetamina (Sabu)</option>
                        <option value="Ganja / Kanabis">Ganja / Kanabis</option>
                        <option value="MDMA / Ekstasi">MDMA / Ekstasi</option>
                        <option value="Heroin / Putaw">Heroin / Putaw</option>
                        <option value="Tembakau Sintetis (Gorila)">Tembakau Sintetis (Gorila)</option>
                        <option value="Obat Keras (Tramadol / Trihexyphenidyl)">Obat Keras (Tramadol / Trihex)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Cara Pemakaian</label>
                      <select
                        value={medisForm.caraPakai}
                        onChange={(e) => setMedisForm({ ...medisForm, caraPakai: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Dihisap (Bong / Rokok)">Dihisap (Bong / Rokok)</option>
                        <option value="Ditelan / Minum (Oral)">Ditelan / Minum (Oral)</option>
                        <option value="Disuntikkan (Intravena / IV)">Disuntikkan (Intravena / IV)</option>
                        <option value="Dihirup (Snorting)">Dihirup (Snorting)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Frekuensi Penggunaan</label>
                      <select
                        value={medisForm.frekuensi}
                        onChange={(e) => setMedisForm({ ...medisForm, frekuensi: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Setiap Hari (Rutin / Berat)">Setiap Hari (Rutin / Berat)</option>
                        <option value="4-5x Seminggu">4-5x Seminggu</option>
                        <option value="1-3x Sebulan">1-3x Sebulan</option>
                        <option value="Sesekali / Rekreasi">Sesekali / Rekreasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Lama Pemakaian (Bulan)</label>
                      <input
                        type="number"
                        value={medisForm.lamaPemakaianBulan}
                        onChange={(e) => setMedisForm({ ...medisForm, lamaPemakaianBulan: Number(e.target.value) })}
                        placeholder="12"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Terakhir Pemakaian Zat</label>
                      <input
                        type="text"
                        value={medisForm.terakhirPakai}
                        onChange={(e) => setMedisForm({ ...medisForm, terakhirPakai: e.target.value })}
                        placeholder="Contoh: 2 hari sebelum penangkapan"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Skoring ASSIST & Diagnosis ICD-10 */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]/60">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">4. Skoring WHO ASSIST &amp; Diagnosis Klinis ICD-10</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Skor WHO ASSIST (Poin)</label>
                      <input
                        type="number"
                        value={medisForm.skorInstrumen}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const risk = val >= 27 ? 'Tinggi (Ketergantungan)' : val >= 11 ? 'Sedang' : 'Rendah';
                          setMedisForm({ ...medisForm, skorInstrumen: val, tingkatRisikoInstrumen: risk });
                        }}
                        placeholder="28"
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Tingkat Risiko Adiksi</label>
                      <select
                        value={medisForm.tingkatRisikoInstrumen}
                        onChange={(e) => setMedisForm({ ...medisForm, tingkatRisikoInstrumen: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer font-bold text-emerald-400"
                      >
                        <option value="Rendah">Rendah (Skor 0 - 10)</option>
                        <option value="Sedang">Sedang (Skor 11 - 26)</option>
                        <option value="Tinggi (Ketergantungan)">Tinggi (Ketergantungan / Skor 27+)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Diagnosis ICD-10</label>
                      <select
                        value={medisForm.diagnosisKlinisIcd}
                        onChange={(e) => setMedisForm({ ...medisForm, diagnosisKlinisIcd: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer font-mono"
                      >
                        <option value="F15.2 (Sindrom Ketergantungan Stimulansia)">F15.2 - Ketergantungan Stimulansia (Sabu)</option>
                        <option value="F15.1 (Penggunaan Merugikan Stimulansia)">F15.1 - Harmful Use Stimulansia</option>
                        <option value="F12.2 (Sindrom Ketergantungan Kanabinoid)">F12.2 - Ketergantungan Kanabinoid (Ganja)</option>
                        <option value="F11.2 (Sindrom Ketergantungan Opioid)">F11.2 - Ketergantungan Opioid (Heroin)</option>
                        <option value="F19.2 (Ketergantungan Multipel Zat)">F19.2 - Ketergantungan Multipel Zat</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 5: Usulan Rekomendasi Rehabilitasi & Rujukan */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]/60">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">5. Rekomendasi Layanan Rehabilitasi Medis</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Modalitas Layanan</label>
                      <select
                        value={medisForm.kebutuhanRawat}
                        onChange={(e) => setMedisForm({ ...medisForm, kebutuhanRawat: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer font-bold"
                      >
                        <option value="Rawat Inap">Rehabilitasi Rawat Inap (Pemulihan Penuh)</option>
                        <option value="Rawat Jalan">Rehabilitasi Rawat Jalan (Konseling Singkat)</option>
                        <option value="Detoksifikasi">Detoksifikasi Medis Darurat</option>
                        <option value="Tidak Memerlukan Rehab">Tidak Memerlukan Rehabilitasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Durasi Usulan (Bulan)</label>
                      <select
                        value={medisForm.durasiUsulanBulan}
                        onChange={(e) => setMedisForm({ ...medisForm, durasiUsulanBulan: Number(e.target.value) })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer font-bold"
                      >
                        <option value="3">3 Bulan</option>
                        <option value="6">6 Bulan</option>
                        <option value="12">12 Bulan</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Fasilitas Rujukan</label>
                      <select
                        value={medisForm.fasilitasRujukan}
                        onChange={(e) => setMedisForm({ ...medisForm, fasilitasRujukan: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg text-xs outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Balai Rehabilitasi BNN Tanah Merah">Balai Rehabilitasi BNN Tanah Merah</option>
                        <option value="RSJD Atma Husada Mahakam Samarinda">RSJD Atma Husada Mahakam Samarinda</option>
                        <option value="Klinik Pratama BNNP Kalimantan Timur">Klinik Pratama BNNP Kalimantan Timur</option>
                        <option value="RSUD A.W. Sjahranie Samarinda">RSUD A.W. Sjahranie Samarinda</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 6: Interpretasi Klinis & Catatan */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]/60">
                    <FileSignature className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">6. Simpulan &amp; Catatan Asesor Medis</h4>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Interpretasi Klinis Asesor</label>
                    <textarea
                      rows={3}
                      value={medisForm.interpretasiKlinis}
                      onChange={(e) => setMedisForm({ ...medisForm, interpretasiKlinis: e.target.value })}
                      placeholder="Tuliskan simpulan klinis, pola toleransi zat, dan kebutuhan intervensi..."
                      className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-lg text-xs outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Catatan Khusus / Usulan Sidang Pleno</label>
                    <input
                      type="text"
                      value={medisForm.catatanKhusus}
                      onChange={(e) => setMedisForm({ ...medisForm, catatanKhusus: e.target.value })}
                      placeholder="Catatan tambahan untuk Ketua TAT dan Jaksa saat pleno..."
                      className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Action Buttons Toolbar */}
                <div className="pt-4 border-t border-[#1b3459] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 italic">
                    * Perubahan draf langsung disimpan ke perkara dan dapat diperbarui sewaktu-waktu.
                  </span>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleSaveInlineMedis(false)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-[#0d1f38] hover:bg-[#142642] text-slate-200 border border-[#1b3459] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-slate-300" />
                      <span>Simpan Draf Medis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Finalisasi Asesmen Medis? Hasil pemeriksaan akan disahkan dan diteruskan ke Sidang Pleno TAT.')) {
                          handleSaveInlineMedis(true);
                        }
                      }}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finalisasi &amp; Teruskan ke Pleno</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* MODE 2: SUMMARY VIEW WITH QUICK EDIT ACCESS */
              <div className="space-y-4">
                {/* Instrumen ASSIST & Diagnosis Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold uppercase text-[#D4AF37]">Skor Instrumen ASSIST</span>
                    <div className="text-xl font-extrabold text-white mt-1">
                      {medisForm.skorInstrumen} Poin
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200">
                      Tingkat Risiko: {medisForm.tingkatRisikoInstrumen}
                    </span>
                  </div>

                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold uppercase text-[#D4AF37]">Diagnosis Klinis ICD-10</span>
                    <div className="text-xs font-bold text-white mt-1">
                      {medisForm.diagnosisKlinisIcd}
                    </div>
                    <span className="text-[11px] text-blue-300">Komorbid: {medisForm.komorbiditasMedis}</span>
                  </div>

                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold uppercase text-slate-200">Usulan Intervensi Medis</span>
                    <div className="text-sm font-extrabold text-white mt-1">
                      {medisForm.kebutuhanRawat} ({medisForm.durasiUsulanBulan} Bulan)
                    </div>
                    <span className="text-[11px] text-slate-300">{medisForm.fasilitasRujukan}</span>
                  </div>
                </div>

                {/* Riwayat Penggunaan & Toksikologi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white flex items-center space-x-1.5">
                        <Syringe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Riwayat Penggunaan Zat</span>
                      </h4>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <p>Zat Utama: <strong className="text-white">{medisForm.jenisZat}</strong></p>
                      <p>Cara Pakai: <span className="text-slate-200">{medisForm.caraPakai}</span> • Frekuensi: <span className="text-slate-200">{medisForm.frekuensi}</span></p>
                      <p>Lama Pemakaian: <span className="text-slate-200">{medisForm.lamaPemakaianBulan} Bulan</span> • Terakhir Pakai: <span className="text-slate-200">{medisForm.terakhirPakai}</span></p>
                    </div>
                  </div>

                  <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white flex items-center space-x-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Hasil Uji Urin Toksikologi Forensik</span>
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {urinTests.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-[#0b172a] rounded border border-[#1b3459]">
                          <span className="font-mono text-[11px] text-slate-300 truncate mr-1">{u.parameter.split('(')[0]}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            u.hasil === 'Positif'
                              ? 'bg-rose-900/70 text-rose-200 border border-rose-700/60'
                              : 'bg-[#0d1f38] text-slate-300 border border-[#1b3459]'
                          }`}>
                            {u.hasil}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interpretasi Klinis */}
                <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] text-xs">
                  <h4 className="font-bold text-white mb-1.5">Interpretasi Klinis Asesor Medis:</h4>
                  <p className="text-slate-300 leading-relaxed">{medisForm.interpretasiKlinis}</p>
                  {medisForm.catatanKhusus && (
                    <div className="mt-3 text-slate-300 bg-[#0b172a] p-2.5 rounded-lg border border-[#1b3459]">
                      <strong className="text-white">Catatan Khusus:</strong> {medisForm.catatanKhusus}
                    </div>
                  )}
                </div>

                {/* Edit Action Button in Summary */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingMedis(true)}
                    className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white border border-[#234475] rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#d4af37]" />
                    <span>Ubah / Lengkapi Lembar Asesmen Medis</span>
                  </button>
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
                  <Scale className="w-4 h-4 text-[#D4AF37]" />
                  <span>Telaah Yuridis & Analisis Peran Terperiksa</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pemisahan antara fakta terverifikasi vs dugaan, telaah barang bukti (SEMA 04/2010), dan simpulan hukum.
                </p>
              </div>
              {permohonan.asesmenHukum && (
                <span className="text-xs bg-[#0d1f38] text-slate-200 font-semibold px-2.5 py-1 rounded-lg border border-[#1b3459]">
                  Asesor: {permohonan.asesmenHukum.asesorNama}
                </span>
              )}
            </div>

            {!permohonan.asesmenHukum ? (
              <div className="text-center py-12 text-slate-400 bg-[#0b172a] border border-[#1b3459] rounded-xl">
                <Scale className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Asesmen hukum belum tersedia atau menunggu klarifikasi penyidikan.</p>
                {(currentUser.role === 'hukum' || currentUser.role === 'HUKUM') && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 mb-3">Silakan input hasil telaah yuridis berdasarkan SEMA 04/2010.</p>
                    <button 
                      onClick={() => setModalAsesmenType('hukum')}
                      className="bg-blue-900 hover:bg-blue-800 text-blue-100 px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-2 mx-auto transition-colors border border-blue-700 shadow-lg"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Input Asesmen Hukum</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Peran & Rekomendasi Hukum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase text-slate-200">Hasil Analisis Peran Terperiksa</span>
                    <div className="text-base font-extrabold text-white mt-1">
                      {permohonan.asesmenHukum.analisisPeran}
                    </div>
                    <p className="text-xs text-purple-200 mt-2 leading-relaxed">
                      {permohonan.asesmenHukum.argumentasiPeran}
                    </p>
                  </div>

                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase text-[#D4AF37]">Rekomendasi Aspek Hukum</span>
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
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
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
                    <h4 className="font-bold text-[#D4AF37] mb-2 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D4AF37]" />
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
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>Musyawarah Sidang Pleno Tim Asesmen Terpadu</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Forum sinkronisasi kesimpulan medis dan hukum, pencatatan dissenting opinion, dan perumusan rekomendasi bersama.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {permohonan.sidangPleno && (
                  <span className="text-xs bg-[#17375e] text-[#D4AF37] font-semibold px-2.5 py-1 rounded-lg border border-[#234b7d]">
                    No. BA: {permohonan.sidangPleno.nomorBeritaAcara}
                  </span>
                )}
                <button
                  onClick={() => setShowBeritaAcara(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Berita Acara
                </button>
              </div>
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
                    <span className="bg-[#17375e] text-[#D4AF37] px-2.5 py-0.5 rounded font-bold border border-[#234b7d]">
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
                    <p className="text-[#D4AF37] font-medium">{permohonan.sidangPleno.kesepakatanRekomendasi}</p>
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
                    <div className="p-3 bg-[#081224] border border-[#1b3459] rounded-lg text-amber-200">
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
                        <span className="text-[10px] bg-[#0d1f38] text-slate-200 font-bold px-2 py-0.5 rounded border border-[#1b3459]">
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

        {/* TAB 7: REKOMENDASI & PENGESAHAN DOKUMEN RESMI (ACUAN VISUAL 8 - 3 PANEL) */}
        {activeTab === 'dokumen' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileSignature className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hasil Asesmen Terpadu & Pengesahan Dokumen (Acuan Visual 8)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Ringkasan keputusan rekomendasi, preview PDF hasil asesmen resmi, dan jaminan keamanan audit trail.
                </p>
              </div>
              {permohonan.rekomendasiResmi && (
                <button
                  onClick={() => onOpenQrModal(permohonan)}
                  className="bg-[#0f274a] hover:bg-[#163a69] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-[#234b7d] cursor-pointer transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Cek QR Verifikasi</span>
                </button>
              )}
            </div>

            {!permohonan.rekomendasiResmi ? (
              <div className="text-center py-12 text-slate-400 bg-[#0b172a] border border-[#1b3459] rounded-xl">
                <FileSignature className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-200">Surat rekomendasi belum diterbitkan.</p>
                <p className="text-xs text-slate-500 mt-1">Dokumen resmi disusun setelah kesepakatan Sidang Pleno tercapai.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 3-PANEL LAYOUT (EXACT MATCH FOR ACUAN VISUAL 8) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* PANEL 1 (LEFT): REKOMENDASI TIM ASESMEN TERPADU */}
                  <div className="lg:col-span-4 bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]">
                        <FileSignature className="w-4 h-4 text-[#D4AF37]" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          REKOMENDASI TIM ASESMEN TERPADU
                        </h4>
                      </div>

                      {/* Nomor Rekomendasi */}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                          Nomor Rekomendasi
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
                          {permohonan.rekomendasiResmi.nomorSurat}
                        </span>
                      </div>

                      {/* Keputusan Card */}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                          Keputusan
                        </span>
                        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center space-x-3 text-emerald-200">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-slate-200" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block uppercase tracking-wider">
                              DISETUJUI
                            </span>
                            <span className="text-[11px] font-semibold text-slate-200 block">
                              Rekomendasi Positif
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Opsi Rekomendasi */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                          Opsi Rekomendasi
                        </span>

                        {/* Option 1: Positif (Selected) */}
                        <div className="p-2.5 bg-[#071326] border border-[#2d5289] rounded-lg flex items-start space-x-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Rekomendasi Positif</span>
                            <span className="text-[10px] text-slate-400 block">Disetujui untuk diproses sesuai ketentuan.</span>
                          </div>
                        </div>

                        {/* Option 2: Positif dengan Catatan */}
                        <div className="p-2.5 bg-[#071326]/50 border border-[#1b3459] rounded-lg flex items-start space-x-2.5 opacity-60">
                          <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-slate-300 block">Rekomendasi Positif dengan Catatan</span>
                            <span className="text-[10px] text-slate-400 block">Disetujui dengan pemenuhan catatan rekomendasi.</span>
                          </div>
                        </div>

                        {/* Option 3: Negatif */}
                        <div className="p-2.5 bg-[#071326]/50 border border-[#1b3459] rounded-lg flex items-start space-x-2.5 opacity-60">
                          <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-slate-300 block">Rekomendasi Negatif</span>
                            <span className="text-[10px] text-slate-400 block">Tidak disetujui untuk diproses lebih lanjut.</span>
                          </div>
                        </div>
                      </div>

                      {/* Tanda Tangan Ketua Tim */}
                      <div className="pt-2 border-t border-[#1b3459] space-y-1.5">
                        <div className="flex justify-between items-baseline text-[10px]">
                          <span className="text-slate-400 font-semibold">Tanda Tangan Ketua Tim</span>
                          <span className="text-slate-400 font-mono">Tanggal: {permohonan.rekomendasiResmi.tanggalTerbit}</span>
                        </div>

                        <div className="p-3 bg-[#071326] border border-[#1b3459] rounded-lg text-center font-sans space-y-1">
                          <div className="py-1">
                            <span className="font-serif italic text-lg text-[#D4AF37] tracking-widest block font-bold" style={{ fontFamily: 'Dancing Script, cursive, serif' }}>
                              Andi Pratama
                            </span>
                          </div>
                          <span className="text-xs font-bold text-white block">
                            KOMBES POL. ANDI PRATAMA, S.I.K., M.H.
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Ketua Tim Asesmen Terpadu
                          </span>
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                          <span>Tempat: Samarinda / Jakarta</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Proses TTE & Finalisasi */}
                    <button
                      onClick={() => onOpenQrModal(permohonan)}
                      className="w-full bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-[#2d7ad6]/70 shadow-lg shadow-sky-950/40 flex items-center justify-center space-x-2 cursor-pointer transition-all mt-2"
                    >
                      <FileSignature className="w-4 h-4 text-[#D4AF37]" />
                      <span>Proses TTE & Finalisasi</span>
                    </button>
                  </div>

                  {/* PANEL 2 (CENTER): PREVIEW DOKUMEN HASIL ASESMEN (PDF PAPER VIEW) */}
                  <div className="lg:col-span-5 bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xl">
                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-sky-400" />
                        <span>PREVIEW DOKUMEN HASIL ASESMEN (PDF)</span>
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => alert(`Mengunduh dokumen PDF Hasil Asesmen untuk: ${permohonan.tersangkaNama}`)}
                          className="p-1.5 hover:bg-[#163a69] text-slate-300 rounded border border-[#234b7d] transition-colors cursor-pointer"
                          title="Unduh PDF Hasil Asesmen"
                        >
                          <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>
                        <button
                          onClick={() => onOpenQrModal(permohonan)}
                          className="p-1.5 hover:bg-[#163a69] text-slate-300 rounded border border-[#234b7d] transition-colors"
                          title="Buka Lembar Verifikasi Barcode"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                        </button>
                      </div>
                    </div>

                    {/* PDF Document Paper Container */}
                    <div className="bg-white text-slate-900 rounded-lg p-5 shadow-2xl space-y-4 font-serif text-[11px] leading-relaxed flex-1 flex flex-col justify-between border border-slate-300">
                      <div>
                        {/* Kop Surat Header */}
                        <div className="text-center pb-3 border-b-2 border-slate-900 space-y-0.5 font-sans">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
                            KEPOLISIAN NEGARA REPUBLIK INDONESIA
                          </p>
                          <p className="text-xs font-black uppercase text-slate-900 mt-1">
                            HASIL ASESMEN TERPADU
                          </p>
                          <p className="text-[10px] font-mono font-bold text-slate-700">
                            Nomor: {permohonan.rekomendasiResmi.nomorSurat}
                          </p>
                        </div>

                        {/* Document Section Outline (EXACT MATCH FOR ACUAN VISUAL 8) */}
                        <div className="mt-4 space-y-1.5 font-sans text-[10px] text-slate-800 font-bold uppercase tracking-wide">
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>I. IDENTITAS PEMOHON</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>II. DASAR ASESMEN</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>III. RUANG LINGKUP ASESMEN</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>IV. METODOLOGI ASESMEN</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>V. HASIL ASESMEN PER BIDANG</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>VI. TEMUAN & CATATAN</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5 text-slate-900 font-black">
                            <span>VII. REKOMENDASI TIM ASESMEN TERPADU</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>VIII. KEPUTUSAN</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-0.5">
                            <span>IX. PENUTUP</span>
                          </div>
                        </div>
                      </div>

                      {/* PDF Bottom Signature & QR Verification Section */}
                      <div className="pt-4 border-t border-slate-300 font-sans grid grid-cols-12 gap-3 items-end">
                        {/* QR Code Verification Box (Left) */}
                        <div className="col-span-5 bg-slate-50 border border-slate-300 rounded p-2 text-center space-y-1">
                          <div className="w-14 h-14 bg-white border border-slate-900 mx-auto flex items-center justify-center p-1 rounded">
                            <QrCode className="w-12 h-12 text-slate-900" />
                          </div>
                          <span className="text-[8px] font-black uppercase text-slate-900 block leading-tight">
                            SCAN UNTUK VERIFIKASI DOKUMEN
                          </span>
                          <p className="text-[7px] text-slate-600 leading-tight">
                            Pastikan dokumen asli dengan memindai QR Code atau kunjungi{' '}
                            <span className="text-slate-900 font-mono font-bold underline">https://e-tat.polri.go.id/verify</span>
                          </p>
                        </div>

                        {/* Ketua Tim Signature (Right) */}
                        <div className="col-span-7 text-center font-sans space-y-1">
                          <p className="text-[9px] text-slate-700">Samarinda, {permohonan.rekomendasiResmi.tanggalTerbit}</p>
                          <p className="text-[9px] font-bold text-slate-900 uppercase">Ketua Tim Asesmen Terpadu</p>
                          <div className="py-1">
                            <span className="font-serif italic text-base text-slate-900 block font-bold" style={{ fontFamily: 'Dancing Script, cursive, serif' }}>
                              Andi Pratama
                            </span>
                          </div>
                          <p className="text-[9px] font-extrabold text-slate-900 underline">
                            KOMBES POL. ANDI PRATAMA, S.I.K., M.H.
                          </p>
                          <p className="text-[8px] font-mono text-slate-700">NRP 73060660</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PANEL 3 (RIGHT): KEAMANAN & AUDIT TRAIL */}
                  <div className="lg:col-span-3 bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 flex flex-col justify-between space-y-3 shadow-xl">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]">
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          KEAMANAN & AUDIT TRAIL
                        </h4>
                      </div>

                      {/* Security Features List */}
                      <div className="space-y-2.5">
                        {/* 1. Login 2FA */}
                        <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Login 2FA/MFA</span>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Autentikasi dua faktor untuk perlindungan akses pengguna.
                            </span>
                          </div>
                        </div>

                        {/* 2. RBAC */}
                        <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Role Based Access Control</span>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Akses disesuaikan peran dan tanggung jawab.
                            </span>
                          </div>
                        </div>

                        {/* 3. Encrypted Data */}
                        <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Enkripsi Data & Dokumen</span>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Data dan dokumen dienkripsi end-to-end untuk keamanan.
                            </span>
                          </div>
                        </div>

                        {/* 4. Immutable Audit Trail */}
                        <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                            <History className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Audit Trail Tidak Dapat Dihapus</span>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Seluruh aktivitas tercatat dan tidak dapat diubah atau dihapus.
                            </span>
                          </div>
                        </div>

                        {/* 5. Backup & Recovery */}
                        <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                            <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Backup & Disaster Recovery</span>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Pencadangan rutin dan rencana pemulihan bencana tersedia.
                            </span>
                          </div>
                        </div>

                        {/* 6. QR Code Verification */}
                        <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                            <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">QR Code Verifikasi</span>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Verifikasi keaslian dokumen secara cepat dan aman.
                            </span>
                          </div>
                        </div>

                        {/* 7. Electronic Signature */}
                        <div className="p-2.5 bg-[#071326] border border-[#1b3459] rounded-lg flex items-start space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#132d54] flex items-center justify-center shrink-0 mt-0.5 border border-[#2d5289]">
                            <FileSignature className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Tanda Tangan Elektronik</span>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Dokumen ditandatangani secara elektronik yang sah dan tersertifikasi.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signatures Matrix & Confirmation Section Below 3-Panel Grid */}
                <div className="border border-[#234b7d] rounded-xl p-5 bg-[#081224] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <FileSignature className="w-4 h-4 text-[#D4AF37]" />
                      <span>Matriks Tanda Tangan Elektronik Multi-Pihak</span>
                    </span>
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      {permohonan.rekomendasiResmi.daftarPengesah.filter(p => p.status === 'disahkan').length} / {permohonan.rekomendasiResmi.daftarPengesah.length} Pengesahan
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {permohonan.rekomendasiResmi.daftarPengesah.map((p) => (
                      <div key={p.id} className="border border-[#1b3459] rounded-lg p-3 bg-[#0b172a] text-center flex flex-col justify-between shadow-sm">
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">{p.jabatan}</p>
                          <p className="text-xs font-bold text-white mt-1">{p.nama}</p>
                          <p className="text-[10px] text-slate-400">{p.instansi}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#1b3459]">
                          {p.status === 'disahkan' ? (
                            <div className="text-slate-200 space-y-0.5">
                              <span className="text-[10px] bg-[#0d1f38] text-slate-200 font-bold px-2 py-0.5 rounded block border border-[#1b3459]">
                                ✓ Telah Disahkan
                              </span>
                              <span className="text-[9px] text-[#D4AF37] block font-mono truncate">{p.tandaTanganDigitalHash}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] bg-[#0d1f38] text-[#D4AF37] font-semibold px-2 py-0.5 rounded block border border-[#1b3459]">
                              Menunggu Pengesahan
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bukti Penerimaan Pengaju */}
                {permohonan.rekomendasiResmi.buktiPenerimaanPengaju ? (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold block text-slate-200">Konfirmasi Tanda Terima Pengaju:</span>
                      <span>Diterima oleh {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.diterimaOleh} pada {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.tanggalDiterima}</span>
                    </div>
                    <span className="font-mono font-bold bg-[#0b172a] text-slate-200 px-2 py-1 rounded border border-emerald-500/40">
                      {permohonan.rekomendasiResmi.buktiPenerimaanPengaju.nomorTandaTerima}
                    </span>
                  </div>
                ) : (currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU') && ((permohonan.applicationStatus === 'RESULTS_ISSUED' || permohonan.statusProsesUtama === 'rekomendasi_terbit') || (permohonan.followupStatus === 'VERIFIED_IMPLEMENTED' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut')) ? (
                  <div className="p-4 bg-[#0d213d] border border-[#234b7d] rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">Konfirmasi Tanda Terima Berkas Resmi:</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        Sebagai penyidik pemohon, Anda berhak menerima surat rekomendasi resmi e-TAT untuk kelengkapan berkas perkara penyidikan.
                      </p>
                    </div>
                    <button
                      onClick={handlePengajuSignReceipt}
                      className="bg-gradient-to-r from-[#0d1f38] via-[#132644] to-[#1b3459] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-bold text-xs px-4 py-2 rounded-xl border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
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
                    <span className="text-xs bg-[#0b172a] px-3 py-1 rounded-full font-semibold border border-[#234b7d] text-[#D4AF37]">
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
                {(currentUser.role === 'rehabilitasi' || (currentUser.role === 'sekretariat' || currentUser.role === 'ADMIN')) && (
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
                          className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-teal-500 cursor-pointer transition-all shadow-none"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Konfirmasi Ketersediaan Kuota & Jadwal Terima</span>
                        </button>
                      )}

                      {permohonan.tindakLanjut.statusRujukan !== 'klien_mulai_layanan' && (
                        <button
                          onClick={() => handleRehabAction('admisi')}
                          className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-emerald-500 cursor-pointer transition-all shadow-none"
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
                          <AlertTriangle className="w-3.5 h-3.5 text-slate-300" />
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
          <div className="space-y-6">
            {/* 1. Instrumen ASAM - Penilaian Tingkat Keparahan & Plasemen */}
            <InstrumenKriteriaPlasemenView
              permohonan={permohonan}
              currentUser={currentUser}
              onUpdatePermohonan={onUpdatePermohonan}
            />
            
            {/* 2. Pelaksanaan Pengawasan Klien */}
            <PengawasanPascaTatSection
              permohonan={permohonan}
              currentUser={currentUser}
              onUpdatePermohonan={onUpdatePermohonan}
            />
          </div>
        )}

        {/* TAB 9: KLARIFIKASI TERARAH (Targeted Q&A per Role) */}
        {activeTab === 'klarifikasi' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
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
                    className="border border-[#1b3459] rounded px-2 py-1 bg-[#0b172a] font-medium text-white focus:outline-none focus:border-[#D4AF37]"
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
                className="w-full text-xs p-2.5 border border-[#1b3459] rounded-lg focus:outline-none focus:border-[#D4AF37] bg-[#0b172a] text-white placeholder-slate-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!pertanyaanInput.trim()}
                  className="bg-gradient-to-r from-[#0d1f38] via-[#132644] to-[#1b3459] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
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
                        <span className="bg-[#0b172a] text-[#D4AF37] px-1.5 py-0.5 rounded font-medium capitalize border border-[#1b3459]">
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
                      <div className="mt-2 pl-4 border-l-2 border-[#D4AF37] bg-[#0d213d] p-2.5 rounded-r">
                        <div className="flex items-center justify-between text-[10px] text-[#D4AF37] font-semibold mb-1">
                          <span>Jawaban oleh {item.dijawabOleh}</span>
                          <span className="text-slate-400">{item.tanggalJawab}</span>
                        </div>
                        <p className="text-slate-200">{item.jawaban}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-medium pt-1">
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
                <History className="w-4 h-4 text-[#D4AF37]" />
                <span>Catatan Riwayat Aktivitas & Jejak Audit (Audit Trail)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Rekaman perubahan status, aktor yang bertindak, dan waktu kejadian yang tidak dapat diubah (immutable log).
              </p>
            </div>

            <div className="space-y-3">
              {permohonan.auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#081224] border border-[#1b3459] rounded-lg text-xs flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.aksi}</span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{log.rincian}</p>
                    <span className="text-[10px] text-[#D4AF37] font-semibold mt-1 inline-block">
                      Oleh: {log.actorNama} ({log.actorPeran})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Atur Jadwal (Admin) */}
      {modalJadwalType && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#1b3459] flex items-center justify-between bg-gradient-to-r from-[#0d1f38] to-[#0b172a]">
              <h3 className="font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Tetapkan Jadwal & Penugasan {modalJadwalType === 'medis' ? 'Medis' : 'Hukum'}</span>
              </h3>
              <button onClick={() => setModalJadwalType(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const asesor = formData.get('asesor') as string;
              const lokasi = formData.get('lokasi') as string;
              const jadwal = formData.get('jadwal') as string;
              
              let formattedDate = jadwal;
              if (jadwal) {
                 const d = new Date(jadwal);
                 const pad = (n: number) => n.toString().padStart(2, '0');
                 formattedDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} WIB`;
              }

              onUpdatePermohonan({
                ...permohonan,
                timAsesmen: {
                  ...(permohonan.timAsesmen as any),
                  ...(modalJadwalType === 'medis' 
                    ? { asesorMedisNama: asesor, lokasiPemeriksaan: lokasi, jadwalPemeriksaanMedis: formattedDate }
                    : { asesorHukumNama: asesor, jadwalPemeriksaanHukum: formattedDate }
                  )
                }
              });
              setModalJadwalType(null);
            }} className="p-5 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Asesor / Instansi *</label>
                <select name="asesor" required defaultValue={modalJadwalType === 'medis' ? permohonan.timAsesmen?.asesorMedisNama : permohonan.timAsesmen?.asesorHukumNama} className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white text-sm focus:border-[#D4AF37] outline-none">
                  <option value="">-- Pilih Asesor --</option>
                  {modalJadwalType === 'medis' ? (
                    <>
                      <option value="dr. Haryono (BNNK Samarinda)">dr. Haryono (BNNK Samarinda)</option>
                      <option value="dr. Siti Aminah (RSJD Atma Husada)">dr. Siti Aminah (RSJD Atma Husada)</option>
                      <option value="dr. Budi Santoso (RS Bhayangkara)">dr. Budi Santoso (RS Bhayangkara)</option>
                      <option value="dr. Rina Setiawati (Klinik Pratama)">dr. Rina Setiawati (Klinik Pratama)</option>
                    </>
                  ) : (
                    <>
                      <option value="Tim Hukum BNNP Kaltim">Tim Hukum BNNP Kaltim</option>
                      <option value="Jaksa Penuntut Umum (Kejari Samarinda)">Jaksa Penuntut Umum (Kejari Samarinda)</option>
                      <option value="Penyidik Satresnarkoba Polresta">Penyidik Satresnarkoba Polresta</option>
                    </>
                  )}
                </select>
              </div>

              {modalJadwalType === 'medis' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lokasi Pemeriksaan (Faskes Terdekat) *</label>
                  <select name="lokasi" required defaultValue={permohonan.timAsesmen?.lokasiPemeriksaan} className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white text-sm focus:border-[#D4AF37] outline-none">
                    <option value="">-- Pilih Lokasi --</option>
                    <option value="Klinik Pratama BNNK Samarinda">Klinik Pratama BNNK Samarinda</option>
                    <option value="Klinik BNNP Kaltim">Klinik BNNP Kaltim</option>
                    <option value="RSUD AW Sjahranie">RSUD AW Sjahranie</option>
                    <option value="RSJD Atma Husada Mahakam">RSJD Atma Husada Mahakam</option>
                    <option value="RS Bhayangkara">RS Bhayangkara</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Tanggal & Waktu *</label>
                <input type="datetime-local" name="jadwal" required className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white text-sm focus:border-[#D4AF37] outline-none [color-scheme:dark]" />
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setModalJadwalType(null)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-600 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-[#D4AF37] text-slate-900 rounded-lg hover:bg-amber-400 transition-colors shadow-lg">Simpan Penugasan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAsesmenType && (
        <ModalInputAsesmen 
          isOpen={true} 
          onClose={() => setModalAsesmenType(null)} 
          tipeAsesmen={modalAsesmenType} 
          namaTerperiksa={permohonan.terperiksa.namaLengkap} 
          nomorTat={permohonan.nomorPermohonan} 
          onSave={handleSaveAsesmen}
        />
      )}

      {/* Lightbox Modal Preview Foto Barang Bukti & Surat Lab */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-[#081224] border-b border-[#1b3459] flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>{previewImage.title}</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#142642] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[65vh] max-w-full object-contain rounded-lg border border-[#1b3459]"
              />
            </div>
            <div className="p-3 bg-[#081224] border-t border-[#1b3459] flex items-center justify-between">
              <a
                href={previewImage.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
              >
                <span>Buka Gambar Asli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-4 py-1.5 rounded-lg border border-[#234475] cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
