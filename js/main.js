document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicialização do Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva exponencial customizada
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

    // Sincronização e reset inicial
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    lenis.scrollTo(0, { immediate: true });

    // 2. Gerenciamento do Scroll (Barra de Progresso e Animações)
    const progressBar = document.getElementById('progressBar');
    const reveals = document.querySelectorAll('.reveal');

    lenis.on('scroll', (e) => {
        const winScroll = e.scroll;
        const height = e.limit;
        const scrolled = (winScroll / height) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        // Reseta animações ao voltar para o topo absoluto
        if (winScroll <= 15) {
            reveals.forEach(element => {
                element.classList.remove('active');
            });
        }
    });

    // 3. Triggers de Scroll Suave (Cliques da Interface)
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

    // 4. Intersection Observer para Reveal dos Elementos
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

    // 5. Efeito Parallax Sutil no Glow com o Mouse
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector('.ambient-glow');
        if (glow) {
            const x = (e.clientX / window.innerWidth) * 30;
            const y = (e.clientY / window.innerHeight) * 30;
            glow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
});