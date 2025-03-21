// Connect to WebSocket server
var state = "close"

const ws = new WebSocket('ws://nzempsv:8080');

ws.onopen = function () {
    ws.readyState = WebSocket.OPEN;
}

// Send message to WebSocket server
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    if (message) {
        ws.send(message);  // Send message to the WebSocket server
        input.value = '';  // Clear input field
    }
}

ws.onmessage = async (event) => {
    let messages;

    if (event.data instanceof Blob) {
        // Convert Blob to text
        messages = await event.data.text();
    } else {
        messages = event.data;
    }

    try {
        messages = JSON.parse(messages);
    } catch (error) {
        // Not JSON, leave it as a string
    }

    console.log("Message:", messages);

    const chat = document.getElementById('chat');
    const message = document.createElement("p");
    message.innerText = messages;
    message.classList.add('message');
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
};


function openChat() {
    if (state === "close") {
        state= "open";
        document.getElementById("live-chat-window").style.visibility = "visible";
    }else{
        document.getElementById("live-chat-window").style.visibility = "hidden";
        state= "close";
    }
}