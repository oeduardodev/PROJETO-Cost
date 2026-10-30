export function ProgressBar({ value = 0, tone = 'accent', size = 'md', label = 'Uso do orçamento' }) {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  const clamped = Math.max(0, Math.min(100, safeValue));

  return (
    <div
      className={`progress ${size === 'sm' ? 'progress--sm' : ''} progress--${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div className="progress__fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
