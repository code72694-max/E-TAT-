import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { PermohonanAsesmen } from '../types';

interface QrCodeImgProps {
  value: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  onErrorCorrection?: QRCode.QRCodeErrorCorrectionLevel;
}

/**
 * Komponen QR Code yang merender Data URL PNG asli beresolusi tinggi.
 * Kompatibel 100% offline, dapat discan oleh kamera smartphone apapun,
 * dan tercetak sempurna di lembar dokumen fisik / Cetak PDF (window.print).
 */
export const QrCodeImg: React.FC<QrCodeImgProps> = ({
  value,
  size = 75,
  className = '',
  style = {},
  alt = 'QR Code Verifikasi Resmi e-TAT',
  onErrorCorrection = 'medium'
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    const opts: QRCode.QRCodeToDataURLOptions = {
      width: Math.max(160, size * 2.5), // High DPI untuk ketajaman scan & print
      margin: 1,
      errorCorrectionLevel: (onErrorCorrection || 'medium') as QRCode.QRCodeErrorCorrectionLevel,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };

    QRCode.toDataURL(value, opts)
      .then((url: string) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err: any) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, onErrorCorrection]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px`, ...style }}
        className={`bg-slate-100 flex items-center justify-center border border-slate-300 text-[9px] text-slate-400 font-mono ${className}`}
      >
        QR...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'block',
        ...style
      }}
      className={className}
    />
  );
};

/**
 * Menghasilkan tautan URL verifikasi publik yang lengkap dan langsung
 * mengarah ke halaman Lacak Berkas dengan parameter perkara & Berita Acara.
 */
export function buildLacakVerificationUrl(
  permohonan: PermohonanAsesmen,
  tab: string = 'pleno'
): string {
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'http://localhost:3000';

  const pId = permohonan.id || '';
  const noPermohonan = permohonan.nomorPermohonan || '';
  const trackingNo = permohonan.trackingNumber || '';
  const noBa = permohonan.sidangPleno?.nomorBeritaAcara || '';

  const params = new URLSearchParams();
  if (pId) params.set('id', pId);
  if (noPermohonan) params.set('nomor', noPermohonan);
  if (trackingNo) params.set('track', trackingNo);
  if (noBa) params.set('ba', noBa);
  if (tab) params.set('tab', tab);
  params.set('source', 'qr_tte');

  return `${origin}/lacak?${params.toString()}`;
}
