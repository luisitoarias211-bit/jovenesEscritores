const phrases = [
    "Era medianoche cuando\nentendió que el silencio\ntambién tiene acento...",
    "Escribió su nombre en\nla arena y esperó a que\nel mar lo leyera primero.",
    "No buscaba la metáfora\nperfecta. Buscaba la\nverdad detrás de ella.",
    "La ciudad le hablaba\nen un idioma que solo\ella sabía descifrar.",
];

let phraseIndex = 0, charIndex = 0, isDeleting = false;
const el = document.getElementById('typewriter-text');

function type() {
    const phrase = phrases[phraseIndex];
    if (!isDeleting) {
        el.textContent = phrase.slice(0, ++charIndex);
        if (charIndex === phrase.length) {
            isDeleting = true;
            setTimeout(type, 2200);
        return;
    }
    } else {
        el.textContent = phrase.slice(0, --charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }
    setTimeout(type, isDeleting ? 28 : 65);
}
setTimeout(type, 600);

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#&?!'.split('');
const container = document.getElementById('floatingLetters');
for (let i = 0; i < 22; i++) {
    const span = document.createElement('span');
    span.className = 'fl';
    span.textContent = letters[Math.floor(Math.random() * letters.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (1.5 + Math.random() * 5) + 'rem';
    span.style.animationDelay = (Math.random() * 18) + 's';
    span.style.animationDuration = (12 + Math.random() * 12) + 's';
    container.appendChild(span);
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

document.querySelectorAll('.genero-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.genero-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.guia-card').forEach(card => {
            if (filter === 'todos' || card.dataset.cat === filter) {
                card.classList.add('visible-card');
            } else {
                card.classList.remove('visible-card');
            }
        });
    });
});

const GENERO_COLORS = {
    'Poesía':           { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    'Cuento corto':     { bg: 'rgba(245,197,24,0.12)', color: '#fbbf24' },
    'Microrrelato':     { bg: 'rgba(251,146,60,0.12)', color: '#fb923c' },
    'Novela (fragmento)':{ bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    'Crónica':          { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
    'Ensayo':           { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
    'Ciencia ficción':  { bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
    'Terror':           { bg: 'rgba(75,85,99,0.25)',   color: '#9ca3af' },
    'Romance':          { bg: 'rgba(236,72,153,0.12)', color: '#f472b6' },
    'Fantasía':         { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
    'Slam poetry':      { bg: 'rgba(245,197,24,0.1)',  color: '#fde68a' },
    'Haiku':            { bg: 'rgba(251,191,36,0.1)',  color: '#fcd34d' },
    'Autobiografía':    { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
};

const GENERO_EMOJIS = {
    'Poesía':'🌙','Cuento corto':'📖','Microrrelato':'⚡','Novela (fragmento)':'📚',
    'Crónica':'🗞️','Ensayo':'✍️','Ciencia ficción':'🚀','Terror':'🕯️',
    'Romance':'💌','Fantasía':'🧙','Slam poetry':'🎤','Haiku':'🌸','Autobiografía':'🪞'
};

let obras = [];

async function cargarObras() {
    try {
        const res = await window.storage.get('letras-obras', true);
        obras = res ? JSON.parse(res.value) : [];
    } catch(e) { obras = []; }
    renderObras();
}

async function guardarObras() {
    try { await window.storage.set('letras-obras', JSON.stringify(obras), true); } catch(e) {}
}

function renderObras() {
    const lista = document.getElementById('publicadasLista');
    document.getElementById('pubCount').textContent = obras.length;

    if (obras.length === 0) {
        lista.innerHTML = `<div class="empty-state"><span>📄</span>Aún no hay obras publicadas. ¡Sé el primero en compartir tu escritura!</div>`;
    return;
    }

    lista.innerHTML = [...obras].reverse().map(o => {
        const c = GENERO_COLORS[o.genero] || { bg: 'rgba(108,63,196,0.15)', color: '#8B5CF6' };
        const emoji = GENERO_EMOJIS[o.genero] || '📝';
        const inicial = o.autor.trim()[0].toUpperCase();
        const fragmento = o.texto.length > 180 ? o.texto.slice(0, 180) + '…' : o.texto;
        return `
        <div class="pub-card">
            <div class="pub-card-header">
                <h4>${o.titulo}</h4>
                <span class="pub-badge" style="background:${c.bg}; color:${c.color};">${emoji} ${o.genero}</span>
            </div>
            <p class="pub-fragmento">"${fragmento}"</p>
            <div class="pub-autor-row">
                <div class="pub-avatar">${inicial}</div>
                <span class="pub-autor-nombre">${o.autor}${o.ciudad ? ' · ' + o.ciudad : ''}</span>
                <span class="pub-fecha">${o.fecha}</span>
            </div>
        </div>`;
    }).join('');
}

async function publicarObra() {
    const titulo  = document.getElementById('obraTitulo').value.trim();
    const autor   = document.getElementById('obraAutor').value.trim();
    const ciudad  = document.getElementById('obraCiudad').value.trim();
    const genero  = document.getElementById('obraGenero').value;
    const texto   = document.getElementById('obraTexto').value.trim();

    const campos = [
        { id: 'obraTitulo', val: titulo },
        { id: 'obraAutor',  val: autor  },
        { id: 'obraGenero', val: genero },
        { id: 'obraTexto',  val: texto  },
    ];
    let ok = true;
    campos.forEach(c => {
        const el = document.getElementById(c.id);
        if (!c.val) { el.style.borderColor = '#ef4444'; ok = false; }
        else el.style.borderColor = '';
    });
    if (!ok) return;

    const nueva = {
        id: Date.now(),
        titulo, autor, ciudad, genero, texto,
        fecha: new Date().toLocaleDateString('es-CO', { day:'numeric', month:'short', year:'numeric' })
    };

    obras.push(nueva);
    await guardarObras();
    renderObras();

    ['obraTitulo','obraAutor','obraCiudad','obraTexto'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('obraGenero').value = '';

    const msg = document.getElementById('pub-success');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3500);

    document.getElementById('publicadasLista').scrollTop = 0;
}

cargarObras();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fl').forEach(el => el.remove());
}