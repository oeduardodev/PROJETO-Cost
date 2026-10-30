export function Card({ children, className = '', padded = false, ...props }) {
  const classes = ['card', padded ? 'card--padded' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
