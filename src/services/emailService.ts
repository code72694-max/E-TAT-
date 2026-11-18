import { PermohonanAsesmen } from '../types';

export const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';

// Fallback opsional jika didefinisikan di environment
export const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_NOTIFICATION_EMAIL || '';

// Konstanta backward-compatibility (tidak lagi di-hardcode ke fungsi)
export const TARGET_EMAIL = DEFAULT_ADMIN_EMAIL;
export const PENGAJU_EMAIL = '';

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Normalisasi dan validasi daftar alamat email (bisa string tunggal, koma/spasi-separated, atau array string).
 */
export function normalizeRecipients(input?: string | string[] | null): string[] {
  if (!input) return [];
  const list = Array.isArray(input) ? input : input.split(/[,;\s]+/);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleaned = list
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 3 && emailRegex.test(e));
  return Array.from(new Set(cleaned));
}

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  fromName?: string;
}

/**
 * Fungsi kirim email dinamis via Resend API
 */
export async function sendEmailDirect(payload: SendEmailPayload): Promise<SendEmailResult> {
  const recipients = normalizeRecipients(payload.to);
  if (recipients.length === 0) {
    return {
      success: false,
      error: 'Tidak ada alamat email tujuan yang valid.',
    };
  }

  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY belum disetel (VITE_RESEND_API_KEY). Pengiriman email disimulasikan:', {
      to: recipients,
      subject: payload.subject,
    });
    return {
      success: true,
      id: `sim-${Date.now()}`,
    };
  }

  try {
    const fromAddress = import.meta.env.VITE_EMAIL_FROM || 'E-TAT POLRI <noreply@e-tatsiappulih.com>';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.fromName ? `${payload.fromName} <noreply@e-tatsiappulih.com>` : fromAddress,
        to: recipients,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    const data = await response.json();
    if (response.ok && data.id) {
      return { success: true, id: data.id };
    } else {
      return { success: false, error: data.message || JSON.stringify(data) };
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Gagal terhubung ke layanan Resend API' };
  }
}

/**
 * Kirim notifikasi pengajuan permohonan asesmen baru ke tujuan dinamis
 * (Ditentukan oleh pemanggil: admin / penyidik pengaju)
 */
