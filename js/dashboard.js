import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const displayNameElement = document.getElementById('display-name');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const email = user.email;
            const name = email.split('@')[0];
            
            if (userNameElement) userNameElement.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            if (userEmailElement) userEmailElement.textContent = email;
            if (displayNameElement) displayNameElement.textContent = name.toUpperCase();
        }
    });

    // Safety simulation logic for safety page
    const safetyStatus = document.getElementById('safety-status');
    const safetyIndicator = document.getElementById('safety-indicator');
    const safetyAdvice = document.getElementById('safety-advice');

    if (safetyStatus) {
        const statuses = [
            { label: 'Safe', color: '#00c851', advice: 'Conditions are perfect for marine activities. Enjoy your trip!' },
            { label: 'Moderate', color: '#ffbb33', advice: 'Conditions are stable but exercise caution in deep waters. Keep your life jacket on.' },
            { label: 'Dangerous', color: '#ff4444', advice: 'Severe weather warnings. It is highly recommended to stay on shore today.' }
        ];

        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        safetyStatus.textContent = randomStatus.label;
        safetyStatus.style.color = randomStatus.color;
        safetyIndicator.style.backgroundColor = randomStatus.color;
        safetyAdvice.textContent = randomStatus.advice;
    }
});
