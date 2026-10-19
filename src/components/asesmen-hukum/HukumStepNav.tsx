import React from 'react';
import {
  BookOpen,
  Scale,
  User,
  Shield,
  Gavel,
  FileSignature
} from 'lucide-react';

interface HukumStepNavProps {
  activeStep: number;
  onStepSelect: (stepId: number) => void;
}

export const HukumStepNav: React.FC<HukumStepNavProps> = ({
  activeStep,
  onStepSelect,
}) => {
  const steps = [
    { id: 1, label: '1. Konstruksi Kasus', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 2, label: '2. Telaah SEMA 04', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 3, label: '3. Kualifikasi Peran', icon: <User className="w-3.5 h-3.5" /> },
    { id: 4, label: '4. Sindikat & Jaringan', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 5, label: '5. Rekomendasi Pleno', icon: <Gavel className="w-3.5 h-3.5" /> },
    { id: 6, label: '6. Pengesahan', icon: <FileSignature className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {steps.map((step) => (
        <button
          key={step.id}
          type="button"
          onClick={() => onStepSelect(step.id)}
          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeStep === step.id
              ? 'bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-500 text-white shadow-md'
              : 'bg-[#091426] border-[#1b3459] text-slate-400 hover:text-slate-200 hover:bg-[#10233f]'
          }`}
        >
          {step.icon}
          <span className="truncate">{step.label}</span>
        </button>
      ))}
    </div>
  );
};
