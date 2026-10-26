import React, { useState, useEffect } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
} from '../../types';
import {
  Stethoscope,
  Activity,
  Heart,
  Syringe,
  Building2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck
} from 'lucide-react';
import { asesmenMedisApi } from '../../services/api';
import { isSuspectExaminedByMedis } from '../../utils/medisAuth';

interface TabAsesmenMedisProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  effectiveReadonly: boolean;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onNavigateTab: (tab: any) => void;
}

const defaultUrinTests: Array<{ parameter: string; hasil: 'Positif' | 'Negatif' }> = [
  { parameter: 'MET (Metamfetamina / Sabu)', hasil: 'Negatif' },
  { parameter: 'AMP (Amfetamina)', hasil: 'Negatif' },
  { parameter: 'THC (Ganja / Kanabis)', hasil: 'Negatif' },
  { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' },
  { parameter: 'MOP (Morfin / Opiat)', hasil: 'Negatif' },
  { parameter: 'COC (Kokain)', hasil: 'Negatif' },
];

export const TabAsesmenMedis: React.FC<TabAsesmenMedisProps> = ({
  permohonan,
  currentUser,
  effectiveReadonly,
  onUpdatePermohonan,
  onNavigateTab,
}) => {
  const isMedisRole = currentUser.role?.toUpperCase() === 'MEDIS';
  const isMedisAuthorized = isMedisRole ? isSuspectExaminedByMedis(permohonan, currentUser) : true;
  const canEdit = !effectiveReadonly && (currentUser.role === 'admin' || currentUser.role === 'ADMIN' || isMedisAuthorized);

  const existingMedis = permohonan.asesmenMedis;

  const [form, setForm] = useState({
    tekananDarah: existingMedis?.tekananDarah || '',
    denyutNadi: existingMedis?.denyutNadi || '',
    pernapasan: (existingMedis as any)?.pernapasan || '',
    suhuTubuh: (existingMedis as any)?.suhuTubuh || '',
    needleTracks: (existingMedis as any)?.needleTracks || '',
    kondisiIntoksikasi: (existingMedis as any)?.kondisiIntoksikasi || '',
    komorbiditasMedis: existingMedis?.komorbiditasMedis || '',
    skorInstrumen: existingMedis?.skorInstrumen ?? '',
    tingkatRisikoInstrumen: existingMedis?.tingkatRisikoInstrumen || '',
    diagnosisKlinisIcd: existingMedis?.diagnosisKlinisIcd || '',
    kebutuhanRawat: existingMedis?.kebutuhanRawat || '',
    durasiUsulanBulan: existingMedis?.durasiUsulanBulan ?? '',
    fasilitasRujukan: (existingMedis as any)?.fasilitasRujukan || '',
    jenisZat: existingMedis?.riwayatZat?.[0]?.jenisZat || '',
    caraPakai: existingMedis?.riwayatZat?.[0]?.caraPakai || '',
    frekuensi: existingMedis?.riwayatZat?.[0]?.frekuensi || '',
    lamaPemakaianBulan: existingMedis?.riwayatZat?.[0]?.lamaPemakaianBulan ?? '',
    terakhirPakai: existingMedis?.riwayatZat?.[0]?.terakhirPakai || '',
    interpretasiKlinis: existingMedis?.interpretasiKlinis || '',
    catatanKhusus: existingMedis?.catatanKhusus || '',
  });

  const [urinTests, setUrinTests] = useState<Array<{ parameter: string; hasil: 'Positif' | 'Negatif' }>>(() => {
    if (existingMedis?.hasilUrin && existingMedis.hasilUrin.length > 0) {
      return existingMedis.hasilUrin;
    }
    return defaultUrinTests;
  });

  // Sinkronisasi form jika data asesmenMedis dari backend diperbarui
  useEffect(() => {
    if (permohonan.asesmenMedis) {
      const m = permohonan.asesmenMedis;
      setForm({
        tekananDarah: m.tekananDarah || '',
        denyutNadi: m.denyutNadi || '',
        pernapasan: (m as any).pernapasan || '',
        suhuTubuh: (m as any).suhuTubuh || '',
        needleTracks: (m as any).needleTracks || '',
        kondisiIntoksikasi: (m as any).kondisiIntoksikasi || '',
        komorbiditasMedis: m.komorbiditasMedis || '',
        skorInstrumen: m.skorInstrumen ?? '',
        tingkatRisikoInstrumen: m.tingkatRisikoInstrumen || '',
        diagnosisKlinisIcd: m.diagnosisKlinisIcd || '',
        kebutuhanRawat: m.kebutuhanRawat || '',
        durasiUsulanBulan: m.durasiUsulanBulan ?? '',
        fasilitasRujukan: (m as any).fasilitasRujukan || '',
        jenisZat: m.riwayatZat?.[0]?.jenisZat || '',
        caraPakai: m.riwayatZat?.[0]?.caraPakai || '',
        frekuensi: m.riwayatZat?.[0]?.frekuensi || '',
        lamaPemakaianBulan: m.riwayatZat?.[0]?.lamaPemakaianBulan ?? '',
        terakhirPakai: m.riwayatZat?.[0]?.terakhirPakai || '',
        interpretasiKlinis: m.interpretasiKlinis || '',
        catatanKhusus: m.catatanKhusus || '',
      });
      if (m.hasilUrin && m.hasilUrin.length > 0) {
        setUrinTests(m.hasilUrin);
      }
    }
  }, [permohonan.asesmenMedis]);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleUrin = (index: number) => {
    if (!canEdit) return;
    setUrinTests(prev => prev.map((item, idx) => (
      idx === index ? { ...item, hasil: item.hasil === 'Positif' ? 'Negatif' : 'Positif' } : item
    )));
  };

  const handleSave = async (isFinal: boolean) => {
    setIsSaving(true);
    const now = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const updatedMedis = {
      ...existingMedis,
      status: (isFinal ? 'FINAL' : 'DRAFT') as any,
      asesorNama: currentUser.name,
      skorInstrumen: form.skorInstrumen !== '' ? Number(form.skorInstrumen) : undefined,
      tingkatRisikoInstrumen: form.tingkatRisikoInstrumen,
      diagnosisKlinisIcd: form.diagnosisKlinisIcd,
      komorbiditasMedis: form.komorbiditasMedis,
      kebutuhanRawat: form.kebutuhanRawat,
      durasiUsulanBulan: form.durasiUsulanBulan !== '' ? Number(form.durasiUsulanBulan) : undefined,
      riwayatZat: form.jenisZat ? [
        {
          jenisZat: form.jenisZat,
          caraPakai: form.caraPakai || 'Hisap',
          frekuensi: form.frekuensi || 'Setiap Hari',
          lamaPemakaianBulan: form.lamaPemakaianBulan !== '' ? Number(form.lamaPemakaianBulan) : 0,
          terakhirPakai: form.terakhirPakai,
        }
      ] : [],
      hasilUrin: urinTests,
      interpretasiKlinis: form.interpretasiKlinis,
      catatanKhusus: form.catatanKhusus,
      tekananDarah: form.tekananDarah,
      denyutNadi: form.denyutNadi,
      pernapasan: form.pernapasan,
      suhuTubuh: form.suhuTubuh,
      needleTracks: form.needleTracks,
      kondisiIntoksikasi: form.kondisiIntoksikasi,
      fasilitasRujukan: form.fasilitasRujukan,
      terakhirDiperbarui: new Date().toISOString(),
    };

    const targetHukum = permohonan.timAsesmen?.asesorHukumNama || 'Penelaah Hukum TAT';

    const updatedPermohonan: PermohonanAsesmen = {
      ...permohonan,
      asesmenMedis: updatedMedis as any,
      medicalStatus: isFinal ? 'FINAL' : (permohonan.medicalStatus === 'NOT_STARTED' ? 'DRAFT' : permohonan.medicalStatus),
      statusProsesUtama: isFinal
        ? (permohonan.asesmenHukum?.status === 'FINAL' ? 'siap_pleno' : 'telaah_hukum')
        : permohonan.statusProsesUtama,
      timAsesmen: {
        ...(permohonan.timAsesmen as any),
        dikirimKeHukum: isFinal ? true : permohonan.timAsesmen?.dikirimKeHukum,
        tanggalKirimHukum: isFinal ? now : permohonan.timAsesmen?.tanggalKirimHukum,
      },
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: now,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: isFinal ? 'Finalisasi Rekam Medis & Teruskan ke Hukum' : 'Simpan Draf Rekam Medis',
          rincian: isFinal
            ? `Asesmen medis difinalisasi oleh ${currentUser.name}. Berkas secara otomatis diteruskan kepada Penelaah Hukum (${targetHukum}).`
            : `Draf medis diperbarui oleh ${currentUser.name}.`
        },
        ...(permohonan.auditLogs || [])
      ]
    };

    onUpdatePermohonan(updatedPermohonan);

    // Sync to backend AsesmenMedis API
    if (permohonan.id) {
      try {
        const payload = {
          tekananDarah: form.tekananDarah,
          denyutNadi: form.denyutNadi,
          pernapasan: form.pernapasan,
          suhuTubuh: form.suhuTubuh,
          needleTracks: form.needleTracks,
          kondisiIntoksikasi: form.kondisiIntoksikasi,
          komorbiditasMedis: form.komorbiditasMedis,
          skorInstrumen: form.skorInstrumen !== '' ? Number(form.skorInstrumen) : undefined,
          tingkatRisikoInstrumen: form.tingkatRisikoInstrumen,
          diagnosisKlinisIcd: form.diagnosisKlinisIcd,
          kebutuhanRawat: form.kebutuhanRawat,
          durasiUsulanBulan: form.durasiUsulanBulan !== '' ? Number(form.durasiUsulanBulan) : undefined,
          fasilitasRujukan: form.fasilitasRujukan,
          interpretasiKlinis: form.interpretasiKlinis,
          catatanKhusus: form.catatanKhusus,
          riwayatZat: form.jenisZat ? [
            {
              jenisZat: form.jenisZat,
              caraPakai: form.caraPakai || 'Hisap',
              frekuensi: form.frekuensi || 'Setiap Hari',
              lamaPemakaianBulan: form.lamaPemakaianBulan !== '' ? Number(form.lamaPemakaianBulan) : 0,
              terakhirPakai: form.terakhirPakai,
            }
          ] : [],
          hasilUrin: urinTests,
        };

        if (isFinal) {
          await asesmenMedisApi.finalisasi(permohonan.id, payload);
          setFeedback(`Asesmen Medis Berhasil Difinalisasi! Berkas diteruskan ke Penelaah Hukum: ${targetHukum}.`);
          setTimeout(() => {
            onNavigateTab('hukum');
          }, 1200);
        } else {
          await asesmenMedisApi.saveDraft(permohonan.id, payload);
          setFeedback('Draf Asesmen Medis Berhasil Disimpan di Server!');
        }
      } catch (err: any) {
        console.warn('Backend asesmenMedisApi notice:', err);
        setFeedback(isFinal 
          ? `Asesmen Medis disimpan (Lokal). Berkas diteruskan ke Penelaah Hukum: ${targetHukum}.`
          : 'Draf tersimpan secara lokal.');
        if (isFinal) {
          setTimeout(() => {
            onNavigateTab('hukum');
          }, 1200);
        }
      }
    }

    setIsSaving(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const isFormEmpty = !form.tekananDarah && !form.diagnosisKlinisIcd && !form.jenisZat;

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Role Authorization Alert */}
      {isMedisRole && !isMedisAuthorized && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Akses Terbatas:</strong> Anda bukan dokter pemeriksa yang ditugaskan untuk tersangka ini. Anda melihat berkas dalam mode baca (Read-only).
          </span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span>Rekam Medis &amp; Pemeriksaan Toksikologi Klinis Terpadu</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Standar Pemeriksaan Medis TAT BNN/Kemenkes: Anamnesis riwayat adiksi, instrumen WHO ASSIST, skrining urin 6 parameter, dan rekomendasi pemulihan.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {existingMedis?.asesorNama && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-2 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Oleh: <strong className="text-slate-200">{existingMedis.asesorNama}</strong></span>
            </span>
          )}
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
            existingMedis?.status === 'FINAL'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : isFormEmpty
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {existingMedis?.status === 'FINAL' ? '✓ STATUS: FINAL' : isFormEmpty ? 'BELUM DIISI' : 'STATUS: DRAF MEDIS'}
          </span>
        </div>
      </div>

      {/* 2-Columns: Vital Signs & Skrining Toksikologi Urin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tanda Vital Fisik */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1b3459]">
            <Heart className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tanda-Tanda Vital &amp; Pemeriksaan Fisik</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Tekanan Darah</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.tekananDarah}
                onChange={e => setForm({ ...form, tekananDarah: e.target.value })}
                placeholder="cth: 120/80"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Denyut Nadi (/mnt)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.denyutNadi}
                onChange={e => setForm({ ...form, denyutNadi: e.target.value })}
                placeholder="cth: 80"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Pernapasan (/mnt)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.pernapasan}
                onChange={e => setForm({ ...form, pernapasan: e.target.value })}
                placeholder="cth: 18"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Suhu Tubuh (°C)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.suhuTubuh}
                onChange={e => setForm({ ...form, suhuTubuh: e.target.value })}
                placeholder="cth: 36.5"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500 placeholder-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Bekas Suntikan (Needle Tracks)</label>
              <select
                disabled={!canEdit}
                value={form.needleTracks}
                onChange={e => setForm({ ...form, needleTracks: e.target.value })}
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white text-xs outline-none focus:border-emerald-500"
              >
                <option value="">-- Belum Diperiksa / Pilih --</option>
                <option value="tidak_ada">Tidak Ada Bekas Suntikan</option>
                <option value="ada_lama">Ada (Bekas Luka Lama / Inaktif)</option>
                <option value="ada_baru">Ada (Bekas Suntikan Baru / Aktif)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Status Intoksikasi Saat Ini</label>
              <select
                disabled={!canEdit}
                value={form.kondisiIntoksikasi}
                onChange={e => setForm({ ...form, kondisiIntoksikasi: e.target.value })}
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white text-xs outline-none focus:border-emerald-500"
              >
                <option value="">-- Belum Diperiksa / Pilih --</option>
                <option value="stabil">Stabil (Sadar Penuh / Kompos Mentis)</option>
                <option value="intoksikasi_ringan">Intoksikasi Ringan</option>
                <option value="putus_zat">Gejala Putus Zat (Withdrawal / Sakau)</option>
                <option value="intoksikasi_akut">Intoksikasi Akut (Perlu Rujukan Darurat)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Komorbiditas / Penyakit Penyerta Medis</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.komorbiditasMedis}
              onChange={e => setForm({ ...form, komorbiditasMedis: e.target.value })}
              placeholder="cth: Tidak ada komorbiditas / Hepatitis B / HIV / Hipertensi"
              className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white text-xs outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>
        </div>

        {/* Panel Toksikologi Urin 6 Parameter */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1b3459]">
            <div className="flex items-center space-x-2">
              <Syringe className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hasil Skrining Urin Multi-Panel (6 Parameter)</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Standar Puslabfor Polri</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {urinTests.map((t, idx) => (
              <div
                key={idx}
                onClick={() => toggleUrin(idx)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  t.hasil === 'Positif'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : 'bg-[#050e1c] border-[#1b3459] text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="font-mono text-xs font-semibold">{t.parameter}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  t.hasil === 'Positif' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {t.hasil}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">
            * Klik pada baris parameter di atas untuk mengubah status Positif / Negatif.
          </p>
        </div>
      </div>

      {/* Riwayat Pemakaian & Diagnosis ICD-10 */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1b3459]">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Anamnesis Adiksi &amp; Diagnosis Klinis</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Zat Utama yang Digunakan:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.jenisZat}
              onChange={e => setForm({ ...form, jenisZat: e.target.value })}
              placeholder="cth: Metamfetamina (Sabu)"
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Cara Pakai &amp; Frekuensi:</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                disabled={!canEdit}
                value={form.caraPakai}
                onChange={e => setForm({ ...form, caraPakai: e.target.value })}
                placeholder="Cara (Hisap/Suntik)"
                className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600"
              />
              <input
                type="text"
                disabled={!canEdit}
                value={form.frekuensi}
                onChange={e => setForm({ ...form, frekuensi: e.target.value })}
                placeholder="Frekuensi (cth: 3x/mgg)"
                className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600"
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Lama Pemakaian &amp; Terakhir Pakai:</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                disabled={!canEdit}
                value={form.lamaPemakaianBulan}
                onChange={e => setForm({ ...form, lamaPemakaianBulan: e.target.value })}
                placeholder="Durasi (bulan)"
                className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600"
              />
              <input
                type="text"
                disabled={!canEdit}
                value={form.terakhirPakai}
                onChange={e => setForm({ ...form, terakhirPakai: e.target.value })}
                placeholder="Terakhir pakai (hari)"
                className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Diagnosis Klinis ICD-10:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.diagnosisKlinisIcd}
              onChange={e => setForm({ ...form, diagnosisKlinisIcd: e.target.value })}
              placeholder="cth: F15.2 (Sindrom Ketergantungan Stimulansia)"
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white font-mono outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Skor Instrumen (ASSIST):</label>
            <input
              type="number"
              disabled={!canEdit}
              value={form.skorInstrumen}
              onChange={e => setForm({ ...form, skorInstrumen: e.target.value })}
              placeholder="cth: 28"
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Tingkat Risiko:</label>
            <select
              disabled={!canEdit}
              value={form.tingkatRisikoInstrumen}
              onChange={e => setForm({ ...form, tingkatRisikoInstrumen: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            >
              <option value="">-- Pilih Tingkat Risiko --</option>
              <option value="Rendah">Rendah (Penyalahgunaan Eksperimental)</option>
              <option value="Sedang">Sedang (Penyalahgunaan Teratur / Berisiko)</option>
              <option value="Tinggi (Ketergantungan)">Tinggi (Ketergantungan Berat)</option>
            </select>
          </div>
        </div>

        <div className="text-xs pt-2">
          <label className="text-slate-400 font-semibold block mb-1">Interpretasi Klinis &amp; Resume Medis:</label>
          <textarea
            rows={2}
            disabled={!canEdit}
            value={form.interpretasiKlinis}
            onChange={e => setForm({ ...form, interpretasiKlinis: e.target.value })}
            placeholder="Tuliskan interpretasi kondisi fisik, gejala ketergantungan, komplikasi, dan pertimbangan klinis..."
            className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 leading-relaxed placeholder-slate-600"
          />
        </div>
      </div>

      {/* Usulan Modalitas & Fasilitas Rujukan */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1b3459]">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Usulan Rekomendasi Medis ke Sidang Pleno</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Modalitas Rehabilitasi Usulan:</label>
            <select
              disabled={!canEdit}
              value={form.kebutuhanRawat}
              onChange={e => setForm({ ...form, kebutuhanRawat: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            >
              <option value="">-- Pilih Modalitas Usulan --</option>
              <option value="Rawat Inap">Rehabilitasi Medis Rawat Inap (Balai / RS)</option>
              <option value="Rawat Jalan">Rehabilitasi Medis Rawat Jalan (Kontrol Berkala)</option>
              <option value="Detoksifikasi Medis Darurat">Detoksifikasi Medis Darurat</option>
              <option value="Tidak Memerlukan Rawat">Tidak Memerlukan Rawat</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Durasi Usulan Program:</label>
            <select
              disabled={!canEdit}
              value={form.durasiUsulanBulan}
              onChange={e => setForm({ ...form, durasiUsulanBulan: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            >
              <option value="">-- Pilih Durasi --</option>
              <option value={1}>1 Bulan Detoksifikasi &amp; Stabilisasi</option>
              <option value={3}>3 (Tiga) Bulan Program Intensif</option>
              <option value={6}>6 (Enam) Bulan Program Lanjutan</option>
              <option value={12}>12 Bulan Program Komprehensif</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Fasilitas Rujukan Rekomendasi:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.fasilitasRujukan}
              onChange={e => setForm({ ...form, fasilitasRujukan: e.target.value })}
              placeholder="cth: Balai Rehabilitasi BNN Tanah Merah"
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-400 font-semibold block mb-1 text-xs">Catatan Khusus Dokter Asesor:</label>
          <input
            type="text"
            disabled={!canEdit}
            value={form.catatanKhusus}
            onChange={e => setForm({ ...form, catatanKhusus: e.target.value })}
            placeholder="Catatan tambahan untuk pembahasan pada Sidang Pleno TAT..."
            className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 placeholder-slate-600 text-xs"
          />
        </div>

        {canEdit && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#1b3459]">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(false)}
              className="px-4 py-2.5 bg-[#142642] hover:bg-[#1a345a] text-slate-200 border border-[#234475] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-sky-400" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Draf Medis'}</span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{isSaving ? 'Menyimpan...' : 'Finalisasi &amp; Teruskan ke Tim Hukum'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
