/**
 * Harvard CV Template Component
 * Renders CV data with Harvard formatting for display and PDF export
 */
import React from 'react';
import './CVTemplate.css';

export default function CVTemplate({ data }) {
  if (!data) return null;

  const { profile, education, experience, certifications, projects, skills } = data;

  return (
    <div className="cv-template">
      {/* Header */}
      <header className="cv-header">
        <h1 className="cv-name">
          {profile.first_name} {profile.last_name}
        </h1>
        <div className="cv-contact">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span> • {profile.phone}</span>}
          {profile.location && <span> • {profile.location}</span>}
          {profile.linkedin && (
            <span>
              {' • '}
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section className="cv-section">
          <p className="cv-summary">{profile.summary}</p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="cv-entry">
              <div className="cv-entry-header">
                <div className="cv-entry-left">
                  <strong>{edu.institution}</strong>
                  {edu.location && <span className="cv-location"> — {edu.location}</span>}
                </div>
                <div className="cv-entry-right">
                  {edu.start_date && (
                    <span>
                      {edu.start_date}
                      {edu.end_date && ` – ${edu.end_date}`}
                    </span>
                  )}
                </div>
              </div>
              {edu.degree && <div className="cv-degree">{edu.degree}</div>}
              {edu.details && edu.details.length > 0 && (
                <ul className="cv-bullets">
                  {edu.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="cv-entry">
              <div className="cv-entry-header">
                <div className="cv-entry-left">
                  <strong>{exp.company}</strong>
                  {exp.location && <span className="cv-location"> — {exp.location}</span>}
                </div>
                <div className="cv-entry-right">
                  {exp.start_date && (
                    <span>
                      {exp.start_date}
                      {exp.end_date && ` – ${exp.end_date}`}
                    </span>
                  )}
                </div>
              </div>
              {exp.role && <div className="cv-role">{exp.role}</div>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="cv-bullets">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Projects</h2>
          {projects.map((proj, index) => (
            <div key={index} className="cv-entry">
              <div className="cv-entry-header">
                <div className="cv-entry-left">
                  <strong>{proj.name}</strong>
                </div>
              </div>
              {proj.impact && <p className="cv-impact">{proj.impact}</p>}
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="cv-technologies">
                  <em>Technologies:</em> {proj.technologies.join(', ')}
                </div>
              )}
              {proj.url && (
                <div className="cv-project-url">
                  <a href={proj.url} target="_blank" rel="noopener noreferrer">
                    {proj.url}
                  </a>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="cv-entry">
              <div className="cv-entry-header">
                <div className="cv-entry-left">
                  <strong>{cert.name}</strong>
                  {cert.issuer && <span> — {cert.issuer}</span>}
                </div>
                <div className="cv-entry-right">{cert.date}</div>
              </div>
              {cert.credential_id && (
                <div className="cv-credential">Credential ID: {cert.credential_id}</div>
              )}
              {cert.url && (
                <div className="cv-cert-url">
                  <a href={cert.url} target="_blank" rel="noopener noreferrer">
                    View Certificate
                  </a>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="cv-section">
          <h2 className="cv-section-title">Skills</h2>
          <div className="cv-skills">
            {skills.languages && skills.languages.length > 0 && (
              <div className="cv-skill-category">
                <strong>Languages:</strong> {skills.languages.join(', ')}
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div className="cv-skill-category">
                <strong>Tools:</strong> {skills.tools.join(', ')}
              </div>
            )}
            {skills.methods && skills.methods.length > 0 && (
              <div className="cv-skill-category">
                <strong>Methods:</strong> {skills.methods.join(', ')}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
