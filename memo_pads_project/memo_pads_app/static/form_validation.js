const usernameInput = document.getElementById('user_name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const pwdRequirements = document.getElementById('pwd-requirements');
const lowercase = document.getElementById('lowercase');
const uppercase = document.getElementById('uppercase');
const number = document.getElementById('number');
const length = document.getElementById('length');
const registerButton = document.getElementById('register-button');

usernameInput.addEventListener('input', validateUsername);
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);

function validateUsername() {
    const isValid = usernameInput.value.length >= 3;
    usernameInput.style.backgroundColor = isValid ? 'green' : 'red';
    validateRegisterButton();
}

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(emailInput.value);
    emailInput.style.backgroundColor = isValid ? 'green' : 'red';
    validateRegisterButton();
}

function validatePassword() {
    pwdRequirements.removeAttribute('hidden');
    const password = passwordInput.value;

    lowercase.style.color = /[a-z]/.test(password) ? 'green' : 'red';
    uppercase.style.color = /[A-Z]/.test(password) ? 'green' : 'red';
    number.style.color = /\d/.test(password) ? 'green' : 'red';
    length.style.color = password.length >= 8 ? 'green' : 'red';
    validateRegisterButton();
}

function validateRegisterButton() {
    const isValidUsername = usernameInput.value.length >= 3;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    const isValidPassword = /[a-z]/.test(passwordInput.value) &&
                            /[A-Z]/.test(passwordInput.value) &&
                            /\d/.test(passwordInput.value) &&
                            passwordInput.value.length >= 8;

    registerButton.disabled = !(isValidUsername && isValidEmail && isValidPassword);
}