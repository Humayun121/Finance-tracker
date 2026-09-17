import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

export function Nav() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="nav">
      <div className="nav-brand">Finance Tracker</div>
      <button
        type="button"
        className="btn btn-ghost nav-toggle"
        aria-expanded={menuOpen}
        aria-controls="nav-links"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
        <span className="sr-only">Menu</span>
      </button>
      <div id="nav-links" className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
        <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
        <NavLink to="/expenses" onClick={closeMenu}>Expenses</NavLink>
        <NavLink to="/categories" onClick={closeMenu}>Categories</NavLink>
        <NavLink to="/shifts" onClick={closeMenu}>Shifts</NavLink>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
