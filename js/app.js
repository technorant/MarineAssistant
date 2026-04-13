// Global App logic
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initMobileNav();
});

function checkAuth() {
    const publicPages = ['index.html', 'login.html', 'register.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    const user = JSON.parse(localStorage.getItem('antech_user'));

    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
    } else if (user && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'dashboard.html';
    }
}

function initMobileNav() {
    // Logic for hamburger menu if added later
}

function logout() {
    localStorage.removeItem('antech_user');
    window.location.href = 'index.html';
}
