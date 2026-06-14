'use client';

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
