// AOS Init
AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
});

// Sticky Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
    });
});

// Footer Year
document.getElementById('footerYear').textContent = new Date().getFullYear();

// Stat Counters
const statNums = document.querySelectorAll('.stat-num');
const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

// Particle Canvas
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.5,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.2,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(192, 132, 252, ${p.alpha})`;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });
        animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    resize();
    createParticles();
    draw();
}


// =============================================
// Contact Form - Web3Forms Integration
// =============================================
const contactForm = document.getElementById('portfolioContact');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Button loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Success state
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                contactForm.reset();

                // Show success message
                showFormMessage('Message sent! I will get back to you soon.', 'success');

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            // Error state
            submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed - Try Again';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            showFormMessage('Oops! Something went wrong. Please try again.', 'error');

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 4000);
        }
    });
}

function showFormMessage(message, type) {
    // Remove any existing message
    const existing = document.getElementById('formMessage');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.id = 'formMessage';
    msg.textContent = message;
    msg.style.cssText = `
        padding: 12px 18px;
        border-radius: 8px;
        margin-top: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        background: ${type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
        color: ${type === 'success' ? '#10b981' : '#ef4444'};
        border: 1px solid ${type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
    `;

    submitBtn.insertAdjacentElement('afterend', msg);

    setTimeout(() => msg.remove(), 5000);
}
