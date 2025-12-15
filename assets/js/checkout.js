// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    const totalSteps = 3;

    // Initialize checkout functionality
    initializeCheckout();

    function initializeCheckout() {
        // Format card number input
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', formatCardNumber);
        }

        // Format expiry date input
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', formatExpiryDate);
        }

        // Format CVV input
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', formatCVV);
        }

        // Payment method selection
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                selectPaymentMethod(this.dataset.method);
            });
        });

        // Form submission
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleFormSubmit);
        }

        // Same address checkbox
        const sameAddressCheckbox = document.getElementById('sameAddress');
        if (sameAddressCheckbox) {
            sameAddressCheckbox.addEventListener('change', handleSameAddress);
        }

        // Auto-fill card name from personal info
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const cardNameInput = document.getElementById('cardName');

        if (firstNameInput && lastNameInput && cardNameInput) {
            [firstNameInput, lastNameInput].forEach(input => {
                input.addEventListener('input', function() {
                    const firstName = firstNameInput.value.trim();
                    const lastName = lastNameInput.value.trim();
                    if (firstName && lastName) {
                        cardNameInput.value = `${firstName} ${lastName}`;
                    }
                });
            });
        }

        // Load package details from URL parameters
        loadPackageFromURL();
    }

    function loadPackageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const packageType = urlParams.get('type');
        const packageName = urlParams.get('name');
        const packagePrice = urlParams.get('price');
        const packagePeriod = urlParams.get('period');
        const packageFeatures = urlParams.get('features');
        
        if (packageType && packageName && packagePrice) {
            const serviceData = {
                type: packageType,
                name: packageName,
                price: parseInt(packagePrice),
                period: packagePeriod,
                features: packageFeatures ? JSON.parse(packageFeatures) : []
            };
            
            loadPackageDetails(serviceData);
        } else {
            // Fallback to default pro package if no parameters
            loadPackageDetails('pro');
        }
    }

    function loadPackageDetails(packageData) {
        // If packageData is a string (old format), use default packages
        if (typeof packageData === 'string') {
            const packages = {
                'starter': {
                    name: 'Elite Starter',
                    price: 299,
                    description: 'Perfect for fitness beginners',
                    features: ['Gym Access', 'Group Classes', 'Basic Nutrition'],
                    period: '/month'
                },
                'pro': {
                    name: 'Elite Pro',
                    price: 599,
                    description: 'Everything you need to dominate your fitness goals',
                    features: ['Personal Training', 'Group Classes', 'Recovery Sessions'],
                    period: '/month'
                },
                'champion': {
                    name: 'Elite Champion',
                    price: 999,
                    description: 'Ultimate elite experience with dedicated coach',
                    features: ['Dedicated Coach', 'VIP Access', 'Performance Testing'],
                    period: '/month'
                }
            };

            packageData = packages[packageData] || packages['pro'];
        }

        updateOrderSummary(packageData);
    }

    function updateOrderSummary(packageData) {
        const packageInfo = document.querySelector('.package-info h4');
        const packageDesc = document.querySelector('.package-info p');
        const packagePrice = document.querySelector('.package-price .price');
        const packagePeriod = document.querySelector('.package-price .period');
        const subtotal = document.getElementById('subtotal');
        const total = document.getElementById('total');

        if (packageInfo) packageInfo.textContent = packageData.name;
        if (packageDesc) {
            packageDesc.textContent = packageData.description || getServiceDescription(packageData.type);
        }
        if (packagePrice) packagePrice.textContent = `£${packageData.price}`;
        if (packagePeriod) packagePeriod.textContent = packageData.period || '/month';
        if (subtotal) subtotal.textContent = `£${packageData.price}.00`;

        // Calculate total based on service type
        let setupFee = 0;
        let discount = 0;
        let taxRate = 0.0825;

        // Different pricing logic for packages vs individual services
        if (packageData.period === '/month') {
            // Monthly packages
            setupFee = 99;
            discount = 100;
        } else {
            // Individual services (per session, per class, etc.)
            setupFee = 25; // Lower setup fee for individual services
            discount = 0; // No first-time discount for individual services
        }

        const subtotalAmount = packageData.price + setupFee - discount;
        const tax = subtotalAmount * taxRate;
        const totalAmount = subtotalAmount + tax;

        // Update UI elements
        document.getElementById('setup-fee').textContent = `£${setupFee}.00`;
        const discountElement = document.getElementById('discount');
        const discountRow = discountElement.closest('.breakdown-item');
        
        if (discount > 0) {
            discountElement.textContent = `-£${discount}.00`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
        
        document.getElementById('tax').textContent = `£${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `£${totalAmount.toFixed(2)}`;

        // Update features
        const featuresContainer = document.querySelector('.package-features');
        if (featuresContainer && packageData.features) {
            featuresContainer.innerHTML = packageData.features
                .map(feature => `<span class="feature-tag">${feature}</span>`)
                .join('');
        }

        // Update package icon based on service type
        updatePackageIcon(packageData.type);
    }

    function getServiceDescription(serviceType) {
        const descriptions = {
            'personal-training': 'One-on-one elite coaching with world-class trainers',
            'group-classes': 'High-energy group workouts led by expert instructors',
            'recovery-wellness': 'Advanced recovery protocols using cutting-edge technology',
            'nutrition-coaching': 'Science-based nutrition planning with metabolic testing',
            'performance-testing': 'Comprehensive biomechanical and physiological assessment',
            'mind-body-training': 'Mental performance coaching and meditation practices',
            'starter': 'Perfect for fitness beginners',
            'pro': 'Everything you need to dominate your fitness goals',
            'champion': 'Ultimate elite experience with dedicated coach'
        };
        
        return descriptions[serviceType] || 'Premium fitness service designed for excellence';
    }

    function updatePackageIcon(serviceType) {
        const packageIcon = document.querySelector('.package-icon i');
        if (!packageIcon) return;

        const iconMap = {
            'personal-training': 'fas fa-user-ninja',
            'group-classes': 'fas fa-users',
            'recovery-wellness': 'fas fa-spa',
            'nutrition-coaching': 'fas fa-apple-alt',
            'performance-testing': 'fas fa-chart-line',
            'mind-body-training': 'fas fa-brain',
            'starter': 'fas fa-dumbbell',
            'pro': 'fas fa-crown',
            'champion': 'fas fa-trophy'
        };

        const iconClass = iconMap[serviceType] || 'fas fa-dumbbell';
        packageIcon.className = iconClass;
    }

    function formatCardNumber(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = value.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            e.target.value = parts.join(' ');
        } else {
            e.target.value = value;
        }
    }

    function formatExpiryDate(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    function formatCVV(e) {
        let value = e.target.value.replace(/[^0-9]/gi, '');
        e.target.value = value;
    }

    function selectPaymentMethod(method) {
        // Remove active class from all methods
        document.querySelectorAll('.payment-method').forEach(m => {
            m.classList.remove('active');
        });

        // Add active class to selected method
        document.querySelector(`.payment-method[data-method="${method}"]`).classList.add('active');

        // Show/hide payment details based on selection
        const cardDetails = document.getElementById('card-details');
        if (cardDetails) {
            cardDetails.style.display = method === 'card' ? 'block' : 'none';
        }
    }

    function handleSameAddress(e) {
        // This would typically populate billing address fields
        // with the shipping address values
        console.log('Same address checkbox:', e.target.checked);
    }

    function validateStep(step) {
        const stepElement = document.getElementById(`step-${step}`);
        const requiredInputs = stepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                // Remove error class after 3 seconds
                setTimeout(() => {
                    input.classList.remove('error');
                }, 3000);
            } else {
                input.classList.remove('error');
            }
        });

        // Additional validation for specific fields
        if (step === 1) {
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            
            if (email && !isValidEmail(email.value)) {
                isValid = false;
                email.classList.add('error');
            }
            
            if (phone && !isValidPhone(phone.value)) {
                isValid = false;
                phone.classList.add('error');
            }
        }

        if (step === 3) {
            const agreeTerms = document.getElementById('agreeTerms');
            if (agreeTerms && !agreeTerms.checked) {
                isValid = false;
                agreeTerms.closest('.checkbox-group').classList.add('error');
                setTimeout(() => {
                    agreeTerms.closest('.checkbox-group').classList.remove('error');
                }, 3000);
            }
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function updateProgressBar(step) {
        document.querySelectorAll('.progress-step').forEach((element, index) => {
            if (index < step) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepElement => {
            stepElement.classList.remove('active');
        });

        // Show current step
        document.getElementById(`step-${step}`).classList.add('active');
        
        // Update progress bar
        updateProgressBar(step);
        
        // Scroll to top of form
        document.querySelector('.checkout-form').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Global functions for navigation buttons
    window.nextStep = function() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        }
    };

    window.prevStep = function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    };

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return;
        }

        const submitButton = document.querySelector('.btn-complete');
        
        // Show loading state
        submitButton.classList.add('loading');
        
        // Simulate payment processing
        setTimeout(() => {
            submitButton.classList.remove('loading');
            showSuccessModal();
        }, 3000);
    }

    function showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    window.closeModal = function() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('show');
            // Redirect to services page or member portal
            setTimeout(() => {
                window.location.href = 'service.html';
            }, 500);
        }
    };

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('success-modal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Add error styles for validation
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error {
            border-color: var(--warning) !important;
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1) !important;
        }
        
        .checkbox-group.error label {
            color: var(--warning) !important;
        }
        
        .form-group input.error + .form-icon {
            color: var(--warning) !important;
        }
    `;
    document.head.appendChild(style);
});

// Auto-detect card type based on number
function detectCardType(number) {
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(number)) {
            return type;
        }
    }
    return null;
}

// Update card icons based on detected type
document.addEventListener('input', function(e) {
    if (e.target.id === 'cardNumber') {
        const cardType = detectCardType(e.target.value.replace(/\s/g, ''));
        const cardIcons = document.querySelectorAll('.card-icons i');
        
        cardIcons.forEach(icon => {
            icon.style.opacity = '0.3';
        });

        if (cardType) {
            const activeIcon = document.querySelector(`.fa-cc-${cardType}`);
            if (activeIcon) {
                activeIcon.style.opacity = '1';
            }
        }
    }
});

// Real-time form validation feedback
document.addEventListener('input', function(e) {
    if (e.target.hasAttribute('required')) {
        if (e.target.value.trim()) {
            e.target.classList.remove('error');
        }
    }
});

// Auto-advance to next field for better UX
document.addEventListener('input', function(e) {
    if (e.target.id === 'expiryDate' && e.target.value.length === 5) {
        document.getElementById('cvv')?.focus();
    }
    
    if (e.target.id === 'cvv' && e.target.value.length === 3) {
        document.getElementById('cardName')?.focus();
    }
});

console.log('Checkout page initialized successfully!');
