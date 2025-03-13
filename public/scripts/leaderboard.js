document.addEventListener('DOMContentLoaded', async () => {
    const table = document.querySelector('.Leaderboard');
    const tbody = table.querySelector('tbody');

    try {
        const response = await fetch('http://172.16.2.165:3000/users');
        const data = await response.json();
        console.log(data);


        data.sort((a, b) => b.score - a.score);


        // Add each user as a row in the table
        data.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>  
                <td>${user.username}</td>
                <td>${user.score}</td>
            `;
            tbody.appendChild(row); // Append the row to the tbody
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
