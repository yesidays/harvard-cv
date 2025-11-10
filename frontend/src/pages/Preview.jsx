/**
 * CV Preview and Export page
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cvAPI } from '../services/api';
import './Preview.css';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadPreview();
  }, []);

  const loadPreview = async () => {
    try {
      const response = await cvAPI.preview();
      setHtml(response.data);
    } catch (error) {
      console.error('Error loading preview:', error);
      alert('Error loading preview. Please ensure you have created a profile.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const response = format === 'pdf'
        ? await cvAPI.exportPDF()
        : await cvAPI.exportDOCX();

      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_Harvard.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert(t('cv.downloadSuccess'));
    } catch (error) {
      console.error('Export error:', error);
      alert(t('messages.error'));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="preview-page">
      <div className="preview-header">
        <div className="container">
          <div className="preview-nav">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              ← {t('actions.back')}
            </button>
            <h1>{t('cv.preview')}</h1>
            <div className="preview-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleExport('pdf')}
                disabled={exporting}
              >
                {exporting ? t('cv.generating') : t('cv.exportPDF')}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleExport('docx')}
                disabled={exporting}
              >
                {exporting ? t('cv.generating') : t('cv.exportDOCX')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-container container">
        <div className="preview-frame">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
