import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { InlineError } from '../components/ui/Feedback';
import { PasswordField } from '../components/ui/PasswordField';
import { useAuth } from '../auth/useAuth';

interface Strength {
  label: string;
  pct: number;
  level: 'none' | 'weak' | 'fair' | 'good' | 'strong';
}

function passwordStrength(password: string): Strength {
  if (!password) return { label: 'Password strength', pct: 0, level: 'none' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', pct: 25, level: 'weak' };
  if (score === 2) return { label: 'Fair', pct: 55, level: 'fair' };
  if (score === 3) return { label: 'Good', pct: 80, level: 'good' };
  return { label: 'Strong', pct: 100, level: 'strong' };
}

export function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const strength = passwordStrength(password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = username.trim() !== '' && email.trim() !== '' && password !== '' && agreed && !submitting;

  return (
    <AuthLayout
      headline="Start tracking in under two minutes."
      lead="Create an account, add your first expense, and log a shift."
      points={[
        'Log expenses and group them by your own categories',
        'Track shifts across any pay period, not calendar months',
        'See estimated gross pay worked out for you',
      ]}
    >
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-sub">
        Already have one? <Link to="/login">Log in</Link>
      </p>

      <form className="auth-fields" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="su-user">Username</label>
          <input
            id="su-user"
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="su-email">Email</label>
          <input
            id="su-email"
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <PasswordField id="su-pass" label="Password" value={password} onChange={setPassword} autoComplete="new-password" />
          <div className="strength" aria-live="polite">
            <div className="strength-track">
              <span className={`strength-fill strength-${strength.level}`} style={{ width: `${strength.pct}%` }} />
            </div>
            <span className="strength-label">{strength.label}</span>
          </div>
        </div>

        <label className="check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          I agree to the Terms and Privacy Policy.
        </label>

        {error && <InlineError message={error} />}
        <button className="btn btn-primary btn-block auth-submit" type="submit" disabled={!canSubmit}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
