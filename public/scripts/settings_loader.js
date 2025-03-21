document.addEventListener('DOMContentLoaded', async () => {
    const userObject = JSON.parse(localStorage.getItem("userObject"));
    let username = userObject[0];

    if (!username) {
        console.error("Kein Benutzername in der URL gefunden!");
        return; // Stoppe die Funktion, falls kein Benutzername in der URL vorhanden ist
    }

    console.log(username);

    try {
        // API-URL mit dem Benutzernamen
        const response = await fetch(`http://nzempsv:3000/user/findByName/${username}`);

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

        try{
            // Setze die Benutzerinformationen
            document.getElementById('email').innerHTML = user.email || 'Nicht verfügbar';
            document.getElementById('high-score').innerHTML = user.topscore || 'Nicht verfügbar';
            document.getElementById('level1-score').innerHTML = user.level1_score || 'Nicht verfügbar';

        }catch(error) {
            console.error(error);
        }

        try{
            // Holen der Medaillen-Elemente
            const goldTrophy = document.getElementById('Gold-Trophy');
            const silverTrophy = document.getElementById('Silver-Trophy');
            const bronzeTrophy = document.getElementById('Bronze-Trophy');
        }catch(error) {
            console.error(error);
        }

        try{
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

        }catch(error) {
            console.error(error);
        }

        const userRuns = await fetch(`http://nzempsv:3000/runs/${username}`);
        const userRunData = await userRuns.json();

        const scoreContainer = document.getElementById('score-container');
        userRunData.forEach((userRun, i) => {
            const scoreRow = document.createElement('div');
            scoreRow.classList.add('row-score');
            scoreRow.innerHTML = `
            
                <h2 class="label">Level ${userRun.level}</h2>
                <h2 class="label">Score:</h2>
                <h2 class="value">${userRun.score}</h2>
            
            `
            scoreContainer.appendChild(scoreRow);
        })
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
});


