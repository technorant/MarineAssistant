import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const setLoading = (button, text, isLoading) => {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = text;
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText;
        }
    };

    if (loginForm) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            setLoading(submitBtn, 'Logging in...', true);

            try {
                // Wait for 2 seconds to simulate loading as requested
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                localStorage.setItem('antech_user', JSON.stringify({ email: user.email }));
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error("Login Error:", error.code, error.message);
                alert(error.message);
                setLoading(submitBtn, '', false);
            }
        });
    }

    if (registerForm) {
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const confirmPassword = e.target['confirm-password'].value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            setLoading(submitBtn, 'Creating account...', true);

            try {
                // Wait for 2 seconds to simulate loading as requested
                await new Promise(resolve => setTimeout(resolve, 2000));

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                localStorage.setItem('antech_user', JSON.stringify({ email: user.email }));
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error("Registration Error:", error.code, error.message);
                alert(error.message);
                setLoading(submitBtn, '', false);
            }
        });
    }
});
