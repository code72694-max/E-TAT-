import React, { useState } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
} from '../../types';
import {
  Scale,
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Save,
  Activity,
  Layers,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { asesmenHukumApi } from '../../services/api';

interface TabAsesmenHukumProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  effectiveReadonly: boolean;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onNavigateTab: (tab: any) => void;
}

export const TabAsesmenHukum: React.FC<TabAsesmenHukumProps> = ({
  permohonan,
  currentUser,
  effectiveReadonly,
  onUpdatePermohonan,
  onNavigateTab,
}) => {
  const isHukumRole = currentUser.role?.toUpperCase() === 'HUKUM';
  const canEdit = !effectiveReadonly && (currentUser.role === 'admin' || currentUser.role === 'ADMIN' || isHukumRole);

  const existingHukum = permohonan.asesmenHukum;
  const bbList = permohonan.perkara?.barangBuktiList || [];

  const [form, setForm] = useState({
    analisisPeran: existingHukum?.analisisPeran || 'Penyalahguna Murni untuk Diri Sendiri',
    analisisBarangBukti: existingHukum?.analisisBarangBukti || 'Barang bukti berada di bawah ambang batas gramatur pemakaian 1 hari sesuai SEMA 04/2010.',
    statusKeterlibatanJaringan: (existingHukum as any)?.statusKeterlibatanJaringan || 'Bukan bagian dari sindikat / peredaran gelap narkotika.',
    rekomendasiHukum: existingHukum?.rekomendasiHukum || 'Proses hukum diselesaikan melalui Rehabilitasi Medis dan Sosial',
    pertimbanganYuridis: (existingHukum as any)?.pertimbanganYuridis || 'Memenuhi ketentuan Pasal 54, 55, 103 UU No. 35/2009 dan Perber 2014.',
    catatanKhusus: existingHukum?.catatanKhusus || 'Dapat diproses untuk penetapan rehabilitasi dalam Sidang Pleno TAT.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = async (isFinal: boolean) => {
    setIsSaving(true);
    const now = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const updatedHukum = {
      ...existingHukum,
      status: (isFinal ? 'FINAL' : 'DRAFT') as any,
      asesorNama: currentUser.name,
      analisisPeran: form.analisisPeran,
      analisisBarangBukti: form.analisisBarangBukti,
      rekomendasiHukum: form.rekomendasiHukum,
      catatanKhusus: form.catatanKhusus,
      statusKeterlibatanJaringan: form.statusKeterlibatanJaringan,
      pertimbanganYuridis: form.pertimbanganYuridis,
    };

    const updatedPermohonan: PermohonanAsesmen = {
      ...permohonan,
      asesmenHukum: updatedHukum as any,
      statusProsesUtama: isFinal
        ? (permohonan.asesmenMedis?.status === 'FINAL' ? 'siap_pleno' : 'hukum_selesai')
        : permohonan.statusProsesUtama,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: now,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: isFinal ? 'Finalisasi Telaah Hukum TAT' : 'Simpan Draf Telaah Hukum',
          rincian: isFinal
            ? `Asesmen hukum difinalisasi. Rekomendasi: ${form.rekomendasiHukum}.`
            : `Draf telaah hukum diperbarui oleh ${currentUser.name}.`
        },
        ...(permohonan.auditLogs || [])
      ]
    };

    onUpdatePermohonan(updatedPermohonan);

    if (permohonan.id) {
      try {
        const payload = {
          analisisPeran: form.analisisPeran,
          analisisBarangBukti: form.analisisBarangBukti,
          rekomendasiHukum: form.rekomendasiHukum,
          catatanKhusus: form.catatanKhusus,
        };

        if (isFinal) {
          await asesmenHukumApi.finalisasi(permohonan.id, payload);
          setFeedback('Asesmen Hukum Berhasil Difinalisasi & Disimpan di Database!');
        } else {
          await asesmenHukumApi.saveDraft(permohonan.id, payload);
          setFeedback('Draf Asesmen Hukum Berhasil Disimpan di Database!');
        }
      } catch (err) {
        console.warn('Backend asesmenHukumApi notice:', err);
        setFeedback(isFinal ? 'Asesmen Hukum disimpan secara lokal (Backend fallback).' : 'Draf tersimpan secara lokal.');
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Penelaahan Hukum, Analisis Peran & Bukti Yuridis</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Kualifikasi peran tersangka berdasarkan SEMA 04/2010, uji ambang batas gramatur barang bukti, dan legalitas rekomendasi rehabilitasi.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
            existingHukum?.status === 'FINAL'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {existingHukum?.status === 'FINAL' ? '✓ STATUS: FINAL' : 'STATUS: DRAF HUKUM'}
          </span>
        </div>
      </div>

      {/* Barang Bukti & Kualifikasi SEMA Card */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1b3459]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Ambang Batas Barang Bukti Sitaan (SEMA RI No. 04/2010)
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Batas Shabu: ≤ 1.0 gr | Ganja: ≤ 5.0 gr</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#050e1c] border border-[#1b3459] rounded-xl space-y-2">
            <span className="text-slate-400 block font-semibold">Barang Bukti Sitaan Berdasarkan LP:</span>
            {bbList.length === 0 ? (
              <p className="text-slate-500 italic">Tidak ada barang bukti narkotika disita.</p>
            ) : (
              bbList.map((bb: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs pt-1 border-t border-[#1b3459]/50">
                  <span className="text-white font-medium">{bb.jenisZat}</span>
                  <span className="font-mono text-[#D4AF37] font-bold">{bb.beratBersihGram} Gram</span>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 font-semibold block">Uji Analisis Barang Bukti:</label>
            <textarea
              rows={3}
              disabled={!canEdit}
              value={form.analisisBarangBukti}
              onChange={e => setForm({ ...form, analisisBarangBukti: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-amber-500 leading-relaxed text-xs"
            />
          </div>
        </div>
      </div>

      {/* Analisis Peran & Status Jaringan */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1b3459]">
          <Shield className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kualifikasi Peran & Status Keterlibatan Jaringan</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Analisis Peran Tersangka (SEMA):</label>
            <select
              disabled={!canEdit}
              value={form.analisisPeran}
              onChange={e => setForm({ ...form, analisisPeran: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-amber-500"
            >
              <option value="Penyalahguna Murni untuk Diri Sendiri">Penyalahguna Murni untuk Diri Sendiri (Pasal 127)</option>
              <option value="Korban Penyalahgunaan Narkotika">Korban Penyalahgunaan Narkotika (Bujukan / Tekanan)</option>
              <option value="Pecandu dan Indikasi Pengedar Skala Kecil">Pecandu & Indikasi Pengedar Skala Kecil (Batas SEMA)</option>
              <option value="Pengedar / Kurir Sindikat">Pengedar / Kurir Sindikat Peredaran Gelap</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Status Keterlibatan Jaringan Sindikat:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.statusKeterlibatanJaringan}
              onChange={e => setForm({ ...form, statusKeterlibatanJaringan: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="text-xs pt-2">
          <label className="text-slate-400 font-semibold block mb-1">Pertimbangan Yuridis & Fakta Hukum Penangkapan:</label>
          <textarea
            rows={2}
            disabled={!canEdit}
            value={form.pertimbanganYuridis}
            onChange={e => setForm({ ...form, pertimbanganYuridis: e.target.value })}
            className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>
      </div>

      {/* Rekomendasi Hukum ke Sidang Pleno */}
      <div className="bg-[#081224] border border-[#1b3459] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1b3459]">
          <FileText className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Usulan Rekomendasi Hukum ke Sidang Pleno</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Rekomendasi Penanganan Perkara:</label>
            <select
              disabled={!canEdit}
              value={form.rekomendasiHukum}
              onChange={e => setForm({ ...form, rekomendasiHukum: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-amber-500"
            >
              <option value="Proses hukum diselesaikan melalui Rehabilitasi Medis dan Sosial">
                Proses hukum diselesaikan melalui Rehabilitasi Medis & Sosial (Restorative Justice)
              </option>
              <option value="Proses hukum dilanjutkan ke Peradilan dengan rekomendasi vonis Rehabilitasi">
                Proses hukum dilanjutkan ke Peradilan dengan rekomendasi vonis Rehabilitasi (Pasal 103)
              </option>
              <option value="Proses hukum dilanjutkan pidana penjara biasa tanpa rekomendasi rehab">
                Proses hukum dilanjutkan pidana biasa tanpa rekomendasi rehabilitasi
              </option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Catatan Khusus Penelaah Hukum:</label>
            <input
              type="text"
              disabled={!canEdit}
              value={form.catatanKhusus}
              onChange={e => setForm({ ...form, catatanKhusus: e.target.value })}
              className="w-full p-2.5 bg-[#050e1c] border border-[#1b3459] rounded-xl text-white outline-none focus:border-amber-500"
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
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Draf Hukum'}</span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(true)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-950/40 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-200" />
              <span>{isSaving ? 'Menyimpan...' : 'Finalisasi Asesmen Hukum'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
