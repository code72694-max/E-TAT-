import React, { useState } from 'react';
import { PermohonanAsesmen } from '../types';
import { Calendar, Search, ArrowRight, Clock, MapPin, UserCheck, Stethoscope, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { JadwalKlienDetailView } from './JadwalKlienDetailView';

interface JadwalKlienViewProps {
  permohonanList: PermohonanAsesmen[];
  onSelectPermohonan: (id: string) => void;
  selectedScheduleId?: string | null;
  selectedCaseId?: string | null;
  onSelectSchedule?: (caseId: string | null, schedId: string | null) => void;
}

export const JadwalKlienView: React.FC<JadwalKlienViewProps> = ({
  permohonanList,
  onSelectPermohonan,
  selectedScheduleId,
  selectedCaseId,
  onSelectSchedule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedScheduleId, setLocalSelectedScheduleId] = useState<string | null>(null);
  const [localSelectedCaseId, setLocalSelectedCaseId] = useState<string | null>(null);

  const activeScheduleId = selectedScheduleId !== undefined ? selectedScheduleId : localSelectedScheduleId;
  const activeCaseId = selectedCaseId !== undefined ? selectedCaseId : localSelectedCaseId;

  const handleOpenDetail = (caseId: string, schedId: string) => {
    if (onSelectSchedule) {
      onSelectSchedule(caseId, schedId);
    } else {
      setLocalSelectedScheduleId(schedId);
      setLocalSelectedCaseId(caseId);
    }
  };

  const handleBack = () => {
    if (onSelectSchedule) {
      onSelectSchedule(null, null);
    } else {
      setLocalSelectedScheduleId(null);
      setLocalSelectedCaseId(null);
    }
  };

  // Extract all schedules from permohonanList
  const allSchedules = permohonanList.flatMap((p) => {
    const schedules = [];

    // Wajib Lapor (from monitoringTindakLanjut)
    if (p.monitoringTindakLanjut?.buktiWajibLaporList) {
      p.monitoringTindakLanjut.buktiWajibLaporList.forEach((w) => {
        if (w.tanggalRencanaWajibLapor) {
          schedules.push({
            id: w.id,
            permohonanId: p.id,
            nomorPermohonan: p.nomorPermohonan,
            nomorSurat: p.rekomendasiResmi?.nomorSurat,
            namaKlien: p.terperiksa.namaLengkap,
            nik: p.terperiksa.nik,
            usia: p.terperiksa.usia,
            jenisKegiatan: 'Wajib Lapor',
            detailKegiatan: w.kegiatanRehabTerkait || 'Wajib Lapor Rutin Penyidik',
            tanggalRencana: w.tanggalRencanaWajibLapor,
            lokasi: w.instansiPenyidik,
            penanggungJawab: w.namaPenyidikPenerima,
            status: w.statusKonfirmasi,
          });
        }
      });
    }

    // Kontrol Medis (from pengawasanKlien)
    if (p.pengawasanKlien?.tanggalKontrolBerikutnya) {
      schedules.push({
        id: `kontrol-${p.id}`,
        permohonanId: p.id,
        nomorPermohonan: p.nomorPermohonan,
        nomorSurat: p.rekomendasiResmi?.nomorSurat,
        namaKlien: p.terperiksa.namaLengkap,
        nik: p.terperiksa.nik,
        usia: p.terperiksa.usia,
        jenisKegiatan: 'Kontrol Medis',
        detailKegiatan: p.pengawasanKlien.catatanKontrolBerikutnya || 'Kontrol Medis & Konseling Berkala',
        tanggalRencana: p.pengawasanKlien.tanggalKontrolBerikutnya,
        lokasi: p.pengawasanKlien.instansiPelaksanaRehab,
        penanggungJawab: p.pengawasanKlien.konselorPendamping || 'Konselor Balai Rehab',
        status: 'terjadwal',
      });
    }

    return schedules;
  });

  // Filter and sort
  const filteredSchedules = allSchedules
    .filter((s) => s.namaKlien.toLowerCase().includes(searchTerm.toLowerCase()) || (s.nomorPermohonan && s.nomorPermohonan.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => new Date(a.tanggalRencana).getTime() - new Date(b.tanggalRencana).getTime());

  if (activeScheduleId && activeCaseId) {
    const selectedPermohonan = permohonanList.find(p => p.id === activeCaseId);
    if (selectedPermohonan) {
      return (
        <JadwalKlienDetailView
          scheduleId={activeScheduleId}
          permohonan={selectedPermohonan}
          onBack={handleBack}
        />
      );
    }
  }

  return (
    <div className="space-y-4 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5 tracking-tight">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <span>Daftar Jadwal Klien &amp; Riwayat e-TAT</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantau jadwal pemeriksaan, kontrol medis pascarekomendasi, dan riwayat proses penanganan e-TAT.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama terperiksa atau nomor permohonan e-TAT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>
      </div>

      {/* Grid of Minimalist Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredSchedules.map((schedule, idx) => {
          const isWajibLapor = schedule.jenisKegiatan === 'Wajib Lapor';
          return (
            <div
              key={schedule.id || idx}
              className="group bg-slate-950/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="space-y-2.5">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1">
                      {isWajibLapor ? <UserCheck className="w-3 h-3 text-slate-400" /> : <Stethoscope className="w-3 h-3 text-slate-400" />}
                      {schedule.jenisKegiatan}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {schedule.tanggalRencana}
                  </span>
                </div>
                
                {/* Client Info */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                    {schedule.namaKlien}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-[11px]">{schedule.nomorPermohonan}</span>
                    <span>•</span>
                    <span>{schedule.usia} th</span>
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-start gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="truncate text-slate-300">{schedule.lokasi}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="truncate text-slate-300">{schedule.detailKegiatan}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  NIK: {schedule.nik || '-'}
                </span>
                <button
                  onClick={() => handleOpenDetail(schedule.permohonanId, schedule.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span>Riwayat e-TAT &amp; Detail</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredSchedules.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-slate-950/30 rounded-xl border border-slate-800/60">
            Tidak ada jadwal klien yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default JadwalKlienView;
