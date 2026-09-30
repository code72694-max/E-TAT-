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
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Pekerjaan & Alamat</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1;">
                ${permohonan.terperiksa.pekerjaan || '-'} &bull; ${permohonan.terperiksa.alamatDomisili || permohonan.terperiksa.alamatKtp || '-'}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Pendamping / Wali</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1;">
                ${permohonan.terperiksa.namaWaliPendamping || '-'} (${permohonan.terperiksa.kontakWali || '-'})
              </td>
            </tr>
          </table>

          <!-- Section 2: Detail Perkara & Penyidikan -->
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
                ${permohonan.instansiPengaju} (Penyidik: ${permohonan.pengajuNama} / HP: ${permohonan.perkara?.nomorHpPenyidik || '-'})
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Pasal Sangkaan</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #f59e0b; font-weight: bold;">
                ${permohonan.perkara?.pasalDipersangkakan || '-'}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">TKP & Penangkapan</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #cbd5e1;">
                ${permohonan.perkara?.tempatKejadianPerkara || '-'} (${permohonan.perkara?.tanggalWaktuPenangkapan || '-'})
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8;">Kronologi Singkat</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #1b3459; color: #94a3b8; font-style: italic;">
                "${permohonan.perkara?.kronologiSingkat || '-'}"
              </td>
            </tr>
          </table>

          <!-- Section 3: Barang Bukti disita -->
          <h3 style="color: #D4AF37; border-bottom: 1px solid #1b3459; padding-bottom: 8px; font-size: 14px; margin-top: 15px;">
            📦 BARANG BUKTI DISITA
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
            <thead>
              <tr style="background-color: #081224; border-bottom: 1px solid #1b3459; color: #94a3b8; text-align: left;">
                <th style="padding: 6px 10px;">Jenis Barang Bukti</th>
                <th style="padding: 6px 10px;">Berat / Jumlah</th>
                <th style="padding: 6px 10px;">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${bbRows}
            </tbody>
          </table>

          <!-- Section 4: Dokumen Lampiran Persyaratan -->
          <h3 style="color: #D4AF37; border-bottom: 1px solid #1b3459; padding-bottom: 8px; font-size: 14px; margin-top: 15px;">
            📄 DOKUMEN PERSYARATAN TERLAMPIR
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 11px;">
            <thead>
              <tr style="background-color: #081224; border-bottom: 1px solid #1b3459; color: #94a3b8; text-align: left;">
                <th style="padding: 6px 10px;">Nama Dokumen Persyaratan</th>
                <th style="padding: 6px 10px; text-align: center;">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              ${docRows}
            </tbody>
          </table>

          <!-- Direct Link Action Button -->
          <div style="text-align: center; margin: 30px 0 20px 0;">
            <a href="${currentUrl}" target="_blank" style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; border: 1px solid #3b82f6; display: inline-block; box-shadow: 0 4px 15px rgba(29,78,216,0.5);">
              🔗 Buka Halaman Detail Pengajuan Langsung
            </a>
          </div>
          <p style="text-align: center; color: #64748b; font-size: 11px; margin-top: 10px;">
            URL Sistem E-TAT: <a href="${currentUrl}" style="color: #60a5fa;">${currentUrl}</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #030712; padding: 14px 24px; border-top: 1px solid #1b3459; text-align: center; color: #64748b; font-size: 11px;">
          <p style="margin: 0;">Sistem Informasi & Manajemen Tim Asesmen Terpadu (E-TAT) POLRI - BNN RI</p>
          <p style="margin: 4px 0 0 0;">Email notifikasi ini dikirimkan ke: <strong>${targetEmail}</strong></p>
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
