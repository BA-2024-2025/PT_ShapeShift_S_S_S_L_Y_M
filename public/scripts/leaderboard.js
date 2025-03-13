document.addEventListener('DOMContentLoaded', async () => {
    const table = document.querySelector('table');

    try {
        const response = await fetch('https://api.example.com/leaderboard'); // Ersetze mit der echten API-URL
        const data = await response.json();

        data.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.score}</td>
            `;
            table.appendChild(row);
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
});
