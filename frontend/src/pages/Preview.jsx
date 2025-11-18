/**
 * CV Preview and Export page
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { cvAPI } from '../services/api';
import { exportToGoogleDocs } from '../services/googleOAuth';
import CVTemplate from '../components/CVTemplate';
import './Preview.css';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportingToDocs, setExportingToDocs] = useState(false);
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
    if (!cvData) return;

    setExporting(true);
    try {
      const fileName = cvData?.profile
        ? `CV_${cvData.profile.first_name}_${cvData.profile.last_name}.pdf`
        : 'CV_Harvard.pdf';

      // Create PDF with text rendering
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace = 10) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Header - Name and Contact
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      const fullName = `${cvData.profile.first_name} ${cvData.profile.last_name}`.toUpperCase();
      pdf.text(fullName, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      // Contact info
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const contactParts = [
        cvData.profile.email,
        cvData.profile.phone,
        cvData.profile.location,
        cvData.profile.linkedin ? 'LinkedIn' : null
      ].filter(Boolean);
      const contactLine = contactParts.join(' • ');
      pdf.text(contactLine, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      // Line separator
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      // Summary
      if (cvData.profile.summary) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const summaryLines = pdf.splitTextToSize(cvData.profile.summary, contentWidth);
        summaryLines.forEach((line) => {
          checkNewPage();
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }

      // Education
      if (cvData.education && cvData.education.length > 0) {
        checkNewPage(20);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EDUCATION', margin, yPosition);
        yPosition += 2;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        cvData.education.forEach((edu) => {
          checkNewPage(15);

          // Institution and dates
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          const institutionText = edu.location ? `${edu.institution} — ${edu.location}` : edu.institution;
          pdf.text(institutionText, margin, yPosition);

          if (edu.start_date) {
            const dateText = edu.end_date ? `${edu.start_date} – ${edu.end_date}` : edu.start_date;
            pdf.text(dateText, pageWidth - margin, yPosition, { align: 'right' });
          }
          yPosition += 5;

          // Degree
          if (edu.degree) {
            pdf.setFont('helvetica', 'italic');
            pdf.text(edu.degree, margin, yPosition);
            yPosition += 5;
          }

          // Details
          if (edu.details && edu.details.length > 0) {
            pdf.setFont('helvetica', 'normal');
            edu.details.forEach((detail) => {
              checkNewPage();
              const lines = pdf.splitTextToSize(`• ${detail}`, contentWidth - 5);
              lines.forEach((line) => {
                pdf.text(line, margin + 5, yPosition);
                yPosition += 4;
              });
            });
          }
          yPosition += 3;
        });
      }

      // Experience
      if (cvData.experience && cvData.experience.length > 0) {
        checkNewPage(20);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EXPERIENCE', margin, yPosition);
        yPosition += 2;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        cvData.experience.forEach((exp) => {
          checkNewPage(15);

          // Company and dates
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          const companyText = exp.location ? `${exp.company} — ${exp.location}` : exp.company;
          pdf.text(companyText, margin, yPosition);

          if (exp.start_date) {
            const dateText = exp.end_date ? `${exp.start_date} – ${exp.end_date}` : exp.start_date;
            pdf.text(dateText, pageWidth - margin, yPosition, { align: 'right' });
          }
          yPosition += 5;

          // Role
          if (exp.role) {
            pdf.setFont('helvetica', 'italic');
            pdf.text(exp.role, margin, yPosition);
            yPosition += 5;
          }

          // Bullets
          if (exp.bullets && exp.bullets.length > 0) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            exp.bullets.forEach((bullet) => {
              checkNewPage();
              const lines = pdf.splitTextToSize(`• ${bullet}`, contentWidth - 5);
              lines.forEach((line) => {
                pdf.text(line, margin + 5, yPosition);
                yPosition += 4;
              });
            });
          }
          yPosition += 3;
        });
      }

      // Projects
      if (cvData.projects && cvData.projects.length > 0) {
        checkNewPage(20);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROJECTS', margin, yPosition);
        yPosition += 2;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        cvData.projects.forEach((proj) => {
          checkNewPage(10);

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(proj.name, margin, yPosition);
          yPosition += 5;

          if (proj.impact) {
            pdf.setFont('helvetica', 'normal');
            const lines = pdf.splitTextToSize(proj.impact, contentWidth);
            lines.forEach((line) => {
              checkNewPage();
              pdf.text(line, margin, yPosition);
              yPosition += 4;
            });
          }

          if (proj.technologies && proj.technologies.length > 0) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(10);
            pdf.text(`Technologies: ${proj.technologies.join(', ')}`, margin, yPosition);
            yPosition += 4;
          }
          yPosition += 3;
        });
      }

      // Certifications
      if (cvData.certifications && cvData.certifications.length > 0) {
        checkNewPage(20);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CERTIFICATIONS', margin, yPosition);
        yPosition += 2;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        cvData.certifications.forEach((cert) => {
          checkNewPage(8);

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          const certText = cert.issuer ? `${cert.name} — ${cert.issuer}` : cert.name;
          pdf.text(certText, margin, yPosition);

          if (cert.date) {
            pdf.text(cert.date, pageWidth - margin, yPosition, { align: 'right' });
          }
          yPosition += 5;

          if (cert.credential_id) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(`Credential ID: ${cert.credential_id}`, margin, yPosition);
            yPosition += 4;
          }
          yPosition += 2;
        });
      }

      // Skills
      if (cvData.skills) {
        checkNewPage(20);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SKILLS', margin, yPosition);
        yPosition += 2;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        if (cvData.skills.languages && cvData.skills.languages.length > 0) {
          checkNewPage();
          pdf.setFont('helvetica', 'bold');
          pdf.text('Languages: ', margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          const langText = cvData.skills.languages.join(', ');
          const langLines = pdf.splitTextToSize(langText, contentWidth - 30);
          pdf.text(langLines, margin + 30, yPosition);
          yPosition += 5 * langLines.length;
        }

        if (cvData.skills.tools && cvData.skills.tools.length > 0) {
          checkNewPage();
          pdf.setFont('helvetica', 'bold');
          pdf.text('Tools: ', margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          const toolsText = cvData.skills.tools.join(', ');
          const toolsLines = pdf.splitTextToSize(toolsText, contentWidth - 30);
          pdf.text(toolsLines, margin + 30, yPosition);
          yPosition += 5 * toolsLines.length;
        }

        if (cvData.skills.methods && cvData.skills.methods.length > 0) {
          checkNewPage();
          pdf.setFont('helvetica', 'bold');
          pdf.text('Methods: ', margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          const methodsText = cvData.skills.methods.join(', ');
          const methodsLines = pdf.splitTextToSize(methodsText, contentWidth - 30);
          pdf.text(methodsLines, margin + 30, yPosition);
          yPosition += 5 * methodsLines.length;
        }
      }

      // Save the PDF
      pdf.save(fileName);
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

  const handleExportToGoogleDocs = async () => {
    setExportingToDocs(true);
    try {
      const result = await exportToGoogleDocs();

      if (result.success && result.document_url) {
        // Show success message with link
        const openDoc = window.confirm(
          t('cv.googleDocsSuccess') + '\n\n' + t('cv.openDocument')
        );

        if (openDoc) {
          window.open(result.document_url, '_blank');
        }
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Google Docs export error:', error);

      let errorMessage = t('messages.error');
      if (error.message.includes('not configured')) {
        errorMessage = t('cv.googleDocsNotConfigured');
      } else if (error.message.includes('expired')) {
        errorMessage = t('cv.googleDocsAuthExpired');
      } else if (error.message.includes('cancelled')) {
        // User cancelled auth, don't show error
        return;
      }

      alert(errorMessage);
    } finally {
      setExportingToDocs(false);
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
                disabled={exporting || exportingToDocs}
              >
                {exporting ? t('cv.generating') : t('cv.exportPDF')}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleExportToGoogleDocs}
                disabled={exporting || exportingToDocs}
                title={t('cv.exportToGoogleDocs')}
              >
                {exportingToDocs ? t('cv.exportingToDocs') : t('cv.exportGoogleDocs')}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handlePrint}
                disabled={exporting || exportingToDocs}
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
