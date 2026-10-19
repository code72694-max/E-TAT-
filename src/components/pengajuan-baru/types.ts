export interface DocTemplateItem {
  id: string;
  kode: string;
  nama: string;
  wajib: boolean;
  keterangan: string;
}

export const getDocTemplates = (jenisPengajuan: string): DocTemplateItem[] => {
  const baseDocs: DocTemplateItem[] = [
    { id: 'doc-surat', kode: 'SURAT_PERMOHONAN', nama: 'Surat Permohonan Asesmen dari Penyidik', wajib: true, keterangan: 'Tandatangan resmi pimpinan' },
    { id: 'doc-ktp', kode: 'IDENTITAS_KTP', nama: 'Fotokopi KTP / KK / Identitas Terperiksa', wajib: true, keterangan: 'Bukti identitas kependudukan terperiksa' },
    { id: 'doc-lp', kode: 'LAPORAN_POLISI', nama: 'Laporan Polisi (LP) / Laporan Kasus Narkotika', wajib: true, keterangan: 'Surat tanda penerimaan laporan polisi' },
    { id: 'doc-bap', kode: 'BAP_TERPERIKSA', nama: 'Berita Acara Pemeriksaan (BAP) Tersangka / Interogasi', wajib: true, keterangan: 'Pengakuan dan keterangan awal peran terperiksa' },
    { id: 'doc-sp-tangkap', kode: 'SP_TANGKAP', nama: 'Surat Perintah Penangkapan & Penahanan', wajib: jenisPengajuan.startsWith('penangkapan'), keterangan: 'Masa penangkapan 3x24 jam maksimal pengajuan' },
    { id: 'doc-lab-urin', kode: 'SKHPU', nama: 'SKH Pemeriksaan Urine (SKHPU)', wajib: true, keterangan: 'Hasil tes strip atau skrining laboratorium forensik' },
    { id: 'doc-elektronik', kode: 'BUKTI_ELEKTRONIK', nama: 'Alat Bukti Elektronik', wajib: false, keterangan: 'Bila ada (contoh: tangkapan layar chat, dll)' },
  ];

  if (jenisPengajuan === 'penangkapan_dengan_bb') {
    baseDocs.push(
      { id: 'doc-sp-sidik', kode: 'SP_SIDIK', nama: 'Surat Perintah Penyidikan', wajib: true, keterangan: 'Surat perintah penyidikan perkara' },
      { id: 'doc-sp-sita-bb', kode: 'SP_SITA_BB', nama: 'Surat Perintah Penyitaan Barang Bukti', wajib: true, keterangan: 'Dasar hukum penyitaan BB' },
      { id: 'doc-ba-sita-bb', kode: 'BA_SITA_BB', nama: 'Berita Acara Penyitaan Barang Bukti', wajib: true, keterangan: 'Rincian barang bukti yang diamankan saat penangkapan' },
      { id: 'doc-hasil-lab-bb', kode: 'HASIL_LAB_BB', nama: 'Hasil Pemeriksaan Laboratorium Barang Bukti', wajib: true, keterangan: 'Puslabfor / lab forensik' }
    );
  }

  return baseDocs;
};
