"use strict";
var SignInFormId;
(function (SignInFormId) {
    SignInFormId["EmailErrorMessage"] = "email-error-message";
    SignInFormId["EmailInput"] = "signin-email-input";
    SignInFormId["PasswordInput"] = "signin-password-input";
    SignInFormId["PasswordErrorMessage"] = "password-error-message";
    SignInFormId["Spinner"] = "signin-submit-spinner";
})(SignInFormId || (SignInFormId = {}));
const addErrorMessage = (inputElement, errorMessageElement, errorMessage) => {
    inputElement.classList.add("is-invalid");
    errorMessageElement.innerText = errorMessage;
};
const removeErrorMessage = (inputElement, errorMessageElement) => {
    inputElement.classList.remove("is-invalid");
    errorMessageElement.innerText = "";
};
const validateEmail = (emailAddress) => {
    if (!emailAddress || emailAddress.trim().length <= 0) {
        return "Email is required.";
    }
    if (!emailAddress.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm)) {
        return "Email address is invalid.";
    }
};
const validatePassword = (password) => {
    if (!password || password.length === 0) {
        return "Password is required.";
    }
};
const onEmailBlur = (event) => {
    const errorMessageDiv = document.getElementById(SignInFormId.EmailErrorMessage);
    if (!event.target || !errorMessageDiv) {
        return;
    }
    const emailInput = event.target;
    const value = emailInput.value;
    const errorMessage = validateEmail(value);
    if (errorMessage) {
        addErrorMessage(emailInput, errorMessageDiv, errorMessage);
    }
    else {
        removeErrorMessage(emailInput, errorMessageDiv);
    }
};
const onPasswordBlur = (event) => {
    const passwordErrorDiv = document.getElementById(SignInFormId.PasswordErrorMessage);
    const passwordInput = event.target;
    if (!passwordErrorDiv || !passwordInput) {
        return;
    }
    const errorMessage = validatePassword(passwordInput.value);
    if (errorMessage) {
        addErrorMessage(passwordInput, passwordErrorDiv, errorMessage);
        return;
    }
    removeErrorMessage(passwordInput, passwordErrorDiv);
};
const onSubmit = (event) => {
    const emailInput = document.getElementById(SignInFormId.EmailInput);
    const passwordInput = document.getElementById(SignInFormId.PasswordInput);
    const emailErrorDiv = document.getElementById(SignInFormId.EmailErrorMessage);
    const passwordErrorDiv = document.getElementById(SignInFormId.PasswordErrorMessage);
    if (!emailInput || !passwordInput) {
        return;
    }
    const emailErrorMessage = validateEmail(emailInput.value);
    const passwordErrorMessage = validatePassword(passwordInput.value);
    if (emailErrorMessage) {
        addErrorMessage(emailInput, emailErrorDiv, emailErrorMessage);
    }
    if (passwordErrorMessage) {
        addErrorMessage(passwordInput, passwordErrorDiv, passwordErrorMessage);
    }
    if (emailErrorMessage || passwordErrorMessage) {
        event.preventDefault();
        return;
    }
    const spinner = document.getElementById(SignInFormId.Spinner);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
};
