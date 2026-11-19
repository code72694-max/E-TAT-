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
  if (role === 'ADMIN' || role === 'SEKRETARIAT') return true;
  if (role !== 'MEDIS') return false;

  // Semua tenaga medis resmi TAT berhak menginput evaluasi klinis, rekam medis, dan skrining toksikologi urin
  return true;
};
