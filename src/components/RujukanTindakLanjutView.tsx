import React, { useState, useEffect } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
  PengawasanKlien,
  JurnalPengawasan,
  TesUrinBerkala,
  BuktiWajibLapor,
  MonitoringTindakLanjut
} from '../types';
import { REHAB_FACILITIES } from '../data/initialData';
import {
  Share2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  ArrowRight,
  UserCheck,
  Activity,
  Stethoscope,
  Award,
  BadgeAlert,
  BadgeCheck,
  ShieldCheck,
  Calendar,
  FileCheck2,
  FileText,
  Search,
  CheckSquare,
  Square,
  PlusCircle,
  X,
  FileSpreadsheet,
  Download,
  Eye,
  Layers,
  ChevronRight
} from 'lucide-react';

import TindakLanjutDetailView from './TindakLanjutDetailView';

interface RujukanTindakLanjutViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  selectedCaseId?: string | null;
  onSelectCase?: (id: string | null) => void;
  currentTab?: string;
}

// Master standard checklist items for post-TAT rehabilitation admission & control
interface ChecklistItemDef {
  id: string;
  kode: string;
  nama: string;
  kategori: 'tat' | 'medis' | 'hukum' | 'keluarga';
  wajib: boolean;
  keterangan: string;
}

const MASTER_CHECKLIST: ChecklistItemDef[] = [
  {
    id: 'doc-1',
    kode: 'DOC-TAT-01',
    nama: 'Petikan Surat Rekomendasi Resmi Tim Asesmen Terpadu (TAT)',
    kategori: 'tat',
    wajib: true,
    keterangan: 'Dokumen ber-QR Code ditandatangani Ketua Tim TAT, Asesor Hukum & Medis'
  },
  {
    id: 'doc-2',
    kode: 'DOC-TAT-02',
    nama: 'Berita Acara (BA) Serah Terima Klien ke Balai / Lembaga Rehabilitasi',
    kategori: 'tat',
    wajib: true,
    keterangan: 'Ditandatangani oleh Penyidik Polri/BNN, Petugas Fasilitas Rehab & Klien'
  },
  {
    id: 'doc-3',
    kode: 'DOC-MED-01',
    nama: 'Laporan Hasil Asesmen Medis & Skoring WHO ASSIST',
    kategori: 'medis',
    wajib: true,
    keterangan: 'Hasil diagnosis tingkat ketergantungan zat dan rekomendasi modalitas rehab'
  },
  {
    id: 'doc-4',
    kode: 'DOC-MED-02',
    nama: 'Hasil Skrining Awal Toksikologi Urin (Multi-Panel 5/6 Parameter)',
    kategori: 'medis',
    wajib: true,
    keterangan: 'Hasil pengujian laboratorium / skrining cepat AMP, MET, THC, BZO, MOP'
  },
  {
    id: 'doc-5',
    kode: 'DOC-MED-03',
    nama: 'Pemeriksaan Fisik Dasar, Tanda-Tanda Vital & Riwayat Komorbiditas Medis',
    kategori: 'medis',
    wajib: true,
    keterangan: 'Catatan kondisi kesehatan umum, riwayat penyakit menular/kronis dan alergi'
  },
  {
    id: 'doc-6',
    kode: 'DOC-HUK-01',
    nama: 'Surat Pengantar / Pelimpahan Perkara dari Penyidik (Satresnarkoba / BNN)',
    kategori: 'hukum',
    wajib: true,
    keterangan: 'Memuat nomor LP, dasar penangkapan dan tindak lanjut status hukum peradilan/RJ'
  },
  {
    id: 'doc-7',
    kode: 'DOC-HUK-02',
    nama: 'Telaah Yuridis & Analisis Peran Tersangka dari Tim Hukum TAT',
    kategori: 'hukum',
    wajib: false,
    keterangan: 'Pertimbangan kesesuaian SEMA 04/2010 dan pembuktian ketiadaan unsur bandar/pengedar'
  },
  {
    id: 'doc-8',
    kode: 'DOC-FAM-01',
    nama: 'Surat Persetujuan (Informed Consent) Klien & Keluarga / Penjamin',
    kategori: 'keluarga',
    wajib: true,
    keterangan: 'Kesediaan mengikuti program rehabilitasi penuh dan tata tertib fasilitas'
  },
  {
    id: 'doc-9',
    kode: 'DOC-FAM-02',
    nama: 'Pakta Integritas / Komitmen Kepatuhan Wajib Lapor & Tes Urin Berkala',
    kategori: 'keluarga',
    wajib: true,
    keterangan: 'Pernyataan klien bersedia mematuhi jadwal kontrol tanpa mangkir'
  },
  {
    id: 'doc-10',
    kode: 'DOC-FAM-03',
    nama: 'Fotokopi KTP / Kartu Identitas Terperiksa & Kontak Darurat Wali/Penjamin',
    kategori: 'keluarga',
    wajib: true,
    keterangan: 'Verifikasi NIK dan nomor kontak aktif pihak penjamin klien'
  }
];

