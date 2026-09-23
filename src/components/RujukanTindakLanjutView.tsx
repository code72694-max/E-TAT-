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
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-teal-600" />
            <span>
              {isRehab
                ? 'Penerimaan Rujukan & Pengawasan Klien Pasca TAT'
                : 'Koordinasi Rujukan & Pengawasan Klien Pasca TAT'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRehab
              ? 'Kelola penerimaan admisi rujukan rekomendasi TAT, pantau kapasitas layanan, serta awasi kepatuhan sesi & hasil tes urin berkala klien.'
              : 'Memastikan kesinambungan intervensi: dari koordinasi ketersediaan bed hingga pemantauan kepatuhan program hukum berkeadilan restoratif.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold self-start">
          <button
            onClick={() => setActiveSubTab('rujukan')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeSubTab === 'rujukan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Alur Rujukan & Kuota ({tindakLanjutList.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('pengawasan')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeSubTab === 'pengawasan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Pengawasan Pasca TAT ({pengawasanList.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: RUJUKAN & KAPASITAS FASILITAS */}
      {activeSubTab === 'rujukan' && (
        <div className="space-y-6">
          {/* Facilities Capacity Monitor */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Ketersediaan Kuota & Kapasitas Fasilitas Rehabilitasi Mitra</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {REHAB_FACILITIES.map(f => {
                const isFull = f.kapasitasTersedia <= 0;
                return (
                  <div
                    key={f.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      isFull ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-500">{f.tipe}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isFull ? 'bg-rose-200 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isFull ? 'Penuh' : 'Tersedia'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug">{f.nama}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{f.alamat}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Sisa Kuota:</span>
                      <span className={`font-bold ${isFull ? 'text-rose-700 font-extrabold' : 'text-slate-900'}`}>
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
            <h3 className="text-sm font-bold text-slate-900">Daftar Klien dalam Alur Rujukan & Tindak Lanjut</h3>
            {tindakLanjutList.map(item => {
              const tl = item.tindakLanjut!;
              const isStuck = tl.statusRujukan === 'kapasitas_penuh';
              const isEnrolled = tl.statusRujukan === 'klien_mulai_layanan';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectPermohonan(item.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isStuck
                      ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400'
                      : isEnrolled
                      ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-400'
                      : 'bg-white border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{item.nomorPermohonan}</span>
                        <span className="text-xs text-slate-600">• Terperiksa: <strong>{item.terperiksa.namaLengkap}</strong></span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Fasilitas Rujukan: <strong className="text-slate-800">{tl.namaFasilitasTujuan}</strong> ({tl.kontakFasilitas})
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isStuck
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isEnrolled
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {tl.statusRujukan.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  {tl.hambatanPelaksanaan && (
                    <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs text-rose-900 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Hambatan Penempatan Rujukan:</span>
                        <span>{tl.hambatanPelaksanaan}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/80">
                    <span>Status Proses Hukum: {tl.statusProsesHukumTerkait || 'Penyidikan aktif'}</span>
                    <span className="text-blue-600 font-semibold flex items-center space-x-1">
                      <span>Lihat Detail Koordinasi</span>
                      <ArrowRight className="w-3 h-3" />
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
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Total Klien Diawasi</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalKlienDiawasi} Orang</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Pasca rekomendasi & admisi</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Klien Patuh / Bersih</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{klienPatuh} Orang</div>
              <span className="text-[11px] text-emerald-700 mt-0.5 block">Nihil mangkir & tes urin negatif</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Dalam Peringatan (SP)</span>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">{klienPeringatan} Orang</div>
              <span className="text-[11px] text-amber-700 mt-0.5 block">Mangkir sesi / terbit SP-1</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Selesai Program (SKSP)</span>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">{klienSelesai} Orang</div>
              <span className="text-[11px] text-purple-700 mt-0.5 block">Tuntas memenuhi syarat hukum</span>
            </div>
          </div>

          {/* List Klien dalam Pengawasan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Klien dalam Monitoring & Pengawasan Pasca TAT
              </h3>
              <span className="text-xs text-slate-500">
                Menampilkan seluruh klien yang memiliki catatan wajib lapor aktif
              </span>
            </div>

            {pengawasanList.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
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
                    className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      isWarning
                        ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
                        : isFinished
                        ? 'bg-purple-50/40 border-purple-300 hover:border-purple-400'
                        : 'bg-white border-slate-200 hover:border-teal-400'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{item.nomorPermohonan}</span>
                          <span className="text-xs text-slate-600">• Klien: <strong>{item.terperiksa.namaLengkap}</strong></span>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {pgw.modalitasLayanan} ({pgw.durasiBulan} Bulan)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Lembaga: <strong className="text-slate-800">{pgw.instansiPelaksanaRehab}</strong> • Konselor: {pgw.konselorPendamping} • Penyidik Pengawas: {pgw.penyidikPengawas}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          pgw.statusKepatuhan === 'sangat_patuh'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : pgw.statusKepatuhan === 'patuh'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : pgw.statusKepatuhan === 'dalam_peringatan'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : pgw.statusKepatuhan === 'selesai_program'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {pgw.statusKepatuhan.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Sesi & Tes Urin */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Progres Sesi Wajib Lapor:</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="font-bold text-slate-800">{pgw.sesiTerselesaikan}/{pgw.totalSesiWajib} ({percent}%)</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block">Skrining Toksikologi Urin:</span>
                        <div className="font-bold mt-0.5 flex items-center space-x-1.5">
                          <span>{pgw.riwayatTesUrinBerkala.length}x Diuji</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            lastTest?.hasil === 'Negatif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            Terakhir: {lastTest ? `${lastTest.hasil} (${lastTest.tanggalTes})` : '-'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block">Rekomendasi Tindak Lanjut:</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">
                          {pgw.rekomendasiTindakLanjutHukum}
                        </span>
                      </div>
                    </div>

                    {/* Warning note if SP exists */}
                    {pgw.suratPeringatanList.length > 0 && (
                      <div className="p-2.5 bg-white rounded-lg border border-amber-300 text-xs text-amber-900 flex items-start space-x-2">
                        <BadgeAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">{pgw.suratPeringatanList[0].tingkatSp}:</span> {pgw.suratPeringatanList[0].alasan}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <span className="text-teal-600 text-xs font-semibold flex items-center space-x-1">
                        <span>Buka Buku Pengawasan & Log Urin</span>
                        <ArrowRight className="w-3 h-3" />
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
