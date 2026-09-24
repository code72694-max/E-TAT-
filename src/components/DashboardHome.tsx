import React from 'react';
import { UserProfile, PermohonanAsesmen } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
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
  const siapPlenoList = permohonanList.filter(p => p.statusProsesUtama === 'siap_pleno');
  const menungguPengesahanList = permohonanList.filter(p => p.statusProsesUtama === 'pengesahan_rekomendasi');
  const terhambatList = permohonanList.filter(p => p.statusTindakLanjut === 'terhambat');
  const mendekatiTenggatList = permohonanList.filter(p => p.isMendekatiTenggat || p.isMelewatiTenggat);

  // Render role-specific task highlights with clean, unified styling
  const renderRoleSpecificTasks = () => {
    switch (role) {
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
                      className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-3.5 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-white">{item.nomorPermohonan}</span>
                          <span className="text-xs text-slate-300">&bull; Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong></span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {item.tindakanBerikutnyaLabel}
                        </p>
                      </div>
                      <button className="text-xs bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold px-3.5 py-1.5 rounded-xl flex items-center space-x-1 shrink-0 transition-all border border-[#235594] cursor-pointer">
                        <span>Unggah Perbaikan</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
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
                  <p className="text-xs text-slate-400 mt-1">Asesmen medis & telaah hukum telah tuntas diisi</p>
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
                    className="p-3 border border-[#1b3459] bg-[#081224] rounded-xl hover:bg-[#112340] cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="font-mono font-bold text-white">{item.nomorPermohonan}</span>
                      <span className="text-slate-300 truncate">&bull; {item.terperiksa.namaLengkap}</span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-slate-400">Tenggat: <strong className="text-white font-mono">{item.tenggatSlaTanggal}</strong></span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-[#0a182f] text-slate-300 border-[#1b3459]">
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
          <div className="space-y-5">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-slate-400" />
                  <span>Kasus Penugasan Asesmen Medis & Psikiatri</span>
                </h3>
                <span className="text-xs text-slate-400">Instrumen WHO ASSIST & Uji Urin</span>
              </div>
              <div className="space-y-2">
                <div 
                  onClick={() => onSelectPermohonan('tat-085')}
                  className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-white">TAT/2026/09/085 - Test-2</span>
                      <span className="text-[10px] bg-[#0a182f] text-slate-300 border border-[#1b3459] px-2 py-0.5 rounded font-bold uppercase">
                        Selesai Diperiksa
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">Diagnosis: F15.1 Sabu (ASSIST Skor 21) &bull; Usulan Rawat Jalan 3 Bulan</p>
                  </div>
                  <button className="text-xs bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1 shrink-0 transition-colors border border-[#235594]">
                    <span>Lihat Rekam Medis</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hukum':
        return (
          <div className="space-y-5">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-slate-400" />
                  <span>Kasus Penelaahan Yuridis Hukum</span>
                </h3>
                <span className="text-xs text-slate-400">Kualifikasi SEMA 04/2010</span>
              </div>
              <div className="space-y-2">
                <div 
                  onClick={() => onSelectPermohonan('tat-085')}
                  className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-white">TAT/2026/09/085 - Test-2</span>
                      <span className="text-[10px] bg-[#0a182f] text-slate-300 border border-[#1b3459] px-2 py-0.5 rounded font-bold uppercase">
                        Perlu Klarifikasi
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">Klasifikasi: Penyalahguna (0.22g Sabu) &bull; Menunggu verifikasi BAP saksi penangkap</p>
                  </div>
                  <button className="text-xs bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1 shrink-0 transition-colors border border-[#235594]">
                    <span>Lengkapi Analisis</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'koordinator':
        return (
          <div className="space-y-5">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b3459]">
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
                    className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-white">{item.nomorPermohonan}</span>
                        <span className="text-xs text-slate-300">&bull; {item.terperiksa.namaLengkap}</span>
                        <span className="text-[10px] bg-[#0a182f] text-slate-200 px-2 py-0.5 rounded font-bold uppercase border border-[#1b3459]">
                          3/4 TTD Sah
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">Kesepakatan: {item.sidangPleno?.kesepakatanRekomendasi || 'Rehabilitasi Rawat Inap RSKO'}</p>
                    </div>
                    <button className="text-xs bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1 shrink-0 transition-colors border border-[#235594]">
                      <span>Sahkan Rekomendasi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
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
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b3459]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Daftar Rujukan Masuk Klien Rehabilitasi</span>
                </h3>
                <span className="text-xs text-slate-400">Konfirmasi Kuota & Admisi</span>
              </div>
              <div 
                onClick={() => onSelectPermohonan('tat-074')}
                className="bg-[#081224] hover:bg-[#112340] border border-[#1b3459] rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-white">Rujukan: Dimas Ardiansyah (TAT-074)</span>
                    <span className="text-[10px] bg-[#0a182f] text-slate-300 border border-[#1b3459] px-2 py-0.5 rounded font-bold uppercase">
                      Kapasitas Penuh
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Usulan: Rawat Inap 6 Bulan di Balai Lido &bull; Ketersediaan Kuota Kamar: 0 slot (Perlu Relokasi)</p>
                </div>
                <button className="text-xs bg-[#133863] hover:bg-[#1a4a82] text-white font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1 shrink-0 transition-colors border border-[#235594]">
                  <span>Kelola Slot</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
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

      case 'admin':
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
    <div className="space-y-6">
      {/* Top Banner: Clean, Harmonious Executive Command Desk */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl p-6 shadow-xl shadow-black/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center space-x-4">
            <PoliceEmblem size="md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 bg-[#081224] px-2.5 py-0.5 rounded border border-[#1b3459] font-mono">
                  SENTRA KOMANDO E-TAT PRESISI
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  SLA 6 HARI KERJA
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 tracking-tight font-['Cinzel',serif]">
                Selamat Bertugas, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser.agency} &bull; <span className="font-bold text-slate-200">{currentUser.role.toUpperCase()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-[#081224] border border-[#1b3459] px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Kasus Berjalan</span>
              <span className="text-lg font-bold text-white font-mono">{permohonanList.length}</span>
            </div>
            <div className="bg-[#081224] border border-[#1b3459] px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Atensi Khusus</span>
              <span className="text-lg font-bold text-white font-mono">{perluPerbaikanList.length + terhambatList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Work Desk */}
      {renderRoleSpecificTasks()}
    </div>
  );
};
