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
import { isSuspectExaminedByMedis } from '../utils/medisAuth';
import { tindakLanjutApi } from '../services/api';
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
  Info,
  QrCode
} from 'lucide-react';

import TindakLanjutDetailView from './TindakLanjutDetailView';
import { SuratPengantarTersangkaModal } from './SuratPengantarTersangkaModal';
import { getKodeLacakRehab, normalizeSearchCode } from '../utils/getKodeLacak';
import { InputJadwalKontrolView } from './InputJadwalKontrolView';
import { getPascaRehabSchedule } from './RehabilitasiPascaRehabView';

interface RujukanTindakLanjutViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onUpdatePermohonan?: (updated: PermohonanAsesmen) => void;
  selectedCaseId?: string | null;
  onSelectCase?: (id: string | null) => void;
  currentTab?: string;
  onNavigateToInputJadwal?: (caseId?: string) => void;
  onNavigateToPascaRehab?: (caseId?: string) => void;
}



export const RujukanTindakLanjutView: React.FC<RujukanTindakLanjutViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onUpdatePermohonan,
  selectedCaseId,
  onSelectCase,
  currentTab,
  onNavigateToInputJadwal,
  onNavigateToPascaRehab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalitas, setFilterModalitas] = useState<'all' | 'Rawat Inap' | 'Rawat Jalan'>('all');
  const [subTab, setSubTab] = useState<'antrean_pleno' | 'monitoring'>('antrean_pleno');
  const [suratPengantarItem, setSuratPengantarItem] = useState<PermohonanAsesmen | null>(null);

  // Input Jadwal Kontrol Page states
  const [isInputJadwalPage, setIsInputJadwalPage] = useState(false);
  const [inputJadwalTargetId, setInputJadwalTargetId] = useState<string | null>(null);

  const handleOpenInputJadwal = (caseId?: string) => {
    if (onNavigateToInputJadwal) {
      onNavigateToInputJadwal(caseId);
    } else {
      setInputJadwalTargetId(caseId || null);
      setIsInputJadwalPage(true);
    }
  };

  // Filter: Hanya permohonan resmi e-TAT yang SUDAH SELESAI SIDANG PLENO TAT & memiliki rekomendasi resmi
  // - PENGAJU: milik pengaju yang login
  // - MEDIS: hanya tersangka yang diperiksa oleh dokter/bagian medis yang login
  const isPengajuRole = currentUser.role?.toUpperCase() === 'PENGAJU';
  const isMedisRole = currentUser.role?.toUpperCase() === 'MEDIS';
  const checkOwner = (p: PermohonanAsesmen) => {
    if (isPengajuRole) {
      return (
        p.pengajuId === currentUser.id ||
        (p.pengajuEmail && currentUser.email && p.pengajuEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (p.pengajuNama && p.pengajuNama.toLowerCase().includes((currentUser.name || '').toLowerCase())) ||
        (p.perkara?.namaPenyidik && p.perkara.namaPenyidik.toLowerCase().includes((currentUser.name || '').toLowerCase())) ||
        (p.instansiPengaju && currentUser.agency && p.instansiPengaju.toLowerCase().includes(currentUser.agency.toLowerCase())) ||
        (p.instansiPengaju && currentUser.instansi && p.instansiPengaju.toLowerCase().includes(currentUser.instansi.toLowerCase())) ||
        Boolean(p.tindakLanjutDiteruskan)
      );
    }
    if (isMedisRole) {
      return isSuspectExaminedByMedis(p, currentUser);
    }
    return true;
  };

  const completedSidangList = permohonanList.filter(p => {
    if (!checkOwner(p)) return false;

    const isSubmitted = p.applicationStatus !== 'DRAFT';
    const isSidangBeres = p.sidangPleno?.statusPleno === 'selesai_sepakat' ||
      (p.sidangPleno?.statusPleno as string) === 'SELESAI' ||
      (p.sidangPleno?.statusPleno as string) === 'selesai' ||
      (p.plenoAssesmen?.statusPleno as string) === 'SELESAI' ||
      Boolean(p.sidangPleno?.nomorBeritaAcara) ||
      Boolean(p.sidangPleno?.fileBeritaAcaraSigned) ||
      Boolean(p.tindakLanjutDiteruskan) ||
      !!p.rekomendasiResmi ||
      p.applicationStatus === 'READY_FOR_CONFERENCE' ||
      p.applicationStatus === 'CONFERENCE_HELD' ||
      p.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' ||
      p.applicationStatus === 'OUTCOME_RECORDED_FOR_DRAFT' ||
      p.applicationStatus === 'RESULTS_ISSUED' ||
      p.statusProsesUtama === 'pengesahan_rekomendasi' ||
      p.statusProsesUtama === 'rekomendasi_terbit' ||
      p.statusProsesUtama === 'selesai_tindak_lanjut' ||
      p.statusProsesUtama === 'siap_pleno' ||
      !!p.monitoringTindakLanjut ||
      !!p.pengawasanKlien;

    return isSubmitted && isSidangBeres;
  });
  // Jika sedang mode halaman input jadwal kontrol & lapor
  if (isInputJadwalPage) {
    return (
      <InputJadwalKontrolView
        permohonanList={permohonanList}
        currentUser={currentUser}
        initialCaseId={inputJadwalTargetId || undefined}
        onUpdatePermohonan={onUpdatePermohonan || (() => {})}
        onNavigateToMonitoring={(caseId) => {
          setIsInputJadwalPage(false);
          setInputJadwalTargetId(null);
          if (onSelectCase) onSelectCase(caseId);
          else onSelectPermohonan(caseId);
        }}
        onBack={() => {
          setIsInputJadwalPage(false);
          setInputJadwalTargetId(null);
        }}
      />
    );
  }

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
    if (!checkOwner(p)) return false;
    return !!p.monitoringTindakLanjut || !!p.tindakLanjut || !!p.pengawasanKlien || p.asesmenMedis?.status === 'FINAL' || p.applicationStatus === 'READY_FOR_CONFERENCE' || p.applicationStatus === 'AWAITING_SIGNED_OUTPUTS';
  });

  // Kasus yang selesai pleno dan harus / sedang ditindaklanjuti
  const antreanPlenoList = permohonanList.filter(p => {
    if (!checkOwner(p)) return false;
    const isPlenoSelesai = p.sidangPleno?.statusPleno === 'selesai_sepakat' ||
      (p.sidangPleno?.statusPleno as string) === 'SELESAI' ||
      (p.sidangPleno?.statusPleno as string) === 'selesai' ||
      Boolean(p.sidangPleno?.nomorBeritaAcara) ||
      Boolean(p.tindakLanjutDiteruskan) ||
      p.statusProsesUtama === 'pengesahan_rekomendasi' ||
      p.statusProsesUtama === 'selesai_tindak_lanjut' ||
      p.applicationStatus === 'RESULTS_ISSUED' ||
      p.applicationStatus === 'CONFERENCE_HELD' ||
      Boolean(p.sidangPleno?.kesepakatanRekomendasi);
    return isPlenoSelesai;
  });

  const filteredAntreanList = antreanPlenoList.filter(item => {
    const q = searchTerm.toLowerCase();
    const qClean = normalizeSearchCode(q);
    const kode = getKodeLacakRehab(item).toLowerCase();
    const cleanKode = normalizeSearchCode(kode);

    const matchSearch = item.nomorPermohonan.toLowerCase().includes(q) ||
      normalizeSearchCode(item.nomorPermohonan).includes(qClean) ||
      item.terperiksa.namaLengkap.toLowerCase().includes(q) ||
      (item.terperiksa.nik && item.terperiksa.nik.includes(q)) ||
      (item.sidangPleno?.kesepakatanRekomendasi || '').toLowerCase().includes(q) ||
      (item.sidangPleno?.fasilitasRujukanUsulan || item.tindakLanjut?.namaFasilitasTujuan || '').toLowerCase().includes(q) ||
      kode.includes(q) ||
      (cleanKode && qClean && (cleanKode.includes(qClean) || qClean.includes(cleanKode)));
    if (!matchSearch) return false;
    if (filterModalitas !== 'all') {
      const mod = item.sidangPleno?.kesepakatanRekomendasi?.toLowerCase().includes('inap') ? 'Rawat Inap' : 'Rawat Jalan';
      if (mod !== filterModalitas) return false;
    }
    return true;
  });

  const filteredList = eligibleList.filter(item => {
    const q = searchTerm.toLowerCase();
    const qClean = normalizeSearchCode(q);
    const kode = getKodeLacakRehab(item).toLowerCase();
    const cleanKode = normalizeSearchCode(kode);

    const matchSearch = item.nomorPermohonan.toLowerCase().includes(q) ||
      normalizeSearchCode(item.nomorPermohonan).includes(qClean) ||
      item.terperiksa.namaLengkap.toLowerCase().includes(q) ||
      (item.terperiksa.nik && item.terperiksa.nik.includes(q)) ||
      (item.pengawasanKlien?.instansiPelaksanaRehab || item.monitoringTindakLanjut?.pelaksanaanRehab?.namaFasilitasRehab || '').toLowerCase().includes(q) ||
      (item.tindakLanjut?.namaFasilitasTujuan || '').toLowerCase().includes(q) ||
      kode.includes(q) ||
      (cleanKode && qClean && (cleanKode.includes(qClean) || qClean.includes(cleanKode)));
    
    if (!matchSearch) return false;
    if (filterModalitas !== 'all') {
      const mod = item.pengawasanKlien?.modalitasLayanan || item.asesmenMedis?.kebutuhanRawat || 'Rawat Jalan';
      if (mod !== filterModalitas) return false;
    }
    return true;
  });

  const pengawasanList = permohonanList.filter(p => checkOwner(p) && (!!p.pengawasanKlien || !!p.monitoringTindakLanjut));

  // Metrics
  const totalKlienDiawasi = pengawasanList.length;
  const klienPatuh = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'sangat_patuh' || p.pengawasanKlien?.statusKepatuhan === 'patuh' || p.monitoringTindakLanjut?.statusMonitoring === 'berjalan').length;
  const klienPeringatan = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'dalam_peringatan' || p.pengawasanKlien?.statusKepatuhan === 'tidak_patuh_mangkir' || p.monitoringTindakLanjut?.statusMonitoring === 'terkendala').length;
  const klienSelesai = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'selesai_program' || p.monitoringTindakLanjut?.statusMonitoring === 'selesai').length;



  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Modal Dokumen Surat Tersangka */}
      {suratPengantarItem && (
        <SuratPengantarTersangkaModal
          permohonan={suratPengantarItem}
          currentUser={currentUser}
          onClose={() => setSuratPengantarItem(null)}
        />
      )}

      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5 tracking-tight">
            <div className="p-2 bg-slate-800 border border-slate-700/80 text-slate-300 rounded-xl">
              <Share2 className="w-4 h-4" />
            </div>
            <span>Tindak Lanjut &amp; Kontrol Rehabilitasi Pasca TAT</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Daftar kasus yang harus ditindaklanjuti pasca sidang pleno, penerbitan dokumen rujukan tersangka, dan monitoring sesi kontrol/urin berkala.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start shrink-0">
          <button
            onClick={() => handleOpenInputJadwal()}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm border border-blue-500/30"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-200" />
            <span>+ Input Jadwal Kontrol &amp; Lapor</span>
          </button>
        </div>
      </div>

      {/* SUB-MENU TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm">
        <button
          type="button"
          onClick={() => setSubTab('antrean_pleno')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs transition-all cursor-pointer ${
            subTab === 'antrean_pleno'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-slate-300" />
          <span>Daftar Harus Ditindaklanjuti (Selesai Pleno)</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
            subTab === 'antrean_pleno' ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-slate-400'
          }`}>
            {antreanPlenoList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('monitoring')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs transition-all cursor-pointer ${
            subTab === 'monitoring'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-slate-300" />
          <span>Monitoring Pengawasan Klien Aktif</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
            subTab === 'monitoring' ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-slate-400'
          }`}>
            {pengawasanList.length}
          </span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={subTab === 'antrean_pleno' ? "Cari nama terperiksa, no permohonan, kode lacak rehab, fasilitas..." : "Cari nama terperiksa, nomor permohonan, atau fasilitas rehab..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Modalitas:</span>
          <select
            value={filterModalitas}
            onChange={(e) => setFilterModalitas(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-slate-600 cursor-pointer"
          >
            <option value="all">Semua Layanan</option>
            <option value="Rawat Inap">Rawat Inap</option>
            <option value="Rawat Jalan">Rawat Jalan</option>
          </select>
        </div>
      </div>

      {/* TAB 1: ANTREAN KASUS SELESAI PLENO (DAFTAR YANG HARUS DITINDAKLANJUTI) */}
      {subTab === 'antrean_pleno' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/70">
              <div>
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <span>Daftar Kasus Selesai Sidang Pleno (Harus Ditindaklanjuti)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tersangka yang telah selesai sidang pleno &amp; Berita Acara tertandatangani. Berikan surat pengantar rujukan kepada tersangka, jadwalkan kontrol, atau teruskan admisi fasilitas mitra.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 self-start sm:self-auto bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                {filteredAntreanList.length} Berkas Siap Tindak Lanjut
              </span>
            </div>

            {filteredAntreanList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <FileCheck2 className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Tidak ada berkas selesai pleno yang sesuai dengan kriteria pencarian.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredAntreanList.map(item => {
                  const kodeLacak = (item as any).kodeLacakRehab || (item.tindakLanjut as any)?.kodeLacakRehab || `RHB-${item.id.slice(-6).toUpperCase()}`;
                  const rekomendasi = item.sidangPleno?.kesepakatanRekomendasi || 'Rehabilitasi Medis dan Sosial';
                  const isRawatInap = rekomendasi.toLowerCase().includes('inap');
                  const fasilitas = item.tindakLanjut?.namaFasilitasTujuan || item.sidangPleno?.fasilitasRujukanUsulan || 'Balai Besar Rehabilitasi BNN Tanah Merah';
                  const isDiteruskan = Boolean(item.tindakLanjutDiteruskan || (item.tindakLanjut && item.tindakLanjut.statusRujukan));

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectCase ? onSelectCase(item.id) : onSelectPermohonan(item.id)}
                      className="p-4 sm:p-5 bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all shadow-sm space-y-3.5 cursor-pointer"
                    >
                      {/* Top Row: Client Info & Status Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {item.terperiksa.namaLengkap.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-100">
                                {item.terperiksa.namaLengkap}
                              </h4>
                              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                                {item.nomorPermohonan}
                              </span>
                              {isDiteruskan ? (
                                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Diteruskan ke Tindak Lanjut</span>
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span>Perlu Diteruskan</span>
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                              <span>NIK: <span className="text-slate-300 font-mono">{item.terperiksa.nik || '-'}</span></span>
                              <span className="text-slate-600">•</span>
                              <span>Usia: <span className="text-slate-300">{item.terperiksa.usia} th</span></span>
                              <span className="text-slate-600">•</span>
                              <span>Penyidik: <span className="text-slate-300">{item.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju Satresnarkoba'}</span></span>
                            </div>
                          </div>
                        </div>

                        {/* Kode Lacak Rehab Badge (Bisa dilacak di Portal Lacak Berkas) */}
                        <div className="sm:self-start">
                          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono shadow-sm">
                            <QrCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase font-sans font-medium text-slate-400 block leading-tight">Kode Akses Pelacakan:</span>
                              <strong className="text-slate-200 font-bold tracking-wider text-xs">{kodeLacak}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Kesepakatan Pleno & Usulan Rujukan */}
                      <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">HASIL REKOMENDASI SIDANG PLENO TAT:</span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">
                              {isRawatInap ? 'Rawat Inap' : 'Rawat Jalan'}
                            </span>
                          </div>
                          <p className="text-slate-200 font-medium leading-relaxed">
                            {rekomendasi}
                          </p>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Fasilitas Tujuan: <strong className="text-slate-200">{fasilitas}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Action Buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                        {/* 1. Dokumen yang Diberikan ke Tersangka */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSuratPengantarItem(item);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Dokumen Surat Tersangka</span>
                        </button>

                        {/* 2. Tombol Input Jadwal Kontrol & Lapor */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenInputJadwal(item.id);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Input Jadwal Kontrol &amp; Lapor</span>
                        </button>

                        {/* 3. Lembar Monitoring Detail */}
                        <button
                          type="button"
                          onClick={() => onSelectCase ? onSelectCase(item.id) : onSelectPermohonan(item.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <span>Lembar Monitoring</span>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
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

      {/* TAB 2: MONITORING PENGAWASAN KLIEN AKTIF */}
      {subTab === 'monitoring' && (
        <>
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
                    <span>Daftar Kasus Monitoring Pengawasan</span>
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
                    const isSelesaiRehab = Boolean(
                      item.monitoringTindakLanjut?.akhirLayanan ||
                      item.monitoringTindakLanjut?.statusMonitoring === 'selesai' ||
                      item.statusProsesUtama === 'selesai_tindak_lanjut' ||
                      item.pengawasanKlien?.statusKepatuhan === 'selesai_program'
                    );
                    const pascaRehabSched = getPascaRehabSchedule(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectCase ? onSelectCase(item.id) : onSelectPermohonan(item.id)}
                        className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950/50 hover:bg-slate-900/80 border border-slate-800/70 hover:border-blue-500/60 rounded-xl transition-all shadow-sm cursor-pointer"
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
                              {pascaRehabSched && (
                                <span className="text-[11px] text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1 font-mono">
                                  <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
                                  Pasca Rehab: {pascaRehabSched.tanggal} • {pascaRehabSched.waktu}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Action buttons */}
                        <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                          {isMedisRole && isSelesaiRehab && onNavigateToPascaRehab && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToPascaRehab(item.id);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/35 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            >
                              <Activity className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Input Rehabilitasi Pasca Rehab</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSuratPengantarItem(item);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Surat Tersangka</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectCase ? onSelectCase(item.id) : onSelectPermohonan(item.id)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <span>Buka Detail</span>
                            <ChevronRight className="w-3.5 h-3.5 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}



      {/* MODAL SURAT PENGANTAR TERSANGKA */}
      {suratPengantarItem && (
        <SuratPengantarTersangkaModal
          item={suratPengantarItem}
          currentUser={currentUser}
          onClose={() => setSuratPengantarItem(null)}
        />
      )}
    </div>
  );
};
