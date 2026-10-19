import { PermohonanAsesmen } from '../../types';

export interface UrinTestItem {
  parameter: string;
  hasil: 'Positif' | 'Negatif';
}

export interface MedisFormData {
  // 1. Fisik & Vital
  tekananDarah: string;
  denyutNadi: string;
  pernapasan: string;
  suhuTubuh: string;
  kondisiPupil: string;
  needleTracks: string;
  kondisiIntoksikasi: string;
  komorbiditasMedis: string;

  // 2. Anamnesis & Riwayat Zat
  jenisZat: string;
  caraPakai: string;
  frekuensi: string;
  lamaPemakaianBulan: string;
  usiaMulaiPakai: string;
  terakhirPakai: string;
  riwayatOverdosis: string;
  riwayatRehabSebelumnya: string;

  // 3. WHO ASSIST & MSE
  q1_frekuensi: number | null;
  q2_dorongan: number | null;
  q3_masalah: number | null;
  q4_kegagalan: number | null;
  q5_kecemasan_orang_lain: number | null;
  q6_usaha_berhenti_gagal: number | null;
  skorAssistManual: number;
  evaluasiMse: string;

  // 4. ICD-10 & Rekomendasi
  diagnosisKlinisIcd: string;
  kebutuhanRawat: string;
  durasiUsulanBulan: string;
  fasilitasRujukan: string;
  interpretasiKlinis: string;
  catatanKhususPleno: string;
}

export interface ValidationModalState {
  isOpen: boolean;
  stepNumber: number;
  stepTitle: string;
  missingFields: string[];
}

export const DEFAULT_URIN_TESTS: UrinTestItem[] = [
  { parameter: 'MET (Metamfetamina / Sabu)', hasil: 'Positif' },
  { parameter: 'AMP (Amfetamina)', hasil: 'Positif' },
  { parameter: 'THC (Ganja / Kanabis)', hasil: 'Negatif' },
  { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' },
  { parameter: 'MOP (Morfin / Opiat)', hasil: 'Negatif' },
  { parameter: 'COC (Kokain)', hasil: 'Negatif' }
];

export const getInitialMedisFormData = (selectedCase?: PermohonanAsesmen | null): MedisFormData => {
  const med = selectedCase?.asesmenMedis;
  const rZat = med?.riwayatZat?.[0];

  if (med) {
    return {
      tekananDarah: med.tekananDarah || '',
      denyutNadi: med.denyutNadi || '',
      pernapasan: (med as any).pernapasan || '',
      suhuTubuh: (med as any).suhuTubuh || '',
      kondisiPupil: (med as any).kondisiPupil || '',
      needleTracks: (med as any).needleTracks || (med.tandaBekasSuntikan ? 'ada_baru' : 'tidak_ada'),
      kondisiIntoksikasi: (med as any).kondisiIntoksikasi || 'stabil',
      komorbiditasMedis: med.komorbiditasMedis || '',

      jenisZat: rZat?.jenisZat || '',
      caraPakai: rZat?.caraPakai || '',
      frekuensi: rZat?.frekuensi || '',
      lamaPemakaianBulan: rZat?.lamaPemakaianBulan !== undefined && rZat?.lamaPemakaianBulan !== null ? String(rZat.lamaPemakaianBulan) : '',
      usiaMulaiPakai: (med as any).usiaMulaiPakai || (selectedCase?.terperiksa?.usia ? String(selectedCase.terperiksa.usia) : ''),
      terakhirPakai: rZat?.terakhirPakai || '',
      riwayatOverdosis: (med as any).riwayatOverdosis || 'Tidak ada riwayat overdosis',
      riwayatRehabSebelumnya: (med as any).riwayatRehabSebelumnya || 'Belum pernah menjalani rehabilitasi',

      q1_frekuensi: (med as any).q1_frekuensi !== undefined ? (med as any).q1_frekuensi : 4,
      q2_dorongan: (med as any).q2_dorongan !== undefined ? (med as any).q2_dorongan : 5,
      q3_masalah: (med as any).q3_masalah !== undefined ? (med as any).q3_masalah : 6,
      q4_kegagalan: (med as any).q4_kegagalan !== undefined ? (med as any).q4_kegagalan : 5,
      q5_kecemasan_orang_lain: (med as any).q5_kecemasan_orang_lain !== undefined ? (med as any).q5_kecemasan_orang_lain : 6,
      q6_usaha_berhenti_gagal: (med as any).q6_usaha_berhenti_gagal !== undefined ? (med as any).q6_usaha_berhenti_gagal : 3,
      skorAssistManual: med.skorInstrumen || 29,
      evaluasiMse: med.kondisiPsikologis || '',

      diagnosisKlinisIcd: med.diagnosisKlinisIcd || '',
      kebutuhanRawat: med.kebutuhanRawat || '',
      durasiUsulanBulan: med.durasiUsulanBulan ? String(med.durasiUsulanBulan) : '3',
      fasilitasRujukan: (med as any).fasilitasRujukan || 'Balai Rehabilitasi BNN Tanah Merah',
      interpretasiKlinis: med.interpretasiKlinis || '',
      catatanKhususPleno: med.catatanKhusus || ''
    };
  }

  return {
    jenisZat: '',
    caraPakai: '',
    frekuensi: '',
    lamaPemakaianBulan: '',
    usiaMulaiPakai: '',
    terakhirPakai: '',
    riwayatOverdosis: '',
    riwayatRehabSebelumnya: '',

    tekananDarah: '',
    denyutNadi: '',
    pernapasan: '',
    suhuTubuh: '',
    kondisiPupil: '',
    needleTracks: '',
    kondisiIntoksikasi: '',
    komorbiditasMedis: '',

    q1_frekuensi: null,
    q2_dorongan: null,
    q3_masalah: null,
    q4_kegagalan: null,
    q5_kecemasan_orang_lain: null,
    q6_usaha_berhenti_gagal: null,
    skorAssistManual: 0,
    evaluasiMse: '',

    diagnosisKlinisIcd: '',
    kebutuhanRawat: '',
    durasiUsulanBulan: '',
    fasilitasRujukan: '',
    interpretasiKlinis: '',
    catatanKhususPleno: ''
  };
};
