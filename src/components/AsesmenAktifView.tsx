import React, { useState, useMemo } from "react";
import { PermohonanAsesmen, UserProfile } from "../types";
import { ModalInputAsesmen } from "./ModalInputAsesmen";
import { PermohonanDetail } from "./PermohonanDetail";
import {
  Activity,
  Stethoscope,
  Scale,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  User,
  FileText,
  Users,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Zap,
  Building2,
  Shield,
  FileSignature,
  Download,
  Share2,
  Sparkles,
  Inbox,
  SendHorizontal,
  Layers,
  Check,
  Info,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface AsesmenAktifViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan?: (id: string) => void;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  isDetailOpen?: boolean;
  selectedActiveId?: string | null;
  onSelectActiveCase?: (id: string) => void;
  onBackFromActiveCase?: () => void;
  onToggleDetail?: (open: boolean) => void;
}

const ACTIVE_STATUSES = [
  "APPROVED",
  "SCHEDULED",
  "ASSESSMENT_ACTIVE",
  "READY_FOR_CONFERENCE",
  "CONFERENCE_HELD",
  "CONFERENCE_CLARIFICATION_REQUIRED",
  "OUTCOME_RECORDED_FOR_DRAFT",
  "AWAITING_SIGNED_OUTPUTS",
  "RESULTS_ISSUED"
];

const ACTIVE_PROSES = [
  "penugasan_jadwal",
  "asesmen_berlangsung",
  "siap_pleno",
  "pembahasan_pleno",
  "pengesahan_rekomendasi",
  "rekomendasi_terbit",
  "selesai_tindak_lanjut",
  "terverifikasi",
  "asesmen_berjalan"
];

type StepStatus = "done" | "active" | "pending";

interface AssessmentPipelineStep {
  stepNumber: number;
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ReactNode;
  status: StepStatus;
  timestamp: string;
  pic: string;
  picRole: string;
  inputList: { label: string; detail?: string }[];
  prosesList: { label: string; detail?: string }[];
  outputList: { label: string; detail?: string; isHighlight?: boolean }[];
  highlightNote?: string;
  badgeText: string;
}

