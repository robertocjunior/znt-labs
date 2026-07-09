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

    // 5. Lógica de Renderização e Detecção de Hover do Cursor Customizado Zenith com Debug
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    let mouseX = 0, mouseY = 0, ballX = 0, ballY = 0;
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
        const cursorRadius = 32.5; 

        // Elementos interativos alvos do efeito reverse hover (incluindo .subtitle)
        const interactiveElements = document.querySelectorAll('.status-tag, .title, .subtitle, .redirect-button');

        if (THANK_YOU_CONFIG.CURSOR_DEBUG) {
            debugContainers.forEach(div => div.remove());
            debugContainers = [];
        }

        interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            let padding = { top: 0, right: 0, bottom: 0, left: 0 };
            let identifiedSelector = "";
            
            if (THANK_YOU_CONFIG.CURSOR_TOLERANCE) {
                for (const selector in THANK_YOU_CONFIG.CURSOR_TOLERANCE) {
                    if (el.matches(selector)) {
                        padding = THANK_YOU_CONFIG.CURSOR_TOLERANCE[selector];
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

            if (THANK_YOU_CONFIG.CURSOR_DEBUG && initialized) {
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
                isOverHoverElement = true;
            }
        });

        if (isOverHoverElement) {
            document.body.classList.add('cursor-hover');
        } else {
            document.body.classList.remove('cursor-hover');
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
});
