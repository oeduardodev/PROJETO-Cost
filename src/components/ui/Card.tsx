import type { HTMLAttributes, PropsWithChildren } from 'react';
type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & { padded?: boolean }>;
export function Card({ children, className = '', padded = false, ...props }: CardProps) {
  const classes = ['card', padded ? 'card--padded' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
