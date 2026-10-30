import { forwardRef, useEffect, useState } from 'react';
import { HiOutlineChevronDown, HiOutlineExclamationCircle } from 'react-icons/hi';
import { formatCurrencyInput, toNumber } from '../../utils/format';

function FieldShell({ id, label, required, error, hint, children }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="field">
      {label ? (
        <label className="field__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children(describedBy)}

      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          <HiOutlineExclamationCircle aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { label, id, name, error, hint, required, className = '', ...props },
  ref
) {
  const fieldId = id || name;

  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <input
          ref={ref}
          id={fieldId}
          name={name || fieldId}
          className={`input ${error ? 'input--invalid' : ''} ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...props}
        />
      )}
    </FieldShell>
  );
});

export const CurrencyInput = forwardRef(function CurrencyInput(
  {
    label,
    id,
    name,
    value,
    onChange,
    error,
    hint,
    required,
    disabled,
    placeholder = '0,00',
    className = '',
  },
  ref
) {
  const fieldId = id || name;
  const [display, setDisplay] = useState(() => (toNumber(value) ? formatCurrencyInput(value) : ''));

  useEffect(() => {
    const numeric = toNumber(value);

    if (!numeric) {
      setDisplay('');
      return;
    }

    const formatted = formatCurrencyInput(numeric);
    setDisplay((current) => (toNumber(current) === numeric ? current : formatted));
  }, [value]);

  const handleChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '');

    if (!digits) {
      setDisplay('');
      onChange?.(0);
      return;
    }

    const amount = Number(digits) / 100;
    setDisplay(formatCurrencyInput(amount));
    onChange?.(amount);
  };

  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <div className="input-group">
          <span className="input-group__prefix" aria-hidden="true">
            R$
          </span>
          <input
            ref={ref}
            id={fieldId}
            name={name || fieldId}
            className={`input ${error ? 'input--invalid' : ''} ${className}`.trim()}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={display}
            onChange={handleChange}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            required={required}
            disabled={disabled}
          />
        </div>
      )}
    </FieldShell>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, id, name, error, hint, required, className = '', ...props },
  ref
) {
  const fieldId = id || name;

  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <textarea
          ref={ref}
          id={fieldId}
          name={name || fieldId}
          className={`textarea ${error ? 'textarea--invalid' : ''} ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...props}
        />
      )}
    </FieldShell>
  );
});

export const Select = forwardRef(function Select(
  {
    label,
    id,
    name,
    options = [],
    placeholder = 'Selecione uma opção',
    error,
    hint,
    required,
    className = '',
    ...props
  },
  ref
) {
  const fieldId = id || name;

  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <div className="select-wrap">
          <select
            ref={ref}
            id={fieldId}
            name={name || fieldId}
            className={`select ${error ? 'select--invalid' : ''} ${className}`.trim()}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            required={required}
            {...props}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <HiOutlineChevronDown className="select-wrap__icon" aria-hidden="true" />
        </div>
      )}
    </FieldShell>
  );
});
