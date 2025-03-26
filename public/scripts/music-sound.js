

document.addEventListener("DOMContentLoaded", function () {
    if ((window.location.pathname.endsWith("index.html") || window.location.pathname === "/") && localStorage.getItem('theme') === "swiss") {
        const gameSong = '../public/music/örgelihuus.wav';
        const audio = new Audio(gameSong); // Audio-Objekt erstellen

        audio.loop = true;  // Endlos wiederholen
        audio.volume = 0.5; // Lautstärke anpassen (optional)
        audio.play().catch(error => console.log("Autoplay blockiert:", error));
    }else if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        const gameSong = '../public/music/game-play.wav';
        const audio = new Audio(gameSong); // Audio-Objekt erstellen

        audio.loop = true;  // Endlos wiederholen
        audio.volume = 0.5; // Lautstärke anpassen (optional)
        audio.play().catch(error => console.log("Autoplay blockiert:", error));
    }
});

export function explosionSound(){
    const explosion = '../public/music/explosion-91872.wav';
    const exAudio = new Audio(explosion);

    audio.volume = 0.5;
    audio.play().catch(error => console.log("Autoplay blockiert:", error));
}

export function messageSound(){
    const message = '../public/music/ring.wav';
    const messageAudio = new Audio(message);

    audio.volume = 1;
    audio.play().catch(error => console.log("Autoplay blockiert:", error));
}
/*
const audio = document.getElementById("soundIcon");
const muteButton = document.getElementById("soundIcon");


muteButton.addEventListener("click", function () {
    audio.muted = !audio.muted;
});


const lobbyQueue = [
    '../public/music/game-play.wav'
];

const gameQueue = [
    'music/game-play.wav',
    'music/loose.wav'
];
let currentQueue = lobbyQueue; // Initially using the lobby queue
let audio; // Declare audio element globally
document.addEventListener("DOMContentLoaded", function () {
    //const currentTime = localStorage.getItem('audioTime');
    //console.log(currentTime);
    audio = document.getElementById('audio');
    // Function to play the next clip in the current queue
    function playNext() {
        if (currentQueue.length === 0) {
            // Re-add the initial clip when the queue is empty (optional)
            if (currentQueue === lobbyQueue) {
                currentQueue.push('../public/music/game-play.wav');
            } else {
                currentQueue.push('../public/music/game-play.wav');
            }
        }
        const nextClip = currentQueue.shift(); // Get the next clip path from the current queue
        audio.src = nextClip; // Set the audio source to the next clip
        console.log(nextClip); // Log the next audio clip
        audio.load();
        clip(audio, 0, 100); // Start playing the clip from the beginning
        console.log(currentTime);
        if (currentTime) audio.currentTime = parseFloat(currentTime)// Reload the audio element with the new source
        audio.play(); // Play the audio automatically

    }
    // Function to handle looping and audio transition
    function clip(audio, start, stop) {
        audio.currentTime = start;
        audio.play();
        let int = setInterval(function() {
            if (audio.currentTime > stop) {
                audio.pause();
                clearInterval(int);
                // Play it again, 2 seconds further.
                clip(audio, start + 1, stop + 0);
            }
        }, 10);
    }
    // Start the queue when the DOM is loaded
    playNext();
    // Loop the queue when a song finishes
    audio.onended = function() {
        playNext(); // Play the next song or restart the queue if empty
    };
    // Function to switch to the game queue
    window.switchToGameQueue = function() {
        console.log('Switching to game queue');
        currentQueue = gameQueue; // Switch to the game queue
        playNext(); // Start playing from the game queue
    };
    // Function to add clips to the current queue
    window.addClipToQueue = function(path) {
        currentQueue.push(path); // Add new audio clip to the current queue
        console.log("Added to queue: " + path);
    };
});

window.addEventListener('BeforeOnload', function () {
    localStorage.setItem('audioTime', audio.currentTime.toString());
    console.log(audio.currentTime.toString());
    console.log("hello")
})

 */