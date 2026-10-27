import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PermohonanAsesmen, UserProfile, DokumenPersyaratan } from '../types';
import { sendPengajuanEmailNotification } from '../services/emailService';
import { permohonanApi } from '../services/api';
import { uploadToCloudinary } from '../services/cloudinary';
import { getDocTemplates } from './pengajuan-baru/types';
import { PengajuanWizardHeader } from './pengajuan-baru/PengajuanWizardHeader';
import { Step1IdentitasTerperiksa } from './pengajuan-baru/Step1IdentitasTerperiksa';
import { Step2RekamJejakNik } from './pengajuan-baru/Step2RekamJejakNik';
import { Step3PerkaraBarangBukti } from './pengajuan-baru/Step3PerkaraBarangBukti';
import { Step4KelengkapanDokumen } from './pengajuan-baru/Step4KelengkapanDokumen';
import { Step5KonfirmasiPengajuan } from './pengajuan-baru/Step5KonfirmasiPengajuan';
import { PengajuanFooterNav } from './pengajuan-baru/PengajuanFooterNav';
import { ModalValidasiPengajuan } from './pengajuan-baru/ModalValidasiPengajuan';
import { ModalResetPengajuan } from './pengajuan-baru/ModalResetPengajuan';

const DRAFT_STORAGE_KEY = 'etat_pengajuan_baru_draft_v1';

interface PengajuanBaruViewProps {
  currentUser: UserProfile;
  onBack: () => void;
  onSubmit: (newPermohonan: PermohonanAsesmen) => void;
}

