const ip = localStorage.getItem('ip')

function logOut() {
    const refreshToken = localStorage.getItem('refreshToken');

    fetch("http://${ip}/auth/logout", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({refreshToken})
    }).then(r => console.log(r));

    localStorage.clear();
}