import { useMemo, useState } from 'react';
import {
  HiOutlineChevronDown,
  HiOutlineFolder,
  HiOutlinePlus,
  HiOutlineSearch,
} from 'react-icons/hi';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../feedback/ToastProvider';
import { api } from '../../services/api';
import { normalizeText } from '../../utils/format';
import { getProjectMetrics } from '../../utils/project';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { PageHeader } from '../ui/PageHeader';
import { Skeleton } from '../ui/Skeleton';
import { ProjectCard } from '../projects/ProjectCard';
import styles from './Projects.module.css';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Nome (A–Z)' },
  { value: 'name-desc', label: 'Nome (Z–A)' },
  { value: 'budget-desc', label: 'Maior orçamento' },
  { value: 'budget-asc', label: 'Menor orçamento' },
];

function ProjectsSkeleton() {
  return (
    <div className={styles.list} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <Card key={item} padded>
          <Skeleton width="65%" height={18} />
          <div style={{ height: 10 }} />
          <Skeleton width="40%" height={12} />
          <div style={{ height: 24 }} />
          <Skeleton width="100%" height={42} />
          <div style={{ height: 16 }} />
          <Skeleton width="100%" height={8} />
          <div style={{ height: 16 }} />
          <Skeleton width="30%" height={14} />
        </Card>
      ))}
    </div>
  );
}

export default function Projects() {
  const { projects, setProjects, loading, error, reload } = useProjects();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = useMemo(() => {
    const names = new Set();

    projects.forEach((project) => {
      if (project.category?.name) {
        names.add(project.category.name);
      }
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = normalizeText(search);

    return projects
      .filter((project) => {
        const matchesSearch = !query || normalizeText(project.name).includes(query);
        const matchesCategory =
          !categoryFilter || project.category?.name === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === 'name-asc') {
          return String(a.name).localeCompare(String(b.name), 'pt-BR');
        }

        if (sort === 'name-desc') {
          return String(b.name).localeCompare(String(a.name), 'pt-BR');
        }

        const budgetA = getProjectMetrics(a).budget;
        const budgetB = getProjectMetrics(b).budget;

        return sort === 'budget-desc' ? budgetB - budgetA : budgetA - budgetB;
      });
  }, [projects, search, categoryFilter, sort]);

  const hasFilters = Boolean(search.trim() || categoryFilter);
  const resultsCount = filteredProjects.length;

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setSort('name-asc');
  };

  const handleDelete = async () => {
    if (!projectToDelete) {
      return;
    }

    setDeleting(true);

    try {
      await api.deleteProject(projectToDelete.id);
      setProjects((current) => current.filter((project) => project.id !== projectToDelete.id));
      toast.success('Projeto excluído.');
      setProjectToDelete(null);
    } catch (requestError) {
      toast.error('Não foi possível excluir o projeto. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Projetos"
        description="Gerencie seus projetos e acompanhe seus orçamentos."
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
        <>
          <div className={styles.toolbar}>
            <Skeleton width="100%" height={42} />
            <Skeleton width="100%" height={42} />
          </div>
          <ProjectsSkeleton />
        </>
      ) : projects.length === 0 ? (
        <Card>
          <EmptyState
            icon={HiOutlineFolder}
            title="Nenhum projeto cadastrado"
            description="Crie seu primeiro projeto para começar a organizar serviços, orçamentos e custos."
            action={
              <Button to="/newproject" icon={HiOutlinePlus}>
                Criar projeto
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <div className={styles.toolbar}>
            <div className="search-field">
              <HiOutlineSearch className="search-field__icon" aria-hidden="true" />
              <input
                id="project-search"
                className="input"
                type="search"
                placeholder="Pesquisar por nome"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Pesquisar projetos por nome"
              />
            </div>

            <div className={styles.controls}>
              <div className={styles.control}>
                <label className="sr-only" htmlFor="category-filter">
                  Filtrar por categoria
                </label>
                <div className="select-wrap">
                  <select
                    id="category-filter"
                    className="select"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <HiOutlineChevronDown className="select-wrap__icon" aria-hidden="true" />
                </div>
              </div>

              <div className={styles.control}>
                <label className="sr-only" htmlFor="project-sort">
                  Ordenar projetos
                </label>
                <div className="select-wrap">
                  <select
                    id="project-sort"
                    className="select"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <HiOutlineChevronDown className="select-wrap__icon" aria-hidden="true" />
                </div>
              </div>

            </div>
          </div>

          <div className={styles.results} aria-live="polite">
            <span>
              {resultsCount === 1 ? '1 projeto' : `${resultsCount} projetos`}
              {hasFilters ? ' encontrados' : ''}
            </span>
            {hasFilters ? (
              <button type="button" className={styles.clear} onClick={clearFilters}>
                Limpar filtros
              </button>
            ) : null}
          </div>

          {resultsCount === 0 ? (
            <Card>
              <EmptyState
                icon={HiOutlineSearch}
                title="Nenhum projeto encontrado"
                description="Tente ajustar a busca ou remover os filtros para ver mais resultados."
                action={
                  <Button variant="secondary" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className={styles.list}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  view="list"
                  onDelete={setProjectToDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(projectToDelete)}
        title="Excluir projeto?"
        description="Esta ação é permanente e não pode ser desfeita."
        confirmLabel="Excluir projeto"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onClose={() => setProjectToDelete(null)}
        loading={deleting}
      >
        {projectToDelete ? (
          <p className="dialog__text">
            O projeto <strong>{projectToDelete.name}</strong> e todos os serviços associados serão
            removidos.
          </p>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
