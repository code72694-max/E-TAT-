import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Settings,
  BookOpen,
  ShieldCheck,
  Scale,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Hash,
  Save
} from 'lucide-react';

interface AdministrasiViewProps {
  currentUser: UserProfile;
}

export const AdministrasiView: React.FC<AdministrasiViewProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'regulasi' | 'penomoran' | 'peran' | 'lembaga'>('regulasi');
  const [polaNomorPermohonan, setPolaNomorPermohonan] = useState('TAT/{TAHUN}/{BULAN}/{NO_URUT}');
  const [polaNomorRekomendasi, setPolaNomorRekomendasi] = useState('REK-TAT/{NO_URUT}/{BULAN_ROMAWI}/{TAHUN}/BNNP-KALTIM');
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePola = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <Settings className="w-5 h-5 text-[#D4AF37]" />
            <span>Pengaturan & Administrasi Sistem e-TAT SIAP PULIH</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi tata kelola, pola penomoran dokumen, hak akses pengguna, dan kemitraan BNNP Kalimantan Timur.
          </p>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#1b3459] pb-3">
        <button
          onClick={() => setActiveSubTab('regulasi')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'regulasi'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Dasar Hukum & Regulasi</span>
        </button>
        <button
          onClick={() => setActiveSubTab('penomoran')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'penomoran'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Pola Nomor & Template</span>
        </button>
        <button
          onClick={() => setActiveSubTab('peran')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'peran'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Matriks Peran Pengguna</span>
        </button>
        <button
          onClick={() => setActiveSubTab('lembaga')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'lembaga'
              ? 'bg-[#133863] text-white border border-[#235594]'
              : 'bg-[#0b172a] text-slate-400 hover:text-white border border-[#1b3459]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Instansi Mitra BNNP Kaltim</span>
        </button>
      </div>

      {/* Tab: Regulasi */}
      {activeSubTab === 'regulasi' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Landasan Yuridis Pelaksanaan Tim Asesmen Terpadu</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">1. UU No. 35 Tahun 2009 tentang Narkotika</span>
              <p className="text-slate-300">
                Pasal 54 (Kewajiban rehabilitasi medis dan sosial bagi pecandu dan korban), Pasal 103 (Kewenangan vonis hakim rehabilitasi), dan Pasal 127.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">2. Peraturan Bersama 7 K/L Tahun 2014</span>
              <p className="text-slate-300">
                Pedoman Terpadu Penanganan Pecandu dan Korban Penyalahgunaan Narkotika ke Lembaga Rehabilitasi antara MA, Kemenkumham, Kemenkes, Kemensos, Kejaksaan Agung, Polri, dan BNN.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">3. Surat Edaran Mahkamah Agung (SEMA) No. 04/2010</span>
              <p className="text-slate-300">
                Penetapan batas barang bukti pemakaian 1 hari (sabu &le; 1 gr, ganja &le; 5 gr, ekstasi &le; 8 butir/2.4 gr) untuk kualifikasi penyalahguna murni.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">4. Peraturan BNN No. 11 Tahun 2021</span>
              <p className="text-slate-300">
                Tata Cara Pelaksanaan Asesmen Terpadu bagi Pecandu dan Korban Narkotika dengan SLA penyelesaian maksimal 6 hari kerja.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">5. Peraturan Kepolisian (Perpol) No. 08 Tahun 2021</span>
              <p className="text-slate-300">
                Penanganan Tindak Pidana Berdasarkan Keadilan Restoratif (Restorative Justice) di lingkungan Kepolisian Negara Republik Indonesia.
              </p>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
              <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">6. Peraturan Kejaksaan RI No. 15 Tahun 2020</span>
              <p className="text-slate-300">
                Penghentian Penuntutan Berdasarkan Keadilan Restoratif pada Kejaksaan Republik Indonesia bagi perkara yang memenuhi kualifikasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Penomoran & Template */}
      {activeSubTab === 'penomoran' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-5 shadow-lg shadow-black/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
              <Hash className="w-4 h-4 text-[#D4AF37]" />
              <span>Konfigurasi Pola Penomoran & Template Rekomendasi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Atur format generator nomor otomatis dan draf klausul penetapan rekomendasi resmi TAT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-[#081224] p-4 rounded-xl border border-[#1b3459]">
              <label className="font-bold text-slate-200 block">Pola Nomor Berkas Permohonan</label>
              <input
                type="text"
                value={polaNomorPermohonan}
                onChange={e => setPolaNomorPermohonan(e.target.value)}
                className="w-full bg-[#0b172a] border border-[#1b3459] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[11px] text-slate-400 block">
                Contoh hasil: <strong className="text-[#D4AF37] font-mono">TAT/2026/09/082</strong>
              </span>
            </div>

            <div className="space-y-2 bg-[#081224] p-4 rounded-xl border border-[#1b3459]">
              <label className="font-bold text-slate-200 block">Pola Nomor Surat Rekomendasi Resmi</label>
              <input
                type="text"
                value={polaNomorRekomendasi}
                onChange={e => setPolaNomorRekomendasi(e.target.value)}
                className="w-full bg-[#0b172a] border border-[#1b3459] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[11px] text-slate-400 block">
                Contoh hasil: <strong className="text-[#D4AF37] font-mono">REK-TAT/082/IX/2026/BNNP-KALTIM</strong>
              </span>
            </div>
          </div>

          <div className="bg-[#081224] p-4 rounded-xl border border-[#1b3459] space-y-2">
            <span className="font-bold text-slate-200 block text-xs">Klausul Standar Rekomendasi Pemulihan</span>
            <div className="bg-[#050e1c] p-3 rounded-lg border border-[#12233c] text-slate-300 font-mono text-[11px] leading-relaxed">
              &quot;Berdasarkan hasil asesmen medis dan asesmen hukum terpadu, terperiksa dikualifikasikan sebagai KORBAN PENYALAHGUNAAN NARKOTIKA murni dan direkomendasikan menjalani REHABILITASI MEDIS DAN SOSIAL selama jangka waktu yang ditentukan oleh fasilitas rujukan BNNP Kalimantan Timur.&quot;
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            {isSaved && (
              <span className="text-xs text-[#D4AF37] flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pola berhasil disimpan ke sistem!</span>
              </span>
            )}
            <button
              onClick={handleSavePola}
              className="bg-[#133863] hover:bg-[#1a4a82] text-white font-bold text-xs px-4 py-2 rounded-xl border border-[#235594] flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pola</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: Peran Pengguna */}
      {activeSubTab === 'peran' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>Matriks Kewenangan & Peran Pengguna (Role Permission)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pembagian tugas berlandaskan Bab 04 Proposal E-TAT SIAP PULIH BNNP Kalimantan Timur.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1b3459] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">Instansi Asal</th>
                  <th className="py-2.5 px-3">Kewenangan Utama</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b3459]/50 text-slate-200">
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Administrator / Sekretariat</td>
                  <td className="py-3 px-3 text-slate-300">BNNP Kalimantan Timur</td>
                  <td className="py-3 px-3 text-slate-300">Penerimaan, verifikasi kelengkapan berkas, jadwal penugasan, notulensi pleno & draf rekomendasi</td>
                  <td className="py-3 px-3 text-center"><span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Tim Asesor Medis</td>
                  <td className="py-3 px-3 text-slate-300">Dokter BNNP / RSUD / Sp.KJ</td>
                  <td className="py-3 px-3 text-slate-300">Pemeriksaan fisik, laboratorium toksikologi urin, pengisian WHO ASSIST, diagnosis klinis ICD</td>
                  <td className="py-3 px-3 text-center"><span className="bg-emerald-500/20 text-slate-200 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Tim Asesor Hukum</td>
                  <td className="py-3 px-3 text-slate-300">Kejati Kaltim / Polda Kaltim</td>
                  <td className="py-3 px-3 text-slate-300">Verifikasi kronologi, analisis peran tersangka, uji gramatur SEMA 04/2010, simpulan hukum</td>
                  <td className="py-3 px-3 text-center"><span className="bg-purple-500/20 text-slate-200 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Petugas Pemantauan / Rehab</td>
                  <td className="py-3 px-3 text-slate-300">Bidang Rehabilitasi BNNP Kaltim</td>
                  <td className="py-3 px-3 text-slate-300">Distribusi rujukan ke faskes, pemantauan berkala, jurnal bimbingan, uji urin acak & SP</td>
                  <td className="py-3 px-3 text-center"><span className="bg-amber-500/20 text-[#D4AF37] px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Penyidik Pengaju</td>
                  <td className="py-3 px-3 text-slate-300">Penyidik BNN / Resnarkoba Polri</td>
                  <td className="py-3 px-3 text-slate-300">Registrasi berkas 1x24 jam pasca penangkapan, perbaikan formil, penerima salinan rekomendasi</td>
                  <td className="py-3 px-3 text-center"><span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Pimpinan / Viewer</td>
                  <td className="py-3 px-3 text-slate-300">Kepala BNNP / Dirresnarkoba / Kajati</td>
                  <td className="py-3 px-3 text-slate-300">Akses baca eksekutif, pengawasan kepatuhan SLA 6 hari, pemantauan dashboard analitik</td>
                  <td className="py-3 px-3 text-center"><span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-[10px]">Aktif</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Lembaga Mitra */}
      {activeSubTab === 'lembaga' && (
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Struktur Lembaga Mitra Tim Asesmen Terpadu BNNP Kalimantan Timur</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Institusi penegak hukum dan fasilitas rehabilitasi pemulihan yang terkoneksi di Provinsi Kalimantan Timur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1.5">
              <span className="font-bold text-sky-300 block">Sekretariat & Penyidikan</span>
              <p className="text-slate-300 font-semibold">BNNP Kalimantan Timur & Ditresnarkoba Polda Kaltim</p>
              <p className="text-[11px] text-slate-400">Jl. Rapak Indah No. 17, Karang Asam Ilir, Samarinda</p>
              <span className="text-[10px] text-slate-400 block font-mono border-t border-[#1b3459] pt-1 mt-2">
                Penyidik & Analis Hukum Terpadu
              </span>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1.5">
              <span className="font-bold text-slate-200 block">Penuntut Umum Terpadu</span>
              <p className="text-slate-300 font-semibold">Kejaksaan Tinggi Kalimantan Timur & Kejari Samarinda</p>
              <p className="text-[11px] text-slate-400">Jl. Bung Tomo, Samarinda Seberang</p>
              <span className="text-[10px] text-slate-400 block font-mono border-t border-[#1b3459] pt-1 mt-2">
                Asesor Aspek Hukum & Penuntutan Restoratif
              </span>
            </div>

            <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1.5">
              <span className="font-bold text-slate-200 block">Fasilitas Rujukan Pemulihan</span>
              <p className="text-slate-300 font-semibold">Balai Rehabilitasi BNN Tanah Merah & Klinik Pratama BNNP Kaltim</p>
              <p className="text-[11px] text-slate-400">Samarinda Utara & RSUD AW Sjahranie Samarinda</p>
              <span className="text-[10px] text-slate-400 block font-mono border-t border-[#1b3459] pt-1 mt-2">
                Rehabilitasi Medis, Sosial, & Tes Toksikologi
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
