import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import type { Project } from '../types';

function getErrorStatus(error: unknown): number | undefined {
  return error instanceof Error && 'status' in error
    ? (error as Error & { status?: number }).status
    : undefined;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (requestRef.current) {
      requestRef.current.abort();
    }

    const controller = new AbortController();
    requestRef.current = controller;

    setLoading(true);
    setError('');

    try {
      const data = await api.getProjects({ signal: controller.signal });
      setProjects(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (!isAbortError(requestError)) {
        setError('Não foi possível carregar os projetos.');
      }
    } finally {
      if (requestRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    load();

    return () => {
      requestRef.current?.abort();
    };
  }, [load]);

  return { projects, setProjects, loading, error, reload: load };
}

export function useProject(id?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setError('Projeto não encontrado.');
      return;
    }

    if (requestRef.current) {
      requestRef.current.abort();
    }

    const controller = new AbortController();
    requestRef.current = controller;

    setLoading(true);
    setError('');

    try {
      const data = await api.getProject(id, { signal: controller.signal });
      setProject(data);
    } catch (requestError) {
      if (!isAbortError(requestError)) {
        setError(
          getErrorStatus(requestError) === 404
            ? 'Projeto não encontrado.'
            : 'Não foi possível carregar o projeto.'
        );
      }
    } finally {
      if (requestRef.current === controller) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    load();

    return () => {
      requestRef.current?.abort();
    };
  }, [load]);

  return { project, setProject, loading, error, reload: load };
}
