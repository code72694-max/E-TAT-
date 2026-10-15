import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { PermohonanAsesmen, UserProfile, UserRole } from '../../types';
import { klarifikasiApi } from '../../services/api';

interface TabKlarifikasiProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
}

export const TabKlarifikasi: React.FC<TabKlarifikasiProps> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan
}) => {
  const [tujuanPeran, setTujuanPeran] = useState<UserRole>('pengaju');
  const [pertanyaanInput, setPertanyaanInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendKlarifikasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pertanyaanInput.trim()) return;

    setIsSubmitting(true);
    const nowStr = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const localId = 'klar-' + Date.now();

    const newKlarifikasi = {
      id: localId,
      dariNama: currentUser.name,
      dariPeran: currentUser.role,
      kepadaPeran: tujuanPeran,
      pertanyaan: pertanyaanInput.trim(),
      tanggalTanya: nowStr,
      status: 'menunggu_tanggapan' as const
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      klarifikasiList: [newKlarifikasi, ...permohonan.klarifikasiList],
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: nowStr,
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pengajuan Klarifikasi Berkas',
          rincian: `Tujuan: ${tujuanPeran} - Pertanyaan: "${pertanyaanInput.trim().slice(0, 50)}..."`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
    const textSent = pertanyaanInput.trim();
    setPertanyaanInput('');

    try {
      if (permohonan.id) {
        await klarifikasiApi.create(permohonan.id, {
          kepadaPeran: tujuanPeran,
          pertanyaan: textSent
        });
      }
    } catch (err) {
      console.warn('Backend klarifikasiApi.create notice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerKlarifikasi = async (item: typeof permohonan.klarifikasiList[0]) => {
    const ans = prompt(`Jawab klarifikasi untuk ${item.dariNama}:`);
    if (!ans) return;

    const nowStr = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const updatedKlarifikasi = permohonan.klarifikasiList.map(k => {
      if (k.id === item.id) {
        return {
          ...k,
          jawaban: ans,
          dijawabOleh: currentUser.name,
          tanggalJawab: nowStr,
          status: 'selesai' as const
        };
      }
      return k;
    });

    onUpdatePermohonan({
      ...permohonan,
      klarifikasiList: updatedKlarifikasi
    });

    if (item.id && !item.id.startsWith('klar-')) {
      try {
        await klarifikasiApi.jawab(item.id, ans);
      } catch (err) {
        console.warn('Backend klarifikasiApi.jawab notice:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#1b3459]">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <span>Klarifikasi Terarah Melekat pada Berkas</span>
        </h3>
        <p className="text-xs text-slate-400">
          Komunikasi resmi antar-penyidik, sekretariat, asesor medis, dan asesor hukum yang terdokumentasi dalam audit trail.
        </p>
      </div>

      {/* Form Kirim Pertanyaan Baru */}
      <form onSubmit={handleSendKlarifikasi} className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-white">Ajukan Klarifikasi / Pertanyaan Dokumen</span>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Tujukan Kepada:</span>
            <select
              value={tujuanPeran}
              onChange={(e) => setTujuanPeran(e.target.value as UserRole)}
              className="border border-[#1b3459] rounded px-2 py-1 bg-[#0b172a] font-medium text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="pengaju">Penyidik Pengaju</option>
              <option value="sekretariat">Sekretariat TAT</option>
              <option value="medis">Tim Asesor Medis</option>
              <option value="hukum">Tim Asesor Hukum</option>
              <option value="koordinator">Ketua Tim TAT</option>
              <option value="rehabilitasi">Fasilitas Rehabilitasi</option>
            </select>
          </div>
        </div>

        <textarea
          value={pertanyaanInput}
          onChange={(e) => setPertanyaanInput(e.target.value)}
          placeholder="Tuliskan permintaan klarifikasi substantif atau administrasi secara spesifik..."
          rows={2}
          className="w-full text-xs p-2.5 border border-[#1b3459] rounded-lg focus:outline-none focus:border-[#D4AF37] bg-[#0b172a] text-white placeholder-slate-500"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!pertanyaanInput.trim() || isSubmitting}
            className="bg-gradient-to-r from-[#0d1f38] via-[#132644] to-[#1b3459] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 border border-[#2d7ad6]/70 shadow-[0_2px_10px_rgba(20,83,154,0.35)] cursor-pointer transition-all"
          >
            <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Klarifikasi'}</span>
          </button>
        </div>
      </form>

      {/* List of Clarifications */}
      <div className="space-y-3">
        {(!permohonan.klarifikasiList || permohonan.klarifikasiList.length === 0) ? (
          <p className="text-xs text-slate-500 italic text-center py-6">Belum ada percakapan klarifikasi untuk berkas ini.</p>
        ) : (
          permohonan.klarifikasiList.map(item => (
            <div key={item.id} className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{item.dariNama}</span>
                  <span className="bg-[#0b172a] text-[#D4AF37] px-1.5 py-0.5 rounded font-medium capitalize border border-[#1b3459]">
                    {item.dariPeran}
                  </span>
                  <span>→ Kepada: <strong className="capitalize text-white">{item.kepadaPeran}</strong></span>
                </div>
                <span>{item.tanggalTanya}</span>
              </div>

              <p className="text-slate-200 font-medium bg-[#0b172a] p-2.5 rounded border border-[#1b3459]">
                "{item.pertanyaan}"
              </p>

              {item.jawaban ? (
                <div className="mt-2 pl-4 border-l-2 border-[#D4AF37] bg-[#0d213d] p-2.5 rounded-r">
                  <div className="flex items-center justify-between text-[10px] text-[#D4AF37] font-semibold mb-1">
                    <span>Jawaban oleh {item.dijawabOleh}</span>
                    <span className="text-slate-400">{item.tanggalJawab}</span>
                  </div>
                  <p className="text-slate-200">{item.jawaban}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-medium pt-1">
                  <span>Menunggu tanggapan dari {item.kepadaPeran}...</span>
                  {currentUser.role.toLowerCase() === item.kepadaPeran.toLowerCase() && (
                    <button
                      onClick={() => handleAnswerKlarifikasi(item)}
                      className="text-xs bg-[#17549c] hover:bg-[#1c64b8] text-white px-2.5 py-1 rounded font-semibold cursor-pointer border border-[#2d7ad6]"
                    >
                      Tanggapi Sekarang
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
