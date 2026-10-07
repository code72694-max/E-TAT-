import React, { useState, useEffect } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import {
  Stethoscope,
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Syringe,
  Activity,
  FileText,
  Shield,
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
  Package
} from 'lucide-react';
import { ModalLihatDokumenBb } from './ModalLihatDokumenBb';
import { asesmenMedisApi } from '../services/api';

interface AsesmenMedisViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  onSelectPermohonan?: (id: string) => void;
  selectedCaseId?: string | null;
  onSelectCase?: (id: string | null) => void;
  mode?: 'active' | 'history';
}

export const AsesmenMedisView: React.FC<AsesmenMedisViewProps> = ({
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

  // Form local state initialized when a case is selected
  const [formData, setFormData] = useState({
    // 1. Fisik & Tanda Vital
    tekananDarah: '120/80',
    denyutNadi: '84',
    pernapasan: '18',
    suhuTubuh: '36.6',
    kondisiPupil: 'Isokor (3mm / 3mm, Refleks Cahaya +/+)',
    needleTracks: 'tidak_ada',
    kondisiIntoksikasi: 'stabil',
    komorbiditasMedis: 'Tidak ada penyakit penyerta berat',
    
    // 2. Riwayat Penggunaan Zat
    jenisZat: 'Metamfetamina (Sabu)',
    caraPakai: 'Dihisap (Bong)',
    frekuensi: '4-5x Seminggu',
    lamaPemakaianBulan: 12,
    usiaMulaiPakai: '23',
    terakhirPakai: '2 hari sebelum penangkapan',
    riwayatOverdosis: 'Tidak ada riwayat overdosis / koma',
    riwayatRehabSebelumnya: 'Belum pernah menjalani rehabilitasi',

    // 3. WHO ASSIST Scoring
    q1_frekuensi: 4,
    q2_dorongan: 5,
    q3_masalah: 6,
    q4_kegagalan: 5,
    q5_kecemasan_orang_lain: 6,
    q6_usaha_berhenti_gagal: 3,
    skorAssistManual: 29,
    evaluasiMse: 'Kontak mata wajar, orientasi waktu/tempat/orang baik, daya ingat baik, tidak ditemukan waham atau halusinasi aktif.',

    // 4. Diagnosis ICD-10 & Rekomendasi
    diagnosisKlinisIcd: 'F15.2 (Sindrom Ketergantungan Stimulansia / Metamfetamina)',
    kebutuhanRawat: 'Rawat Inap',
    durasiUsulanBulan: 3,
    fasilitasRujukan: 'Balai Rehabilitasi BNN Tanah Merah',
    interpretasiKlinis: 'Klien memenuhi kriteria ketergantungan narkotika stimulansia tingkat sedang-berat dengan pola toleransi zat tinggi. Memerlukan intervensi medis tertutup (rawat inap) untuk detoksifikasi dan stabilisasi biopsikososial.',
    catatanKhususPleno: 'Disarankan rehabilitasi medis rawat inap selama 3 bulan di Balai Rehabilitasi BNN Tanah Merah dengan evaluasi pasca rujukan berkala.'
  });

  // Urin Toxicology parameters checklist
  const [urinTests, setUrinTests] = useState([
    { parameter: 'MET (Metamfetamina / Sabu)', hasil: 'Positif' as 'Positif' | 'Negatif' },
    { parameter: 'AMP (Amfetamina)', hasil: 'Positif' as 'Positif' | 'Negatif' },
    { parameter: 'THC (Ganja / Kanabis)', hasil: 'Negatif' as 'Positif' | 'Negatif' },
    { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' as 'Positif' | 'Negatif' },
    { parameter: 'MOP (Morfin / Opiat)', hasil: 'Negatif' as 'Positif' | 'Negatif' },
    { parameter: 'COC (Kokain)', hasil: 'Negatif' as 'Positif' | 'Negatif' }
  ]);

  // Synchronize form when selectedCase changes
  useEffect(() => {
    if (!selectedCase) return;

    setActiveStep(1);
    if (selectedCase.asesmenMedis) {
      setFormData(prev => ({
        ...prev,
        skorAssistManual: selectedCase.asesmenMedis?.skorInstrumen || 28,
        diagnosisKlinisIcd: selectedCase.asesmenMedis?.diagnosisKlinisIcd || prev.diagnosisKlinisIcd,
        komorbiditasMedis: selectedCase.asesmenMedis?.komorbiditasMedis || prev.komorbiditasMedis,
        kebutuhanRawat: selectedCase.asesmenMedis?.kebutuhanRawat || prev.kebutuhanRawat,
        durasiUsulanBulan: selectedCase.asesmenMedis?.durasiUsulanBulan || prev.durasiUsulanBulan,
        jenisZat: selectedCase.asesmenMedis?.riwayatZat?.[0]?.jenisZat || prev.jenisZat,
        caraPakai: selectedCase.asesmenMedis?.riwayatZat?.[0]?.caraPakai || prev.caraPakai,
        frekuensi: selectedCase.asesmenMedis?.riwayatZat?.[0]?.frekuensi || prev.frekuensi,
        lamaPemakaianBulan: selectedCase.asesmenMedis?.riwayatZat?.[0]?.lamaPemakaianBulan || prev.lamaPemakaianBulan,
        terakhirPakai: selectedCase.asesmenMedis?.riwayatZat?.[0]?.terakhirPakai || prev.terakhirPakai,
        interpretasiKlinis: selectedCase.asesmenMedis?.interpretasiKlinis || prev.interpretasiKlinis,
        catatanKhususPleno: selectedCase.asesmenMedis?.catatanKhusus || prev.catatanKhususPleno
      }));

      if (selectedCase.asesmenMedis.hasilUrin && selectedCase.asesmenMedis.hasilUrin.length > 0) {
        setUrinTests(selectedCase.asesmenMedis.hasilUrin);
      }
    }
  }, [selectedCaseId]);

  // When clicking a case card to open the Medical Assessment Workbook
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

  const toggleUrinResult = (index: number) => {
    setUrinTests(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, hasil: item.hasil === 'Positif' ? 'Negatif' : 'Positif' };
      }
      return item;
    }));
  };

  const calculatedAssistScore = formData.q1_frekuensi + formData.q2_dorongan + formData.q3_masalah + formData.q4_kegagalan + formData.q5_kecemasan_orang_lain + formData.q6_usaha_berhenti_gagal;
  const assistRiskLevel = calculatedAssistScore >= 27 ? 'Tinggi (Ketergantungan)' : calculatedAssistScore >= 11 ? 'Sedang' : 'Rendah';

  const handleSaveMedicalForm = async (isFinal: boolean) => {
    if (!selectedCase) return;

    let updated: PermohonanAsesmen = { ...selectedCase };
    const now = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const asesmenMedisData: any = {
      id: updated.asesmenMedis?.id || `medis-${Date.now()}`,
      asesorId: currentUser.id,
      asesorNama: currentUser.name,
      tanggalPemeriksaan: now,
      status: isFinal ? 'FINAL' : 'DRAFT',
      skorInstrumen: calculatedAssistScore,
      tingkatRisikoInstrumen: assistRiskLevel,
      diagnosisKlinisIcd: formData.diagnosisKlinisIcd,
      komorbiditasMedis: formData.komorbiditasMedis,
      kebutuhanRawat: formData.kebutuhanRawat,
      durasiUsulanBulan: Number(formData.durasiUsulanBulan),
      riwayatZat: [
        {
          jenisZat: formData.jenisZat,
          caraPakai: formData.caraPakai,
          frekuensi: formData.frekuensi,
          lamaPemakaianBulan: Number(formData.lamaPemakaianBulan),
          terakhirPakai: formData.terakhirPakai
        }
      ],
      hasilUrin: urinTests,
      interpretasiKlinis: formData.interpretasiKlinis,
      catatanKhusus: isFinal ? formData.catatanKhususPleno : (formData.catatanKhususPleno || 'Draf asesmen medis tersimpan'),
      kondisiFisik: `TD: ${formData.tekananDarah}, N: ${formData.denyutNadi}, RR: ${formData.pernapasan}, T: ${formData.suhuTubuh}, Pupil: ${formData.kondisiPupil}`,
      tekananDarah: formData.tekananDarah,
      denyutNadi: formData.denyutNadi,
      tandaBekasSuntikan: formData.needleTracks !== 'tidak_ada',
      kondisiPsikologis: formData.evaluasiMse,
      instrumen: 'ASSIST',
      terakhirDiperbarui: now
    };

    updated.asesmenMedis = asesmenMedisData;

    if (isFinal) {
      updated.medicalStatus = 'FINAL';
      if (updated.statusProsesUtama === 'asesmen_berlangsung' || updated.statusProsesUtama === 'penugasan_jadwal') {
        updated.statusProsesUtama = 'siap_pleno';
      }
    }

    updated.auditLogs = [
      ...updated.auditLogs,
      {
        id: `log-${Date.now()}`,
        timestamp: now,
        aksi: isFinal ? 'Finalisasi Asesmen Medis' : 'Simpan Draf Asesmen Medis',
        actorNama: currentUser.name,
        actorPeran: currentUser.role,
        rincian: isFinal
          ? `Pemeriksaan medis difinalisasi dengan diagnosis ${formData.diagnosisKlinisIcd} dan rekomendasi ${formData.kebutuhanRawat} (${formData.durasiUsulanBulan} Bulan). Masuk Riwayat & Siap Pleno TAT.`
          : `Draf hasil pemeriksaan medis disimpan oleh ${currentUser.name}.`
      }
    ];

    // Sinkronisasi ke backend API jika tersedia
    try {
      if (isFinal) {
        await asesmenMedisApi.saveDraft(selectedCase.id, {
          kondisiFisik: `TD: ${formData.tekananDarah}, N: ${formData.denyutNadi}, RR: ${formData.pernapasan}`,
          tekananDarah: formData.tekananDarah,
          denyutNadi: formData.denyutNadi,
          tandaBekasSuntikan: formData.needleTracks !== 'tidak_ada',
          komorbiditasMedis: formData.komorbiditasMedis,
          kondisiPsikologis: formData.evaluasiMse,
          instrumen: 'ASSIST',
          skorInstrumen: calculatedAssistScore,
          tingkatRisikoInstrumen: assistRiskLevel,
          diagnosisKlinisIcd: formData.diagnosisKlinisIcd,
          interpretasiKlinis: formData.interpretasiKlinis,
          kebutuhanRawat: formData.kebutuhanRawat,
          durasiUsulanBulan: Number(formData.durasiUsulanBulan),
          catatanKhusus: formData.catatanKhususPleno,
          riwayatZat: [
            {
              jenisZat: formData.jenisZat,
              caraPakai: formData.caraPakai,
              frekuensi: formData.frekuensi,
              lamaPemakaianBulan: Number(formData.lamaPemakaianBulan),
              terakhirPakai: formData.terakhirPakai
            }
          ],
          hasilUrin: urinTests
        }).catch(() => null);

        await asesmenMedisApi.finalisasi(selectedCase.id).catch(() => null);
      } else {
        await asesmenMedisApi.saveDraft(selectedCase.id, {
          kondisiFisik: `TD: ${formData.tekananDarah}, N: ${formData.denyutNadi}, RR: ${formData.pernapasan}`,
          tekananDarah: formData.tekananDarah,
          denyutNadi: formData.denyutNadi,
          tandaBekasSuntikan: formData.needleTracks !== 'tidak_ada',
          komorbiditasMedis: formData.komorbiditasMedis,
          kondisiPsikologis: formData.evaluasiMse,
          instrumen: 'ASSIST',
          skorInstrumen: calculatedAssistScore,
          tingkatRisikoInstrumen: assistRiskLevel,
          diagnosisKlinisIcd: formData.diagnosisKlinisIcd,
          interpretasiKlinis: formData.interpretasiKlinis,
          kebutuhanRawat: formData.kebutuhanRawat,
          durasiUsulanBulan: Number(formData.durasiUsulanBulan),
          catatanKhusus: formData.catatanKhususPleno,
        }).catch(() => null);
      }
    } catch (apiErr) {
      console.warn('Backend sync:', apiErr);
    }

    if (onUpdatePermohonan) {
      onUpdatePermohonan(updated);
    }

    setSaveFeedback(isFinal ? '✅ Asesmen Medis Berhasil Difinalisasi & Berpindah ke Riwayat Asesmen Medis!' : '💾 Draf Asesmen Medis Berhasil Disimpan!');
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
      item.terperiksa.nik.includes(searchQuery);
    
    if (!matchesSearch) return false;

    if (mode === 'history') {
      return item.asesmenMedis?.status === 'FINAL' || item.medicalStatus === 'FINAL';
    } else {
      // Active queue: only show tasks that are NOT finalized
      return !item.asesmenMedis || (item.asesmenMedis.status !== 'FINAL' && item.medicalStatus !== 'FINAL');
    }
  });

  // ==========================================
  // VIEW 2: DEDICATED MEDICAL WORKBOOK DETAIL PAGE
  // ==========================================
  if (selectedCase) {
    const isCompleted = selectedCase.asesmenMedis?.status === 'FINAL' || selectedCase.medicalStatus === 'FINAL';

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
                <Stethoscope className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Lembar Kerja Asesmen Medis TAT {isCompleted && <span className="text-emerald-400 font-normal">(Riwayat / Selesai)</span>}
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
                isCompleted
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/50'
              }`}>
                {isCompleted ? 'RIWAYAT / FINAL' : 'AKTIF / DRAFT'}
              </span>
            </div>
          </div>

          {/* Subject Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="md:col-span-2 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-sm text-[#d4af37]">{selectedCase.nomorPermohonan}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#142642] text-slate-200 border border-[#234475]">
                  {selectedCase.jalurPermohonan}
                </span>
              </div>
              <p className="text-base font-bold text-white leading-tight mt-1">{selectedCase.terperiksa.namaLengkap}</p>
              <p className="text-slate-400 text-[11px]">
                NIK: <span className="font-mono text-slate-200">{selectedCase.terperiksa.nik}</span> • Usia: {selectedCase.terperiksa.usia} th • {selectedCase.terperiksa.pekerjaan}
              </p>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1b3459] md:pl-4 pt-2 md:pt-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Penyidik Pengaju:</span>
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

        {/* Success Feedback Alert */}
        {saveFeedback && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-semibold flex items-center space-x-2.5 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Section Navigation Tabs (Workbook Stepper) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { id: 1, label: '1. Anamnesis Zat', icon: <Syringe className="w-3.5 h-3.5" /> },
            { id: 2, label: '2. Fisik & Vital', icon: <HeartPulse className="w-3.5 h-3.5" /> },
            { id: 3, label: '3. Urin SKHPU', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 4, label: '4. WHO ASSIST', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 5, label: '5. ICD-10 & Terapi', icon: <Shield className="w-3.5 h-3.5" /> },
            { id: 6, label: '6. Pengesahan', icon: <FileSignature className="w-3.5 h-3.5" /> }
          ].map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeStep === step.id
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-emerald-500 text-white shadow-md'
                  : 'bg-[#091426] border-[#1b3459] text-slate-400 hover:text-slate-200 hover:bg-[#10233f]'
              }`}
            >
              {step.icon}
              <span className="truncate">{step.label}</span>
            </button>
          ))}
        </div>

        {/* SECTION 1: ANAMNESIS & RIWAYAT PENGGUNAAN ZAT */}
        {activeStep === 1 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <Syringe className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Wawancara Klinis &amp; Riwayat Penggunaan Zat</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Jenis Zat Narkotika Dominan</label>
                <select
                  value={formData.jenisZat}
                  onChange={(e) => setFormData({ ...formData, jenisZat: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
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
                <label className="text-slate-300 font-semibold mb-1.5 block">Cara Pemakaian</label>
                <select
                  value={formData.caraPakai}
                  onChange={(e) => setFormData({ ...formData, caraPakai: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Dihisap (Bong / Rokok)">Dihisap (Bong / Rokok)</option>
                  <option value="Ditelan / Minum (Oral)">Ditelan / Minum (Oral)</option>
                  <option value="Disuntikkan (Intravena / IV)">Disuntikkan (Intravena / IV)</option>
                  <option value="Dihirup (Snorting)">Dihirup (Snorting)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Frekuensi Penggunaan</label>
                <select
                  value={formData.frekuensi}
                  onChange={(e) => setFormData({ ...formData, frekuensi: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Setiap Hari (Rutin / Berat)">Setiap Hari (Rutin / Berat)</option>
                  <option value="4-5x Seminggu">4-5x Seminggu</option>
                  <option value="1-3x Sebulan">1-3x Sebulan</option>
                  <option value="Sesekali / Rekreasi">Sesekali / Rekreasi</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Lama Pemakaian Aktif (Bulan)</label>
                <input
                  type="number"
                  value={formData.lamaPemakaianBulan}
                  onChange={(e) => setFormData({ ...formData, lamaPemakaianBulan: Number(e.target.value) })}
                  placeholder="12"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Usia Pertama Kali Pakai (Tahun)</label>
                <input
                  type="text"
                  value={formData.usiaMulaiPakai}
                  onChange={(e) => setFormData({ ...formData, usiaMulaiPakai: e.target.value })}
                  placeholder="23"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Waktu Terakhir Pemakaian</label>
                <input
                  type="text"
                  value={formData.terakhirPakai}
                  onChange={(e) => setFormData({ ...formData, terakhirPakai: e.target.value })}
                  placeholder="Contoh: 2 hari sebelum penangkapan"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Riwayat Overdosis / Komplikasi Zat</label>
                <input
                  type="text"
                  value={formData.riwayatOverdosis}
                  onChange={(e) => setFormData({ ...formData, riwayatOverdosis: e.target.value })}
                  placeholder="Tidak ada / Pernah dilarikan ke RS / Kejang"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Riwayat Rehabilitasi Sebelumnya</label>
                <select
                  value={formData.riwayatRehabSebelumnya}
                  onChange={(e) => setFormData({ ...formData, riwayatRehabSebelumnya: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Belum pernah menjalani rehabilitasi">Belum Pernah Rehabilitasi</option>
                  <option value="Pernah Rawat Jalan (1 kali)">Pernah Rawat Jalan (1x)</option>
                  <option value="Pernah Rawat Inap (1 kali)">Pernah Rawat Inap (1x)</option>
                  <option value="Residivis Rehabilitasi (Lebih dari 1 kali)">Residivis Rehabilitasi (&gt;1x)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Lanjut ke Pemeriksaan Fisik</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: PEMERIKSAAN FISIK & TANDA VITAL */}
        {activeStep === 2 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Pemeriksaan Fisik &amp; Tanda Vital</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Tekanan Darah (mmHg)</label>
                <input
                  type="text"
                  value={formData.tekananDarah}
                  onChange={(e) => setFormData({ ...formData, tekananDarah: e.target.value })}
                  placeholder="120/80"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Denyut Nadi (x/mnt)</label>
                <input
                  type="text"
                  value={formData.denyutNadi}
                  onChange={(e) => setFormData({ ...formData, denyutNadi: e.target.value })}
                  placeholder="84"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Pernapasan (x/mnt)</label>
                <input
                  type="text"
                  value={formData.pernapasan}
                  onChange={(e) => setFormData({ ...formData, pernapasan: e.target.value })}
                  placeholder="18"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Suhu Tubuh (°C)</label>
                <input
                  type="text"
                  value={formData.suhuTubuh}
                  onChange={(e) => setFormData({ ...formData, suhuTubuh: e.target.value })}
                  placeholder="36.6"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Kondisi Pupil Mata &amp; Refleks Cahaya</label>
                <input
                  type="text"
                  value={formData.kondisiPupil}
                  onChange={(e) => setFormData({ ...formData, kondisiPupil: e.target.value })}
                  placeholder="Isokor (3mm / 3mm), Refleks Cahaya +/+"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Bekas Jarum Suntik (Needle Tracks)</label>
                <select
                  value={formData.needleTracks}
                  onChange={(e) => setFormData({ ...formData, needleTracks: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="tidak_ada">Tidak Ada Bekas Suntikan</option>
                  <option value="ada_lama">Ada (Bekas Lama / Menghitam)</option>
                  <option value="ada_baru">Ada (Luka Baru / Merah / Aktif)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Status Sakau / Putus Zat</label>
                <select
                  value={formData.kondisiIntoksikasi}
                  onChange={(e) => setFormData({ ...formData, kondisiIntoksikasi: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="stabil">Normal / Stabil (Tidak Sakau)</option>
                  <option value="intoksikasi">Intoksikasi Ringan / Pengaruh Zat</option>
                  <option value="putus_zat">Putus Zat (Sakau / Tremor / Gelisah)</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="text-slate-300 font-semibold mb-1.5 block">Komorbiditas Medis / Penyakit Penyerta (Fisik)</label>
                <input
                  type="text"
                  value={formData.komorbiditasMedis}
                  onChange={(e) => setFormData({ ...formData, komorbiditasMedis: e.target.value })}
                  placeholder="Contoh: Tidak ada komorbiditas berat / Riwayat Asma / Hepatitis B / HIV"
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
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
                <span>Lanjut ke Toksikologi Urin</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: UJI TOKSIKOLOGI URIN FORENSIK (6 PARAMETER CHECKLIST) */}
        {activeStep === 3 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Uji Toksikologi Urin Laboratorium Forensik (SKHPU)</h3>
              </div>
              <span className="text-[11px] text-slate-400 italic">Centang / klik tombol status untuk mengubah hasil</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {urinTests.map((test, idx) => {
                const isPos = test.hasil === 'Positif';
                return (
                  <div
                    key={idx}
                    onClick={() => toggleUrinResult(idx)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isPos
                        ? 'bg-rose-950/40 border-rose-600/60 shadow-md shadow-rose-950/40 hover:bg-rose-950/60'
                        : 'bg-[#050e1c] border-[#1b3459] hover:bg-[#10223b]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={isPos}
                        onChange={() => toggleUrinResult(idx)}
                        className="w-4 h-4 accent-rose-600 cursor-pointer rounded"
                      />
                      <span className="text-xs font-bold text-white truncate">{test.parameter}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ml-2 shrink-0 ${
                      isPos ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {test.hasil}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] text-xs space-y-1 text-slate-300">
              <p className="font-semibold text-white">Status Toksikologi Keseluruhan:</p>
              <p className="text-slate-400">
                Terdeteksi metabolit aktif narkotika:{' '}
                <strong className="text-[#d4af37]">
                  {urinTests.filter(u => u.hasil === 'Positif').map(u => u.parameter.split('(')[0].trim()).join(', ') || 'Semua Parameter Negatif'}
                </strong>
              </p>
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
                <span>Lanjut ke Instrumen WHO ASSIST</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 4: WHO ASSIST SCORING & PSYSCHIATRIC MSE */}
        {activeStep === 4 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Instrumen Skoring WHO ASSIST &amp; Evaluasi Psikiatri (MSE)</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300">Total Skor:</span>
                <span className="text-sm font-extrabold text-[#d4af37] font-mono">{calculatedAssistScore} Poin</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  assistRiskLevel.includes('Tinggi') ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {assistRiskLevel}
                </span>
              </div>
            </div>

            {/* WHO ASSIST Questionnaire Items */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
                <p className="font-semibold text-white">Q1. Seberapa sering menggunakan zat dalam 3 bulan terakhir?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: '1-2 Kali (2)', v: 2 }, { l: 'Bulanan (3)', v: 3 }, { l: 'Mingguan/Harian (4-6)', v: 5 }].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFormData({ ...formData, q1_frekuensi: opt.v })}
                      className={`p-2 rounded-lg text-center border font-semibold cursor-pointer transition-colors ${
                        formData.q1_frekuensi === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
                <p className="font-semibold text-white">Q2. Seberapa sering timbul dorongan kuat / craving untuk memakai zat?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: 'Jarang (3)', v: 3 }, { l: 'Mingguan (4)', v: 4 }, { l: 'Hampir Setiap Hari (6)', v: 6 }].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFormData({ ...formData, q2_dorongan: opt.v })}
                      className={`p-2 rounded-lg text-center border font-semibold cursor-pointer transition-colors ${
                        formData.q2_dorongan === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
                <p className="font-semibold text-white">Q3. Seberapa sering penggunaan zat menimbulkan masalah kesehatan, sosial, hukum, atau finansial?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: '1-2 Kali (4)', v: 4 }, { l: 'Bulanan (5)', v: 5 }, { l: 'Mingguan / Harian (6)', v: 6 }].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFormData({ ...formData, q3_masalah: opt.v })}
                      className={`p-2 rounded-lg text-center border font-semibold cursor-pointer transition-colors ${
                        formData.q3_masalah === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#050e1c] rounded-xl border border-[#1b3459] space-y-2">
                <p className="font-semibold text-white">Q4. Seberapa sering gagal melakukan hal yang diharapkan (kewajiban kerja/keluarga)?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[{ l: 'Tidak Pernah (0)', v: 0 }, { l: 'Jarang (4)', v: 4 }, { l: 'Bulanan (5)', v: 5 }, { l: 'Hampir Selalu (6)', v: 6 }].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFormData({ ...formData, q4_kegagalan: opt.v })}
                      className={`p-2 rounded-lg text-center border font-semibold cursor-pointer transition-colors ${
                        formData.q4_kegagalan === opt.v ? 'bg-emerald-900/60 border-emerald-500 text-white' : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Evaluasi Status Mental / Mental Status Examination (MSE)</label>
                <textarea
                  rows={2}
                  value={formData.evaluasiMse}
                  onChange={(e) => setFormData({ ...formData, evaluasiMse: e.target.value })}
                  placeholder="Catatan orientasi, mood, afek, proses pikir, dan ada/tidaknya halusinasi..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 text-xs"
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
                <span>Lanjut ke Diagnosis &amp; Rekomendasi</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 5: DIAGNOSIS ICD-10 & REKOMENDASI TERAPI */}
        {activeStep === 5 && (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1b3459]">
              <Shield className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Diagnosis ICD-10 &amp; Rencana Intervensi Medis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Diagnosis Klinis ICD-10</label>
                <select
                  value={formData.diagnosisKlinisIcd}
                  onChange={(e) => setFormData({ ...formData, diagnosisKlinisIcd: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer font-mono font-bold"
                >
                  <option value="F15.2 (Sindrom Ketergantungan Stimulansia / Metamfetamina)">F15.2 - Ketergantungan Stimulansia (Sabu)</option>
                  <option value="F15.1 (Penggunaan Merugikan Stimulansia / Harmful Use)">F15.1 - Harmful Use Stimulansia</option>
                  <option value="F12.2 (Sindrom Ketergantungan Kanabinoid / Ganja)">F12.2 - Ketergantungan Kanabinoid (Ganja)</option>
                  <option value="F11.2 (Sindrom Ketergantungan Opioid / Heroin)">F11.2 - Ketergantungan Opioid (Heroin)</option>
                  <option value="F19.2 (Sindrom Ketergantungan Multipel Zat)">F19.2 - Ketergantungan Multipel Zat</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Modalitas Layanan Rehabilitasi</label>
                <select
                  value={formData.kebutuhanRawat}
                  onChange={(e) => setFormData({ ...formData, kebutuhanRawat: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer font-bold text-[#d4af37]"
                >
                  <option value="Rawat Inap">Rehabilitasi Rawat Inap (Pemulihan Penuh)</option>
                  <option value="Rawat Jalan">Rehabilitasi Rawat Jalan (Konseling Singkat)</option>
                  <option value="Detoksifikasi">Detoksifikasi Medis Darurat</option>
                  <option value="Tidak Memerlukan Rawat">Tidak Memerlukan Rawat</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">Usulan Durasi Layanan (Bulan)</label>
                <select
                  value={formData.durasiUsulanBulan}
                  onChange={(e) => setFormData({ ...formData, durasiUsulanBulan: Number(e.target.value) })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value="3">3 Bulan</option>
                  <option value="6">6 Bulan</option>
                  <option value="12">12 Bulan</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 font-semibold mb-1.5 block">Fasilitas Rujukan Rekomendasi</label>
                <select
                  value={formData.fasilitasRujukan}
                  onChange={(e) => setFormData({ ...formData, fasilitasRujukan: e.target.value })}
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Balai Rehabilitasi BNN Tanah Merah">Balai Rehabilitasi BNN Tanah Merah (Samarinda)</option>
                  <option value="RSJD Atma Husada Mahakam Samarinda">RSJD Atma Husada Mahakam Samarinda</option>
                  <option value="Klinik Pratama BNNP Kalimantan Timur">Klinik Pratama BNNP Kalimantan Timur</option>
                  <option value="RSUD A.W. Sjahranie Samarinda">RSUD A.W. Sjahranie Samarinda</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-slate-300 font-semibold mb-1.5 block">Interpretasi Klinis Asesor Medis</label>
                <textarea
                  rows={3}
                  value={formData.interpretasiKlinis}
                  onChange={(e) => setFormData({ ...formData, interpretasiKlinis: e.target.value })}
                  placeholder="Simpulan klinis hasil pemeriksaan medis, pola adiksi, dan urgensi penempatan rehabilitasi..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-slate-300 font-semibold mb-1.5 block">Catatan Khusus Rekomendasi untuk Sidang Pleno TAT</label>
                <input
                  type="text"
                  value={formData.catatanKhususPleno}
                  onChange={(e) => setFormData({ ...formData, catatanKhususPleno: e.target.value })}
                  placeholder="Catatan pertimbangan bagi Ketua TAT dan Jaksa saat pleno..."
                  className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-xl outline-none focus:border-emerald-500"
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
              <FileSignature className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Pengesahan Lembar Asesmen Medis &amp; Psikiatri</h3>
            </div>

            {/* Summary Review Card */}
            <div className="bg-[#050e1c] p-4 rounded-xl border border-[#1b3459] space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-3 border-b border-[#1b3459]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Skor WHO ASSIST</span>
                  <p className="text-base font-extrabold text-white mt-0.5">{calculatedAssistScore} Poin ({assistRiskLevel})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Diagnosis ICD-10</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">{formData.diagnosisKlinisIcd}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Rekomendasi Medis</span>
                  <p className="text-xs font-bold text-[#d4af37] mt-0.5">{formData.kebutuhanRawat} ({formData.durasiUsulanBulan} Bulan)</p>
                </div>
              </div>

              <div className="text-slate-300 text-[11px] leading-relaxed">
                <p><strong>Uji Urin SKHPU:</strong> {urinTests.map(u => `${u.parameter.split('(')[0]}: ${u.hasil}`).join(' • ')}</p>
                <p className="mt-1"><strong>Interpretasi:</strong> {formData.interpretasiKlinis}</p>
                <p className="mt-1"><strong>Dokter Pemeriksa:</strong> {currentUser.name} ({currentUser.agency})</p>
              </div>
            </div>

            {/* Actions */}
            {isCompleted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Asesmen Medis Telah Difinalisasi</h4>
                    <p className="text-[11px] text-emerald-300/80">
                      Berkas ini telah selesai pada tahap asesmen medis dan tersimpan di Riwayat Asesmen Medis (Siap Pleno TAT).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCase}
                  className="px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Kembali ke Daftar
                </button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-slate-400 text-xs italic">
                  * Simpan draf jika pemeriksaan belum rampung, atau Finalisasi jika sudah siap dibawa ke Sidang Pleno TAT.
                </span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSaveMedicalForm(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 border border-[#234475] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-slate-300" />
                    <span>Simpan Draf Medis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin menyelesaikan dan memfinalisasi Asesmen Medis ini? Berkas akan diteruskan ke Sidang Pleno TAT dan berpindah ke Riwayat Medis.')) {
                        handleSaveMedicalForm(true);
                      }
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
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
  // VIEW 1: MEDICAL QUEUE LIST VIEW
  // ==========================================
  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-[#d4af37]" />
            <span>{mode === 'history' ? 'Riwayat Asesmen Medis TAT' : 'Asesmen Medis & Psikiatri TAT'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'history'
              ? 'Daftar berkas perkara yang telah selesai dilakukan asesmen medis & psikologis dan telah difinalisasi.'
              : 'Daftar berkas perkara aktif yang ditugaskan untuk pemeriksaan medis, uji urine laboratorium, dan skoring WHO ASSIST.'}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="self-start sm:self-auto">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            mode === 'history'
              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50'
              : 'bg-[#142642] text-[#d4af37] border-[#234475]'
          }`}>
            {filteredCases.length} {mode === 'history' ? 'Berkas Selesai' : 'Tugas Aktif'}
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
          placeholder="Cari nama terperiksa, nomor TAT, NIK..."
          className="w-full bg-[#0b172a] border border-[#1b3459] text-white pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#d4af37] transition-colors"
        />
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-10 bg-[#0b172a] border border-[#1b3459] rounded-xl text-slate-400 text-xs">
            Tidak ditemukan berkas permohonan asesmen medis yang sesuai.
          </div>
        ) : (
          filteredCases.map(item => {
            const hasMedis = !!item.asesmenMedis && item.asesmenMedis.status === 'FINAL';
            const isDraft = item.asesmenMedis && item.asesmenMedis.status === 'DRAFT';
            const jadwalSesi = item.asesmenMedis?.tanggalPemeriksaan || `${item.tanggalPengajuan} • 10:00 WITA`;
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
                    hasMedis
                      ? 'bg-blue-950/50 text-blue-300 border-blue-600/40'
                      : 'bg-emerald-950/50 text-emerald-300 border-emerald-600/40'
                  }`}>
                    {hasMedis ? 'Selesai' : 'Aktif'}
                  </span>
                </div>

                {/* Row 2: Perkara & BB Details */}
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Instansi: <strong className="text-slate-300 font-normal">{item.instansiPengaju}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Penyidik: <strong className="text-slate-300 font-normal">{item.perkara.namaPenyidik}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>BB: <strong className="text-slate-200 font-medium">{bbSummary}</strong></span>
                </div>

                {/* Row 3: Jadwal & Action Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-[#1b3459]/60 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Jadwal Pemeriksaan: <strong className="text-slate-200 font-semibold">{jadwalSesi}</strong></span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Ruang Medis / Poliklinik</span>
                  </div>

                  <div className="text-[#d4af37] font-semibold text-xs flex items-center space-x-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>{isDraft ? 'Lanjutkan Draf' : 'Mulai Asesmen Medis'}</span>
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
