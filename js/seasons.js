'use strict';
(() => {
    const themes = {
        general: { name: 'Sin efectos', symbols: [], color: '#ffffff' },
        navidad: { name: 'Navidad', symbols: ['❄', '❅', '❆'], color: '#ffffff' },
        muertos: { name: 'Día de Muertos', symbols: ['💀', '🌼', '✿'], color: '#f4a122' },
        amor: { name: 'Día del Amor y la Amistad', symbols: ['♥', '♡'], color: '#ec668c' },
        patrias: { name: 'Fiestas patrias', symbols: ['●', '◆'], colors: ['#16854a', '#ffffff', '#ce3443'] },
        primavera: { name: 'Primavera', symbols: ['✿', '🌸'], color: '#e888ac' },
        verano: { name: 'Verano', symbols: ['☀', '✦'], color: '#efbe39' },
        otono: { name: 'Otoño', symbols: ['🍂', '🍁'], color: '#d98a32' },
        invierno: { name: 'Invierno', symbols: ['❄', '❅'], color: '#ffffff' }
    };
    // Commercial celebration windows in Mexico City, regardless of visitor timezone.
    function automaticSeason(date) {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', month: 'numeric', day: 'numeric' }).formatToParts(date);
        const month = Number(parts.find(p => p.type === 'month').value);
        const day = Number(parts.find(p => p.type === 'day').value);
        if (month === 12 || (month === 1 && day <= 6)) return 'navidad';
        if ((month === 10 && day >= 20) || (month === 11 && day <= 2)) return 'muertos';
        if (month === 2 && day <= 14) return 'amor';
        if (month === 9 && day <= 16) return 'patrias';
        return 'general';
    }
    const selector = document.getElementById('season');
    const pause = document.getElementById('season-pause');
    const status = document.getElementById('season-status');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const layer = document.createElement('div');
    layer.className = 'season-effects';
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(layer);
    let paused = false;
    let active = '';
    function render() {
        const key = selector.value === 'auto' ? automaticSeason(new Date()) : selector.value;
        const theme = themes[key] || themes.general;
        active = key;
        layer.replaceChildren();
        document.querySelector('.season-stage').dataset.season = key;
        document.getElementById('season-title').textContent = theme.name;
        document.querySelector('.season-decoration').textContent = theme.symbols[0] || '✦';
        document.body.classList.toggle('season-motion-paused', paused || reducedMotion.matches);
        pause.disabled = !theme.symbols.length || reducedMotion.matches;
        pause.setAttribute('aria-pressed', String(paused));
        pause.textContent = paused ? 'Reanudar efectos' : 'Pausar efectos';
        status.textContent = (selector.value === 'auto' ? 'Temporada automática: ' : 'Temporada seleccionada: ') + theme.name + (reducedMotion.matches ? '. Animaciones desactivadas por tu preferencia de movimiento reducido.' : paused && theme.symbols.length ? '. Efectos pausados.' : '.');
        if (!theme.symbols.length || reducedMotion.matches) return;
        const count = window.innerWidth < 576 ? 14 : 24;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('span');
            particle.className = 'season-particle';
            particle.textContent = theme.symbols[i % theme.symbols.length];
            particle.style.left = `${(i + Math.random()) / count * 100}%`;
            particle.style.color = theme.colors ? theme.colors[i % theme.colors.length] : theme.color;
            particle.style.fontSize = `${16 + Math.random() * 14}px`;
            particle.style.setProperty('--fall-time', `${12 + Math.random() * 12}s`);
            particle.style.setProperty('--fall-delay', `${-Math.random() * 24}s`);
            particle.style.setProperty('--drift', `${Math.random() * 70 - 35}px`);
            layer.append(particle);
        }
    }
    selector.addEventListener('change', render);
    pause.addEventListener('click', () => { paused = !paused; render(); });
    reducedMotion.addEventListener('change', render);
    document.addEventListener('visibilitychange', () => {
        layer.classList.toggle('is-hidden-tab', document.hidden);
        if (!document.hidden && selector.value === 'auto' && active !== automaticSeason(new Date())) render();
    });
    // Refresh automatic selection if the visitor keeps the page open across midnight.
    window.setInterval(() => {
        if (selector.value === 'auto' && active !== automaticSeason(new Date())) render();
    }, 60000);
    render();
})();
