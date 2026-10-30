import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import { Button } from './Button';
import type { ReactNode } from 'react';
interface ErrorStateProps { title?: string; description?: string; onRetry?: () => void; action?: ReactNode; }

export function ErrorState({
  title = 'Não foi possível carregar os dados',
  description = 'Verifique sua conexão e tente novamente.',
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon empty-state__icon--danger" aria-hidden="true">
        <HiOutlineExclamationCircle />
      </span>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__text">{description}</p>
      <div className="empty-state__action">
        {onRetry ? (
          <Button variant="secondary" icon={HiOutlineRefresh} onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : (
          action
        )}
      </div>
    </div>
  );
}
