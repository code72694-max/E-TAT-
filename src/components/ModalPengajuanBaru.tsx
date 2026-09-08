import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile, DokumenPersyaratan } from '../types';
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
  ArrowLeft
} from 'lucide-react';

const DOC_TEMPLATES = [
  { id: 'doc-surat', kode: 'SURAT_PERMOHONAN', nama: 'Surat Permohonan Asesmen dari Penyidik', wajib: true, keterangan: 'Tandatangan resmi Kasat / Kanit Penyidik' },
  { id: 'doc-lp', kode: 'LAPORAN_POLISI', nama: 'Laporan Polisi (LP)', wajib: true, keterangan: 'Surat tanda penerimaan laporan polisi' },
  { id: 'doc-sp-sidik', kode: 'SP_SIDIK', nama: 'Surat Perintah Penyidikan (Sp.Sidik)', wajib: true, keterangan: 'Surat perintah penyidikan perkara' },
  { id: 'doc-sp-tangkap', kode: 'SP_TANGKAP', nama: 'Surat Perintah Penangkapan & Penahanan', wajib: true, keterangan: 'Masa penangkapan 3x24 jam maksimal pengajuan' },
  { id: 'doc-bap', kode: 'BAP_TERPERIKSA', nama: 'Berita Acara Pemeriksaan (BAP) Tersangka', wajib: true, keterangan: 'Pengakuan dan keterangan awal peran terperiksa' },
  { id: 'doc-sita-bb', kode: 'BA_SITA_BB', nama: 'Surat Tanda Penerimaan & Penyitaan Barang Bukti', wajib: true, keterangan: 'Rincian barang bukti yang diamankan saat penangkapan' },
  { id: 'doc-timbang', kode: 'BA_TIMBANG', nama: 'Berita Acara Penimbangan / Pembungkusan BB', wajib: true, keterangan: 'Berat netto dan pembungkusan segel barang bukti' },
  { id: 'doc-lab-urin', kode: 'UJI_LAB_URIN', nama: 'Hasil Pemeriksaan Laboratorium Toksikologi Urin Awal', wajib: true, keterangan: 'Hasil tes strip atau skrining laboratorium forensik' },
  { id: 'doc-ktp', kode: 'IDENTITAS_KTP', nama: 'Fotokopi KTP / KK / Identitas Terperiksa', wajib: true, keterangan: 'Bukti identitas kependudukan terperiksa' },
  { id: 'doc-pernyataan', kode: 'SURAT_KELUARGA', nama: 'Surat Pernyataan / Permohonan Rehabilitasi dari Keluarga', wajib: false, keterangan: 'Kesediaan keluarga mendampingi rehabilitasi (opsional)' }
];

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

  // Form State: Step 1 (Terperiksa)
  const [namaLengkap, setNamaLengkap] = useState('');
  const [alias, setAlias] = useState('');
  const [nik, setNik] = useState('');
  const [tempatLahir, setTempatLahir] = useState('Bandung');
  const [tanggalLahir, setTanggalLahir] = useState('2001-05-14');
  const [usia, setUsia] = useState(25);
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [pekerjaan, setPekerjaan] = useState('Karyawan Swasta');
  const [alamatKtp, setAlamatKtp] = useState('');
  const [namaWali, setNamaWali] = useState('');
  const [kontakWali, setKontakWali] = useState('');
  const [statusKhusus, setStatusKhusus] = useState<'dewasa' | 'anak_berhadapan_hukum' | 'perlu_penerjemah'>('dewasa');

  // Form State: Step 2 (Perkara & Barang Bukti)
  const [nomorLp, setNomorLp] = useState('LP/A/142/IX/2026/SPKT/POLRESTABES BDG');
  const [tanggalLp, setTanggalLp] = useState('2026-09-07');
  const [namaPenyidik, setNamaPenyidik] = useState(currentUser.name);
  const [nomorHpPenyidik, setNomorHpPenyidik] = useState('0812-3456-7890');
  const [pasal, setPasal] = useState('Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009');
  const [tkp, setTkp] = useState('Jl. Merdeka No. 45, Bandung');
  const [kronologi, setKronologi] = useState('Terperiksa diamankan saat menggunakan narkotika di kamar indekos.');
  
  // Barang bukti list
  const [barangBuktiList, setBarangBuktiList] = useState([
    { id: 'bb-1', jenisZat: 'Metamfetamina (Sabu)', beratBersihGram: 0.35, statusUjiLab: 'proses_lab' as const, nomorSuratLab: '', keterangan: 'Di bawah ambang batas SEMA (1.0 gr)' }
  ]);
  const [newJenisZat, setNewJenisZat] = useState('Metamfetamina (Sabu)');
  const [newBerat, setNewBerat] = useState('0.2');

  // Form State: Step 3 (Dokumen)
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>([
    'doc-std-1', 'doc-std-2', 'doc-std-3', 'doc-std-4', 'doc-std-5'
  ]);

  if (!isOpen) return null;

  const handleAddBb = () => {
    if (!newBerat) return;
    setBarangBuktiList([
      ...barangBuktiList,
      {
        id: 'bb-' + Date.now(),
        jenisZat: newJenisZat,
        beratBersihGram: parseFloat(newBerat),
        statusUjiLab: 'proses_lab',
        nomorSuratLab: '',
        keterangan: 'Menunggu hasil uji konfirmasi lab'
      }
    ]);
    setNewBerat('');
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

  const handleSubmitAll = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newNomor = `TAT/2026/09/${randomNum}`;

    const newDocs: DokumenPersyaratan[] = DOC_TEMPLATES.map((std, idx) => {
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

    const newPermohonan: PermohonanAsesmen = {
      id: 'tat-' + randomNum,
      nomorPermohonan: newNomor,
      tanggalPengajuan: '8 September 2026',
      instansiPengaju: currentUser.agency,
      pengajuId: currentUser.id,
      pengajuNama: namaPenyidik,
      statusProsesUtama: 'verifikasi_berkas',
      statusMedis: 'belum_dimulai',
      statusHukum: 'belum_dimulai',
      statusDokumen: 'draf',
      statusTindakLanjut: 'belum_dikonfirmasi',
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
        tempatLahir,
        tanggalLahir,
        usia: Number(usia) || 24,
        jenisKelamin,
        pekerjaan,
        alamatKtp: alamatKtp || 'Jl. Gatot Subroto No. 12, Bandung',
        alamatDomisili: alamatKtp || 'Jl. Gatot Subroto No. 12, Bandung',
        statusIdentitasKhusus: statusKhusus,
        namaWaliPendamping: namaWali || 'Orang Tua / Kuasa Hukum',
        kontakWali: kontakWali || '0813-9876-5432'
      },
      perkara: {
        id: 'pk-' + Date.now(),
        nomorLaporanPolisi: nomorLp,
        tanggalLp,
        instansiPenyidik: currentUser.agency,
        namaPenyidik,
        nomorHpPenyidik,
        pasalDipersangkakan: pasal,
        tanggalWaktuPenangkapan: '7 September 2026 21:00 WIB',
        tempatKejadianPerkara: tkp,
        kronologiSingkat: kronologi,
        barangBuktiList
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

    onSubmit(newPermohonan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden border border-slate-300 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Pengajuan Permohonan Asesmen Terpadu Baru</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Penyampaian berkas perkara dan identitas terperiksa ke Sekretariat TAT (Perber 2014 & Perbnn 11/2021)
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Indicators */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-semibold">
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
                  ? 'text-blue-600 font-bold'
                  : step > s.num
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === s.num
                    ? 'bg-blue-600 text-white'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
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
          {/* STEP 1: IDENTITAS TERPERIKSA */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900">
                Pastikan data identitas sesuai dengan Kartu Tanda Penduduk atau data biometrik kependudukan.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Terperiksa *</label>
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Contoh: Terperiksa Test-1 / Subjek Uji"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Panggilan / Alias</label>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="Contoh: Subjek-01 / Test-A"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="16 Digit NIK"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status Kategori Terperiksa</label>
                  <select
                    value={statusKhusus}
                    onChange={(e) => setStatusKhusus(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="dewasa">Dewasa Umum</option>
                    <option value="anak_berhadapan_hukum">Anak Berhadapan Hukum (ABH - Di bawah 18 th)</option>
                    <option value="perlu_penerjemah">Perlu Penerjemah Bahasa / Isyarat</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tempat & Tanggal Lahir</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      placeholder="Tempat Lahir"
                      className="p-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="date"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Usia & Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={usia}
                      onChange={(e) => setUsia(Number(e.target.value))}
                      placeholder="Usia (Tahun)"
                      className="p-2 border border-slate-300 rounded-lg"
                    />
                    <select
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value as any)}
                      className="p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Alamat Sesuai KTP / Domisili</label>
                  <input
                    type="text"
                    value={alamatKtp}
                    onChange={(e) => setAlamatKtp(e.target.value)}
                    placeholder="Alamat lengkap terperiksa"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Wali / Pendamping Keluarga</label>
                  <input
                    type="text"
                    value={namaWali}
                    onChange={(e) => setNamaWali(e.target.value)}
                    placeholder="Nama Orang Tua / Pasangan / Pengacara"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kontak Telepon Wali</label>
                  <input
                    type="text"
                    value={kontakWali}
                    onChange={(e) => setKontakWali(e.target.value)}
                    placeholder="0812-XXXX-XXXX"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERKARA & BARANG BUKTI */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Laporan Polisi (LP) *</label>
                  <input
                    type="text"
                    value={nomorLp}
                    onChange={(e) => setNomorLp(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal LP</label>
                  <input
                    type="date"
                    value={tanggalLp}
                    onChange={(e) => setTanggalLp(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Pasal yang Dipersangkakan *</label>
                  <input
                    type="text"
                    value={pasal}
                    onChange={(e) => setPasal(e.target.value)}
                    placeholder="Contoh: Pasal 127 ayat (1) huruf a UU No. 35 Tahun 2009"
                    className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-slate-900 bg-amber-50/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Tempat Kejadian Perkara (TKP)</label>
                  <input
                    type="text"
                    value={tkp}
                    onChange={(e) => setTkp(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Kronologi Singkat Penangkapan</label>
                  <textarea
                    value={kronologi}
                    onChange={(e) => setKronologi(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Barang Bukti Sub-Form */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <span className="font-bold text-slate-800 block">Rincian Barang Bukti Narkotika</span>
                
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <select
                    value={newJenisZat}
                    onChange={(e) => setNewJenisZat(e.target.value)}
                    className="flex-1 p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Metamfetamina (Sabu)">Metamfetamina (Sabu)</option>
                    <option value="Ganja Kering">Ganja Kering</option>
                    <option value="MDMA / Ekstasi">MDMA / Ekstasi</option>
                    <option value="Tembakau Sintetis (Gorila)">Tembakau Sintetis (Gorila)</option>
                    <option value="Obat Keras (Tramadol/Trihex)">Obat Keras (Tramadol/Trihex)</option>
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Berat Bersih (gram)"
                    value={newBerat}
                    onChange={(e) => setNewBerat(e.target.value)}
                    className="w-40 p-2 border border-slate-300 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={handleAddBb}
                    className="bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah BB</span>
                  </button>
                </div>

                {/* Table of added BB */}
                <div className="space-y-1.5 pt-2">
                  {barangBuktiList.map(bb => (
                    <div key={bb.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900">{bb.jenisZat}</span>
                        <span className="text-slate-500 ml-2 font-semibold">({bb.beratBersihGram} gram netto)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBb(bb.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: KELENGKAPAN DOKUMEN PERSYARATAN */}
          {step === 3 && (
            <div className="space-y-3 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900">
                Pilih atau tandai dokumen persyaratan administrasi yang dilampirkan dalam berkas fisik/digital:
              </div>

              <div className="space-y-2">
                {DOC_TEMPLATES.map((doc) => {
                  const isChecked = uploadedDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDocUpload(doc.id)}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-blue-600"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{doc.nama}</span>
                            {doc.wajib && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold">
                                Wajib
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{doc.keterangan}</span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-semibold ${isChecked ? 'text-blue-600' : 'text-slate-400'}`}>
                        {isChecked ? 'Terlampir' : 'Belum Dilampirkan'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: KONFIRMASI PENGESAHAN */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-bold text-emerald-950 text-sm mb-1">Konfirmasi Ringkasan Pengajuan</h4>
                <p className="text-emerald-800">
                  Pastikan seluruh data di bawah ini telah sesuai sebelum dikirim ke Sekretariat TAT.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Nama Terperiksa</span>
                  <span className="font-bold text-slate-900">{namaLengkap || 'Belum diisi'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Nomor Laporan Polisi</span>
                  <span className="font-mono font-bold text-slate-900">{nomorLp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Pasal Sangkaan</span>
                  <span className="font-semibold text-slate-900">{pasal}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Jumlah Barang Bukti</span>
                  <span className="font-semibold text-slate-900">{barangBuktiList.length} Item</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Dokumen Dilampirkan</span>
                  <span className="font-bold text-blue-700">{uploadedDocIds.length} dari {DOC_TEMPLATES.length} Dokumen</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Instansi Pengaju</span>
                  <span className="font-semibold text-slate-900">{currentUser.agency}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-blue-700"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitAll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kirim Permohonan ke Sekretariat</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
