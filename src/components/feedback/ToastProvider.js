import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineX,
} from 'react-icons/hi';

const ToastContext = createContext(null);

const ICONS = {
  success: HiOutlineCheckCircle,
  error: HiOutlineExclamationCircle,
  info: HiOutlineInformationCircle,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message, type = 'info', options = {}) => {
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
      success: (message, options) => pushToast(message, 'success', options),
      error: (message, options) => pushToast(message, 'error', options),
      info: (message, options) => pushToast(message, 'info', options),
      remove: removeToast,
    }),
    [pushToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || ICONS.info;

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
