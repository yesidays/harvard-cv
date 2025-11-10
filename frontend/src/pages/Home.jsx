/**
 * Home/Landing page
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="home-hero">
          <h1 className="home-title">{t('home.welcome')}</h1>
          <p className="home-description">{t('home.description')}</p>
          <button className="btn btn-primary btn-large" onClick={handleCTA}>
            {t('home.cta')}
          </button>
        </div>

        <div className="home-features">
          <h2 className="text-center mb-xl">{t('home.features.title')}</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <h3>{t('home.features.professional.title')}</h3>
              <p className="text-muted">
                {t('home.features.professional.description')}
              </p>
            </div>

            <div className="feature-card card">
              <h3>{t('home.features.structured.title')}</h3>
              <p className="text-muted">
                {t('home.features.structured.description')}
              </p>
            </div>

            <div className="feature-card card">
              <h3>{t('home.features.export.title')}</h3>
              <p className="text-muted">
                {t('home.features.export.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
