import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'costs-data-v1';

// These are the available categories, not example user projects. The first
// access stores them alongside an empty project list in this browser.
const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Infra' },
  { id: '2', name: 'Desenvolvimento' },
  { id: '3', name: 'Design' },
  { id: '4', name: 'Planejamento' },
];

function readData() {
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
      const data = JSON.parse(stored);
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

function writeData(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (cause) {
    const error = new Error('Não foi possível salvar os dados neste navegador.');
    error.cause = cause;
    throw error;
  }
}

function checkSignal(signal) {
  if (signal?.aborted) {
    const error = new Error('A operação foi cancelada.');
    error.name = 'AbortError';
    throw error;
  }
}

function findProject(projects, id) {
  return projects.find((project) => String(project.id) === String(id));
}

export const api = {
  async getProjects({ signal } = {}) {
    checkSignal(signal);
    return readData().projects;
  },

  async getProject(id, { signal } = {}) {
    checkSignal(signal);
    const project = findProject(readData().projects, id);

    if (!project) {
      const error = new Error('Projeto não encontrado.');
      error.status = 404;
      throw error;
    }

    return project;
  },

  async getCategories({ signal } = {}) {
    checkSignal(signal);
    return readData().categories;
  },

  async createProject(project) {
    const data = readData();
    const created = { ...project, id: uuidv4() };
    data.projects = [...data.projects, created];
    writeData(data);
    return created;
  },

  async updateProject(id, project) {
    const data = readData();
    const index = data.projects.findIndex((item) => String(item.id) === String(id));

    if (index < 0) {
      const error = new Error('Projeto não encontrado.');
      error.status = 404;
      throw error;
    }

    data.projects[index] = { ...data.projects[index], ...project, id: data.projects[index].id };
    writeData(data);
    return data.projects[index];
  },

  async deleteProject(id) {
    const data = readData();
    const projects = data.projects.filter((project) => String(project.id) !== String(id));

    if (projects.length === data.projects.length) {
      const error = new Error('Projeto não encontrado.');
      error.status = 404;
      throw error;
    }

    data.projects = projects;
    writeData(data);
    return null;
  },
};
