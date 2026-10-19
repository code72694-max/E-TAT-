import { PermohonanAsesmen, UserProfile } from '../../types';

export interface FormDataHukum {
  nomorLp: string;
  pasalSangkaan: string;
  kronologiPenangkapan: string;
  lokasiTkp: string;
  totalBeratBersihGram: string;
  ambangBatasSema: string;
  kesesuaianSema: string;
  analisisBarangBukti: string;
  analisisPeran: 'Penyalahguna Murni' | 'Korban Penyalahgunaan' | 'Pecandu dengan Kepemilikan Terbatas' | 'Indikasi Pengedar / Jaringan' | 'Belum Dapat Disimpulkan';
  argumentasiPeran: string;
  catatanBelumTerverifikasi: string;
  pernahDitangkap: boolean;
  keteranganPerkaraLalu: string;
  terverifikasiDatabase: boolean;
  keterkaitanSindikat: string;
  sumberPerolehan: string;
  rekomendasiHukum: 'Proses Hukum Dilanjutkan dengan Rehabilitasi' | 'Proses Hukum Dilanjutkan Tanpa Rehabilitasi' | 'Penerapan Keadilan Restoratif / Diversi' | 'Perlu Pendalaman Penyidikan';
  kesimpulanHukum: string;
  catatanKlarifikasi: string;
}

export interface FaktaItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ValidationModalState {
  isOpen: boolean;
  stepNumber: number;
  stepTitle: string;
  missingFields: string[];
}

export interface AsesmenHukumViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  onSelectPermohonan?: (id: string) => void;
  selectedCaseId?: string | null;
  onSelectCase?: (id: string | null) => void;
  mode?: 'active' | 'history';
}
