import React, { useState, useRef } from 'react';
import {
  Check,
  Info,
  BadgeCheck,
  Printer,
  Award,
  X,
} from 'lucide-react';
import type {
  PermohonanAsesmen,
  MonitoringTindakLanjut,
  AkhirLayananRehab,
  UserRole,
} from '../../types';
import { printLegalDocument } from '../../utils/printLegalDoc';
import { QrCodeImg, buildLacakVerificationUrl } from '../QrCodeComponent';
import { getKetuaTAT } from '../../utils/getKetuaTAT';
import {
  genId,
  today,
  SectionHeader,
  FieldGroup,
  type SaveConfirmInfo,
} from './shared';

export const AkhirLayananSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  permohonan: PermohonanAsesmen;
  userRole: UserRole;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
  onSaveSuccess?: (info: SaveConfirmInfo) => void;
}> = ({ monitoring, permohonan, userRole, readOnly, onUpdate, onSaveSuccess }) => {
  const existing = monitoring.akhirLayanan;
  const [showCertPreview, setShowCertPreview] = useState(false);
  const sksrPrintRef = useRef<HTMLDivElement>(null);
  const ketuaInfo = getKetuaTAT(null, permohonan);

  const [form, setForm] = useState<Partial<AkhirLayananRehab>>(existing ?? {
    tanggalAkhirLayananAktual: today(),
    statusAkhir: 'selesai_program',
    hasilSesuaiDokumenFasilitas: 'Terperiksa menyelesaikan seluruh tahapan terapi rehabilitasi dengan evaluasi Pulih & Produktif.',
    namaFasilitas: monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehabilitasi BNN Tanah Merah',
    pihakPenerbitKeterangan: permohonan.timAsesmen?.asesorMedisNama || 'Tim Medis TAT',
    diisiOleh: '',
    kapasitasPengisi: '',
    tanggalDiisi: today(),
  });

  const setF = (k: keyof AkhirLayananRehab, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.hasilSesuaiDokumenFasilitas) return;
    const saved: AkhirLayananRehab = {
      id: existing?.id ?? genId(),
      tanggalAkhirLayananAktual: form.tanggalAkhirLayananAktual!,
      hasilSesuaiDokumenFasilitas: form.hasilSesuaiDokumenFasilitas!,
      statusAkhir: form.statusAkhir!,
      namaFasilitas: form.namaFasilitas!,
      pihakPenerbitKeterangan: form.pihakPenerbitKeterangan ?? 'Tim Medis TAT',
      fileSuratAkhirLayananUrl: form.fileSuratAkhirLayananUrl || 'internal://surat-selesai-rehab',
      diisiOleh: userRole,
      kapasitasPengisi: 'Dokter / DPJP',
      tanggalDiisi: today(),
      statusVerifikasiAdmin: 'terverifikasi',
    };
    onUpdate({ ...monitoring, akhirLayanan: saved, statusMonitoring: 'selesai', terakhirDiperbarui: today() });
    onSaveSuccess?.({
      title: 'Output Surat SKSR Difinalkan',
      description: 'Surat Keterangan Selesai Rehabilitasi (SKSR) telah disimpan dan status monitoring tindak lanjut dinyatakan selesai.',
    });
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Award className="w-4 h-4 text-slate-300" />}
        title="4. Output Resmi: Surat Keterangan Selesai Rehabilitasi (SKSR)"
        subtitle="Pengeluaran resmi hasil rehabilitasi, kelulusan, hasil uji toksikologi, dan rekomendasi status hukum."
      />

      {readOnly && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Mode Hanya Baca (Read-Only): Finalisasi Output Surat SKSR dilakukan oleh Tim Medis / Admin. Pengaju dapat meninjau &amp; mencetak SKSR.</span>
        </div>
      )}

      {/* Output Document Preview & Action Card */}
      <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-slate-300" />
              <h4 className="text-sm font-semibold text-slate-100">Surat Keterangan Selesai Rehabilitasi (SKSR) e-TAT</h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Dokumen resmi ber-QR Code untuk kelengkapan berkas penyidikan &amp; peradilan.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCertPreview(!showCertPreview)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>{showCertPreview ? 'Tutup Surat' : 'Pratinjau & Cetak SKSR'}</span>
            </button>
          </div>
        </div>

        {/* Modal Pratinjau & Cetak SKSR Resmi */}
        {showCertPreview && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}
          >
            <div
              className="bg-[#0b172a] border border-[#1b3459] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: '96vh' }}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1b3459] shrink-0">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-[#d4af37]">📄</span>
                    Surat Keterangan Selesai Rehabilitasi (SKSR)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Nomor: SKSR/TAT/2026/09/{permohonan.id.slice(-4)} &bull; Klien: {permohonan.terperiksa?.namaLengkap || '-'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => printLegalDocument(sksrPrintRef.current?.innerHTML)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak / Export PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCertPreview(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
                <div
                  ref={sksrPrintRef}
                  className="bg-white text-black p-8 sm:p-12 rounded-lg shadow-2xl mx-auto"
                  style={{
                    maxWidth: '810px',
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: '11pt',
                    lineHeight: '1.45',
                    color: '#000'
                  }}
                >
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
                            Balai Besar Rehabilitasi BNN &bull; Kepolisian Daerah Kalimantan Timur
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
                      SURAT KETERANGAN SELESAI REHABILITASI (SKSR)
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                      Nomor: SKSR/TAT/2026/09/{permohonan.id.slice(-4)}
                    </div>
                  </div>

                  <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                    Ketua Tim Asesmen Terpadu (TAT) berdasarkan evaluasi klinis tim dokter pemeriksa dan pemantauan penegak hukum menerangkan dengan sebenarnya bahwa:
                  </p>

                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5pt' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                        <td style={{ width: '185px', verticalAlign: 'top' }}>Nama Terperiksa</td>
                        <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td style={{ fontWeight: 'bold' }}>{permohonan.terperiksa.namaLengkap || (permohonan.terperiksa as any).namaTerperiksa}</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>2.</td>
                        <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{permohonan.terperiksa.nik || '-'} / {permohonan.terperiksa.usia} Tahun</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>3.</td>
                        <td style={{ verticalAlign: 'top' }}>Instansi Pengaju</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{permohonan.instansiPengaju}</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>4.</td>
                        <td style={{ verticalAlign: 'top' }}>Fasilitas Rehabilitasi</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{monitoring.pelaksanaanRehab?.namaFasilitasTujuan || 'Balai Rehab BNN Tanah Merah'}</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>5.</td>
                        <td style={{ verticalAlign: 'top' }}>Dokter DPJP Medis</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                        <td>{monitoring.pelaksanaanRehab?.namaPenanggungJawabFasilitas || 'Tim Medis TAT'}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ margin: '12px 0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginBottom: '4px', textDecoration: 'underline' }}>
                      HASIL EVALUASI KLINIS &amp; KEHADIRAN:
                    </div>
                    <p style={{ textAlign: 'justify', marginBottom: '6px' }}>
                      {form.hasilSesuaiDokumenFasilitas}
                    </p>
                    <div style={{ border: '1.5px solid #166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: '4px' }}>
                      <span style={{ color: '#166534', fontWeight: 'bold' }}>✓ Status Toksikologi: BEBAS ZAT NARKOTIKA (NEGATIF)</span>
                      <span style={{ marginLeft: '14px', fontWeight: 'bold', color: '#14532d' }}>&bull; Predikat: PULIH &amp; PRODUKTIF</span>
                    </div>
                  </div>

                  <div style={{ margin: '12px 0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginBottom: '4px', textDecoration: 'underline' }}>
                      REKOMENDASI STATUS HUKUM:
                    </div>
                    <p style={{ textAlign: 'justify' }}>
                      Tersangka telah menyelesaikan seluruh kewajiban rehabilitasi medis dan sosial secara penuh dan tertib. Surat keterangan ini diterbitkan secara sah untuk dilampirkan sebagai kelengkapan pembelaan / pertimbangan vonis Majelis Hakim (Pasal 103 UU No. 35/2009) atau dasar penghentian penuntutan / penyidikan Keadilan Restoratif (Restorative Justice).
                    </p>
                  </div>

                  <div className="ttd-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '28px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                    <div style={{ textAlign: 'center', width: '30%' }}>
                      <div style={{ display: 'inline-block', border: '1px solid #888', padding: '4px 6px', borderRadius: '4px', background: '#fafafa' }}>
                        <QrCodeImg value={buildLacakVerificationUrl(permohonan, 'pleno')} size={68} alt="QR Verifikasi SKSR" />
                        <p style={{ fontSize: '7pt', fontFamily: 'monospace', color: '#444', margin: '2px 0 0 0' }}>
                          e-TAT QR Code Sah
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', width: '45%' }}>
                      <div>
                        <p style={{ fontSize: '9pt', color: '#333', margin: 0 }}>Samarinda, {today()}</p>
                        <p style={{ fontWeight: 'bold', fontSize: '10.5pt', margin: '2px 0 0 0' }}>Ketua Tim Asesmen Terpadu (TAT)</p>
                      </div>
                      <div style={{ height: '55px' }}></div>
                      <div>
                        <p style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10.5pt', margin: 0 }}>{ketuaInfo.nama}</p>
                        <p style={{ fontSize: '9pt', color: '#444', margin: 0 }}>
                          {ketuaInfo.nrp ? `${ketuaInfo.nrp.length > 10 ? 'NIP' : 'NRP'}. ${ketuaInfo.nrp}` : ketuaInfo.jabatan}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Form for Output Generation */}
        {!readOnly && (
          <div className="space-y-3 pt-1">
            <FieldGroup label="Ringkasan Hasil Evaluasi Selesai Rehabilitasi" required>
              <textarea className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:border-slate-600 outline-none" rows={3} value={form.hasilSesuaiDokumenFasilitas ?? ''} onChange={e => setF('hasilSesuaiDokumenFasilitas', e.target.value)} />
            </FieldGroup>
            <button className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all" onClick={handleSave}>
              <Check className="w-3.5 h-3.5 text-emerald-300" /> Simpan &amp; Finalkan Output Surat SKSR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
