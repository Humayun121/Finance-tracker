export function LoadingRow({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="loading-row" role="status">
      {label}
    </div>
  );
}

export function InlineError({ message, className = '' }: { message: string; className?: string }) {
  return (
    <p className={`inline-error ${className}`.trim()} role="alert">
      {message}
    </p>
  );
}
