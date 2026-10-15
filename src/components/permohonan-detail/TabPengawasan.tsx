import React from 'react';
import { PermohonanAsesmen, UserProfile } from '../../types';
import { InstrumenKriteriaPlasemenView } from '../InstrumenKriteriaPlasemenView';
import { PengawasanPascaTatSection } from '../PengawasanPascaTatSection';

interface TabPengawasanProps {
  permohonan: PermohonanAsesmen;
  currentUser: UserProfile;
  onUpdatePermohonan: (updated: PermohonanAsesmen) => void;
}

export const TabPengawasan: React.FC<TabPengawasanProps> = ({
  permohonan,
  currentUser,
  onUpdatePermohonan
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Instrumen ASAM - Penilaian Tingkat Keparahan & Plasemen */}
      <InstrumenKriteriaPlasemenView
        permohonan={permohonan}
        currentUser={currentUser}
        onUpdatePermohonan={onUpdatePermohonan}
      />
      
      {/* 2. Pelaksanaan Pengawasan Klien */}
      <PengawasanPascaTatSection
        permohonan={permohonan}
        currentUser={currentUser}
        onUpdatePermohonan={onUpdatePermohonan}
      />
    </div>
  );
};
