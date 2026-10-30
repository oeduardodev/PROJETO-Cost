import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineChartPie,
  HiOutlineFolder,
  HiOutlinePlus,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PageHeader } from '../ui/PageHeader';
import styles from './Company.module.css';

const FEATURES = [
  {
    icon: HiOutlineFolder,
    title: 'Gestão de projetos',
    text: 'Cadastre projetos, organize categorias e mantenha todas as iniciativas em um só lugar.',
  },
  {
    icon: HiOutlineBriefcase,
    title: 'Organização de serviços',
    text: 'Registre os serviços de cada projeto com nome, descrição e custo.',
  },
  {
    icon: HiOutlineCash,
    title: 'Controle de orçamentos',
    text: 'Defina limites de gastos e acompanhe o saldo disponível em cada projeto.',
  },
  {
    icon: HiOutlineChartPie,
    title: 'Acompanhamento de custos',
    text: 'Visualize o percentual utilizado e identifique rapidamente orçamentos excedidos.',
  },
];

export default function Company() {
  return (
    <div className="page">
      <PageHeader
        title="Sobre o Costs"
        description="Uma forma simples e organizada de gerenciar projetos, serviços e orçamentos."
      />

      <Card className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <HiOutlineSparkles aria-hidden="true" />
            Gestão financeira de projetos
          </span>
          <h2 className={styles.heroTitle}>Organize projetos. Controle custos. Decida melhor.</h2>
          <p className={styles.heroText}>
            O Costs reúne o essencial para acompanhar a saúde financeira dos seus projetos:
            orçamentos claros, serviços organizados e uma visão objetiva do que já foi utilizado.
          </p>
          <div className={styles.heroActions}>
            <Button to="/newproject" icon={HiOutlinePlus}>
              Começar a gerenciar projetos
            </Button>
            <Button to="/projects" variant="secondary" iconRight={HiOutlineArrowRight}>
              Ver projetos
            </Button>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualCard}>
            <span className={styles.visualLabel}>Visão financeira</span>
            <div className={styles.visualRows}>
              <span className={styles.visualRow}>
                <span className={styles.visualDot} />
                <span className={styles.visualLine} />
              </span>
              <span className={styles.visualRow}>
                <span className={styles.visualDot} />
                <span className={styles.visualLineShort} />
              </span>
              <span className={styles.visualRow}>
                <span className={styles.visualDot} />
                <span className={styles.visualLine} />
              </span>
            </div>
          </div>
          <div className={styles.visualBars}>
            <span style={{ height: '46%' }} />
            <span style={{ height: '72%' }} />
            <span style={{ height: '58%' }} />
            <span style={{ height: '88%' }} />
            <span style={{ height: '64%' }} />
          </div>
        </div>
      </Card>

      <section className={styles.purpose} aria-labelledby="proposito-title">
        <h2 className={styles.purposeTitle} id="proposito-title">
          Feito para manter os custos sob controle
        </h2>
        <p className={styles.purposeText}>
          Projetos costumam envolver muitos serviços, valores e decisões. O Costs foi pensado para
          tornar esse acompanhamento direto: cada projeto tem seu orçamento, seus serviços e um
          indicador claro de utilização. Assim, você identifica desvios cedo e toma decisões com
          mais segurança.
        </p>
      </section>

      <section className={styles.features} aria-label="Funcionalidades do Costs">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title} className={styles.feature} padded>
              <span className={styles.featureIcon} aria-hidden="true">
                <Icon />
              </span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.text}</p>
            </Card>
          );
        })}
      </section>

      <Card className={styles.cta}>
        <div>
          <h2 className={styles.ctaTitle}>Pronto para organizar seus projetos?</h2>
          <p className={styles.ctaText}>
            Crie seu primeiro projeto e comece a acompanhar orçamentos e serviços.
          </p>
        </div>
        <Button to="/newproject" icon={HiOutlinePlus}>
          Começar a gerenciar projetos
        </Button>
      </Card>
    </div>
  );
}
