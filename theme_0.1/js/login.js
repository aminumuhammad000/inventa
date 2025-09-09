// Login Script for Inventa
console.log('Login script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing login...');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');
    const rememberMe = document.getElementById('rememberMe');

    // Debug: Check if elements are found
    console.log('Elements found:', {
        loginForm: !!loginForm,
        emailInput: !!emailInput,
        passwordInput: !!passwordInput,
        loginBtn: !!loginBtn,
        rememberMe: !!rememberMe
    });

    // Demo credentials
    const demoCredentials = {
        email: 'demo@inventa.com',
        password: 'demo123'
    };

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        redirectToDashboard();
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted'); // Debug log
            handleLogin();
        });
    }

    // Also add click handler to login button
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked'); // Debug log
            handleLogin();
        });
    }

    // Demo login function
    window.demoLogin = function() {
        emailInput.value = demoCredentials.email;
        passwordInput.value = demoCredentials.password;
        handleLogin();
    };

    // Quick login function (bypasses form validation)
    window.quickLogin = function() {
        console.log('Quick login triggered');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', 'demo@inventa.com');
        localStorage.setItem('userData', JSON.stringify({
            email: 'demo@inventa.com',
            loginTime: new Date().toISOString()
        }));
        showToast('Quick login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    };

    // Password toggle function
    window.togglePassword = function() {
        const passwordToggle = document.querySelector('.password-toggle i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.textContent = 'visibility_off';
        } else {
            passwordInput.type = 'password';
            passwordToggle.textContent = 'visibility';
        }
    };

    // Handle login process
    function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log('Login attempt:', { email, password }); // Debug log
        console.log('Demo credentials:', demoCredentials); // Debug log

        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Simulate login process
        setTimeout(() => {
            console.log('Checking credentials...'); // Debug log
            if (email === demoCredentials.email && password === demoCredentials.password) {
                console.log('Login successful!'); // Debug log
                // Successful login
                showToast('Login successful! Redirecting...', 'success');
                
                // Save login state
                if (rememberMe.checked) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('username', email);
                }
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', email);
                localStorage.setItem('userData', JSON.stringify({
                    email: email,
                    loginTime: new Date().toISOString()
                }));

                console.log('Login successful! Redirecting to dashboard...'); // Debug log
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                console.log('Login failed - invalid credentials'); // Debug log
                // Failed login
                showToast('Invalid email or password. Use: demo@inventa.com / demo123', 'error');
                setLoadingState(false);
                loginForm.classList.add('error-shake');
                setTimeout(() => {
                    loginForm.classList.remove('error-shake');
                }, 500);
            }
        }, 1000); // Reduced delay for better UX
    }

    // Set loading state
    function setLoadingState(loading) {
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');

        // Set message and icon
        toastMessage.textContent = message;
        
        // Remove existing type classes
        toast.classList.remove('success', 'error', 'warning');
        
        // Add new type class
        toast.classList.add(type);

        // Set appropriate icon
        switch (type) {
            case 'success':
                toastIcon.textContent = 'check_circle';
                break;
            case 'error':
                toastIcon.textContent = 'error';
                break;
            case 'warning':
                toastIcon.textContent = 'warning';
                break;
            default:
                toastIcon.textContent = 'info';
        }

        // Show toast
        toast.classList.add('show');

        // Auto hide after 4 seconds
        setTimeout(() => {
            hideToast();
        }, 4000);
    }

    // Hide toast
    window.hideToast = function() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
    };

    // Redirect to dashboard
    function redirectToDashboard() {
        window.location.href = 'index.html';
    }

    // Input animations
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
            this.style.transform = 'translateY(0)';
        });
        
        // Hover animations
        input.addEventListener('mouseenter', function() {
            if (document.activeElement !== this) {
                this.style.transform = 'translateY(-1px)';
            }
        });
        
        input.addEventListener('mouseleave', function() {
            if (document.activeElement !== this) {
                this.style.transform = 'translateY(0)';
            }
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });

        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Add enter key support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !loginBtn.disabled) {
            handleLogin();
        }
    });

    // Load remembered username
    if (localStorage.getItem('rememberMe') === 'true') {
        const rememberedUsername = localStorage.getItem('username');
        if (rememberedUsername) {
            emailInput.value = rememberedUsername;
            rememberMe.checked = true;
            passwordInput.focus();
        }
    }

    // Add some interactive effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effect to login button
    loginBtn.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(0) scale(0.98)';
    });

    loginBtn.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-2px) scale(1)';
    });

    loginBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    // Add floating animation to shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.5}s`;
    });

    // Add parallax effect to background
    document.addEventListener('mousemove', function(e) {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const xPos = (x - 0.5) * speed * 20;
            const yPos = (y - 0.5) * speed * 20;
            shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });

    // Add typing effect to logo subtitle
    const subtitle = document.querySelector('.logo-subtitle');
    const subtitleText = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = setInterval(() => {
        if (i < subtitleText.length) {
            subtitle.textContent += subtitleText.charAt(i);
            i++;
        } else {
            clearInterval(typeWriter);
        }
    }, 100);

    // Add success animation to form
    function addSuccessAnimation() {
        loginForm.classList.add('success-animation');
        setTimeout(() => {
            loginForm.classList.remove('success-animation');
        }, 600);
    }

    // Enhanced form validation
    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        let isValid = true;
        
        // Email validation
        if (email.length < 3) {
            showFieldError(emailInput, 'Email must be at least 3 characters');
            isValid = false;
        } else {
            clearFieldError(emailInput);
        }
        
        // Password validation
        if (password.length < 6) {
            showFieldError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearFieldError(passwordInput);
        }
        
        return isValid;
    }

    function showFieldError(input, message) {
        const wrapper = input.parentElement;
        let errorElement = wrapper.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            wrapper.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
    }

    function clearFieldError(input) {
        const wrapper = input.parentElement;
        const errorElement = wrapper.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('error');
    }

    // Real-time validation
    emailInput.addEventListener('input', function() {
        if (this.value.trim().length >= 3) {
            clearFieldError(this);
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.trim().length >= 6) {
            clearFieldError(this);
        }
    });

    // Add CSS for field errors
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: slideDown 0.3s ease-out;
        }
        
        .form-input.error {
            border-color: #ef4444;
            background: #fef2f2;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

