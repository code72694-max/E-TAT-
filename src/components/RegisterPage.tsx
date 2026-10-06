import React, { useState } from 'react';
import { RegistrasiPengguna } from '../types';
import { registrasiApi } from '../services/api';
import {
  ArrowLeft,
  UserPlus,
  Lock,
  Mail,
  Phone,
  Building2,
  MapPin,
  Shield,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  FileText,
  BadgeCheck,
  Image as ImageIcon,
  Sparkles,
  Info,
  ChevronRight,
  LogIn,
  Activity
} from 'lucide-react';

interface RegisterPageProps {
  onRegisterSubmit: (newReg: RegistrasiPengguna) => void;
  onBackToLanding: () => void;
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSubmit,
  onBackToLanding,
  onGoToLogin
}) => {
  // Form States
  const [namaLengkap, setNamaLengkap] = useState('');
  const [pangkat, setPangkat] = useState('AKBP');
  const [nrp, setNrp] = useState('');
  const [jabatan, setJabatan] = useState('Kapolres');
  const [instansi, setInstansi] = useState('');
  const [kategoriInstansi, setKategoriInstansi] = useState<'Polres / Polresta' | 'Polda' | 'Polsek' | 'BNNK / BNNP' | 'Kejaksaan' | 'Lainnya'>('Polres / Polresta');
  
  const [peranSistem, setPeranSistem] = useState<string>('pengaju');
  const [spesialisasiTugas, setSpesialisasiTugas] = useState<string[]>([]);
  const [wilayahHukum, setWilayahHukum] = useState('Kota Samarinda');
  const [alamatKantor, setAlamatKantor] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [teleponKantor, setTeleponKantor] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [paktaIntegritas, setPaktaIntegritas] = useState(false);

  // Files & Previews
  const [fotoKtpUrl, setFotoKtpUrl] = useState<string>('');
  const [fotoKtpName, setFotoKtpName] = useState<string>('');
  const [fotoKtaUrl, setFotoKtaUrl] = useState<string>('');
  const [fotoKtaName, setFotoKtaName] = useState<string>('');
  const [suratPenunjukanUrl, setSuratPenunjukanUrl] = useState<string>('');
  const [suratPenunjukanName, setSuratPenunjukanName] = useState<string>('');

  // Submit Result
  const [submittedReg, setSubmittedReg] = useState<RegistrasiPengguna | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const PANGKAT_OPTIONS = [
    'KOMBES POL',
    'AKBP',
    'KOMPOL',
    'AKP',
    'IPTU',
    'IPDA',
    'AIPTU',
    'AIPDA',
    'BRIPKA',
    'BRIGADIR',
    'BRIPTU',
    'BRIPDA',
    'PEMBINA / ASN',
    'PENATA / ASN',
    'JAKSA UTAMA PRATAMA',
    'JAKSA MUDA'
  ];

  const WILAYAH_OPTIONS = [
    'Kota Samarinda',
    'Kota Balikpapan',
    'Kota Bontang',
    'Kabupaten Kutai Kartanegara',
    'Kabupaten Kutai Barat',
    'Kabupaten Kutai Timur',
    'Kabupaten Berau',
    'Kabupaten Paser',
    'Kabupaten Penajam Paser Utara',
    'Kabupaten Mahakam Ulu',
    'Polda Kalimantan Timur (Seluruh Kaltim)'
  ];

  const PERAN_OPTIONS = [
    { value: 'pengaju', label: 'Penyidik / Pengaju Asesmen' },
    { value: 'sekretariat', label: 'Sekretariat TAT' },
    { value: 'medis', label: 'Tim Asesmen Medis' },
    { value: 'hukum', label: 'Tim Asesmen Hukum' },
    { value: 'koordinator', label: 'Ketua / Koordinator TAT' },
    { value: 'pimpinan', label: 'Pimpinan Satwil / Pengawas' },
    { value: 'rehabilitasi', label: 'Petugas Fasilitas Rehabilitasi' }
  ];

  const getSpesialisasiOptions = (peran: string) => {
    switch(peran) {
      case 'medis':
        return ['Dokter Umum', 'Psikiater / Dokter Spesialis Jiwa', 'Psikolog Klinis', 'Perawat / Petugas Pengambil Sampel', 'Analis Laboratorium'];
      case 'hukum':
        return ['Penyidik Polri (Ditresnarkoba/Satresnarkoba)', 'Penyidik BNN', 'Jaksa Penuntut Umum', 'Hakim', 'Ahli Hukum / Akademisi', 'Petugas Bapas (PK Bapas)'];
      case 'sekretariat':
        return ['Koordinator Sekretariat', 'Staf Administrasi', 'Penerima Berkas / Front Desk'];
      case 'rehabilitasi':
        return ['Kepala Fasilitas Rehabilitasi', 'Konselor Adiksi', 'Pekerja Sosial', 'Petugas Pengawas Klien (Aftercare)'];
      case 'pengaju':
        return ['Kasat Resnarkoba', 'Kanit Idik', 'Penyidik Pembantu'];
      default:
        return [];
    }
  };

  const handleSpesialisasiToggle = (spesialisasi: string) => {
    if (spesialisasiTugas.includes(spesialisasi)) {
      setSpesialisasiTugas(spesialisasiTugas.filter(s => s !== spesialisasi));
    } else {
      setSpesialisasiTugas([...spesialisasiTugas, spesialisasi]);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'ktp' | 'kta' | 'surat'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const result = fileReader.result as string;
      if (type === 'ktp') {
        setFotoKtpUrl(result);
        setFotoKtpName(file.name);
      } else if (type === 'kta') {
        setFotoKtaUrl(result);
        setFotoKtaName(file.name);
      } else if (type === 'surat') {
        setSuratPenunjukanUrl(result);
        setSuratPenunjukanName(file.name);
      }
    };
    fileReader.readAsDataURL(file);
  };

  const handleAutofillSample = () => {
    setNamaLengkap('AKBP Hendri Gunawan, S.I.K., M.Si.');
    setPangkat('AKBP');
    setNrp('79100845');
    setJabatan('Kapolres');
    setInstansi('Polres Kutai Kartanegara');
    setKategoriInstansi('Polres / Polresta');
    setPeranSistem('pimpinan');
    setSpesialisasiTugas([]);
    setWilayahHukum('Kabupaten Kutai Kartanegara');
    setAlamatKantor('Jl. Wolter Monginsidi No. 12, Tenggarong, Kutai Kartanegara');
    setEmail('kapolres.kukar@polri.go.id');
    setPhone('0812-3488-9977');
    setTeleponKantor('(0541) 661110');
    setPassword('KapolresKukar2026!');
    setConfirmPassword('KapolresKukar2026!');
    setPaktaIntegritas(true);
    setFotoKtpUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80');
    setFotoKtpName('KTP_AKBP_HendriGunawan.jpg');
    setFotoKtaUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80');
    setFotoKtaName('KTA_POLRI_79100845.jpg');
    setSuratPenunjukanUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setSuratPenunjukanName('Surat_Keputusan_Pimpinan_Satwil_Kukar.pdf');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (!paktaIntegritas) {
      setErrorMessage('Anda wajib menyetujui Pakta Integritas Kedinasan!');
      return;
    }

    // Default sample images if not uploaded yet
    const finalKtpUrl = fotoKtpUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';
    const finalKtpName = fotoKtpName || 'KTP_' + namaLengkap.replace(/\s+/g, '_') + '.jpg';
    const finalKtaUrl = fotoKtaUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80';
    const finalKtaName = fotoKtaName || 'KTA_POLRI_' + (nrp || 'DEFAULT') + '.jpg';

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const kategoriMapped = kategoriInstansi === 'Polres / Polresta' 
      ? 'Polres_Polresta' 
      : kategoriInstansi === 'BNNK / BNNP' 
      ? 'BNNK_BNNP' 
      : (kategoriInstansi as any);

    const newReg: RegistrasiPengguna = {
      id: `reg-${Date.now()}`,
      nomorRegistrasi: `REG-TAT/${new Date().getFullYear()}/POLRES-${randomSuffix}`,
      tanggalDaftar: new Date().toISOString(),
      namaLengkap,
      pangkat,
      nrp,
      jabatan,
      instansi,
      kategoriInstansi,
      peranSistem,
      spesialisasiTugas,
      wilayahHukum,
      alamatKantor,
      email,
      phone,
      teleponKantor,
      password,
      fotoKtpUrl: finalKtpUrl,
      fotoKtpName: finalKtpName,
      fotoKtaUrl: finalKtaUrl,
      fotoKtaName: finalKtaName,
      suratPenunjukanUrl: suratPenunjukanUrl || undefined,
      suratPenunjukanName: suratPenunjukanName || undefined,
      status: 'pending'
    };

    // Send to backend
    registrasiApi.submit({
      namaLengkap,
      pangkat,
      nrp,
      jabatan,
      instansi,
      kategoriInstansi: kategoriMapped,
      wilayahHukum,
      alamatKantor,
      email,
      phone,
      teleponKantor,
      fotoKtpUrl: finalKtpUrl,
      fotoKtpName: finalKtpName,
      fotoKtaUrl: finalKtaUrl,
      fotoKtaName: finalKtaName,
      suratPenunjukanUrl: suratPenunjukanUrl || undefined,
      suratPenunjukanName: suratPenunjukanName || undefined,
    }).then((res) => {
      if (res.data) {
        onRegisterSubmit(res.data);
        setSubmittedReg(res.data);
      } else {
        onRegisterSubmit(newReg);
        setSubmittedReg(newReg);
      }
    }).catch((err) => {
      console.warn('Backend registrasi error, using local fallback:', err);
      onRegisterSubmit(newReg);
      setSubmittedReg(newReg);
    });
  };

  return (
    <div className="min-h-screen bg-[#071325] text-slate-100 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      {/* Top Header Navigation */}
      <header className="bg-[#071325]/95 border-b border-[#1b3459] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5 border border-[#1b3459]"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>Beranda Utama</span>
          </button>
        </div>

        <div className="flex items-center space-x-2.5">
          <img src="/logo_etat.png" alt="Logo E-TAT" className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.30)]" />
          <span className="hidden sm:inline font-extrabold text-sm tracking-wider text-white font-['Cinzel',serif]">
            E-TAT <span className="text-[#D4AF37]">SIAP PULIH</span>
          </span>
        </div>

        <button
          onClick={onGoToLogin}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-[#133863] hover:bg-[#1a4a82] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-[#235594]"
        >
          <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Sudah Punya Akun? Masuk</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {submittedReg ? (
          /* SUCCESS SCREEN AFTER SUBMISSION */
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-[#D4AF37]" />
            </div>

            <div className="space-y-2">
              <span className="inline-block bg-amber-500/15 border border-amber-500/30 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Status: Menunggu Persetujuan Admin
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif]">
                Registrasi Akun Berhasil Diajukan!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Permohonan akun Satwil / Penyidik Anda telah masuk ke sistem antrean verifikasi Administrator PUSDATIN / BNNP Kalimantan Timur.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#071325] border border-[#1b3459] rounded-xl p-4 sm:p-5 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
                <span className="text-slate-400">Nomor Registrasi:</span>
                <span className="text-[#D4AF37] font-bold text-sm">{submittedReg.nomorRegistrasi}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Nama & Pangkat:</span>
                  <span className="text-slate-200 font-semibold">{submittedReg.pangkat} {submittedReg.namaLengkap}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NRP / NIP:</span>
                  <span className="text-slate-200 font-semibold">{submittedReg.nrp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jabatan:</span>
                  <span className="text-slate-200 font-semibold">{submittedReg.jabatan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Satwil / Instansi:</span>
                  <span className="text-slate-200 font-semibold">{submittedReg.instansi}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Kedinasan:</span>
                  <span className="text-slate-200 font-semibold">{submittedReg.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">No. WhatsApp:</span>
                  <span className="text-slate-200 font-semibold">{submittedReg.phone}</span>
                </div>
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-[#132847]/50 border border-[#234b7f] rounded-xl p-3.5 flex items-start space-x-3 text-left">
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">Petunjuk Lanjutan:</span>
                <p>
                  1. Administrator akan memverifikasi Foto KTP, KTA, dan keabsahan Surat Tugas dalam kurun waktu <strong>1x24 jam kerja</strong>.
                </p>
                <p>
                  2. Setelah disetujui, Anda dapat langsung login menggunakan Email & Password yang Anda daftarkan untuk mengajukan permohonan TAT.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onGoToLogin}
                className="w-full sm:w-auto bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs px-6 py-2.5 rounded-xl border border-[#235594] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>Coba Masuk ke Halaman Login</span>
              </button>
              <button
                onClick={onBackToLanding}
                className="w-full sm:w-auto bg-[#071325] hover:bg-[#0d1f38] text-slate-300 hover:text-white font-semibold text-xs px-5 py-2.5 rounded-xl border border-[#1b3459] transition-all cursor-pointer"
              >
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="space-y-6">
            {/* Header Title & Autofill Demo Helper */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1b3459]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md font-mono">
                    PORTAL SATWIL POLRI & BNN
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Cinzel',serif]">
                  Pendaftaran Akun Satuan Wilayah / Kapolres
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Layanan registrasi akun kedinasan untuk Kapolres, Kasat Resnarkoba, dan Penyidik Tim Asesmen Terpadu (e-TAT).
                </p>
              </div>

              {/* Demo Helper Button */}
              <button
                type="button"
                onClick={handleAutofillSample}
                className="self-start sm:self-auto bg-[#1b3459]/60 hover:bg-[#1b3459] text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Isi Otomatis Data Contoh (Kapolres)</span>
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center space-x-3 text-rose-300 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: DATA PEJABAT & PEMOHON */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
                    1. Data Pejabat & Kredensial Anggota
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-200">
                      Nama Lengkap & Gelar <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaLengkap}
                      onChange={e => setNamaLengkap(e.target.value)}
                      placeholder="Contoh: AKBP Hendri Gunawan, S.I.K., M.Si."
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Pangkat Kedinasan <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={pangkat}
                      onChange={e => setPangkat(e.target.value)}
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                    >
                      {PANGKAT_OPTIONS.map(p => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      NRP / NIP Kedinasan <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nrp}
                      onChange={e => setNrp(e.target.value)}
                      placeholder="Contoh: 79100845"
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Jabatan Resmi <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jabatan}
                      onChange={e => setJabatan(e.target.value)}
                      placeholder="Contoh: Kapolres / Kasat Resnarkoba / Kanit Idik"
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Nomor Handphone / WA Aktif <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PERAN DALAM SISTEM TAT */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
                  <Activity className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
                    2. Peran & Tugas dalam Sistem E-TAT
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <label className="font-semibold text-slate-200 block">
                      Tugas / Peran Utama Akses Akun <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {PERAN_OPTIONS.map(opt => (
                        <label
                          key={opt.value}
                          className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            peranSistem === opt.value
                              ? 'bg-[#133863] border-[#245899] text-white shadow-md'
                              : 'bg-[#081224] border-[#1b3459] text-slate-300 hover:bg-[#0b172a] hover:border-[#1b3459]/80'
                          }`}
                        >
                          <input
                            type="radio"
                            name="peranSistem"
                            value={opt.value}
                            checked={peranSistem === opt.value}
                            onChange={() => {
                              setPeranSistem(opt.value);
                              setSpesialisasiTugas([]);
                            }}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            peranSistem === opt.value ? 'border-[#D4AF37]' : 'border-slate-500'
                          }`}>
                            {peranSistem === opt.value && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                          </div>
                          <span className="font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {getSpesialisasiOptions(peranSistem).length > 0 && (
                    <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                      <label className="font-semibold text-[#D4AF37] block">
                        Spesialisasi / Sub-Tugas (Pilih yang sesuai)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#081224] border border-[#1b3459] p-4 rounded-xl">
                        {getSpesialisasiOptions(peranSistem).map(spec => (
                          <label key={spec} className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                              spesialisasiTugas.includes(spec)
                                ? 'bg-[#D4AF37] border-[#D4AF37]'
                                : 'bg-[#0b172a] border-[#1b3459] group-hover:border-slate-400'
                            }`}>
                              {spesialisasiTugas.includes(spec) && <CheckCircle2 className="w-3.5 h-3.5 text-[#071325]" />}
                            </div>
                            <span className={`text-xs ${spesialisasiTugas.includes(spec) ? 'text-white font-medium' : 'text-slate-300'}`}>
                              {spec}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: DATA SATUAN WILAYAH & INSTANSI */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
                    3. Data Satuan Wilayah (Satwil) / Instansi Pemohon
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-200">
                      Nama Satuan Kerja / Instansi <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={instansi}
                      onChange={e => setInstansi(e.target.value)}
                      placeholder="Contoh: Polres Kutai Kartanegara / Ditresnarkoba Polda Kaltim"
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Kategori Satker <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={kategoriInstansi}
                      onChange={e => setKategoriInstansi(e.target.value as any)}
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                    >
                      <option value="Polres / Polresta">Polres / Polresta</option>
                      <option value="Polda">Polda (Ditresnarkoba)</option>
                      <option value="Polsek">Polsek</option>
                      <option value="BNNK / BNNP">BNNK / BNNP</option>
                      <option value="Kejaksaan">Kejaksaan Negeri / Tinggi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Wilayah Hukum Operasional <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={wilayahHukum}
                      onChange={e => setWilayahHukum(e.target.value)}
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                    >
                      {WILAYAH_OPTIONS.map(w => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-200">
                      Alamat Markas Komando (Mako) / Kantor <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={alamatKantor}
                      onChange={e => setAlamatKantor(e.target.value)}
                      placeholder="Contoh: Jl. Wolter Monginsidi No. 12, Tenggarong"
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Telepon Kantor / Ruangan Satker
                    </label>
                    <input
                      type="text"
                      value={teleponKantor}
                      onChange={e => setTeleponKantor(e.target.value)}
                      placeholder="(0541) 661110"
                      className="w-full bg-[#081224] text-white border border-[#1b3459] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: UPLOAD BERKAS IDENTITAS & DOKUMEN RESMI */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
                  <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
                      4. Unggah Berkas & Identitas Kedinasan
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Wajib melampirkan Foto KTP dan KTA Polri / Dokumen Kepangkatan resmi untuk verifikasi persetujuan admin.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Upload KTP */}
                  <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Foto KTP Pendaftar</span>
                      </span>
                      <span className="text-[10px] text-rose-400 font-semibold">*Wajib</span>
                    </div>

                    {fotoKtpUrl ? (
                      <div className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border border-[#1b3459] h-32 bg-slate-900 flex items-center justify-center">
                          <img
                            src={fotoKtpUrl}
                            alt="Preview KTP"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 truncate max-w-[150px] font-mono">{fotoKtpName}</span>
                          <label className="text-[#D4AF37] hover:underline cursor-pointer font-medium">
                            Ganti
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, 'ktp')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-[#1b3459] hover:border-[#D4AF37]/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#050e1a]/50 h-32">
                        <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-300">Pilih Foto KTP</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">JPG / PNG maks 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, 'ktp')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Upload KTA */}
                  <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <BadgeCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Foto KTA Polri / BNN</span>
                      </span>
                      <span className="text-[10px] text-rose-400 font-semibold">*Wajib</span>
                    </div>

                    {fotoKtaUrl ? (
                      <div className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border border-[#1b3459] h-32 bg-slate-900 flex items-center justify-center">
                          <img
                            src={fotoKtaUrl}
                            alt="Preview KTA"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 truncate max-w-[150px] font-mono">{fotoKtaName}</span>
                          <label className="text-[#D4AF37] hover:underline cursor-pointer font-medium">
                            Ganti
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, 'kta')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-[#1b3459] hover:border-[#D4AF37]/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#050e1a]/50 h-32">
                        <BadgeCheck className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-300">Pilih Foto KTA</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Kartu Tanda Anggota</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, 'kta')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Upload Surat Tugas */}
                  <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Surat Tugas</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Opsional</span>
                    </div>

                    {suratPenunjukanUrl ? (
                      <div className="space-y-2">
                        <div className="rounded-lg border border-[#1b3459] h-32 bg-[#050e1a] p-3 flex flex-col items-center justify-center text-center">
                          <FileCheck className="w-8 h-8 text-emerald-400 mb-1" />
                          <span className="text-[11px] font-medium text-slate-200 line-clamp-2">{suratPenunjukanName}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 text-[10px]">Tersedia</span>
                          <label className="text-[#D4AF37] hover:underline cursor-pointer font-medium">
                            Ganti
                            <input
                              type="file"
                              accept=".pdf,.jpg,.png"
                              onChange={e => handleFileUpload(e, 'surat')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-[#1b3459] hover:border-[#D4AF37]/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#050e1a]/50 h-32">
                        <FileText className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-300">Unggah Surat Tugas</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">PDF / Dokumen Surat Tugas</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={e => handleFileUpload(e, 'surat')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: KATA SANDI & KEAMANAN AKUN */}
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]">
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-sm font-bold text-white font-['Cinzel',serif]">
                    5. Akun Login & Pakta Integritas
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Email Kedinasan (Username) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="kapolres.kukar@polri.go.id"
                        className="w-full bg-[#081224] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Kata Sandi <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter..."
                        className="w-full bg-[#081224] text-white pl-10 pr-10 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-200">
                      Konfirmasi Kata Sandi <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi..."
                        className="w-full bg-[#081224] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1b3459] text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Pakta Integritas */}
                <div className="pt-3 border-t border-[#1b3459] space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={paktaIntegritas}
                      onChange={e => setPaktaIntegritas(e.target.checked)}
                      className="w-4 h-4 rounded border-[#1b3459] bg-[#081224] text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5"
                    />
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white block font-semibold">
                        Pakta Integritas Kedinasan Tim Asesmen Terpadu (e-TAT)
                      </strong>
                      Saya menyatakan bahwa seluruh data identitas, jabatan, dan dokumen KTP/KTA yang saya lampirkan adalah sah, benar, dan dapat dipertanggungjawabkan secara kedinasan sesuai hukum yang berlaku di Kepolisian Negara Republik Indonesia & BNN.
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="w-full sm:w-auto text-xs font-semibold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Batal & Kembali
                </button>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-[#235594] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg hover:border-[#D4AF37]/60"
                  >
                    <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Kirim Registrasi (Ajukan ke Admin)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
