// disegni.js — tutto quello che viene disegnato sul canvas

const canvas = document.getElementById('schermo');
const ctx = canvas.getContext('2d');

const foglio = new Image();
foglio.src = 'assets/pack/alternate_space_invaders_sprite_sheet.png';

const sfondo = new Image();
sfondo.src = 'assets/backgrounds/starfield.png';

// posizione di ogni sprite dentro il foglio png (x, y, larghezza, altezza)
const SPRITE = {
    navicella: { x: 0, y: 17, w: 15, h: 11 },
    navicellaEsplosa: { x: 32, y: 18, w: 15, h: 10 },
    invasori: [
        { x: 4, y: 52, w: 8, h: 8 },
        { x: 20, y: 52, w: 8, h: 8 },
        { x: 34, y: 52, w: 11, h: 8 },
        { x: 49, y: 52, w: 13, h: 8 },
        { x: 66, y: 52, w: 12, h: 8 }
    ],
    ufo: { x: 96, y: 52, w: 16, h: 8 },
    esplosione: { x: 82, y: 84, w: 12, h: 8 }
};

const SCALA = 3;

function disegnaSprite(s, x, y) {
    ctx.drawImage(foglio, s.x, s.y, s.w, s.h, Math.round(x), Math.round(y), s.w * SCALA, s.h * SCALA);
}

function disegnaTesto(testo, x, y) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px PressStart, monospace';
    ctx.fillText(testo, x, y);
}

function disegnaSfondo() {
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (sfondo.complete) ctx.drawImage(sfondo, 0, 0, canvas.width, canvas.height);
}

function disegnaScudi() {
    const colori = ['', '#c0392b', '#e0a030', '#3ddc84'];
    for (let i = 0; i < scudi.length; i++) {
        const b = scudi[i];
        if (b.vita > 0) {
            ctx.fillStyle = colori[b.vita];
            ctx.fillRect(b.x, b.y, b.larghezza, b.altezza);
        }
    }
}

function disegnaNavicella() {
    if (navicella.esplosione > 0) disegnaSprite(SPRITE.navicellaEsplosa, navicella.x, navicella.y + 8);
    else disegnaSprite(SPRITE.navicella, navicella.x, navicella.y);
}

function disegnaInvasori() {
    for (let i = 0; i < invasori.length; i++) {
        const inv = invasori[i];
        if (inv.vivo) disegnaSprite(SPRITE.invasori[inv.riga], inv.x, inv.y);
    }
}

function disegnaProiettili() {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < proiettili.length; i++) {
        const p = proiettili[i];
        ctx.fillRect(p.x, p.y, p.larghezza, p.altezza);
    }
    ctx.fillStyle = '#ff5c5c';
    for (let i = 0; i < bombe.length; i++) {
        const b = bombe[i];
        ctx.fillRect(b.x, b.y, b.larghezza, b.altezza);
    }
}

function disegnaEsplosioni() {
    for (let i = 0; i < esplosioni.length; i++) {
        disegnaSprite(SPRITE.esplosione, esplosioni[i].x, esplosioni[i].y);
    }
}

function disegnaHUD() {
    disegnaTesto('PUNTI ' + stato.punteggio, 10, 18);
    disegnaTesto('RECORD ' + Math.max(stato.punteggio, recordMondiale), 170, 18);
    disegnaTesto('LIVELLO ' + stato.livello, 360, 18);
    disegnaTesto('VITE ' + stato.vite, 510, 18);
}

function disegnaTutto() {
    disegnaSfondo();
    disegnaScudi();
    disegnaInvasori();
    if (ufo.attivo) disegnaSprite(SPRITE.ufo, ufo.x, ufo.y);
    disegnaNavicella();
    disegnaProiettili();
    disegnaEsplosioni();
    disegnaHUD();

    // linea verde sul fondo
    ctx.fillStyle = '#3ddc84';
    ctx.fillRect(0, canvas.height - 4, canvas.width, 4);
}
