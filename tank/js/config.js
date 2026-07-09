const THANK_YOU_CONFIG = {
    // MODO DEBUG DO CURSOR (true = caixas vermelhas visíveis / false = caixas invisíveis)
    CURSOR_DEBUG: false,

    // CALIBRAÇÃO DAS ÁREAS DE DETECÇÃO (Tolerâncias personalizadas para colisão)
    CURSOR_TOLERANCE: {
        ".status-tag": { top: 0, right: 0, bottom: 0, left: 0 },
        ".title":      { top: 5, right: 5, bottom: 5, left: 5 },
        ".subtitle":   { top: 5, right: 5, bottom: 5, left: 5 },
        ".redirect-button": { top: 0, right: 0, bottom: 0, left: 0 }
    },

    STATUS_TAG: "Transmission Complete",
    TITLE: "OBRIGADO PELO CONTATO",
    SUBTITLE: "Sua demanda técnica foi recebida com sucesso. Alguem do nosso time irá entrar em contato para oferecer a melhor integração para o seu ecossistema corporativo.",
    BTN_TEXT: "Voltar ao início",
    TARGET_URL: "https://www.zntlabs.com.br/",
    REDIRECT_TIMEOUT: 4000 // Tempo em milissegundos (5 segundos)
};
