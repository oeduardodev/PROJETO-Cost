import type { CSSProperties, ReactNode } from 'react';
interface BadgeProps { children: ReactNode; tone?: string; color?: string; dot?: boolean; className?: string; }
export function Badge({ children, tone = 'neutral', color, dot = false, className = '' }: BadgeProps) {
  const classes = [
    'badge',
    color ? 'badge--custom' : `badge--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = color ? ({ '--badge-color': color } as CSSProperties) : undefined;

  return (
    <span className={classes} style={style}>
      {dot ? <span className="badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
