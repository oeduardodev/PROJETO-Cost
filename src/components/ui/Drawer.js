import { createPortal } from 'react-dom';
import { HiOutlineX } from 'react-icons/hi';
import { useOverlay } from '../../hooks/useOverlay';
import { IconButton } from './IconButton';

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  initialFocusRef,
}) {
  const containerRef = useOverlay(open, onClose, initialFocusRef);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="overlay overlay--drawer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-describedby={description ? 'drawer-description' : undefined}
        ref={containerRef}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer__header">
          <div>
            <h2 className="drawer__title" id="drawer-title">
              {title}
            </h2>
            {description ? (
              <p className="drawer__description" id="drawer-description">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton label="Fechar" icon={HiOutlineX} onClick={onClose} />
        </div>

        <div className="drawer__body">{children}</div>
        {footer ? <div className="drawer__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
