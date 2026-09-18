import { LayoutDashboard, LogOut, SlidersHorizontal, Tag, Wallet, Clock } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', Icon: Wallet },
  { to: '/categories', label: 'Categories', Icon: Tag },
  { to: '/shifts', label: 'Shifts', Icon: Clock },
];

/** Layout route for every logged-in screen: sidebar on the left, page content via <Outlet />. */
export function AppShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Finance Tracker</div>
        <nav className="sidebar-nav" aria-label="Main">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-planned">
          <div className="sidebar-planned-title">Planned</div>
          <div className="side-link" aria-disabled="true">
            Budgets
            <span className="tag tag-outline">Soon</span>
          </div>
        </div>
        <div className="sidebar-foot">
          <div className="side-link" aria-disabled="true" title="Settings are not available yet">
            <SlidersHorizontal size={16} aria-hidden="true" />
            Settings
          </div>
          <button type="button" className="side-link" onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
