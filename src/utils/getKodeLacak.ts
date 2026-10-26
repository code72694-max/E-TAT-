import { PermohonanAsesmen } from '../types';

/**
 * Standardized function to resolve Kode Lacak Rehabilitasi for any case.
 * Format: RHB-XXXXXX (last 6 alphanumeric characters of permohonan ID)
 */
export const getKodeLacakRehab = (p?: PermohonanAsesmen | any): string => {
  if (!p) return '';
  if (p.kodeLacakRehab && typeof p.kodeLacakRehab === 'string' && p.kodeLacakRehab.trim()) {
    return p.kodeLacakRehab.trim().toUpperCase();
  }
  if (
    p.tindakLanjut?.kodeLacakRehab &&
    typeof p.tindakLanjut.kodeLacakRehab === 'string' &&
    p.tindakLanjut.kodeLacakRehab.trim()
  ) {
    return p.tindakLanjut.kodeLacakRehab.trim().toUpperCase();
  }
  if (p.id) {
    const rawId = String(p.id).replace(/[^a-zA-Z0-9]/g, '');
    return `RHB-${rawId.slice(-6).toUpperCase()}`;
  }
  return '';
};

/**
 * Normalize any input search code (removes spaces, hyphens, and underscores)
 * e.g. "RHB - 6D9BAF" -> "rhb6d9baf", "6D9BAF" -> "6d9baf"
 */
export const normalizeSearchCode = (s?: string): string => {
  if (!s) return '';
  return s.replace(/[\s\-_]/g, '').toLowerCase();
};
