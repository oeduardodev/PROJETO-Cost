import { useRef, useState } from 'react';
import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select, Textarea } from '../ui/Form';
import { PageHeader } from '../ui/PageHeader';
import styles from './Contact.module.css';

const SUBJECTS = [
  { value: 'duvida', label: 'Dúvida sobre o produto' },
  { value: 'sugestao', label: 'Sugestão de melhoria' },
  { value: 'problema', label: 'Problema técnico' },
  { value: 'outro', label: 'Outro assunto' },
];

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };
type ContactField = keyof typeof EMPTY_FORM;
type ContactErrors = Partial<Record<ContactField, string>>;

export default function Contact() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [notice, setNotice] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const updateField = (field: ContactField, value: string) => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ContactErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Informe seu nome.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!values.subject) {
      nextErrors.subject = 'Selecione um assunto.';
    }

    if (!values.message.trim()) {
      nextErrors.message = 'Escreva sua mensagem.';
    } else if (values.message.trim().length < 20) {
      nextErrors.message = 'Detalhe um pouco mais sua mensagem (mínimo de 20 caracteres).';
    }

    setErrors(nextErrors);
    setNotice(false);

    if (Object.keys(nextErrors).length) {
      const firstRef = nextErrors.name
        ? nameRef
        : nextErrors.email
        ? emailRef
        : nextErrors.subject
        ? subjectRef
        : messageRef;
      firstRef.current?.focus();
      return;
    }

    setNotice(true);
  };

  const handleReset = () => {
    setValues(EMPTY_FORM);
    setErrors({});
    setNotice(false);
  };

  return (
    <div className="page">
      <PageHeader
        title="Contato"
        description="Dúvidas, sugestões ou problemas? Veja como falar com a equipe do Costs."
      />

      <div className={styles.layout}>
        <Card className={styles.formCard} padded>
          <div className={styles.cardHeading}>
            <span className={styles.cardIcon} aria-hidden="true">
              <HiOutlineMail />
            </span>
            <div>
              <h2 className={styles.cardTitle}>Envie sua mensagem</h2>
              <p className={styles.cardText}>
                Preencha os campos abaixo para registrar sua solicitação.
              </p>
            </div>
          </div>

          {notice ? (
            <div className="alert alert--info" role="status">
              <HiOutlineInformationCircle aria-hidden="true" />
              <span>
                O envio de mensagens ainda não está configurado neste ambiente. Nenhuma mensagem
                foi enviada.
              </span>
            </div>
          ) : null}

          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className="form-grid form-grid--two">
              <Input
                ref={nameRef}
                id="contact-name"
                name="name"
                label="Seu nome"
                placeholder="Como podemos chamar você?"
                value={values.name}
                onChange={(event) => updateField('name', event.target.value)}
                error={errors.name}
                required
              />

              <Input
                ref={emailRef}
                id="contact-email"
                name="email"
                type="email"
                label="Seu e-mail"
                placeholder="voce@exemplo.com"
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                error={errors.email}
                required
              />
            </div>

            <Select
              ref={subjectRef}
              id="contact-subject"
              name="subject"
              label="Assunto"
              placeholder="Selecione um assunto"
              options={SUBJECTS}
              value={values.subject}
              onChange={(event) => updateField('subject', event.target.value)}
              error={errors.subject}
              required
            />

            <Textarea
              ref={messageRef}
              id="contact-message"
              name="message"
              label="Mensagem"
              placeholder="Descreva sua dúvida, sugestão ou problema."
              value={values.message}
              onChange={(event) => updateField('message', event.target.value)}
              error={errors.message}
              hint="Inclua o máximo de contexto possível para facilitar o atendimento."
              rows={6}
              required
            />

            <div className={styles.formActions}>
              <Button type="submit" iconRight={HiOutlineArrowRight}>
                Enviar mensagem
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset}>
                Limpar formulário
              </Button>
            </div>
          </form>
        </Card>

        <div className={styles.side}>
          <Card padded>
            <h2 className={styles.sideTitle}>Como podemos ajudar?</h2>
            <p className={styles.sideText}>
              O formulário é o ponto de partida para relatar dúvidas, sugerir melhorias ou
              descrever problemas encontrados na aplicação.
            </p>

            <ul className={styles.checklist}>
              <li>
                <HiOutlineCheckCircle aria-hidden="true" />
                <span>Informe o contexto da solicitação.</span>
              </li>
              <li>
                <HiOutlineCheckCircle aria-hidden="true" />
                <span>Descreva o comportamento esperado e o observado.</span>
              </li>
              <li>
                <HiOutlineCheckCircle aria-hidden="true" />
                <span>Inclua o nome do projeto, quando aplicável.</span>
              </li>
            </ul>

            <div className={styles.note}>
              <HiOutlineInformationCircle aria-hidden="true" />
              <p>
                <strong>Envio não configurado.</strong> Este ambiente não está conectado a um
                serviço de e-mail, por isso o formulário não transmite mensagens.
              </p>
            </div>
          </Card>

          <Card padded>
            <span className={styles.sideIcon} aria-hidden="true">
              <HiOutlineQuestionMarkCircle />
            </span>
            <h2 className={styles.sideTitle}>Precisa de ajuda com projetos?</h2>
            <p className={styles.sideText}>
              Consulte seus projetos e acompanhe orçamentos, custos e serviços em um só lugar.
            </p>
            <div className={styles.sideActions}>
              <Button to="/projects" variant="secondary" iconRight={HiOutlineArrowRight}>
                Ver projetos
              </Button>
              <Button to="/newproject" variant="ghost" iconRight={HiOutlineArrowRight}>
                Criar projeto
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
