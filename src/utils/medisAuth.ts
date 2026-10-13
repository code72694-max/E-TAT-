import type { PermohonanAsesmen, UserProfile } from '../types';

/**
 * Memeriksa apakah seorang tersangka/permohonan ditugaskan dan diperiksa oleh tenaga medis yang login.
 * - Jika pengguna adalah ADMIN / SEKRETARIAT: Memiliki akses menyeluruh (return true).
 * - Jika pengguna adalah MEDIS: Return true HANYA jika tersangka tersebut memang diperiksa oleh dokter/bagian medis yang bersangkutan.
 * - Jika pengguna bukan MEDIS (misal PENGAJU/HUKUM): return false untuk otorisasi medis khusus.
 */
export const isSuspectExaminedByMedis = (
  p: PermohonanAsesmen,
  currentUser: UserProfile
): boolean => {
  if (!currentUser || !p) return false;
  const role = currentUser.role?.toUpperCase();
  if (role === 'ADMIN') return true;
  if (role !== 'MEDIS') return false;

  const userId = currentUser.id;
  const userName = (currentUser.name || '').toLowerCase().trim();
  // Ambil nama tanpa gelar umum (dr., drg., Sp.KJ, dsb) untuk pencocokan fleksibel
  const userNameClean = userName
    .replace(/^(dr\.|drg\.|sp\.[a-z]+)\s*/i, '')
    .replace(/,\s*sp\.[a-z]+/i, '')
    .trim();

  // 1. Cek ID Asesor Medis
  if (userId) {
    if (p.timAsesmen?.asesorMedisId === userId) return true;
    if ((p.asesmenMedis as any)?.asesorId === userId) return true;
  }

  // 2. Cek Nama Dokter / Asesor Medis pada Tim Asesmen & Lembar Pemeriksaan Medis
  const doctorCandidates = [
    p.timAsesmen?.asesorMedisNama,
    p.asesmenMedis?.asesorNama,
    (p.asesmenMedis as any)?.dokterPemeriksa,
    (p.asesmenMedis as any)?.namaDokter,
    p.monitoringTindakLanjut?.pelaksanaanRehab?.namaPenanggungJawabFasilitas,
    p.pengawasanKlien?.konselorPendamping
  ].filter(Boolean).map(n => String(n).toLowerCase().trim());

  for (const candidate of doctorCandidates) {
    if (candidate === userName) return true;
    if (userName && candidate.includes(userName)) return true;
    if (userName && userName.includes(candidate)) return true;
    if (userNameClean && userNameClean.length >= 3 && candidate.includes(userNameClean)) return true;
  }

  return false;
};
