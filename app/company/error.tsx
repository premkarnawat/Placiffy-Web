'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function CompanyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Company Portal Caught Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-slate-50">
      <div className="max-w-2xl w-full bg-red-50 border border-red-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="text-red-600" size={32} />
          <h2 className="text-2xl font-bold text-red-900">Company Portal Rendering Error</h2>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-red-100 overflow-auto mb-6">
          <p className="font-bold text-red-800 mb-2">{error.name}: {error.message}</p>
          <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap leading-relaxed">{error.stack}</pre>
        </div>
        
        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Try to recover
        </button>
      </div>
    </div>
  );
}
