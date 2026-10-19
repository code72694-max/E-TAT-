import React, { useState } from 'react';
import {
  PermohonanAsesmen,
  DokumenPersyaratan,
  UserProfile,
  StatusVerifikasiDokumen,
} from '../../types';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  Send,
  FileText,
  Mail,
  ExternalLink,
  ShieldAlert,
  Clock,
  Printer
} from 'lucide-react';
import { permohonanApi } from '../../services/api';
import { sendCorrectionEmailNotification } from '../../services/emailService';
import { SuratJawabanModal } from '../SuratJawabanModal';

interface TabAdministrasiProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  effectiveReadonly: boolean;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
  onNavigateTab: (tab: any) => void;
}

export const TabAdministrasi: React.FC<TabAdministrasiProps> = ({
  permohonan,
  currentUser,
  effectiveReadonly,
  onUpdatePermohonan,
  onNavigateTab,
}) => {
  const [showSuratJawaban, setShowSuratJawaban] = useState(false);
  const [previewDocModal, setPreviewDocModal] = useState<DokumenPersyaratan | null>(null);
  const [emailBanner, setEmailBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const docs = permohonan.dokumenList && permohonan.dokumenList.length > 0
    ? permohonan.dokumenList
    : [];

  const validDocsCount = docs.filter(d => d.statusVerifikasi === 'sesuai').length;
  const invalidDocsCount = docs.filter(d => d.statusVerifikasi === 'perlu_perbaikan').length;
  const totalDocsCount = docs.length || 7;
  const percentComplete = Math.round((validDocsCount / (totalDocsCount || 1)) * 100);

  const handleVerifyDocument = async (docId: string, status: StatusVerifikasiDokumen, note?: string) => {
    const updatedDocs = docs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          statusVerifikasi: status,
          catatanKoreksi: note || doc.catatanKoreksi,
        };
      }
      return doc;
    });

    const hasErrors = updatedDocs.some(d => d.wajib && d.statusVerifikasi === 'perlu_perbaikan');
    const allApproved = updatedDocs.filter(d => d.wajib).every(d => d.statusVerifikasi === 'sesuai');

    const updated: PermohonanAsesmen = {
      ...permohonan,
      dokumenList: updatedDocs,
      applicationStatus: hasErrors ? 'NEEDS_CORRECTION' : allApproved ? 'AWAITING_DISPOSITION' : 'ADMIN_REVIEW',
      statusProsesUtama: hasErrors ? 'perlu_perbaikan' : allApproved ? 'verifikasi_berkas' : 'verifikasi_berkas',
      penanggungJawabBerikutnya: hasErrors ? 'Penyidik Pengaju' : allApproved ? 'Ketua TAT (via Admin)' : 'Sekretariat TAT',
      tindakanBerikutnyaLabel: hasErrors
        ? `Perlu Perbaikan Berkas Permohonan ${permohonan.nomorPermohonan}`
        : allApproved
        ? 'Administrasi lengkap & diverifikasi. Menunggu catatan disposisi dari Ketua TAT.'
        : 'Sedang dalam proses verifikasi berkas oleh Sekretariat.',
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          actorNama: currentUser.name,
          actorPeran: currentUser.role,
          aksi: status === 'perlu_perbaikan' ? 'Minta Perbaikan Berkas' : 'Verifikasi Berkas Sesuai',
          rincian: status === 'perlu_perbaikan'
            ? `Dokumen '${docId}' perlu perbaikan: ${note || '-'}`
            : `Dokumen '${docId}' diverifikasi sesuai dan absah.`
        },
        ...(permohonan.auditLogs || [])
      ]
    };

    onUpdatePermohonan(updated);

    if (permohonan.id) {
      if (status === 'perlu_perbaikan') {
        permohonanApi.mintaPerbaikan(permohonan.id, note || 'Perlu perbaikan berkas').catch(err => {
          console.warn('Backend mintaPerbaikan notice:', err);
        });
      } else if (allApproved) {
        permohonanApi.verifikasi(permohonan.id, {
          dokumenStatus: updatedDocs.map(d => ({
            dokumenId: d.id,
            statusVerifikasi: d.statusVerifikasi,
            catatanKoreksi: d.catatanKoreksi
          }))
        }).catch(err => {
          console.warn('Backend verifikasi notice:', err);
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Email / Notification Alert Banner */}
      {emailBanner && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in ${
          emailBanner.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{emailBanner.message}</span>
          </div>
          <button onClick={() => setEmailBanner(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3459]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Verifikasi 7 Berkas Administrasi Persyaratan Formil</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pemeriksaan keabsahan stempel basah, tanda tangan penyidik, dan kelengkapan yuridis sesuai Perber 2014.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSuratJawaban(true)}
            className="bg-[#142642] hover:bg-[#1a345a] text-[#D4AF37] border border-[#234475] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Draft Surat Jawaban</span>
          </button>
        </div>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tingkat Kelengkapan Berkas</span>
          <div className="text-xl font-bold font-mono text-emerald-400">{percentComplete}%</div>
          <p className="text-[11px] text-slate-400">{validDocsCount} dari {totalDocsCount} berkas berstatus valid.</p>
        </div>

        <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Berkas Perlu Koreksi</span>
          <div className={`text-xl font-bold font-mono ${invalidDocsCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {invalidDocsCount} Dokumen
          </div>
          <p className="text-[11px] text-slate-400">{invalidDocsCount > 0 ? 'Penyidik wajib mengunggah perbaikan.' : 'Tidak ada catatan koreksi aktif.'}</p>
        </div>

        <div className="bg-[#081224] border border-[#1b3459] rounded-xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Wewenang Verifikasi</span>
          <div className="text-sm font-bold text-white mt-1">Sekretariat TAT Polri / BNN</div>
          <p className="text-[11px] text-slate-400">Verifikator: {currentUser.name} ({currentUser.role})</p>
        </div>
      </div>

      {/* Checklist List */}
      <div className="space-y-3">
        {docs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-[#081224] border border-[#1b3459] rounded-2xl">
            <p className="text-xs">Daftar berkas persyaratan sedang dimuat dari server...</p>
          </div>
        ) : (
          docs.map((doc, idx) => {
            const isApproved = doc.statusVerifikasi === 'sesuai';
            const isCorrection = doc.statusVerifikasi === 'perlu_perbaikan';

            return (
              <div
                key={doc.id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  isApproved
                    ? 'bg-[#081224] border-emerald-500/30'
                    : isCorrection
                    ? 'bg-[#18110b] border-amber-500/40'
                    : 'bg-[#081224] border-[#1b3459]'
                } flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                    isApproved
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : isCorrection
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-xs">{doc.nama}</span>
                      {doc.wajib && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.2 rounded font-semibold">
                          Wajib
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold border ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isCorrection
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isApproved ? 'Sesuai / Sah' : isCorrection ? 'Perlu Perbaikan' : 'Belum Diperiksa'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {doc.keterangan || 'Berkas wajib diverifikasi keaslian dan stempel dinasnya.'}
                    </p>

                    {doc.catatanKoreksi && (
                      <p className="text-[11px] text-amber-300 bg-amber-950/30 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                        <strong>Catatan Koreksi:</strong> {doc.catatanKoreksi}
                      </p>
                    )}
                  </div>
                </div>

                {/* Document Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#142642] hover:bg-[#1a345a] text-sky-300 border border-[#234475] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Berkas</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setPreviewDocModal(doc)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preview Dokumen</span>
                    </button>
                  )}

                  {!effectiveReadonly && (
                    <div className="flex items-center space-x-1.5 pl-2 border-l border-[#1b3459]">
                      <button
                        onClick={() => handleVerifyDocument(doc.id, 'sesuai')}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isApproved
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 border-slate-700'
                        }`}
                        title="Tandai Sesuai & Sah"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const note = prompt(`Masukkan catatan koreksi untuk dokumen '${doc.nama}':`, doc.catatanKoreksi || '');
                          if (note !== null) {
                            handleVerifyDocument(doc.id, 'perlu_perbaikan', note);
                          }
                        }}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isCorrection
                            ? 'bg-amber-600 text-white border-amber-500'
                            : 'bg-slate-800 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 border-slate-700'
                        }`}
                        title="Minta Perbaikan / Koreksi Berkas"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Footer: Lanjut ke Penjadwalan & Disposisi */}
      {!effectiveReadonly && (
        <div className="p-4 bg-[#081224] border border-[#1b3459] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="text-xs text-slate-400">
            {percentComplete === 100 ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Seluruh berkas formil (100%) dinyatakan lengkap & valid. Siap disposisi ke penunjukan tim.</span>
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Kelengkapan berkas baru {percentComplete}%. Terdapat {invalidDocsCount} dokumen butuh perbaikan.</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {percentComplete === 100 ? (
              <button
                onClick={() => {
                  const updated: PermohonanAsesmen = {
                    ...permohonan,
                    applicationStatus: 'AWAITING_DISPOSITION',
                    statusProsesUtama: 'penjadwalan',
                    penanggungJawabBerikutnya: 'Sekretariat / Tim Asesor TAT',
                    tindakanBerikutnyaLabel: 'Administrasi lengkap & diverifikasi. Lanjutkan ke penetapan jadwal & penunjukan tim asesor.',
                  };
                  onUpdatePermohonan(updated);

                  if (permohonan.id) {
                    permohonanApi.verifikasi(permohonan.id, {
                      dokumenStatus: docs.map(d => ({
                        dokumenId: d.id,
                        statusVerifikasi: 'sesuai',
                        catatanKoreksi: '',
                      }))
                    }).catch(err => console.warn('Backend verifikasi notice:', err));

                    permohonanApi.disposisi(permohonan.id, {
                      disposisiHasil: 'disetujui',
                      disposisiAlasan: 'Seluruh berkas formil 100% lengkap & absah diverifikasi oleh Sekretariat.',
                      disposisiKetua: 'Ketua Tim Asesmen Terpadu',
                      disposisiJabatan: 'Ketua TAT',
                    }).catch(err => console.warn('Backend disposisi notice:', err));
                  }

                  onNavigateTab('jadwal');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-400 shadow flex items-center space-x-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesaikan Validasi & Disposisi ke Penjadwalan</span>
              </button>
            ) : (
              <button
                onClick={async () => {
                  const invalidSummary = docs
                    .filter(d => d.statusVerifikasi === 'perlu_perbaikan')
                    .map(d => `• ${d.nama}: ${d.catatanKoreksi || 'Perlu dilengkapi ulang'}`)
                    .join('\n');

                  const updated: PermohonanAsesmen = {
                    ...permohonan,
                    applicationStatus: 'NEEDS_CORRECTION',
                    statusProsesUtama: 'perlu_perbaikan',
                    penanggungJawabBerikutnya: 'Penyidik Pengaju',
                    tindakanBerikutnyaLabel: `Perlu Perbaikan Berkas Permohonan ${permohonan.nomorPermohonan}`,
                  };

                  onUpdatePermohonan(updated);

                  if (permohonan.id) {
                    permohonanApi.mintaPerbaikan(permohonan.id, invalidSummary || 'Silakan lengkapi berkas formil.').catch(err => {
                      console.warn('Backend mintaPerbaikan notice:', err);
                    });
                  }

                  try {
                    const res = await sendCorrectionEmailNotification(updated, invalidSummary.replace(/\n/g, '<br/>'));
                    if (res.success) {
                      setEmailBanner({
                        type: 'success',
                        message: `Perintah perbaikan telah dikirim ke penyidik via email resmi! (ID: ${res.id})`
                      });
                    }
                  } catch (err) {
                    console.warn('Email notify notice:', err);
                  }
                }}
                className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-amber-500 shadow flex items-center space-x-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirimkan Perintah Perbaikan ke Penyidik</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Surat Jawaban */}
      {showSuratJawaban && (
        <SuratJawabanModal
          permohonan={permohonan}
          currentUser={currentUser}
          onClose={() => setShowSuratJawaban(false)}
        />
      )}

      {/* Modal Simple Preview Dokumen */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span>{previewDocModal.nama}</span>
              </h4>
              <button onClick={() => setPreviewDocModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Status Berkas:</strong> <span className="capitalize">{previewDocModal.statusVerifikasi.replace(/_/g, ' ')}</span></p>
              <p><strong>Keterangan Regulasi:</strong> {previewDocModal.keterangan || '-'}</p>
              {previewDocModal.catatanKoreksi && (
                <p className="text-amber-300"><strong>Catatan Koreksi:</strong> {previewDocModal.catatanKoreksi}</p>
              )}
              {previewDocModal.fileUrl ? (
                <div className="pt-2">
                  <a href={previewDocModal.fileUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 font-mono">
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Dokumen PDF di Tab Baru
                  </a>
                </div>
              ) : (
                <p className="text-slate-500 italic pt-2">Dokumen fisik diarsipkan di map berkas perkara Sekretariat TAT.</p>
              )}
            </div>
            <div className="flex justify-end pt-3 border-t border-[#1b3459]">
              <button onClick={() => setPreviewDocModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
