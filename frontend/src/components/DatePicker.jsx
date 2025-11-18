/**
 * Enhanced DatePicker component with easy year selection
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMonthOptions, getYearOptions, validateDateRange } from '../utils/dateUtils';
import './DatePicker.css';

export default function DatePicker({
  label,
  value,
  onChange,
  required = false,
  allowPresent = false,
  isPresent = false,
  onPresentChange,
  minDate = null,
  maxDate = null,
  startDate = null, // For validation against start date
  error = null
}) {
  const { t, i18n } = useTranslation();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [validationError, setValidationError] = useState('');

  // Parse initial value
  useEffect(() => {
    if (value && !isPresent) {
      const [y, m] = value.split('-');
      if (m) setMonth(m);
      if (y) setYear(y);
    } else if (isPresent) {
      setMonth('');
      setYear('');
    }
  }, [value, isPresent]);

  // Update parent when month or year changes
  useEffect(() => {
    if (month && year && !isPresent) {
      const newValue = `${year}-${month}`;

      // Validate against start date if provided
      if (startDate && !validateDateRange(startDate, newValue)) {
        setValidationError(t('validation.endDateBeforeStart'));
        return;
      }

      setValidationError('');
      onChange(newValue);
    } else if (!month || !year) {
      onChange('');
    }
  }, [month, year, isPresent, startDate]);

  // Handle present checkbox
  const handlePresentToggle = (e) => {
    const checked = e.target.checked;
    if (onPresentChange) {
      onPresentChange(checked);
    }
    if (checked) {
      setMonth('');
      setYear('');
      setValidationError('');
      onChange('');
    }
  };

  const monthOptions = getMonthOptions(i18n.language);
  const yearOptions = getYearOptions();

  return (
    <div className="date-picker-wrapper">
      <label className={`form-label ${required ? 'form-label-required' : ''}`}>
        {label}
      </label>

      <div className="date-picker-content">
        {!isPresent && (
          <div className="date-picker-selects">
            <div className="date-picker-select-group">
              <label className="date-picker-sublabel">{t('dateRange.month')}</label>
              <select
                className={`form-select date-picker-select ${validationError || error ? 'has-error' : ''}`}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                disabled={isPresent}
                required={required && !isPresent}
              >
                <option value="">{t('dateRange.selectMonth')}</option>
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-picker-select-group">
              <label className="date-picker-sublabel">{t('dateRange.year')}</label>
              <select
                className={`form-select date-picker-select ${validationError || error ? 'has-error' : ''}`}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={isPresent}
                required={required && !isPresent}
              >
                <option value="">{t('dateRange.selectYear')}</option>
                {yearOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {allowPresent && (
          <div className="date-picker-present">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPresent}
                onChange={handlePresentToggle}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                {t('dateRange.present')}
              </span>
            </label>
          </div>
        )}
      </div>

      {(validationError || error) && (
        <span className="form-error">{validationError || error}</span>
      )}
    </div>
  );
}
