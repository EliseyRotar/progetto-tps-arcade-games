// gioco.js — stato del gioco, controlli e logica

const schermoInizio = document.getElementById('overlay-inizio');
const schermoPausa = document.getElementById('overlay-pausa');
const schermoFine = document.getElementById('overlay-fine');
const bottoneAvvia = document.getElementById('bottone-avvia');
const bottoneRiprendi = document.getElementById('bottone-riprendi');
const bottoneRiavvia = document.getElementById('bottone-riavvia');
const bottonePausa = document.getElementById('bottone-pausa');
const punteggioFinale = document.getElementById('punteggio-finale');
const menuDifficolta = document.getElementById('difficolta');
const boxMessaggi = document.getElementById('area-messaggi');
const campoPunteggio = document.getElementById('punteggio-nascosto');

const difficolta = {
    facile: { velBombe: 2, frequenzaBombe: 0.007, vite: 5 },
    normale: { velBombe: 3, frequenzaBombe: 0.014, vite: 3 },
    difficile: { velBombe: 4.5, frequenzaBombe: 0.024, vite: 2 }
};

const PUNTI_RIGA = [30, 20, 20, 10, 10];

const stato = { attivo: false, inPausa: false, punteggio: 0, vite: 3, livello: 1 };
let impostazioni = difficolta.normale;
let recordMondiale = 0;

const navicella = { x: 277, y: 410, larghezza: 45, altezza: 33, vel: 4, esplosione: 0 };
const ufo = { attivo: false, x: 0, y: 36, larghezza: 48, altezza: 24, direzione: 1, timer: 450 };

let proiettili = [];
let bombe = [];
let invasori = [];
let scudi = [];
let esplosioni = [];
let direzione = 1;
let velInvasori = 0.5;

const tastiPremuti = {};

// messaggi di stato (usata anche da classifica.js)
function mostraMessaggio(testo, tipo) {
    const div = document.createElement('div');
    div.className = 'messaggio ' + tipo;
    div.textContent = testo;
    boxMessaggi.appendChild(div);
    setTimeout(function () { div.remove(); }, 3500);
}

// suoni
let audioContext;

function suona(frequenza, durata) {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const volume = audioContext.createGain();
    osc.connect(volume);
    volume.connect(audioContext.destination);
    osc.frequency.value = frequenza;
    osc.type = 'square';
    volume.gain.value = 0.05;
    osc.start();
    osc.stop(audioContext.currentTime + durata);
}

// creazione degli oggetti di gioco
function creaInvasori() {
    invasori = [];
    for (let riga = 0; riga < 5; riga++) {
        for (let colonna = 0; colonna < 8; colonna++) {
            const alieno = ALIENI[riga];
            invasori.push({
                riga: riga,
                x: 60 + colonna * 60,
                y: 70 + riga * 34,
                larghezza: alieno.w * SCALA,
                altezza: alieno.h * SCALA,
                vivo: true
            });
        }
    }
    direzione = 1;
    velInvasori = 0.5 + (stato.livello - 1) * 0.2;
}

function creaScudi() {
    scudi = [];
    for (let k = 0; k < 4; k++) {
        for (let riga = 0; riga < 4; riga++) {
            for (let colonna = 0; colonna < 8; colonna++) {
                // il buco in basso al centro di ogni scudo
                if (riga === 3 && colonna >= 2 && colonna <= 5) continue;
                scudi.push({ x: 40 + k * 144 + colonna * 12, y: 355 + riga * 12, larghezza: 12, altezza: 12, vita: 3 });
            }
        }
    }
}

function contaInvasori() {
    let vivi = 0;
    for (let i = 0; i < invasori.length; i++) {
        if (invasori[i].vivo) vivi++;
    }
    return vivi;
}

// due rettangoli si toccano?
function tocca(a, b) {
    return a.x < b.x + b.larghezza &&
           a.x + a.larghezza > b.x &&
           a.y < b.y + b.altezza &&
           a.y + a.altezza > b.y;
}

