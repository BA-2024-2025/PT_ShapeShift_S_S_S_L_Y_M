document.addEventListener('DOMContentLoaded', async () => {
    const table = document.getElementById('table');

    try {
        const response = await fetch('http://172.16.2.165:3000/users');
        const data = await response.json();


        // Add each user as a row in the table
        data.forEach((user, i) => {
            const row = document.createElement('tr');
            if (i < 4 ) {
                row.innerHTML = `
                    <i class="fa-solid fa-medal"></i>
                    <td>${"#" + (i + 1)}</td>  
                    <td>${user.username}</td>
                    <td>${user.score}</td>
                `;
            }else {
                row.innerHTML = `
                    <td></td>
                    <td>${"#" + (i + 1)}</td>  
                    <td>${user.username}</td>
                    <td>${user.score}</td>
                `;
            }
            table.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
