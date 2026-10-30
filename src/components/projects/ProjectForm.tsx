import { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import { api } from '../../services/api';
import { formatCurrency, toNumber } from '../../utils/format';
import { Button } from '../ui/Button';
import { CurrencyInput, Input, Select } from '../ui/Form';
import type { Category, Project } from '../../types';

interface ProjectFormValues { name: string; budget: number; categoryId: string; }
export interface ProjectFormData { name: string; budget: number; category: Category; }
interface ProjectFormProps { initialData?: Project; submitLabel?: string; onSubmit: (data: ProjectFormData) => void; onCancel?: () => void; loading?: boolean; serverError?: string; minBudget?: number; }

function getInitialValues(project?: Project): ProjectFormValues {
  return {
    name: project?.name || '',
    budget: project ? toNumber(project.budget) : 0,
    categoryId: project?.category?.id !== undefined ? String(project.category.id) : '',
  };
}

export function ProjectForm({
  initialData,
  submitLabel = 'Criar projeto',
  onSubmit,
  onCancel,
  loading = false,
  serverError = '',
  minBudget = 0,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(() => getInitialValues(initialData));
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormValues, string>>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const budgetRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError('');

    try {
      const data = await api.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setCategoriesError('Não foi possível carregar as categorias.');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    setValues(getInitialValues(initialData));
    setErrors({});
  }, [initialData]);

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  if (
    initialData?.category &&
    !categoryOptions.some((option) => option.value === String(initialData.category.id))
  ) {
    categoryOptions.push({
      value: String(initialData.category.id),
      label: initialData.category.name,
    });
  }

  const updateField = (field: keyof ProjectFormValues, value: string | number) => {
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

  const validate = () => {
    const nextErrors: Partial<Record<keyof ProjectFormValues, string>> = {};
    const name = values.name.trim();

    if (!name) {
      nextErrors.name = 'Informe o nome do projeto.';
    } else if (name.length < 3) {
      nextErrors.name = 'Use pelo menos 3 caracteres.';
    } else if (name.length > 80) {
      nextErrors.name = 'Use no máximo 80 caracteres.';
    }

    if (!values.budget || values.budget <= 0) {
      nextErrors.budget = 'Informe um orçamento maior que zero.';
    } else if (minBudget > 0 && values.budget < minBudget) {
      nextErrors.budget = `O orçamento não pode ser menor que o custo atual (${formatCurrency(
        minBudget
      )}).`;
    }

    if (!values.categoryId) {
      nextErrors.categoryId = 'Selecione uma categoria.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstField = (['name', 'budget', 'categoryId'] as Array<keyof ProjectFormValues>).find(
        (field) => nextErrors[field]
      );
      const refs = { name: nameRef, budget: budgetRef, categoryId: categoryRef };
      if (firstField) refs[firstField].current?.focus();
      return;
    }

    const selectedCategory =
      categories.find((category) => String(category.id) === String(values.categoryId)) ||
      initialData?.category;

    if (!selectedCategory) return;
    onSubmit({
      name: values.name.trim(),
      budget: values.budget,
      category: selectedCategory,
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      {serverError ? (
        <div className="form-alert form-alert--danger" role="alert">
          <HiOutlineExclamationCircle aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      ) : null}

      {categoriesError ? (
        <div className="form-alert form-alert--danger" role="alert">
          <HiOutlineExclamationCircle aria-hidden="true" />
          <span>{categoriesError}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={HiOutlineRefresh}
            onClick={loadCategories}
          >
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <Input
        ref={nameRef}
        id="project-name"
        name="name"
        label="Nome do projeto"
        placeholder="Ex.: Portal do cliente"
        value={values.name}
        onChange={(event) => updateField('name', event.target.value)}
        error={errors.name}
        hint="Um nome claro ajuda a identificar o projeto rapidamente."
        required
        maxLength={80}
        autoFocus
      />

      <CurrencyInput
        ref={budgetRef}
        id="project-budget"
        name="budget"
        label="Orçamento do projeto"
        value={values.budget}
        onChange={(value) => updateField('budget', value)}
        error={errors.budget}
        hint="Valor total disponível para os serviços deste projeto."
        required
      />

      <Select
        ref={categoryRef}
        id="project-category"
        name="category_id"
        label="Categoria"
        value={values.categoryId}
        onChange={(event) => updateField('categoryId', event.target.value)}
        options={categoryOptions}
        placeholder={
          categoriesLoading
            ? 'Carregando categorias...'
            : categoriesError
            ? 'Categorias indisponíveis'
            : 'Selecione uma categoria'
        }
        error={errors.categoryId}
        disabled={categoriesLoading || Boolean(categoriesError)}
        required
      />

      <div className="form-actions">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
