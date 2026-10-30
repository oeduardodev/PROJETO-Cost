import { useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { formatCurrency, formatPercent } from '../../utils/format';
import { getCategoryColor, getProjectMetrics } from '../../utils/project';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DropdownMenu } from '../ui/DropdownMenu';
import { ProgressBar } from '../ui/ProgressBar';
import styles from './ProjectCard.module.css';

export function ProjectCard({ project, view = 'grid', onDelete }) {
  const navigate = useNavigate();
  const metrics = getProjectMetrics(project);
  const categoryName = project.category?.name || 'Sem categoria';
  const categoryColor = getCategoryColor(categoryName);
  const hasBudget = metrics.budget > 0;
  const tone = metrics.overBudget ? 'danger' : metrics.percent >= 80 ? 'warning' : 'accent';
  const percentToneClass = metrics.overBudget
    ? styles.progressPercentDanger
    : metrics.percent >= 80
    ? styles.progressPercentWarning
    : '';

  const actions = [
    {
      label: 'Editar projeto',
      icon: HiOutlinePencil,
      onClick: () => navigate(`/project/${project.id}`),
    },
    {
      label: 'Excluir projeto',
      icon: HiOutlineTrash,
      danger: true,
      separatorBefore: true,
      onClick: () => onDelete(project),
    },
  ];

  return (
    <article className={`${styles.card} ${view === 'list' ? styles.cardList : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <h3 className={styles.title} title={project.name}>
            {project.name}
          </h3>
          <Badge color={categoryColor} dot>
            {categoryName}
          </Badge>
        </div>
        <DropdownMenu label={`Ações de ${project.name}`} items={actions} />
      </div>

      <div className={styles.numbers}>
        <div className={styles.number}>
          <span className={styles.numberLabel}>Orçamento</span>
          <span className={styles.numberValue}>{formatCurrency(metrics.budget)}</span>
        </div>
        <div className={styles.number}>
          <span className={styles.numberLabel}>Utilizado</span>
          <span className={styles.numberValue}>{formatCurrency(metrics.cost)}</span>
        </div>
        <div className={styles.number}>
          <span className={styles.numberLabel}>Saldo</span>
          <span
            className={`${styles.numberValue} ${
              metrics.balance < 0
                ? styles.numberValueDanger
                : metrics.balance > 0
                ? styles.numberValueSuccess
                : ''
            }`}
          >
            {formatCurrency(metrics.balance)}
          </span>
        </div>
      </div>

      <div className={styles.progressBlock}>
        <div className={styles.progressHead}>
          <span>Utilização do orçamento</span>
          <span className={`${styles.progressPercent} ${percentToneClass}`}>
            {hasBudget ? formatPercent(metrics.percent) : 'Sem orçamento'}
          </span>
        </div>
        <ProgressBar
          value={hasBudget ? metrics.percent : 0}
          tone={tone}
          size="sm"
          label={`Utilização do orçamento de ${project.name}`}
        />
        {metrics.overBudget ? (
          <span className={`${styles.helper} ${styles.helperDanger}`}>
            <HiOutlineExclamationCircle
              style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }}
              aria-hidden="true"
            />
            Excedido em {formatCurrency(metrics.overBy)}
          </span>
        ) : hasBudget ? (
          <span className={styles.helper}>
            {formatCurrency(metrics.balance)} disponíveis
          </span>
        ) : (
          <span className={`${styles.helper} ${styles.helperWarning}`}>
            Defina um orçamento para acompanhar a utilização.
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <Button
          to={`/project/${project.id}`}
          variant="ghost"
          size="sm"
          iconRight={HiOutlineArrowRight}
        >
          Abrir projeto
        </Button>
      </div>
    </article>
  );
}