// se l'oggetto colpisce uno scudo lo danneggia e restituisce true
function colpisceScudo(oggetto) {
    for (let i = 0; i < scudi.length; i++) {
        if (scudi[i].vita > 0 && tocca(oggetto, scudi[i])) {
            scudi[i].vita--;
            return true;
        }
    }
    return false;
}

// aggiornamento di ogni elemento, a ogni frame
function muoviNavicella() {
    if (navicella.esplosione > 0) {
        navicella.esplosione--;
        return;
    }

    if (tastiPremuti['ArrowLeft'] && navicella.x > 0) navicella.x -= navicella.vel;
    if (tastiPremuti['ArrowRight'] && navicella.x + navicella.larghezza < canvas.width) navicella.x += navicella.vel;

    // un solo proiettile alla volta
    if (tastiPremuti[' '] && proiettili.length === 0) {
        proiettili.push({ x: navicella.x + 20, y: navicella.y - 10, larghezza: 4, altezza: 14 });
        suona(760, 0.08);
    }
}

function muoviProiettili() {
    for (let i = proiettili.length - 1; i >= 0; i--) {
        proiettili[i].y -= 10;
        if (proiettili[i].y < 30) proiettili.splice(i, 1);
    }
}

function muoviBombe() {
    // ogni tanto un invasore a caso lascia cadere una bomba
    if (Math.random() < impostazioni.frequenzaBombe) {
        const vivi = invasori.filter(function (inv) { return inv.vivo; });
        if (vivi.length > 0) {
            const inv = vivi[Math.floor(Math.random() * vivi.length)];
            bombe.push({ x: inv.x + inv.larghezza / 2, y: inv.y + inv.altezza, larghezza: 4, altezza: 14 });
        }
    }

    for (let i = bombe.length - 1; i >= 0; i--) {
        bombe[i].y += impostazioni.velBombe;
        if (bombe[i].y > canvas.height) bombe.splice(i, 1);
    }
}

function muoviInvasori() {
    const vivi = contaInvasori();

    // livello finito: ne parte uno nuovo
    if (vivi === 0) {
        stato.livello++;
        mostraMessaggio('Livello ' + stato.livello + '!', 'successo');
        creaInvasori();
        creaScudi();
        bombe = [];
        return;
    }

    // meno invasori restano, più vanno veloci
    const velocita = velInvasori * (1 + (40 - vivi) * 0.025);
    let toccaBordo = false;

    for (let i = 0; i < invasori.length; i++) {
        const inv = invasori[i];
        if (!inv.vivo) continue;
        inv.x += direzione * velocita;
        if (inv.x <= 6 || inv.x + inv.larghezza >= canvas.width - 6) toccaBordo = true;
    }

    // al bordo cambiano direzione e scendono
    if (toccaBordo) {
        direzione = -direzione;
        for (let i = 0; i < invasori.length; i++) {
            invasori[i].y += 18;
        }
    }

    // se arrivano alla navicella hanno vinto
    for (let i = 0; i < invasori.length; i++) {
        if (invasori[i].vivo && invasori[i].y + invasori[i].altezza >= navicella.y) {
            finePartita();
            return;
        }
    }
}

function muoviUfo() {
    if (ufo.attivo) {
        ufo.x += 2.2 * ufo.direzione;
        if (ufo.x > canvas.width + 60 || ufo.x < -60) {
            ufo.attivo = false;
            ufo.timer = 500;
        }
        return;
    }

    ufo.timer--;
    if (ufo.timer <= 0) {
        ufo.attivo = true;
        ufo.direzione = Math.random() > 0.5 ? 1 : -1;
        ufo.x = ufo.direzione === 1 ? -60 : canvas.width + 60;
    }
}

function muoviEsplosioni() {
    for (let i = esplosioni.length - 1; i >= 0; i--) {
        esplosioni[i].timer--;
        if (esplosioni[i].timer <= 0) esplosioni.splice(i, 1);
    }
}

