export const validateEmail = (email) => {
    if (!email) {
        return 'Email is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Invalid email format.';
    }
    return null;
};

export const validatePassword = (password, minLength = 6) => {
    if (!password) {
        return 'Password is required.';
    }
    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters.`;
    }
    return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Confirm password is required.';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match.';
    }
    return null;
};

export const validateRequired = (value, fieldName = 'Field') => {
    if (!value || value.trim() === '') {
        return `${fieldName} is required.`;
    }
    return null;
};
export const validateDateInFuture = (dateString, fieldName = 'Date') => {
    if (!dateString) {
        return `${fieldName} is required.`;
    }
    const inputDate = new Date(dateString);
    const now = new Date();
    
    inputDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (isNaN(inputDate.getTime())) {
        return `Invalid ${fieldName} format.`;
    }
    if (inputDate < now) {
        return `${fieldName} must be in the future.`;
    }
    return null;
};
