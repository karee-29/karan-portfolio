/* ============================================
   KARAN — Cinematic Portfolio Engine
   ============================================ */

(function () {
    'use strict';

    // --- State ---
    const state = {
        mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        scrollVelocity: 0,
        isProjectOpen: false,
        isLoaded: false,
    };

    // --- DOM ---
    const dom = {
        preloader: document.getElementById('preloader'),
        grain: document.getElementById('grain'),
        cursor: document.querySelector('.cursor'),
        cursorDot: document.querySelector('.cursor-dot'),
        cursorCircle: document.querySelector('.cursor-circle'),
        heroTitle: document.getElementById('heroTitle'),
        heroLetters: document.querySelectorAll('.hero-letter'),
        heroSpotlight: document.getElementById('heroSpotlight'),
        heroBg: document.querySelector('.hero-bg'),
        heroSubtitle: document.querySelector('.hero-subtitle'),
        heroLines: document.querySelectorAll('.hero-line'),
        heroScroll: document.querySelector('.hero-scroll-indicator'),
        nav: document.querySelector('.nav'),
        statementWords: document.querySelectorAll('.statement-text .word'),
        galleryGrids: document.querySelectorAll('.gallery-grid'),
        galleryItems: document.querySelectorAll('.gallery-item'),
        projectViewer: document.getElementById('projectViewer'),
        projectImage: document.getElementById('projectImage'),
        projectTitle: document.getElementById('projectTitle'),
        projectCategory: document.getElementById('projectCategory'),
        projectClose: document.getElementById('projectClose'),
    };

    // ========================================
    // 1. PRELOADER
    // ========================================
    function initPreloader() {
        const progress = document.querySelector('.preloader-progress');
        let loaded = 0;
        const images = document.querySelectorAll('img');
        const total = images.length;
        let fakeProgress = 0;

        // Fake progress animation
        const fakeInterval = setInterval(() => {
            fakeProgress = Math.min(fakeProgress + Math.random() * 15, 90);
            progress.style.width = fakeProgress + '%';
        }, 200);

        function checkDone() {
            loaded++;
            if (loaded >= total) {
                clearInterval(fakeInterval);
                progress.style.width = '100%';
                setTimeout(hidePreloader, 400);
            }
        }

        images.forEach(img => {
            if (img.complete) {
                checkDone();
            } else {
                img.addEventListener('load', checkDone);
                img.addEventListener('error', checkDone);
            }
        });

        // Fallback
        setTimeout(() => {
            if (!state.isLoaded) {
                clearInterval(fakeInterval);
                progress.style.width = '100%';
                hidePreloader();
            }
        }, 5000);
    }

    function hidePreloader() {
        if (state.isLoaded) return;
        state.isLoaded = true;

        gsap.to(dom.preloader, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                dom.preloader.style.display = 'none';
                startIntroAnimation();
            }
        });
    }

    // ========================================
    // 2. INTRO ANIMATION SEQUENCE
    // ========================================
    function startIntroAnimation() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Letters reveal one by one
        tl.to(dom.heroLetters, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.12,
        })
        // Background bleeds in (double exposure)
        .to(dom.heroBg, {
            opacity: 0.5,
            scale: 1,
            duration: 2.5,
            ease: 'power2.out',
        }, '-=0.5')
        // Subtitle appears
        .to(dom.heroSubtitle, {
            opacity: 1,
            y: 0,
            duration: 1,
        }, '-=1.5')
        // Lines grow
        .to(dom.heroLines, {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.1,
        }, '-=0.8')
        // Spotlight activates
        .to(dom.heroSpotlight, {
            opacity: 1,
            duration: 1,
        }, '-=0.5')
        // Nav slides in
        .to(dom.nav, {
            opacity: 1,
            y: 0,
            duration: 1,
        }, '-=0.8')
        // Scroll indicator
        .to(dom.heroScroll, {
            opacity: 0.6,
            duration: 1,
        }, '-=0.5');
    }

    // ========================================
    // 3. FILM GRAIN
    // ========================================
    function initGrain() {
        const canvas = dom.grain;
        const ctx = canvas.getContext('2d');
        let frame = 0;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function renderGrain() {
            const w = canvas.width;
            const h = canvas.height;
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const v = Math.random() * 255;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = 255;
            }

            ctx.putImageData(imageData, 0, 0);
            frame++;

            // Render at ~12fps for that analog feel
            setTimeout(() => requestAnimationFrame(renderGrain), 80);
        }

        window.addEventListener('resize', resize);
        resize();
        renderGrain();
    }

    // ========================================
    // 4. CUSTOM CURSOR
    // ========================================
    function initCursor() {
        document.addEventListener('mousemove', (e) => {
            state.mouse.x = e.clientX;
            state.mouse.y = e.clientY;
        });

        // Smooth cursor follow
        function updateCursor() {
            const dx = state.mouse.x - state.cursor.x;
            const dy = state.mouse.y - state.cursor.y;

            state.cursor.x += dx * 0.15;
            state.cursor.y += dy * 0.15;

            dom.cursorDot.style.transform = `translate(${state.mouse.x}px, ${state.mouse.y}px) translate(-50%, -50%)`;
            dom.cursorCircle.style.transform = `translate(${state.cursor.x}px, ${state.cursor.y}px) translate(-50%, -50%)`;
            dom.cursor.querySelector('.cursor-text').style.transform = `translate(${state.cursor.x}px, ${state.cursor.y}px) translate(-50%, -50%)`;

            requestAnimationFrame(updateCursor);
        }

        updateCursor();

        // Hover states
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => dom.cursor.classList.add('cursor--hover'));
            el.addEventListener('mouseleave', () => dom.cursor.classList.remove('cursor--hover'));
        });

        dom.galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                dom.cursor.classList.add('cursor--gallery');
                dom.cursor.classList.remove('cursor--hover');
            });
            item.addEventListener('mouseleave', () => {
                dom.cursor.classList.remove('cursor--gallery');
            });
        });
    }

    // ========================================
    // 5. HERO SPOTLIGHT (Mouse-following light)
    // ========================================
    function initSpotlight() {
        const hero = document.querySelector('.hero');

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            dom.heroSpotlight.style.setProperty('--mouse-x', x + '%');
            dom.heroSpotlight.style.setProperty('--mouse-y', y + '%');

            // Light effect on individual letters
            dom.heroLetters.forEach(letter => {
                const letterRect = letter.getBoundingClientRect();
                const letterCenterX = letterRect.left + letterRect.width / 2;
                const letterCenterY = letterRect.top + letterRect.height / 2;
                const dist = Math.hypot(e.clientX - letterCenterX, e.clientY - letterCenterY);
                const maxDist = 400;
                const intensity = Math.max(0, 1 - dist / maxDist);

                const glow = intensity * 20;
                const brightness = 1 + intensity * 0.3;

                letter.style.textShadow = `
                    0 0 ${glow}px rgba(201, 169, 110, ${intensity * 0.6}),
                    0 0 ${glow * 2}px rgba(201, 169, 110, ${intensity * 0.3}),
                    0 0 ${glow * 4}px rgba(201, 169, 110, ${intensity * 0.1})
                `;
                letter.style.filter = `brightness(${brightness})`;
            });
        });
    }

    // ========================================
    // 6. SMOOTH SCROLL (Lenis)
    // ========================================
    let lenis;

    function initSmoothScroll() {
        lenis = new Lenis({
            duration: 1.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        // Track scroll velocity
        let lastScroll = 0;
        lenis.on('scroll', (e) => {
            state.scrollVelocity = e.velocity;
            ScrollTrigger.update();
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync GSAP ScrollTrigger with Lenis
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // ========================================
    // 7. SCROLL ANIMATIONS
    // ========================================
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // --- Statement word reveal ---
        ScrollTrigger.create({
            trigger: '.statement',
            start: 'top 80%',
            end: 'bottom 20%',
            onUpdate: (self) => {
                const progress = self.progress;
                dom.statementWords.forEach((word, i) => {
                    const wordProgress = (progress * dom.statementWords.length - i);
                    const opacity = Math.min(1, Math.max(0.15, wordProgress));
                    word.style.opacity = opacity;
                });
            }
        });

        // --- Gallery titles (all sections) ---
        document.querySelectorAll('.gallery').forEach(section => {
            const title = section.querySelector('.gallery-title');
            const year = section.querySelector('.gallery-year');
            const header = section.querySelector('.gallery-header');

            if (title) {
                gsap.to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 75%',
                    }
                });
            }
            if (year) {
                gsap.to(year, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 75%',
                    }
                });
            }
        });

        // --- Gallery items parallax ---
        dom.galleryItems.forEach((item) => {
            const speed = parseFloat(item.dataset.speed) || 1;
            const yOffset = (1 - speed) * 150;

            gsap.fromTo(item, {
                y: yOffset,
                opacity: 0,
                scale: 0.95,
            }, {
                y: -yOffset,
                opacity: 1,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    end: 'bottom 10%',
                    scrub: 1.5,
                }
            });
        });

        // --- About section ---
        gsap.to('.about-label', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 65%',
            }
        });

        gsap.to('.about-heading', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 65%',
            }
        });

        gsap.to('.about-description', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-text-col',
                start: 'top 60%',
            }
        });

        gsap.to('.about-signature', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-text-col',
                start: 'top 50%',
            }
        });

        gsap.to('.about-stats', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-stats',
                start: 'top 80%',
            }
        });

        // About image parallax
        gsap.to('.about-image-col', {
            y: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
            }
        });

        // --- Achievements section title ---
        const achTitle = document.querySelector('.achievements .gallery-title');
        const achYear = document.querySelector('.achievements .gallery-year');
        if (achTitle) {
            gsap.to(achTitle, {
                opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                scrollTrigger: { trigger: '.achievements-header', start: 'top 75%' }
            });
        }
        if (achYear) {
            gsap.to(achYear, {
                opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out',
                scrollTrigger: { trigger: '.achievements-header', start: 'top 75%' }
            });
        }

        // --- Achievements section content ---
        gsap.to('.achievement-certificate', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.achievements',
                start: 'top 60%',
            }
        });

        gsap.to('.achievement-details', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.achievements',
                start: 'top 60%',
            }
        });

        // --- Contact section ---
        gsap.to('.contact-heading', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 60%',
            }
        });

        gsap.to('.contact-email', {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 60%',
            }
        });

        gsap.to('.contact-socials', {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.35,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 60%',
            }
        });

        // --- Hide scroll indicator on scroll ---
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top top',
            end: '50% top',
            onLeave: () => {
                gsap.to(dom.heroScroll, { opacity: 0, duration: 0.5 });
            },
            onEnterBack: () => {
                gsap.to(dom.heroScroll, { opacity: 0.6, duration: 0.5 });
            }
        });
    }

    // ========================================
    // 8. SCROLL VELOCITY SKEW
    // ========================================
    function initScrollSkew() {
        function updateSkew() {
            const velocity = state.scrollVelocity;
            const skew = Math.max(-5, Math.min(5, velocity * 0.3));
            const blur = Math.min(3, Math.abs(velocity) * 0.05);

            dom.galleryItems.forEach(item => {
                // Skew disabled to prevent image wiggle on scroll
                item.style.transform = '';
            });

            requestAnimationFrame(updateSkew);
        }

        updateSkew();
    }

    // ========================================
    // 9. GALLERY HOVER (Dim the world)
    // ========================================
    function initGalleryHover() {
        dom.galleryItems.forEach(item => {
            const parentGrid = item.closest('.gallery-grid');
            item.addEventListener('mouseenter', () => {
                parentGrid.classList.add('is-hovering');
            });

            item.addEventListener('mouseleave', () => {
                parentGrid.classList.remove('is-hovering');
            });
        });
    }

    // ========================================
    // 10. PROJECT VIEWER (Fluid Transition)
    // ========================================
    function initProjectViewer() {
        dom.galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                if (state.isProjectOpen) return;
                state.isProjectOpen = true;

                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('.gallery-item-title').textContent;
                const category = item.querySelector('.gallery-item-cat').textContent;

                // Get source image position for animation origin
                const rect = img.getBoundingClientRect();

                dom.projectImage.src = img.src;
                dom.projectTitle.textContent = title;
                dom.projectCategory.textContent = category;

                // Create a clone for the fly-out animation
                const clone = img.cloneNode(true);
                clone.style.cssText = `
                    position: fixed;
                    top: ${rect.top}px;
                    left: ${rect.left}px;
                    width: ${rect.width}px;
                    height: ${rect.height}px;
                    z-index: 1001;
                    object-fit: cover;
                    border-radius: 4px;
                    transition: none;
                    pointer-events: none;
                `;
                document.body.appendChild(clone);

                // Animate clone to fullscreen
                gsap.to(clone, {
                    top: '5vh',
                    left: '5vw',
                    width: '90vw',
                    height: '70vh',
                    borderRadius: '4px',
                    duration: 0.9,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        dom.projectViewer.classList.add('is-active');
                        gsap.to(clone, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => clone.remove()
                        });
                    }
                });

                // Slide away nav
                gsap.to(dom.nav, {
                    y: -80,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in',
                });

                // Disable scroll
                if (lenis) lenis.stop();
            });
        });

        // Close project
        dom.projectClose.addEventListener('click', closeProject);
        dom.projectViewer.addEventListener('click', (e) => {
            if (e.target === dom.projectViewer || e.target.classList.contains('project-viewer-bg')) {
                closeProject();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isProjectOpen) {
                closeProject();
            }
        });
    }

    function closeProject() {
        if (!state.isProjectOpen) return;

        dom.projectViewer.classList.remove('is-active');
        state.isProjectOpen = false;

        // Bring back nav
        gsap.to(dom.nav, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.2,
            ease: 'power2.out',
        });

        // Re-enable scroll
        if (lenis) lenis.start();
    }

    // ========================================
    // 11. MAGNETIC CURSOR on gallery items
    // ========================================
    function initMagneticCursor() {
        dom.galleryItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;

                gsap.to(item.querySelector('.gallery-item-inner'), {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.6,
                    ease: 'power2.out',
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item.querySelector('.gallery-item-inner'), {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)',
                });
            });
        });
    }

    // ========================================
    // 12. HERO PARALLAX ON SCROLL
    // ========================================
    function initHeroParallax() {
        gsap.to('.hero-bg', {
            y: 150,
            scale: 1.15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });

        gsap.to('.hero-content', {
            y: -100,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: '30% top',
                end: 'bottom top',
                scrub: 1,
            }
        });
    }

    // ========================================
    // 13. HAMBURGER MENU (Mobile)
    // ========================================
    function initHamburger() {
        const hamburger = document.getElementById('navHamburger');
        const menu = document.getElementById('navMenu');
        if (!hamburger || !menu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            menu.classList.toggle('is-open');

            if (menu.classList.contains('is-open')) {
                if (lenis) lenis.stop();
            } else {
                if (lenis) lenis.start();
            }
        });

        // Close menu when a link is tapped
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-active');
                menu.classList.remove('is-open');
                if (lenis) lenis.start();
            });
        });
    }

    // ========================================
    // 14. SMOOTH ANCHOR SCROLL
    // ========================================
    function initAnchorScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target && lenis) {
                    // Ensure lenis is running before scrolling
                    lenis.start();
                    // Small delay to let menu close and lenis resume
                    setTimeout(() => {
                        lenis.scrollTo(target, { offset: -50, duration: 2 });
                    }, 100);
                }
            });
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        initGrain();
        initCursor();
        initSpotlight();
        initSmoothScroll();
        initScrollAnimations();
        initScrollSkew();
        initGalleryHover();
        initProjectViewer();
        initMagneticCursor();
        initHeroParallax();
        initAnchorScroll();
        initHamburger();
        initPreloader();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
