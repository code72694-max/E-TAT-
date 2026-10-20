/**
 * Utility untuk cetak dokumen legal kedinasan (A4 / HVS) secara bersih,
 * tanpa background gelap, tombol UI, border modal, atau chrome browser.
 * Menggunakan standar layout yang sama persis dengan BeritaAcaraModal.
 */
export const printLegalDocument = (htmlContent?: string | null): void => {
  if (!htmlContent) return;

  const win = window.open('', '_blank', 'width=950,height=750');
  if (!win) {
    alert('Jendela cetak terblokir oleh peramban. Harap izinkan pop-up untuk situs ini.');
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <title>&#8203;</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 20mm 18mm 20mm;
      @top-left { content: none !important; }
      @top-center { content: none !important; }
      @top-right { content: none !important; }
      @bottom-left { content: none !important; }
      @bottom-center { content: none !important; }
      @bottom-right {
        content: "Halaman " counter(page);
        font-family: 'Times New Roman', Times, serif;
        font-size: 9.5pt;
        color: #000;
      }
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      color: #000000;
      line-height: 1.45;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .ba-container {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      position: relative;
    }
    p {
      text-align: justify;
      margin-bottom: 8px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .ttd-section, .ttd-table, .ttd-block {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    ol, ul {
      margin-left: 24px;
      margin-bottom: 8px;
    }
    li {
      text-align: justify;
      margin-bottom: 4px;
    }
    .data-table th, .data-table td {
      border: 1px solid #444;
      padding: 5px 8px;
      font-size: 10pt;
    }
    .data-table th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="ba-container">
    ${htmlContent}
  </div>
</body>
</html>`);

  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 600);
};
