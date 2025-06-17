// client/src/utils/validation.js

/**
 * @function validateEmail
 * @description Validates an email address format.
 * @param {string} email - The email string to validate.
 * @returns {string|null} - Error message if invalid, null otherwise.
 */
export const validateEmail = (email) => {
    if (!email) {
        return 'Email is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Invalid email format.';
    }
    return null;
};

/**
 * @function validatePassword
 * @description Validates a password's length.
 * @param {string} password - The password string to validate.
 * @param {number} minLength - Minimum required length.
 * @returns {string|null} - Error message if invalid, null otherwise.
 */
export const validatePassword = (password, minLength = 6) => {
    if (!password) {
        return 'Password is required.';
    }
    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters.`;
    }
    return null;
};

/**
 * @function validateConfirmPassword
 * @description Validates if two passwords match.
 * @param {string} password - The first password.
 * @param {string} confirmPassword - The second password to compare.
 * @returns {string|null} - Error message if they don't match, null otherwise.
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Confirm password is required.';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match.';
    }
    return null;
};

/**
 * @function validateRequired
 * @description Checks if a field is empty.
 * @param {string} value - The value to check.
 * @param {string} fieldName - The name of the field (for error message).
 * @returns {string|null} - Error message if empty, null otherwise.
 */
export const validateRequired = (value, fieldName = 'Field') => {
    if (!value || value.trim() === '') {
        return `${fieldName} is required.`;
    }
    return null;
};

/**
 * @function validateDateInFuture
 * @description Validates if a given date string is in the future.
 * @param {string} dateString - The date string to validate (e.g., 'YYYY-MM-DD').
 * @param {string} fieldName - The name of the date field.
 * @returns {string|null} - Error message if invalid or not in future, null otherwise.
 */
export const validateDateInFuture = (dateString, fieldName = 'Date') => {
    if (!dateString) {
        return `${fieldName} is required.`;
    }
    const inputDate = new Date(dateString);
    const now = new Date();
    // Set hours, minutes, seconds, milliseconds to 0 for accurate date comparison
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
