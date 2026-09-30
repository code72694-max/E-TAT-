import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { PermohonanAsesmen } from '../types';

interface BeritaAcaraModalProps {
  permohonan: PermohonanAsesmen;
  onClose: () => void;
}

export const BeritaAcaraModal: React.FC<BeritaAcaraModalProps> = ({ permohonan, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/><title>Berita Acara TAT</title>
      <style>
        @page{margin:2.5cm 3cm 2.5cm 3cm;size:A4}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Times New Roman',Times,serif;font-size:12pt;color:#000;line-height:1.5}
        .dw{width:100%;max-width:800px;margin:0 auto;padding:0}
        ol li{margin-bottom:4px;text-align:justify}
        p{text-align:justify;margin-bottom:8px}
      </style></head><body><div class="dw">${printContents}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  const p = permohonan;
  const pleno = p.sidangPleno;
  const medis = p.asesmenMedis;
  const hukum = p.asesmenHukum;
  const tr = p.terperiksa;
  const pk = p.perkara;

  const nomorBA = pleno?.nomorBeritaAcara || 'BA/ ......... / XI / 2025 / TAT / BNN';
  const tanggalPleno = pleno?.tanggalPleno || '';
  const waktuPleno = pleno?.waktu || '......';
  const tempatPleno = pleno?.tempat || 'Sekretariat Tim Asesmen Terpadu BNN RI';
  const ketua = pleno?.pimpinanPleno || '......................................';

  const timMedis = pleno?.daftarHadir.filter(m =>
    m.peran.toLowerCase().includes('medis') || m.peran.toLowerCase().includes('dokter')
  ) || [];
  const timHukum = pleno?.daftarHadir.filter(m =>
    m.peran.toLowerCase().includes('hukum') || m.peran.toLowerCase().includes('jaksa') || m.peran.toLowerCase().includes('penyidik')
  ) || [];
  const bb = pk.barangBuktiList || [];

  const formatDate = (d: string) => {
    if (!d) return '......';
    try {
      return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    } catch { return d; }
  };

  const memberFields = ['Nama', 'Pangkat', 'NIP/NRP', 'Jabatan'];

  const renderMember = (num: number, name: string, jabatan: string) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
      <tbody>
        {memberFields.map((field, fi) => (
          <tr key={fi}>
            <td style={{ width: '28px', verticalAlign: 'top', paddingLeft: fi === 0 ? '0' : '28px', fontSize: '12pt' }}>
              {fi === 0 ? `${num}.` : ''}
            </td>
            <td style={{ width: '90px', fontSize: '12pt' }}>{field}</td>
            <td style={{ width: '14px', textAlign: 'center', fontSize: '12pt' }}>:</td>
            <td style={{ fontSize: '12pt' }}>
              {fi === 0 ? name : fi === 3 ? jabatan : '......................'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderEmptyMembers = (count: number) => (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <table key={idx} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
          <tbody>
            {memberFields.map((field, fi) => (
              <tr key={fi}>
                <td style={{ width: '28px', verticalAlign: 'top', paddingLeft: fi === 0 ? '0' : '28px', fontSize: '12pt' }}>
                  {fi === 0 ? `${idx + 1}.` : ''}
                </td>
                <td style={{ width: '90px', fontSize: '12pt' }}>{field}</td>
                <td style={{ width: '14px', textAlign: 'center', fontSize: '12pt' }}>:</td>
                <td style={{ fontSize: '12pt' }}>..........................</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </>
  );

  const signatureBlock = (label: string, name: string, nip: string, prefix?: string) => (
    <div style={{ textAlign: 'center', padding: '0 8px' }}>
      <div style={{ height: '70px' }}></div>
      <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '160px', paddingTop: '2px', fontWeight: 'bold', fontSize: '11pt' }}>
        {prefix ? `${prefix}${name}` : name}
      </div>
      <div style={{ fontSize: '10.5pt' }}>{nip}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
        style={{ maxHeight: '95vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#d4af37]">📄</span>
              Berita Acara Pelaksanaan Asesmen Terpadu
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{nomorBA}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors">
              <Printer className="w-3.5 h-3.5" />
              Cetak / Export PDF
            </button>
            <button onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1b3459] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 bg-slate-600/20">
          <div ref={printRef}
            className="bg-white text-black mx-auto shadow-xl"
            style={{ width: '794px', minHeight: '1123px', padding: '72px 90px', fontFamily: "'Times New Roman', Times, serif" }}>

            {/* ===== KOP SURAT ===== */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '90px', verticalAlign: 'top', textAlign: 'center' }}>
                    <svg viewBox="0 0 100 100" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="48" fill="#003366" stroke="#d4af37" strokeWidth="3"/>
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" strokeWidth="1.5"/>
                      <text x="50" y="38" textAnchor="middle" fill="#d4af37" fontSize="9" fontWeight="bold" fontFamily="Arial">BADAN</text>
                      <text x="50" y="50" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial">NARKOTIKA</text>
                      <text x="50" y="61" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial">NASIONAL</text>
                      <text x="50" y="75" textAnchor="middle" fill="#d4af37" fontSize="12" fontWeight="bold" fontFamily="Arial">BNN</text>
                    </svg>
                  </td>
                  <td style={{ verticalAlign: 'top', textAlign: 'center', paddingLeft: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13pt', lineHeight: '1.3' }}>BADAN NARKOTIKA NASIONAL REPUBLIK INDONESIA</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>(NATIONAL NARCOTICS BOARD REPUBLIC OF INDONESIA)</div>
                    <div style={{ fontSize: '9.5pt', marginTop: '4px', lineHeight: '1.5' }}>
                      Jl. MT. Haryono No. 11 Cawang Jakarta Timur<br />
                      Telepon : (62-21) 80871566, 80871567<br />
                      Faksimili : (62-21) 80885225, 80871591, 80871592, 80871593<br />
                      e-mail : info@bnn.go.id website : www.bnn.go.id
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr style={{ border: 'none', borderTop: '3px solid #000', margin: '4px 0 2px 0' }} />
            <hr style={{ border: 'none', borderTop: '1px solid #000', margin: '2px 0 12px 0' }} />

            {/* ===== JUDUL ===== */}
            <div style={{ textAlign: 'center', margin: '8px 0 16px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12pt', textDecoration: 'underline' }}>BERITA ACARA</div>
              <div style={{ fontWeight: 'bold', fontSize: '12.5pt', textDecoration: 'underline' }}>PELAKSANAAN ASESMEN TERPADU</div>
              <div style={{ fontWeight: 'bold', fontSize: '12pt' }}>NOMOR: {nomorBA}</div>
            </div>

            {/* ===== PEMBUKA ===== */}
            <p style={{ textAlign: 'justify', marginBottom: '12px', fontSize: '12pt', lineHeight: '1.6' }}>
              Pada hari ini <strong>{tanggalPleno ? new Date(tanggalPleno).toLocaleDateString('id-ID', { weekday: 'long' }) : '......'}</strong>, tanggal <strong>{formatDate(tanggalPleno)}</strong> sekira jam <strong>{waktuPleno}</strong> bertempat di {tempatPleno}, yang dipimpin oleh <strong>{ketua}</strong> dengan NRP..........................., selaku Ketua Tim Asesmen Terpadu (TAT) Tingkat Provinsi/Kabupaten/Kota....................., dan anggota Tim Asesmen Terpadu terdiri dari:
            </p>
            <hr style={{ border: 'none', borderBottom: '1px solid #000', margin: '0 0 12px 0' }} />

            {/* ===== TIM MEDIS ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '12pt', margin: '10px 0 6px 0' }}>I. Tim Medis:</div>
            {timMedis.length > 0
              ? timMedis.map((m, i) => renderMember(i + 1, m.nama, m.peran))
              : renderEmptyMembers(2)
            }

            {/* ===== TIM HUKUM ===== */}
            <div style={{ fontWeight: 'bold', fontSize: '12pt', margin: '10px 0 6px 0' }}>II. Tim Hukum:</div>
            {timHukum.length > 0
              ? timHukum.map((m, i) => renderMember(i + 1, m.nama, m.peran))
              : renderEmptyMembers(3)
            }

            {/* ===== BERDASARKAN ===== */}
            <p style={{ textAlign: 'justify', marginTop: '14px', marginBottom: '12px', fontSize: '12pt', lineHeight: '1.6' }}>
              Berdasarkan Surat Keputusan Kepala Badan Narkotika Nasional, Nomor .......................... tentang Tim Asesmen Terpadu Tingkat ...................., kami Tim Asesmen Terpadu Tingkat .................. telah melakukan Rapat Pelaksanaan Asesmen Terpadu terhadap <strong>{tr.namaLengkap}</strong> dengan nomor register asesmen : <strong>{p.nomorPermohonan}</strong>, sesuai dengan surat. Nomor: ....................... tanggal ......................kepada Kepala BNNP/Kabupaten/Kota selaku Ketua TAT Tingkat Provinsi/Kabupaten/Kota perihal Permohonan Pengajuan Asesmen Terpadu Tersangka a.n <strong>{tr.namaLengkap}</strong>, dengan hasil sebagai berikut:
            </p>
            <hr style={{ border: 'none', borderBottom: '1px dashed #999', margin: '4px 0 10px 0' }} />

            {/* ===== 1. HASIL TIM MEDIS ===== */}
            <div style={{ margin: '10px 0' }}>
              <span style={{ fontWeight: 'bold', fontSize: '12pt' }}>1.&nbsp;&nbsp;&nbsp;a.&nbsp;&nbsp;&nbsp;Hasil Pemeriksaan Tim Medis:</span>
              <div style={{ marginTop: '6px', fontSize: '12pt', lineHeight: '1.6', textAlign: 'justify' }}>
                {medis ? (
                  <p>
                    Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> seorang {tr.jenisKelamin === 'Laki-laki' ? 'laki-laki' : 'perempuan'} berusia <strong>{tr.usia} tahun</strong>, bekerja sebagai <strong>{tr.pekerjaan}</strong>.
                    {medis.riwayatZat.length > 0 && ` Bahwa tersangka atas nama ${tr.namaLengkap} menggunakan ${medis.riwayatZat[0].jenisZat} sejak ${medis.riwayatZat[0].lamaPemakaianBulan} bulan, dengan frekuensi ${medis.riwayatZat[0].frekuensi}, cara pakai: ${medis.riwayatZat[0].caraPakai}. Terakhir pakai: ${medis.riwayatZat[0].terakhirPakai}.`}
                    {medis.kondisiPsikologis && ` Kondisi psikologis: ${medis.kondisiPsikologis}.`}
                    {` Berdasarkan instrumen ${medis.instrumen}, skor ${medis.skorInstrumen} — tingkat risiko: ${medis.tingkatRisikoInstrumen}. Diagnosis: ${medis.diagnosisKlinisIcd}. Rekomendasi: ${medis.kebutuhanRawat} selama ${medis.durasiUsulanBulan} bulan.`}
                    {` Saat dilakukan asesmen medis tersangka atas nama ${tr.namaLengkap} dalam masa kooperatif saat wawancara.`}
                  </p>
                ) : (
                  <p>
                    Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> seorang {tr.jenisKelamin === 'Laki-laki' ? 'laki-laki' : 'perempuan'} berusia <strong>{tr.usia} tahun</strong>, bekerja sebagai <strong>{tr.pekerjaan}</strong>, beralamat di {tr.alamatDomisili}. Saat dilakukan asesmen medis tersangka atas nama <strong>{tr.namaLengkap}</strong> dalam kondisi kooperatif saat wawancara.
                  </p>
                )}
              </div>
            </div>

            {/* ===== 2. HASIL TIM HUKUM ===== */}
            <div style={{ margin: '10px 0' }}>
              <span style={{ fontWeight: 'bold', fontSize: '12pt' }}>2.&nbsp;&nbsp;&nbsp;Hasil Pemeriksaan Tim Hukum:</span>
              <div style={{ marginTop: '6px', fontSize: '12pt', lineHeight: '1.6', textAlign: 'justify' }}>
                {hukum ? (
                  <p>
                    Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> bekerja sebagai <strong>{tr.pekerjaan}</strong>.
                    {` Berdasarkan hasil pemeriksaan, tersangka atas nama ${tr.namaLengkap} dianalisis perannya sebagai: ${hukum.analisisPeran}.`}
                    {hukum.argumentasiPeran && ` ${hukum.argumentasiPeran}.`}
                    {hukum.analisisBarangBukti && ` Analisis barang bukti: ${hukum.analisisBarangBukti}.`}
                    {hukum.kesimpulanHukum && ` ${hukum.kesimpulanHukum}.`}
                    {` Bahwa tersangka atas nama ${tr.namaLengkap} ${hukum.riwayatResidivisme?.pernahDitangkap ? 'pernah' : 'belum pernah'} di hukum sebelumnya. Bahwa tersangka atas nama ${tr.namaLengkap} belum pernah menjual kembali narkotika, atau menjadi perantara dalam jual beli narkotika.`}
                  </p>
                ) : (
                  <p>
                    Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong>, disangkakan melanggar <strong>{pk.pasalDipersangkakan}</strong>. Berdasarkan hasil pemeriksaan, tersangka diketahui menggunakan narkotika untuk kepentingan pribadi.
                  </p>
                )}
              </div>
            </div>

            {/* ===== b. ALAT BUKTI ===== */}
            <div style={{ margin: '10px 0' }}>
              <span style={{ fontWeight: 'bold', fontSize: '12pt' }}>b.&nbsp;&nbsp;&nbsp;Alat Bukti:</span>
              <ol style={{ paddingLeft: '30px', marginTop: '6px', fontSize: '12pt', lineHeight: '1.6' }}>
                {bb.length > 0 ? bb.map((b, i) => (
                  <li key={i}>
                    {b.nomorSuratLab
                      ? <>Hasil Pemeriksaan Laboratorium {b.nomorSuratLab} tanggal {b.tanggalSuratLab} terhadap <strong>{b.jenisZat}</strong> dengan berat bersih {b.beratBersihGram} gram — Hasil: <strong>{b.statusUjiLab === 'positif' ? 'Positif' : 'Negatif'}</strong>.</>
                      : <>Barang bukti <strong>{b.jenisZat}</strong> dengan berat bersih {b.beratBersihGram} gram, status uji lab: {b.statusUjiLab}.</>
                    }
                  </li>
                )) : (
                  <>
                    <li>Surat Keterangan Pemeriksaan Narkoba dari Pusat Laboratorium Narkotika BNN Nomor: .............../XI/2025/Pusat Laboratorium Narkotika tanggal .................. yang ditandatangani oleh dr. .............., M.Si terhadap <em>sample urine</em> a.n. <strong>{tr.namaLengkap}</strong> dengan hasil positif <em>metamfetamina</em>.</li>
                    <li>Hasil Pemeriksaan Laboratorium Pusat Laboratorium Narkotika BNN .............../XI/2025/Pusat Laboratorium Narkotika tanggal .................. yang ditandatangani oleh dr. .............., M.Si terhadap barang bukti tersangka.</li>
                  </>
                )}
              </ol>
            </div>

            {/* ===== 3. FAKTA MEDIS ===== */}
            <div style={{ margin: '14px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12pt', textAlign: 'center', marginBottom: '6px' }}>3.&nbsp;&nbsp;&nbsp;Fakta Medis:</div>
              <p style={{ textAlign: 'justify', fontSize: '12pt', lineHeight: '1.6', marginBottom: '6px' }}>
                Berdasarkan hasil asesmen menggunakan <em>Addiction Severity Index</em> disertai dengan observasi dan pemeriksaan fisik terhadap tersangka atas nama <strong>{tr.namaLengkap}</strong>, didapatkan:
              </p>
              <ol style={{ paddingLeft: '20px', fontSize: '12pt', lineHeight: '1.6' }}>
                {medis ? (
                  <>
                    {medis.riwayatZat.map((z, i) => (
                      <li key={i}>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong>, menggunakan {z.jenisZat} sejak tahun {new Date().getFullYear() - Math.round(z.lamaPemakaianBulan / 12)}, dengan pemakaian {z.frekuensi} untuk {tr.pekerjaan}.</li>
                    ))}
                    <li>Bahwa lingkungan pergaulan tersangka atas nama <strong>{tr.namaLengkap}</strong> mendukung penyalahgunaan narkotika.</li>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong>, terakhir kali mengkonsumsi {medis.riwayatZat[0]?.jenisZat || 'narkotika'} dua hari sebelum dilakukan Asesmen Terpadu.</li>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> sering mengkonsumsi narkotika bersama teman-temannya.</li>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> tidak merasakan adanya dorongan kuat (<em>craving</em>) bila tidak mengkonsumsi kembali.</li>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> tidak memiliki dukungan pemulihan terhadap penyalahgunaan narkotika yang dilakukan.</li>
                  </>
                ) : (
                  [1, 2, 3, 4, 5, 6].map(n => (
                    <li key={n}>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> ......................................................................................................-</li>
                  ))
                )}
              </ol>

              {/* Fakta Hukum */}
              <div style={{ fontWeight: 'bold', fontSize: '12pt', margin: '12px 0 4px 0' }}>Fakta Hukum:</div>
              <p style={{ textAlign: 'justify', fontSize: '12pt', lineHeight: '1.6', marginBottom: '6px' }}>
                Berdasarkan hasil pemeriksaan oleh Tim Hukum dengan wawancara, pemeriksaan dokumen-dokumen dari Penyidik, pengecekan data tersangka atas nama <strong>{tr.namaLengkap}</strong>, didapatkan fakta-fakta sebagai berikut:
              </p>
              <ol style={{ paddingLeft: '20px', fontSize: '12pt', lineHeight: '1.6' }}>
                {hukum ? (
                  <>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> bekerja sebagai <strong>{tr.pekerjaan}</strong>.</li>
                    {hukum.faktaPendukung?.map((f, i) => <li key={i}>Bahwa {f}</li>)}
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> menggunakan narkotika jenis {medis?.riwayatZat[0]?.jenisZat || 'sabu'} untuk kepentingan pribadi.</li>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> menggunakan narkotika jenis {medis?.riwayatZat[0]?.jenisZat || 'sabu'} untuk pertama kali pada tahun {new Date().getFullYear() - Math.round((medis?.riwayatZat[0]?.lamaPemakaianBulan || 12) / 12)}.</li>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> {hukum.riwayatResidivisme?.pernahDitangkap ? 'pernah' : 'belum pernah'} di hukum sebelumnya.{hukum.riwayatResidivisme?.keteranganPerkaraLalu ? ` ${hukum.riwayatResidivisme.keteranganPerkaraLalu}` : '-'}</li>
                    <li>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> belum pernah menjual kembali narkotika, atau menjadi perantara dalam jual beli narkotika -------------------------</li>
                  </>
                ) : (
                  [1, 2, 3, 4, 5, 6].map(n => (
                    <li key={n}>Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> ......................................................................................................-</li>
                  ))
                )}
              </ol>
            </div>

            {/* ===== KESIMPULAN ===== */}
            <div style={{ margin: '14px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12pt', marginBottom: '6px' }}>3.&nbsp;&nbsp;&nbsp;Kesimpulan</div>
              <p style={{ textAlign: 'justify', fontSize: '12pt', lineHeight: '1.6', marginBottom: '8px' }}>
                Berdasarkan hasil Asesmen Terpadu terhadap tersangka atas nama <strong>{tr.namaLengkap}</strong>, kami selaku Tim Asesmen Terpadu Tingkat Nasional menyimpulkan:
              </p>
              <ol type="a" style={{ paddingLeft: '30px', fontSize: '12pt', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '6px' }}>
                  Bahwa tersangka atas nama <strong>{tr.namaLengkap}</strong> {medis
                    ? `narkotika golongan I yaitu ${medis.riwayatZat[0]?.jenisZat || 'metamfetamina'} (${medis.diagnosisKlinisIcd || '...'}) untuk digunakan sendiri dengan pemakaian ${medis.tingkatRisikoInstrumen === 'Tinggi' ? 'berat' : medis.tingkatRisikoInstrumen === 'Sedang' ? 'sedang' : 'ringan'}, diagnosis ${medis.diagnosisKlinisIcd}, Gangguan mental dan perilaku akibat penggunaan Zat Stimulansia lain(F15).`
                    : 'menggunakan narkotika golongan I untuk digunakan sendiri.'}
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Bahwa {hukum?.riwayatResidivisme?.pernahDitangkap
                    ? `berdasarkan pemeriksaan, tersangka pernah terlibat dalam jaringan peredaran gelap narkotika.`
                    : `belum terdapat indikasi keterlibatan tersangka atas nama ${tr.namaLengkap} dalam jaringan peredaran gelap narkotika.`
                  }
                </li>
              </ol>

              <p style={{ textAlign: 'justify', fontSize: '12pt', lineHeight: '1.6', margin: '10px 0' }}>
                Bahwa berdasarkan huruf a dan b tersebut diatas, terhadap <strong>{tr.namaLengkap}</strong>, kami selaku Tim Asesmen Terpadu Tingkat Nasional memberikan Rekomendasi sebagai berikut:
              </p>
              <ol type="a" style={{ paddingLeft: '30px', fontSize: '12pt', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '6px' }}>
                  Terhadap tersangka atas nama <strong>{tr.namaLengkap}</strong> agar dilakukan perawatan dan pemulihan dengan <strong>Rehabilitasi {pleno?.jenisRekomendasiFinal || medis?.kebutuhanRawat || 'Rawat Inap'}</strong> minimal <strong>{pleno?.durasiRehabBulan || medis?.durasiUsulanBulan || 6} (.....) bulan</strong> di {pleno?.fasilitasRujukanUsulan || 'Balai Besar Rehabilitasi Badan Narkotika Nasional Republik Indonesia'}.
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Terhadap tersangka atas nama <strong>{tr.namaLengkap}</strong> terkait dengan perkara dilanjutkan sesuai ketentuan perundang-undangan yang berlaku.
                </li>
              </ol>

              <div style={{ fontWeight: 'bold', fontSize: '12pt', textAlign: 'center', margin: '12px 0 6px 0' }}>
                CONTOH REKOMENDASI RAWAT JALAN
              </div>
              <ol type="a" style={{ paddingLeft: '30px', fontSize: '12pt', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '6px' }}>
                  Terhadap tersangka atas nama <strong>{tr.namaLengkap}</strong> agar dilakukan perawatan dan pemulihan dengan <strong>Rehabilitasi Rawat Jalan</strong> minimal <strong>8 (delapan) kali pertemuan</strong> di Institusi Penerima Wajib Lapor (IPWL) Badan Narkotika Nasional Republik Indonesia dan melaksanakan WAJIB LAPOR kepada Penyidik Subdit IV Direktorat Tindak Pidana Narkoba Bareskrim Polri sampai selesai rehabilitasi.
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Terhadap tersangka atas nama <strong>{tr.namaLengkap}</strong> terkait dengan perkara dilanjutkan sesuai ketentuan perundang-undangan yang berlaku.
                </li>
              </ol>
            </div>

            {/* ===== PENUTUP ===== */}
            <p style={{ textAlign: 'justify', fontSize: '12pt', lineHeight: '1.6', margin: '20px 0 16px 0' }}>
              Demikian Berita Acara Rapat Pelaksanaan Asesmen Terpadu tersangka atas nama <strong>{tr.namaLengkap}</strong> ini dibuat dengan sebenarnya atas kekuatan sumpah jabatan, kemudian ditutup dan ditandatangani di.............. pada hari dan tanggal tersebut di atas.
            </p>

            {/* ===== TTD TIM HUKUM ===== */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <tbody>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11pt', paddingBottom: '4px' }}>Tim Hukum</td>
                </tr>
                <tr>
                  {(['Jaksa Muda...', 'AKBP', 'KBP/Penyidik BNN Ahli....'] as string[]).map((label, i) => (
                    <td key={i} style={{ width: '33.3%', textAlign: 'center', verticalAlign: 'top', padding: '0 8px' }}>
                      <div style={{ height: '70px' }}></div>
                      <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '160px', paddingTop: '2px', fontWeight: 'bold', fontSize: '11pt' }}>{label}</div>
                      <div style={{ fontSize: '10.5pt' }}>NIP/NRP. ..............................</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {/* ===== TTD TIM MEDIS ===== */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <tbody>
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11pt', paddingBottom: '4px' }}>Tim Medis</td>
                </tr>
                <tr>
                  {(['dr. ..........................', 'dr. ..........................'] as string[]).map((label, i) => (
                    <td key={i} style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 8px' }}>
                      <div style={{ height: '70px' }}></div>
                      <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '160px', paddingTop: '2px', fontWeight: 'bold', fontSize: '11pt' }}>{label}</div>
                      <div style={{ fontSize: '10.5pt' }}>NIP. ..............................</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {/* ===== KETUA TAT ===== */}
            <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '2px solid #000', paddingTop: '10px', fontSize: '12pt' }}>
              <div style={{ fontWeight: 'bold' }}>Ketua Tim Asesmen Terpadu Tingkat Provinsi........</div>
              <div style={{ height: '70px', marginTop: '4px' }}></div>
              <div style={{ borderTop: '1px solid #000', display: 'inline-block', minWidth: '220px', paddingTop: '2px', fontWeight: 'bold' }}>
                {pleno?.pimpinanPleno || '................................'}
              </div>
              <div style={{ marginTop: '4px', fontWeight: 'bold', letterSpacing: '0.5px' }}>BRIGADIR JENDERAL POLISI</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
