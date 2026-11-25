import React, { useState, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  Plus,
  Calendar,
  ExternalLink,
  Info,
  CheckSquare,
  Printer,
  BadgeAlert,
  X,
} from 'lucide-react';
import type {
  PermohonanAsesmen,
  MonitoringTindakLanjut,
  LaporanKontrol,
  BuktiWajibLapor,
  UserRole,
} from '../../types';
import { LembarKendaliModal } from '../LembarKendaliModal';
import { printLegalDocument } from '../../utils/printLegalDoc';
import { QrCodeImg, buildLacakVerificationUrl } from '../QrCodeComponent';
import {
  genId,
  today,
  SectionHeader,
  InfoBadge,
  FieldGroup,
  type SaveConfirmInfo,
} from './shared';

export const WajibLaporSection: React.FC<{
  monitoring: MonitoringTindakLanjut;
  permohonan: PermohonanAsesmen;
  userRole: UserRole;
  readOnly?: boolean;
  onUpdate: (updated: MonitoringTindakLanjut) => void;
  onSaveSuccess?: (info: SaveConfirmInfo) => void;
}> = ({ monitoring, permohonan, userRole, readOnly, onUpdate, onSaveSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'aktual' | 'rencana'>('aktual');
  const [showSpModal, setShowSpModal] = useState(false);
  const [selectedWlBuktiModal, setSelectedWlBuktiModal] = useState<BuktiWajibLapor | null>(null);
  const [showLembarKendaliModal, setShowLembarKendaliModal] = useState(false);
  const wlPrintRef = useRef<HTMLDivElement>(null);

  const handlePrintWl = () => {
    printLegalDocument(wlPrintRef.current?.innerHTML);
  };

  const [spTingkat, setSpTingkat] = useState('SP-1 (Peringatan Awal)');
  const [spAlasan, setSpAlasan] = useState('Terlambat melaksanakan wajib lapor lebih dari 3 hari kerja tanpa konfirmasi.');

  const [form, setForm] = useState<Partial<BuktiWajibLapor>>({
    tanggalPelaporanAktual: today(),
    tanggalRencanaWajibLapor: today(),
    kanal: 'langsung',
    statusKonfirmasi: 'dikonfirmasi_penyidik',
    diunggahOleh: 'Penyidik / JPU Pengaju Berwenang',
    namaPenyidikPenerima: permohonan.perkara?.namaPenyidik || '',
    instansiPenyidik: permohonan.instansiPengaju || 'Satresnarkoba Polresta Samarinda',
    buktiPenerimaanUrl: 'internal://bukti-wajib-lapor-aktual'
  });

  const setF = (k: keyof BuktiWajibLapor, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSaveWajibLapor = () => {
    if (!form.namaPenyidikPenerima) return;

    const nowTimestamp = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\./g, ':') + ' WIB';

    const saved: BuktiWajibLapor = {
      id: genId(),
      tanggalRencanaWajibLapor: formMode === 'rencana' ? form.tanggalRencanaWajibLapor : form.tanggalRencanaWajibLapor,
      tanggalPelaporanAktual: formMode === 'aktual' ? form.tanggalPelaporanAktual : undefined,
      tanggalWajibLapor: formMode === 'aktual' ? (form.tanggalPelaporanAktual || today()) : (form.tanggalRencanaWajibLapor || today()),
      waktuInputSistem: nowTimestamp,
      namaPenyidikPenerima: form.namaPenyidikPenerima!,
      instansiPenyidik: form.instansiPenyidik || 'Satresnarkoba Polresta Samarinda',
      kegiatanRehabTerkait: formMode === 'aktual' ? 'Catatan Wajib Lapor Aktual (Telah Dilaksanakan)' : 'Rencana Jadwal Wajib Lapor',
      kanal: form.kanal || 'langsung',
      buktiPenerimaanUrl: form.buktiPenerimaanUrl,
      statusKonfirmasi: 'dikonfirmasi_penyidik',
      statusVerifikasiAdmin: 'belum_diperiksa',
      diunggahOleh: userRole === 'PENGAJU' ? 'Pengaju (Penyidik/JPU Berwenang)' : userRole,
      tanggalDiunggah: today(),
    };

    onUpdate({
      ...monitoring,
      buktiWajibLaporList: [saved, ...monitoring.buktiWajibLaporList],
      terakhirDiperbarui: today()
    });
    setShowForm(false);
    onSaveSuccess?.({
      title: formMode === 'aktual' ? 'Wajib Lapor Aktual Tersimpan' : 'Rencana Wajib Lapor Tersimpan',
      description: 'Catatan Jurnal Wajib Lapor telah berhasil disimpan ke sistem e-TAT.',
      nextTab: 'akhir',
      nextStepLabel: 'Lihat Tab 4: Output Surat SKSR',
    });
  };

  const handleVerifyAdmin = (wlId: string) => {
    const updatedList = monitoring.buktiWajibLaporList.map(wl => {
      if (wl.id === wlId) {
        return {
          ...wl,
          statusVerifikasiAdmin: 'terverifikasi' as const,
          catatanAdmin: 'Verified by Admin: Tanggal kejadian aktual & bukti penerimaan sah.'
        };
      }
      return wl;
    });

    onUpdate({
      ...monitoring,
      buktiWajibLaporList: updatedList,
      terakhirDiperbarui: today()
    });
  };

  const handleIssueSp = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpReport: LaporanKontrol = {
      id: genId(),
      jenisLaporan: 'Laporan Kejadian Khusus',
      tanggalKegiatanSebenarnya: today(),
      namaFasilitasPelapor: 'Penyidik / Tim Pengawas TAT',
      namaPenerbitLaporan: 'Sekretariat TAT / Penyidik',
      kapasitasPenerbit: 'Penyidik Narkoba / Pengawas',
      statusPelaksanaanBerdasarkanBukti: 'tidak_terlaksana',
      ringkasanAdministratif: `SURAT PERINGATAN (${spTingkat}): ${spAlasan}`,
      diunggahOleh: userRole,
      kapasitasPengunggah: 'Pengawas',
      tanggalDiunggah: today(),
      statusAdmin: 'perlu_klarifikasi',
      perluTelaahKlinis: false
    };

    onUpdate({
      ...monitoring,
      laporanKontrolList: [newSpReport, ...monitoring.laporanKontrolList],
      statusMonitoring: spTingkat.includes('SP-3') ? 'terkendala' : monitoring.statusMonitoring,
      terakhirDiperbarui: today()
    });
    setShowSpModal(false);
    onSaveSuccess?.({
      title: `Surat Peringatan (${spTingkat}) Diterbitkan`,
      description: 'Catatan Surat Peringatan (SP) telah disimpan dan tercatat dalam riwayat monitoring klien.',
    });
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<CheckSquare className="w-4 h-4 text-slate-300" />}
        title="3. Jurnal Pengawasan & Catatan Wajib Lapor Penyidik (Input Pengaju)"
        subtitle="Menu Pengaju (Penyidik/JPU Berwenang) untuk mencatat tanggal kejadian aktual wajib lapor setelah tersangka melapor."
      />

      {readOnly && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Mode Hanya Baca (Read-Only): Jurnal Wajib Lapor diisi oleh Pengaju (Polsek/Polres) atau Admin.</span>
        </div>
      )}

      {/* Notice Banner Rule JUKNIS */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Aturan Pengisian Wajib Lapor:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1 text-[11px]">
          <li>Pengaju (Penyidik/JPU) mengisi <strong>Tanggal Pelaporan Aktual</strong> setelah wajib lapor terlaksana.</li>
          <li>Klien tidak perlu login. Seluruh pelaporan dicatat oleh Penyidik/JPU berwenang.</li>
          <li>Jika masih dalam tahap penjadwalan, gunakan menu <strong>Rencana Wajib Lapor</strong>.</li>
        </ul>
      </div>

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => { setShowForm(true); setFormMode('aktual'); }}
            className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-sky-200" />
            <span>Catat Pelaporan Aktual</span>
          </button>

          <button
            onClick={() => { setShowForm(true); setFormMode('rencana'); }}
            className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Buat Rencana Wajib Lapor</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLembarKendaliModal(true)}
            className="px-4 py-2 bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234b7d] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cetak Rekap Wajib Lapor</span>
          </button>

          <button
            onClick={() => setShowSpModal(true)}
            className="px-4 py-2 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer sm:ml-auto"
          >
            <BadgeAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Terbitkan SP</span>
          </button>
        </div>
      )}

      {showSpModal && (
        <form onSubmit={handleIssueSp} className="p-4 bg-slate-950/80 border border-rose-900/40 rounded-xl space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-2">
            <BadgeAlert className="w-3.5 h-3.5" /> Terbitkan Surat Peringatan Klien (SP)
          </h4>
          <FieldGroup label="Tingkat Surat Peringatan">
            <select className="w-full bg-slate-900 border border-rose-900/40 rounded-lg p-2 text-xs text-slate-100 outline-none" value={spTingkat} onChange={e => setSpTingkat(e.target.value)}>
              <option value="SP-1 (Peringatan Awal)">SP-1 (Peringatan Awal - Mangkir 1x)</option>
              <option value="SP-2 (Peringatan Keras)">SP-2 (Peringatan Keras - Mangkir 2x)</option>
              <option value="SP-3 (Pencabutan Hak RJ)">SP-3 (Terakhir - Usulan Pencabutan Hak Restoratif Justice)</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Alasan Penerbitan SP" required>
            <textarea className="w-full bg-slate-900 border border-rose-900/40 rounded-lg p-2 text-xs text-slate-100 outline-none" rows={2} value={spAlasan} onChange={e => setSpAlasan(e.target.value)} />
          </FieldGroup>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-medium cursor-pointer shadow-sm">Terbitkan SP</button>
            <button type="button" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer" onClick={() => setShowSpModal(false)}>Batal</button>
          </div>
        </form>
      )}

      {showForm && (
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              {formMode === 'aktual' ? 'Form Catatan Wajib Lapor (Pelaporan Aktual)' : 'Form Rencana Wajib Lapor'}
            </h4>
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${formMode === 'aktual' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setFormMode('aktual')}
              >
                Pelaporan Aktual
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${formMode === 'rencana' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setFormMode('rencana')}
              >
                Penjadwalan
              </button>
            </div>
          </div>

          {formMode === 'aktual' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Tanggal Pelaporan Aktual" required hint="Tanggal kedatangan terperiksa">
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-slate-600 outline-none"
                    value={form.tanggalPelaporanAktual ?? today()}
                    onChange={e => setF('tanggalPelaporanAktual', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Tanggal Rencana Semula (Opsional)" hint="Jadwal rencana sebelumnya jika ada">
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-slate-600 outline-none"
                    value={form.tanggalRencanaWajibLapor ?? ''}
                    onChange={e => setF('tanggalRencanaWajibLapor', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Penyidik / JPU Penerima" required>
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    placeholder="Nama & Pangkat Penyidik / JPU"
                    value={form.namaPenyidikPenerima ?? ''}
                    onChange={e => setF('namaPenyidikPenerima', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Instansi / Tempat Pelaporan" required>
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    value={form.instansiPenyidik ?? ''}
                    onChange={e => setF('instansiPenyidik', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Kanal Pelaporan" required>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    value={form.kanal ?? 'langsung'}
                    onChange={e => setF('kanal', e.target.value as any)}
                  >
                    <option value="langsung">Tatap Muka / Datang Langsung</option>
                    <option value="digital">Kanal Digital / Video Call</option>
                    <option value="surat">Surat Keterangan Fasilitas</option>
                    <option value="melalui_pengaju">Melalui Pendampingan</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="Bukti Pelaporan (Dokumen / Berkas)">
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    placeholder="URL Bukti Pelaporan (PDF/JPG)"
                    value={form.buktiPenerimaanUrl ?? ''}
                    onChange={e => setF('buktiPenerimaanUrl', e.target.value)}
                  />
                </FieldGroup>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldGroup label="Rencana Wajib Lapor (Target)" required>
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-slate-600 outline-none"
                    value={form.tanggalRencanaWajibLapor ?? today()}
                    onChange={e => setF('tanggalRencanaWajibLapor', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup label="Penyidik Target Penerima" required>
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                    value={form.namaPenyidikPenerima ?? ''}
                    onChange={e => setF('namaPenyidikPenerima', e.target.value)}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Instansi / Tempat Pelaporan">
                <input
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:border-slate-600 outline-none"
                  value={form.instansiPenyidik ?? ''}
                  onChange={e => setF('instansiPenyidik', e.target.value)}
                />
              </FieldGroup>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-[#144782] to-[#1c64b8] hover:from-[#17549c] hover:to-[#2272d1] text-white border border-sky-400/20 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              onClick={handleSaveWajibLapor}
            >
              ✓ Simpan Catatan Wajib Lapor
            </button>
            <button
              type="button"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-all cursor-pointer"
              onClick={() => setShowForm(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* List of Wajib Lapor Records */}
      <div className="space-y-2.5">
        {monitoring.buktiWajibLaporList.length === 0 ? (
          <div className="p-8 text-center bg-[#081224] border border-[#1b3459] rounded-xl text-xs text-slate-400 space-y-1.5">
            <CheckSquare className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="font-semibold text-slate-300">Belum Ada Catatan Wajib Lapor</p>
            <p className="text-[11px] text-slate-400">
              {readOnly
                ? 'Menunggu Pengaju (Polsek/Polres) mencatat pelaksanaan wajib lapor tersangka.'
                : 'Klik "Catat Pelaporan Aktual" atau "Buat Rencana Wajib Lapor" untuk mulai mencatat.'}
            </p>
          </div>
        ) : (
          monitoring.buktiWajibLaporList.map(wl => {
            const isAktualExist = Boolean(wl.tanggalPelaporanAktual);

            return (
              <div key={wl.id} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    {isAktualExist ? (
                      <InfoBadge label="✓ Pelaporan Aktual" color="green" />
                    ) : (
                      <InfoBadge label="📅 Rencana Wajib Lapor" color="amber" />
                    )}
                    {wl.statusVerifikasiAdmin === 'terverifikasi' ? (
                      <InfoBadge label="✓ Verified Admin" color="green" />
                    ) : (
                      <InfoBadge label="Belum Verifikasi" color="slate" />
                    )}
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-400">
                    <span className="text-slate-300 font-medium">{wl.waktuInputSistem || wl.tanggalDiunggah || 'Sistem e-TAT Logged'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Tanggal Aktual</span>
                    <span className={`font-mono text-xs mt-0.5 block ${isAktualExist ? 'text-emerald-400 font-medium' : 'text-slate-500 italic'}`}>
                      {wl.tanggalPelaporanAktual ? wl.tanggalPelaporanAktual : '— (Belum diisi)'}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Rencana Wajib Lapor</span>
                    <span className="font-mono text-slate-200 text-xs mt-0.5 block">
                      {wl.tanggalRencanaWajibLapor || wl.tanggalWajibLapor}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Penyidik Penerima</span>
                    <span className="text-slate-100 text-xs mt-0.5 block truncate">{wl.namaPenyidikPenerima}</span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Instansi &amp; Kanal</span>
                    <span className="text-slate-300 text-xs capitalize mt-0.5 block truncate">{wl.instansiPenyidik} ({wl.kanal})</span>
                  </div>
                </div>

                {/* Bukti & Admin Verification Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5 text-xs">
                  <div className="flex items-center gap-3">
                    {wl.buktiPenerimaanUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedWlBuktiModal(wl)}
                        className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Berkas Bukti <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400">Dicatat oleh: <strong className="text-slate-300 font-normal">{wl.diunggahOleh}</strong></span>
                  </div>

                  {userRole === 'ADMIN' && wl.statusVerifikasiAdmin !== 'terverifikasi' && (
                    <button
                      onClick={() => handleVerifyAdmin(wl.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verifikasi (Admin)
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL PRATINJAU BERKAS BUKTI WAJIB LAPOR */}
      {selectedWlBuktiModal && (
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
                  Surat Tanda Terima Pelaksanaan Wajib Lapor Klien
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nomor: TT-WL/{selectedWlBuktiModal.id.slice(-6).toUpperCase()}/TAT/2026 &bull; Klien: {permohonan.terperiksa?.namaLengkap || '-'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintWl}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0b172a] hover:bg-[#e8c84a] transition-colors cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak / Export PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWlBuktiModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132d54] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-900/60">
              <div
                ref={wlPrintRef}
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
                          Satuan Reserse Narkoba &bull; Pengawasan &amp; Pemantauan Klien e-TAT SIAP PULIH
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
                    SURAT TANDA TERIMA LAPOR DIRI (WAJIB LAPOR)
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '10.5pt', marginTop: '3px' }}>
                    Nomor: TT-WL/{selectedWlBuktiModal.id.slice(-6).toUpperCase()}/TAT/2026
                  </div>
                </div>

                <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                  Diterangkan dengan sebenarnya bahwa tersangka/klien di bawah ini telah hadir dan melaksanakan kewajiban lapor diri secara tertib dan berkala sesuai ketentuan rekomendasi Sidang Pleno Tim Asesmen Terpadu (TAT):
                </p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5pt' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '25px', verticalAlign: 'top' }}>1.</td>
                      <td style={{ width: '185px', verticalAlign: 'top' }}>Nama Tersangka / Klien</td>
                      <td style={{ width: '12px', textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontWeight: 'bold' }}>{permohonan.terperiksa?.namaLengkap || '-'} {permohonan.terperiksa?.alias ? `(Alias: ${permohonan.terperiksa.alias})` : ''}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>2.</td>
                      <td style={{ verticalAlign: 'top' }}>NIK / Usia</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{permohonan.terperiksa?.nik || '-'} / {permohonan.terperiksa?.usia || '-'} Tahun</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>3.</td>
                      <td style={{ verticalAlign: 'top' }}>Nomor Laporan Polisi</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontFamily: 'monospace' }}>{permohonan.perkara?.nomorLaporanPolisi || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>4.</td>
                      <td style={{ verticalAlign: 'top' }}>Tahap / Kegiatan</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{selectedWlBuktiModal.kegiatanRehabTerkait || 'Wajib Lapor Rutin Berkala'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>5.</td>
                      <td style={{ verticalAlign: 'top' }}>Tanggal Rencana Semula</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontFamily: 'monospace' }}>{selectedWlBuktiModal.tanggalRencanaWajibLapor || selectedWlBuktiModal.tanggalWajibLapor || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>6.</td>
                      <td style={{ verticalAlign: 'top' }}>Tanggal Pelaporan Aktual</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#166534' }}>
                        {selectedWlBuktiModal.tanggalPelaporanAktual} ({selectedWlBuktiModal.waktuInputSistem || 'Tepat Waktu'})
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>7.</td>
                      <td style={{ verticalAlign: 'top' }}>Kanal / Tempat Lapor</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{selectedWlBuktiModal.kanal === 'langsung' ? 'Tatap Muka Langsung di Kantor Satresnarkoba' : 'Kanal Digital e-TAT SIAP PULIH'}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>8.</td>
                      <td style={{ verticalAlign: 'top' }}>Penyidik Penerima Laporan</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td style={{ fontWeight: 'bold' }}>{selectedWlBuktiModal.namaPenyidikPenerima}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>9.</td>
                      <td style={{ verticalAlign: 'top' }}>Instansi Penerima</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>:</td>
                      <td>{selectedWlBuktiModal.instansiPenyidik}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ border: '1.5px solid #166534', padding: '8px 12px', marginBottom: '16px', background: '#f0fdf4' }}>
                  <strong style={{ color: '#166534', display: 'block', marginBottom: '3px' }}>
                    Status Pengawasan &amp; Catatan Petugas:
                  </strong>
                  <p style={{ margin: 0, fontSize: '10pt', color: '#14532d', textAlign: 'justify' }}>
                    {selectedWlBuktiModal.catatanAdmin || 'Kehadiran dan bukti fisik telah diperiksa serta divalidasi oleh Tim Sekretariat TAT dan Penyidik Pendamping. Klien mematuhi seluruh protokol pengawasan.'}
                  </p>
                </div>

                <p style={{ textAlign: 'justify', marginBottom: '18px' }}>
                  Demikian Surat Tanda Terima Wajib Lapor ini diterbitkan secara sah melalui Sistem Elektronik Tim Asesmen Terpadu (e-TAT SIAP PULIH) untuk menjadi bukti pemenuhan kewajiban hukum tersangka.
                </p>

                {/* Tanda Tangan */}
                <div className="ttd-section" style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10pt' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '38%', verticalAlign: 'top' }}>
                          <p style={{ margin: 0 }}>Tersangka / Klien yang Melapor,</p>
                          <div style={{ height: '65px' }}></div>
                          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                            {permohonan.terperiksa?.namaLengkap || 'Klien TAT'}
                          </p>
                          <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>Tanda Tangan Pelapor</p>
                        </td>

                        <td style={{ width: '24%', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'inline-block', border: '1px solid #888', padding: '4px 6px', borderRadius: '4px', background: '#fafafa' }}>
                            <QrCodeImg value={buildLacakVerificationUrl(permohonan, 'pleno')} size={64} alt="QR Verifikasi WL" />
                            <div style={{ fontSize: '7pt', fontFamily: 'monospace', color: '#444', marginTop: '2px' }}>
                              e-TAT SIAP PULIH
                            </div>
                          </div>
                        </td>

                        <td style={{ width: '38%', verticalAlign: 'top' }}>
                          <p style={{ margin: 0 }}>Penyidik Penerima Laporan,</p>
                          <div style={{ height: '65px' }}></div>
                          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                            {selectedWlBuktiModal.namaPenyidikPenerima?.split('(')[0] || 'Penyidik Satresnarkoba'}
                          </p>
                          <p style={{ fontSize: '8.5pt', color: '#333', margin: 0 }}>{selectedWlBuktiModal.instansiPenyidik || 'Satresnarkoba'}</p>
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

      {showLembarKendaliModal && (
        <LembarKendaliModal
          permohonan={permohonan}
          monitoring={monitoring}
          currentUser={userRole as any}
          onClose={() => setShowLembarKendaliModal(false)}
        />
      )}
    </div>
  );
};
