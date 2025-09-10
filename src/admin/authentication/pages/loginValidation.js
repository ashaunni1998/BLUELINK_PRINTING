
export const LOGIN_VALIDATION = (loginData, setError) => {
    // Reset all errors first
    setError({
        emailError: '',
        passwordError: ''
    });

    let isValid = true;

    // Email validation
    if (!loginData.email) {
        setError(prev => ({ ...prev, emailError: 'Email is required' }));
        isValid = false;
    } else if (!loginData.email.trim()) {
        setError(prev => ({ ...prev, emailError: 'Email cannot be empty' }));
        isValid = false;
    } else {
        // Email format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(loginData.email.trim())) {
            setError(prev => ({ ...prev, emailError: 'Please enter a valid email address' }));
            isValid = false;
        }
    }

    // Password validation
    if (!loginData.password) {
        setError(prev => ({ ...prev, passwordError: 'Password is required' }));
        isValid = false;
    } else if (loginData.password.length < 8) {
        setError(prev => ({ ...prev, passwordError: 'Password must be at least 8 characters long' }));
        isValid = false;
    } else if (loginData.password.length > 100) {
        setError(prev => ({ ...prev, passwordError: 'Password cannot exceed 100 characters' }));
        isValid = false;
    } else if (!/(?=.*[a-zA-Z])/.test(loginData.password)) {
        setError(prev => ({ ...prev, passwordError: 'Password must contain at least one letter' }));
        isValid = false;
    }

    return isValid;
};
    