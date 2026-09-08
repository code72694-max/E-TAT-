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
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
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
        </div>
      </div>

      {/* Grid of active scheduled cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSchedules.length === 0 ? (
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Tidak ada jadwal aktif.</p>
            <p className="text-xs text-slate-400 mt-0.5">Belum ada agenda pemeriksaan asesmen yang dijadwalkan.</p>
          </div>
        ) : (
          activeSchedules.map(item => {
          const tim = item.timAsesmen!;
          return (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-5 transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900">{item.nomorPermohonan}</span>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">Terperiksa: {item.terperiksa.namaLengkap}</p>
                  <p className="text-[11px] text-slate-500">Pengaju: {item.instansiPengaju}</p>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded border border-indigo-200">
                  {item.statusProsesUtama.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-800">{tim.asesorMedisNama}</span>
                      <p className="text-[10px] text-slate-500">Jadwal Medis: {tim.jadwalPemeriksaanMedis}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Tercatat
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-3.5 h-3.5 text-purple-600" />
                    <div>
                      <span className="font-bold text-slate-800">{tim.asesorHukumNama}</span>
                      <p className="text-[10px] text-slate-500">Jadwal Hukum: {tim.jadwalPemeriksaanHukum}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                    Tercatat
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <div>
                      <span className="font-bold text-indigo-950">Sidang Pleno Terpadu</span>
                      <p className="text-[10px] text-indigo-700">{tim.jadwalPleno || 'Belum Dijadwalkan'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                    Ruang TAT
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                <span>Lokasi: {tim.lokasiPemeriksaan}</span>
                <span className="text-indigo-600 font-semibold flex items-center space-x-1">
                  <span>Buka Berkas</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
