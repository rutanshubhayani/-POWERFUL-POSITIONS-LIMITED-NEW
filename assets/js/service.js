// Function to navigate to checkout with service/package details
function goToCheckout(type, name, price, period, features) {
    // Create URL parameters with service/package details
    const params = new URLSearchParams({
        type: type,
        name: name,
        price: price,
        period: period,
        features: JSON.stringify(features)
    });
    
    // Navigate to checkout page with parameters
    window.location.href = `checkout.html?${params.toString()}`;
}

// Get current navigation key based on pathname
function getCurrentNavKey() {
    const path = window.location.pathname.toLowerCase();
    if (path.endsWith('/') || path.endsWith('/index.html')) {
        return 'home';
    }
    if (path.includes('/about')) {
        return 'about';
    }
    if (path.includes('/service')) {
        return 'services';
    }
    if (path.includes('/contact')) {
        return 'contact';
    }
    return '';
}

// Set active navigation state
function setActiveNavState() {
    const navLinks = document.querySelectorAll('[data-page]');
    const currentNavKey = getCurrentNavKey();

    navLinks.forEach(link => {
        if (link.dataset.page === currentNavKey) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    if (mobileToggle && mobileMenu) {
        // Check if already initialized to avoid duplicate listeners
        if (mobileToggle.dataset.initialized !== 'true') {
            mobileToggle.dataset.initialized = 'true';

        mobileToggle.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
            } else {
                mobileMenu.classList.add('active');
                mobileToggle.classList.add('active');
                body.classList.add('menu-open');
            }
        });

        // Close menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-btn-join');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        }
    }
    
    // Set active navigation state (always run, even if menu elements not found)
    setActiveNavState();
}

// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('../component/header.html')
        .then(response => response.text())
        .then(data => {
            // Adjust paths for pages in subdirectories
            data = data.replace(/href="assets\/pages\/service\.html/g, 'href="service.html');
            data = data.replace(/href="assets\/pages\/terms\.html/g, 'href="terms.html');
            data = data.replace(/href="assets\/pages\/checkout\.html/g, 'href="checkout.html');
            
            // Fix root level pages
            data = data.replace(/href="index\.html/g, 'href="../../index.html');
            data = data.replace(/href="about\.html/g, 'href="../../about.html');
            data = data.replace(/href="contact\.html/g, 'href="../../contact.html');
            
            // Fix index.html anchor links
            data = data.replace(/href="index\.html#/g, 'href="../../index.html#');
            
            document.getElementById('site-header').innerHTML = data;
            
            // Initialize mobile menu after header is loaded
            initMobileMenu();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('../component/footer.html')
        .then(response => response.text())
        .then(data => {
            // Adjust paths for pages in subdirectories
            data = data.replace(/href="assets\/pages\/service\.html/g, 'href="service.html');
            data = data.replace(/href="assets\/pages\/terms\.html/g, 'href="terms.html');
            data = data.replace(/href="assets\/pages\/checkout\.html/g, 'href="checkout.html');
            
            // Fix root level pages
            data = data.replace(/href="index\.html/g, 'href="../../index.html');
            data = data.replace(/href="about\.html/g, 'href="../../about.html');
            data = data.replace(/href="contact\.html/g, 'href="../../contact.html');
            
            // Fix index.html anchor links
            data = data.replace(/href="index\.html#/g, 'href="../../index.html#');
            
            document.getElementById('site-footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
