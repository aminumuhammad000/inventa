// Signup Script for Inventa
console.log('Signup script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded for signup');
    
    const signupForm = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const businessNameInput = document.getElementById('businessName');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const agreeTermsInput = document.getElementById('agreeTerms');
    const shopLogoInput = document.getElementById('shopLogo');
    
    console.log('Form elements found:', {
        signupForm: !!signupForm,
        fullNameInput: !!fullNameInput,
        emailInput: !!emailInput,
        phoneInput: !!phoneInput,
        businessNameInput: !!businessNameInput,
        passwordInput: !!passwordInput,
        confirmPasswordInput: !!confirmPasswordInput,
        agreeTermsInput: !!agreeTermsInput,
        shopLogoInput: !!shopLogoInput
    });

    // Form submission handler
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Real-time password confirmation validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }

    // Email availability check
    if (emailInput) {
        emailInput.addEventListener('blur', checkEmailAvailability);
    }

    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
});

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    console.log('Signup form submitted');
    
    const formData = {
        fullName: fullNameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        businessName: businessNameInput.value,
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
        agreeTerms: agreeTermsInput.checked
    };

    console.log('Signup data:', formData);

    // Validate form data
    if (!validateSignupForm(formData)) {
        return;
    }

    // Show loading state
    showLoadingState();

    // Simulate account creation (in real app, this would be an API call)
    setTimeout(() => {
        // Store user data in localStorage
        const userData = {
            id: Date.now(),
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            businessName: formData.businessName,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        // Store in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', formData.email);

        // Show success message
        showToast('Account created successfully! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    }, 1500);
}

// Validate signup form
function validateSignupForm(data) {
    const errors = [];

    // Check required fields
    if (!data.fullName.trim()) {
        errors.push('Full name is required');
    }

    if (!data.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.phone.trim()) {
        errors.push('Phone number is required');
    }

    if (!data.businessName.trim()) {
        errors.push('Business name is required');
    }

    if (!data.password) {
        errors.push('Password is required');
    } else if (data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (data.password !== data.confirmPassword) {
        errors.push('Passwords do not match');
    }

    if (!data.agreeTerms) {
        errors.push('You must agree to the terms and conditions');
    }

    if (errors.length > 0) {
        showToast(errors.join(', '), 'error');
        return false;
    }

    return true;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
    } else {
        clearFieldError('confirmPassword');
    }
}

// Check email availability
function checkEmailAvailability() {
    const email = document.getElementById('email').value;
    
    if (email.length < 5) {
        showFieldError('email', 'Email must be at least 5 characters');
        return;
    }

    // Check if email already exists (in real app, this would be an API call)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some(user => user.email === email);
    
    if (userExists) {
        showFieldError('email', 'Email already exists');
    } else {
        clearFieldError('email');
    }
}

// Validate email
function validateEmail() {
    const email = document.getElementById('email').value;
    
    if (email && !isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
    } else {
        clearFieldError('email');
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper');
    
    // Remove existing error
    const existingError = wrapper.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    wrapper.appendChild(errorDiv);
    
    // Add error styling
    wrapper.classList.add('error');
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper');
    
    // Remove error message
    const existingError = wrapper.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Remove error styling
    wrapper.classList.remove('error');
}

// Show loading state
function showLoadingState() {
    const submitBtn = document.querySelector('.login-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
}

// Hide loading state
function hideLoadingState() {
    const submitBtn = document.querySelector('.login-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    submitBtn.disabled = false;
    btnText.style.display = 'block';
    btnLoader.style.display = 'none';
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggleBtn = field.nextElementSibling;
    const icon = toggleBtn.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.textContent = 'visibility_off';
    } else {
        field.type = 'password';
        icon.textContent = 'visibility';
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set message
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    switch (type) {
        case 'success':
            toastIcon.textContent = 'check_circle';
            toast.className = 'toast success';
            break;
        case 'error':
            toastIcon.textContent = 'error';
            toast.className = 'toast error';
            break;
        case 'warning':
            toastIcon.textContent = 'warning';
            toast.className = 'toast warning';
            break;
        default:
            toastIcon.textContent = 'info';
            toast.className = 'toast info';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideToast();
    }, 5000);
}

// Hide toast notification
function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

// Logo Upload Functions
window.handleLogoUpload = function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('logoPreview');
    const previewImage = document.getElementById('previewImage');
    const uploadArea = document.querySelector('.logo-upload-area');
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            return;
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB', 'error');
            return;
        }
        
        // Create FileReader to preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            preview.style.display = 'flex';
            uploadArea.style.display = 'none';
            showToast('Logo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
};

window.removeLogo = function() {
    const preview = document.getElementById('logoPreview');
    const uploadArea = document.querySelector('.logo-upload-area');
    const fileInput = document.getElementById('shopLogo');
    
    preview.style.display = 'none';
    uploadArea.style.display = 'block';
    fileInput.value = '';
    showToast('Logo removed', 'info');
};

// Drag and Drop functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.querySelector('.logo-upload-area');
    
    if (uploadArea) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);
    }
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const uploadArea = document.querySelector('.logo-upload-area');
    uploadArea.classList.add('dragover');
}

function unhighlight(e) {
    const uploadArea = document.querySelector('.logo-upload-area');
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        const fileInput = document.getElementById('shopLogo');
        fileInput.files = files;
        
        // Trigger the change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }
}

// Navigate to login page
function goToLogin() {
    window.location.href = 'login.html';
}

// Global functions
window.togglePassword = togglePassword;
window.hideToast = hideToast;
window.goToLogin = goToLogin;

