import React, { useState, useEffect } from 'react';
import { PermohonanAsesmen, PrasyaratPemeriksaan, UserProfile } from '../types';
import { prasyaratApi } from '../services/api';
import {
  FileCheck,
  Clock,
  UserCheck,
  Users,
  Languages,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Save,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  Calendar,
  Phone,
  Building,
  Check,
  RefreshCw,
} from 'lucide-react';

interface Props {
  permohonan: PermohonanAsesmen;
  currentUser?: UserProfile;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  isReadonly?: boolean;
}

export const PrasyaratPemeriksaanView: React.FC<Props> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan,
  isReadonly = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [waktuKedatangan, setWaktuKedatangan] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [kehadiranSubjek, setKehadiranSubjek] = useState<boolean>(false);
  const [pencocokanIdentitas, setPencocokanIdentitas] = useState<boolean>(false);
  const [catatanPencocokanIdentitas, setCatatanPencocokanIdentitas] = useState<string>('');

  // Pengantar & Pendamping
  const [namaPengantar, setNamaPengantar] = useState<string>(permohonan.perkara?.namaPenyidik || '');
  const [instansiPengantar, setInstansiPengantar] = useState<string>(permohonan.perkara?.instansiPenyidik || '');
  const [jabatanPengantar, setJabatanPengantar] = useState<string>('Penyidik / Pendamping Pengantar');
  const [kehadiranPengantar, setKehadiranPengantar] = useState<boolean>(true);

  const [kehadiranPendamping, setKehadiranPendamping] = useState<boolean>(false);
  const [namaPendamping, setNamaPendamping] = useState<string>(permohonan.terperiksa?.namaWaliPendamping || '');
  const [hubunganPendamping, setHubunganPendamping] = useState<string>('Orang Tua / Wali Hukum');
  const [dasarKeterlibatan, setDasarKeterlibatan] = useState<string>('Pendamping Resmi');
  const [kontakPendamping, setKontakPendamping] = useState<string>(permohonan.terperiksa?.kontakWali || '');

  // Penerjemah
  const [membutuhkanPenerjemah, setMembutuhkanPenerjemah] = useState<boolean>(false);
  const [namaPenerjemah, setNamaPenerjemah] = useState<string>('');
  const [bahasaPenerjemah, setBahasaPenerjemah] = useState<string>('');
  const [kehadiranPenerjemah, setKehadiranPenerjemah] = useState<boolean>(false);
  const [nomorPenugasanPenerjemah, setNomorPenugasanPenerjemah] = useState<string>('');

  // Form Persetujuan / Assent
  const [sudahDisetujui, setSudahDisetujui] = useState<boolean>(false);
  const [jenisFormPersetujuan, setJenisFormPersetujuan] = useState<string>(
    permohonan.terperiksa?.usia && permohonan.terperiksa.usia < 18
      ? 'Assent (Anak / Remaja di bawah 18 tahun)'
      : 'Informed Consent (Persetujuan Tindakan Dewasa)'
  );
  const [tanggalPersetujuan, setTanggalPersetujuan] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [penandatanganPersetujuan, setPenandatanganPersetujuan] = useState<string>(
    permohonan.terperiksa?.namaLengkap || ''
  );
  const [dokumenPersetujuanUrl, setDokumenPersetujuanUrl] = useState<string>('');

  // Pernyataan Bebas Biaya
  const [pernyataanBebasBiaya, setPernyataanBebasBiaya] = useState<boolean>(true);
  const [tanggalPernyataanBebasBiaya, setTanggalPernyataanBebasBiaya] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [dokumenBebasBiayaUrl, setDokumenBebasBiayaUrl] = useState<string>('');

  // Kondisi Khusus / Darurat
  const [kondisiKhususDarurat, setKondisiKhususDarurat] = useState<boolean>(false);
  const [catatanKondisiKhusus, setCatatanKondisiKhusus] = useState<string>('');
  const [tindakanDaruratRujukan, setTindakanDaruratRujukan] = useState<string>('');

  const [petugasPenerimaInfo, setPetugasPenerimaInfo] = useState<string>('');

  // Fetch data on load
  useEffect(() => {
    fetchPrasyaratData();
  }, [permohonan.id]);

  const fetchPrasyaratData = async () => {
    try {
      setLoading(true);
      const res = await prasyaratApi.getByPermohonan(permohonan.id);
      if (res.success && res.data?.prasyarat) {
        const p = res.data.prasyarat;
        if (p.waktuKedatangan) {
          setWaktuKedatangan(new Date(p.waktuKedatangan).toISOString().slice(0, 16));
        }
        setKehadiranSubjek(!!p.kehadiranSubjek);
        setPencocokanIdentitas(!!p.pencocokanIdentitas);
        setCatatanPencocokanIdentitas(p.catatanPencocokanIdentitas || '');

        setNamaPengantar(p.namaPengantar || permohonan.perkara?.namaPenyidik || '');
        setInstansiPengantar(p.instansiPengantar || permohonan.perkara?.instansiPenyidik || '');
        setJabatanPengantar(p.jabatanPengantar || 'Penyidik / Pendamping Pengantar');
        setKehadiranPengantar(!!p.kehadiranPengantar);

        setKehadiranPendamping(!!p.kehadiranPendamping);
        setNamaPendamping(p.namaPendamping || permohonan.terperiksa?.namaWaliPendamping || '');
        setHubunganPendamping(p.hubunganPendamping || 'Orang Tua / Wali Hukum');
        setDasarKeterlibatan(p.dasarKeterlibatan || 'Pendamping Resmi');
        setKontakPendamping(p.kontakPendamping || permohonan.terperiksa?.kontakWali || '');

        setMembutuhkanPenerjemah(!!p.membutuhkanPenerjemah);
        setNamaPenerjemah(p.namaPenerjemah || '');
        setBahasaPenerjemah(p.bahasaPenerjemah || '');
        setKehadiranPenerjemah(!!p.kehadiranPenerjemah);
        setNomorPenugasanPenerjemah(p.nomorPenugasanPenerjemah || '');

        setSudahDisetujui(!!p.sudahDisetujui);
        setJenisFormPersetujuan(p.jenisFormPersetujuan || 'Informed Consent (Persetujuan Tindakan Dewasa)');
        if (p.tanggalPersetujuan) {
          setTanggalPersetujuan(new Date(p.tanggalPersetujuan).toISOString().slice(0, 10));
        }
        setPenandatanganPersetujuan(p.penandatanganPersetujuan || permohonan.terperiksa?.namaLengkap || '');
        setDokumenPersetujuanUrl(p.dokumenPersetujuanUrl || '');

        setPernyataanBebasBiaya(p.pernyataanBebasBiaya ?? true);
        if (p.tanggalPernyataanBebasBiaya) {
          setTanggalPernyataanBebasBiaya(new Date(p.tanggalPernyataanBebasBiaya).toISOString().slice(0, 10));
        }
        setDokumenBebasBiayaUrl(p.dokumenBebasBiayaUrl || '');

        setKondisiKhususDarurat(!!p.kondisiKhususDarurat);
        setCatatanKondisiKhusus(p.catatanKondisiKhusus || '');
        setTindakanDaruratRujukan(p.tindakanDaruratRujukan || '');

        if (p.petugasPenerima) {
          setPetugasPenerimaInfo(`${p.petugasPenerima.name} (${p.petugasPenerima.role})`);
        }
      }
    } catch (err: any) {
      console.warn('Gagal memuat prasyarat (mungkin belum diisi):', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const payload: Partial<PrasyaratPemeriksaan> = {
        waktuKedatangan,
        kehadiranSubjek,
        pencocokanIdentitas,
        catatanPencocokanIdentitas,

        namaPengantar,
        instansiPengantar,
        jabatanPengantar,
        kehadiranPengantar,

        kehadiranPendamping,
        namaPendamping,
        hubunganPendamping,
        dasarKeterlibatan,
        kontakPendamping,

        membutuhkanPenerjemah,
        namaPenerjemah,
        bahasaPenerjemah,
        kehadiranPenerjemah,
        nomorPenugasanPenerjemah,

        sudahDisetujui,
        jenisFormPersetujuan,
        tanggalPersetujuan,
        penandatanganPersetujuan,
        dokumenPersetujuanUrl,

        pernyataanBebasBiaya,
        tanggalPernyataanBebasBiaya,
        dokumenBebasBiayaUrl,

        kondisiKhususDarurat,
        catatanKondisiKhusus,
        tindakanDaruratRujukan,
      };

      const res = await prasyaratApi.save(permohonan.id, payload);
      if (res.success) {
        setSuccessMsg('Prasyarat pemeriksaan dan kedatangan subjek berhasil disimpan!');
        if (onUpdatePermohonan) {
          onUpdatePermohonan({
            ...permohonan,
            prasyaratPemeriksaan: res.data,
            applicationStatus: (kehadiranSubjek && sudahDisetujui && permohonan.applicationStatus === 'SCHEDULED')
              ? 'ASSESSMENT_ACTIVE'
              : permohonan.applicationStatus,
          });
        }
      } else {
        setErrorMsg(res.message || 'Gagal menyimpan prasyarat');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const isComplete = kehadiranSubjek && pencocokanIdentitas && sudahDisetujui && pernyataanBebasBiaya;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-cyan-400" />
        <span>Memuat data prasyarat pemeriksaan & kedatangan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isComplete ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Prasyarat Pemeriksaan & Kedatangan Subjek</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${isComplete ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50' : 'bg-amber-950/80 text-amber-300 border-amber-700/50'}`}>
                  {isComplete ? '✓ Prasyarat Lengkap & Siap Asesmen' : '⚠️ Perlu Melengkapi Prasyarat'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Checklist kehadiran, penerjemah, persetujuan (informed consent/assent), & pernyataan bebas biaya sebelum asesmen medis/hukum dimulai.
              </p>
            </div>
          </div>

          {petugasPenerimaInfo && (
            <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              Penerima: <span className="text-cyan-300 font-medium">{petugasPenerimaInfo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="bg-emerald-950/90 border border-emerald-700/60 rounded-xl p-4 flex items-center gap-3 text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-950/90 border border-rose-700/60 rounded-xl p-4 flex items-center gap-3 text-rose-200 text-sm">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid 2 Kolom untuk Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. KEHADIRAN & DENTITAS SUBJEK */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-slate-100 text-sm">1. Kehadiran & Identitas Subjek</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Waktu Kedatangan</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  disabled={isReadonly}
                  value={waktuKedatangan}
                  onChange={(e) => setWaktuKedatangan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Subjek (Terperiksa) Hadir</span>
                <span className="text-xs text-slate-400">{permohonan.terperiksa?.namaLengkap} ({permohonan.terperiksa?.jenisKelamin}, {permohonan.terperiksa?.usia} thn)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isReadonly}
                  checked={kehadiranSubjek}
                  onChange={(e) => setKehadiranSubjek(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Pencocokan Identitas Sesuai</span>
                <span className="text-xs text-slate-400">Verifikasi NIK/KTP & foto fisik terperiksa</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isReadonly}
                  checked={pencocokanIdentitas}
                  onChange={(e) => setPencocokanIdentitas(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Catatan Pencocokan Identitas</label>
              <input
                type="text"
                disabled={isReadonly}
                placeholder="misal: Sesuai KTP asli / Menggunakan Surat Keterangan Domisili"
                value={catatanPencocokanIdentitas}
                onChange={(e) => setCatatanPencocokanIdentitas(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* 2. PETUGAS PENGANTAR & PENDAMPING/WALI */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-slate-100 text-sm">2. Pengantar & Pendamping/Wali Hadir</h4>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Petugas Pengantar</label>
                <input
                  type="text"
                  disabled={isReadonly}
                  value={namaPengantar}
                  onChange={(e) => setNamaPengantar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Instansi Pengantar</label>
                <input
                  type="text"
                  disabled={isReadonly}
                  value={instansiPengantar}
                  onChange={(e) => setInstansiPengantar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Checklist Pendamping/Wali */}
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-200 block">Pendamping / Wali Hadir</span>
                  <span className="text-xs text-slate-400">Pencatatan hadir fisik keluarga / kuasa hukum</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isReadonly}
                    checked={kehadiranPendamping}
                    onChange={(e) => setKehadiranPendamping(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {kehadiranPendamping && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nama Pendamping/Wali</label>
                    <input
                      type="text"
                      disabled={isReadonly}
                      value={namaPendamping}
                      onChange={(e) => setNamaPendamping(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hubungan & Dasar</label>
                    <input
                      type="text"
                      disabled={isReadonly}
                      value={hubunganPendamping}
                      onChange={(e) => setHubunganPendamping(e.target.value)}
                      placeholder="e.g. Orang Tua / Kuasa Hukum"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">No. Kontak Pendamping</label>
                    <input
                      type="text"
                      disabled={isReadonly}
                      value={kontakPendamping}
                      onChange={(e) => setKontakPendamping(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. PENERJEMAH */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Languages className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-slate-100 text-sm">3. Fasilitas Penerjemah Bahasa / Bahasa Isyarat</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Membutuhkan Penerjemah?</span>
                <span className="text-xs text-slate-400">Untuk kendala bahasa daerah, asing, atau disabilitas wicara</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isReadonly}
                  checked={membutuhkanPenerjemah}
                  onChange={(e) => setMembutuhkanPenerjemah(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {membutuhkanPenerjemah && (
              <div className="space-y-2 p-3 bg-purple-950/20 border border-purple-800/40 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nama Penerjemah</label>
                    <input
                      type="text"
                      disabled={isReadonly}
                      value={namaPenerjemah}
                      onChange={(e) => setNamaPenerjemah(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Bahasa / Spesialisasi</label>
                    <input
                      type="text"
                      disabled={isReadonly}
                      placeholder="e.g. Bahasa Isyarat / Bahasa Mandarin"
                      value={bahasaPenerjemah}
                      onChange={(e) => setBahasaPenerjemah(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-300">Penerjemah Hadir di Sesi</span>
                  <input
                    type="checkbox"
                    disabled={isReadonly}
                    checked={kehadiranPenerjemah}
                    onChange={(e) => setKehadiranPenerjemah(e.target.checked)}
                    className="w-4 h-4 rounded accent-purple-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. FORM PERSETUJUAN / ASSENT */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-semibold text-slate-100 text-sm">4. Persetujuan Tindakan / Assent (Informed Consent)</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Form Persetujuan Telah Ditandatangani</span>
                <span className="text-xs text-slate-400">Persetujuan terperiksa / wali mengikuti proses asesmen</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isReadonly}
                  checked={sudahDisetujui}
                  onChange={(e) => setSudahDisetujui(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Jenis Form Persetujuan</label>
              <select
                disabled={isReadonly}
                value={jenisFormPersetujuan}
                onChange={(e) => setJenisFormPersetujuan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Informed Consent (Persetujuan Tindakan Dewasa)">Informed Consent (Dewasa &ge; 18 thn)</option>
                <option value="Assent (Anak / Remaja di bawah 18 tahun)">Form Assent (Anak / Remaja &lt; 18 thn)</option>
                <option value="Persetujuan Wali / Pengampu Hukum">Persetujuan Wali / Pengampu Hukum</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tanggal Persetujuan</label>
                <input
                  type="date"
                  disabled={isReadonly}
                  value={tanggalPersetujuan}
                  onChange={(e) => setTanggalPersetujuan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Penandatangan</label>
                <input
                  type="text"
                  disabled={isReadonly}
                  value={penandatanganPersetujuan}
                  onChange={(e) => setPenandatanganPersetujuan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. PERNYATAAN BEBAS BIAYA */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h4 className="font-semibold text-slate-100 text-sm">5. Pernyataan Bebas Biaya Layanan TAT</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Pernyataan Layanan Gratis (Rp 0)</span>
                <span className="text-xs text-slate-400">Seluruh proses asesmen TAT POLRI tidak dipungut biaya apapun</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isReadonly}
                  checked={pernyataanBebasBiaya}
                  onChange={(e) => setPernyataanBebasBiaya(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <p className="text-xs text-slate-400 italic">
              *Petugas penerima memastikan pemohon/keluarga disosialisasikan bahwa tidak ada pungutan liar dalam bentuk apapun.
            </p>
          </div>
        </div>

        {/* 6. KONDISI KHUSUS / DARURAT */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 className="font-semibold text-slate-100 text-sm">6. Kondisi Khusus / Darurat Medis</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Ada Kondisi Darurat / Khusus?</span>
                <span className="text-xs text-slate-400">misal: Sakau berat, cedera fisik, butuh pertolongan pertama</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isReadonly}
                  checked={kondisiKhususDarurat}
                  onChange={(e) => setKondisiKhususDarurat(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {kondisiKhususDarurat && (
              <div className="space-y-2 p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Catatan Temuan Kondisi Khusus</label>
                  <textarea
                    rows={2}
                    disabled={isReadonly}
                    value={catatanKondisiKhusus}
                    onChange={(e) => setCatatanKondisiKhusus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tindakan Pertolongan / Rujukan Darurat</label>
                  <input
                    type="text"
                    disabled={isReadonly}
                    placeholder="e.g. Ditangani Dokter Jaga / Dirujuk ke RS Bhayangkara"
                    value={tindakanDaruratRujukan}
                    onChange={(e) => setTindakanDaruratRujukan(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Submit Button */}
      {!isReadonly && (
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Prasyarat Pemeriksaan</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
