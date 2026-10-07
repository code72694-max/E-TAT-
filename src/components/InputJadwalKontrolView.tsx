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
  Stethoscope,
  Search,
  X,
  User,
  Scale,
  FileText,
  ChevronRight,
  Filter,
  AlertCircle
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
  // Filter: Hanya permohonan resmi e-TAT yang SUDAH SELESAI SIDANG PLENO TAT & milik akun Pengaju jika login sebagai PENGAJU
  const completedSidangList = permohonanList.filter(p => {
    const isPengajuRole = currentUser.role?.toUpperCase() === 'PENGAJU';
    const isOwner = !isPengajuRole ||
      p.pengajuId === currentUser.id ||
      (p.pengajuNama && p.pengajuNama.toLowerCase().includes((currentUser.name || '').toLowerCase())) ||
      (p.perkara?.namaPenyidik && p.perkara.namaPenyidik.toLowerCase().includes((currentUser.name || '').toLowerCase())) ||
      (p.instansiPengaju && currentUser.agency && p.instansiPengaju.toLowerCase().includes(currentUser.agency.toLowerCase())) ||
      (p.instansiPengaju && currentUser.instansi && p.instansiPengaju.toLowerCase().includes(currentUser.instansi.toLowerCase()));

    if (!isOwner) return false;

    const isSubmitted = p.applicationStatus !== 'DRAFT';
    const isSidangBeres = p.plenoAssesmen?.statusPleno === 'SELESAI' ||
      !!p.rekomendasiResmi ||
      p.applicationStatus === 'READY_FOR_CONFERENCE' ||
      p.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' ||
      p.applicationStatus === 'OUTCOME_RECORDED_FOR_DRAFT' ||
      p.statusProsesUtama === 'pengesahan_rekomendasi' ||
      p.statusProsesUtama === 'rekomendasi_terbit' ||
      p.statusProsesUtama === 'selesai_tindak_lanjut' ||
      p.statusProsesUtama === 'siap_pleno' ||
      !!p.monitoringTindakLanjut ||
      !!p.pengawasanKlien;

    return isSubmitted && isSidangBeres;
  });

  const [selectedPermohonanId, setSelectedPermohonanId] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
  const [clientFilterCategory, setClientFilterCategory] = useState<'semua' | 'rawat_jalan' | 'rawat_inap'>('semua');

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

  // Filtered clients list for the search modal
  const filteredModalClients = completedSidangList.filter(p => {
    const q = clientSearchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      p.terperiksa.namaLengkap.toLowerCase().includes(q) ||
      (p.terperiksa.nik && p.terperiksa.nik.includes(q)) ||
      p.nomorPermohonan.toLowerCase().includes(q) ||
      p.perkara.nomorLaporanPolisi.toLowerCase().includes(q) ||
      p.perkara.instansiPenyidik.toLowerCase().includes(q);

    if (!matchQuery) return false;

    const rawatType = p.asesmenMedis?.kebutuhanRawat?.toLowerCase() || '';
    if (clientFilterCategory === 'rawat_jalan') {
      return rawatType.includes('jalan') || !rawatType.includes('inap');
    }
    if (clientFilterCategory === 'rawat_inap') {
      return rawatType.includes('inap');
    }
    return true;
  });

  const handleSelectClientFromModal = (client: PermohonanAsesmen) => {
    setSelectedPermohonanId(client.id);
    setIsSearchModalOpen(false);
  };

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
    if (!selectedClient) {
      alert('Silakan pilih klien terperiksa terlebih dahulu.');
      setIsSearchModalOpen(true);
      return;
    }

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
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2 font-['Roboto',sans-serif]">
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
        {/* CARD 1: SELEKSI KLIEN DENGAN MODAL SHOPEE-LIKE PICKER */}
        <div className="bg-[#0a192f] border border-[#1e3a5f] rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-2.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-['Roboto',sans-serif]">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>1. Pilih Klien Terperiksa (Lulus Sidang TAT)</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">Total {completedSidangList.length} Klien Siap Dijadwalkan</span>
          </div>

          <div className="space-y-3 text-xs">
            {!selectedClient ? (
              /* State 1: Belum Ada Klien Terpilih (Default Bersih) */
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full px-4 py-3 rounded-xl border border-[#1e3a5f] bg-[#071324] hover:bg-[#0c1e38] hover:border-blue-500/60 transition-all flex items-center justify-between gap-3 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-xs sm:text-sm text-slate-300 group-hover:text-blue-300 transition-colors block truncate">
                      Cari Nama Klien, NIK, No. LP, atau Instansi...
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      Klik untuk membuka daftar klien yang telah lulus sidang TAT
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ) : (
              /* State 2: Klien Terpilih Ditampilkan */
              <div className="p-4 bg-[#071324] border border-blue-500/40 rounded-xl space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c3961]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                      {selectedClient.terperiksa.namaLengkap.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{selectedClient.terperiksa.namaLengkap}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold">
                          Terpilih
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 font-mono">
                        NIK: {selectedClient.terperiksa.nik || '3578041209940003'} • Usia: {selectedClient.terperiksa.usia} th • {selectedClient.terperiksa.pekerjaan || 'Wiraswasta'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSearchModalOpen(true)}
                    className="self-start sm:self-auto px-3 py-1.5 bg-[#0e223f] hover:bg-[#163560] text-blue-300 hover:text-white border border-[#234475] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ganti Klien Lain</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                  <div className="bg-[#0b172a] p-2.5 rounded-lg border border-[#1b3459]">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">No. LP Perkara:</span>
                    <span className="font-mono text-slate-200 font-semibold truncate block">{selectedClient.perkara.nomorLaporanPolisi}</span>
                  </div>
                  <div className="bg-[#0b172a] p-2.5 rounded-lg border border-[#1b3459]">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Penyidik Pengaju:</span>
                    <span className="text-slate-200 truncate block">{selectedClient.perkara.namaPenyidik}</span>
                  </div>
                  <div className="bg-[#0b172a] p-2.5 rounded-lg border border-[#1b3459]">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Rekomendasi Pleno:</span>
                    <span className="text-emerald-400 font-semibold truncate block">
                      {selectedClient.asesmenMedis?.kebutuhanRawat || 'Rehabilitasi Rawat Jalan'}
                    </span>
                  </div>
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
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Simpan &amp; Terbitkan Penjadwalan</span>
          </button>
        </div>
      </form>

      {/* =========================================================
          SHOPEE-STYLE INTERACTIVE CLIENT SEARCH & SELECTION MODAL
          ========================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-[#0b172a] border border-[#1b3459] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header & Search Bar */}
            <div className="p-4 sm:p-5 border-b border-[#1b3459] bg-[#081224] space-y-3.5 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-['Roboto',sans-serif]">
                      Pilih Klien Terperiksa (Lulus Sidang TAT)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Cari dan pilih klien yang telah menyelesaikan asesmen dan siap diterbitkan jadwal kontrol
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#142642] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Shopee-like Instant Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={clientSearchQuery}
                  onChange={e => setClientSearchQuery(e.target.value)}
                  placeholder="Ketik nama terperiksa, NIK, nomor LP, atau nomor TAT..."
                  className="w-full bg-[#050e1c] focus:bg-[#0c1c34] text-white pl-10 pr-9 py-2.5 rounded-xl border border-[#1b3459] focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-xs sm:text-sm outline-none placeholder-slate-500 transition-all shadow-inner"
                />
                {clientSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setClientSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                {[
                  { id: 'semua', label: `Semua (${completedSidangList.length})` },
                  { id: 'rawat_jalan', label: 'Rekomendasi Rawat Jalan' },
                  { id: 'rawat_inap', label: 'Rekomendasi Rawat Inap' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setClientFilterCategory(cat.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      clientFilterCategory === cat.id
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'bg-[#050e1c] text-slate-400 border-[#1b3459] hover:border-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Scrollable Client Cards List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 custom-scrollbar flex-1 bg-[#091426]">
              {filteredModalClients.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#081224] border border-[#1b3459] flex items-center justify-center mx-auto text-slate-500">
                    <User className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Tidak Ada Klien Ditemukan</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {clientSearchQuery
                      ? `Tidak ada data klien yang cocok dengan kata kunci "${clientSearchQuery}". Coba gunakan nama lain atau NIK.`
                      : 'Belum ada data permohonan yang telah menyelesaikan sidang pleno TAT.'}
                  </p>
                </div>
              ) : (
                filteredModalClients.map(client => {
                  const isSelected = client.id === selectedPermohonanId;
                  const rawatText = client.asesmenMedis?.kebutuhanRawat || 'Rehabilitasi Rawat Jalan';
                  const isRawatInap = rawatText.toLowerCase().includes('inap');

                  return (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClientFromModal(client)}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                        isSelected
                          ? 'bg-[#0f274a] border-blue-400 shadow-md shadow-blue-500/10 ring-1 ring-blue-400/40'
                          : 'bg-[#0b172a] border-[#1b3459] hover:bg-[#11233f] hover:border-blue-500/60'
                      }`}
                    >
                      {/* Client Info Left Column */}
                      <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 shadow-sm ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#142642] text-blue-300 border border-[#234475] group-hover:bg-blue-600 group-hover:text-white transition-colors'
                        }`}>
                          {client.terperiksa.namaLengkap.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors truncate">
                              {client.terperiksa.namaLengkap}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({client.terperiksa.usia} th • {client.terperiksa.jenisKelamin})
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-mono text-slate-300">NIK: {client.terperiksa.nik || '-'}</span>
                            <span className="text-slate-600">•</span>
                            <span className="truncate">LP: {client.perkara.nomorLaporanPolisi}</span>
                          </p>

                          <p className="text-[11px] text-slate-400 truncate">
                            Penyidik: <span className="text-slate-300">{client.perkara.namaPenyidik}</span> ({client.perkara.instansiPenyidik})
                          </p>
                        </div>
                      </div>

                      {/* Client Recommendation Badge & Action Right Column */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1b3459]/60">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isRawatInap
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                        }`}>
                          {rawatText}
                        </span>

                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-[#142642] group-hover:bg-blue-600 text-blue-300 group-hover:text-white border border-[#234475]'
                        }`}>
                          <span>{isSelected ? '✓ Terpilih' : 'Pilih Klien'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 border-t border-[#1b3459] bg-[#081224] flex items-center justify-between text-xs shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">
                Menampilkan {filteredModalClients.length} dari {completedSidangList.length} klien lulus sidang
              </span>

              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="px-4 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-200 border border-[#234475] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputJadwalKontrolView;
