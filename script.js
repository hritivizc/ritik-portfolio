// =============================================
// PAGE LOADER - Dismiss on window load
// =============================================
const pageLoader = document.getElementById('pageLoader');
if (pageLoader) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.style.transition = 'opacity 0.6s ease';
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 650);
        }, 600);
    });
}

// =============================================
// AOS Init
// =============================================
AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
});

// =============================================
// Mobile Hamburger Menu
// =============================================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        sidebar.classList.toggle('open');
    });
    // Close sidebar when nav link clicked
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });
}

// =============================================
// Stat Counters
// =============================================
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

// =============================================
// Active Sidebar Nav on Scroll
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
};
window.addEventListener('scroll', onScroll, { passive: true });

// =============================================
// Custom Cursor
// =============================================
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
if (cursor && cursorRing) {
    let cx = 0, cy = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
        cx = e.clientX;
        cy = e.clientY;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
    });
    const animateRing = () => {
        rx += (cx - rx) * 0.12;
        ry += (cy - ry) * 0.12;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
        requestAnimationFrame(animateRing);
    };
    animateRing();
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '54px';
            cursorRing.style.height = '54px';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '36px';
            cursorRing.style.height = '36px';
        });
    });
}

// =============================================
// Contact Form - Web3Forms Integration
// =============================================
const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"], .btn-submit') : null;
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const btn = submitBtn || contactForm.querySelector('button');
        const originalText = btn ? btn.innerHTML : '';
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
        }
        const formData = new FormData(contactForm);
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
                    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                }
                contactForm.reset();
                setTimeout(() => {
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }
                }, 4000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed - Try Again';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            }
        }
    });
}


// ============================================
// SKILL BAR ANIMATION - Intersection Observer
// ============================================
const skillCards = document.querySelectorAll('.skill-card');
if (skillCards.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillCards.forEach(card => skillObserver.observe(card));
}
