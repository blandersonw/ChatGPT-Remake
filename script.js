const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let OPENAI_API_KEY;

(async () => {
    const configResponse = await fetch('config.json');
    const config = await configResponse.json();
    OPENAI_API_KEY = config.API_KEY;
})();

sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();

    if (message) {
        addMessage('user', message);
        userInput.value = '';

        const response = await callOpenAIApi(message);
        if (response) {
            addMessage('system', response);
        }
    }
});

function addMessage(role, text) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${role}-message`;
    messageElement.textContent = text;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;
}

async function callOpenAIApi(inputText) {
    const headers = {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        'model': 'gpt-3.5-turbo',
        'messages': [
            { 'role': 'system', 'content': 'You are ChatGPT.' },
            { 'role': 'user', 'content': inputText }
        ],
        'max_tokens': 300
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.choices[0].message.content;
        } else {
            console.error(`Error: ${response.status}\n${response.statusText}`);
            return `Error: ${response.status}\n${response.statusText}`;
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Error: Unable to connect to the API.';
    }
}
