/* ==========================================================================
   Ragavi R Portfolio - Core Interactive Logic Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* --- Preloader --- */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    });
    // Fallback in case load event takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.classList.add('hidden'), 500);
        }
    }, 2500);

    /* --- Theme Toggle & Management --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        htmlElement.classList.remove('dark');
        htmlElement.classList.add('light');
    } else {
        htmlElement.classList.add('dark');
        htmlElement.classList.remove('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* --- Mobile Navigation Drawer --- */
    const mobileNavToggleBtn = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const menuIcon = mobileNavToggleBtn.querySelector('.menu-icon');
    const closeIcon = mobileNavToggleBtn.querySelector('.close-icon');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const toggleDrawer = () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        menuIcon.classList.toggle('hidden', isOpen);
        closeIcon.classList.toggle('hidden', !isOpen);
    };

    mobileNavToggleBtn.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleDrawer();
            }
        });
    });

    /* --- Custom Typing Effect --- */
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = [
    "Computer Science & Engineering Student",
    "Full Stack Developer",
    "Generative AI Enthusiast",
    "Python Developer"
];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    if (textArray.length && typedTextSpan) {
        setTimeout(type, newTextDelay - 1000);
    }

    /* --- Desktop Cursor Glow Tracker --- */
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor glow lag effect
    function animateCursorGlow() {
        const ease = 0.08;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        cursorGlow.style.left = `${currentX}px`;
        cursorGlow.style.top = `${currentY}px`;
        
        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // Hide glow if mouse leaves document
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = htmlElement.classList.contains('dark') ? '0.85' : '0.15';
    });

    /* --- Scroll-based Active Navigation Highlight & Reveal --- */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.reveal');

    // Reveal elements observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop - 120) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === currentSectionId) {
                item.classList.add('active');
            }
        });

        // Show/Hide Scroll-to-top button
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll to top button action
    document.getElementById('scroll-to-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* --- Animated Numbers (Counters) --- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
            const duration = 2000; // 2 seconds
            let startTimestamp = null;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = easeProgress * target;

                counter.textContent = currentValue.toFixed(decimals);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.textContent = target.toFixed(decimals);
                }
            };
            window.requestAnimationFrame(step);
        });
    };

    // Trigger counters when statistics section is in viewport
    const statisticsSection = document.getElementById('about');
    if (statisticsSection && statNumbers.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statisticsSection);
    }

    /* --- Canvas Interactive Particles Background --- */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Resize handler
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', () => {
        setCanvasSize();
        initParticles();
    });

    // Mouse interactive coordinates for connection lines
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle representation
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Move and boundary bounce
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw particle
            this.draw();
        }
    }

    // Initialize particle array
    function initParticles() {
        particlesArray = [];
        // Fewer particles on mobile for speed
        const numberOfParticles = window.innerWidth < 768 ? 40 : 100;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            
            // Slow velocities
            const directionX = (Math.random() * 0.4) - 0.2;
            const directionY = (Math.random() * 0.4) - 0.2;
            
            // Subtle violet / cyan theme particle colors
            const colors = ['rgba(124, 58, 237, 0.25)', 'rgba(6, 182, 212, 0.25)'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles with drawing lines
    function connect() {
        let opacityValue = 1;
        const maxDist = window.innerWidth < 768 ? 90 : 130;

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDist) {
                    opacityValue = 1 - (distance / maxDist);
                    
                    // Style connection lines based on theme state
                    const isDark = htmlElement.classList.contains('dark');
                    const strokeColor = isDark 
                        ? `rgba(124, 58, 237, ${opacityValue * 0.08})`
                        : `rgba(124, 58, 237, ${opacityValue * 0.05})`;

                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    /* --- Contact Form submission --- */
    const contactForm = document.getElementById('portfolio-contact-form');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather details (Mock Submit)
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simple validation check
            if (!name || !email || !subject || !message) {
                showToast('Please fill out all fields.', 'x-circle', 'text-error');
                return;
            }

            // Simulate server request
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('.btn-send-icon');

            // Set loading state
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending...';
            submitBtnIcon.style.opacity = '0.5';

            setTimeout(() => {
                // Success message
                showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'check-circle', 'text-success');
                
                // Clear Form
                contactForm.reset();

                // Restore button
                submitBtn.disabled = false;
                submitBtnText.textContent = 'Send Message';
                submitBtnIcon.style.opacity = '1';
            }, 1200);
        });
    }

    // Helper toast display function
    function showToast(message, iconName, iconColorClass) {
        toastMessage.textContent = message;
        
        // Dynamic Icon setup
        const toastIcon = toast.querySelector('.toast-icon');
        toastIcon.className = `toast-icon ${iconColorClass}`;
        toastIcon.setAttribute('data-lucide', iconName);
        lucide.createIcons(); // Re-render target icon

        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('show'), 50);

        // Hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 400);
        }, 4000);
    }

    /* --- Fullscreen Resume Mode --- */
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const resumeContainer = document.querySelector('.resume-viewer-container');
    const fullscreenIcon = btnFullscreen ? btnFullscreen.querySelector('i') : null;

    if (btnFullscreen && resumeContainer) {
        btnFullscreen.addEventListener('click', () => {
            const isFullscreen = resumeContainer.classList.toggle('fullscreen');
            
            // Toggle icon and title tooltip
            if (isFullscreen) {
                btnFullscreen.setAttribute('title', 'Exit Fullscreen');
                if (fullscreenIcon) {
                    fullscreenIcon.setAttribute('data-lucide', 'minimize-2');
                }
            } else {
                btnFullscreen.setAttribute('title', 'Toggle Fullscreen');
                if (fullscreenIcon) {
                    fullscreenIcon.setAttribute('data-lucide', 'maximize-2');
                }
            }
            // Re-render lucide icons to display the updated shape
            lucide.createIcons();
            
            // Lock body scroll when fullscreen is active
            document.body.style.overflow = isFullscreen ? 'hidden' : '';
        });

        // Exit fullscreen if ESC is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeContainer.classList.contains('fullscreen')) {
                resumeContainer.classList.remove('fullscreen');
                btnFullscreen.setAttribute('title', 'Toggle Fullscreen');
                if (fullscreenIcon) {
                    fullscreenIcon.setAttribute('data-lucide', 'maximize-2');
                    lucide.createIcons();
                }
                document.body.style.overflow = '';
            }
        });
    }
});
