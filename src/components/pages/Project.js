import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineChartPie,
  HiOutlineDotsVertical,
  HiOutlineExclamationCircle,
  HiOutlineFolder,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import { api } from '../../services/api';
import { useProject } from '../../hooks/useProjects';
import { useToast } from '../feedback/ToastProvider';
import { formatCurrency, formatPercent, toNumber } from '../../utils/format';
import {
  getCategoryColor,
  getProjectMetrics,
  getProjectServices,
  getProgressTone,
} from '../../utils/project';
import { ProjectForm } from '../projects/ProjectForm';
import { ServiceDrawer } from '../services/ServiceDrawer';
import { ServiceList } from '../services/ServiceList';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Dialog } from '../ui/Dialog';
import { DropdownMenu } from '../ui/DropdownMenu';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { PageHeader } from '../ui/PageHeader';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Skeleton';
import { StatCard } from '../ui/StatCard';
import styles from './Project.module.css';

function ProjectSkeleton() {
  return (
    <div className="page">
      <div className={styles.headerSkeleton}>
        <Skeleton width="180px" height={16} />
        <Skeleton width="55%" height={32} />
        <Skeleton width="380px" height={14} />
      </div>
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
      <Card padded>
        <Skeleton width="40%" height={20} />
        <div style={{ height: 20 }} />
        <Skeleton width="100%" height={10} />
        <div style={{ height: 24 }} />
        <Skeleton width="100%" height={52} />
      </Card>
      <Card>
        <div className="card__header">
          <Skeleton width="220px" height={20} />
        </div>
        <div className="card__body">
          {[0, 1, 2].map((item) => (
            <div key={item} style={{ marginBottom: 16 }}>
              <Skeleton width="100%" height={14} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { project, setProject, loading, error, reload } = useProject(id);

  const [editOpen, setEditOpen] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [editError, setEditError] = useState('');

  const [serviceOpen, setServiceOpen] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [serviceError, setServiceError] = useState('');

  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [removingService, setRemovingService] = useState(false);

  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  if (error) {
    return (
      <div className="page">
        <Card>
          <ErrorState
            title={error}
            description={
              error === 'Projeto não encontrado.'
                ? 'O projeto pode ter sido excluído ou o endereço está incorreto.'
                : 'Verifique sua conexão e tente novamente.'
            }
            onRetry={reload}
            action={
              <Button to="/projects" variant="secondary">
                Voltar para projetos
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  if (loading || !project) {
    return <ProjectSkeleton />;
  }

  const services = getProjectServices(project);
  const metrics = getProjectMetrics(project);
  const progressTone = getProgressTone(metrics);
  const categoryName = project.category?.name || 'Sem categoria';
  const categoryColor = getCategoryColor(categoryName);
  const available = Math.max(0, toNumber(project.budget) - toNumber(project.cost));

  const handleEdit = async (data) => {
    setSavingProject(true);
    setEditError('');

    try {
      const updated = {
        ...project,
        name: data.name,
        budget: data.budget,
        category: data.category,
      };
      const saved = await api.updateProject(project.id, updated);
      setProject(saved);
      setEditOpen(false);
      toast.success('Alterações salvas.');
    } catch (requestError) {
      setEditError('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleAddService = async (service) => {
    setSavingService(true);
    setServiceError('');

    const newCost = toNumber(project.cost) + toNumber(service.cost);
    const budget = toNumber(project.budget);

    if (newCost > budget) {
      setServiceError(
        `Orçamento insuficiente. O valor disponível é ${formatCurrency(available)}.`
      );
      setSavingService(false);
      return;
    }

    const newService = {
      ...service,
      id: uuidv4(),
    };

    const updated = {
      ...project,
      services: [...services, newService],
      cost: newCost,
    };

    try {
      const saved = await api.updateProject(project.id, updated);
      setProject(saved);
      setServiceOpen(false);
      toast.success('Serviço adicionado.');
    } catch (requestError) {
      setServiceError('Não foi possível adicionar o serviço. Tente novamente.');
    } finally {
      setSavingService(false);
    }
  };

  const handleRemoveService = async () => {
    if (!serviceToDelete) {
      return;
    }

    setRemovingService(true);

    try {
      const updatedServices = services.filter((service) => service.id !== serviceToDelete.id);
      const updated = {
        ...project,
        services: updatedServices,
        cost: Math.max(0, toNumber(project.cost) - toNumber(serviceToDelete.cost)),
      };
      const saved = await api.updateProject(project.id, updated);
      setProject(saved);
      toast.success('Serviço excluído.');
      setServiceToDelete(null);
    } catch (requestError) {
      toast.error('Não foi possível excluir o serviço. Tente novamente.');
    } finally {
      setRemovingService(false);
    }
  };

  const handleDeleteProject = async () => {
    setDeletingProject(true);

    try {
      await api.deleteProject(project.id);
      toast.success('Projeto excluído.');
      setDeletingProject(false);
      navigate('/projects');
    } catch (requestError) {
      toast.error('Não foi possível excluir o projeto. Tente novamente.');
      setDeletingProject(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow={
          <Badge color={categoryColor} dot>
            {categoryName}
          </Badge>
        }
        title={project.name}
        description="Acompanhe o orçamento, os custos e os serviços deste projeto."
        actions={
          <>
            <Button
              variant="secondary"
              icon={HiOutlinePencil}
              onClick={() => setEditOpen(true)}
            >
              Editar projeto
            </Button>
            <DropdownMenu
              label={`Mais ações de ${project.name}`}
              trigger={<HiOutlineDotsVertical aria-hidden="true" />}
              items={[
                {
                  label: 'Excluir projeto',
                  icon: HiOutlineTrash,
                  danger: true,
                  onClick: () => setDeleteProjectOpen(true),
                },
              ]}
            />
          </>
        }
      />

      <section className={styles.statsGrid} aria-label="Resumo financeiro do projeto">
        <StatCard
          label="Orçamento total"
          value={formatCurrency(metrics.budget)}
          helper="Valor definido para o projeto"
          icon={HiOutlineCash}
          tone="info"
        />
        <StatCard
          label="Total utilizado"
          value={formatCurrency(metrics.cost)}
          helper="Soma dos serviços adicionados"
          icon={HiOutlineChartPie}
          tone="warning"
        />
        <StatCard
          label="Saldo disponível"
          value={formatCurrency(metrics.balance)}
          helper={
            metrics.balance < 0
              ? `Excedido em ${formatCurrency(Math.abs(metrics.balance))}`
              : 'Disponível para novos serviços'
          }
          icon={HiOutlineTrendingUp}
          tone={metrics.balance < 0 ? 'danger' : 'success'}
          helperTone={metrics.balance < 0 ? 'danger' : ''}
        />
        <StatCard
          label="Utilização do orçamento"
          value={metrics.budget > 0 ? formatPercent(metrics.percent) : '—'}
          helper={metrics.budget > 0 ? 'Percentual consumido' : 'Orçamento não definido'}
          icon={HiOutlineFolder}
          tone={metrics.overBudget ? 'danger' : metrics.percent >= 80 ? 'warning' : 'accent'}
        />
      </section>

      <Card className={styles.progressCard}>
        <div className={styles.progressHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Progresso financeiro</h2>
            <p className={styles.sectionText}>
              Acompanhe quanto do orçamento já foi utilizado.
            </p>
          </div>
          <span
            className={`${styles.progressBadge} ${
              metrics.overBudget ? styles.progressBadgeDanger : ''
            }`}
          >
            {metrics.budget > 0 ? formatPercent(metrics.percent) : 'Sem orçamento'}
          </span>
        </div>

        <ProgressBar
          value={metrics.budget > 0 ? metrics.percent : 0}
          tone={progressTone}
          label={`Utilização do orçamento de ${project.name}`}
        />

        <div className={styles.progressStats}>
          <div className={styles.progressStat}>
            <span>Consumido</span>
            <strong>{formatCurrency(metrics.cost)}</strong>
          </div>
          <div className={styles.progressStat}>
            <span>Restante</span>
            <strong>{formatCurrency(Math.max(0, metrics.balance))}</strong>
          </div>
          <div className={styles.progressStat}>
            <span>Orçamento</span>
            <strong>{formatCurrency(metrics.budget)}</strong>
          </div>
        </div>

        {metrics.overBudget ? (
          <div className="alert alert--danger" role="status">
            <HiOutlineExclamationCircle aria-hidden="true" />
            <span>
              O projeto ultrapassou o orçamento em <strong>{formatCurrency(metrics.overBy)}</strong>.
              Revise os serviços para manter os custos sob controle.
            </span>
          </div>
        ) : null}

        {metrics.budget === 0 ? (
          <div className="alert alert--info" role="status">
            <HiOutlineExclamationCircle aria-hidden="true" />
            <span>
              Este projeto ainda não tem orçamento definido. Edite o projeto para estabelecer um
              limite de custos.
            </span>
          </div>
        ) : null}
      </Card>

      <Card className={styles.servicesCard}>
        <div className={styles.servicesHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Serviços do projeto</h2>
            <p className={styles.sectionText}>
              Organize os serviços e acompanhe os custos deste projeto.
            </p>
          </div>
          <Button icon={HiOutlinePlus} onClick={() => setServiceOpen(true)}>
            Adicionar serviço
          </Button>
        </div>

        {services.length ? (
          <ServiceList services={services} onRemove={setServiceToDelete} />
        ) : (
          <EmptyState
            icon={HiOutlineBriefcase}
            title="Nenhum serviço adicionado"
            description="Adicione serviços para começar a acompanhar os custos deste projeto."
            action={
              <Button icon={HiOutlinePlus} onClick={() => setServiceOpen(true)}>
                Adicionar serviço
              </Button>
            }
          />
        )}
      </Card>

      <Dialog
        open={editOpen}
        onClose={() => {
          if (!savingProject) {
            setEditOpen(false);
            setEditError('');
          }
        }}
        title="Editar projeto"
        description="Atualize as informações e o orçamento do projeto."
        size="md"
      >
        <ProjectForm
          initialData={project}
          submitLabel="Salvar alterações"
          onSubmit={handleEdit}
          onCancel={() => {
            setEditOpen(false);
            setEditError('');
          }}
          loading={savingProject}
          serverError={editError}
          minBudget={toNumber(project.cost)}
        />
      </Dialog>

      <ServiceDrawer
        open={serviceOpen}
        onClose={() => {
          setServiceOpen(false);
          setServiceError('');
        }}
        onSubmit={handleAddService}
        saving={savingService}
        serverError={serviceError}
        available={available}
      />

      <ConfirmDialog
        open={Boolean(serviceToDelete)}
        title="Excluir serviço?"
        description="O valor deste serviço será removido do total utilizado do projeto."
        confirmLabel="Excluir serviço"
        cancelLabel="Cancelar"
        onConfirm={handleRemoveService}
        onClose={() => setServiceToDelete(null)}
        loading={removingService}
      >
        {serviceToDelete ? (
          <p className="dialog__text">
            <strong>{serviceToDelete.name}</strong> — {formatCurrency(serviceToDelete.cost)}
          </p>
        ) : null}
      </ConfirmDialog>

      <ConfirmDialog
        open={deleteProjectOpen}
        title="Excluir projeto?"
        description="Esta ação é permanente e não pode ser desfeita."
        confirmLabel="Excluir projeto"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteProject}
        onClose={() => setDeleteProjectOpen(false)}
        loading={deletingProject}
      >
        <p className="dialog__text">
          O projeto <strong>{project.name}</strong> e todos os serviços associados serão removidos.
        </p>
      </ConfirmDialog>
    </div>
  );
}
