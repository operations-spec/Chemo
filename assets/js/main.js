/* Chemo Graphic International — interactions */
(function () {
    'use strict';

    /* Sticky header state */
    var header = document.getElementById('siteHeader');
    var backToTop = document.getElementById('backToTop');
    function onScroll() {
        var y = window.pageYOffset;
        if (header) header.classList.toggle('scrolled', y > 30);
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
        window.addEventListener('scroll', function () {
            var pos = window.pageYOffset + 120;
            var currentId = '';
            sections.forEach(function (sec) {
                if (pos >= sec.offsetTop) currentId = sec.getAttribute('id');
            });
            navLinks.forEach(function (link) {
                var href = link.getAttribute('href') || '';
                link.classList.toggle('active', href === '#' + currentId);
            });
        }, { passive: true });
    }
})();
