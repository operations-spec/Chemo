/* Chemo Graphic International — interactions */
(function () {
    'use strict';

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
