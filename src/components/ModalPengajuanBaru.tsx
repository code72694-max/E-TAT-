import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile, DokumenPersyaratan } from '../types';
import { sendPengajuanEmailNotification } from '../services/emailService';
import { permohonanApi } from '../services/api';
import { uploadToCloudinary } from '../services/cloudinary';
import {
  X,
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
  ShieldAlert,
  Clock,
  Activity,
  FileText,
  AlertTriangle,
  Mail,
  Camera,
  Eye,
  Image as ImageIcon
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

interface ModalPengajuanBaruProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPermohonan: PermohonanAsesmen) => void;
}

export const ModalPengajuanBaru: React.FC<ModalPengajuanBaruProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState<number>(1);
  const [terperiksaTab, setTerperiksaTab] = useState<'data' | 'riwayat'>('data');

  // Form State: Step 1 (Terperiksa)
  const [namaLengkap, setNamaLengkap] = useState('');
  const [alias, setAlias] = useState('');
  const [nik, setNik] = useState('');
  const [tempatLahir, setTempatLahir] = useState('Samarinda');
  const [tanggalLahir, setTanggalLahir] = useState('2001-05-14');
  const [usia, setUsia] = useState(25);
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [pekerjaan, setPekerjaan] = useState('Karyawan Swasta');
  const [alamatKtp, setAlamatKtp] = useState('');
  const [namaWali, setNamaWali] = useState('');
  const [kontakWali, setKontakWali] = useState('');
  const [statusKhusus, setStatusKhusus] = useState<'dewasa' | 'anak_berhadapan_hukum' | 'perlu_penerjemah'>('dewasa');

  // Form State: Riwayat Terperiksa (Tab Riwayat)
  const [statusResidivis, setStatusResidivis] = useState<'bukan_residivis' | 'residivis_1x' | 'residivis_berulang'>('bukan_residivis');
  const [riwayatTatSebelumnya, setRiwayatTatSebelumnya] = useState<string>('Belum Pernah (Pengajuan Permohonan Asesmen Pertama)');
  const [riwayatPerkaraLalu, setRiwayatPerkaraLalu] = useState<string>('Tidak memiliki catatan vonis pidana / DPO / perkara aktif lainnya.');
  const [riwayatRehabilitasi, setRiwayatRehabilitasi] = useState<string>('Belum pernah menjalani program rehabilitasi medis atau sosial.');
  const [lamaPenggunaanZat, setLamaPenggunaanZat] = useState<string>('6 - 12 Bulan (Penggunaan Rekreasi)');
  const [hasilTesUrinAwal, setHasilTesUrinAwal] = useState<string>('Positif Methamphetamine (Sabu) - Skrining Awal');
  const [catatanProfilingPenyidik, setCatatanProfilingPenyidik] = useState<string>('Hasil interogasi awal & digital forensik: Terperiksa adalah pengguna akhir / pemakai murni, tidak terindikasi masuk sindikat peredaran gelap.');

  // Form State: Step 2 (Perkara & Barang Bukti)
  const [jenisPengajuan, setJenisPengajuan] = useState<'penangkapan_tanpa_bb' | 'penangkapan_dengan_bb' | 'p19' | 'penuntutan' | 'persidangan'>('penangkapan_dengan_bb');
  const [metodePelaksanaan, setMetodePelaksanaan] = useState<'luring' | 'daring' | 'hybrid'>('luring');
  const [satuanKerjaTujuan, setSatuanKerjaTujuan] = useState('BNNP Kalimantan Timur');
  
  const [nomorLp, setNomorLp] = useState('LP/A/142/IX/2026/SPKT/POLRESTA SMD');
  const [tanggalLp, setTanggalLp] = useState('2026-09-07');
  const [tanggalWaktuPenangkapan, setTanggalWaktuPenangkapan] = useState('2026-09-07T21:00');
  const [namaPenyidik, setNamaPenyidik] = useState(currentUser.name);
  const [nomorHpPenyidik, setNomorHpPenyidik] = useState('0812-3456-7890');
  const [pasal, setPasal] = useState('Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009');
  const [tkp, setTkp] = useState('Jl. Pahlawan No. 45, Samarinda');
  const [kronologi, setKronologi] = useState('Terperiksa diamankan saat menggunakan narkotika di tempat tinggalnya.');
  
  // Barang bukti list
  const [barangBuktiList, setBarangBuktiList] = useState<any[]>([
    {
      id: 'bb-1',
      jenisZat: 'Metamfetamina (Sabu)',
      beratBersihGram: 0.35,
      statusUjiLab: 'proses_lab',
      nomorSuratLab: 'Lab/Toksi/112/IX/2026/Puslabfor',
      tanggalSuratLab: '2026-09-07',
      keterangan: 'Di bawah ambang batas SEMA (1.0 gr)',
      fotoBarangBuktiUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      fotoUjiLabUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop&q=80'
    }
  ]);
  const [newJenisZat, setNewJenisZat] = useState('Metamfetamina (Sabu)');
  const [newBerat, setNewBerat] = useState('0.2');
  const [newStatusLab, setNewStatusLab] = useState<'proses_lab' | 'positif' | 'negatif' | 'belum_uji'>('proses_lab');
  const [newNomorLab, setNewNomorLab] = useState('');
  const [newFotoBb, setNewFotoBb] = useState('');
  const [newFotoLab, setNewFotoLab] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);

  // Form State: Step 3 (Dokumen)
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>([
    'doc-std-1', 'doc-std-2', 'doc-std-3', 'doc-std-4', 'doc-std-5'
  ]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!isOpen) return null;

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
        .catch(err => {
          console.warn('Cloudinary BB upload fallback:', err);
        });
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

      uploadToCloudinary(file, 'hasil-lab')
        .then(res => {
          if (res?.url) setNewFotoLab(res.url);
        })
        .catch(err => {
          console.warn('Cloudinary Lab upload fallback:', err);
        });
    }
  };

  const handleAddBb = () => {
    const beratVal = parseFloat(newBerat);
    if (!newBerat || isNaN(beratVal) || beratVal <= 0) {
      alert('Berat barang bukti harus berupa angka positif lebih dari 0 gram.');
      return;
    }
    setBarangBuktiList([
      ...barangBuktiList,
      {
        id: 'bb-' + Date.now(),
        jenisZat: newJenisZat,
        beratBersihGram: beratVal,
        statusUjiLab: newStatusLab,
        nomorSuratLab: newNomorLab || (newStatusLab !== 'belum_uji' ? 'Lab/Toksi/' + Math.floor(100 + Math.random() * 900) + '/IX/2026' : undefined),
        keterangan: beratVal <= 1.0 ? 'Memenuhi ambang batas SEMA 04/2010 (< 1 gr)' : 'Di atas batas gramatur SEMA',
        fotoBarangBuktiUrl: newFotoBb || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        fotoUjiLabUrl: newFotoLab || (newStatusLab !== 'belum_uji' ? 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop&q=80' : undefined)
      }
    ]);
    setNewBerat('');
    setNewNomorLab('');
    setNewFotoBb('');
    setNewFotoLab('');
  };

  const handleRemoveBb = (id: string) => {
    setBarangBuktiList(barangBuktiList.filter(b => b.id !== id));
  };

  const toggleDocUpload = (id: string) => {
    if (uploadedDocIds.includes(id)) {
      setUploadedDocIds(uploadedDocIds.filter(d => d !== id));
    } else {
      setUploadedDocIds([...uploadedDocIds, id]);
    }
  };

  const handleSubmitAll = async () => {
    setIsSendingEmail(true);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newNomor = `TAT/2026/09/${randomNum}`;

    const currentDocTemplates = getDocTemplates(jenisPengajuan);
    const newDocs: DokumenPersyaratan[] = currentDocTemplates.map((std, idx) => {
      const isAttached = uploadedDocIds.includes(std.id);
      return {
        id: 'doc-' + Date.now() + '-' + idx,
        kode: std.kode,
        nama: std.nama,
        wajib: std.wajib,
        keterangan: std.keterangan,
        statusVerifikasi: isAttached ? 'belum_diperiksa' : 'belum_diunggah',
        fileName: isAttached ? `${std.kode}_${namaLengkap.replace(/\s+/g, '_')}.pdf` : undefined,
        fileSize: isAttached ? '1.4 MB' : undefined,
        uploadedAt: isAttached ? '8 September 2026 14:00' : undefined,
        versi: 1
      };
    });

    let createdPermohonan: PermohonanAsesmen = {
      id: 'tat-' + randomNum,
      nomorPermohonan: newNomor,
      tanggalPengajuan: '8 September 2026',
      jenisPengajuan,
      metodePelaksanaan,
      satuanKerjaTujuan,
      instansiPengaju: currentUser.agency,
      pengajuId: currentUser.id,
      pengajuNama: namaPenyidik,
      statusProsesUtama: 'verifikasi_berkas',
      statusMedis: 'belum_dimulai',
      statusHukum: 'belum_dimulai',
      statusDokumen: 'draf',
      statusTindakLanjut: 'belum_dikonfirmasi',
      // === Status Kanonis ===
      applicationStatus: 'SUBMITTED',
      medicalStatus: 'NOT_STARTED',
      legalStatus: 'NOT_STARTED',
      deliveryStatus: 'NOT_ISSUED',
      followupStatus: 'NOT_APPLICABLE_YET',
      tenggatSlaTanggal: '14 September 2026',
      isMendekatiTenggat: false,
      isMelewatiTenggat: false,
      tindakanBerikutnyaLabel: 'Berkas telah diajukan lengkap. Menunggu verifikasi berkas oleh Sekretariat TAT.',
      penanggungJawabBerikutnya: 'Sekretariat TAT',
      terperiksa: {
        id: 'tp-' + Date.now(),
        namaLengkap: namaLengkap || 'Nama Terperiksa',
        alias: alias || undefined,
        nik: nik || '327301' + Math.floor(1000000000 + Math.random() * 9000000000),
        isNikVerified: true,
        tempatLahir: tempatLahir || 'Samarinda',
        tanggalLahir: tanggalLahir || '2001-05-14',
        usia: Number(usia) || 24,
        jenisKelamin,
        pekerjaan,
        alamatKtp: alamatKtp || 'Jl. Rapak Indah No. 12, Samarinda',
        alamatDomisili: alamatKtp || 'Jl. Rapak Indah No. 12, Samarinda',
        statusIdentitasKhusus: statusKhusus,
        namaWaliPendamping: namaWali || 'Orang Tua / Kuasa Hukum',
        kontakWali: kontakWali || '0813-9876-5432'
      },
      perkara: {
        id: 'pk-' + Date.now(),
        nomorLaporanPolisi: nomorLp || 'LP/A/142/IX/2026',
        tanggalLp: tanggalLp || '2026-09-07',
        instansiPenyidik: currentUser.agency || 'Satresnarkoba',
        namaPenyidik: namaPenyidik || currentUser.name,
        nomorHpPenyidik: nomorHpPenyidik || '081234567890',
        pasalDipersangkakan: pasal || 'Pasal 127 ayat (1)',
        tanggalWaktuPenangkapan,
        tempatKejadianPerkara: tkp || 'Samarinda',
        kronologiSingkat: kronologi || 'Kronologi penangkapan dan tindak pidana penyalahgunaan narkotika.',
        barangBuktiList: barangBuktiList.map(bb => ({
          ...bb,
          beratBersihGram: Number(bb.beratBersihGram) || 0.1,
        }))
      },
      dokumenList: newDocs,
      klarifikasiList: [],
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: '8 September 2026 14:15',
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pengajuan Permohonan Asesmen Baru',
          rincian: `Penyidik mendaftarkan permohonan asesmen No. ${newNomor}`
        }
      ]
    };

    // Try saving to real backend
    try {
      const payload = {
        satuanKerjaTujuan,
        jenisPengajuan,
        metodePelaksanaan,
        terperiksa: {
          namaLengkap: namaLengkap || 'Nama Terperiksa',
          alias: alias || undefined,
          nik: nik || '327301' + Math.floor(1000000000 + Math.random() * 9000000000),
          isNikVerified: true,
          tempatLahir: tempatLahir || 'Samarinda',
          tanggalLahir: tanggalLahir ? new Date(tanggalLahir).toISOString() : new Date().toISOString(),
          usia: Number(usia) || 24,
          jenisKelamin,
          pekerjaan: pekerjaan || 'Wiraswasta',
          alamatKtp: alamatKtp || 'Jl. Rapak Indah No. 12, Samarinda',
          alamatDomisili: alamatKtp || 'Jl. Rapak Indah No. 12, Samarinda',
          statusIdentitasKhusus: statusKhusus,
          namaWaliPendamping: namaWali || undefined,
          kontakWali: kontakWali || undefined,
        },
        perkara: {
          nomorLaporanPolisi: nomorLp || 'LP/A/142/IX/2026',
          tanggalLp: tanggalLp ? new Date(tanggalLp).toISOString() : new Date().toISOString(),
          instansiPenyidik: currentUser.agency || 'Satresnarkoba',
          namaPenyidik: namaPenyidik || currentUser.name,
          nomorHpPenyidik: nomorHpPenyidik || '081234567890',
          pasalDipersangkakan: pasal || 'Pasal 127 ayat (1)',
          tempatKejadianPerkara: tkp || 'Samarinda',
          tanggalWaktuPenangkapan: tanggalWaktuPenangkapan ? new Date(tanggalWaktuPenangkapan).toISOString() : undefined,
          kronologiSingkat: kronologi || 'Kronologi penangkapan dan penyerahan barang bukti.',
          barangBuktiList: barangBuktiList.map(bb => ({
            jenisZat: bb.jenisZat,
            beratKotorGram: bb.beratKotorGram ? Number(bb.beratKotorGram) : undefined,
            beratBersihGram: Number(bb.beratBersihGram) || 0.1,
            statusUjiLab: (bb.statusUjiLab as any) || 'belum_uji',
            nomorSuratLab: bb.nomorSuratLab,
            tanggalSuratLab: bb.tanggalSuratLab ? new Date(bb.tanggalSuratLab).toISOString() : undefined,
            keterangan: bb.keterangan,
          })),
        },
      };

      const res = await permohonanApi.create(payload);
      if (res.data) {
        createdPermohonan = { ...createdPermohonan, ...res.data };
      }
    } catch (err) {
      console.warn('Backend permohonan create error, using state:', err);
    }

    // Send email notification to etatsiappulih@gmail.com
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
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0b172a] rounded-2xl max-w-3xl w-full overflow-hidden border border-[#1b3459] shadow-2xl shadow-black/80 my-8">
        {/* Header */}
        <div className="bg-[#081224] border-b border-[#1b3459] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white font-['Cinzel',serif]">Pengajuan Permohonan Asesmen Terpadu Baru</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Penyampaian berkas perkara dan identitas terperiksa ke Sekretariat TAT (Perber 2014 & Perbnn 11/2021)
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Indicators */}
        <div className="bg-[#081224] border-b border-[#1b3459] px-6 py-3 flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, label: 'Identitas Terperiksa' },
            { num: 2, label: 'Perkara & Barang Bukti' },
            { num: 3, label: 'Kelengkapan Dokumen' },
            { num: 4, label: 'Konfirmasi Pengajuan' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center space-x-2 ${
                step === s.num
                  ? 'text-[#D4AF37] font-bold'
                  : step > s.num
                  ? 'text-[#D4AF37]'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                  step === s.num
                    ? 'bg-[#1b3459] text-[#D4AF37] border-[#D4AF37]'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-slate-200 border-emerald-500/40'
                    : 'bg-[#0b172a] text-slate-400 border-[#1b3459]'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Wizard Step Forms */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {/* STEP 1: IDENTITAS TERPERIKSA & RIWAYAT */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              {/* Top Name Input Row (Yang Diadukan) */}
              <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]/60">
                  <span className="font-bold text-white flex items-center space-x-2 text-xs">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span>Identitas Utama Yang Diadukan / Terperiksa</span>
                  </span>
                  <span className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                    Wajib Diisi Penyidik
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-200 block mb-1">
                      Nama Lengkap Yang Diadukan / Terperiksa *
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Contoh: Muhammad Reza Pratama / Subjek Uji"
                      className="w-full p-2.5 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-xs font-semibold placeholder:font-normal"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Nama Panggilan / Alias</label>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Contoh: Reza / Eza"
                      className="w-full p-2.5 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Subjek live status indicator */}
                {namaLengkap && (
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 bg-[#0d1f38]/60 p-2.5 rounded-lg border border-[#1b3459]/80">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Subjek Aktif: <strong className="text-white">{namaLengkap}</strong></span>
                    </div>
                    <span className="text-[10px] text-[#D4AF37] font-mono">
                      Status: {statusResidivis === 'bukan_residivis' ? 'Subjek Baru' : 'Tercatat Riwayat'}
                    </span>
                  </div>
                )}
              </div>

              {/* Sub-Tab Navigation Under Name: DATA TERPERIKSA vs RIWAYAT */}
              <div className="bg-[#081224] border border-[#1b3459] rounded-xl overflow-hidden shadow-lg">
                {/* Tab Header Buttons */}
                <div className="flex border-b border-[#1b3459] bg-[#050e1c] p-1.5 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTerperiksaTab('data')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      terperiksaTab === 'data'
                        ? 'bg-[#133863] text-white border border-[#245899] shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tab Data Pokok Terperiksa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTerperiksaTab('riwayat')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      terperiksaTab === 'riwayat'
                        ? 'bg-[#133863] text-white border border-[#245899] shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tab Riwayat Kasus</span>
                    {statusResidivis !== 'bukan_residivis' && (
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    )}
                  </button>
                </div>

                {/* TAB 1: DATA IDENTITAS & KEPENDUDUKAN */}
                {terperiksaTab === 'data' && (
                  <div className="p-4 space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">
                          Nomor Induk Kependudukan (NIK)
                        </label>
                        <input
                          type="text"
                          value={nik}
                          onChange={(e) => setNik(e.target.value)}
                          placeholder="16 Digit NIK KTP"
                          className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg font-mono focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Status Kategori Terperiksa</label>
                        <select
                          value={statusKhusus}
                          onChange={(e) => setStatusKhusus(e.target.value as any)}
                          className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                        >
                          <option value="dewasa">Dewasa Umum</option>
                          <option value="anak_berhadapan_hukum">Anak Berhadapan Hukum (ABH - Di bawah 18 th)</option>
                          <option value="perlu_penerjemah">Perlu Penerjemah Bahasa / Isyarat</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Tempat &amp; Tanggal Lahir</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={tempatLahir}
                            onChange={(e) => setTempatLahir(e.target.value)}
                            placeholder="Tempat Lahir"
                            className="p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                          />
                          <input
                            type="date"
                            value={tanggalLahir}
                            onChange={(e) => setTanggalLahir(e.target.value)}
                            className="p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Usia &amp; Jenis Kelamin</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={usia}
                            onChange={(e) => setUsia(Number(e.target.value))}
                            placeholder="Usia (Tahun)"
                            className="p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                          />
                          <select
                            value={jenisKelamin}
                            onChange={(e) => setJenisKelamin(e.target.value as any)}
                            className="p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Pekerjaan</label>
                        <input
                          type="text"
                          value={pekerjaan}
                          onChange={(e) => setPekerjaan(e.target.value)}
                          placeholder="Pekerjaan / Profesi"
                          className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Nama Wali / Pendamping</label>
                        <input
                          type="text"
                          value={namaWali}
                          onChange={(e) => setNamaWali(e.target.value)}
                          placeholder="Nama Orang Tua / Pasangan / Kuasa Hukum"
                          className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-300 block mb-1">Alamat Sesuai KTP / Domisili</label>
                        <input
                          type="text"
                          value={alamatKtp}
                          onChange={(e) => setAlamatKtp(e.target.value)}
                          placeholder="Alamat lengkap terperiksa saat ini"
                          className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-300 block mb-1">Kontak Telepon Wali / Keluarga</label>
                        <input
                          type="text"
                          value={kontakWali}
                          onChange={(e) => setKontakWali(e.target.value)}
                          placeholder="0812-XXXX-XXXX"
                          className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2 pt-3 mt-3 border-t border-[#1b3459]/50">
                        <h4 className="text-[11px] font-bold text-[#D4AF37] mb-3 uppercase tracking-wider">Informasi Asesmen Awal Penyidik</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="font-semibold text-slate-300 block mb-1">Lama Penggunaan & Frekuensi Zat</label>
                            <input
                              type="text"
                              value={lamaPenggunaanZat}
                              onChange={(e) => setLamaPenggunaanZat(e.target.value)}
                              placeholder="Contoh: 6 bulan, 1-2 kali per minggu"
                              className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-300 block mb-1">Hasil Pemeriksaan Skrining Urin</label>
                            <input
                              type="text"
                              value={hasilTesUrinAwal}
                              onChange={(e) => setHasilTesUrinAwal(e.target.value)}
                              placeholder="Contoh: Positif Methamphetamine (Sabu)"
                              className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="font-semibold text-slate-300 block mb-1">Catatan Profiling Risiko & Intelijen</label>
                            <textarea
                              rows={2}
                              value={catatanProfilingPenyidik}
                              onChange={(e) => setCatatanProfilingPenyidik(e.target.value)}
                              placeholder="Keterangan apakah terperiksa adalah pemakai murni, korban penyalahgunaan, atau bukan jaringan pengedar..."
                              className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: RIWAYAT KASUS & HISTORI TAT */}
                {terperiksaTab === 'riwayat' && (
                  <div className="p-4 space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <History className="w-4 h-4 text-sky-400" />
                        <span>Catatan Histori Terperiksa</span>
                      </h3>
                      <span className="text-[10px] text-slate-400 bg-[#050e1c] px-2 py-1 rounded border border-[#1b3459]">Data Terintegrasi e-TAT & SIPP</span>
                    </div>

                    <div className="space-y-3">
                      {/* CARD 1 */}
                      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-3.5 hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm hover:shadow-[#D4AF37]/10" onClick={() => alert('Membuka detail perkara sebelumnya (Mockup)')}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Asesmen TAT 2024</span>
                            <h4 className="text-xs font-bold text-white mt-1 group-hover:text-[#D4AF37] transition-colors">Perkara No. LP/A/45/II/2024/SPKT.SATRESNARKOBA</h4>
                          </div>
                          <span className="text-slate-400 text-[10px]">12 Feb 2024</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">Penyalahgunaan narkotika golongan I bukan tanaman (Sabu 0.12 gram). Rekomendasi: Rehabilitasi Rawat Jalan di Klinik Pratama BNNK Samarinda selama 2 bulan.</p>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                          <span className="flex items-center space-x-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> <span>Selesai Program (SKSP Terbit)</span></span>
                          <span>•</span>
                          <span>Instansi: Polresta Samarinda</span>
                        </div>
                      </div>

                      {/* CARD 2 */}
                      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-3.5 hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm hover:shadow-[#D4AF37]/10" onClick={() => alert('Membuka detail perkara sebelumnya (Mockup)')}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">Putusan Pengadilan 2021</span>
                            <h4 className="text-xs font-bold text-white mt-1 group-hover:text-[#D4AF37] transition-colors">Perkara No. 112/Pid.Sus/2021/PN Smr</h4>
                          </div>
                          <span className="text-slate-400 text-[10px]">05 Mei 2021</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">Vonis pidana penjara 1 tahun 6 bulan atas kepemilikan narkotika golongan I (Pasal 112 ayat 1 UU 35/2009).</p>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                          <span className="flex items-center space-x-1"><AlertTriangle className="w-3 h-3 text-amber-400" /> <span>Bebas Murni (2022)</span></span>
                          <span>•</span>
                          <span>Instansi: Kejaksaan Negeri Samarinda</span>
                        </div>
                      </div>

                      {/* ADD NEW CARD BUTTON */}
                      <button className="w-full py-2.5 mt-2 border border-dashed border-[#1b3459] text-slate-400 rounded-lg text-xs font-medium hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center space-x-1.5" onClick={() => alert('Fitur tambah catatan histori manual')}>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Kaitkan Riwayat Perkara Lain</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PERKARA & BARANG BUKTI */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-[#1b3459]/60">
                  <Scale className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-white text-xs">Informasi Pengajuan & Perkara</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-300 block mb-1">Jenis Pengajuan Asesmen TAT *</label>
                    <select
                      value={jenisPengajuan}
                      onChange={(e) => setJenisPengajuan(e.target.value as any)}
                      className="w-full p-2.5 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none font-semibold text-xs"
                    >
                      <option value="penangkapan_tanpa_bb">Tingkat Penyidikan - Penangkapan TANPA Barang Bukti</option>
                      <option value="penangkapan_dengan_bb">Tingkat Penyidikan - Penangkapan DENGAN Barang Bukti</option>
                      <option value="p19">Petunjuk Jaksa (P-19)</option>
                      <option value="penuntutan">Kepentingan Penuntutan (JPU)</option>
                      <option value="persidangan">Kepentingan Persidangan (Penetapan Hakim)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Metode Pelaksanaan</label>
                    <select
                      value={metodePelaksanaan}
                      onChange={(e) => setMetodePelaksanaan(e.target.value as any)}
                      className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    >
                      <option value="luring">Luring (Tatap Muka Langsung)</option>
                      <option value="daring">Daring (Online Zoom/Virtual)</option>
                      <option value="hybrid">Hybrid (Campuran)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Satuan Kerja Tujuan TAT</label>
                    <select
                      value={satuanKerjaTujuan}
                      onChange={(e) => setSatuanKerjaTujuan(e.target.value)}
                      className="w-full p-2 border border-[#1b3459] bg-[#050e1c] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    >
                      <option value="BNNP Kalimantan Timur">Tim Asesmen Terpadu BNNP Kalimantan Timur</option>
                      <option value="BNNK Samarinda">Tim Asesmen Terpadu BNNK Samarinda</option>
                      <option value="BNNK Balikpapan">Tim Asesmen Terpadu BNNK Balikpapan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Nomor Laporan Polisi (LP) *</label>
                  <input
                    type="text"
                    value={nomorLp}
                    onChange={(e) => setNomorLp(e.target.value)}
                    className="w-full p-2 border border-[#1b3459] bg-[#081224] text-white rounded-lg font-mono focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tanggal LP</label>
                  <input
                    type="date"
                    value={tanggalLp}
                    onChange={(e) => setTanggalLp(e.target.value)}
                    className="w-full p-2 border border-[#1b3459] bg-[#081224] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1">Tanggal & Waktu Penangkapan (SP.Tangkap) *</label>
                  <input
                    type="datetime-local"
                    value={tanggalWaktuPenangkapan}
                    onChange={(e) => setTanggalWaktuPenangkapan(e.target.value)}
                    className="w-full p-2 border border-[#1b3459] bg-[#081224] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Maksimal pengajuan TAT adalah 3x24 Jam sejak penangkapan.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1">Pasal yang Dipersangkakan *</label>
                  <input
                    type="text"
                    value={pasal}
                    onChange={(e) => setPasal(e.target.value)}
                    placeholder="Contoh: Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009"
                    className="w-full p-2 border border-[#1b3459] bg-[#081224] font-semibold text-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1">Tempat Kejadian Perkara (TKP)</label>
                  <input
                    type="text"
                    value={tkp}
                    onChange={(e) => setTkp(e.target.value)}
                    className="w-full p-2 border border-[#1b3459] bg-[#081224] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1">Kronologi Singkat Penangkapan</label>
                  <textarea
                    value={kronologi}
                    onChange={(e) => setKronologi(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-[#1b3459] bg-[#081224] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              {/* Barang Bukti & Uji Lab Sub-Form */}
              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-[#D4AF37]" />
                    <span>Rincian Barang Bukti &amp; Uji Lab Puslabfor</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Lampirkan foto fisik &amp; surat lab jika ada</span>
                </div>
                
                {/* Inputs for adding new BB */}
                <div className="bg-[#0b172a] p-3 rounded-xl border border-[#1b3459] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-300 block mb-1">Jenis Zat / Narkotika</label>
                      <select
                        value={newJenisZat}
                        onChange={(e) => setNewJenisZat(e.target.value)}
                        className="w-full p-2 text-xs border border-[#1b3459] rounded-lg bg-[#081224] text-white focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      >
                        <option value="Metamfetamina (Sabu)">Metamfetamina (Sabu)</option>
                        <option value="Ganja Kering">Ganja Kering</option>
                        <option value="MDMA / Ekstasi">MDMA / Ekstasi</option>
                        <option value="Tembakau Sintetis (Gorila)">Tembakau Sintetis (Gorila)</option>
                        <option value="Obat Keras (Tramadol/Trihex)">Obat Keras (Tramadol/Trihex)</option>
                        <option value="Psikotropika Gol. IV (Alprazolam)">Psikotropika Gol. IV (Alprazolam)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-300 block mb-1">Berat Bersih (Netto - Gram)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Contoh: 0.35"
                        value={newBerat}
                        onChange={(e) => setNewBerat(e.target.value)}
                        className="w-full p-2 text-xs border border-[#1b3459] bg-[#081224] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-300 block mb-1">Status Uji Lab Toksikologi</label>
                      <select
                        value={newStatusLab}
                        onChange={(e) => setNewStatusLab(e.target.value as any)}
                        className="w-full p-2 text-xs border border-[#1b3459] rounded-lg bg-[#081224] text-white focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      >
                        <option value="proses_lab">Sedang Proses Lab (Puslabfor)</option>
                        <option value="positif">Positif Narkotika (Sudah Terbit Lab)</option>
                        <option value="negatif">Negatif Narkotika</option>
                        <option value="belum_uji">Belum Diajukan ke Lab</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-300 block mb-1">Nomor Surat Hasil Lab (Jika Ada)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Lab/Toksi/112/IX/2026/Puslabfor"
                        value={newNomorLab}
                        onChange={(e) => setNewNomorLab(e.target.value)}
                        className="w-full p-2 text-xs border border-[#1b3459] bg-[#081224] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Upload Foto BB & Lab */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Foto Fisik BB */}
                    <div className="p-2.5 bg-[#081224] rounded-lg border border-[#1b3459] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                          <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Foto Fisik Barang Bukti</span>
                        </span>
                        {newFotoBb && (
                          <button
                            type="button"
                            onClick={() => setNewFotoBb('')}
                            className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      {newFotoBb ? (
                        <div className="relative group rounded-lg overflow-hidden border border-[#234475] h-20 bg-black flex items-center justify-center">
                          <img src={newFotoBb} alt="Preview BB" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setPreviewModalImg({ url: newFotoBb, title: 'Foto Fisik Barang Bukti' })}
                              className="p-1 bg-[#1b3459] rounded text-white hover:text-[#D4AF37]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-20 border border-dashed border-[#234475] rounded-lg cursor-pointer hover:bg-[#142642]/50 transition-colors">
                          <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-medium text-slate-300">Pilih / Unggah Foto BB</span>
                          <input type="file" accept="image/*" onChange={handleUploadFotoBb} className="hidden" />
                        </label>
                      )}
                    </div>

                    {/* Foto Surat Uji Lab */}
                    <div className="p-2.5 bg-[#081224] rounded-lg border border-[#1b3459] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-teal-400" />
                          <span>Foto/Scan Hasil Uji Lab</span>
                        </span>
                        {newFotoLab && (
                          <button
                            type="button"
                            onClick={() => setNewFotoLab('')}
                            className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      {newFotoLab ? (
                        <div className="relative group rounded-lg overflow-hidden border border-[#234475] h-20 bg-black flex items-center justify-center">
                          <img src={newFotoLab} alt="Preview Lab" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setPreviewModalImg({ url: newFotoLab, title: 'Hasil Uji Laboratorium Forensik' })}
                              className="p-1 bg-[#1b3459] rounded text-white hover:text-[#D4AF37]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-20 border border-dashed border-[#234475] rounded-lg cursor-pointer hover:bg-[#142642]/50 transition-colors">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-medium text-slate-300">Unggah Surat / Scan Lab</span>
                          <input type="file" accept="image/*,application/pdf" onChange={handleUploadFotoLab} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddBb}
                      className="bg-[#1b3459] hover:bg-[#284c80] text-[#D4AF37] border border-[#2d5289] font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 text-xs transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambahkan ke Daftar Barang Bukti</span>
                    </button>
                  </div>
                </div>

                {/* List of added BB */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Daftar Barang Bukti Terlampir ({barangBuktiList.length}):
                  </span>
                  {barangBuktiList.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500 border border-dashed border-[#1b3459] rounded-lg">
                      Belum ada barang bukti yang ditambahkan
                    </div>
                  ) : (
                    barangBuktiList.map(bb => (
                      <div key={bb.id} className="p-2.5 bg-[#0b172a] rounded-xl border border-[#1b3459] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-[#234475] transition-colors">
                        <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                          {/* Photo Thumbnails */}
                          <div className="flex items-center space-x-1.5 shrink-0">
                            {bb.fotoBarangBuktiUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewModalImg({ url: bb.fotoBarangBuktiUrl, title: `Foto BB: ${bb.jenisZat}` })}
                                className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#234475] bg-black hover:opacity-80 transition-opacity cursor-pointer group"
                                title="Klik untuk memperbesar foto BB"
                              >
                                <img src={bb.fotoBarangBuktiUrl} alt="Foto BB" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Eye className="w-3 h-3 text-white" />
                                </div>
                              </button>
                            ) : (
                              <div className="w-11 h-11 rounded-lg border border-dashed border-slate-700 bg-[#081224] flex items-center justify-center text-slate-500 text-[9px] text-center p-1">
                                No BB
                              </div>
                            )}

                            {bb.fotoUjiLabUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewModalImg({ url: bb.fotoUjiLabUrl, title: `Surat Uji Lab: ${bb.jenisZat}` })}
                                className="relative w-11 h-11 rounded-lg overflow-hidden border border-teal-800 bg-black hover:opacity-80 transition-opacity cursor-pointer group"
                                title="Klik untuk memperbesar surat lab"
                              >
                                <img src={bb.fotoUjiLabUrl} alt="Surat Lab" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Eye className="w-3 h-3 text-teal-300" />
                                </div>
                              </button>
                            ) : (
                              <div className="w-11 h-11 rounded-lg border border-dashed border-slate-700 bg-[#081224] flex items-center justify-center text-slate-500 text-[9px] text-center p-1">
                                No Lab
                              </div>
                            )}
                          </div>

                          {/* Info Text */}
                          <div className="min-w-0 flex-1 text-xs">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="font-bold text-white">{bb.jenisZat}</span>
                              <span className="text-[#D4AF37] font-semibold">({bb.beratBersihGram} gr netto)</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                                bb.statusUjiLab === 'positif'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                                  : bb.statusUjiLab === 'proses_lab'
                                  ? 'bg-[#142642] text-[#D4AF37] border-[#D4AF37]/30'
                                  : 'bg-[#142642] text-slate-400 border-[#234475]'
                              }`}>
                                {bb.statusUjiLab === 'positif' ? 'Positif Lab' : bb.statusUjiLab === 'proses_lab' ? 'Proses Lab' : 'Belum Uji'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
                              {bb.nomorSuratLab ? `No. Lab: ${bb.nomorSuratLab}` : 'Surat Lab: Menunggu Puslabfor'}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBb(bb.id)}
                          className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
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

          {/* STEP 3: KELENGKAPAN DOKUMEN PERSYARATAN */}
          {step === 3 && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#081224] border border-[#1b3459] rounded-lg p-3 text-slate-300">
                Pilih atau tandai dokumen persyaratan administrasi yang dilampirkan dalam berkas fisik/digital:
              </div>

              <div className="space-y-2">
                {getDocTemplates(jenisPengajuan).map((doc) => {
                  const isChecked = uploadedDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDocUpload(doc.id)}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-[#D4AF37] bg-[#081224]'
                          : 'border-[#1b3459] bg-[#0b172a] hover:bg-[#081224]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#D4AF37] accent-[#D4AF37]"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{doc.nama}</span>
                            {doc.wajib && (
                              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded font-semibold">
                                Wajib
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{doc.keterangan}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                        <span className={`text-[10px] font-semibold hidden sm:inline ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isChecked ? 'Sudah Diunggah' : 'Belum Dilampirkan'}
                        </span>
                        <label className={`cursor-pointer px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors ${
                          isChecked 
                            ? 'bg-[#142642] border-[#234475] text-slate-300 hover:text-white' 
                            : 'bg-[#1b3459] border-[#2d5289] text-[#D4AF37] hover:bg-[#284c80]'
                        }`}>
                          <Upload className="w-3.5 h-3.5" />
                          <span className="font-semibold text-[10px]">
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

          {/* STEP 4: KONFIRMASI PENGESAHAN */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4">
                <h4 className="font-bold text-slate-200 text-sm mb-1 font-['Cinzel',serif]">Konfirmasi Ringkasan Pengajuan</h4>
                <p className="text-[#D4AF37]/90">
                  Pastikan seluruh data di bawah ini telah sesuai sebelum dikirim ke Sekretariat TAT.
                </p>
              </div>

              <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-2">
                <div className="flex justify-between py-1 border-b border-[#1b3459]">
                  <span className="text-slate-400">Nama Terperiksa</span>
                  <span className="font-bold text-white">{namaLengkap || 'Belum diisi'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b3459]">
                  <span className="text-slate-400">Status Residivisme</span>
                  <span className="font-semibold text-emerald-400">
                    {statusResidivis === 'bukan_residivis' ? 'Bukan Residivis (Baru)' : 'Tercatat Residivis / Pernah TAT'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b3459]">
                  <span className="text-slate-400">Nomor Laporan Polisi</span>
                  <span className="font-mono font-bold text-white">{nomorLp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b3459]">
                  <span className="text-slate-400">Pasal Sangkaan</span>
                  <span className="font-semibold text-[#D4AF37]">{pasal}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b3459]">
                  <span className="text-slate-400">Jumlah Barang Bukti</span>
                  <span className="font-semibold text-white font-mono">{barangBuktiList.length} Item</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b3459]">
                  <span className="text-slate-400">Dokumen Dilampirkan</span>
                  <span className="font-bold text-[#D4AF37]">{uploadedDocIds.filter(id => getDocTemplates(jenisPengajuan).some(d => d.id === id)).length} dari {getDocTemplates(jenisPengajuan).length} Dokumen</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Instansi Pengaju</span>
                  <span className="font-semibold text-slate-200">{currentUser.agency}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-[#081224] px-6 py-4 border-t border-[#1b3459] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-[#1b3459] rounded-lg text-xs font-semibold text-slate-300 hover:bg-[#1b3459] flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          ) : (
            <button
              onClick={handleSubmitAll}
              className="bg-[#133863] hover:bg-[#1a4a82] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-emerald-500 cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kirim Permohonan ke Sekretariat</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal Preview */}
      {previewModalImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-[#081224] border-b border-[#1b3459] flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>{previewModalImg.title}</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#142642] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.title}
                className="max-h-[65vh] max-w-full object-contain rounded-lg border border-[#1b3459]"
              />
            </div>
            <div className="p-3 bg-[#081224] border-t border-[#1b3459] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
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
