/**
 * Date utilities for formatting and validation
 */

/**
 * Format a date string (YYYY-MM or YYYY-MM-DD) to a human-readable format
 * @param {string} dateStr - Date string in YYYY-MM or YYYY-MM-DD format
 * @param {string} locale - Locale code (e.g., 'es', 'en')
 * @param {string} format - 'short' (Jan 2020) or 'long' (January 2020)
 * @returns {string} Formatted date string
 */
export function formatDate(dateStr, locale = 'en', format = 'long') {
  if (!dateStr) return '';

  try {
    // Handle YYYY-MM format
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);

    if (isNaN(date.getTime())) return dateStr;

    const monthFormat = format === 'short' ? 'short' : 'long';
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: monthFormat
    });

    return formatter.format(date);
  } catch (error) {
    return dateStr;
  }
}

/**
 * Format date range for display
 * @param {string} startDate - Start date in YYYY-MM format
 * @param {string} endDate - End date in YYYY-MM format (or empty for present)
 * @param {string} locale - Locale code
 * @param {string} presentText - Text to show for present/current
 * @returns {string} Formatted date range
 */
export function formatDateRange(startDate, endDate, locale = 'en', presentText = 'Present') {
  const start = formatDate(startDate, locale, 'short');
  const end = endDate ? formatDate(endDate, locale, 'short') : presentText;

  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;

  return `${start} - ${end}`;
}

/**
 * Validate that end date is after start date
 * @param {string} startDate - Start date in YYYY-MM format
 * @param {string} endDate - End date in YYYY-MM format
 * @returns {boolean} True if valid, false otherwise
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return true; // Allow empty dates

  try {
    const [startYear, startMonth] = startDate.split('-').map(Number);
    const [endYear, endMonth] = endDate.split('-').map(Number);

    if (startYear > endYear) return false;
    if (startYear === endYear && startMonth > endMonth) return false;

    return true;
  } catch (error) {
    return true; // If parsing fails, don't block
  }
}

/**
 * Get current date in YYYY-MM format
 * @returns {string} Current date
 */
export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Validate that date is not in the future
 * @param {string} dateStr - Date in YYYY-MM format
 * @returns {boolean} True if not in future, false otherwise
 */
export function isNotInFuture(dateStr) {
  if (!dateStr) return true;

  try {
    const [year, month] = dateStr.split('-').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year > currentYear) return false;
    if (year === currentYear && month > currentMonth) return false;

    return true;
  } catch (error) {
    return true;
  }
}

/**
 * Calculate duration between two dates
 * @param {string} startDate - Start date in YYYY-MM format
 * @param {string} endDate - End date in YYYY-MM format (or empty for present)
 * @param {string} locale - Locale code
 * @returns {string} Duration string (e.g., "2 years 3 months")
 */
export function calculateDuration(startDate, endDate, locale = 'en') {
  if (!startDate) return '';

  try {
    const [startYear, startMonth] = startDate.split('-').map(Number);
    let endYear, endMonth;

    if (endDate) {
      [endYear, endMonth] = endDate.split('-').map(Number);
    } else {
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    }

    let years = endYear - startYear;
    let months = endMonth - startMonth;

    if (months < 0) {
      years--;
      months += 12;
    }

    const yearText = locale === 'es' ? (years === 1 ? 'año' : 'años') : (years === 1 ? 'year' : 'years');
    const monthText = locale === 'es' ? (months === 1 ? 'mes' : 'meses') : (months === 1 ? 'month' : 'months');

    if (years === 0 && months === 0) {
      return locale === 'es' ? 'Menos de 1 mes' : 'Less than 1 month';
    }

    if (years === 0) {
      return `${months} ${monthText}`;
    }

    if (months === 0) {
      return `${years} ${yearText}`;
    }

    return `${years} ${yearText} ${months} ${monthText}`;
  } catch (error) {
    return '';
  }
}

/**
 * Parse date string to separate year and month
 * @param {string} dateStr - Date in YYYY-MM format
 * @returns {{year: number, month: number}} Year and month
 */
export function parseDate(dateStr) {
  if (!dateStr) return { year: null, month: null };

  try {
    const [year, month] = dateStr.split('-').map(Number);
    return { year, month };
  } catch (error) {
    return { year: null, month: null };
  }
}

/**
 * Generate array of months for a dropdown
 * @param {string} locale - Locale code
 * @returns {Array<{value: string, label: string}>} Array of month options
 */
export function getMonthOptions(locale = 'en') {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    const date = new Date(2000, i - 1, 1);
    const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });
    months.push({
      value: String(i).padStart(2, '0'),
      label: formatter.format(date)
    });
  }
  return months;
}

/**
 * Generate array of years for a dropdown
 * @param {number} startYear - Starting year (default: 1950)
 * @param {number} endYear - Ending year (default: current year + 5)
 * @returns {Array<{value: string, label: string}>} Array of year options
 */
export function getYearOptions(startYear = 1950, endYear = null) {
  if (!endYear) {
    endYear = new Date().getFullYear() + 5;
  }

  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push({
      value: String(year),
      label: String(year)
    });
  }
  return years;
}
