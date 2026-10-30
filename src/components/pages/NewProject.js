import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../feedback/ToastProvider';
import { ProjectForm } from '../projects/ProjectForm';
import { Card } from '../ui/Card';
import { PageHeader } from '../ui/PageHeader';
import styles from './NewProject.module.css';

export default function NewProject() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setServerError('');

    try {
      await api.createProject({
        name: data.name,
        budget: data.budget,
        category: data.category,
        cost: 0,
        services: [],
      });

      toast.success('Projeto criado com sucesso.');
      setSubmitting(false);
      navigate('/projects');
    } catch (error) {
      setServerError('Não foi possível criar o projeto. Verifique sua conexão e tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Criar projeto"
        description="Defina as informações iniciais e o orçamento do seu projeto."
      />

      <Card className={styles.formCard} padded>
        <ProjectForm
          submitLabel="Criar projeto"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/projects')}
          loading={submitting}
          serverError={serverError}
        />
      </Card>
    </div>
  );
}
