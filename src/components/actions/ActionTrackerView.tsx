/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { CorrectiveAction, ActionStatus, ActionPriority } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Filter, 
  Edit3, 
  Save, 
  User, 
  Calendar, 
  FileCheck,
  RotateCcw
} from 'lucide-react';

export const ActionTrackerView: React.FC = () => {
  const { 
    actions, 
    updateActionStatus, 
    resetDemo, 
    setSelectedAssetId, 
    setActiveTab 
  } = useCommandCentre();

  const [statusFilter, setStatusFilter] = useState<'all' | ActionStatus>('all');
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(actions[0] || null);

  // Edit action modal/state
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<ActionStatus>('open');
  const [editAssignee, setEditAssignee] = useState<string>('');
  const [editPriority, setEditPriority] = useState<ActionPriority>('critical');
  const [editNotes, setEditNotes] = useState<string>('');
  const [resolutionSummary, setResolutionSummary] = useState<string>('');

  const filteredActions = actions.filter(act => {
    if (statusFilter === 'all') return true;
    return act.status === statusFilter;
  });

  const handleOpenEdit = (action: CorrectiveAction) => {
    setEditingActionId(action.id);
    setEditStatus(action.status);
    setEditAssignee(action.assignee);
    setEditPriority(action.priority);
    setEditNotes(action.notes);
    setResolutionSummary(action.resolutionSummary || '');
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActionId) return;

    updateActionStatus(
      editingActionId, 
      editStatus, 
      editStatus === 'resolved' ? (resolutionSummary || 'Work completed and verified by safety inspection engineer.') : undefined
    );
    setEditingActionId(null);
  };

  const totalOpen = actions.filter(a => a.status === 'open').length;
  const totalInProgress = actions.filter(a => a.status === 'in_progress').length;
  const totalResolved = actions.filter(a => a.status === 'resolved').length;

  return (
    <div className="flex flex-col gap-5">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 text-xs font-medium block">Total Issued Work Orders</span>
          <span className="text-2xl font-bold font-mono text-slate-100 block mt-1">
            {actions.length}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-red-400 text-xs font-medium block">Open / Action Required</span>
          <span className="text-2xl font-bold font-mono text-red-400 block mt-1">
            {totalOpen}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-amber-400 text-xs font-medium block">Active In Progress</span>
          <span className="text-2xl font-bold font-mono text-amber-400 block mt-1">
            {totalInProgress}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-emerald-400 text-xs font-medium block">Verified & Resolved</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 block mt-1">
            {totalResolved}
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Audit Trail & Corrective Action Log
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Closed-loop industrial maintenance dispatch ledger
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded font-medium transition-colors capitalize ${
                  statusFilter === tab
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'in_progress' ? 'In Progress' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* High Density Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Target Asset</th>
                <th className="py-2.5 px-3">Corrective Action Title</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Assigned Engineer</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredActions.map(action => (
                <tr 
                  key={action.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-cyan-400">
                    {action.id.toUpperCase()}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <button
                      onClick={() => {
                        setSelectedAssetId(action.assetId);
                        setActiveTab('twin');
                      }}
                      className="hover:underline text-left text-cyan-400"
                    >
                      {action.assetName}
                    </button>
                  </td>
                  <td className="py-3 px-3 font-sans font-semibold text-slate-100 max-w-xs truncate">
                    {action.title}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      action.priority === 'critical'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : action.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}>
                      {action.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    {action.assignee}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {action.dueDate}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase flex items-center gap-1.5 w-fit ${
                      action.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : action.status === 'in_progress'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {action.status === 'resolved' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {action.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(action)}
                      className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Edit / Update Modal */}
      {editingActionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                Update Corrective Action Status
              </h3>
              <button
                onClick={() => setEditingActionId(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAction} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as ActionStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="open">Open (Awaiting Maintenance Crew)</option>
                  <option value="in_progress">In Progress (Field Work Active)</option>
                  <option value="resolved">Resolved (Inspection Verified & Cleared)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value as ActionPriority)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Assigned Lead
                  </label>
                  <input
                    type="text"
                    value={editAssignee}
                    onChange={e => setEditAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Mitigation & Work Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {editStatus === 'resolved' && (
                <div>
                  <label className="font-semibold text-emerald-400 block mb-1">
                    Engineering Resolution Summary (Required for Sign-off)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={resolutionSummary}
                    onChange={e => setResolutionSummary(e.target.value)}
                    placeholder="e.g. Spiral-wound 316L gasket installed. Secondary bypass re-pressurized to 18.4 bar. Thermal scan confirmed nominal baseline temperature (304°C)."
                    className="w-full px-3 py-2 rounded-lg bg-emerald-950/20 border border-emerald-500/50 text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingActionId(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-lg shadow-cyan-400/20"
                >
                  Save & Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
