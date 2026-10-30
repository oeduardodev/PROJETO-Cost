import { forwardRef, useEffect, useState } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { HiOutlineChevronDown, HiOutlineExclamationCircle } from 'react-icons/hi';
import { formatCurrencyInput, toNumber } from '../../utils/format';

interface CommonFieldProps {
  label?: string;
  id?: string;
  name?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

interface FieldShellProps extends CommonFieldProps {
  id: string;
  children: (describedBy?: string) => ReactNode;
}

function FieldShell({ id, label, required, error, hint, children }: FieldShellProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="field">
      {label ? (
        <label className="field__label" htmlFor={id}>
          {label}
          {required ? <span className="field__required" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      {children(describedBy)}
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          <HiOutlineExclamationCircle aria-hidden="true" /> <span>{error}</span>
        </p>
      ) : hint ? <p className="field__hint" id={`${id}-hint`}>{hint}</p> : null}
    </div>
  );
}

type InputProps = CommonFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name' | 'required'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, name, error, hint, required, className = '', ...props }, ref
) {
  const fieldId = id || name || '';
  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <input
          ref={ref} id={fieldId} name={name || fieldId}
          className={`input ${error ? 'input--invalid' : ''} ${className}`.trim()}
          aria-invalid={error ? true : undefined} aria-describedby={describedBy}
          required={required} {...props}
        />
      )}
    </FieldShell>
  );
});

interface CurrencyInputProps extends CommonFieldProps {
  value: number | string;
  onChange?: (value: number) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  { label, id, name, value, onChange, error, hint, required, disabled, placeholder = '0,00', className = '' }, ref
) {
  const fieldId = id || name || '';
  const [display, setDisplay] = useState(() => (toNumber(value) ? formatCurrencyInput(value) : ''));

  useEffect(() => {
    const numeric = toNumber(value);
    if (!numeric) { setDisplay(''); return; }
    const formatted = formatCurrencyInput(numeric);
    setDisplay((current) => (toNumber(current) === numeric ? current : formatted));
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, '');
    if (!digits) { setDisplay(''); onChange?.(0); return; }
    const amount = Number(digits) / 100;
    setDisplay(formatCurrencyInput(amount));
    onChange?.(amount);
  };

  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <div className="input-group">
          <span className="input-group__prefix" aria-hidden="true">R$</span>
          <input
            ref={ref} id={fieldId} name={name || fieldId}
            className={`input ${error ? 'input--invalid' : ''} ${className}`.trim()}
            type="text" inputMode="decimal" autoComplete="off" value={display}
            onChange={handleChange} placeholder={placeholder}
            aria-invalid={error ? true : undefined} aria-describedby={describedBy}
            required={required} disabled={disabled}
          />
        </div>
      )}
    </FieldShell>
  );
});

type TextareaProps = CommonFieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'name' | 'required'>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, id, name, error, hint, required, className = '', ...props }, ref
) {
  const fieldId = id || name || '';
  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <textarea
          ref={ref} id={fieldId} name={name || fieldId}
          className={`textarea ${error ? 'textarea--invalid' : ''} ${className}`.trim()}
          aria-invalid={error ? true : undefined} aria-describedby={describedBy}
          required={required} {...props}
        />
      )}
    </FieldShell>
  );
});

interface SelectOption { value: string; label: string; }
interface SelectProps extends CommonFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'name' | 'required'> {
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, id, name, options = [], placeholder = 'Selecione uma opção', error, hint, required, className = '', ...props }, ref
) {
  const fieldId = id || name || '';
  return (
    <FieldShell id={fieldId} label={label} required={required} error={error} hint={hint}>
      {(describedBy) => (
        <div className="select-wrap">
          <select
            ref={ref} id={fieldId} name={name || fieldId}
            className={`select ${error ? 'select--invalid' : ''} ${className}`.trim()}
            aria-invalid={error ? true : undefined} aria-describedby={describedBy}
            required={required} {...props}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <HiOutlineChevronDown className="select-wrap__icon" aria-hidden="true" />
        </div>
      )}
    </FieldShell>
  );
});
