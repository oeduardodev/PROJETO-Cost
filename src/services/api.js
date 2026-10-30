const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    const networkError = new Error('Não foi possível conectar ao servidor.');
    networkError.cause = error;
    throw networkError;
  }

  if (!response.ok) {
    const error = new Error('A requisição não foi concluída.');
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getProjects: (options) => request('/projects', options),
  getProject: (id, options) => request(`/projects/${id}`, options),
  getCategories: (options) => request('/categories', options),
  createProject: (project) => request('/projects', { method: 'POST', body: project }),
  updateProject: (id, project) =>
    request(`/projects/${id}`, { method: 'PATCH', body: project }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
};
