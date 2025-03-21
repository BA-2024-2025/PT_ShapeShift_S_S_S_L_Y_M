import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// the App function
function App() {
    const [users, setUsers] = useState([]);

    //gets the users fom the api
    useEffect(() => {
        fetch('http://172.16.2.165:3000/users/3')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Error fetching users:', err));
    }, []);

    //generates the table
    return (
        <table className="leaderboard-table" id="table">
            <tr className="leaderboard-row">
                <th><h2>Place</h2></th>
                <th><h2>Username</h2></th>
                <th><h2>Score</h2></th>
            </tr>
            <!-- generates  3 times the user element / entery-->
            {users.map((user, i) => (
                <tr key={i}>
                    <td className="leaderboard-place"><h3>#{i + 1}</h3></td>
                    <td className="leaderboard-username"><h3>{user.username}</h3></td>
                    <td className="leaderboard-score"><h3>{user.topscore}</h3></td>
                </tr>
            ))}
        </table>
    );
}

//renders the element
createRoot(document.getElementById('table')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
