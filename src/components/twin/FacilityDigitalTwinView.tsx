/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { DigitalTwin3D } from './DigitalTwin3D';
import { Sitemap2D } from './Sitemap2D';
import { AssetDetailDrawer } from './AssetDetailDrawer';
import { Box, Map, Layers, ShieldAlert } from 'lucide-react';

export const FacilityDigitalTwinView: React.FC = () => {
  const { 
    twinViewMode, 
    setTwinViewMode, 
    assets, 
    selectedAssetId, 
    setSelectedAssetId 
  } = useCommandCentre();

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-8.5rem)]">
      {/* View Switcher & Asset Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0">
        {/* 3D vs 2D Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setTwinViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              twinViewMode === '3d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3D WebGL Digital Twin
          </button>
          <button
            onClick={() => setTwinViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              twinViewMode === '2d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> 2D CAD Vector Sitemap
          </button>
        </div>

        {/* Quick Asset Selector Dropdown / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-slate-500 hidden sm:inline">Inspect Asset:</span>
          {assets.map(asset => {
            const isSelected = asset.id === selectedAssetId;
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`px-2.5 py-1 rounded transition-colors shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {asset.status === 'critical' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                )}
                {asset.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport + Integrated Asset Detail Drawer */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
        {/* Visual Canvas (3D or 2D) */}
        <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden border border-slate-800 relative">
          {twinViewMode === '3d' ? <DigitalTwin3D /> : <Sitemap2D />}
        </div>

        {/* Synchronized Detail Drawer */}
        <AssetDetailDrawer />
      </div>
    </div>
  );
};
