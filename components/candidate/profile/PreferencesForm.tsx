'use client';
import React from 'react';
export default function PreferencesForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Expected CTC</label><input type="text" value={data.expectedCTC || ''} onChange={e => onChange({...data, expectedCTC: e.target.value})} className="w-full p-2 border rounded" /></div>
        <div><label className="text-sm font-medium">Notice Period (Days)</label><input type="number" value={data.noticePeriodDays || ''} onChange={e => onChange({...data, noticePeriodDays: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded" /></div>
        <div><label className="text-sm font-medium">Work Model</label>
          <select value={data.workModel || ''} onChange={e => onChange({...data, workModel: e.target.value})} className="w-full p-2 border rounded">
            <option value="">Select...</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="Onsite">Onsite</option>
          </select>
        </div>
        <div><label className="text-sm font-medium">Preferred Locations</label><input type="text" placeholder="Comma separated" value={data.preferredLocations || ''} onChange={e => onChange({...data, preferredLocations: e.target.value})} className="w-full p-2 border rounded" /></div>
      </div>
    </div>
  );
}
