import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { certificationsAPI } from '../services/api';

export default function CertificationsSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', issuer: '', date: '', credential_id: '', url: '' });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    const res = await certificationsAPI.getAll();
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await certificationsAPI.create(formData);
    setFormData({ name: '', issuer: '', date: '', credential_id: '', url: '' });
    loadItems();
  };

  return (
    <div>
      <div className="section-header"><h2>{t('certifications.title')}</h2></div>
      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p><strong>{item.issuer}</strong> | {item.date}</p>
            {item.credential_id && <p className="text-muted">ID: {item.credential_id}</p>}
            <button className="btn btn-secondary" onClick={async () => { await certificationsAPI.delete(item.id); loadItems(); }}>
              {t('actions.delete')}
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="item-form">
        <h3>{t('certifications.add')}</h3>
        <div className="form-group">
          <label className="form-label form-label-required">{t('certifications.name')}</label>
          <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label form-label-required">{t('certifications.issuer')}</label>
          <input className="form-input" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('certifications.date')}</label>
            <input type="month" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('certifications.credentialId')}</label>
            <input className="form-input" value={formData.credential_id} onChange={e => setFormData({...formData, credential_id: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('certifications.url')}</label>
          <input type="url" className="form-input" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
        </div>
        <div className="section-actions">
          <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
        </div>
      </form>
    </div>
  );
}
