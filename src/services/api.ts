import { v4 as uuidv4 } from 'uuid';
import type { Category, NewProject, Project } from '../types';

const STORAGE_KEY = 'costs-data-v1';

// These are the available categories, not example user projects. The first
// access stores them alongside an empty project list in this browser.
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Infra' },
  { id: '2', name: 'Desenvolvimento' },
  { id: '3', name: 'Design' },
  { id: '4', name: 'Planejamento' },
];

interface StoredData {
  projects: Project[];
  categories: Category[];
}

function readData(): StoredData {
  let stored;

  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch (cause) {
    const error = new Error('Não foi possível acessar o armazenamento local deste navegador.');
    error.cause = cause;
    throw error;
  }

  if (stored) {
    try {
      const data = JSON.parse(stored) as Partial<StoredData>;
      return {
        projects: Array.isArray(data.projects) ? data.projects : [],
        categories: Array.isArray(data.categories) ? data.categories : DEFAULT_CATEGORIES,
      };
    } catch (cause) {
      const error = new Error('Os dados locais estão inválidos. Limpe o armazenamento para continuar.');
      error.cause = cause;
      throw error;
    }
  }

  const initialData = { projects: [], categories: DEFAULT_CATEGORIES };
  writeData(initialData);
  return initialData;
}

function writeData(data: StoredData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (cause) {
    const error = new Error('Não foi possível salvar os dados neste navegador.');
    error.cause = cause;
    throw error;
  }
}

function checkSignal(signal?: AbortSignal): void {
  if (signal?.aborted) {
    const error = new Error('A operação foi cancelada.');
    error.name = 'AbortError';
    throw error;
  }
}

function findProject(projects: Project[], id: string): Project | undefined {
  return projects.find((project) => String(project.id) === String(id));
}

export const api = {
  async getProjects({ signal }: { signal?: AbortSignal } = {}): Promise<Project[]> {
    checkSignal(signal);
    return readData().projects;
  },

  async getProject(id: string, { signal }: { signal?: AbortSignal } = {}): Promise<Project> {
    checkSignal(signal);
    const project = findProject(readData().projects, id);

    if (!project) {
      const error = new Error('Projeto não encontrado.');
      (error as Error & { status: number }).status = 404;
      throw error;
    }

    return project;
  },

  async getCategories({ signal }: { signal?: AbortSignal } = {}): Promise<Category[]> {
    checkSignal(signal);
    return readData().categories;
  },

  async createProject(project: NewProject): Promise<Project> {
    const data = readData();
    const created = { ...project, id: uuidv4() };
    data.projects = [...data.projects, created];
    writeData(data);
    return created;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const data = readData();
    const index = data.projects.findIndex((item) => String(item.id) === String(id));

    if (index < 0) {
      const error = new Error('Projeto não encontrado.');
      (error as Error & { status: number }).status = 404;
      throw error;
    }

    data.projects[index] = { ...data.projects[index], ...project, id: data.projects[index].id };
    writeData(data);
    return data.projects[index];
  },

  async deleteProject(id: string): Promise<null> {
    const data = readData();
    const projects = data.projects.filter((project) => String(project.id) !== String(id));

    if (projects.length === data.projects.length) {
      const error = new Error('Projeto não encontrado.');
      (error as Error & { status: number }).status = 404;
      throw error;
    }

    data.projects = projects;
    writeData(data);
    return null;
  },
};
