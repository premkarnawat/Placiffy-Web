# -*- coding: utf-8 -*-
import os

components_dir = r"components\candidate\profile"
os.makedirs(components_dir, exist_ok=True)

# 1. PersonalForm.tsx
personal_form = """'use client';
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
"""
with open(os.path.join(components_dir, "PersonalForm.tsx"), "w", encoding="utf-8") as f: f.write(personal_form)

# 2. ArrayForm.tsx (A generic component to handle array-based sections like Education, Experience, etc.)
array_form = """'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function ArrayForm({ title, items, fields, onUpdate, renderItem }: { title: string, items: any[], fields: any[], onUpdate: (items: any[]) => void, renderItem: (item: any) => React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [formData, setFormData] = useState<any>({});

  const handleAdd = () => {
    setFormData({});
    setCurrentIndex(-1);
    setIsEditing(true);
  };

  const handleEdit = (idx: number) => {
    setFormData(items[idx]);
    setCurrentIndex(idx);
    setIsEditing(true);
  };

  const handleDelete = (idx: number) => {
    const newItems = [...items];
    newItems.splice(idx, 1);
    onUpdate(newItems);
  };

  const handleSave = () => {
    const newItems = [...items];
    if (currentIndex >= 0) newItems[currentIndex] = formData;
    else newItems.push(formData);
    onUpdate(newItems);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        {!isEditing && <button onClick={handleAdd} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium"><Plus size={16}/> Add New</button>}
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-gray-50 flex justify-between group">
              <div>{renderItem(item)}</div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(idx)} className="text-gray-500 hover:text-blue-600"><Edit2 size={16}/></button>
                <button onClick={() => handleDelete(idx)} className="text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-sm">No {title.toLowerCase()} added yet.</p>}
        </div>
      ) : (
        <div className="p-4 border rounded-xl bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.name} className={f.fullWidth ? 'md:col-span-2' : ''}>
                <label className="text-sm font-medium">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea value={formData[f.name] || ''} onChange={e => setFormData({...formData, [f.name]: e.target.value})} className="w-full p-2 border rounded mt-1" rows={3}/>
                ) : (
                  <input type={f.type || 'text'} value={formData[f.name] || ''} onChange={e => setFormData({...formData, [f.name]: e.target.value})} className="w-full p-2 border rounded mt-1"/>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
"""
with open(os.path.join(components_dir, "ArrayForm.tsx"), "w", encoding="utf-8") as f: f.write(array_form)

# 3. PreferencesForm.tsx
pref_form = """'use client';
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
"""
with open(os.path.join(components_dir, "PreferencesForm.tsx"), "w", encoding="utf-8") as f: f.write(pref_form)

print("Created component stubs for Profile Engine!")
