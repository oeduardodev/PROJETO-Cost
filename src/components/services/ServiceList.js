import { HiOutlineTrash } from 'react-icons/hi';
import { formatCurrency } from '../../utils/format';
import { IconButton } from '../ui/IconButton';
import styles from './ServiceList.module.css';

export function ServiceList({ services, onRemove }) {
  return (
    <div className={styles.table} role="table" aria-label="Serviços do projeto">
      <div className={`${styles.row} ${styles.head}`} role="row">
        <span role="columnheader">Serviço</span>
        <span role="columnheader">Descrição</span>
        <span role="columnheader" className={styles.costHeader}>
          Custo
        </span>
        <span role="columnheader" className={styles.actionHeader}>
          Ações
        </span>
      </div>

      {services.map((service) => (
        <div className={styles.row} role="row" key={service.id}>
          <div className={styles.nameCell} role="cell">
            <span className={styles.mobileLabel}>Serviço</span>
            <strong className={styles.name}>{service.name}</strong>
          </div>
          <div className={styles.descriptionCell} role="cell">
            <span className={styles.mobileLabel}>Descrição</span>
            <span className={styles.description}>
              {service.description || 'Sem descrição informada.'}
            </span>
          </div>
          <div className={styles.costCell} role="cell">
            <span className={styles.mobileLabel}>Custo</span>
            <strong className={styles.cost}>{formatCurrency(service.cost)}</strong>
          </div>
          <div className={styles.actionCell} role="cell">
            <IconButton
              label={`Excluir serviço ${service.name}`}
              icon={HiOutlineTrash}
              variant="danger"
              size="sm"
              onClick={() => onRemove(service)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
