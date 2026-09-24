import React from 'react';
import { UserProfile } from '../types';
import { Settings, BookOpen, ShieldCheck, Scale, FileText, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

interface AdministrasiViewProps {
  currentUser: UserProfile;
}

export const AdministrasiView: React.FC<AdministrasiViewProps> = ({ currentUser }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
          <Settings className="w-5 h-5 text-[#38bdf8]" />
          <span>Administrasi & Rujukan Hukum Tata Kelola e-TAT</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Landasan regulasi, kamus pembagian peran institusional, dan pengaturan standar operasional asesmen terpadu.
        </p>
      </div>

      {/* Legal Foundations */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
          <BookOpen className="w-4 h-4 text-[#38bdf8]" />
          <span>Dasar Hukum Pelaksanaan Tim Asesmen Terpadu (TAT)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
            <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">1. Undang-Undang No. 35 Tahun 2009 tentang Narkotika</span>
            <p className="text-slate-300">
              Pasal 54 (Kewajiban rehabilitasi medis dan sosial bagi pecandu dan korban penyalahgunaan), Pasal 103 (Kewenangan hakim menjatuhkan vonis rehabilitasi), dan Pasal 127.
            </p>
          </div>

          <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
            <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">2. Peraturan Bersama 7 Pimpinan Kementerian/Lembaga Tahun 2014</span>
            <p className="text-slate-300">
              Peraturan Bersama Ketua MA, Menkumham, Menkes, Mensos, Jaksa Agung, Kapolri, dan Kepala BNN tentang Penanganan Pecandu dan Korban Penyalahgunaan Narkotika ke Lembaga Rehabilitasi.
            </p>
          </div>

          <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
            <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">3. Surat Edaran Mahkamah Agung (SEMA) No. 04 Tahun 2010</span>
            <p className="text-slate-300">
              Menetapkan batasan gramatur pemakaian 1 hari (misal sabu maksimal 1 gram, ganja maksimal 5 gram, ekstasi maksimal 8 butir/2.4 gram) sebagai salah satu indikator dugaan penyalahguna murni.
            </p>
          </div>

          <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl space-y-1">
            <span className="font-bold text-[#F3E5AB] block font-['Cinzel',serif]">4. Peraturan BNN No. 11 Tahun 2021</span>
            <p className="text-slate-300">
              Tentang Tata Cara Pelaksanaan Asesmen Terpadu bagi Pecandu, Penyalahguna, dan Korban Penyalahgunaan Narkotika. Mengatur SLA maksimal 6 hari kerja dan format rekomendasi resmi.
            </p>
          </div>
        </div>
      </div>

      {/* Directory of Member Institutions */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4 shadow-lg shadow-black/20">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-['Cinzel',serif]">
          <Building2 className="w-4 h-4 text-[#38bdf8]" />
          <span>Struktur Lembaga Mitra Tim Asesmen Terpadu Provinsi Jawa Barat</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl">
            <span className="font-bold text-sky-300 block">Sekretariat & Tim Hukum</span>
            <p className="text-slate-300 mt-1">Badan Narkotika Nasional Provinsi (BNNP) Jawa Barat & Polda Jabar</p>
            <span className="text-[10px] text-slate-400 mt-2 block font-mono">Penyidik & Analis Hukum</span>
          </div>

          <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl">
            <span className="font-bold text-purple-300 block">Penuntut Umum Terpadu</span>
            <p className="text-slate-300 mt-1">Kejaksaan Tinggi Jawa Barat & Kejari Bandung</p>
            <span className="text-[10px] text-slate-400 mt-2 block font-mono">Asesor Aspek Hukum & Penuntutan</span>
          </div>

          <div className="p-3.5 bg-[#081224] border border-[#1b3459] rounded-xl">
            <span className="font-bold text-emerald-300 block">Tim Asesor Medis</span>
            <p className="text-slate-300 mt-1">Dinas Kesehatan Prov. Jabar, RSJ Cisarua, & RS Hasan Sadikin</p>
            <span className="text-[10px] text-slate-400 mt-2 block font-mono">Dokter Spesialis Jiwa (Sp.KJ) & Dokter Umum</span>
          </div>
        </div>
      </div>
    </div>
  );
};
