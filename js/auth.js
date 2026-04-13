import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                localStorage.setItem('antech_user', JSON.stringify({ email: user.email }));
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error("Login Error:", error.code, error.message);
                alert(error.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const confirmPassword = e.target['confirm-password'].value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                localStorage.setItem('antech_user', JSON.stringify({ email: user.email }));
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error("Registration Error:", error.code, error.message);
                alert(error.message);
            }
        });
    }
});
