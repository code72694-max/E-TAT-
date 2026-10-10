import { PermohonanAsesmen } from '../types';

export const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
export const TARGET_EMAIL = 'etatsiappulih@gmail.com';

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendPengajuanEmailNotification(
  permohonan: PermohonanAsesmen,
  targetEmail: string = TARGET_EMAIL
): Promise<SendEmailResult> {
  const currentUrl = window.location.origin + window.location.pathname + `?permohonanId=${permohonan.id}`;

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

  const docRows = permohonan.dokumenList?.length
    ? permohonan.dokumenList.map(
        doc => `
        <tr style="border-bottom: 1px solid #1b3459;">
          <td style="padding: 6px 10px; color: #e2e8f0;">${doc.nama}</td>
          <td style="padding: 6px 10px; text-align: center;">
            <span style="padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; ${
              doc.statusVerifikasi === 'sesuai'
                ? 'background-color: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4);'
                : 'background-color: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.4);'
            }">
              ${doc.statusVerifikasi === 'sesuai' ? 'Terverifikasi' : 'Dilampirkan'}
            </span>
          </td>
        </tr>`
      ).join('')
    : `<tr><td colspan="2" style="padding: 8px; color: #64748b; text-align: center;">Belum ada dokumen</td></tr>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Notifikasi Pengajuan TAT Baru</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #081224; color: #e2e8f0; margin: 0; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #0b172a; border: 1px solid #1b3459; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Header Kop -->
        <div style="background-color: #030712; padding: 20px 24px; border-bottom: 2px solid #D4AF37; text-align: center;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
            ⚖️ SISTEM E-TAT POLRI / BNN RI
          </h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">
            Notifikasi Otomatis Pengajuan Asesmen Terpadu Perkara Narkotika
          </p>
        </div>

        <!-- Notification Banner -->
        <div style="padding: 24px;">
          <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
            <p style="margin: 0; color: #34d399; font-weight: bold; font-size: 14px;">
              📌 PENGAJUAN PERMOHONAN ASESMEN BARU MASUK
            </p>
            <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 12px;">
              Permohonan dengan Nomor <strong>${permohonan.nomorPermohonan}</strong> telah resmi terdaftar dan membutuhkan tindakan verifikasi berkas oleh Sekretariat TAT.
            </p>
          </div>

          <!-- Section 1: Data Pokok Terperiksa -->
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

          <!-- Section 2: Detail Perkara -->
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

          <!-- Direct Link Action Button -->
          <div style="text-align: center; margin: 30px 0 20px 0;">
            <a href="${currentUrl}" target="_blank" style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; border: 1px solid #3b82f6; display: inline-block;">
              🔗 Buka Halaman Detail Pengajuan Langsung
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #030712; padding: 14px 24px; border-top: 1px solid #1b3459; text-align: center; color: #64748b; font-size: 11px;">
          <p style="margin: 0;">Sistem Informasi & Manajemen Tim Asesmen Terpadu (E-TAT) POLRI - BNN RI</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'E-TAT POLRI <onboarding@resend.dev>',
        to: [targetEmail],
        subject: `[Pengajuan TAT Baru] ${permohonan.nomorPermohonan} - ${permohonan.terperiksa.namaLengkap}`,
        html: htmlContent
      })
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

export async function sendCorrectionEmailNotification(
  permohonan: PermohonanAsesmen,
  invalidDocsNotes: string,
  targetEmail: string = TARGET_EMAIL
): Promise<SendEmailResult> {
  const currentUrl = window.location.origin + window.location.pathname + `?permohonanId=${permohonan.id}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Notifikasi Perlu Perbaikan Berkas</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #081224; color: #e2e8f0; margin: 0; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #0b172a; border: 1px solid #1b3459; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Header Kop -->
        <div style="background-color: #030712; padding: 20px 24px; border-bottom: 2px solid #ef4444; text-align: center;">
          <h2 style="color: #f87171; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
            ⚠️ NOTIFIKASI PERLU PERBAIKAN BERKAS (E-TAT)
          </h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">
            Sekretariat Tim Asesmen Terpadu POLRI / BNN RI
          </p>
        </div>

        <!-- Content -->
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

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'E-TAT POLRI <onboarding@resend.dev>',
        to: [targetEmail],
        subject: `[Perlu Perbaikan Berkas] ${permohonan.nomorPermohonan} - ${permohonan.terperiksa.namaLengkap}`,
        html: htmlContent
      })
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
