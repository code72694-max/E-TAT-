import React, { useState } from 'react';
import {
  PermohonanAsesmen,
  UserProfile,
  PengawasanKlien,
  JurnalPengawasan,
  TesUrinBerkala,
  SuratPeringatanKlien
} from '../types';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  UserCheck,
  Shield,
  FileCheck,
  PlusCircle,
  AlertOctagon,
  Scale,
  Award,
  Stethoscope,
  Building2,
  FileText,
  BadgeAlert
} from 'lucide-react';

interface PengawasanPascaTatSectionProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
}

export const PengawasanPascaTatSection: React.FC<PengawasanPascaTatSectionProps> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan
}) => {
  const [showAddJurnalModal, setShowAddJurnalModal] = useState(false);
  const [showAddUrinModal, setShowAddUrinModal] = useState(false);
  const [showIssueSpModal, setShowIssueSpModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Form states for adding Jurnal
  const [jurnalKegiatan, setJurnalKegiatan] = useState<JurnalPengawasan['jenisKegiatan']>('Wajib Lapor Mingguan');
  const [jurnalKehadiran, setJurnalKehadiran] = useState<JurnalPengawasan['statusKehadiran']>('Hadir');
  const [jurnalCatatan, setJurnalCatatan] = useState('');

  // Form states for adding Urine test
  const [urinJenis, setUrinJenis] = useState<'Terjadwal' | 'Acak (Random)'>('Terjadwal');
  const [urinHasil, setUrinHasil] = useState<'Negatif' | 'Positif'>('Negatif');
  const [urinKeterangan, setUrinKeterangan] = useState('Hasil skrining cepat toksikologi menunjukkan non-reaktif.');

  // Form states for SP
  const [spTingkat, setSpTingkat] = useState<SuratPeringatanKlien['tingkatSp']>('SP-1 (Peringatan Awal)');
  const [spAlasan, setSpAlasan] = useState('Klien tidak hadir dalam sesi wajib lapor tanpa keterangan atau izin sah.');

  // Form states for Certificate
  const [skspPredikat, setSkspPredikat] = useState<'Selesai Baik (Pulih Produktif)' | 'Selesai Cukup'>('Selesai Baik (Pulih Produktif)');

  const canManage = currentUser.role === 'rehabilitasi' || currentUser.role === 'sekretariat' || currentUser.role === 'pengaju' || currentUser.role === 'koordinator';

  // If permohonan doesn't have pengawasanKlien yet, provide an initialize button
  if (!permohonan.pengawasanKlien) {
    return (
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-950/40 text-[#F1C40F] border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
          <Activity className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-base font-bold text-white">Program Pengawasan Klien Belum Diaktifkan</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Pengawasan klien pasca TAT aktif setelah surat rekomendasi terbit dan klien mulai menjalani layanan di fasilitas rehabilitasi atau kesepakatan diversi/RJ disahkan.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              const nowStr = new Date().toLocaleDateString('id-ID');
              const initialPengawasan: PengawasanKlien = {
                id: 'pgw-' + Date.now(),
                statusKepatuhan: 'patuh',
                modalitasLayanan: permohonan.asesmenMedis?.kebutuhanRawat === 'Rawat Inap' ? 'Rawat Inap' : 'Rawat Jalan',
                durasiBulan: permohonan.asesmenMedis?.durasiUsulanBulan || 3,
                tanggalMulai: nowStr,
                tanggalTargetSelesai: '3 Bulan Sejak Masuk',
                instansiPelaksanaRehab: permohonan.tindakLanjut?.namaFasilitasTujuan || 'Klinik Pratama BNN Mitra',
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
                    keterangan: 'Skrining intake awal masuk program rehabilitasi.',
                    petugasPemeriksa: currentUser.name
                  }
                ],
                jurnalPengawasan: [
                  {
                    id: 'jrn-' + Date.now(),
                    tanggal: nowStr,
                    jenisKegiatan: 'Konseling Individu',
                    statusKehadiran: 'Hadir',
                    catatanPerkembangan: 'Intake awal dan penandatanganan komitmen kepatuhan program pengawasan pasca TAT.',
                    petugasPengawas: currentUser.name,
                    instansiPengawas: currentUser.agency
                  }
                ],
                rekomendasiTindakLanjutHukum: 'Lanjut Rehabilitasi'
              };

              const updated: PermohonanAsesmen = {
                ...permohonan,
                pengawasanKlien: initialPengawasan,
                auditLogs: [
                  {
                    id: 'aud-' + Date.now(),
                    timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    actorNama: currentUser.name,
                    actorPeran: currentUser.role,
                    aksi: 'Aktivasi Pengawasan Klien Pasca TAT',
                    rincian: `Program pengawasan diaktifkan dengan modalitas ${initialPengawasan.modalitasLayanan}`
                  },
                  ...permohonan.auditLogs
                ]
              };
              onUpdatePermohonan(updated);
            }}
            className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white text-xs font-semibold px-4 py-2 rounded-lg inline-flex items-center space-x-2 border border-[#2d7ad6]/70 shadow-lg cursor-pointer"
          >
            <Activity className="w-4 h-4 text-[#38bdf8]" />
            <span>Aktifkan Buku Pengawasan Klien Pasca TAT Sekarang</span>
          </button>
        )}
      </div>
    );
  }

  const pgw = permohonan.pengawasanKlien;
  const progressPercent = Math.min(100, Math.round((pgw.sesiTerselesaikan / pgw.totalSesiWajib) * 100));

  // Handler: Add Jurnal Entry
  const handleSaveJurnal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jurnalCatatan.trim()) return;

    const isMangkir = jurnalKehadiran === 'Mangkir / Tanpa Kabar';
    const newMangkirCount = isMangkir ? pgw.jumlahMangkir + 1 : pgw.jumlahMangkir;
    const newSesiCount = jurnalKehadiran === 'Hadir' ? pgw.sesiTerselesaikan + 1 : pgw.sesiTerselesaikan;

    let newStatusKepatuhan = pgw.statusKepatuhan;
    if (newMangkirCount >= 2) {
      newStatusKepatuhan = 'tidak_patuh_mangkir';
    } else if (newMangkirCount === 1) {
      newStatusKepatuhan = 'dalam_peringatan';
    }

    const newEntry: JurnalPengawasan = {
      id: 'jrn-' + Date.now(),
      tanggal: new Date().toLocaleDateString('id-ID'),
      jenisKegiatan: jurnalKegiatan,
      statusKehadiran: jurnalKehadiran,
      catatanPerkembangan: jurnalCatatan.trim(),
      petugasPengawas: currentUser.name,
      instansiPengawas: currentUser.agency
    };

    const updatedPengawasan: PengawasanKlien = {
      ...pgw,
      sesiTerselesaikan: newSesiCount,
      jumlahMangkir: newMangkirCount,
      statusKepatuhan: newStatusKepatuhan,
      jurnalPengawasan: [newEntry, ...pgw.jurnalPengawasan]
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      pengawasanKlien: updatedPengawasan,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Pencatatan Jurnal Pengawasan Klien',
          rincian: `${jurnalKegiatan} (${jurnalKehadiran}): ${jurnalCatatan.slice(0, 60)}...`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
    setJurnalCatatan('');
    setShowAddJurnalModal(false);
  };

  // Handler: Add Urine Test
  const handleSaveUrin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUrin: TesUrinBerkala = {
      id: 'urin-' + Date.now(),
      tanggalTes: new Date().toLocaleDateString('id-ID'),
      tahapKe: pgw.riwayatTesUrinBerkala.length + 1,
      jenisPemeriksaan: urinJenis,
      parameter: ['AMP', 'MET', 'THC', 'BZO', 'MOP'],
      hasil: urinHasil,
      keterangan: urinKeterangan.trim(),
      petugasPemeriksa: currentUser.name
    };

    const isRelapse = urinHasil === 'Positif';
    const updatedPengawasan: PengawasanKlien = {
      ...pgw,
      statusKepatuhan: isRelapse ? 'tidak_patuh_mangkir' : pgw.statusKepatuhan,
      rekomendasiTindakLanjutHukum: isRelapse ? 'Pencabutan Hak RJ / Lanjut Sidang' : pgw.rekomendasiTindakLanjutHukum,
      riwayatTesUrinBerkala: [newUrin, ...pgw.riwayatTesUrinBerkala]
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      pengawasanKlien: updatedPengawasan,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Input Hasil Tes Urin Berkala Pasca TAT',
          rincian: `Uji ke-${newUrin.tahapKe} (${urinJenis}): Hasil ${urinHasil}`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
    setShowAddUrinModal(false);
  };

  // Handler: Issue Warning Letter (SP)
  const handleIssueSp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spAlasan.trim()) return;

    const newSp: SuratPeringatanKlien = {
      nomorSp: `SP-${pgw.suratPeringatanList.length + 1}/TAT-AWAS/${permohonan.nomorPermohonan.replace(/\//g, '-')}/${new Date().getFullYear()}`,
      tingkatSp: spTingkat,
      tanggalSp: new Date().toLocaleDateString('id-ID'),
      alasan: spAlasan.trim(),
      diterbitkanOleh: `${currentUser.name} (${currentUser.agency})`
    };

    const updatedPengawasan: PengawasanKlien = {
      ...pgw,
      statusKepatuhan: spTingkat.includes('SP-3') ? 'tidak_patuh_mangkir' : 'dalam_peringatan',
      rekomendasiTindakLanjutHukum: spTingkat.includes('SP-3') ? 'Pencabutan Hak RJ / Lanjut Sidang' : pgw.rekomendasiTindakLanjutHukum,
      suratPeringatanList: [newSp, ...pgw.suratPeringatanList]
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      pengawasanKlien: updatedPengawasan,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: `Penerbitan ${spTingkat}`,
          rincian: `${newSp.nomorSp}: ${spAlasan}`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
    setShowIssueSpModal(false);
  };

  // Handler: Complete Program
  const handleCompleteProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPengawasan: PengawasanKlien = {
      ...pgw,
      statusKepatuhan: 'selesai_program',
      rekomendasiTindakLanjutHukum: 'Diusulkan Surat Keterangan Selesai',
      suratKeteranganSelesai: {
        nomorSurat: `SKSP-TAT/${permohonan.id.toUpperCase()}/${new Date().getFullYear()}/BNN-POLRI`,
        tanggalTerbit: new Date().toLocaleDateString('id-ID'),
        predikat: skspPredikat,
        ditandatanganiOleh: `${currentUser.name} & Tim Terpadu TAT`
      }
    };

    const updated: PermohonanAsesmen = {
      ...permohonan,
      pengawasanKlien: updatedPengawasan,
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: 'Penerbitan Surat Keterangan Selesai Program (SKSP)',
          rincian: `Program pengawasan pasca TAT tuntas dengan predikat ${skspPredikat}`
        },
        ...permohonan.auditLogs
      ]
    };

    onUpdatePermohonan(updated);
    setShowFinishModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>Pengawasan Klien Pasca TAT (Aftercare & Monitoring)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mekanisme terpadu pemantauan kehadiran wajib lapor, skrining toksikologi urin berkala, dan penegakan kepatuhan hukum berkeadilan restoratif.
          </p>
        </div>

        {canManage && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddJurnalModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Catat Wajib Lapor / Sesi</span>
            </button>
            <button
              onClick={() => setShowAddUrinModal(true)}
              className="bg-[#144782] hover:bg-[#1a5599] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-[#2d7ad6]/60 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Input Tes Urin Berkala</span>
            </button>
            <button
              onClick={() => setShowIssueSpModal(true)}
              className="bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#F1C40F]" />
              <span>Terbitkan Peringatan (SP)</span>
            </button>
            {!pgw.suratKeteranganSelesai && (
              <button
                onClick={() => setShowFinishModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Terbitkan SK Selesai</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* COMPLIANCE STATUS SCORECARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Card 1: Status Kepatuhan */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">Status Kepatuhan Klien</span>
          <div className="mt-2">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                pgw.statusKepatuhan === 'sangat_patuh'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : pgw.statusKepatuhan === 'patuh'
                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                  : pgw.statusKepatuhan === 'dalam_peringatan'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  : pgw.statusKepatuhan === 'selesai_program'
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                  : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
              }`}
            >
              {pgw.statusKepatuhan === 'sangat_patuh' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              {pgw.statusKepatuhan === 'patuh' && <UserCheck className="w-3.5 h-3.5 text-[#38bdf8]" />}
              {pgw.statusKepatuhan === 'dalam_peringatan' && <AlertTriangle className="w-3.5 h-3.5 text-[#F1C40F]" />}
              {pgw.statusKepatuhan === 'selesai_program' && <Award className="w-3.5 h-3.5 text-purple-400" />}
              {pgw.statusKepatuhan === 'tidak_patuh_mangkir' && <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />}
              <span className="capitalize">{pgw.statusKepatuhan.replace(/_/g, ' ')}</span>
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1b3459] text-[11px] text-slate-400">
            Jumlah Mangkir: <strong className={pgw.jumlahMangkir > 0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>{pgw.jumlahMangkir} Kali</strong>
          </div>
        </div>

        {/* Card 2: Progress Sesi Kehadiran */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Progres Sesi Wajib</span>
            <span className="text-xs font-bold text-slate-200">{progressPercent}%</span>
          </div>
          <div className="mt-2">
            <div className="text-lg font-extrabold text-white">
              {pgw.sesiTerselesaikan} <span className="text-xs font-medium text-slate-400">/ {pgw.totalSesiWajib} Sesi</span>
            </div>
            <div className="w-full bg-[#081224] h-2 rounded-full overflow-hidden mt-1.5 border border-[#1b3459]">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent >= 100 ? 'bg-emerald-400' : 'bg-teal-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1b3459] text-[11px] text-slate-400">
            Modalitas: <strong className="text-slate-200">{pgw.modalitasLayanan} ({pgw.durasiBulan} Bulan)</strong>
          </div>
        </div>

        {/* Card 3: Skrining Toksikologi Urin */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">Skrining Toksikologi Urin</span>
          <div className="mt-2">
            <div className="text-lg font-extrabold text-white flex items-center space-x-1.5">
              <span>{pgw.riwayatTesUrinBerkala.length}x Diuji</span>
              {pgw.riwayatTesUrinBerkala.every(t => t.hasil === 'Negatif') ? (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  100% Bersih
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-full">
                  Terindikasi Zat
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tes Terakhir: {pgw.riwayatTesUrinBerkala[0]?.tanggalTes || '-'} ({pgw.riwayatTesUrinBerkala[0]?.hasil || '-'})
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1b3459] text-[11px] text-slate-400">
            Parameter: AMP, MET, THC, BZO, MOP
          </div>
        </div>

        {/* Card 4: Rekomendasi Status Hukum */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400">Rekomendasi Hukum</span>
          <div className="mt-2">
            <span className={`text-xs font-bold block ${
              pgw.rekomendasiTindakLanjutHukum.includes('Pencabutan') ? 'text-rose-400' : 'text-slate-200'
            }`}>
              {pgw.rekomendasiTindakLanjutHukum}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Target Tuntas: <strong className="text-slate-200">{pgw.tanggalTargetSelesai}</strong>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1b3459] text-[11px] text-slate-400">
            Penyidik Pengawas: <strong className="text-slate-200">{pgw.penyidikPengawas}</strong>
          </div>
        </div>
      </div>

      {/* SURAT KETERANGAN SELESAI BANNER (IF ISSUED) */}
      {pgw.suratKeteranganSelesai && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-start space-x-3 text-emerald-200">
          <Award className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h4 className="font-bold text-sm text-emerald-300">SURAT KETERANGAN SELESAI PROGRAM PASCA TAT (SKSP) TELAH DITERBITKAN</h4>
              <span className="text-xs font-mono bg-[#0b172a] text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                {pgw.suratKeteranganSelesai.nomorSurat}
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Klien telah menuntaskan seluruh rangkaian rehabilitasi & kewajiban wajib lapor dengan predikat <strong>{pgw.suratKeteranganSelesai.predikat}</strong>. Dokumen ini sah digunakan oleh Penyidik dan Penuntut Umum sebagai bukti pemenuhan syarat Restorative Justice / diversi hukum.
            </p>
            <div className="text-[11px] text-emerald-300/80 pt-1">
              Diterbitkan pada {pgw.suratKeteranganSelesai.tanggalTerbit} oleh {pgw.suratKeteranganSelesai.ditandatanganiOleh}.
            </div>
          </div>
        </div>
      )}

      {/* SURAT PERINGATAN (SP) LIST (IF ANY) */}
      {pgw.suratPeringatanList.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-[#F1C40F]" />
            <span>Peringatan Resmi Kepatuhan Klien ({pgw.suratPeringatanList.length} Surat Diterbitkan)</span>
          </h4>
          {pgw.suratPeringatanList.map((sp, idx) => (
            <div key={idx} className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <BadgeAlert className="w-4 h-4 text-amber-400" />
                  <span>{sp.tingkatSp}</span>
                  <span className="font-mono text-[11px] font-normal text-amber-300/80">({sp.nomorSp})</span>
                </span>
                <span className="text-[11px] text-amber-300/80">Diterbitkan: {sp.tanggalSp}</span>
              </div>
              <p className="text-slate-200 leading-relaxed bg-[#0b172a] p-2.5 rounded-lg border border-[#1b3459]">
                {sp.alasan}
              </p>
              <div className="text-[11px] text-slate-400">
                Penanggung Jawab: <strong className="text-slate-200">{sp.diterbitkanOleh}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TWO COLUMNS: LEFT = URINE TESTS, RIGHT = JURNAL PENGAWASAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMN 1: TES URIN BERKALA */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-[#38bdf8]" />
                <span>Riwayat Pengujian Toksikologi Urin Berkala</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Uji laboratorium acak & terjadwal untuk menjamin zero-relapse.</p>
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddUrinModal(true)}
                className="text-xs text-[#38bdf8] hover:text-white font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Tambah Tes</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {pgw.riwayatTesUrinBerkala.map(tes => (
              <div
                key={tes.id}
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  tes.hasil === 'Negatif' ? 'bg-[#081224] border-[#1b3459]' : 'bg-rose-950/30 border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">Uji Ke-{tes.tahapKe}</span>
                    <span className="text-[10px] bg-[#0b172a] border border-[#1b3459] text-slate-300 px-1.5 py-0.5 rounded font-medium">
                      {tes.jenisPemeriksaan}
                    </span>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] border ${
                      tes.hasil === 'Negatif' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {tes.hasil.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>Tanggal: <strong className="text-slate-200">{tes.tanggalTes}</strong></span>
                  <span>•</span>
                  <span>Pemeriksa: {tes.petugasPemeriksa}</span>
                </div>
                {tes.keterangan && (
                  <p className="text-slate-300 text-[11px] pt-1 border-t border-[#1b3459]">
                    {tes.keterangan}
                  </p>
                )}
                <div className="flex items-center space-x-1 pt-1">
                  <span className="text-[10px] text-slate-500">Parameter diuji:</span>
                  {tes.parameter.map(p => (
                    <span key={p} className="text-[9px] bg-[#0b172a] border border-[#1b3459] text-slate-300 px-1 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: JURNAL PENGAWASAN & WAJIB LAPOR */}
        <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Jurnal Pengawasan, Konseling & Wajib Lapor</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Catatan kehadiran sesi dan perkembangan psikososial klien.</p>
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddJurnalModal(true)}
                className="text-xs text-teal-400 hover:text-white font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Catat Sesi</span>
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {pgw.jurnalPengawasan.map(jrn => {
              const isHadir = jrn.statusKehadiran === 'Hadir';
              const isIzin = jrn.statusKehadiran === 'Izin Sah';
              const isMangkir = jrn.statusKehadiran === 'Mangkir / Tanpa Kabar';

              return (
                <div
                  key={jrn.id}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    isMangkir
                      ? 'bg-rose-950/30 border-rose-500/40'
                      : isIzin
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-[#081224] border-[#1b3459]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{jrn.jenisKegiatan}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isHadir
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : isIzin
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {jrn.statusKehadiran}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{jrn.catatanPerkembangan}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-400 pt-1 border-t border-[#1b3459]">
                    <span>Petugas: {jrn.petugasPengawas} ({jrn.instansiPengawas})</span>
                    <span>{jrn.tanggal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TEAM PENGAWASAN CARD */}
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-xl p-4 text-xs space-y-2">
        <h4 className="font-bold text-white flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#38bdf8]" />
          <span>Tim Koordinasi Pengawasan Klien Terpadu</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-[#081224] p-3 rounded-lg border border-[#1b3459]">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Lembaga Rehabilitasi</span>
            <span className="font-bold text-white block mt-0.5">{pgw.instansiPelaksanaRehab}</span>
            <span className="text-slate-400 block text-[11px]">Konselor: {pgw.konselorPendamping}</span>
          </div>

          <div className="bg-[#081224] p-3 rounded-lg border border-[#1b3459]">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Penyidik Pengawas</span>
            <span className="font-bold text-white block mt-0.5">{permohonan.instansiPengaju}</span>
            <span className="text-slate-400 block text-[11px]">Penyidik: {pgw.penyidikPengawas}</span>
          </div>

          <div className="bg-[#081224] p-3 rounded-lg border border-[#1b3459]">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Pengawasan Bapas / Eksternal</span>
            <span className="font-bold text-white block mt-0.5">
              {pgw.petugasBapas || 'Pengawasan Melekat Satresnarkoba & Keluarga'}
            </span>
            <span className="text-slate-400 block text-[11px]">Koordinasi Kejaksaan & Pengadilan</span>
          </div>
        </div>
      </div>

      {/* MODAL: ADD JURNAL ENTRY */}
      {showAddJurnalModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
              <h4 className="font-bold text-sm text-white">Catat Sesi / Wajib Lapor Klien</h4>
              <button
                onClick={() => setShowAddJurnalModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJurnal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Jenis Kegiatan Pengawasan</label>
                <select
                  value={jurnalKegiatan}
                  onChange={e => setJurnalKegiatan(e.target.value as any)}
                  className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="Wajib Lapor Mingguan">Wajib Lapor Mingguan</option>
                  <option value="Konseling Individu">Konseling Individu</option>
                  <option value="Sesi Terapi Kelompok">Sesi Terapi Kelompok</option>
                  <option value="Home Visit (Kunjungan Rumah)">Home Visit (Kunjungan Rumah)</option>
                  <option value="Pemeriksaan Urin">Pemeriksaan Urin</option>
                  <option value="Evaluasi Vokasional">Evaluasi Vokasional</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Status Kehadiran Klien</label>
                <select
                  value={jurnalKehadiran}
                  onChange={e => setJurnalKehadiran(e.target.value as any)}
                  className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white font-medium focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="Hadir">Hadir (Memenuhi Kewajiban)</option>
                  <option value="Izin Sah">Izin Sah (Dengan Surat Sakit / Tugas Resmi)</option>
                  <option value="Mangkir / Tanpa Kabar">Mangkir / Tanpa Kabar (Pelanggaran)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Catatan Perkembangan & Keterangan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan catatan kondisi emosional, kepatuhan, atau alasan ketidakhadiran..."
                  value={jurnalCatatan}
                  onChange={e => setJurnalCatatan(e.target.value)}
                  className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#1b3459]">
                <button
                  type="button"
                  onClick={() => setShowAddJurnalModal(false)}
                  className="px-3 py-1.5 border border-[#1b3459] text-slate-300 rounded-lg hover:bg-[#14233c] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-1.5 rounded-lg cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD URINE TEST */}
      {showAddUrinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
              <h4 className="font-bold text-sm text-white">Input Hasil Tes Toksikologi Urin Berkala</h4>
              <button
                onClick={() => setShowAddUrinModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUrin} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Jenis Pemeriksaan</label>
                <div className="flex space-x-4 text-slate-200">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urinJenis"
                      checked={urinJenis === 'Terjadwal'}
                      onChange={() => setUrinJenis('Terjadwal')}
                    />
                    <span>Terjadwal (Sesuai Kalender)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urinJenis"
                      checked={urinJenis === 'Acak (Random)'}
                      onChange={() => setUrinJenis('Acak (Random)')}
                    />
                    <span>Uji Acak (Mendadak)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Hasil Skrining Laboratorium</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urinHasil"
                      checked={urinHasil === 'Negatif'}
                      onChange={() => {
                        setUrinHasil('Negatif');
                        setUrinKeterangan('Hasil uji toksikologi urin negatif / non-reaktif.');
                      }}
                    />
                    <span className="text-emerald-400 font-bold">NEGATIF (Bersih)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urinHasil"
                      checked={urinHasil === 'Positif'}
                      onChange={() => {
                        setUrinHasil('Positif');
                        setUrinKeterangan('Indikasi kekambuhan (relapse): Terdeteksi zat metabolit narkotika.');
                      }}
                    />
                    <span className="text-rose-400 font-bold">POSITIF (Relapse)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Catatan Analisis Lab</label>
                <textarea
                  rows={3}
                  value={urinKeterangan}
                  onChange={e => setUrinKeterangan(e.target.value)}
                  className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#1b3459]">
                <button
                  type="button"
                  onClick={() => setShowAddUrinModal(false)}
                  className="px-3 py-1.5 border border-[#1b3459] text-slate-300 rounded-lg hover:bg-[#14233c] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#144782] via-[#17549c] to-[#1c64b8] hover:from-[#175194] hover:via-[#1c60b0] hover:to-[#2274d4] text-white font-semibold px-4 py-1.5 rounded-lg border border-[#2d7ad6]/60 cursor-pointer"
                >
                  Simpan Hasil Tes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ISSUE WARNING (SP) */}
      {showIssueSpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
              <h4 className="font-bold text-sm text-amber-300 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-[#F1C40F]" />
                <span>Terbitkan Surat Peringatan Kepatuhan (SP)</span>
              </h4>
              <button
                onClick={() => setShowIssueSpModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueSp} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Tingkat Surat Peringatan</label>
                <select
                  value={spTingkat}
                  onChange={e => setSpTingkat(e.target.value as any)}
                  className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white font-medium focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="SP-1 (Peringatan Awal)">SP-1 (Peringatan Awal - Mangkir 1x)</option>
                  <option value="SP-2 (Peringatan Keras)">SP-2 (Peringatan Keras - Mangkir 2x)</option>
                  <option value="SP-3 (Rekomendasi Pencabutan RJ)">SP-3 (Rekomendasi Pencabutan RJ / Drop Out)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Alasan / Uraian Pelanggaran</label>
                <textarea
                  rows={4}
                  required
                  value={spAlasan}
                  onChange={e => setSpAlasan(e.target.value)}
                  className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-500/40 text-[11px] text-amber-200">
                Penerbitan SP akan tercatat pada sistem e-TAT dan ditembuskan ke Penyidik Polresta/BNN serta Jaksa Penuntut Umum.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#1b3459]">
                <button
                  type="button"
                  onClick={() => setShowIssueSpModal(false)}
                  className="px-3 py-1.5 border border-[#1b3459] text-slate-300 rounded-lg hover:bg-[#14233c] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-1.5 rounded-lg cursor-pointer"
                >
                  Terbitkan Peringatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FINISH PROGRAM & CERTIFICATE */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b3459]">
              <h4 className="font-bold text-sm text-emerald-300 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Terbitkan Surat Keterangan Selesai Program (SKSP)</span>
              </h4>
              <button
                onClick={() => setShowFinishModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteProgram} className="space-y-3 text-xs">
              <p className="text-slate-300">
                Tindakan ini menyatakan bahwa klien terperiksa telah menyelesaikan durasi rehabilitasi serta seluruh sesi pengawasan pasca TAT.
              </p>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Predikat Kelulusan Program</label>
                <select
                  value={skspPredikat}
                  onChange={e => setSkspPredikat(e.target.value as any)}
                  className="w-full border border-[#1b3459] rounded-lg p-2 bg-[#081224] text-white font-semibold focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="Selesai Baik (Pulih Produktif)">Selesai Baik (Pulih Produktif & Nihil Relapse)</option>
                  <option value="Selesai Cukup">Selesai Cukup (Kompensasi Sesi Terpenuhi)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/40 text-[11px] text-emerald-200">
                Dokumen SKSP akan diterbitkan secara sah dan dilampirkan pada laporan akhir pengawasan untuk diserahkan ke Penyidik & Pengadilan.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#1b3459]">
                <button
                  type="button"
                  onClick={() => setShowFinishModal(false)}
                  className="px-3 py-1.5 border border-[#1b3459] text-slate-300 rounded-lg hover:bg-[#14233c] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg cursor-pointer"
                >
                  Terbitkan Sertifikat SKSP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