function buildDetailedPipeline(p: PermohonanAsesmen): AssessmentPipelineStep[] {
  const appStatus = p.applicationStatus ?? "";
  const prosesUtama = p.statusProsesUtama ?? "";

  const adminDone = true;
  const jadwalDone = Boolean(p.timAsesmen?.jadwalPemeriksaanMedis || p.timAsesmen?.asesorMedisNama || ["SCHEDULED", "ASSESSMENT_ACTIVE", "READY_FOR_CONFERENCE", "AWAITING_SIGNED_OUTPUTS", "RESULTS_ISSUED"].includes(appStatus));
  const medisDone = p.medicalStatus === "FINAL" || p.statusMedis === "siap_dibahas" || Boolean(p.asesmenMedis?.diagnosisKlinisIcd);
  const hukumDone = p.legalStatus === "FINAL" || p.statusHukum === "siap_dibahas" || Boolean(p.asesmenHukum?.analisisPeran);
  const plenoDone = Boolean(p.sidangPleno?.nomorBeritaAcara) || prosesUtama === "pengesahan_rekomendasi" || prosesUtama === "rekomendasi_terbit" || ["AWAITING_SIGNED_OUTPUTS", "RESULTS_ISSUED"].includes(appStatus);
  const tteDone = p.rekomendasiResmi?.isLengkapPengesahan || prosesUtama === "rekomendasi_terbit" || appStatus === "RESULTS_ISSUED";

  const medisActive = jadwalDone && !medisDone;
  const hukumActive = jadwalDone && !hukumDone;
  const plenoActive = medisDone && hukumDone && !plenoDone;
  const tteActive = plenoDone && !tteDone;

  return [
    {
      stepNumber: 1,
      id: "verifikasi",
      title: "Verifikasi & Disposisi Berkas Perkara",
      shortTitle: "1. Verifikasi Berkas",
      subtitle: "Pemeriksaan kelengkapan berkas formal, verifikasi barang bukti, dan legalitas pengajuan asesmen",
      icon: <ClipboardCheck className="w-4 h-4" />,
      status: "done",
      timestamp: p.tanggalPengajuan ? `${p.tanggalPengajuan} 09:15 WIB` : "2026-09-08 09:15 WIB",
      pic: "Rina Marlina, S.H.",
      picRole: "Sekretariat TAT",
      inputList: [
        { label: "Surat Permohonan Resmi Asesmen", detail: "Ditandatangani oleh Kasat Resnarkoba / Kepala BNNK" },
        { label: `Laporan Polisi (LP): ${p.perkara?.nomorLaporanPolisi || "LP/A/142/IX/2026/SPKT"}`, detail: "Tanggal LP: 2026-09-06" },
        { label: "Identitas Terperiksa (KTP/KK)", detail: `NIK: ${p.terperiksa.nik || "Terverifikasi Dukcapil"}` },
        { label: "Barang Bukti Sitaan", detail: p.perkara?.barangBuktiList?.map(b => `${b.jenisZat} (${b.beratBersihGram}g)`).join(", ") || "Metamfetamina 0.38 gr" },
        { label: "Berita Acara Pemeriksaan (BAP) Tersangka", detail: "Keterangan awal peran dan penangkapan di TKP" }
      ],
      prosesList: [
        { label: "Uji Kelengkapan 7 Berkas Administrasi e-TAT", detail: "Pengecekan keabsahan stempel basah, tanda tangan, dan lampiran resmi." },
        { label: "Uji Batasan Gramatur SEMA No. 04 Tahun 2010", detail: "Memastikan berat narkotika berada di bawah ambang batas pemakaian 1 hari (< 1 gram sabu)." },
        { label: "Pencatatan & Penerbitan Nomor Registrasi Docket", detail: "Penguncian data registrasi ke dalam basis data integrasi e-TAT." }
      ],
      outputList: [
        { label: "Status Berkas: Lengkap & Terverifikasi Sah (Disetujui)", detail: "Berkas memenuhi seluruh kriteria formal dan materiil.", isHighlight: true },
        { label: "Lembar Disposisi Penugasan Asesor", detail: "Diteruskan ke Koordinator Asesor untuk penjadwalan sesi." }
      ],
      highlightNote: "Berkas perkara dinyatakan sah dan memenuhi kualifikasi penyalahguna murni UU No. 35/2009.",
      badgeText: "Selesai Diverifikasi"
    },
    {
      stepNumber: 2,
      id: "penugasan",
      title: "Penugasan & Penjadwalan Asesor",
      shortTitle: "2. Penjadwalan",
      subtitle: "Penetapan jadwal sesi pemeriksaan, penunjukan faskes, dan sprint tugas dokter serta jaksa penelaah",
      icon: <Calendar className="w-4 h-4" />,
      status: jadwalDone ? "done" : "active",
      timestamp: p.timAsesmen?.jadwalPemeriksaanMedis || "2026-09-08 14:00 WIB",
      pic: "Koordinator Sekretariat TAT",
      picRole: "Administrasi Penugasan",
      inputList: [
        { label: "Disposisi Berkas Lengkap Terverifikasi", detail: "Dari Sekretariat TAT" },
        { label: `Lokasi Pemeriksaan Terpilih`, detail: p.timAsesmen?.lokasiPemeriksaan || "Klinik Pratama BNNK Samarinda (Faskes Terdekat)" },
        { label: "Daftar Asesor Medis & Hukum Tersedia", detail: "Jadwal dokter spesialis jiwa & jaksa penuntut umum" }
      ],
      prosesList: [
        { label: "Penerbitan Surat Perintah Tugas (Sprint) Asesor", detail: "Penetapan resmi tim dokter pemeriksa dan tim telaah hukum." },
        { label: "Pemberitahuan Jadwal ke Penyidik Pengaju", detail: "Koordinasi waktu menghadirkan terperiksa ke faskes." },
        { label: "Sinkronisasi Ruang Pemeriksaan & Laboratorium", detail: "Persiapan kit tes urine dan lembar instrumen klinis." }
      ],
      outputList: [
        { label: `Asesor Medis: ${p.timAsesmen?.asesorMedisNama || "dr. Haryono (BNNK Samarinda)"}`, detail: "Dokter Pemeriksa & Konselor Adiksi", isHighlight: true },
        { label: `Asesor Hukum: ${p.timAsesmen?.asesorHukumNama || "Tim Hukum Kejaksaan / BNNP"}`, detail: "Jaksa Penuntut Umum / Penelaah Perkara", isHighlight: true },
        { label: `Jadwal & Lokasi Sesi`, detail: `${p.timAsesmen?.jadwalPemeriksaanMedis || "2026-09-09 09:30 WIB"} @ ${p.timAsesmen?.lokasiPemeriksaan || "Klinik Pratama BNNK"}` }
      ],
      highlightNote: "Jadwal pemeriksaan telah disetujui bersama oleh Penyidik Pengaju dan Tim Asesor.",
      badgeText: jadwalDone ? "Selesai Dijadwalkan" : "Sedang Penugasan"
    },
    {
      stepNumber: 3,
      id: "medis",
      title: "Asesmen Medis & Psikologis",
      shortTitle: "3. Medis & Urin",
      subtitle: "Pemeriksaan klinis komprehensif, skrining tes urine laboratorium, dan pengisian instrumen adiksi",
      icon: <Stethoscope className="w-4 h-4" />,
      status: medisDone ? "done" : medisActive ? "active" : "pending",
      timestamp: p.asesmenMedis?.tanggalPemeriksaan || p.timAsesmen?.jadwalPemeriksaanMedis || "2026-09-09 10:00 WIB",
      pic: p.asesmenMedis?.asesorNama || p.timAsesmen?.asesorMedisNama || "dr. Haryono (Sp.KJ)",
      picRole: "Asesor Medis & Psikiater",
      inputList: [
        { label: "Hasil Uji Toksikologi Urine (SKHPU)", detail: p.asesmenMedis?.hasilUrin?.map(u => `${u.parameter}: ${u.hasil}`).join(", ") || "MET: Positif, THC: Negatif" },
        { label: "Wawancara Riwayat Penggunaan Zat", detail: p.asesmenMedis?.riwayatZat?.map(r => `${r.jenisZat} (${r.caraPakai}) - Frekuensi: ${r.frekuensi}`).join("; ") || "Sabu dihisap 4-5x seminggu" },
        { label: "Pemeriksaan Fisik & Tanda Vital", detail: "Tekanan darah, denyut nadi, bekas suntikan jarum" }
      ],
      prosesList: [
        { label: "Penilaian Skor Instrumen Ketergantungan (WHO-ASSIST / DAST-10)", detail: "Pengukuran tingkat keparahan adiksi dan dampak biopsikososial." },
        { label: "Evaluasi Komorbiditas & Status Psikiatrik", detail: "Pemeriksaan gangguan kecemasan, depresi, atau gejala psikotik." },
        { label: "Perumusan Usulan Modalitas & Durasi Layanan", detail: "Penentuan kebutuhan rawat inap terisolasi atau rawat jalan." }
      ],
      outputList: [
        { label: `Diagnosis Klinis ICD-10: ${p.asesmenMedis?.diagnosisKlinisIcd || "F15.2 (Sindrom Ketergantungan Stimulansia)"}`, detail: "Diagnosis resmi medis kepolisian", isHighlight: true },
        { label: `Tingkat Risiko: ${p.asesmenMedis?.tingkatRisikoInstrumen || "Tinggi (Ketergantungan)"} (Skor: ${p.asesmenMedis?.skorInstrumen || 28})`, detail: "Kategori ketergantungan berat" },
        { label: `Rekomendasi Layanan: ${p.asesmenMedis?.kebutuhanRawat || "Rehabilitasi Rawat Inap"} (${p.asesmenMedis?.durasiUsulanBulan || 3} Bulan)`, detail: "Rekomendasi penempatan fasilitas rehabilitasi medis", isHighlight: true }
      ],
      highlightNote: p.asesmenMedis?.interpretasiKlinis || "Klien menunjukkan ketergantungan zat aktif dengan toleransi tinggi, memerlukan rehabilitasi medis rawat inap.",
      badgeText: medisDone ? "Medis Selesai" : medisActive ? "Pemeriksaan Medis" : "Menunggu Medis"
    },
    {
      stepNumber: 4,
      id: "hukum",
      title: "Asesmen Hukum & Analisis Peran Perkara",
      shortTitle: "4. Telaah Hukum",
      subtitle: "Telaah yuridis fakta penyidikan, analisis keterlibatan sindikat jaringan, dan kepatuhan SEMA 04/2010",
      icon: <Scale className="w-4 h-4" />,
      status: hukumDone ? "done" : hukumActive ? "active" : "pending",
      timestamp: p.asesmenHukum?.tanggalTelaah || p.timAsesmen?.jadwalPemeriksaanHukum || "2026-09-09 13:30 WIB",
      pic: p.asesmenHukum?.asesorNama || p.timAsesmen?.asesorHukumNama || "Jaksa Penuntut Umum Kejari",
      picRole: "Asesor Hukum Kejaksaan/Polri",
      inputList: [
        { label: "Berkas Perkara Lengkap (LP & BAP Penyidik)", detail: `Pasal Disangkakan: ${p.perkara?.pasalDipersangkakan || "Pasal 127 ayat (1) UU No. 35/2009"}` },
        { label: "Berita Acara Uji Lab Puslabfor Barang Bukti", detail: "Hasil uji kualitatif & kuantitatif netto zat aktif" },
        { label: "Pemeriksaan Catatan Kriminal / Residivisme", detail: "Data riwayat hukuman lalu dalam database kepolisian" }
      ],
      prosesList: [
        { label: "Analisis Keterlibatan Jaringan Peredaran Gelap", detail: "Pemeriksaan riwayat komunikasi HP, rekening, dan hubungan sindikat." },
        { label: "Uji Kesesuaian Kriteria SEMA No. 04 Tahun 2010", detail: "Barang bukti saat tertangkap tangan di bawah batas gramatur 1 gram." },
        { label: "Penyusunan Argumentasi & Kesimpulan Yuridis", detail: "Penetapan kualifikasi tersangka sebagai penyalahguna murni." }
      ],
      outputList: [
        { label: `Analisis Peran: ${p.asesmenHukum?.analisisPeran || "Penyalahguna Murni / Korban"}`, detail: "Bukan pengedar, bukan bandar, dan bukan kurir jaringan", isHighlight: true },
        { label: `Evaluasi Barang Bukti: ${p.asesmenHukum?.analisisBarangBukti || "Sabu 0.38g (Di bawah batas SEMA 1.0 gr)"}`, detail: "Memenuhi syarat kualifikasi rehabilitasi" },
        { label: `Rekomendasi Hukum: ${p.asesmenHukum?.rekomendasiHukum || "Proses hukum dilanjutkan dengan rekomendasi rehabilitasi"}`, detail: "Disertakan dalam berkas penuntutan", isHighlight: true }
      ],
      highlightNote: "Hasil telaah hukum menegaskan tidak ada indikasi pengedaran gelap narkotika; tersangka layak direhabilitasi.",
      badgeText: hukumDone ? "Hukum Selesai" : hukumActive ? "Telaah Hukum" : "Menunggu Hukum"
    },
    {
      stepNumber: 5,
      id: "pleno",
      title: "Sidang Pleno Tim Terpadu (TAT)",
      shortTitle: "5. Sidang Pleno",
      subtitle: "Musyawarah mufakat lintas instansi (BNN, Polri, Kejaksaan, Medis) perumusan rekomendasi final",
      icon: <Users className="w-4 h-4" />,
      status: plenoDone ? "done" : plenoActive ? "active" : "pending",
      timestamp: p.sidangPleno?.tanggalPleno || p.timAsesmen?.jadwalPleno || "2026-09-10 14:00 WIB",
      pic: p.sidangPleno?.pimpinanPleno || "Ketua Tim Asesmen Terpadu (TAT)",
      picRole: "Pimpinan Sidang Pleno",
      inputList: [
        { label: "Resume Hasil Asesmen Medis & Psikologis", detail: "Diagnosis ICD-10 & Usulan Layanan Dokter" },
        { label: "Resume Hasil Asesmen Hukum & Fakta Perkara", detail: "Analisis Peran Tersangka & Kesimpulan Jaksa" },
        { label: "Daftar Hadir Unsur Tim Terpadu", detail: "Unsur Polri, BNN, Kejaksaan, dan Dokter Asesor" }
      ],
      prosesList: [
        { label: "Pemaparan Silang Hasil Asesmen Medis dan Hukum", detail: "Pembahasan komprehensif latar belakang perkara dan kondisi ketergantungan." },
        { label: "Musyawarah Mufakat Penetapan Rekomendasi Bersama", detail: "Penyelarasan aspek penegakan hukum dengan hak pengobatan terperiksa." },
        { label: "Penyusunan & Penandatanganan Berita Acara Pleno", detail: "Penetapan jenis layanan rehabilitasi dan penunjukan fasilitas rujukan." }
      ],
      outputList: [
        { label: `No. Berita Acara: ${p.sidangPleno?.nomorBeritaAcara || "BA-PLENO/TAT/IX/2026/089"}`, detail: "Berita Acara Kesepakatan Tim Terpadu", isHighlight: true },
        { label: `Kesepakatan Rekomendasi: ${p.sidangPleno?.kesepakatanRekomendasi || "Rehabilitasi Medis & Sosial Rawat Inap (3 Bulan)"}`, detail: "Disepakati secara bulat oleh seluruh anggota pleno", isHighlight: true },
        { label: `Usulan Fasilitas Rujukan: ${p.sidangPleno?.fasilitasRujukanUsulan || "Balai Rehabilitasi BNN Tanah Merah"}`, detail: "Fasilitas rujukan resmi berstandar nasional" }
      ],
      highlightNote: "Seluruh unsur Tim Asesmen Terpadu bersepakat bulat merekomendasikan rehabilitasi rawat inap.",
      badgeText: plenoDone ? "Pleno Sepakat" : plenoActive ? "Siap Pleno" : "Menunggu Pleno"
    },
    {
      stepNumber: 6,
      id: "pengesahan",
      title: "Pengesahan & Penerbitan Dokumen Rekomendasi",
      shortTitle: "6. Pengesahan TTE",
      subtitle: "Penandatanganan digital multi-pihak (TTE) dan penerbitan Surat Rekomendasi resmi ber-QR Code",
      icon: <FileSignature className="w-4 h-4" />,
      status: tteDone ? "done" : tteActive ? "active" : "pending",
      timestamp: p.rekomendasiResmi?.tanggalTerbit || "2026-09-11",
      pic: "4 Unsur Pengesah (Ketua, Medis, Hukum, Penyidik)",
      picRole: "Tanda Tangan Elektronik",
      inputList: [
        { label: "Berita Acara Sidang Pleno yang Ditandatangani", detail: "Dokumen rujukan keputusan pleno" },
        { label: "Draf Surat Rekomendasi Resmi e-TAT", detail: "Format baku standar kepolisian & BNN" },
        { label: "Sertifikat Digital TTE 4 Unsur Pengesah", detail: "Keamanan enkripsi kriptografi SHA-256" }
      ],
      prosesList: [
        { label: "Pengesahan Digital Multi-Pihak (TTE)", detail: "Penandatanganan bertahap oleh Ketua TAT, Dokter, Jaksa, dan Penyidik." },
        { label: "Penerbitan Secure QR Code Validasi Dokumen", detail: "QR Code anti-pemalsuan yang dapat dipindai oleh publik dan pengadilan." },
        { label: "Penguncian Dokumen & Distribusi ke Penyidik & Faskes", detail: "Pengiriman digital ke akun Satresnarkoba dan Balai Rehabilitasi." }
      ],
      outputList: [
        { label: `Surat Rekomendasi Resmi: ${p.rekomendasiResmi?.nomorSurat || "TAT/REK/089/IX/2026"}`, detail: "Dokumen PDF resmi ber-QR Code dan sah berkekuatan hukum", isHighlight: true },
        { label: "Status Disposisi: Siap Pelaksanaan Rujukan & Pelimpahan", detail: "Dapat langsung diunduh penyidik untuk proses peradilan." }
      ],
      highlightNote: "Surat Rekomendasi resmi e-TAT telah disahkan lengkap dan diterbitkan secara sah.",
      badgeText: tteDone ? "Resmi Terbit" : tteActive ? "Menunggu TTE" : "Menunggu Pleno"
    }
  ];
}

