import { Skeleton } from './Skeleton';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
interface StatCardProps { label: ReactNode; value: ReactNode; helper?: ReactNode; icon?: IconType; tone?: string; loading?: boolean; helperTone?: string; }

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'neutral',
  loading = false,
  helperTone = '',
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {Icon ? (
          <span className="stat-card__icon" aria-hidden="true">
            <Icon />
          </span>
        ) : null}
      </div>

      {loading ? (
        <Skeleton width="68%" height={30} />
      ) : (
        <strong className="stat-card__value">{value}</strong>
      )}

      {helper ? (
        loading ? (
          <Skeleton width="55%" height={12} />
        ) : (
          <span className={`stat-card__helper ${helperTone ? `stat-card__helper--${helperTone}` : ''}`}>
            {helper}
          </span>
        )
      ) : null}
    </div>
  );
}
