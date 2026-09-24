import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { CalendarCheck, Clock, UserCheck, Users, Stethoscope, Scale, ArrowRight, AlertCircle } from 'lucide-react';

interface PenugasanJadwalViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
}

export const PenugasanJadwalView: React.FC<PenugasanJadwalViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan
}) => {
  const isPengaju = currentUser.role === 'pengaju';
  const isMedis = currentUser.role === 'medis';
  const isHukum = currentUser.role === 'hukum';

  const activeSchedules = permohonanList.filter(p => {
    if (!p.timAsesmen) return false;
    if (isPengaju) {
      return (
        p.pengajuNama.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        p.instansiPengaju.toLowerCase().includes(currentUser.instansi.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <CalendarCheck className="w-5 h-5 text-[#38bdf8]" />
            <span>
              {isPengaju
                ? 'Jadwal Pemeriksaan'
                : isMedis
                ? 'Agenda Asesmen Medis'
                : isHukum
                ? 'Agenda Telaah Hukum'
                : 'Penugasan & Jadwal'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Penjadwalan pemeriksaan terpadu medis psikiatri, yuridis hukum, serta penentuan agenda sidang pleno.
          </p>
        </div>
      </div>

      {/* Grid of active scheduled cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSchedules.length === 0 ? (
          <div className="col-span-2 bg-[#0b172a] border border-[#1b3459] rounded-xl p-12 text-center text-slate-400 shadow-lg shadow-black/20">
            <CalendarCheck className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">Tidak ada jadwal aktif.</p>
            <p className="text-xs text-slate-400 mt-0.5">Belum ada agenda pemeriksaan asesmen yang dijadwalkan.</p>
          </div>
        ) : (
          activeSchedules.map(item => {
          const tim = item.timAsesmen!;
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#38bdf8] rounded-xl p-5 transition-all cursor-pointer space-y-4 shadow-lg shadow-black/20 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{item.nomorPermohonan}</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">Terperiksa: {item.terperiksa.namaLengkap}</p>
                  <p className="text-[11px] text-slate-400">Pengaju: {item.instansiPengaju}</p>
                </div>
                <span className="text-[10px] bg-[#1b3459] text-sky-300 font-bold px-2 py-0.5 rounded border border-[#2d5289]">
                  {item.statusProsesUtama.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-[#1b3459] pt-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#081224] border border-[#1b3459]">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-slate-200">{tim.asesorMedisNama}</span>
                      <p className="text-[10px] text-slate-400">Jadwal Medis: {tim.jadwalPemeriksaanMedis}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                    Tercatat
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#081224] border border-[#1b3459]">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <span className="font-bold text-slate-200">{tim.asesorHukumNama}</span>
                      <p className="text-[10px] text-slate-400">Jadwal Hukum: {tim.jadwalPemeriksaanHukum}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded border border-purple-500/30">
                    Tercatat
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d1f3d] border border-[#234577]">
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <div>
                      <span className="font-bold text-white">Sidang Pleno Terpadu</span>
                      <p className="text-[10px] text-sky-200">{tim.jadwalPleno || 'Belum Dijadwalkan'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#38bdf8]/20 text-[#38bdf8] font-bold px-2 py-0.5 rounded border border-[#38bdf8]/40">
                    Ruang TAT
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                <span>Lokasi: {tim.lokasiPemeriksaan}</span>
                <span className="text-[#38bdf8] font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Buka Berkas</span>
                  <ArrowRight className="w-3 h-3 text-[#F1C40F]" />
                </span>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
