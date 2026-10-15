import React, { useState } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
} from '../../types';
import {
  Stethoscope,
  Activity,
  Heart,
  Syringe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Save,
  Award,
  Sparkles,
  ShieldCheck,
  Calendar
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
    tekananDarah: (existingMedis as any)?.tekananDarah || '120/80',
    denyutNadi: (existingMedis as any)?.denyutNadi || '82',
    pernapasan: (existingMedis as any)?.pernapasan || '18',
    suhuTubuh: (existingMedis as any)?.suhuTubuh || '36.6',
    needleTracks: (existingMedis as any)?.needleTracks || 'tidak_ada',
    kondisiIntoksikasi: (existingMedis as any)?.kondisiIntoksikasi || 'stabil',
    komorbiditasMedis: existingMedis?.komorbiditasMedis || 'Tidak ditemukan penyakit penyerta berat.',
    skorInstrumen: existingMedis?.skorInstrumen || 28,
    tingkatRisikoInstrumen: existingMedis?.tingkatRisikoInstrumen || 'Tinggi (Ketergantungan)',
    diagnosisKlinisIcd: existingMedis?.diagnosisKlinisIcd || 'F15.2 (Sindrom Ketergantungan Stimulansia)',
    kebutuhanRawat: existingMedis?.kebutuhanRawat || 'Rawat Inap',
    durasiUsulanBulan: existingMedis?.durasiUsulanBulan || 3,
    fasilitasRujukan: (existingMedis as any)?.fasilitasRujukan || 'Balai Rehabilitasi BNN Tanah Merah',
    jenisZat: existingMedis?.riwayatZat?.[0]?.jenisZat || 'Metamfetamina (Sabu)',
    caraPakai: existingMedis?.riwayatZat?.[0]?.caraPakai || 'Dihisap (Bong)',
    frekuensi: existingMedis?.riwayatZat?.[0]?.frekuensi || '3-4x Seminggu',
    lamaPemakaianBulan: existingMedis?.riwayatZat?.[0]?.lamaPemakaianBulan || 12,
    terakhirPakai: existingMedis?.riwayatZat?.[0]?.terakhirPakai || '2 hari sebelum penangkapan',
    interpretasiKlinis: existingMedis?.interpretasiKlinis || 'Klien mengalami ketergantungan zat sedang-berat dengan indikasi penarikan (withdrawal). Memerlukan program rehabilitasi medis intensif.',
    catatanKhusus: existingMedis?.catatanKhusus || 'Siap dilanjutkan ke musyawarah Sidang Pleno TAT.',
  });

  const [urinTests, setUrinTests] = useState<Array<{ parameter: string; hasil: 'Positif' | 'Negatif' }>>(() => {
    if (existingMedis?.hasilUrin && existingMedis.hasilUrin.length > 0) {
      return existingMedis.hasilUrin;
    }
    return [
      { parameter: 'MET (Metamfetamina / Sabu)', hasil: 'Positif' },
      { parameter: 'AMP (Amfetamina)', hasil: 'Positif' },
      { parameter: 'THC (Ganja / Kanabis)', hasil: 'Negatif' },
      { parameter: 'BZO (Benzodiazepin)', hasil: 'Negatif' },
      { parameter: 'MOP (Morfin / Opiat)', hasil: 'Negatif' },
      { parameter: 'COC (Kokain)', hasil: 'Negatif' },
    ];
  });

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
      skorInstrumen: Number(form.skorInstrumen),
      tingkatRisikoInstrumen: form.tingkatRisikoInstrumen,
      diagnosisKlinisIcd: form.diagnosisKlinisIcd,
      komorbiditasMedis: form.komorbiditasMedis,
      kebutuhanRawat: form.kebutuhanRawat,
      durasiUsulanBulan: Number(form.durasiUsulanBulan),
      riwayatZat: [
        {
          jenisZat: form.jenisZat,
          caraPakai: form.caraPakai,
          frekuensi: form.frekuensi,
          lamaPemakaianBulan: Number(form.lamaPemakaianBulan),
          terakhirPakai: form.terakhirPakai,
        }
      ],
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
    };

    const updatedPermohonan: PermohonanAsesmen = {
      ...permohonan,
      asesmenMedis: updatedMedis as any,
      statusProsesUtama: isFinal
        ? (permohonan.asesmenHukum?.status === 'FINAL' ? 'siap_pleno' : 'medis_selesai')
        : permohonan.statusProsesUtama,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: now,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: isFinal ? 'Finalisasi Rekam Medis TAT' : 'Simpan Draf Rekam Medis',
          rincian: isFinal
            ? `Asesmen medis difinalisasi. Diagnosis: ${form.diagnosisKlinisIcd}, Usulan: ${form.kebutuhanRawat} (${form.durasiUsulanBulan} Bulan).`
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
          skorInstrumen: Number(form.skorInstrumen),
          tingkatRisikoInstrumen: form.tingkatRisikoInstrumen,
          diagnosisKlinisIcd: form.diagnosisKlinisIcd,
          kebutuhanRawat: form.kebutuhanRawat,
          durasiUsulanBulan: Number(form.durasiUsulanBulan),
          interpretasiKlinis: form.interpretasiKlinis,
          catatanKhusus: form.catatanKhusus,
          riwayatZat: [
            {
              jenisZat: form.jenisZat,
              caraPakai: form.caraPakai,
              frekuensi: form.frekuensi,
              lamaPemakaianBulan: Number(form.lamaPemakaianBulan),
              terakhirPakai: form.terakhirPakai,
            }
          ],
        };

        if (isFinal) {
          await asesmenMedisApi.finalisasi(permohonan.id, payload);
          setFeedback('Asesmen Medis Berhasil Difinalisasi & Disimpan di Database!');
        } else {
          await asesmenMedisApi.saveDraft(permohonan.id, payload);
          setFeedback('Draf Asesmen Medis Berhasil Disimpan di Database!');
        }
      } catch (err) {
        console.warn('Backend asesmenMedisApi notice:', err);
        setFeedback(isFinal ? 'Asesmen Medis disimpan secara lokal (Backend fallback).' : 'Draf tersimpan secara lokal.');
      }
    }

    setIsSaving(false);
    setTimeout(() => setFeedback(null), 4000);
  };

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
            <span>Rekam Medis & Pemeriksaan Toksikologi Klinis Terpadu</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Standar Pemeriksaan Medis TAT BNN/Kemenkes: Anamnesis riwayat adiksi, instrumen WHO ASSIST, skrining urin 6 parameter, dan rekomendasi pemulihan.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
            existingMedis?.status === 'FINAL'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {existingMedis?.status === 'FINAL' ? '✓ STATUS: FINAL' : 'STATUS: DRAF MEDIS'}
          </span>
        </div>
      </div>

      {/* 2-Columns: Vital Signs & Skrining Toksikologi Urin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tanda Vital Fisik */}
        <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1b3459]">
            <Heart className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tanda-Tanda Vital & Pemeriksaan Fisik</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Tekanan Darah</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.tekananDarah}
                onChange={e => setForm({ ...form, tekananDarah: e.target.value })}
                placeholder="120/80"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Denyut Nadi (/mnt)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.denyutNadi}
                onChange={e => setForm({ ...form, denyutNadi: e.target.value })}
                placeholder="80"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Pernapasan (/mnt)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.pernapasan}
                onChange={e => setForm({ ...form, pernapasan: e.target.value })}
                placeholder="18"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Suhu Tubuh (°C)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.suhuTubuh}
                onChange={e => setForm({ ...form, suhuTubuh: e.target.value })}
                placeholder="36.5"
                className="w-full p-2 bg-[#050e1c] border border-[#1b3459] rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500"
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
                <option value="stabil">Stabil (Sadar Penuh / Kompos Mentis)</option>
                <option value="intoksikasi_ringan">Intoksikasi Ringan</option>
                <option value="putus_zat">Gejala Putus Zat (Withdrawal / Sakau)</option>
                <option value="intoksikasi_akut">Intoksikasi Akut (Perlu Rujukan Darurat)</option>
              </select>
            </div>
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
                    : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                }`}
              >
                <span className="font-mono text-xs font-semibold">{t.parameter}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  t.hasil === 'Positif' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {t.hasil}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">
            * Klik pada baris di atas untuk mengubah parameter positif/negatif.
          </p>
        </div>
      </div>

      {/* Riwayat Pemakaian & Diagnosis ICD-10 */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1b3459]">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Anamnesis Adiksi & Diagnosis Klinis</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Zat Utama yang Digunakan:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.jenisZat}
              onChange={e => setForm({ ...form, jenisZat: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Metode & Frekuensi Penggunaan:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={`${form.caraPakai} - ${form.frekuensi}`}
              onChange={e => setForm({ ...form, caraPakai: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Lama Pemakaian (Bulan) & Terakhir Pakai:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={`${form.lamaPemakaianBulan} Bulan (Terakhir: ${form.terakhirPakai})`}
              onChange={e => setForm({ ...form, terakhirPakai: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Diagnosis Klinis ICD-10:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.diagnosisKlinisIcd}
              onChange={e => setForm({ ...form, diagnosisKlinisIcd: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white font-mono outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Tingkat Risiko & Skor Instrumen:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={`Skor WHO ASSIST: ${form.skorInstrumen} (${form.tingkatRisikoInstrumen})`}
              onChange={e => setForm({ ...form, tingkatRisikoInstrumen: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="text-xs pt-2">
          <label className="text-slate-400 font-semibold block mb-1">Interpretasi Klinis & Resume Medis:</label>
          <textarea
            rows={2}
            disabled={!canEdit}
            value={form.interpretasiKlinis}
            onChange={e => setForm({ ...form, interpretasiKlinis: e.target.value })}
            className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500 leading-relaxed"
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
              <option value="Rawat Inap">Rehabilitasi Medis Rawat Inap (Balai / RS)</option>
              <option value="Rawat Jalan">Rehabilitasi Medis Rawat Jalan (Kontrol Berkala)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Durasi Usulan Program:</label>
            <select
              disabled={!canEdit}
              value={form.durasiUsulanBulan}
              onChange={e => setForm({ ...form, durasiUsulanBulan: Number(e.target.value) })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            >
              <option value={3}>3 (Tiga) Bulan Program Intensif</option>
              <option value={6}>6 (Enam) Bulan Program Lanjutan</option>
              <option value={1}>1 Bulan Detoksifikasi & Stabilisasi</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Fasilitas Rujukan Rekomendasi:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.fasilitasRujukan}
              onChange={e => setForm({ ...form, fasilitasRujukan: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-emerald-500"
            />
          </div>
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
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{isSaving ? 'Menyimpan...' : 'Finalisasi Asesmen Medis'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
