import { Button } from './Button';
import { Dialog } from './Dialog';

export function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onClose,
  loading = false,
  tone = 'danger',
  icon,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      labelledBy="confirm-dialog-title"
      describedBy="confirm-dialog-description"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            icon={icon}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description ? (
        <p className="dialog__text" id="confirm-dialog-description">
          {description}
        </p>
      ) : null}
      {children}
    </Dialog>
  );
}