export async function sendPengajuanEmailNotification(
  permohonan: PermohonanAsesmen,
  targetEmail?: string | string[]
): Promise<SendEmailResult> {
  const recipients = normalizeRecipients(
    targetEmail || (permohonan.pengajuEmail ? [permohonan.pengajuEmail] : (DEFAULT_ADMIN_EMAIL ? [DEFAULT_ADMIN_EMAIL] : []))
  );

  if (recipients.length === 0) {
    return {
      success: false,
      error: 'Alamat email tujuan notifikasi pengajuan belum ditentukan.',
    };
  }

  const currentUrl = `${window.location.origin}${window.location.pathname}?permohonanId=${permohonan.id}`;

  const bbRows = permohonan.perkara?.barangBuktiList?.length
    ? permohonan.perkara.barangBuktiList.map(
        bb => `
        <tr style="border-bottom: 1px solid #1b3459;">
          <td style="padding: 6px 10px; color: #cbd5e1;">${bb.jenisZat}</td>
          <td style="padding: 6px 10px; color: #f59e0b; font-weight: bold; font-family: monospace;">${bb.beratBersihGram ? `${bb.beratBersihGram} Gram` : '-'}</td>
          <td style="padding: 6px 10px; color: #94a3b8;">${bb.keterangan || '-'}</td>
        </tr>`
      ).join('')
    : `<tr><td colspan="3" style="padding: 8px; color: #64748b; text-align: center;">Tidak ada barang bukti tercatat</td></tr>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Notifikasi Pengajuan TAT Baru</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #081224; color: #e2e8f0; margin: 0; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #0b172a; border: 1px solid #1b3459; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <div style="background-color: #030712; padding: 20px 24px; border-bottom: 2px solid #D4AF37; text-align: center;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
            ⚖️ SISTEM E-TAT POLRI / BNN RI
          </h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">
            Notifikasi Otomatis Pengajuan Asesmen Terpadu Perkara Narkotika
          </p>
        </div>

        <div style="padding: 24px;">
          <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
            <p style="margin: 0; color: #34d399; font-weight: bold; font-size: 14px;">
              📌 PENGAJUAN PERMOHONAN ASESMEN BARU MASUK
            </p>
            <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 12px;">
              Permohonan dengan Nomor <strong>${permohonan.nomorPermohonan}</strong> telah resmi terdaftar dan membutuhkan tindakan verifikasi berkas oleh Sekretariat TAT.
            </p>
          </div>

          <h3 style="color: #D4AF37; border-bottom: 1px solid #1b3459; padding-bottom: 8px; font-size: 14px; margin-top: 0;">
            👤 DATA POKOK TERPERIKSA
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8; width: 35%;">Nama Lengkap</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #ffffff; font-weight: bold;">
                ${permohonan.terperiksa.namaLengkap} ${permohonan.terperiksa.alias ? `(alias ${permohonan.terperiksa.alias})` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">NIK Kependudukan</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1; font-family: monospace;">${permohonan.terperiksa.nik || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">TTL / Usia / Jenis Kelamin</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1;">
                ${permohonan.terperiksa.tempatLahir}, ${permohonan.terperiksa.tanggalLahir} (${permohonan.terperiksa.usia || 25} Tahun / ${permohonan.terperiksa.jenisKelamin})
              </td>
            </tr>
          </table>

          <h3 style="color: #D4AF37; border-bottom: 1px solid #1b3459; padding-bottom: 8px; font-size: 14px; margin-top: 15px;">
            ⚖️ DETAIL PERKARA & PENYIDIKAN
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8; width: 35%;">No. Laporan Polisi</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #ffffff; font-weight: bold; font-family: monospace;">
                ${permohonan.perkara?.nomorLaporanPolisi || '-'}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Instansi Penyidik</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #ffffff;">
                ${permohonan.instansiPengaju} (Penyidik: ${permohonan.pengajuNama})
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Pasal Sangkaan</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #f59e0b; font-weight: bold;">
                ${permohonan.perkara?.pasalDipersangkakan || '-'}
              </td>
            </tr>
          </table>

          <h3 style="color: #D4AF37; border-bottom: 1px solid #1b3459; padding-bottom: 8px; font-size: 14px; margin-top: 15px;">
            📦 BARANG BUKTI NARKOTIKA
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <thead>
              <tr style="background-color: #050e1c; color: #94a3b8; border-bottom: 1px solid #1b3459;">
                <th style="padding: 6px 10px; text-align: left;">Jenis Zat</th>
                <th style="padding: 6px 10px; text-align: left;">Berat</th>
                <th style="padding: 6px 10px; text-align: left;">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${bbRows}
            </tbody>
          </table>

          <div style="text-align: center; margin: 30px 0 20px 0;">
            <a href="${currentUrl}" target="_blank" style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; border: 1px solid #3b82f6; display: inline-block;">
              🔗 Buka Halaman Detail Pengajuan Langsung
            </a>
          </div>
        </div>

        <div style="background-color: #030712; padding: 14px 24px; border-top: 1px solid #1b3459; text-align: center; color: #64748b; font-size: 11px;">
          <p style="margin: 0;">Sistem Informasi & Manajemen Tim Asesmen Terpadu (E-TAT) POLRI - BNN RI</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmailDirect({
    to: recipients,
    subject: `[Pengajuan TAT Baru] ${permohonan.nomorPermohonan} - ${permohonan.terperiksa.namaLengkap}`,
    html: htmlContent,
  });
}

/**
 * Kirim notifikasi perintah perbaikan berkas ke email penyidik pengaju
 */
export async function sendCorrectionEmailNotification(
  permohonan: PermohonanAsesmen,
  invalidDocsNotes: string,
  targetEmail?: string | string[]
): Promise<SendEmailResult> {
  const recipients = normalizeRecipients(
    targetEmail || (permohonan.pengajuEmail ? [permohonan.pengajuEmail] : [])
  );

  if (recipients.length === 0) {
    return {
      success: false,
      error: 'Email penyidik pengaju tidak ditemukan untuk pengiriman notifikasi koreksi.',
    };
  }

  const currentUrl = `${window.location.origin}${window.location.pathname}?permohonanId=${permohonan.id}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Notifikasi Perlu Perbaikan Berkas</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #081224; color: #e2e8f0; margin: 0; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #0b172a; border: 1px solid #1b3459; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <div style="background-color: #030712; padding: 20px 24px; border-bottom: 2px solid #ef4444; text-align: center;">
          <h2 style="color: #f87171; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
            ⚠️ NOTIFIKASI PERLU PERBAIKAN BERKAS (E-TAT)
          </h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">
            Sekretariat Tim Asesmen Terpadu POLRI / BNN RI
          </p>
        </div>

        <div style="padding: 24px;">
          <div style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0; color: #f87171; font-weight: bold; font-size: 14px;">
              Mohon Perbaiki Berkas Permohonan ${permohonan.nomorPermohonan}
            </p>
            <p style="margin: 6px 0 0 0; color: #e2e8f0; font-size: 13px;">
              Permohonan Pengajuan Asesmen atas nama terperiksa <strong>${permohonan.terperiksa.namaLengkap}</strong> (${permohonan.instansiPengaju}) memerlukan tindakan perbaikan / melengkapi berkas dari penyidik pengaju.
            </p>
          </div>

          <h4 style="color: #f59e0b; margin-top: 15px; font-size: 13px;">📋 Catatan Koreksi Sekretariat TAT:</h4>
          <div style="background-color: #081224; border: 1px solid #1b3459; border-radius: 8px; padding: 14px; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
            ${invalidDocsNotes}
          </div>

          <div style="text-align: center; margin: 28px 0 15px 0;">
            <a href="${currentUrl}" target="_blank" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">
              📤 Unggah Perbaikan Berkas Permohonan
            </a>
          </div>
        </div>

        <div style="background-color: #030712; padding: 14px 24px; border-top: 1px solid #1b3459; text-align: center; color: #64748b; font-size: 11px;">
          <p style="margin: 0;">Sistem Informasi E-TAT POLRI - BNN RI</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmailDirect({
    to: recipients,
    subject: `[Perlu Perbaikan Berkas] ${permohonan.nomorPermohonan} - ${permohonan.terperiksa.namaLengkap}`,
    html: htmlContent,
  });
}

