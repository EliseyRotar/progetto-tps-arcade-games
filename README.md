<div align="center">

# SPACE INVADERS

**Il classico arcade del 1978, ricreato in HTML, CSS e JavaScript puro**

[![Gioca online](https://img.shields.io/badge/GIOCA%20ONLINE-33ff33?style=for-the-badge&labelColor=000000)](https://eliseyrotar.github.io/progetto-tps-arcade-games/)
![HTML](https://img.shields.io/badge/HTML-ff4040?style=flat-square&labelColor=000000)
![CSS](https://img.shields.io/badge/CSS-33ff33?style=flat-square&labelColor=000000)
![JavaScript](https://img.shields.io/badge/JavaScript-ffff33?style=flat-square&labelColor=000000)
![Nessun framework](https://img.shields.io/badge/framework-nessuno-ffffff?style=flat-square&labelColor=000000)

Progetto TPS · Classe 5BI · **Elisey Rotar** e **Verde Giulio Enea**

![Partita in corso](space-invaders/docs/screenshot-gioco.png)

</div>

## Il gioco

- Sprite pixel art su fondo nero, con la pellicola colorata dei cabinet originali
- Invasori che accelerano quando ne restano pochi, UFO bonus, scudi che si consumano
- Livelli che si ripetono sempre più veloci
- Tre difficoltà: **facile**, **normale**, **difficile**
- Classifica con salvataggio del punteggio (caricamento e salvataggio asincroni)
- Suoni con Web Audio e messaggi di stato per ogni operazione

## Come giocare

**Online:** https://eliseyrotar.github.io/progetto-tps-arcade-games/

| Tasto | Azione |
|---|---|
| `←` `→` | muovi la navicella |
| `SPAZIO` | spara (un colpo per volta) |
| `P` o bottone **PAUSA** | pausa / riprendi |

## Eseguire in locale

La classifica viene caricata con `fetch`, quindi serve un server locale (il doppio clic sul file non basta):

```bash
cd space-invaders
python -m http.server 8000
# poi apri http://localhost:8000
```

## Struttura

```
.
├── index.html                   ← porta alla cartella del gioco (GitHub Pages)
├── README.md
├── LICENSE
├── consegna/                    ← traccia, tabella di monitoraggio e presentazione
└── space-invaders/
    ├── index.html               ← la pagina
    ├── style.css                ← lo stile
    ├── js/
    │   ├── disegni.js           ← disegna sul canvas
    │   ├── gioco.js             ← logica: movimento, collisioni, tasti
    │   └── classifica.js        ← parte asincrona (async/await)
    ├── dati/highscores.json     ← classifica di partenza
    ├── img/                     ← sprite e favicon
    ├── fonts/                   ← font pixel
    └── docs/                    ← screenshot
```

## Requisiti della traccia

| # | Requisito | Dove |
|---|---|---|
| 1 | HTML ordinato | `index.html`: `header`, `main`, `section`, `footer` |
| 2 | CSS curato | `style.css` |
| 3 | Manipolazione DOM | messaggi di stato e classifica creati e rimossi da JavaScript |
| 4 | Funzioni chiare | `muoviInvasori()`, `controllaProiettili()`, `avviaPartita()`, ... |
| 5 | Almeno 3 eventi | `keydown`/`keyup`, `click`, `submit`, `change` |
| 6 | Interazione utente | nome, difficoltà, pausa, salvataggio punteggio |
| 7 | `async` / `await` | `caricaClassifica()` e `salvaPunteggio()` in `classifica.js` |
| 8 | Messaggi di stato | "Caricamento in corso…", "Operazione completata…", "Errore nel caricamento…" |

## Sincrono e asincrono

- **Sincrono** (`gioco.js`, `disegni.js`): un ciclo `requestAnimationFrame` aggiorna e ridisegna il gioco circa 60 volte al secondo.
- **Asincrono** (`classifica.js`): `await fetch('dati/highscores.json')` carica la classifica e il salvataggio simula 800 ms di attesa, mostrando i messaggi di stato mentre si aspetta.

## Crediti

| Asset | Autore | Licenza |
|---|---|---|
| Sprite "Alternate Space Invaders" | WaffleKilometer (OpenGameArt.org) | CC0 |
| Font Press Start 2P | CodeMan38 | SIL OFL |

Il codice è scritto da noi ed è rilasciato con licenza MIT (vedi [LICENSE](LICENSE)).
