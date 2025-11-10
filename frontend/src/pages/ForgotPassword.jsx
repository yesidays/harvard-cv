/**
 * Forgot Password page
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await requestPasswordReset(email);

    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setEmail('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{t('app.title')}</h1>
          <p className="text-muted">{t('app.tagline')}</p>
        </div>

        <div className="auth-card card">
          <h2 className="text-center mb-lg">
            {t('auth.forgotPassword')}
          </h2>

          <p className="text-muted text-center mb-lg">
            {t('auth.forgotPasswordDescription')}
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label form-label-required">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? t('messages.loading') : t('auth.sendResetLink')}
            </button>
          </form>

          <div className="auth-toggle">
            <Link to="/login" className="btn-link">
              {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
