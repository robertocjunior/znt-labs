document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Injeção Automática de Strings baseada no config.js local
    function renderTexts() {
        const textElements = document.querySelectorAll('[data-text]');
        textElements.forEach(element => {
            const key = element.getAttribute('data-text');
            if (THANK_YOU_CONFIG && THANK_YOU_CONFIG[key] !== undefined) {
                element.textContent = THANK_YOU_CONFIG[key];
            }
        });
    }
    renderTexts();

    // 2. Redirecionamento automático gerenciado pelo tempo da configuração
    const timeout = setTimeout(() => {
        window.location.href = THANK_YOU_CONFIG.TARGET_URL;
    }, THANK_YOU_CONFIG.REDIRECT_TIMEOUT);

    // 3. Clique manual no botão para interromper o timer e retornar imediatamente
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", (e) => {
            e.preventDefault();
            clearTimeout(timeout);
            window.location.href = THANK_YOU_CONFIG.TARGET_URL;
        });
    }

    // 4. Efeito Parallax sutil no Glow de Fundo acompanhando o movimento do mouse
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector('.ambient-glow');
        if (glow) {
            const x = (e.clientX / window.innerWidth) * 20;
            const y = (e.clientY / window.innerHeight) * 20;
            glow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // 5. Lógica de Renderização e Detecção de Hover do Cursor Customizado Zenith
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    let mouseX = 0, mouseY = 0, ballX = 0, ballY = 0;
    const speed = 0.15;
    let initialized = false;

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

        if (backBtn) {
            const rect = backBtn.getBoundingClientRect();
            const closestX = Math.max(rect.left, Math.min(ballX, rect.right));
            const closestY = Math.max(rect.top, Math.min(ballY, rect.bottom));
            const distanceSquared = Math.pow(ballX - closestX, 2) + Math.pow(ballY - closestY, 2);

            if (distanceSquared < Math.pow(32.5, 2)) {
                document.body.classList.add('cursor-hover');
            } else {
                document.body.classList.remove('cursor-hover');
            }
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
});