# Progetto TPS — Arcade Games

Ricreazione di **Space Invaders** (Taito, 1978) come pagina web interattiva, sviluppata in **HTML, CSS e JavaScript puro**, senza framework.

**Team classe 5BI** — Elisey Rotar · Verde Giulio Enea

![Partita in corso](space-invaders/docs/screenshot-gioco.png)

## Come eseguire

Il gioco carica la classifica da `highscores.json` con `fetch`, quindi va servito da un server locale (non basta il doppio clic sul file):

```bash
cd space-invaders
python -m http.server 8000
# poi apri http://localhost:8000
```

Va bene qualsiasi server statico (Live Server di VS Code, `npx serve`, ...).

## Comandi

| Tasto | Azione |
|---|---|
| `←` `→` | muovi la nave |
| `SPAZIO` | spara (un proiettile per volta) |
| `P` o bottone **PAUSA** | mette in pausa / riprende |

Si può scegliere la difficoltà (facile / normale / difficile) dal pannello e salvare il proprio punteggio in classifica con nome e data.

## Struttura del progetto

```
.
├── Progetto TPSI.pdf              ← traccia della consegna
├── Tabella di Monitoraggio.xlsx   ← foglio delle ore
├── CONTINUA-QUI.md                ← note di lavoro, stato e prossimi passi
├── space-invaders/
│   ├── index.html                 ← pagina: cabinet, canvas, pannello, classifica
│   ├── style.css                  ← stile cabinet arcade + scanline CRT
│   ├── disegni.js                 ← disegno sul canvas (sprite, sfondo, HUD)
│   ├── gioco.js                   ← stato, controlli, fisica, collisioni, suoni
│   ├── classifica.js              ← parte asincrona (async/await)
│   ├── highscores.json            ← classifica di partenza
│   ├── docs/                      ← screenshot
│   └── assets/                    ← sprite, sfondo e font scaricati (vedi licenze)
└── python-space-shooter/          ← altro progetto del percorso (pygame)
```

## Come è organizzato il codice

| File | Ruolo |
|---|---|
| `disegni.js` | solo grafica: coordinate degli sprite nel foglio PNG, `disegna*()`, HUD dentro il canvas |
| `gioco.js` | solo logica: stato della partita, tasti, movimento, collisioni, suoni Web Audio, `loop()` |
| `classifica.js` | solo parte asincrona: caricamento e salvataggio della classifica |

I tre file condividono lo scope globale: `gioco.js` dichiara gli elementi della pagina (`boxMessaggi`, `campoPunteggio`) usati anche da `classifica.js`.

## Requisiti della traccia

| # | Requisito | Dove si trova |
|---|---|---|
| 1 | HTML ordinato con sezioni | `index.html`: `header`, `main` (cabinet), `section` classifica, `footer` |
| 2 | CSS curato | `style.css`: palette, layout flessibile, scanline, font pixel |
| 3 | Manipolazione del DOM | messaggi e voci di classifica creati/modificati/rimossi (`createElement`, `innerHTML`, `classList`, `remove`) |
| 4 | Funzioni chiare | logica divisa in `aggiorna*()`, `disegna*()`, `avviaPartita()`, ... nessun handler con logica in linea |
| 5 | Almeno 3 eventi | `keydown`/`keyup`, `click` (bottoni), `submit` (form), `change` (difficoltà) |
| 6 | Interazione con l'utente | nome in input, scelta difficoltà, salvataggio punteggio, pausa |
| 7 | `async` e `await` | `caricaClassifica()` e `salvaPunteggio()` in `classifica.js` |
| 8 | Messaggi di stato | "Caricamento in corso…", "Operazione completata…", "Errore nel caricamento" |

## Sincrono e asincrono

- **Sincrono** (`gioco.js` + `disegni.js`): un ciclo `requestAnimationFrame` aggiorna la logica e ridisegna il canvas circa 60 volte al secondo; reagisce subito a tasti e click.
- **Asincrono** (`classifica.js`): `await fetch('highscores.json')` per caricare la classifica e un salvataggio con attesa simulata di 800ms; mentre si aspetta compaiono i messaggi di stato ("Caricamento in corso…", "Salvataggio in corso…").

## Asset e licenze

| Asset | Autore | Licenza |
|---|---|---|
| Sprite "Alternate Space Invaders" | WaffleKilometer (OpenGameArt.org) | CC0 |
| Sfondo stellato | Sauer2 (OpenGameArt.org) | CC0 |
| Font Press Start 2P | CodeMan38 | SIL OFL 1.1 |

Il codice, il layout e il resto dei contenuti sono nostri.
