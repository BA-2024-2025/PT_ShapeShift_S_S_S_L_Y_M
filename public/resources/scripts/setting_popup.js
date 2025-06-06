const token = localStorage.getItem("accessToken");
console.log(token);

const ip = localStorage.getItem('ip');

const userObject = JSON.parse(localStorage.getItem("userObject"));
let email = userObject[1];let password = userObject[0];

localStorage.setItem('accessToken', token);


//sounds
//sounds
function toggleSound() {
    const soundIcon = document.getElementById("soundIcon");

    if (soundIcon.classList.contains("fa-volume-high")) {
        soundIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
    } else {
        soundIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
        console.log("🔊 Sound an");
    }
}

function openPopupPw() {
    const popupContainer = document.querySelector('.popup-container');
    popupContainer.style.display = 'flex';
    popupContainer.style.transform = 'scale(1)';
    popupContainer.style.opacity = '1';
    document.body.style.overflow = "hidden";
}

function closePopupPw() {
    const popupContainer = document.querySelector('.popup-container');
    popupContainer.style.display = 'none';
    popupContainer.style.opacity = '0';
    document.body.style.overflow = "hidden";
    window.location.reload();
}

function openPopupEmail() {
    const popupContainer = document.querySelector('.popup-container-email');
    popupContainer.style.display = 'flex';
    popupContainer.style.transform = 'scale(1)';
    popupContainer.style.opacity = '1';
    document.body.style.overflow = "hidden";
}

function closePopupEmail() {
    const popupContainer = document.querySelector('.popup-container-email');
    popupContainer.style.display = 'none';
    popupContainer.style.opacity = '0';
    document.body.style.overflow = "hidden";
    window.location.reload();
}

function openPopupProfilePicture() {
    const popupContainer = document.querySelector('.popup-container-profile-picture');
    popupContainer.style.display = 'flex';
    popupContainer.style.transform = 'scale(1)';
    popupContainer.style.opacity = '1';
    document.body.style.overflow = "hidden";
}

function closePopupProfilePicture() {
    const popupContainer = document.querySelector('.popup-container-profile-picture');
    popupContainer.style.display = 'none';
    popupContainer.style.opacity = '0';
    document.body.style.overflow = "hidden";
    window.location.reload();
}

function changeProfilePic(image) {
    const profilePic = document.getElementById("profilePic");
    profilePic.src = image.src;

    localStorage.setItem("profilePic", image.src);

    closePopupProfilePicture();

}

function subbmitNewPw() {
    const pwUpdate = document.getElementById("pw-update")
     newPassword= pwUpdate.value;

    //const token = localStorage.getItem('accesToken');
    console.log(pwUpdate.value)
    fetch('http://${ip}/user/change_password', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({email, newPassword})
    }).then(res => console.log(res))
}

function subbmitNewEmail() {
    const emailUpdate = document.getElementById("email-update")
    let newEmail = emailUpdate.value;

    console.log("Old Email "+email)
    console.log("New Email "+emailUpdate.value)
    fetch('http://${ip}/user/change_email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({email, newEmail})
    }).then(res => console.log(res))
    logOut()
    window.location.reload();
}

function logOut() {
    const refreshToken = localStorage.getItem('refreshToken');

    fetch("http://${ip}/auth/logout", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({refreshToken})
    }).then(r => console.log(r));

    localStorage.removeItem('accessToken');  // Save token to localStorage
    localStorage.removeItem('refreshToken')
}