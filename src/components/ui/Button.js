import { Link } from 'react-router-dom';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  to,
  href,
  className = '',
  disabled = false,
  type = 'button',
  block = false,
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : Icon ? (
        <Icon aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {IconRight && !loading ? <IconRight aria-hidden="true" /> : null}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-disabled={disabled || loading ? 'true' : undefined}
        tabIndex={disabled || loading ? -1 : undefined}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || loading ? 'true' : undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
}
