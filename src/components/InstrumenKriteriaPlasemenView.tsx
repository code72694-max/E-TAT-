import React, { useState, useMemo } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
  InstrumenKriteriaPlasemen,
  PenilaianDimensiASAM,
  LevelLayananRehabilitasi,
  DimensiASAM,
  LABEL_LEVEL_LAYANAN,
} from '../types';
import {
  ClipboardList,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Brain,
  Heart,
  Flame,
  RefreshCw,
  Home,
  Award,
  Info,
  Edit3,
  Save,
  Eye,
  FileCheck,
  BarChart2,
  AlertOctagon,
} from 'lucide-react';

interface Props {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
}

type IndikatorMatrix = {
  [K in DimensiASAM]: {
    label: string;
    icon: React.ReactNode;
    deskripsiDimensi: string;
    keterangan: Record<LevelLayananRehabilitasi, string>;
    indikator: Record<LevelLayananRehabilitasi, string[]>;
  };
};

const DIMENSI_CONFIG: IndikatorMatrix = {
  intoksikasi: {
    label: 'D1 · Intoksikasi Akut & Potensi Putus Zat',
    icon: <Activity className="w-4 h-4" />,
    deskripsiDimensi: 'Menilai kondisi intoksikasi saat ini dan risiko sindrom putus zat yang membutuhkan pengawasan medis.',
    keterangan: {
      0: 'Tidak ada tanda intoksikasi atau putus zat',
      1: 'Withdrawal Management (WM) / Manajemen putus zat gejala ringan atau yang terkontrol',
      2: 'Prioritaskan untuk dihubungkan kepada layanan medis Manajemen Putus Zat (WM)',
      3: 'Segera, kebutuhan Manajemen Putus Zat (WM) yang berat dan risiko tinggi sangat membutuhkan dukungan 24 jam/hari',
      4: 'UGD terdekat — Situasi darurat medis yang mengancam jiwa',
    },
    indikator: {
      0: ['Tidak terdapat tanda intoksikasi atau putus zat'],
      1: [
        'Intoksikasi ringan atau sedang',
        'Mengganggu fungsi keseharian',
        'Risiko minimal akan putus zat berat',
        'Tidak membahayakan diri/orang lain',
      ],
      2: [
        'Mungkin mengalami intoksikasi berat tetapi merespons terhadap dukungan',
        'Risiko sedang mengalami putus zat berat',
        'Tidak membahayakan diri / orang lain',
      ],
      3: [
        'Intoksikasi berat dengan risiko membahayakan diri/orang lain',
        'Kesulitan mengatasi kondisi tersebut',
        'Risiko signifikan mengalami putus zat berat',
      ],
      4: [
        'Incapacitated (tidak berdaya)',
        'Tanda dan gejala yang berat',
        'Adanya tanda bahaya misal kejang',
        'Penggunaan zat tetap berlanjut walaupun mengancam nyawa',
      ],
    },
  },
  komplikasi_medis: {
    label: 'D2 · Komplikasi dan Kondisi Medis',
    icon: <Heart className="w-4 h-4" />,
    deskripsiDimensi: 'Menilai kondisi fisik/medis klien yang memengaruhi atau dipengaruhi oleh penggunaan zat dan rencana rehabilitasi.',
    keterangan: {
      0: 'Berfungsi penuh atau tidak ada rasa nyeri atau ketidaknyamanan berlebih',
      1: 'Tindak lanjut berkala, layanan intensitas rendah untuk kondisi yang terkontrol',
      2: 'Prioritas tindak lanjut dan evaluasi untuk kondisi baru atau tidak terkontrol',
      3: 'Membutuhkan evaluasi dan terapi termasuk pengawasan medis yang terhubung dengan perawatan 24 jam sampai kondisi stabil',
      4: 'Membutuhkan evaluasi dan terapi dengan pengawasan medis perawatan 24 jam penuh sampai kondisi stabil',
    },
    indikator: {
      0: ['Berfungsi penuh atau tidak ada rasa nyeri atau ketidaknyamanan berlebih'],
      1: [
        'Gejala ringan yang mempengaruhi fungsi sehari-hari secara minimal',
        'Mampu mengatasi ketidaknyamanan fisik',
      ],
      2: [
        'Masalah medis akut atau kronis yang mengancam nyawa tetapi dapat ditangani',
        'Membutuhkan perawatan baru atau berbeda',
        'Masalah kesehatan cukup berdampak pada aktivitas sehari-hari (ADL) dan kemandirian hidup',
        'Dukungan yang memadai untuk mengatasi masalah medis di rumah dengan intervensi medis',
      ],
      3: [
        'Kontrol buruk terhadap masalah medis yang memerlukan evaluasi',
        'Kemampuan buruk untuk mengatasi masalah medis',
        'Dukungan tidak memadai untuk mengelola masalah medis secara mandiri',
        'Kesulitan dengan aktivitas sehari-hari dan/atau hidup mandiri',
      ],
      4: [
        'Kondisi tidak stabil dengan masalah medis yang parah',
        'Nyeri dada yang muncul tiba-tiba',
        'Delirium tremens (DTs)',
        'Kehamilan yang tidak stabil',
        'Muntah darah merah terang',
        'Kejang putus zat dalam 24 jam terakhir',
        'Kejang berulang',
      ],
    },
  },
  kondisi_psikologis: {
    label: 'D3 · Komplikasi Emosional, Perilaku & Kognitif',
    icon: <Brain className="w-4 h-4" />,
    deskripsiDimensi: 'Menilai kondisi kesehatan jiwa, perilaku berbahaya, dan fungsi kognitif yang memengaruhi pemulihan.',
    keterangan: {
      0: 'Tidak ada gejala berbahaya, fungsi sosial baik, tidak ada gejala yang mengganggu pemulihan',
      1: 'Asesmen lanjutan dan rujukan atau tindak lanjut ke fasilitas layanan kesehatan jiwa (MH: Mental Health)',
      2: 'Prioritas tindak lanjut dan evaluasi untuk kondisi baru atau tidak terkontrol ke fasilitas layanan kesehatan jiwa',
      3: 'Asesmen dan terapi segera untuk gejala dan tanda yang tidak stabil',
      4: 'Asesmen segera pada UGD terdekat',
    },
    indikator: {
      0: [
        'Tidak ada gejala berbahaya',
        'Fungsi sosial baik',
        'Perawatan diri baik',
        'Tidak ada gejala yang mengganggu pemulihan',
      ],
      1: [
        'Kemungkinan diagnosis dari kondisi emosional, perilaku, kognitif',
        'Membutuhkan pengawasan terhadap kondisi kesehatan mental yang stabil',
        'Gejala-gejala tidak mengganggu pemulihan',
        'Memiliki hendaya dalam hubungan sosial',
      ],
      2: [
        'Gejala-gejala mengganggu pemulihan',
        'Membutuhkan terapi dan manajemen kondisi kesehatan mental',
        'Tidak ada ancaman langsung terhadap diri sendiri / orang lain',
        'Gejala-gejala tidak menghambat fungsi kemandirian',
      ],
      3: [
        'Ketidakmampuan untuk merawat diri di rumah',
        'Mungkin termasuk dorongan berbahaya untuk melukai diri / orang lain',
        'Membutuhkan dukungan 24 jam',
        'Berisiko menjadi level 4 / sangat berat apabila tanpa terapi',
      ],
      4: [
        'Gejala-gejala yang mengancam nyawa termasuk ide bunuh diri',
        'Psikosis',
        'Bahaya yang akan segera terjadi pada diri sendiri / orang lain',
      ],
    },
  },
  kesiapan_berubah: {
    label: 'D4 · Kesiapan Berubah (Motivasi)',
    icon: <Flame className="w-4 h-4" />,
    deskripsiDimensi: 'Menilai kesiapan dan motivasi klien untuk berubah serta keterlibatannya dalam terapi.',
    keterangan: {
      0: 'Membutuhkan layanan intensitas rendah untuk peningkatan motivasi',
      1: 'Membutuhkan layanan intensitas rendah untuk peningkatan motivasi',
      2: 'Membutuhkan layanan intensitas sedang untuk peningkatan motivasi',
      3: 'Membutuhkan layanan intensitas tinggi untuk peningkatan motivasi. Untuk mencegah penurunan fungsi / keselamatan',
      4: 'Menempatkan pada tempat yang aman untuk situasi akut yang berbahaya dan atau dibutuhkan observasi ketat',
    },
    indikator: {
      0: [
        'Tanggung jawab proaktif klien dalam terapi',
        'Komitmen untuk merubah penggunaan alkohol atau narkoba lain',
      ],
      1: [
        'Bersedia untuk menjalani terapi',
        'Ambivalen terhadap kebutuhan untuk berubah',
      ],
      2: [
        'Enggan menjalani terapi',
        'Komitmen rendah untuk mengubah penggunaan alkohol atau narkoba lain',
        'Ambivalensi terhadap terapi berubah-ubah',
      ],
      3: [
        'Tidak menyadari dan tidak tertarik pada kebutuhan untuk berubah',
        'Tidak mau / hanya mampu menyelesaikan sebagian dari terapi',
        'Kepatuhan Pasif, atau sekedar menjalani terapi',
      ],
      4: [
        'Menolak kebutuhan untuk berubah',
        'Terlibat dalam perilaku yang berpotensi berbahaya',
        'Tidak mau / tidak dapat mengikuti rekomendasi terapi',
      ],
    },
  },
  potensi_kekambuhan: {
    label: 'D5 · Potensi Kekambuhan & Penggunaan Berlanjut',
    icon: <RefreshCw className="w-4 h-4" />,
    deskripsiDimensi: 'Menilai kemampuan koping klien dalam mencegah kekambuhan dan risiko penggunaan zat berlanjut.',
    keterangan: {
      0: 'Dibutuhkan layanan pencegahan kekambuhan intensitas rendah atau kelompok bantu diri',
      1: 'Dibutuhkan layanan pencegahan kekambuhan intensitas rendah atau kelompok bantu diri',
      2: 'Dibutuhkan edukasi dan layanan pencegahan kekambuhan. Kebutuhan yang mungkin: Manajemen kasus yang intensif; Manajemen farmakoterapi; Terapi komunitas asertif (ACT)',
      3: 'Layanan pencegahan kekambuhan termasuk: pelatihan keterampilan coping terstruktur; Strategi memotivasi; Pengelolaan kasus dan layanan komunitas secara asertif. Mungkin dibutuhkan lingkungan tempat tinggal yang terstruktur',
      4: 'Dibutuhkan semua layanan pada level 3 "berat". Untuk kasus-kasus akut diperlukan pengaturan lingkungan secara klinis selama 24 jam',
    },
    indikator: {
      0: ['Rendah / tidak ada potensi untuk kambuh'],
      1: [
        'Risiko minimal untuk penggunaan',
        'Keterampilan koping dan pencegahan kekambuhan yang memadai',
      ],
      2: [
        'Memiliki atau menggunakan keterampilan koping secara tidak konsisten',
        'Mampu mengelola diri tanpa diminta',
      ],
      3: [
        'Kurang mengenali risiko penggunaan alkohol atau narkoba lain',
        'Keterampilan yang buruk untuk mengatasi kekambuhan',
      ],
      4: [
        'Tidak memiliki keterampilan mengatasi masalah kekambuhan/adiksi',
        'Penggunaan zat / perilaku membahayakan diri / orang lain dalam waktu dekat',
      ],
    },
  },
  lingkungan_pemulihan: {
    label: 'D6 · Lingkungan Tempat Tinggal & Pemulihan',
    icon: <Home className="w-4 h-4" />,
    deskripsiDimensi: 'Menilai kualitas lingkungan tempat tinggal klien dan dampaknya terhadap proses pemulihan.',
    keterangan: {
      0: 'Mungkin membutuhkan pendampingan dalam menemukan lingkungan yang mendukung melalui pelatihan keterampilan, perawatan anak, dan transportasi',
      1: 'Mungkin membutuhkan pendampingan dalam menemukan lingkungan yang mendukung melalui pelatihan keterampilan, perawatan anak, dan transportasi',
      2: 'Mungkin membutuhkan pendampingan sama seperti "level 1": manajemen perawatan asertif',
      3: 'Membutuhkan pendampingan yang lebih intens dalam menemukan lingkungan tempat tinggal yang mendukung dan pelatihan keterampilan (coping dan kontrol impulse)',
      4: 'Klien butuh dipisahkan segera dari lingkungan yang berpengaruh buruk. Membutuhkan perubahan tempat tinggal/lingkungan segera',
    },
    indikator: {
      0: [
        'Mampu mengatasi dalam lingkungan/suportif',
        'Tidak ada lingkungan yang berisiko serius',
      ],
      1: [
        'Dukungan sosial pasif / tidak tertarik, tetapi masih mampu mengatasinya',
        'Tidak ada lingkungan yang berisiko serius',
      ],
      2: [
        'Lingkungan yang tidak mendukung, tetapi sebagian besar waktu mampu mengatasi dalam masyarakat dengan struktur klinis',
      ],
      3: [
        'Lingkungan yang tidak mendukung, kesulitan mengatasi bahkan dengan struktur klinis',
      ],
      4: [
        'Lingkungan merugikan / berpengaruh buruk terhadap pemulihan',
        'Tidak dapat mengatasi dan lingkungan dapat menimbulkan ancaman bagi keselamatan',
      ],
    },
  },
};

