import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { ActiveTab } from './Sidebar';
import {
  GitCommit,
  Users,
  FileCheck,
  Scale,
  Stethoscope,
  FileSignature,
  Share2,
  ShieldCheck,
  Clock,
  QrCode,
  FileSpreadsheet,
  CalendarCheck,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Info,
  Building2,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface AboutViewProps {
  currentUser: UserProfile;
  onNavigateToTab?: (tab: ActiveTab) => void;
}

type SectionTab = 'roadmap' | 'roles' | 'outputs' | 'regulasi';

export const AboutView: React.FC<AboutViewProps> = ({
  currentUser,
  onNavigateToTab
}) => {
  const [activeSection, setActiveSection] = useState<SectionTab>('roadmap');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<UserRole>(currentUser.role);
  const [selectedStage, setSelectedStage] = useState<number>(1);

  // 7 Stages of e-TAT Roadmap Flow
  const workflowStages = [
    {
      step: 1,
      title: 'Pengajuan & Kelengkapan Berkas',
      timeframe: 'Hari ke-1 (Maks. 1x24 jam pasca penangkapan)',
      actor: 'Penyidik Pengaju (Polri / BNN)',
      actorRole: 'pengaju' as UserRole,
      summary: 'Penyidik menginput data terperiksa, berkas perkara, dan mengunggah 7 berkas formil persyaratan.',
      inputs: [
        'Surat Permohonan Asesmen Resmi',
        'Laporan Polisi (LP)',
        'Surat Perintah Penyidikan (Sprintik)',
        'Berita Acara Penangkapan (BAP)',
        'BA Penggeledahan & Penyitaan',
        'Surat Bukti Uji Laboratorium Zat',
        'Fotokopi KTP / Data Kependudukan NIK'
      ],
      actions: [
        'Penyidik membuat permohonan melalui formulir digital e-TAT',
        'Sistem memvalidasi kelengkapan awal dan menerbitkan Kode Registrasi Perkara unik',
        'Berkas otomatis masuk ke antrean verifikasi Sekretariat TAT'
      ],
      output: 'Draf Permohonan Terdaftar & Bukti Tanda Terima Elektronik',
      statusResult: 'diajukan → verifikasi_berkas'
    },
    {
      step: 2,
      title: 'Verifikasi & Kepatuhan Administrasi',
      timeframe: 'Hari ke-1 s/d Hari ke-2',
      actor: 'Sekretariat TAT',
      actorRole: 'sekretariat' as UserRole,
      summary: 'Pemeriksaan formalitas dan keabsahan legal berkas administrasi persyaratan.',
      inputs: ['7 Berkas digital permohonan yang diunggah penyidik'],
      actions: [
        'Sekretariat memeriksa keterbacaan dan keabsahan setiap berkas',
        'Jika berkas lengkap dan sesuai: Permohonan diverifikasi untuk penjadwalan',
        'Jika berkas kurang atau tidak sah: Dikembalikan dengan catatan perbaikan spesifik ke penyidik (status "perlu_perbaikan")'
      ],
      output: 'Lembar Hasil Verifikasi Berkas & Notifikasi Status ke Penyidik',
      statusResult: 'verifikasi_berkas → penugasan_jadwal (atau perlu_perbaikan)'
    },
    {
      step: 3,
      title: 'Penugasan Tim Asesor & Penjadwalan',
      timeframe: 'Hari ke-2',
      actor: 'Sekretariat & Koordinator TAT',
      actorRole: 'sekretariat' as UserRole,
      summary: 'Penetapan dokter, psikolog, dan penelaah hukum serta jadwal pemeriksaan fisik dan wawancara.',
      inputs: ['Permohonan berstatus lolos verifikasi'],
      actions: [
        'Sekretariat menunjuk Asesor Medis (Dokter/Psikolog) dan Asesor Hukum (Penyidik Senior/Jaksa)',
        'Penetapan ruang sidang, tanggal, dan jam pelaksanaan asesmen klinis serta telaah perkara',
        'Pengiriman undangan jadwal digital kepada penyidik dan tim asesor'
      ],
      output: 'Surat Tugas Tim Asesor & Agenda Kalender Jadwal Pemeriksaan',
      statusResult: 'penugasan_jadwal → asesmen_berlangsung'
    },
    {
      step: 4,
      title: 'Pemeriksaan Klinis & Telaah Hukum (Paralel)',
      timeframe: 'Hari ke-2 s/d Hari ke-4',
      actor: 'Tim Asesor Medis & Tim Asesor Hukum',
      actorRole: 'medis' as UserRole,
      summary: 'Pemeriksaan multidisiplin independen untuk menilai tingkat adiksi medis dan keterlibatan hukum.',
      inputs: [
        'Terperiksa (hadir fisik)',
        'Sampel Toksikologi Urin',
        'BAP & Berkas Perkara Penyidikan'
      ],
      actions: [
        'Asesor Medis: Wawancara klinis instrumen ASSIST (WHO), tes konfirmasi laboratorium urin, evaluasi komorbiditas fisik/psikiatri, penetapan diagnosis ICD-10 (F10-F19), dan usulan rencana rehabilitasi',
        'Asesor Hukum: Telaah yuridis peran tersangka (apakah pemakai murni atau bagian sindikat peredaran), komparasi berat barang bukti dengan ambang batas SEMA No. 04/2010, dan cek riwayat residivis',
        'Fitur Klarifikasi Terarah: Digunakan jika asesor membutuhkan konfirmasi fakta dari penyidik'
      ],
      output: 'Lembar Rekapitulasi Medis-Psikologis & Lembar Telaah Yuridis Independen',
      statusResult: 'asesmen_berlangsung → siap_pleno'
    },
    {
      step: 5,
      title: 'Sidang Pleno Musyawarah TAT',
      timeframe: 'Hari ke-4 s/d Hari ke-5',
      actor: 'Koordinator TAT, Tim Medis, Tim Hukum, Penyidik',
      actorRole: 'koordinator' as UserRole,
      summary: 'Musyawarah bersama menyandingkan temuan medis dan hukum untuk mencapai konsensus terpadu.',
      inputs: ['Lembar Hasil Asesmen Medis', 'Lembar Telaah Asesmen Hukum'],
      actions: [
        'Koordinator memimpin sidang pleno tertutup',
        'Pemaduan fakta medis (derajat adiksi) dengan fakta hukum (peran & kepemilikan zat)',
        'Musyawarah mufakat menetapkan kesimpulan rekomendasi: apakah memenuhi syarat rehabilitasi atau proses peradilan lanjut',
        'Penetapan rincian: modalitas (Rawat Jalan / Rawat Inap), durasi, dan usulan fasilitas rujukan'
      ],
      output: 'Risalah Berita Acara Sidang Pleno & Draf Rekomendasi Terpadu Final',
      statusResult: 'siap_pleno → pembahasan_pleno → pengesahan_rekomendasi'
    },
    {
      step: 6,
      title: 'Pengesahan Rekomendasi Resmi (3 Mandat)',
      timeframe: 'Hari ke-5 s/d Hari ke-6',
      actor: 'Koordinator TAT, Dokter Pemeriksa, Penelaah Hukum',
      actorRole: 'koordinator' as UserRole,
      summary: 'Penandatanganan digital resmi oleh 3 pihak yang berwenang dan penerbitan nomor surat resmi.',
      inputs: ['Draf Rekomendasi Terpadu hasil pleno'],
      actions: [
        'Koordinator TAT menandatangani dokumen secara digital',
        'Dokter Asesor Medis membubuhkan tanda tangan elektronik mandat klinis',
        'Penelaah Hukum membubuhkan tanda tangan elektronik mandat yuridis',
        'Sistem menerbitkan QR Code Kriptografis untuk verifikasi keabsahan instan di persidangan'
      ],
      output: 'Surat Rekomendasi Resmi TAT Ber-QR Code yang Sah Secara Hukum',
      statusResult: 'pengesahan_rekomendasi → rekomendasi_terbit'
    },
    {
      step: 7,
      title: 'Koordinasi Rujukan Fasilitas & Proses Hukum',
      timeframe: 'Pasca Terbit Rekomendasi (Maks. Hari ke-14)',
      actor: 'Fasilitas Rehabilitasi, Penyidik, Sekretariat',
      actorRole: 'rehabilitasi' as UserRole,
      summary: 'Pelaksanaan rekomendasi: penyerahan klien ke lembaga rehabilitasi dan lampiran berkas perkara ke Kejaksaan.',
      inputs: ['Surat Rekomendasi Resmi TAT', 'Surat Pengantar Rujukan'],
      actions: [
        'Fasilitas rehabilitasi menerima tiket rujukan digital, mengonfirmasi kuota kamar dan ketersediaan dokter',
        'Pencatatan tanggal admisi klien saat diterima resmi di tempat rehabilitasi',
        'Penyidik melampirkan surat rekomendasi ke berkas P-21 untuk pelaksanaan Restorative Justice (RJ) atau amar putusan hakim di pengadilan'
      ],
      output: 'Tanda Terima Admisi Klien, Surat Rujukan Terpenuhi, & Berkas Perkara Lengkap P-21',
      statusResult: 'rekomendasi_terbit → selesai_tindak_lanjut'
    }
  ];

  // 8 Roles Details
  const rolesDetails: Record<
    UserRole,
    {
      name: string;
      agency: string;
      badgeColor: string;
      icon: React.ReactNode;
      overview: string;
      keyResponsibilities: string[];
      accessRights: string[];
      boundaries: string[];
      keyOutputs: string[];
    }
  > = {
    pengaju: {
      name: 'Penyidik Pengaju',
      agency: 'Satresnarkoba Polri / BNN Kabupaten/Kota',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />,
      overview:
        'Penyidik yang menangani perkara tindak pidana narkotika dan mengajukan permohonan asesmen terpadu guna mendapatkan rekomendasi resmi bagi tersangka penyalahguna.',
      keyResponsibilities: [
        'Mendaftarkan permohonan asesmen terpadu maksimal 1x24 jam setelah penangkapan tersangka',
        'Mengunggah 7 berkas persyaratan formil (LP, Sprintik, BAP, Uji Lab, Identitas, dll.)',
        'Memperbaiki dan mengunggah ulang berkas jika terdapat catatan koreksi dari Sekretariat',
        'Menghadirkan tersangka pada jadwal pemeriksaan medis dan telaah hukum',
        'Mengambil dokumen rekomendasi resmi yang telah disahkan untuk kelengkapan berkas perkara peradilan'
      ],
      accessRights: [
        'Melihat seluruh berkas permohonan yang diajukan oleh satuannya sendiri',
        'Mengunduh bukti tanda terima permohonan dan surat rekomendasi resmi',
        'Melihat jadwal pemeriksaan terperiksa'
      ],
      boundaries: [
        'Tidak dapat mengubah atau melihat rekam medis klinis internal yang bersifat rahasia kedokteran',
        'Tidak dapat mengintervensi kesimpulan telaah hukum atau diagnosis dokter',
        'Tidak memiliki hak pengesahan draf rekomendasi'
      ],
      keyOutputs: [
        'Formulir Pengajuan Permohonan Asesmen',
        'Berkas Administrasi Perkara Terunggah',
        'Berkas Perbaikan Persyaratan'
      ]
    },
    sekretariat: {
      name: 'Sekretariat TAT',
      agency: 'Sekretariat Bersama Tim Asesmen Terpadu BNN / Kepolisian',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      overview:
        'Koordinator operasional dan gatekeeper alur administrasi e-TAT. Bertanggung jawab memastikan seluruh persyaratan formal terpenuhi dan proses berjalan sesuai SLA 6 hari kerja.',
      keyResponsibilities: [
        'Memeriksa dan memverifikasi kelengkapan 7 berkas persyaratan yang diunggah penyidik',
        'Memberikan catatan koreksi spesifik jika berkas belum memenuhi standar formil',
        'Menugaskan tim asesor (dokter pemeriksa & penelaah hukum) berdasarkan rotasi dan kompetensi',
        'Menyusun agenda jadwal pemeriksaan terperiksa dan jadwal sidang pleno bersama',
        'Memfasilitasi komunikasi rujukan terpadu ke fasilitas rehabilitasi mitra'
      ],
      accessRights: [
        'Mengelola seluruh antrean permohonan di wilayah kerjanya',
        'Menerbitkan disposisi verifikasi (Sesuai / Perlu Perbaikan)',
        'Mengatur jadwal kalender pemeriksaan dan penugasan asesor',
        'Mengirim notifikasi klarifikasi dan rujukan fasilitas'
      ],
      boundaries: [
        'Tidak berwenang menentukan diagnosis medis klinis atau analisis substansi hukum perkara',
        'Tidak menandatangani substansi rekomendasi teknis (hanya memfasilitasi penandatanganan 3 pihak)'
      ],
      keyOutputs: [
        'Lembar Verifikasi Berkas Administrasi',
        'Surat Perintah Penugasan Asesor Medis & Hukum',
        'Kalender Jadwal Pemeriksaan & Sidang Pleno',
        'Tiket Permintaan Rujukan Fasilitas'
      ]
    },
    medis: {
      name: 'Asesor Medis & Psikologis',
      agency: 'Dokter Spesialis Kedokteran Jiwa / Dokter Umum / Psikolog Klinis BNN/Dinkes',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: <Stethoscope className="w-5 h-5 text-teal-600" />,
      overview:
        'Tenaga kesehatan profesional yang melakukan asesmen fisik, kejiwaan, dan derajat ketergantungan narkotika secara independen berdasarkan standar medis internasional.',
      keyResponsibilities: [
        'Melakukan pemeriksaan fisik komprehensif dan uji konfirmasi toksikologi urin',
        'Melaksanakan skrining menggunakan instrumen baku ASSIST (Alcohol, Smoking, and Substance Involvement Screening Test)',
        'Menetapkan diagnosis ketergantungan berdasar kriteria ICD-10 (kode F10 s/d F19)',
        'Menilai ada/tidaknya komorbiditas psikiatri (gangguan mood, psikotik, ansietas) atau komplikasi fisik (HIV/Hepatitis)',
        'Merumuskan rencana rehabilitasi medis (Rawat Jalan / Rawat Inap beserta estimasi durasi)',
        'Membubuhkan tanda tangan digital pengesahan mandat medis pada rekomendasi resmi'
      ],
      accessRights: [
        'Akses penuh ke modul rekam medis, riwayat adiksi, dan hasil laboratorium urin terperiksa',
        'Mengajukan permintaan klarifikasi medis jika memerlukan riwayat terapi masa lalu'
      ],
      boundaries: [
        'Wajib menjaga kerahasiaan medis pasien (medical confidentiality)',
        'Tidak berwenang menentukan status yuridis atau pasal sangkaan pidana'
      ],
      keyOutputs: [
        'Lembar Skor Instrumen Skrining ASSIST/ASI',
        'Formulir Diagnosis Klinis ICD-10 & Evaluasi Komorbiditas',
        'Rencana Kebutuhan Terapi Rehabilitasi Medis',
        'Tanda Tangan Elektronik Mandat Medis'
      ]
    },
    hukum: {
      name: 'Asesor Hukum',
      agency: 'Penyidik Senior / Jaksa Penuntut Umum / Penelaah Hukum BNN',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <Scale className="w-5 h-5 text-purple-600" />,
      overview:
        'Penelaah aspek yuridis yang bertugas mengkaji fakta penangkapan, peran tersangka, dan kepemilikan barang bukti sesuai batasan undang-undang dan yurisprudensi Mahkamah Agung.',
      keyResponsibilities: [
        'Menelaah kesesuaian fakta penangkapan dalam BAP dengan pasal sangkaan pidana',
        'Mengevaluasi peran terperiksa: memisahkan secara tegas antara penyalahguna murni dengan pengedar/bandar/jaringan',
        'Menguji gramatur barang bukti narkotika terhadap batas kepemilikan 1 hari pakai menurut SEMA No. 04/2010',
        'Meneliti riwayat keterlibatan perkara sebelumnya (status residivis)',
        'Merumuskan simpulan yuridis kelayakan hukum permohonan',
        'Membubuhkan tanda tangan digital pengesahan mandat hukum pada rekomendasi'
      ],
      accessRights: [
        'Akses ke seluruh dokumen berkas perkara penyidikan (BAP, Berita Acara Sita, dsb.)',
        'Mengakses modul telaah hukum dan catatan hasil pleno'
      ],
      boundaries: [
        'Tidak boleh mendiagnosis kondisi klinis terperiksa',
        'Tidak boleh menggantikan peran hakim/jaksa di persidangan (rekomendasi bersifat advis hukum)'
      ],
      keyOutputs: [
        'Lembar Analisis Peran & Gramatur SEMA 04/2010',
        'Simpulan Yuridis Kelayakan Penanganan Terpadu',
        'Tanda Tangan Elektronik Mandat Hukum'
      ]
    },
    koordinator: {
      name: 'Ketua / Koordinator TAT',
      agency: 'Pimpinan Tim Asesmen Terpadu (BNN Provinsi / BNN Kota / Polres)',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      overview:
        'Pemimpin musyawarah pleno terpadu dan penanggung jawab tertinggi penerbitan surat rekomendasi resmi e-TAT.',
      keyResponsibilities: [
        'Memimpin sidang pleno musyawarah antara Tim Medis, Tim Hukum, dan Penyidik Pengaju',
        'Menengahi perbedaan pandangan atau dinamika pembahasan antara aspek medis dan hukum',
        'Memastikan perumusan rekomendasi sesuai konsensus mufakat dan ketentuan perundangan',
        'Mengesahkan draf rekomendasi final dan menandatangani surat rekomendasi resmi',
        'Memastikan kepatuhan SLA 6 hari kerja di seluruh proses'
      ],
      accessRights: [
        'Membuka dan menutup sidang pleno musyawarah',
        'Menyetujui atau meminta perbaikan draf rekomendasi sebelum terbit',
        'Otoritas pengesahan final surat rekomendasi resmi'
      ],
      boundaries: [
        'Keputusan pleno harus berdasarkan konsensus terpadu, bukan keputusan sepihak',
        'Tidak dapat membatalkan rekomendasi yang telah resmi terbit dan diserahkan ke persidangan tanpa mekanisme revisi resmi'
      ],
      keyOutputs: [
        'Berita Acara Sidang Pleno TAT Disepakati',
        'Pengesahan Digital Surat Rekomendasi Resmi BNN/Polri',
        'Disposisi Rujukan Layanan'
      ]
    },
    rehabilitasi: {
      name: 'Petugas Fasilitas Rehabilitasi',
      agency: 'Balai/Loka Rehabilitasi BNN, RSKO, RSUD, atau Lembaga Rehabilitasi Komponen Masyarakat (LRKM)',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: <Share2 className="w-5 h-5 text-teal-600" />,
      overview:
        'Pengelola layanan rujukan di institusi penerima klien hasil rekomendasi TAT untuk pelaksanaan program pemulihan adiksi.',
      keyResponsibilities: [
        'Menerima notifikasi rujukan klien dari e-TAT lengkap dengan ringkasan diagnosis kebutuhan layanan',
        'Mengonfirmasi ketersediaan kuota kapasitas rawat inap atau jadwal penerimaan rawat jalan',
        'Mencatat tanggal dan status admisi klien saat diserahkan resmi oleh penyidik/keluarga',
        'Melaporkan jika terdapat kendala admisi (misalnya klien tidak hadir, kapasitas penuh, atau penolakan)'
      ],
      accessRights: [
        'Melihat daftar klien yang secara resmi dirujuk ke fasilitasnya',
        'Mengunduh surat rujukan resmi dan resume medis relevan',
        'Mengubah status admisi dan konfirmasi kapasitas fasilitas'
      ],
      boundaries: [
        'Hanya dapat melihat data klien yang dirujuk ke lembaganya sendiri',
        'Tidak berwenang mengubah berkas perkara hukum penyidikan'
      ],
      keyOutputs: [
        'Konfirmasi Kuota & Penerimaan Rujukan Klien',
        'Tanda Terima Admisi Terperiksa',
        'Laporan Keterlaksanaan Program Rujukan'
      ]
    },
    pimpinan: {
      name: 'Pimpinan / Pengawas Mutu',
      agency: 'Kepala BNNP / BNNK, Direktur Reserse Narkoba Polda, Kapolres, Kepala Kejaksaan',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <BarChart3 className="w-5 h-5 text-amber-600" />,
      overview:
        'Pihak pimpinan yang memiliki kewenangan pengawasan terhadap kepatuhan hukum, integritas, dan efektivitas implementasi kebijakan asesmen terpadu.',
      keyResponsibilities: [
        'Memantau indikator kinerja layanan (kepatuhan SLA 6 hari, rasio penyelesaian perkara, volume rujukan)',
        'Mengevaluasi tren kasus permohonan, profil zat narkotika, dan sebaran geografis penanganan',
        'Mengawasi integritas proses layanan melalui audit log terenkripsi guna mencegah penyalahgunaan kewenangan',
        'Mengambil langkah kebijakan jika terjadi hambatan kuota fasilitas atau keterlambatan proses'
      ],
      accessRights: [
        'Akses menyeluruh ke Dashboard Monitoring Eksekutif dan 8 Indikator Kinerja',
        'Melihat rekapitulasi data statistik dan grafik performa SLA',
        'Melihat riwayat log audit aktivitas pengguna'
      ],
      boundaries: [
        'Akses bersifat pengawasan (read-only); tidak melakukan input entri perkara harian',
        'Tidak berwenang mengubah kesimpulan independen tim medis atau hukum'
      ],
      keyOutputs: [
        'Laporan Kinerja Bulanan & Tahunan TAT',
        'Evaluasi Kepatuhan SLA 6 Hari Kerja',
        'Laporan Audit Keamanan Sistem'
      ]
    },
    admin: {
      name: 'Administrator Sistem (IT)',
      agency: 'Pusat Informasi & Data BNN / Pengelola Infrastruktur TI Kepolisian',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: <ShieldCheck className="w-5 h-5 text-slate-600" />,
      overview:
        'Pengelola infrastruktur teknis sistem e-TAT, keamanan data, manajemen pengguna, dan penjaminan keberlanjutan layanan digital.',
      keyResponsibilities: [
        'Mengelola akun pengguna, autentikasi berbasis peran (Role-Based Access Control / RBAC), dan penonaktifan akun mutasi',
        'Mengonfigurasi parameter ambang batas zat sesuai pembaruan SEMA No. 04/2010 dan regulasi narkotika terkini',
        'Memelihara master data daftar instansi pemohon dan lembaga fasilitas rehabilitasi mitra',
        'Memantau keandalan server, integritas kunci verifikasi QR kriptografis, dan cadangan data berkala'
      ],
      accessRights: [
        'Manajemen pengguna dan penetapan peran instansi',
        'Pengaturan master data regulasi gramatur zat dan fasilitas',
        'Akses log sistem dan parameter konfigurasi keamanan'
      ],
      boundaries: [
        'Dilarang memanipulasi data perkara atau dokumen rekomendasi yang tersimpan',
        'Aktivitas administrator terekam pada immutable audit log'
      ],
      keyOutputs: [
        'Konfigurasi Hak Akses RBAC Akun Pengguna',
        'Master Data Parameter Ambang Batas Zat & Fasilitas',
        'Log Pemeliharaan & Audit Trail Keamanan'
      ]
    }
  };

  // Official Outputs of e-TAT
  const officialOutputs = [
    {
      id: 'out-1',
      title: 'Surat Rekomendasi Resmi TAT (Digital Signed)',
      category: 'Dokumen Hukum Utama',
      icon: <FileSignature className="w-6 h-6 text-purple-600" />,
      badge: 'Sah & Mengikat',
      description:
        'Dokumen resmi berkop surat BNN/Polri berformat standar nasional yang merangkum seluruh hasil telaah komprehensif medis dan hukum atas terperiksa.',
      components: [
        'Nomor Surat Rekomendasi Resmi Unik Nasional',
        'Identitas Lengkap Terperiksa & NIK Terverifikasi',
        'Uraian Singkat Perkara & Pasal yang Disangkakan',
        'Hasil Pemeriksaan Medis (Diagnosis ICD-10, Pola Adiksi, Rekomendasi Modalitas Rawat Inap/Jalan)',
        'Hasil Telaah Hukum (Analisis Peran Pengguna Murni, Kesesuaian Gramatur SEMA 04/2010)',
        'Keputusan Rekomendasi Terpadu Hasil Sidang Pleno',
        '3 Tanda Tangan Digital Resmi (Koordinator, Dokter Asesor Medis, Penelaah Hukum)'
      ],
      usage:
        'Dilampirkan dalam berkas penyidikan (P-21) untuk Kejaksaan dan Majelis Hakim sebagai dasar hukum penerapan Keadilan Restoratif (Restorative Justice) atau vonis rehabilitasi Pasal 103 UU Narkotika.'
    },
    {
      id: 'out-2',
      title: 'QR Code Kriptografis Verifikasi Keabsahan Dokumen',
      category: 'Keamanan & Autentikasi',
      icon: <QrCode className="w-6 h-6 text-blue-600" />,
      badge: 'Anti Pemalsuan',
      description:
        'Kode QR kriptografis dinamis yang dicetak pada setiap lembar rekomendasi resmi, memungkinkan verifikasi keaslian instan di pengadilan.',
      components: [
        'Payload hash kriptografis SHA-256 yang memvalidasi integritas konten dokumen',
        'Tautan ke portal verifikasi publik resmi e-TAT',
        'Menampilkan data identitas terperiksa, tanggal terbit, dan status keabsahan secara real-time',
        'Mencegah manipulasi draf atau penggunaan dokumen palsu'
      ],
      usage:
        'Dapat dipindai kapan saja menggunakan kamera ponsel oleh Hakim, Jaksa Penuntut Umum, atau Penasihat Hukum di ruang sidang.'
    },
    {
      id: 'out-3',
      title: 'Lembar Catatan Klinis & Skoring Skrining ASSIST',
      category: 'Instrumen Medis',
      icon: <Stethoscope className="w-6 h-6 text-emerald-600" />,
      badge: 'Standar WHO',
      description:
        'Rekam kerja klinis dokter pemeriksa yang memuat rincian hasil wawancara terstruktur dan diagnosis tingkat ketergantungan narkotika.',
      components: [
        'Skor Keterlibatan Zat per kategori zat (Tembakau, Alkohol, Kanabis, Kokain, Amfetamin/ATS, Sedatif, Opioid, Inhalansia, dll.)',
        'Klasifikasi Risiko: Rendah (Intervensi Ringan), Sedang (Intervensi Singkat), Berat (Rehabilitasi Intensif)',
        'Hasil Laboratorium Urin Toksikologi (Rapid 7-Parameter & Konfirmasi Lab)',
        'Diagnosis Kode ICD-10 (contoh: F15.2 Ketergantungan Amfetamin Aktif)',
        'Evaluasi Komorbiditas Psikiatri & Status Kesehatan Fisik'
      ],
      usage:
        'Dokumen rekam medis rahasia yang menjadi dasar ilmiah penentuan kebutuhan intervensi terapi terperiksa.'
    },
    {
      id: 'out-4',
      title: 'Lembar Telaah Yuridis & Pengujian Batas Gramatur',
      category: 'Instrumen Hukum',
      icon: <Scale className="w-6 h-6 text-amber-600" />,
      badge: 'SEMA 04/2010',
      description:
        'Hasil evaluasi penelaah hukum yang menganalisis kedudukan tersangka dan membandingkan bukti dengan ambang batas pemakaian satu hari.',
      components: [
        'Analisis Peran: Pemakai / Penyalahguna Murni vs Pengedar / Sindikat',
        'Tabel Komparasi Gramatur Barang Bukti (Berat Bersih vs Batas Maksimal Pemakaian Sehari SEMA 04/2010)',
        'Pemeriksaan Rekam Jejak Residivis Narkotika',
        'Analisis Hubungan Tersangka dengan Jaringan Gelap Narkotika',
        'Simpulan Yuridis Kelayakan Penanganan Rehabilitatif'
      ],
      usage:
        'Memberikan kepastian hukum kepada penyidik dan jaksa bahwa tersangka memenuhi syarat yuridis untuk direhabilitasi.'
    },
    {
      id: 'out-5',
      title: 'Risalah Berita Acara Sidang Pleno Musyawarah TAT',
      category: 'Akuntabilitas Pleno',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      badge: 'Konsensus Mufakat',
      description:
        'Catatan resmi jalannya sidang pleno tertutup antara Tim Medis, Tim Hukum, dan Penyidik Pengaju yang dipimpin Koordinator TAT.',
      components: [
        'Daftar Hadir Resmi Seluruh Anggota Sidang Pleno',
        'Paparan Temuan Asesmen Medis & Paparan Telaah Hukum',
        'Catatan Dinamika Diskusi & Pertimbangan Khusus',
        'Konsensus Mufakat yang Disepakati Bersama',
        'Penetapan Rekomendasi Lokasi dan Durasi Rehabilitasi'
      ],
      usage:
        'Bukti transparansi dan akuntabilitas proses musyawarah yang dapat dipertanggungjawabkan dalam pengawasan etik dan hukum.'
    },
    {
      id: 'out-6',
      title: 'Tiket Rujukan Digital & Tanda Terima Admisi Fasilitas',
      category: 'Rujukan & Tindak Lanjut',
      icon: <Share2 className="w-6 h-6 text-teal-600" />,
      badge: 'Layanan Berkelanjutan',
      description:
        'Surat pengantar terintegrasi yang menghubungkan tersangka dengan fasilitas rehabilitasi medis atau sosial mitra pemerintah.',
      components: [
        'Nama & Kontak Narahubung Lembaga Rehabilitasi Rujukan Resmi',
        'Konfirmasi Ketersediaan Kuota Kamar & Kapasitas Tempat Tidur',
        'Resume Medis Ringkas Kebutuhan Terapi Khusus',
        'Catatan Jadwal & Tanda Terima Penerimaan Terperiksa Masuk Admisi',
        'Monitoring Kepatuhan Program Rehabilitasi Klien'
      ],
      usage:
        'Mencegah terjadinya "rujukan gantung" (rekomendasi terbit namun tersangka tidak pernah direhabilitasi karena ketiadaan kuota fasilitas).'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>e-TAT Platform v1.2</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>Standar SLA 6 Hari Kerja</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span>Kolaborasi Lintas Instansi</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Tentang Sistem e-TAT & Panduan Operasional
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sistem Pengelolaan Layanan Tim Asesmen Terpadu (e-TAT) adalah platform digital terintegrasi 
              untuk memfasilitasi koordinasi cepat, akuntabel, dan transparan antara Penyidik Polri/BNN, 
              Tim Asesor Medis, Tim Asesor Hukum, Kejaksaan, dan Fasilitas Rehabilitasi dalam menentukan 
              rekomendasi penanganan pecandu dan korban penyalahgunaan narkotika.
            </p>
          </div>

          <div className="shrink-0 flex md:flex-col items-start md:items-end gap-2 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-left md:text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Peran Aktif Anda</span>
              <span className="font-bold text-slate-900 block mt-0.5 capitalize">{currentUser.name}</span>
              <span className="text-blue-700 font-semibold block text-[11px]">{rolesDetails[currentUser.role]?.name}</span>
            </div>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <span className="text-2xl font-bold text-blue-700 block">7</span>
            <span className="text-xs font-semibold text-slate-700">Tahap Alur Layanan</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">End-to-End Workflow</span>
          </div>
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <span className="text-2xl font-bold text-emerald-700 block">8</span>
            <span className="text-xs font-semibold text-slate-700">Peran Pengguna</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Hak Akses Tersegregasi</span>
          </div>
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <span className="text-2xl font-bold text-purple-700 block">6</span>
            <span className="text-xs font-semibold text-slate-700">Output Resmi</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Dokumen & QR Valid</span>
          </div>
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <span className="text-2xl font-bold text-amber-700 block">6 Hari</span>
            <span className="text-xs font-semibold text-slate-700">Batas Waktu SLA</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Kepatuhan Berkas Perkara</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for About Page */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto scrollbar-none">
        <button
          id="tab-about-roadmap"
          onClick={() => setActiveSection('roadmap')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            activeSection === 'roadmap'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Roadmap Alur Layanan (Flow)</span>
        </button>

        <button
          id="tab-about-roles"
          onClick={() => setActiveSection('roles')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            activeSection === 'roles'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>8 Peran Pengguna & Tanggung Jawab</span>
        </button>

        <button
          id="tab-about-outputs"
          onClick={() => setActiveSection('outputs')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            activeSection === 'outputs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Daftar Output & Dokumen Resmi</span>
        </button>

        <button
          id="tab-about-regulasi"
          onClick={() => setActiveSection('regulasi')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            activeSection === 'regulasi'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Dasar Hukum & Batasan Sistem</span>
        </button>
      </div>

      {/* SECTION 1: ROADMAP & ALUR ALIR LAYANAN (FLOW) */}
      {activeSection === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <GitCommit className="w-5 h-5 text-blue-600" />
                  <span>Roadmap Alur End-to-End Layanan e-TAT</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dari pengajuan perkara oleh penyidik hingga realisasi admisi rehabilitasi dan pemenuhan berkas peradilan (SLA 6 Hari Kerja).
                </p>
              </div>
              <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200 self-start">
                Pilih Tahap untuk Rincian
              </span>
            </div>

            {/* Stepper Navigator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 pb-4">
              {workflowStages.map((stage) => {
                const isSelected = selectedStage === stage.step;
                return (
                  <button
                    key={stage.step}
                    id={`btn-step-${stage.step}`}
                    onClick={() => setSelectedStage(stage.step)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {stage.step}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        H-{stage.step}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold block mt-2 line-clamp-2 leading-snug ${
                        isSelected ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      {stage.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1 truncate">
                      {stage.actor.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Stage Detail Card */}
            {(() => {
              const current = workflowStages.find((s) => s.step === selectedStage) || workflowStages[0];
              return (
                <div className="mt-4 bg-slate-50/70 border border-slate-200/90 rounded-xl p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">
                          Tahap {current.step} dari 7
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{current.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{current.summary}</p>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 block">
                        ⏱️ {current.timeframe}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Aktor: <strong className="text-slate-700">{current.actor}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Input Dokumen */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800 pb-1 border-b border-slate-100">
                        <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                        <span>Dokumen Input & Persyaratan</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-600">
                        {current.inputs.map((inp, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Aksi yang Dilakukan */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800 pb-1 border-b border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Aktivitas & Langkah Utama</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-600">
                        {current.actions.map((act, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Output & Status */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800 pb-1 border-b border-slate-100">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span>Hasil Output & Perubahan Status</span>
                      </div>
                      <div className="space-y-2 text-slate-600">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Artefak Output:</span>
                          <span className="font-semibold text-slate-900 block mt-0.5">{current.output}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Perpindahan Status:</span>
                          <span className="font-mono text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                            {current.statusResult}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Between Steps */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <button
                      disabled={selectedStage === 1}
                      onClick={() => setSelectedStage((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    >
                      ← Tahap Sebelumnya
                    </button>
                    <span className="text-slate-400 text-[11px]">Gunakan tombol untuk mempelajari urutan alur</span>
                    <button
                      disabled={selectedStage === 7}
                      onClick={() => setSelectedStage((prev) => Math.min(7, prev + 1))}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 cursor-pointer"
                    >
                      Tahap Selanjutnya →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4 Status Tiers Architecture Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Arsitektur 4 Kelompok Status Terpisah (Multi-Tier Status Model)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Sistem e-TAT tidak menggunakan status tunggal yang rancu, melainkan memisahkan proses menjadi 4 dimensi status independen:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">1. Status Proses Utama</span>
                <p className="text-slate-600 text-[11px]">
                  Mengendalikan tahapan berkas dari <em>diajukan</em>, <em>verifikasi_berkas</em>, <em>penugasan_jadwal</em>, <em>asesmen_berlangsung</em>, <em>siap_pleno</em>, hingga <em>rekomendasi_terbit</em>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">2. Status Medis & Hukum</span>
                <p className="text-slate-600 text-[11px]">
                  Melacak kemajuan independen pemeriksaan medis (urin, wawancara ASSIST) dan telaah hukum (analisis peran, gramatur SEMA) tanpa saling memblokir.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">3. Status Dokumen Rekomendasi</span>
                <p className="text-slate-600 text-[11px]">
                  Status keabsahan fisik & digital dokumen rekomendasi (<em>draf</em>, <em>menunggu_pengesahan</em>, hingga <em>resmi_terbit</em> dan ber-QR code).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">4. Status Tindak Lanjut Rujukan</span>
                <p className="text-slate-600 text-[11px]">
                  Memantau eksekusi pasca terbit rekomendasi: apakah klien sudah diterima admisi di balai rehabilitasi atau mengalami kendala kuota fasilitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 8 PERAN PENGGUNA (ROLES) */}
      {activeSection === 'roles' && (
        <div className="space-y-6">
          {/* Role Selection Grid */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-1">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Matriks 8 Peran Pengguna Lintas Instansi</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Setiap peran memiliki wewenang, antarmuka kerja, dan batasan akses data yang berbeda untuk menjamin independensi dan integritas hukum.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(rolesDetails) as UserRole[]).map((rKey) => {
                const r = rolesDetails[rKey];
                const isSelected = selectedRoleDetail === rKey;
                const isCurrent = currentUser.role === rKey;
                return (
                  <button
                    key={rKey}
                    id={`btn-role-tab-${rKey}`}
                    onClick={() => setSelectedRoleDetail(rKey)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                        {r.icon}
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Role Anda
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-900 block truncate">{r.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{r.agency.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Detailed Profile Card */}
            {(() => {
              const r = rolesDetails[selectedRoleDetail];
              return (
                <div className="mt-5 bg-slate-50/80 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        {r.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900">{r.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${r.badgeColor}`}>
                            {selectedRoleDetail}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{r.agency}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-3">
                    {r.overview}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Tugas & Tanggung Jawab Utama */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs pb-1 border-b border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Tugas Pokok & Wewenang Kerja</span>
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {r.keyResponsibilities.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Batasan & Larangan (Guardrails) */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs pb-1 border-b border-slate-100">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Batasan Kewenangan & Etika Kerahasiaan</span>
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {r.boundaries.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cakupan Akses Modul */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs pb-1 border-b border-slate-100">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Hak Akses Menu & Data</span>
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {r.accessRights.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Output yang Dihasilkan */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs pb-1 border-b border-slate-100">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span>Output & Dokumen yang Diproduksi</span>
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {r.keyOutputs.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECTION 3: DAFTAR OUTPUT & DOKUMEN RESMI */}
      {activeSection === 'outputs' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-1">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Daftar Output Resmi yang Diproduksi Sistem e-TAT</span>
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Setiap tahapan layanan menghasilkan artefak resmi berlandaskan hukum yang sah dan memiliki nilai pembuktian otentik di persidangan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officialOutputs.map((out) => (
                <div
                  key={out.id}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          {out.icon}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            {out.category}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">{out.title}</h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                        {out.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {out.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Komponen Utama:</span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {out.components.map((c, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-blue-500 font-bold">•</span>
                            <span className="text-[11px]">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-xs bg-white/70 rounded-lg p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Kegunaan Hukum:</span>
                    <p className="text-[11px] text-slate-700 mt-0.5">{out.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: DASAR HUKUM & BATASAN SISTEM */}
      {activeSection === 'regulasi' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Landasan Hukum & Regulasi Pelayanan Tim Asesmen Terpadu</span>
            </h2>
            <p className="text-xs text-slate-500">
              Sistem e-TAT dirancang secara ketat mengacu pada kerangka hukum penanganan tindak pidana narkotika di Republik Indonesia:
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    1. Undang-Undang Nomor 35 Tahun 2009 tentang Narkotika
                  </span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    UU Utama
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Pasal 54 mengamanatkan bahwa pecandu narkotika dan korban penyalahgunaan narkotika wajib menjalani rehabilitasi medis dan rehabilitasi sosial. Pasal 103 memberikan kewenangan kepada Hakim untuk menjatuhkan vonis rehabilitasi baik terbukti bersalah maupun tidak bersalah.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    2. Surat Edaran Mahkamah Agung (SEMA) No. 04 Tahun 2010
                  </span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    Yurisprudensi MA
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Menetapkan ambang batas maksimal barang bukti pemakaian 1 (satu) hari bagi penyalahguna untuk dapat ditempatkan dalam lembaga rehabilitasi (misal: Sabu/Metamfetamina maksimal 1 gram, Ganja maksimal 5 gram, Ekstasi/MDMA maksimal 8 butir / 2.4 gram).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    3. Peraturan Bersama 7 Lembaga Negara Tahun 2014
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Peraturan Bersama
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Ditandatangani oleh Ketua Mahkamah Agung, Menkumham, Menkes, Mensos, Jaksa Agung, Kapolri, dan Kepala BNN tentang Penanganan Pecandu Narkotika dan Korban Penyalahgunaan Narkotika ke dalam Lembaga Rehabilitasi melalui pembentukan Tim Asesmen Terpadu (TAT).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    4. Peraturan BNN Nomor 11 Tahun 2021
                  </span>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    SOP Teknis BNN
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Mengatur tata kerja operasional Tim Asesmen Terpadu, prosedur pendaftaran permohonan 1x24 jam, pemisahan tim medis dan tim hukum, mekanisme sidang pleno mufakat, dan batasan waktu penyelesaian berkas rekomendasi maksimal 6 (enam) hari kerja.
                </p>
              </div>
            </div>

            {/* SLA Table Summary */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Rincian Standar Waktu Layanan (SLA 6 Hari Kerja)</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Tahapan Layanan</th>
                      <th className="p-2.5">Penanggung Jawab</th>
                      <th className="p-2.5">Maksimal Waktu</th>
                      <th className="p-2.5">Keluaran (Output)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">1. Registrasi Permohonan</td>
                      <td className="p-2.5 text-slate-600">Penyidik Pengaju</td>
                      <td className="p-2.5 text-blue-700 font-semibold">1x24 Jam pasca tangkap</td>
                      <td className="p-2.5 text-slate-600">Berkas perkara terdaftar</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">2. Verifikasi Berkas Persyaratan</td>
                      <td className="p-2.5 text-slate-600">Sekretariat TAT</td>
                      <td className="p-2.5 text-blue-700 font-semibold">Hari ke-1 s/d Hari ke-2</td>
                      <td className="p-2.5 text-slate-600">Disposisi kelengkapan formil</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">3. Penugasan & Penjadwalan</td>
                      <td className="p-2.5 text-slate-600">Sekretariat & Koordinator</td>
                      <td className="p-2.5 text-blue-700 font-semibold">Hari ke-2</td>
                      <td className="p-2.5 text-slate-600">Surat tugas & jadwal asesmen</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">4. Asesmen Medis & Telaah Hukum</td>
                      <td className="p-2.5 text-slate-600">Tim Medis & Tim Hukum</td>
                      <td className="p-2.5 text-blue-700 font-semibold">Hari ke-2 s/d Hari ke-4</td>
                      <td className="p-2.5 text-slate-600">Catatan klinis & analisis peran</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">5. Sidang Pleno Musyawarah</td>
                      <td className="p-2.5 text-slate-600">Koordinator TAT & Tim</td>
                      <td className="p-2.5 text-blue-700 font-semibold">Hari ke-4 s/d Hari ke-5</td>
                      <td className="p-2.5 text-slate-600">Risalah kesepakatan pleno</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">6. Pengesahan 3 Pihak & QR Code</td>
                      <td className="p-2.5 text-slate-600">Koordinator, Medis, Hukum</td>
                      <td className="p-2.5 text-blue-700 font-semibold">Hari ke-5 s/d Hari ke-6</td>
                      <td className="p-2.5 text-emerald-700 font-bold">Surat Rekomendasi Resmi</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
