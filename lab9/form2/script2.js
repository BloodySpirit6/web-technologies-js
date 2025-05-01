document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const successMessage = document.getElementById('successMessage');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            this.innerHTML = '<i class="far fa-eye"></i>';
        }
    });

    document.getElementById('username').addEventListener('input', function() {
        validateField('username', this.value.trim());
    });

    document.getElementById('password').addEventListener('input', function() {
        validateField('password', this.value);
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        const isUsernameValid = validateField('username', username);
        const isPasswordValid = validateField('password', password);

        if (isUsernameValid && isPasswordValid) {
            console.log('Login data:', { username, password, rememberMe });

            successMessage.classList.add('active');

            setTimeout(() => {
                loginForm.reset();
                successMessage.classList.remove('active');
            }, 3000);
        }
    });

    function validateField(fieldName, value) {
        const fieldElement = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        let isValid = false;
        let errorMessage = '';

        switch (fieldName) {
            case 'username':
                if (!value) {
                    errorMessage = 'Username is required';
                } else {
                    isValid = true;
                }
                break;

            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                } else if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters';
                } else {
                    isValid = true;
                }
                break;
        }

        if (fieldElement) {
            if (value === '') {
                fieldElement.classList.remove('valid', 'invalid');
            } else {
                fieldElement.classList.toggle('valid', isValid);
                fieldElement.classList.toggle('invalid', !isValid);
            }
        }
        errorElement.textContent = errorMessage;

        return isValid;
    }
});