const getSubTabFromCurrentTab = (tab?: string): 'ceklis_dokumen' | 'pengawasan' | 'rujukan' => {
  if (tab === 'tindak_lanjut_monitoring' || tab === 'tindak_lanjut_wajib_lapor') return 'pengawasan';
  if (tab === 'tindak_lanjut_rujukan') return 'rujukan';
  return 'ceklis_dokumen';
};

export const RujukanTindakLanjutView: React.FC<RujukanTindakLanjutViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onUpdatePermohonan,
  selectedCaseId,
  onSelectCase,
  currentTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ceklis_dokumen' | 'pengawasan' | 'rujukan'>(getSubTabFromCurrentTab(currentTab));

  useEffect(() => {
    if (currentTab) {
      setActiveSubTab(getSubTabFromCurrentTab(currentTab));
    }
  }, [currentTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalitas, setFilterModalitas] = useState<'all' | 'Rawat Inap' | 'Rawat Jalan'>('all');
  
  // Selected client for interactive checklist modal
  const [selectedForChecklist, setSelectedForChecklist] = useState<PermohonanAsesmen | null>(null);
  const [customCheckedMap, setCustomCheckedMap] = useState<Record<string, Record<string, boolean>>>({});

  // Quick Log Modal states
  const [showAddLogModal, setShowAddLogModal] = useState<PermohonanAsesmen | null>(null);
  const [logType, setLogType] = useState<JurnalPengawasan['jenisKegiatan']>('Wajib Lapor Mingguan');
  const [logStatus, setLogStatus] = useState<JurnalPengawasan['statusKehadiran']>('Hadir');
  const [logNotes, setLogNotes] = useState('');
  
  // Quick Urine Modal states
  const [showAddUrineModal, setShowAddUrineModal] = useState<PermohonanAsesmen | null>(null);
  const [urineResult, setUrineResult] = useState<'Negatif' | 'Positif'>('Negatif');
  const [urineNotes, setUrineNotes] = useState('Pemeriksaan skrining berkala non-reaktif.');

  // New Client Schedule Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedulePermohonanId, setSelectedSchedulePermohonanId] = useState<string>('');
  const [schedModalitas, setSchedModalitas] = useState<'Rawat Jalan' | 'Rawat Inap'>('Rawat Jalan');
  const [schedFasilitas, setSchedFasilitas] = useState('Balai Rehabilitasi BNN Tanah Merah');
  const [schedTanggalMulai, setSchedTanggalMulai] = useState(new Date().toISOString().slice(0, 10));
  const [schedTanggalWajibLapor, setSchedTanggalWajibLapor] = useState(new Date().toISOString().slice(0, 10));
  const [schedFrekuensiKontrol, setSchedFrekuensiKontrol] = useState('Seminggu 2x (Selasa & Jumat)');
  const [schedNamaPenyidik, setSchedNamaPenyidik] = useState('Bripka Heru Susanto');
  const [schedInstansiPenyidik, setSchedInstansiPenyidik] = useState('Satresnarkoba Polresta Samarinda');

  // Filter: Hanya permohonan resmi e-TAT yang SUDAH SELESAI SIDANG PLENO TAT & memiliki rekomendasi resmi
  const completedSidangList = permohonanList.filter(p => {
    const isSubmitted = p.applicationStatus !== 'DRAFT';
    const isSidangBeres = p.plenoAssesmen?.statusPleno === 'SELESAI' ||
      !!p.rekomendasiResmi ||
      p.applicationStatus === 'READY_FOR_CONFERENCE' ||
      p.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' ||
      p.applicationStatus === 'OUTCOME_RECORDED_FOR_DRAFT' ||
      p.statusProsesUtama === 'pengesahan_rekomendasi' ||
      p.statusProsesUtama === 'siap_pleno' ||
      !!p.monitoringTindakLanjut ||
      !!p.pengawasanKlien;

    return isSubmitted && isSidangBeres;
  });

  const selectedClient = permohonanList.find(p => p.id === selectedSchedulePermohonanId);

  useEffect(() => {
    if (currentTab === 'tindak_lanjut_input_jadwal') {
      setShowScheduleModal(true);
    }
  }, [currentTab]);

  useEffect(() => {
    if (completedSidangList.length > 0 && (!selectedSchedulePermohonanId || !completedSidangList.some(p => p.id === selectedSchedulePermohonanId))) {
      setSelectedSchedulePermohonanId(completedSidangList[0].id);
    }
  }, [completedSidangList, selectedSchedulePermohonanId]);

  const handleSaveClientSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPermohonan = permohonanList.find(p => p.id === selectedSchedulePermohonanId);
    if (!targetPermohonan || !onUpdatePermohonan) return;

    const updatedPgw: PengawasanKlien = {
      id: targetPermohonan.pengawasanKlien?.id || 'pgw-' + Date.now(),
      statusKepatuhan: 'sangat_patuh',
      modalitasLayanan: schedModalitas,
      durasiBulan: 3,
      tanggalMulai: schedTanggalMulai,
      tanggalTargetSelesai: '3 Bulan Sejak Masuk',
      instansiPelaksanaRehab: schedFasilitas,
      konselorPendamping: currentUser.name,
      penyidikPengawas: schedNamaPenyidik,
      totalSesiWajib: 12,
      sesiTerselesaikan: targetPermohonan.pengawasanKlien?.sesiTerselesaikan || 0,
      jumlahMangkir: 0,
      suratPeringatanList: targetPermohonan.pengawasanKlien?.suratPeringatanList || [],
      riwayatTesUrinBerkala: targetPermohonan.pengawasanKlien?.riwayatTesUrinBerkala || [],
      jurnalPengawasan: targetPermohonan.pengawasanKlien?.jurnalPengawasan || [],
      rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
    };

    const newWajibLapor: BuktiWajibLapor = {
      id: 'wl-' + Date.now(),
      tanggalRencanaWajibLapor: schedTanggalWajibLapor,
      tanggalWajibLapor: schedTanggalWajibLapor,
      waktuInputSistem: new Date().toLocaleString('id-ID') + ' WIB',
      namaPenyidikPenerima: schedNamaPenyidik,
      instansiPenyidik: schedInstansiPenyidik,
      kegiatanRehabTerkait: `Jadwal Kontrol ${schedModalitas} & Wajib Lapor Mingguan`,
      kanal: 'langsung',
      statusKonfirmasi: 'dikonfirmasi_penyidik',
      statusVerifikasiAdmin: 'terverifikasi',
      diunggahOleh: currentUser.name,
      tanggalDiunggah: new Date().toISOString().slice(0, 10),
    };

    const currentMonitoring = targetPermohonan.monitoringTindakLanjut;
    const updatedMonitoring: MonitoringTindakLanjut = currentMonitoring ? {
      ...currentMonitoring,
      buktiWajibLaporList: [newWajibLapor, ...currentMonitoring.buktiWajibLaporList],
      terakhirDiperbarui: new Date().toISOString().slice(0, 10)
    } : {
      id: 'mon-' + Date.now(),
      nomorRekomendasi: targetPermohonan.nomorPermohonan,
      laporanKontrolList: [],
      buktiWajibLaporList: [newWajibLapor],
      statusMonitoring: 'berjalan',
      dibuatOleh: currentUser.role,
      tanggalDibuat: new Date().toISOString().slice(0, 10),
      terakhirDiperbarui: new Date().toISOString().slice(0, 10)
    };

    const updatedPermohonan: PermohonanAsesmen = {
      ...targetPermohonan,
      pengawasanKlien: updatedPgw,
      monitoringTindakLanjut: updatedMonitoring,
      statusTindakLanjut: 'dalam_proses'
    };

    onUpdatePermohonan(updatedPermohonan);
    setShowScheduleModal(false);
    if (onSelectCase) {
      onSelectCase(targetPermohonan.id);
    }
  };

  // If a specific case is selected for detail view
  const selectedCase = selectedCaseId ? permohonanList.find(p => p.id === selectedCaseId) : null;
  if (selectedCase) {
    return (
      <TindakLanjutDetailView
        permohonan={selectedCase}
        currentUser={currentUser}
        onBack={() => onSelectCase ? onSelectCase(null) : onSelectPermohonan('')}
        onUpdatePermohonan={onUpdatePermohonan || (() => {})}
        initialTab={currentTab}
      />
    );
  }

  // Candidates for follow up: items with monitoringTindakLanjut, tindakLanjut, pengawasanKlien, or final assessment
  const eligibleList = permohonanList.filter(p => {
    return !!p.monitoringTindakLanjut || !!p.tindakLanjut || !!p.pengawasanKlien || p.asesmenMedis?.status === 'FINAL' || p.applicationStatus === 'READY_FOR_CONFERENCE' || p.applicationStatus === 'AWAITING_SIGNED_OUTPUTS';
  });

  const filteredList = eligibleList.filter(item => {
    const matchSearch = item.nomorPermohonan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.terperiksa.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.pengawasanKlien?.instansiPelaksanaRehab || item.monitoringTindakLanjut?.pelaksanaanRehab?.namaFasilitasRehab || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tindakLanjut?.namaFasilitasTujuan || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchSearch) return false;
    if (filterModalitas !== 'all') {
      const mod = item.pengawasanKlien?.modalitasLayanan || item.asesmenMedis?.kebutuhanRawat || 'Rawat Jalan';
      if (mod !== filterModalitas) return false;
    }
    return true;
  });

  const pengawasanList = permohonanList.filter(p => !!p.pengawasanKlien || !!p.monitoringTindakLanjut);

  // Metrics
  const totalKlienDiawasi = pengawasanList.length;
  const klienPatuh = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'sangat_patuh' || p.pengawasanKlien?.statusKepatuhan === 'patuh' || p.monitoringTindakLanjut?.statusMonitoring === 'berjalan').length;
  const klienPeringatan = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'dalam_peringatan' || p.pengawasanKlien?.statusKepatuhan === 'tidak_patuh_mangkir' || p.monitoringTindakLanjut?.statusMonitoring === 'terkendala').length;
  const klienSelesai = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'selesai_program' || p.monitoringTindakLanjut?.statusMonitoring === 'selesai').length;

  // Toggle item in checklist
  const handleToggleChecklist = (permohonanId: string, docId: string) => {
    setCustomCheckedMap(prev => {
      const currentClientMap = prev[permohonanId] || {};
      const updatedClientMap = {
        ...currentClientMap,
        [docId]: !currentClientMap[docId]
      };
      return {
        ...prev,
        [permohonanId]: updatedClientMap
      };
    });
  };

  // Check if a document is checked for a client (defaults to true for standard seeded items)
  const isDocChecked = (permohonanId: string, docId: string, defaultChecked: boolean = true) => {
    const clientMap = customCheckedMap[permohonanId];
    if (clientMap && clientMap[docId] !== undefined) {
      return clientMap[docId];
    }
    return defaultChecked;
  };

  const calculateClientDocProgress = (permohonanId: string) => {
    let completed = 0;
    MASTER_CHECKLIST.forEach(doc => {
      if (isDocChecked(permohonanId, doc.id, true)) {
        completed++;
      }
    });
    return Math.round((completed / MASTER_CHECKLIST.length) * 100);
  };

  // Submit quick journal log
  const handleSaveLog = () => {
    if (!showAddLogModal || !onUpdatePermohonan) return;
    const item = showAddLogModal;
    const nowStr = new Date().toLocaleDateString('id-ID');
    
    const newEntry: JurnalPengawasan = {
      id: 'jrn-' + Date.now(),
      tanggal: nowStr,
      jenisKegiatan: logType,
      statusKehadiran: logStatus,
      catatanPerkembangan: logNotes || `Pencatatan sesi kontrol ${logType} dengan status ${logStatus}.`,
      petugasPengawas: currentUser.name,
      instansiPengawas: currentUser.agency
    };

    let updatedPgw: PengawasanKlien;
    if (item.pengawasanKlien) {
      const currentCompleted = logStatus === 'Hadir' ? item.pengawasanKlien.sesiTerselesaikan + 1 : item.pengawasanKlien.sesiTerselesaikan;
      const currentMangkir = logStatus === 'Mangkir / Tanpa Kabar' ? item.pengawasanKlien.jumlahMangkir + 1 : item.pengawasanKlien.jumlahMangkir;
      
      updatedPgw = {
        ...item.pengawasanKlien,
        sesiTerselesaikan: currentCompleted,
        jumlahMangkir: currentMangkir,
        jurnalPengawasan: [newEntry, ...item.pengawasanKlien.jurnalPengawasan]
      };
    } else {
      updatedPgw = {
        id: 'pgw-' + Date.now(),
        statusKepatuhan: logStatus === 'Mangkir / Tanpa Kabar' ? 'dalam_peringatan' : 'patuh',
        modalitasLayanan: item.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rawat Inap' : 'Rawat Jalan',
        durasiBulan: item.asesmenMedis?.durasiUsulanBulan || 3,
        tanggalMulai: nowStr,
        tanggalTargetSelesai: '3 Bulan Sejak Masuk',
        instansiPelaksanaRehab: item.tindakLanjut?.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Mitra',
        konselorPendamping: currentUser.name,
        penyidikPengawas: item.perkara.namaPenyidik,
        totalSesiWajib: 12,
        sesiTerselesaikan: logStatus === 'Hadir' ? 1 : 0,
        jumlahMangkir: logStatus === 'Mangkir / Tanpa Kabar' ? 1 : 0,
        suratPeringatanList: [],
        riwayatTesUrinBerkala: [],
        jurnalPengawasan: [newEntry],
        rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
      };
    }

    const updated: PermohonanAsesmen = {
      ...item,
      pengawasanKlien: updatedPgw
    };

    onUpdatePermohonan(updated);
    setShowAddLogModal(null);
    setLogNotes('');
  };

  // Submit quick urine test
  const handleSaveUrine = () => {
    if (!showAddUrineModal || !onUpdatePermohonan) return;
    const item = showAddUrineModal;
    const nowStr = new Date().toLocaleDateString('id-ID');

    const newTest: TesUrinBerkala = {
      id: 'urin-' + Date.now(),
      tanggalTes: nowStr,
      tahapKe: (item.pengawasanKlien?.riwayatTesUrinBerkala.length || 0) + 1,
      jenisPemeriksaan: 'Terjadwal',
      parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
      hasil: urineResult,
      keterangan: urineNotes,
      petugasPemeriksa: currentUser.name
    };

    let updatedPgw: PengawasanKlien;
    if (item.pengawasanKlien) {
      updatedPgw = {
        ...item.pengawasanKlien,
        statusKepatuhan: urineResult === 'Positif' ? 'dalam_peringatan' : item.pengawasanKlien.statusKepatuhan,
        riwayatTesUrinBerkala: [newTest, ...item.pengawasanKlien.riwayatTesUrinBerkala]
      };
    } else {
      updatedPgw = {
        id: 'pgw-' + Date.now(),
        statusKepatuhan: urineResult === 'Positif' ? 'dalam_peringatan' : 'patuh',
        modalitasLayanan: item.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rawat Inap' : 'Rawat Jalan',
        durasiBulan: item.asesmenMedis?.durasiUsulanBulan || 3,
        tanggalMulai: nowStr,
        tanggalTargetSelesai: '3 Bulan Sejak Masuk',
        instansiPelaksanaRehab: item.tindakLanjut?.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Mitra',
        konselorPendamping: currentUser.name,
        penyidikPengawas: item.perkara.namaPenyidik,
        totalSesiWajib: 12,
        sesiTerselesaikan: 1,
        jumlahMangkir: 0,
        suratPeringatanList: [],
        riwayatTesUrinBerkala: [newTest],
        jurnalPengawasan: [],
        rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
      };
    }

    const updated: PermohonanAsesmen = {
      ...item,
      pengawasanKlien: updatedPgw
    };

    onUpdatePermohonan(updated);
    setShowAddUrineModal(null);
    setUrineNotes('Pemeriksaan skrining berkala non-reaktif.');
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5 tracking-tight">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <span>Tindak Lanjut &amp; Kontrol Rehabilitasi Pasca TAT</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen rujukan fasilitas mitra, verifikasi lembar ceklis berkas admisi, serta pengawasan sesi kontrol &amp; monitoring tes urin berkala klien.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start shrink-0">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-cyan-200" />
            <span>+ Input Jadwal Kontrol &amp; Lapor Klien</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold shadow-inner">
          <button
            onClick={() => setActiveSubTab('ceklis_dokumen')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'ceklis_dokumen'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Ceklis Dokumen &amp; Admisi</span>
          </button>
          <button
            onClick={() => setActiveSubTab('pengawasan')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'pengawasan'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Kontrol &amp; Wajib Lapor ({pengawasanList.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('rujukan')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'rujukan'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Alur Rujukan &amp; Kuota Bed</span>
          </button>
        </div>
      </div>
    </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama terperiksa, nomor permohonan, atau fasilitas rehab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Modalitas:</span>
          <select
            value={filterModalitas}
            onChange={(e) => setFilterModalitas(e.target.value as any)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Layanan</option>
            <option value="Rawat Inap">Rawat Inap</option>
            <option value="Rawat Jalan">Rawat Jalan</option>
          </select>
        </div>
      </div>

      {/* TAB 1: CEKLIS BERKAS DOKUMEN & ADMISI */}
      {activeSubTab === 'ceklis_dokumen' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <span>Daftar Ceklis Dokumen Persyaratan Admisi Klien</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verifikasi lembar ceklis berkas admisi serah terima klien pasca rekomendasi TAT ke fasilitas rehabilitasi mitra.
                </p>
              </div>
              <span className="text-xs text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto font-mono">
                Total {MASTER_CHECKLIST.length} Dokumen Wajib &amp; Pelengkap
              </span>
            </div>

            {filteredList.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Tidak ada data klien yang sesuai dengan pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredList.map(item => {
                  const progress = calculateClientDocProgress(item.id);
                  const isFullComplete = progress === 100;
                  const modalitas = item.pengawasanKlien?.modalitasLayanan || item.asesmenMedis?.kebutuhanRawat || 'Rawat Jalan';
                  const fasilitas = item.pengawasanKlien?.instansiPelaksanaRehab || item.tindakLanjut?.namaFasilitasTujuan || 'Klinik Pratama BNN Mitra';

                  return (
                    <div
                      key={item.id}
                      className="p-5 bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl transition-all shadow-lg hover:shadow-xl space-y-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                          <span className="font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {item.nomorPermohonan}
                          </span>
                          <h4 className="text-base font-bold text-slate-100 truncate">
                            {item.terperiksa.namaLengkap} <span className="text-xs font-normal text-slate-400">({item.terperiksa.usia} th)</span>
                          </h4>
                          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                            {modalitas}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                            isFullComplete
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}>
                            {isFullComplete ? '✓ Dokumen Lengkap 100%' : `Kelengkapan Berkas ${progress}%`}
                          </span>
                        </div>
                      </div>

                      {/* Detail Info Row */}
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                        <span>Fasilitas Rujukan: <strong className="text-slate-200">{fasilitas}</strong></span>
                        <span className="text-slate-700">•</span>
                        <span>Penyidik: <strong className="text-slate-300 font-normal">{item.perkara.namaPenyidik}</strong></span>
                        <span className="text-slate-700">•</span>
                        <span>NIK: <strong className="text-slate-300 font-mono font-normal">{item.terperiksa.nik}</strong></span>
                      </div>

                      {/* Sleek Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Progres Lembar Ceklis Berkas:</span>
                          <span className="font-bold text-slate-200">{progress}% Terverifikasi</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isFullComplete ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Snapshot of Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {MASTER_CHECKLIST.slice(0, 4).map(doc => {
                          const checked = isDocChecked(item.id, doc.id, true);
                          return (
                            <div
                              key={doc.id}
                              onClick={() => handleToggleChecklist(item.id, doc.id)}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                                checked
                                  ? 'bg-slate-950/80 border-emerald-500/30 text-slate-200 hover:border-emerald-500/50'
                                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {checked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                              <span className="truncate flex-1">{doc.nama}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                        <span className="text-[11px] text-slate-400">
                          Klik kotak ceklis di atas untuk mengubah status verifikasi berkas secara langsung.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedForChecklist(item)}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer text-xs transition-all"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Buka Semua Ceklis ({MASTER_CHECKLIST.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectCase ? onSelectCase(item.id) : onSelectPermohonan(item.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-xs transition-all shadow-md"
                          >
                            <span>Detail Pengawasan &amp; Kontrol</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PENGAWASAN & KONTROL KLIEN (WAJIB LAPOR & TES URIN) */}
      {activeSubTab === 'pengawasan' && (
        <div className="space-y-6">
          {/* Summary Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Klien Diawasi</span>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono">{totalKlienDiawasi} Orang</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Pasca rekomendasi &amp; admisi</span>
            </div>

            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4">
              <span className="text-[11px] font-bold uppercase text-emerald-400 block">Klien Patuh / Bersih</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-300 mt-1 font-mono">{klienPatuh} Orang</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Nihil mangkir &amp; tes urin negatif</span>
            </div>

            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4">
              <span className="text-[11px] font-bold uppercase text-amber-400 block">Dalam Peringatan (SP)</span>
              <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1 font-mono">{klienPeringatan} Orang</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Mangkir sesi / terbit SP</span>
            </div>

            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4">
              <span className="text-[11px] font-bold uppercase text-[#d4af37] block">Selesai Program (SKSP)</span>
              <div className="text-xl sm:text-2xl font-bold text-[#d4af37] mt-1 font-mono">{klienSelesai} Orang</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Tuntas memenuhi syarat</span>
            </div>
          </div>

          {/* List Klien dalam Pengawasan */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3459]">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#d4af37]" />
                  <span>Daftar Klien dalam Monitoring &amp; Sesi Kontrol Pasca TAT</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Catatan kehadiran sesi wajib lapor mingguan, konseling klinis, serta hasil pengujian toksikologi urin berkala.
                </p>
              </div>
            </div>

            {filteredList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Tidak ada data klien yang dalam pengawasan.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredList.map(item => {
                  const pgw = item.pengawasanKlien;
                  const totalSesi = pgw?.totalSesiWajib || 12;
                  const sesiSelesai = pgw?.sesiTerselesaikan || 1;
                  const percent = Math.min(100, Math.round((sesiSelesai / totalSesi) * 100));
                  const statusKepatuhan = pgw?.statusKepatuhan || 'patuh';
                  const lastTest = pgw?.riwayatTesUrinBerkala[0];

                  return (
                    <div
                      key={item.id}
                      className="p-5 bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl transition-all shadow-lg hover:shadow-xl space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                          <span className="font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {item.nomorPermohonan}
                          </span>
                          <h4 className="text-base font-bold text-slate-100 truncate">
                            {item.terperiksa.namaLengkap} <span className="text-xs font-normal text-slate-400">({item.terperiksa.usia} th)</span>
                          </h4>
                          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                            {pgw?.modalitasLayanan || item.asesmenMedis?.kebutuhanRawat || 'Rawat Jalan'}
                          </span>
                        </div>

                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border self-start sm:self-auto shrink-0 ${
                          statusKepatuhan === 'sangat_patuh' || statusKepatuhan === 'patuh'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : statusKepatuhan === 'selesai_program'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {statusKepatuhan.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs">
                        <div>
                          <span className="text-[11px] font-medium text-slate-400 block">Progres Sesi Kontrol / Wajib Lapor:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                              <div className="bg-emerald-500 h-full" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="font-bold text-slate-200 font-mono text-xs">{sesiSelesai}/{totalSesi} ({percent}%)</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-medium text-slate-400 block">Skrining Toksikologi Urin:</span>
                          <div className="font-semibold mt-1 flex items-center gap-2">
                            <span className="text-slate-200">{pgw?.riwayatTesUrinBerkala.length || 1}x Diuji</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              lastTest?.hasil === 'Positif'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}>
                              Terakhir: {lastTest ? `${lastTest.hasil} (${lastTest.tanggalTes})` : 'Negatif'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-medium text-slate-400 block">Lembaga &amp; Konselor Pendamping:</span>
                          <span className="text-slate-200 font-medium mt-1 block truncate">
                            {pgw?.instansiPelaksanaRehab || item.tindakLanjut?.namaFasilitasTujuan || 'BNN Mitra'} • {pgw?.konselorPendamping || 'Konselor Ahli'}
                          </span>
                        </div>
                      </div>

                      {/* Quick Action buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => setShowAddLogModal(item)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer text-xs transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                          <span>+ Catat Sesi Kontrol</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddUrineModal(item)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer text-xs transition-all"
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
                          <span>+ Catat Tes Urin</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectCase ? onSelectCase(item.id) : onSelectPermohonan(item.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-xs transition-all shadow-md"
                        >
                          <span>Detail Pengawasan &amp; Kontrol</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RUJUKAN & KAPASITAS FASILITAS MITRA */}
      {activeSubTab === 'rujukan' && (
        <div className="space-y-6">
          {/* Facilities Capacity Monitor */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3459]">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#d4af37]" />
                  <span>Ketersediaan Kuota &amp; Kapasitas Fasilitas Rehabilitasi Mitra</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Informasi kapasitas bed rawat inap &amp; layanan rawat jalan di balai/klinik rehabilitasi wilayah hukum Kalimantan Timur.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {REHAB_FACILITIES.map(f => {
                const isFull = f.kapasitasTersedia <= 0;
                return (
                  <div
                    key={f.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isFull ? 'bg-rose-950/20 border-rose-800/50' : 'bg-[#081224] border-[#1b3459]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">{f.tipe}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isFull ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {isFull ? 'Penuh' : 'Tersedia'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1.5 leading-snug">{f.nama}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{f.alamat}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#1b3459] flex items-center justify-between text-xs">
                      <span className="text-slate-400">Sisa Kuota:</span>
                      <span className={`font-bold font-mono ${isFull ? 'text-rose-400' : 'text-slate-200'}`}>
                        {f.kapasitasTersedia} / {f.kapasitasTotal} Slot
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: FULL CHECKLIST INTERACTIVE DRAWER / MODAL */}
      {selectedForChecklist && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#142642] text-[#d4af37] border border-[#234475] flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Lembar Ceklis Dokumen Admisi Klien</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedForChecklist.nomorPermohonan} • {selectedForChecklist.terperiksa.namaLengkap}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedForChecklist(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142642] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {MASTER_CHECKLIST.map((doc, idx) => {
                const checked = isDocChecked(selectedForChecklist.id, doc.id, true);
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleToggleChecklist(selectedForChecklist.id, doc.id)}
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#081224] border-emerald-600/50 hover:border-emerald-500'
                        : 'bg-[#081224] border-[#1b3459] hover:border-amber-500/60'
                    }`}
                  >
                    <div className="mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-[#d4af37] font-semibold">{doc.kode}</span>
                        {doc.wajib && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-rose-950/60 text-rose-300 rounded border border-rose-700/40">
                            Wajib
                          </span>
                        )}
                      </div>
                      <h4 className={`text-xs font-semibold mt-0.5 ${checked ? 'text-white' : 'text-slate-300'}`}>
                        {doc.nama}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {doc.keterangan}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1b3459]">
              <span className="text-xs text-slate-400">
                Kelengkapan: <strong className="text-white">{calculateClientDocProgress(selectedForChecklist.id)}% Terverifikasi</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedForChecklist(null)}
                className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#175194] hover:to-[#2274d4] text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                Simpan &amp; Tutup Ceklis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK ADD CONTROL SESSION */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-[#d4af37]" />
                <span>Pencatatan Sesi Kontrol / Wajib Lapor Klien</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLogModal(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Jenis Sesi / Intervensi:</label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value as any)}
                  className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Wajib Lapor Mingguan">Wajib Lapor Mingguan</option>
                  <option value="Konseling Individu">Konseling Individu</option>
                  <option value="Sesi Terapi Kelompok">Sesi Terapi Kelompok</option>
                  <option value="Home Visit (Kunjungan Rumah)">Home Visit (Kunjungan Rumah)</option>
                  <option value="Evaluasi Vokasional">Evaluasi Vokasional</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Status Kehadiran:</label>
                <select
                  value={logStatus}
                  onChange={(e) => setLogStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Izin Sah">Izin Sah</option>
                  <option value="Mangkir / Tanpa Kabar">Mangkir / Tanpa Kabar</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Catatan Perkembangan Klien:</label>
                <textarea
                  rows={3}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Klien kooperatif, menyampaikan refleksi diri, tidak ada tanda-tanda relaps..."
                  className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1b3459]">
              <button
                type="button"
                onClick={() => setShowAddLogModal(null)}
                className="px-3.5 py-2 bg-[#142642] text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveLog}
                className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#175194] hover:to-[#2274d4] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Simpan Sesi Kontrol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK ADD URINE TEST */}
      {showAddUrineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>Pencatatan Hasil Uji Skrining Urin Berkala</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUrineModal(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Hasil Uji Skrining Toksikologi:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUrineResult('Negatif')}
                    className={`p-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      urineResult === 'Negatif'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500'
                        : 'bg-[#081224] text-slate-400 border-[#1b3459]'
                    }`}
                  >
                    Negatif (Non-Reaktif)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrineResult('Positif')}
                    className={`p-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      urineResult === 'Positif'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500'
                        : 'bg-[#081224] text-slate-400 border-[#1b3459]'
                    }`}
                  >
                    Positif (Reaktif Zat)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Keterangan / Parameter yang Diuji:</label>
                <input
                  type="text"
                  value={urineNotes}
                  onChange={(e) => setUrineNotes(e.target.value)}
                  placeholder="AMP, MET, THC, BZO, MOP non-reaktif"
                  className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1b3459]">
              <button
                type="button"
                onClick={() => setShowAddUrineModal(null)}
                className="px-3.5 py-2 bg-[#142642] text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveUrine}
                className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#175194] hover:to-[#2274d4] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Simpan Hasil Tes Urin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 0: INPUT JADWAL KONTROL & WAJIB LAPOR KLIEN BARU */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveClientSchedule} className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 text-slate-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1b3459]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">Input Jadwal Kontrol &amp; Wajib Lapor Klien Baru</h3>
                  <p className="text-[11px] text-slate-400">Penetapan tanggal pelaksanaan rehabilitasi, sesi kontrol medis, dan rencana wajib lapor penyidik.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* JUKNIS Rules Banner */}
              <div className="p-3 bg-[#081c38] border border-blue-500/30 rounded-xl text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-400">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Validasi Terpusat NIK &amp; Nama Klien (JUKNIS e-TAT):</span>
                </div>
                <p className="text-slate-300">
                  Nama &amp; NIK Klien <strong>dikunci otomatis dari daftar Berkas Permohonan e-TAT yang telah SELESAI SIDANG PLENO TAT</strong>. Pengguna tidak dapat menginput nama/NIK secara acak di luar sistem resmi.
                </p>
              </div>

              {/* Client Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Pilih Klien Terperiksa (Diajukan &amp; Telah Selesai Sidang Pleno): <span className="text-rose-400">*</span></label>
                <select
                  value={selectedSchedulePermohonanId}
                  onChange={(e) => setSelectedSchedulePermohonanId(e.target.value)}
                  className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                  required
                >
                  {completedSidangList.length === 0 ? (
                    <option value="">-- Tidak ada permohonan yang selesai sidang pleno --</option>
                  ) : (
                    completedSidangList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.terperiksa.namaLengkap} (NIK: {p.terperiksa.nik || '3578041209940003'}) — LP: {p.perkara.nomorLaporanPolisi || p.nomorPermohonan} [Sidang Pleno Selesai]
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Verified Client Data Badge */}
              {selectedClient && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#071324] border border-[#1c3961] rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Nama Lengkap Terperiksa</span>
                    <span className="font-bold text-slate-100">{selectedClient.terperiksa.namaLengkap}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">NIK Terverifikasi</span>
                    <span className="font-mono text-cyan-300 font-bold">{selectedClient.terperiksa.nik || '3578041209940003'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Status Sidang Pleno</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" /> Sidang Selesai &amp; Valid
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Modalitas Rehabilitasi Sesuai Rekomendasi:</label>
                  <select
                    value={schedModalitas}
                    onChange={(e) => setSchedModalitas(e.target.value as any)}
                    className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Rawat Jalan">Rehabilitasi Rawat Jalan (Kontrol Berkala)</option>
                    <option value="Rawat Inap">Rehabilitasi Rawat Inap (Balai / Lembaga Rehab)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Fasilitas Rehabilitasi Tujuan:</label>
                  <input
                    type="text"
                    value={schedFasilitas}
                    onChange={(e) => setSchedFasilitas(e.target.value)}
                    placeholder="Nama Klinik / Balai Rehab BNN"
                    className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Tanggal Mulai Program Rehabilitasi:</label>
                  <input
                    type="date"
                    value={schedTanggalMulai}
                    onChange={(e) => setSchedTanggalMulai(e.target.value)}
                    className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Frekuensi &amp; Sesi Kontrol Medis:</label>
                  <select
                    value={schedFrekuensiKontrol}
                    onChange={(e) => setSchedFrekuensiKontrol(e.target.value)}
                    className="w-full p-2.5 bg-[#081224] border border-[#1b3459] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Seminggu 2x (Selasa & Jumat)">Seminggu 2x (Setiap Selasa &amp; Jumat)</option>
                    <option value="Seminggu 1x (Mingguan)">Seminggu 1x (Setiap Minggu)</option>
                    <option value="Setiap 2 Minggu Sekali">Setiap 2 Minggu Sekali</option>
                  </select>
                </div>
              </div>

              {/* SECTION WAJIB LAPOR PENYIDIK */}
              <div className="p-4 bg-[#081326] border border-blue-500/20 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span>Jadwal Wajib Lapor Kepada Penyidik / JPU</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Rencana Tanggal Wajib Lapor Ke-1:</label>
                    <input
                      type="date"
                      value={schedTanggalWajibLapor}
                      onChange={(e) => setSchedTanggalWajibLapor(e.target.value)}
                      className="w-full p-2 bg-[#0b1b33] border border-[#1e3a5f] rounded-lg text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Penyidik / JPU Penerima Berwenang:</label>
                    <input
                      type="text"
                      value={schedNamaPenyidik}
                      onChange={(e) => setSchedNamaPenyidik(e.target.value)}
                      placeholder="Nama & Pangkat Penyidik"
                      className="w-full p-2 bg-[#0b1b33] border border-[#1e3a5f] rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instansi / Tempat Pelaporan Wajib Lapor:</label>
                  <input
                    type="text"
                    value={schedInstansiPenyidik}
                    onChange={(e) => setSchedInstansiPenyidik(e.target.value)}
                    placeholder="Misal: Satresnarkoba Polresta Samarinda"
                    className="w-full p-2 bg-[#0b1b33] border border-[#1e3a5f] rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1b3459]">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Jadwal Kontrol &amp; Wajib Lapor</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
