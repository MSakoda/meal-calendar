import { CalendarDays, ChevronRight, Menu, Moon, RotateCcw, Sun, Utensils, X } from 'lucide-react';
import type { AppView } from '../../types';

const navItems: Array<{ label: string; value: AppView; icon: typeof CalendarDays }> = [
  { label: 'Calendar', value: 'home', icon: CalendarDays },
  { label: 'Meals', value: 'meals', icon: Utensils },
];

type SideNavProps = {
  activeView: AppView;
  dark: boolean;
  isCollapsed: boolean;
  onGoHomeToday: () => void;
  onResetDemo: () => void;
  onSelectView: (view: AppView) => void;
  onToggleTheme: () => void;
  onToggle: () => void;
};

export function SideNav({ activeView, dark, isCollapsed, onGoHomeToday, onResetDemo, onSelectView, onToggleTheme, onToggle }: SideNavProps) {
  return (
    <aside className={isCollapsed ? 'app-sidebar collapsed' : 'app-sidebar'}>
      <button
        aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        className="icon-button sidebar-toggle"
        data-tooltip={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        onClick={onToggle}
      >
        <span className="desktop-toggle-icon">{isCollapsed ? <ChevronRight size={18} /> : <X size={18} />}</span>
        <span className="mobile-toggle-icon" aria-hidden="true">
          <span className="hamburger-icon">
            <Menu size={18} />
          </span>
          <span className="close-icon">
            <X size={18} />
          </span>
        </span>
      </button>
      <nav className="nav-list" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const handleClick = item.value === 'home' ? onGoHomeToday : () => onSelectView(item.value);
          return (
            <button
              aria-label={item.label}
              className={activeView === item.value ? 'nav-item active' : 'nav-item'}
              key={item.value}
              onClick={handleClick}
              data-tooltip={item.label}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="nav-actions">
        <button aria-label="Toggle color mode" className="nav-item" data-tooltip="Toggle color mode" onClick={onToggleTheme}>
          {dark ? <Sun size={19} /> : <Moon size={19} />}
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <button aria-label="Reset demo data" className="nav-item" data-tooltip="Reset demo data" onClick={onResetDemo}>
          <RotateCcw size={19} />
          <span>Reset data</span>
        </button>
      </div>
    </aside>
  );
}
