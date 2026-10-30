import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
interface EmptyStateProps { icon?: IconType; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string; }
export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`}>
      {Icon ? (
        <span className="empty-state__icon" aria-hidden="true">
          <Icon />
        </span>
      ) : null}
      <h3 className="empty-state__title">{title}</h3>
      {description ? <p className="empty-state__text">{description}</p> : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
