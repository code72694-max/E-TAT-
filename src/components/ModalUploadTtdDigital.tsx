import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, AlertCircle, CheckCircle2, RefreshCw, PenTool, Image as ImageIcon, Sparkles, ArrowLeft, ArrowRight, Check, FileCheck, FileText } from 'lucide-react';

interface ModalUploadTtdDigitalProps {
  isOpen: boolean;
  onClose: () => void;
  permohonanNomor: string;
  asesorNama: string;
  peranTitle: string;
  onSaveSignature: (file: File) => Promise<void>;
  onOpenBeritaAcara?: () => void;
}

export const ModalUploadTtdDigital: React.FC<ModalUploadTtdDigitalProps> = ({
  isOpen,
  onClose,
  permohonanNomor,
  asesorNama,
  peranTitle,
  onSaveSignature,
  onOpenBeritaAcara,
}) => {
  const [step, setStep] = useState<'input' | 'review' | 'success'>('input');
  const [activeTab, setActiveTab] = useState<'upload' | 'draw'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isTransparent, setIsTransparent] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('input');
      setSelectedFile(null);
      setPreviewUrl(null);
      setValidationError(null);
      setIsTransparent(null);
      setHasDrawn(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle file selection
  const handleFileChange = (file: File) => {
    setValidationError(null);
    setIsTransparent(null);

    // Validate extension / mimetype
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    if (!isPng) {
      setValidationError('Berkas wajib berformat PNG (.png). Format JPG/JPEG tidak mendukung latar transparan.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setValidationError('Ukuran file maksimal 3 MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Analyze image transparency
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = Math.min(img.width, 200);
        offscreen.height = Math.min(img.height, 200);
        const ctx = offscreen.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
          const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;
          let foundTransparent = false;
          // Check alpha channel (every 4th byte)
          for (let i = 3; i < imgData.length; i += 4) {
            if (imgData[i] < 200) {
              foundTransparent = true;
              break;
            }
          }
          setIsTransparent(foundTransparent);
          if (!foundTransparent) {
            setValidationError('Peringatan: Gambar tidak terdeteksi transparan (memiliki background putih/solid). Pastikan latar belakang sudah dihapus agar hasil tempel di dokumen rapi.');
          }
        }
      } catch (e) {
        setIsTransparent(true);
      }
      // Otomatis beralih ke tahap review setelah berkas siap
      setStep('review');
    };
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#051838'; // professional dark ink
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveDrawn = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `ttd_digital_${Date.now()}.png`, { type: 'image/png' });
        handleFileChange(file);
      }
    }, 'image/png');
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    try {
      await onSaveSignature(selectedFile);
      // Pindah ke step sukses (menampilkan tombol Lihat Berita Acara)
      setStep('success');
    } catch (err) {
      console.error(err);
      alert('Gagal menempelkan tanda tangan ke dokumen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0b172a] border border-[#1b3459] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1b3459]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#142642] text-[#d4af37] rounded-xl border border-[#234475] shrink-0">
              <PenTool className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Tanda Tangan Digital Asesor Pleno</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  PNG Transparan
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kasus: <strong className="text-slate-200">{permohonanNomor}</strong> &bull; Asesor: <strong className="text-slate-200">{asesorNama}</strong> ({peranTitle})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142642] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        {step !== 'success' && (
          <div className="flex items-center justify-center space-x-3 text-xs">
            <div className={`flex items-center space-x-1.5 font-bold ${
              step === 'input' ? 'text-blue-400' : 'text-emerald-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                step === 'input' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {step === 'review' ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <span>1. Unggah / Buat TTD</span>
            </div>

            <span className="text-slate-600">&rarr;</span>

            <div className={`flex items-center space-x-1.5 font-bold ${
              step === 'review' ? 'text-[#d4af37]' : 'text-slate-500'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                step === 'review' ? 'bg-[#d4af37] text-[#0b172a]' : 'bg-[#142642] text-slate-400'
              }`}>
                2
              </span>
              <span>2. Review &amp; Tempel ke Dokumen</span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1: INPUT (UPLOAD FILE OR DRAW)                      */}
        {/* ========================================================= */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* Petunjuk & Tata Cara */}
            <div className="bg-[#071326] border border-[#d4af37]/40 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-[#d4af37] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Tata Cara &amp; Ketentuan Tanda Tangan:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
                <li>
                  Format file wajib berupa <strong>PNG (.png)</strong> dengan latar belakang <strong>Transparan</strong> (tanpa latar putih/warna).
                </li>
                <li>
                  Setelah diunggah, Anda akan masuk ke <strong>Tahap Review</strong> untuk memeriksa tampilan tanda tangan di atas surat sebelum ditempelkan.
                </li>
                <li>
                  Gunakan tab <strong>&quot;Gores di Layar&quot;</strong> jika ingin membuat tanda tangan langsung yang 100% otomatis transparan.
                </li>
              </ul>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-[#1b3459] gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-[#142642] text-white border-t border-x border-[#234475]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#142642]/50'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah File PNG Transparan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('draw')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'draw'
                    ? 'bg-[#142642] text-white border-t border-x border-[#234475]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#142642]/50'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Gores di Layar (Digital Pad)</span>
              </button>
            </div>

            {/* Sub-Tab 1: Upload File */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-[#1b3459] hover:border-blue-500/60 rounded-xl p-8 text-center bg-[#050e1c] transition-colors relative">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                      e.target.value = '';
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#142642] text-blue-400 flex items-center justify-center mx-auto border border-[#234475]">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Klik atau seret file PNG transparan ke sini</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Wajib file .PNG &bull; Maksimal 3 MB</p>
                    </div>
                  </div>
                </div>

                {validationError && (
                  <div className="p-3 rounded-xl border bg-rose-950/50 border-rose-500/40 text-rose-200 flex items-start space-x-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 2: Draw on Screen */}
            {activeTab === 'draw' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Goreskan tanda tangan Anda dengan mouse atau sentuhan jari di kanvas bawah ini:
                </p>
                <div className="border-2 border-dashed border-[#234475] rounded-xl bg-white p-2 flex justify-center shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair w-full max-w-[500px] h-[160px] touch-none"
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="px-3 py-1.5 bg-[#142642] hover:bg-[#1b3459] text-slate-300 border border-[#234475] rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Bersihkan Kanvas</span>
                  </button>
                  <button
                    type="button"
                    disabled={!hasDrawn}
                    onClick={handleSaveDrawn}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Lanjut ke Review</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: REVIEW (PRATINJAU & GUNAKAN INI BARU TEMPEL)      */}
        {/* ========================================================= */}
        {step === 'review' && previewUrl && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Status Info Bar */}
            <div className="p-3 bg-[#071326] border border-[#1b3459] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">
                  File: <strong className="text-slate-200">{selectedFile?.name || 'Tanda Tangan Digital'}</strong> ({((selectedFile?.size || 0) / 1024).toFixed(1)} KB)
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                isTransparent === true
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}>
                {isTransparent === true ? '✅ Latar Transparan Terverifikasi' : '⚠️ Latar Belakang Perlu Diperiksa'}
              </span>
            </div>

            {/* Validation Notice if background is solid */}
            {isTransparent === false && (
              <div className="p-3 bg-amber-950/50 border border-amber-500/40 rounded-xl flex items-start space-x-2.5 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Perhatian: Tanda tangan ini terdeteksi memiliki latar belakang solid/putih. Jika ditempelkan ke surat, kotak putih akan menutupi garis dokumen. Sebaiknya gunakan gambar berlatar transparan.
                </span>
              </div>
            )}

            {/* Dual Review Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Review 1: Transparent Checkerboard */}
              <div className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">1. Uji Transparansi (Checkerboard):</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Latar kotak-kotak harus tembus di sela-sela tanda tangan:
                </p>
                <div 
                  className="rounded-lg p-4 flex items-center justify-center h-36 border border-slate-700 shadow-inner"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                    backgroundColor: '#0f172a'
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Tanda Tangan Checkerboard"
                    className="max-h-32 max-w-full object-contain filter drop-shadow"
                  />
                </div>
              </div>

              {/* Review 2: Document Mock Paper */}
              <div className="bg-[#050e1c] border border-[#1b3459] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">2. Simulasi di Berita Acara:</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Tampilan persis ketika dicetak di lembar resmi TAT:
                </p>
                <div className="bg-white rounded-lg p-3 text-center border border-slate-300 shadow-sm flex flex-col justify-end h-36">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                    {peranTitle}
                  </div>
                  <div className="flex items-end justify-center h-24 pb-1">
                    <img
                      src={previewUrl}
                      alt="Tanda Tangan Dokumen"
                      className="max-h-24 max-w-[160px] object-contain"
                    />
                  </div>
                  <div className="border-t border-black inline-block min-w-[140px] mx-auto pt-0.5">
                    <span className="font-bold text-[10px] text-black block leading-none">{asesorNama}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 italic">
              Jika hasil pratinjau sudah sesuai, klik tombol <strong>&quot;Gunakan Ini &amp; Tempel ke Dokumen&quot;</strong> di bawah.
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: SUCCESS (MODAL BERHASIL & LIHAT BERITA ACARA)      */}
        {/* ========================================================= */}
        {step === 'success' && (
          <div className="py-6 px-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white">
                Tanda Tangan Berhasil Ditempelkan!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Tanda tangan digital Anda telah sah tertempel pada lembar Berita Acara Sidang Pleno untuk nomor permohonan <strong className="text-[#d4af37] font-mono">{permohonanNomor}</strong>.
              </p>
            </div>

            <div className="bg-[#071326] border border-[#1b3459] rounded-xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#1b3459]/80 pb-2">
                <span className="text-slate-400">Nama Asesor:</span>
                <span className="font-bold text-white">{asesorNama}</span>
              </div>
              <div className="flex justify-between border-b border-[#1b3459]/80 pb-2">
                <span className="text-slate-400">Peran:</span>
                <span className="font-semibold text-blue-300">{peranTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Sidang Pleno:</span>
                <span className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesai &amp; TTD Sah</span>
                </span>
              </div>
            </div>

            {/* Tombol Aksi di Modal Berhasil */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              {onOpenBeritaAcara && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenBeritaAcara();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-[#e8c84a] hover:to-amber-400 text-[#0b172a] font-extrabold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/50 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Lihat Berita Acara Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#142642] hover:bg-[#1b3459] text-slate-300 border border-[#234475] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup &amp; Kembali ke Pleno
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FOOTER ACTIONS (STEP 1 & 2)                               */}
        {/* ========================================================= */}
        {step !== 'success' && (
          <div className="flex items-center justify-between pt-3 border-t border-[#1b3459]">
            {step === 'input' ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 border border-[#234475] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <div className="text-xs text-slate-500 italic">
                  Pilih atau buat tanda tangan untuk mereview
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-2 bg-[#142642] hover:bg-[#1b3459] text-slate-300 border border-[#234475] rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ganti / Unggah Ulang</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menempelkan ke Berita Acara...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Gunakan Ini &amp; Tempel ke Dokumen</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
