'use client';
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
