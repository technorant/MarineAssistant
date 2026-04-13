document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chips = document.querySelectorAll('.chip');

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                appendMessage('user', message);
                chatInput.value = '';
                generateAIResponse(message);
            }
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const message = chip.textContent;
            appendMessage('user', message);
            generateAIResponse(message);
        });
    });

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateAIResponse(userInput) {
        const input = userInput.toLowerCase();
        let response = "I'm not sure about that. Try asking about fishing safety, fish health, or feeding tips.";

        if (input.includes('fish dying')) {
            response = "Check oxygen levels and water temperature immediately. Low oxygen is a common cause of mass mortality. Consider testing for ammonia and nitrites too.";
        } else if (input.includes('safe')) {
            response = "Current maritime conditions for Coastal Kenya are moderate. Avoid deep waters today and keep a look out for rising swells.";
        } else if (input.includes('feed')) {
            response = "For aquaculture, ensure you are feeding 2-3% of body weight daily. Monitor consumption to avoid water quality issues from uneaten food.";
        } else if (input.includes('hello') || input.includes('hi')) {
            response = "Hello! I am your Antech AI Marine Assistant. How can I help you with your marine activities today?";
        }

        setTimeout(() => {
            appendMessage('ai', response);
        }, 1000);
    }
});
