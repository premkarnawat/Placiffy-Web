'use client';
import React from 'react';
export default function PersonalForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Full Name</label><input type="text" value={data.fullName || ''} onChange={e => onChange({...data, fullName: e.target.value})} className="w-full p-2 border rounded" /></div>
        <div><label className="text-sm font-medium">Email</label><input type="email" value={data.email || ''} onChange={e => onChange({...data, email: e.target.value})} className="w-full p-2 border rounded" /></div>
        <div><label className="text-sm font-medium">Phone</label><input type="text" value={data.phone || ''} onChange={e => onChange({...data, phone: e.target.value})} className="w-full p-2 border rounded" /></div>
        <div><label className="text-sm font-medium">Location</label><input type="text" value={data.location || ''} onChange={e => onChange({...data, location: e.target.value})} className="w-full p-2 border rounded" /></div>
      </div>
    </div>
  );
}
