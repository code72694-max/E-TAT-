import React, { useState, useEffect } from 'react';
import { PermohonanAsesmen } from '../types';
import { CheckCircle2 } from 'lucide-react';
import { ModalLihatDokumenBb } from './ModalLihatDokumenBb';
import { asesmenHukumApi } from '../services/api';
import {
  AsesmenHukumViewProps,
  FormDataHukum,
  FaktaItem,
  ValidationModalState,
  HukumCaseSummaryHeader,
  HukumStepNav,
  HukumValidationModal,
  Step1KonstruksiKasus,
  Step2TelaahSema,
  Step3KualifikasiPeran,
  Step4SindikatResidivis,
  Step5RekomendasiPleno,
  Step6PengesahanResume,
  HukumCaseList,
} from './asesmen-hukum';

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
  const [validationModal, setValidationModal] = useState<ValidationModalState | null>(null);
  const [customFaktaInput, setCustomFaktaInput] = useState<string>('');
  const [showAddFakta, setShowAddFakta] = useState<boolean>(false);

  const selectedCase = permohonanList.find(p => p.id === selectedCaseId);

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

  // Form local state for legal assessment (checks localStorage draft first)
  const [formData, setFormData] = useState<FormDataHukum>(() => {
    const defaultData: FormDataHukum = {
      nomorLp: selectedCase?.perkara?.nomorLaporanPolisi || '',
      pasalSangkaan: selectedCase?.perkara?.pasalDipersangkakan || (selectedCase?.perkara as any)?.pasalDisangkakan || '',
      kronologiPenangkapan: selectedCase?.perkara?.kronologiSingkat || '',
      lokasiTkp: selectedCase?.perkara?.tempatKejadianPerkara || (selectedCase?.perkara as any)?.lokasiTkp || 'Samarinda, Kalimantan Timur',
      totalBeratBersihGram: selectedCase?.perkara?.barangBuktiList?.[0]?.beratBersihGram?.toString() || '0.42',
      ambangBatasSema: 'Maksimal 1.0 Gram (Metamfetamina / Sabu SEMA No. 04/2010)',
      kesesuaianSema: 'Memenuhi Batas Gramatur SEMA 04/2010 (Pemakaian 1 Hari)',
      analisisBarangBukti: selectedCase?.asesmenHukum?.analisisBarangBukti || 'Total barang bukti narkotika jenis sabu berada di bawah ambang batas SEMA No. 04 Tahun 2010.',
      analisisPeran: (selectedCase?.asesmenHukum?.analisisPeran || 'Penyalahguna Murni') as any,
      argumentasiPeran: selectedCase?.asesmenHukum?.argumentasiPeran || 'Tersangka ditangkap saat/sesaat setelah menggunakan sabu di tempat tinggalnya. Tidak ditemukan barang bukti timbangan digital maupun catatan rekapan penjualan narkotika.',
      catatanBelumTerverifikasi: selectedCase?.asesmenHukum?.catatanBelumTerverifikasi || 'Informasi awal mengenai perantara yang memasok sabu masih dalam penelusuran penyidik.',
      pernahDitangkap: selectedCase?.asesmenHukum?.riwayatResidivisme?.pernahDitangkap ?? false,
      keteranganPerkaraLalu: selectedCase?.asesmenHukum?.riwayatResidivisme?.keteranganPerkaraLalu || 'Belum pernah dihukum / tidak terdaftar dalam database residivis Ditresnarkoba & Kejaksaan.',
      terverifikasiDatabase: true,
      keterkaitanSindikat: 'Tidak terafiliasi dengan jaringan pengedar terorganisir (Konsumen akhir terputus)',
      sumberPerolehan: 'Membeli langsung secara patungan tunai dari pihak ketiga untuk dipakai sendiri',
      rekomendasiHukum: (selectedCase?.asesmenHukum?.rekomendasiHukum || 'Proses Hukum Dilanjutkan dengan Rehabilitasi') as any,
      kesimpulanHukum: selectedCase?.asesmenHukum?.kesimpulanHukum || 'Berdasarkan kualifikasi yuridis Pasal 127 UU No. 35/2009, SEMA 04/2010, dan Pedoman Jaksa Agung No. 18/2021, tersangka dikualifikasikan sebagai Penyalah Guna Narkotika bagi Diri Sendiri yang berhak mendapatkan rehabilitasi medis dan sosial melalui mekanisme TAT.',
      catatanKlarifikasi: selectedCase?.asesmenHukum?.catatanKlarifikasi || 'Proses penyidikan perkara pokok tetap berjalan sesuai koridor hukum acara pidana, dengan penempatan tersangka di fasilitas rehabilitasi yang ditunjuk.'
    };

    if (selectedCase && !isReadOnlyView) {
      try {
        const raw = localStorage.getItem(`etat_draft_hukum_${selectedCase.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.formData) return { ...defaultData, ...parsed.formData };
        }
      } catch {}
    }
    return defaultData;
  });

  // Checklist Fakta Yuridis Pendukung
  const [faktaList, setFaktaList] = useState<FaktaItem[]>(() => {
    const defaultFakta: FaktaItem[] = [
      { id: 'f1', text: 'Tertangkap tangan saat atau sesaat setelah menggunakan narkotika untuk diri sendiri', checked: true },
      { id: 'f2', text: 'Hasil uji urin laboratorium forensik terkonfirmasi positif zat narkotika (SKHPU)', checked: true },
      { id: 'f3', text: 'Barang bukti berada di bawah batas gramatur Surat Edaran Mahkamah Agung (SEMA No. 04/2010)', checked: true },
      { id: 'f4', text: 'Tidak ditemukan timbangan digital, plastik klip kosong dalam jumlah besar, atau alat pres', checked: true },
      { id: 'f5', text: 'Tidak ditemukan catatan transaksi, buku rekap peredaran, atau mutasi rekening penampung hasil jual-beli', checked: true },
      { id: 'f6', text: 'Bukan merupakan residivis tindak pidana peredaran gelap narkotika (Pasal 114 / 112)', checked: true }
    ];

    if (selectedCase && !isReadOnlyView) {
      try {
        const raw = localStorage.getItem(`etat_draft_hukum_${selectedCase.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.faktaList)) return parsed.faktaList;
        }
      } catch {}
    }
    return defaultFakta;
  });

  // Synchronize form when selectedCase changes
  useEffect(() => {
    if (!selectedCase) return;

    const storageKey = `etat_draft_hukum_${selectedCase.id}`;
    let loadedFromDraft = false;

    if (!isReadOnlyView) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.formData) {
            setFormData(prev => ({ ...prev, ...parsed.formData }));
            if (parsed.faktaList && Array.isArray(parsed.faktaList)) {
              setFaktaList(parsed.faktaList);
            }
            if (parsed.activeStep) {
              setActiveStep(parsed.activeStep);
            }
            loadedFromDraft = true;
          }
        }
      } catch (e) {
        console.warn('Draft parse error hukum:', e);
      }
    }

    if (!loadedFromDraft) {
      setActiveStep(1);
      const bbText = selectedCase.perkara.barangBuktiList?.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ') || '';

      setFormData(prev => ({
        ...prev,
        nomorLp: selectedCase.perkara?.nomorLaporanPolisi || prev.nomorLp || '',
        pasalSangkaan: selectedCase.perkara?.pasalDipersangkakan || (selectedCase.perkara as any)?.pasalDisangkakan || prev.pasalSangkaan || '',
        kronologiPenangkapan: selectedCase.perkara?.kronologiSingkat || prev.kronologiPenangkapan || '',
        lokasiTkp: selectedCase.perkara?.tempatKejadianPerkara || (selectedCase.perkara as any)?.lokasiTkp || prev.lokasiTkp || 'Samarinda, Kalimantan Timur',
        totalBeratBersihGram: selectedCase.perkara?.barangBuktiList?.[0]?.beratBersihGram?.toString() || prev.totalBeratBersihGram || '0.42',
        analisisBarangBukti: selectedCase.asesmenHukum?.analisisBarangBukti || (bbText ? `Barang bukti yang disita berupa ${bbText} memenuhi kriteria SEMA 04/2010.` : prev.analisisBarangBukti || ''),
        analisisPeran: selectedCase.asesmenHukum?.analisisPeran || prev.analisisPeran,
        argumentasiPeran: selectedCase.asesmenHukum?.argumentasiPeran || prev.argumentasiPeran || '',
        catatanBelumTerverifikasi: selectedCase.asesmenHukum?.catatanBelumTerverifikasi || prev.catatanBelumTerverifikasi || '',
        pernahDitangkap: selectedCase.asesmenHukum?.riwayatResidivisme?.pernahDitangkap ?? prev.pernahDitangkap ?? false,
        keteranganPerkaraLalu: selectedCase.asesmenHukum?.riwayatResidivisme?.keteranganPerkaraLalu || prev.keteranganPerkaraLalu || '',
        rekomendasiHukum: selectedCase.asesmenHukum?.rekomendasiHukum || prev.rekomendasiHukum,
        kesimpulanHukum: selectedCase.asesmenHukum?.kesimpulanHukum || prev.kesimpulanHukum || '',
        catatanKlarifikasi: selectedCase.asesmenHukum?.catatanKlarifikasi || prev.catatanKlarifikasi || ''
      }));

      if (selectedCase.asesmenHukum?.faktaPendukung && selectedCase.asesmenHukum.faktaPendukung.length > 0) {
        setFaktaList(prev => prev.map(f => ({
          ...f,
          checked: selectedCase.asesmenHukum!.faktaPendukung.includes(f.text)
        })));
      }
    }
  }, [selectedCaseId, isReadOnlyView]);

  // Auto-save form inputs to localStorage on every change
  useEffect(() => {
    if (!selectedCase || isReadOnlyView) return;
    try {
      const storageKey = `etat_draft_hukum_${selectedCase.id}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          formData,
          faktaList,
          activeStep,
          lastSavedAt: new Date().toISOString()
        })
      );
    } catch (e) {
      console.warn('Auto-save localStorage error hukum:', e);
    }
  }, [formData, faktaList, activeStep, selectedCase?.id, isReadOnlyView]);

  const toggleFakta = (id: string) => {
    if (isReadOnlyView) return;
    setFaktaList(prev => prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  };

  const handleAddCustomFakta = () => {
    if (!customFaktaInput.trim() || isReadOnlyView) return;
    setFaktaList(prev => [
      ...prev,
      { id: `custom-${Date.now()}`, text: customFaktaInput.trim(), checked: true }
    ]);
    setCustomFaktaInput('');
    setShowAddFakta(false);
  };

  const handleSelectAllFakta = (checked: boolean) => {
    if (isReadOnlyView) return;
    setFaktaList(prev => prev.map(f => ({ ...f, checked })));
  };

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

  const getStepValidation = (step: number) => {
    const missing: string[] = [];
    let title = '';

    if (step === 1) {
      title = '1. Konstruksi Perkara & Dokumen Penyidikan';
      if (!formData.nomorLp?.trim()) missing.push('Nomor Laporan Polisi (LP / LKN)');
      if (!formData.pasalSangkaan?.trim()) missing.push('Pasal yang Dipersangkakan Penyidik');
      if (!formData.lokasiTkp?.trim()) missing.push('Tempat Kejadian Perkara (TKP)');
      if (!formData.kronologiPenangkapan?.trim()) missing.push('Kronologi Singkat Fakta Penangkapan');
    } else if (step === 2) {
      title = '2. Telaah Batasan Gramatur SEMA 04/2010';
      const berat = Number(formData.totalBeratBersihGram);
      const isTanpaBB = formData.kesesuaianSema.toLowerCase().includes('tanpa barang bukti');
      if (!isTanpaBB && (!formData.totalBeratBersihGram?.trim() || isNaN(berat) || berat <= 0)) {
        missing.push('Total Berat Bersih Barang Bukti (harus angka positif > 0 gram)');
      }
      if (!formData.kesesuaianSema?.trim()) missing.push('Status Kesesuaian Gramatur SEMA');
      if (!formData.analisisBarangBukti?.trim()) missing.push('Analisis & Pertimbangan Yuridis Barang Bukti');
    } else if (step === 3) {
      title = '3. Kualifikasi Peran & Fakta Yuridis Terverifikasi';
      if (!formData.analisisPeran?.trim()) missing.push('Kualifikasi Tipologi Peran');
      const checkedFakta = faktaList.filter(f => f.checked);
      if (checkedFakta.length === 0) missing.push('Minimal 1 Checklist Fakta Yuridis Terpenuhi');
      if (!formData.argumentasiPeran?.trim()) missing.push('Argumentasi Yuridis Kualifikasi Peran');
    } else if (step === 4) {
      title = '4. Penelusuran Sindikat Jaringan & Residivisme';
      if (!formData.keterkaitanSindikat?.trim()) missing.push('Keterkaitan dengan Jaringan Sindikat');
      if (!formData.keteranganPerkaraLalu?.trim()) missing.push('Keterangan Riwayat Perkara Lalu');
      if (!formData.sumberPerolehan?.trim()) missing.push('Pola Transaksi & Sumber Perolehan Narkotika');
    } else if (step === 5) {
      title = '5. Rekomendasi Yuridis & Kesimpulan Hukum';
      if (!formData.rekomendasiHukum?.trim()) missing.push('Rekomendasi Yuridis Tindak Lanjut Perkara');
      if (!formData.kesimpulanHukum?.trim()) missing.push('Kesimpulan & Pertimbangan Yuridis Lengkap');
      if (!formData.catatanKlarifikasi?.trim()) missing.push('Catatan Klarifikasi Tambahan untuk Pleno');
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

    if (window.confirm('Apakah Anda yakin ingin menyelesaikan dan memfinalisasi Asesmen Hukum ini? Berkas akan diteruskan ke Sidang Pleno TAT dan berpindah ke Riwayat Hukum.')) {
      handleSaveLegalForm(true);
    }
  };

  const handleSaveLegalForm = async (isFinal: boolean) => {
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

    // Sinkronisasi data perkara jika disunting/diverifikasi oleh tim hukum
    if (updated.perkara) {
      const beratNum = parseFloat(formData.totalBeratBersihGram) || 0;
      updated.perkara = {
        ...updated.perkara,
        nomorLaporanPolisi: formData.nomorLp?.trim() || updated.perkara.nomorLaporanPolisi,
        pasalDipersangkakan: formData.pasalSangkaan?.trim() || updated.perkara.pasalDipersangkakan,
        tempatKejadianPerkara: formData.lokasiTkp?.trim() || updated.perkara.tempatKejadianPerkara,
        kronologiSingkat: formData.kronologiPenangkapan?.trim() || updated.perkara.kronologiSingkat,
        barangBuktiList: updated.perkara.barangBuktiList?.map((bb, idx) =>
          idx === 0 ? { ...bb, beratBersihGram: beratNum } : bb
        ) || []
      };
    }

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

    // Persist to backend database via API
    try {
      await asesmenHukumApi.saveDraft(selectedCase.id, {
        pernahDitangkap: formData.pernahDitangkap,
        keteranganPerkaraLalu: formData.keteranganPerkaraLalu,
        terverifikasiDatabase: formData.terverifikasiDatabase,
        analisisPeran: formData.analisisPeran,
        argumentasiPeran: formData.argumentasiPeran,
        faktaPendukung: checkedFakta,
        catatanBelumTerverifikasi: formData.catatanBelumTerverifikasi,
        analisisBarangBukti: formData.analisisBarangBukti,
        kesimpulanHukum: formData.kesimpulanHukum,
        rekomendasiHukum: formData.rekomendasiHukum,
        catatanKlarifikasi: formData.catatanKlarifikasi,
        nomorLp: formData.nomorLp,
        pasalSangkaan: formData.pasalSangkaan,
        lokasiTkp: formData.lokasiTkp,
        kronologiPenangkapan: formData.kronologiPenangkapan,
        totalBeratBersihGram: formData.totalBeratBersihGram,
        kesesuaianSema: formData.kesesuaianSema,
        ambangBatasSema: formData.ambangBatasSema,
        keterkaitanSindikat: formData.keterkaitanSindikat,
        sumberPerolehan: formData.sumberPerolehan,
      });

      if (isFinal) {
        await asesmenHukumApi.finalisasi(selectedCase.id);
      }
    } catch (err) {
      console.warn('Backend API save asesmen hukum warning, keeping local state:', err);
    }

    if (onUpdatePermohonan) {
      onUpdatePermohonan(updated);
    }

    // Hapus draft sementara dari localStorage setelah berhasil disimpan/difinalisasi
    try {
      localStorage.removeItem(`etat_draft_hukum_${selectedCase.id}`);
    } catch (e) {
      console.warn('Gagal menghapus draft localStorage hukum:', e);
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
      return !isHukumBeres;
    }
  });

  // ==========================================
  // VIEW 2: DEDICATED LEGAL WORKBOOK DETAIL PAGE
  // ==========================================
  if (selectedCase) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Case Summary Header */}
        <HukumCaseSummaryHeader
          selectedCase={selectedCase}
          isReadOnlyView={isReadOnlyView}
          onOpenDokumenModal={() => setShowDokumenModal(true)}
        />

        {/* Read-Only Banner */}
        {isReadOnlyView && (
          <div className="p-3 bg-blue-950/60 border border-blue-500/40 rounded-xl flex items-center justify-between text-xs text-blue-200">
            <span className="font-semibold">
              🔒 Berkas asesmen hukum ini berstatus <strong>FINAL / RIWAYAT</strong> (Hanya Baca).
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-700/60 rounded-lg font-bold">
              TERKUNCI / FINAL
            </span>
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
        <HukumStepNav
          activeStep={activeStep}
          onStepSelect={handleStepNavigation}
        />

        {/* STEP 1: Konstruksi Perkara */}
        {activeStep === 1 && (
          <Step1KonstruksiKasus
            formData={formData}
            setFormData={setFormData}
            isReadOnlyView={isReadOnlyView}
            onNext={() => handleStepNavigation(2)}
          />
        )}

        {/* STEP 2: Telaah Batasan Gramatur SEMA 04/2010 */}
        {activeStep === 2 && (
          <Step2TelaahSema
            formData={formData}
            setFormData={setFormData}
            isReadOnlyView={isReadOnlyView}
            onBack={() => handleStepNavigation(1)}
            onNext={() => handleStepNavigation(3)}
          />
        )}

        {/* STEP 3: Kualifikasi Peran & Fakta Yuridis */}
        {activeStep === 3 && (
          <Step3KualifikasiPeran
            formData={formData}
            setFormData={setFormData}
            faktaList={faktaList}
            toggleFakta={toggleFakta}
            showAddFakta={showAddFakta}
            setShowAddFakta={setShowAddFakta}
            customFaktaInput={customFaktaInput}
            setCustomFaktaInput={setCustomFaktaInput}
            onAddCustomFakta={handleAddCustomFakta}
            onSelectAllFakta={handleSelectAllFakta}
            isReadOnlyView={isReadOnlyView}
            onBack={() => handleStepNavigation(2)}
            onNext={() => handleStepNavigation(4)}
          />
        )}

        {/* STEP 4: Sindikat, Jaringan & Residivisme */}
        {activeStep === 4 && (
          <Step4SindikatResidivis
            formData={formData}
            setFormData={setFormData}
            isReadOnlyView={isReadOnlyView}
            onBack={() => handleStepNavigation(3)}
            onNext={() => handleStepNavigation(5)}
          />
        )}

        {/* STEP 5: Rekomendasi Yuridis & Kesimpulan Hukum */}
        {activeStep === 5 && (
          <Step5RekomendasiPleno
            formData={formData}
            setFormData={setFormData}
            isReadOnlyView={isReadOnlyView}
            onBack={() => handleStepNavigation(4)}
            onNext={() => handleStepNavigation(6)}
          />
        )}

        {/* STEP 6: Pengesahan & Finalisasi */}
        {activeStep === 6 && (
          <Step6PengesahanResume
            formData={formData}
            faktaList={faktaList}
            currentUser={currentUser}
            isReadOnlyView={isReadOnlyView}
            onSaveDraft={() => handleSaveLegalForm(false)}
            onFinalize={handleFinalizeClick}
            onCloseCase={handleCloseCase}
          />
        )}

        {/* Modal: Validasi Isian Langkah */}
        <HukumValidationModal
          modalState={validationModal}
          onClose={() => setValidationModal(null)}
        />

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
    <>
      <HukumCaseList
        filteredCases={filteredCases}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isReadOnly={isReadOnly}
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
