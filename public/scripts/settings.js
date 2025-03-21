import {jwtDecode} from 'https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm';

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
            console.log("Current User Email:", decoded.email);
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
