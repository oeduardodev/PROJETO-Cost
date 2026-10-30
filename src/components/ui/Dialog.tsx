import { createPortal } from 'react-dom';
import { HiOutlineX } from 'react-icons/hi';
import { useOverlay } from '../../hooks/useOverlay';
import { IconButton } from './IconButton';
import type { ReactNode, RefObject } from 'react';

interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  initialFocusRef?: RefObject<HTMLElement>;
  labelledBy?: string;
  describedBy?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'sm',
  initialFocusRef,
  labelledBy = 'dialog-title',
  describedBy,
}: DialogProps) {
  const containerRef = useOverlay(open, onClose, initialFocusRef);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className={`dialog dialog--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        ref={containerRef}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog__header">
          <h2 className="dialog__title" id={labelledBy}>
            {title}
          </h2>
          <IconButton label="Fechar" icon={HiOutlineX} onClick={onClose} />
        </div>

        {description ? (
          <p className="dialog__description" id={describedBy}>
            {description}
          </p>
        ) : null}

        {children ? <div className="dialog__body">{children}</div> : null}
        {footer ? <div className="dialog__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
