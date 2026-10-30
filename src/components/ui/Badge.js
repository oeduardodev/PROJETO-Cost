export function Badge({ children, tone = 'neutral', color, dot = false, className = '' }) {
  const classes = [
    'badge',
    color ? 'badge--custom' : `badge--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = color ? { '--badge-color': color } : undefined;

  return (
    <span className={classes} style={style}>
      {dot ? <span className="badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