const LEVEL_COLORS: Record<LevelLayananRehabilitasi, { bg: string; border: string; text: string; badge: string }> = {
  0: { bg: 'bg-slate-900/60', border: 'border-slate-600/40', text: 'text-slate-300', badge: 'bg-slate-800 text-slate-300 border-slate-600/60' },
  1: { bg: 'bg-emerald-950/50', border: 'border-emerald-600/40', text: 'text-emerald-300', badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/60' },
  2: { bg: 'bg-blue-950/50', border: 'border-blue-600/40', text: 'text-blue-300', badge: 'bg-blue-950 text-blue-300 border-blue-500/60' },
  3: { bg: 'bg-amber-950/50', border: 'border-amber-600/40', text: 'text-amber-300', badge: 'bg-amber-950 text-[#D4AF37] border-amber-500/60' },
  4: { bg: 'bg-rose-950/50', border: 'border-rose-600/40', text: 'text-rose-300', badge: 'bg-rose-950 text-rose-300 border-rose-500/60' },
};

const ALL_DIMENSI: DimensiASAM[] = [
  'intoksikasi',
  'komplikasi_medis',
  'kondisi_psikologis',
  'kesiapan_berubah',
  'potensi_kekambuhan',
  'lingkungan_pemulihan',
];

function hitungRekomendasiOtomatis(penilaian: PenilaianDimensiASAM[]): LevelLayananRehabilitasi {
  if (penilaian.length === 0) return 0;
  const maxLevel = Math.max(...penilaian.map(p => p.levelDipilih)) as LevelLayananRehabilitasi;
  return maxLevel;
}

export const InstrumenKriteriaPlasemenView: React.FC<Props> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan,
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [expandedDimensi, setExpandedDimensi] = useState<DimensiASAM | null>('intoksikasi');

  const [formPenilaian, setFormPenilaian] = useState<PenilaianDimensiASAM[]>(() => {
    if (permohonan.instrumenKriteriaPlasemen?.penilaianPerDimensi) {
      return permohonan.instrumenKriteriaPlasemen.penilaianPerDimensi;
    }
    return ALL_DIMENSI.map(d => ({
      dimensi: d,
      levelDipilih: 0 as LevelLayananRehabilitasi,
      catatanKlinis: '',
      indikatorTerpilih: [],
    }));
  });

  const [wawancaraTambahan, setWawancaraTambahan] = useState(
    permohonan.instrumenKriteriaPlasemen?.wawancaraTambahanDilakukan ?? false
  );
  const [catatanWawancara, setCatatanWawancara] = useState(
    permohonan.instrumenKriteriaPlasemen?.catatanWawancara ?? ''
  );
  const [justifikasi, setJustifikasi] = useState(
    permohonan.instrumenKriteriaPlasemen?.hasil.justifikasiRekomendasi ?? ''
  );
  const [catatanDisparitas, setCatatanDisparitas] = useState(
    permohonan.instrumenKriteriaPlasemen?.hasil.catatanDisparitas ?? ''
  );

  const canEdit =
    currentUser.role === 'medis' ||
    currentUser.role === 'rehabilitasi' ||
    currentUser.role === 'sekretariat' ||
    currentUser.role === 'koordinator';

  const rekomendasiOtomatis = useMemo(() => hitungRekomendasiOtomatis(formPenilaian), [formPenilaian]);

  const adaDisparitas = useMemo(() => {
    const levels = formPenilaian.map(p => p.levelDipilih);
    return Math.max(...levels) - Math.min(...levels) >= 2;
  }, [formPenilaian]);

  const toggleIndikator = (dimensi: DimensiASAM, indikator: string) => {
    setFormPenilaian(prev =>
      prev.map(p => {
        if (p.dimensi !== dimensi) return p;
        const sudahAda = p.indikatorTerpilih.includes(indikator);
        return {
          ...p,
          indikatorTerpilih: sudahAda
            ? p.indikatorTerpilih.filter(i => i !== indikator)
            : [...p.indikatorTerpilih, indikator],
        };
      })
    );
  };

  const setLevelDimensi = (dimensi: DimensiASAM, level: LevelLayananRehabilitasi) => {
    setFormPenilaian(prev =>
      prev.map(p => p.dimensi === dimensi ? { ...p, levelDipilih: level, indikatorTerpilih: [] } : p)
    );
  };

  const setCatatanKlinis = (dimensi: DimensiASAM, catatan: string) => {
    setFormPenilaian(prev =>
      prev.map(p => p.dimensi === dimensi ? { ...p, catatanKlinis: catatan } : p)
    );
  };

  const handleSimpan = (statusFinal: 'draf' | 'lengkap') => {
    const instrumen: InstrumenKriteriaPlasemen = {
      id: permohonan.instrumenKriteriaPlasemen?.id || 'ikp-' + Date.now(),
      tanggalPengisian: new Date().toLocaleDateString('id-ID'),
      petugasNama: currentUser.name,
      petugasInstansi: currentUser.agency,
      wawancaraTambahanDilakukan: wawancaraTambahan,
      catatanWawancara: catatanWawancara || undefined,
      penilaianPerDimensi: formPenilaian,
      hasil: {
        levelRekomendasiAkhir: rekomendasiOtomatis,
        justifikasiRekomendasi:
          justifikasi ||
          `Berdasarkan penilaian 6 dimensi ASAM, klien memerlukan layanan ${LABEL_LEVEL_LAYANAN[rekomendasiOtomatis]}.`,
        adaDisparitasDimensi: adaDisparitas,
        catatanDisparitas: adaDisparitas ? catatanDisparitas : undefined,
      },
      statusPengisian: statusFinal,
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      instrumenKriteriaPlasemen: instrumen,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp:
            new Date().toLocaleDateString('id-ID') +
            ' ' +
            new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: statusFinal === 'lengkap'
            ? 'Finalisasi Instrumen Kriteria Penempatan Klien (ASAM)'
            : 'Simpan Draf Instrumen Kriteria Penempatan Klien (ASAM)',
          rincian: `Rekomendasi Level ${rekomendasiOtomatis}: ${LABEL_LEVEL_LAYANAN[rekomendasiOtomatis]}`,
        },
        ...(Array.isArray(permohonan.auditLogs) ? permohonan.auditLogs : []),
      ],
    };
    onUpdatePermohonan(updated);
    setMode('view');
  };

  const ikp = permohonan.instrumenKriteriaPlasemen;
  const displayPenilaian = mode === 'edit' ? formPenilaian : (ikp?.penilaianPerDimensi ?? formPenilaian);

  // ─── STATE: Belum diisi, view mode ─────────────────────────────────────────
  if (!ikp && mode === 'view') {
    return (
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-[#081224] text-[#D4AF37] border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-base font-bold text-white">
            Instrumen Kriteria Penempatan Klien Belum Diisi
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Instrumen ini merupakan adaptasi <strong className="text-slate-300">ASAM Placement Criteria 3<sup>rd</sup> Edition</strong>{' '}
            untuk menentukan rekomendasi tingkat layanan rehabilitasi yang paling sesuai dengan kondisi klien berdasarkan
            6 dimensi penilaian klinis.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setMode('edit')}
            className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center space-x-2 border border-[#2d7ad6]/70 shadow-lg cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 text-[#D4AF37]" />
            <span>Isi Instrumen Kriteria Penempatan Klien</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-[#D4AF37]" />
            <span>Instrumen Kriteria Penempatan Klien</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Adaptasi ASAM Placement Criteria 3<sup>rd</sup> Edition · 6 Dimensi Penilaian
          </p>
          {ikp && (
            <div className="flex items-center gap-2 mt-1.5 text-[11px]">
              <span className={`px-2 py-0.5 rounded-full border font-bold ${
                ikp.statusPengisian === 'divalidasi'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : ikp.statusPengisian === 'lengkap'
                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                  : 'bg-amber-950/60 text-[#D4AF37] border-amber-500/40'
              }`}>
                {ikp.statusPengisian === 'divalidasi' ? '✓ Divalidasi' : ikp.statusPengisian === 'lengkap' ? '✓ Lengkap' : '⏳ Draf'}
              </span>
              <span className="text-slate-500">Diisi: {ikp.tanggalPengisian} · {ikp.petugasNama}</span>
            </div>
          )}
        </div>
        {canEdit && mode === 'view' && (
          <button
            onClick={() => setMode('edit')}
            className="bg-[#0e2341] hover:bg-[#133863] text-[#D4AF37] border border-[#1b3459] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors self-start"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{ikp ? 'Edit Instrumen' : 'Isi Instrumen'}</span>
          </button>
        )}
        {mode === 'edit' && (
          <div className="flex items-center gap-2 self-start flex-wrap">
            <button
              onClick={() => setMode('view')}
              className="bg-[#0e2341] hover:bg-[#133863] text-slate-300 border border-[#1b3459] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
            <button
              onClick={() => handleSimpan('draf')}
              className="bg-[#0e2341] hover:bg-[#133863] text-slate-200 border border-[#1b3459] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Draf</span>
            </button>
            <button
              onClick={() => handleSimpan('lengkap')}
              className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:brightness-110 text-white border border-[#2d7ad6]/60 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Finalisasi</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Cara Pengisian ── */}
      {mode === 'edit' && (
        <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center space-x-2 font-bold text-[#D4AF37] mb-1">
            <Info className="w-4 h-4" />
            <span>Cara Pengisian Instrumen</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
            <li>Berikan tanda centang (√) pada kondisi klien yang sesuai pada ke-enam dimensi berdasarkan hasil asesmen.</li>
            <li>Lakukan wawancara tambahan kepada klien atau pihak terkait (keluarga, wali, pendamping) jika perlu.</li>
            <li>Pilih level rekomendasi tingkat layanan sesuai dengan hasil penilaian tiap dimensi.</li>
            <li>Tiap dimensi mungkin mengindikasikan tingkat layanan yang sama — berikan rekomendasi yang sesuai dengan indikasi tersebut.</li>
            <li>Jika ada disparitas antar dimensi, kaji lebih lanjut dan tentukan tingkat yang paling bermanfaat bagi klien.</li>
          </ol>
        </div>
      )}

      {/* ── Wawancara Tambahan ── */}
      {mode === 'edit' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-2">
          <label className="flex items-center space-x-2 text-xs text-slate-200 cursor-pointer font-semibold">
            <input
              type="checkbox"
              checked={wawancaraTambahan}
              onChange={e => setWawancaraTambahan(e.target.checked)}
              className="w-4 h-4 rounded accent-amber-400"
            />
            <span>Wawancara tambahan kepada keluarga / wali / pendamping dilakukan</span>
          </label>
          {wawancaraTambahan && (
            <textarea
              rows={2}
              placeholder="Catatan hasil wawancara tambahan..."
              value={catatanWawancara}
              onChange={e => setCatatanWawancara(e.target.value)}
              className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          )}
        </div>
      )}
      {mode === 'view' && ikp?.wawancaraTambahanDilakukan && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-3 text-xs flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-emerald-300 font-semibold">Wawancara tambahan dilakukan.</span>
            {ikp.catatanWawancara && <p className="text-slate-400 mt-0.5">{ikp.catatanWawancara}</p>}
          </div>
        </div>
      )}

      {/* ── Scorecard 6 Dimensi (View Mode) ── */}
      {mode === 'view' && ikp && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {ALL_DIMENSI.map((d, idx) => {
            const p = ikp.penilaianPerDimensi.find(pp => pp.dimensi === d);
            const lv = p?.levelDipilih ?? 0;
            const col = LEVEL_COLORS[lv];
            const cfg = DIMENSI_CONFIG[d];
            return (
              <div key={d} className={`${col.bg} border ${col.border} rounded-xl p-3 flex flex-col items-center text-center space-y-1.5`}>
                <div className={`${col.text} opacity-80`}>{cfg.icon}</div>
                <span className="text-[10px] font-bold text-slate-400">D{idx + 1}</span>
                <div className={`text-2xl font-extrabold ${col.text}`}>{lv}</div>
                <span className="text-[10px] text-slate-400 leading-tight">{cfg.label.split(' · ')[1]}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Accordion 6 Dimensi ── */}
      <div className="space-y-3">
        {ALL_DIMENSI.map((d, idx) => {
          const cfg = DIMENSI_CONFIG[d];
          const penilaian = displayPenilaian.find(p => p.dimensi === d);
          const level = penilaian?.levelDipilih ?? 0;
          const col = LEVEL_COLORS[level];
          const isOpen = expandedDimensi === d;

          return (
            <div key={d} className={`border ${col.border} rounded-xl overflow-hidden transition-all duration-200`}>
              <button
                onClick={() => setExpandedDimensi(isOpen ? null : d)}
                className={`w-full flex items-center justify-between p-4 text-left cursor-pointer ${col.bg} hover:brightness-110 transition-all`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`shrink-0 ${col.text}`}>{cfg.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">D{idx + 1}</span>
                      <span className="text-xs font-bold text-white truncate">{cfg.label.split(' · ')[1]}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block leading-tight">{cfg.deskripsiDimensi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${col.badge}`}>Level {level}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="bg-[#081224] border-t border-[#1b3459] p-4 space-y-4">
                  {/* Level Selector */}
                  {mode === 'edit' ? (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase">Pilih Level Penilaian</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {([0, 1, 2, 3, 4] as LevelLayananRehabilitasi[]).map(lv => {
                          const lc = LEVEL_COLORS[lv];
                          const isSelected = level === lv;
                          return (
                            <button
                              key={lv}
                              onClick={() => setLevelDimensi(d, lv)}
                              className={`rounded-lg p-2 border text-center cursor-pointer transition-all ${
                                isSelected
                                  ? `${lc.bg} ${lc.border} ring-2 ring-offset-1 ring-offset-[#081224]`
                                  : 'bg-[#0b172a] border-[#1b3459] hover:border-slate-500'
                              }`}
                            >
                              <div className={`text-base font-extrabold ${isSelected ? lc.text : 'text-slate-500'}`}>{lv}</div>
                              <div className={`text-[9px] leading-tight mt-0.5 ${isSelected ? lc.text : 'text-slate-600'}`}>
                                {lv === 0 ? 'Tdk Perlu' : lv === 1 ? 'RJ Ringan' : lv === 2 ? 'RJ Intensif' : lv === 3 ? 'Residensial' : 'Hospitalisasi'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className={`${col.bg} border ${col.border} rounded-lg p-3`}>
                      <span className="text-[11px] font-bold uppercase text-slate-400">Level Terpilih</span>
                      <div className={`text-sm font-bold ${col.text} mt-0.5`}>
                        Level {level} — {LABEL_LEVEL_LAYANAN[level]}
                      </div>
                    </div>
                  )}

                  {/* Keterangan Level */}
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-lg p-3">
                    <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Keterangan Level {level}</p>
                    <p className="text-xs text-slate-300 leading-relaxed italic">{cfg.keterangan[level]}</p>
                  </div>

                  {/* Indikator Checklist */}
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-400 mb-2">Indikator yang Sesuai (Centang yang Berlaku)</p>
                    <div className="space-y-1.5">
                      {cfg.indikator[level].map((ind, i) => {
                        const terpilih = penilaian?.indikatorTerpilih.includes(ind) ?? false;
                        return (
                          <button
                            key={i}
                            onClick={() => mode === 'edit' && toggleIndikator(d, ind)}
                            className={`w-full flex items-start space-x-2 text-left px-3 py-2 rounded-lg border transition-all ${
                              terpilih
                                ? `${col.bg} ${col.border} ${col.text}`
                                : 'bg-[#0b172a] border-[#1b3459] text-slate-400'
                            } ${mode === 'edit' ? 'cursor-pointer hover:border-slate-500' : 'cursor-default'}`}
                          >
                            <span className="shrink-0 mt-0.5">
                              {terpilih
                                ? <CheckSquare className={`w-3.5 h-3.5 ${col.text}`} />
                                : <Square className="w-3.5 h-3.5 text-slate-600" />}
                            </span>
                            <span className="text-xs leading-relaxed">{ind}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Catatan Klinis */}
                  {mode === 'edit' ? (
                    <div>
                      <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Catatan Klinis / Penjelasan Tambahan</label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan temuan klinis, alasan pemilihan level, atau kondisi spesifik klien..."
                        value={penilaian?.catatanKlinis ?? ''}
                        onChange={e => setCatatanKlinis(d, e.target.value)}
                        className="w-full border border-[#1b3459] rounded-lg p-2.5 bg-[#0b172a] text-white text-xs placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] resize-none"
                      />
                    </div>
                  ) : (
                    penilaian?.catatanKlinis && (
                      <div className="bg-[#0b172a] border border-[#1b3459] rounded-lg p-3">
                        <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Catatan Klinis</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{penilaian.catatanKlinis}</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Disparitas & Justifikasi (Edit Mode) ── */}
      {mode === 'edit' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-white flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Analisis Disparitas & Justifikasi Rekomendasi</span>
          </h4>
          {adaDisparitas && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-lg p-3 text-xs">
              <p className="text-[#D4AF37] font-bold flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Terdeteksi Disparitas Antar Dimensi</span>
              </p>
              <p className="text-amber-200/80 mt-1 leading-relaxed">
                Tidak semua dimensi mengindikasikan tingkat layanan yang sama. Petugas perlu mengkaji lebih lanjut dan menentukan tingkat yang paling bermanfaat bagi klien.
              </p>
              <textarea
                rows={2}
                placeholder="Jelaskan analisis perbedaan indikasi antar dimensi dan pertimbangan yang digunakan..."
                value={catatanDisparitas}
                onChange={e => setCatatanDisparitas(e.target.value)}
                className="w-full mt-2 border border-amber-500/40 rounded-lg p-2 bg-[#0b172a] text-white text-xs placeholder-amber-900 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          )}
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Justifikasi Rekomendasi Akhir</label>
            <textarea
              rows={3}
              placeholder="Tuliskan narasi penjelasan mengapa level rekomendasi ini yang paling sesuai dengan kondisi klien saat ini..."
              value={justifikasi}
              onChange={e => setJustifikasi(e.target.value)}
              className="w-full border border-[#1b3459] rounded-lg p-2.5 bg-[#081224] text-white text-xs placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>
        </div>
      )}

      {/* ── Rekomendasi Final ── */}
      {((mode === 'view' && ikp) || mode === 'edit') && (
        <div className={`rounded-xl p-5 border-2 ${LEVEL_COLORS[rekomendasiOtomatis].bg} ${LEVEL_COLORS[rekomendasiOtomatis].border}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Award className={`w-5 h-5 ${LEVEL_COLORS[rekomendasiOtomatis].text}`} />
                <span className="text-xs font-bold uppercase text-slate-400">Rekomendasi Tingkat Layanan Rehabilitasi</span>
              </div>
              <div className={`text-2xl font-extrabold ${LEVEL_COLORS[rekomendasiOtomatis].text}`}>
                Level {rekomendasiOtomatis} —{' '}
                <span className="text-white">{LABEL_LEVEL_LAYANAN[rekomendasiOtomatis]}</span>
              </div>
              {mode === 'view' && ikp?.hasil.justifikasiRekomendasi && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-1">{ikp.hasil.justifikasiRekomendasi}</p>
              )}
              {mode === 'edit' && (
                <p className="text-xs text-slate-400 mt-1">Rekomendasi dihitung otomatis berdasarkan level tertinggi dari 6 dimensi.</p>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1 shrink-0">
              {([0, 1, 2, 3, 4] as LevelLayananRehabilitasi[]).map(lv => {
                const lc = LEVEL_COLORS[lv];
                const isReko = lv === rekomendasiOtomatis;
                return (
                  <div key={lv} className={`w-10 h-10 rounded-lg border flex flex-col items-center justify-center ${
                    isReko ? `${lc.bg} ${lc.border} ring-2 ring-current` : 'bg-[#081224] border-[#1b3459]'
                  }`}>
                    <span className={`text-sm font-extrabold ${isReko ? lc.text : 'text-slate-600'}`}>{lv}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {mode === 'view' && ikp?.hasil.adaDisparitasDimensi && (
            <div className="mt-3 pt-3 border-t border-[#1b3459] flex items-start space-x-2 text-xs">
              <AlertOctagon className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#D4AF37] font-bold">Catatan Disparitas Dimensi: </span>
                <span className="text-slate-300">{ikp.hasil.catatanDisparitas || 'Terdapat perbedaan indikasi antar dimensi. Telah dilakukan kajian lanjutan oleh petugas.'}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tabel Rekapitulasi (View Mode) ── */}
      {mode === 'view' && ikp && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1b3459] flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-white">Rekapitulasi Penilaian 6 Dimensi</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#081224]">
                  <th className="text-left px-4 py-2.5 text-[11px] font-bold uppercase text-slate-400">#</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-bold uppercase text-slate-400">Dimensi</th>
                  <th className="text-center px-4 py-2.5 text-[11px] font-bold uppercase text-slate-400">Level</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-bold uppercase text-slate-400">Rekomendasi Layanan</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-bold uppercase text-slate-400 hidden md:table-cell">Catatan Klinis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b3459]">
                {ALL_DIMENSI.map((d, idx) => {
                  const p = ikp.penilaianPerDimensi.find(pp => pp.dimensi === d);
                  const lv = p?.levelDipilih ?? 0;
                  const lc = LEVEL_COLORS[lv];
                  const cfg = DIMENSI_CONFIG[d];
                  return (
                    <tr key={d} className="hover:bg-[#0e1e38]/50 transition-colors">
                      <td className="px-4 py-3 text-slate-500 font-bold">D{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className={`${lc.text} opacity-70`}>{cfg.icon}</span>
                          <span className="text-slate-200 font-medium">{cfg.label.split(' · ')[1]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full border text-xs font-extrabold ${lc.badge}`}>{lv}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{LABEL_LEVEL_LAYANAN[lv]}</td>
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell max-w-xs truncate">{p?.catatanKlinis || '—'}</td>
                    </tr>
                  );
                })}
                <tr className={`${LEVEL_COLORS[ikp.hasil.levelRekomendasiAkhir].bg} border-t-2 ${LEVEL_COLORS[ikp.hasil.levelRekomendasiAkhir].border}`}>
                  <td className="px-4 py-3 font-bold text-slate-400" colSpan={2}>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-white font-extrabold text-xs uppercase">REKOMENDASI AKHIR</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full border text-sm font-extrabold ${LEVEL_COLORS[ikp.hasil.levelRekomendasiAkhir].badge}`}>
                      {ikp.hasil.levelRekomendasiAkhir}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-bold text-sm ${LEVEL_COLORS[ikp.hasil.levelRekomendasiAkhir].text}`} colSpan={2}>
                    {LABEL_LEVEL_LAYANAN[ikp.hasil.levelRekomendasiAkhir]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pengesahan Banner ── */}
      {mode === 'view' && ikp?.statusPengisian === 'divalidasi' && (
        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 flex items-center space-x-3">
          <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="text-emerald-300 font-bold">Dokumen Tervalidasi</span>
            {ikp.validasiOleh && <span className="text-slate-400"> · Divalidasi oleh {ikp.validasiOleh}</span>}
            {ikp.tanggalValidasi && <span className="text-slate-400"> pada {ikp.tanggalValidasi}</span>}
          </div>
        </div>
      )}

      {/* ── Tombol Validasi (untuk Koordinator / Medis) ── */}
      {mode === 'view' &&
        ikp &&
        ikp.statusPengisian === 'lengkap' &&
        (currentUser.role === 'koordinator' || currentUser.role === 'medis') && (
          <button
            onClick={() => {
              const instrumenValidasi: InstrumenKriteriaPlasemen = {
                ...ikp,
                statusPengisian: 'divalidasi',
                validasiOleh: currentUser.name,
                tanggalValidasi: new Date().toLocaleDateString('id-ID'),
              };
              onUpdatePermohonan({
                ...permohonan,
                instrumenKriteriaPlasemen: instrumenValidasi,
                auditLogs: [
                  {
                    id: 'aud-' + Date.now(),
                    timestamp:
                      new Date().toLocaleDateString('id-ID') +
                      ' ' +
                      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    actorNama: currentUser.name,
                    actorPeran: currentUser.role,
                    aksi: 'Validasi Instrumen Kriteria Penempatan Klien (ASAM)',
                    rincian: `Instrumen divalidasi. Rekomendasi Level ${ikp.hasil.levelRekomendasiAkhir}: ${LABEL_LEVEL_LAYANAN[ikp.hasil.levelRekomendasiAkhir]}`,
                  },
                  ...(Array.isArray(permohonan.auditLogs) ? permohonan.auditLogs : []),
                ],
              });
            }}
            className="w-full bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Validasi & Sahkan Instrumen Ini</span>
          </button>
        )}
    </div>
  );
};
