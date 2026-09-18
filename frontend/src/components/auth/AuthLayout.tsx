import { ArrowLeft, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  eyebrow?: string;
  headline: string;
  lead: string;
  points: string[];
  children: ReactNode;
}

/** Shared split layout for Login and Sign up: marketing panel on the left, form on the right. */
export function AuthLayout({ eyebrow, headline, lead, points, children }: AuthLayoutProps) {
  return (
    <div className="auth">
      <div className="auth-side">
        <div className="auth-side-top">
          <div className="auth-brand">Finance Tracker</div>
          <Link to="/" className="btn btn-secondary auth-back">
            <ArrowLeft size={14} aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <div className="auth-side-main">
          {eyebrow && (
            <div className="eyebrow-chip">
              <span className="eyebrow-dot" />
              {eyebrow}
            </div>
          )}
          <h1 className="auth-headline">{headline}</h1>
          <p className="auth-lead">{lead}</p>
          <ul className="auth-points">
            {points.map((point) => (
              <li key={point}>
                <span className="auth-tick"><Check size={12} strokeWidth={3} aria-hidden="true" /></span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">{children}</div>
      </div>
    </div>
  );
}
