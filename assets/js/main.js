/* Chemo Graphic International — interactions */
(function () {
    'use strict';

    var root = document.documentElement;
    var themeToggle = document.getElementById('themeToggle');
    function applyTheme(theme) {
        var nextTheme = theme === 'dark' ? 'dark' : 'light';
        root.setAttribute('data-theme', nextTheme);
        if (themeToggle) {
            var isDark = nextTheme === 'dark';
            themeToggle.setAttribute('aria-checked', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    applyTheme('light');

    /* Sticky header state */
    var header = document.getElementById('siteHeader');
    var backToTop = document.getElementById('backToTop');
    var headerPinned = header && header.getAttribute('data-header-mode') === 'solid';
    function onScroll() {
        var y = window.pageYOffset;
        if (header) header.classList.toggle('scrolled', headerPinned || y > 30);
        if (backToTop) backToTop.classList.toggle('show', y > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile nav */
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
            toggle.classList.toggle('open');
        });
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.classList.remove('open');
            });
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    /* Reveal on scroll */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* Animated stats counters */
    var counters = document.querySelectorAll('.stat-value');
    var counted = false;
    function runCounters() {
        if (counted) return;
        var statsSection = document.querySelector('.section-stats');
        if (!statsSection) return;
        var rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80 && rect.bottom > 0) {
            counted = true;
            counters.forEach(function (el) {
                var target = parseInt(el.getAttribute('data-target'), 10) || 0;
                var start = 0;
                var duration = 1800;
                var startTime = null;
                function step(ts) {
                    if (!startTime) startTime = ts;
                    var progress = Math.min((ts - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(start + (target - start) * eased).toLocaleString();
                    if (progress < 1) requestAnimationFrame(step);
                    else el.textContent = target.toLocaleString();
                }
                requestAnimationFrame(step);
            });
        }
    }
    window.addEventListener('scroll', runCounters, { passive: true });
    runCounters();

    /* Contact form (front-end only) */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            var note = document.getElementById('formNote');
            if (note) note.hidden = false;
            form.reset();
        });
    }

    /* Current year */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* Customer testimonial loop */
    var testimonialTrack = document.getElementById('testimonialTrack');
    var testimonialMarquee = document.querySelector('.testimonial-marquee');
    var customerStrip = document.getElementById('customers');
    var testimonialFocusPanel = document.getElementById('testimonialFocusPanel');
    var testimonialFocusMedia = document.getElementById('testimonialFocusMedia');
    var testimonialFocusCompany = document.getElementById('testimonialFocusCompany');
    var testimonialFocusQuote = document.getElementById('testimonialFocusQuote');
    var testimonialFocusPerson = document.getElementById('testimonialFocusPerson');
    var testimonialFocusDesignation = document.getElementById('testimonialFocusDesignation');
    var testimonialFocusWebsite = document.getElementById('testimonialFocusWebsite');
    var activeTestimonialCard = null;
    var pinnedTestimonialCard = null;
    var hideTestimonialTimer = null;
    var fallbackTestimonials = [
        {
            company: 'Parksons Packaging',
            logo: '',
            photo: '',
            quote: 'High quality materials and a satisfactory helpline. Chemo Graphic International has been a dependable partner for our pressroom requirements.',
            person: 'Mr Jayant Madikar',
            designation: 'Senior Manager at Parksons Packaging Ltd.'
        },
        {
            company: 'TCPL Packaging',
            logo: '',
            photo: '',
            quote: 'Reliable product quality, prompt coordination and consistent support have made Chemo Graphic International a valued supplier for our production teams.',
            person: 'Mayur Patil',
            designation: 'GM - Purchase at TCPL Packaging Limited',
            personUrl: 'https://in.linkedin.com/in/mayur-patil-4396208b'
        },
        {
            company: 'Sample Print Works',
            logo: '',
            photo: '',
            quote: 'Their product guidance and service response help us keep pressroom operations smooth during demanding schedules.',
            person: 'Sample Customer',
            designation: 'Production Head'
        }
    ];

    function initialsFromCompany(name) {
        return String(name || 'CGI')
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(function (word) { return word.charAt(0).toUpperCase(); })
            .join('') || 'CG';
    }

    function renderFocusMedia(item) {
        if (!testimonialFocusMedia) return;
        testimonialFocusMedia.innerHTML = '';

        var preferredImage = item.photo || item.logo;
        if (preferredImage) {
            var img = document.createElement('img');
            img.src = preferredImage;
            img.alt = (item.company || 'Company') + (item.photo ? ' person photo' : ' logo');
            if (!item.photo) img.className = 'testimonial-focus-logo';
            img.addEventListener('error', function () {
                testimonialFocusMedia.textContent = initialsFromCompany(item.company);
            }, { once: true });
            testimonialFocusMedia.appendChild(img);
        } else {
            testimonialFocusMedia.textContent = initialsFromCompany(item.company);
        }
    }

    function renderFocusPanel(item) {
        if (!testimonialFocusPanel) return;
        testimonialFocusPanel.hidden = false;
        testimonialFocusPanel.setAttribute('aria-hidden', 'false');
        testimonialFocusPanel.classList.add('is-visible');
        renderFocusMedia(item);
        if (testimonialFocusCompany) testimonialFocusCompany.textContent = item.company || 'Customer';
        if (testimonialFocusQuote) testimonialFocusQuote.textContent = item.quote || '';
        if (testimonialFocusPerson) testimonialFocusPerson.textContent = item.person || 'Representative Name';
        if (testimonialFocusDesignation) testimonialFocusDesignation.textContent = item.designation || 'Designation to be added';
        if (testimonialFocusWebsite) testimonialFocusWebsite.textContent = 'Website: ' + (item.website || 'To be added');
    }

    function positionFocusPanel(card) {
        if (!testimonialFocusPanel || !customerStrip || !testimonialMarquee || !card) return;
        var stripRect = customerStrip.getBoundingClientRect();
        var cardRect = card.getBoundingClientRect();

        testimonialFocusPanel.style.left = '0px';
        testimonialFocusPanel.style.top = '0px';

        var panelWidth = testimonialFocusPanel.offsetWidth;
        var panelHeight = testimonialFocusPanel.offsetHeight;
        var preferredLeft = cardRect.left - stripRect.left + (cardRect.width / 2) - (panelWidth / 2);
        var maxLeft = Math.max(0, stripRect.width - panelWidth);
        var left = Math.max(0, Math.min(preferredLeft, maxLeft));

        var top = cardRect.top - stripRect.top - panelHeight - 12;

        testimonialFocusPanel.style.left = left + 'px';
        testimonialFocusPanel.style.top = top + 'px';
    }

    function clearPinnedCards(exceptCard) {
        if (!testimonialTrack) return;
        testimonialTrack.querySelectorAll('.testimonial-card.is-open').forEach(function (openCard) {
            if (!exceptCard || openCard !== exceptCard) {
                openCard.classList.remove('is-open');
                openCard.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function showTestimonial(card, item, pinned) {
        if (!card) return;
        if (hideTestimonialTimer) {
            clearTimeout(hideTestimonialTimer);
            hideTestimonialTimer = null;
        }
        activeTestimonialCard = card;
        if (pinned) pinnedTestimonialCard = card;
        if (!pinned && pinnedTestimonialCard && pinnedTestimonialCard !== card) return;
        if (pinned && customerStrip) customerStrip.classList.add('is-paused');
        clearPinnedCards(card);
        card.classList.add('is-open');
        card.setAttribute('aria-expanded', 'true');
        renderFocusPanel(item);
        positionFocusPanel(card);
    }

    function hideTestimonial(forceClose) {
        if (hideTestimonialTimer) {
            clearTimeout(hideTestimonialTimer);
            hideTestimonialTimer = null;
        }
        if (pinnedTestimonialCard && !forceClose) return;
        if (pinnedTestimonialCard && forceClose) pinnedTestimonialCard = null;
        if (activeTestimonialCard) {
            activeTestimonialCard.classList.remove('is-open');
            activeTestimonialCard.setAttribute('aria-expanded', 'false');
        }
        activeTestimonialCard = null;
        clearPinnedCards();
        if (customerStrip) customerStrip.classList.remove('is-paused');
        if (testimonialFocusPanel) {
            testimonialFocusPanel.classList.remove('is-visible');
            testimonialFocusPanel.setAttribute('aria-hidden', 'true');
            testimonialFocusPanel.hidden = true;
        }
    }

    function createTestimonialCard(item) {
        var card = document.createElement('article');
        card.className = 'testimonial-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Read testimonial from ' + (item.company || 'customer'));
        card.setAttribute('aria-expanded', 'false');

        var logo = document.createElement('div');
        logo.className = 'testimonial-logo';
        if (item.logo) {
            var img = document.createElement('img');
            img.src = item.logo;
            img.alt = (item.company || 'Company') + ' logo';
            img.addEventListener('error', function () {
                logo.textContent = initialsFromCompany(item.company);
            }, { once: true });
            logo.appendChild(img);
        } else {
            logo.textContent = initialsFromCompany(item.company);
        }

        var preview = document.createElement('div');
        preview.className = 'testimonial-preview';
        var company = document.createElement('strong');
        company.className = 'testimonial-company';
        company.textContent = item.company || 'Customer';
        var snippet = document.createElement('p');
        snippet.className = 'testimonial-snippet';
        snippet.textContent = item.quote || '';
        preview.appendChild(company);
        preview.appendChild(snippet);
        card.appendChild(logo);
        card.appendChild(preview);

        card.addEventListener('mouseenter', function () {
            showTestimonial(card, item, false);
        });
        card.addEventListener('mouseleave', function () {
            if (pinnedTestimonialCard === card) return;
            hideTestimonialTimer = setTimeout(function () {
                hideTestimonial(false);
            }, 120);
        });
        card.addEventListener('focus', function () {
            showTestimonial(card, item, false);
        });
        card.addEventListener('click', function (event) {
            event.stopPropagation();
            if (pinnedTestimonialCard === card) {
                pinnedTestimonialCard = null;
                hideTestimonial(true);
                return;
            }
            showTestimonial(card, item, true);
        });
        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showTestimonial(card, item, true);
            } else if (event.key === 'Escape') {
                hideTestimonial(true);
            }
        });

        return card;
    }

    function renderTestimonials(items) {
        if (!testimonialTrack) return;
        var validItems = (items || []).filter(function (item) {
            return item && (item.company || item.quote || item.person);
        });
        if (!validItems.length) validItems = fallbackTestimonials;
        testimonialTrack.innerHTML = '';
        validItems.concat(validItems).forEach(function (item) {
            testimonialTrack.appendChild(createTestimonialCard(item));
        });
    }

    if (testimonialFocusPanel) {
        testimonialFocusPanel.addEventListener('mouseenter', function () {
            if (hideTestimonialTimer) {
                clearTimeout(hideTestimonialTimer);
                hideTestimonialTimer = null;
            }
        });
        testimonialFocusPanel.addEventListener('mouseleave', function () {
            if (!pinnedTestimonialCard) hideTestimonial(false);
        });
    }
    document.addEventListener('click', function (event) {
        if (!pinnedTestimonialCard) return;
        if (customerStrip && customerStrip.contains(event.target)) {
            var clickedCard = event.target.closest('.testimonial-card');
            if (clickedCard) return;
        }
        hideTestimonial(true);
    });
    window.addEventListener('resize', function () {
        if (activeTestimonialCard && testimonialFocusPanel && !testimonialFocusPanel.hidden) {
            positionFocusPanel(activeTestimonialCard);
        }
    });

    if (testimonialTrack && window.fetch) {
        fetch('/company-testimonials/testimonials.json')
            .then(function (res) {
                if (!res.ok) throw new Error('Testimonials not found');
                return res.json();
            })
            .then(renderTestimonials)
            .catch(function () { renderTestimonials(fallbackTestimonials); });
    } else {
        renderTestimonials(fallbackTestimonials);
    }

    /* Active nav link on scroll (home page) */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (sections.length && navLinks.length) {
        function updateActiveNav() {
            var headerOffset = header ? header.offsetHeight + 24 : 120;
            var pos = window.pageYOffset + headerOffset;
            var currentId = '';
            var docBottom = window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 8;

            sections.forEach(function (sec) {
                var top = sec.offsetTop - headerOffset;
                var bottom = top + sec.offsetHeight;
                if (pos >= top && pos < bottom) currentId = sec.getAttribute('id');
            });

            if (!currentId && docBottom) {
                currentId = sections[sections.length - 1].getAttribute('id');
            }

            navLinks.forEach(function (link) {
                var href = link.getAttribute('href') || '';
                link.classList.toggle('active', href === '#' + currentId);
            });
        }
        window.addEventListener('scroll', updateActiveNav, { passive: true });
        window.addEventListener('resize', updateActiveNav);
        updateActiveNav();
    }
})();
