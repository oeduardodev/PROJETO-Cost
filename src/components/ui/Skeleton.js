export function Skeleton({ width = '100%', height = 16, radius, className = '', style }) {
  return (
    <span
      aria-hidden="true"
      className={`skeleton ${className}`}
      style={{
        display: 'block',
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}
