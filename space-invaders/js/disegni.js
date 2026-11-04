// disegni.js — tutto quello che viene disegnato sul canvas

const canvas = document.getElementById('schermo');
const ctx = canvas.getContext('2d');

// gli sprite sono pixel art: li ingrandiamo senza sfocarli
ctx.imageSmoothingEnabled = false;

const foglio = new Image();
foglio.src = 'img/sprites.png';

const SCALA = 3;

// posizione di ogni sprite dentro il foglio png (x, y, larghezza, altezza)
const SPRITE_NAVICELLA = { x: 0, y: 17, w: 15, h: 11 };
const SPRITE_UFO = { x: 96, y: 52, w: 16, h: 8 };
const SPRITE_ESPLOSIONE = { x: 82, y: 84, w: 12, h: 8 };

// un tipo di alieno per ogni riga
const ALIENI = [
    { x: 4, y: 52, w: 8, h: 8 },
    { x: 20, y: 52, w: 8, h: 8 },
    { x: 34, y: 52, w: 11, h: 8 },
    { x: 49, y: 52, w: 13, h: 8 },
    { x: 66, y: 52, w: 12, h: 8 }
];

function disegnaSprite(s, x, y) {
    ctx.drawImage(foglio, s.x, s.y, s.w, s.h, Math.round(x), Math.round(y), s.w * SCALA, s.h * SCALA);
}

function disegnaScudi() {
    ctx.fillStyle = '#33ff33';
    for (let i = 0; i < scudi.length; i++) {
        const b = scudi[i];
        if (b.vita > 0) {
            // più è danneggiato, più è spento
            ctx.globalAlpha = b.vita / 3;
            ctx.fillRect(b.x, b.y, b.larghezza, b.altezza);
        }
    }
    ctx.globalAlpha = 1;
}

function disegnaInvasori() {
    for (let i = 0; i < invasori.length; i++) {
        const inv = invasori[i];
        if (inv.vivo) disegnaSprite(ALIENI[inv.riga], inv.x, inv.y);
    }
}

function disegnaNavicella() {
    // quando è colpita lampeggia
    if (navicella.esplosione > 0 && navicella.esplosione % 10 < 5) return;
    disegnaSprite(SPRITE_NAVICELLA, navicella.x, navicella.y);
}

function disegnaProiettili() {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < proiettili.length; i++) {
        const p = proiettili[i];
        ctx.fillRect(p.x, p.y, p.larghezza, p.altezza);
    }
    for (let i = 0; i < bombe.length; i++) {
        const b = bombe[i];
        ctx.fillRect(b.x, b.y, b.larghezza, b.altezza);
    }
}

function disegnaEsplosioni() {
    for (let i = 0; i < esplosioni.length; i++) {
        disegnaSprite(SPRITE_ESPLOSIONE, esplosioni[i].x, esplosioni[i].y);
    }
}

// come i cabinet originali: una pellicola colorata sopra lo schermo
// "multiply" colora gli sprite bianchi e lascia nero lo sfondo
function disegnaPellicola() {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#ff4040';
    ctx.fillRect(0, 30, canvas.width, 170);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 200, canvas.width, 160);
    ctx.fillStyle = '#33ff33';
    ctx.fillRect(0, 360, canvas.width, 90);
    ctx.globalCompositeOperation = 'source-over';
}

function disegnaHUD() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px PressStart, monospace';
    ctx.fillText('PUNTI ' + stato.punteggio, 10, 18);
    ctx.fillText('RECORD ' + Math.max(stato.punteggio, recordMondiale), 170, 18);
    ctx.fillText('LIVELLO ' + stato.livello, 360, 18);
    ctx.fillText('VITE ' + stato.vite, 510, 18);
}

function disegnaTutto() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    disegnaInvasori();
    if (ufo.attivo) disegnaSprite(SPRITE_UFO, ufo.x, ufo.y);
    disegnaNavicella();
    disegnaProiettili();
    disegnaEsplosioni();
    disegnaPellicola();

    // scudi, linea sul fondo e testi sopra la pellicola
    disegnaScudi();
    ctx.fillStyle = '#33ff33';
    ctx.fillRect(0, canvas.height - 4, canvas.width, 4);
    disegnaHUD();
}
