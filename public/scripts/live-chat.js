// Connect to WebSocket server
var state = "close"

const ip = localStorage.getItem('ip')

const ws = new WebSocket(`ws://${ip}:8080`);

function getUsername() {
    try{
        let data = localStorage.getItem('userObject');
        data = JSON.parse(data)
        console.log(data)
        console.log(data[0])
        return data[0]
    }catch(e){
        console.log(e)
        return "Anonymus";
    }
}

const username = getUsername();

ws.onopen = function () {
    ws.readyState = WebSocket.OPEN;
}

// Send message to WebSocket server
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    if (message.toLocaleLowerCase().includes("äuä")) {
        // Retrieve the 'unlockedTheme' from localStorage
        let theme = localStorage.getItem('unlockedTheme');
        if (theme) {
            theme = JSON.parse(theme);
        } else {
            theme = [];
        }
        if (!theme.includes("Schweiz")) {
            theme.push("Schweiz");
        }
        localStorage.setItem('unlockedTheme', JSON.stringify(theme));
    }
    if (message) {
        ws.send(username+": "+ message);  // Send message to the WebSocket server
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
    if (messages.includes(username)) {
        message.classList.add('message');
        message.classList.add('self');
    }else {
        message.classList.add('message');
    }
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