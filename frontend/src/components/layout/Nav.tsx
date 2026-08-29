import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

export function Nav() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="nav">
      <div className="nav-brand">Finance Tracker</div>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/expenses">Expenses</NavLink>
      <NavLink to="/categories">Categories</NavLink>
      <NavLink to="/settings">Settings</NavLink>
      <button type="button" className="btn btn-secondary" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
