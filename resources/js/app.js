import './bootstrap';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

// Initialize Alpine.js
Alpine.start();

// Global notification function
window.notify = function(title, message, type = 'success') {
    window.dispatchEvent(new CustomEvent('notify', {
        detail: {
            title: title,
            message: message,
            type: type
        }
    }));
};

// CSRF token setup for all AJAX requests
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found');
}

// Form validation helper
window.validateForm = function(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
};

// Dark mode persistence
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has a saved preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    
    if (darkMode) {
        document.documentElement.classList.add('dark');
    }
});
