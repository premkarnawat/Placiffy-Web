# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

ui_addition = """{/* Custom Screening Fields */}
        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2"><AlertCircle size={20} className="text-gray-400"/> Screening & Assessment (Optional)</h2>
          
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <p className="text-sm text-gray-500 font-medium">Add custom questions, work sample requests, or assessment links for candidates applying to this job.</p>
            
            {customFields.map((field: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 border rounded-lg">
                    <div>
                        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase mr-2">{field.type}</span>
                        <span className="text-sm font-semibold">{field.label}</span>
                    </div>
                    <button type="button" onClick={() => setCustomFields((prev: any) => prev.filter((_: any, i: number) => i !== idx))} className="text-red-500 text-sm font-bold">Remove</button>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3">
                <select value={newFieldType} onChange={(e: any) => setNewFieldType(e.target.value)} className="rounded-xl border-gray-200 text-sm bg-white px-3 py-2">
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Answer</option>
                    <option value="link">Portfolio/Assessment Link</option>
                    <option value="file">File Upload (Work Sample)</option>
                </select>
                <input type="text" value={newFieldLabel} onChange={(e: any) => setNewFieldLabel(e.target.value)} placeholder="E.g., Link to your GitHub" className="flex-1 rounded-xl border-gray-200 text-sm px-4 py-2" />
                <button type="button" onClick={addCustomField} className="px-4 py-2 bg-zinc-900 text-white font-bold rounded-xl text-sm">Add Field</button>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">"""

content = content.replace('<div className="pt-6 border-t border-gray-100 flex justify-end gap-4">', ui_addition)

with open(r"app\company\jobs\create\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected UI successfully!")
