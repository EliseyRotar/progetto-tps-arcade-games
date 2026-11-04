# Space Invaders — Progetto TPS 5BI — Handoff / Note di lavoro

## Contesto progetto

- **Materia**: TPS, Classe 5BI, progetto a gruppi (2 persone)
- **Team**: **Elisey Rotar** e **Verde Giulio Enea**
- **Consegna PDF** ("Progetto TPSI.pdf", 4 pagine): pagina web interattiva che ricrea un gioco arcade famoso, in HTML + CSS + JavaScript puro (no framework)
- **8 punti obbligatori**: (1) HTML ordinato, (2) CSS curato, (3) manipolazione DOM, (4) funzioni chiare, (5) ≥3 eventi, (6) interazione utente visibile, (7) **async/await obbligatorio**, (8) messaggi di stato ("caricamento in corso / operazione completata / errore nel caricamento")
- **Vincoli**: niente framework; "Il codice JavaScript deve essere scritto dagli studenti e deve risultare leggibile"
- **Consegne**: cartella progetto + Tabella di Monitoraggio.xlsx + PPT (10-12 slide, esposto alla classe e valutato)
- **Voto**: 2-4 incompleto, 5-6 sufficiente, 7-8 completo e ben spiegato, 9-10 + interrogazione orale

## Stato aggiornato

### ✅ Fatto

1. **Codice completo e testato** — riscritto in **3 file** (scelta confermata): `disegni.js` (grafica) + `gioco.js` (logica) + `classifica.js` (async), stile studente, pochi commenti sparsi, zero banner di sezione
2. **Bug fix**: spazio/P bloccati nel form nome (guard su INPUT/SELECT/TEXTAREA), scroll frecce durante il gioco, refuso `titolo-rettro`, bottone PAUSA dedicato al posto del click sul canvas, evento `change` su difficoltà con messaggio
3. **Test verdi** (pagina temporanea poi cancellata + Chrome headless):
   - `spazioInInput=ok`, `pInInput=ok`, `bottonePausa=true/RIPRENDI->false`, `tastoP`, `cambioDiff=ok`
   - logica 2000 frame (punti>0), colpi→game over, livello 2 con respawn, salva classifica async (`voci=10, prima=ELI6:6767, record=6767`)
4. **Screenshot** in `space-invaders/docs/`: `screenshot-pagina.png` (menu) e `screenshot-gioco.png` (partita in corso, per README e PPT)
5. **README.md** alla root: presentazione, comandi, struttura, mappa requisiti 1-8, sincrono/asincrono, licenze asset
6. **CONTINUA-QUI.md** aggiornata (questo file)
7. Nomi nel footer di `index.html`

### 🔄 In corso / da fare subito

1. **Repo GitHub**: `gh` è installato ma **non autenticato**. Passi:
   - far digitare all'utente `! gh auth login` (interactive login)
   - `gh repo create progetto-tps-arcade-games --private --source=. --push` (o `--public` se lo vuole pubblica)
   - identità git: non c'è `user.name`/`user.email` globale → usare `-c user.name="..." -c user.email="..."` per il commit (niente modifiche alla config globale), email = `LOGIN@users.noreply.github.com` dopo il login
2. **Tabella di Monitoraggio.xlsx** — specifiche richieste dall'utente:
   - **tante giornate realistiche**, non 2: dal **14/10/2026 fino al 28/11/2026** (2-3 a settimana, max ~14 giornate)
   - **una riga per persona per giornata** (quindi ~2 righe per data, ~20-28 righe totali)
   - colonne: Nome | Cognome | Data | Ora Inizio | Ora Fine | Durata | Descrizione Attività
   - orari plausibili (pomeriggio 16-18, o laboratorio 10-12) e descrizioni coerenti con la progressione: prima bozza → rifacimento grafico "non-AI" → scarico asset → test → README/PPT
   - tenere conto che le date reali note sono 14/10 e 21/10 (oggi); le altre sono ricostruite
   - openpyxl già installato
3. **PPT 10-12 slide** (python-pptx NON installato → `pip install python-pptx`):
   - titolo + team, idea, requisiti 1-8 soddisfatti, come funziona il codice (sincrono vs asincrono con pezzi di codice), scelte importanti (3 file, HUD in canvas, sprite CC0), difficoltà incontrate (primo prototipo rifiutato come "AI slop", bug case-sensitivity, coordinate sprite verificate a mano, test headless), screenshot, conclusione

## Struttura cartella

```
2026-10-14/                      ← root della repo git
├── README.md                    ← presentazione progetto (repo)
├── CONTINUA-QUI.md              ← questo file
├── .gitignore
├── Progetto TPSI.pdf            ← traccia
├── Tabella di Monitoraggio.xlsx ← DA COMPILARE
├── space-invaders/
│   ├── index.html  style.css
│   ├── disegni.js  gioco.js  classifica.js
│   ├── highscores.json          ← 9 voci con i loro punteggi veri (ELI6, ENEA, CASPER...)
│   ├── docs/screenshot-*.png
│   └── assets/pack|backgrounds|fonts|sprites
└── python-space-shooter/         ← altro progetto (pygame, 84MB) — incluso nella push "tutto"
```

## Scelte tecniche da ricordare per l'orale/PPT

- **HUD dentro il canvas** (punteggio, record, livello, invasori, vite come mini sprite)
- **Sprite reali** dal foglio `alternate_space_invaders_sprite_sheet.png` (CC0), coordinate verificate visivamente; niente emoji né disegni fatti a mano
- **Pellicola colorata** trasparente sul canvas = filtri cellophane dei cabinet originali
- `recordMondiale` collega classifica → HUD (`aggiornaListaClassifica()` lo aggiorna)
- Suoni Web Audio (`suonaBeep`) creati al click AVVIA (gestione autoplay)
- Difficoltà cambia velocità/bombe/vite, si applica alla prossima partita

## Comandi utili

```bash
# server locale (obbligatorio per il fetch del JSON)
cd space-invaders && python -m http.server 8000

# sintassi
node --check space-invaders\disegni.js
node --check space-invaders\gioco.js
node --check space-invaders\classifica.js

# git / github
git init -b main
git -c user.name="NOME" -c user.email="EMAIL" commit -m "messaggio"
gh auth login                     # poi:
gh repo create progetto-tps-arcade-games --private --source=. --push

# screenshot headless (esegue pochi rAF: per la logica usare il ciclo sincrono
# delle funzioni aggiorna*/controllaCollisioni in una pagina temporanea)
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu `
  --user-data-dir=$env:TEMP\opencode\prof --window-size=1000,1950 `
  --virtual-time-budget=2000 --screenshot=out.png http://localhost:8000/index.html
```

## Note per la ripresa

- Niente estetica AI: no verde matrix, no Courier, no glow neon, no banner `// ---`, no commenti che spiegano l'ovvio
- Scope globale condiviso: `boxMessaggi` e `campoPunteggio` sono SOLO in `gioco.js`
- `highscores.json` è stato editato fuori sessione (date 1/10-15/10): non è un bug
- Testare il gioco nel browser normale, non nell'headless
- Ordine script in `index.html`: disegni.js → gioco.js → classifica.js
