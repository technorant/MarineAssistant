import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chips = document.querySelectorAll('.chip');

    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadMessages();
        }
    });

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message && currentUser) {
                await saveMessage('user', message);
                chatInput.value = '';
                generateAIResponse(message);
            }
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const message = chip.textContent;
            if (currentUser) {
                saveMessage('user', message);
                generateAIResponse(message);
            }
        });
    });

    async function saveMessage(sender, text) {
        try {
            await addDoc(collection(db, "messages"), {
                uid: currentUser.uid,
                sender: sender,
                text: text,
                timestamp: serverTimestamp()
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    function loadMessages() {
        const q = query(
            collection(db, "messages"),
            where("uid", "==", currentUser.uid),
            orderBy("timestamp", "asc")
        );

        onSnapshot(q, (snapshot) => {
            chatMessages.innerHTML = '';
            snapshot.forEach((doc) => {
                const msg = doc.data();
                appendMessageToUI(msg.sender, msg.text);
            });
        });
    }

    function appendMessageToUI(sender, text) {
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
            if (currentUser) {
                saveMessage('ai', response);
            }
        }, 1000);
    }
});
