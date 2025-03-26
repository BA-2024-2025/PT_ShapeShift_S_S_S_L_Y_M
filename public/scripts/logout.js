const ip = localStorage.getItem('ip')

function logOut() {
    const refreshToken = localStorage.getItem('refreshToken');

    fetch("http://${ip}:4000/logout", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({refreshToken})
    }).then(r => console.log(r));

    localStorage.clear();
}