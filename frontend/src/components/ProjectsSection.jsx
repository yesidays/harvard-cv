import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { projectsAPI } from '../services/api';

export default function ProjectsSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', impact: '', technologies: '', url: '' });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    const res = await projectsAPI.getAll();
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };
    await projectsAPI.create(data);
    setFormData({ name: '', impact: '', technologies: '', url: '' });
    loadItems();
  };

  return (
    <div>
      <div className="section-header"><h2>{t('projects.title')}</h2></div>
      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            {item.impact && <p>{item.impact}</p>}
            {item.technologies && <p className="text-muted">Tech: {item.technologies.join(', ')}</p>}
            {item.url && <p><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></p>}
            <button className="btn btn-secondary" onClick={async () => { await projectsAPI.delete(item.id); loadItems(); }}>
              {t('actions.delete')}
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="item-form">
        <h3>{t('projects.add')}</h3>
        <div className="form-group">
          <label className="form-label form-label-required">{t('projects.name')}</label>
          <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">{t('projects.impact')}</label>
          <textarea className="form-textarea" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('projects.technologies')}</label>
          <input className="form-input" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} placeholder="React, Node.js, PostgreSQL" />
          <span className="form-hint">{t('projects.technologiesHint')}</span>
        </div>
        <div className="form-group">
          <label className="form-label">{t('projects.url')}</label>
          <input type="url" className="form-input" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
        </div>
        <div className="section-actions">
          <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
        </div>
      </form>
    </div>
  );
}
