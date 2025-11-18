/**
 * CV Preview and Export page
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { cvAPI } from '../services/api';
import CVTemplate from '../components/CVTemplate';
import './Preview.css';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const cvRef = useRef(null);

  useEffect(() => {
    loadCVData();
  }, []);

  const loadCVData = async () => {
    try {
      const response = await cvAPI.getData();
      setCvData(response.data);
    } catch (error) {
      console.error('Error loading CV data:', error);
      alert('Error loading CV data. Please ensure you have created a profile.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!cvRef.current) return;

    setExporting(true);
    try {
      const element = cvRef.current;
      const fileName = cvData?.profile
        ? `CV_${cvData.profile.first_name}_${cvData.profile.last_name}.pdf`
        : 'CV_Harvard.pdf';

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right in inches
        filename: fileName,
        image: {
          type: 'jpeg',
          quality: 1.0 // Maximum quality
        },
        html2canvas: {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 816, // 8.5 inches at 96 DPI
          windowHeight: 1056 // 11 inches at 96 DPI
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.cv-section'
        }
      };

      await html2pdf().set(opt).from(element).save();
      alert(t('cv.downloadSuccess'));
    } catch (error) {
      console.error('PDF export error:', error);
      alert(t('messages.error'));
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
      <div className="preview-header no-print">
        <div className="container">
          <div className="preview-nav">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              ← {t('actions.back')}
            </button>
            <h1>{t('cv.preview')}</h1>
            <div className="preview-actions">
              <button
                className="btn btn-primary"
                onClick={handleExportPDF}
                disabled={exporting}
              >
                {exporting ? t('cv.generating') : t('cv.exportPDF')}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handlePrint}
                disabled={exporting}
              >
                {t('cv.print')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-container container">
        <div className="preview-frame" ref={cvRef}>
          <CVTemplate data={cvData} />
        </div>
      </div>
    </div>
  );
}
