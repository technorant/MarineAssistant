import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const GROQ_API_KEY = "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";

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingContainer = document.getElementById('typing-container');
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
                // Append immediately for better UX
                appendMessageToUI('user', message);
                chatInput.value = '';
                
                // Save in background
                saveMessage('user', message).catch(err => console.warn("Firestore blocked by client:", err));
                
                // Generate AI response
                generateAIResponse(message);
            }
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const message = chip.textContent;
            if (currentUser) {
                appendMessageToUI('user', message);
                saveMessage('user', message).catch(err => console.warn("Firestore blocked by client:", err));
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

    function appendMessageToUI(sender, text, isTyping = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        if (isTyping) messageDiv.classList.add('typing-indicator');
        messageDiv.textContent = text;
        
        const container = isTyping ? typingContainer : chatMessages;
        container.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    async function generateAIResponse(userInput) {
        const startTime = Date.now();
        // Show typing indicator
        const typingIndicator = appendMessageToUI('ai', 'Thinking', true);

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "system",
                            content: "You are the BlueEconomy Marine Assistant. Provide extremely concise, precise, and direct answers. Avoid conversational filler or long introductions. Focus ONLY on marine topics: fishing, aquaculture, fish health, and maritime safety. If a query is unrelated, briefly decline and redirect to marine topics. Maximum length: 2-3 sentences."
                        },
                        {
                            role: "user",
                            content: userInput
                        }
                    ],
                    temperature: 0.5,
                    max_tokens: 200,
                    stream: false
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error("Groq API Detailed Error:", data);
                throw new Error(data.error?.message || `API request failed with status ${response.status}`);
            }

            const aiResponse = data.choices[0].message.content;

            // Ensure at least 2 seconds of "Thinking..." time
            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(0, 2000 - elapsedTime);

            setTimeout(() => {
                // Remove typing indicator
                typingIndicator.remove();
                
                // Show response in UI
                appendMessageToUI('ai', aiResponse);

                // Save in background
                if (currentUser) {
                    saveMessage('ai', aiResponse).catch(err => console.warn("Firestore blocked by client:", err));
                }
            }, delay);

        } catch (error) {
            console.error("Groq API Error:", error);
            typingIndicator.textContent = "Error: Could not connect to the AI service. Please try again later.";
            typingIndicator.classList.remove('typing-indicator');
        }
    }
});
