import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const googleLoginBtn = document.getElementById('google-login');
    const googleRegisterBtn = document.getElementById('google-register');

    const provider = new GoogleAuthProvider();

    const setLoading = (button, text, isLoading) => {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `
                <svg class="animate-spin" viewBox="0 0 24 24" fill="none" style="width: 18px; height: 18px; margin-right: 8px; display: inline-block; vertical-align: middle;">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${text}
            `;
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText;
        }
    };

    const handleGoogleAuth = async (button) => {
        setLoading(button, 'Connecting...', true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem('antech_user', JSON.stringify({ 
                email: user.email,
                name: user.displayName,
                photo: user.photoURL 
            }));
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Google Auth Error:", error.code, error.message);
            alert(error.message);
            setLoading(button, '', false);
        }
    };

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => handleGoogleAuth(googleLoginBtn));
    }

    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', () => handleGoogleAuth(googleRegisterBtn));
    }

    if (loginForm) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            setLoading(submitBtn, 'Logging in...', true);

            try {
                // Wait for 1 second to simulate loading
                await new Promise(resolve => setTimeout(resolve, 1000));
                
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
                // Wait for 1 second to simulate loading
                await new Promise(resolve => setTimeout(resolve, 1000));

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