// collisioni
function controllaProiettili() {
    for (let i = proiettili.length - 1; i >= 0; i--) {
        const p = proiettili[i];
        let colpito = false;

        for (let j = 0; j < invasori.length; j++) {
            const inv = invasori[j];
            if (inv.vivo && tocca(p, inv)) {
                inv.vivo = false;
                stato.punteggio += PUNTI_RIGA[inv.riga];
                esplosioni.push({ x: inv.x, y: inv.y, timer: 20 });
                suona(140, 0.15);
                colpito = true;
                break;
            }
        }

        if (!colpito && ufo.attivo && tocca(p, ufo)) {
            ufo.attivo = false;
            stato.punteggio += 100;
            esplosioni.push({ x: ufo.x, y: ufo.y, timer: 20 });
            mostraMessaggio('UFO abbattuto! +100', 'successo');
            colpito = true;
        }

        if (!colpito) colpito = colpisceScudo(p);
        if (colpito) proiettili.splice(i, 1);
    }
}

function controllaBombe() {
    if (navicella.esplosione > 0) return;

    for (let i = bombe.length - 1; i >= 0; i--) {
        if (tocca(bombe[i], navicella)) {
            bombe.splice(i, 1);
            stato.vite--;
            navicella.esplosione = 50;
            suona(100, 0.3);
            mostraMessaggio('Colpito! Vite rimaste: ' + stato.vite, 'errore');
            if (stato.vite <= 0) finePartita();
        } else if (colpisceScudo(bombe[i])) {
            bombe.splice(i, 1);
        }
    }
}

// avvio, pausa e fine partita
function avviaPartita() {
    if (!audioContext) audioContext = new AudioContext();
    impostazioni = difficolta[menuDifficolta.value];

    stato.attivo = true;
    stato.inPausa = false;
    stato.punteggio = 0;
    stato.vite = impostazioni.vite;
    stato.livello = 1;

    navicella.x = 277;
    navicella.esplosione = 0;
    proiettili = [];
    bombe = [];
    esplosioni = [];
    ufo.attivo = false;
    ufo.timer = 450;
    creaInvasori();
    creaScudi();

    schermoInizio.classList.add('nascosto');
    schermoFine.classList.add('nascosto');
    schermoPausa.classList.add('nascosto');
    bottonePausa.textContent = 'PAUSA';
    mostraMessaggio('Partita iniziata!', 'successo');
}

function cambiaPausa() {
    if (!stato.attivo) return;
    stato.inPausa = !stato.inPausa;
    schermoPausa.classList.toggle('nascosto', !stato.inPausa);
    bottonePausa.textContent = stato.inPausa ? 'RIPRENDI' : 'PAUSA';
}

function finePartita() {
    stato.attivo = false;
    punteggioFinale.textContent = 'Punteggio: ' + stato.punteggio;
    campoPunteggio.value = stato.punteggio;
    schermoFine.classList.remove('nascosto');
}

// eventi
document.addEventListener('keydown', function (e) {
    // mentre scrivi il nome nel modulo non si gioca
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    tastiPremuti[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    if (e.key === 'p' || e.key === 'P') cambiaPausa();
});

document.addEventListener('keyup', function (e) {
    tastiPremuti[e.key] = false;
});

bottoneAvvia.addEventListener('click', avviaPartita);
bottoneRiavvia.addEventListener('click', avviaPartita);
bottoneRiprendi.addEventListener('click', cambiaPausa);
bottonePausa.addEventListener('click', cambiaPausa);

menuDifficolta.addEventListener('change', function () {
    mostraMessaggio('Difficoltà: ' + menuDifficolta.value + ' (vale dalla prossima partita)', 'avviso');
});

// ciclo di gioco, parte 60 volte al secondo
function loop() {
    if (stato.attivo && !stato.inPausa) {
        muoviNavicella();
        muoviProiettili();
        muoviBombe();
        muoviInvasori();
        muoviUfo();
        muoviEsplosioni();
        controllaProiettili();
        controllaBombe();
    }

    disegnaTutto();
    requestAnimationFrame(loop);
}

loop();
