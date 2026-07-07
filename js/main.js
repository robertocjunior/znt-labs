document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Injeção Automática de Strings da Configuração
    function renderTexts() {
        const textElements = document.querySelectorAll('[data-text]');
        
        textElements.forEach(element => {
            const path = element.getAttribute('data-text');
            // Resolve caminhos aninhados (ex: "SOLUCOES.ITEMS.GO.TITLE")
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

    // 7. Lógica Avançada do Cursor Customizado com Cálculo de Área Total de Borda
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');

    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.15; 

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Elementos que ativam a inversão e expansão
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .cta-button, .logo-container, h1, h2, h3, p, span');

    function animateCursor() {
        // Movimentação fluida baseada na física do rastro (lerp)
        ballX += (mouseX - ballX) * speed;
        ballY += (mouseY - ballY) * speed;
        
        if (cursor) {
            cursor.style.left = `${ballX}px`;
            cursor.style.top = `${ballY}px`;
        }

        // Verifica se a área externa do círculo maior está intersectando qualquer elemento interativo
        let isOverAnyElement = false;
        
        // Define o raio máximo do círculo expandido (65px de largura / 2 = 32.5px de raio)
        const cursorRadius = 32.5; 

        interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();

            // Calcula se o círculo maior encosta ou está sobre o retângulo do elemento
            const closestX = Math.max(rect.left, Math.min(ballX, rect.right));
            const closestY = Math.max(rect.top, Math.min(ballY, rect.bottom));

            const distanceX = ballX - closestX;
            const distanceY = ballY - closestY;

            const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

            // Se a distância for menor que o raio do círculo, há colisão física real da área
            if (distanceSquared < (cursorRadius * cursorRadius)) {
                isOverAnyElement = true;
            }
        });

        // Altera o estado do cursor considerando a área total expandida
        if (isOverAnyElement) {
            document.body.classList.add('cursor-hover');
        } else {
            document.body.classList.remove('cursor-hover');
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
});
