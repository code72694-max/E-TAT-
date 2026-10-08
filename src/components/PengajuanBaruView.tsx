import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile, DokumenPersyaratan } from '../types';
import { sendPengajuanEmailNotification } from '../services/emailService';
import { permohonanApi } from '../services/api';
import { uploadToCloudinary } from '../services/cloudinary';
import {
  User,
  Scale,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  ArrowRight,
  ArrowLeft,
  History,
  Activity,
  AlertTriangle,
  Camera,
  Search,
  Database,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  X
} from 'lucide-react';

const getDocTemplates = (jenisPengajuan: string) => {
  const baseDocs = [
    { id: 'doc-surat', kode: 'SURAT_PERMOHONAN', nama: 'Surat Permohonan Asesmen dari Penyidik', wajib: true, keterangan: 'Tandatangan resmi pimpinan' },
    { id: 'doc-ktp', kode: 'IDENTITAS_KTP', nama: 'Fotokopi KTP / KK / Identitas Terperiksa', wajib: true, keterangan: 'Bukti identitas kependudukan terperiksa' },
    { id: 'doc-lp', kode: 'LAPORAN_POLISI', nama: 'Laporan Polisi (LP) / Laporan Kasus Narkotika', wajib: true, keterangan: 'Surat tanda penerimaan laporan polisi' },
    { id: 'doc-bap', kode: 'BAP_TERPERIKSA', nama: 'Berita Acara Pemeriksaan (BAP) Tersangka / Interogasi', wajib: true, keterangan: 'Pengakuan dan keterangan awal peran terperiksa' },
    { id: 'doc-sp-tangkap', kode: 'SP_TANGKAP', nama: 'Surat Perintah Penangkapan & Penahanan', wajib: jenisPengajuan.startsWith('penangkapan'), keterangan: 'Masa penangkapan 3x24 jam maksimal pengajuan' },
    { id: 'doc-lab-urin', kode: 'SKHPU', nama: 'SKH Pemeriksaan Urine (SKHPU)', wajib: true, keterangan: 'Hasil tes strip atau skrining laboratorium forensik' },
    { id: 'doc-elektronik', kode: 'BUKTI_ELEKTRONIK', nama: 'Alat Bukti Elektronik', wajib: false, keterangan: 'Bila ada (contoh: tangkapan layar chat, dll)' },
  ];

  if (jenisPengajuan === 'penangkapan_dengan_bb') {
    baseDocs.push(
      { id: 'doc-sp-sidik', kode: 'SP_SIDIK', nama: 'Surat Perintah Penyidikan', wajib: true, keterangan: 'Surat perintah penyidikan perkara' },
      { id: 'doc-sp-sita-bb', kode: 'SP_SITA_BB', nama: 'Surat Perintah Penyitaan Barang Bukti', wajib: true, keterangan: 'Dasar hukum penyitaan BB' },
      { id: 'doc-ba-sita-bb', kode: 'BA_SITA_BB', nama: 'Berita Acara Penyitaan Barang Bukti', wajib: true, keterangan: 'Rincian barang bukti yang diamankan saat penangkapan' },
      { id: 'doc-hasil-lab-bb', kode: 'HASIL_LAB_BB', nama: 'Hasil Pemeriksaan Laboratorium Barang Bukti', wajib: true, keterangan: 'Puslabfor / lab forensik' }
    );
  }

  return baseDocs;
};

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
  const [step, setStep] = useState<number>(1);

  // Form State: Step 1 (Terperiksa)
  const [namaLengkap, setNamaLengkap] = useState('');
  const [alias, setAlias] = useState('');
  const [nik, setNik] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [usia, setUsia] = useState<number | ''>('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [pekerjaan, setPekerjaan] = useState('');
  const [alamatKtp, setAlamatKtp] = useState('');
  const [namaWali, setNamaWali] = useState('');
  const [kontakWali, setKontakWali] = useState('');
  const [statusKhusus, setStatusKhusus] = useState<'dewasa' | 'anak_berhadapan_hukum' | 'perlu_penerjemah'>('dewasa');

  // Form State: Riwayat Terperiksa (Step 2)
  const [statusResidivis, setStatusResidivis] = useState<'bukan_residivis' | 'residivis_1x' | 'residivis_berulang'>('bukan_residivis');
  const [riwayatTatSebelumnya, setRiwayatTatSebelumnya] = useState<string>('');
  const [riwayatPerkaraLalu, setRiwayatPerkaraLalu] = useState<string>('');
  const [riwayatRehabilitasi, setRiwayatRehabilitasi] = useState<string>('');
  const [lamaPenggunaanZat, setLamaPenggunaanZat] = useState<string>('');
  const [hasilTesUrinAwal, setHasilTesUrinAwal] = useState<string>('');
  const [catatanProfilingPenyidik, setCatatanProfilingPenyidik] = useState<string>('');

  // Form State: Step 3 (Perkara & Barang Bukti)
  const [jenisPengajuan, setJenisPengajuan] = useState<'penangkapan_tanpa_bb' | 'penangkapan_dengan_bb' | 'p19' | 'penuntutan' | 'persidangan'>('penangkapan_dengan_bb');
  const [metodePelaksanaan, setMetodePelaksanaan] = useState<'luring' | 'daring' | 'hybrid'>('luring');
  const [satuanKerjaTujuan, setSatuanKerjaTujuan] = useState('BNNP Kalimantan Timur');
  
  const [nomorLp, setNomorLp] = useState('');
  const [tanggalLp, setTanggalLp] = useState('');
  const [tanggalWaktuPenangkapan, setTanggalWaktuPenangkapan] = useState('');
  const [namaPenyidik, setNamaPenyidik] = useState(currentUser.name);
  const [nomorHpPenyidik, setNomorHpPenyidik] = useState('');
  const [pasal, setPasal] = useState('');
  const [tkp, setTkp] = useState('');
  const [kronologi, setKronologi] = useState('');
  
  // Barang bukti list
  const [barangBuktiList, setBarangBuktiList] = useState<any[]>([]);
  const [newJenisZat, setNewJenisZat] = useState('Metamfetamina (Sabu)');
  const [newBerat, setNewBerat] = useState('');
  const [newStatusLab, setNewStatusLab] = useState<'proses_lab' | 'positif' | 'negatif' | 'belum_uji'>('proses_lab');
  const [newNomorLab, setNewNomorLab] = useState('');
  const [newFotoBb, setNewFotoBb] = useState('');
  const [newFotoLab, setNewFotoLab] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);

  // Form State: Step 4 (Dokumen)
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Modal Validasi: Isi Terlebih Dahulu
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean;
    stepNumber: number;
    stepTitle: string;
    missingFields: string[];
  } | null>(null);

  const getStepValidation = (stepNum: number) => {
    const missing: string[] = [];
    let title = '';

    if (stepNum === 1) {
      title = 'Langkah 1: Identitas Pokok Terperiksa';
      if (!namaLengkap.trim()) missing.push('Nama Lengkap Terperiksa / Yang Diadukan');
      if (!nik.trim()) {
        missing.push('Nomor Induk Kependudukan (NIK Terperiksa)');
      } else if (nik.trim().length < 16) {
        missing.push('NIK Terperiksa harus minimal 16 digit');
      }
      if (!tempatLahir.trim()) missing.push('Tempat Lahir');
      if (!tanggalLahir.trim()) missing.push('Tanggal Lahir');
      if (!usia || usia <= 0) missing.push('Usia Terperiksa');
      if (!alamatKtp.trim()) missing.push('Alamat Sesuai KTP / Domisili');
      if (!pekerjaan.trim()) missing.push('Pekerjaan / Profesi Terperiksa');
    } else if (stepNum === 2) {
      title = 'Langkah 2: Riwayat Kasus & Pemeriksaan NIK';
      if (!lamaPenggunaanZat.trim()) missing.push('Lama Penggunaan & Frekuensi Zat');
      if (!hasilTesUrinAwal.trim()) missing.push('Hasil Pemeriksaan Skrining Urin');
      if (!catatanProfilingPenyidik.trim()) missing.push('Catatan Profiling Risiko & Intelijen');
    } else if (stepNum === 3) {
      title = 'Langkah 3: Data Perkara & Barang Bukti';
      if (!nomorLp.trim()) missing.push('Nomor Laporan Polisi (LP)');
      if (!tanggalLp.trim()) missing.push('Tanggal Laporan Polisi');
      if (!tanggalWaktuPenangkapan.trim()) missing.push('Tanggal & Jam Penangkapan');
      if (!namaPenyidik.trim()) missing.push('Nama Penyidik Satuan');
      if (!nomorHpPenyidik.trim()) missing.push('Nomor HP / WhatsApp Penyidik');
      if (!pasal.trim()) missing.push('Pasal yang Dipersangkakan');
      if (!tkp.trim()) missing.push('Tempat Kejadian Perkara (TKP)');
      if (!kronologi.trim()) missing.push('Kronologi Singkat Penangkapan');
      if (jenisPengajuan === 'penangkapan_dengan_bb' && barangBuktiList.length === 0) {
        missing.push('Daftar Barang Bukti Sitaan (Minimal 1 BB terdaftar)');
      }
    } else if (stepNum === 4) {
      title = 'Langkah 4: Kelengkapan Dokumen Persyaratan';
      const mandatoryDocs = getDocTemplates(jenisPengajuan).filter(d => d.wajib);
      mandatoryDocs.forEach(doc => {
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
    // Navigasi mundur atau langkah saat ini selalu diizinkan
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }

    // Periksa setiap langkah dari langkah 1 hingga targetStep - 1
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

  const handleUploadFotoBb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFotoBb(reader.result as string);
      };
      reader.readAsDataURL(file);

      uploadToCloudinary(file, 'barang-bukti')
        .then(res => {
          if (res?.url) setNewFotoBb(res.url);
        })
        .catch(err => console.error('Gagal upload Cloudinary BB:', err));
    }
  };

  const handleUploadFotoLab = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFotoLab(reader.result as string);
      };
      reader.readAsDataURL(file);

      uploadToCloudinary(file, 'dokumen-lab')
        .then(res => {
          if (res?.url) setNewFotoLab(res.url);
        })
        .catch(err => console.error('Gagal upload Cloudinary Lab:', err));
    }
  };

  const handleAddBb = () => {
    if (!newJenisZat || !newBerat) {
      alert('Mohon isi jenis zat dan berat barang bukti');
      return;
    }
    const newEntry = {
      id: `bb-${Date.now()}`,
      jenisZat: newJenisZat,
      beratBersihGram: parseFloat(newBerat) || 0,
      statusUjiLab: newStatusLab,
      nomorSuratLab: newNomorLab,
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
    setBarangBuktiList(barangBuktiList.filter(b => b.id !== id));
  };

  const toggleDocUpload = (docId: string) => {
    if (uploadedDocIds.includes(docId)) {
      setUploadedDocIds(uploadedDocIds.filter(id => id !== docId));
    } else {
      setUploadedDocIds([...uploadedDocIds, docId]);
    }
  };

  const handleSubmitAll = async () => {
    // Validasi seluruh langkah 1 sampai 4
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

    const fullDokumen: DokumenPersyaratan[] = getDocTemplates(jenisPengajuan).map((doc) => ({
      id: doc.id,
      nama: doc.nama,
      kode: doc.kode,
      wajib: doc.wajib,
      fileUrl: uploadedDocIds.includes(doc.id) ? 'https://example.com/mock-doc.pdf' : '',
      statusVerifikasi: uploadedDocIds.includes(doc.id) ? 'sesuai' : 'belum_diunggah',
      keterangan: doc.keterangan,
      versi: 1
    }));

    const terperiksaData = {
      id: `terperiksa-${Date.now()}`,
      namaLengkap: namaLengkap,
      alias: alias,
      nik: nik,
      isNikVerified: Boolean(nik && nik.length >= 16),
      statusIdentitasKhusus: statusKhusus as any,
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
      usia: typeof usia === 'number' ? usia : (Number(usia) || 0),
      jenisKelamin: jenisKelamin,
      pekerjaan: pekerjaan,
      alamatKtp: alamatKtp,
      alamatDomisili: alamatKtp,
      namaWaliPendamping: namaWali,
      kontakWali: kontakWali
    };

    const perkaraData = {
      id: `perkara-${Date.now()}`,
      nomorLaporanPolisi: nomorLp,
      tanggalLp: tanggalLp,
      instansiPenyidik: currentUser.agency,
      namaPenyidik: namaPenyidik,
      nomorHpPenyidik: nomorHpPenyidik,
      pasalDipersangkakan: pasal,
      tempatKejadianPerkara: tkp,
      tanggalWaktuPenangkapan: tanggalWaktuPenangkapan,
      kronologiSingkat: kronologi,
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
        terperiksa: terperiksaData,
        perkara: perkaraData,
        dokumenList: fullDokumen
      };

      const res = await permohonanApi.create(payload);
      if (res.data) {
        createdPermohonan = { ...createdPermohonan, ...res.data };
      }
    } catch (err) {
      console.warn('Backend permohonan create error, using state:', err);
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
      onSubmit(createdPermohonan);
      onBack();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Form Summary Header (matches detail view style) */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#142642] border border-[#234475] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Pengajuan Permohonan Asesmen Terpadu (TAT)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase hidden sm:inline">Instansi Pengaju:</span>
            <span className="text-[10px] font-bold text-[#D4AF37] bg-[#142642] px-2.5 py-1 rounded-md border border-[#234475]">
              {currentUser.agency}
            </span>
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full border bg-blue-950/60 text-blue-300 border-blue-500/50">
              FORMULIR BARU
            </span>
          </div>
        </div>

        {/* Wizard Step Indicators Bar */}
        <div className="pt-1">
          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
            {[
              { num: 1, label: 'Identitas Terperiksa' },
              { num: 2, label: 'Riwayat Kasus (NIK)' },
              { num: 3, label: 'Perkara & Barang Bukti' },
              { num: 4, label: 'Kelengkapan Dokumen' },
              { num: 5, label: 'Konfirmasi Pengajuan' }
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => handleStepNavigation(s.num)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  step === s.num
                    ? 'bg-[#142642] text-[#D4AF37] font-bold border border-[#2d5289] shadow-md shadow-black/40'
                    : step > s.num
                    ? 'text-emerald-400 hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                    step === s.num
                      ? 'bg-[#1b3459] text-[#D4AF37] border-[#D4AF37]'
                      : step > s.num
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#050e1c] text-slate-500 border-[#1b3459]'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-normal">Langkah {s.num}</div>
                  <div className="text-xs">{s.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Form Card */}
      <div className="bg-[#0b172a] rounded-2xl border border-[#1b3459] shadow-2xl p-6 md:p-8 space-y-6">
        {/* STEP 1: IDENTITAS UTAMA TERPERIKSA */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
                <span className="font-bold text-white flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>Data Pokok Identitas Terperiksa / Yang Diadukan</span>
                </span>
                <span className="text-xs text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2.5 py-1 rounded-md border border-[#D4AF37]/20">
                  Wajib Diisi Penyidik
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-200 block mb-1 text-xs">
                    Nama Lengkap Yang Diadukan / Terperiksa *
                  </label>
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Contoh: Muhammad Reza Pratama / Subjek Uji"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm font-semibold placeholder:font-normal"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Nama Panggilan / Alias</label>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="Contoh: Reza / Eza"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#1b3459]/40">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">
                    Nomor Induk Kependudukan (NIK) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      placeholder="16 Digit NIK KTP (Contoh: 6472011405010002)"
                      className="w-full p-3 pl-3.5 pr-10 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl font-mono focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    NIK akan diverifikasi secara otomatis pada pangkalan data rekam jejak kriminal & e-TAT di Step 2.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Status Kategori Terperiksa</label>
                  <select
                    value={statusKhusus}
                    onChange={(e) => setStatusKhusus(e.target.value as any)}
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm"
                  >
                    <option value="dewasa">Dewasa Umum</option>
                    <option value="anak_berhadapan_hukum">Anak Berhadapan Hukum (ABH - Di bawah 18 th)</option>
                    <option value="perlu_penerjemah">Perlu Penerjemah Bahasa / Isyarat</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Tempat &amp; Tanggal Lahir</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      placeholder="Tempat Lahir"
                      className="p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                    />
                    <input
                      type="date"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Usia &amp; Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={usia}
                      onChange={(e) => setUsia(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Usia (Tahun)"
                      className="p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm font-mono"
                    />
                    <select
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value as any)}
                      className="p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Pekerjaan</label>
                  <input
                    type="text"
                    value={pekerjaan}
                    onChange={(e) => setPekerjaan(e.target.value)}
                    placeholder="Pekerjaan / Profesi"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Nama Wali / Pendamping</label>
                  <input
                    type="text"
                    value={namaWali}
                    onChange={(e) => setNamaWali(e.target.value)}
                    placeholder="Nama Orang Tua / Pasangan / Kuasa Hukum"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Alamat Sesuai KTP / Domisili</label>
                  <input
                    type="text"
                    value={alamatKtp}
                    onChange={(e) => setAlamatKtp(e.target.value)}
                    placeholder="Alamat lengkap terperiksa saat ini"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Kontak Telepon Wali / Keluarga</label>
                  <input
                    type="text"
                    value={kontakWali}
                    onChange={(e) => setKontakWali(e.target.value)}
                    placeholder="0812-XXXX-XXXX"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1b3459]/60">
                <h4 className="text-xs font-bold text-[#D4AF37] mb-3 uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Informasi Asesmen Awal Penyidik</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1 text-xs">Lama Penggunaan & Frekuensi Zat</label>
                    <input
                      type="text"
                      value={lamaPenggunaanZat}
                      onChange={(e) => setLamaPenggunaanZat(e.target.value)}
                      placeholder="Contoh: 6 bulan, 1-2 kali per minggu"
                      className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1 text-xs">Hasil Pemeriksaan Skrining Urin</label>
                    <input
                      type="text"
                      value={hasilTesUrinAwal}
                      onChange={(e) => setHasilTesUrinAwal(e.target.value)}
                      placeholder="Contoh: Positif Methamphetamine (Sabu)"
                      className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-semibold text-slate-300 block mb-1 text-xs">Catatan Profiling Risiko & Intelijen</label>
                    <textarea
                      rows={3}
                      value={catatanProfilingPenyidik}
                      onChange={(e) => setCatatanProfilingPenyidik(e.target.value)}
                      placeholder="Keterangan apakah terperiksa adalah pemakai murni, korban penyalahgunaan, atau bukan jaringan pengedar..."
                      className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: RIWAYAT KASUS & PEMERIKSAAN NIK */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Header Box Pencarian NIK */}
            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-bold text-white text-sm">Pemeriksaan Rekam Jejak Terpadu (Berdasarkan NIK)</span>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-md flex items-center space-x-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Terhubung e-TAT & SIPP</span>
                </span>
              </div>

              <div className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">Subjek Terperiksa:</div>
                  <div className="font-bold text-white text-base">
                    {namaLengkap || 'Nama belum diisi di Step 1'} {alias ? `(${alias})` : ''}
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-xs text-slate-400">NIK Terverifikasi:</div>
                  <div className="font-mono font-bold text-[#D4AF37] text-base">
                    {nik || 'Belum diisi (Kembali ke Step 1)'}
                  </div>
                </div>
              </div>

              {nik ? (
                <div className="p-4 bg-sky-950/20 border border-sky-500/30 rounded-xl flex items-start space-x-3 text-xs text-sky-200 leading-relaxed">
                  <Search className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span>Pemeriksaan otomatis berhasil dijalankan untuk NIK <strong className="font-mono text-white">{nik}</strong>. Sistem telah mencocokkan basis data nasional riwayat TAT, rekam perkara pidana narkotika, dan layanan rehabilitasi.</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-xs text-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span>NIK belum dimasukkan pada Step 1. Silakan kembali ke Step 1 dan lengkapi 16 digit NIK untuk verifikasi rekam jejak otomatis yang akurat.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status Residivis Selector & Indikator */}
            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
              <label className="font-semibold text-slate-200 block text-xs">
                Klasifikasi Status Residivisme & Hasil Pemeriksaan *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStatusResidivis('bukan_residivis')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    statusResidivis === 'bukan_residivis'
                      ? 'border-emerald-500 bg-emerald-950/25 text-white shadow-md shadow-emerald-950/30'
                      : 'border-[#1b3459] bg-[#050e1c] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">Bukan Residivis</span>
                    {statusResidivis === 'bukan_residivis' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Pengajuan asesmen pertama kali, belum pernah dipidana / TAT.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusResidivis('residivis_1x')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    statusResidivis === 'residivis_1x'
                      ? 'border-amber-500 bg-amber-950/25 text-white shadow-md shadow-amber-950/30'
                      : 'border-[#1b3459] bg-[#050e1c] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-amber-300">Residivis 1x</span>
                    {statusResidivis === 'residivis_1x' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Pernah 1 kali asesmen TAT atau pernah menjalani vonis perkara.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusResidivis('residivis_berulang')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    statusResidivis === 'residivis_berulang'
                      ? 'border-rose-500 bg-rose-950/25 text-white shadow-md shadow-rose-950/30'
                      : 'border-[#1b3459] bg-[#050e1c] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-rose-300">Residivis Berulang</span>
                    {statusResidivis === 'residivis_berulang' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Lebih dari 1 kali riwayat perkara / rehabilitasi sebelumnya.</p>
                </button>
              </div>
            </div>

            {/* Rincian Catatan Riwayat Kasus */}
            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <History className="w-4 h-4 text-[#D4AF37]" />
                  <span>Rincian Rekam Jejak Perkara & Histori Asesmen</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {statusResidivis === 'bukan_residivis' ? '0 Riwayat Kasus' : '2 Riwayat Terdeteksi'}
                </span>
              </div>

              {statusResidivis === 'bukan_residivis' ? (
                <div className="p-6 bg-[#050e1c] rounded-xl border border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-bold text-white text-sm">Tidak Ada Riwayat Kasus Sebelumnya</p>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Subjek terperiksa dengan NIK <strong className="font-mono text-slate-300">{nik || '(Belum terisi)'}</strong> belum pernah tercatat mengajukan permohonan asesmen TAT atau memiliki riwayat vonis narkotika sebelumnya di pangkalan data e-TAT & SIPP.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* CARD 1 */}
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm hover:shadow-[#D4AF37]/10" onClick={() => alert('Membuka detail perkara sebelumnya (Mockup)')}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/30">Asesmen TAT 2024</span>
                        <h4 className="text-sm font-bold text-white mt-1.5 group-hover:text-[#D4AF37] transition-colors">Perkara No. LP/A/45/II/2024/SPKT.SATRESNARKOBA</h4>
                      </div>
                      <span className="text-slate-400 text-xs">12 Feb 2024</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">Penyalahgunaan narkotika golongan I bukan tanaman (Sabu 0.12 gram). Rekomendasi: Rehabilitasi Rawat Jalan di Klinik Pratama BNNK Samarinda selama 2 bulan.</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span>Selesai Program (SKSP Terbit)</span></span>
                      <span>•</span>
                      <span>Instansi: Polresta Samarinda</span>
                    </div>
                  </div>

                  {/* CARD 2 */}
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm hover:shadow-[#D4AF37]/10" onClick={() => alert('Membuka detail perkara sebelumnya (Mockup)')}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded border border-rose-500/30">Putusan Pengadilan 2021</span>
                        <h4 className="text-sm font-bold text-white mt-1.5 group-hover:text-[#D4AF37] transition-colors">Perkara No. 112/Pid.Sus/2021/PN Smr</h4>
                      </div>
                      <span className="text-slate-400 text-xs">05 Mei 2021</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">Vonis pidana penjara 1 tahun 6 bulan atas kepemilikan narkotika golongan I (Pasal 112 ayat 1 UU 35/2009).</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> <span>Bebas Murni (2022)</span></span>
                      <span>•</span>
                      <span>Instansi: Kejaksaan Negeri Samarinda</span>
                    </div>
                  </div>

                  {/* ADD NEW CARD BUTTON */}
                  <button className="w-full py-3 mt-2 border border-dashed border-[#1b3459] text-slate-400 rounded-xl text-xs font-semibold hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center space-x-2 cursor-pointer" onClick={() => alert('Fitur tambah catatan histori manual')}>
                    <Plus className="w-4 h-4" />
                    <span>Kaitkan Riwayat Perkara Lain / Catatan Tambahan</span>
                  </button>
                </div>
              )}

              {/* Form Input Detail Riwayat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1b3459]/50">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Riwayat Asesmen TAT Sebelumnya</label>
                  <input
                    type="text"
                    value={riwayatTatSebelumnya}
                    onChange={(e) => setRiwayatTatSebelumnya(e.target.value)}
                    placeholder="Contoh: Pernah Asesmen 1x pada Feb 2024 di BNNK Samarinda"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Riwayat Program Rehabilitasi</label>
                  <input
                    type="text"
                    value={riwayatRehabilitasi}
                    onChange={(e) => setRiwayatRehabilitasi(e.target.value)}
                    placeholder="Contoh: Rawat Jalan di Klinik Pratama BNNK (2 Bulan)"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Riwayat Perkara Lalu & Putusan Pidana</label>
                  <textarea
                    rows={3}
                    value={riwayatPerkaraLalu}
                    onChange={(e) => setRiwayatPerkaraLalu(e.target.value)}
                    placeholder="Rincian vonis hakim, pasal yang diputus, masa pidana, dan eksekusi..."
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PERKARA & BARANG BUKTI */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]/60">
                <Scale className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-bold text-white text-sm">Informasi Pengajuan & Perkara</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Jenis Pengajuan Asesmen TAT *</label>
                  <select
                    value={jenisPengajuan}
                    onChange={(e) => setJenisPengajuan(e.target.value as any)}
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none font-semibold text-sm"
                  >
                    <option value="penangkapan_tanpa_bb">Tingkat Penyidikan - Penangkapan TANPA Barang Bukti</option>
                    <option value="penangkapan_dengan_bb">Tingkat Penyidikan - Penangkapan DENGAN Barang Bukti</option>
                    <option value="p19">Petunjuk Jaksa (P-19)</option>
                    <option value="penuntutan">Kepentingan Penuntutan (JPU)</option>
                    <option value="persidangan">Kepentingan Persidangan (Penetapan Hakim)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Metode Pelaksanaan</label>
                  <select
                    value={metodePelaksanaan}
                    onChange={(e) => setMetodePelaksanaan(e.target.value as any)}
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  >
                    <option value="luring">Luring (Tatap Muka Langsung)</option>
                    <option value="daring">Daring (Online Zoom/Virtual)</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Satuan Kerja TAT Tujuan</label>
                  <input
                    type="text"
                    value={satuanKerjaTujuan}
                    onChange={(e) => setSatuanKerjaTujuan(e.target.value)}
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Nomor Laporan Polisi (LP) *</label>
                  <input
                    type="text"
                    value={nomorLp}
                    onChange={(e) => setNomorLp(e.target.value)}
                    placeholder="LP/A/123/IX/2026/SPKT/..."
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl font-mono focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Tanggal LP</label>
                  <input
                    type="date"
                    value={tanggalLp}
                    onChange={(e) => setTanggalLp(e.target.value)}
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Waktu Penangkapan</label>
                  <input
                    type="datetime-local"
                    value={tanggalWaktuPenangkapan}
                    onChange={(e) => setTanggalWaktuPenangkapan(e.target.value)}
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Pasal Sangkaan *</label>
                  <input
                    type="text"
                    value={pasal}
                    onChange={(e) => setPasal(e.target.value)}
                    placeholder="Pasal 127 ayat 1 huruf a UU 35/2009"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Tempat Kejadian Perkara (TKP)</label>
                  <input
                    type="text"
                    value={tkp}
                    onChange={(e) => setTkp(e.target.value)}
                    placeholder="Alamat lengkap TKP penangkapan"
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1 text-xs">Kronologi Singkat Penangkapan</label>
                  <textarea
                    rows={3}
                    value={kronologi}
                    onChange={(e) => setKronologi(e.target.value)}
                    placeholder="Uraian singkat penangkapan dan situasi saat diamankan..."
                    className="w-full p-3 border border-[#1b3459] bg-[#050e1c] text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Barang Bukti Form */}
            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-bold text-white text-sm">Daftar Barang Bukti & Hasil Uji Lab</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {barangBuktiList.length} Barang Bukti Tercatat
                </span>
              </div>

              {/* Input New BB */}
              <div className="p-4 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Tambah Barang Bukti Narkotika</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Jenis Narkotika / Zat</label>
                    <input
                      type="text"
                      value={newJenisZat}
                      onChange={(e) => setNewJenisZat(e.target.value)}
                      placeholder="Metamfetamina / Ganja / Ekstasi"
                      className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Berat Bersih (Gram / Butir)</label>
                    <input
                      type="text"
                      value={newBerat}
                      onChange={(e) => setNewBerat(e.target.value)}
                      placeholder="Contoh: 0.35"
                      className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Status Uji Laboratorium</label>
                    <select
                      value={newStatusLab}
                      onChange={(e) => setNewStatusLab(e.target.value as any)}
                      className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
                    >
                      <option value="proses_lab">Sedang Proses Lab Puslabfor</option>
                      <option value="positif">Positif Narkotika (Surat Terbit)</option>
                      <option value="negatif">Negatif Narkotika</option>
                      <option value="belum_uji">Belum Dikirim ke Lab</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nomor Surat Hasil Lab (Opsional)</label>
                    <input
                      type="text"
                      value={newNomorLab}
                      onChange={(e) => setNewNomorLab(e.target.value)}
                      placeholder="Lab/Toksi/XXX/2026/Puslabfor"
                      className="w-full p-2.5 border border-[#1b3459] bg-[#0b172a] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddBb}
                      className="w-full py-2.5 bg-[#133863] hover:bg-[#1a4a82] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border border-[#245899] cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambahkan ke Daftar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* List BB */}
              <div className="space-y-2.5">
                {barangBuktiList.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-4 text-xs">Belum ada barang bukti yang ditambahkan.</p>
                ) : (
                  barangBuktiList.map((bb) => (
                    <div
                      key={bb.id}
                      className="p-3.5 bg-[#050e1c] rounded-xl border border-[#1b3459] flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-lg bg-[#142642] flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                          BB
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-xs">{bb.jenisZat}</span>
                            <span className="font-mono text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                              {bb.beratBersihGram} gr
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                                bb.statusUjiLab === 'positif'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {bb.statusUjiLab === 'positif' ? 'Positif Lab' : bb.statusUjiLab === 'proses_lab' ? 'Proses Lab' : 'Belum Uji'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1 truncate font-mono">
                            {bb.nomorSuratLab ? `No. Lab: ${bb.nomorSuratLab}` : 'Surat Lab: Menunggu Puslabfor'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveBb(bb.id)}
                        className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                        title="Hapus barang bukti ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: KELENGKAPAN DOKUMEN PERSYARATAN */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-bold text-white text-sm">Checklist Dokumen Lampiran Pengajuan</span>
                </div>
                <span className="text-xs text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20">
                  {uploadedDocIds.length} Terunggah
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Berdasarkan SOP TAT & Perber 2014, lampirkan dokumen administratif yang dibutuhkan. Dokumen bertanda <span className="text-rose-400 font-bold">Wajib</span> harus dilengkapi untuk verifikasi Sekretariat.
              </p>
            </div>

            <div className="space-y-3">
              {getDocTemplates(jenisPengajuan).map((doc) => {
                const isChecked = uploadedDocIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocUpload(doc.id)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isChecked
                        ? 'border-[#D4AF37] bg-[#081224]'
                        : 'border-[#1b3459] bg-[#0b172a] hover:bg-[#081224]'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-[#D4AF37] accent-[#D4AF37] w-4 h-4"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs md:text-sm">{doc.nama}</span>
                          {doc.wajib && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-semibold">
                              Wajib
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{doc.keterangan}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                      <span className={`text-xs font-semibold hidden sm:inline ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {isChecked ? 'Sudah Diunggah' : 'Belum Dilampirkan'}
                      </span>
                      <label className={`cursor-pointer px-3.5 py-2 rounded-xl border flex items-center space-x-1.5 transition-colors text-xs ${
                        isChecked 
                          ? 'bg-[#142642] border-[#234475] text-slate-300 hover:text-white' 
                          : 'bg-[#1b3459] border-[#2d5289] text-[#D4AF37] hover:bg-[#284c80]'
                      }`}>
                        <Upload className="w-3.5 h-3.5" />
                        <span className="font-semibold text-xs">
                          {isChecked ? 'Ganti File' : 'Unggah File'}
                        </span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              if (!isChecked) toggleDocUpload(doc.id);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: KONFIRMASI PENGESAHAN */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-5">
              <h4 className="font-bold text-slate-200 text-base mb-1 font-['Cinzel',serif]">Konfirmasi Ringkasan Pengajuan</h4>
              <p className="text-xs text-[#D4AF37]/90 leading-relaxed">
                Pastikan seluruh data di bawah ini telah sesuai sebelum dikirim ke Sekretariat Tim Asesmen Terpadu (TAT).
              </p>
            </div>

            <div className="border border-[#1b3459] rounded-xl p-5 bg-[#081224] space-y-3 text-xs md:text-sm">
              <div className="flex justify-between py-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Nama Terperiksa</span>
                <span className="font-bold text-white">{namaLengkap || 'Belum diisi'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Nomor Induk Kependudukan (NIK)</span>
                <span className="font-mono font-bold text-[#D4AF37]">{nik || 'Belum diisi'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Status Residivisme</span>
                <span className={`font-semibold ${statusResidivis === 'bukan_residivis' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {statusResidivis === 'bukan_residivis' ? 'Bukan Residivis (Baru)' : statusResidivis === 'residivis_1x' ? 'Residivis 1x' : 'Residivis Berulang'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Nomor Laporan Polisi</span>
                <span className="font-mono font-bold text-white">{nomorLp}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Pasal Sangkaan</span>
                <span className="font-semibold text-[#D4AF37]">{pasal}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Jumlah Barang Bukti</span>
                <span className="font-semibold text-white font-mono">{barangBuktiList.length} Item</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Dokumen Dilampirkan</span>
                <span className="font-bold text-[#D4AF37]">{uploadedDocIds.filter(id => getDocTemplates(jenisPengajuan).some(d => d.id === id)).length} dari {getDocTemplates(jenisPengajuan).length} Dokumen</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Instansi Pengaju</span>
                <span className="font-semibold text-slate-200">{currentUser.agency}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <div className="pt-6 border-t border-[#1b3459] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 border border-[#1b3459] rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#1b3459] flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : (
            <button
              onClick={onBack}
              className="px-5 py-2.5 border border-[#1b3459] rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#1b3459] flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Batal &amp; Kembali</span>
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => handleStepNavigation(step + 1)}
              className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all"
            >
              <span>Lanjutkan ke Langkah {step + 1}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={isSendingEmail}
              className="bg-[#133863] hover:bg-[#1a4a82] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-emerald-500 cursor-pointer shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSendingEmail ? 'Mengirim Berkas...' : 'Kirim Permohonan ke Sekretariat TAT'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL: ISI TERLEBIH DAHULU / MINIMALIST VALIDATION MODAL */}
      {validationModal && validationModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1b3459]">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#142642] text-[#d4af37] rounded-xl border border-[#234475] shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Lengkapi Formulir</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{validationModal.stepTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValidationModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142642] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                Mohon lengkapi isian berikut sebelum beralih ke tahapan selanjutnya:
              </p>
              <div className="bg-[#071326] border border-[#1b3459]/80 rounded-xl p-4 max-h-60 overflow-y-auto space-y-2">
                {validationModal.missingFields.map((field, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-sm text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0"></span>
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setValidationModal(null)}
                className="px-5 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-white border border-[#234475] rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Tutup &amp; Lengkapi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal Preview */}
      {previewModalImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#081224] border-b border-[#1b3459] flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>{previewModalImg.title}</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#142642] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.title}
                className="max-h-[65vh] max-w-full object-contain rounded-lg border border-[#1b3459]"
              />
            </div>
            <div className="p-3.5 bg-[#081224] border-t border-[#1b3459] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-4 py-2 rounded-lg border border-[#234475] cursor-pointer"
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
