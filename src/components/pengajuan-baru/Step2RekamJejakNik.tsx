import React from 'react';
import { Database, RefreshCw, ShieldCheck, AlertTriangle, CheckCircle2, History } from 'lucide-react';

interface Step2RekamJejakNikProps {
  namaLengkap: string;
  alias: string;
  nik: string;
  isCheckingNik: boolean;
  checkNikDatabase: (targetNik: string) => void;
  statusResidivis: 'bukan_residivis' | 'residivis_1x' | 'residivis_berulang';
  dbRiwayat: any[];
}

export const Step2RekamJejakNik: React.FC<Step2RekamJejakNikProps> = ({
  namaLengkap,
  alias,
  nik,
  isCheckingNik,
  checkNikDatabase,
  statusResidivis,
  dbRiwayat,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div className="flex items-center space-x-2.5">
          <Database className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <span className="font-bold text-white text-base block">
              Pemeriksaan Rekam Jejak Terpadu (Berdasarkan NIK)
            </span>
            <span className="text-xs text-slate-400">
              Pengecekan langsung ke basis data nasional e-TAT Polri/BNN &amp; Putusan SIPP
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {nik && (
            <button
              type="button"
              onClick={() => checkNikDatabase(nik)}
              disabled={isCheckingNik}
              className="text-xs text-slate-300 hover:text-white bg-[#142642] hover:bg-[#1b3459] border border-[#234475] px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Periksa ulang database e-TAT"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingNik ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>{isCheckingNik ? 'Memeriksa...' : 'Cek Ulang DB'}</span>
            </button>
          )}
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Live Database e-TAT</span>
          </span>
        </div>
      </div>

      {/* Subjek Info Bar */}
      <div className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">Subjek Terperiksa:</div>
          <div className="font-bold text-white text-base">
            {namaLengkap || 'Nama belum diisi di Langkah 1'} {alias ? `(${alias})` : ''}
          </div>
        </div>
        <div className="sm:text-right">
          <div className="text-xs text-slate-400">NIK Terperiksa:</div>
          <div className="font-mono font-bold text-[#D4AF37] text-base">
            {nik || 'Belum diisi (Kembali ke Langkah 1)'}
          </div>
        </div>
      </div>

      {/* Hasil Pemeriksaan Real Dari Database */}
      {!nik ? (
        <div className="p-5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300 text-sm mb-1">NIK Belum Diisi</div>
            <p>
              Harap kembali ke <strong>Langkah 1</strong> dan masukkan NIK terperiksa untuk melakukan pengecekan rekam jejak kriminal di sistem e-TAT.
            </p>
          </div>
        </div>
      ) : isCheckingNik ? (
        <div className="p-12 text-center bg-[#050e1c] border border-[#1b3459] rounded-2xl space-y-3">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-200">Menghubungkan ke basis data e-TAT...</p>
          <p className="text-xs text-slate-400">Memeriksa riwayat perkara dan asesmen masa lalu untuk NIK {nik}</p>
        </div>
      ) : dbRiwayat.length === 0 ? (
        <div className="p-8 text-center bg-[#050e1c] border border-emerald-500/30 rounded-2xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">Nihil / Bersih dari Catatan Kasus e-TAT</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Tidak ditemukan riwayat perkara narkotika maupun permohonan asesmen TAT sebelumnya atas nama NIK{' '}
            <span className="font-mono text-[#D4AF37] font-semibold">{nik}</span>. Subjek tergolong bukan residivis di sistem e-TAT.
          </p>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Status: Bukan Residivis (Kasus Pertama)</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <History className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-amber-200">Ditemukan {dbRiwayat.length} Catatan Riwayat Kasus</span>
                <p className="text-xs text-amber-300/80">NIK {nik} tercatat memiliki riwayat pengajuan/perkara sebelumnya di e-TAT</p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {statusResidivis === 'residivis_berulang' ? 'Residivis Berulang' : 'Residivis 1x'}
            </span>
          </div>

          <div className="space-y-3">
            {dbRiwayat.map((item, idx) => (
              <div key={item.id || idx} className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-4 transition-all shadow-sm space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold bg-[#142642] text-[#D4AF37] px-2.5 py-0.5 rounded border border-[#234475]">
                        {item.nomorPermohonan}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        LP: {item.nomorLp}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        Status: {item.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1.5">
                      {item.instansiPengaju} • {item.pasal}
                    </h4>
                  </div>
                  <span className="text-slate-400 text-xs font-mono shrink-0">
                    {item.tanggalPengajuan || item.tanggalLp}
                  </span>
                </div>

                {item.kronologi && item.kronologi !== '-' && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#081224] p-2.5 rounded-lg border border-[#1b3459]/50">
                    {item.kronologi}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1 border-t border-[#1b3459]/50">
                  <span className="text-slate-300 font-semibold">
                    Barang Bukti: <span className="font-normal text-slate-400">{item.barangBuktiSummary}</span>
                  </span>
                  {item.rekomendasiFinal && (
                    <>
                      <span>•</span>
                      <span className="text-[#D4AF37] font-semibold">Rekomendasi: {item.rekomendasiFinal}</span>
                    </>
                  )}
                  {item.fasilitasRehab && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">Fasilitas: {item.fasilitasRehab}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
