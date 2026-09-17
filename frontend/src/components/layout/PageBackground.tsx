import type { ReactNode } from 'react';

interface PageBackgroundProps {
  children: ReactNode;
}

export function PageBackground({ children }: PageBackgroundProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 900px 500px at 20% 0%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%), var(--color-bg)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -160,
          bottom: -160,
          width: 340,
          height: 340,
          borderRadius: '50%',
          border: '1px solid color-mix(in srgb, var(--color-accent) 45%, transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -90,
          bottom: -90,
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '1px solid var(--color-divider)',
          pointerEvents: 'none',
        }}
      />

      {children}
    </div>
  );
}
