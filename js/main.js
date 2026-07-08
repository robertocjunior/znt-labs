document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Injeção Automática de Strings da Configuração
    function renderTexts() {
        const textElements = document.querySelectorAll('[data-text]');
        
        textElements.forEach(element => {
            const path = element.getAttribute('data-text');
            const text = path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, CONFIG);
            
            if (text !== null) {
                element.textContent = text;
            }
        });
    }
    renderTexts();

    // 2. Inicialização do motor Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    lenis.scrollTo(0, { immediate: true });

    // 3. Controle da Barra de Progresso e Reset do Reveal
    const progressBar = document.getElementById('progressBar');
    const reveals = document.querySelectorAll('.reveal');

    lenis.on('scroll', (e) => {
        const winScroll = e.scroll;
        const height = e.limit;
        const scrolled = (winScroll / height) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        if (winScroll <= 15) {
            reveals.forEach(element => {
                element.classList.remove('active');
            });
        }
    });

    // 4. Triggers de Scroll Suave para as Âncoras
    const navLogo = document.getElementById('navLogo');
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.2 });
        });
    }

    const navLinkSolucoes = document.getElementById('navLinkSolucoes');
    if (navLinkSolucoes) {
        navLinkSolucoes.addEventListener('click', (e) => {
            e.preventDefault();
            lenis.scrollTo('#solucoes', { duration: 1.2 });
        });
    }

    const ctaBtn = document.getElementById('ctaBtn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            lenis.scrollTo('#solucoes', { duration: 1.2 });
        });
    }

    // 5. Intersection Observer para Animações Reveal
    const observerOptions = {
        root: null,
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, observerOptions);

    reveals.forEach(element => {
        revealObserver.observe(element);
    });

    // 6. Efeito Parallax Sutil no Glow com o Mouse
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector('.ambient-glow');
        if (glow) {
            const x = (e.clientX / window.innerWidth) * 30;
            const y = (e.clientY / window.innerHeight) * 30;
            glow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // 7. Lógica Dinâmica do Cursor Customizado com Rótulos de Debug Inline
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');

    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.15;
    let initialized = false;

    let debugContainers = [];

    function updatePosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!initialized) {
            ballX = mouseX;
            ballY = mouseY;
            initialized = true;
            document.body.classList.add('cursor-visible');
        }
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    }

    document.documentElement.addEventListener('mouseenter', updatePosition);
    window.addEventListener('mousemove', updatePosition);

    function animateCursor() {
        if (initialized) {
            ballX += (mouseX - ballX) * speed;
            ballY += (mouseY - ballY) * speed;
            
            if (cursor) {
                cursor.style.left = `${ballX}px`;
                cursor.style.top = `${ballY}px`;
            }
        }

        let isOverHoverElement = false;
        let isOverTextElement = false;
        const cursorRadius = 32.5; 

        // Separando elementos clicáveis comuns de elementos de entrada de texto
        const hoverElements = document.querySelectorAll('a, button, .cta-button, .logo-container, .hero-title, .hero-slogan, .hero-subtitle, .znt-hover-target, .about-text p');
        const textElements = document.querySelectorAll('.znt-input-group input, .znt-input-group textarea');

        if (CONFIG.CURSOR_DEBUG) {
            debugContainers.forEach(div => div.remove());
            debugContainers = [];
        }

        // Função auxiliar para verificar colisão com tolerância
        function checkCollision(el, callbackInRadius) {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            let padding = { top: 0, right: 0, bottom: 0, left: 0 };
            let identifiedSelector = "";
            
            if (CONFIG.CURSOR_TOLERANCE) {
                for (const selector in CONFIG.CURSOR_TOLERANCE) {
                    if (el.matches(selector)) {
                        padding = CONFIG.CURSOR_TOLERANCE[selector];
                        identifiedSelector = selector;
                        break;
                    }
                }
            }

            if (!identifiedSelector) {
                identifiedSelector = el.className ? "." + Array.from(el.classList).join('.') : el.tagName.toLowerCase();
            }

            const dataTextAttr = el.getAttribute('data-text');
            const debugLabelText = dataTextAttr ? `${identifiedSelector} [${dataTextAttr}]` : identifiedSelector;

            const expandedRect = {
                left: rect.left - (padding.left || 0),
                right: rect.right + (padding.right || 0),
                top: rect.top - (padding.top || 0),
                bottom: rect.bottom + (padding.bottom || 0)
            };

            if (CONFIG.CURSOR_DEBUG && initialized) {
                const debugDiv = document.createElement('div');
                debugDiv.style.position = 'fixed';
                debugDiv.style.border = '1px dashed #ff4a4a';
                debugDiv.style.backgroundColor = 'rgba(255, 74, 74, 0.05)';
                debugDiv.style.pointerEvents = 'none';
                debugDiv.style.zIndex = '9998';
                debugDiv.style.left = `${expandedRect.left}px`;
                debugDiv.style.top = `${expandedRect.top}px`;
                debugDiv.style.width = `${expandedRect.right - expandedRect.left}px`;
                debugDiv.style.height = `${expandedRect.bottom - expandedRect.top}px`;

                const label = document.createElement('span');
                label.style.position = 'absolute';
                label.style.top = '-16px';
                label.style.left = '0';
                label.style.backgroundColor = '#ff4a4a';
                label.style.color = '#ffffff';
                label.style.fontFamily = 'monospace';
                label.style.fontSize = '9px';
                label.style.padding = '2px 5px';
                label.style.borderRadius = '3px 3px 0 0';
                label.style.whiteSpace = 'nowrap';
                label.textContent = debugLabelText;
                
                debugDiv.appendChild(label);
                document.body.appendChild(debugDiv);
                debugContainers.push(debugDiv);
            }

            const closestX = Math.max(expandedRect.left, Math.min(ballX, expandedRect.right));
            const closestY = Math.max(expandedRect.top, Math.min(ballY, expandedRect.bottom));

            const distanceX = ballX - closestX;
            const distanceY = ballY - closestY;
            const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

            if (distanceSquared < (cursorRadius * cursorRadius)) {
                callbackInRadius();
            }
        }

        // Valida elementos comuns (expandir cursor)
        hoverElements.forEach(el => {
            checkCollision(el, () => { isOverHoverElement = true; });
        });

        // Valida campos de texto (mudar para formato I-beam)
        textElements.forEach(el => {
            checkCollision(el, () => { isOverTextElement = true; });
        });

        // Gerencia classes de estado no body
        if (isOverHoverElement) {
            document.body.classList.add('cursor-hover');
        } else {
            document.body.classList.remove('cursor-hover');
        }

        if (isOverTextElement) {
            document.body.classList.add('cursor-text-mode');
        } else {
            document.body.classList.remove('cursor-text-mode');
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
});
