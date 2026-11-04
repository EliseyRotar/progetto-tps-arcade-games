// classifica.js — parte asincrona del progetto: carica e salva i punteggi con async/await

const listaClassifica = document.getElementById('lista-classifica');
const formSalva = document.getElementById('form-salva');
const inputNome = document.getElementById('nome-giocatore');

let classifica = [];

function aggiornaListaClassifica() {
    listaClassifica.innerHTML = '';
    recordMondiale = classifica.length > 0 ? classifica[0].punteggio : 0;

    for (let i = 0; i < classifica.length; i++) {
        const li = document.createElement('li');
        li.textContent = classifica[i].nome + ' — ' + classifica[i].punteggio + ' punti (' + classifica[i].data + ')';
        listaClassifica.appendChild(li);
    }
}

// await aspetta che il server mandi il file
async function caricaClassifica() {
    mostraMessaggio('Caricamento in corso...', 'avviso');

    try {
        const risposta = await fetch('highscores.json');
        if (!risposta.ok) throw new Error('HTTP ' + risposta.status);

        const dati = await risposta.json();
        classifica = dati.sort(function (a, b) { return b.punteggio - a.punteggio; });

        aggiornaListaClassifica();
        mostraMessaggio('Operazione completata: classifica caricata!', 'successo');
    } catch (errore) {
        console.error('Errore nel caricamento:', errore);
        mostraMessaggio('Errore nel caricamento della classifica.', 'errore');
    }
}

// simula il salvataggio su un server con un'attesa di 800ms
async function salvaPunteggio(nome, punteggio) {
    mostraMessaggio('Salvataggio in corso...', 'avviso');

    await new Promise(function (risolvi) { setTimeout(risolvi, 800); });

    classifica.push({
        nome: nome,
        punteggio: punteggio,
        data: new Date().toLocaleDateString('it-IT')
    });
    classifica.sort(function (a, b) { return b.punteggio - a.punteggio; });
    classifica = classifica.slice(0, 10);

    aggiornaListaClassifica();
    mostraMessaggio('Operazione completata: punteggio salvato!', 'successo');
}

formSalva.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const punteggio = parseInt(campoPunteggio.value);

    if (!punteggio) {
        mostraMessaggio('Nessun punteggio da salvare. Gioca prima!', 'errore');
        return;
    }

    salvaPunteggio(nome, punteggio);
    inputNome.value = '';
});

caricaClassifica();
