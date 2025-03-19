document.addEventListener('DOMContentLoaded', async () => {
    const table = document.getElementById('table');

    try {
        const response = await fetch('http://172.16.2.180:3000/users');
        const data = await response.json();

        // Add each user as a row in the table
        data.forEach((user, i) => {
            const row = document.createElement('tr');
            row.addEventListener('click', function() {
                window.location.href = `/profile-page.html?username=${user.username}`;
            });
            if (i < 3) {
                row.innerHTML = `
                    <i class="fa-solid fa-trophy" style="color:var(${"--"+(i+1)})"></i>
                    <td>${"#" + (i + 1)}</td>  
                    <td>${user.username}</td>
                    <td>${user.topscore}</td>
                `;
            }else {
                row.innerHTML = `
                    <td></td>
                    <td>${"#" + (i + 1)}</td>  
                    <td>${user.username}</td>
                    <td>${user.topscore}</td>
                `;
            }
            table.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
