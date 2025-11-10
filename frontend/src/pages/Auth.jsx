/**
 * Authentication page (Login/Signup)
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isLogin
      ? await login(email, password)
      : await signup(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
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
            {isLogin ? t('auth.login') : t('auth.signup')}
          </h2>

          {error && <div className="error-message">{error}</div>}

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

            <div className="form-group">
              <label htmlFor="password" className="form-label form-label-required">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Link to="/forgot-password" className="btn-link">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading
                ? t('messages.loading')
                : isLogin
                ? t('auth.loginButton')
                : t('auth.signupButton')}
            </button>
          </form>

          <div className="auth-toggle">
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
              <strong>{isLogin ? t('auth.signup') : t('auth.login')}</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
