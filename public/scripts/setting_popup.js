const email = localStorage.getItem('email').trim();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN2ZW5AemVtcC5lbWFpbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNzQyMzk2MTg3LCJleHAiOjE3NDQyMTA1ODd9.rZXkL2Swn-qFsmQqkjtK8Iji8zMP1UKZT63stMRi31w";

localStorage.setItem('accessToken', token);

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
    fetch('http://172.16.2.180:3000/user/change_password', {
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

    //const token = localStorage.getItem('accesToken');
    console.log(emailUpdate.value)
    fetch('http://172.16.2.180:3000/user/change_email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({email, newEmail})
    }).then(res => console.log(res))
}