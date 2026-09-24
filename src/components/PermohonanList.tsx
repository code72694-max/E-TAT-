import React, { useState, useMemo } from 'react';
import { PermohonanAsesmen, StatusProsesUtama, UserProfile } from '../types';
import {
  Search,
  Filter,
  Clock,
  User,
  Plus,
  ArrowRight,
  Shield,
  FileText,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PermohonanListProps {
  permohonanList: PermohonanAsesmen[];
  currentUser?: UserProfile;
  onSelectPermohonan: (id: string) => void;
  onOpenNewModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const PermohonanList: React.FC<PermohonanListProps> = ({
  permohonanList,
  currentUser,
  onSelectPermohonan,
  onOpenNewModal,
  searchQuery,
  onSearchChange
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSla, setSelectedSla] = useState<string>('all');

  const role = currentUser?.role || 'sekretariat';

  const filteredList = useMemo(() => {
    return permohonanList.filter(item => {
      // Role-specific scoping
      if (role === 'rehabilitasi') {
        // Only show items that have recommendation for rehabilitation or in referral stage
        if (!item.tindakLanjut && item.statusProsesUtama !== 'rekomendasi_terbit' && item.statusProsesUtama !== 'selesai_tindak_lanjut') {
          return false;
        }
      }

      // Search match
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        item.nomorPermohonan.toLowerCase().includes(query) ||
        item.terperiksa.namaLengkap.toLowerCase().includes(query) ||
        item.perkara.nomorLaporanPolisi.toLowerCase().includes(query) ||
        item.perkara.pasalDipersangkakan.toLowerCase().includes(query);

      // Stage match
      const matchStage = selectedStage === 'all' || item.statusProsesUtama === selectedStage;

      // SLA match
      const matchSla =
        selectedSla === 'all' ||
        (selectedSla === 'mendekati' && item.isMendekatiTenggat) ||
        (selectedSla === 'melewati' && item.isMelewatiTenggat);

      return matchSearch && matchStage && matchSla;
    });
  }, [permohonanList, searchQuery, selectedStage, selectedSla, role]);

  const getStageBadge = (stage: StatusProsesUtama) => {
    const labels: Record<StatusProsesUtama, string> = {
      draf: 'Draf',
      diajukan: 'Diajukan',
      verifikasi_berkas: 'Verifikasi Berkas',
      perlu_perbaikan: 'Perlu Perbaikan',
      penugasan_jadwal: 'Penugasan & Jadwal',
      asesmen_berlangsung: 'Asesmen Berlangsung',
      siap_pleno: 'Siap Pleno',
      pembahasan_pleno: 'Pembahasan Pleno',
      pengesahan_rekomendasi: 'Pengesahan',
      rekomendasi_terbit: 'Rekomendasi Terbit',
      selesai_tindak_lanjut: 'Selesai Tindak Lanjut'
    };

    const label = labels[stage] || stage;
    return (
      <span className="bg-[#081224] text-slate-200 border border-[#1b3459] px-2.5 py-0.5 rounded text-xs font-mono font-medium">
        {label}
      </span>
    );
  };

  const getRoleHeaderInfo = () => {
    switch (role) {
      case 'pengaju':
        return {
          title: 'Berkas Pengajuan Asesmen Saya',
          desc: 'Daftar permohonan yang diajukan oleh unit kerja Anda (Sat Resnarkoba Polresta Bandung). Lacak progres, penuhi koreksi, dan unduh rekomendasi.',
          canCreate: true,
          createLabel: 'Pengajuan Asesmen Baru'
        };
      case 'sekretariat':
        return {
          title: 'Antrean Pengajuan Masuk & Berkas Berjalan',
          desc: 'Pemeriksaan kelengkapan berkas, pengaturan penugasan asesor medis & hukum, persiapan pleno, serta distribusi dokumen.',
          canCreate: true,
          createLabel: 'Input Permohonan (Loket)'
        };
      case 'medis':
        return {
          title: 'Daftar Kasus Ditugaskan (Asesor Medis)',
          desc: 'Perkara yang ditugaskan untuk pemeriksaan riwayat penggunaan zat, status fisik, evaluasi kejiwaan, dan skrining toksikologi.',
          canCreate: false,
          createLabel: ''
        };
      case 'hukum':
        return {
          title: 'Daftar Kasus Ditugaskan (Asesor Hukum)',
          desc: 'Perkara yang ditugaskan untuk telaah berkas perkara (LP/BAP), analisis peran penyalahguna vs pengedar, dan batas gramatur.',
          canCreate: false,
          createLabel: ''
        };
      case 'koordinator':
        return {
          title: 'Ringkasan Permohonan & Hambatan Kasus TAT',
          desc: 'Kendali penyelesaian berkas, kesiapan pembahasan tim pleno, dan dokumen yang menunggu pengesahan mandat.',
          canCreate: false,
          createLabel: ''
        };
      case 'pimpinan':
        return {
          title: 'Pengawasan Berkas Berjalan Eksekutif',
          desc: 'Pengawasan menyeluruh terhadap pergerakan berkas, keterlambatan SLA 6 hari, dan hambatan pelayanan terpadu.',
          canCreate: false,
          createLabel: ''
        };
      case 'rehabilitasi':
        return {
          title: 'Daftar Klien Rujukan Fasilitas',
          desc: 'Perkara dengan rekomendasi resmi layanan rehabilitasi medis atau rehabilitasi sosial di fasilitas mitra.',
          canCreate: false,
          createLabel: ''
        };
      case 'admin':
        return {
          title: 'Data Registrasi Berkas Sistem',
          desc: 'Metadata dan nomor registrasi perkara asesmen terpadu untuk monitoring integritas sistem e-TAT.',
          canCreate: false,
          createLabel: ''
        };
      default:
        return {
          title: 'Daftar Permohonan Asesmen Terpadu',
          desc: 'Penelusuran status berkas permohonan asesmen terpadu.',
          canCreate: false,
          createLabel: ''
        };
    }
  };

  const headerInfo = getRoleHeaderInfo();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <span>{headerInfo.title}</span>
            <span className="text-xs bg-[#0b172a] text-[#38bdf8] border border-[#1b3459] font-semibold px-2 py-0.5 rounded-full font-mono">
              {filteredList.length} Berkas
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {headerInfo.desc}
          </p>
        </div>

        {headerInfo.canCreate && (
          <button
            id="btn-tambah-permohonan"
            onClick={onOpenNewModal}
            className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all shrink-0 border border-[#235594] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{headerInfo.createLabel}</span>
          </button>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-3 shadow-lg shadow-black/20">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nomor permohonan (misal: TAT/2026/09/089), nama terperiksa, atau no LP..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#081224] border border-[#1b3459] text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8]"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Tahap:</span>
            </div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="text-xs border border-[#1b3459] rounded-lg px-2.5 py-1.5 bg-[#081224] text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
            >
              <option value="all">Semua Tahap</option>
              <option value="verifikasi_berkas">Verifikasi Berkas</option>
              <option value="perlu_perbaikan">Perlu Perbaikan</option>
              <option value="penugasan_jadwal">Penugasan & Jadwal</option>
              <option value="asesmen_berlangsung">Asesmen Berlangsung</option>
              <option value="siap_pleno">Siap Pleno</option>
              <option value="pengesahan_rekomendasi">Pengesahan Rekomendasi</option>
              <option value="rekomendasi_terbit">Rekomendasi Terbit</option>
              <option value="selesai_tindak_lanjut">Selesai Tindak Lanjut</option>
            </select>

            <select
              value={selectedSla}
              onChange={(e) => setSelectedSla(e.target.value)}
              className="text-xs border border-[#1b3459] rounded-lg px-2.5 py-1.5 bg-[#081224] text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
            >
              <option value="all">Semua Waktu SLA</option>
              <option value="mendekati">Mendekati Batas Waktu</option>
              <option value="melewati">Melewati Target</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Cards / List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-12 text-center shadow-lg shadow-black/20">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">Tidak ada permohonan yang sesuai kriteria filter.</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPermohonan(item.id)}
              className="bg-[#0b172a] border border-[#1b3459] hover:border-[#38bdf8] rounded-xl p-4 transition-all cursor-pointer group shadow-md shadow-black/10 hover:shadow-cyan-950/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                {/* Left: Identification & Stages */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-[#38bdf8] transition-colors font-mono">
                      {item.nomorPermohonan}
                    </span>
                    {getStageBadge(item.statusProsesUtama)}
                    {item.terperiksa.statusIdentitasKhusus === 'anak_berhadapan_hukum' && (
                      <span className="bg-[#081224] text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-[#1b3459]">
                        ABH (Anak)
                      </span>
                    )}
                    {item.isMendekatiTenggat && (
                      <span className="bg-[#081224] text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1 border border-[#1b3459]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Mendekati Batas SLA</span>
                      </span>
                    )}
                  </div>

                  {/* Terperiksa & Perkara Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Terperiksa: <strong className="text-white">{item.terperiksa.namaLengkap}</strong> ({item.terperiksa.usia} th, {item.terperiksa.jenisKelamin})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-300">Pengaju: <span className="text-white">{item.instansiPengaju}</span></span>
                    </div>
                  </div>

                  {/* Barang Bukti Preview */}
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-0.5">
                    <span className="font-medium text-slate-300">Barang Bukti:</span>
                    <span className="text-slate-200">
                      {item.perkara.barangBuktiList.map(bb => `${bb.jenisZat} (${bb.beratBersihGram} gr)`).join('; ')}
                    </span>
                  </div>
                </div>

                {/* Right: Next Step & Responsibility Callout */}
                <div className="lg:w-80 bg-[#081224] rounded-lg p-3 border border-[#1b3459] flex flex-col justify-between shrink-0">
                  <div className="text-[11px] text-slate-400 font-medium">Tindakan Berikutnya:</div>
                  <div className="text-xs font-semibold text-white mt-0.5 line-clamp-2">
                    {item.tindakanBerikutnyaLabel}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1b3459] text-[11px]">
                    <span className="text-slate-400">Penanggung Jawab:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                      {item.penanggungJawabBerikutnya.split('(')[0]}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center pl-2">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#38bdf8] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
