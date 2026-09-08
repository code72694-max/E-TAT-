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
  CheckCircle2,
  Users,
  Activity
} from 'lucide-react';

interface DashboardHomeProps {
  currentUser: UserProfile;
  permohonanList: PermohonanAsesmen[];
  onSelectPermohonan: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  currentUser,
  permohonanList,
  onSelectPermohonan,
  onNavigateToTab
}) => {
  const role = currentUser.role;

  // Filter dynamic lists based on roles
  const perluPerbaikanList = permohonanList.filter(p => p.statusProsesUtama === 'perlu_perbaikan');
  const siapVerifikasiList = permohonanList.filter(p => p.statusProsesUtama === 'verifikasi_berkas' || p.statusProsesUtama === 'diajukan');
  const belumDitugaskanList = permohonanList.filter(p => p.statusProsesUtama === 'penugasan_jadwal');
  const siapPlenoList = permohonanList.filter(p => p.statusProsesUtama === 'siap_pleno');
  const menungguPengesahanList = permohonanList.filter(p => p.statusProsesUtama === 'pengesahan_rekomendasi');
  const terhambatList = permohonanList.filter(p => p.statusTindakLanjut === 'terhambat');
  const mendekatiTenggatList = permohonanList.filter(p => p.isMendekatiTenggat || p.isMelewatiTenggat);

  // Render role-specific task highlights
  const renderRoleSpecificTasks = () => {
    switch (role) {
      case 'pengaju':
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-amber-900 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Pengajuan Perlu Dilengkapi ({perluPerbaikanList.length})</span>
                </div>
              </div>
              {perluPerbaikanList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Tidak ada berkas yang perlu diperbaiki saat ini.</p>
              ) : (
                <div className="space-y-2">
                  {perluPerbaikanList.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onSelectPermohonan(item.id)}
                      className="bg-white border border-amber-200 rounded-lg p-3 hover:border-amber-400 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900">{item.nomorPermohonan}</span>
                          <span className="text-xs text-slate-600">• Terperiksa: {item.terperiksa.namaLengkap}</span>
                        </div>
                        <p className="text-xs text-red-600 font-medium mt-0.5">
                          {item.tindakanBerikutnyaLabel}
                        </p>
                      </div>
                      <button className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-3 py-1.5 rounded-md flex items-center space-x-1 shrink-0">
                        <span>Unggah Perbaikan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Jadwal Terdekat */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Jadwal Terdekat</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-semibold uppercase text-blue-600">Sidang Pleno</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">Kasus TAT-082 (Test-3)</p>
                  <p className="text-xs text-slate-600">8 September 2026 • 13:30 WIB</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-semibold uppercase text-emerald-600">Rekomendasi Siap</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">Kasus TAT-074 (Test-5)</p>
                  <p className="text-xs text-slate-600">Surat Resmi Telah Diterbitkan</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sekretariat':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Verifikasi Berkas</span>
                  <FileCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">{siapVerifikasiList.length} Kasus</div>
                <button 
                  onClick={() => onNavigateToTab('verifikasi')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                >
                  <span>Buka Verifikasi</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Siap Sidang Pleno</span>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">{siapPlenoList.length} Kasus</div>
                <button 
                  onClick={() => onNavigateToTab('pleno')}
                  className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                >
                  <span>Lihat Agenda</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Kendala Rujukan</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-xl font-bold text-rose-700 mt-1">{terhambatList.length} Kasus</div>
                <button 
                  onClick={() => onNavigateToTab('tindak_lanjut')}
                  className="mt-2 text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center space-x-1"
                >
                  <span>Lihat Rujukan</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* SLA Monitor */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Kendali Waktu Layanan (SLA)</span>
                </h3>
                <span className="text-xs text-slate-500">Maksimal 6 Hari Kerja</span>
              </div>
              <div className="space-y-2">
                {permohonanList.slice(0, 4).map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectPermohonan(item.id)}
                    className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="font-bold text-slate-900">{item.nomorPermohonan}</span>
                      <span className="text-slate-500 truncate">({item.terperiksa.namaLengkap})</span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-slate-500">Tenggat: <strong>{item.tenggatSlaTanggal}</strong></span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.isMendekatiTenggat ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {item.isMendekatiTenggat ? 'Mendekati Batas' : 'Terkendali'}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'medis':
        return (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Kasus Asesmen Medis</span>
                </h3>
              </div>
              <div className="space-y-2">
                <div 
                  onClick={() => onSelectPermohonan('tat-085')}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-emerald-400 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">TAT/2026/09/085 - Test-2</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Selesai</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">F15.1 Sabu (ASSIST Skor 21) &bull; Usulan Rawat Jalan 3 Bulan</p>
                  </div>
                  <button className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-md flex items-center space-x-1 shrink-0">
                    <span>Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hukum':
        return (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Kasus Telaah Hukum</span>
                </h3>
              </div>
              <div className="space-y-2">
                <div 
                  onClick={() => onSelectPermohonan('tat-085')}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-purple-400 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">TAT/2026/09/085 - Test-2</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">Perlu Klarifikasi</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">Peran: Penyalahguna (0.22g Sabu) &bull; Menunggu verifikasi BAP saksi</p>
                  </div>
                  <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-1.5 rounded-md flex items-center space-x-1 shrink-0">
                    <span>Lengkapi Analisis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'koordinator':
        return (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <FileSignature className="w-4 h-4 text-indigo-600" />
                  <span>Menunggu Pengesahan ({menungguPengesahanList.length})</span>
                </h3>
              </div>
              {menungguPengesahanList.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectPermohonan(item.id)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-indigo-400 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{item.nomorPermohonan} - {item.terperiksa.namaLengkap}</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">3/4 TTD</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">Rekomendasi: {item.sidangPleno?.kesepakatanRekomendasi || 'Rehabilitasi Rawat Inap RSKO'}</p>
                  </div>
                  <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-md flex items-center space-x-1 shrink-0">
                    <span>Sahkan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rehabilitasi':
        return (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-teal-600" />
                  <span>Rujukan Klien</span>
                </h3>
              </div>
              <div 
                onClick={() => onSelectPermohonan('tat-074')}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-teal-400 cursor-pointer flex items-center justify-between transition-all"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">Rujukan Masuk: Test-5 (TAT-074)</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-medium">Kapasitas Penuh</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Rawat Inap 6 Bulan di Balai Lido &bull; Ketersediaan: 0 slot</p>
                </div>
                <button className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium px-3 py-1.5 rounded-md flex items-center space-x-1 shrink-0">
                  <span>Kelola</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'pimpinan':
        return (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Ringkasan Layanan</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500">Total Permohonan</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{permohonanList.length}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-emerald-800">Selesai</span>
                  <div className="text-lg font-bold text-emerald-900 mt-0.5">3</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-amber-800">Mendekati SLA</span>
                  <div className="text-lg font-bold text-amber-900 mt-0.5">{mendekatiTenggatList.length}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-rose-800">Kendala Rujukan</span>
                  <div className="text-lg font-bold text-rose-900 mt-0.5">{terhambatList.length}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onNavigateToTab('monitoring')}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-lg flex items-center space-x-1.5"
                >
                  <span>Buka Monitoring</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Kendali Sistem</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500 block">Akun Terdaftar</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">8 Pengguna</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500 block">Instansi Mitra</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">11 Lembaga</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500 block">Audit Keamanan</span>
                  <div className="text-lg font-bold text-emerald-700 mt-0.5">Aman</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onNavigateToTab('administrasi')}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Kelola Pengguna</span>
                </button>
                <button
                  onClick={() => onNavigateToTab('monitoring')}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3.5 py-2 rounded-lg flex items-center space-x-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Audit Trail</span>
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
    <div className="space-y-5">
      {/* Top Banner: Greeting and Active Role Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Selamat Datang, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.agency} &bull; <span className="capitalize">{currentUser.role}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-medium">Kasus Aktif</span>
              <span className="text-base font-bold text-slate-900">{permohonanList.length}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] text-amber-700 uppercase block font-medium">Perlu Tindakan</span>
              <span className="text-base font-bold text-amber-800">{perluPerbaikanList.length + terhambatList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Work Desk */}
      {renderRoleSpecificTasks()}
    </div>
  );
};
