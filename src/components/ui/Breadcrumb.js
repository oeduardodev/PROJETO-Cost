import { Link } from 'react-router-dom';
import { HiOutlineChevronRight } from 'react-icons/hi';

export function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Trilha de navegação">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="breadcrumb__item">
            {index > 0 ? (
              <HiOutlineChevronRight className="breadcrumb__sep" aria-hidden="true" />
            ) : null}
            {isLast || !item.to ? (
              <span
                className="breadcrumb__current"
                aria-current={isLast ? 'page' : undefined}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