function getStatusBadge(p: PermohonanAsesmen) {
  const s = p.applicationStatus;
  if (s === "ASSESSMENT_ACTIVE" || p.statusProsesUtama === "asesmen_berlangsung")
    return { label: "Asesmen Berlangsung", cls: "bg-[#142642] text-blue-300 border-blue-500/50" };
  if (s === "SCHEDULED" || p.statusProsesUtama === "penugasan_jadwal")
    return { label: "Tim Ditugaskan", cls: "bg-[#142642] text-slate-200 border-slate-600" };
  if (s === "READY_FOR_CONFERENCE" || p.statusProsesUtama === "siap_pleno")
    return { label: "Siap Sidang Pleno", cls: "bg-[#142642] text-amber-300 border-amber-600/50" };
  if (s === "APPROVED")
    return { label: "Berkas Terverifikasi", cls: "bg-[#142642] text-emerald-300 border-emerald-600/50" };
  return { label: s ?? "Aktif", cls: "bg-[#142642] text-slate-300 border-[#1b3459]" };
}

/* -------------------------------------------------------------
   DEDICATED STEP-BY-STEP DETAIL VIEW:
   - Header Bar identik dengan PermohonanDetail (Simple No. & Tanggal)
   - Step Tabs at the top
   - Full-width clear sections: Input, Proses, Output
   ------------------------------------------------------------- */
interface DedicatedAsesmenDetailProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onBack: () => void;
  onOpenFullDetail?: (id: string) => void;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
}

function DedicatedAsesmenDetail({
  permohonan,
  currentUser,
  onBack,
  onOpenFullDetail,
  onUpdatePermohonan
}: DedicatedAsesmenDetailProps) {
  const pipeline = useMemo(() => buildDetailedPipeline(permohonan), [permohonan]);
  const [modalInputType, setModalInputType] = useState<'medis' | 'hukum' | null>(null);
  
  // Default selected step is the currently active step (or last done step)
  const defaultStepIdx = useMemo(() => {
    const activeIdx = pipeline.findIndex(s => s.status === "active");
    if (activeIdx !== -1) return activeIdx;
    const lastDoneIdx = pipeline.map(s => s.status).lastIndexOf("done");
    return lastDoneIdx !== -1 ? lastDoneIdx : 0;
  }, [pipeline]);

  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(defaultStepIdx);
  const activeStep = pipeline[selectedStepIdx] || pipeline[0];
  const doneCount = pipeline.filter(s => s.status === "done").length;
  const progressPct = Math.round((doneCount / pipeline.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-roboto">
      {/* Modal Input Asesmen for Medis / Hukum */}
      {modalInputType && (
        <ModalInputAsesmen
          isOpen={Boolean(modalInputType)}
          onClose={() => setModalInputType(null)}
          tipeAsesmen={modalInputType}
          namaTerperiksa={permohonan.terperiksa?.namaLengkap || 'Terperiksa'}
          nomorTat={permohonan.nomorPermohonan}
          onSave={(data, isFinal) => {
            if (onUpdatePermohonan) {
              const updated: PermohonanAsesmen = {
                ...permohonan,
                ...(modalInputType === 'medis' ? {
                  asesmenMedis: {
                    ...permohonan.asesmenMedis,
                    statusAsesmen: isFinal ? 'selesai' : 'draf',
                    tanggalPemeriksaan: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    asesorNama: currentUser.name || 'dr. Asesor Medis',
                    ...data
                  }
                } : {
                  asesmenHukum: {
                    ...permohonan.asesmenHukum,
                    statusTelaah: isFinal ? 'selesai' : 'draf',
                    tanggalTelaah: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    asesorNama: currentUser.name || 'Asesor Hukum / Jaksa',
                    ...data
                  }
                })
              };
              onUpdatePermohonan(updated);
            }
            setModalInputType(null);
          }}
        />
      )}

      {/* 1. SIMPLE HEADER BAR: Nomor Permohonan & Tanggal (Identik dengan format Detail Page Verifikasi) */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center space-x-2 bg-[#081224] border border-[#1b3459] px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 font-medium">No. Permohonan:</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-[#d4af37]">
              {permohonan.nomorPermohonan}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-[#081224] border border-[#1b3459] px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Tanggal:</span>
            <span className="font-semibold text-slate-200">
              {permohonan.tanggalPengajuan}
            </span>
          </div>
        </div>

        {/* Global Progress & Quick Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs">
          <div className="flex items-center space-x-2 bg-[#081224] border border-[#1b3459] px-3 py-1.5 rounded-xl">
            <Activity className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-slate-400 font-medium">Kemajuan:</span>
            <strong className="text-white font-bold">{doneCount}/{pipeline.length} Tahap Selesai ({progressPct}%)</strong>
          </div>

          {onOpenFullDetail && (
            <button
              onClick={() => onOpenFullDetail(permohonan.id)}
              className="bg-[#142642] hover:bg-[#1b3459] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#234475]"
            >
              <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Buka Berkas Lengkap</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MINIMALIST STEP CARDS / TABS (Identik dengan format Tab Navigation di PermohonanDetail) */}
      <div className="bg-[#0b172a] p-2 rounded-2xl border border-[#1b3459] shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {pipeline.map((step, idx) => {
            const isSelected = selectedStepIdx === idx;
            const isDone = step.status === "done";
            const isActive = step.status === "active";

            return (
              <button
                key={step.id}
                onClick={() => setSelectedStepIdx(idx)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer select-none shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] text-white border border-[#2d7ad6]/70 shadow-lg shadow-[#144782]/40 scale-[1.01]"
                    : "bg-[#081224] text-slate-300 hover:text-white hover:bg-[#142642] border border-[#1b3459] hover:border-[#234475]"
                }`}
              >
                {/* Step Number & Status Indicator */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold ${
                    isSelected
                      ? "bg-white/20 text-[#d4af37]"
                      : isDone
                      ? "bg-[#142642] text-emerald-400"
                      : "bg-[#142642] text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 text-emerald-400" /> : step.stepNumber}
                </div>

                <span className={isSelected ? "text-[#d4af37]" : "text-slate-400"}>{step.icon}</span>
                <span className="tracking-wide">{step.shortTitle}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FULL-WIDTH RICH PAGE CONTENT AREA FOR SELECTED STEP */}
      <div className="space-y-5">
        {/* Step Banner Card - High contrast, clearly readable */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37] bg-[#081224] px-2.5 py-0.5 rounded border border-[#1b3459] font-mono">
                Tahap {activeStep.stepNumber} dari {pipeline.length}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                  activeStep.status === "done"
                    ? "bg-[#081224] text-emerald-400 border-emerald-600/60"
                    : activeStep.status === "active"
                    ? "bg-[#142642] text-[#d4af37] border-[#d4af37]/60"
                    : "bg-[#081224] text-slate-400 border-[#1b3459]"
                }`}
              >
                {activeStep.badgeText}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2.5 pt-0.5">
              <span className="text-[#d4af37]">{activeStep.icon}</span>
              <span>{activeStep.title}</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {activeStep.subtitle}
            </p>
          </div>

          {/* Metadata Box */}
          <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-3.5 space-y-2 text-xs shrink-0 md:min-w-[280px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Waktu Pelaksanaan:</span>
              </span>
              <strong className="text-white font-mono font-semibold">{activeStep.timestamp}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-300" />
                <span>Penanggung Jawab:</span>
              </span>
              <strong className="text-white font-semibold">{activeStep.pic}</strong>
            </div>
          </div>
        </div>

        {/* Interactive Role-Based Action & Input Card tailored to selected step */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 font-roboto">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37] bg-[#081224] px-2.5 py-0.5 rounded border border-[#1b3459]">
                Role Anda: {(currentUser?.role || 'ADMIN').toUpperCase()}
              </span>
              <span className="text-xs font-bold text-white">
                &bull; Aksi Input Tahap {activeStep.stepNumber}: {activeStep.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeStep.stepNumber === 1 && "Silakan lakukan pemeriksaan & verifikasi checklist berkas formil persyaratan (SOP BAB 09)."}
              {activeStep.stepNumber === 2 && "Silakan tetapkan alokasi tim asesor medis & hukum serta atur jadwal sidang koordinasi."}
              {activeStep.stepNumber === 3 && "Silakan input lembar pemeriksaan medis, hasil tes urin SKHPU, diagnosis ICD-10, dan rekomendasi layanan."}
              {activeStep.stepNumber === 4 && "Silakan input lembar telaah hukum, analisis gramatur SEMA 04/2010, dan kualifikasi peran tersangka."}
              {activeStep.stepNumber === 5 && "Silakan catat Berita Acara kesepakatan Sidang Pleno Tim Asesmen Terpadu (TAT)."}
              {activeStep.stepNumber === 6 && "Silakan lakukan pengesahan tanda tangan digital (TTE) multi-pihak & penerbitan Surat Rekomendasi."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {activeStep.stepNumber === 3 && (
              <button
                onClick={() => setModalInputType('medis')}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-500/60 shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <Stethoscope className="w-4 h-4 text-[#d4af37]" />
                <span>Input / Edit Asesmen Medis</span>
              </button>
            )}

            {activeStep.stepNumber === 4 && (
              <button
                onClick={() => setModalInputType('hukum')}
                className="bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-700/80 shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <Scale className="w-4 h-4 text-[#d4af37]" />
                <span>Input / Edit Asesmen Hukum</span>
              </button>
            )}

            {onOpenFullDetail && (
              <button
                onClick={() => onOpenFullDetail(permohonan.id)}
                className="bg-[#142642] hover:bg-[#1b3459] text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#234475] shadow-sm transition-all cursor-pointer flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4 text-[#d4af37]" />
                <span>Kelola Full Detail Step Ini</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Full-Width Detailed Content Cards: Input, Proses, Output (Uniform clean slate/dark navy theme) */}
        {/* 3 Full-Width Detailed Content Sections: Input -> Aktivitas -> Output (Top-to-bottom vertical layout) */}
        <div className="flex flex-col space-y-4 font-roboto">
          {/* Section 1: 📥 INPUT / BERKAS MASUK */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#1b3459]">
              <div className="w-7 h-7 rounded-lg bg-[#081224] border border-[#1b3459] flex items-center justify-center text-[#d4af37]">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Input &amp; Berkas Masuk
                </h3>
                <p className="text-[10px] text-slate-400">Data dan dokumen yang diterima pada tahap ini</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeStep.inputList.map((item, i) => (
                <div key={i} className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] space-y-0.5 hover:border-[#234475] transition-colors">
                  <span className="text-xs font-bold text-white block leading-snug">
                    {item.label}
                  </span>
                  {item.detail && (
                    <span className="text-[11px] text-slate-300 block leading-relaxed">
                      {item.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: ⚙️ PROSES & AKTIVITAS */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#1b3459]">
              <div className="w-7 h-7 rounded-lg bg-[#081224] border border-[#1b3459] flex items-center justify-center text-slate-200">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Aktivitas &amp; Telaah
                </h3>
                <p className="text-[10px] text-slate-400">Tindakan pemeriksaan, telaah hukum &amp; analisis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeStep.prosesList.map((item, i) => (
                <div key={i} className="p-3 bg-[#081224] rounded-xl border border-[#1b3459] space-y-0.5 hover:border-[#234475] transition-colors">
                  <span className="text-xs font-bold text-white block leading-snug">
                    {item.label}
                  </span>
                  {item.detail && (
                    <span className="text-[11px] text-slate-300 block leading-relaxed">
                      {item.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 📤 OUTPUT & HASIL KEPUTUSAN */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#1b3459]">
              <div className="w-7 h-7 rounded-lg bg-[#081224] border border-[#1b3459] flex items-center justify-center text-emerald-400">
                <SendHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Output &amp; Hasil Keputusan
                </h3>
                <p className="text-[10px] text-slate-400">Rekomendasi resmi &amp; kesimpulan yang diterbitkan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeStep.outputList.map((item, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border space-y-0.5 hover:border-[#234475] transition-colors ${
                    item.isHighlight
                      ? "bg-[#142642] border-[#2d7ad6]/60 text-white"
                      : "bg-[#081224] border-[#1b3459] text-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold block leading-snug">
                    {item.label}
                  </span>
                  {item.detail && (
                    <span className="text-[11px] text-slate-300 block leading-relaxed">
                      {item.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {activeStep.highlightNote && (
              <div className="mt-2 p-3 rounded-xl bg-[#081224] border border-[#1b3459] text-[11px] text-slate-300 flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeStep.highlightNote}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Step Navigation Bar */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 flex items-center justify-between shadow-md">
          {selectedStepIdx > 0 ? (
            <button
              onClick={() => setSelectedStepIdx(selectedStepIdx - 1)}
              className="px-4 py-2 bg-[#081224] hover:bg-[#142642] text-slate-200 hover:text-white rounded-xl border border-[#1b3459] text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Tahap Sebelumnya: {pipeline[selectedStepIdx - 1].shortTitle}</span>
            </button>
          ) : (
            <div />
          )}

          {selectedStepIdx < pipeline.length - 1 ? (
            <button
              onClick={() => setSelectedStepIdx(selectedStepIdx + 1)}
              className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-white rounded-xl border border-[#2d7ad6] text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Tahap Selanjutnya: {pipeline[selectedStepIdx + 1].shortTitle}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
            </button>
          ) : (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-[#081224] hover:bg-[#142642] text-emerald-400 hover:text-emerald-300 border border-emerald-600/60 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Selesai Melihat Alur</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   MAIN COMPONENT: ASESMEN AKTIF LIST OVERVIEW
   ------------------------------------------------------------- */
export const AsesmenAktifView: React.FC<AsesmenAktifViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onUpdatePermohonan,
  isDetailOpen,
  selectedActiveId: propSelectedActiveId,
  onSelectActiveCase,
  onBackFromActiveCase,
  onToggleDetail
}) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "asesmen" | "pleno" | "penugasan">("semua");
  const [localSelectedActiveId, setLocalSelectedActiveId] = useState<string | null>(null);

  const selectedActiveId = propSelectedActiveId !== undefined ? propSelectedActiveId : localSelectedActiveId;

  const isPengajuRole = currentUser?.role?.toUpperCase() === 'PENGAJU';
  const checkOwner = (p: PermohonanAsesmen) => {
    if (!isPengajuRole) return true;
    return (
      p.pengajuId === currentUser.id ||
      (p.pengajuNama && p.pengajuNama.toLowerCase().includes((currentUser.name || '').toLowerCase())) ||
      (p.perkara?.namaPenyidik && p.perkara.namaPenyidik.toLowerCase().includes((currentUser.name || '').toLowerCase())) ||
      (p.instansiPengaju && currentUser.agency && p.instansiPengaju.toLowerCase().includes(currentUser.agency.toLowerCase())) ||
      (p.instansiPengaju && currentUser.instansi && p.instansiPengaju.toLowerCase().includes(currentUser.instansi.toLowerCase()))
    );
  };

  const activeList = useMemo(
    () =>
      permohonanList.filter(
        p => checkOwner(p) && (ACTIVE_STATUSES.includes(p.applicationStatus ?? "") || ACTIVE_PROSES.includes(p.statusProsesUtama ?? ""))
      ),
    [permohonanList, currentUser]
  );

  const counts = useMemo(
    () => ({
      semua: activeList.length,
      asesmen: activeList.filter(p => p.applicationStatus === "ASSESSMENT_ACTIVE" || p.statusProsesUtama === "asesmen_berlangsung").length,
      pleno: activeList.filter(p => p.applicationStatus === "READY_FOR_CONFERENCE" || p.statusProsesUtama === "siap_pleno").length,
      penugasan: activeList.filter(p => p.applicationStatus === "SCHEDULED" || p.statusProsesUtama === "penugasan_jadwal").length
    }),
    [activeList]
  );

  const filtered = useMemo(() => {
    let list = activeList;
    if (filterStatus === "asesmen") list = list.filter(p => p.applicationStatus === "ASSESSMENT_ACTIVE" || p.statusProsesUtama === "asesmen_berlangsung");
    else if (filterStatus === "pleno") list = list.filter(p => p.applicationStatus === "READY_FOR_CONFERENCE" || p.statusProsesUtama === "siap_pleno");
    else if (filterStatus === "penugasan") list = list.filter(p => p.applicationStatus === "SCHEDULED" || p.statusProsesUtama === "penugasan_jadwal");

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        p =>
          p.nomorPermohonan.toLowerCase().includes(q) ||
          p.terperiksa.namaLengkap.toLowerCase().includes(q) ||
          p.instansiPengaju.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeList, filterStatus, search]);

  const activePermohonan = useMemo(() => {
    return activeList.find(p => p.id === selectedActiveId) || null;
  }, [activeList, selectedActiveId]);

  const handleSelectActiveCase = (id: string) => {
    if (onSelectActiveCase) {
      onSelectActiveCase(id);
    } else {
      setLocalSelectedActiveId(id);
      onToggleDetail?.(true);
    }
  };

  const handleBackToList = () => {
    if (onBackFromActiveCase) {
      onBackFromActiveCase();
    } else {
      setLocalSelectedActiveId(null);
      onToggleDetail?.(false);
    }
  };

  // JIKA SEDANG MEMILIH SATU PERMOHONAN: TAMPILKAN LANGSUNG PERMOHONAN DETAIL DENGAN TAB LENGKAP ROLE
  if (activePermohonan) {
    return (
      <PermohonanDetail
        permohonan={activePermohonan}
        currentUser={currentUser}
        onBack={handleBackToList}
        onUpdatePermohonan={onUpdatePermohonan || (() => {})}
        onOpenQrModal={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0b172a] border border-[#1b3459] rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#d4af37]" />
            </div>
            <h1 className="text-lg font-bold text-white">Asesmen Aktif</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#142642] text-slate-200 border border-[#1b3459] rounded-full">
              {activeList.length} Kasus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 ml-10">
            Daftar permohonan yang sedang dalam proses asesmen medis, hukum, dan sidang pleno TAT. Klik card untuk melihat rincian tahapan &amp; input-output.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["semua", "penugasan", "asesmen", "pleno"] as const).map(f => {
          const labels: Record<string, string> = {
            semua: "Semua Aktif",
            penugasan: "Tim Ditugaskan",
            asesmen: "Asesmen Berlangsung",
            pleno: "Siap Sidang Pleno"
          };
          const isActive = filterStatus === f;
          return (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#142642] text-white border-[#d4af37] shadow-sm ring-1 ring-[#d4af37]/50"
                  : "bg-[#0b172a] text-slate-300 border-[#1b3459] hover:border-slate-500 hover:text-white"
              }`}
            >
              {labels[f]}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-[#d4af37] text-slate-950" : "bg-[#1b3459] text-slate-300"}`}>
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nomor permohonan, nama terperiksa, atau instansi..."
          className="w-full bg-[#0b172a] border border-[#1b3459] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Aktif", value: counts.semua, icon: <Activity className="w-4 h-4 text-[#d4af37]" /> },
          { label: "Tim Ditugaskan", value: counts.penugasan, icon: <Calendar className="w-4 h-4 text-slate-300" /> },
          { label: "Asesmen Jalan", value: counts.asesmen, icon: <Stethoscope className="w-4 h-4 text-blue-400" /> },
          { label: "Siap Pleno", value: counts.pleno, icon: <Users className="w-4 h-4 text-emerald-400" /> }
        ].map(stat => (
          <div key={stat.label} className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#081224] border border-[#1b3459] flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cards List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-[#0b172a] rounded-2xl border border-[#1b3459]">
          <Activity className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#d4af37]" />
          <p className="font-semibold text-slate-300">Tidak ada asesmen aktif ditemukan</p>
          <p className="text-xs mt-1 text-slate-500">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(p => {
            const badge = getStatusBadge(p);
            const timeline = buildDetailedPipeline(p);
            const doneCount = timeline.filter(s => s.status === "done").length;
            const activeStep = timeline.find(s => s.status === "active");

            return (
              <div
                key={p.id}
                onClick={() => handleSelectActiveCase(p.id)}
                className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 hover:border-[#d4af37]/60 transition-colors shadow-lg cursor-pointer group hover:bg-[#0e213b]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${badge.cls}`}>
                        {badge.label}
                      </span>
                      {p.isMendekatiTenggat && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#142642] text-amber-300 border border-amber-600/50 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-400" /> Mendekati Tenggat
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
                      {p.nomorPermohonan}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 shrink-0 text-slate-400" />
                      <span className="truncate font-semibold text-white">{p.terperiksa.namaLengkap}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="shrink-0 text-slate-400">{p.terperiksa.usia} th</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{p.instansiPengaju}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectActiveCase(p.id);
                    }}
                    className="text-xs font-bold text-[#d4af37] bg-[#081224] border border-[#1b3459] group-hover:border-[#d4af37]/60 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <span>Rincian Tahapan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1b3459]">
                  <div className="flex items-center justify-between mb-1.5 text-[11px]">
                    <span className="text-slate-400">
                      Kemajuan: <strong className="text-white font-bold">{doneCount}/{timeline.length}</strong> tahap selesai
                    </span>
                    {activeStep ? (
                      <span className="text-slate-200 flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                        <span>{activeStep.title}</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">Semua Tahap Selesai</span>
                    )}
                  </div>
                  <div className="w-full bg-[#081224] rounded-full h-2 overflow-hidden border border-[#1b3459]">
                    <div
                      className="h-full bg-[#d4af37] rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((doneCount / timeline.length) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
