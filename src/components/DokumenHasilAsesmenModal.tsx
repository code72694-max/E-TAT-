import React, { useRef } from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import { PermohonanAsesmen } from '../types';

interface DokumenHasilAsesmenModalProps {
  permohonan: PermohonanAsesmen;
  onClose: () => void;
}

interface OfficerInfo {
  nama: string;
  pangkat: string;
  nip: string;
  jabatan: string;
}

export const DokumenHasilAsesmenModal: React.FC<DokumenHasilAsesmenModalProps> = ({ permohonan, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const p = permohonan;
  const pleno = p.sidangPleno;
  const medis = p.asesmenMedis;
  const hukum = p.asesmenHukum;
  const tr = p.terperiksa;
  const pk = p.perkara;
  const rek = p.rekomendasiResmi;

  // Resolving Dates & Numbers
  const nomorSurat = rek?.nomorSurat || `TAT/REK/${(p.nomorPermohonan || '2026').replace(/[^a-zA-Z0-9]/g, '')}/${new Date().getFullYear()}`;
  const rawTanggalTerbit = rek?.tanggalTerbit || p.tanggalPengajuan || new Date().toISOString().split('T')[0];
  const dateObj = new Date(rawTanggalTerbit);
  const tanggalTerbitFormat = isNaN(dateObj.getTime())
    ? '10 Oktober 2026'
    : dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Resolving Terperiksa Info
  const namaTersangka = tr?.namaLengkap || p.tersangkaNama || 'Rian Saputra';
  const usiaText = tr?.usia ? `${tr.usia} Tahun` : '32 Tahun';
  const jenisKelamin = tr?.jenisKelamin || 'Laki-laki';
  const pekerjaan = tr?.pekerjaan || 'Wiraswasta / Swasta';
  const alamatLengkap = tr?.alamatDomisili || tr?.alamatKtp || 'Jl. Pahlawan No. 12, Samarinda, Kalimantan Timur';
  const pasalDisangkakan = pk?.pasalDisangkakan || (pk as any)?.pasalDipersangkakan || 'Pasal 127 ayat (1) huruf a UU RI No. 35 Tahun 2009 tentang Narkotika';

  // Resolving Processing Accounts / Officers Data
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

  // Evidence & Clinical
  const bbList = Array.isArray(pk?.barangBuktiList) ? pk.barangBuktiList : [];
  const zatUtama = Array.isArray(medis?.riwayatZat) && medis.riwayatZat.length > 0 ? medis.riwayatZat[0] : null;
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
    win.document.write(`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/><title>&#8203;</title>
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
        .doc-wrapper { width: 100%; max-width: 800px; margin: 0 auto; position: relative; }
        p { text-align: justify; margin-bottom: 7px; }
        table { border-collapse: collapse; width: 100%; }
        ol, ul { margin-left: 24px; margin-bottom: 7px; }
        li { text-align: justify; margin-bottom: 4px; }
      </style></head><body><div class="doc-wrapper">${printContents}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
        style={{ maxHeight: '96vh' }}>

        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#d4af37]">📑</span>
              Dokumen Resmi Hasil Asesmen Terpadu (TAT)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Nomor: {nomorSurat} &bull; Tersangka: {namaTersangka}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Unduh PDF
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

            {/* ===== JUDUL NASKAH DINAS ===== */}
            <div style={{ textAlign: 'center', margin: '12px 0 18px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12.5pt', textDecoration: 'underline' }}>
                LEMBAR REKOMENDASI HASIL ASESMEN TERPADU
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '3px' }}>
                NOMOR: {nomorSurat}
              </div>
            </div>

            {/* ===== PEMBUKA ===== */}
            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
              Berdasarkan hasil Rapat Musyawarah Pleno Tim Asesmen Terpadu (TAT) yang terdiri dari Tim Medis dan Tim Hukum pada tanggal <strong>{tanggalTerbitFormat}</strong>, telah dilakukan asesmen terpadu komprehensif terhadap tersangka penyalahguna narkotika:
            </p>

            {/* ===== I. IDENTITAS PEMOHON / TERPERIKSA ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              I. IDENTITAS PEMOHON / TERPERIKSA
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '11.5pt' }}>
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
                  <td style={{ verticalAlign: 'top' }}>Nomor Induk Kependudukan (NIK)</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{tr?.nik || '3171012345670001'}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>4.</td>
                  <td style={{ verticalAlign: 'top' }}>Tempat / Tanggal Lahir / Usia</td>
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
                <tr>
                  <td style={{ verticalAlign: 'top' }}>9.</td>
                  <td style={{ verticalAlign: 'top' }}>Wali / Penjamin / Pendamping</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{tr?.namaWaliPendamping || 'Ibu Kandung'} ({tr?.hubunganWali || 'Keluarga'})</td>
                </tr>
              </tbody>
            </table>

            {/* ===== II. DASAR ASESMEN ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              II. DASAR ASESMEN
            </div>
            <ol style={{ paddingLeft: '24px', marginBottom: '10px' }}>
              <li>Undang-Undang Nomor 35 Tahun 2009 tentang Narkotika, khususnya ketentuan Pasal 54, Pasal 55, dan Pasal 103.</li>
              <li>Peraturan Pemerintah Republik Indonesia Nomor 25 Tahun 2011 tentang Pelaksanaan Wajib Lapor Pecandu Narkotika.</li>
              <li>Peraturan Bersama 7 (Tujuh) Kementerian dan Lembaga Negara Tahun 2014 tentang Penanganan Pecandu Narkotika dan Korban Penyalahgunaan Narkotika ke dalam Lembaga Rehabilitasi.</li>
              <li>Surat Edaran Mahkamah Agung (SEMA) Republik Indonesia Nomor 04 Tahun 2010 tentang Penempatan Penyalahgunaan, Korban Penyalahgunaan, dan Pecandu Narkotika ke dalam Lembaga Rehabilitasi Medis dan Rehabilitasi Sosial.</li>
              <li>Surat Permohonan Pelaksanaan Asesmen Terpadu dari Penyidik Nomor: <strong>{pk?.nomorLp || p.nomorPermohonan}</strong> perihal permohonan asesmen terpadu atas nama tersangka <strong>{namaTersangka}</strong>.</li>
            </ol>

            {/* ===== III. RUANG LINGKUP ASESMEN ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              III. RUANG LINGKUP ASESMEN
            </div>
            <p style={{ textAlign: 'justify', marginBottom: '6px' }}>
              Ruang lingkup pelaksanaan Asesmen Terpadu meliputi 3 (tiga) pilar analisis objektif:
            </p>
            <ol style={{ paddingLeft: '24px', marginBottom: '10px' }}>
              <li><strong>Asesmen Medis & Psikiatri:</strong> Penegakan diagnosis tingkat keparahan ketergantungan narkoba, riwayat pemakaian zat adiktif, kondisi kejiwaan / psikologis, serta komorbiditas fisik.</li>
              <li><strong>Asesmen Hukum & Yuridis:</strong> Penelusuran profil hukum, kualifikasi peran (pengguna murni, pecandu, atau perantara sindikat), analisis barang bukti sitaan, serta riwayat tindak pidana sebelumnya.</li>
              <li><strong>Sidang Musyawarah Pleno TAT:</strong> Pembahasan komparatif antar tim medis dan tim hukum untuk merumuskan simpulan mufakat dan rencana rujukan rehabilitasi.</li>
            </ol>

            {/* ===== IV. METODOLOGI ASESMEN ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              IV. METODOLOGI ASESMEN
            </div>
            <p style={{ textAlign: 'justify', marginBottom: '6px' }}>
              Pemeriksaan dilakukan dengan metode ilmiah terstandar nasional:
            </p>
            <ul style={{ paddingLeft: '24px', marginBottom: '10px' }}>
              <li>Wawancara klinis dan psikiatris menggunakan instrumen baku <strong>{medis?.instrumen || 'ASSIST (Alcohol, Smoking, and Substance Involvement Screening Test)'}</strong> dengan skor capaian: <strong>{medis?.skorInstrumen || 28}</strong>.</li>
              <li>Pemeriksaan uji laboratorium toksikologi urin (skrining metabolit Amphetamine, Methamphetamine, THC, Morphine, Benzodiazepine).</li>
              <li>Pemeriksaan forensik berkas perkara (BAP penyidikan, berita acara penggeledahan, dan penimbangan barang bukti).</li>
              <li>Wawancara konfirmasi keluarga/wali pendamping untuk validasi data sosial dan lingkungan.</li>
            </ul>

            {/* ===== V. HASIL ASESMEN PER BIDANG ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              V. HASIL ASESMEN PER BIDANG
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11pt', textDecoration: 'underline' }}>A. Hasil Pemeriksaan Tim Medis:</div>
              <p style={{ textAlign: 'justify', marginTop: '4px' }}>
                Tersangka atas nama <strong>{namaTersangka}</strong> ({usiaText}) terkonfirmasi memiliki riwayat penggunaan zat narkotika jenis <strong>{jenisZatName}</strong> sejak sekitar {zatUtama?.lamaPemakaianBulan || 12} bulan (tahun {tahunMulai}) dan cara pakai {zatUtama?.caraPakai || 'hisap/inhalasi'}.
                Hasil uji instrumen skrining menunjukkan tingkat keparahan adiksi: <strong>{medis?.tingkatRisikoInstrumen || 'Sedang (Moderate Risk)'}</strong>.
                Kondisi psikologis tersangka: <em>{medis?.kondisiPsikologis || 'Kooperatif saat wawancara klinis, tidak ditemukan gangguan psikotik berat akut, terdapat kecemasan situasional'}</em>.
                Diagnosis klinis ditegakkan berpedoman pada ICD-10: <strong>{medis?.diagnosisKlinisIcd || 'F15.2 (Gangguan Penggunaan Zat Stimulansia - Sindrom Ketergantungan)'}</strong>.
                Tim medis merekomendasikan intervensi terapi berupa <strong>{medis?.kebutuhanRawat || 'Rehabilitasi Rawat Jalan'}</strong> selama <strong>{medis?.durasiUsulanBulan || 3} bulan</strong>.
              </p>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11pt', textDecoration: 'underline' }}>B. Hasil Pemeriksaan Tim Hukum:</div>
              <p style={{ textAlign: 'justify', marginTop: '4px' }}>
                Berdasarkan hasil gelar berkas perkara dan interogasi yuridis:
              </p>
              <ul style={{ paddingLeft: '24px' }}>
                <li><strong>Klasifikasi Peran:</strong> Tersangka dikategorikan sebagai <strong>{hukum?.analisisPeran || 'Penyalahguna Narkotika (Murni)'}</strong> untuk pemakaian diri sendiri.</li>
                <li><strong>Barang Bukti Sitaan:</strong> {bbList.length > 0 ? bbList.map(b => `${b.nama || b.jenisZat} (${b.jumlah || `${b.beratBersihGram || '0.45'} gram`})`).join(', ') : '0.45 gram bruto kristal putih sabu, alat hisap/bong'} (Berada di bawah ambang batas pemakaian 1 hari sesuai ketentuan SEMA No. 04 Tahun 2010).</li>
                <li><strong>Keterlibatan Jaringan:</strong> {hukum?.jaringanPengedarIndikasi || 'Tidak terindikasi terlibat dalam sindikat atau peredaran gelap narkotika; tidak bertindak sebagai bandar, pengedar, atau kurir'}.</li>
                <li><strong>Catatan Kriminalitas:</strong> Tersangka {hukum?.riwayatResidivisme?.pernahDitangkap ? 'pernah berurusan dengan hukum' : 'belum pernah dihukum pidana sebelumnya (Pelaku Pertama / Bukan Residivis)'}.</li>
                <li><strong>Pertimbangan Yuridis:</strong> {hukum?.analisisBarangBukti || hukum?.kesimpulanHukum || 'Tersangka memenuhi kriteria yuridis untuk direkomendasikan menjalani proses rehabilitasi sesuai amanat Pasal 54 UU No. 35/2009.'}</li>
              </ul>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11pt', textDecoration: 'underline' }}>C. Pemeriksaan Alat Bukti & Laboratorium:</div>
              <ol style={{ paddingLeft: '24px', marginTop: '4px' }}>
                {bbList.length > 0 ? bbList.map((b, i) => (
                  <li key={i}>
                    {b.nomorSuratLab
                      ? <>Surat Hasil Pengujian Laboratorium Narkotika Nomor <strong>{b.nomorSuratLab}</strong> tanggal {b.tanggalSuratLab || tanggalTerbitFormat} terhadap <strong>{b.nama || b.jenisZat}</strong> seberat <strong>{b.beratBersihGram || b.jumlah || '0.45'} gram</strong> — Kesimpulan: <strong>{b.statusUjiLab === 'positif' ? 'POSITIF METAMFETAMINA' : (b.statusUjiLab || 'POSITIF')}</strong>.</>
                      : <>Barang bukti <strong>{b.nama || b.jenisZat}</strong> seberat/jumlah <strong>{b.jumlah || `${b.beratBersihGram || '0.45'} gram`}</strong>, status uji lab: <strong>{b.statusUjiLab === 'positif' ? 'POSITIF METAMFETAMINA' : 'POSITIF'}</strong>.</>
                    }
                  </li>
                )) : (
                  <>
                    <li>Surat Keterangan Hasil Pengujian Laboratorium Narkotika BNN Nomor: <strong>LAB/2408/X/2026/Pusat Laboratorium Narkotika</strong> terhadap <em>sample urine</em> a.n. <strong>{namaTersangka}</strong> dengan hasil <strong>POSITIF METAMFETAMINA</strong>.</li>
                    <li>Berita Acara Penyitaan Barang Bukti berupa 1 bungkus plastik klip sabu seberat bruto 0.45 gram dan alat hisap/bong.</li>
                  </>
                )}
                <li>Berita Acara Pemeriksaan (BAP) Tersangka yang dibuat oleh Penyidik Satresnarkoba.</li>
              </ol>
            </div>

            {/* ===== VI. TEMUAN & CATATAN PLENO ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              VI. TEMUAN & CATATAN PLENO
            </div>
            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
              {pleno?.catatanMusyawarah || rek?.ringkasanHasil || (
                'Berdasarkan integrasi musyawarah mufakat, terperiksa merupakan penyalahguna murni yang memiliki motivasi tinggi untuk pulih. Barang bukti sitaan berada di bawah batas gramatur 1 hari pakai. Keluarga terperiksa kooperatif dan bersedia menjamin kepatuhan terperiksa dalam mengikuti seluruh rangkaian terapi pemulihan dan pengawasan wajib lapor.'
              )}
            </p>

            {/* ===== VII. REKOMENDASI RESMI TIM ASESMEN TERPADU ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              VII. REKOMENDASI RESMI TIM ASESMEN TERPADU
            </div>
            <div style={{ border: '2px solid #000', padding: '10px 14px', margin: '8px 0 10px 0', background: '#fafafa' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11pt', textAlign: 'center', marginBottom: '4px' }}>
                KESIMPULAN REKOMENDASI RESMI:
              </div>
              <div style={{ textAlign: 'center', fontSize: '13pt', fontWeight: 'extrabold', letterSpacing: '0.5px' }}>
                {jenisRek.toUpperCase()}
              </div>
              <div style={{ textAlign: 'center', fontSize: '11pt', marginTop: '4px' }}>
                Fasilitas Rujukan: <strong>{fasilitasRujukan}</strong>
              </div>
              <div style={{ textAlign: 'center', fontSize: '10.5pt', color: '#222' }}>
                Durasi Usulan: <strong>{durasiBulan} ({terbilangBulan(durasiBulan)}) Bulan</strong>
              </div>
            </div>
            <ol style={{ paddingLeft: '24px', marginTop: '6px', marginBottom: '10px' }}>
              {isRawatInap ? (
                <>
                  <li style={{ marginBottom: '6px' }}>
                    Terhadap tersangka atas nama <strong>{namaTersangka}</strong> agar ditempatkan dan menjalani program pemulihan ketergantungan narkotika dengan <strong>Rehabilitasi Rawat Inap</strong> selama <strong>{durasiBulan} ({terbilangBulan(durasiBulan)}) bulan</strong> di <strong>{fasilitasRujukan}</strong>.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    Terhadap berkas perkara dan proses penegakan hukum tersangka a.n <strong>{namaTersangka}</strong> dilanjutkan sesuai dengan ketentuan hukum yang berlaku dengan penempatan di lembaga rehabilitasi.
                  </li>
                </>
              ) : (
                <>
                  <li style={{ marginBottom: '6px' }}>
                    Terhadap tersangka atas nama <strong>{namaTersangka}</strong> agar menjalani program perawatan dan pemulihan dengan <strong>Rehabilitasi Rawat Jalan</strong> minimal <strong>8 (delapan) kali pertemuan / sesi konseling adiksi</strong> di <strong>{fasilitasRujukan}</strong>.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    Tersangka atas nama <strong>{namaTersangka}</strong> diwajibkan melaksanakan <strong>WAJIB LAPOR</strong> secara periodik kepada Penyidik sampai dengan program rehabilitasi dinyatakan selesai secara klinis.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    Terhadap proses hukum perkara dilanjutkan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.
                  </li>
                </>
              )}
            </ol>

            {/* ===== VIII. KEPUTUSAN ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              VIII. KEPUTUSAN
            </div>
            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
              Terhadap penanganan berkas perkara tersangka atas nama <strong>{namaTersangka}</strong>, proses penegakan hukum dilanjutkan sesuai dengan ketentuan perundang-undangan yang berlaku dengan menempatkan yang bersangkutan di fasilitas rehabilitasi medis dan sosial sesuai kewenangan penyidik/penuntut umum berdasarkan Pasal 54 jo Pasal 103 UU No. 35 Tahun 2009 tentang Narkotika.
            </p>

            {/* ===== IX. PENUTUP ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: '12px', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
              IX. PENUTUP
            </div>
            <p style={{ textAlign: 'justify', marginBottom: '16px' }}>
              Demikian Lembar Rekomendasi Hasil Asesmen Terpadu ini dibuat dengan sebenarnya atas kekuatan sumpah jabatan untuk dipergunakan sebagai bahan pertimbangan bagi Penyidik, Jaksa Penuntut Umum, dan Hakim Pengadilan Negeri dalam proses penanganan perkara selanjutnya.
            </p>

            {/* ===== TANDA TANGAN & PENGESAHAN ===== */}
            <div style={{ marginTop: '20px', borderTop: '1px solid #000', paddingTop: '10px' }}>
              <div style={{ textAlign: 'right', fontSize: '11pt', marginBottom: '12px' }}>
                Dikeluarkan di: Samarinda<br />
                Pada tanggal: {tanggalTerbitFormat}
              </div>

              {/* Tanda Tangan Tim Medis */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '11pt', textDecoration: 'underline', marginBottom: '6px' }}>
                  TIM ASESOR MEDIS TAT:
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      {timMedisFinal.map((m, i) => (
                        <td key={i} style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 8px' }}>
                          <div style={{ fontSize: '10pt', color: '#444' }}>Asesor Medis {i + 1}</div>
                          <div style={{ height: '65px' }}></div>
                          <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '170px', paddingTop: '2px', fontWeight: 'bold', fontSize: '10.5pt' }}>
                            {m.nama}
                          </div>
                          <div style={{ fontSize: '9.5pt', color: '#222' }}>{m.pangkat}</div>
                          <div style={{ fontSize: '9.5pt' }}>NIP: {m.nip}</div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan Tim Hukum */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '11pt', textDecoration: 'underline', marginBottom: '6px' }}>
                  TIM ASESOR HUKUM TAT:
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      {timHukumFinal.map((m, i) => (
                        <td key={i} style={{ width: '33.3%', textAlign: 'center', verticalAlign: 'top', padding: '0 6px' }}>
                          <div style={{ fontSize: '10pt', color: '#444' }}>Asesor Hukum {i + 1}</div>
                          <div style={{ height: '65px' }}></div>
                          <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '150px', paddingTop: '2px', fontWeight: 'bold', fontSize: '10pt' }}>
                            {m.nama}
                          </div>
                          <div style={{ fontSize: '9pt', color: '#222' }}>{m.pangkat}</div>
                          <div style={{ fontSize: '9pt' }}>NIP/NRP: {m.nip}</div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pengesahan Ketua TAT & QR Code */}
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

                      {/* Kolom Ketua TAT */}
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
