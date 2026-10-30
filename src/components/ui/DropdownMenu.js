import { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineCheck } from 'react-icons/hi';

let dropdownSequence = 0;

export function DropdownMenu({
  label = 'Mais ações',
  trigger,
  items = [],
  align = 'end',
  triggerClassName = '',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuIdRef = useRef(null);

  if (!menuIdRef.current) {
    dropdownSequence += 1;
    menuIdRef.current = `dropdown-menu-${dropdownSequence}`;
  }

  const menuId = menuIdRef.current;

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    const firstItem = menuRef.current?.querySelector('[role="menuitem"]');
    firstItem?.focus();

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  const handleMenuKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    const focusable = Array.from(
      menuRef.current?.querySelectorAll('[role="menuitem"]') || []
    );

    if (!focusable.length) {
      return;
    }

    event.preventDefault();
    const currentIndex = focusable.indexOf(document.activeElement);

    if (event.key === 'Home') {
      focusable[0].focus();
      return;
    }

    if (event.key === 'End') {
      focusable[focusable.length - 1].focus();
      return;
    }

    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + direction + focusable.length) % focusable.length;
    focusable[nextIndex].focus();
  };

  const handleItemClick = (item) => {
    closeMenu(false);
    item.onClick?.();
  };

  return (
    <div className="dropdown" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`icon-btn ${triggerClassName}`.trim()}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        title={label}
        onClick={() => setOpen((current) => !current)}
      >
        {trigger}
      </button>

      {open ? (
        <div
          className={`dropdown__menu ${align === 'start' ? 'dropdown__menu--left' : ''}`}
          role="menu"
          id={menuId}
          aria-label={label}
          ref={menuRef}
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item, index) => {
            if (item.type === 'label') {
              return (
                <div key={`label-${index}`} className="dropdown__label">
                  {item.label}
                </div>
              );
            }

            if (item.type === 'separator' || item.separatorBefore) {
              const SeparatorIcon = item.icon;

              return (
                <div key={`separator-${index}`}>
                  <div className="dropdown__separator" role="separator" />
                  {item.label ? (
                    <button
                      type="button"
                      role="menuitem"
                      className={`dropdown__item ${item.danger ? 'dropdown__item--danger' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      {SeparatorIcon ? <SeparatorIcon aria-hidden="true" /> : null}
                      <span className="dropdown__item-label">{item.label}</span>
                    </button>
                  ) : null}
                </div>
              );
            }

            const Icon = item.icon;

            return (
              <button
                key={`${item.label}-${index}`}
                type="button"
                role="menuitem"
                className={`dropdown__item ${item.danger ? 'dropdown__item--danger' : ''} ${
                  item.active ? 'dropdown__item--active' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {Icon ? <Icon aria-hidden="true" /> : null}
                <span className="dropdown__item-label">{item.label}</span>
                {item.active ? (
                  <HiOutlineCheck className="dropdown__check" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
