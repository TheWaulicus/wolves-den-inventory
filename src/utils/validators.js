/**
 * Validation Utilities
 */

const Validators = {
  /**
   * Validate email format
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Validate phone number (basic)
   */
  isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && re.test(phone);
  },

  /**
   * Sanitize string input
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  },

  /**
   * Validate date is in the future
   */
  isFutureDate(date) {
    return date > new Date();
  },

  /**
   * Validate required field
   */
  isRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },

  /**
   * Validate number is positive
   */
  isPositiveNumber(value) {
    return !isNaN(value) && value >= 0;
  },

  /**
   * Validate barcode format
   */
  isValidBarcode(barcode) {
    const re = /^[A-Z0-9\-]+$/;
    return re.test(barcode);
  }
};

if (typeof window !== 'undefined') {
  window.Validators = Validators;
}
