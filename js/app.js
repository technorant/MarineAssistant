import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// Global App logic
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initMobileNav();
    
    // Attach logout to all logout buttons
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
});

function checkAuth() {
    const publicPages = ['index.html', 'login.html', 'register.html', ''];
    const currentPage = window.location.pathname.split('/').pop();

    onAuthStateChanged(auth, (user) => {
        if (!user && !publicPages.includes(currentPage)) {
            window.location.href = 'login.html';
        } else if (user && (currentPage === 'login.html' || currentPage === 'register.html')) {
            window.location.href = 'dashboard.html';
        }
        
        if (user) {
            localStorage.setItem('antech_user', JSON.stringify({ email: user.email }));
        } else {
            localStorage.removeItem('antech_user');
        }
    });
}

function initMobileNav() {
    // Logic for hamburger menu if added later
}

async function logout() {
    try {
        await signOut(auth);
        localStorage.removeItem('antech_user');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// Export for use in other modules if needed
export { logout };
