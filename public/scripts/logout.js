function logOut() {
    const refreshToken = localStorage.getItem('refreshToken');

    fetch("http://nluginbuehlsi:4000/logout", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({refreshToken})
    }).then(r => console.log(r));

    localStorage.removeItem('accessToken', data.accessToken);  // Save token to localStorage
    localStorage.removeItem('refreshToken', data.refreshToken)
}