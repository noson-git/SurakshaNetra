/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Camera, 
  Thermometer, 
  FileText, 
  UserCheck, 
  PlusCircle, 
  Clock, 
  ArrowRight,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ActionPriority } from '../../types';

export const AnomalyEvidenceViewer: React.FC = () => {
  const { 
    findings, 
    confirmFinding, 
    dismissFinding, 
    createAction, 
    setActiveTab 
  } = useCommandCentre();

  const [activeEvidenceMode, setActiveEvidenceMode] = useState<'thermal' | 'optical'>('thermal');
  const [reviewerNote, setReviewerNote] = useState<string>('');
  const [dismissReason, setDismissReason] = useState<string>('');
  const [showCreateActionModal, setShowCreateActionModal] = useState<boolean>(false);

  // Action form state
  const [actionTitle, setActionTitle] = useState<string>(
    'Emergency Steam Flange Gasket Replacement & Ultrasonic Pipe Inspection'
  );
  const [actionPriority, setActionPriority] = useState<ActionPriority>('critical');
  const [actionAssignee, setActionAssignee] = useState<string>(
    'Rajesh Kumar (Chief High-Pressure Piping Specialist)'
  );
  const [actionDueDate, setActionDueDate] = useState<string>('Today, 18:00 IST (Within 6h)');
  const [actionNotes, setActionNotes] = useState<string>(
    'Isolate secondary bypass valve BV-08. Perform ultrasonic wall thickness check on elbow B-14. Replace degraded graphite composite gasket with 316L spiral wound gasket.'
  );

  const finding = findings[0]; // Primary simulated finding
  if (!finding) return null;

  const handleConfirm = () => {
    confirmFinding(finding.id, reviewerNote || undefined);
  };

  const handleDismiss = () => {
    dismissFinding(finding.id, dismissReason || undefined);
  };

  const handleCreateActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAction(finding.id, {
      title: actionTitle,
      priority: actionPriority,
      assignee: actionAssignee,
      dueDate: actionDueDate,
      notes: actionNotes
    });
    setShowCreateActionModal(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Disclaimer Banner */}
      <div className="px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
        <Info className="w-4 h-4 shrink-0" />
        <span>
          <strong className="font-semibold uppercase tracking-wider">Synthetic Demo Dataset:</strong> All anomaly thermograms, AI confidence percentages, and thermal differentials are simulated for the startup competition prototype.
        </span>
      </div>

      {/* Main Evidence Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Visual Evidence Comparator (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
            {/* Header & Evidence Mode Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-red-400">
                  DEFECT DOSSIER · {finding.id.toUpperCase()}
                </span>
                <h2 className="text-base font-bold text-slate-100 mt-0.5">
                  {finding.anomalyType}
                </h2>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveEvidenceMode('thermal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                    activeEvidenceMode === 'thermal'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" /> FLIR Thermogram
                </button>
                <button
                  onClick={() => setActiveEvidenceMode('optical')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                    activeEvidenceMode === 'optical'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Optical Zoom (12x)
                </button>
              </div>
            </div>

            {/* Visual Viewport Canvas */}
            <div className="relative w-full h-[340px] mt-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center select-none">
              {activeEvidenceMode === 'thermal' ? (
                /* Simulated Radiometric Thermal Capture */
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center">
                  {/* Flange Pipe Geometry Wireframe */}
                  <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 600 340">
                    {/* Pipe Body */}
                    <rect x="0" y="130" width="600" height="80" fill="#1E1B4B" stroke="#4338CA" strokeWidth="2" />
                    {/* Flange Discs */}
                    <rect x="270" y="100" width="30" height="140" rx="4" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
                    <rect x="300" y="100" width="30" height="140" rx="4" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
                    {/* Bolts */}
                    {[110, 140, 170, 200, 230].map((by, idx) => (
                      <circle key={idx} cx="285" cy={by} r="4" fill="#A5B4FC" />
                    ))}
                  </svg>

                  {/* Radiometric Heat Flare Hotspot (Centered at Flange Seam) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-radial from-red-500 via-amber-400 to-transparent opacity-90 blur-xl animate-pulse" />

                  {/* Hotspot Measurement Marker Crosshair */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border border-white/60 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <div className="absolute w-24 h-[1px] bg-white/40" />
                      <div className="absolute h-24 w-[1px] bg-white/40" />
                    </div>

                    <div className="mt-2 bg-black/80 px-2.5 py-1 rounded border border-red-500/80 text-xs font-mono text-center">
                      <div className="text-white font-bold">HOTSPOT: 382.4°C</div>
                      <div className="text-red-400 font-semibold">DELTA: +78.3°C vs Baseline</div>
                    </div>
                  </div>

                  {/* Thermography Gradient Calibration Bar */}
                  <div className="absolute right-3 top-4 bottom-4 w-3.5 rounded bg-gradient-to-b from-white via-red-500 via-amber-400 via-purple-700 to-indigo-950 border border-slate-700 flex flex-col justify-between py-1 text-[9px] font-mono text-white px-4">
                    <span>400°</span>
                    <span>300°</span>
                    <span>200°</span>
                    <span>100°</span>
                    <span>25°</span>
                  </div>

                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                    RADIOMETRIC FLIR · EMISSIVITY: 0.94 · CALIBRATED 2026
                  </div>
                </div>
              ) : (
                /* Simulated Optical Macro Zoom View */
                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 600 340">
                    {/* Metal flange texture & high zoom */}
                    <rect width="600" height="340" fill="#1E293B" />
                    {/* Flange plate */}
                    <rect x="180" y="40" width="240" height="260" rx="8" fill="#334155" stroke="#475569" strokeWidth="3" />
                    {/* Pipe opening */}
                    <circle cx="300" cy="170" r="85" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
                    
                    {/* Apparent crack / corrosion fissure at seam */}
                    <path
                      d="M 370 120 Q 385 140 378 165 T 392 195"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="3.5"
                    />
                    
                    {/* Caliper measurement annotation */}
                    <line x1="395" y1="120" x2="395" y2="195" stroke="#00F2FE" strokeWidth="1.5" strokeDasharray="3 2" />
                    <line x1="390" y1="120" x2="400" y2="120" stroke="#00F2FE" strokeWidth="1.5" />
                    <line x1="390" y1="195" x2="400" y2="195" stroke="#00F2FE" strokeWidth="1.5" />
                    <text x="408" y="160" fill="#00F2FE" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      7.8mm Fissure
                    </text>

                    {/* Defect Bounding Box */}
                    <rect
                      x="355"
                      y="105"
                      width="55"
                      height="105"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <text x="355" y="98" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      MICRO-FISSURE [CV: 96.4%]
                    </text>
                  </svg>

                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                    OPTICAL 4K SONY SENSOR · 12X TELEPHOTO CROPPED
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Metadata Metrics */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SIMULATED CONFIDENCE</span>
                <span className="text-sm font-bold text-cyan-400">{finding.simulatedConfidencePct}%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DETECTED SEVERITY</span>
                <span className="text-sm font-bold text-red-400 uppercase">{finding.severity}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TIME FLAGGED</span>
                <span className="text-sm font-bold text-slate-200">{finding.timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Human Verification Workflow (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Engineering Diagnosis Card */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Automated Diagnostic Explanation
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              {finding.explanation}
            </p>

            <div className="mt-3">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Recommended Mitigation Protocol:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                {finding.recommendedAction}
              </p>
            </div>
          </div>

          {/* Human Review Decision Console */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                Human-in-the-Loop Verification
              </h3>

              {/* Status Pill */}
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${
                finding.status === 'confirmed'
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : finding.status === 'dismissed'
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {finding.status === 'unreviewed' ? 'Pending Human Review' : finding.status}
              </span>
            </div>

            {finding.status === 'unreviewed' ? (
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Engineering Verification Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={reviewerNote}
                    onChange={e => setReviewerNote(e.target.value)}
                    placeholder="e.g. Confirmed abnormal thermal acoustic signature on PJ-204"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Confirm or Dismiss Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleConfirm}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Hazard
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Dismiss (False Pos)
                  </button>
                </div>
              </div>
            ) : finding.status === 'confirmed' ? (
              <div className="mt-4 flex flex-col gap-3">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Verified as Genuine Hazard
                  </div>
                  <span className="text-slate-300 text-[11px] block mt-1">
                    Reviewed by: <strong>{finding.reviewedBy}</strong> · {finding.reviewedAt}
                  </span>
                </div>

                {/* Work Order Action Button */}
                {!finding.actionCreated ? (
                  <button
                    onClick={() => setShowCreateActionModal(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Assign Corrective Action Work Order
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('actions')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 transition-colors"
                  >
                    <span>Work Order Issued (#{finding.actionId})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-400 block">
                  Dismissed as Non-Hazardous
                </span>
                <span className="text-slate-500 text-[11px] block mt-1">
                  Reviewed by {finding.reviewedBy} · Asset restored to nominal status.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create Corrective Action Work Order */}
      {showCreateActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Issue Corrective Action Work Order
              </h3>
              <button
                onClick={() => setShowCreateActionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActionSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Work Order Title
                </label>
                <input
                  type="text"
                  required
                  value={actionTitle}
                  onChange={e => setActionTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Priority Tier
                  </label>
                  <select
                    value={actionPriority}
                    onChange={e => setActionPriority(e.target.value as ActionPriority)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="critical">Critical (Immediate Halt/Repair)</option>
                    <option value="high">High (Within 12h)</option>
                    <option value="medium">Medium (Next Maintenance Shift)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Scheduled Due Date
                  </label>
                  <input
                    type="text"
                    required
                    value={actionDueDate}
                    onChange={e => setActionDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Assigned Field Engineer
                </label>
                <input
                  type="text"
                  required
                  value={actionAssignee}
                  onChange={e => setActionAssignee(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Mitigation Protocol & Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateActionModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-lg shadow-cyan-400/20"
                >
                  Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