export interface PenjadwalanEmailOptions {
  permohonan: PermohonanAsesmen;
  tipe: 'medis' | 'hukum' | 'pleno' | 'semua';
  targetRecipients?: string | string[]; // Ditentukan oleh admin saat penjadwalan
  asesorNama: string;
  asesorEmail?: string;
  jadwal: string;
  lokasi?: string;
  catatan?: string;
}

/**
 * Kirim notifikasi penjadwalan & penugasan asesmen ke email asesor dan/atau pengaju yang ditentukan admin.
 */
export async function sendPenjadwalanEmailNotification(
  options: PenjadwalanEmailOptions
): Promise<SendEmailResult> {
  const {
    permohonan,
    tipe,
    targetRecipients,
    asesorNama,
    asesorEmail,
    jadwal,
    lokasi,
    catatan,
  } = options;

  // Kumpulkan alamat tujuan dinamis: dari input form penjadwalan admin, email asesor terpilih, dan email pengaju
  const dynamicTargets: string[] = [];
  if (targetRecipients) {
    if (Array.isArray(targetRecipients)) dynamicTargets.push(...targetRecipients);
    else dynamicTargets.push(targetRecipients);
  }
  if (asesorEmail) dynamicTargets.push(asesorEmail);

  const recipients = normalizeRecipients(dynamicTargets);

  if (recipients.length === 0) {
    return {
      success: false,
      error: 'Alamat email tujuan penjadwalan belum ditentukan. Pilih akun asesor dengan email valid atau masukkan email tujuan.',
    };
  }

  const currentUrl = `${window.location.origin}${window.location.pathname}?permohonanId=${permohonan.id}`;

  const tipeLabel =
    tipe === 'medis'
      ? 'Pemeriksaan Asesmen Medis & Klinis'
      : tipe === 'hukum'
      ? 'Pemeriksaan Asesmen & Telaah Hukum'
      : tipe === 'pleno'
      ? 'Sidang Pleno Terpadu (TAT)'
      : 'Penetapan Jadwal Asesmen Terpadu';

  const badgeColor =
    tipe === 'medis'
      ? '#10b981'
      : tipe === 'hukum'
      ? '#3b82f6'
      : '#d97706';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Penugasan & Penjadwalan Asesmen TAT</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #081224; color: #e2e8f0; margin: 0; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #0b172a; border: 1px solid #1b3459; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Header Kop -->
        <div style="background-color: #030712; padding: 20px 24px; border-bottom: 2px solid #D4AF37; text-align: center;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
            ⚖️ SISTEM E-TAT POLRI / BNN RI
          </h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">
            Surat Pemberitahuan Penugasan &amp; Jadwal Pemeriksaan Asesmen
          </p>
        </div>

        <div style="padding: 24px;">
          <!-- Banner Penugasan -->
          <div style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
            <div style="display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; background-color: ${badgeColor}; color: #ffffff; text-transform: uppercase; margin-bottom: 6px;">
              ${tipeLabel}
            </div>
            <p style="margin: 4px 0 0 0; color: #f1f5f9; font-size: 13px; line-height: 1.5;">
              Ditetapkan penugasan kepada <strong>${asesorNama}</strong> untuk melaksanakan tahapan asesmen perkara nomor <strong>${permohonan.nomorPermohonan}</strong>.
            </p>
          </div>

          <!-- Rincian Jadwal & Penugasan -->
          <h3 style="color: #D4AF37; border-bottom: 1px solid #1b3459; padding-bottom: 8px; font-size: 14px; margin-top: 0;">
            📅 RINCIAN JADWAL & LOKASI PEMERIKSAAN
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8; width: 35%;">Tahapan / Jenis</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #ffffff; font-weight: bold;">
                ${tipeLabel}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Asesor Ditugaskan</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #38bdf8; font-weight: bold;">
                ${asesorNama} ${asesorEmail ? `(${asesorEmail})` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Waktu / Tanggal Pelaksanaan</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #fbbf24; font-weight: bold; font-family: monospace;">
                ${jadwal}
              </td>
            </tr>
            ${lokasi ? `
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Lokasi / Faskes</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #e2e8f0;">
                📍 ${lokasi}
              </td>
            </tr>` : ''}
            ${catatan ? `
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Catatan Admin</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1; font-style: italic;">
                ${catatan}
              </td>
            </tr>` : ''}
          </table>

          <!-- Data Terperiksa & Perkara -->
          <h3 style="color: #D4AF37; border-bottom: 1px solid #1b3459; padding-bottom: 8px; font-size: 14px; margin-top: 15px;">
            👤 DATA TERPERIKSA & PERKARA
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8; width: 35%;">Nama Terperiksa</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #ffffff; font-weight: bold;">
                ${permohonan.terperiksa.namaLengkap} ${permohonan.terperiksa.alias ? `(alias ${permohonan.terperiksa.alias})` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">NIK / TTL</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1;">
                ${permohonan.terperiksa.nik || '-'} / ${permohonan.terperiksa.tempatLahir}, ${permohonan.terperiksa.tanggalLahir}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">No. Laporan Polisi</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1; font-family: monospace;">
                ${permohonan.perkara?.nomorLaporanPolisi || '-'}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Instansi Pengaju</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1;">
                ${permohonan.instansiPengaju} (Penyidik: ${permohonan.pengajuNama})
              </td>
            </tr>
          </table>

          <!-- Direct Link Action Button -->
          <div style="text-align: center; margin: 30px 0 20px 0;">
            <a href="${currentUrl}" target="_blank" style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; border: 1px solid #3b82f6; display: inline-block;">
              🔗 Buka Berkas &amp; Masuk ke Form Asesmen
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #030712; padding: 14px 24px; border-top: 1px solid #1b3459; text-align: center; color: #64748b; font-size: 11px;">
          <p style="margin: 0;">Sistem Informasi & Manajemen Tim Asesmen Terpadu (E-TAT) POLRI - BNN RI</p>
          <p style="margin: 4px 0 0 0; color: #475569;">Email ini dikirimkan otomatis kepada pihak yang ditugaskan oleh Admin Sekretariat TAT.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmailDirect({
    to: recipients,
    subject: `[Jadwal Asesmen TAT] ${tipeLabel} - ${permohonan.terperiksa.namaLengkap} (${permohonan.nomorPermohonan})`,
    html: htmlContent,
  });
}
