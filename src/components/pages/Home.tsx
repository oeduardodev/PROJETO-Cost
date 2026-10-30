import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineChartPie,
  HiOutlineExclamationCircle,
  HiOutlineFolder,
  HiOutlinePlus,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import { useProjects } from '../../hooks/useProjects';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/format';
import {
  getCategoryBreakdown,
  getCategoryColor,
  getProjectMetrics,
  getProjectsTotals,
} from '../../utils/project';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { PageHeader } from '../ui/PageHeader';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Skeleton';
import { StatCard } from '../ui/StatCard';
import styles from './Home.module.css';

function DashboardSkeleton() {
  return (
    <>
      <div className={styles.statsGrid}>
        {[0, 1, 2, 3].map((item) => (
          <Card key={item} padded>
            <Skeleton width="45%" height={12} />
            <div style={{ height: 12 }} />
            <Skeleton width="70%" height={30} />
            <div style={{ height: 10 }} />
            <Skeleton width="55%" height={12} />
          </Card>
        ))}
      </div>
      <div className={styles.dashboardGrid}>
        <Card padded>
          <Skeleton width="40%" height={18} />
          <div style={{ height: 24 }} />
          <Skeleton width="100%" height={180} radius={14} />
        </Card>
        <Card padded>
          <Skeleton width="50%" height={18} />
          <div style={{ height: 24 }} />
          {[0, 1, 2].map((item) => (
            <div key={item} style={{ marginBottom: 18 }}>
              <Skeleton width="100%" height={12} />
              <div style={{ height: 8 }} />
              <Skeleton width="70%" height={10} />
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <div className="card__header">
          <Skeleton width="180px" height={20} />
        </div>
        <div className="card__body">
          {[0, 1, 2].map((item) => (
            <div key={item} style={{ marginBottom: 16 }}>
              <Skeleton width="100%" height={14} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export default function Home() {
  const { projects, loading, error, reload } = useProjects();

  const totals = useMemo(() => getProjectsTotals(projects), [projects]);
  const categories = useMemo(() => getCategoryBreakdown(projects), [projects]);
  const overallPercent = totals.budget > 0 ? (totals.cost / totals.budget) * 100 : 0;
  const projectList = projects.slice(0, 5);
  const hasProjects = projects.length > 0;

  const donutColor = totals.balance < 0 ? 'var(--danger)' : 'var(--accent)';
  const donutStop = Math.max(0, Math.min(100, overallPercent));

  return (
    <div className={`page ${styles.neutralIcons}`}>
      <PageHeader
        title="Visão geral"
        description="Acompanhe seus projetos, orçamentos e serviços em um só lugar."
        actions={
          <Button to="/newproject" icon={HiOutlinePlus}>
            Novo projeto
          </Button>
        }
      />

      {error ? (
        <Card>
          <ErrorState onRetry={reload} />
        </Card>
      ) : loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className={styles.statsGrid} aria-label="Indicadores financeiros">
            <StatCard
              label="Total de projetos"
              value={formatNumber(projects.length)}
              helper={projects.length === 1 ? 'projeto cadastrado' : 'projetos cadastrados'}
              icon={HiOutlineFolder}
              tone="neutral"
            />
            <StatCard
              label="Orçamento total"
              value={formatCurrency(totals.budget)}
              helper="Soma dos orçamentos cadastrados"
              icon={HiOutlineCash}
              tone="neutral"
            />
            <StatCard
              label="Total utilizado"
              value={formatCurrency(totals.cost)}
              helper={
                totals.budget > 0
                  ? `${formatPercent(overallPercent)} do orçamento total`
                  : 'Nenhum orçamento definido'
              }
              icon={HiOutlineChartPie}
              tone="neutral"
            />
            <StatCard
              label="Saldo disponível"
              value={formatCurrency(totals.balance)}
              helper={
                totals.balance < 0
                  ? `Orçamento excedido em ${formatCurrency(Math.abs(totals.balance))}`
                  : 'Disponível para novos serviços'
              }
              icon={HiOutlineTrendingUp}
              tone="neutral"
              helperTone={totals.balance < 0 ? 'danger' : ''}
            />
          </section>

          {!hasProjects ? (
            <Card>
              <EmptyState
                icon={HiOutlineFolder}
                title="Seu primeiro projeto começa aqui"
                description="Crie um projeto, defina um orçamento e adicione serviços para acompanhar seus custos em tempo real."
                action={
                  <Button to="/newproject" icon={HiOutlinePlus}>
                    Criar projeto
                  </Button>
                }
              />
            </Card>
          ) : (
            <>
              {totals.overBudget > 0 ? (
                <div className="alert alert--warning" role="status">
                  <HiOutlineExclamationCircle aria-hidden="true" />
                  <span>
                    {totals.overBudget === 1
                      ? 'Um projeto está com o orçamento excedido.'
                      : `${totals.overBudget} projetos estão com o orçamento excedido.`}{' '}
                    Revise os serviços para manter os custos sob controle.
                  </span>
                </div>
              ) : null}

              <div className={styles.dashboardGrid}>
                <Card className={styles.financeCard}>
                  <div className="card__header">
                    <div>
                      <h2 className="card__title">Distribuição financeira</h2>
                      <p className="card__subtitle">
                        Relação entre o orçamento total e o valor utilizado.
                      </p>
                    </div>
                    <Badge tone={totals.balance < 0 ? 'danger' : 'accent'}>
                      {totals.balance < 0 ? 'Acima do orçamento' : 'Dentro do orçamento'}
                    </Badge>
                  </div>
                  <div className={`card__body ${styles.financeBody}`}>
                    <div
                      className={styles.donut}
                      style={{
                        background:
                          totals.budget > 0
                            ? `conic-gradient(${donutColor} 0 ${donutStop}%, var(--surface-3) ${donutStop}% 100%)`
                            : 'var(--surface-3)',
                      }}
                      role="img"
                      aria-label={`${formatPercent(
                        overallPercent
                      )} do orçamento total utilizado`}
                    >
                      <div className={styles.donutInner}>
                        <strong>
                          {totals.budget > 0 ? formatPercent(overallPercent) : '—'}
                        </strong>
                        <span>{totals.budget > 0 ? 'utilizado' : 'sem orçamento'}</span>
                      </div>
                    </div>

                    <div className={styles.legend}>
                      <div className={styles.legendRow}>
                        <span
                          className={styles.legendDot}
                          style={{ background: 'var(--accent)' }}
                          aria-hidden="true"
                        />
                        <div className={styles.legendText}>
                          <span>Total utilizado</span>
                          <strong>{formatCurrency(totals.cost)}</strong>
                        </div>
                      </div>
                      <div className={styles.legendRow}>
                        <span
                          className={styles.legendDot}
                          style={{
                            background:
                              totals.balance < 0 ? 'var(--danger)' : 'var(--surface-3)',
                            border: '1px solid var(--border)',
                          }}
                          aria-hidden="true"
                        />
                        <div className={styles.legendText}>
                          <span>{totals.balance < 0 ? 'Valor excedido' : 'Saldo disponível'}</span>
                          <strong>
                            {formatCurrency(totals.balance < 0 ? Math.abs(totals.balance) : totals.balance)}
                          </strong>
                        </div>
                      </div>
                      <div className={styles.legendTotal}>
                        <span>Orçamento total</span>
                        <strong>{formatCurrency(totals.budget)}</strong>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="card__header">
                    <div>
                      <h2 className="card__title">Orçamento por categoria</h2>
                      <p className="card__subtitle">Distribuição dos valores cadastrados.</p>
                    </div>
                    <span className={styles.categoryIcon} aria-hidden="true">
                      <HiOutlineBriefcase />
                    </span>
                  </div>
                  <div className={`card__body ${styles.categoryList}`}>
                    {categories.length ? (
                      categories.slice(0, 5).map((category) => {
                        const percent =
                          category.budget > 0 ? (category.cost / category.budget) * 100 : 0;
                        const color = getCategoryColor(category.name);

                        return (
                          <div className={styles.categoryRow} key={category.name}>
                            <div className={styles.categoryHead}>
                              <span className={styles.categoryName}>
                                <span
                                  className={styles.categoryDot}
                                  style={{ background: color }}
                                  aria-hidden="true"
                                />
                                {category.name}
                                <span className={styles.categoryCount}>
                                  {category.count}
                                </span>
                              </span>
                              <span className={styles.categoryValue}>
                                {formatCurrency(category.budget)}
                              </span>
                            </div>
                            <ProgressBar
                              value={percent}
                              size="sm"
                              tone={percent > 100 ? 'danger' : 'accent'}
                              label={`Utilização do orçamento de ${category.name}`}
                            />
                            <div className={styles.categoryMeta}>
                              <span>{formatCurrency(category.cost)} utilizado</span>
                              <span>{formatPercent(percent)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className={styles.muted}>Nenhuma categoria com orçamento definido.</p>
                    )}
                  </div>
                </Card>
              </div>

              <Card>
                <div className="card__header">
                  <div>
                    <h2 className="card__title">Projetos</h2>
                    <p className="card__subtitle">
                      Acompanhe o andamento financeiro dos projetos cadastrados.
                    </p>
                  </div>
                  <Button
                    to="/projects"
                    variant="ghost"
                    size="sm"
                    iconRight={HiOutlineArrowRight}
                  >
                    Ver todos
                  </Button>
                </div>
                <div className={styles.projectList}>
                  {projectList.map((project) => {
                    const metrics = getProjectMetrics(project);
                    const categoryName = project.category?.name || 'Sem categoria';
                    const color = getCategoryColor(categoryName);
                    const tone = metrics.overBudget
                      ? 'danger'
                      : metrics.percent >= 80
                      ? 'warning'
                      : 'accent';

                    return (
                      <div className={styles.projectRow} key={project.id}>
                        <div className={styles.projectMain}>
                          <Link
                            to={`/project/${project.id}`}
                            className={styles.projectName}
                            title={project.name}
                          >
                            {project.name}
                          </Link>
                          <Badge color={color} dot>
                            {categoryName}
                          </Badge>
                        </div>

                        <div className={styles.projectNumbers}>
                          <div>
                            <span>Orçamento</span>
                            <strong>{formatCurrency(metrics.budget)}</strong>
                          </div>
                          <div>
                            <span>Utilizado</span>
                            <strong>{formatCurrency(metrics.cost)}</strong>
                          </div>
                          <div>
                            <span>Saldo</span>
                            <strong className={metrics.balance < 0 ? styles.danger : ''}>
                              {formatCurrency(metrics.balance)}
                            </strong>
                          </div>
                        </div>

                        <div className={styles.projectProgress}>
                          <div className={styles.projectProgressHead}>
                            <span>Utilização</span>
                            <strong
                              className={
                                metrics.overBudget
                                  ? styles.danger
                                  : metrics.percent >= 80
                                  ? styles.warning
                                  : ''
                              }
                            >
                              {formatPercent(metrics.percent)}
                            </strong>
                          </div>
                          <ProgressBar
                            value={metrics.percent}
                            size="sm"
                            tone={tone}
                            label={`Utilização do orçamento de ${project.name}`}
                          />
                        </div>

                        <Link
                          to={`/project/${project.id}`}
                          className={styles.projectLink}
                          aria-label={`Ver detalhes de ${project.name}`}
                        >
                          <HiOutlineArrowRight aria-hidden="true" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
