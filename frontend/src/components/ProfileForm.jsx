/**
 * Profile form component
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { profileAPI } from '../services/api';

export default function ProfileForm({ profile, onUpdate }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin: profile.linkedin || '',
        summary: profile.summary || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (profile) {
        await profileAPI.update(formData);
      } else {
        await profileAPI.create(formData);
      }
      setMessage(t('messages.saved'));
      onUpdate();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || t('messages.error')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>{t('profile.title')}</h2>
      </div>

      {message && (
        <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name" className="form-label form-label-required">
              {t('profile.firstName')}
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-input"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name" className="form-label form-label-required">
              {t('profile.lastName')}
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-input"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label form-label-required">
            {t('profile.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              {t('profile.phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              {t('profile.location')}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="linkedin" className="form-label">
            {t('profile.linkedin')}
          </label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            className="form-input"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary" className="form-label">
            {t('profile.summary')}
          </label>
          <textarea
            id="summary"
            name="summary"
            className="form-textarea"
            value={formData.summary}
            onChange={handleChange}
            rows="5"
          ></textarea>
          <span className="form-hint">{t('profile.summaryHint')}</span>
        </div>

        <div className="section-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('messages.loading') : t('actions.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
