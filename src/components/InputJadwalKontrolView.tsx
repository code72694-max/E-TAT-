import React, { useState, useEffect } from 'react';
import type {
  PermohonanAsesmen,
  UserProfile,
  PengawasanKlien,
  BuktiWajibLapor,
  MonitoringTindakLanjut
} from '../types';
import {
  Calendar,
  UserCheck,
  Building2,
  CheckSquare,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';

interface InputJadwalKontrolViewProps {
  permohonanList: PermohonanAsesmen[];
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onNavigateToMonitoring: (caseId: string) => void;
  onBack: () => void;
}

export const InputJadwalKontrolView: React.FC<InputJadwalKontrolViewProps> = ({
  permohonanList,
  currentUser,
  onUpdatePermohonan,
  onNavigateToMonitoring,
  onBack
}) => {
  // Filter: Hanya permohonan resmi e-TAT yang SUDAH SELESAI SIDANG PLENO TAT
  const completedSidangList = permohonanList.filter(p => {
    const isSubmitted = p.applicationStatus !== 'DRAFT';
    const isSidangBeres = p.plenoAssesmen?.statusPleno === 'SELESAI' ||
      !!p.rekomendasiResmi ||
      p.applicationStatus === 'READY_FOR_CONFERENCE' ||
      p.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' ||
      p.applicationStatus === 'OUTCOME_RECORDED_FOR_DRAFT' ||
      p.statusProsesUtama === 'pengesahan_rekomendasi' ||
      p.statusProsesUtama === 'siap_pleno' ||
      !!p.monitoringTindakLanjut ||
      !!p.pengawasanKlien;

    return isSubmitted && isSidangBeres;
  });

  const [selectedPermohonanId, setSelectedPermohonanId] = useState<string>(completedSidangList[0]?.id || permohonanList[0]?.id || '');
  const [modalitas, setModalitas] = useState<'Rawat Jalan' | 'Rawat Inap'>('Rawat Jalan');
  const [fasilitasTujuan, setFasilitasTujuan] = useState('Balai Rehabilitasi BNN Tanah Merah');
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().slice(0, 10));
  const [frekuensiKontrol, setFrekuensiKontrol] = useState('Seminggu 2x (Selasa & Jumat)');
  const [namaDpjp, setNamaDpjp] = useState('dr. Rina Lestari, Sp.KJ');
  
  // Wajib lapor penyidik
  const [tanggalWajibLapor, setTanggalWajibLapor] = useState(new Date().toISOString().slice(0, 10));
  const [namaPenyidik, setNamaPenyidik] = useState('Bripka Heru Susanto');
  const [instansiPenyidik, setInstansiPenyidik] = useState('Satresnarkoba Polresta Samarinda');
  const [kanalPelaporan, setKanalPelaporan] = useState<'langsung' | 'digital' | 'surat'>('langsung');
  const [catatanKhusus, setCatatanKhusus] = useState('Klien bersedia mematuhi seluruh jadwal kontrol medis dan absensi wajib lapor.');

  const selectedClient = permohonanList.find(p => p.id === selectedPermohonanId);

  useEffect(() => {
    if (completedSidangList.length > 0 && (!selectedPermohonanId || !completedSidangList.some(p => p.id === selectedPermohonanId))) {
      setSelectedPermohonanId(completedSidangList[0].id);
    }
  }, [completedSidangList, selectedPermohonanId]);

  useEffect(() => {
    if (selectedClient?.asesmenMedis?.kebutuhanRawat) {
      setModalitas(selectedClient.asesmenMedis.kebutuhanRawat === 'Rawat Inap' ? 'Rawat Inap' : 'Rawat Jalan');
    }
    if (selectedClient?.tindakLanjut?.namaFasilitasTujuan) {
      setFasilitasTujuan(selectedClient.tindakLanjut.namaFasilitasTujuan);
    }
    if (selectedClient?.perkara?.namaPenyidik) {
      setNamaPenyidik(selectedClient.perkara.namaPenyidik);
    }
    if (selectedClient?.perkara?.instansiPenyidik) {
      setInstansiPenyidik(selectedClient.perkara.instansiPenyidik);
    }
  }, [selectedClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const nowTimestamp = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\./g, ':') + ' WIB';

    const updatedPgw: PengawasanKlien = {
      id: selectedClient.pengawasanKlien?.id || 'pgw-' + Date.now(),
      statusKepatuhan: 'sangat_patuh',
      modalitasLayanan: modalitas,
      durasiBulan: 3,
      tanggalMulai: tanggalMulai,
      tanggalTargetSelesai: '3 Bulan Sejak Masuk Program',
      instansiPelaksanaRehab: fasilitasTujuan,
      konselorPendamping: namaDpjp,
      penyidikPengawas: namaPenyidik,
      totalSesiWajib: 12,
      sesiTerselesaikan: selectedClient.pengawasanKlien?.sesiTerselesaikan || 0,
      jumlahMangkir: 0,
      suratPeringatanList: selectedClient.pengawasanKlien?.suratPeringatanList || [],
      riwayatTesUrinBerkala: selectedClient.pengawasanKlien?.riwayatTesUrinBerkala || [],
      jurnalPengawasan: selectedClient.pengawasanKlien?.jurnalPengawasan || [],
      rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
    };

    const newWajibLapor: BuktiWajibLapor = {
      id: 'wl-' + Date.now(),
      tanggalRencanaWajibLapor: tanggalWajibLapor,
      tanggalWajibLapor: tanggalWajibLapor,
      waktuInputSistem: nowTimestamp,
      namaPenyidikPenerima: namaPenyidik,
      instansiPenyidik: instansiPenyidik,
      kegiatanRehabTerkait: `Penjadwalan Kontrol ${modalitas} & Wajib Lapor Mingguan`,
      kanal: kanalPelaporan,
      statusKonfirmasi: 'dikonfirmasi_penyidik',
      statusVerifikasiAdmin: 'terverifikasi',
      catatanAdmin: 'Penjadwalan resmi telah diverifikasi sistem e-TAT.',
      diunggahOleh: currentUser.name,
      tanggalDiunggah: todayStr,
    };

    const currentMonitoring = selectedClient.monitoringTindakLanjut;
    const updatedMonitoring: MonitoringTindakLanjut = currentMonitoring ? {
      ...currentMonitoring,
      buktiWajibLaporList: [newWajibLapor, ...currentMonitoring.buktiWajibLaporList],
      terakhirDiperbarui: todayStr
    } : {
      id: 'mon-' + Date.now(),
      nomorRekomendasi: selectedClient.nomorPermohonan,
      laporanKontrolList: [],
      buktiWajibLaporList: [newWajibLapor],
      statusMonitoring: 'berjalan',
      dibuatOleh: currentUser.role,
      tanggalDibuat: todayStr,
      terakhirDiperbarui: todayStr
    };

    const updatedPermohonan: PermohonanAsesmen = {
      ...selectedClient,
      pengawasanKlien: updatedPgw,
      monitoringTindakLanjut: updatedMonitoring,
      statusTindakLanjut: 'dalam_proses'
    };

    onUpdatePermohonan(updatedPermohonan);
    onNavigateToMonitoring(selectedClient.id);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans max-w-4xl mx-auto pb-10">
      {/* Clean Header Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#1e3a5f]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-[#0c1c38] hover:bg-[#14294d] text-slate-300 hover:text-white border border-[#1e3a5f] rounded-xl text-xs transition-all cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Input Jadwal Kontrol &amp; Wajib Lapor Klien</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Penetapan jadwal rehab medis &amp; absensi wajib lapor penyidik untuk klien yang telah lulus sidang TAT.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" /> Validasi Sidang Pleno
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* CARD 1: SELEKSI KLIEN VERIFIKASI */}
        <div className="bg-[#0a192f] border border-[#1e3a5f] rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-2.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>1. Pilih Klien Terperiksa (Lulus Sidang TAT)</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">Total {completedSidangList.length} Klien Valid</span>
          </div>

          <div className="space-y-3 text-xs">
            <select
              value={selectedPermohonanId}
              onChange={(e) => setSelectedPermohonanId(e.target.value)}
              className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              required
            >
              {completedSidangList.length === 0 ? (
                <option value="">-- Belum ada permohonan yang selesai sidang pleno --</option>
              ) : (
                completedSidangList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.terperiksa.namaLengkap} (NIK: {p.terperiksa.nik || '3578041209940003'}) — LP: {p.perkara.nomorLaporanPolisi || p.nomorPermohonan}
                  </option>
                ))
              )}
            </select>

            {/* Minimal Client Info Strip */}
            {selectedClient && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#071324] border border-[#1c3961] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                    {selectedClient.terperiksa.namaLengkap.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-100 block text-xs">{selectedClient.terperiksa.namaLengkap}</span>
                    <span className="text-[11px] text-slate-400 font-mono">NIK: {selectedClient.terperiksa.nik || '3578041209940003'} • {selectedClient.terperiksa.usia} th</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">No. LP Perkara</span>
                    <span className="text-slate-200 font-semibold">{selectedClient.perkara.nomorLaporanPolisi}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg font-sans font-semibold flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-400" /> Sidang TAT Selesai
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: PENJADWALAN KONTROL MEDIS & REHABILITASI */}
        <div className="bg-[#0a192f] border border-[#1e3a5f] rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-400" />
              <span>2. Jadwal Kontrol Medis &amp; Modalitas Rehab</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Tahap 1 Medis</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Modalitas Pill Selector */}
            <div className="flex items-center gap-2 bg-[#071324] p-1 rounded-xl border border-[#1e3a5f] w-fit">
              <button
                type="button"
                onClick={() => setModalitas('Rawat Jalan')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  modalitas === 'Rawat Jalan'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Rawat Jalan (Kontrol Berkala)
              </button>

              <button
                type="button"
                onClick={() => setModalitas('Rawat Inap')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  modalitas === 'Rawat Inap'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Rawat Inap (Balai Rehab)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Fasilitas Rehabilitasi Tujuan <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={fasilitasTujuan}
                  onChange={(e) => setFasilitasTujuan(e.target.value)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Dokter DPJP / Konselor Medis</label>
                <input
                  type="text"
                  value={namaDpjp}
                  onChange={(e) => setNamaDpjp(e.target.value)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tanggal Mulai Rehabilitasi <span className="text-rose-400">*</span></label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Frekuensi Kontrol Medis</label>
                <select
                  value={frekuensiKontrol}
                  onChange={(e) => setFrekuensiKontrol(e.target.value)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Seminggu 2x (Selasa & Jumat)">Seminggu 2x (Selasa &amp; Jumat)</option>
                  <option value="Seminggu 1x (Mingguan)">Seminggu 1x (Mingguan)</option>
                  <option value="Setiap 2 Minggu Sekali">Setiap 2 Minggu Sekali</option>
                  <option value="Setiap Bulan (Periodik)">Setiap Bulan (Periodik)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: PENJADWALAN WAJIB LAPOR PENYIDIK */}
        <div className="bg-[#0a192f] border border-[#1e3a5f] rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <span>3. Jadwal Wajib Lapor Kepada Penyidik / JPU</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Tahap 2 Hukum</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Rencana Tanggal Wajib Lapor Ke-1 <span className="text-rose-400">*</span></label>
                <input
                  type="date"
                  value={tanggalWajibLapor}
                  onChange={(e) => setTanggalWajibLapor(e.target.value)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Kanal Pelaporan</label>
                <select
                  value={kanalPelaporan}
                  onChange={(e) => setKanalPelaporan(e.target.value as any)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="langsung">Tatap Muka / Datang Langsung</option>
                  <option value="digital">Kanal Digital / Video Call</option>
                  <option value="surat">Surat Keterangan Fasilitas</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Penyidik / JPU Penerima Berwenang <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={namaPenyidik}
                  onChange={(e) => setNamaPenyidik(e.target.value)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Instansi / Tempat Pelaporan <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={instansiPenyidik}
                  onChange={(e) => setInstansiPenyidik(e.target.value)}
                  className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Catatan &amp; Instruksi Khusus Klien</label>
              <textarea
                rows={2}
                value={catatanKhusus}
                onChange={(e) => setCatatanKhusus(e.target.value)}
                className="w-full p-2.5 bg-[#071324] border border-[#1e3a5f] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex items-center justify-between gap-3 p-4 bg-[#0a192f] border border-[#1e3a5f] rounded-2xl shadow-lg">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-[#0e223f] hover:bg-[#163056] text-slate-300 border border-[#234475] font-semibold rounded-xl text-xs transition-all cursor-pointer"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Simpan &amp; Terbitkan Penjadwalan</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputJadwalKontrolView;
