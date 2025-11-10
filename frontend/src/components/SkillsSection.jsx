import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { skillsAPI } from '../services/api';

export default function SkillsSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ languages: '', tools: '', methods: '' });
  const [hasSkills, setHasSkills] = useState(false);

  useEffect(() => { loadSkills(); }, []);

  const loadSkills = async () => {
    try {
      const res = await skillsAPI.get();
      if (res.data) {
        setFormData({
          languages: res.data.languages?.join(', ') || '',
          tools: res.data.tools?.join(', ') || '',
          methods: res.data.methods?.join(', ') || ''
        });
        setHasSkills(true);
      }
    } catch (error) {
      setHasSkills(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
      tools: formData.tools.split(',').map(s => s.trim()).filter(Boolean),
      methods: formData.methods.split(',').map(s => s.trim()).filter(Boolean)
    };
    hasSkills ? await skillsAPI.update(data) : await skillsAPI.create(data);
    alert(t('messages.saved'));
    loadSkills();
  };

  return (
    <div>
      <div className="section-header"><h2>{t('skills.title')}</h2></div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('skills.languages')}</label>
          <input className="form-input" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} placeholder="Python, JavaScript, Java" />
          <span className="form-hint">{t('skills.hint')}</span>
        </div>
        <div className="form-group">
          <label className="form-label">{t('skills.tools')}</label>
          <input className="form-input" value={formData.tools} onChange={e => setFormData({...formData, tools: e.target.value})} placeholder="React, Docker, PostgreSQL" />
          <span className="form-hint">{t('skills.hint')}</span>
        </div>
        <div className="form-group">
          <label className="form-label">{t('skills.methods')}</label>
          <input className="form-input" value={formData.methods} onChange={e => setFormData({...formData, methods: e.target.value})} placeholder="Agile, Scrum, TDD" />
          <span className="form-hint">{t('skills.hint')}</span>
        </div>
        <div className="section-actions">
          <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
        </div>
      </form>
    </div>
  );
}
