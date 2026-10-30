import { useEffect, useRef, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { formatCurrency } from '../../utils/format';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Dialog } from '../ui/Dialog';
import { CurrencyInput, Input, Textarea } from '../ui/Form';
import styles from './ServiceDrawer.module.css';

const EMPTY_SERVICE = { name: '', cost: 0, description: '' };

export function ServiceDrawer({ open, onClose, onSubmit, saving, serverError, available }) {
  const [values, setValues] = useState(EMPTY_SERVICE);
  const [errors, setErrors] = useState({});
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const nameRef = useRef(null);
  const costRef = useRef(null);

  useEffect(() => {
    if (open) {
      setValues(EMPTY_SERVICE);
      setErrors({});
      setConfirmDiscard(false);
    }
  }, [open]);

  const isDirty =
    Boolean(values.name.trim()) || values.cost > 0 || Boolean(values.description.trim());

  const requestClose = () => {
    if (saving) {
      return;
    }

    if (isDirty) {
      setConfirmDiscard(true);
      return;
    }

    onClose();
  };

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Informe o nome do serviço.';
    } else if (values.name.trim().length > 80) {
      nextErrors.name = 'Use no máximo 80 caracteres.';
    }

    if (!values.cost || values.cost <= 0) {
      nextErrors.cost = 'Informe um custo maior que zero.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      (nextErrors.name ? nameRef : costRef).current?.focus();
      return;
    }

    onSubmit({
      name: values.name.trim(),
      cost: values.cost,
      description: values.description.trim(),
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={requestClose}
        title="Adicionar serviço"
        description="Registre um novo serviço e seu custo."
        size="md"
        initialFocusRef={nameRef}
        footer={
          <>
            <Button variant="secondary" onClick={requestClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="service-form" loading={saving}>
              Adicionar serviço
            </Button>
          </>
        }
      >
        <form id="service-form" className="form-grid" onSubmit={handleSubmit} noValidate>
          {serverError ? (
            <div className="form-alert form-alert--danger" role="alert">
              <HiOutlineExclamationCircle aria-hidden="true" />
              <span>{serverError}</span>
            </div>
          ) : null}

          <div className={styles.available}>
            <span>Disponível neste projeto</span>
            <strong>{formatCurrency(Math.max(0, available))}</strong>
          </div>

          <Input
            ref={nameRef}
            id="service-name"
            name="name"
            label="Nome do serviço"
            placeholder="Ex.: Consultoria de UX"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            error={errors.name}
            maxLength={80}
            required
          />

          <CurrencyInput
            ref={costRef}
            id="service-cost"
            name="cost"
            label="Custo do serviço"
            value={values.cost}
            onChange={(value) => updateField('cost', value)}
            error={errors.cost}
            hint="O valor será somado ao total utilizado do projeto."
            required
          />

          <Textarea
            id="service-description"
            name="description"
            label="Descrição do serviço"
            placeholder="Descreva o escopo ou a finalidade deste serviço."
            value={values.description}
            onChange={(event) => updateField('description', event.target.value)}
            rows={4}
          />
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmDiscard}
        title="Descartar serviço?"
        description="As informações preenchidas serão perdidas."
        confirmLabel="Descartar"
        cancelLabel="Continuar editando"
        onConfirm={() => {
          setConfirmDiscard(false);
          onClose();
        }}
        onClose={() => setConfirmDiscard(false)}
      />
    </>
  );
}
