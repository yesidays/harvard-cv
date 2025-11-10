/**
 * Dashboard page - Main CV editor
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/ProfileForm';
import EducationSection from '../components/EducationSection';
import ExperienceSection from '../components/ExperienceSection';
import CertificationsSection from '../components/CertificationsSection';
import ProjectsSection from '../components/ProjectsSection';
import SkillsSection from '../components/SkillsSection';
import { profileAPI } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.get();
      setProfile(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Profile doesn't exist yet
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const sections = [
    { id: 'profile', label: t('profile.title') },
    { id: 'education', label: t('education.title') },
    { id: 'experience', label: t('experience.title') },
    { id: 'certifications', label: t('certifications.title') },
    { id: 'projects', label: t('projects.title') },
    { id: 'skills', label: t('skills.title') },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-content">
            <h1 className="nav-title">{t('app.title')}</h1>
            <div className="nav-actions">
              <button className="btn btn-secondary" onClick={handlePreview}>
                {t('actions.preview')}
              </button>
              <button className="btn btn-secondary" onClick={handleLogout}>
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-container container">
        <div className="dashboard-sidebar">
          <nav className="section-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`section-nav-item ${
                  activeSection === section.id ? 'active' : ''
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="dashboard-main">
          <div className="section-content">
            {activeSection === 'profile' && (
              <ProfileForm profile={profile} onUpdate={loadProfile} />
            )}
            {activeSection === 'education' && <EducationSection />}
            {activeSection === 'experience' && <ExperienceSection />}
            {activeSection === 'certifications' && <CertificationsSection />}
            {activeSection === 'projects' && <ProjectsSection />}
            {activeSection === 'skills' && <SkillsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
