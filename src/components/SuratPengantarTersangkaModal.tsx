import React, { useRef } from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import { PermohonanAsesmen, UserProfile } from '../types';
import { QrCodeImg } from './QrCodeComponent';
import { printLegalDocument } from '../utils/printLegalDoc';

interface SuratPengantarTersangkaModalProps {
  permohonan: PermohonanAsesmen;
  currentUser?: UserProfile;
  onClose: () => void;
}

const cleanStr = (s?: string) => (s ? s.replace(/\[TEST\]\s*/gi, '').replace(/\(Akun Uji\)/gi, '').trim() : '');

export const SuratPengantarTersangkaModal: React.FC<SuratPengantarTersangkaModalProps> = ({
  permohonan,
  currentUser,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const p = permohonan;
  const t = p.terperiksa;
  const pleno = p.sidangPleno;
  const rek = p.rekomendasiResmi;
  const tl = p.tindakLanjut;

  const namaKlien = cleanStr(t?.namaLengkap || (t as any)?.namaTerperiksa) || 'Klien Terperiksa';
  const nik = t?.nik || '64720109880001';
  const usia = t?.usia || 28;
  const alamat = t?.alamatDomisili || t?.alamatKtp || 'Samarinda, Kalimantan Timur';
  const noLp = p.perkara?.nomorLaporanPolisi || p.perkara?.nomorLp || 'LP/A/155/IX/2026/SPKT';
  const instansiPenyidik = p.instansiPengaju || p.perkara?.instansiPenyidik || 'Satresnarkoba Polresta Samarinda';
  const namaPenyidik = p.perkara?.namaPenyidik || 'Bripka Heru Susanto';

  // Kode Lacak & Nomor Surat Rujukan
  const kodeLacak = (p as any).kodeLacakRehab || tl?.kodeLacakRehab || `RHB-${p.id.slice(-6).toUpperCase()}`;
  const noSurat = tl?.nomorSuratRujukan || (p as any).nomorSuratPengantarTersangka || `SR-TAT/2026/09/${p.id.slice(-4)}`;
  const noBa = pleno?.nomorBeritaAcara || rek?.nomorSurat || `BA-PLENO/TAT/2026/${p.nomorPermohonan?.replace(/[^0-9]/g, '') || '0101'}`;

  // Hasil Pleno
  const modalitas = pleno?.kesepakatanRekomendasi?.toLowerCase().includes('inap')
    ? 'Rehabilitasi Medis dan Sosial Rawat Inap'
    : 'Rehabilitasi Medis dan Sosial Rawat Jalan (Kontrol Berkala)';
  const durasiBulan = pleno?.durasiRehabBulan || (modalitas.includes('Inap') ? 6 : 3);
  const fasilitas = tl?.namaFasilitasTujuan || pleno?.fasilitasRujukanUsulan || 'Balai Besar Rehabilitasi BNN Tanah Merah';

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:3000';
  const trackingUrl = `${origin}/lacak?tab=rehab&q=${encodeURIComponent(kodeLacak)}`;

  const handlePrint = () => {
    printLegalDocument(printRef.current?.innerHTML);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}
    >
      <div
        className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
        style={{ maxHeight: '96vh' }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#d4af37]">📄</span>
              Surat Pengantar Rujukan &amp; Dokumen Klien (Diberikan Kepada Tersangka)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Nomor: {noSurat} &bull; Kode Lacak: <strong className="text-[#d4af37] font-mono">{kodeLacak}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Surat Pengantar (A4)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
          <div
            ref={printRef}
            className="bg-white text-black p-8 sm:p-12 rounded-lg shadow-2xl mx-auto"
            style={{
              maxWidth: '810px',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: '11pt',
              lineHeight: '1.45',
              color: '#000'
            }}
          >
            {/* Kop Surat BNN */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '85px', verticalAlign: 'middle', textAlign: 'left', padding: '0' }}>
                    <img
                      src="/bnn.png"
                      alt="Logo BNN RI"
                      style={{ width: '78px', height: '78px', objectFit: 'contain', display: 'block' }}
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0 4px' }}>
                    <div style={{ fontSize: '13pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px' }}>
                      BADAN NARKOTIKA NASIONAL REPUBLIK INDONESIA
                    </div>
                    <div style={{ fontSize: '10.5pt', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '0.2px', marginTop: '1px' }}>
                      TIM ASESMEN TERPADU (TAT) NARKOTIKA DAERAH KALIMANTAN TIMUR
                    </div>
                    <div style={{ fontSize: '8.5pt', marginTop: '3px', lineHeight: '1.35', color: '#111' }}>
                      Sekretariat Bersama: Jl. Slamet Riyadi No. 1, Telp: (0541) 743201, Samarinda - Kaltim<br />
                      Sistem Elektronik Integrasi Asesmen &amp; Pemantauan Pemulihan (e-TAT SIAP PULIH)
                    </div>
                  </td>
                  <td style={{ width: '85px', verticalAlign: 'middle' }}></td>
                </tr>
              </tbody>
            </table>
            <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
            <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

            {/* Judul Dokumen */}
            <div style={{ textAlign: 'center', margin: '10px 0 16px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12pt', textDecoration: 'underline' }}>
                SURAT PENGANTAR RUJUKAN &amp; LEMBAR PENETAPAN KLIEN
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                NOMOR: {noSurat}
              </div>
              <div style={{ fontSize: '9.5pt', fontStyle: 'italic', marginTop: '2px', color: '#333' }}>
                (Dokumen Resmi Asli - Diberikan Kepada Tersangka / Keluarga Penjamin)
              </div>
            </div>

            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
              Berdasarkan hasil musyawarah kesepakatan <strong>Sidang Pleno Tim Asesmen Terpadu (TAT)</strong> Nomor: <strong>{noBa}</strong> serta koordinasi penyidikan dan penuntutan, Tim Asesmen Terpadu bersama Penyidik Pembina menerbitkan Surat Pengantar Rujukan dan Penetapan Layanan Pemulihan kepada tersangka/klien di bawah ini:
            </p>

            {/* Identitas Klien */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                  <td style={{ width: '180px', verticalAlign: 'top' }}>Nama Tersangka / Klien</td>
                  <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{namaKlien} {t?.alias ? `(Alias: ${t.alias})` : ''}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>2.</td>
                  <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{nik} / {usia} Tahun</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>3.</td>
                  <td style={{ verticalAlign: 'top' }}>Nomor Laporan Polisi (LP)</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{noLp}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>4.</td>
                  <td style={{ verticalAlign: 'top' }}>Instansi Penyidik Pembina</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{instansiPenyidik}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>5.</td>
                  <td style={{ verticalAlign: 'top' }}>Alamat Domisili Klien</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{alamat}</td>
                </tr>
              </tbody>
            </table>

            {/* Ketetapan Layanan Rehabilitasi */}
            <div style={{ border: '1.5px solid #000', padding: '10px 14px', marginBottom: '14px', background: '#fafafa' }}>
              <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginBottom: '6px', textDecoration: 'underline' }}>
                KETETAPAN REKOMENDASI HASIL SIDANG PLENO TAT:
              </div>
              <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '160px', padding: '2px 0' }}>Bentuk / Modalitas Layanan</td>
                    <td style={{ width: '10px' }}>:</td>
                    <td style={{ fontWeight: 'bold' }}>{modalitas}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0' }}>Masa / Durasi Program</td>
                    <td>:</td>
                    <td><strong>{durasiBulan} (Tiga) Bulan</strong> Program Pemulihan Terpadu</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0' }}>Fasilitas Rujukan Pelaksana</td>
                    <td>:</td>
                    <td style={{ fontWeight: 'bold' }}>{fasilitas}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0' }}>Kewajiban Wajib Lapor</td>
                    <td>:</td>
                    <td>Melapor dan menjalani tes urin toksikologi berkala kepada Penyidik Satresnarkoba.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* KOTAK KODE LACAK RESMI UNTUK TERSANGKA */}
            <div
              style={{
                border: '2px dashed #000',
                padding: '12px 14px',
                marginBottom: '16px',
                background: '#fffdf5',
                pageBreakInside: 'avoid'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                      <div style={{ fontSize: '9pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#555' }}>
                        KODE AKSES PELACAKAN REHABILITASI &amp; KONTROL KLIEN:
                      </div>
                      <div
                        style={{
                          fontSize: '18pt',
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          letterSpacing: '2px',
                          color: '#081224',
                          margin: '4px 0'
                        }}
                      >
                        {kodeLacak}
                      </div>
                      <div style={{ fontSize: '9pt', lineHeight: '1.35', color: '#222', textAlign: 'justify' }}>
                        Klien dan Keluarga/Penjamin dapat memantau kehadiran jadwal kontrol medis, rekapitulasi hasil uji toksikologi urin berkala, dan kepatuhan wajib lapor secara transparan pada portal e-TAT di menu: <strong>2. Lacak Rehabilitasi &amp; Kontrol Klien</strong> menggunakan kode di atas atau memindai QR Code di samping.
                      </div>
                    </td>
                    <td style={{ width: '90px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <QrCodeImg value={trackingUrl} size={82} />
                      <div style={{ fontSize: '7.5pt', fontFamily: 'monospace', marginTop: '2px', color: '#444' }}>
                        Scan Mandiri
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Matriks Tanda Tangan */}
            <div style={{ marginTop: '16px', pageBreakInside: 'avoid' }}>
              <div style={{ textAlign: 'right', fontSize: '10pt', marginBottom: '8px' }}>
                Dikeluarkan di: Samarinda<br />
                Pada tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', textAlign: 'center' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '33%', verticalAlign: 'top' }}>
                      <div>Penyidik Satresnarkoba,</div>
                      <div style={{ height: '55px' }}></div>
                      <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{namaPenyidik}</div>
                      <div style={{ fontSize: '9pt' }}>Penyidik Pembina</div>
                    </td>
                    <td style={{ width: '33%', verticalAlign: 'top' }}>
                      <div>Klien / Tersangka Penerima,</div>
                      <div style={{ height: '55px' }}></div>
                      <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{namaKlien}</div>
                      <div style={{ fontSize: '9pt' }}>Klien Terperiksa TAT</div>
                    </td>
                    <td style={{ width: '34%', verticalAlign: 'top' }}>
                      <div>Ketua Tim Asesmen Terpadu,</div>
                      <div style={{ height: '55px' }}></div>
                      <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                        KOMBES POL AHMAD RIFA'I, S.I.K.
                      </div>
                      <div style={{ fontSize: '9pt' }}>Ketua Tim TAT Kaltim</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Legal e-TAT */}
            <div
              style={{
                marginTop: '18px',
                paddingTop: '6px',
                borderTop: '0.8px solid #999',
                fontSize: '8pt',
                color: '#555',
                display: 'flex',
                justifyContent: 'space-between',
                pageBreakInside: 'avoid'
              }}
            >
              <span>Dokumen Resmi Kepolisian &amp; Badan Narkotika Nasional - Sistem e-TAT SIAP PULIH</span>
              <span style={{ fontFamily: 'monospace' }}>Kode Otentikasi: {p.trackingNumber || p.nomorPermohonan}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
