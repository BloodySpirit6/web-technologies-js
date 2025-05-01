document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const cities = {
        'Ukraine': ['Kyiv', 'Lviv', 'Kharkiv', 'Odesa', 'Chernivtsi'],
        'Poland': ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan'],
        'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
        'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice']
    };

    document.getElementById('togglePassword').addEventListener('click', function() {
        togglePasswordVisibility('password', this);
    });

    document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
        togglePasswordVisibility('confirmPassword', this);
    });

    document.getElementById('country').addEventListener('change', function() {
        const citySelect = document.getElementById('city');
        citySelect.innerHTML = '<option value="">Select City</option>';
        citySelect.disabled = !this.value;

        if (this.value) {
            cities[this.value].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }

        validateField('country', this.value);
    });

    document.getElementById('firstName').addEventListener('input', function() {
        validateField('firstName', this.value.trim());
    });

    document.getElementById('lastName').addEventListener('input', function() {
        validateField('lastName', this.value.trim());
    });

    document.getElementById('email').addEventListener('input', function() {
        validateField('email', this.value.trim());
    });

    document.getElementById('password').addEventListener('input', function() {
        validateField('password', this.value);
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (confirmPassword) {
            validateField('confirmPassword', confirmPassword);
        }
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
        validateField('confirmPassword', this.value);
    });

    document.getElementById('phone').addEventListener('input', function() {
        validateField('phone', this.value.trim());
    });

    document.getElementById('birthDate').addEventListener('change', function() {
        validateField('birthDate', this.value);
    });

    document.querySelectorAll('input[name="sex"]').forEach(radio => {
        radio.addEventListener('change', function() {
            validateField('sex', document.querySelector('input[name="sex"]:checked')?.value);
        });
    });

    document.getElementById('city').addEventListener('change', function() {
        validateField('city', this.value);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isFirstNameValid = validateField('firstName', document.getElementById('firstName').value.trim());
        const isLastNameValid = validateField('lastName', document.getElementById('lastName').value.trim());
        const isEmailValid = validateField('email', document.getElementById('email').value.trim());
        const isPasswordValid = validateField('password', document.getElementById('password').value);
        const isConfirmPasswordValid = validateField('confirmPassword', document.getElementById('confirmPassword').value);
        const isPhoneValid = validateField('phone', document.getElementById('phone').value.trim());
        const isBirthDateValid = validateField('birthDate', document.getElementById('birthDate').value);
        const isSexValid = validateField('sex', document.querySelector('input[name="sex"]:checked')?.value);
        const isCountryValid = validateField('country', document.getElementById('country').value);
        const isCityValid = validateField('city', document.getElementById('city').value);

        if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid &&
            isConfirmPasswordValid && isPhoneValid && isBirthDateValid &&
            isSexValid && isCountryValid && isCityValid) {

            setTimeout(() => {
                successMessage.classList.add('active');
                form.reset();
                document.getElementById('city').disabled = true;

                setTimeout(() => {
                    successMessage.classList.remove('active');
                }, 3000);
            }, 500);
        }
    });

    function togglePasswordVisibility(fieldId, toggleElement) {
        const field = document.getElementById(fieldId);
        if (field.type === 'password') {
            field.type = 'text';
            toggleElement.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
            field.type = 'password';
            toggleElement.innerHTML = '<i class="far fa-eye"></i>';
        }
    }

    function validateField(fieldName, value) {
        const fieldElement = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        let isValid = false;
        let errorMessage = '';

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = 'This field is required';
                } else if (value.length < 3 || value.length > 15) {
                    errorMessage = 'Must be between 3 and 15 characters';
                } else {
                    isValid = true;
                }
                break;

            case 'email':
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if (!value) {
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Invalid email format';
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

            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (!value) {
                    errorMessage = 'Please confirm your password';
                } else if (value !== password) {
                    errorMessage = 'Passwords do not match';
                } else {
                    isValid = true;
                }
                break;

            case 'phone':
                const phoneRegex = /^\+380\d{9}$/;
                if (!value) {
                    errorMessage = 'Phone is required';
                } else if (!phoneRegex.test(value)) {
                    errorMessage = 'Invalid phone format (must start with +380)';
                } else {
                    isValid = true;
                }
                break;

            case 'birthDate':
                if (!value) {
                    errorMessage = 'Date of Birth is required';
                } else {
                    const today = new Date();
                    const birthDateObj = new Date(value);
                    let age = today.getFullYear() - birthDateObj.getFullYear();
                    const monthDiff = today.getMonth() - birthDateObj.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
                        age--;
                    }

                    if (birthDateObj > today) {
                        errorMessage = 'Date cannot be in the future';
                    } else if (age < 12) {
                        errorMessage = 'You must be at least 12 years old to register';
                    } else {
                        isValid = true;
                    }
                }
                break;

            case 'sex':
                if (!value) {
                    errorMessage = 'Gender is required';
                } else {
                    isValid = true;
                }
                break;

            case 'country':
                if (!value) {
                    errorMessage = 'Country is required';
                } else {
                    isValid = true;
                }
                break;

            case 'city':
                if (!value) {
                    errorMessage = 'City is required';
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