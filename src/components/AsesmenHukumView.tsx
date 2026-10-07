import React, { useState, useEffect } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import {
  Scale,
  ArrowLeft,
  ArrowRight,
  Shield,
  FileText,
  FileSignature,
  CheckCircle2,
  Save,
  Clock,
  User,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  Building2,
  CheckSquare,
  Square,
  Sparkles,
  Gavel,
  BookOpen,
  Check,
  Package
} from 'lucide-react';
import { ModalLihatDokumenBb } from './ModalLihatDokumenBb';

interface AsesmenHukumViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  onSelectPermohonan?: (id: string) => void;
  selectedCaseId?: string | null;
  onSelectCase?: (id: string | null) => void;
  mode?: 'active' | 'history';
}

export const AsesmenHukumView: React.FC<AsesmenHukumViewProps> = ({
  permohonanList,
  currentUser,
  onUpdatePermohonan,
  onSelectPermohonan,
  selectedCaseId: propSelectedCaseId,
  onSelectCase,
  mode = 'active'
}) => {
  const isReadOnly = mode === 'history';
  const [internalSelectedCaseId, setInternalSelectedCaseId] = useState<string | null>(null);
  const selectedCaseId = propSelectedCaseId !== undefined ? propSelectedCaseId : internalSelectedCaseId;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [showDokumenModal, setShowDokumenModal] = useState<boolean>(false);

  const selectedCase = permohonanList.find(p => p.id === selectedCaseId);

  // Form local state for legal assessment
  const [formData, setFormData] = useState({
    // 1. Konstruksi Kasus
    nomorLp: '',
    pasalSangkaan: '',
    kronologiPenangkapan: '',
    lokasiTkp: '',
    
    // 2. Telaah Barang Bukti SEMA 04/2010
    totalBeratBersihGram: '0.42',
    ambangBatasSema: 'Maksimal 1.0 Gram (Metamfetamina / Sabu SEMA No. 04/2010)',
    kesesuaianSema: 'Memenuhi Batas Gramatur SEMA 04/2010 (Pemakaian 1 Hari)',
    analisisBarangBukti: 'Total barang bukti narkotika jenis sabu seberat 0.42 gram berada di bawah ambang batas SEMA No. 04 Tahun 2010 (maksimal 1 gram untuk 1 hari konsumsi pribadi).',

    // 3. Analisis Peran & Tipologi
    analisisPeran: 'Penyalahguna Murni' as 'Penyalahguna Murni' | 'Korban Penyalahgunaan' | 'Pecandu dengan Kepemilikan Terbatas' | 'Indikasi Pengedar / Jaringan' | 'Belum Dapat Disimpulkan',
    argumentasiPeran: 'Tersangka ditangkap saat/sesaat setelah menggunakan sabu di tempat tinggalnya. Tidak ditemukan barang bukti timbangan digital, plastik klip kosong dalam jumlah banyak, maupun catatan rekapan penjualan narkotika.',
    catatanBelumTerverifikasi: 'Informasi awal mengenai perantara yang memasok sabu (DPO inisial RK) masih dalam penelusuran penyidik Satresnarkoba.',

    // 4. Riwayat Hukum & Penelusuran Jaringan
    pernahDitangkap: false,
    keteranganPerkaraLalu: 'Belum pernah dihukum / tidak terdaftar dalam database residivis Ditresnarkoba & Kejaksaan.',
    terverifikasiDatabase: true,
    keterkaitanSindikat: 'Tidak terafiliasi dengan jaringan pengedar terorganisir (Konsumen akhir terputus)',
    sumberPerolehan: 'Membeli langsung secara patungan tunai dari pihak ketiga untuk dipakai sendiri',

    // 5. Kesimpulan & Rekomendasi Yuridis (Siap Pleno)
    rekomendasiHukum: 'Proses Hukum Dilanjutkan dengan Rehabilitasi' as 'Proses Hukum Dilanjutkan dengan Rehabilitasi' | 'Proses Hukum Dilanjutkan Tanpa Rehabilitasi' | 'Penerapan Keadilan Restoratif / Diversi' | 'Perlu Pendalaman Penyidikan',
    kesimpulanHukum: 'Berdasarkan kualifikasi yuridis Pasal 127 UU No. 35/2009, SEMA 04/2010, dan Pedoman Jaksa Agung No. 18/2021, tersangka dikualifikasikan sebagai Penyalah Guna Narkotika bagi Diri Sendiri yang berhak mendapatkan rehabilitasi medis dan sosial melalui mekanisme TAT.',
    catatanKlarifikasi: 'Proses penyidikan perkara pokok tetap berjalan sesuai koridor hukum acara pidana, dengan penempatan tersangka di fasilitas rehabilitasi yang ditunjuk.'
  });

  // Checklist Fakta Yuridis Pendukung
  const [faktaList, setFaktaList] = useState<Array<{ id: string; text: string; checked: boolean }>>([
    { id: 'f1', text: 'Tertangkap tangan saat atau sesaat setelah menggunakan narkotika untuk diri sendiri', checked: true },
    { id: 'f2', text: 'Hasil uji urin laboratorium forensik terkonfirmasi positif zat narkotika (SKHPU)', checked: true },
    { id: 'f3', text: 'Barang bukti berada di bawah batas gramatur Surat Edaran Mahkamah Agung (SEMA No. 04/2010)', checked: true },
    { id: 'f4', text: 'Tidak ditemukan timbangan digital, plastik klip kosong dalam jumlah besar, atau alat pres', checked: true },
    { id: 'f5', text: 'Tidak ditemukan catatan transaksi, buku rekap peredaran, atau mutasi rekening penampung hasil jual-beli', checked: true },
    { id: 'f6', text: 'Bukan merupakan residivis tindak pidana peredaran gelap narkotika (Pasal 114 / 112)', checked: true }
  ]);

  // Synchronize form when selectedCase changes
  useEffect(() => {
    if (!selectedCase) return;

    setActiveStep(1);
    const bbText = selectedCase.perkara.barangBuktiList?.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ') || '';

    setFormData(prev => ({
      ...prev,
      nomorLp: selectedCase.perkara.nomorLaporanPolisi,
      pasalSangkaan: selectedCase.perkara.pasalDipersangkakan,
      kronologiPenangkapan: selectedCase.perkara.kronologiSingkat || prev.kronologiPenangkapan,
      lokasiTkp: selectedCase.perkara.tempatKejadianPerkara || 'Samarinda, Kalimantan Timur',
      totalBeratBersihGram: selectedCase.perkara.barangBuktiList?.[0]?.beratBersihGram?.toString() || prev.totalBeratBersihGram,
      analisisBarangBukti: selectedCase.asesmenHukum?.analisisBarangBukti || `Barang bukti yang disita berupa ${bbText} memenuhi kriteria SEMA 04/2010.`,
      analisisPeran: selectedCase.asesmenHukum?.analisisPeran || prev.analisisPeran,
      argumentasiPeran: selectedCase.asesmenHukum?.argumentasiPeran || prev.argumentasiPeran,
      catatanBelumTerverifikasi: selectedCase.asesmenHukum?.catatanBelumTerverifikasi || prev.catatanBelumTerverifikasi,
      pernahDitangkap: selectedCase.asesmenHukum?.riwayatResidivisme?.pernahDitangkap ?? prev.pernahDitangkap,
      keteranganPerkaraLalu: selectedCase.asesmenHukum?.riwayatResidivisme?.keteranganPerkaraLalu || prev.keteranganPerkaraLalu,
      rekomendasiHukum: selectedCase.asesmenHukum?.rekomendasiHukum || prev.rekomendasiHukum,
      kesimpulanHukum: selectedCase.asesmenHukum?.kesimpulanHukum || prev.kesimpulanHukum,
      catatanKlarifikasi: selectedCase.asesmenHukum?.catatanKlarifikasi || prev.catatanKlarifikasi
    }));

    if (selectedCase.asesmenHukum?.faktaPendukung && selectedCase.asesmenHukum.faktaPendukung.length > 0) {
      setFaktaList(prev => prev.map(f => ({
        ...f,
        checked: selectedCase.asesmenHukum!.faktaPendukung.includes(f.text)
      })));
    }
  }, [selectedCaseId]);

  const isCompleted = 
    selectedCase?.asesmenHukum?.status === 'FINAL' || 
    selectedCase?.legalStatus === 'FINAL' ||
    selectedCase?.applicationStatus === 'READY_FOR_CONFERENCE' ||
    selectedCase?.applicationStatus === 'CONFERENCE_HELD' ||
    selectedCase?.applicationStatus === 'OUTCOME_RECORDED_FOR_DRAFT' ||
    selectedCase?.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' ||
    selectedCase?.applicationStatus === 'RESULTS_ISSUED' ||
    selectedCase?.statusProsesUtama === 'siap_pleno' ||
    selectedCase?.statusProsesUtama === 'pengesahan_rekomendasi' ||
    selectedCase?.statusProsesUtama === 'rekomendasi_terbit' ||
    selectedCase?.statusProsesUtama === 'selesai_tindak_lanjut';

  const isReadOnlyView = isReadOnly || isCompleted;

  const toggleFakta = (id: string) => {
    if (isReadOnlyView) return;
    setFaktaList(prev => prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  };

  // Open dedicated legal assessment workbook for a case
  const handleOpenCase = (item: PermohonanAsesmen) => {
    if (onSelectCase) {
      onSelectCase(item.id);
    } else {
      setInternalSelectedCaseId(item.id);
    }
  };

  const handleCloseCase = () => {
    if (onSelectCase) {
      onSelectCase(null);
    } else {
      setInternalSelectedCaseId(null);
    }
  };

  const handleSaveLegalForm = (isFinal: boolean) => {
    if (!selectedCase || isReadOnlyView) return;

    let updated: PermohonanAsesmen = { ...selectedCase };
    const now = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const checkedFakta = faktaList.filter(f => f.checked).map(f => f.text);

    const asesmenHukumData: any = {
      id: updated.asesmenHukum?.id || `hukum-${Date.now()}`,
      asesorId: currentUser.id,
      asesorNama: currentUser.name,
      tanggalTelaah: now,
      status: isFinal ? 'FINAL' : 'DRAFT',
      riwayatResidivisme: {
        pernahDitangkap: formData.pernahDitangkap,
        keteranganPerkaraLalu: formData.keteranganPerkaraLalu,
        terverifikasiDatabase: formData.terverifikasiDatabase
      },
      analisisPeran: formData.analisisPeran,
      argumentasiPeran: formData.argumentasiPeran,
      faktaPendukung: checkedFakta,
      catatanBelumTerverifikasi: formData.catatanBelumTerverifikasi,
      analisisBarangBukti: formData.analisisBarangBukti,
      kesimpulanHukum: formData.kesimpulanHukum,
      rekomendasiHukum: formData.rekomendasiHukum,
      catatanKlarifikasi: formData.catatanKlarifikasi,
      terakhirDiperbarui: now
    };

    updated.asesmenHukum = asesmenHukumData;

    if (isFinal) {
      updated.legalStatus = 'FINAL';
      if (updated.statusProsesUtama === 'asesmen_berlangsung' || updated.statusProsesUtama === 'penugasan_jadwal') {
        updated.statusProsesUtama = 'siap_pleno';
      }
    }

    const existingLogs = Array.isArray(updated.auditLogs) ? updated.auditLogs : [];
    updated.auditLogs = [
      ...existingLogs,
      {
        id: `log-${Date.now()}`,
        timestamp: now,
        aksi: isFinal ? 'Finalisasi Asesmen Hukum' : 'Simpan Draf Asesmen Hukum',
        actorNama: currentUser.name,
        actorPeran: currentUser.role,
        rincian: isFinal
          ? `Telaah yuridis difinalisasi: Kualifikasi peran '${formData.analisisPeran}' dengan rekomendasi '${formData.rekomendasiHukum}'. Siap Pleno TAT.`
          : `Draf telaah yuridis disimpan oleh ${currentUser.name}.`
      }
    ];

    if (onUpdatePermohonan) {
      onUpdatePermohonan(updated);
    }

    setSaveFeedback(isFinal ? '✅ Asesmen Hukum Berhasil Difinalisasi & Berpindah ke Riwayat Asesmen Hukum!' : '💾 Draf Asesmen Hukum Berhasil Disimpan!');
    if (isFinal) {
      setTimeout(() => {
        handleCloseCase();
      }, 1500);
    } else {
      setTimeout(() => setSaveFeedback(null), 4000);
    }
  };

  // Filtered cases list based on active mode vs history mode
  const filteredCases = permohonanList.filter(item => {
    const matchesSearch = item.nomorPermohonan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.terperiksa.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perkara.nomorLaporanPolisi.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const isHukumBeres = 
      item.asesmenHukum?.status === 'FINAL' || 
      item.legalStatus === 'FINAL' ||
      item.applicationStatus === 'READY_FOR_CONFERENCE' ||
      item.applicationStatus === 'CONFERENCE_HELD' ||
      item.applicationStatus === 'OUTCOME_RECORDED_FOR_DRAFT' ||
      item.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' ||
      item.applicationStatus === 'RESULTS_ISSUED' ||
      item.statusProsesUtama === 'siap_pleno' ||
      item.statusProsesUtama === 'pengesahan_rekomendasi' ||
      item.statusProsesUtama === 'rekomendasi_terbit' ||
      item.statusProsesUtama === 'selesai_tindak_lanjut';

    if (mode === 'history') {
      return isHukumBeres;
    } else {
      // Active queue: only show active tasks (not yet final/done)
      return !isHukumBeres;
    }
  });

  // ==========================================
  // VIEW 2: DEDICATED LEGAL WORKBOOK DETAIL PAGE
  // ==========================================
  if (selectedCase) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Navigation & Case Summary Header */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]/80">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCloseCase}
                className="p-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-300 hover:text-white rounded-lg border border-[#234475] transition-colors cursor-pointer"
                title="Kembali ke Daftar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Lembar Telaah Yuridis Asesmen Hukum TAT {isReadOnlyView && <span className="text-blue-400 font-normal">(Riwayat / Selesai)</span>}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowDokumenModal(true)}
                className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] border border-[#234475] rounded-xl text-xs font-bold text-white flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Package className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lihat Dokumen &amp; Barang Bukti</span>
              </button>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                isReadOnlyView
                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/50'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
              }`}>
                {isReadOnlyView ? 'RIWAYAT / FINAL' : 'AKTIF / DRAFT'}
              </span>
            </div>
          </div>

          {/* Subject Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="md:col-span-2 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-sm text-[#d4af37]">{selectedCase.nomorPermohonan}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#142642] text-slate-200 border border-[#234475]">
                  LP: {selectedCase.perkara.nomorLaporanPolisi}
                </span>
              </div>
              <p className="text-base font-bold text-white leading-tight mt-1">{selectedCase.terperiksa.namaLengkap}</p>
              <p className="text-slate-400 text-[11px]">
                NIK: <span className="font-mono text-slate-200">{selectedCase.terperiksa.nik}</span> • Usia: {selectedCase.terperiksa.usia} th • Pasal: <span className="text-amber-300 font-mono">{selectedCase.perkara.pasalDipersangkakan}</span>
              </p>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Penyidik Satuan:</span>
              <p className="font-semibold text-white truncate">{selectedCase.perkara.namaPenyidik}</p>
              <p className="text-[11px] text-slate-400 truncate">{selectedCase.perkara.instansiPenyidik}</p>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Barang Bukti Sitaan:</span>
              <div className="space-y-0.5">
                {selectedCase.perkara.barangBuktiList.map((bb, i) => (
                  <p key={i} className="text-[11px] text-slate-200 font-semibold truncate">
                    • {bb.jenisZat} {bb.beratBersihGram} gram ({bb.statusKategoriBb})
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Status Banner */}
        {isReadOnlyView && (
          <div className="bg-[#0e2238] border border-blue-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md animate-in fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-900/50 rounded-xl text-blue-300 border border-blue-500/30 shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Mode Arsip &amp; Telaah Yuridis (Read-Only)</h4>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Berkas telaah hukum ini telah difinalisasi secara sah. Seluruh lembar isian dan telaah yuridis terkunci untuk menjaga keaslian data.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-700/60 rounded-lg font-bold">
                TERKUNCI / FINAL
              </span>
            </div>
          </div>
        )}

        {/* Success Feedback Alert */}
        {saveFeedback && (
          <div className="p-4 bg-blue-950/80 border border-blue-500/50 rounded-2xl text-blue-200 text-xs font-semibold flex items-center space-x-2.5 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Section Navigation Tabs (Workbook Stepper) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { id: 1, label: '1. Konstruksi Kasus', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 2, label: '2. Telaah SEMA 04', icon: <Scale className="w-3.5 h-3.5" /> },
            { id: 3, label: '3. Kualifikasi Peran', icon: <User className="w-3.5 h-3.5" /> },
            { id: 4, label: '4. Sindikat & Jaringan', icon: <Shield className="w-3.5 h-3.5" /> },
            { id: 5, label: '5. Rekomendasi Pleno', icon: <Gavel className="w-3.5 h-3.5" /> },
            { id: 6, label: '6. Pengesahan', icon: <FileSignature className="w-3.5 h-3.5" /> }
          ].map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeStep === step.id
                  ? 'bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-500 text-white shadow-md'
                  : 'bg-[#091426] border-[#1b3459] text-slate-400 hover:text-slate-200 hover:bg-[#10233f]'
              }`}
            >
              {step.icon}
              <span className="truncate">{step.label}</span>
            </button>
          ))}
        </div>

        {/* SECTION 1: KONSTRUKSI KASUS & DOKUMEN PERKARA */}
        {activeStep === 1 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Konstruksi Perkara &amp; Dokumen Penyidikan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Nomor Laporan Polisi (LP / LKN)</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.nomorLp}
                  onChange={(e) => setFormData({ ...formData, nomorLp: e.target.value })}
                  placeholder="LP/A/128/VIII/2026/SPKT/POLRESTA SAMARINDA"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Pasal yang Dipersangkakan Penyidik</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.pasalSangkaan}
                  onChange={(e) => setFormData({ ...formData, pasalSangkaan: e.target.value })}
                  placeholder="Pasal 114 ayat (1) subs Pasal 112 ayat (1) lebih subs Pasal 127 ayat (1) huruf a UU No. 35/2009"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Tempat Kejadian Perkara (TKP Penangkapan)</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.lokasiTkp}
                  onChange={(e) => setFormData({ ...formData, lokasiTkp: e.target.value })}
                  placeholder="Jalan Pelita No. 45, RT 12, Kel. Sungai Pinang Dalam, Kec. Samarinda Utara"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Kronologi Singkat Fakta Penangkapan</label>
                <textarea
                  rows={4}
                  disabled={isReadOnlyView}
                  value={formData.kronologiPenangkapan}
                  onChange={(e) => setFormData({ ...formData, kronologiPenangkapan: e.target.value })}
                  placeholder="Tuliskan kronologi singkat saat petugas mengamankan tersangka beserta barang buktinya..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Lanjut ke Telaah SEMA 04/2010</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: TELAAH BARANG BUKTI SEMA NO. 04 TAHUN 2010 */}
        {activeStep === 2 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <Scale className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Telaah Batasan Gramatur Barang Bukti (SEMA 04/2010)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Total Berat Bersih Barang Bukti (Gram)</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.totalBeratBersihGram}
                  onChange={(e) => setFormData({ ...formData, totalBeratBersihGram: e.target.value })}
                  placeholder="0.42"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-bold font-mono text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Rujukan Ambang Batas SEMA No. 04 Tahun 2010</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.ambangBatasSema}
                  onChange={(e) => setFormData({ ...formData, ambangBatasSema: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-slate-300 p-2.5 rounded-xl outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-slate-300 font-semibold mb-1.5 block">Status Kesesuaian Gramatur Konsumsi 1 Hari</label>
                <select
                  disabled={isReadOnlyView}
                  value={formData.kesesuaianSema}
                  onChange={(e) => setFormData({ ...formData, kesesuaianSema: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 cursor-pointer font-bold text-emerald-400 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="Memenuhi Batas Gramatur SEMA 04/2010 (Pemakaian 1 Hari)">Memenuhi Batas Gramatur SEMA 04/2010 (Pemakaian 1 Hari Konsumsi Pribadi)</option>
                  <option value="Melebihi Batas Gramatur SEMA 04/2010 (Indikasi Stok / Penjualan)">Melebihi Batas Gramatur SEMA 04/2010 (Indikasi Stok / Penjualan)</option>
                  <option value="Tanpa Barang Bukti Narkotika (Hanya Positif Urin / Pasal 127)">Tanpa Barang Bukti Narkotika (Hanya Positif Urin / Pasal 127)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-slate-300 font-semibold mb-1.5 block">Analisis &amp; Pertimbangan Yuridis Barang Bukti</label>
                <textarea
                  rows={3}
                  disabled={isReadOnlyView}
                  value={formData.analisisBarangBukti}
                  onChange={(e) => setFormData({ ...formData, analisisBarangBukti: e.target.value })}
                  placeholder="Uraikan evaluasi yuridis terkait barang bukti yang disita penyidik..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Lanjut ke Kualifikasi Peran</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: KUALIFIKASI PERAN & CHECKLIST FAKTA YURIDIS */}
        {activeStep === 3 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <User className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Kualifikasi Peran &amp; Checklist Fakta Yuridis Terverifikasi</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Kualifikasi Tipologi Peran Terperiksa</label>
                <select
                  disabled={isReadOnlyView}
                  value={formData.analisisPeran}
                  onChange={(e: any) => setFormData({ ...formData, analisisPeran: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-3 rounded-xl outline-none focus:border-blue-500 cursor-pointer font-bold text-sm text-[#d4af37] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="Penyalahguna Murni">Penyalah Guna Murni (Hanya untuk Diri Sendiri / Konsumsi Pribadi)</option>
                  <option value="Pecandu dengan Kepemilikan Terbatas">Pecandu dengan Kepemilikan Terbatas (Patungan / Membeli Bersama)</option>
                  <option value="Korban Penyalahgunaan">Korban Penyalahgunaan Narkotika (Ditipu / Dipaksa / Dijebak)</option>
                  <option value="Indikasi Pengedar / Jaringan">Indikasi Pengedar / Terlibat Jaringan Peredaran Gelap</option>
                  <option value="Belum Dapat Disimpulkan">Belum Dapat Disimpulkan (Perlu Pendalaman)</option>
                </select>
              </div>

              {/* Checklist Fakta Pendukung */}
              <div className="space-y-2 pt-2">
                <label className="text-slate-300 font-semibold block">Checklist Fakta Yuridis Pendukung (Centang yang Terbukti Memenuhi):</label>
                <div className="space-y-2">
                  {faktaList.map((fakta) => (
                    <div
                      key={fakta.id}
                      onClick={() => toggleFakta(fakta.id)}
                      className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                        isReadOnlyView ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        fakta.checked
                          ? 'bg-blue-950/40 border-blue-500/60 text-white'
                          : 'bg-[#050e1c] border-[#1b3459] text-slate-400 hover:bg-[#0c1c34]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isReadOnlyView}
                        checked={fakta.checked}
                        onChange={() => toggleFakta(fakta.id)}
                        className="w-4 h-4 accent-blue-600 rounded shrink-0 disabled:cursor-not-allowed"
                      />
                      <span className="text-xs font-semibold leading-snug">{fakta.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Argumentasi Yuridis Kualifikasi Peran</label>
                <textarea
                  rows={3}
                  disabled={isReadOnlyView}
                  value={formData.argumentasiPeran}
                  onChange={(e) => setFormData({ ...formData, argumentasiPeran: e.target.value })}
                  placeholder="Uraikan alasan mengapa tersangka dikualifikasikan pada peran tersebut..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Catatan Fakta yang Belum Cukup Bukti / Masih Ditelusuri</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.catatanBelumTerverifikasi}
                  onChange={(e) => setFormData({ ...formData, catatanBelumTerverifikasi: e.target.value })}
                  placeholder="Contoh: Pemasok narkotika (DPO) masih dalam penelusuran penyidik..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Lanjut ke Sindikat &amp; Jaringan</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 4: SINDIKAT, JARINGAN & RESIDIVISME */}
        {activeStep === 4 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <Shield className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Penelusuran Sindikat Jaringan &amp; Riwayat Residivisme</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Status Riwayat Residivis Pidana</label>
                <select
                  disabled={isReadOnlyView}
                  value={formData.pernahDitangkap ? 'ya' : 'tidak'}
                  onChange={(e) => setFormData({ ...formData, pernahDitangkap: e.target.value === 'ya' })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="tidak">Belum Pernah Ditangkap / Bukan Residivis</option>
                  <option value="ya">Pernah Ditangkap / Residivis</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Keterkaitan dengan Jaringan Sindikat Narkotika</label>
                <select
                  disabled={isReadOnlyView}
                  value={formData.keterkaitanSindikat}
                  onChange={(e) => setFormData({ ...formData, keterkaitanSindikat: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="Tidak terafiliasi dengan jaringan pengedar terorganisir (Konsumen akhir terputus)">Tidak Terafiliasi Sindikat (Konsumen Terputus)</option>
                  <option value="Terindikasi sebagai perantara / kurir jaringan pengedar lokal">Terindikasi Perantara / Kurir Lokal</option>
                  <option value="Bagian dari sindikat peredaran gelap narkotika aktif">Bagian dari Sindikat Aktif (TO)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Keterangan Riwayat Perkara Lalu (Database Kriminal)</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.keteranganPerkaraLalu}
                  onChange={(e) => setFormData({ ...formData, keteranganPerkaraLalu: e.target.value })}
                  placeholder="Tidak terdaftar dalam database residivis perkara narkotika / SKCK Bersih..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Pola Transaksi &amp; Sumber Perolehan Narkotika</label>
                <textarea
                  rows={3}
                  disabled={isReadOnlyView}
                  value={formData.sumberPerolehan}
                  onChange={(e) => setFormData({ ...formData, sumberPerolehan: e.target.value })}
                  placeholder="Uraikan bagaimana tersangka mendapatkan narkotika (metode tempel, beli tunai, transfer, dll)..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Lanjut ke Rekomendasi Pleno</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 5: REKOMENDASI YURIDIS & KESIMPULAN HUKUM */}
        {activeStep === 5 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <Gavel className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Rekomendasi Yuridis &amp; Kesimpulan Hukum untuk Sidang Pleno</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Rekomendasi Yuridis Tindak Lanjut Perkara</label>
                <select
                  disabled={isReadOnlyView}
                  value={formData.rekomendasiHukum}
                  onChange={(e: any) => setFormData({ ...formData, rekomendasiHukum: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-3 rounded-xl outline-none focus:border-blue-500 cursor-pointer font-bold text-sm text-emerald-400 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="Proses Hukum Dilanjutkan dengan Rehabilitasi">Proses Hukum Dilanjutkan dengan Penempatan Rehabilitasi (Pasal 127)</option>
                  <option value="Penerapan Keadilan Restoratif / Diversi">Penerapan Keadilan Restoratif (Restorative Justice / RJ Jaksa)</option>
                  <option value="Proses Hukum Dilanjutkan Tanpa Rehabilitasi">Proses Hukum Dilanjutkan Tanpa Rehabilitasi (Unsur Pengedar Terpenuhi)</option>
                  <option value="Perlu Pendalaman Penyidikan">Perlu Pendalaman Penyidikan / Pemeriksaan Tambahan</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Kesimpulan &amp; Pertimbangan Yuridis Lengkap</label>
                <textarea
                  rows={4}
                  disabled={isReadOnlyView}
                  value={formData.kesimpulanHukum}
                  onChange={(e) => setFormData({ ...formData, kesimpulanHukum: e.target.value })}
                  placeholder="Uraikan dasar pertimbangan hukum, rujukan pasal UU 35/2009, SEMA 04/2010, dan Pedoman Kejaksaan No. 18/2021..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Catatan Klarifikasi Tambahan untuk Ketua TAT &amp; Jaksa</label>
                <input
                  type="text"
                  disabled={isReadOnlyView}
                  value={formData.catatanKlarifikasi}
                  onChange={(e) => setFormData({ ...formData, catatanKlarifikasi: e.target.value })}
                  placeholder="Catatan tambahan saat pembahasan Sidang Pleno TAT..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(6)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Lanjut ke Pengesahan</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 6: PENGESAHAN & FINALISASI */}
        {activeStep === 6 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-5 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <FileSignature className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Pengesahan Lembar Telaah Asesmen Hukum TAT</h3>
            </div>

            {/* Summary Review Card */}
            <div className="bg-[#050e1c] p-4 rounded-xl border border-[#1b3459] space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-3 border-b border-[#1b3459]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Kualifikasi Peran</span>
                  <p className="text-base font-extrabold text-[#d4af37] mt-0.5">{formData.analisisPeran}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Kesesuaian SEMA 04/2010</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">{formData.totalBeratBersihGram} Gram (Memenuhi SEMA)</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Rekomendasi Tindak Lanjut</span>
                  <p className="text-xs font-bold text-blue-300 mt-0.5">{formData.rekomendasiHukum}</p>
                </div>
              </div>

              <div className="text-slate-300 text-[11px] leading-relaxed">
                <p><strong>Fakta Terverifikasi:</strong> {faktaList.filter(f => f.checked).length} dari {faktaList.length} Indikator Terpenuhi</p>
                <p className="mt-1"><strong>Kesimpulan Yuridis:</strong> {formData.kesimpulanHukum}</p>
                <p className="mt-1"><strong>Penelaah Hukum:</strong> {currentUser.name} ({currentUser.agency})</p>
              </div>
            </div>

            {/* Actions */}
            {isReadOnlyView ? (
              <div className="bg-blue-950/40 border border-blue-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Asesmen Hukum Telah Difinalisasi</h4>
                    <p className="text-[11px] text-blue-300/80">
                      Berkas telaah yuridis ini telah selesai dan tersimpan di Riwayat Asesmen Hukum (Siap Pleno TAT).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCase}
                  className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Kembali ke Daftar
                </button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-slate-400 text-xs italic">
                  * Simpan draf jika telaah belum rampung, atau Finalisasi jika sudah siap dibawa ke Sidang Pleno TAT.
                </span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSaveLegalForm(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 border border-[#234475] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-slate-300" />
                    <span>Simpan Draf Hukum</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin menyelesaikan dan memfinalisasi Asesmen Hukum ini? Berkas akan diteruskan ke Sidang Pleno TAT.')) {
                        handleSaveLegalForm(true);
                      }
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalisasi &amp; Teruskan ke Pleno</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Lihat Dokumen & Barang Bukti */}
        <ModalLihatDokumenBb
          isOpen={showDokumenModal}
          onClose={() => setShowDokumenModal(false)}
          permohonan={selectedCase}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW 1: LEGAL QUEUE / HISTORY LIST VIEW
  // ==========================================
  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Scale className={`w-5 h-5 ${isReadOnly ? 'text-blue-400' : 'text-[#d4af37]'}`} />
            <span>{isReadOnly ? 'Riwayat Asesmen Hukum TAT' : 'Asesmen Hukum & Kriminalistik TAT'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isReadOnly
              ? 'Daftar arsip berkas telaah yuridis yang telah difinalisasi untuk sidang pleno dan rekomendasi akhir.'
              : 'Daftar berkas perkara aktif yang memerlukan penelaahan kualifikasi peran tersangka (SEMA No. 04/2010).'}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="self-start sm:self-auto">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            isReadOnly
              ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
              : 'bg-[#142642] text-[#d4af37] border-[#234475]'
          }`}>
            {isReadOnly ? `${filteredCases.length} Arsip Final` : `${filteredCases.length} Tugas Aktif`}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama terperiksa, nomor TAT, LP, pasal..."
          className="w-full bg-[#0b172a] border border-[#1b3459] text-white pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#d4af37] transition-colors"
        />
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-10 bg-[#0b172a] border border-[#1b3459] rounded-xl text-slate-400 text-xs">
            {isReadOnly
              ? 'Belum ada riwayat asesmen hukum yang difinalisasi.'
              : 'Tidak ada tugas asesmen hukum aktif yang perlu ditelaah.'}
          </div>
        ) : (
          filteredCases.map(item => {
            const hasHukum = (item.asesmenHukum && item.asesmenHukum.status === 'FINAL') || item.legalStatus === 'FINAL' || isReadOnly;
            const isDraft = !hasHukum && item.asesmenHukum && item.asesmenHukum.status === 'DRAFT';
            const jadwalSesi = item.asesmenHukum?.tanggalTelaah || `${item.tanggalPengajuan} • 09:30 WITA`;
            const bbSummary = item.perkara.barangBuktiList.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ') || 'Tanpa BB';

            return (
              <div
                key={item.id}
                onClick={() => handleOpenCase(item)}
                className="bg-[#0b172a] border border-[#1b3459] hover:border-[#d4af37]/60 rounded-xl p-4 transition-all cursor-pointer shadow-sm hover:shadow-md group space-y-3"
              >
                {/* Row 1: Nomor, Nama, & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-[#d4af37] font-mono shrink-0">
                      {item.nomorPermohonan}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
                      {item.terperiksa.namaLengkap} <span className="text-xs font-normal text-slate-400">({item.terperiksa.usia} th)</span>
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto shrink-0 ${
                    hasHukum || isReadOnly
                      ? 'bg-blue-950/60 text-blue-300 border-blue-600/40'
                      : isDraft
                      ? 'bg-amber-950/60 text-amber-300 border-amber-600/40'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                  }`}>
                    {hasHukum || isReadOnly ? 'Selesai (Final)' : isDraft ? 'Draf Disimpan' : 'Aktif (Belum Ditelaah)'}
                  </span>
                </div>

                {/* Row 2: Perkara & BB Details */}
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>LP: <strong className="text-slate-300 font-normal">{item.perkara.nomorLaporanPolisi}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Pasal: <strong className="text-slate-300 font-normal">{item.perkara.pasalDipersangkakan}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>BB: <strong className="text-slate-200 font-medium">{bbSummary}</strong></span>
                </div>

                {/* Row 3: Jadwal & Action Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-[#1b3459]/60 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Jadwal Sesi: <strong className="text-slate-200 font-semibold">{jadwalSesi}</strong></span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Penyidik: {item.perkara.namaPenyidik}</span>
                  </div>

                  <div className="text-[#d4af37] font-semibold text-xs flex items-center space-x-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>{isReadOnly ? 'Buka Arsip (Read-Only)' : isDraft ? 'Lanjutkan Draf' : 'Mulai Telaah'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Lihat Dokumen & Barang Bukti */}
      <ModalLihatDokumenBb
        isOpen={showDokumenModal}
        onClose={() => setShowDokumenModal(false)}
        permohonan={selectedCase || null}
      />
    </div>
  );
};
