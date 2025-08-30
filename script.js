  const PortfolioApp = (() => {
            // Configuration constants - Update these with your actual values
            const PUBLIC_KEY = "NPDo4YrysQIHB7r-7";
            const SERVICE_ID = "service_946er0j";
            const TEMPLATE_ID = "template_k9szrkh";
            const FORM_ID = "contact-form";
            const SEND_BTN_ID = "send-btn";
            const FORM_STATUS_ID = "form-status";
            const MENU_TOGGLE_ID = "menu-toggle";
            const MENU_CLOSE_ID = "menu-close";
            const PRIMARY_MENU_ID = "primary-menu";
            const WHATSAPP_ID = "whatsapp-float";
            const HERO_TYPING_SELECTOR = ".tagline[data-typing]";
            const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Debug mode - set to false in production
            const DEBUG = true;
            
            // State variables
            let isMenuOpen = false;
            let lastScrollY = 0;
            let emailJsLoaded = false;
            let formCooldown = false;
            
            // DOM Elements
            let elements = {};
            
            // Initialize the application
            function init() {
                cacheDOMElements();
                initNav();
                initHero();
                initScrollReveal();
                initLazyLoad();
                initEmailJS();
                initSkillBars();
                initWhatsAppFloat();
                initMisc();
                
                log('Portfolio initialized');
            }
            
            // Cache frequently used DOM elements
            function cacheDOMElements() {
                elements = {
                    menuToggle: document.getElementById(MENU_TOGGLE_ID),
                    menuClose: document.getElementById(MENU_CLOSE_ID),
                    primaryMenu: document.getElementById(PRIMARY_MENU_ID),
                    contactForm: document.getElementById(FORM_ID),
                    sendBtn: document.getElementById(SEND_BTN_ID),
                    formStatus: document.getElementById(FORM_STATUS_ID),
                    whatsappFloat: document.getElementById(WHATSAPP_ID),
                    yearElement: document.getElementById('year')
                };
            }
            
            // Navigation initialization
            function initNav() {
                if (!elements.menuToggle || !elements.primaryMenu || !elements.menuClose) return;
                
                // Toggle menu on button click
                elements.menuToggle.addEventListener('click', toggleMenu);
                elements.menuClose.addEventListener('click', closeMenu);
                
                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (isMenuOpen && 
                        !elements.primaryMenu.contains(e.target) && 
                        !elements.menuToggle.contains(e.target)) {
                        closeMenu();
                    }
                });
                
                // Close menu on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && isMenuOpen) {
                        closeMenu();
                    }
                });
                
                // Close menu when clicking on nav links
                const navLinks = elements.primaryMenu.querySelectorAll('a:not(.social-icon a)');
                navLinks.forEach(link => {
                    link.addEventListener('click', closeMenu);
                });
                
                // Handle window resize
                window.addEventListener('resize', debounce(() => {
                    if (window.innerWidth >= 900 && isMenuOpen) {
                        closeMenu();
                    }
                }, 250));
            }
            
            // Toggle mobile menu
            function toggleMenu() {
                if (isMenuOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }
            
            // Open mobile menu
            function openMenu() {
                elements.menuToggle.classList.add('open');
                elements.menuToggle.setAttribute('aria-expanded', 'true');
                elements.primaryMenu.setAttribute('aria-hidden', 'false');
                isMenuOpen = true;
                
                // Trap focus inside menu
                trapFocus(elements.primaryMenu);
            }
            
            // Close mobile menu
            function closeMenu() {
                elements.menuToggle.classList.remove('open');
                elements.menuToggle.setAttribute('aria-expanded', 'false');
                elements.primaryMenu.setAttribute('aria-hidden', 'true');
                isMenuOpen = false;
                
                // Return focus to menu toggle
                elements.menuToggle.focus();
            }
            
            // Basic focus trap for mobile menu
            function trapFocus(element) {
                const focusableElements = element.querySelectorAll(
                    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                element.addEventListener('keydown', function trapListener(e) {
                    if (e.key !== 'Tab') return;
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
            
            // Hero section initialization
            function initHero() {
                initTypingEffect();
                initParallax();
            }
            
            // Initialize typing effect
            function initTypingEffect() {
                const typingElement = document.querySelector(HERO_TYPING_SELECTOR);
                if (!typingElement || REDUCED_MOTION) {
                    if (typingElement) {
                        typingElement.style.whiteSpace = 'normal';
                    }
                    return;
                }
                
                const text = typingElement.textContent;
                typingElement.textContent = '';
                typingElement.style.whiteSpace = 'nowrap';
                
                let i = 0;
                const typeSpeed = 35;
                
                function typeWriter() {
                    if (i < text.length) {
                        typingElement.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, typeSpeed);
                    } else {
                        typingElement.style.whiteSpace = 'normal';
                    }
                }
                
                setTimeout(typeWriter, 500);
            }
            
            // Initialize parallax effect
            function initParallax() {
                if (REDUCED_MOTION) return;
                
                const heroSection = document.querySelector('.hero[data-parallax="true"]');
                if (!heroSection) return;
                
                window.addEventListener('scroll', throttle(() => {
                    const scrollY = window.scrollY;
                    const offset = scrollY * 0.05;
                    const clampedOffset = Math.min(offset, 50);
                    document.documentElement.style.setProperty('--hero-offset', `${clampedOffset}px`);
                }, 10));
            }
            
            // Initialize scroll reveal animations
            function initScrollReveal() {
                if (REDUCED_MOTION) {
                    const revealElements = document.querySelectorAll('.reveal');
                    revealElements.forEach(el => {
                        el.classList.add('is-visible');
                    });
                    return;
                }
                
                const revealElements = document.querySelectorAll('.reveal');
                if (!revealElements.length) return;
                
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('is-visible');
                                observer.unobserve(entry.target);
                            }
                        });
                    }, {
                        threshold: 0.1,
                        rootMargin: '0px 0px -50px 0px'
                    });
                    
                    revealElements.forEach(el => {
                        observer.observe(el);
                    });
                } else {
                    revealElements.forEach(el => {
                        el.classList.add('is-visible');
                    });
                }
            }
            
            // Initialize lazy loading for images
            function initLazyLoad() {
                const lazyImages = document.querySelectorAll('img[loading="lazy"]');
                if (!lazyImages.length) return;
                
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                observer.unobserve(img);
                                if (img.complete) {
                                    img.classList.add('loaded');
                                } else {
                                    img.addEventListener('load', () => {
                                        img.classList.add('loaded');
                                    });
                                }
                            }
                        });
                    });
                    
                    lazyImages.forEach(img => {
                        observer.observe(img);
                    });
                } else {
                    lazyImages.forEach(img => {
                        img.classList.add('loaded');
                    });
                }
            }
            
            // Initialize EmailJS
            function initEmailJS() {
                if (typeof emailjs === 'undefined') {
                    log('EmailJS not loaded. Form will use fallback behavior.', 'warn');
                    setupFormFallback();
                    return;
                }
                
                emailjs.init(PUBLIC_KEY);
                emailJsLoaded = true;
                log('EmailJS initialized');
                
                if (elements.contactForm) {
                    elements.contactForm.addEventListener('submit', handleFormSubmit);
                }
            }
            
            // Handle form submission
            async function handleFormSubmit(e) {
                e.preventDefault();
                
                if (formCooldown) {
                    showFormStatus('Please wait before submitting again.', 'error');
                    return;
                }
                
                const honeypot = document.getElementById('contact_honeypot');
                if (honeypot && honeypot.value !== '') {
                    log('Form submission blocked by honeypot', 'warn');
                    return;
                }
                
                if (!validateForm()) {
                    return;
                }
                
                if (elements.sendBtn) {
                    elements.sendBtn.disabled = true;
                    elements.sendBtn.classList.add('loading');
                }
                
                try {
                    if (emailJsLoaded) {
                        const response = await emailjs.sendForm(
                            SERVICE_ID, 
                            TEMPLATE_ID, 
                            elements.contactForm
                        );
                        
                        log('EmailJS response:', response);
                        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                        elements.contactForm.reset();
                        setFormCooldown(10000);
                    } else {
                        fallbackToMailto();
                        showFormStatus('Message prepared. Please check your email client.', 'success');
                        setFormCooldown(5000);
                    }
                } catch (error) {
                    log('Email sending failed:', error, 'error');
                    showFormStatus('Sorry, there was an error sending your message. Please try again later or contact me directly at muneeburrehmenportfolio@gmail.com', 'error');
                    if (elements.sendBtn) {
                        elements.sendBtn.disabled = false;
                        elements.sendBtn.classList.remove('loading');
                    }
                }
            }
            
            // Validate form fields
            function validateForm() {
                const nameInput = document.getElementById('from_name');
                const emailInput = document.getElementById('from_email');
                const subjectInput = document.getElementById('subject');
                const messageInput = document.getElementById('message');
                
                if (!nameInput || nameInput.value.length < 2) {
                    showFormStatus('Please enter your name (at least 2 characters)', 'error');
                    nameInput?.focus();
                    return false;
                }
                
                if (!emailInput || !isValidEmail(emailInput.value)) {
                    showFormStatus('Please enter a valid email address', 'error');
                    emailInput?.focus();
                    return false;
                }
                
                if (!subjectInput || subjectInput.value.length < 3) {
                    showFormStatus('Please enter a subject (at least 3 characters)', 'error');
                    subjectInput?.focus();
                    return false;
                }
                
                if (!messageInput || messageInput.value.length < 6) {
                    showFormStatus('Please enter a message (at least 6 characters)', 'error');
                    messageInput?.focus();
                    return false;
                }
                
                return true;
            }
            
            // Email validation
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            // Show form status message
            function showFormStatus(message, type) {
                if (!elements.formStatus) return;
                
                elements.formStatus.textContent = message;
                elements.formStatus.className = '';
                elements.formStatus.classList.add(type);
                
                elements.formStatus.focus();
                
                setTimeout(() => {
                    elements.formStatus.textContent = '';
                    elements.formStatus.className = '';
                }, 5000);
            }
            
            // Set form cooldown period
            function setFormCooldown(duration) {
                formCooldown = true;
                
                setTimeout(() => {
                    formCooldown = false;
                    if (elements.sendBtn) {
                        elements.sendBtn.disabled = false;
                        elements.sendBtn.classList.remove('loading');
                    }
                }, duration);
            }
            
            // Fallback to mailto if EmailJS fails
            function fallbackToMailto() {
                const nameInput = document.getElementById('from_name');
                const emailInput = document.getElementById('from_email');
                const subjectInput = document.getElementById('subject');
                const messageInput = document.getElementById('message');
                
                if (!nameInput || !emailInput || !subjectInput || !messageInput) return;
                
                const subject = encodeURIComponent(subjectInput.value);
                const body = encodeURIComponent(
                    `Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\nMessage:\n${messageInput.value}`
                );
                
                window.location.href = `mailto:muneeburrehmenportfolio@gmail.com?subject=${subject}&body=${body}`;
            }
            
            // Set up form fallback behavior
            function setupFormFallback() {
                if (elements.contactForm) {
                    elements.contactForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        fallbackToMailto();
                    });
                }
            }
            
            // Initialize skill bars animation
            function initSkillBars() {
                const skillItems = document.querySelectorAll('.skill-item');
                if (!skillItems.length) return;
                
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const skillItem = entry.target;
                                const skillLevel = skillItem.getAttribute('data-skill-level');
                                const fillElement = skillItem.querySelector('.skill-bar-fill');
                                
                                if (fillElement) {
                                    fillElement.style.width = `${skillLevel}%`;
                                }
                                
                                observer.unobserve(skillItem);
                            }
                        });
                    }, {
                        threshold: 0.5
                    });
                    
                    skillItems.forEach(item => {
                        observer.observe(item);
                    });
                } else {
                    skillItems.forEach(item => {
                        const skillLevel = item.getAttribute('data-skill-level');
                        const fillElement = item.querySelector('.skill-bar-fill');
                        
                        if (fillElement) {
                            fillElement.style.width = `${skillLevel}%`;
                        }
                    });
                }
            }
            
            // Initialize WhatsApp float button
            function initWhatsAppFloat() {
                if (!elements.whatsappFloat) return;
                
                elements.whatsappFloat.addEventListener('mouseenter', () => {
                    elements.whatsappFloat.classList.add('is-hovered');
                });
                
                elements.whatsappFloat.addEventListener('mouseleave', () => {
                    elements.whatsappFloat.classList.remove('is-hovered');
                });
                
                elements.whatsappFloat.addEventListener('touchstart', () => {
                    elements.whatsappFloat.classList.toggle('is-hovered');
                });
            }
            
            // Initialize miscellaneous features
            function initMisc() {
                // Set current year in footer
                if (elements.yearElement) {
                    elements.yearElement.textContent = new Date().getFullYear();
                }
            }
            
            // Utility: Debounce function
            function debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }
            
            // Utility: Throttle function
            function throttle(func, limit) {
                let inThrottle;
                return function (...args) {
                    if (!inThrottle) {
                        func(...args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            }
            
            // Utility: Debug logging
            function log(...args) {
                if (DEBUG) {
                    console.log('[PortfolioApp]', ...args);
                }
            }
            
            // Public API
            return {
                init
            };
        })();
        
        // Initialize the app when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            PortfolioApp.init();
        });