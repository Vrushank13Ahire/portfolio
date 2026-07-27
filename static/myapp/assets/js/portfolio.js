// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            //e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate skill bars when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 100);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Contact form submission
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const csrfToken = document.querySelector(
            'input[name="csrfmiddlewaretoken"]'
        ).value;

        fetch("/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value,
            }),
        })
        .then((response) => {
            if (response.ok) {
                formMessage.textContent = "Message sent successfully!";
                formMessage.classList.add("success");
                contactForm.reset();
            } else {
                formMessage.textContent = "Failed to send message";
            }
        })
        .catch((error) => {
            console.error(error);
            formMessage.textContent = "Server error!";
        });
    });


    const resumeBtn = document.getElementById('downloadResumeBtn');
    const resumeModal = document.getElementById('resumeModal');
    const closeResume = document.getElementById('closeResume');
    const resumeForm = document.getElementById('resumeForm');
    const resumeEmail = document.getElementById('resumeEmail');

    // Open modal instead of direct download
    resumeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        resumeModal.style.display = 'flex';
    });

    // Close modal (X button)
    closeResume.addEventListener('click', function () {
        resumeModal.style.display = 'none';
    });

    // Close modal when clicking outside
    resumeModal.addEventListener('click', function (e) {
        if (e.target === resumeModal) {
            resumeModal.style.display = 'none';
        }
    });

    // Submit resume email & download
    resumeForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = resumeEmail.value.trim();
        if (!email) {
            alert("Please enter a valid email");
            return;
        }

        const csrfToken = document.querySelector(
            'input[name="csrfmiddlewaretoken"]'
        ).value;

        function isValidEmail(email) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(email);
        }

        if (!isValidEmail(email)) {
        alert("Please enter a valid email address");
        return;
    }


        const saveUrl = resumeForm.dataset.saveUrl;

        fetch(saveUrl, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                resumeModal.style.display = 'none';
                window.location.href = resumeBtn.href;
            } else {
                alert("Failed to save email. Try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Server error. Please try again.");
        });
    });



    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Add animation on scroll for project cards
    const projectObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                projectObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.project-card').forEach(card => {
        projectObserver.observe(card);
    });

    // Add fade-in animation for sections
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-header').forEach(header => {
        sectionObserver.observe(header);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / 500);
        }
    });

    // Add hover effect to social icons
    document.querySelectorAll('.social-icon, .footer-social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add active state to navigation based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.style.color = '#667eea';
                } else {
                    navLink.style.color = '';
                }
            }
        });
    });

    // Education modal functionality
    const openEducation = document.getElementById('openEducation');
    const educationModal = document.getElementById('educationModal');
    const closeEducation = document.getElementById('closeEducation');

    openEducation.addEventListener('click', () => {
        educationModal.style.display = 'flex';
    });

    closeEducation.addEventListener('click', () => {
        educationModal.style.display = 'none';
    });

    // Close modal when clicking outside
    educationModal.addEventListener('click', (e) => {
        if (e.target === educationModal) {
            educationModal.style.display = 'none';  
        }
    });


    


    console.log('Portfolio website initialized successfully!');
});
