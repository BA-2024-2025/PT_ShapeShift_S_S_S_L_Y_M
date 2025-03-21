import {jwtDecode} from 'https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm';

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

function openPopup() {
    const popupContainer = document.querySelector('.popup-container');
    popupContainer.style.transform = 'scale(1)';
    popupContainer.style.opacity = '1';
    document.body.style.overflow = "hidden";
}

const theme = localStorage.getItem('theme')
const body = document.querySelector('body');
body.className = theme

export function changeBlockImg(path) {
    let img = document.getElementById("nextBlockImage")
    img.src = path
}