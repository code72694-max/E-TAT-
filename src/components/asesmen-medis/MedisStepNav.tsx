import React from 'react';
import { Syringe, HeartPulse, Activity, FileText, Shield, FileSignature } from 'lucide-react';

interface MedisStepNavProps {
  activeStep: number;
  onNavigateStep: (stepNumber: number) => void;
}

export const MedisStepNav: React.FC<MedisStepNavProps> = ({
  activeStep,
  onNavigateStep
}) => {
  const steps = [
    { id: 1, label: '1. Anamnesis Zat', icon: <Syringe className="w-3.5 h-3.5" /> },
    { id: 2, label: '2. Fisik & Vital', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 3, label: '3. Urin SKHPU', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 4, label: '4. WHO ASSIST', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 5, label: '5. ICD-10 & Terapi', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 6, label: '6. Pengesahan', icon: <FileSignature className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {steps.map((step) => (
        <button
          key={step.id}
          type="button"
          onClick={() => onNavigateStep(step.id)}
          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeStep === step.id
              ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-emerald-500 text-white shadow-md'
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
