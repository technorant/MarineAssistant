document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('antech_user'));
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');

    if (userNameElement && user) {
        userNameElement.textContent = user.email.split('@')[0];
    }

    if (userEmailElement && user) {
        userEmailElement.textContent = user.email;
    }

    const displayNameElement = document.getElementById('display-name');
    if (displayNameElement && user) {
        displayNameElement.textContent = user.email.split('@')[0].toUpperCase();
    }

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
