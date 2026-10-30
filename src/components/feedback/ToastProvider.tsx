import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineX,
} from 'react-icons/hi';
import type { PropsWithChildren } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastOptions { duration?: number; }
interface ToastContextValue {
  success: (message: string, options?: ToastOptions) => string | null;
  error: (message: string, options?: ToastOptions) => string | null;
  info: (message: string, options?: ToastOptions) => string | null;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: HiOutlineCheckCircle,
  error: HiOutlineExclamationCircle,
  info: HiOutlineInformationCircle,
};

export function ToastProvider({ children }: PropsWithChildren<{}>) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef(new Map<string, number>());

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
      if (!message) {
        return null;
      }

      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [...current, { id, message, type }]);

      if (options.duration !== 0) {
        const timer = window.setTimeout(() => {
          removeToast(id);
        }, options.duration || 4500);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      success: (message: string, options?: ToastOptions) => pushToast(message, 'success', options),
      error: (message: string, options?: ToastOptions) => pushToast(message, 'error', options),
      info: (message: string, options?: ToastOptions) => pushToast(message, 'info', options),
      remove: removeToast,
    }),
    [pushToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];

          return (
            <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
              <span className="toast__icon" aria-hidden="true">
                <Icon />
              </span>
              <p className="toast__message">{toast.message}</p>
              <button
                type="button"
                className="toast__close"
                onClick={() => removeToast(toast.id)}
                aria-label="Fechar notificação"
              >
                <HiOutlineX aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.');
  }

  return context;
}
