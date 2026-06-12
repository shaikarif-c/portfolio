/* ==========================================================================
   SHAIK AREEF - PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor Glow (Desktop Only) ---
    const cursorGlow = document.getElementById('cursorGlow');
    
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        }
    });


    // --- 2. Interactive Card Mouse Tracking (Radial Glow Effect) ---
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    // --- 3. Sticky Navbar & Scroll Effects ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- 4. Active Nav link Scroll Spy ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollSpy = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Fallback for bottom of page (reaches footer)
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
            currentSectionId = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('resize', scrollSpy);


    // --- 5. Mobile Navigation Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const toggleIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Toggle hamburger and close icon
        if (navMenu.classList.contains('active')) {
            toggleIcon.className = 'fa-solid fa-xmark';
        } else {
            toggleIcon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close mobile menu when clicking nav link
    const menuLinks = document.querySelectorAll('.nav-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleIcon.className = 'fa-solid fa-bars-staggered';
        });
    });


    // --- 6. Google Drive Video Modal Player ---
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const videoModal = document.getElementById('videoModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.getElementById('modalClose');
    const modalIframe = document.getElementById('modalIframe');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const spinner = document.querySelector('.modal-spinner');

    const openVideoModal = (card) => {
        const driveId = card.getAttribute('data-drive-id');
        const title = card.getAttribute('data-video-title');
        const category = card.getAttribute('data-video-type');
        
        if (!driveId) return;

        // Show spinner
        spinner.style.display = 'block';

        // Google Drive Embed URL format
        const embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
        
        modalIframe.src = embedUrl;
        modalTitle.textContent = title || 'Visual Showcase';
        modalCategory.textContent = category || 'Video Project';
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        videoModal.classList.add('active');
        
        // Hide spinner once iframe loads
        modalIframe.onload = () => {
            spinner.style.display = 'none';
        };
    };

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        // Resume scrolling
        document.body.style.overflow = '';
        
        // Reset src to stop playback
        setTimeout(() => {
            modalIframe.src = '';
        }, 300);
    };

    // Attach Click Events to Portfolio Cards
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => openVideoModal(card));
    });

    // Close modal on click of close button, overlay, or Escape key
    modalClose.addEventListener('click', closeVideoModal);
    modalOverlay.addEventListener('click', closeVideoModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoModal.classList.contains('active')) {
                closeVideoModal();
            }
            if (bookingModal.classList.contains('active')) {
                closeBookingModal();
            }
        }
    });

    // --- 7. Booking / Inquiry Modal ---
    const bookingModal = document.getElementById('bookingModal');
    const bookingClose = document.getElementById('bookingClose');
    const bookingOverlay = bookingModal.querySelector('.modal-overlay');
    const inquiryForm = document.getElementById('inquiryForm');
    const serviceSelect = document.getElementById('serviceType');
    
    const openBookingModal = (serviceName) => {
        if (serviceSelect) {
            if (serviceName.includes("Short")) {
                serviceSelect.value = "Short Form Videos";
            } else if (serviceName.includes("Long")) {
                serviceSelect.value = "Long Form Videos";
            }
        }
        document.body.style.overflow = 'hidden';
        bookingModal.classList.add('active');
    };

    const closeBookingModal = () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
        inquiryForm.reset();
    };

    // Attach to pricing buttons
    const pricingBtns = document.querySelectorAll('.pricing-card .btn');
    pricingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.pricing-card');
            const tierName = card.querySelector('.pricing-tier-name').textContent;
            openBookingModal(tierName);
        });
    });

    bookingClose.addEventListener('click', closeBookingModal);
    bookingOverlay.addEventListener('click', closeBookingModal);

    // Form Submission Routing (WhatsApp vs Email)
    const btnSubmitWhatsapp = document.getElementById('btnSubmitWhatsapp');
    const btnSubmitEmail = document.getElementById('btnSubmitEmail');

    const handleFormSubmit = (method) => {
        const name = document.getElementById('clientName').value.trim();
        const service = serviceSelect.value;
        const details = document.getElementById('projectDetails').value.trim();

        if (!name) {
            alert("Please enter your name.");
            document.getElementById('clientName').focus();
            return;
        }
        if (!details) {
            alert("Please enter your project details.");
            document.getElementById('projectDetails').focus();
            return;
        }

        if (method === 'whatsapp') {
            const whatsappText = `Hi Areef, I'm interested in booking your services:\n\n*Client Name:* ${name}\n*Service Selected:* ${service}\n*Project Details:* ${details}`;
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://wa.me/918309355948?text=${encodedText}`;
            window.location.href = whatsappUrl;
        } else if (method === 'email') {
            const emailSubject = `Project Inquiry: ${service}`;
            const emailBody = `Hi Areef,\n\nI'm interested in booking your services for ${service}.\n\nClient Name: ${name}\n\nProject Details:\n${details}`;
            const mailtoUrl = `mailto:shaikareef2005@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Programmatic hidden anchor trigger (guarantees launching email app without hijacking current page navigation)
            const mailLink = document.createElement('a');
            mailLink.href = mailtoUrl;
            document.body.appendChild(mailLink);
            mailLink.click();
            document.body.removeChild(mailLink);
        }

        closeBookingModal();
    };

    if (btnSubmitWhatsapp) {
        btnSubmitWhatsapp.addEventListener('click', () => handleFormSubmit('whatsapp'));
    }
    if (btnSubmitEmail) {
        btnSubmitEmail.addEventListener('click', () => handleFormSubmit('email'));
    }

    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });

});
