import {jwtDecode} from 'https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm';
import {getScore} from "./HomeStats.js";

const getUser = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log("Current User:", decoded.email); // Log the decoded data
            return decoded.email;
        } catch (error) {
            console.error('Invalid token or decoding failed:', error);
        }
    }
    return null;
};
if (!getUser()) {
    openPopup()
}

const token = localStorage.getItem("accessToken");

//errors occur because the const is empty
function openPopup() {

    const popupContainer = document.querySelector('.popup-container');
    if (popupContainer) { // Check if the element exists
        popupContainer.style.transform = 'scale(1)';
        popupContainer.style.opacity = '1';
        document.body.style.overflow = "hidden";
    } else {
        console.log('Element with class "popup-container" not found, but ShapeShift should be working anyway.');
    }
}

export function sendRun(level) {

    //extracts email from userObject
    let userData = localStorage.getItem("userObject")
    userData = JSON.parse(userData);

    //sends data to server
    fetch("http://nzempsv:3000/run/insert_score", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            "level": level,
            "email": userData[1],
            "score": getScore()
        })
    })
}

const theme = localStorage.getItem('theme')
const body = document.querySelector('body');
body.className = theme