import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { InlineError } from '../components/ui/Feedback';
import { PasswordField } from '../components/ui/PasswordField';
import { useAuth } from '../auth/useAuth';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password, remember);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      headline="Pick up where you left off."
      lead="Your expenses, categories and logged shifts are exactly where you left them."
      points={['Expenses and categories, ready to filter', 'Shifts for any pay period', 'Estimated gross pay, already worked out']}
    >
      <h2 className="auth-title">Log in</h2>
      <p className="auth-sub">
        New here? <Link to="/signup">Create an account</Link>
      </p>

      <form className="auth-fields" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="lg-user">Username</label>
          <input
            id="lg-user"
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <PasswordField id="lg-pass" label="Password" value={password} onChange={setPassword} autoComplete="current-password" />

        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Keep me logged in on this device
        </label>

        {error && <InlineError message={error} />}
        <button className="btn btn-primary btn-block auth-submit" type="submit" disabled={submitting || !username.trim() || !password}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
}
