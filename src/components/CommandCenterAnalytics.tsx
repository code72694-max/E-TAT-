import React, { useState } from 'react';
import {
  TrendingUp,
  ClipboardList,
  Clock,
  FileText,
  ChevronDown,
  Sprout,
  Users,
  Activity,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export const CommandCenterAnalytics: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPeriod, setSelectedPeriod] = useState('Bulan Ini');

  // SVG Chart Dimensions & Data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  // Trend Points normalized to SVG height (height: 180, viewBox: 0 0 500 180)
  // Max Y value ~ 250
  // Line 1: Peserta Aktif (Blue) ending at 232
  // Line 2: Menyelesaikan Program (Green) ending at 189
  // Line 3: Pascarehabilitasi (Amber) ending at 142
  const pointsBlue = [
    { x: 20, y: 145 },
    { x: 60, y: 135 },
    { x: 100, y: 120 },
    { x: 140, y: 110 },
    { x: 180, y: 105 },
    { x: 220, y: 95 },
    { x: 260, y: 85 },
    { x: 300, y: 75 },
    { x: 340, y: 65 },
    { x: 380, y: 50 },
    { x: 420, y: 38 },
    { x: 460, y: 24 }
  ];

  const pointsGreen = [
    { x: 20, y: 155 },
    { x: 60, y: 148 },
    { x: 100, y: 140 },
    { x: 140, y: 135 },
    { x: 180, y: 130 },
    { x: 220, y: 120 },
    { x: 260, y: 115 },
    { x: 300, y: 100 },
    { x: 340, y: 90 },
    { x: 380, y: 75 },
    { x: 420, y: 65 },
    { x: 460, y: 46 }
  ];

  const pointsAmber = [
    { x: 20, y: 168 },
    { x: 60, y: 162 },
    { x: 100, y: 155 },
    { x: 140, y: 150 },
    { x: 180, y: 145 },
    { x: 220, y: 138 },
    { x: 260, y: 132 },
    { x: 300, y: 122 },
    { x: 340, y: 112 },
    { x: 380, y: 100 },
    { x: 420, y: 88 },
    { x: 460, y: 72 }
  ];

  const makePath = (pts: { x: number; y: number }[]) =>
    pts.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* CARD 1: TREN PROGRES PEMULIHAN BULANAN */}
        <div className="lg:col-span-7 bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-[#0a182f] border border-[#1b3459] text-slate-300">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Tren Progres Pemulihan Bulanan
              </h3>
            </div>

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#0a182f] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#1b3459] appearance-none pr-7 focus:outline-none cursor-pointer"
              >
                <option value="2024">Tahun 2024</option>
                <option value="2025">Tahun 2025</option>
                <option value="2026">Tahun 2026</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="py-4 relative">
            <svg viewBox="0 0 500 180" className="w-full h-48 sm:h-56 overflow-visible">
              {/* Horizontal Grid lines */}
              {[25, 60, 95, 130, 165].map((yVal, idx) => (
                <g key={idx}>
                  <line
                    x1="20"
                    y1={yVal}
                    x2="480"
                    y2={yVal}
                    stroke="#1b3459"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                  <text
                    x="5"
                    y={yVal + 3}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {250 - idx * 50}
                  </text>
                </g>
              ))}

              {/* Month Labels on X Axis */}
              {months.map((m, idx) => {
                const xPos = 20 + idx * 40;
                return (
                  <text
                    key={m}
                    x={xPos}
                    y="178"
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {m}
                  </text>
                );
              })}

              {/* Line 1: Peserta Aktif (Sky Blue) */}
              <path
                d={makePath(pointsBlue)}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pointsBlue.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#0d1f38"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
              ))}

              {/* Line 2: Menyelesaikan Program (Cobalt Blue) */}
              <path
                d={makePath(pointsGreen)}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pointsGreen.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#0d1f38"
                  stroke="#60a5fa"
                  strokeWidth="2"
                />
              ))}

              {/* Line 3: Pascarehabilitasi (Slate Blue) */}
              <path
                d={makePath(pointsAmber)}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pointsAmber.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#0d1f38"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
              ))}

              {/* Badges on End Points */}
              {/* Sky 232 badge */}
              <g transform="translate(460, 24)">
                <rect x="5" y="-12" width="34" height="18" rx="4" fill="#0284c7" />
                <text x="22" y="1" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  232
                </text>
              </g>

              {/* Blue 189 badge */}
              <g transform="translate(460, 46)">
                <rect x="5" y="-12" width="34" height="18" rx="4" fill="#2563eb" />
                <text x="22" y="1" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  189
                </text>
              </g>

              {/* Slate 142 badge */}
              <g transform="translate(460, 72)">
                <rect x="5" y="-12" width="34" height="18" rx="4" fill="#475569" />
                <text x="22" y="1" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  142
                </text>
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 pt-2 border-t border-[#1b3459]/60 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] ring-2 ring-[#38bdf8]/30" />
              <span className="text-slate-300 font-medium">Peserta Aktif</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] ring-2 ring-[#60a5fa]/30" />
              <span className="text-slate-300 font-medium">Menyelesaikan Program</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] ring-2 ring-[#94a3b8]/30" />
              <span className="text-slate-300 font-medium">Pascarehabilitasi</span>
            </div>
          </div>
        </div>

        {/* CARD 2: STATUS KASUS TAT (DONUT CHART) */}
        <div className="lg:col-span-5 bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1b3459]/60">
            <div className="p-1.5 rounded-lg bg-[#0a182f] border border-[#1b3459] text-slate-300">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Status Kasus TAT
            </h3>
          </div>

          {/* Donut and Legend Flex */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center py-4">
            {/* Donut SVG */}
            <div className="sm:col-span-5 flex justify-center">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Total Circumference = 2 * PI * 38 ≈ 238.76 */}
                  {/* S1: Pemulihan Berjalan (23%) -> strokeDasharray: 54.9 238.76 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#38bdf8"
                    strokeWidth="14"
                    strokeDasharray="54.9 238.76"
                    strokeDashoffset="0"
                  />
                  {/* S2: Asesmen Berjalan (30%) -> strokeDasharray: 71.6 238.76 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="14"
                    strokeDasharray="71.6 238.76"
                    strokeDashoffset="-54.9"
                  />
                  {/* S3: Menunggu Rekomendasi (17%) -> strokeDasharray: 40.5 238.76 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#60a5fa"
                    strokeWidth="14"
                    strokeDasharray="40.5 238.76"
                    strokeDashoffset="-126.5"
                  />
                  {/* S4: Pascarehabilitasi (16%) -> strokeDasharray: 38.2 238.76 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#1d4ed8"
                    strokeWidth="14"
                    strokeDasharray="38.2 238.76"
                    strokeDashoffset="-167"
                  />
                  {/* S5: Selesai (14%) -> strokeDasharray: 33.4 238.76 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#64748b"
                    strokeWidth="14"
                    strokeDasharray="33.4 238.76"
                    strokeDashoffset="-205.2"
                  />
                </svg>

                {/* Center text in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base sm:text-lg font-black text-white font-mono leading-none">
                    1.248
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">
                    Total Kasus
                  </span>
                </div>
              </div>
            </div>

            {/* Status Legend List */}
            <div className="sm:col-span-7 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
                  <span className="text-slate-300">Pemulihan Berjalan</span>
                </div>
                <span className="font-bold text-white font-mono">289 <span className="text-slate-400 font-normal">(23%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  <span className="text-slate-300">Asesmen Berjalan</span>
                </div>
                <span className="font-bold text-white font-mono">376 <span className="text-slate-400 font-normal">(30%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
                  <span className="text-slate-300">Menunggu Rekomendasi</span>
                </div>
                <span className="font-bold text-white font-mono">214 <span className="text-slate-400 font-normal">(17%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]" />
                  <span className="text-slate-300">Pascarehabilitasi</span>
                </div>
                <span className="font-bold text-white font-mono">198 <span className="text-slate-400 font-normal">(16%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                  <span className="text-slate-300">Selesai</span>
                </div>
                <span className="font-bold text-white font-mono">171 <span className="text-slate-400 font-normal">(14%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: AKTIVITAS TERBARU (BOTTOM LEFT) */}
        <div className="lg:col-span-7 bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-[#0a182f] border border-[#1b3459] text-slate-300">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Aktivitas Terbaru
              </h3>
            </div>

            <button className="bg-[#0a182f] hover:bg-[#122846] text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#1b3459] transition-colors cursor-pointer">
              Lihat Semua
            </button>
          </div>

          {/* Timeline Feed */}
          <div className="divide-y divide-[#1b3459]/40 py-2">
            {[
              {
                time: '12:24',
                desc: 'Hasil asesmen medis selesai diverifikasi',
                caseId: 'A.n. RAH - 00123',
                dotColor: 'bg-[#38bdf8]'
              },
              {
                time: '11:15',
                desc: 'Rencana pemulihan telah disusun',
                caseId: 'A.n. DDN - 00789',
                dotColor: 'bg-[#38bdf8]'
              },
              {
                time: '10:42',
                desc: 'Peserta memulai program rehabilitasi',
                caseId: 'A.n. BGS - 00567',
                dotColor: 'bg-[#38bdf8]'
              },
              {
                time: '09:18',
                desc: 'Laporan pascarehabilitasi diterima',
                caseId: 'A.n. WSD - 00411',
                dotColor: 'bg-[#60a5fa]'
              },
              {
                time: '08:50',
                desc: 'Permohonan TAT baru masuk',
                caseId: 'A.n. FTR - 00890',
                dotColor: 'bg-[#60a5fa]'
              }
            ].map((act, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${act.dotColor}`} />
                  <span className="font-mono text-slate-400 shrink-0 text-[11px]">{act.time}</span>
                  <span className="text-slate-200 truncate">{act.desc}</span>
                </div>
                <span className="font-mono text-[11px] font-semibold bg-[#0a182f] text-slate-300 px-2.5 py-1 rounded-md border border-[#1b3459] shrink-0">
                  {act.caseId}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: REKAP SINGKAT (BOTTOM RIGHT) */}
        <div className="lg:col-span-5 bg-[#0d1f38] border border-[#1b3459] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b3459]/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-[#0a182f] border border-[#1b3459] text-slate-300">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Rekap Singkat
              </h3>
            </div>

            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-[#0a182f] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#1b3459] appearance-none pr-7 focus:outline-none cursor-pointer"
              >
                <option value="Bulan Ini">Bulan Ini</option>
                <option value="Triwulan">Triwulan Ini</option>
                <option value="Tahun Ini">Tahun Ini</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4 Stat Grid */}
          <div className="grid grid-cols-2 gap-3 py-3">
            {/* Stat 1 */}
            <div className="p-3.5 bg-[#0a182f] rounded-xl border border-[#1b3459] space-y-1">
              <div className="w-7 h-7 rounded-lg bg-[#0d1f38] border border-[#1b3459] text-slate-300 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono pt-1">
                142
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Rekomendasi TAT Diterbitkan
              </p>
            </div>

            {/* Stat 2 */}
            <div className="p-3.5 bg-[#0a182f] rounded-xl border border-[#1b3459] space-y-1">
              <div className="w-7 h-7 rounded-lg bg-[#0d1f38] border border-[#1b3459] text-slate-300 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono pt-1">
                256
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Rencana Pemulihan Disusun
              </p>
            </div>

            {/* Stat 3 */}
            <div className="p-3.5 bg-[#0a182f] rounded-xl border border-[#1b3459] space-y-1">
              <div className="w-7 h-7 rounded-lg bg-[#0d1f38] border border-[#1b3459] text-slate-300 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono pt-1">
                198
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Peserta Selesai Program
              </p>
            </div>

            {/* Stat 4 */}
            <div className="p-3.5 bg-[#0a182f] rounded-xl border border-[#1b3459] space-y-1">
              <div className="w-7 h-7 rounded-lg bg-[#0d1f38] border border-[#1b3459] text-slate-300 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono pt-1">
                87
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Dalam Monitoring Pascarehabilitasi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
