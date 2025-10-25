// =================================================================
// GSAP Animations & Smooth Scroll
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // =================================================================
    // Lenis Smooth Scroll Initialization
    // =================================================================
    
    const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Интеграция Lenis с GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // =================================================================
    // Smooth Scroll для якорных ссылок
    // =================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Обработка несуществующих якорей
            if (href === '#' || href === '#audit' || href === '#preise') {
                lenis.scrollTo(window.pageYOffset + 800, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // =================================================================
    // Header Scroll Effect
    // =================================================================
    
    const header = document.querySelector('.header');
    
    ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        onEnter: () => {
            gsap.to(header, {
                duration: 0.3,
                onStart: () => header.classList.add('scrolled'),
                ease: "power2.out"
            });
        },
        onLeaveBack: () => {
            gsap.to(header, {
                duration: 0.3,
                onStart: () => header.classList.remove('scrolled'),
                ease: "power2.out"
            });
        }
    });

    // =================================================================
    // Hero Section Animations (On Page Load)
    // =================================================================
    
    // Hero Subtitle
    gsap.from('.hero-subtitle', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.2
    });

    // Hero Title
    gsap.from('.hero-title', {
        duration: 1,
        y: 40,
        opacity: 0,
        ease: "power3.out",
        delay: 0.4
    });

    // Hero Blocks (stagger animation)
    gsap.from('.hero-block', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.6
    });

    // Hero Button
    gsap.from('.hero-button', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 1
    });

    // Floating Icons
    gsap.from('.floating-icons > div', {
        duration: 1.2,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.8
    });

    // Illustration
    gsap.from('.illustration', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3
    });

    // =================================================================
    // Investors Section Animations (On Scroll)
    // =================================================================
    
    // Investors Title
    gsap.from('.investors-title', {
        scrollTrigger: {
            trigger: '.investors-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 40,
        opacity: 0,
        ease: "power3.out"
    });

    // Investor Cards (stagger animation)
    gsap.from('.investor-card', {
        scrollTrigger: {
            trigger: '.investors-blocks',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out"
    });

    // Investors Bottom Text
    gsap.from('.investors-bottom-text', {
        scrollTrigger: {
            trigger: '.investors-bottom-text',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    });

    // =================================================================
    // Interactive Elements (Click Animations)
    // =================================================================
    
    // Sidebar Items
    const sidebarItems = document.querySelectorAll('.sidebar-item-1, .sidebar-item-2');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            gsap.to(this, {
                duration: 0.2,
                x: 5,
                scaleX: 1.3,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(this, {
                        duration: 0.5,
                        x: 0,
                        scaleX: 1,
                        ease: "back.out(1.7)"
                    });
                }
            });
        });
    });

    // Browser Dots
    const dots = document.querySelectorAll('.browser-dot');
    dots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            gsap.to(this, {
                duration: 0.15,
                scale: 1.6,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(this, {
                        duration: 0.4,
                        scale: 1,
                        ease: "back.out(1.7)"
                    });
                }
            });
        });
    });

    // Placeholder Bars
    const placeholderBars = document.querySelectorAll('.placeholder-bar');
    placeholderBars.forEach(bar => {
        bar.addEventListener('click', function() {
            gsap.to(this, {
                duration: 0.15,
                scaleX: 1.6,
                scaleY: 1.2,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(this, {
                        duration: 0.5,
                        scaleX: 1,
                        scaleY: 1,
                        ease: "back.out(1.7)"
                    });
                }
            });
        });
    });

    // =================================================================
    // Hover Animations
    // =================================================================
    
    // Investor Cards Hover
    const investorCards = document.querySelectorAll('.investor-card');
    investorCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -5,
                boxShadow: '0px 15px 25px rgba(30, 37, 48, 0.12)',
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: '0px 0px 0px rgba(30, 37, 48, 0)',
                ease: "power2.out"
            });
        });
    });

    // =================================================================
    // Infinite Scrolling Tags Animation
    // =================================================================
    
    function initInfiniteScrollTags() {
        const tagsRows = document.querySelectorAll('.shortcut-tags-row');
        
        tagsRows.forEach((row, index) => {
            // Получаем оригинальные теги
            const originalTags = Array.from(row.querySelectorAll('.shortcut-tag'));
            
            // Дублируем теги достаточно раз для бесшовной прокрутки
            const duplicateCount = 5;
            for (let i = 0; i < duplicateCount; i++) {
                originalTags.forEach(tag => {
                    const clone = tag.cloneNode(true);
                    row.appendChild(clone);
                });
            }
            
            // Определяем направление и скорость
            const direction = (index === 1) ? -1 : 1; // средняя строка влево
            const speed = 0.1;
            
            let position = 0;
            let animationId = null;
            
            // Ждем рендера и вычисляем ширину
            setTimeout(() => {
                // Вычисляем ширину одного набора тегов
                let setWidth = 0;
                for (let i = 0; i < originalTags.length; i++) {
                    setWidth += originalTags[i].offsetWidth + 15; // ширина + gap
                }
                
                // Начальная позиция для движения вправо
                if (direction === 1) {
                    position = -setWidth;
                }
                
                // Функция анимации
                function animate() {
                    position += speed * direction;
                    
                    // Бесшовный цикл
                    if (direction === 1) {
                        // Движение вправо
                        if (position >= 0) {
                            position = -setWidth;
                        }
                    } else {
                        // Движение влево
                        if (position <= -setWidth) {
                            position = 0;
                        }
                    }
                    
                    row.style.transform = `translate3d(${position}px, 0, 0)`;
                    animationId = requestAnimationFrame(animate);
                }
                
                animate();
            }, 50);
        });
    }
    
    // Запускаем анимацию тегов
    initInfiniteScrollTags();
});

(function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal; let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", "30-min-call", { origin: "https://app.cal.com" });

  Cal.ns["30-min-call"]("inline", {
    elementOrSelector: "#my-cal-inline-30-min-call",
    config: {
      layout: "month_view",
      theme: "light",
      hideBranding: true
    },
    calLink: "menso/30-min-call",
  });

  Cal.ns["30-min-call"]("ui", {
    theme: "light",
    hideEventTypeDetails: false,
    layout: "month_view",
    hideBranding: true,
    // здесь мы передаём css-переменные, которые Cal читает внутри Shadow DOM
    styles: {
      branding: { brandColor: "#0167FF", brandTextColor: "#FFFFFF" },
      cssVars: {
        "--cal-border-radius": "5px",
        "--cal-text-color": "#1E2530",
        "--cal-border-color": "rgba(30,37,48,0.05)",
        "--cal-background-color": "#FAFAFA",
        "--cal-control-border-radius": "5px",
        "--cal-spacing-2": "25px",      // добавим воздух
        "--cal-font-family": "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        "--cal-shadow-md": "0 15px 15px rgba(30,37,48,.05)"
      }
    }
  });