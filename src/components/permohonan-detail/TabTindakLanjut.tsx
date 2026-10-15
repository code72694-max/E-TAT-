import React from 'react';
import { Share2, Building2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PermohonanAsesmen, UserProfile } from '../../types';
import { tindakLanjutApi } from '../../services/api';

interface TabTindakLanjutProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
}

export const TabTindakLanjut: React.FC<TabTindakLanjutProps> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan
}) => {
  const formatStatus = (s: string) => {
    return s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleRehabAction = async (action: 'terima' | 'admisi' | 'penuh', catatan?: string) => {
    if (!permohonan.tindakLanjut) return;
    const nowStr = new Date().toLocaleDateString('id-ID');
    const newStatus = (action === 'terima'
      ? 'diterima_fasilitas'
      : action === 'admisi'
      ? 'klien_mulai_layanan'
      : 'kapasitas_penuh') as any;

    const updatedTindakLanjut = {
      ...permohonan.tindakLanjut,
      statusRujukan: newStatus,
      tanggalKonfirmasiFasilitas: action === 'terima' ? nowStr : permohonan.tindakLanjut.tanggalKonfirmasiFasilitas,
      tanggalMulaiLayanan: action === 'admisi' ? nowStr : permohonan.tindakLanjut.tanggalMulaiLayanan,
      hambatanPelaksanaan: action === 'penuh' ? (catatan || 'Kapasitas kamar rawat inap sedang penuh 100%.') : undefined
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      followupStatus: action === 'admisi' ? 'VERIFIED_IMPLEMENTED' : permohonan.followupStatus,
      statusProsesUtama: action === 'admisi' ? 'selesai_tindak_lanjut' : permohonan.statusProsesUtama,
      tindakLanjut: updatedTindakLanjut,
      pengawasanKlien: action === 'admisi' && !permohonan.pengawasanKlien ? {
        id: 'pgw-' + Date.now(),
        statusKepatuhan: 'patuh',
        modalitasLayanan: permohonan.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rawat Inap' : 'Rawat Jalan',
        durasiBulan: permohonan.asesmenMedis?.durasiUsulanBulan || 3,
        tanggalMulai: nowStr,
        tanggalTargetSelesai: '3 Bulan Sejak Admisi',
        instansiPelaksanaRehab: permohonan.tindakLanjut.namaFasilitasTujuan || currentUser.agency,
        konselorPendamping: currentUser.name,
        penyidikPengawas: permohonan.perkara.namaPenyidik,
        totalSesiWajib: 12,
        sesiTerselesaikan: 1,
        jumlahMangkir: 0,
        suratPeringatanList: [],
        riwayatTesUrinBerkala: [
          {
            id: 'urin-' + Date.now(),
            tanggalTes: nowStr,
            tahapKe: 1,
            jenisPemeriksaan: 'Terjadwal',
            parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
            hasil: 'Negatif',
            petugasPemeriksa: currentUser.name,
            keterangan: 'Tes skrining awal saat admisi klien'
          }
        ],
        laporanPerkembanganList: [
          {
            id: 'lap-' + Date.now(),
            tanggalLaporan: nowStr,
            mingguKe: 1,
            kehadiran: 'hadir',
            kepatuhanProgram: 'sangat_patuh',
            catatanKonselor: 'Klien telah resmi diterima dan mulai mengikuti orientasi program rehabilitasi.',
            rekomendasiKelanjutan: 'Lanjutkan program sesuai jadwal',
            konselorNama: currentUser.name
          }
        ]
      } : permohonan.pengawasanKlien
    };

    onUpdatePermohonan(updated);

    // Call backend API
    try {
      if (permohonan.id) {
        await tindakLanjutApi.updatePelaksanaan(permohonan.id, {
          statusRujukan: newStatus,
          tanggalKonfirmasiFasilitas: updatedTindakLanjut.tanggalKonfirmasiFasilitas,
          tanggalMulaiLayanan: updatedTindakLanjut.tanggalMulaiLayanan,
          hambatanPelaksanaan: updatedTindakLanjut.hambatanPelaksanaan
        });
      }
    } catch (err) {
      console.warn('Backend updatePelaksanaan warning:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#1b3459]">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-teal-400" />
          <span>Pemantauan Rujukan & Realisasi Tindak Lanjut</span>
        </h3>
        <p className="text-xs text-slate-400">
          Memastikan layanan tidak berhenti saat surat diterbitkan; melacak penerimaan fasilitas, tanggal masuk, dan hambatan penempatan.
        </p>
      </div>

      {!permohonan.tindakLanjut ? (
        <div className="text-center py-12 text-slate-400">
          <Share2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold">Tindak lanjut belum dapat diproses.</p>
          <p className="text-xs text-slate-500 mt-1">Rujukan dikoordinasikan setelah rekomendasi resmi diterbitkan.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Status Rujukan Banner */}
          <div className={`p-4 rounded-xl border ${
            permohonan.tindakLanjut.statusRujukan === 'kapasitas_penuh'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : permohonan.tindakLanjut.statusRujukan === 'klien_mulai_layanan'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-[#0d213d] border-[#234b7d] text-white'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase block tracking-wider text-slate-300">Status Koordinasi Rujukan</span>
                <span className="text-base font-bold mt-0.5 block text-white">
                  {formatStatus(permohonan.tindakLanjut.statusRujukan)}
                </span>
              </div>
              <span className="text-xs bg-[#0b172a] px-3 py-1 rounded-full font-semibold border border-[#234b7d] text-[#D4AF37]">
                Fasilitas: {permohonan.tindakLanjut.namaFasilitasTujuan || 'Belum Ditentukan'}
              </span>
            </div>

            {permohonan.tindakLanjut.hambatanPelaksanaan && (
              <div className="mt-3 p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-200">
                <strong className="text-rose-100">Hambatan Nyata:</strong> {permohonan.tindakLanjut.hambatanPelaksanaan}
              </div>
            )}
          </div>

          {/* Facility Action Box for Rehabilitasi Role */}
          {(currentUser.role === 'rehabilitasi' || currentUser.role === 'sekretariat' || currentUser.role === 'ADMIN') && (
            <div className="border border-teal-500/40 bg-teal-950/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-300 text-xs flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Aksi Khusus Petugas Fasilitas Rehabilitasi:</span>
                </span>
                <span className="text-[10px] bg-teal-900/60 text-teal-200 font-semibold px-2 py-0.5 rounded border border-teal-700/60">
                  Mandat Layanan
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {permohonan.tindakLanjut.statusRujukan !== 'diterima_fasilitas' && permohonan.tindakLanjut.statusRujukan !== 'klien_mulai_layanan' && (
                  <button
                    onClick={() => handleRehabAction('terima')}
                    className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-teal-500 cursor-pointer transition-all shadow-none"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Konfirmasi Ketersediaan Kuota & Jadwal Terima</span>
                  </button>
                )}

                {permohonan.tindakLanjut.statusRujukan !== 'klien_mulai_layanan' && (
                  <button
                    onClick={() => handleRehabAction('admisi')}
                    className="bg-[#133863] hover:bg-[#1a4a82] text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-emerald-500 cursor-pointer transition-all shadow-none"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Konfirmasi Klien Masuk Layanan (Admisi Selesai)</span>
                  </button>
                )}

                {permohonan.tindakLanjut.statusRujukan !== 'kapasitas_penuh' && (
                  <button
                    onClick={() => {
                      const reason = window.prompt('Masukkan catatan kendala / kuota penuh:', 'Kapasitas ruang rawat inap sedang terisi penuh 100%.');
                      if (reason) handleRehabAction('penuh', reason);
                    }}
                    className="bg-rose-900/60 hover:bg-rose-900/80 text-rose-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 border border-rose-500/50 cursor-pointer transition-all shadow-none"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-300" />
                    <span>Laporkan Kuota Penuh / Kendala</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Rincian Tindak Lanjut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-2 text-slate-300">
              <h4 className="font-bold text-white">Pelaksanaan Rujukan Rehabilitasi</h4>
              <p>Fasilitas Rujukan: <strong className="text-white">{permohonan.tindakLanjut.namaFasilitasTujuan}</strong></p>
              <p>Kontak: <span className="text-slate-300">{permohonan.tindakLanjut.kontakFasilitas}</span></p>
              <p>Rujukan Dikirim: <span className="text-slate-300">{permohonan.tindakLanjut.tanggalRujukanDikirim || '-'}</span></p>
              <p>Konfirmasi Fasilitas: <span className="text-slate-300">{permohonan.tindakLanjut.tanggalKonfirmasiFasilitas || '-'}</span></p>
              <p>Tanggal Masuk Layanan: <strong className="text-white">{permohonan.tindakLanjut.tanggalMulaiLayanan || 'Menunggu ketersediaan kuota'}</strong></p>
            </div>

            <div className="border border-[#1b3459] rounded-xl p-4 bg-[#081224] space-y-2 text-slate-300">
              <h4 className="font-bold text-white">Status Proses Perkara Hukum Terkait</h4>
              <p className="text-slate-300 leading-relaxed">
                {permohonan.tindakLanjut.statusProsesHukumTerkait || 'Penyidikan berjalan sesuai ketentuan hukum berkeadilan restoratif.'}
              </p>
              <div className="pt-2 border-t border-[#1b3459] text-[11px] text-slate-400">
                Penanggung Jawab Tindak Lanjut: <strong className="text-white">{permohonan.tindakLanjut.penanggungJawabTindakLanjut}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
