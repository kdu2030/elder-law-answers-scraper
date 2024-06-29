"use strict";
/// <reference path="./sign-in.ts">
/// <reference path="./api/post-ela-settings.ts">
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ElaSettingsIds;
(function (ElaSettingsIds) {
    ElaSettingsIds["emailForm"] = "ela-email-form";
    ElaSettingsIds["changeEmailButton"] = "ela-change-email-button";
    ElaSettingsIds["emailErrorMessage"] = "ela-email-error-message";
    ElaSettingsIds["emailInput"] = "ela-email-input";
    ElaSettingsIds["elaEmailSpinner"] = "ela-email-spinner";
    ElaSettingsIds["changeEmailReadMode"] = "ela-change-email-read-mode";
    ElaSettingsIds["existingEmailValue"] = "ela-existing-email-value";
    ElaSettingsIds["changePasswordReadMode"] = "ela-change-password-read-mode";
    ElaSettingsIds["passwordForm"] = "ela-password-form";
    ElaSettingsIds["passwordInput"] = "ela-password-input";
    ElaSettingsIds["confirmPasswordInput"] = "ela-confirm-password-input";
    ElaSettingsIds["passwordErrorMessage"] = "ela-password-error-message";
    ElaSettingsIds["confirmPasswordErrorMessage"] = "ela-confirm-password-error-message";
})(ElaSettingsIds || (ElaSettingsIds = {}));
const csrfTokenName = "csrfmiddlewaretoken";
const onChangeEmailClick = () => {
    const emailForm = document.getElementById(ElaSettingsIds.emailForm);
    const changeEmailReadMode = document.getElementById(ElaSettingsIds.changeEmailReadMode);
    if (!emailForm || !changeEmailReadMode) {
        return;
    }
    changeEmailReadMode.classList.add("d-none");
    emailForm.classList.remove("d-none");
};
const onEmailCancelClick = () => {
    const emailForm = document.getElementById(ElaSettingsIds.emailForm);
    const changeEmailReadMode = document.getElementById(ElaSettingsIds.changeEmailReadMode);
    if (!emailForm || !changeEmailReadMode) {
        return;
    }
    changeEmailReadMode.classList.remove("d-none");
    emailForm.classList.add("d-none");
};
const onElaEmailBlur = (event) => {
    const errorMessageDiv = document.getElementById(ElaSettingsIds.emailErrorMessage);
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
const onElaEmailSave = () => __awaiter(void 0, void 0, void 0, function* () {
    const emailInput = document.getElementById(ElaSettingsIds.emailInput);
    const emailErrorMessageDiv = document.getElementById(ElaSettingsIds.emailErrorMessage);
    const csrfTokenInput = document.getElementsByName(csrfTokenName)[0];
    const csrfToken = csrfTokenInput === null || csrfTokenInput === void 0 ? void 0 : csrfTokenInput.value;
    if (!emailInput || !emailErrorMessageDiv || !csrfToken) {
        return;
    }
    const errorMessage = validateEmail(emailInput.value);
    if (errorMessage) {
        addErrorMessage(emailInput, emailErrorMessageDiv, errorMessage);
        return;
    }
    removeErrorMessage(emailInput, emailErrorMessageDiv);
    const spinner = document.getElementById(ElaSettingsIds.elaEmailSpinner);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
    const response = yield postElaSettings({ email: emailInput.value }, csrfToken);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.add("d-none");
    if (response.isError) {
        // @ts-ignore
        createErrorToaster("Unable to save data", "Unable to save Elder Law Answers username");
        return;
    }
    // @ts-ignore
    createSuccessToaster("Data saved successfully", "Elder Law Answers username changed");
    const existingEmailValue = document.getElementById(ElaSettingsIds.existingEmailValue);
    if (existingEmailValue) {
        existingEmailValue.innerText = emailInput.value;
    }
    onEmailCancelClick();
});
const onElaPasswordClick = () => {
    const passwordReadMode = document.getElementById(ElaSettingsIds.changePasswordReadMode);
    const passwordEditMode = document.getElementById(ElaSettingsIds.passwordForm);
    if (!passwordReadMode || !passwordEditMode) {
        return;
    }
    passwordReadMode.classList.add("d-none");
    passwordEditMode.classList.remove("d-none");
};
const onElaPasswordCancel = () => {
    const passwordReadMode = document.getElementById(ElaSettingsIds.changePasswordReadMode);
    const passwordEditMode = document.getElementById(ElaSettingsIds.passwordForm);
    if (!passwordReadMode || !passwordEditMode) {
        return;
    }
    passwordReadMode.classList.remove("d-none");
    passwordEditMode.classList.add("d-none");
};
const validatePasswords = (password, confirmPassword) => {
    const passwordError = validatePassword(password);
    if (passwordError) {
        return { passwordError };
    }
    if (!confirmPassword || confirmPassword.length === 0) {
        return { confirmPasswordError: "Please confirm your password" };
    }
    if (password !== confirmPassword) {
        return { confirmPasswordError: "Passwords do not match." };
    }
};
const updatePasswordErrorMessages = (passwordElements, errorMessages) => {
    const { passwordInput, passwordErrorDiv, confirmPasswordErrorDiv, confirmPasswordInput, } = passwordElements;
    if (errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.passwordError) {
        addErrorMessage(passwordInput, passwordErrorDiv, errorMessages.passwordError);
    }
    else {
        removeErrorMessage(passwordInput, passwordErrorDiv);
    }
    if (errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.confirmPasswordError) {
        addErrorMessage(confirmPasswordInput, confirmPasswordErrorDiv, errorMessages.confirmPasswordError);
    }
    else {
        removeErrorMessage(confirmPasswordInput, confirmPasswordErrorDiv);
    }
};
const fetchPasswordElements = () => {
    const passwordInput = document.getElementById(ElaSettingsIds.passwordInput);
    const passwordErrorDiv = document.getElementById(ElaSettingsIds.passwordErrorMessage);
    const confirmPasswordInput = document.getElementById(ElaSettingsIds.confirmPasswordInput);
    const confirmPasswordErrorDiv = document.getElementById(ElaSettingsIds.confirmPasswordErrorMessage);
    if (!passwordInput ||
        !passwordErrorDiv ||
        !confirmPasswordInput ||
        !confirmPasswordErrorDiv) {
        return;
    }
    return {
        passwordInput,
        passwordErrorDiv,
        confirmPasswordInput,
        confirmPasswordErrorDiv,
    };
};
const onElaPasswordBlur = () => {
    const passwordElements = fetchPasswordElements();
    if (!passwordElements) {
        return;
    }
    const { passwordInput, confirmPasswordInput } = passwordElements;
    const errorMessages = validatePasswords(passwordInput.value, confirmPasswordInput.value);
    updatePasswordErrorMessages(passwordElements, errorMessages);
};
