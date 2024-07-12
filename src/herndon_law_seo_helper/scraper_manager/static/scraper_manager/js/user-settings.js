"use strict";
/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">
/// <reference path="./api/put-user-settings.ts">
/// <reference path="./toaster.ts">
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var UserSettingsId;
(function (UserSettingsId) {
    UserSettingsId["usernameEmailForm"] = "user-settings-username-email-form";
    UserSettingsId["changeUsernameEmailButton"] = "user-settings-change-username-email-button";
    UserSettingsId["emailErrorMessage"] = "user-settings-email-error-message";
    UserSettingsId["emailInput"] = "user-settings-email-input";
    UserSettingsId["usernameEmailSpinner"] = "user-settings-username-email-spinner";
    UserSettingsId["usernameInput"] = "user-settings-username-input";
    UserSettingsId["usernameErrorMessage"] = "user-settings-username-error-message";
    UserSettingsId["existingUsernameValue"] = "user-settings-existing-username-value";
    UserSettingsId["usernameEmailReadMode"] = "user-settings-username-email-read-mode";
    UserSettingsId["existingEmailValue"] = "user-settings-existing-email-value";
    UserSettingsId["passwordReadMode"] = "user-settings-change-password-read-mode";
    UserSettingsId["passwordForm"] = "user-settings-password-form";
    UserSettingsId["passwordInput"] = "user-settings-password-input";
    UserSettingsId["confirmPasswordInput"] = "user-settings-confirm-password-input";
    UserSettingsId["passwordErrorMessage"] = "user-settings-password-error-message";
    UserSettingsId["confirmPasswordErrorMessage"] = "user-settings-confirm-password-error-message";
    UserSettingsId["passwordSpinner"] = "user-settings-password-spinner";
    UserSettingsId["existingPasswordValue"] = "user-settings-password-message";
    UserSettingsId["navbarUsername"] = "navbar-username";
})(UserSettingsId || (UserSettingsId = {}));
const onChangeUsernameEmailClick = () => {
    const usernameEmailForm = document.getElementById(UserSettingsId.usernameEmailForm);
    const usernameEmailReadMode = document.getElementById(UserSettingsId.usernameEmailReadMode);
    usernameEmailForm === null || usernameEmailForm === void 0 ? void 0 : usernameEmailForm.classList.remove("d-none");
    usernameEmailReadMode === null || usernameEmailReadMode === void 0 ? void 0 : usernameEmailReadMode.classList.add("d-none");
};
const onChangeUsernameEmailCancel = () => {
    const usernameEmailForm = document.getElementById(UserSettingsId.usernameEmailForm);
    const readMode = document.getElementById(UserSettingsId.usernameEmailReadMode);
    usernameEmailForm === null || usernameEmailForm === void 0 ? void 0 : usernameEmailForm.classList.add("d-none");
    readMode === null || readMode === void 0 ? void 0 : readMode.classList.remove("d-none");
};
const onChangeEmailBlur = () => {
    const emailInput = document.getElementById(UserSettingsId.emailInput);
    const emailValue = emailInput.value;
    const emailErrorMessage = document.getElementById(UserSettingsId.emailErrorMessage);
    const errorMessage = validateEmail(emailValue);
    if (errorMessage) {
        addErrorMessage(emailInput, emailErrorMessage, errorMessage);
        return { isValid: false, value: emailValue };
    }
    removeErrorMessage(emailInput, emailErrorMessage);
    return { isValid: true, value: emailValue };
};
const onChangeUsernameBlur = () => {
    const userInput = document.getElementById(UserSettingsId.usernameInput);
    const userErrorMessageDiv = document.getElementById(UserSettingsId.usernameErrorMessage);
    if (!userInput || !userErrorMessageDiv) {
        return { isValid: false };
    }
    const usernameErrorMessage = validateUsername(userInput.value);
    if (usernameErrorMessage) {
        addErrorMessage(userInput, userErrorMessageDiv, usernameErrorMessage);
    }
    else {
        removeErrorMessage(userInput, userErrorMessageDiv);
    }
    return {
        isValid: usernameErrorMessage == null,
        value: userInput.value,
    };
};
const onUsernameEmailSave = () => __awaiter(void 0, void 0, void 0, function* () {
    const { isValid: isEmailValid, value: emailValue } = onChangeEmailBlur();
    const { isValid: isUsernameValid, value: usernameValue } = onChangeUsernameBlur();
    const spinner = document.getElementById(UserSettingsId.usernameEmailSpinner);
    const csrfToken = getCsrfToken();
    if (!isEmailValid || !isUsernameValid || !csrfToken) {
        return;
    }
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
    const response = yield putUserSettings({
        username: usernameValue,
        email: emailValue,
    }, csrfToken);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.add("d-none");
    if (response.isError) {
        createErrorToaster("Unable to save user data", "Unable to save username or email");
        return;
    }
    createSuccessToaster("Successfully saved user data", "Saved updated username and email");
    const existingEmailValue = document.getElementById(UserSettingsId.existingEmailValue);
    const existingUsernameValue = document.getElementById(UserSettingsId.existingUsernameValue);
    const navbarUsername = document.getElementById(UserSettingsId.navbarUsername);
    if (!existingEmailValue || !existingUsernameValue || !navbarUsername) {
        return;
    }
    existingEmailValue.innerText = emailValue !== null && emailValue !== void 0 ? emailValue : "";
    existingUsernameValue.innerText = usernameValue !== null && usernameValue !== void 0 ? usernameValue : "";
    navbarUsername.innerText = usernameValue !== null && usernameValue !== void 0 ? usernameValue : "";
    onChangeUsernameEmailCancel();
});
const onChangePasswordClick = () => {
    const passwordReadMode = document.getElementById(UserSettingsId.passwordReadMode);
    const passwordForm = document.getElementById(UserSettingsId.passwordForm);
    passwordReadMode === null || passwordReadMode === void 0 ? void 0 : passwordReadMode.classList.add("d-none");
    passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.remove("d-none");
};
const onChangePasswordCancel = () => {
    const passwordReadMode = document.getElementById(UserSettingsId.passwordReadMode);
    const passwordForm = document.getElementById(UserSettingsId.passwordForm);
    passwordReadMode === null || passwordReadMode === void 0 ? void 0 : passwordReadMode.classList.remove("d-none");
    passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.add("d-none");
};
const fetchUserSettingsPasswordElements = () => {
    const passwordInput = document.getElementById(UserSettingsId.passwordInput);
    const passwordErrorDiv = document.getElementById(UserSettingsId.passwordErrorMessage);
    const confirmPasswordInput = document.getElementById(UserSettingsId.confirmPasswordInput);
    const confirmPasswordErrorDiv = document.getElementById(UserSettingsId.confirmPasswordErrorMessage);
    return {
        passwordInput,
        passwordErrorDiv,
        confirmPasswordInput,
        confirmPasswordErrorDiv,
    };
};
const onChangePasswordBlur = () => {
    const passwordElements = fetchUserSettingsPasswordElements();
    const passwordValue = passwordElements.passwordInput.value;
    const confirmPasswordValue = passwordElements.confirmPasswordInput.value;
    const passwordErrorMessages = validatePasswords(passwordValue, confirmPasswordValue);
    updatePasswordErrorMessages(passwordElements, passwordErrorMessages);
    const passwordField = {
        isValid: !(passwordErrorMessages === null || passwordErrorMessages === void 0 ? void 0 : passwordErrorMessages.passwordError),
        value: passwordValue,
    };
    const confirmPasswordField = {
        isValid: !(passwordErrorMessages === null || passwordErrorMessages === void 0 ? void 0 : passwordErrorMessages.confirmPasswordError),
        value: confirmPasswordValue,
    };
    return {
        password: passwordField,
        confirmPassword: confirmPasswordField,
    };
};
const onChangePasswordSave = () => {
    const { password, confirmPassword } = onChangePasswordBlur();
    if (!password.isValid || !confirmPassword.isValid) {
        return;
    }
    const existingPasswordValue = document.getElementById(UserSettingsId.existingPasswordValue);
    if (existingPasswordValue) {
        existingPasswordValue.innerText = "**********";
    }
    onChangePasswordCancel();
};
