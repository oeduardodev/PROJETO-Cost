export type NumericValue = number | string;

export interface Category {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  cost: NumericValue;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  budget: NumericValue;
  category: Category;
  cost: NumericValue;
  services: Service[];
}

export type NewProject = Omit<Project, 'id'>;

export interface ProjectMetrics {
  budget: number;
  cost: number;
  balance: number;
  percent: number;
  overBudget: boolean;
  overBy: number;
}

export interface CategoryBreakdown {
  name: string;
  budget: number;
  cost: number;
  count: number;
}

export interface ProjectTotals {
  budget: number;
  cost: number;
  balance: number;
  overBudget: number;
}

export type ProgressTone = 'danger' | 'warning' | 'success';
