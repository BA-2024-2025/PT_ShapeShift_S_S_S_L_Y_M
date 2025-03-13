function openPopup(index) {
    const popupContainer = document.querySelector('.popup-container');
    popupContainer.style.transform = 'scale(1)';
    popupContainer.style.opacity = '1';
    document.body.style.overflow = "hidden";
}

function closePopup() {
    const popupContainer = document.querySelector('.popup-container');
    popupContainer.style.opacity = '0';
    popupContainer.style.transform = 'scale(0)';
    document.body.style.overflow = "auto";
}
