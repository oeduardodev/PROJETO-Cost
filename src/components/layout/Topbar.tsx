import { Link, NavLink } from 'react-router-dom';
import {
  HiOutlineDesktopComputer,
  HiOutlineFolder,
  HiOutlineMail,
  HiOutlineMenuAlt2,
  HiOutlineMoon,
  HiOutlineOfficeBuilding,
  HiOutlineSun,
  HiOutlineViewGrid,
  HiOutlineX,
} from 'react-icons/hi';
import { useTheme } from '../../hooks/useTheme';
import { DropdownMenu } from '../ui/DropdownMenu';
import { IconButton } from '../ui/IconButton';
import logo from '../../assets/logo-cost-light.png';
import logoLight from '../../assets/logo-cost-light.png';
interface TopbarProps { mobileOpen: boolean; onToggleMobileNav: () => void; onNavigate?: () => void; }

const NAV_ITEMS = [
  { to: '/', label: 'Visão geral', icon: HiOutlineViewGrid, end: true },
  { to: '/projects', label: 'Projetos', icon: HiOutlineFolder },
  { to: '/company', label: 'Empresa', icon: HiOutlineOfficeBuilding },
  { to: '/contact', label: 'Contato', icon: HiOutlineMail },
];

export function Topbar({ mobileOpen, onToggleMobileNav, onNavigate }: TopbarProps) {
  const { mode, resolvedTheme, setMode } = useTheme();

  const themeItems = [
    {
      label: 'Claro',
      icon: HiOutlineSun,
      active: mode === 'light',
      onClick: () => setMode('light'),
    },
    {
      label: 'Escuro',
      icon: HiOutlineMoon,
      active: mode === 'dark',
      onClick: () => setMode('dark'),
    },
    {
      label: 'Sistema',
      icon: HiOutlineDesktopComputer,
      active: mode === 'system',
      onClick: () => setMode('system'),
    },
  ];

  return (
    <header className="app-topbar">
      <Link
        to="/"
        className="topbar__brand"
        onClick={onNavigate}
        aria-label="Costs"
      >
        <img
          className="topbar__logo topbar__logo--light"
          src={logo}
          alt=""
          aria-hidden="true"
        />
        <img
          className="topbar__logo topbar__logo--dark"
          src={logoLight}
          alt=""
          aria-hidden="true"
        />
      </Link>

      <nav className="topbar__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                ['topbar__link', isActive ? 'is-active' : ''].filter(Boolean).join(' ')
              }
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="topbar__right">
        <DropdownMenu
          label="Alterar aparência"
          trigger={
            resolvedTheme === 'dark' ? (
              <HiOutlineMoon aria-hidden="true" />
            ) : (
              <HiOutlineSun aria-hidden="true" />
            )
          }
          items={themeItems}
        />

        <IconButton
          label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          icon={mobileOpen ? HiOutlineX : HiOutlineMenuAlt2}
          className="topbar__toggle"
          onClick={onToggleMobileNav}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        />
      </div>

      {mobileOpen ? (
        <nav className="topbar__mobile-nav" id="mobile-nav" aria-label="Menu">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  ['topbar__mobile-link', isActive ? 'is-active' : '']
                    .filter(Boolean)
                    .join(' ')
                }
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
