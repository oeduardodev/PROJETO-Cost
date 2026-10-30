import type { CSSProperties } from 'react';
interface SkeletonProps { width?: string; height?: number; radius?: number | string; className?: string; style?: CSSProperties; }
export function Skeleton({ width = '100%', height = 16, radius, className = '', style }: SkeletonProps) {
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
