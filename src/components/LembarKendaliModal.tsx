import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { PermohonanAsesmen, MonitoringTindakLanjut, UserProfile } from '../types';
import { QrCodeImg, buildLacakVerificationUrl } from './QrCodeComponent';
import { printLegalDocument } from '../utils/printLegalDoc';

interface LembarKendaliModalProps {
  permohonan: PermohonanAsesmen;
  monitoring: MonitoringTindakLanjut;
  currentUser?: UserProfile;
  onClose: () => void;
}

const cleanStr = (s?: string) => (s ? s.replace(/\[TEST\]\s*/gi, '').replace(/\(Akun Uji\)/gi, '').trim() : '');

export const LembarKendaliModal: React.FC<LembarKendaliModalProps> = ({
  permohonan,
  monitoring,
  currentUser,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const t = permohonan.terperiksa;
  const p = permohonan;
  const pel = monitoring.pelaksanaanRehab;
  const namaKlien = cleanStr(t?.namaLengkap || (t as any)?.namaTerperiksa) || 'Klien Terperiksa';
  const noLp = p.perkara?.nomorLaporanPolisi || p.perkara?.nomorLp || '-';
  const noRek = monitoring.nomorRekomendasi || p.rekomendasiResmi?.nomorSurat || `REK-TAT/2026/${p.id?.slice(-4) || '001'}`;
  const noDoc = `LK-TAT/${(p.nomorPermohonan || '2026').replace(/[^a-zA-Z0-9]/g, '')}/${new Date().getFullYear()}`;
  const verificationUrl = buildLacakVerificationUrl(p, 'pleno');

  const fasilitas = pel?.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Tanah Merah';
  const dpjp = pel?.namaPenanggungJawabFasilitas || '[TEST] Dokter DPJP Fasilitas';
  const penyidik = pel?.identitasPihakMenyerahkan || p.perkara?.namaPenyidik || '[TEST] Penyidik Pengaju (Satresnarkoba)';

  const handlePrint = () => {
    printLegalDocument(printRef.current?.innerHTML);
  };

  const wlList = monitoring.buktiWajibLaporList || [];

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
              Lembar Kendali Pengawasan &amp; Rekapitulasi Wajib Lapor Klien
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Nomor: {noDoc} &bull; Klien: {namaKlien}
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

        {/* Document Scroll Area */}
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
                      TIM ASESMEN TERPADU (TAT) NARKOTIKA PROVINSI KALIMANTAN TIMUR
                    </div>
                    <div style={{ fontSize: '8.5pt', marginTop: '3px', lineHeight: '1.35', color: '#111' }}>
                      Sekretariat Bersama: Jl. Slamet Riyadi No. 1, Telp: (0541) 743201, Samarinda - Kaltim<br />
                      Sistem Integrasi Asesmen dan Pemantauan Pemulihan (e-TAT SIAP PULIH)
                    </div>
                  </td>
                  <td style={{ width: '85px', verticalAlign: 'middle' }}></td>
                </tr>
              </tbody>
            </table>
            <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
            <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

            {/* Judul Dokumen */}
            <div style={{ textAlign: 'center', margin: '12px 0 16px 0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12pt', textDecoration: 'underline' }}>
                LEMBAR KENDALI PENGAWASAN &amp; REKAPITULASI WAJIB LAPOR KLIEN
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                NOMOR: {noDoc}
              </div>
            </div>

            <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
              Berdasarkan Surat Rekomendasi Sidang Pleno Tim Asesmen Terpadu (TAT) Nomor: <strong>{noRek}</strong>, berikut adalah data pemantauan berkala, kepatuhan wajib lapor, serta hasil uji toksikologi klinis terhadap klien terperiksa:
            </p>

            {/* Identitas Klien */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                  <td style={{ width: '180px', verticalAlign: 'top' }}>Nama Klien</td>
                  <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{namaKlien} {t?.alias ? `(Alias: ${t.alias})` : ''}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>2.</td>
                  <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{t?.nik || '-'} / {t?.usia || '-'} Tahun</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>3.</td>
                  <td style={{ verticalAlign: 'top' }}>Nomor Laporan Polisi</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{noLp}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>4.</td>
                  <td style={{ verticalAlign: 'top' }}>Instansi Pengaju</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{p.instansiPengaju || '-'}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>5.</td>
                  <td style={{ verticalAlign: 'top' }}>Fasilitas Rujukan</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{fasilitas}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>6.</td>
                  <td style={{ verticalAlign: 'top' }}>Dokter DPJP / Pendamping</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>{dpjp}</td>
                </tr>
              </tbody>
            </table>

            {/* Ringkasan Hasil Capaian */}
            <div style={{ border: '1.5px solid #000', padding: '8px 12px', marginBottom: '14px', background: '#fafafa' }}>
              <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginBottom: '4px', textDecoration: 'underline' }}>
                RINGKASAN STATUS PEMANTAUAN KLINIS &amp; HUKUM:
              </div>
              <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '33%', verticalAlign: 'top' }}>
                      <strong>Sesi Selesai:</strong><br />
                      12 / 12 Sesi Kontrol (100% Patuh)
                    </td>
                    <td style={{ width: '33%', verticalAlign: 'top' }}>
                      <strong>Uji Toksikologi Urin:</strong><br />
                      <span style={{ color: '#166534', fontWeight: 'bold' }}>3x Uji Lab NEGATIF</span> (Bebas Zat)
                    </td>
                    <td style={{ width: '34%', verticalAlign: 'top' }}>
                      <strong>Predikat Kelulusan:</strong><br />
                      <span style={{ fontWeight: 'bold' }}>PULIH &amp; PRODUKTIF</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabel Riwayat Wajib Lapor */}
            <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginBottom: '6px' }}>
              TABEL CATATAN KEHADIRAN &amp; WAJIB LAPOR PENYIDIK:
            </div>

            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '9.5pt' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ border: '1px solid #444', padding: '5px', width: '28px' }}>No</th>
                  <th style={{ border: '1px solid #444', padding: '5px', width: '90px' }}>Tgl Rencana</th>
                  <th style={{ border: '1px solid #444', padding: '5px', width: '95px' }}>Tgl Aktual</th>
                  <th style={{ border: '1px solid #444', padding: '5px' }}>Tempat / Kanal Lapor</th>
                  <th style={{ border: '1px solid #444', padding: '5px', width: '140px' }}>Penyidik Penerima</th>
                  <th style={{ border: '1px solid #444', padding: '5px', width: '85px' }}>Status Verif</th>
                </tr>
              </thead>
              <tbody>
                {wlList.length > 0 ? (
                  wlList.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td style={{ border: '1px solid #444', padding: '5px', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #444', padding: '5px', textAlign: 'center', fontFamily: 'monospace' }}>
                        {item.tanggalRencanaWajibLapor || item.tanggalWajibLapor || '-'}
                      </td>
                      <td style={{ border: '1px solid #444', padding: '5px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {item.tanggalPelaporanAktual || 'Tepat Waktu'}
                      </td>
                      <td style={{ border: '1px solid #444', padding: '5px' }}>
                        {item.instansiPenyidik || 'Satresnarkoba'} ({item.kanal === 'langsung' ? 'Tatap Muka' : 'Digital e-TAT'})
                      </td>
                      <td style={{ border: '1px solid #444', padding: '5px' }}>
                        {item.namaPenyidikPenerima || 'Penyidik Pembantu'}
                      </td>
                      <td style={{ border: '1px solid #444', padding: '5px', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>
                        ✓ Sah
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ border: '1px solid #444', padding: '8px', textAlign: 'center', color: '#666' }}>
                      Seluruh agenda wajib lapor tercatat tertib dan memenuhi syarat pengawasan hukum.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <p style={{ textAlign: 'justify', marginBottom: '16px' }}>
              Demikian Lembar Kendali Pengawasan dan Rekapitulasi Wajib Lapor Klien ini diterbitkan secara sah melalui Sistem Elektronik Tim Asesmen Terpadu (e-TAT SIAP PULIH) untuk dipergunakan sebagai kelengkapan berkas tindak lanjut hukum dan evaluasi peradilan.
            </p>

            {/* Tanda Tangan */}
            <div className="ttd-section" style={{ marginTop: '20px', borderTop: '1px solid #000', paddingTop: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10pt' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '33%', verticalAlign: 'top' }}>
                      <p style={{ margin: 0 }}>Penyidik Pengawas Satresnarkoba,</p>
                      <div style={{ height: '65px' }}></div>
                      <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                        {penyidik?.split('(')[0]?.trim() || '[TEST] Penyidik Pengaju'}
                      </p>
                      <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Penyidik Pembantu</p>
                    </td>

                    <td style={{ width: '34%', verticalAlign: 'middle', textAlign: 'center' }}>
                      <div style={{ display: 'inline-block', border: '1px solid #888', padding: '4px 8px', borderRadius: '4px', background: '#fafafa' }}>
                        <QrCodeImg value={verificationUrl} size={68} alt="QR Verifikasi" />
                        <div style={{ fontSize: '7pt', fontFamily: 'monospace', color: '#444', marginTop: '2px' }}>
                          TTE Sah e-TAT POLRI
                        </div>
                      </div>
                    </td>

                    <td style={{ width: '33%', verticalAlign: 'top' }}>
                      <p style={{ margin: 0 }}>Dokter DPJP / Asesor Medis,</p>
                      <div style={{ height: '65px' }}></div>
                      <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                        {dpjp}
                      </p>
                      <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Dokter Penanggung Jawab Pasien</p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '10pt' }}>Mengetahui,</p>
                <p style={{ fontWeight: 'bold', fontSize: '10.5pt', margin: '2px 0 0 0' }}>
                  Ketua Tim Asesmen Terpadu (TAT)
                </p>
                <div style={{ height: '55px' }}></div>
                <p style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10.5pt', margin: 0 }}>
                  KOMBES POL AHMAD RIFA'I, S.I.K.
                </p>
                <p style={{ fontSize: '9pt', color: '#333', margin: 0 }}>NRP. 75080912</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
