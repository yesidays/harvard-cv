/**
 * Reset Password page
 */
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    if (!token) {
      setError(t('auth.invalidResetToken'));
      return;
    }

    setLoading(true);

    const result = await resetPassword(token, password);

    setLoading(false);

    if (result.success) {
      // Show success message and redirect to login
      alert(result.message);
      navigate('/login');
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
            {t('auth.resetPassword')}
          </h2>

          <p className="text-muted text-center mb-lg">
            {t('auth.resetPasswordDescription')}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label form-label-required">
                {t('auth.newPassword')}
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label form-label-required">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? t('messages.loading') : t('auth.resetPasswordButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
