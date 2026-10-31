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
    title: 'Projetos',
    text: 'Organize tudo em um só lugar.',
  },
  {
    icon: HiOutlineBriefcase,
    title: 'Serviços',
    text: 'Registre itens e valores.',
  },
  {
    icon: HiOutlineCash,
    title: 'Orçamentos',
    text: 'Acompanhe limites e saldo.',
  },
  {
    icon: HiOutlineChartPie,
    title: 'Custos',
    text: 'Veja o percentual utilizado.',
  },
];

export default function Company() {
  return (
    <div className="page">
      <PageHeader title="Sobre o Costs" />

      <Card className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <HiOutlineSparkles aria-hidden="true" />
            Projetos e custos
          </span>
          <h2 className={styles.heroTitle}>Tudo em um só lugar.</h2>
          <p className={styles.heroText}>
            Organize serviços e acompanhe o orçamento de cada projeto.
          </p>
          <div className={styles.heroActions}>
            <Button to="/newproject" icon={HiOutlinePlus}>
              Novo projeto
            </Button>
            <Button to="/projects" variant="secondary" iconRight={HiOutlineArrowRight}>
              Ver projetos
            </Button>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualCard}>
            <span className={styles.visualLabel}>Custos</span>
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
    </div>
  );
}
