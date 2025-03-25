import {jwtDecode} from 'https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm';
import {getUsernameFromURL} from './Set_Achievements.js'
function getUsername(){

    let data = localStorage.getItem('userObject');
    data = JSON.parse(data)
    console.log(data)
    console.log(data[0])
    return data[0]
}




document.addEventListener("DOMContentLoaded", function () {
    // Prüfen, ob ein gespeichertes Profilbild existiert
    const savedProfilePic = localStorage.getItem("profilePic");
    if (savedProfilePic) {
        document.getElementById("profilePic").src = savedProfilePic;
    }
});
const token = localStorage.getItem('accessToken');

const getEmail = () => {
    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log("Current User:", decoded.email);
            return decoded.email;
        } catch (error) {
            console.error('Invalid token or decoding failed:', error);
        }
    }
    return null;
};
const email = await getEmail();

const userConverter = await fetch(`http://nzempsv:3000/user/findByEmail/${email}`);
const userName = await userConverter.json();

let userObject = new Array()
userObject[0] = userName[0].username;
userObject[1] = email;

localStorage.setItem("userObject", JSON.stringify(userObject));

document.addEventListener('DOMContentLoaded', async () => {
    const username = getUsername() // Den Benutzernamen aus der URL holen

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


        const data = await response.json();

        if (data.length === 0) {

            return ("Error");
        }
        else{
            console.log('Data fetched successfully.');
        }
        // Falls die API eine Liste von Benutzern zurückgibt, nehmen wir den ersten Treffer
        const user = data[0];

        // Setze den Benutzernamen im HTML-Dokument
        document.getElementById('username').innerHTML = user.username;

        try {
            // Setze die Benutzerinformationen
            document.getElementById('email').innerHTML = user.email || 'Nicht verfügbar';
            document.getElementById('password').innerHTML = user.password || 'Nicht verfügbar';
            document.getElementById('high-score').innerHTML = user.topscore || 'Nicht verfügbar';
            document.getElementById('level1-score').innerHTML = user.level1_score || 'Nicht verfügbar';

        } catch (error) {
            console.error(error);
        }

        try {
            // Holen der Medaillen-Elemente
            const goldTrophy = document.getElementById('Gold-Trophy');
            const silverTrophy = document.getElementById('Silver-Trophy');
            const bronzeTrophy = document.getElementById('Bronze-Trophy');
        } catch (error) {
            console.error(error);
        }

        try {
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

        } catch (error) {
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


