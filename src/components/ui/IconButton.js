export function IconButton({
  label,
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [
    'icon-btn',
    variant !== 'ghost' ? `icon-btn--${variant}` : '',
    size === 'sm' ? 'icon-btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
