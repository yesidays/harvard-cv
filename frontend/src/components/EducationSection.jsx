/**
 * Education section component
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { educationAPI } from '../services/api';
import './Section.css';

export default function EducationSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    start_date: '',
    end_date: '',
    details: [],
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await educationAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading education:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await educationAPI.update(editing, formData);
      } else {
        await educationAPI.create(formData);
      }
      resetForm();
      loadItems();
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm(t('actions.delete') + '?')) {
      await educationAPI.delete(id);
      loadItems();
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      degree: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      details: [],
    });
  };

  return (
    <div>
      <div className="section-header">
        <h2>{t('education.title')}</h2>
      </div>

      <div className="items-list">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.institution}</h3>
            <p><strong>{item.degree}</strong></p>
            <p className="text-muted">
              {item.location} | {item.start_date} - {item.end_date || t('education.current')}
            </p>
            <div className="item-actions">
              <button className="btn btn-secondary" onClick={() => {
                setEditing(item.id);
                setFormData(item);
              }}>
                {t('actions.edit')}
              </button>
              <button className="btn btn-secondary" onClick={() => handleDelete(item.id)}>
                {t('actions.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="item-form">
        <h3>{editing ? t('actions.edit') : t('education.add')}</h3>

        <div className="form-group">
          <label className="form-label form-label-required">{t('education.degree')}</label>
          <input
            className="form-input"
            value={formData.degree}
            onChange={(e) => setFormData({...formData, degree: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">{t('education.institution')}</label>
          <input
            className="form-input"
            value={formData.institution}
            onChange={(e) => setFormData({...formData, institution: e.target.value})}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('education.location')}</label>
            <input
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('education.startDate')}</label>
            <input
              type="month"
              className="form-input"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('education.endDate')}</label>
            <input
              type="month"
              className="form-input"
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            />
          </div>
        </div>

        <div className="section-actions">
          {editing && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              {t('actions.cancel')}
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {t('actions.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
