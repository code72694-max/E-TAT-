import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Scale,
  HeartPulse,
  Syringe,
  Save,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

interface ModalInputAsesmenProps {
  isOpen: boolean;
  onClose: () => void;
  tipeAsesmen: 'medis' | 'hukum';
  namaTerperiksa: string;
  nomorTat: string;
  initialData?: any;
  onSave?: (data: any, isFinal: boolean) => void;
}

export const ModalInputAsesmen: React.FC<ModalInputAsesmenProps> = ({
  isOpen,
  onClose,
  tipeAsesmen,
  namaTerperiksa,
  nomorTat,
  initialData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState(1);

  // State Form Medis
  const [medisForm, setMedisForm] = useState({
    tekananDarah: initialData?.tekananDarah || '',
    denyutNadi: initialData?.denyutNadi ? String(initialData.denyutNadi) : '',
    pernapasan: initialData?.pernapasan ? String(initialData.pernapasan) : '',
    suhuTubuh: initialData?.suhuTubuh ? String(initialData.suhuTubuh) : '',
    needleTracks: initialData?.needleTracks || 'tidak_ada',
    kondisiIntoksikasi: initialData?.kondisiIntoksikasi || 'normal',
    komorbiditasMedis: initialData?.komorbiditasMedis || '',
    kondisiPsikologis: initialData?.kondisiPsikologis || 'Orientasi baik, tidak ditemukan gejala psikotik akut.',
    jenisZat: initialData?.riwayatZat?.[0]?.jenisZat || 'Methamphetamine (Sabu)',
    caraPakai: initialData?.riwayatZat?.[0]?.caraPakai || 'Dihisap / Dibakar (Inhalasi)',
    frekuensi: initialData?.riwayatZat?.[0]?.frekuensi || '2-4 kali seminggu',
    lamaPenggunaan: initialData?.riwayatZat?.[0]?.lamaPemakaianBulan ? `${initialData.riwayatZat[0].lamaPemakaianBulan} Bulan` : '1.5 Tahun',
    hasilUrinMet: initialData?.hasilUrin?.some((u: any) => u.parameter === 'MET' && u.hasil === 'Positif') ?? true,
    hasilUrinAmp: initialData?.hasilUrin?.some((u: any) => u.parameter === 'AMP' && u.hasil === 'Positif') ?? false,
    hasilUrinThc: initialData?.hasilUrin?.some((u: any) => u.parameter === 'THC' && u.hasil === 'Positif') ?? false,
    hasilUrinMop: initialData?.hasilUrin?.some((u: any) => u.parameter === 'MOP' && u.hasil === 'Positif') ?? false,
    hasilUrinBzo: initialData?.hasilUrin?.some((u: any) => u.parameter === 'BZO' && u.hasil === 'Positif') ?? false,
    skorInstrumen: initialData?.skorInstrumen ? String(initialData.skorInstrumen) : '24',
    tingkatRisikoInstrumen: initialData?.tingkatRisikoInstrumen || 'Risiko Sedang (11-26)',
    diagnosisKlinisIcd: initialData?.diagnosisKlinisIcd || 'F15.2 (Sindrom Ketergantungan Stimulansia)',
    kebutuhanRawat: initialData?.kebutuhanRawat || 'Membutuhkan Rehabilitasi Rawat Jalan (Intervensi Singkat)',
    catatanKhusus: initialData?.catatanKhusus || 'Pasien menunjukkan motivasi pemulihan dan kesiapan rehabilitasi.',
  });

  // State Form Hukum
  const [hukumForm, setHukumForm] = useState({
    kronologi: initialData?.catatanKhusus || initialData?.faktaPendukung || 'Tertangkap tangan saat menguasai narkotika untuk dikonsumsi sendiri. Tidak ada indikasi keterlibatan sindikat.',
    statusTangkap: initialData?.statusTangkap || 'Tertangkap Tangan Sedang Menggunakan',
    residivis: initialData?.pernahDitangkap ? 'Ya, Residivis Kasus Narkotika' : 'Tidak Terdaftar (Pemain Baru)',
    toJaringan: initialData?.terverifikasiDatabase ? 'Ya, Sindikat Peredaran' : 'Tidak (Pengguna Putus)',
    beratBersih: initialData?.beratBersih ? String(initialData.beratBersih) : '0.38',
    barangBuktiLain: initialData?.analisisBarangBukti || 'Ditemukan alat hisap (bong), pipet kaca, korek api. Tidak ditemukan timbangan atau plastik klip.',
    analisisPeran: initialData?.analisisPeran || 'Penyalahguna Murni untuk Diri Sendiri',
    rekomendasiHukum: initialData?.rekomendasiHukum || 'Proses hukum diselesaikan melalui Rehabilitasi Medis dan Sosial',
    catatanKhusus: initialData?.catatanKhusus || 'Memenuhi kualifikasi SEMA 04/2010 dan Pasal 127 UU 35/2009 untuk direkomendasikan rehabilitasi.',
  });

  if (!isOpen) return null;

  const handleSaveSubmit = (isFinal: boolean) => {
    if (tipeAsesmen === 'medis') {
      const payload = {
        tekananDarah: medisForm.tekananDarah || '120/80',
        denyutNadi: medisForm.denyutNadi ? Number(medisForm.denyutNadi) : 82,
        pernapasan: medisForm.pernapasan ? Number(medisForm.pernapasan) : 18,
        suhuTubuh: medisForm.suhuTubuh ? Number(medisForm.suhuTubuh) : 36.5,
        needleTracks: medisForm.needleTracks,
        kondisiIntoksikasi: medisForm.kondisiIntoksikasi,
        komorbiditasMedis: medisForm.komorbiditasMedis,
        kondisiPsikologis: medisForm.kondisiPsikologis,
        skorInstrumen: medisForm.skorInstrumen ? Number(medisForm.skorInstrumen) : 24,
        tingkatRisikoInstrumen: medisForm.tingkatRisikoInstrumen,
        diagnosisKlinisIcd: medisForm.diagnosisKlinisIcd || 'F15.2 (Sindrom Ketergantungan Stimulansia)',
        interpretasiKlinis: medisForm.diagnosisKlinisIcd || 'F15.2 (Sindrom Ketergantungan Stimulansia)',
        kebutuhanRawat: medisForm.kebutuhanRawat,
        durasiUsulanBulan: 3,
        catatanKhusus: medisForm.catatanKhusus,
        riwayatZat: [
          {
            jenisZat: medisForm.jenisZat,
            caraPakai: medisForm.caraPakai,
            frekuensi: medisForm.frekuensi,
            lamaPemakaianBulan: 12,
            terakhirPakai: '2 Hari lalu',
          }
        ],
        hasilUrin: [
          { parameter: 'MET', hasil: medisForm.hasilUrinMet ? 'Positif' : 'Negatif' },
          { parameter: 'AMP', hasil: medisForm.hasilUrinAmp ? 'Positif' : 'Negatif' },
          { parameter: 'THC', hasil: medisForm.hasilUrinThc ? 'Positif' : 'Negatif' },
          { parameter: 'MOP', hasil: medisForm.hasilUrinMop ? 'Positif' : 'Negatif' },
          { parameter: 'BZO', hasil: medisForm.hasilUrinBzo ? 'Positif' : 'Negatif' },
        ],
      };
      if (onSave) onSave(payload, isFinal);
    } else {
      const payload = {
        analisisPeran: hukumForm.analisisPeran,
        analisisBarangBukti: hukumForm.barangBuktiLain || `Total BB: ${hukumForm.beratBersih} Gram. Di bawah batas SEMA 04/2010.`,
        rekomendasiHukum: hukumForm.rekomendasiHukum,
        catatanKhusus: hukumForm.catatanKhusus || hukumForm.kronologi,
        pernahDitangkap: hukumForm.residivis !== 'Tidak Terdaftar (Pemain Baru)',
        keteranganPerkaraLalu: hukumForm.residivis,
        terverifikasiDatabase: hukumForm.toJaringan !== 'Tidak (Pengguna Putus)',
        kesimpulanHukum: hukumForm.rekomendasiHukum,
      };
      if (onSave) onSave(payload, isFinal);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b172a] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#1b3459] shadow-2xl">
        
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          tipeAsesmen === 'medis' ? 'bg-[#081f2a] border-emerald-900/50' : 'bg-[#1a0f14] border-rose-900/50'
        } rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              tipeAsesmen === 'medis' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {tipeAsesmen === 'medis' ? <Stethoscope className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-white font-bold font-['Cinzel',serif]">
                Formulir Input Asesmen {tipeAsesmen === 'medis' ? 'Medis & Psikologis' : 'Hukum & Kriminalistik'}
              </h2>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>Terperiksa: <strong className="text-white">{namaTerperiksa}</strong></span>
                <span>•</span>
                <span className="font-mono text-[#D4AF37]">{nomorTat}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#050e1c] text-xs">
          
          {/* MEDIS FORM */}
          {tipeAsesmen === 'medis' && (
            <div className="space-y-6">
              {/* Tab Navigasi Medis */}
              <div className="flex space-x-2 border-b border-[#1b3459] pb-2">
                {['1. Fisik & Tanda Vital', '2. Psikiatrik & Mental', '3. Riwayat Zat & Lab', '4. ASSIST / ASI & Kesimpulan'].map((tab, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx + 1)}
                    className={`px-4 py-2 rounded-t-lg font-semibold transition-colors cursor-pointer ${
                      activeTab === idx + 1
                        ? 'bg-emerald-900/30 text-emerald-400 border-b-2 border-emerald-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Tekanan Darah (mmHg)</label>
                      <input 
                        type="text" 
                        maxLength={7} 
                        placeholder="120/80" 
                        value={medisForm.tekananDarah}
                        onChange={e => setMedisForm({ ...medisForm, tekananDarah: e.target.value })}
                        className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Denyut Nadi (x/mnt)</label>
                      <input 
                        type="number" 
                        min={30} 
                        max={250} 
                        placeholder="82" 
                        value={medisForm.denyutNadi}
                        onChange={e => setMedisForm({ ...medisForm, denyutNadi: e.target.value })}
                        className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Pernapasan (x/mnt)</label>
                      <input 
                        type="number" 
                        min={8} 
                        max={60} 
                        placeholder="18" 
                        value={medisForm.pernapasan}
                        onChange={e => setMedisForm({ ...medisForm, pernapasan: e.target.value })}
                        className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Suhu Tubuh (°C)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min={30} 
                        max={45} 
                        placeholder="36.5" 
                        value={medisForm.suhuTubuh}
                        onChange={e => setMedisForm({ ...medisForm, suhuTubuh: e.target.value })}
                        className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500 font-mono" 
                      />
                    </div>
                  </div>

                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-emerald-400 flex items-center space-x-2">
                      <HeartPulse className="w-4 h-4" /> <span>Pemeriksaan Kondisi Fisik Khas</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Tanda Bekas Suntikan (Needle Tracks)</label>
                        <select 
                          value={medisForm.needleTracks}
                          onChange={e => setMedisForm({ ...medisForm, needleTracks: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                        >
                          <option value="tidak_ada">Tidak Ditemukan</option>
                          <option value="ada_lama">Ada (Bekas Lama / Menghitam)</option>
                          <option value="ada_baru">Ada (Luka Baru / Merah)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Gejala Intoksikasi / Putus Zat (Sakau)</label>
                        <select 
                          value={medisForm.kondisiIntoksikasi}
                          onChange={e => setMedisForm({ ...medisForm, kondisiIntoksikasi: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                        >
                          <option value="normal">Normal / Stabil</option>
                          <option value="intoksikasi">Terlihat Mabuk / Intoksikasi Ringan</option>
                          <option value="putus_zat">Mengalami Gejala Putus Zat (Gelisah, Keringat, Tremor)</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-slate-300 font-semibold mb-1 block">Catatan Penyakit Penyerta (Komorbiditas Fisik)</label>
                        <textarea 
                          placeholder="Contoh: Asma, Hepatitis, HIV, atau keluhan nyeri dada..." 
                          rows={2} 
                          value={medisForm.komorbiditasMedis}
                          onChange={e => setMedisForm({ ...medisForm, komorbiditasMedis: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-emerald-400 flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4" /> <span>Evaluasi Kejiwaan & Status Mental (MSE)</span>
                    </h3>
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Catatan Pemeriksaan Psikiatrik</label>
                      <textarea 
                        rows={4}
                        value={medisForm.kondisiPsikologis}
                        onChange={e => setMedisForm({ ...medisForm, kondisiPsikologis: e.target.value })}
                        placeholder="Orientasi waktu/tempat/orang baik, proses pikir koheren, afek sesuai, tidak ada halusinasi aktif..."
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2.5 rounded-lg outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-emerald-400 flex items-center space-x-2">
                      <Syringe className="w-4 h-4" /> <span>Riwayat Zat Utama (Substance History)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Jenis Zat Dominan</label>
                        <select 
                          value={medisForm.jenisZat}
                          onChange={e => setMedisForm({ ...medisForm, jenisZat: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                        >
                          <option>Methamphetamine (Sabu)</option>
                          <option>Ganja / Sintetis</option>
                          <option>MDMA / Ekstasi</option>
                          <option>Heroin / Putaw</option>
                          <option>Obat Keras (Tramadol, dll)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Cara Pakai</label>
                        <select 
                          value={medisForm.caraPakai}
                          onChange={e => setMedisForm({ ...medisForm, caraPakai: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                        >
                          <option>Dihisap / Dibakar (Inhalasi)</option>
                          <option>Ditelan (Oral)</option>
                          <option>Disuntikkan (IV)</option>
                          <option>Dihirup (Snorting)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Frekuensi Pakai</label>
                        <select 
                          value={medisForm.frekuensi}
                          onChange={e => setMedisForm({ ...medisForm, frekuensi: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                        >
                          <option>Setiap Hari (Rutin)</option>
                          <option>2-4 kali seminggu</option>
                          <option>1-3 kali sebulan</option>
                          <option>Sesekali (Coba-coba / Rekreasi)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Lama Penggunaan Aktif</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: 1.5 Tahun" 
                          value={medisForm.lamaPenggunaan}
                          onChange={e => setMedisForm({ ...medisForm, lamaPenggunaan: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-slate-300 font-semibold mb-1 block">Hasil Tes Urin Lab BNN/Forensik (Parameter)</label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={medisForm.hasilUrinMet}
                              onChange={e => setMedisForm({ ...medisForm, hasilUrinMet: e.target.checked })}
                              className="accent-emerald-500" 
                            />
                            <span className="text-slate-200 font-mono">MET +</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={medisForm.hasilUrinAmp}
                              onChange={e => setMedisForm({ ...medisForm, hasilUrinAmp: e.target.checked })}
                              className="accent-emerald-500" 
                            />
                            <span className="text-slate-200 font-mono">AMP +</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={medisForm.hasilUrinThc}
                              onChange={e => setMedisForm({ ...medisForm, hasilUrinThc: e.target.checked })}
                              className="accent-emerald-500" 
                            />
                            <span className="text-slate-200 font-mono">THC +</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={medisForm.hasilUrinMop}
                              onChange={e => setMedisForm({ ...medisForm, hasilUrinMop: e.target.checked })}
                              className="accent-emerald-500" 
                            />
                            <span className="text-slate-200 font-mono">MOP +</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={medisForm.hasilUrinBzo}
                              onChange={e => setMedisForm({ ...medisForm, hasilUrinBzo: e.target.checked })}
                              className="accent-emerald-500" 
                            />
                            <span className="text-slate-200 font-mono">BZO +</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-emerald-900/10 border border-emerald-900/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-emerald-400 font-bold mb-1 block">Skor ASSIST (Skala Risiko)</label>
                      <input 
                        type="number" 
                        placeholder="Skor 0 - 39+" 
                        value={medisForm.skorInstrumen}
                        onChange={e => setMedisForm({ ...medisForm, skorInstrumen: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-emerald-400 font-bold mb-1 block">Tingkat Risiko Adiksi</label>
                      <select 
                        value={medisForm.tingkatRisikoInstrumen}
                        onChange={e => setMedisForm({ ...medisForm, tingkatRisikoInstrumen: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none font-bold text-emerald-400"
                      >
                        <option value="Risiko Rendah (0-10)">Risiko Rendah (0-10)</option>
                        <option value="Risiko Sedang (11-26)">Risiko Sedang (11-26)</option>
                        <option value="Risiko Tinggi (27+)">Risiko Tinggi (27+)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-slate-300 font-semibold mb-1 block">Diagnosis Klinis (Kode ICD-10)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: F15.2 Sindrom Ketergantungan Stimulansia" 
                        value={medisForm.diagnosisKlinisIcd}
                        onChange={e => setMedisForm({ ...medisForm, diagnosisKlinisIcd: e.target.value })}
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none font-mono" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-slate-300 font-semibold mb-1 block">Rekomendasi Terapi Medis (Draft)</label>
                      <select 
                        value={medisForm.kebutuhanRawat}
                        onChange={e => setMedisForm({ ...medisForm, kebutuhanRawat: e.target.value })}
                        className="w-full bg-[#0b172a] border border-[#D4AF37] text-white p-2.5 rounded-lg outline-none font-bold"
                      >
                        <option value="Membutuhkan Rehabilitasi Rawat Jalan (Intervensi Singkat)">Membutuhkan Rehabilitasi Rawat Jalan (Intervensi Singkat)</option>
                        <option value="Membutuhkan Rehabilitasi Rawat Inap (Pemulihan Penuh)">Membutuhkan Rehabilitasi Rawat Inap (Pemulihan Penuh)</option>
                        <option value="Membutuhkan Detoksifikasi Darurat Medis / Jiwa">Membutuhkan Detoksifikasi Darurat Medis / Jiwa</option>
                        <option value="Tidak Memerlukan Rehabilitasi / Hanya Konseling Dasar">Tidak Memerlukan Rehabilitasi / Hanya Konseling Dasar</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-slate-300 font-semibold mb-1 block">Catatan Khusus Dokter Asesor</label>
                      <textarea 
                        rows={2}
                        value={medisForm.catatanKhusus}
                        onChange={e => setMedisForm({ ...medisForm, catatanKhusus: e.target.value })}
                        placeholder="Catatan tambahan dokter..."
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HUKUM FORM */}
          {tipeAsesmen === 'hukum' && (
            <div className="space-y-6">
              {/* Tab Navigasi Hukum */}
              <div className="flex space-x-2 border-b border-[#1b3459] pb-2">
                {['1. Konstruksi Perkara', '2. Telaah Barang Bukti', '3. Analisa Peran', '4. Kesimpulan Yuridis'].map((tab, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx + 1)}
                    className={`px-4 py-2 rounded-t-lg font-semibold transition-colors cursor-pointer ${
                      activeTab === idx + 1
                        ? 'bg-rose-900/30 text-rose-400 border-b-2 border-rose-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-4">
                    <h3 className="font-bold text-rose-400 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" /> <span>Analisa Kronologi Penangkapan (LP/BAP)</span>
                    </h3>
                    <textarea 
                      rows={3}
                      value={hukumForm.kronologi}
                      onChange={e => setHukumForm({ ...hukumForm, kronologi: e.target.value })}
                      className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-3 rounded-lg outline-none focus:border-rose-500 text-xs leading-relaxed"
                      placeholder="Jelaskan ringkasan fakta penangkapan. Apakah tersangka sedang memakai, sedang transaksi, atau pengembangan dari tersangka lain?"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 border border-[#1b3459] p-3 rounded-lg bg-[#050e1c]">
                        <span className="font-semibold text-slate-300 block">Status Penangkapan</span>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="statusTangkap" 
                            checked={hukumForm.statusTangkap === 'Tertangkap Tangan Sedang Menggunakan'} 
                            onChange={() => setHukumForm({ ...hukumForm, statusTangkap: 'Tertangkap Tangan Sedang Menggunakan' })}
                            className="accent-rose-500" 
                          />
                          <span className="text-slate-200">Tertangkap Tangan Sedang Menggunakan</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="statusTangkap" 
                            checked={hukumForm.statusTangkap === 'Tertangkap Tangan Membawa/Menguasai Narkotika'} 
                            onChange={() => setHukumForm({ ...hukumForm, statusTangkap: 'Tertangkap Tangan Membawa/Menguasai Narkotika' })}
                            className="accent-rose-500" 
                          />
                          <span className="text-slate-200">Tertangkap Tangan Membawa/Menguasai Narkotika</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="statusTangkap" 
                            checked={hukumForm.statusTangkap === 'Hasil Pengembangan / Penunjukan'} 
                            onChange={() => setHukumForm({ ...hukumForm, statusTangkap: 'Hasil Pengembangan / Penunjukan' })}
                            className="accent-rose-500" 
                          />
                          <span className="text-slate-200">Hasil Pengembangan / Penunjukan</span>
                        </label>
                      </div>

                      <div className="space-y-2 border border-[#1b3459] p-3 rounded-lg bg-[#050e1c]">
                        <span className="font-semibold text-slate-300 block">Penelusuran Residivisme / Jaringan</span>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-200">Terdapat di database DPO/Residivis?</span>
                          <select 
                            value={hukumForm.residivis}
                            onChange={e => setHukumForm({ ...hukumForm, residivis: e.target.value })}
                            className="bg-[#0b172a] text-white border border-[#1b3459] p-1 rounded outline-none w-1/2"
                          >
                            <option>Tidak Terdaftar (Pemain Baru)</option>
                            <option>Ya, Residivis Kasus Narkotika</option>
                            <option>Ya, Residivis Kasus Pidana Umum</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-slate-200">Terindikasi dalam TO Jaringan?</span>
                          <select 
                            value={hukumForm.toJaringan}
                            onChange={e => setHukumForm({ ...hukumForm, toJaringan: e.target.value })}
                            className="bg-[#0b172a] text-white border border-[#1b3459] p-1 rounded outline-none w-1/2"
                          >
                            <option>Tidak (Pengguna Putus)</option>
                            <option>Ya, Sindikat Peredaran</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-4">
                    <h3 className="font-bold text-rose-400 flex items-center space-x-2">
                      <Scale className="w-4 h-4" /> <span>Analisis Pemenuhan Syarat SEMA 04/2010 (Barang Bukti)</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Total Berat Bersih Barang Bukti</label>
                        <div className="flex">
                          <input 
                            type="number" 
                            step="0.01"
                            placeholder="0.38" 
                            value={hukumForm.beratBersih}
                            onChange={e => setHukumForm({ ...hukumForm, beratBersih: e.target.value })}
                            className="w-full bg-[#050e1c] border border-[#1b3459] border-r-0 text-white p-2 rounded-l-lg outline-none font-mono" 
                          />
                          <span className="bg-[#1b3459] text-slate-300 px-3 py-2 rounded-r-lg font-bold">Gram</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Kesesuaian dengan Batas SEMA</label>
                        <div className="bg-emerald-900/20 text-emerald-400 border border-emerald-900/50 p-2 rounded-lg font-bold flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Di bawah batas SEMA (Sabu &le; 1.0 gr)</span>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="text-slate-300 font-semibold mb-1 block">Barang Bukti Lainnya & Analisis Yuridis</label>
                        <textarea 
                          placeholder="Contoh: Ditemukan alat isap bong, pipet kaca, ponsel, tetapi TIDAK ditemukan timbangan digital atau plastik klip kosong dalam jumlah banyak." 
                          rows={2} 
                          value={hukumForm.barangBuktiLain}
                          onChange={e => setHukumForm({ ...hukumForm, barangBuktiLain: e.target.value })}
                          className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4">
                    <label className="text-rose-400 font-bold mb-2 block text-sm">Kesimpulan Peran Tersangka dalam Kasus</label>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 p-3 border border-[#1b3459] bg-[#050e1c] rounded-lg cursor-pointer hover:border-rose-500/50 transition-colors">
                        <input 
                          type="radio" 
                          name="peran" 
                          checked={hukumForm.analisisPeran === 'Penyalahguna Murni untuk Diri Sendiri'} 
                          onChange={() => setHukumForm({ ...hukumForm, analisisPeran: 'Penyalahguna Murni untuk Diri Sendiri' })}
                          className="accent-rose-500 mt-0.5" 
                        />
                        <div>
                          <p className="font-bold text-white">Penyalahguna Murni untuk Diri Sendiri (Pasal 127)</p>
                          <p className="text-[10px] text-slate-400 mt-1">Hanya menggunakan untuk diri sendiri, BB di bawah SEMA, tidak ada bukti jaringan/pengedar.</p>
                        </div>
                      </label>
                      
                      <label className="flex items-start space-x-3 p-3 border border-[#1b3459] bg-[#050e1c] rounded-lg cursor-pointer hover:border-rose-500/50 transition-colors">
                        <input 
                          type="radio" 
                          name="peran" 
                          checked={hukumForm.analisisPeran === 'Korban Penyalahgunaan Narkotika'} 
                          onChange={() => setHukumForm({ ...hukumForm, analisisPeran: 'Korban Penyalahgunaan Narkotika' })}
                          className="accent-rose-500 mt-0.5" 
                        />
                        <div>
                          <p className="font-bold text-white">Korban Penyalahgunaan Narkotika (Bujukan / Tekanan)</p>
                          <p className="text-[10px] text-slate-400 mt-1">Menggunakan karena bujukan atau tipu muslihat, tidak memiliki motif komersial.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3 p-3 border border-[#1b3459] bg-[#050e1c] rounded-lg cursor-pointer hover:border-rose-500/50 transition-colors">
                        <input 
                          type="radio" 
                          name="peran" 
                          checked={hukumForm.analisisPeran === 'Pecandu dan Indikasi Pengedar Skala Kecil'} 
                          onChange={() => setHukumForm({ ...hukumForm, analisisPeran: 'Pecandu dan Indikasi Pengedar Skala Kecil' })}
                          className="accent-rose-500 mt-0.5" 
                        />
                        <div>
                          <p className="font-bold text-white">Pecandu &amp; Indikasi Pengedar Skala Kecil (Batas SEMA)</p>
                          <p className="text-[10px] text-slate-400 mt-1">Menggunakan untuk diri sendiri, namun juga terbukti mengantar sebagian zat narkotika.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-rose-900/10 border border-rose-900/50 rounded-xl p-4">
                    <label className="text-rose-400 font-bold mb-1 block">Rekomendasi Hukum / Yuridis (Draft Sidang Pleno)</label>
                    <select 
                      value={hukumForm.rekomendasiHukum}
                      onChange={e => setHukumForm({ ...hukumForm, rekomendasiHukum: e.target.value })}
                      className="w-full bg-[#0b172a] border border-[#D4AF37] text-white p-2.5 rounded-lg outline-none font-bold mt-2"
                    >
                      <option value="Proses hukum diselesaikan melalui Rehabilitasi Medis dan Sosial">
                        Proses hukum diselesaikan melalui Rehabilitasi Medis &amp; Sosial (Restorative Justice)
                      </option>
                      <option value="Proses hukum dilanjutkan ke Peradilan dengan rekomendasi vonis Rehabilitasi">
                        Proses hukum dilanjutkan ke Peradilan dengan rekomendasi vonis Rehabilitasi (Pasal 103)
                      </option>
                      <option value="Proses hukum dilanjutkan pidana penjara biasa tanpa rekomendasi rehab">
                        Proses hukum dilanjutkan pidana biasa tanpa rekomendasi rehabilitasi
                      </option>
                    </select>
                    
                    <div className="mt-4">
                      <label className="text-slate-300 font-semibold mb-1 block">Catatan Khusus Asesor Hukum</label>
                      <textarea 
                        rows={3} 
                        value={hukumForm.catatanKhusus}
                        onChange={e => setHukumForm({ ...hukumForm, catatanKhusus: e.target.value })}
                        placeholder="Tuliskan argumen hukum yang akan dipresentasikan saat Sidang Pleno..." 
                        className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1b3459] bg-[#081224] rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-between items-center">
          <span className="text-slate-400 text-xs italic text-center sm:text-left">
            * Data disimpan secara otomatis ke database resmi e-TAT.
          </span>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => handleSaveSubmit(false)} 
              className="flex-1 sm:flex-none bg-[#0d1f38] hover:bg-[#142642] text-slate-300 border border-[#1b3459] font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Draf</span>
            </button>
            <button 
              type="button"
              onClick={() => { 
                if (window.confirm(`Apakah Anda yakin ingin menyelesaikan pengisian Asesmen ${tipeAsesmen === 'medis' ? 'Medis' : 'Hukum'}? Berkas akan difinalisasi di database dan alur berlanjut ke tahap berikutnya.`)) {
                  handleSaveSubmit(true);
                }
              }} 
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-5 rounded-lg text-xs flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai &amp; Teruskan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