export const PengajuanBaruView: React.FC<PengajuanBaruViewProps> = ({
  currentUser,
  onBack,
  onSubmit
}) => {
  // Inisialisasi draf dari localStorage (jika tersedia)
  const initialDraft = useMemo(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.tanggalLahir) {
          const birthYear = parseInt(parsed.tanggalLahir.split('-')[0], 10);
          const currentYear = new Date().getFullYear();
          if (isNaN(birthYear) || birthYear > currentYear || birthYear < 1920) {
            parsed.tanggalLahir = '';
            parsed.usia = '';
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca draf dari localStorage:', e);
    }
    return null;
  }, []);

  const [step, setStep] = useState<number>(initialDraft?.step || 1);
  const isSubmittedRef = useRef<boolean>(false);

  // Form State: Step 1 (Terperiksa)
  const [namaLengkap, setNamaLengkap] = useState<string>(initialDraft?.namaLengkap || '');
  const [alias, setAlias] = useState<string>(initialDraft?.alias || '');
  const [nik, setNik] = useState<string>(initialDraft?.nik || '');
  const [tempatLahir, setTempatLahir] = useState<string>(initialDraft?.tempatLahir || '');
  const [tanggalLahir, setTanggalLahir] = useState<string>(initialDraft?.tanggalLahir || '');
  const [usia, setUsia] = useState<number | ''>(initialDraft?.usia !== undefined ? initialDraft.usia : '');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>(initialDraft?.jenisKelamin || 'Laki-laki');
  const [pekerjaan, setPekerjaan] = useState<string>(initialDraft?.pekerjaan || '');
  const [alamatKtp, setAlamatKtp] = useState<string>(initialDraft?.alamatKtp || '');
  const [namaWali, setNamaWali] = useState<string>(initialDraft?.namaWali || '');
  const [kontakWali, setKontakWali] = useState<string>(initialDraft?.kontakWali || '');
  const [statusKhusus, setStatusKhusus] = useState<'dewasa' | 'anak_berhadapan_hukum' | 'perlu_penerjemah'>(
    initialDraft?.statusKhusus || 'dewasa'
  );

  // Auto-hitung usia & sesuaikan status kategori dari tanggal lahir yang dipilih
  useEffect(() => {
    if (!tanggalLahir) {
      setUsia('');
      return;
    }

    const parts = tanggalLahir.split('-');
    if (parts.length === 3) {
      const birthYear = parseInt(parts[0], 10);
      const birthMonth = parseInt(parts[1], 10) - 1;
      const birthDay = parseInt(parts[2], 10);
      const currentYear = new Date().getFullYear();

      if (!isNaN(birthYear) && !isNaN(birthMonth) && !isNaN(birthDay) && birthYear >= 1920 && birthYear <= currentYear) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthYear;
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
          calculatedAge--;
        }

        const finalAge = calculatedAge >= 0 ? calculatedAge : 0;
        setUsia(finalAge);

        if (finalAge < 18) {
          setStatusKhusus('anak_berhadapan_hukum');
        } else if (statusKhusus === 'anak_berhadapan_hukum') {
          setStatusKhusus('dewasa');
        }
      } else {
        setUsia('');
      }
    }
  }, [tanggalLahir]);

  // Form State: Riwayat Terperiksa (Step 2)
  const [statusResidivis, setStatusResidivis] = useState<'bukan_residivis' | 'residivis_1x' | 'residivis_berulang'>(
    initialDraft?.statusResidivis || 'bukan_residivis'
  );
  const [riwayatTatSebelumnya, setRiwayatTatSebelumnya] = useState<string>(initialDraft?.riwayatTatSebelumnya || '');
  const [riwayatPerkaraLalu, setRiwayatPerkaraLalu] = useState<string>(initialDraft?.riwayatPerkaraLalu || '');
  const [riwayatRehabilitasi, setRiwayatRehabilitasi] = useState<string>(initialDraft?.riwayatRehabilitasi || '');
  const [lamaPenggunaanZat, setLamaPenggunaanZat] = useState<string>(initialDraft?.lamaPenggunaanZat || '');
  const [hasilTesUrinAwal, setHasilTesUrinAwal] = useState<string>(initialDraft?.hasilTesUrinAwal || '');
  const [catatanProfilingPenyidik, setCatatanProfilingPenyidik] = useState<string>(initialDraft?.catatanProfilingPenyidik || '');

  // Live Database NIK Check State
  const [isCheckingNik, setIsCheckingNik] = useState<boolean>(false);
  const [dbRiwayat, setDbRiwayat] = useState<any[]>(initialDraft?.dbRiwayat || []);
  const lastCheckedNikRef = useRef<string>('');

  const checkNikDatabase = async (targetNik: string) => {
    if (!targetNik || targetNik.trim().length === 0) {
      setDbRiwayat([]);
      setStatusResidivis('bukan_residivis');
      return;
    }
    setIsCheckingNik(true);
    try {
      const res = await permohonanApi.checkNik(targetNik.trim());
      if (res && res.data) {
        const list = res.data.riwayat || [];
        setDbRiwayat(list);
        setStatusResidivis(res.data.statusResidivis || (list.length > 0 ? 'residivis_1x' : 'bukan_residivis'));
        lastCheckedNikRef.current = targetNik.trim();
      } else {
        setDbRiwayat([]);
        setStatusResidivis('bukan_residivis');
      }
    } catch (e) {
      console.warn('Gagal cek NIK ke database:', e);
      setDbRiwayat([]);
    } finally {
      setIsCheckingNik(false);
    }
  };

  useEffect(() => {
    if (step === 2 && nik && nik.trim() !== lastCheckedNikRef.current) {
      checkNikDatabase(nik);
    }
  }, [step, nik]);

  // Form State: Step 3 (Perkara & Barang Bukti)
  const [jenisPengajuan, setJenisPengajuan] = useState<'penangkapan_tanpa_bb' | 'penangkapan_dengan_bb' | 'p19' | 'penuntutan' | 'persidangan'>(
    initialDraft?.jenisPengajuan || 'penangkapan_dengan_bb'
  );
  const [metodePelaksanaan, setMetodePelaksanaan] = useState<'luring' | 'daring' | 'hybrid'>(
    initialDraft?.metodePelaksanaan || 'luring'
  );
  const [satuanKerjaTujuan, setSatuanKerjaTujuan] = useState<string>(
    initialDraft?.satuanKerjaTujuan || 'BNNP Kalimantan Timur'
  );

  const [nomorLp, setNomorLp] = useState<string>(initialDraft?.nomorLp || '');
  const [tanggalLp, setTanggalLp] = useState<string>(initialDraft?.tanggalLp || '');
  const [tanggalWaktuPenangkapan, setTanggalWaktuPenangkapan] = useState<string>(
    initialDraft?.tanggalWaktuPenangkapan || ''
  );
  const [namaPenyidik, setNamaPenyidik] = useState<string>(
    initialDraft?.namaPenyidik || currentUser.name || ''
  );
  const [nomorHpPenyidik, setNomorHpPenyidik] = useState<string>(
    initialDraft?.nomorHpPenyidik || currentUser.phone || ''
  );
  const [pasal, setPasal] = useState<string>(initialDraft?.pasal || '');
  const [tkp, setTkp] = useState<string>(initialDraft?.tkp || '');
  const [kronologi, setKronologi] = useState<string>(initialDraft?.kronologi || '');

  // Barang bukti list
  const [barangBuktiList, setBarangBuktiList] = useState<any[]>(initialDraft?.barangBuktiList || []);
  const [newJenisZat, setNewJenisZat] = useState('Metamfetamina (Sabu)');
  const [newBerat, setNewBerat] = useState('');
  const [newStatusLab, setNewStatusLab] = useState<'proses_lab' | 'positif' | 'negatif' | 'belum_uji'>('proses_lab');
  const [newNomorLab, setNewNomorLab] = useState('');
  const [newFotoBb, setNewFotoBb] = useState('');
  const [newFotoLab, setNewFotoLab] = useState('');

  // Form State: Step 4 (Dokumen)
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>(initialDraft?.uploadedDocIds || []);
  const [uploadedDocUrls, setUploadedDocUrls] = useState<Record<string, string>>(initialDraft?.uploadedDocUrls || {});
  const [uploadedDocNames, setUploadedDocNames] = useState<Record<string, string>>(initialDraft?.uploadedDocNames || {});
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Cegah refresh / close browser saat ada file yang sedang di-upload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadingDocId) {
        e.preventDefault();
        e.returnValue = 'Proses upload file sedang berjalan. Jika Anda me-refresh, unggahan akan terputus.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [uploadingDocId]);

  // Simpan draf otomatis ke localStorage setiap kali ada inputan yang berubah
  useEffect(() => {
    if (isSubmittedRef.current) return;
    try {
      const draft = {
        step,
        namaLengkap,
        alias,
        nik,
        tempatLahir,
        tanggalLahir,
        usia,
        jenisKelamin,
        pekerjaan,
        alamatKtp,
        namaWali,
        kontakWali,
        statusKhusus,
        lamaPenggunaanZat,
        hasilTesUrinAwal,
        catatanProfilingPenyidik,
        statusResidivis,
        riwayatTatSebelumnya,
        riwayatPerkaraLalu,
        riwayatRehabilitasi,
        jenisPengajuan,
        metodePelaksanaan,
        satuanKerjaTujuan,
        nomorLp,
        tanggalLp,
        tanggalWaktuPenangkapan,
        namaPenyidik,
        nomorHpPenyidik,
        pasal,
        tkp,
        kronologi,
        barangBuktiList,
        uploadedDocIds,
        uploadedDocUrls,
        uploadedDocNames,
        dbRiwayat
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Gagal menyimpan draf pengajuan ke localStorage:', e);
    }
  }, [
    step,
    namaLengkap,
    alias,
    nik,
    tempatLahir,
    tanggalLahir,
    usia,
    jenisKelamin,
    pekerjaan,
    alamatKtp,
    namaWali,
    kontakWali,
    statusKhusus,
    lamaPenggunaanZat,
    hasilTesUrinAwal,
    catatanProfilingPenyidik,
    statusResidivis,
    riwayatTatSebelumnya,
    riwayatPerkaraLalu,
    riwayatRehabilitasi,
    jenisPengajuan,
    metodePelaksanaan,
    satuanKerjaTujuan,
    nomorLp,
    tanggalLp,
    tanggalWaktuPenangkapan,
    namaPenyidik,
    nomorHpPenyidik,
    pasal,
    tkp,
    kronologi,
    barangBuktiList,
    uploadedDocIds,
    uploadedDocUrls,
    uploadedDocNames,
    dbRiwayat
  ]);

  // Modal reset & modal validation state
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean;
    stepNumber: number;
    stepTitle: string;
    missingFields: string[];
  } | null>(null);

  const handleResetDraft = () => {
    setShowResetConfirmModal(true);
  };

  const handleConfirmReset = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {}

    setStep(1);
    setNamaLengkap('');
    setAlias('');
    setNik('');
    setTempatLahir('');
    setTanggalLahir('');
    setUsia('');
    setJenisKelamin('Laki-laki');
    setPekerjaan('');
    setAlamatKtp('');
    setNamaWali('');
    setKontakWali('');
    setStatusKhusus('dewasa');
    setLamaPenggunaanZat('');
    setHasilTesUrinAwal('');
    setCatatanProfilingPenyidik('');
    setStatusResidivis('bukan_residivis');
    setRiwayatTatSebelumnya('');
    setRiwayatPerkaraLalu('');
    setRiwayatRehabilitasi('');
    setJenisPengajuan('penangkapan_dengan_bb');
    setMetodePelaksanaan('luring');
    setSatuanKerjaTujuan('BNNP Kalimantan Timur');
    setNomorLp('');
    setTanggalLp('');
    setTanggalWaktuPenangkapan('');
    setNamaPenyidik(currentUser.name || '');
    setNomorHpPenyidik(currentUser.phone || '');
    setPasal('');
    setTkp('');
    setKronologi('');
    setBarangBuktiList([]);
    setUploadedDocIds([]);
    setUploadedDocUrls({});
    setUploadedDocNames({});
    setDbRiwayat([]);
    setShowResetConfirmModal(false);
  };

  const getStepValidation = (stepNum: number) => {
    const missing: string[] = [];
    let title = '';

    if (stepNum === 1) {
      title = 'Langkah 1: Identitas Pokok Terperiksa';
      if (!namaLengkap.trim()) {
        missing.push('Nama Lengkap Terperiksa / Yang Diadukan');
      } else if (namaLengkap.trim().length < 2) {
        missing.push('Nama Lengkap minimal 2 karakter');
      }

      if (!nik.trim()) {
        missing.push('Nomor Induk Kependudukan (NIK Terperiksa)');
      } else if (nik.trim().length !== 16) {
        missing.push(`NIK Terperiksa harus tepat 16 digit angka (saat ini: ${nik.trim().length} digit)`);
      }

      if (!tempatLahir.trim()) missing.push('Tempat Lahir');
      if (!tanggalLahir.trim()) missing.push('Tanggal Lahir Terperiksa');
      if (!usia || Number(usia) <= 0) missing.push('Usia Terperiksa (Otomatis dari Tanggal Lahir)');
      if (!alamatKtp.trim()) missing.push('Alamat Sesuai KTP / Domisili');
      if (!pekerjaan.trim()) missing.push('Pekerjaan / Profesi Terperiksa');

      if (kontakWali.trim() && kontakWali.trim().length < 10) {
        missing.push('Nomor Telepon Wali / Keluarga minimal 10 digit angka');
      }
    } else if (stepNum === 2) {
      title = 'Langkah 2: Riwayat Kasus & Pemeriksaan NIK';
    } else if (stepNum === 3) {
      title = 'Langkah 3: Data Perkara & Barang Bukti';
      if (!nomorLp.trim()) missing.push('Nomor Laporan Polisi (LP)');
      if (!tanggalLp.trim()) missing.push('Tanggal Laporan Polisi');
      if (!tanggalWaktuPenangkapan.trim()) missing.push('Tanggal & Jam Penangkapan');
      if (!namaPenyidik.trim()) missing.push('Nama Penyidik Satuan');
      
      if (!nomorHpPenyidik.trim()) {
        missing.push('Nomor HP / WhatsApp Penyidik');
      } else if (nomorHpPenyidik.trim().length < 10) {
        missing.push(`Nomor HP Penyidik minimal 10 digit angka (saat ini: ${nomorHpPenyidik.trim().length} digit)`);
      }

      if (!pasal.trim()) missing.push('Pasal yang Dipersangkakan');
      if (!tkp.trim()) missing.push('Tempat Kejadian Perkara (TKP)');
      
      if (!kronologi.trim()) {
        missing.push('Kronologi Singkat Penangkapan');
      } else if (kronologi.trim().length < 10) {
        missing.push('Kronologi Singkat Penangkapan minimal 10 karakter');
      }

      if (jenisPengajuan === 'penangkapan_dengan_bb' && barangBuktiList.length === 0) {
        missing.push('Daftar Barang Bukti Sitaan (Minimal 1 BB terdaftar)');
      }
    } else if (stepNum === 4) {
      title = 'Langkah 4: Kelengkapan Dokumen Persyaratan';
      const mandatoryDocs = getDocTemplates(jenisPengajuan).filter((d) => d.wajib);
      mandatoryDocs.forEach((doc) => {
        if (!uploadedDocIds.includes(doc.id)) {
          missing.push(`${doc.nama} (${doc.kode})`);
        }
      });
    }

    return {
      isValid: missing.length === 0,
      title,
      missingFields: missing
    };
  };

  const handleStepNavigation = (targetStep: number) => {
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }

    for (let s = 1; s < targetStep; s++) {
      const val = getStepValidation(s);
      if (!val.isValid) {
        setValidationModal({
          isOpen: true,
          stepNumber: s,
          stepTitle: val.title,
          missingFields: val.missingFields
        });
        setStep(s);
        return;
      }
    }

    setStep(targetStep);
  };

  const handleAddBb = () => {
    if (!newJenisZat.trim()) {
      alert('Mohon isi jenis narkotika/zat barang bukti');
      return;
    }
    const parsedBerat = parseFloat(newBerat);
    if (!newBerat || isNaN(parsedBerat) || parsedBerat <= 0) {
      alert('Mohon isi berat barang bukti dengan angka desimal positif lebih dari 0 (contoh: 0.25)');
      return;
    }
    const newEntry = {
      id: `bb-${Date.now()}`,
      jenisZat: newJenisZat.trim().slice(0, 80),
      beratBersihGram: parsedBerat,
      statusUjiLab: newStatusLab,
      nomorSuratLab: newNomorLab.trim().slice(0, 80) || undefined,
      tanggalSuratLab: new Date().toISOString().split('T')[0],
      keterangan: 'Input penyidik saat pengajuan',
      fotoBarangBuktiUrl: newFotoBb || undefined,
      fotoUjiLabUrl: newFotoLab || undefined
    };
    setBarangBuktiList([...barangBuktiList, newEntry]);
    setNewJenisZat('Metamfetamina (Sabu)');
    setNewBerat('0.2');
    setNewNomorLab('');
    setNewFotoBb('');
    setNewFotoLab('');
  };

  const handleRemoveBb = (id: string) => {
    setBarangBuktiList(barangBuktiList.filter((b) => b.id !== id));
  };

  const handleUploadFotoBb = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewFotoBb(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadToCloudinary(file, 'barang-bukti')
      .then(res => {
        if (res?.url) setNewFotoBb(res.url);
      })
      .catch(err => {
        console.warn('Upload BB fallback to dataURL:', err);
      });
  };

  const handleUploadFotoLab = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewFotoLab(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadToCloudinary(file, 'hasil-lab')
      .then(res => {
        if (res?.url) setNewFotoLab(res.url);
      })
      .catch(err => {
        console.warn('Upload Lab fallback to dataURL:', err);
      });
  };

  const handleFileUpload = async (docId: string, file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (!allowed.includes(ext)) {
      alert(`Format file "${ext}" tidak diizinkan! Harap unggah dokumen dengan format PDF, JPG, atau PNG.`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(`Ukuran file "${file.name}" melebihi batas 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Silakan kompres dokumen terlebih dahulu.`);
      return;
    }

    setUploadingDocId(docId);
    setUploadedDocNames((prev) => ({ ...prev, [docId]: file.name }));
    try {
      const res = await uploadToCloudinary(file, 'berkas-permohonan');
      if (res?.url) {
        setUploadedDocUrls((prev) => ({ ...prev, [docId]: res.url }));
        if (!uploadedDocIds.includes(docId)) {
          setUploadedDocIds((prev) => [...prev, docId]);
        }
      }
    } catch (err) {
      console.warn('Upload Cloudinary gagal, menggunakan data lokal:', err);
      const localUrl = URL.createObjectURL(file);
      setUploadedDocUrls((prev) => ({ ...prev, [docId]: localUrl }));
      if (!uploadedDocIds.includes(docId)) {
        setUploadedDocIds((prev) => [...prev, docId]);
      }
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleRemoveDoc = (docId: string) => {
    setUploadedDocIds((prev) => prev.filter((id) => id !== docId));
    setUploadedDocUrls((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
    setUploadedDocNames((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
  };

  const handleSubmitAll = async () => {
    for (let s = 1; s <= 4; s++) {
      const val = getStepValidation(s);
      if (!val.isValid) {
        setValidationModal({
          isOpen: true,
          stepNumber: s,
          stepTitle: val.title,
          missingFields: val.missingFields
        });
        setStep(s);
        return;
      }
    }

    setIsSendingEmail(true);

    const fullDokumen: DokumenPersyaratan[] = getDocTemplates(jenisPengajuan).map((doc) => {
      const isAttached = Boolean(uploadedDocUrls[doc.id] || uploadedDocNames[doc.id]);
      return {
        id: doc.id,
        nama: doc.nama,
        kode: doc.kode,
        wajib: doc.wajib,
        fileUrl: uploadedDocUrls[doc.id] || undefined,
        fileName: uploadedDocNames[doc.id] || undefined,
        statusVerifikasi: isAttached ? 'belum_diperiksa' : 'belum_diunggah',
        keterangan: doc.keterangan,
        versi: 1
      };
    });

    const terperiksaPayload = {
      namaLengkap: namaLengkap.trim(),
      alias: alias.trim() || undefined,
      nik: nik.trim() || undefined,
      isNikVerified: Boolean(nik && nik.length >= 16),
      statusIdentitasKhusus: statusKhusus || undefined,
      tempatLahir: tempatLahir.trim(),
      tanggalLahir: tanggalLahir,
      usia: typeof usia === 'number' ? usia : (Number(usia) || 0),
      jenisKelamin: jenisKelamin,
      pekerjaan: pekerjaan.trim() || undefined,
      alamatKtp: alamatKtp.trim(),
      alamatDomisili: alamatKtp.trim() || undefined,
      namaWaliPendamping: namaWali.trim() || undefined,
      kontakWali: kontakWali.trim() || undefined
    };

    const perkaraPayload = {
      nomorLaporanPolisi: nomorLp.trim(),
      tanggalLp: tanggalLp,
      instansiPenyidik: currentUser.agency || 'Kepolisian Republik Indonesia',
      namaPenyidik: namaPenyidik.trim(),
      nomorHpPenyidik: nomorHpPenyidik.trim(),
      pasalDipersangkakan: pasal.trim(),
      tempatKejadianPerkara: tkp.trim(),
      tanggalWaktuPenangkapan: tanggalWaktuPenangkapan || undefined,
      kronologiSingkat: kronologi.trim(),
      barangBuktiList: barangBuktiList.map((bb) => ({
        jenisZat: bb.jenisZat,
        beratKotorGram: bb.beratKotorGram ? Number(bb.beratKotorGram) : undefined,
        beratBersihGram: Number(bb.beratBersihGram) || 0,
        statusUjiLab: bb.statusUjiLab || 'belum_uji',
        nomorSuratLab: bb.nomorSuratLab || undefined,
        tanggalSuratLab: bb.tanggalSuratLab || undefined,
        keterangan: bb.keterangan || undefined,
        fotoBarangBuktiUrl: bb.fotoBarangBuktiUrl || undefined,
        fotoUjiLabUrl: bb.fotoUjiLabUrl || undefined
      }))
    };

    const dokumenPayload = fullDokumen.map((doc) => ({
      nama: doc.nama,
      kode: doc.kode || undefined,
      wajib: doc.wajib,
      keterangan: doc.keterangan || undefined,
      fileUrl: doc.fileUrl || undefined,
      fileName: uploadedDocNames[doc.id] || (doc.fileUrl ? doc.nama + '.pdf' : undefined),
      statusVerifikasi: doc.statusVerifikasi,
      versi: 1
    }));

    const terperiksaData = {
      id: `terperiksa-${Date.now()}`,
      ...terperiksaPayload
    };

    const perkaraData = {
      id: `perkara-${Date.now()}`,
      ...perkaraPayload,
      barangBuktiList: barangBuktiList
    };

    let createdPermohonan: PermohonanAsesmen = {
      id: `tat-${Date.now()}`,
      nomorPermohonan: `TAT/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${Math.floor(100 + Math.random() * 900)}`,
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      jenisPengajuan: jenisPengajuan,
      metodePelaksanaan: metodePelaksanaan,
      satuanKerjaTujuan: satuanKerjaTujuan,
      applicationStatus: 'SUBMITTED',
      medicalStatus: 'NOT_STARTED',
      legalStatus: 'NOT_STARTED',
      deliveryStatus: 'NOT_ISSUED',
      followupStatus: 'NOT_APPLICABLE',
      statusProsesUtama: 'verifikasi_berkas',
      statusMedis: 'belum_dimulai',
      statusHukum: 'belum_dimulai',
      statusDokumen: 'draf',
      statusTindakLanjut: 'belum_dikonfirmasi',
      tenggatSlaTanggal: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isMendekatiTenggat: false,
      isMelewatiTenggat: false,
      pengajuId: currentUser.id,
      pengajuNama: currentUser.name,
      instansiPengaju: currentUser.agency,
      penanggungJawabBerikutnya: 'Sekretariat TAT',
      tindakanBerikutnyaLabel: 'Verifikasi Berkas Dokumen Persyaratan',
      terperiksa: terperiksaData,
      perkara: perkaraData,
      dokumenList: fullDokumen,
      klarifikasiList: [],
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pengajuan Baru',
          rincian: 'Permohonan berhasil dibuat dan diajukan oleh penyidik'
        }
      ]
    };

    // Save to real Backend API
    try {
      const payload = {
        satuanKerjaTujuan: satuanKerjaTujuan,
        jenisPengajuan: jenisPengajuan,
        metodePelaksanaan: metodePelaksanaan,
        terperiksa: terperiksaPayload,
        perkara: perkaraPayload,
        dokumenList: dokumenPayload
      };

      const res = await permohonanApi.create(payload);
      if (res.data && res.data.id) {
        try {
          const submitRes = await permohonanApi.submit(res.data.id);
          if (submitRes.data) {
            createdPermohonan = { ...createdPermohonan, ...submitRes.data };
          } else {
            createdPermohonan = { ...createdPermohonan, ...res.data, applicationStatus: 'SUBMITTED' };
          }
        } catch (submitErr) {
          console.warn('Auto-submit draft error, using created draft:', submitErr);
          createdPermohonan = { ...createdPermohonan, ...res.data, applicationStatus: 'SUBMITTED' };
        }
      }
    } catch (err: any) {
      console.error('Backend permohonan create error:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Gagal menyimpan pengajuan ke server';
      alert(`Peringatan server: ${errMsg}`);
    }

    // Send email notification
    try {
      const result = await sendPengajuanEmailNotification(createdPermohonan);
      if (result.success) {
        console.log('Notifikasi email berhasil dikirim via Resend API:', result.id);
      }
    } catch (e) {
      console.error('Error sending notification email:', e);
    } finally {
      setIsSendingEmail(false);
      isSubmittedRef.current = true;
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (e) {}
      onSubmit(createdPermohonan);
      onBack();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Wizard Bar */}
      <PengajuanWizardHeader
        currentStep={step}
        onStepClick={handleStepNavigation}
        onResetClick={handleResetDraft}
      />

      {/* Main Content Form Card */}
      <div className="bg-[#0b172a] rounded-2xl border border-[#1b3459] shadow-2xl p-6 md:p-8 space-y-6">
        {step === 1 && (
          <Step1IdentitasTerperiksa
            namaLengkap={namaLengkap}
            setNamaLengkap={setNamaLengkap}
            alias={alias}
            setAlias={setAlias}
            nik={nik}
            setNik={setNik}
            statusKhusus={statusKhusus}
            setStatusKhusus={setStatusKhusus}
            tempatLahir={tempatLahir}
            setTempatLahir={setTempatLahir}
            tanggalLahir={tanggalLahir}
            setTanggalLahir={setTanggalLahir}
            usia={usia}
            setUsia={setUsia}
            jenisKelamin={jenisKelamin}
            setJenisKelamin={setJenisKelamin}
            pekerjaan={pekerjaan}
            setPekerjaan={setPekerjaan}
            namaWali={namaWali}
            setNamaWali={setNamaWali}
            alamatKtp={alamatKtp}
            setAlamatKtp={setAlamatKtp}
            kontakWali={kontakWali}
            setKontakWali={setKontakWali}
            lamaPenggunaanZat={lamaPenggunaanZat}
            setLamaPenggunaanZat={setLamaPenggunaanZat}
            hasilTesUrinAwal={hasilTesUrinAwal}
            setHasilTesUrinAwal={setHasilTesUrinAwal}
            catatanProfilingPenyidik={catatanProfilingPenyidik}
            setCatatanProfilingPenyidik={setCatatanProfilingPenyidik}
          />
        )}

        {step === 2 && (
          <Step2RekamJejakNik
            namaLengkap={namaLengkap}
            alias={alias}
            nik={nik}
            isCheckingNik={isCheckingNik}
            checkNikDatabase={checkNikDatabase}
            statusResidivis={statusResidivis}
            dbRiwayat={dbRiwayat}
          />
        )}

        {step === 3 && (
          <Step3PerkaraBarangBukti
            jenisPengajuan={jenisPengajuan}
            setJenisPengajuan={setJenisPengajuan}
            metodePelaksanaan={metodePelaksanaan}
            setMetodePelaksanaan={setMetodePelaksanaan}
            satuanKerjaTujuan={satuanKerjaTujuan}
            setSatuanKerjaTujuan={setSatuanKerjaTujuan}
            nomorLp={nomorLp}
            setNomorLp={setNomorLp}
            tanggalLp={tanggalLp}
            setTanggalLp={setTanggalLp}
            tanggalWaktuPenangkapan={tanggalWaktuPenangkapan}
            setTanggalWaktuPenangkapan={setTanggalWaktuPenangkapan}
            namaPenyidik={namaPenyidik}
            setNamaPenyidik={setNamaPenyidik}
            nomorHpPenyidik={nomorHpPenyidik}
            setNomorHpPenyidik={setNomorHpPenyidik}
            pasal={pasal}
            setPasal={setPasal}
            tkp={tkp}
            setTkp={setTkp}
            kronologi={kronologi}
            setKronologi={setKronologi}
            barangBuktiList={barangBuktiList}
            handleAddBb={handleAddBb}
            handleRemoveBb={handleRemoveBb}
            newJenisZat={newJenisZat}
            setNewJenisZat={setNewJenisZat}
            newBerat={newBerat}
            setNewBerat={setNewBerat}
            newStatusLab={newStatusLab}
            setNewStatusLab={setNewStatusLab}
            newNomorLab={newNomorLab}
            setNewNomorLab={setNewNomorLab}
            newFotoBb={newFotoBb}
            setNewFotoBb={setNewFotoBb}
            handleUploadFotoBb={handleUploadFotoBb}
            newFotoLab={newFotoLab}
            setNewFotoLab={setNewFotoLab}
            handleUploadFotoLab={handleUploadFotoLab}
          />
        )}

        {step === 4 && (
          <Step4KelengkapanDokumen
            jenisPengajuan={jenisPengajuan}
            uploadedDocIds={uploadedDocIds}
            uploadedDocUrls={uploadedDocUrls}
            uploadedDocNames={uploadedDocNames}
            uploadingDocId={uploadingDocId}
            handleFileUpload={handleFileUpload}
            handleRemoveDoc={handleRemoveDoc}
          />
        )}

        {step === 5 && (
          <Step5KonfirmasiPengajuan
            namaLengkap={namaLengkap}
            nik={nik}
            statusResidivis={statusResidivis}
            nomorLp={nomorLp}
            pasal={pasal}
            barangBuktiCount={barangBuktiList.length}
            uploadedDocIds={uploadedDocIds}
            jenisPengajuan={jenisPengajuan}
            agencyName={currentUser.agency || ''}
          />
        )}

        {/* Footer Navigation Buttons */}
        <PengajuanFooterNav
          step={step}
          isSendingEmail={isSendingEmail}
          onBack={onBack}
          onPrevStep={() => setStep(step - 1)}
          onNextStep={() => handleStepNavigation(step + 1)}
          onSubmit={handleSubmitAll}
        />
      </div>

      {/* Validation Modal */}
      <ModalValidasiPengajuan
        isOpen={Boolean(validationModal && validationModal.isOpen)}
        stepTitle={validationModal?.stepTitle || ''}
        missingFields={validationModal?.missingFields || []}
        onClose={() => setValidationModal(null)}
      />

      {/* Reset Confirmation Modal */}
      <ModalResetPengajuan
        isOpen={showResetConfirmModal}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirmModal(false)}
      />
    </div>
  );
};
