var SignInFormId;
(function (SignInFormId) {
    SignInFormId["EmailErrorMessage"] = "email-error-message";
    SignInFormId["EmailInput"] = "signin-email-input";
    SignInFormId["PasswordInput"] = "signin-password-input";
    SignInFormId["PasswordErrorMessage"] = "password-error-message";
    SignInFormId["Spinner"] = "signin-submit-spinner";
})(SignInFormId || (SignInFormId = {}));
var addErrorMessage = function (inputElement, errorMessageElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorMessageElement.innerText = errorMessage;
};
var removeErrorMessage = function (inputElement, errorMessageElement) {
    inputElement.classList.remove("is-invalid");
    errorMessageElement.innerText = "";
};
var validateEmail = function (emailAddress) {
    if (!emailAddress || emailAddress.trim().length <= 0) {
        return "Email is required.";
    }
    if (!emailAddress.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm)) {
        return "Email address is invalid.";
    }
};
var validatePassword = function (password) {
    if (!password || password.trim().length === 0) {
        return "Password is required.";
    }
};
var onEmailBlur = function (event) {
    var errorMessageDiv = document.getElementById(SignInFormId.EmailErrorMessage);
    if (!event.target || !errorMessageDiv) {
        return;
    }
    var emailInput = event.target;
    var value = emailInput.value;
    var errorMessage = validateEmail(value);
    if (errorMessage) {
        addErrorMessage(emailInput, errorMessageDiv, errorMessage);
    }
    else {
        removeErrorMessage(emailInput, errorMessageDiv);
    }
};
var onPasswordBlur = function (event) {
    var passwordErrorDiv = document.getElementById(SignInFormId.PasswordErrorMessage);
    var passwordInput = event.target;
    if (!passwordErrorDiv || !passwordInput) {
        return;
    }
    var errorMessage = validatePassword(passwordInput.value);
    if (errorMessage) {
        addErrorMessage(passwordInput, passwordErrorDiv, errorMessage);
        return;
    }
    removeErrorMessage(passwordInput, passwordErrorDiv);
};
var onSubmit = function (event) {
    var emailInput = document.getElementById(SignInFormId.EmailInput);
    var passwordInput = document.getElementById(SignInFormId.PasswordInput);
    var emailErrorDiv = document.getElementById(SignInFormId.EmailErrorMessage);
    var passwordErrorDiv = document.getElementById(SignInFormId.PasswordErrorMessage);
    if (!emailInput || !passwordInput) {
        return;
    }
    var emailErrorMessage = validateEmail(emailInput.value);
    var passwordErrorMessage = validatePassword(passwordInput.value);
    if (emailErrorMessage) {
        addErrorMessage(emailInput, emailErrorDiv, emailErrorMessage);
    }
    if (passwordErrorMessage) {
        addErrorMessage(passwordInput, passwordErrorDiv, passwordErrorMessage);
    }
    if (emailErrorMessage || passwordErrorMessage) {
        event.preventDefault();
    }
    var spinner = document.getElementById(SignInFormId.Spinner);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
};
