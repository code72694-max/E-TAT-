import React from 'react';
import { UserProfile, PermohonanAsesmen } from '../types';
import {
  AlertTriangle,
  Clock,
  FileCheck,
  Calendar,
  FileSignature,
  Share2,
  Stethoscope,
  Scale,
  ArrowRight,
  ShieldCheck,
  Users,
  Activity,
  Plus,
  CheckCircle2,
  History,
  Gavel
} from 'lucide-react';

interface DashboardHomeProps {
  currentUser: UserProfile;
  permohonanList: PermohonanAsesmen[];
  onSelectPermohonan: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenNewModal?: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  currentUser,
  permohonanList,
  onSelectPermohonan,
  onNavigateToTab,
  onOpenNewModal
}) => {
  const role = currentUser.role;
  const normalizedRole = (role || '').toLowerCase();
  const [selectedPeriod, setSelectedPeriod] = React.useState<'semua' | 'bulan_ini' | 'triwulan' | 'tahun'>('semua');

  // Filter based on selected period
  const filteredByPeriod = permohonanList.filter(p => {
    if (selectedPeriod === 'bulan_ini') return p.tanggalPengajuan.startsWith('2026-09');
    if (selectedPeriod === 'triwulan') return p.tanggalPengajuan.startsWith('2026-07') || p.tanggalPengajuan.startsWith('2026-08') || p.tanggalPengajuan.startsWith('2026-09');
    if (selectedPeriod === 'tahun') return p.tanggalPengajuan.startsWith('2026');
    return true;
  });

  // Filter dynamic lists based on roles
  const perluPerbaikanList = filteredByPeriod.filter(p => p.statusProsesUtama === 'perlu_perbaikan');
  const siapVerifikasiList = filteredByPeriod.filter(p => p.statusProsesUtama === 'verifikasi_berkas' || p.statusProsesUtama === 'diajukan');
  const siapPlenoList = filteredByPeriod.filter(p => p.statusProsesUtama === 'siap_pleno');
  const menungguPengesahanList = filteredByPeriod.filter(p => p.statusProsesUtama === 'pengesahan_rekomendasi');
  const terhambatList = filteredByPeriod.filter(p => p.statusTindakLanjut === 'terhambat');
  const mendekatiTenggatList = filteredByPeriod.filter(p => p.isMendekatiTenggat || p.isMelewatiTenggat);

  // Specific lists for Hukum & Medis
  const activeHukumList = permohonanList.filter(p => !p.asesmenHukum || p.asesmenHukum.status !== 'FINAL');
  const drafHukumList = permohonanList.filter(p => p.asesmenHukum && p.asesmenHukum.status === 'DRAFT');
  const finalHukumList = permohonanList.filter(p => p.asesmenHukum && p.asesmenHukum.status === 'FINAL');

  const activeMedisList = permohonanList.filter(p => !p.asesmenMedis || p.asesmenMedis.status !== 'FINAL');
  const drafMedisList = permohonanList.filter(p => p.asesmenMedis && p.asesmenMedis.status === 'DRAFT');
  const finalMedisList = permohonanList.filter(p => p.asesmenMedis && p.asesmenMedis.status === 'FINAL');

  // Dates for "Hari Ini" (Today)
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);
  const todayLocale = now.toLocaleDateString('id-ID');
  const todayHuman = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Filter cases strictly scheduled for TODAY
  const hukumHariIniList = activeHukumList.filter(item => {
    const jadwalHukum = item.timAsesmen?.jadwalPemeriksaanHukum || '';
    const tanggalTelaah = item.asesmenHukum?.tanggalTelaah || '';
    const tanggalPengajuan = item.tanggalPengajuan || '';

    return (
      jadwalHukum.includes(todayIso) ||
      jadwalHukum.includes(todayLocale) ||
      tanggalTelaah.includes(todayIso) ||
      tanggalTelaah.includes(todayLocale) ||
      tanggalPengajuan === todayIso ||
      item.id === 'tat-085'
    );
  });

  const medisHariIniList = activeMedisList.filter(item => {
    const jadwalMedis = item.timAsesmen?.jadwalPemeriksaanMedis || '';
    const tanggalPemeriksaan = item.asesmenMedis?.tanggalPemeriksaan || '';
    const tanggalPengajuan = item.tanggalPengajuan || '';

    return (
      jadwalMedis.includes(todayIso) ||
      jadwalMedis.includes(todayLocale) ||
      tanggalPemeriksaan.includes(todayIso) ||
      tanggalPemeriksaan.includes(todayLocale) ||
      tanggalPengajuan === todayIso ||
      item.id === 'tat-085'
    );
  });

  // Render role-specific task highlights with clean, unified styling
  const renderRoleSpecificTasks = () => {
    switch (normalizedRole) {
      case 'pengaju':
        return (
          <div className="space-y-5">
            {perluPerbaikanList.length > 0 && (
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
                  <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    <span>Pengajuan Perlu Dilengkapi ({perluPerbaikanList.length})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Koreksi Berkas Formil</span>
                </div>
                <div className="space-y-2">
                  {perluPerbaikanList.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onSelectPermohonan(item.id)}
                      className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-mono font-bold text-xs text-white">{item.nomorPermohonan}</span>
                          <span className="text-xs text-slate-300">&bull; Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong></span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                          {item.tindakanBerikutnyaLabel}
                        </p>
                      </div>
                      <button className="text-xs bg-[#142642] hover:bg-[#1b3459] text-slate-200 font-semibold px-3 py-2 rounded-xl flex items-center justify-center space-x-1 shrink-0 transition-colors border border-[#234475] cursor-pointer w-full sm:w-auto">
                        <span>Unggah Perbaikan</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-200" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jadwal Terdekat */}
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Jadwal Agenda Terdekat</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-[#1b3459] bg-[#081224] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-[#0a182f] px-2 py-0.5 rounded border border-[#1b3459]">
                      Sidang Pleno
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">13:30 WIB</span>
                  </div>
                  <p className="text-xs font-bold text-white mt-1">Kasus TAT-082 (Test-3)</p>
                  <p className="text-xs text-slate-300">8 September 2026 &bull; Ruang Sidang Utama TAT</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#1b3459] bg-[#081224] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-[#0a182f] px-2 py-0.5 rounded border border-[#1b3459]">
                      Rekomendasi Siap
                    </span>
                    <span className="text-[11px] text-slate-300 font-mono">Sah TTD</span>
                  </div>
                  <p className="text-xs font-bold text-white mt-1">Kasus TAT-074 (Test-5)</p>
                  <p className="text-xs text-slate-300">Surat Rekomendasi Resmi Ber-QR Telah Diterbitkan</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'admin':
      case 'sekretariat':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">Verifikasi Berkas</span>
                    <FileCheck className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-2 font-mono">{siapVerifikasiList.length} Kasus</div>
                  <p className="text-xs text-slate-400 mt-1">Menunggu uji formil 7 dokumen persyaratan hukum</p>
                </div>
                <button 
                  onClick={() => onNavigateToTab('verifikasi')}
                  className="mt-4 text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer pt-3 border-t border-[#1b3459] transition-colors"
                >
                  <span>Buka Lembar Verifikasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">Siap Sidang Pleno</span>
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-2 font-mono">{siapPlenoList.length} Kasus</div>
                  <p className="text-xs text-slate-400 mt-1">Asesmen medis &amp; telaah hukum telah tuntas diisi</p>
                </div>
                <button 
                  onClick={() => onNavigateToTab('pleno')}
                  className="mt-4 text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer pt-3 border-t border-[#1b3459] transition-colors"
                >
                  <span>Lihat Agenda Sidang Pleno</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">Kendala Rujukan</span>
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-2 font-mono">{terhambatList.length} Kasus</div>
                  <p className="text-xs text-slate-400 mt-1">Hambatan kuota kamar atau pengawalan tersangka</p>
                </div>
                <button 
                  onClick={() => onNavigateToTab('tindak_lanjut')}
                  className="mt-4 text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer pt-3 border-t border-[#1b3459] transition-colors"
                >
                  <span>Kelola Tiket Rujukan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SLA Monitor */}
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Kendali Waktu Layanan Terpadu (SLA Maksimal 6 Hari)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Perpol 08/2021</span>
              </div>
              <div className="space-y-2">
                {permohonanList.slice(0, 4).map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectPermohonan(item.id)}
                    className="p-3.5 border border-[#1b3459] bg-[#081224] rounded-xl hover:bg-[#112340] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2 truncate min-w-0">
                      <span className="font-mono font-bold text-white shrink-0">{item.nomorPermohonan}</span>
                      <span className="text-slate-300 truncate">&bull; {item.terperiksa.namaLengkap}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#1b3459]/40">
                      <span className="text-slate-400">Tenggat: <strong className="text-white font-mono">{item.tenggatSlaTanggal}</strong></span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border bg-[#0a182f] text-slate-300 border-[#1b3459]">
                        {item.isMendekatiTenggat ? 'Mendekati Batas' : 'Terkendali'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'medis':
        return (
          <div className="space-y-5">
            {/* Agenda Asesmen Medis Hari Ini */}
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3459]">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-[#d4af37]" />
                    <span>Jadwal &amp; Agenda Asesmen Medis Hari Ini</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Daftar terperiksa khusus yang dijadwalkan untuk tes urin &amp; skoring WHO ASSIST hari ini ({todayHuman}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('medis')}
                  className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-[#d4af37] border border-[#234475] rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>Buka Antrean Lengkap ({activeMedisList.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {medisHariIniList.length === 0 ? (
                <div className="text-center py-8 bg-[#081224] border border-[#1b3459] rounded-xl text-slate-400 text-xs space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-white">Tidak ada jadwal asesmen medis untuk hari ini ({todayHuman}).</p>
                  <p className="text-[11px]">Terdapat total {activeMedisList.length} berkas perkara di antrean asesmen aktif.</p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('medis')}
                      className="px-3.5 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-[#d4af37] border border-[#234475] rounded-xl font-semibold inline-flex items-center space-x-1.5 cursor-pointer text-xs"
                    >
                      <span>Lihat Semua Tugas Aktif ({activeMedisList.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {medisHariIniList.map(item => {
                    const isDraft = item.asesmenMedis && item.asesmenMedis.status === 'DRAFT';
                    const jadwalSesi = item.asesmenMedis?.tanggalPemeriksaan || `${item.tanggalPengajuan} • 10:00 WITA`;
                    const bbSummary = item.perkara.barangBuktiList.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ') || 'Tanpa BB';

                    return (
                      <div
                        key={item.id}
                        onClick={() => onNavigateToTab('medis')}
                        className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] hover:border-[#d4af37]/60 rounded-xl p-4 transition-all cursor-pointer shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="font-bold text-xs sm:text-sm text-[#d4af37] font-mono shrink-0">
                              {item.nomorPermohonan}
                            </span>
                            <span className="text-slate-600 hidden sm:inline">•</span>
                            <h4 className="text-sm font-bold text-white truncate">
                              {item.terperiksa.namaLengkap} <span className="text-xs font-normal text-slate-400">({item.terperiksa.usia} th)</span>
                            </h4>
                          </div>

                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto shrink-0 ${
                            item.asesmenMedis?.status === 'FINAL'
                              ? 'bg-blue-950/50 text-blue-300 border-blue-600/40'
                              : 'bg-emerald-950/50 text-emerald-300 border-emerald-600/40'
                          }`}>
                            {item.asesmenMedis?.status === 'FINAL' ? 'Selesai' : 'Aktif'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>NIK: <strong className="text-slate-300 font-mono font-normal">{item.terperiksa.nik}</strong></span>
                          <span className="text-slate-600">•</span>
                          <span>BB: <strong className="text-slate-200 font-medium">{bbSummary}</strong></span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-[#1b3459]/60 text-xs text-slate-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Jadwal Sesi: <strong className="text-slate-200 font-semibold">{jadwalSesi}</strong></span>
                          </div>

                          <div className="text-[#d4af37] font-semibold text-xs flex items-center space-x-1 shrink-0">
                            <span>{isDraft ? 'Lanjutkan Pemeriksaan' : 'Mulai Asesmen Medis'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'hukum':
        return (
          <div className="space-y-5">
            {/* Agenda Asesmen Hukum Hari Ini */}
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3459]">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-[#d4af37]" />
                    <span>Jadwal &amp; Agenda Asesmen Hukum Hari Ini</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Daftar perkara khusus yang dijadwalkan untuk penelaahan yuridis hari ini ({todayHuman}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('hukum')}
                  className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-[#d4af37] border border-[#234475] rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>Buka Antrean Lengkap ({activeHukumList.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {hukumHariIniList.length === 0 ? (
                <div className="text-center py-8 bg-[#081224] border border-[#1b3459] rounded-xl text-slate-400 text-xs space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-white">Tidak ada jadwal asesmen hukum untuk hari ini ({todayHuman}).</p>
                  <p className="text-[11px]">Terdapat total {activeHukumList.length} berkas perkara di antrean asesmen aktif.</p>
                  <div className="pt-2 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('hukum')}
                      className="px-3.5 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-[#d4af37] border border-[#234475] rounded-xl font-semibold inline-flex items-center space-x-1.5 cursor-pointer text-xs"
                    >
                      <span>Lihat Semua Tugas Aktif ({activeHukumList.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('riwayat_hukum')}
                      className="px-3.5 py-1.5 bg-[#0b172a] hover:bg-[#142642] text-slate-300 border border-[#1b3459] rounded-xl font-semibold inline-flex items-center space-x-1.5 cursor-pointer text-xs"
                    >
                      <History className="w-3.5 h-3.5 text-slate-300" />
                      <span>Buka Riwayat Asesmen Hukum</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {hukumHariIniList.map(item => {
                    const isDraft = item.asesmenHukum && item.asesmenHukum.status === 'DRAFT';
                    const jadwalSesi = item.asesmenHukum?.tanggalTelaah || `${item.tanggalPengajuan} • 09:30 WITA`;
                    const bbSummary = item.perkara.barangBuktiList.map(b => `${b.jenisZat} ${b.beratBersihGram}g`).join(', ') || 'Tanpa BB';

                    return (
                      <div
                        key={item.id}
                        onClick={() => onNavigateToTab('hukum')}
                        className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] hover:border-[#d4af37]/60 rounded-xl p-4 transition-all cursor-pointer shadow-sm space-y-3"
                      >
                        {/* Row 1: Nomor, Nama, & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="font-bold text-xs sm:text-sm text-[#d4af37] font-mono shrink-0">
                              {item.nomorPermohonan}
                            </span>
                            <span className="text-slate-600 hidden sm:inline">•</span>
                            <h4 className="text-sm font-bold text-white truncate">
                              {item.terperiksa.namaLengkap} <span className="text-xs font-normal text-slate-400">({item.terperiksa.usia} th)</span>
                            </h4>
                          </div>

                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto shrink-0 ${
                            item.asesmenHukum?.status === 'FINAL'
                              ? 'bg-blue-950/50 text-blue-300 border-blue-600/40'
                              : 'bg-emerald-950/50 text-emerald-300 border-emerald-600/40'
                          }`}>
                            {item.asesmenHukum?.status === 'FINAL' ? 'Selesai' : 'Aktif'}
                          </span>
                        </div>

                        {/* Row 2: Perkara & BB */}
                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>LP: <strong className="text-slate-300 font-normal">{item.perkara.nomorLaporanPolisi}</strong></span>
                          <span className="text-slate-600">•</span>
                          <span>Pasal: <strong className="text-slate-300 font-normal">{item.perkara.pasalDipersangkakan}</strong></span>
                          <span className="text-slate-600">•</span>
                          <span>BB: <strong className="text-slate-200 font-medium">{bbSummary}</strong></span>
                        </div>

                        {/* Row 3: Jadwal & Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-[#1b3459]/60 text-xs text-slate-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Jadwal Sesi: <strong className="text-slate-200 font-semibold">{jadwalSesi}</strong></span>
                            <span className="text-slate-600 hidden sm:inline">•</span>
                            <span className="hidden sm:inline">Penyidik: {item.perkara.namaPenyidik}</span>
                          </div>

                          <div className="text-[#d4af37] font-semibold text-xs flex items-center space-x-1 shrink-0">
                            <span>{isDraft ? 'Lanjutkan Draf Hukum' : 'Mulai Telaah Yuridis'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'koordinator':
        return (
          <div className="space-y-5">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <FileSignature className="w-4 h-4 text-slate-400" />
                  <span>Menunggu Pengesahan Rekomendasi Terpadu ({menungguPengesahanList.length})</span>
                </h3>
                <span className="text-xs text-slate-400">Tanda Tangan Elektronik 3 Pihak</span>
              </div>
              <div className="space-y-2">
                {menungguPengesahanList.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectPermohonan(item.id)}
                    className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-3.5 sm:p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-mono font-bold text-xs text-white">{item.nomorPermohonan}</span>
                        <span className="text-xs text-slate-300">&bull; {item.terperiksa.namaLengkap}</span>
                        <span className="text-[10px] bg-[#142642] text-slate-200 px-2 py-0.5 rounded font-bold uppercase border border-[#234475]">
                          3/4 TTD Sah
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-snug">Kesepakatan: {item.sidangPleno?.kesepakatanRekomendasi || 'Rehabilitasi Rawat Inap RSKO'}</p>
                    </div>
                    <button className="text-xs bg-[#142642] hover:bg-[#1b3459] text-slate-200 font-semibold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1 shrink-0 transition-colors border border-[#234475] w-full sm:w-auto">
                      <span>Sahkan Rekomendasi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-200" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'rehabilitasi':
        return (
          <div className="space-y-5">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Daftar Rujukan Masuk Klien Rehabilitasi</span>
                </h3>
                <span className="text-xs text-slate-400">Konfirmasi Kuota & Admisi</span>
              </div>
              <div 
                onClick={() => onSelectPermohonan('tat-074')}
                className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-3.5 sm:p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-mono font-bold text-xs text-white">Rujukan: Dimas Ardiansyah (TAT-074)</span>
                    <span className="text-[10px] bg-[#142642] text-slate-200 border border-[#234475] px-2 py-0.5 rounded font-bold uppercase">
                      Kapasitas Penuh
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">Usulan: Rawat Inap 6 Bulan di Balai Tanah Merah Samarinda &bull; Ketersediaan Kuota Kamar: 0 slot (Perlu Relokasi)</p>
                </div>
                <button className="text-xs bg-[#142642] hover:bg-[#1b3459] text-slate-200 font-semibold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1 shrink-0 transition-colors border border-[#234475] w-full sm:w-auto">
                  <span>Kelola Slot</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-200" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'pimpinan':
        return (
          <div className="space-y-5">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span>Ringkasan Kinerja Penegakan Hukum Terpadu</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Batas SLA 6 Hari</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-xl">
                  <span className="text-xs text-slate-400 block">Total Permohonan</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">{permohonanList.length} Kasus</div>
                </div>
                <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-xl">
                  <span className="text-xs text-slate-400 block">Selesai Direkomendasi</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">3 Berkas</div>
                </div>
                <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-xl">
                  <span className="text-xs text-slate-400 block">Mendekati Batas SLA</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">{mendekatiTenggatList.length} Berkas</div>
                </div>
                <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-xl">
                  <span className="text-xs text-slate-400 block">Kendala Rujukan</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">{terhambatList.length} Kasus</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onNavigateToTab('monitoring')}
                  className="text-xs bg-[#133863] hover:bg-[#1a4a82] text-white font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer border border-[#235594]"
                >
                  <span>Buka Dasbor Monitoring & Laporan Intelijen</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'superadmin':
        return (
          <div className="space-y-5">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Kendali Sistem & Tata Kelola Siber</span>
                </h3>
                <span className="text-xs text-slate-400">Pusdatin Polri & BNN</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-xl">
                  <span className="text-xs text-slate-400 block">Akun Pengguna Terdaftar</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">8 Personel</div>
                </div>
                <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-xl">
                  <span className="text-xs text-slate-400 block">Lembaga Mitra Interkoneksi</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">11 Instansi</div>
                </div>
                <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-xl">
                  <span className="text-xs text-slate-400 block">Integritas Audit Trail</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">100% Valid</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigateToTab('administrasi')}
                  className="text-xs bg-[#133863] hover:bg-[#1a4a82] text-white font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer transition-all border border-[#235594]"
                >
                  <Users className="w-3.5 h-3.5 text-white" />
                  <span>Kelola Akun Otoritas</span>
                </button>
                <button
                  onClick={() => onNavigateToTab('monitoring')}
                  className="text-xs bg-[#081224] hover:bg-[#112340] text-slate-200 font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer transition-colors border border-[#1b3459]"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span>Buka Log Audit Forensik</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner: Proportional Executive Command Desk without redundant logo */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/30 space-y-4">
        {/* Main Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Identity & Welcome */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#142642] px-2.5 py-0.5 rounded-md border border-[#d4af37]/30">
                SENTRA KOMANDO E-TAT
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                SLA 6 HARI KERJA
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              Selamat Bertugas, <span className="text-[#d4af37]">{currentUser.name}</span>
            </h1>
            <p className="text-xs text-slate-300">
              {currentUser.agency} &bull; <span className="font-semibold text-slate-200">{currentUser.role.toUpperCase()}</span>
            </p>
          </div>

          {/* Quick Actions & Stats Badge Row */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1b3459]/60">
            {(role === 'pengaju' || role === 'sekretariat') && onOpenNewModal && (
              <button
                type="button"
                onClick={onOpenNewModal}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#AA7C11] text-slate-950 font-extrabold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-[#FFF2B2]/30"
              >
                <Plus className="w-4 h-4 stroke-[3] text-slate-950 shrink-0" />
                <span className="whitespace-nowrap">Pengajuan Baru</span>
              </button>
            )}
            <div className="bg-[#081224] border border-[#1b3459] px-3.5 py-2 sm:py-2.5 rounded-xl text-center min-w-[64px]">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase block font-medium">Aktif</span>
              <span className="text-base sm:text-lg font-bold text-white font-mono">{permohonanList.length}</span>
            </div>
            <div className="bg-[#081224] border border-[#1b3459] px-3.5 py-2 sm:py-2.5 rounded-xl text-center min-w-[64px]">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase block font-medium">Atensi</span>
              <span className="text-base sm:text-lg font-bold text-rose-400 font-mono">{perluPerbaikanList.length + terhambatList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Work Desk */}
      {renderRoleSpecificTasks()}
    </div>
  );
};
