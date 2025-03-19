function closePopup() {
    const popupContainer = document.querySelector('.popup-container');
    popupContainer.style.opacity = '0';
    popupContainer.style.transform = 'scale(0)';
    document.body.style.overflow = "auto";
}
