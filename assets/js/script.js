document.addEventListener('DOMContentLoaded', async () => {
    let headerScrollListenerAttached = false;

    async function loadComponent(targetSelector, url) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`Failed to fetch ${url} (${resp.status})`);
            const html = await resp.text();
            const container = document.querySelector(targetSelector);
            if (container) {
                container.innerHTML = html;

                if (window.location.pathname.includes('/assets/pages/')) {
                    const links = container.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                            if (href.startsWith('assets/pages/')) {
                                link.setAttribute('href', href.replace('assets/pages/', ''));
                            } else if (!href.startsWith('../') && !href.includes('pages/')) {
                                link.setAttribute('href', '../' + href);
                            }
                        }
                    });
                }

                console.log(`Successfully loaded ${url} into ${targetSelector}`);
            }
        } catch (err) {
            console.error('Error loading component:', err);
        }
    }

    const pathPrefix = window.location.pathname.includes('/assets/pages/') ? '../' : '';
    ensureHeaderStyles(pathPrefix);
    await loadComponent('#site-header', `${pathPrefix}assets/component/header.html`);
    initHeaderInteractions();
    await loadComponent('#site-footer', `${pathPrefix}assets/component/footer.html`);

    // Loading Screen Animation - Only for index page
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.querySelector('.loading-progress');

    // Initialize AOS immediately for pages without loading screen
    if (!loadingScreen) {
        AOS.init({
            once: true,
            duration: 900,
            easing: 'ease-out-cubic'
        });
    } else {
        // Loading screen logic for index page only
        const hasVisited = localStorage.getItem('hasVisitedBefore');

        if (!hasVisited) {
            // First time visitor - show loading animation
            localStorage.setItem('hasVisitedBefore', 'true');

            // Simulate loading progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        // Initialize AOS after loading
                        AOS.init({
                            once: true,
                            duration: 900,
                            easing: 'ease-out-cubic'
                        });
                    }, 500);
                }
                loadingProgress.style.width = progress + '%';
            }, 150);
        } else {
            // Returning visitor - hide loading screen immediately
            loadingScreen.classList.add('hidden');
            // Initialize AOS immediately
            AOS.init({
                once: true,
                duration: 900,
                easing: 'ease-out-cubic'
            });
        }
    }

    // Hero Statistics Counter Animation
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    stat.textContent = Math.floor(current) + suffix;
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }


    // Program Tabs Functionality
    const programTabs = document.querySelectorAll('.program-tab');
    const programPanels = document.querySelectorAll('.program-panel');

    programTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const programType = tab.getAttribute('data-program');

            // Remove active class from all tabs and panels
            programTabs.forEach(t => t.classList.remove('active'));
            programPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            const targetPanel = document.querySelector(`[data-program="${programType}"].program-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Pricing Toggle Functionality
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    const annualSavings = document.querySelectorAll('.annual-savings');

    if (pricingToggle) {
        pricingToggle.addEventListener('change', () => {
            if (pricingToggle.checked) {
                // Show annual prices
                monthlyPrices.forEach(price => price.style.display = 'none');
                annualPrices.forEach(price => price.style.display = 'inline');
                annualSavings.forEach(saving => saving.style.display = 'block');
            } else {
                // Show monthly prices
                monthlyPrices.forEach(price => price.style.display = 'inline');
                annualPrices.forEach(price => price.style.display = 'none');
                annualSavings.forEach(saving => saving.style.display = 'none');
            }
        });
    }

    // CTA Email Form Handler
    const ctaForm = document.querySelector('.cta-form .form-group');
    const ctaInput = document.querySelector('.cta-input');
    const ctaBtn = document.querySelector('.cta-btn');

    if (ctaBtn && ctaInput) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = ctaInput.value.trim();

            if (email) {
                // Validate email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    // Simulate form submission
                    ctaBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                    ctaBtn.style.background = 'linear-gradient(45deg, #00f2ea, #4ade80)';
                    ctaInput.value = '';

                    setTimeout(() => {
                        ctaBtn.innerHTML = '<span>Start Free Trial</span><i class="fas fa-rocket"></i>';
                        ctaBtn.style.background = 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))';
                    }, 3000);
                } else {
                    // Show error
                    ctaBtn.innerHTML = '<i class="fas fa-exclamation"></i> Invalid Email';
                    ctaBtn.style.background = 'linear-gradient(45deg, #ff0055, #ff4444)';

                    setTimeout(() => {
                        ctaBtn.innerHTML = '<span>Start Free Trial</span><i class="fas fa-rocket"></i>';
                        ctaBtn.style.background = 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))';
                    }, 2000);
                }
            }
        });

        // Allow Enter key to submit
        ctaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                ctaBtn.click();
            }
        });
    }

    // Enhanced Button Animations
    const glowButtons = document.querySelectorAll('.btn-glow');
    glowButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 0 30px rgba(0, 242, 234, 0.6)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = 'none';
        });
    });

    // Glass Button Ripple Effect
    const glassButtons = document.querySelectorAll('.btn-glass');
    glassButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';

                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                }, 10);
            }
        });
    });
    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to run animation only once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    // Staggered Animation for Grid Items
    const staggerGrids = document.querySelectorAll('.stagger-grid');
    staggerGrids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 100}ms`;
            observer.observe(child);
            child.classList.add('hidden-stagger');
        });
    });

    // Header Scroll Effect - Initialize after components are loaded
    function initializeHeaderScrollEffect() {
        const header = document.querySelector('header');
        if (header) {
            // Remove any existing scroll listeners to avoid duplicates
            const scrollHandler = () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };

            window.addEventListener('scroll', scrollHandler);
            console.log('Header scroll effect initialized');
        } else {
            console.warn('Header element not found for scroll effect');
        }
    }

    // Initialize scroll effect after a short delay to ensure header is loaded
    setTimeout(initializeHeaderScrollEffect, 100);

    // Hover Tilt Effect for Feature Cards
    const cards = document.querySelectorAll('.feature-card, .class-card, .pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                contactForm.reset();

                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00d084, #00a86b)';

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);

                // You can add actual form submission logic here
                console.log('Contact form submitted:', data);

                // Show a nice notification
                showNotification('Thank you! Your message has been sent successfully.', 'success');
            }, 2000);
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Input Focus Effects
    const inputs = document.querySelectorAll('.input-group input, .input-group textarea, .input-group select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });

    // Notification System
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #00d084, #00a86b)' : 'linear-gradient(135deg, var(--primary), #00c2bb)'};
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 300px;
            font-weight: 600;
        `;

        // Add to body
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 400);
        }, 5000);
    }

    // Counter Animation for About Page
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current + (target > 100 ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (target > 100 ? '+' : '');
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Trigger counter animations when elements are in view
    const counterElements = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target); // Run only once
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Enhanced hover effects for About page cards
    const aboutCards = document.querySelectorAll('.value-card, .facility-card, .team-member');
    aboutCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            // Add dynamic tilt effect
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
        });

        card.addEventListener('mouseleave', (e) => {
            // Reset transform
            card.style.transform = '';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;

            card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });

    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.about-hero-bg, .contact-hero-bg');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;

        heroSections.forEach(hero => {
            const speed = 0.5;
            hero.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    });

    // Timeline animation for About page
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.6s ease-out';
        timelineObserver.observe(item);
    });

    // Enhanced facility card interactions
    const facilityCards = document.querySelectorAll('.facility-card');
    facilityCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Add click ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 242, 234, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: 50%;
                top: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;

            card.style.position = 'relative';
            card.appendChild(ripple);

            setTimeout(() => {
                card.removeChild(ripple);
            }, 600);
        });
    });

    // Add ripple animation keyframes to page
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Team member card flip effect
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        const memberImage = member.querySelector('.member-image');
        const memberInfo = member.querySelector('.member-info');

        member.addEventListener('mouseenter', () => {
            memberImage.style.transform = 'rotateY(-10deg)';
            memberInfo.style.transform = 'translateY(-5px)';
        });

        member.addEventListener('mouseleave', () => {
            memberImage.style.transform = '';
            memberInfo.style.transform = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Service Card Hover Effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add floating effect
            card.style.transform = 'translateY(-10px) rotateY(5deg)';

            // Add glow to service icon
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.boxShadow = '0 0 50px var(--primary-glow)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.boxShadow = '';
            }
        });
    });

    // Package Card Selection Effect
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        const btn = card.querySelector('.package-btn');

        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Add selection effect
            card.style.transform = 'scale(0.95)';
            card.style.transition = 'transform 0.1s ease-out';

            // Create ripple effect
            const ripple = document.createElement('div');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(0, 242, 234, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;

            btn.style.position = 'relative';
            btn.appendChild(ripple);

            setTimeout(() => {
                card.style.transform = '';
                btn.removeChild(ripple);

                // Show success message
                showNotification(`Package selected! Redirecting to booking...`, 'success');

                // Simulate redirect after 2 seconds
                setTimeout(() => {
                    // You can redirect to booking page here
                    console.log('Redirect to booking for package:', card.querySelector('h3').textContent);
                }, 2000);
            }, 600);
        });
    });

    // Service Button Interactions
    const serviceBtns = document.querySelectorAll('.service-btn');
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const serviceName = btn.closest('.service-card').querySelector('h3').textContent;

            // Add loading state
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                showNotification(`${serviceName} booking initiated! Check your email for confirmation.`, 'success');
            }, 2000);
        });
    });

    // Class Item Booking (separate from filter functionality)
    const bookableClassItems = document.querySelectorAll('.class-item');
    bookableClassItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Only trigger booking if the item is visible (not filtered out)
            if (item.style.display === 'none') return;

            const className = item.querySelector('h4')?.textContent || 'Unknown Class';
            const instructor = item.querySelector('p')?.textContent || 'Unknown Instructor';
            const time = item.querySelector('.class-time')?.textContent || 'Unknown Time';

            // Add selection highlight
            item.style.background = 'rgba(0, 242, 234, 0.1)';
            item.style.borderColor = 'var(--primary)';
            item.style.transform = 'scale(1.02)';

            setTimeout(() => {
                item.style.background = '';
                item.style.borderColor = '';
                item.style.transform = '';

                showNotification(`Booking ${className} with ${instructor} at ${time}`, 'success');
            }, 1000);
        });
    });

    // Testimonial Card Interactions
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const stars = card.querySelectorAll('.testimonial-rating i');
            stars.forEach((star, index) => {
                setTimeout(() => {
                    star.style.transform = 'scale(1.2)';
                    star.style.color = '#ffd700';
                }, index * 100);
            });
        });

        card.addEventListener('mouseleave', () => {
            const stars = card.querySelectorAll('.testimonial-rating i');
            stars.forEach(star => {
                star.style.transform = '';
                star.style.color = '';
            });
        });
    });

    // Enhanced scroll animations for service page
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                } else if (entry.target.classList.contains('package-card')) {
                    entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                }
            }
        });
    }, { threshold: 0.1 });

    // Observe service cards
    document.querySelectorAll('.service-card, .package-card, .testimonial-card').forEach(card => {
        serviceObserver.observe(card);
    });

    // Pricing animation
    const priceElements = document.querySelectorAll('.package-price .price');
    const priceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const priceEl = entry.target;
                const finalPrice = parseInt(priceEl.textContent.replace('£', ''));
                animatePrice(priceEl, 0, finalPrice, 1000);
                priceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    priceElements.forEach(price => {
        priceObserver.observe(price);
    });

    function animatePrice(element, start, end, duration) {
        const startTime = performance.now();

        function updatePrice(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(start + (end - start) * progress);
            element.textContent = '£' + current;

            if (progress < 1) {
                requestAnimationFrame(updatePrice);
            }
        }

        requestAnimationFrame(updatePrice);
    }

    // Enhanced notification system for service page
    function showServiceNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `service-notification ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #00d084, #00a86b)' :
                type === 'error' ? 'linear-gradient(135deg, #ff4757, #ff3838)' :
                    'linear-gradient(135deg, var(--primary), #00c2bb)'};
            color: ${type === 'success' || type === 'error' ? '#fff' : '#000'};
            padding: 1rem 1.5rem;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 350px;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-weight: 600;
            cursor: pointer;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });

        // Auto close
        setTimeout(() => {
            closeNotification(notification);
        }, duration);

        function closeNotification(notif) {
            notif.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notif)) {
                    document.body.removeChild(notif);
                }
            }, 400);
        }
    }

    // Override the global showNotification for service page
    if (window.location.pathname.includes('service')) {
        window.showNotification = showServiceNotification;
    }

    // Smooth Hero Scroll Indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Enhanced Parallax Effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Update hero particles position
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = 0.5 + (index * 0.1);
            particle.style.transform = `translateY(${-scrolled * speed}px)`;
        });
    });

    // Interactive Feature Cards Hover
    const modernFeatureCards = document.querySelectorAll('.feature-card.modern');
    modernFeatureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Pricing Card Enhanced Interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        const planBtn = card.querySelector('.plan-btn');

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';

            // Add subtle glow effect
            if (card.classList.contains('featured')) {
                card.style.boxShadow = '0 20px 40px rgba(0, 242, 234, 0.25), 0 0 0 1px rgba(0, 242, 234, 0.3)';
            } else {
                card.style.boxShadow = '0 20px 40px rgba(0, 242, 234, 0.15), 0 0 0 1px rgba(0, 242, 234, 0.2)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = '';
                card.style.boxShadow = '';
            } else {
                card.style.transform = 'scale(1.05)';
            }
        });

        // Plan button interactions
        if (planBtn) {
            planBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const planName = card.querySelector('h3').textContent;
                const price = card.querySelector('.amount').textContent;

                // Add click animation
                planBtn.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    planBtn.style.transform = '';
                    showNotification(`${planName} plan selected! Price: £${price}/mo`, 'success');

                    // Simulate redirect to checkout
                    setTimeout(() => {
                        console.log(`Redirecting to checkout for ${planName} plan`);
                    }, 2000);
                }, 100);
            });
        }
    });

    // Enhanced Program Panel Transitions
    const programPanelContainer = document.querySelector('.program-content');
    if (programPanelContainer) {
        // Add intersection observer for panel animations
        const panelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.program-panel').forEach(panel => {
            panelObserver.observe(panel);
        });
    }

    // Dynamic background color based on scroll position
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const sections = ['hero', 'features', 'programs', 'pricing', 'cta-section'];

        sections.forEach((sectionId, index) => {
            const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    // Update navbar based on current section
                    updateNavbarForSection(index);
                }
            }
        });

        lastScrollY = scrollY;
    });

    function updateNavbarForSection(sectionIndex) {
        const navbar = document.querySelector('nav');
        if (navbar) {
            // Remove all section classes
            navbar.classList.remove('on-hero', 'on-features', 'on-programs', 'on-pricing', 'on-cta');

            // Add class for current section
            const sectionClasses = ['on-hero', 'on-features', 'on-programs', 'on-pricing', 'on-cta'];
            if (sectionClasses[sectionIndex]) {
                navbar.classList.add(sectionClasses[sectionIndex]);
            }
        }
    }

    // Service page class filter
    const scheduleFilter = document.querySelector('.schedule-filter');
    if (scheduleFilter) {
        const filterButtons = scheduleFilter.querySelectorAll('.filter-btn');
        const classItems = document.querySelectorAll('.schedule-grid .class-item');
        const scheduleDays = document.querySelectorAll('.schedule-grid .schedule-day');

        const applyFilter = (filter) => {
            classItems.forEach(item => {
                const shouldShow = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('is-hidden', !shouldShow);
            });

            scheduleDays.forEach(day => {
                const hasVisibleClass = Array.from(day.querySelectorAll('.class-item'))
                    .some(item => !item.classList.contains('is-hidden'));
                day.classList.toggle('hidden-day', !hasVisibleClass);
            });
        };

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilter(btn.dataset.filter || 'all');
            });
        });

        applyFilter('all');
    }

    console.log('Enhanced index page with modern animations loaded successfully!');
    function ensureHeaderStyles(pathPrefix) {
        if (document.getElementById('header-stylesheet')) return;
        const headerLink = document.createElement('link');
        headerLink.rel = 'stylesheet';
        headerLink.href = `${pathPrefix}assets/css/header.css`;
        headerLink.id = 'header-stylesheet';
        document.head.appendChild(headerLink);
    }

    function handleHeaderScroll() {
        const header = document.querySelector('.main-header');
        if (!header) return;
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function initHeaderInteractions() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const body = document.body;

        if (mobileToggle && mobileMenu) {
            const openMenu = () => {
                mobileMenu.classList.add('active');
                mobileToggle.classList.add('active');
                body.classList.add('menu-open');
            };

            const closeMenu = () => {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
            };

            mobileToggle.addEventListener('click', () => {
                const isOpen = mobileMenu.classList.contains('active');
                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-btn-join');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    closeMenu();
                }
            });
        }

        const navLinks = document.querySelectorAll('[data-page]');
        const currentNavKey = getCurrentNavKey();

        navLinks.forEach(link => {
            if (link.dataset.page === currentNavKey) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        if (!headerScrollListenerAttached) {
            window.addEventListener('scroll', handleHeaderScroll);
            headerScrollListenerAttached = true;
        }
        handleHeaderScroll();
    }

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
});

// Global helper to route users to checkout with selected plan/service details
window.goToCheckout = function(type, name, price, period, features) {
    const params = new URLSearchParams({
        type: type || '',
        name: name || '',
        price: price || '',
        period: period || '',
        features: JSON.stringify(features || [])
    });

    const isNestedPage = window.location.pathname.includes('/assets/pages/');
    const checkoutPath = isNestedPage ? 'checkout.html' : 'assets/pages/checkout.html';
    window.location.href = `${checkoutPath}?${params.toString()}`;
};
