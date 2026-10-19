import React, { useState, useEffect } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { asesmenMedisApi } from '../services/api';
import { ModalLihatDokumenBb } from './ModalLihatDokumenBb';
import {
  MedisFormData,
  UrinTestItem,
  ValidationModalState,
  DEFAULT_URIN_TESTS,
  getInitialMedisFormData,
  MedisCaseSummaryHeader,
  MedisStepNav,
  Step1AnamnesisZat,
  Step2PemeriksaanFisik,
  Step3UjiToksikologi,
  Step4WhoAssistMse,
  Step5DiagnosisRekomendasi,
  Step6PengesahanResume,
  MedisValidationModal,
  MedisCaseList
} from './asesmen-medis';

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
  const [validationModal, setValidationModal] = useState<ValidationModalState | null>(null);

  const selectedCase = permohonanList.find(p => p.id === selectedCaseId);

  const isCompleted = 
    selectedCase?.asesmenMedis?.status === 'FINAL' || 
    selectedCase?.medicalStatus === 'FINAL' ||
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

  // Form local state initialized when a case is selected (checks localStorage draft first)
  const [formData, setFormData] = useState<MedisFormData>(() => {
    if (selectedCase && !isReadOnlyView) {
      try {
        const raw = localStorage.getItem(`etat_draft_medis_${selectedCase.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.formData) return parsed.formData;
        }
      } catch {}
    }
    return getInitialMedisFormData(selectedCase);
  });

  // Urin Toxicology parameters checklist (checks localStorage draft first)
  const [urinTests, setUrinTests] = useState<UrinTestItem[]>(() => {
    if (selectedCase && !isReadOnlyView) {
      try {
        const raw = localStorage.getItem(`etat_draft_medis_${selectedCase.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.urinTests) && parsed.urinTests.length > 0) {
            return parsed.urinTests;
          }
        }
      } catch {}
    }
    if (selectedCase?.asesmenMedis?.hasilUrin && selectedCase.asesmenMedis.hasilUrin.length > 0) {
      return selectedCase.asesmenMedis.hasilUrin;
    }
    return DEFAULT_URIN_TESTS;
  });

  // Synchronize form when selectedCase changes or draft is available
  useEffect(() => {
    if (!selectedCase) return;

    const storageKey = `etat_draft_medis_${selectedCase.id}`;
    let loadedFromDraft = false;

    if (!isReadOnlyView) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.formData) {
            setFormData(parsed.formData);
            if (parsed.urinTests && Array.isArray(parsed.urinTests)) {
              setUrinTests(parsed.urinTests);
            }
            if (parsed.activeStep) {
              setActiveStep(parsed.activeStep);
            }
            loadedFromDraft = true;
          }
        }
      } catch (e) {
        console.warn('Draft parse error:', e);
      }
    }

    if (!loadedFromDraft) {
      setActiveStep(1);
      setFormData(getInitialMedisFormData(selectedCase));

      if (selectedCase.asesmenMedis?.hasilUrin && selectedCase.asesmenMedis.hasilUrin.length > 0) {
        setUrinTests(selectedCase.asesmenMedis.hasilUrin);
      } else {
        setUrinTests(DEFAULT_URIN_TESTS);
      }
    }
  }, [selectedCaseId, isReadOnlyView]);

  // Auto-save form inputs to localStorage on every change
  useEffect(() => {
    if (!selectedCase || isReadOnlyView) return;
    try {
      const storageKey = `etat_draft_medis_${selectedCase.id}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          formData,
          urinTests,
          activeStep,
          lastSavedAt: new Date().toISOString()
        })
      );
    } catch (e) {
      console.warn('Auto-save localStorage error:', e);
    }
  }, [formData, urinTests, activeStep, selectedCase?.id, isReadOnlyView]);

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
    if (isReadOnlyView) return;
    setUrinTests(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, hasil: item.hasil === 'Positif' ? 'Negatif' : 'Positif' };
      }
      return item;
    }));
  };

  const calculatedAssistScore =
    (formData.q1_frekuensi ?? 0) +
    (formData.q2_dorongan ?? 0) +
    (formData.q3_masalah ?? 0) +
    (formData.q4_kegagalan ?? 0) +
    (formData.q5_kecemasan_orang_lain ?? 0) +
    (formData.q6_usaha_berhenti_gagal ?? 0);
  const assistRiskLevel = calculatedAssistScore >= 27 ? 'Tinggi (Ketergantungan)' : calculatedAssistScore >= 11 ? 'Sedang' : 'Rendah';

  const getStepValidation = (step: number) => {
    const missing: string[] = [];
    let title = '';

    if (step === 1) {
      title = '1. Anamnesis & Riwayat Zat';
      if (!formData.jenisZat?.trim()) missing.push('Jenis Zat Narkotika Dominan');
      if (!formData.caraPakai?.trim()) missing.push('Cara Pemakaian Zat');
      if (!formData.frekuensi?.trim()) missing.push('Frekuensi Penggunaan');
      const lama = Number(formData.lamaPemakaianBulan);
      if (!formData.lamaPemakaianBulan || isNaN(lama) || lama <= 0 || lama > 600) {
        missing.push('Lama Pemakaian Aktif (harus antara 1 - 600 Bulan)');
      }
      const usia = Number(formData.usiaMulaiPakai);
      if (!formData.usiaMulaiPakai?.trim() || isNaN(usia) || usia < 5 || usia > 100) {
        missing.push('Usia Pertama Kali Pakai (harus antara 5 - 100 Tahun)');
      }
      if (!formData.terakhirPakai?.trim()) missing.push('Waktu Terakhir Pemakaian');
      if (!formData.riwayatOverdosis?.trim()) missing.push('Riwayat Overdosis / Komplikasi Zat');
      if (!formData.riwayatRehabSebelumnya?.trim()) missing.push('Riwayat Rehabilitasi Sebelumnya');
    } else if (step === 2) {
      title = '2. Pemeriksaan Fisik & Tanda Vital';
      if (!formData.tekananDarah?.trim()) {
        missing.push('Tekanan Darah (mmHg)');
      } else if (!/^\d{2,3}\/\d{2,3}/.test(formData.tekananDarah.trim())) {
        missing.push('Format Tekanan Darah tidak valid (contoh: 120/80)');
      }
      const cleanNadi = formData.denyutNadi.replace(/\D/g, '');
      const nadi = Number(cleanNadi);
      if (!cleanNadi || isNaN(nadi) || nadi < 30 || nadi > 250) {
        missing.push('Denyut Nadi (harus antara 30 - 250 x/mnt)');
      }
      const cleanRr = formData.pernapasan.replace(/\D/g, '');
      const rr = Number(cleanRr);
      if (!cleanRr || isNaN(rr) || rr < 8 || rr > 60) {
        missing.push('Frekuensi Pernapasan (harus antara 8 - 60 x/mnt)');
      }
      const cleanSuhu = formData.suhuTubuh.replace(/[^0-9.]/g, '');
      const suhu = Number(cleanSuhu);
      if (!cleanSuhu || isNaN(suhu) || suhu < 30 || suhu > 45) {
        missing.push('Suhu Tubuh (harus antara 30.0 - 45.0 °C)');
      }
      if (!formData.kondisiPupil?.trim()) missing.push('Kondisi Pupil Mata & Refleks Cahaya');
      if (!formData.needleTracks?.trim()) missing.push('Bekas Jarum Suntik (Needle Tracks)');
      if (!formData.kondisiIntoksikasi?.trim()) missing.push('Status Sakau / Putus Zat');
      if (!formData.komorbiditasMedis?.trim()) missing.push('Komorbiditas Medis / Penyakit Penyerta');
    } else if (step === 3) {
      title = '3. Uji Toksikologi Urin Forensik (SKHPU)';
      if (!urinTests || urinTests.length === 0) missing.push('Parameter Uji Urin Laboratorium');
    } else if (step === 4) {
      title = '4. Instrumen WHO ASSIST & MSE';
      if (formData.q1_frekuensi === null || formData.q1_frekuensi === undefined) missing.push('Q1: Frekuensi Penggunaan Zat (3 Bulan Terakhir)');
      if (formData.q2_dorongan === null || formData.q2_dorongan === undefined) missing.push('Q2: Dorongan Kuat / Craving Memakai Zat');
      if (formData.q3_masalah === null || formData.q3_masalah === undefined) missing.push('Q3: Masalah Kesehatan / Sosial / Hukum Akibat Zat');
      if (formData.q4_kegagalan === null || formData.q4_kegagalan === undefined) missing.push('Q4: Kegagalan Menjalankan Tanggung Jawab / Kewajiban');
      if (formData.q5_kecemasan_orang_lain === null || formData.q5_kecemasan_orang_lain === undefined) missing.push('Q5: Kekhawatiran Orang Lain Mengenai Penggunaan Zat');
      if (formData.q6_usaha_berhenti_gagal === null || formData.q6_usaha_berhenti_gagal === undefined) missing.push('Q6: Kegagalan Mengontrol / Berhenti Memakai Zat');
      if (!formData.evaluasiMse?.trim()) missing.push('Evaluasi Status Mental / Mental Status Examination (MSE)');
    } else if (step === 5) {
      title = '5. Diagnosis ICD-10 & Rekomendasi Terapi';
      if (!formData.diagnosisKlinisIcd?.trim()) missing.push('Diagnosis Klinis ICD-10');
      if (!formData.kebutuhanRawat?.trim()) missing.push('Modalitas Layanan Rehabilitasi');
      const durasi = Number(formData.durasiUsulanBulan);
      if (!formData.durasiUsulanBulan || isNaN(durasi) || durasi <= 0) missing.push('Usulan Durasi Layanan (Bulan)');
      if (!formData.fasilitasRujukan?.trim()) missing.push('Fasilitas Rujukan Rekomendasi');
      if (!formData.interpretasiKlinis?.trim()) missing.push('Interpretasi Klinis Asesor Medis');
      if (!formData.catatanKhususPleno?.trim()) missing.push('Catatan Khusus Rekomendasi Pleno TAT');
    }

    return {
      isValid: missing.length === 0,
      title,
      missingFields: missing
    };
  };

  const handleStepNavigation = (targetStep: number) => {
    if (isReadOnlyView) {
      setActiveStep(targetStep);
      return;
    }

    if (targetStep <= activeStep) {
      setActiveStep(targetStep);
      return;
    }

    for (let s = activeStep; s < targetStep; s++) {
      const val = getStepValidation(s);
      if (!val.isValid) {
        setValidationModal({
          isOpen: true,
          stepNumber: s,
          stepTitle: val.title,
          missingFields: val.missingFields
        });
        setActiveStep(s);
        return;
      }
    }

    setActiveStep(targetStep);
  };

  const handleFinalizeClick = () => {
    for (let s = 1; s <= 5; s++) {
      const val = getStepValidation(s);
      if (!val.isValid) {
        setValidationModal({
          isOpen: true,
          stepNumber: s,
          stepTitle: val.title,
          missingFields: val.missingFields
        });
        setActiveStep(s);
        return;
      }
    }

    handleSaveMedicalForm(true);
  };

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
      q1_frekuensi: formData.q1_frekuensi,
      q2_dorongan: formData.q2_dorongan,
      q3_masalah: formData.q3_masalah,
      q4_kegagalan: formData.q4_kegagalan,
      q5_kecemasan_orang_lain: formData.q5_kecemasan_orang_lain,
      q6_usaha_berhenti_gagal: formData.q6_usaha_berhenti_gagal,
      skorInstrumen: calculatedAssistScore,
      tingkatRisikoInstrumen: assistRiskLevel,
      diagnosisKlinisIcd: formData.diagnosisKlinisIcd,
      komorbiditasMedis: formData.komorbiditasMedis,
      kebutuhanRawat: formData.kebutuhanRawat,
      durasiUsulanBulan: formData.durasiUsulanBulan ? Number(formData.durasiUsulanBulan) : undefined,
      riwayatZat: formData.jenisZat ? [
        {
          jenisZat: formData.jenisZat,
          caraPakai: formData.caraPakai,
          frekuensi: formData.frekuensi,
          lamaPemakaianBulan: Number(formData.lamaPemakaianBulan) || 0,
          terakhirPakai: formData.terakhirPakai
        }
      ] : [],
      hasilUrin: urinTests,
      interpretasiKlinis: formData.interpretasiKlinis,
      catatanKhusus: isFinal ? formData.catatanKhususPleno : (formData.catatanKhususPleno || 'Draf asesmen medis tersimpan'),
      kondisiFisik: `TD: ${formData.tekananDarah}, N: ${formData.denyutNadi}, RR: ${formData.pernapasan}, T: ${formData.suhuTubuh}, Pupil: ${formData.kondisiPupil}`,
      tekananDarah: formData.tekananDarah,
      denyutNadi: formData.denyutNadi,
      pernapasan: formData.pernapasan,
      suhuTubuh: formData.suhuTubuh,
      kondisiPupil: formData.kondisiPupil,
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

    const existingLogs = Array.isArray(updated.auditLogs) ? updated.auditLogs : [];
    updated.auditLogs = [
      ...existingLogs,
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

    try {
      const payload: any = {
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
        durasiUsulanBulan: formData.durasiUsulanBulan ? Number(formData.durasiUsulanBulan) : undefined,
        catatanKhusus: formData.catatanKhususPleno,
        riwayatZat: formData.jenisZat ? [
          {
            jenisZat: formData.jenisZat,
            caraPakai: formData.caraPakai,
            frekuensi: formData.frekuensi,
            lamaPemakaianBulan: Number(formData.lamaPemakaianBulan) || 0,
            terakhirPakai: formData.terakhirPakai
          }
        ] : undefined,
        hasilUrin: urinTests
      };

      await asesmenMedisApi.saveDraft(selectedCase.id, payload).catch(() => null);

      if (isFinal) {
        await asesmenMedisApi.finalisasi(selectedCase.id).catch(() => null);
      }
    } catch (apiErr) {
      console.warn('Backend sync:', apiErr);
    }

    if (onUpdatePermohonan) {
      onUpdatePermohonan(updated);
    }

    // Hapus draft sementara dari localStorage setelah berhasil disimpan/difinalisasi
    try {
      localStorage.removeItem(`etat_draft_medis_${selectedCase.id}`);
    } catch (e) {
      console.warn('Gagal menghapus draft localStorage:', e);
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

    const isMedisBeres = 
      item.asesmenMedis?.status === 'FINAL' || 
      item.medicalStatus === 'FINAL' ||
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
      return isMedisBeres;
    } else {
      return !isMedisBeres;
    }
  });

  // ==========================================
  // VIEW 2: DEDICATED MEDICAL WORKBOOK DETAIL PAGE
  // ==========================================
  if (selectedCase) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <MedisCaseSummaryHeader
          selectedCase={selectedCase}
          isCompleted={isCompleted || false}
          isReadOnlyView={isReadOnlyView || false}
          saveFeedback={saveFeedback}
          onOpenDokumenModal={() => setShowDokumenModal(true)}
        />

        <MedisStepNav
          activeStep={activeStep}
          onNavigateStep={handleStepNavigation}
        />

        {activeStep === 1 && (
          <Step1AnamnesisZat
            formData={formData}
            setFormData={setFormData}
            isReadOnlyView={isReadOnlyView || false}
            onNext={() => handleStepNavigation(2)}
          />
        )}

        {activeStep === 2 && (
          <Step2PemeriksaanFisik
            formData={formData}
            setFormData={setFormData}
            isReadOnlyView={isReadOnlyView || false}
            onPrev={() => handleStepNavigation(1)}
            onNext={() => handleStepNavigation(3)}
          />
        )}

        {activeStep === 3 && (
          <Step3UjiToksikologi
            urinTests={urinTests}
            isReadOnlyView={isReadOnlyView || false}
            onToggleUrin={toggleUrinResult}
            onPrev={() => handleStepNavigation(2)}
            onNext={() => handleStepNavigation(4)}
          />
        )}

        {activeStep === 4 && (
          <Step4WhoAssistMse
            formData={formData}
            setFormData={setFormData}
            calculatedAssistScore={calculatedAssistScore}
            assistRiskLevel={assistRiskLevel}
            isReadOnlyView={isReadOnlyView || false}
            onPrev={() => handleStepNavigation(3)}
            onNext={() => handleStepNavigation(5)}
          />
        )}

        {activeStep === 5 && (
          <Step5DiagnosisRekomendasi
            formData={formData}
            setFormData={setFormData}
            isReadOnlyView={isReadOnlyView || false}
            onPrev={() => handleStepNavigation(4)}
            onNext={() => handleStepNavigation(6)}
          />
        )}

        {activeStep === 6 && (
          <Step6PengesahanResume
            formData={formData}
            urinTests={urinTests}
            currentUser={currentUser}
            calculatedAssistScore={calculatedAssistScore}
            assistRiskLevel={assistRiskLevel}
            isReadOnlyView={isReadOnlyView || false}
            onCloseCase={handleCloseCase}
            onSaveDraft={() => handleSaveMedicalForm(false)}
            onFinalize={handleFinalizeClick}
          />
        )}

        <MedisValidationModal
          modalState={validationModal}
          onClose={() => setValidationModal(null)}
        />

        <ModalLihatDokumenBb
          isOpen={showDokumenModal}
          onClose={() => setShowDokumenModal(false)}
          permohonan={selectedCase}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW 1: QUEUE LIST OF MEDICAL ASSESSMENTS
  // ==========================================
  return (
    <>
      <MedisCaseList
        mode={mode}
        isReadOnly={isReadOnly}
        filteredCases={filteredCases}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCase={handleOpenCase}
      />

      <ModalLihatDokumenBb
        isOpen={showDokumenModal}
        onClose={() => setShowDokumenModal(false)}
        permohonan={selectedCase || null}
      />
    </>
  );
};
