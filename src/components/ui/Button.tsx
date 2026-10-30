import { Link } from 'react-router-dom';
import type { MouseEventHandler, ReactNode } from 'react';
import type { IconType } from 'react-icons';
interface ButtonProps { children?: ReactNode; variant?: string; size?: 'sm' | 'md' | 'lg'; loading?: boolean; icon?: IconType; iconRight?: IconType; to?: string; href?: string; block?: boolean; type?: 'button' | 'submit' | 'reset'; disabled?: boolean; className?: string; form?: string; title?: string; onClick?: MouseEventHandler<HTMLElement>; }

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
  onClick,
  title,
  form,
}: ButtonProps) {
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
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        title={title}
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
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        title={title}
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
      form={form}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      title={title}
    >
      {content}
    </button>
  );
}
