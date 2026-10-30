import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';
type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  label: string;
  icon: IconType;
  variant?: string;
  size?: 'sm' | 'md';
  type?: 'button' | 'submit' | 'reset';
};

export function IconButton({
  label,
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
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
