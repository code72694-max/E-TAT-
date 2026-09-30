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
}

export const ModalInputAsesmen: React.FC<ModalInputAsesmenProps> = ({
  isOpen,
  onClose,
  tipeAsesmen,
  namaTerperiksa,
  nomorTat
}) => {
  const [activeTab, setActiveTab] = useState(1);

  if (!isOpen) return null;

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
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
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
                    onClick={() => setActiveTab(idx + 1)}
                    className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
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
                      <input type="text" placeholder="120/80" className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Denyut Nadi (x/mnt)</label>
                      <input type="number" placeholder="85" className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Pernapasan (x/mnt)</label>
                      <input type="number" placeholder="18" className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Suhu Tubuh (°C)</label>
                      <input type="number" placeholder="36.5" className="w-full bg-[#0b172a] border border-[#1b3459] text-white p-2 rounded-lg outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-emerald-400 flex items-center space-x-2">
                      <HeartPulse className="w-4 h-4" /> <span>Pemeriksaan Kondisi Fisik Khas</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Tanda Bekas Suntikan (Needle Tracks)</label>
                        <select className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none">
                          <option value="tidak_ada">Tidak Ditemukan</option>
                          <option value="ada_lama">Ada (Bekas Lama / Menghitam)</option>
                          <option value="ada_baru">Ada (Luka Baru / Merah)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Gejala Intoksikasi / Putus Zat (Sakau)</label>
                        <select className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none">
                          <option value="normal">Normal / Stabil</option>
                          <option value="intoksikasi">Terlihat Mabuk / Intoksikasi Ringan</option>
                          <option value="putus_zat">Mengalami Gejala Putus Zat (Gelisah, Keringat, Tremor)</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-slate-300 font-semibold mb-1 block">Catatan Penyakit Penyerta (Komorbiditas Fisik)</label>
                        <textarea placeholder="Contoh: Asma, Hepatitis, HIV, atau keluhan nyeri dada..." rows={2} className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-4 animate-in fade-in flex items-center justify-center p-10 border border-[#1b3459] border-dashed rounded-xl">
                  <p className="text-slate-500">Tampilan Evaluasi Kejiwaan & Mental Status Examination (MSE)</p>
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
                        <select className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none">
                          <option>Methamphetamine (Sabu)</option>
                          <option>Ganja / Sintetis</option>
                          <option>MDMA / Ekstasi</option>
                          <option>Heroin / Putaw</option>
                          <option>Obat Keras (Tramadol, dll)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Cara Pakai</label>
                        <select className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none">
                          <option>Dihisap / Dibakar (Inhalasi)</option>
                          <option>Ditelan (Oral)</option>
                          <option>Disuntikkan (IV)</option>
                          <option>Dihirup (Snorting)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Frekuensi Pakai</label>
                        <select className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none">
                          <option>Setiap Hari (Rutin)</option>
                          <option>2-4 kali seminggu</option>
                          <option>1-3 kali sebulan</option>
                          <option>Sesekali (Coba-coba / Rekreasi)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Lama Penggunaan Aktif</label>
                        <input type="text" placeholder="Contoh: 1.5 Tahun" className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-slate-300 font-semibold mb-1 block">Hasil Tes Urin Lab BNN/Forensik (Parameter)</label>
                        <div className="flex space-x-4 mt-2">
                          {['MET', 'AMP', 'THC', 'MOP', 'BZO'].map(param => (
                            <label key={param} className="flex items-center space-x-1 cursor-pointer">
                              <input type="checkbox" className="accent-emerald-500" />
                              <span className="text-slate-200 font-mono">{param} +</span>
                            </label>
                          ))}
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
                      <input type="number" placeholder="Skor 0 - 39+" className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none font-bold" />
                    </div>
                    <div>
                      <label className="text-emerald-400 font-bold mb-1 block">Tingkat Risiko Adiksi</label>
                      <select className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none font-bold text-emerald-400">
                        <option value="rendah">Risiko Rendah (0-10)</option>
                        <option value="sedang">Risiko Sedang (11-26)</option>
                        <option value="tinggi">Risiko Tinggi (27+)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-slate-300 font-semibold mb-1 block">Diagnosis Klinis (Kode ICD-10)</label>
                      <input type="text" placeholder="Contoh: F15.2 Sindrom Ketergantungan Stimulansia" className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none font-mono" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-slate-300 font-semibold mb-1 block">Rekomendasi Terapi Medis (Draft)</label>
                      <select className="w-full bg-[#0b172a] border border-[#D4AF37] text-white p-2.5 rounded-lg outline-none font-bold">
                        <option>Membutuhkan Rehabilitasi Rawat Jalan (Intervensi Singkat)</option>
                        <option>Membutuhkan Rehabilitasi Rawat Inap (Pemulihan Penuh)</option>
                        <option>Membutuhkan Detoksifikasi Darurat Medis / Jiwa</option>
                        <option>Tidak Memerlukan Rehabilitasi / Hanya Konseling Dasar</option>
                      </select>
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
                    onClick={() => setActiveTab(idx + 1)}
                    className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
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
                      className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-3 rounded-lg outline-none focus:border-rose-500 text-xs"
                      placeholder="Jelaskan ringkasan fakta penangkapan. Apakah tersangka sedang memakai, sedang transaksi, atau pengembangan dari tersangka lain?"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 border border-[#1b3459] p-3 rounded-lg bg-[#050e1c]">
                        <span className="font-semibold text-slate-300 block">Status Penangkapan</span>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="statusTangkap" className="accent-rose-500" defaultChecked />
                          <span className="text-slate-200">Tertangkap Tangan Sedang Menggunakan</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="statusTangkap" className="accent-rose-500" />
                          <span className="text-slate-200">Tertangkap Tangan Membawa/Menguasai Narkotika</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="statusTangkap" className="accent-rose-500" />
                          <span className="text-slate-200">Hasil Pengembangan / Penunjukan</span>
                        </label>
                      </div>

                      <div className="space-y-2 border border-[#1b3459] p-3 rounded-lg bg-[#050e1c]">
                        <span className="font-semibold text-slate-300 block">Penelusuran Residivisme / Jaringan</span>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-200">Terdapat di database DPO/Residivis?</span>
                          <select className="bg-[#0b172a] text-white border border-[#1b3459] p-1 rounded outline-none w-1/2">
                            <option>Tidak Terdaftar (Pemain Baru)</option>
                            <option>Ya, Residivis Kasus Narkotika</option>
                            <option>Ya, Residivis Kasus Pidana Umum</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-slate-200">Terindikasi dalam TO Jaringan?</span>
                          <select className="bg-[#0b172a] text-white border border-[#1b3459] p-1 rounded outline-none w-1/2">
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
                          <input type="number" placeholder="0.5" className="w-full bg-[#050e1c] border border-[#1b3459] border-r-0 text-white p-2 rounded-l-lg outline-none" />
                          <span className="bg-[#1b3459] text-slate-300 px-3 py-2 rounded-r-lg">Gram</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">Kesesuaian dengan Batas SEMA</label>
                        <div className="bg-emerald-900/20 text-emerald-400 border border-emerald-900/50 p-2 rounded-lg font-bold flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Di bawah batas SEMA (Sabu &lt; 1g)</span>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="text-slate-300 font-semibold mb-1 block">Barang Bukti Lainnya (Kriminalistik)</label>
                        <textarea placeholder="Contoh: Ditemukan alat isap bong, pipet kaca, ponsel, tetapi TIDAK ditemukan timbangan digital atau plastik klip kosong dalam jumlah banyak." rows={2} className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none"></textarea>
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
                        <input type="radio" name="peran" className="accent-rose-500 mt-0.5" defaultChecked />
                        <div>
                          <p className="font-bold text-white">Penyalah Guna Murni / Korban Penyalahgunaan</p>
                          <p className="text-[10px] text-slate-400 mt-1">Hanya menggunakan untuk diri sendiri, BB di bawah SEMA, tidak ada bukti jaringan/pengedar.</p>
                        </div>
                      </label>
                      
                      <label className="flex items-start space-x-3 p-3 border border-[#1b3459] bg-[#050e1c] rounded-lg cursor-pointer hover:border-rose-500/50 transition-colors">
                        <input type="radio" name="peran" className="accent-rose-500 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">Pecandu sekaligus Indikasi Pengedar Skala Kecil (Kurir)</p>
                          <p className="text-[10px] text-slate-400 mt-1">Menggunakan untuk diri sendiri, namun juga terbukti menjual/mengantar sebagian narkotika (Pasal 114 / 112 terpenuhi).</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3 p-3 border border-[#1b3459] bg-[#050e1c] rounded-lg cursor-pointer hover:border-rose-500/50 transition-colors">
                        <input type="radio" name="peran" className="accent-rose-500 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">Pengedar / Bandar / Jaringan Peredaran Gelap Narkotika</p>
                          <p className="text-[10px] text-slate-400 mt-1">Bukan penyalah guna, motif ekonomi, TO kepolisian. Tidak memenuhi syarat rehabilitasi.</p>
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
                    <select className="w-full bg-[#0b172a] border border-[#D4AF37] text-white p-2.5 rounded-lg outline-none font-bold mt-2">
                      <option>Proses Hukum Dilanjutkan, Tersangka Ditempatkan di Fasilitas Rehabilitasi (Pasal 127)</option>
                      <option>Proses Hukum Dilanjutkan, Tersangka Tetap Ditahan di Rutan (Unsur Pengedar Terpenuhi)</option>
                      <option>Penghentian Penyidikan (Restorative Justice / Diversi ABH)</option>
                      <option>Dikembalikan ke Keluarga (Tidak Cukup Bukti)</option>
                    </select>
                    
                    <div className="mt-4">
                      <label className="text-slate-300 font-semibold mb-1 block">Catatan Khusus Asesor Hukum</label>
                      <textarea placeholder="Tuliskan argumen hukum yang akan dipresentasikan saat Sidang Pleno..." rows={3} className="w-full bg-[#050e1c] border border-[#1b3459] text-white p-2 rounded-lg outline-none text-xs"></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1b3459] bg-[#081224] rounded-b-2xl flex justify-between items-center">
          <span className="text-slate-400 text-xs italic">
            * Data disimpan sebagai draf sementara hingga dikonfirmasi di Sidang Pleno.
          </span>
          <button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-5 rounded-lg text-xs flex items-center space-x-2 shadow-lg cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Simpan Draf {tipeAsesmen === 'medis' ? 'Medis' : 'Hukum'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
