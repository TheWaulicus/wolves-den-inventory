/**
 * NotificationSystem - Toast Notifications
 * Display success, error, warning, and info messages
 */

class NotificationSystem {
  constructor() {
    this.container = document.getElementById('notifications-container');
    this.notifications = [];
    this.nextId = 1;
  }

  /**
   * Show a notification
   * @param {string} message - Notification message
   * @param {string} type - Type: success, error, warning, info
   * @param {number} duration - Auto-dismiss duration (0 = no auto-dismiss)
   * @param {Object} options - Additional options
   */
  show(message, type = 'info', duration = 3000, options = {}) {
    const id = this.nextId++;
    
    const notification = {
      id,
      message,
      type,
      title: options.title || this.getDefaultTitle(type),
      actions: options.actions || []
    };

    this.notifications.push(notification);
    this.render(notification);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  /**
   * Get default title based on type
   */
  getDefaultTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    return titles[type] || 'Notification';
  }

  /**
   * Get icon for notification type
   */
  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  /**
   * Render notification
   */
  render(notification) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${notification.type}`;
    toast.id = `notification-${notification.id}`;

    toast.innerHTML = `
      <div class="toast-icon">${this.getIcon(notification.type)}</div>
      <div class="toast-content">
        ${notification.title ? `<div class="toast-title">${notification.title}</div>` : ''}
        <div class="toast-message">${notification.message}</div>
        ${notification.actions.length > 0 ? this.renderActions(notification.actions) : ''}
      </div>
      <button class="toast-close" onclick="notificationSystem.dismiss(${notification.id})">×</button>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
  }

  /**
   * Render action buttons
   */
  renderActions(actions) {
    const actionsHtml = actions.map((action, index) => 
      `<button class="btn btn-sm btn-ghost" onclick="notificationSystem.handleAction(${index})">${action.label}</button>`
    ).join('');

    return `<div class="toast-actions" style="margin-top: var(--spacing-sm); display: flex; gap: var(--spacing-sm);">${actionsHtml}</div>`;
  }

  /**
   * Handle action button click
   */
  handleAction(actionIndex) {
    // Implementation for action handling
    console.log('Action clicked:', actionIndex);
  }

  /**
   * Dismiss notification
   */
  dismiss(id) {
    const toast = document.getElementById(`notification-${id}`);
    if (!toast) return;

    toast.classList.add('removing');

    setTimeout(() => {
      toast.remove();
      this.notifications = this.notifications.filter(n => n.id !== id);
    }, 200);
  }

  /**
   * Dismiss all notifications
   */
  dismissAll() {
    this.notifications.forEach(n => this.dismiss(n.id));
  }

  /**
   * Convenience methods
   */
  success(message, title = null, duration = 3000) {
    return this.show(message, 'success', duration, { title });
  }

  error(message, title = null, duration = 5000) {
    return this.show(message, 'error', duration, { title });
  }

  warning(message, title = null, duration = 4000) {
    return this.show(message, 'warning', duration, { title });
  }

  info(message, title = null, duration = 3000) {
    return this.show(message, 'info', duration, { title });
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.notificationSystem = new NotificationSystem();
  
  // Expose convenience functions globally
  window.showNotification = (message, type, duration) => 
    notificationSystem.show(message, type, duration);
  
  window.showSuccess = (message, title) => 
    notificationSystem.success(message, title);
  
  window.showError = (message, title) => 
    notificationSystem.error(message, title);
  
  window.showWarning = (message, title) => 
    notificationSystem.warning(message, title);
  
  window.showInfo = (message, title) => 
    notificationSystem.info(message, title);
}
