export interface RehabFacility {
  id: string;
  nama: string;
  tipe: string;
  alamat: string;
  kapasitasTotal: number;
  kapasitasTersedia: number;
  kontak: string;
  layanan: string[];
}

export const REHAB_FACILITIES: RehabFacility[] = [
  {
    id: 'fac-1',
    nama: 'Balai Besar Rehabilitasi BNN Tanah Merah Bogor',
    tipe: 'Rawat Inap Pemerintah (BNN)',
    alamat: 'Jl. Mayjen HR Edi Sukma Km 21, Watesjaya, Cigombong, Bogor',
    kapasitasTotal: 300,
    kapasitasTersedia: 0,
    kontak: '(0251) 8221010 / 0812-8889-9901',
    layanan: ['Detoksifikasi', 'Rehabilitasi Medis', 'Rehabilitasi Sosial', 'Pascarehabilitasi']
  },
  {
    id: 'fac-2',
    nama: 'RSKO (Rumah Sakit Ketergantungan Obat) Jakarta',
    tipe: 'Rumah Sakit Khusus Kemenkes (Inap & Jalan)',
    alamat: 'Jl. Lapangan Tembak No.75, Cibubur, Ciracas, Jakarta Timur',
    kapasitasTotal: 150,
    kapasitasTersedia: 14,
    kontak: '(021) 87711968 / 0811-1909-8765',
    layanan: ['Detoks Medis Intensif', 'Dual Diagnosis / Psikiatri', 'Rawat Inap 3-6 Bulan', 'Rawat Jalan']
  },
  {
    id: 'fac-3',
    nama: 'Klinik Pratama BNN Kota Samarinda (IPWL)',
    tipe: 'Rawat Jalan Pemerintah',
    alamat: 'Jl. Ciungwanara No. 10, Tamansari, Samarinda',
    kapasitasTotal: 80,
    kapasitasTersedia: 28,
    kontak: '(022) 2503201 / 0813-2211-0099',
    layanan: ['Konseling Rawat Jalan', 'Terapi Kelompok', 'Program 8-12 Sesi', 'Tes Urin Berkala']
  },
  {
    id: 'fac-4',
    nama: 'Loka Rehabilitasi BNN Batam',
    tipe: 'Rawat Inap Pemerintah (BNN)',
    alamat: 'Kawasan Nongsa Digital Park, Batam',
    kapasitasTotal: 120,
    kapasitasTersedia: 8,
    kontak: '(0778) 761102 / 0812-7000-8811',
    layanan: ['Rehabilitasi Medis', 'Rehabilitasi Vokasional', 'Rawat Inap 6 Bulan']
  }
];
