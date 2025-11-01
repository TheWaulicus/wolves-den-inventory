/**
 * Formatting Utilities
 */

const Formatters = {
  /**
   * Format currency
   */
  formatCurrency(amount) {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  /**
   * Format phone number
   */
  formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  },

  /**
   * Capitalize first letter
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert to title case
   */
  toTitleCase(str) {
    if (!str) return '';
    return str.split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  },

  /**
   * Format condition label
   */
  formatCondition(condition) {
    const labels = {
      'new': '🆕 New',
      'good': '✅ Good',
      'fair': '⚠️ Fair',
      'needs-repair': '🔧 Needs Repair',
      'retired': '❌ Retired'
    };
    return labels[condition] || condition;
  },

  /**
   * Format status label
   */
  formatStatus(status) {
    const labels = {
      'available': '✅ Available',
      'checked-out': '📤 Checked Out',
      'maintenance': '🔧 Maintenance',
      'retired': '❌ Retired'
    };
    return labels[status] || status;
  },

  /**
   * Format transaction status
   */
  formatTransactionStatus(status) {
    const labels = {
      'active': '🟢 Active',
      'overdue': '🔴 Overdue',
      'returned': '✅ Returned',
      'cancelled': '❌ Cancelled'
    };
    return labels[status] || status;
  },

  /**
   * Truncate text with ellipsis
   */
  truncate(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Format barcode with hyphens for readability
   */
  formatBarcode(barcode) {
    if (!barcode) return '';
    return barcode.replace(/(.{3})/g, '$1-').slice(0, -1);
  }
};

if (typeof window !== 'undefined') {
  window.Formatters = Formatters;
}
