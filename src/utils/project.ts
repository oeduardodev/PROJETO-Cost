import { normalizeText, toNumber } from './format';
import type { CategoryBreakdown, ProgressTone, Project, ProjectMetrics, ProjectTotals, Service } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  infra: 'var(--cat-infra)',
  desenvolvimento: 'var(--cat-desenvolvimento)',
  design: 'var(--cat-design)',
  planejamento: 'var(--cat-planejamento)',
};

export function getProjectMetrics(project?: Partial<Project> | null): ProjectMetrics {
  const budget = toNumber(project?.budget);
  const cost = toNumber(project?.cost);
  const balance = budget - cost;
  const percent = budget > 0 ? (cost / budget) * 100 : cost > 0 ? 100 : 0;
  const overBudget = cost > budget;

  return {
    budget,
    cost,
    balance,
    percent,
    overBudget,
    overBy: Math.max(0, cost - budget),
  };
}

export function getProgressTone(metrics: ProjectMetrics): ProgressTone {
  if (metrics.overBudget) {
    return 'danger';
  }

  if (metrics.budget > 0 && metrics.percent >= 80) {
    return 'warning';
  }

  return 'success';
}

export function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[normalizeText(name)] || 'var(--text-2)';
}

export function getCategoryBreakdown(projects: Project[]): CategoryBreakdown[] {
  const map = new Map();

  projects.forEach((project) => {
    const name = project?.category?.name || 'Sem categoria';
    const current = map.get(name) || { name, budget: 0, cost: 0, count: 0 };

    current.budget += toNumber(project?.budget);
    current.cost += toNumber(project?.cost);
    current.count += 1;
    map.set(name, current);
  });

  return Array.from(map.values()).sort((a, b) => b.budget - a.budget);
}

export function getProjectsTotals(projects: Project[]): ProjectTotals {
  return projects.reduce(
    (totals, project) => {
      const metrics = getProjectMetrics(project);
      totals.budget += metrics.budget;
      totals.cost += metrics.cost;
      totals.balance += metrics.balance;
      totals.overBudget += metrics.overBudget ? 1 : 0;
      return totals;
    },
    { budget: 0, cost: 0, balance: 0, overBudget: 0 }
  );
}

export function getProjectServices(project?: Partial<Project> | null): Service[] {
  return project && Array.isArray(project.services) ? project.services : [];
}
