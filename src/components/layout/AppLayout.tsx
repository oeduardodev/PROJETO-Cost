import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Topbar } from './Topbar';
import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren<{}>) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>

      <Topbar
        mobileOpen={mobileOpen}
        onToggleMobileNav={() => setMobileOpen((current) => !current)}
        onNavigate={() => setMobileOpen(false)}
      />

      {mobileOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Fechar menu de navegação"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="app-main">
        <main id="main-content" className="app-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>Costs</span>
          <span aria-hidden="true">·</span>
          <span>Gestão de projetos e orçamentos</span>
        </footer>
      </div>
    </div>
  );
}
