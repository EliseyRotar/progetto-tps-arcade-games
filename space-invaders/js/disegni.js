// disegni.js — tutto quello che viene disegnato sul canvas

const canvas = document.getElementById('schermo');
const ctx = canvas.getContext('2d');

// carica un'immagine dalla cartella img
function carica(nome) {
    const immagine = new Image();
    immagine.src = 'img/' + nome + '.png';
    return immagine;
}

const sfondo = carica('starfield');
const imgNavicella = carica('shipBlue_manned');
const imgUfo = carica('shipPink_manned');
const imgScudo = carica('dome');
const imgRaggio = carica('laserBlue1');
const imgBomba = carica('laserPink1');
const imgEsplosione = carica('laserYellow_burst');

// un tipo di alieno per ogni riga: immagine, larghezza e altezza sul canvas
const ALIENI = [
    { img: carica('shipPink'), w: 43, h: 25 },
    { img: carica('shipYellow'), w: 43, h: 22 },
    { img: carica('shipGreen'), w: 43, h: 24 },
    { img: carica('shipBeige'), w: 43, h: 23 },
    { img: carica('shipBeige'), w: 43, h: 23 }
];

function disegnaSfondo() {
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sfondo, 0, 0, canvas.width, canvas.height);
}

function disegnaScudi() {
    for (let i = 0; i < scudi.length; i++) {
        const s = scudi[i];
        if (s.vita > 0) {
            // più è danneggiato, più diventa trasparente
            ctx.globalAlpha = s.vita / 5;
            ctx.drawImage(imgScudo, s.x, s.y, s.larghezza, s.altezza);
        }
    }
    ctx.globalAlpha = 1;
}

function disegnaInvasori() {
    for (let i = 0; i < invasori.length; i++) {
        const inv = invasori[i];
        if (inv.vivo) ctx.drawImage(ALIENI[inv.riga].img, inv.x, inv.y, inv.larghezza, inv.altezza);
    }
}

function disegnaNavicella() {
    // quando è colpita lampeggia
    if (navicella.esplosione > 0 && navicella.esplosione % 10 < 5) return;
    ctx.drawImage(imgNavicella, navicella.x, navicella.y, navicella.larghezza, navicella.altezza);
}

function disegnaProiettili() {
    for (let i = 0; i < proiettili.length; i++) {
        const p = proiettili[i];
        ctx.drawImage(imgRaggio, p.x, p.y, p.larghezza, p.altezza);
    }
    for (let i = 0; i < bombe.length; i++) {
        const b = bombe[i];
        ctx.drawImage(imgBomba, b.x, b.y, b.larghezza, b.altezza);
    }
}

function disegnaEsplosioni() {
    for (let i = 0; i < esplosioni.length; i++) {
        const e = esplosioni[i];
        ctx.drawImage(imgEsplosione, e.x - 6, e.y - 10, 44, 44);
    }
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
    disegnaSfondo();
    disegnaScudi();
    disegnaInvasori();
    if (ufo.attivo) ctx.drawImage(imgUfo, ufo.x, ufo.y, ufo.larghezza, ufo.altezza);
    disegnaNavicella();
    disegnaProiettili();
    disegnaEsplosioni();
    disegnaHUD();
}
