content_error = """'use client';

import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ROOT CAUGHT ERROR:", error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', backgroundColor: '#fee2e2', color: '#991b1b', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Root Rendering Error</h2>
      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{error.name}: {error.message}</p>
      <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{error.stack}</pre>
      <button onClick={() => reset()} style={{ marginTop: '2rem', padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', borderRadius: '0.25rem' }}>Try again</button>
    </div>
  );
}
"""

content_global = """'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '2rem', fontFamily: 'monospace', backgroundColor: '#fee2e2', color: '#991b1b', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Global Fatal Error</h2>
          <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{error.name}: {error.message}</p>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{error.stack}</pre>
        </div>
      </body>
    </html>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\error.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content_error)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\global-error.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content_global)

print("Created root and global error boundaries")
