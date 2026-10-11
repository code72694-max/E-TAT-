import React, { useRef } from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import { PermohonanAsesmen } from '../types';

interface BeritaAcaraModalProps {
  permohonan: PermohonanAsesmen;
  onClose: () => void;
}

interface OfficerInfo {
  nama: string;
  pangkat: string;
  nip: string;
  jabatan: string;
}

export const BeritaAcaraModal: React.FC<BeritaAcaraModalProps> = ({ permohonan, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const p = permohonan;
  const pleno = p.sidangPleno;
  const medis = p.asesmenMedis;
  const hukum = p.asesmenHukum;
  const tr = p.terperiksa;
  const pk = p.perkara;
  const rek = p.rekomendasiResmi;

  // Resolving Dates & Numbers
  const nomorBA = pleno?.nomorBeritaAcara || `BA/${(p.nomorPermohonan || 'TAT-2026').replace(/[^a-zA-Z0-9]/g, '')}/TAT/${new Date().getFullYear()}`;
  const rawTanggalPleno = pleno?.tanggalPleno || rek?.tanggalTerbit || p.tanggalPengajuan || new Date().toISOString().split('T')[0];
  const dateObj = new Date(rawTanggalPleno);
  const hariPleno = isNaN(dateObj.getTime()) ? 'Senin' : dateObj.toLocaleDateString('id-ID', { weekday: 'long' });
  const tanggalPlenoFormat = isNaN(dateObj.getTime())
    ? '10 Oktober 2026'
    : dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const waktuPleno = pleno?.waktu || '09.30 WITA';
  const tempatPleno = pleno?.tempat || 'Ruang Sidang Sekretariat Tim Asesmen Terpadu (TAT) BNNP Kalimantan Timur, Samarinda';

  // Resolving SK & Penyidik
  const nomorSK = 'KEP/08/I/2026/BNN';
  const nomorSuratPenyidik = pk?.nomorLp || pk?.nomorSpdp || `B/04/TAT/RESNARKOBA/${new Date().getFullYear()}`;
  const rawTanggalPenyidik = pk?.tanggalLp || p.tanggalPengajuan || '2026-10-01';
  const datePenyidik = new Date(rawTanggalPenyidik);
  const tanggalSuratPenyidik = isNaN(datePenyidik.getTime())
    ? '01 Oktober 2026'
    : datePenyidik.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const instansiPenyidik = pk?.instansiPenyidik || p.instansiPengaju || 'Satresnarkoba Polres Metro / BNNP';

  // Resolving Terperiksa Info
  const namaTersangka = tr?.namaLengkap || p.tersangkaNama || 'Rian Saputra';
  const usiaText = tr?.usia ? `${tr.usia} Tahun` : '32 Tahun';
  const jenisKelamin = tr?.jenisKelamin || 'Laki-laki';
  const pekerjaan = tr?.pekerjaan || 'Wiraswasta / Swasta';
  const alamatLengkap = tr?.alamatDomisili || tr?.alamatKtp || 'Jl. Pahlawan No. 12, Samarinda, Kalimantan Timur';
  const pasalDisangkakan = pk?.pasalDisangkakan || (pk as any)?.pasalDipersangkakan || 'Pasal 127 ayat (1) huruf a UU RI No. 35 Tahun 2009 tentang Narkotika';

  // Resolving Officers data dynamically
  const medisAsesor1Nama = medis?.asesorNama || p.timAsesmen?.asesorMedisNama || 'dr. Ratna Sp.KJ';
  const hukumAsesor1Nama = hukum?.asesorNama || p.timAsesmen?.asesorHukumNama || 'Agus Pratama, S.H., M.H.';
  const penyidikKasusNama = pk?.namaPenyidik || p.pengajuNama || 'Ipda Budi Santoso, S.H.';
  const ketuaNama = pleno?.pimpinanPleno || p.timAsesmen?.sekretariatNama || 'Kompol Arya Wicaksono, S.I.K.';

  const daftarHadir = Array.isArray(pleno?.daftarHadir) ? pleno.daftarHadir : [];
  const timMedisDaftar = daftarHadir.filter(m =>
    m?.peran?.toLowerCase().includes('medis') || m?.peran?.toLowerCase().includes('dokter')
  );
  const timHukumDaftar = daftarHadir.filter(m =>
    m?.peran?.toLowerCase().includes('hukum') || m?.peran?.toLowerCase().includes('jaksa') || m?.peran?.toLowerCase().includes('penyidik')
  );

  const timMedisFinal: OfficerInfo[] = [
    {
      nama: timMedisDaftar[0]?.nama || medisAsesor1Nama,
      pangkat: (timMedisDaftar[0] as any)?.pangkat || 'Pembina / Penata Tk. I (IV/b)',
      nip: (timMedisDaftar[0] as any)?.nip || (timMedisDaftar[0] as any)?.nipNrp || '198205122008012001',
      jabatan: timMedisDaftar[0]?.peran || 'Dokter Spesialis Kedokteran Jiwa / Asesor Medis TAT'
    },
    {
      nama: timMedisDaftar[1]?.nama || 'dr. Farhan Hidayat, M.Kes.',
      pangkat: (timMedisDaftar[1] as any)?.pangkat || 'Penata (III/c)',
      nip: (timMedisDaftar[1] as any)?.nip || (timMedisDaftar[1] as any)?.nipNrp || '198603152012011002',
      jabatan: timMedisDaftar[1]?.peran || 'Dokter Pemeriksa Klinis / Konselor Adiksi Medis TAT'
    }
  ];

  const timHukumFinal: OfficerInfo[] = [
    {
      nama: timHukumDaftar[0]?.nama || hukumAsesor1Nama,
      pangkat: (timHukumDaftar[0] as any)?.pangkat || 'Jaksa Muda / Penata Tk. I (III/d)',
      nip: (timHukumDaftar[0] as any)?.nip || (timHukumDaftar[0] as any)?.nipNrp || '197808202003121002',
      jabatan: timHukumDaftar[0]?.peran || 'Jaksa Penuntut Umum / Asesor Hukum TAT Kejaksaan'
    },
    {
      nama: timHukumDaftar[1]?.nama || 'Kombes Pol. Andi Pratama, S.I.K., M.H.',
      pangkat: (timHukumDaftar[1] as any)?.pangkat || 'Komisaris Besar Polisi (Kombes Pol)',
      nip: (timHukumDaftar[1] as any)?.nip || (timHukumDaftar[1] as any)?.nipNrp || '76090412',
      jabatan: timHukumDaftar[1]?.peran || 'Penyidik Ahli Madya BNN RI / Asesor Hukum TAT'
    },
    {
      nama: timHukumDaftar[2]?.nama || penyidikKasusNama,
      pangkat: (timHukumDaftar[2] as any)?.pangkat || 'Inspektur Polisi Dua (Ipda)',
      nip: (timHukumDaftar[2] as any)?.nip || (timHukumDaftar[2] as any)?.nipNrp || '85010234',
      jabatan: pk?.instansiPenyidik ? `Penyidik Pembantu (${pk.instansiPenyidik})` : 'Penyidik Pembantu Unit Resnarkoba'
    }
  ];

  // Evidence & Substance
  const bb = Array.isArray(pk?.barangBuktiList) ? pk.barangBuktiList : [];
  const riwayatZat = Array.isArray(medis?.riwayatZat) ? medis.riwayatZat : [];
  const zatUtama = riwayatZat[0] || null;
  const jenisZatName = zatUtama?.jenisZat || 'Metamfetamina (Sabu)';
  const tahunMulai = new Date().getFullYear() - Math.max(1, Math.round((zatUtama?.lamaPemakaianBulan || 12) / 12));

  // Recommendation Resolution
  const jenisRek = pleno?.jenisRekomendasiFinal || medis?.kebutuhanRawat || rek?.hasilRekomendasi || 'Rehabilitasi Rawat Jalan';
  const isRawatInap = jenisRek.toLowerCase().includes('inap');
  const durasiBulan = pleno?.durasiRehabBulan || medis?.durasiUsulanBulan || (isRawatInap ? 6 : 3);
  const fasilitasRujukan = pleno?.fasilitasRujukanUsulan || rek?.tempatRehabRujukan || (isRawatInap ? 'Balai Besar Rehabilitasi BNN Lido / BNN Tanah Merah' : 'Klinik Pratama BNNP Kalimantan Timur / IPWL Terakreditasi');

  const terbilangBulan = (n: number) => {
    const map: Record<number, string> = { 1: 'satu', 2: 'dua', 3: 'tiga', 4: 'empat', 5: 'lima', 6: 'enam', 9: 'sembilan', 12: 'dua belas' };
    return map[n] || String(n);
  };

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;
    const win = window.open('', '_blank', 'width=950,height=750');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/><title></title>
      <style>
        @page {
          size: A4;
          margin: 18mm 22mm 20mm 22mm;
          @top-left { content: none !important; }
          @top-center { content: none !important; }
          @top-right { content: none !important; }
          @bottom-left { content: none !important; }
          @bottom-center { content: none !important; }
          @bottom-right {
            content: "Halaman " counter(page);
            font-family: 'Times New Roman', Times, serif;
            font-size: 9.5pt;
            color: #000;
          }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 11.5pt; color: #000; line-height: 1.5; }
        .ba-container { width: 100%; max-width: 800px; margin: 0 auto; position: relative; }
        p { text-align: justify; margin-bottom: 7px; }
        table { border-collapse: collapse; width: 100%; }
        ol, ul { margin-left: 24px; margin-bottom: 7px; }
        li { text-align: justify; margin-bottom: 4px; }
      </style></head><body><div class="ba-container">${printContents}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  const renderMember = (num: number, m: OfficerInfo) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px', fontSize: '11.5pt' }}>
      <tbody>
        <tr>
          <td style={{ width: '28px', verticalAlign: 'top' }}>{num}.</td>
          <td style={{ width: '95px', verticalAlign: 'top' }}>Nama</td>
          <td style={{ width: '14px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
          <td style={{ fontWeight: 'bold' }}>{m.nama}</td>
        </tr>
        <tr>
          <td style={{ verticalAlign: 'top' }}></td>
          <td style={{ verticalAlign: 'top' }}>Pangkat</td>
          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
          <td>{m.pangkat}</td>
        </tr>
        <tr>
          <td style={{ verticalAlign: 'top' }}></td>
          <td style={{ verticalAlign: 'top' }}>NIP/NRP</td>
          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
          <td style={{ fontFamily: 'monospace' }}>{m.nip}</td>
        </tr>
        <tr>
          <td style={{ verticalAlign: 'top' }}></td>
          <td style={{ verticalAlign: 'top' }}>Jabatan</td>
          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
          <td>{m.jabatan}</td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
        style={{ maxHeight: '96vh' }}>

        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#d4af37]">📄</span>
              Berita Acara Pelaksanaan Asesmen Terpadu (TAT)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Nomor: {nomorBA} &bull; Tersangka: {namaTersangka}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Scroll Area */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
          <div
            ref={printRef}
            className="bg-white text-black p-8 sm:p-12 rounded-lg shadow-2xl mx-auto"
            style={{
              maxWidth: '810px',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: '11.5pt',
              lineHeight: '1.5',
              color: '#000'
            }}
          >
            {/* ===== KOP SURAT FORMAL RESMI (SESUAI DOKUMEN RESMI BNN) ===== */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '90px', verticalAlign: 'middle', textAlign: 'left', padding: '0' }}>
                    <img
                      src="/bnn.png"
                      alt="Logo BNN RI"
                      style={{ width: '82px', height: '82px', objectFit: 'contain', display: 'block' }}
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0 4px' }}>
                    <div style={{ fontSize: '13pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px' }}>
                      BADAN NARKOTIKA NASIONAL REPUBLIK INDONESIA
                    </div>
                    <div style={{ fontSize: '10.5pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px', marginTop: '1px' }}>
                      (NATIONAL NARCOTICS BOARD REPUBLIC OF INDONESIA)
                    </div>
                    <div style={{ fontSize: '8.5pt', marginTop: '3px', lineHeight: '1.35', color: '#111' }}>
                      Jl. MT. Haryono No. 11 Cawang Jakarta Timur<br />
                      Telepon : (62-21) 80871566, 80871567<br />
                      Faksimili : (62-21) 80885225, 80871591, 80871592, 80871593<br />
                      e-mail : info@bnn.go.id &nbsp;&nbsp;&nbsp; website : www.bnn.go.id
                    </div>
                  </td>
                  <td style={{ width: '90px', verticalAlign: 'middle' }}>
                    {/* Spacer menjaga teks tetap presisi di tengah halaman */}
                  </td>
                </tr>
              </tbody>
            </table>
            <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
            <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

            {/* ===== JUDUL BERITA ACARA ===== */}
            <div style={{ textAlign: 'center', margin: '12px 0 18px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12.5pt', textDecoration: 'underline' }}>
                BERITA ACARA
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '13pt', textDecoration: 'underline' }}>
                PELAKSANAAN ASESMEN TERPADU
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '3px' }}>
                NOMOR: {nomorBA}
              </div>
            </div>

            {/* ===== PEMBUKA HARI & TANGGAL ===== */}
            <p style={{ textAlign: 'justify', marginBottom: '12px' }}>
              Pada hari ini <strong>{hariPleno}</strong>, tanggal <strong>{tanggalPlenoFormat}</strong> sekira jam <strong>{waktuPleno}</strong> bertempat di <strong>{tempatPleno}</strong>, yang dipimpin oleh <strong>{ketuaNama}</strong> dengan NRP <strong>79080512</strong>, selaku Ketua Tim Asesmen Terpadu (TAT) Tingkat Provinsi Kalimantan Timur, dan anggota Tim Asesmen Terpadu terdiri dari:
            </p>
            <hr style={{ border: 'none', borderBottom: '1px solid #000', margin: '0 0 10px 0' }} />

            {/* ===== I. TIM MEDIS ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', margin: '10px 0 6px 0' }}>
              I. Tim Medis:
            </div>
            {timMedisFinal.map((m, i) => renderMember(i + 1, m))}

            {/* ===== II. TIM HUKUM ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', margin: '12px 0 6px 0' }}>
              II. Tim Hukum:
            </div>
            {timHukumFinal.map((m, i) => renderMember(i + 1, m))}

            <hr style={{ border: 'none', borderBottom: '1px solid #000', margin: '12px 0 12px 0' }} />

            {/* ===== DASAR HUKUM & IDENTITAS SUBJEK ===== */}
            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
              Berdasarkan Surat Keputusan Kepala Badan Narkotika Nasional Nomor <strong>{nomorSK}</strong> tentang Tim Asesmen Terpadu Tingkat Provinsi Kalimantan Timur, kami Tim Asesmen Terpadu Tingkat Provinsi Kalimantan Timur telah melaksanakan Rapat Pelaksanaan Asesmen Terpadu terhadap:
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '6px 0 12px 0', fontSize: '11.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '28px', verticalAlign: 'top' }}>1.</td>
                  <td style={{ width: '190px', verticalAlign: 'top' }}>Nama Lengkap</td>
                  <td style={{ width: '14px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{namaTersangka}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>2.</td>
                  <td style={{ verticalAlign: 'top' }}>Nama Panggilan / Alias</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{tr?.alias || '-'}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>3.</td>
                  <td style={{ verticalAlign: 'top' }}>NIK</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{tr?.nik || '3171012345670001'}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>4.</td>
                  <td style={{ verticalAlign: 'top' }}>Tempat / Tanggal Lahir</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{tr?.tempatLahir || 'Samarinda'}, {tr?.tanggalLahir || '14 Mei 1994'} ({usiaText})</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>5.</td>
                  <td style={{ verticalAlign: 'top' }}>Jenis Kelamin / Agama</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{jenisKelamin} / {tr?.agama || 'Islam'}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>6.</td>
                  <td style={{ verticalAlign: 'top' }}>Pekerjaan</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{pekerjaan}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>7.</td>
                  <td style={{ verticalAlign: 'top' }}>Alamat KTP / Domisili</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{alamatLengkap}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>8.</td>
                  <td style={{ verticalAlign: 'top' }}>Disangkakan Melanggar</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{pasalDisangkakan}</td>
                </tr>
              </tbody>
            </table>

            <p style={{ textAlign: 'justify', marginBottom: '14px' }}>
              dengan nomor register asesmen: <strong>{p.nomorPermohonan}</strong>, sesuai dengan Surat Permohonan Pengajuan Asesmen Terpadu dari Penyidik Nomor: <strong>{nomorSuratPenyidik}</strong> tanggal <strong>{tanggalSuratPenyidik}</strong> dari {instansiPenyidik} kepada Kepala BNNP Kalimantan Timur selaku Ketua TAT Tingkat Provinsi Kalimantan Timur perihal Permohonan Pengajuan Asesmen Terpadu Tersangka a.n <strong>{namaTersangka}</strong>, dengan hasil sebagai berikut:
            </p>

            <hr style={{ border: 'none', borderBottom: '1px dashed #777', margin: '8px 0 12px 0' }} />

            {/* ===== 1. HASIL PEMERIKSAAN MEDIS ===== */}
            <div style={{ margin: '10px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11.5pt' }}>
                1.&nbsp;&nbsp;&nbsp;Hasil Pemeriksaan Tim Medis:
              </div>
              <div style={{ marginTop: '4px', textAlign: 'justify' }}>
                <p>
                  Bahwa tersangka atas nama <strong>{namaTersangka}</strong> seorang {jenisKelamin.toLowerCase()} berusia <strong>{usiaText}</strong>, bekerja sebagai <strong>{pekerjaan}</strong>.
                  Bahwa tersangka atas nama {namaTersangka} memiliki riwayat menggunakan narkotika jenis <strong>{jenisZatName}</strong> sejak sekitar {zatUtama?.lamaPemakaianBulan || 12} bulan (tahun {tahunMulai}), dengan frekuensi {zatUtama?.frekuensi || '4-5 kali seminggu'}, cara pakai: {zatUtama?.caraPakai || 'hisap (inhalasi)'}. Terakhir kali mengkonsumsi zat tersebut pada {zatUtama?.terakhirPakai || '2 hari sebelum asesmen'}.
                </p>
                <p>
                  Berdasarkan instrumen baku <strong>{medis?.instrumen || 'ASSIST (Alcohol, Smoking, and Substance Involvement Screening Test)'}</strong>, diperoleh total skor <strong>{medis?.skorInstrumen || 28}</strong> dengan tingkat keparahan risiko ketergantungan: <strong>{medis?.tingkatRisikoInstrumen || 'Sedang (Moderate Risk)'}</strong>.
                  Kondisi psikologis tersangka: <em>{medis?.kondisiPsikologis || 'Kooperatif saat wawancara, orientasi waktu, tempat, dan orang baik, afek sesuai, tidak ditemukan waham atau halusinasi aktif (non-psikotik)'}</em>.
                  Diagnosis klinis ditegakkan berpedoman pada ICD-10: <strong>{medis?.diagnosisKlinisIcd || 'F15.2 (Gangguan Penggunaan Zat Stimulansia - Sindrom Ketergantungan)'}</strong>.
                  Tim Medis merekomendasikan intervensi terapi berupa <strong>{medis?.kebutuhanRawat || 'Rehabilitasi Rawat Jalan'}</strong> selama <strong>{medis?.durasiUsulanBulan || 3} bulan</strong>.
                </p>
              </div>
            </div>

            {/* ===== 2. HASIL PEMERIKSAAN HUKUM ===== */}
            <div style={{ margin: '12px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11.5pt' }}>
                2.&nbsp;&nbsp;&nbsp;Hasil Pemeriksaan Tim Hukum:
              </div>
              <div style={{ marginTop: '4px', textAlign: 'justify' }}>
                <p>
                  Bahwa tersangka atas nama <strong>{namaTersangka}</strong> bekerja sebagai <strong>{pekerjaan}</strong>, disangkakan melanggar <strong>{pasalDisangkakan}</strong>.
                  Berdasarkan penelaahan berkas perkara penyidikan dan interogasi yuridis, tersangka dikualifikasikan perannya sebagai: <strong>{hukum?.analisisPeran || 'Penyalahguna Narkotika (Murni)'}</strong> untuk pemakaian diri sendiri.
                  {hukum?.argumentasiPeran && ` ${hukum.argumentasiPeran}.`}
                </p>
                <p>
                  {hukum?.analisisBarangBukti || hukum?.kesimpulanHukum || (
                    'Bahwa jumlah barang bukti yang disita berada di bawah ambang batas pemakaian 1 (satu) hari sesuai Surat Edaran Mahkamah Agung (SEMA) No. 04 Tahun 2010. Tersangka bukan merupakan bagian dari jaringan terorganisir peredaran gelap narkotika, tidak bertindak sebagai bandar, pengedar, kurir, maupun perantara dalam jual beli narkotika.'
                  )}
                  {` Bahwa berdasarkan catatan rekam jejak kriminal, tersangka ${hukum?.riwayatResidivisme?.pernahDitangkap ? 'pernah berurusan dengan hukum' : 'belum pernah dihukum pidana sebelumnya (Pelaku Pertama / Bukan Residivis)'}.`}
                </p>
              </div>
            </div>

            {/* ===== 3. ALAT BUKTI & BARANG BUKTI ===== */}
            <div style={{ margin: '12px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11.5pt' }}>
                3.&nbsp;&nbsp;&nbsp;Alat Bukti & Barang Bukti:
              </div>
              <ol style={{ paddingLeft: '24px', marginTop: '4px' }}>
                {bb.length > 0 ? bb.map((b, i) => (
                  <li key={i}>
                    {b.nomorSuratLab
                      ? <>Surat Hasil Pengujian Laboratorium Narkotika Nomor <strong>{b.nomorSuratLab}</strong> tanggal {b.tanggalSuratLab || tanggalSuratPenyidik} terhadap barang bukti <strong>{b.nama || b.jenisZat}</strong> dengan berat bersih <strong>{b.beratBersihGram || b.jumlah || '0.45'} gram</strong> — Kesimpulan: <strong>{b.statusUjiLab === 'positif' ? 'POSITIF METAMFETAMINA' : (b.statusUjiLab || 'POSITIF')}</strong>.</>
                      : <>Barang bukti <strong>{b.nama || b.jenisZat}</strong> dengan berat/jumlah <strong>{b.jumlah || `${b.beratBersihGram || '0.45'} gram`}</strong>, status uji lab: <strong>{b.statusUjiLab === 'positif' ? 'POSITIF METAMFETAMINA' : 'POSITIF'}</strong>.</>
                    }
                  </li>
                )) : (
                  <>
                    <li>Surat Keterangan Hasil Pengujian Laboratorium Narkotika BNN Nomor: <strong>LAB/2408/X/2026/Pusat Laboratorium Narkotika</strong> tanggal {tanggalSuratPenyidik} terhadap <em>sample urine</em> a.n. <strong>{namaTersangka}</strong> dengan hasil <strong>POSITIF METAMFETAMINA</strong>.</li>
                    <li>Berita Acara Penyitaan Barang Bukti berupa 1 (satu) bungkus plastik klip berisi kristal putih narkotika jenis sabu dengan berat bruto 0.45 gram serta 1 (satu) buah alat hisap sabu (bong).</li>
                  </>
                )}
                <li>Berita Acara Pemeriksaan (BAP) Tersangka yang dibuat oleh Penyidik Satresnarkoba tanggal {tanggalSuratPenyidik}.</li>
              </ol>
            </div>

            {/* ===== 4. FAKTA-FAKTA PEMERIKSAAN ===== */}
            <div style={{ margin: '14px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginBottom: '4px' }}>
                4.&nbsp;&nbsp;&nbsp;Fakta-Fakta Pemeriksaan Asesmen Terpadu:
              </div>

              {/* Fakta Medis */}
              <div style={{ fontWeight: 'bold', fontSize: '11pt', margin: '6px 0 2px 0', textDecoration: 'underline' }}>
                a. Fakta Medis:
              </div>
              <p style={{ textAlign: 'justify', marginBottom: '4px' }}>
                Berdasarkan hasil asesmen menggunakan instrumen baku <em>Addiction Severity Index</em> (ASI) dan ASSIST disertai dengan observasi klinis dan pemeriksaan fisik terhadap tersangka atas nama <strong>{namaTersangka}</strong>, didapatkan fakta-fakta:
              </p>
              <ol style={{ paddingLeft: '24px' }}>
                <li>Bahwa tersangka atas nama <strong>{namaTersangka}</strong> menggunakan narkotika jenis {jenisZatName} sejak tahun {tahunMulai} dengan frekuensi pemakaian {zatUtama?.frekuensi || 'rutin'}.</li>
                <li>Bahwa lingkungan pergaulan tersangka mendukung terjadinya penyalahgunaan zat adiktif.</li>
                <li>Bahwa tersangka terakhir kali mengkonsumsi narkotika pada {zatUtama?.terakhirPakai || 'beberapa hari sebelum pelaksanaan asesmen'}.</li>
                <li>Bahwa tersangka telah mengalami ketergantungan psikologis dan toleransi peningkatan dosis terhadap zat stimulansia.</li>
                <li>Bahwa tersangka bersikap kooperatif selama wawancara klinis, tidak ditemukan gangguan kejiwaan psikotik berat akut, dan memiliki motivasi untuk berhenti menggunakan narkotika.</li>
                <li>Bahwa tersangka membutuhkan layanan rehabilitasi dan dukungan keluarga dalam proses pemulihan ketergantungan narkotika.</li>
              </ol>

              {/* Fakta Hukum */}
              <div style={{ fontWeight: 'bold', fontSize: '11pt', margin: '8px 0 2px 0', textDecoration: 'underline' }}>
                b. Fakta Hukum:
              </div>
              <p style={{ textAlign: 'justify', marginBottom: '4px' }}>
                Berdasarkan penelaahan berkas perkara, barang bukti sitaan, serta interogasi yuridis oleh Tim Hukum terhadap tersangka atas nama <strong>{namaTersangka}</strong>, didapatkan fakta-fakta:
              </p>
              <ol style={{ paddingLeft: '24px' }}>
                <li>Bahwa tersangka atas nama <strong>{namaTersangka}</strong> bekerja sebagai <strong>{pekerjaan}</strong> dan memperoleh narkotika untuk dikonsumsi sendiri.</li>
                <li>Bahwa barang bukti yang disita dari tersangka berada di bawah batasan maksimal kepemilikan 1 (satu) hari sebagaimana diatur dalam SEMA Nomor 04 Tahun 2010.</li>
                <li>Bahwa tersangka tertangkap tangan saat atau sesaat setelah mengonsumsi narkotika untuk kepentingan pribadi.</li>
                <li>Bahwa tidak ditemukan bukti keterlibatan tersangka dalam peredaran gelap narkotika, baik sebagai produsen, bandar, kurir, maupun penyandang dana.</li>
                <li>Bahwa tersangka {hukum?.riwayatResidivisme?.pernahDitangkap ? 'pernah berurusan hukum' : 'belum pernah dijatuhi hukuman pidana penjara sebelumnya (bukan residivis narkotika)'}.</li>
                <li>Bahwa tersangka mengakui perbuatannya secara jujur dan keluarga menyatakan sanggup menjadi penjamin pengawasan selama proses rehabilitasi berlangsung.</li>
              </ol>
            </div>

            {/* ===== 5. KESIMPULAN & REKOMENDASI ===== */}
            <div style={{ margin: '14px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginBottom: '4px' }}>
                5.&nbsp;&nbsp;&nbsp;Kesimpulan dan Rekomendasi Tim Asesmen Terpadu:
              </div>

              <div style={{ fontWeight: 'bold', fontSize: '11pt', margin: '6px 0 2px 0', textDecoration: 'underline' }}>
                a. Kesimpulan:
              </div>
              <p style={{ textAlign: 'justify', marginBottom: '4px' }}>
                Berdasarkan hasil musyawarah pleno terpadu antara Tim Medis dan Tim Hukum, disimpulkan bahwa:
              </p>
              <ol type="1" style={{ paddingLeft: '24px' }}>
                <li>Tersangka atas nama <strong>{namaTersangka}</strong> terbukti secara sah dan meyakinkan sebagai <strong>Penyalahguna Narkotika (Murni)</strong> golongan I jenis metamfetamina untuk diri sendiri dengan tingkat ketergantungan {medis?.tingkatRisikoInstrumen || 'Sedang'}.</li>
                <li>Tersangka atas nama <strong>{namaTersangka}</strong> tidak terindikasi masuk dalam sindikat atau peredaran gelap narkotika.</li>
                <li>Tersangka memenuhi kriteria yuridis dan medis sebagaimana diatur dalam Pasal 54, Pasal 55, dan Pasal 103 UU RI No. 35 Tahun 2009 serta Peraturan Bersama 7 Lembaga Negara Tahun 2014 untuk mendapatkan tindakan rehabilitasi.</li>
              </ol>

              <div style={{ fontWeight: 'bold', fontSize: '11pt', margin: '10px 0 2px 0', textDecoration: 'underline' }}>
                b. Rekomendasi Resmi:
              </div>
              <p style={{ textAlign: 'justify', marginBottom: '6px' }}>
                Berdasarkan kesimpulan musyawarah pleno tersebut di atas, Tim Asesmen Terpadu (TAT) Tingkat Provinsi Kalimantan Timur merekomendasikan:
              </p>

              {/* Dynamic Official Recommendation Box */}
              <div style={{ border: '2px solid #000', padding: '10px 14px', margin: '8px 0 10px 0', background: '#fafafa' }}>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12pt', textTransform: 'uppercase' }}>
                  REKOMENDASI: {jenisRek}
                </div>
                <div style={{ textAlign: 'center', fontSize: '11pt', marginTop: '4px' }}>
                  Lembaga Rujukan: <strong>{fasilitasRujukan}</strong> &bull; Durasi Usulan: <strong>{durasiBulan} ({terbilangBulan(durasiBulan)}) Bulan</strong>
                </div>
              </div>

              <ol type="1" style={{ paddingLeft: '24px' }}>
                {isRawatInap ? (
                  <>
                    <li style={{ marginBottom: '6px' }}>
                      Terhadap tersangka atas nama <strong>{namaTersangka}</strong> agar dilakukan tindakan perawatan dan pemulihan ketergantungan narkotika dengan <strong>Rehabilitasi Rawat Inap</strong> selama <strong>{durasiBulan} ({terbilangBulan(durasiBulan)}) bulan</strong> di <strong>{fasilitasRujukan}</strong>.
                    </li>
                    <li style={{ marginBottom: '6px' }}>
                      Terhadap tersangka atas nama <strong>{namaTersangka}</strong>, proses hukum perkara dilanjutkan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku dengan menempatkan yang bersangkutan di lembaga rehabilitasi yang ditunjuk.
                    </li>
                  </>
                ) : (
                  <>
                    <li style={{ marginBottom: '6px' }}>
                      Terhadap tersangka atas nama <strong>{namaTersangka}</strong> agar dilakukan tindakan perawatan dan pemulihan dengan <strong>Rehabilitasi Rawat Jalan</strong> minimal <strong>8 (delapan) kali pertemuan / sesi konseling adiksi</strong> di <strong>{fasilitasRujukan}</strong>.
                    </li>
                    <li style={{ marginBottom: '6px' }}>
                      Tersangka atas nama <strong>{namaTersangka}</strong> diwajibkan melaksanakan <strong>WAJIB LAPOR</strong> kepada Penyidik {instansiPenyidik} secara berkala sampai program rehabilitasi dinyatakan selesai secara klinis.
                    </li>
                    <li style={{ marginBottom: '6px' }}>
                      Terhadap proses hukum perkara tersangka a.n <strong>{namaTersangka}</strong> dilanjutkan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.
                    </li>
                  </>
                )}
              </ol>
            </div>

            {/* ===== PENUTUP RESMI ===== */}
            <p style={{ textAlign: 'justify', margin: '18px 0 14px 0' }}>
              Demikian Berita Acara Rapat Pelaksanaan Asesmen Terpadu tersangka atas nama <strong>{namaTersangka}</strong> ini dibuat dengan sebenarnya atas kekuatan sumpah jabatan, kemudian ditutup dan ditandatangani di <strong>Samarinda</strong> pada hari dan tanggal tersebut di atas untuk dapat dipergunakan sebagaimana mestinya.
            </p>

            {/* ===== TANDA TANGAN TIM HUKUM ===== */}
            <div style={{ marginTop: '20px', borderTop: '1px solid #000', paddingTop: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                <tbody>
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11pt', paddingBottom: '4px' }}>
                      TIM ASESOR HUKUM TAT
                    </td>
                  </tr>
                  <tr>
                    {timHukumFinal.map((m, i) => (
                      <td key={i} style={{ width: '33.3%', textAlign: 'center', verticalAlign: 'top', padding: '0 6px' }}>
                        <div style={{ height: '65px' }}></div>
                        <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '150px', paddingTop: '2px', fontWeight: 'bold', fontSize: '10pt' }}>
                          {m.nama}
                        </div>
                        <div style={{ fontSize: '9pt', color: '#222' }}>{m.pangkat}</div>
                        <div style={{ fontSize: '9pt' }}>NIP/NRP. {m.nip}</div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* ===== TANDA TANGAN TIM MEDIS ===== */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '18px' }}>
                <tbody>
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11pt', paddingBottom: '4px' }}>
                      TIM ASESOR MEDIS TAT
                    </td>
                  </tr>
                  <tr>
                    {timMedisFinal.map((m, i) => (
                      <td key={i} style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 8px' }}>
                        <div style={{ height: '65px' }}></div>
                        <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '170px', paddingTop: '2px', fontWeight: 'bold', fontSize: '10.5pt' }}>
                          {m.nama}
                        </div>
                        <div style={{ fontSize: '9.5pt', color: '#222' }}>{m.pangkat}</div>
                        <div style={{ fontSize: '9.5pt' }}>NIP. {m.nip}</div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* ===== PENGESAHAN KETUA TAT & BARCODE ===== */}
              <div style={{ borderTop: '2px solid #000', paddingTop: '12px', marginTop: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      {/* Kolom QR Code Digital Signature */}
                      <td style={{ width: '35%', verticalAlign: 'middle', textAlign: 'center', padding: '4px' }}>
                        <div style={{ display: 'inline-block', border: '1px solid #999', padding: '6px 10px', borderRadius: '4px', background: '#fafafa', textAlign: 'center' }}>
                          <div style={{ width: '70px', height: '70px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #000' }}>
                            <QrCode style={{ width: '60px', height: '60px', color: '#000' }} />
                          </div>
                          <div style={{ fontSize: '7.5pt', fontWeight: 'bold', marginTop: '4px', textTransform: 'uppercase' }}>
                            VERIFIKASI TTE TAT
                          </div>
                          <div style={{ fontSize: '7pt', color: '#555', fontFamily: 'monospace' }}>
                            ID: {p.trackingNumber || p.id?.slice(0, 10)}
                          </div>
                        </div>
                      </td>

                      {/* Kolom Ketua Tim Asesmen Terpadu */}
                      <td style={{ width: '65%', verticalAlign: 'top', textAlign: 'center', padding: '4px' }}>
                        <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>
                          MENGETAHUI & MENGESAHKAN,
                        </div>
                        <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>
                          KETUA TIM ASESMEN TERPADU TINGKAT PROVINSI KALIMANTAN TIMUR
                        </div>
                        <div style={{ height: '65px' }}></div>
                        <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '220px', paddingTop: '2px', fontWeight: 'bold', fontSize: '11pt' }}>
                          {ketuaNama}
                        </div>
                        <div style={{ fontSize: '9.5pt', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                          KOMISARIS POLISI / KETUA TIM
                        </div>
                        <div style={{ fontSize: '9pt' }}>
                          NRP. 79080512
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
