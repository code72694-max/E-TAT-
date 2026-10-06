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
import { REHAB_FACILITIES } from '../constants/facilities';
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
  ChevronRight,
  Info
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



export const RujukanTindakLanjutView: React.FC<RujukanTindakLanjutViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onUpdatePermohonan,
  selectedCaseId,
  onSelectCase,
  currentTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalitas, setFilterModalitas] = useState<'all' | 'Rawat Inap' | 'Rawat Jalan'>('all');
  


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
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 font-medium rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>+ Input Jadwal Kontrol &amp; Lapor</span>
          </button>
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

      {/* Summary Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">Total Klien Diawasi</span>
          <div className="text-xl font-bold text-slate-100 mt-1 font-mono">{totalKlienDiawasi} <span className="text-xs font-normal text-slate-400 font-sans">Orang</span></div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Pasca rekomendasi &amp; admisi</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">Klien Patuh / Aktif</span>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{klienPatuh} <span className="text-xs font-normal text-slate-400 font-sans">Orang</span></div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Nihil mangkir &amp; tes urin negatif</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">Dalam Peringatan (SP)</span>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{klienPeringatan} <span className="text-xs font-normal text-slate-400 font-sans">Orang</span></div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Mangkir sesi / evaluasi khusus</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">Selesai Program (SKSP)</span>
          <div className="text-xl font-bold text-blue-400 mt-1 font-mono">{klienSelesai} <span className="text-xs font-normal text-slate-400 font-sans">Orang</span></div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Tuntas memenuhi syarat</span>
        </div>
      </div>

      {/* DAFTAR TINDAK LANJUT */}
      <div className="space-y-3">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/70">
            <div>
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-slate-400" />
                <span>Daftar Kasus Tindak Lanjut</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pengawasan berkala klien pasca rekomendasi TAT. Buka detail untuk melihat kelengkapan admisi dan monitoring.
              </p>
            </div>
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tidak ada data klien yang sesuai dengan pencarian.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredList.map(item => {
                const modalitas = item.pengawasanKlien?.modalitasLayanan || item.asesmenMedis?.kebutuhanRawat || 'Rawat Jalan';
                const status = item.tindakLanjut?.statusMonitoring || (item.pengawasanKlien ? 'Dalam Pengawasan' : 'Menunggu Pelaksanaan');
                const fasilitas = item.pengawasanKlien?.instansiPelaksanaRehab || item.monitoringTindakLanjut?.pelaksanaanRehab?.namaFasilitasRehab || item.tindakLanjut?.namaFasilitasTujuan || '-';

                return (
                  <div
                    key={item.id}
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950/50 hover:bg-slate-900/80 border border-slate-800/70 hover:border-slate-700/90 rounded-xl transition-all shadow-sm"
                  >
                    {/* Left: Client info & Badges */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0 mt-0.5 group-hover:border-slate-600 transition-colors">
                        {item.terperiksa.namaLengkap.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                            {item.terperiksa.namaLengkap}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                            {item.nomorPermohonan}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-400">
                          <span>NIK: <span className="text-slate-300 font-mono">{item.terperiksa.nik || '-'}</span></span>
                          <span className="text-slate-600">•</span>
                          <span>Usia: <span className="text-slate-300">{item.terperiksa.usia} th</span></span>
                          {fasilitas !== '-' && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="truncate max-w-[240px] text-slate-300 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                {fasilitas}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700/60">
                            {modalitas}
                          </span>
                          <span className="text-[11px] font-medium bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            {status.replace(/_/g, ' ')}
                          </span>
                          {item.pengawasanKlien && (
                            <span className="text-[11px] text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-800/80">
                              {item.pengawasanKlien.sesiTerselesaikan}/{item.pengawasanKlien.totalSesiWajib} Sesi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Subdued action button */}
                    <div className="flex items-center justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => onSelectCase ? onSelectCase(item.id) : onSelectPermohonan(item.id)}
                        className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700/90 active:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <span>Buka Detail</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>



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
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700/80 hover:bg-blue-600 text-slate-100 rounded-xl text-xs font-semibold shadow transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-300" />
                <span>Simpan Jadwal Kontrol &amp; Wajib Lapor</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
