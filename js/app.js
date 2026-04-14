import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// Global App logic
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initMobileNav();
    initSidebarToggle();
    
    // Attach logout to all logout buttons
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout(btn);
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
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.mobile-hamburger');
    const overlay = document.querySelector('.mobile-overlay');
    const closeBtn = document.querySelector('.mobile-close');
    
    if (!sidebar || !hamburger || !overlay) return;

    const closeNav = () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    };

    hamburger.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
    });

    overlay.addEventListener('click', closeNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    // Close on link click
    const navLinks = sidebar.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });
}

function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('#sidebar-toggle');
    
    if (!sidebar || !toggleBtn) return;

    // Load persisted state
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    });
}

async function logout(btnElement = null) {
    let originalContent = '';
    try {
        if (btnElement) {
            btnElement.disabled = true;
            originalContent = btnElement.innerHTML;
            btnElement.textContent = 'Logging out...';
            
            // Wait for 2 seconds as requested
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        await signOut(auth);
        localStorage.removeItem('antech_user');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
        if (btnElement) {
            btnElement.disabled = false;
            btnElement.innerHTML = originalContent;
        }
    }
}

// Export for use in other modules if needed
export { logout };
