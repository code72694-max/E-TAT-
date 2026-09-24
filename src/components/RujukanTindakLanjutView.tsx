import React, { useState } from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { REHAB_FACILITIES } from '../data/initialData';
import {
  Share2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Bed,
  ArrowRight,
  UserCheck,
  Activity,
  Stethoscope,
  Award,
  BadgeAlert,
  Calendar
} from 'lucide-react';

interface RujukanTindakLanjutViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onSelectPermohonan: (id: string) => void;
}

export const RujukanTindakLanjutView: React.FC<RujukanTindakLanjutViewProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rujukan' | 'pengawasan'>('rujukan');
  const isRehab = currentUser.role === 'rehabilitasi';

  const tindakLanjutList = permohonanList.filter(p => !!p.tindakLanjut);
  const pengawasanList = permohonanList.filter(p => !!p.pengawasanKlien);

  // Metrics for pengawasan
  const totalKlienDiawasi = pengawasanList.length;
  const klienPatuh = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'sangat_patuh' || p.pengawasanKlien?.statusKepatuhan === 'patuh').length;
  const klienPeringatan = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'dalam_peringatan' || p.pengawasanKlien?.statusKepatuhan === 'tidak_patuh_mangkir').length;
  const klienSelesai = pengawasanList.filter(p => p.pengawasanKlien?.statusKepatuhan === 'selesai_program').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <Share2 className="w-5 h-5 text-[#38bdf8]" />
            <span>
              {isRehab
                ? 'Penerimaan Rujukan & Pengawasan Klien Pasca TAT'
                : 'Koordinasi Rujukan & Pengawasan Klien Pasca TAT'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRehab
              ? 'Kelola penerimaan admisi rujukan rekomendasi TAT, pantau kapasitas layanan, serta awasi kepatuhan sesi & hasil tes urin berkala klien.'
              : 'Memastikan kesinambungan intervensi: dari koordinasi ketersediaan bed hingga pemantauan kepatuhan program hukum berkeadilan restoratif.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0b172a] border border-[#1b3459] p-1 rounded-xl text-xs font-semibold self-start shadow-sm">
          <button
            onClick={() => setActiveSubTab('rujukan')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeSubTab === 'rujukan'
                ? 'bg-[#1b3459] text-white font-bold border border-[#2d5289]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Alur Rujukan & Kuota ({tindakLanjutList.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('pengawasan')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeSubTab === 'pengawasan'
                ? 'bg-[#1b3459] text-white font-bold border border-[#2d5289]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Pengawasan Pasca TAT ({pengawasanList.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: RUJUKAN & KAPASITAS FASILITAS */}
      {activeSubTab === 'rujukan' && (
        <div className="space-y-6">
          {/* Facilities Capacity Monitor */}
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-3 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
              <Building2 className="w-4 h-4 text-[#38bdf8]" />
              <span>Ketersediaan Kuota & Kapasitas Fasilitas Rehabilitasi Mitra</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {REHAB_FACILITIES.map(f => {
                const isFull = f.kapasitasTersedia <= 0;
                return (
                  <div
                    key={f.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      isFull ? 'bg-rose-950/20 border-rose-800/50' : 'bg-[#081224] border-[#1b3459]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">{f.tipe}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          isFull ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {isFull ? 'Penuh' : 'Tersedia'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1 leading-snug">{f.nama}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{f.alamat}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#1b3459] flex items-center justify-between text-xs">
                      <span className="text-slate-400">Sisa Kuota:</span>
                      <span className={`font-bold ${isFull ? 'text-rose-400 font-extrabold' : 'text-slate-200'}`}>
                        {f.kapasitasTersedia} / {f.kapasitasTotal} Slot
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Referrals List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-['Cinzel',serif]">Daftar Klien dalam Alur Rujukan & Tindak Lanjut</h3>
            {tindakLanjutList.map(item => {
              const tl = item.tindakLanjut!;
              const isStuck = tl.statusRujukan === 'kapasitas_penuh';
              const isEnrolled = tl.statusRujukan === 'klien_mulai_layanan';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectPermohonan(item.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 shadow-lg shadow-black/20 group ${
                    isStuck
                      ? 'bg-[#0b172a] border-rose-700/60 hover:border-rose-500'
                      : isEnrolled
                      ? 'bg-[#0b172a] border-emerald-700/50 hover:border-emerald-400'
                      : 'bg-[#0b172a] border-[#1b3459] hover:border-[#38bdf8]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{item.nomorPermohonan}</span>
                        <span className="text-xs text-slate-300">• Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong></span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Fasilitas Rujukan: <strong className="text-slate-200">{tl.namaFasilitasTujuan}</strong> ({tl.kontakFasilitas})
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isStuck
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isEnrolled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}>
                      {tl.statusRujukan.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  {tl.hambatanPelaksanaan && (
                    <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-800/50 text-xs text-rose-200 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-rose-300">Hambatan Penempatan Rujukan:</span>
                        <span>{tl.hambatanPelaksanaan}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400 pt-1 border-t border-[#1b3459]">
                    <span>Status Proses Hukum: {tl.statusProsesHukumTerkait || 'Penyidikan aktif'}</span>
                    <span className="text-[#38bdf8] font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Lihat Detail Koordinasi</span>
                      <ArrowRight className="w-3 h-3 text-[#F1C40F]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MONITORING PENGAWASAN KLIEN PASCA TAT */}
      {activeSubTab === 'pengawasan' && (
        <div className="space-y-6">
          {/* Summary Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Klien Diawasi</span>
              <div className="text-2xl font-extrabold text-white mt-1">{totalKlienDiawasi} Orang</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Pasca rekomendasi & admisi</span>
            </div>

            <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
              <span className="text-[11px] font-bold uppercase text-emerald-400 block">Klien Patuh / Bersih</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{klienPatuh} Orang</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Nihil mangkir & tes urin negatif</span>
            </div>

            <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
              <span className="text-[11px] font-bold uppercase text-amber-400 block">Dalam Peringatan (SP)</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{klienPeringatan} Orang</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Mangkir sesi / terbit SP-1</span>
            </div>

            <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 shadow-lg shadow-black/20">
              <span className="text-[11px] font-bold uppercase text-[#38bdf8] block">Selesai Program (SKSP)</span>
              <div className="text-2xl font-extrabold text-[#38bdf8] mt-1">{klienSelesai} Orang</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Tuntas memenuhi syarat hukum</span>
            </div>
          </div>

          {/* List Klien dalam Pengawasan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Cinzel',serif]">
                Daftar Klien dalam Monitoring & Pengawasan Pasca TAT
              </h3>
              <span className="text-xs text-slate-400">
                Menampilkan seluruh klien yang memiliki catatan wajib lapor aktif
              </span>
            </div>

            {pengawasanList.length === 0 ? (
              <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-8 text-center text-slate-400 text-xs">
                Belum ada klien yang terdaftar dalam program pengawasan pasca TAT.
              </div>
            ) : (
              pengawasanList.map(item => {
                const pgw = item.pengawasanKlien!;
                const percent = Math.min(100, Math.round((pgw.sesiTerselesaikan / pgw.totalSesiWajib) * 100));
                const isWarning = pgw.statusKepatuhan === 'dalam_peringatan' || pgw.statusKepatuhan === 'tidak_patuh_mangkir';
                const isFinished = pgw.statusKepatuhan === 'selesai_program';
                const lastTest = pgw.riwayatTesUrinBerkala[0];

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectPermohonan(item.id)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 shadow-lg shadow-black/20 group ${
                      isWarning
                        ? 'bg-[#0b172a] border-amber-500/50 hover:border-amber-400'
                        : isFinished
                        ? 'bg-[#0b172a] border-[#38bdf8]/50 hover:border-[#38bdf8]'
                        : 'bg-[#0b172a] border-[#1b3459] hover:border-[#38bdf8]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] font-mono transition-colors">{item.nomorPermohonan}</span>
                          <span className="text-xs text-slate-300">• Klien: <strong className="text-white">{item.terperiksa.namaLengkap}</strong></span>
                          <span className="text-[11px] bg-[#081224] text-slate-300 px-2 py-0.5 rounded border border-[#1b3459]">
                            {pgw.modalitasLayanan} ({pgw.durasiBulan} Bulan)
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Lembaga: <strong className="text-slate-200">{pgw.instansiPelaksanaRehab}</strong> • Konselor: {pgw.konselorPendamping} • Penyidik: {pgw.penyidikPengawas}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          pgw.statusKepatuhan === 'sangat_patuh'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : pgw.statusKepatuhan === 'patuh'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : pgw.statusKepatuhan === 'dalam_peringatan'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : pgw.statusKepatuhan === 'selesai_program'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {pgw.statusKepatuhan.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Sesi & Tes Urin */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1b3459] text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Progres Sesi Wajib Lapor:</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <div className="flex-1 bg-[#081224] h-2 rounded-full overflow-hidden border border-[#1b3459]">
                            <div className="bg-gradient-to-r from-[#17549c] to-[#38bdf8] h-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="font-bold text-slate-200">{pgw.sesiTerselesaikan}/{pgw.totalSesiWajib} ({percent}%)</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block">Skrining Toksikologi Urin:</span>
                        <div className="font-bold mt-0.5 flex items-center space-x-1.5">
                          <span className="text-slate-200">{pgw.riwayatTesUrinBerkala.length}x Diuji</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                            lastTest?.hasil === 'Negatif' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            Terakhir: {lastTest ? `${lastTest.hasil} (${lastTest.tanggalTes})` : '-'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block">Rekomendasi Tindak Lanjut:</span>
                        <span className="font-bold text-slate-200 mt-0.5 block">
                          {pgw.rekomendasiTindakLanjutHukum}
                        </span>
                      </div>
                    </div>

                    {/* Warning note if SP exists */}
                    {pgw.suratPeringatanList.length > 0 && (
                      <div className="p-2.5 bg-amber-950/30 rounded-lg border border-amber-600/50 text-xs text-amber-200 flex items-start space-x-2">
                        <BadgeAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-300">{pgw.suratPeringatanList[0].tingkatSp}:</span> {pgw.suratPeringatanList[0].alasan}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <span className="text-[#38bdf8] text-xs font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Buka Buku Pengawasan & Log Urin</span>
                        <ArrowRight className="w-3 h-3 text-[#F1C40F]" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
