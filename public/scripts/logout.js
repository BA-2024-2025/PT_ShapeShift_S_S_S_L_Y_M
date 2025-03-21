function logOut(key) {
    const refreshToken = localStorage.getItem('refreshToken');

    fetch("http://172.16.2.180:4000/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({refreshToken})
    }).then(r => console.log(r));

    localStorage.removeItem('accessToken', data.accessToken);  // Save token to localStorage
    localStorage.removeItem('refreshToken', data.refreshToken)
}