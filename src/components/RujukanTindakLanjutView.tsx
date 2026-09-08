import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { REHAB_FACILITIES } from '../data/initialData';
import { Share2, AlertTriangle, CheckCircle2, Clock, Building2, Bed, ArrowRight, UserCheck } from 'lucide-react';

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
  const isRehab = currentUser.role === 'rehabilitasi';

  const tindakLanjutList = permohonanList.filter(p => {
    if (!p.tindakLanjut) return false;
    if (isRehab) {
      // If rehab user, they prioritize their assigned cases
      return true;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-teal-600" />
            <span>
              {isRehab
                ? 'Penerimaan Rujukan Klien & Konfirmasi Kapasitas Layanan'
                : 'Koordinasi Rujukan & Realisasi Tindak Lanjut'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRehab
              ? 'Kelola penerimaan klien rujukan rekomendasi TAT, konfirmasi ketersediaan kamar/kuota, dan catat tanggal mulai layanan rehabilitasi.'
              : 'Memastikan layanan tidak terputus setelah surat rekomendasi terbit; memantau admisi rehabilitasi dan proses hukum berkeadilan restoratif.'}
          </p>
        </div>
      </div>

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
  );
};
