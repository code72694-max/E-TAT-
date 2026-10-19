// Opsi Pangkat Kedinasan Lengkap (Polri, ASN/PNS, Kejaksaan, BNN)
export const PANGKAT_OPTIONS = [
  'KOMBES POL',
  'AKBP',
  'KOMPOL',
  'AKP',
  'IPTU',
  'IPDA',
  'AIPTU',
  'AIPDA',
  'BRIPKA',
  'BRIGADIR',
  'BRIPTU',
  'BRIPDA',
  'PEMBINA UTAMA / ASN',
  'PEMBINA / ASN',
  'PENATA TK. I / ASN',
  'PENATA / ASN',
  'PENATA MUDA / ASN',
  'PENGATUR / ASN',
  'JAKSA UTAMA PRATAMA',
  'JAKSA MADYA',
  'JAKSA MUDA',
  'PEGAWAI / PENYIDIK BNN',
  'LAINNYA'
];

// Opsi Wilayah Hukum Kalimantan Timur
export const WILAYAH_OPTIONS = [
  'Kota Samarinda',
  'Kota Balikpapan',
  'Kota Bontang',
  'Kabupaten Kutai Kartanegara',
  'Kabupaten Kutai Barat',
  'Kabupaten Kutai Timur',
  'Kabupaten Berau',
  'Kabupaten Paser',
  'Kabupaten Penajam Paser Utara',
  'Kabupaten Mahakam Ulu',
  'Polda Kalimantan Timur (Seluruh Kaltim)'
];

// Opsi Peran Utama Akses Akun
export const PERAN_OPTIONS = [
  { value: 'pengaju', label: 'Penyidik / Pengaju Asesmen' },
  { value: 'sekretariat', label: 'Sekretariat TAT' },
  { value: 'medis', label: 'Tim Asesmen Medis' },
  { value: 'hukum', label: 'Tim Asesmen Hukum' },
  { value: 'koordinator', label: 'Ketua / Koordinator TAT' },
  { value: 'pimpinan', label: 'Pimpinan Satwil / Pengawas' },
  { value: 'rehabilitasi', label: 'Petugas Fasilitas Rehabilitasi' }
];

// Opsi Spesialisasi berdasarkan Peran
export const getSpesialisasiOptions = (peran: string): string[] => {
  switch (peran) {
    case 'medis':
      return [
        'Dokter Umum',
        'Psikiater / Dokter Spesialis Jiwa',
        'Psikolog Klinis',
        'Perawat / Petugas Pengambil Sampel',
        'Analis Laboratorium'
      ];
    case 'hukum':
      return [
        'Penyidik Polri (Ditresnarkoba/Satresnarkoba)',
        'Penyidik BNN',
        'Jaksa Penuntut Umum',
        'Hakim',
        'Ahli Hukum / Akademisi',
        'Petugas Bapas (PK Bapas)'
      ];
    case 'sekretariat':
      return [
        'Koordinator Sekretariat',
        'Staf Administrasi',
        'Penerima Berkas / Front Desk'
      ];
    case 'rehabilitasi':
      return [
        'Kepala Fasilitas Rehabilitasi',
        'Konselor Adiksi',
        'Pekerja Sosial',
        'Petugas Pengawas Klien (Aftercare)'
      ];
    case 'pengaju':
      return [
        'Kasat Resnarkoba',
        'Kanit Idik',
        'Penyidik Pembantu'
      ];
    default:
      return [];
  }
};

// Formatter gelar perwira agar tidak ganda (e.g. "AKBP AKBP Hendri")
export const formatOfficerName = (pangkat?: string, namaLengkap?: string): string => {
  if (!namaLengkap) return '-';
  if (!pangkat) return namaLengkap;
  const cleanP = pangkat.trim();
  const cleanN = namaLengkap.trim();
  if (cleanN.toLowerCase().startsWith(cleanP.toLowerCase())) {
    return cleanN;
  }
  return `${cleanP} ${cleanN}`;
};

// Formatter ukuran file
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Kalkulator kekuatan password
export const getPasswordStrength = (pass: string) => {
  if (!pass) return { score: 0, label: '', color: '', percent: 0 };
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-rose-500 text-rose-400', percent: 33 };
  if (score <= 3) return { score: 2, label: 'Sedang', color: 'bg-amber-500 text-amber-400', percent: 66 };
  return { score: 3, label: 'Kuat & Aman', color: 'bg-emerald-500 text-emerald-400', percent: 100 };
};
