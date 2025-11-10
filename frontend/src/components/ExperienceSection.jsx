import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { experienceAPI } from '../services/api';

export default function ExperienceSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    company: '', role: '', location: '', start_date: '', end_date: '', bullets: ['']
  });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    const res = await experienceAPI.getAll();
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {...formData, bullets: formData.bullets.filter(b => b.trim())};
    editing ? await experienceAPI.update(editing, data) : await experienceAPI.create(data);
    setEditing(null);
    setFormData({ company: '', role: '', location: '', start_date: '', end_date: '', bullets: [''] });
    loadItems();
  };

  return (
    <div>
      <div className="section-header"><h2>{t('experience.title')}</h2></div>
      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h3>{item.company} — {item.role}</h3>
            <p className="text-muted">{item.location} | {item.start_date} - {item.end_date || 'Present'}</p>
            <ul>{item.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            <div className="item-actions">
              <button className="btn btn-secondary" onClick={() => { setEditing(item.id); setFormData(item); }}>
                {t('actions.edit')}
              </button>
              <button className="btn btn-secondary" onClick={async () => { await experienceAPI.delete(item.id); loadItems(); }}>
                {t('actions.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="item-form">
        <h3>{editing ? t('actions.edit') : t('experience.add')}</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label form-label-required">{t('experience.company')}</label>
            <input className="form-input" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label form-label-required">{t('experience.role')}</label>
            <input className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('experience.location')}</label>
            <input className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label form-label-required">{t('experience.startDate')}</label>
            <input type="month" className="form-input" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('experience.endDate')}</label>
            <input type="month" className="form-input" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('experience.bullets')}</label>
          <span className="form-hint">{t('experience.bulletsHint')}</span>
          {formData.bullets.map((bullet, i) => (
            <input key={i} className="form-input mb-sm" value={bullet}
              onChange={e => {
                const newBullets = [...formData.bullets];
                newBullets[i] = e.target.value;
                setFormData({...formData, bullets: newBullets});
              }}
              placeholder={t('experience.bulletPlaceholder')}
            />
          ))}
          <button type="button" className="btn btn-secondary" onClick={() => setFormData({...formData, bullets: [...formData.bullets, '']})}>
            + {t('actions.add')}
          </button>
        </div>
        <div className="section-actions">
          {editing && <button type="button" className="btn btn-secondary" onClick={() => {setEditing(null); setFormData({ company: '', role: '', location: '', start_date: '', end_date: '', bullets: [''] });}}>{t('actions.cancel')}</button>}
          <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
        </div>
      </form>
    </div>
  );
}
