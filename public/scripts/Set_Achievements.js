// Funktion zum Auslesen des Benutzernamens aus der URL
function getUsernameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username') ; // Holt den Wert des Parameters "username"
}

document.addEventListener('DOMContentLoaded', async () => {
    const username = getUsernameFromURL(); // Den Benutzernamen aus der URL holen

    if (!username) {
        console.error("Kein Benutzername in der URL gefunden!");
        return; // Stoppe die Funktion, falls kein Benutzername in der URL vorhanden ist
    }

    console.log(username);

    try {
        // API-URL mit dem Benutzernamen
        const response = await fetch(`http://172.16.2.180:3000/users/findByName/${username}`);

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Benutzerdaten für ${username}`);
        }

        console.log(`Username: ${username}`);
        const data = await response.json();

        if (data.length === 0) {
            console.error(`Kein Benutzer mit dem Namen "${username}" gefunden.`);
            return;
        }

        // Falls die API eine Liste von Benutzern zurückgibt, nehmen wir den ersten Treffer
        const user = data[0];

        // Setze den Benutzernamen im HTML-Dokument
        document.getElementById('username').innerHTML = user.username;

        // Setze die Benutzerinformationen
        document.getElementById('email').innerHTML = user.email || 'Nicht verfügbar';
        document.getElementById('high-score').innerHTML = user.topscore || 'Nicht verfügbar';
        document.getElementById('level1-score').innerHTML = user.level1_score || 'Nicht verfügbar';

        // Holen der Medaillen-Elemente
        const goldTrophy = document.getElementById('Gold-Trophy');
        const silverTrophy = document.getElementById('Silver-Trophy');
        const bronzeTrophy = document.getElementById('Bronze-Trophy');

        // Überprüfen, ob der Benutzer Level abgeschlossen hat
        if (user.beat_level3) {
            document.getElementById('Gold-Medal').style.display = 'block';
        }
        if (user.beat_level2) {
            document.getElementById('Silver-Medal').style.display = 'block';
        }
        if (user.beat_level1) {
            document.getElementById('Bronze-Medal').style.display = 'block';
        }

        // Überprüfen, ob der Benutzer auf der Bestenliste war
        if (user.best_placement === 1) {
            goldTrophy.style.display = 'block';
            silverTrophy.style.display = 'block';
            bronzeTrophy.style.display = 'block';
        } else if (user.best_placement === 2) {
            silverTrophy.style.display = 'block';
            bronzeTrophy.style.display = 'block';
        } else if (user.best_placement === 3) {
            bronzeTrophy.style.display = 'block';
        }

        let userRuns = fetch(`http://172.16.2.180:3000/runs/${username}`);
        userRuns = await userRuns.json();

        const scoreContainer = document.getElementsByClassName('score-container');
        userRuns.forEach((userRun) => {
            const scoreRow = document.createElement('div');
            scoreRow.classList.add('score-row');
            scoreRow.innerHTML = `
            
                <h2 class="label">Level ${userRun.level}</h2>
                <h2 class="label">Score:</h2>
                <h2 class="value">${userRun.score}</h2>
            
            `
            scoreRow.appendChild(scoreRow);
        })
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
});


