import React, { useState, useRef } from 'react';
import {
  Building2,
  FileText,
  Edit3,
  Check,
  ExternalLink,
  Info,
  Printer,
  X,
} from 'lucide-react';
import type {
  PermohonanAsesmen,
  MonitoringTindakLanjut,
  PelaksanaanRehab,
  UserRole,
} from '../../types';
import { printLegalDocument } from '../../utils/printLegalDoc';
import { QrCodeImg, buildLacakVerificationUrl } from '../QrCodeComponent';
import {
  genId,
  today,
  STATUS_PELAKSANAAN_LABELS,
  SectionHeader,
  InfoBadge,
  FieldGroup,
  type SaveConfirmInfo,
} from './shared';

export const PelaksanaanRehabSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  permohonan: PermohonanAsesmen;
  userRole: UserRole;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
  onSaveSuccess?: (info: SaveConfirmInfo) => void;
}> = ({ monitoring, permohonan, userRole, readOnly, onUpdate, onSaveSuccess }) => {
  const existing = monitoring.pelaksanaanRehab;
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>(!existing && !readOnly ? 'new' : 'view');
  const canEdit = !readOnly && ['PENGAJU', 'ADMIN', 'SEKRETARIAT'].includes((userRole || '').toUpperCase());
  const [showBaModal, setShowBaModal] = useState(false);
  const baPrintRef = useRef<HTMLDivElement>(null);

  const handlePrintBa = () => {
    printLegalDocument(baPrintRef.current?.innerHTML);
  };

  const [form, setForm] = useState<Partial<PelaksanaanRehab>>(existing ?? {
    adaKendala: false,
    statusPelaksanaan: 'serah_terima_selesai',
    tanggalKoordinasiPenerimaan: today(),
    diisiOleh: '',
    kapasitasPengisi: '',
    tanggalDiisi: today(),
  });

  const handleSave = () => {
    if (!form.namaFasilitasTujuan || !form.hasilKoordinasiPenerimaan) return;
    const saved: PelaksanaanRehab = {
      id: existing?.id ?? genId(),
      nomorRekomendasiTAT: form.nomorRekomendasiTAT ?? monitoring.nomorRekomendasi,
      jenisLayananSesuaiRekomendasi: form.jenisLayananSesuaiRekomendasi ?? '',
      namaFasilitasTujuan: form.namaFasilitasTujuan!,
      alamatFasilitas: form.alamatFasilitas ?? '',
      kontakPenanggungJawabFasilitas: form.kontakPenanggungJawabFasilitas ?? '',
      namaPenanggungJawabFasilitas: form.namaPenanggungJawabFasilitas ?? '',
      tanggalKoordinasiPenerimaan: form.tanggalKoordinasiPenerimaan ?? today(),
      hasilKoordinasiPenerimaan: form.hasilKoordinasiPenerimaan!,
      catatanKoordinasi: form.catatanKoordinasi,
      tanggalSerahTerimaAktual: form.tanggalSerahTerimaAktual,
      identitasPihakMenyerahkan: form.identitasPihakMenyerahkan,
      identitasPihakMenerima: form.identitasPihakMenerima,
      fileBaSerahTerimaUrl: form.fileBaSerahTerimaUrl,
      tanggalMasukLayananTerkonfirmasi: form.tanggalMasukLayananTerkonfirmasi,
      adaKendala: form.adaKendala ?? false,
      kendala: form.kendala,
      perbedaanDariRekomendasi: form.perbedaanDariRekomendasi,
      statusPelaksanaan: form.statusPelaksanaan ?? 'serah_terima_selesai',
      diisiOleh: form.diisiOleh ?? '',
      kapasitasPengisi: form.kapasitasPengisi ?? '',
      tanggalDiisi: form.tanggalDiisi ?? today(),
      statusVerifikasiAdmin: 'terverifikasi',
      diverifikasiOleh: 'Sekretariat TAT'
    };
    onUpdate({ ...monitoring, pelaksanaanRehab: saved, terakhirDiperbarui: today() });
    setMode('view');
    onSaveSuccess?.({
      title: 'Admisi & Serah Terima (Laporan Ke-1) Tersimpan',
      description: 'Data admisi dan serah terima tersangka untuk Laporan Ke-1 telah disimpan. Tahap selanjutnya diteruskan ke Tim Medis untuk input Rekam Medis & Tes Urin (Laporan Ke-1).',
      nextTab: 'laporan',
      nextStepLabel: 'Lanjut ke Tab 2: Rekam Medis (Laporan Ke-1)',
    });
  };

  const setF = (key: keyof PelaksanaanRehab, val: unknown) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Building2 className="w-4 h-4 text-slate-300" />}
        title="1. Input Admisi & Serah Terima Rehabilitasi (Input Pengaju)"
        subtitle="Diisi oleh Pengaju (Polsek/Polres) atau Admin untuk mencatat serah terima tersangka ke fasilitas rehabilitasi dan meneruskan ke Tim Medis."
      />

      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#091529] border border-[#1b3459] text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md font-mono font-bold bg-[#144782] text-white border border-sky-400/30">
            Laporan Ke-1 (Admisi Awal)
          </span>
          <span className="text-slate-300">
            {existing
              ? 'Admisi & Serah Terima selesai — diteruskan ke Tim Medis (Laporan Ke-1).'
              : 'Tahap awal sebelum Tim Medis menginput Rekam Medis & Tes Urin (Laporan Ke-1).'}
          </span>
        </div>
      </div>

      {readOnly && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Mode Hanya Baca (Read-Only): Tahap Admisi &amp; Serah Terima diinput oleh Pengaju (Polsek/Polres) atau Admin.</span>
        </div>
      )}

      {!existing && readOnly ? (
        <div className="p-8 text-center bg-[#081224] border border-[#1b3459] rounded-xl text-xs text-slate-400 space-y-1.5">
          <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">Menunggu Input Admisi &amp; Serah Terima dari Pengaju</p>
          <p>Pengaju (Polsek/Polres) belum mengonfirmasi serah terima tersangka ke fasilitas rehabilitasi.</p>
        </div>
      ) : (mode === 'view' && existing) ? (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Fasilitas Tujuan</span>
              <span className="text-xs font-semibold text-slate-100 mt-1 block">{existing.namaFasilitasTujuan}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Jenis Layanan Medis</span>
              <span className="text-xs text-slate-200 mt-1 block">{existing.jenisLayananSesuaiRekomendasi || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Dokter / DPJP Penanggung Jawab</span>
              <span className="text-xs text-slate-200 mt-1 block">{existing.namaPenanggungJawabFasilitas || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Kontak Darurat / Telepon</span>
              <span className="text-xs font-mono text-slate-300 mt-1 block">{existing.kontakPenanggungJawabFasilitas || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Koordinasi</span>
              <span className="text-xs text-slate-300 mt-1 block font-mono">{existing.tanggalKoordinasiPenerimaan}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Serah Terima</span>
              <span className="text-xs text-slate-300 mt-1 block font-mono">{existing.tanggalSerahTerimaAktual || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Tgl Mulai Program</span>
              <span className="text-xs text-emerald-400 font-medium mt-1 block font-mono">{existing.tanggalMasukLayananTerkonfirmasi || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">Penyidik Menyerahkan</span>
              <span className="text-xs text-slate-300 mt-1 block">{existing.identitasPihakMenyerahkan || '—'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <InfoBadge label={STATUS_PELAKSANAAN_LABELS[existing.statusPelaksanaan]} color="green" />
            <InfoBadge label="✓ Terverifikasi Sekretariat & Tim Medis" color="slate" />
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-slate-400 block uppercase text-[10px] tracking-wider">Hasil Koordinasi & Konfirmasi Admisi</span>
            <p className="text-xs text-slate-200">{existing.hasilKoordinasiPenerimaan}</p>
            {existing.catatanKoordinasi && <p className="text-slate-400 italic mt-1 text-xs">{existing.catatanKoordinasi}</p>}
          </div>

          {existing.fileBaSerahTerimaUrl && (
            <div className="flex items-center gap-2.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800 w-fit">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <button
                type="button"
                onClick={() => setShowBaModal(true)}
                className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Berita Acara (BA) Serah Terima Klien</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </button>
            </div>
          )}

          {/* MODAL PRATINJAU BERITA ACARA SERAH TERIMA */}
          {showBaModal && (
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
                      Berita Acara (BA) Serah Terima Klien Rehabilitasi
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Nomor: BA-ST/{permohonan.id?.slice(-4).toUpperCase() || '001'}/IX/2026/SATRESNARKOBA &bull; Klien: {permohonan.terperiksa?.namaLengkap || '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrintBa}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Cetak / Export PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBaModal(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Document Content Viewport */}
                <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
                  <div
                    ref={baPrintRef}
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
                              Satresnarkoba Polresta Samarinda &bull; Balai Rehabilitasi BNN Tanah Merah
                            </div>
                          </td>
                          <td style={{ width: '85px', verticalAlign: 'middle' }}></td>
                        </tr>
                      </tbody>
                    </table>
                    <hr style={{ border: 'none', borderTop: '2.5px solid #000', margin: '4px 0 1.5px 0' }} />
                    <hr style={{ border: 'none', borderTop: '0.8px solid #000', margin: '1.5px 0 14px 0' }} />

                    <div style={{ textAlign: 'center', margin: '12px 0 16px 0' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '12pt', textDecoration: 'underline' }}>
                        BERITA ACARA SERAH TERIMA TERSANGKA / KLIEN
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                        Nomor: BA-ST/{permohonan.id?.slice(-4).toUpperCase() || '001'}/IX/2026/SATRESNARKOBA
                      </div>
                    </div>

                    <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                      Pada hari ini, tanggal <strong>{existing.tanggalSerahTerimaAktual || today()}</strong>, bertempat di Kantor Tim Asesmen Terpadu (TAT) / Balai Rehabilitasi, kami yang bertanda tangan di bawah ini:
                    </p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '10.5pt' }}>
                      <tbody>
                        <tr>
                          <td colSpan={4} style={{ fontWeight: 'bold', paddingBottom: '4px', textDecoration: 'underline' }}>
                            I. PIHAK YANG MENYERAHKAN:
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                          <td style={{ width: '180px', verticalAlign: 'top' }}>Nama / Pangkat</td>
                          <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{existing.identitasPihakMenyerahkan || permohonan.perkara?.namaPenyidik || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>2.</td>
                          <td style={{ verticalAlign: 'top' }}>Instansi</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td>{permohonan.instansiPengaju || 'Satresnarkoba Polresta Samarinda'}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} style={{ fontWeight: 'bold', paddingTop: '8px', paddingBottom: '4px', textDecoration: 'underline' }}>
                            II. PIHAK YANG MENERIMA:
                          </td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>1.</td>
                          <td style={{ verticalAlign: 'top' }}>Nama / Dokter DPJP</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{existing.namaPenanggungJawabFasilitas || permohonan.timAsesmen?.asesorMedisNama || 'Tim Medis TAT'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>2.</td>
                          <td style={{ verticalAlign: 'top' }}>Fasilitas Rehabilitasi</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{existing.namaFasilitasTujuan}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} style={{ fontWeight: 'bold', paddingTop: '8px', paddingBottom: '4px', textDecoration: 'underline' }}>
                            III. IDENTITAS TERSANGKA / KLIEN YANG DISERAHKAN:
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: '25px', verticalAlign: 'top' }}>•</td>
                          <td style={{ width: '180px', verticalAlign: 'top' }}>Nama Klien</td>
                          <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{permohonan.terperiksa?.namaLengkap || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td>{permohonan.terperiksa?.nik || '-'} / {permohonan.terperiksa?.usia || '-'} Tahun</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>No. Laporan Polisi</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontFamily: 'monospace' }}>{permohonan.perkara?.nomorLaporanPolisi || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>Rekomendasi TAT</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold', color: '#166534' }}>{existing.jenisLayananSesuaiRekomendasi || 'Rehabilitasi Medis dan Sosial'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top' }}>•</td>
                          <td style={{ verticalAlign: 'top' }}>Status Serah Terima</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                          <td style={{ fontWeight: 'bold', color: '#166534' }}>✓ Selesai &amp; Memenuhi Syarat Admisi</td>
                        </tr>
                      </tbody>
                    </table>

                    <div style={{ border: '1.5px solid #000', padding: '8px 12px', marginBottom: '16px', background: '#fafafa' }}>
                      <strong style={{ display: 'block', marginBottom: '3px' }}>Catatan Admisi &amp; Koordinasi:</strong>
                      <p style={{ margin: 0, fontSize: '10pt', textAlign: 'justify' }}>
                        {existing.hasilKoordinasiPenerimaan || 'Persyaratan administratif awal dan hasil pemeriksaan toksikologi dinyatakan lengkap dan memenuhi kuota rekomendasi Tim TAT.'}
                      </p>
                    </div>

                    <p style={{ textAlign: 'justify', marginBottom: '18px' }}>
                      Demikian Berita Acara Serah Terima Tersangka/Klien ini dibuat dengan sebenarnya atas kekuatan sumpah jabatan untuk dapat dipergunakan sebagaimana mestinya.
                    </p>

                    {/* Tanda Tangan */}
                    <div className="ttd-section" style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10pt' }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '38%', verticalAlign: 'top' }}>
                              <p style={{ margin: 0 }}>Yang Menyerahkan (Pihak I),</p>
                              <div style={{ height: '65px' }}></div>
                              <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                                {existing.identitasPihakMenyerahkan?.split('(')[0]?.trim() || permohonan.perkara?.namaPenyidik || 'Penyidik Pengaju'}
                              </p>
                              <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Penyidik Pembantu Satresnarkoba</p>
                            </td>

                            <td style={{ width: '24%', verticalAlign: 'middle', textAlign: 'center' }}>
                              <div style={{ display: 'inline-block', border: '1px solid #888', padding: '4px 6px', borderRadius: '4px', background: '#fafafa' }}>
                                <QrCodeImg value={buildLacakVerificationUrl(permohonan, 'pleno')} size={64} alt="QR Verifikasi BA" />
                                <div style={{ fontSize: '7pt', fontFamily: 'monospace', color: '#444', marginTop: '2px' }}>
                                  e-TAT SIAP PULIH
                                </div>
                              </div>
                            </td>

                            <td style={{ width: '38%', verticalAlign: 'top' }}>
                              <p style={{ margin: 0 }}>Yang Menerima (Pihak II),</p>
                              <div style={{ height: '65px' }}></div>
                              <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                                {existing.namaPenanggungJawabFasilitas || 'Tim Medis TAT'}
                              </p>
                              <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Dokter Penanggung Jawab Pasien (DPJP)</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {canEdit && (
            <button className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700/80 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" onClick={() => setMode('edit')}>
              <Edit3 className="w-3.5 h-3.5 text-sky-400" /> Edit Input Admisi &amp; Serah Terima
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldGroup label="Nomor Rekomendasi TAT" required>
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" value={form.nomorRekomendasiTAT ?? monitoring.nomorRekomendasi} onChange={e => setF('nomorRekomendasiTAT', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Jenis Layanan Sesuai Rekomendasi Medis" required hint="Salin dari Surat Rekomendasi TAT">
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" placeholder="contoh: Rehabilitasi Rawat Inap 3 Bulan" value={form.jenisLayananSesuaiRekomendasi ?? ''} onChange={e => setF('jenisLayananSesuaiRekomendasi', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Nama Fasilitas Rehabilitasi Tujuan" required>
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" placeholder="Nama Klinik / Balai Rehab BNN" value={form.namaFasilitasTujuan ?? ''} onChange={e => setF('namaFasilitasTujuan', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Nama Dokter / DPJP Penanggung Jawab" required>
              <input className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none" placeholder="Nama Dokter Spesialis Jiwa / Konselor" value={form.namaPenanggungJawabFasilitas ?? ''} onChange={e => setF('namaPenanggungJawabFasilitas', e.target.value)} />
            </FieldGroup>
          </div>

          <FieldGroup label="Hasil Koordinasi & Konfirmasi Admisi Medis" required>
            <textarea className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-slate-600 outline-none resize-y" rows={2} value={form.hasilKoordinasiPenerimaan ?? ''} onChange={e => setF('hasilKoordinasiPenerimaan', e.target.value)} />
          </FieldGroup>

          <div className="flex flex-wrap gap-2 pt-2">
            <button className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 font-semibold rounded-lg text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer" onClick={handleSave}>
              <Check className="w-3.5 h-3.5 text-emerald-300" /> Simpan &amp; Konfirmasi ke Tim Medis
            </button>
            {mode === 'edit' && (
              <button className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium rounded-lg text-xs transition-all cursor-pointer" onClick={() => setMode('view')}>
                Batal
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
