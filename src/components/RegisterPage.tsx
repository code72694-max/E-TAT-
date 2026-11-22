import React, { useState, useEffect } from 'react';
import { RegistrasiPengguna } from '../types';
import { registrasiApi } from '../services/api';
import { uploadToCloudinary } from '../services/cloudinary';
import {
  Sparkles,
  AlertCircle,
  X,
  UserPlus,
  Loader2
} from 'lucide-react';
import {
  RegisterHeader,
  RegisterTicketSuccess,
  RegisterSavedBanner,
  Section1DataPejabat,
  Section2PeranSistem,
  Section3DataSatwil,
  Section4UploadBerkas,
  Section5KeamananAkun
} from './register';

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
  const STORAGE_KEY = 'etat_last_registration';

  // 1. Data Pejabat & Anggota
  const [namaLengkap, setNamaLengkap] = useState('');
  const [pangkat, setPangkat] = useState('AKBP');
  const [nrp, setNrp] = useState('');
  const [jabatan, setJabatan] = useState('Kapolres');
  const [unitFungsi, setUnitFungsi] = useState('');
  const [phone, setPhone] = useState('');

  // 2. Peran dalam Sistem E-TAT
  const [peranSistem, setPeranSistem] = useState<string>('pengaju');
  const [spesialisasiTugas, setSpesialisasiTugas] = useState<string[]>([]);

  // 3. Satuan Wilayah / Instansi
  const [instansi, setInstansi] = useState('');
  const [kategoriInstansi, setKategoriInstansi] = useState<'Polres / Polresta' | 'Polda' | 'Polsek' | 'BNNK / BNNP' | 'Kejaksaan' | 'Lainnya'>('Polres / Polresta');
  const [wilayahHukum, setWilayahHukum] = useState('Kota Samarinda');
  const [alamatKantor, setAlamatKantor] = useState('');
  const [teleponKantor, setTeleponKantor] = useState('');
  const [nomorSprint, setNomorSprint] = useState('');

  // 4. Kredensial Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [paktaIntegritas, setPaktaIntegritas] = useState(false);

  // 5. Berkas & Lampiran
  const [fotoKtpUrl, setFotoKtpUrl] = useState<string>('');
  const [fotoKtpName, setFotoKtpName] = useState<string>('');
  const [fotoKtpSize, setFotoKtpSize] = useState<number>(0);

  const [fotoKtaUrl, setFotoKtaUrl] = useState<string>('');
  const [fotoKtaName, setFotoKtaName] = useState<string>('');
  const [fotoKtaSize, setFotoKtaSize] = useState<number>(0);

  const [suratPenunjukanUrl, setSuratPenunjukanUrl] = useState<string>('');
  const [suratPenunjukanName, setSuratPenunjukanName] = useState<string>('');
  const [suratPenunjukanSize, setSuratPenunjukanSize] = useState<number>(0);

  // Status Pengiriman & Penyimpanan
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReg, setSubmittedReg] = useState<RegistrasiPengguna | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nomorRegistrasi) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gagal membaca saved registration dari localStorage:', err);
    }
    return null;
  });

  const [savedRegistration, setSavedRegistration] = useState<RegistrasiPengguna | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nomorRegistrasi) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<{ title: string; items: string[] } | null>(null);

  const showErrorModal = (title: string, items: string[]) => {
    setErrorMessage(items[0] || null);
    setErrorModal({ title, items });
  };

  // Sinkronkan data dari localStorage saat mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nomorRegistrasi) {
          setSubmittedReg(parsed);
          setSavedRegistration(parsed);
        }
      }
    } catch (err) {
      console.warn('Gagal sync saved registration dari localStorage:', err);
    }
  }, []);

  // Upload handler dengan validasi ukuran & MIME type
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'ktp' | 'kta' | 'surat'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    const maxImgSize = 5 * 1024 * 1024; // 5MB
    const maxDocSize = 10 * 1024 * 1024; // 10MB

    if (type === 'ktp' || type === 'kta') {
      if (!file.type.startsWith('image/')) {
        showErrorModal('Format Berkas Tidak Valid', [`File ${type.toUpperCase()} harus berupa gambar (JPG, PNG, atau WEBP).`]);
        return;
      }
      if (file.size > maxImgSize) {
        showErrorModal('Ukuran Berkas Terlalu Besar', [`Ukuran file ${type.toUpperCase()} melebihi batas maksimal 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`]);
        return;
      }
    } else if (type === 'surat') {
      const allowedDoc = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedDoc.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
        showErrorModal('Format Berkas Tidak Valid', ['File Surat Tugas harus berformat PDF atau Gambar (JPG/PNG).']);
        return;
      }
      if (file.size > maxDocSize) {
        showErrorModal('Ukuran Berkas Terlalu Besar', [`Ukuran Surat Tugas melebihi batas maksimal 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`]);
        return;
      }
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const result = fileReader.result as string;
      if (type === 'ktp') {
        setFotoKtpUrl(result);
        setFotoKtpName(file.name);
        setFotoKtpSize(file.size);
      } else if (type === 'kta') {
        setFotoKtaUrl(result);
        setFotoKtaName(file.name);
        setFotoKtaSize(file.size);
      } else if (type === 'surat') {
        setSuratPenunjukanUrl(result);
        setSuratPenunjukanName(file.name);
        setSuratPenunjukanSize(file.size);
      }
    };
    fileReader.readAsDataURL(file);

    uploadToCloudinary(file, type)
      .then(res => {
        if (res?.url) {
          if (type === 'ktp') setFotoKtpUrl(res.url);
          else if (type === 'kta') setFotoKtaUrl(res.url);
          else if (type === 'surat') setSuratPenunjukanUrl(res.url);
        }
      })
      .catch(err => {
        console.warn('Cloudinary upload fallback to dataURL:', err);
      });
  };

  const handleRemoveFile = (type: 'ktp' | 'kta' | 'surat') => {
    if (type === 'ktp') {
      setFotoKtpUrl('');
      setFotoKtpName('');
      setFotoKtpSize(0);
    } else if (type === 'kta') {
      setFotoKtaUrl('');
      setFotoKtaName('');
      setFotoKtaSize(0);
    } else if (type === 'surat') {
      setSuratPenunjukanUrl('');
      setSuratPenunjukanName('');
      setSuratPenunjukanSize(0);
    }
  };

  // Demo Autofill Helper
  const handleAutofillSample = () => {
    setNamaLengkap('AKP Hendri Gunawan, S.I.K.');
    setPangkat('AKP');
    setNrp('85100845');
    setJabatan('Kasat Resnarkoba');
    setUnitFungsi('Satresnarkoba');
    setInstansi('Polres Kutai Kartanegara');
    setKategoriInstansi('Polres / Polresta');
    setPeranSistem('pengaju');
    setSpesialisasiTugas(['Kasat Resnarkoba']);
    setWilayahHukum('Kabupaten Kutai Kartanegara');
    setAlamatKantor('Jl. Wolter Monginsidi No. 12, Tenggarong, Kutai Kartanegara');
    setEmail('satnarkoba.kukar@polri.go.id');
    setPhone('081234889977');
    setTeleponKantor('(0541) 661110');
    setNomorSprint('Sprin/142/X/HUK.6.6/2026');
    setPassword('PenyidikKukar2026!');
    setConfirmPassword('PenyidikKukar2026!');
    setPaktaIntegritas(true);
    setFotoKtpUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80');
    setFotoKtpName('KTP_AKBP_HendriGunawan.jpg');
    setFotoKtpSize(1024 * 480);
    setFotoKtaUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80');
    setFotoKtaName('KTA_POLRI_79100845.jpg');
    setFotoKtaSize(1024 * 320);
    setSuratPenunjukanUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setSuratPenunjukanName('Surat_Keputusan_Pimpinan_Satwil_Kukar.pdf');
    setSuratPenunjukanSize(1024 * 650);
    setErrorMessage(null);
  };

  // Reset form untuk mendaftarkan akun baru lainnya
  const handleRegisterNewAccount = () => {
    setSubmittedReg(null);
    setNamaLengkap('');
    setPangkat('AKBP');
    setNrp('');
    setJabatan('Kapolres');
    setUnitFungsi('');
    setPhone('');
    setInstansi('');
    setAlamatKantor('');
    setTeleponKantor('');
    setNomorSprint('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPaktaIntegritas(false);
    setFotoKtpUrl('');
    setFotoKtpName('');
    setFotoKtpSize(0);
    setFotoKtaUrl('');
    setFotoKtaName('');
    setFotoKtaSize(0);
    setSuratPenunjukanUrl('');
    setSuratPenunjukanName('');
    setSuratPenunjukanSize(0);
    setErrorMessage(null);
  };

  // Submit Handler dengan validasi lengkap
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorModal(null);

    const validationErrors: string[] = [];

    if (namaLengkap.trim().length < 2) {
      validationErrors.push('Nama Lengkap & Gelar wajib diisi (minimal 2 karakter).');
    }

    const cleanNrp = nrp.trim();
    if (!cleanNrp) {
      validationErrors.push('NRP / NIP Kedinasan wajib diisi.');
    } else if (cleanNrp.length < 6) {
      validationErrors.push('NRP / NIP Kedinasan harus minimal 6 digit angka.');
    }

    if (jabatan.trim().length < 2) {
      validationErrors.push('Jabatan Resmi Kedinasan wajib diisi.');
    }
    if (instansi.trim().length < 2) {
      validationErrors.push('Nama Satuan Kerja / Instansi wajib diisi.');
    }
    if (alamatKantor.trim().length < 5) {
      validationErrors.push('Alamat Markas / Kantor wajib diisi lengkap (minimal 5 karakter).');
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      validationErrors.push('Nomor Handphone / WhatsApp aktif wajib diisi.');
    } else {
      if (!cleanPhone.startsWith('08') && !cleanPhone.startsWith('628')) {
        validationErrors.push('Nomor Handphone harus diawali dengan 08 atau 628.');
      }
      if (cleanPhone.length < 10 || cleanPhone.length > 14) {
        validationErrors.push('Nomor Handphone harus antara 10 hingga 14 digit angka.');
      }
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      validationErrors.push('Email Kedinasan tidak valid (contoh: nama@instansi.go.id).');
    }

    if (!fotoKtpUrl) {
      validationErrors.push('Foto KTP Pendaftar wajib diunggah.');
    }
    if (!fotoKtaUrl) {
      validationErrors.push('Foto KTA Polri / BNN / Kartu Pegawai wajib diunggah.');
    }

    if (password.length < 8) {
      validationErrors.push('Kata Sandi wajib diisi minimal 8 karakter.');
    }
    if (password !== confirmPassword) {
      validationErrors.push('Konfirmasi Kata Sandi tidak cocok dengan Kata Sandi yang dimasukkan.');
    }

    if (!paktaIntegritas) {
      validationErrors.push('Pakta Integritas Kedinasan wajib dicentang & disetujui.');
    }

    if (validationErrors.length > 0) {
      showErrorModal('Data Pendaftaran Belum Lengkap / Valid', validationErrors);
      return;
    }

    const kategoriMapped = kategoriInstansi === 'Polres / Polresta'
      ? 'Polres_Polresta'
      : kategoriInstansi === 'BNNK / BNNP'
      ? 'BNNK_BNNP'
      : (kategoriInstansi as any);

    setIsSubmitting(true);

    const payload = {
      namaLengkap: namaLengkap.trim(),
      pangkat,
      nrp: cleanNrp,
      jabatan: jabatan.trim(),
      instansi: instansi.trim(),
      kategoriInstansi: kategoriMapped,
      wilayahHukum,
      alamatKantor: alamatKantor.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      teleponKantor: teleponKantor.trim() || undefined,
      fotoKtpUrl,
      fotoKtpName: fotoKtpName || 'KTP_' + cleanNrp + '.jpg',
      fotoKtaUrl,
      fotoKtaName: fotoKtaName || 'KTA_' + cleanNrp + '.jpg',
      suratPenunjukanUrl: suratPenunjukanUrl || undefined,
      suratPenunjukanName: suratPenunjukanName || undefined,
    };

    try {
      const res = await registrasiApi.submit(payload);
      if (res && res.data) {
        const fullSubmitted: RegistrasiPengguna = {
          ...res.data,
          unitFungsi: unitFungsi.trim() || undefined,
          nomorSprint: nomorSprint.trim() || undefined,
          peranSistem,
          spesialisasiTugas,
          password,
        };

        // Simpan ke localStorage agar tiket tetap tersimpan & berstatus berhasil saat reload
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fullSubmitted));
          setSavedRegistration(fullSubmitted);
        } catch (storageErr) {
          console.warn('LocalStorage save error:', storageErr);
        }

        onRegisterSubmit(fullSubmitted);
        setSubmittedReg(fullSubmitted);
      } else {
        throw new Error(res?.message || 'Gagal mengirim pendaftaran ke server.');
      }
    } catch (err: any) {
      console.warn('Backend registrasi error:', err);
      const msg = err.message || 'Terjadi kendala saat menghubungkan ke server. Silakan periksa kembali data Anda.';
      showErrorModal('Pengajuan Pendaftaran Gagal', [msg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071325] text-slate-100 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-slate-950 font-sans">
      {/* Top Header Navigation */}
      <RegisterHeader
        onBackToLanding={onBackToLanding}
        onGoToLogin={onGoToLogin}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {submittedReg ? (
          /* SUCCESS SCREEN AFTER SUBMISSION / RESTORED FROM LOCALSTORAGE */
          <RegisterTicketSuccess
            submittedReg={submittedReg}
            onGoToLogin={onGoToLogin}
            onRegisterNewAccount={handleRegisterNewAccount}
            onBackToLanding={onBackToLanding}
          />
        ) : (
          /* REGISTRATION FORM */
          <div className="space-y-6">
            {/* Top Saved Registration Reminder Banner (if previously registered) */}
            {savedRegistration && (
              <RegisterSavedBanner
                savedRegistration={savedRegistration}
                onViewTicket={() => setSubmittedReg(savedRegistration)}
              />
            )}

            {/* Header Title & Autofill Demo Helper */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1b3459]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md font-mono">
                    PORTAL SATWIL POLRI & BNN
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Cinzel',serif]">
                  Pendaftaran Akun Satuan Wilayah / Penyidik
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

            {/* Error Alert Banner */}
            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start space-x-3 text-rose-300 text-xs animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">
                  <span className="font-bold text-rose-200 block">Pemberitahuan Pendaftaran:</span>
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* SECTION 1: DATA PEJABAT & KREDENSIAL */}
              <Section1DataPejabat
                namaLengkap={namaLengkap}
                setNamaLengkap={setNamaLengkap}
                pangkat={pangkat}
                setPangkat={setPangkat}
                nrp={nrp}
                setNrp={setNrp}
                jabatan={jabatan}
                setJabatan={setJabatan}
                unitFungsi={unitFungsi}
                setUnitFungsi={setUnitFungsi}
                phone={phone}
                setPhone={setPhone}
              />

              {/* SECTION 2: PERAN DALAM SISTEM TAT */}
              <Section2PeranSistem
                peranSistem={peranSistem}
                setPeranSistem={setPeranSistem}
                spesialisasiTugas={spesialisasiTugas}
                setSpesialisasiTugas={setSpesialisasiTugas}
              />

              {/* SECTION 3: DATA SATUAN WILAYAH & INSTANSI */}
              <Section3DataSatwil
                instansi={instansi}
                setInstansi={setInstansi}
                kategoriInstansi={kategoriInstansi}
                setKategoriInstansi={setKategoriInstansi}
                wilayahHukum={wilayahHukum}
                setWilayahHukum={setWilayahHukum}
                nomorSprint={nomorSprint}
                setNomorSprint={setNomorSprint}
                teleponKantor={teleponKantor}
                setTeleponKantor={setTeleponKantor}
                alamatKantor={alamatKantor}
                setAlamatKantor={setAlamatKantor}
              />

              {/* SECTION 4: UPLOAD BERKAS & IDENTITAS */}
              <Section4UploadBerkas
                fotoKtpUrl={fotoKtpUrl}
                fotoKtpName={fotoKtpName}
                fotoKtpSize={fotoKtpSize}
                fotoKtaUrl={fotoKtaUrl}
                fotoKtaName={fotoKtaName}
                fotoKtaSize={fotoKtaSize}
                suratPenunjukanUrl={suratPenunjukanUrl}
                suratPenunjukanName={suratPenunjukanName}
                suratPenunjukanSize={suratPenunjukanSize}
                onFileUpload={handleFileUpload}
                onRemoveFile={handleRemoveFile}
              />

              {/* SECTION 5: KATA SANDI & KEAMANAN AKUN */}
              <Section5KeamananAkun
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                paktaIntegritas={paktaIntegritas}
                setPaktaIntegritas={setPaktaIntegritas}
              />

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="w-full sm:w-auto text-xs font-semibold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Batal & Kembali ke Beranda
                </button>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#133863] hover:bg-[#1a4a82] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-[#235594] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg hover:border-[#D4AF37]/60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        <span>Mengirimkan Pendaftaran...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                        <span>Kirim Pendaftaran (Ajukan ke Admin)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Modal Validasi / Peringatan Kekurangan Data Pendaftaran */}
      {errorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setErrorModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#081224] border border-[#1b3459] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b3459] bg-[#0c1a30]/90">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {errorModal.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Silakan periksa dan lengkapi bagian berikut sebelum mengirim:
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body: Daftar Kekurangan */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2.5 text-xs">
              {errorModal.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-200"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-[#1b3459] bg-[#0c1a30]/90">
              <button
                type="button"
                onClick={() => setErrorModal(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-bold rounded-xl text-xs border border-[#2d7ad6]/70 shadow-[0_2px_12px_rgba(20,83,154,0.4)] transition-all cursor-pointer"
              >
                Mengerti, Perbaiki Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
