const fs = require('fs');
const path = require('path');
const file = path.join('d:', 'PROJECT', 'POLRI - ETAT', 'src', 'components', 'PermohonanDetail.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace status logic when saving asesmen
content = content.replace(/if \(updated\.statusProsesUtama === 'asesmen_berlangsung' \|\| updated\.statusProsesUtama === 'hukum_selesai'\) \{\n\s*updated\.statusProsesUtama = updated\.asesmenHukum \? 'siap_pleno' : 'medis_selesai';/g, 
  `if (updated.applicationStatus === 'ASSESSMENT_ACTIVE' || updated.statusProsesUtama === 'asesmen_berlangsung' || updated.statusProsesUtama === 'hukum_selesai') {
          updated.medicalStatus = 'FINAL';
          updated.applicationStatus = updated.legalStatus === 'FINAL' ? 'READY_FOR_CONFERENCE' : 'ASSESSMENT_ACTIVE';`);
          
content = content.replace(/if \(updated\.statusProsesUtama === 'asesmen_berlangsung' \|\| updated\.statusProsesUtama === 'medis_selesai'\) \{\n\s*updated\.statusProsesUtama = updated\.asesmenMedis \? 'siap_pleno' : 'hukum_selesai';/g,
  `if (updated.applicationStatus === 'ASSESSMENT_ACTIVE' || updated.statusProsesUtama === 'asesmen_berlangsung' || updated.statusProsesUtama === 'medis_selesai') {
          updated.legalStatus = 'FINAL';
          updated.applicationStatus = updated.medicalStatus === 'FINAL' ? 'READY_FOR_CONFERENCE' : 'ASSESSMENT_ACTIVE';`);

// Replace tab visibility roles
content = content.replace(/currentUser\.role === 'sekretariat'/g, "(currentUser.role === 'sekretariat' || currentUser.role === 'ADMIN')");
content = content.replace(/currentUser\.role === 'pengaju'/g, "(currentUser.role === 'pengaju' || currentUser.role === 'PENGAJU')");
content = content.replace(/currentUser\.role === 'medis'/g, "(currentUser.role === 'medis' || currentUser.role === 'MEDIS')");
content = content.replace(/currentUser\.role === 'hukum'/g, "(currentUser.role === 'hukum' || currentUser.role === 'HUKUM')");

// Format status
content = content.replace(/formatStatus\(permohonan\.statusProsesUtama\)/g, 'formatStatus((permohonan.applicationStatus || permohonan.statusProsesUtama) as string)');

// Admin verification status update
content = content.replace(/statusProsesUtama: isAllValid \? 'verifikasi_berkas' : permohonan\.statusProsesUtama,/g, 
  "applicationStatus: isAllValid ? 'ADMIN_REVIEW' : permohonan.applicationStatus, statusProsesUtama: isAllValid ? 'verifikasi_berkas' : permohonan.statusProsesUtama,");

content = content.replace(/statusProsesUtama: hasErrors \? 'perlu_perbaikan' : allApproved \? 'penugasan_jadwal' : 'verifikasi_berkas',/g, 
  "applicationStatus: hasErrors ? 'NEEDS_CORRECTION' : allApproved ? 'SCHEDULED' : 'ADMIN_REVIEW', statusProsesUtama: hasErrors ? 'perlu_perbaikan' : allApproved ? 'penugasan_jadwal' : 'verifikasi_berkas',");

// Recommendation signing status
content = content.replace(/statusProsesUtama: isAllSigned \? 'rekomendasi_terbit' : permohonan\.statusProsesUtama,/g, 
  "applicationStatus: isAllSigned ? 'RESULTS_ISSUED' : permohonan.applicationStatus, statusProsesUtama: isAllSigned ? 'rekomendasi_terbit' : permohonan.statusProsesUtama,");

// Admisi status
content = content.replace(/statusProsesUtama: action === 'admisi' \? 'selesai_tindak_lanjut' : permohonan\.statusProsesUtama,/g, 
  "followupStatus: action === 'admisi' ? 'VERIFIED_IMPLEMENTED' : permohonan.followupStatus, statusProsesUtama: action === 'admisi' ? 'selesai_tindak_lanjut' : permohonan.statusProsesUtama,");

// Button conditions
content = content.replace(/permohonan\.statusProsesUtama === 'perlu_perbaikan'/g, "(permohonan.applicationStatus === 'NEEDS_CORRECTION' || permohonan.statusProsesUtama === 'perlu_perbaikan')");
content = content.replace(/permohonan\.statusProsesUtama === 'verifikasi_berkas'/g, "(permohonan.applicationStatus === 'SUBMITTED' || permohonan.applicationStatus === 'ADMIN_REVIEW' || permohonan.statusProsesUtama === 'verifikasi_berkas')");
content = content.replace(/permohonan\.statusProsesUtama === 'pengesahan_rekomendasi'/g, "(permohonan.applicationStatus === 'AWAITING_SIGNED_OUTPUTS' || permohonan.statusProsesUtama === 'pengesahan_rekomendasi')");
content = content.replace(/permohonan\.statusProsesUtama === 'rekomendasi_terbit'/g, "(permohonan.applicationStatus === 'RESULTS_ISSUED' || permohonan.statusProsesUtama === 'rekomendasi_terbit')");
content = content.replace(/permohonan\.statusProsesUtama === 'selesai_tindak_lanjut'/g, "(permohonan.followupStatus === 'VERIFIED_IMPLEMENTED' || permohonan.statusProsesUtama === 'selesai_tindak_lanjut')");
content = content.replace(/permohonan\.statusProsesUtama !== 'pengesahan_rekomendasi'/g, "(permohonan.applicationStatus !== 'AWAITING_SIGNED_OUTPUTS' && permohonan.statusProsesUtama !== 'pengesahan_rekomendasi')");

fs.writeFileSync(file, content, 'utf8');
console.log('Replacements completed successfully.');
