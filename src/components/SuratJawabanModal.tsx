import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { PermohonanAsesmen } from '../types';

interface SuratJawabanModalProps {
  permohonan: PermohonanAsesmen;
  onClose: () => void;
}

export const SuratJawabanModal: React.FC<SuratJawabanModalProps> = ({ permohonan, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const p = permohonan;
  const pk = p.perkara;
  const tr = p.terperiksa;

  const nomorSuratJawaban = (p as any).suratJawaban?.nomor
    || `B/${(p.nomorPermohonan || 'TAT').replace(/[^a-zA-Z0-9]/g, '')}/${new Date().getMonth() + 1}/${new Date().getFullYear()}/TAT`;

  const rawTanggal = (p as any).suratJawaban?.tanggal || p.tanggalPengajuan || new Date().toISOString().split('T')[0];
  const dateObj = new Date(rawTanggal);
  const tanggalSurat = isNaN(dateObj.getTime())
    ? new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const instansiPenyidik = pk?.instansiPenyidik || p.instansiPengaju || 'Satuan Reserse Narkoba Polres Metro';
  const namaPenyidik = pk?.namaPenyidik || p.pengajuNama || 'Kepala Satuan Reserse Narkoba';
  const pangkatPenyidik = (pk as any)?.pangkatPenyidik || 'AKP';

  const nomorSuratPenyidik = pk?.nomorLp || pk?.nomorSpdp || p.nomorPermohonan || 'B/..../..../Resnarkoba';
  const rawTanggalPenyidik = pk?.tanggalLp || p.tanggalPengajuan || '2026-10-01';
  const datePenyidik = new Date(rawTanggalPenyidik);
  const tanggalSuratPenyidik = isNaN(datePenyidik.getTime())
    ? '01 Oktober 2026'
    : datePenyidik.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const namaTersangka = tr?.namaLengkap || p.tersangkaNama || 'Tersangka';
  const nikTersangka = tr?.nik || '-';
  const pasalDisangkakan = pk?.pasalDisangkakan || (pk as any)?.pasalDipersangkakan || 'Pasal 127 ayat (1) huruf a UU RI No. 35 Tahun 2009';

  const statusBerkas = p.applicationStatus === 'NEEDS_CORRECTION' ? 'perlu_perbaikan' : 'diterima';

  const ketuaNama = (p.sidangPleno?.pimpinanPleno || p.timAsesmen?.sekretariatNama || 'Kompol Hendra Kusuma, S.I.K., M.Si.').replace(/\[TEST\]\s*/gi, '').trim();
  const ketuaNip = '79080512';
  const ketuaJabatan = 'Sekretariat Tim Asesmen Terpadu (TAT)';
  const instansiBNNP = 'Kalimantan Timur';
  const kotaTAT = 'Samarinda';

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win || !printRef.current) return;
    const printContents = printRef.current.innerHTML;
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
        .container { width: 100%; max-width: 800px; margin: 0 auto; position: relative; }
        p { text-align: justify; margin-bottom: 7px; }
        table { border-collapse: collapse; width: 100%; }
        ol, ul { margin-left: 24px; margin-bottom: 7px; }
        li { text-align: justify; margin-bottom: 4px; }
      </style></head><body><div class="container">${printContents}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
        style={{ maxHeight: '96vh' }}>

        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#d4af37]">📨</span>
              Surat Jawaban Permohonan Asesmen Terpadu (TAT)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              No: {nomorSuratJawaban} &bull; Tersangka: {namaTersangka}
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
            {/* KOP SURAT */}
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
                  <td style={{ width: '90px', verticalAlign: 'middle' }}></td>
                </tr>
              </tbody>
            </table>
            <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
            <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

            {/* NOMOR, LAMPIRAN, PERIHAL */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '11.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '120px', verticalAlign: 'top' }}>Nomor</td>
                  <td style={{ width: '14px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{nomorSuratJawaban}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>Lampiran</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>1 (satu) berkas</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>Hal / Perihal</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {statusBerkas === 'diterima'
                      ? 'Jawaban Penerimaan Permohonan Asesmen Terpadu (TAT)'
                      : 'Jawaban Pengembalian Berkas Permohonan Asesmen Terpadu (TAT) untuk Diperbaiki'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* KOTA & TANGGAL */}
            <div style={{ textAlign: 'right', marginBottom: '16px', fontSize: '11.5pt' }}>
              {kotaTAT}, {tanggalSurat}
            </div>

            {/* KEPADA */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '18px', fontSize: '11.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '120px', verticalAlign: 'top' }}>Kepada Yth.</td>
                  <td style={{ width: '14px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>Kepala {instansiPenyidik}</div>
                    <div>u.p. {pangkatPenyidik} {namaPenyidik}</div>
                    <div>di —</div>
                    <div style={{ fontWeight: 'bold' }}>Tempat</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* PEMBUKA */}
            <p style={{ textAlign: 'justify', marginBottom: '12px' }}>
              Menindaklanjuti surat Saudara Nomor: <strong>{nomorSuratPenyidik}</strong> tanggal{' '}
              <strong>{tanggalSuratPenyidik}</strong> perihal Permohonan Asesmen Terpadu atas nama tersangka{' '}
              <strong>{namaTersangka}</strong> (NIK: <span style={{ fontFamily: 'monospace' }}>{nikTersangka}</span>){' '}
              yang disangka melanggar <strong>{pasalDisangkakan}</strong>, bersama ini kami sampaikan hal-hal sebagai berikut:
            </p>

            {statusBerkas === 'diterima' ? (
              <ol style={{ marginLeft: '24px', marginBottom: '14px', lineHeight: '1.75' }}>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Setelah dilakukan pemeriksaan terhadap kelengkapan dan keabsahan berkas permohonan yang Saudara ajukan, Tim Sekretariat Asesmen Terpadu (TAT) <strong>BNNP {instansiBNNP}</strong> menyatakan bahwa berkas persyaratan formil telah <strong>lengkap dan memenuhi syarat</strong> sebagaimana diatur dalam Peraturan Bersama 7 Kementerian/Lembaga Tahun 2014 tentang Penanganan Pecandu Narkotika dan Korban Penyalahgunaan Narkotika ke dalam Lembaga Rehabilitasi.
                </li>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Dengan demikian, permohonan asesmen terpadu atas nama tersangka <strong>{namaTersangka}</strong> tersebut <strong>diterima</strong> dan akan diproses lebih lanjut oleh Tim Asesmen Terpadu (TAT) yang terdiri dari Tim Medis dan Tim Hukum lintas instansi.
                </li>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Jadwal pemeriksaan tersangka dan pelaksanaan sidang pleno TAT akan dikoordinasikan lebih lanjut dan akan disampaikan melalui surat pemberitahuan resmi berikutnya.
                </li>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Selama proses asesmen berlangsung, tersangka tetap menjadi tanggung jawab instansi pemohon dan harus siap dihadirkan sesuai jadwal yang telah ditetapkan.
                </li>
              </ol>
            ) : (
              <ol style={{ marginLeft: '24px', marginBottom: '14px', lineHeight: '1.75' }}>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Setelah dilakukan pemeriksaan terhadap kelengkapan berkas permohonan yang Saudara ajukan, Tim Sekretariat Asesmen Terpadu (TAT) <strong>BNNP {instansiBNNP}</strong> menyatakan bahwa berkas persyaratan formil <strong>belum lengkap dan/atau terdapat kekurangan</strong> yang harus segera dipenuhi.
                </li>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Berkas permohonan asesmen terpadu atas nama tersangka <strong>{namaTersangka}</strong> tersebut <strong>dikembalikan</strong> kepada Saudara untuk dilengkapi dan diperbaiki sesuai dengan persyaratan yang berlaku.
                </li>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Permohonan dapat diajukan kembali setelah seluruh kekurangan berkas dipenuhi, disertai surat pengantar baru yang mencantumkan referensi surat ini.
                </li>
                <li style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Apabila Saudara memerlukan penjelasan lebih lanjut, dapat menghubungi Sekretariat TAT BNNP {instansiBNNP} pada hari dan jam kerja.
                </li>
              </ol>
            )}

            <p style={{ textAlign: 'justify', marginBottom: '20px' }}>
              Demikian surat jawaban ini kami sampaikan untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerja sama Saudara, kami ucapkan terima kasih.
            </p>

            {/* TANDA TANGAN */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '11.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '58%' }}></td>
                  <td style={{ width: '42%', textAlign: 'center' }}>
                    <div>{ketuaJabatan},</div>
                    <div><strong>BNNP {instansiBNNP}</strong></div>
                    <div style={{ height: '72px' }}></div>
                    <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{ketuaNama}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10pt' }}>NIP. {ketuaNip}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* TEMBUSAN */}
            <div style={{ marginTop: '28px', borderTop: '1px solid #888', paddingTop: '10px', fontSize: '10.5pt' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tembusan:</div>
              <ol style={{ marginLeft: '20px', lineHeight: '1.7' }}>
                <li>Kepala BNNP {instansiBNNP} (sebagai laporan);</li>
                <li>Ketua Tim Asesmen Terpadu BNNP {instansiBNNP};</li>
                <li>Arsip.</li>
              </ol>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '5px', borderTop: '0.5px solid #ccc', fontSize: '8pt', color: '#555', textAlign: 'center' }}>
              Ref. Permohonan e-TAT: {p.nomorPermohonan} &nbsp;|&nbsp; Sistem Informasi e-TAT SIAP PULIH — BNNP Kalimantan Timur
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
