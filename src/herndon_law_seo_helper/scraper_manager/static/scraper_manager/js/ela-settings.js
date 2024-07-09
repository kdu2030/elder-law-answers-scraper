"use strict";
/// <reference path="./sign-in.ts">
/// <reference path="./api/post-ela-settings.ts">
/// <reference path="./toaster.ts">
/// <reference path="./api/get-scrape-ela-article.ts">
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
    ElaSettingsIds["usernameForm"] = "ela-username-form";
    ElaSettingsIds["changeUsernameButton"] = "ela-change-username-button";
    ElaSettingsIds["usernameErrorMessage"] = "ela-username-error-message";
    ElaSettingsIds["usernameInput"] = "ela-username-input";
    ElaSettingsIds["elaUsernameSpinner"] = "ela-username-spinner";
    ElaSettingsIds["changeUsernameReadMode"] = "ela-change-username-read-mode";
    ElaSettingsIds["existingUsernameValue"] = "ela-existing-username-value";
    ElaSettingsIds["changePasswordReadMode"] = "ela-change-password-read-mode";
    ElaSettingsIds["passwordForm"] = "ela-password-form";
    ElaSettingsIds["passwordInput"] = "ela-password-input";
    ElaSettingsIds["confirmPasswordInput"] = "ela-confirm-password-input";
    ElaSettingsIds["passwordErrorMessage"] = "ela-password-error-message";
    ElaSettingsIds["confirmPasswordErrorMessage"] = "ela-confirm-password-error-message";
    ElaSettingsIds["elaPasswordSpinner"] = "ela-password-spinner";
    ElaSettingsIds["passwordReadMessage"] = "ela-password-message";
    ElaSettingsIds["testScrapeSpinner"] = "ela-test-scrape-spinner";
})(ElaSettingsIds || (ElaSettingsIds = {}));
const csrfTokenName = "csrfmiddlewaretoken";
const onChangeUsernameClick = () => {
    const usernameForm = document.getElementById(ElaSettingsIds.usernameForm);
    const changeUsernameReadMode = document.getElementById(ElaSettingsIds.changeUsernameReadMode);
    if (!usernameForm || !changeUsernameReadMode) {
        return;
    }
    changeUsernameReadMode.classList.add("d-none");
    usernameForm.classList.remove("d-none");
};
const onUsernameCancelClick = () => {
    const usernameForm = document.getElementById(ElaSettingsIds.usernameForm);
    const changeUsernameReadMode = document.getElementById(ElaSettingsIds.changeUsernameReadMode);
    if (!usernameForm || !changeUsernameReadMode) {
        return;
    }
    changeUsernameReadMode.classList.remove("d-none");
    usernameForm.classList.add("d-none");
};
const validateUsername = (value) => {
    if (!value || value.trim().length === 0) {
        return "Username is required.";
    }
    return;
};
const onElaUsernameBlur = (event) => {
    const errorMessageDiv = document.getElementById(ElaSettingsIds.usernameErrorMessage);
    if (!event.target || !errorMessageDiv) {
        return;
    }
    const usernameInput = event.target;
    const value = usernameInput.value;
    const errorMessage = validateUsername(value);
    if (errorMessage) {
        addErrorMessage(usernameInput, errorMessageDiv, errorMessage);
    }
    else {
        removeErrorMessage(usernameInput, errorMessageDiv);
    }
};
const onElaUsernameSave = () => __awaiter(void 0, void 0, void 0, function* () {
    const userInput = document.getElementById(ElaSettingsIds.usernameInput);
    const userErrorMessageDiv = document.getElementById(ElaSettingsIds.usernameErrorMessage);
    const csrfTokenInput = document.getElementsByName(csrfTokenName)[0];
    const csrfToken = csrfTokenInput === null || csrfTokenInput === void 0 ? void 0 : csrfTokenInput.value;
    if (!userInput || !userErrorMessageDiv || !csrfToken) {
        return;
    }
    const errorMessage = validateUsername(userInput.value);
    if (errorMessage) {
        addErrorMessage(userInput, userErrorMessageDiv, errorMessage);
        return;
    }
    removeErrorMessage(userInput, userErrorMessageDiv);
    const spinner = document.getElementById(ElaSettingsIds.elaUsernameSpinner);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
    const response = yield postElaSettings({ username: userInput.value }, csrfToken);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.add("d-none");
    if (response.isError) {
        createErrorToaster("Unable to save data", "Unable to save website username");
        return;
    }
    createSuccessToaster("Data saved successfully", "Website username changed");
    const existingUsernameValue = document.getElementById(ElaSettingsIds.existingUsernameValue);
    if (existingUsernameValue) {
        existingUsernameValue.innerText = userInput.value;
    }
    onUsernameCancelClick();
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
    return errorMessages;
};
const onElaPasswordSave = () => __awaiter(void 0, void 0, void 0, function* () {
    const passwordInputElement = document.getElementById(ElaSettingsIds.passwordInput);
    const csrfTokenInput = document.getElementsByName(csrfTokenName)[0];
    const errorMessages = onElaPasswordBlur();
    if (errorMessages || !csrfTokenInput) {
        return;
    }
    const spinner = document.getElementById(ElaSettingsIds.elaPasswordSpinner);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
    const response = yield postElaSettings({
        password: passwordInputElement.value,
    }, csrfTokenInput.value);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.add("d-none");
    if (response.isError) {
        createErrorToaster("Unable to save data", "Unable to save website password");
        return;
    }
    createSuccessToaster("Data successfully saved", "Website password changed.");
    const passwordReadMessage = document.getElementById(ElaSettingsIds.passwordReadMessage);
    if (!passwordReadMessage) {
        return;
    }
    passwordReadMessage.innerText = "**********";
    onElaPasswordCancel();
});
const onTestElaScrapeClick = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const spinner = document.getElementById(ElaSettingsIds.testScrapeSpinner);
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
    const response = yield getScrapeElaArticle();
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.add("d-none");
    if (response.isError) {
        createErrorToaster("Post creation failed", (_a = response.error) !== null && _a !== void 0 ? _a : "Unable to create post using website");
        return;
    }
    if (response.isWarning) {
        createWarningToaster("Post creation unsuccessful", (_b = response.warning) !== null && _b !== void 0 ? _b : "Unable to create post using website");
        return;
    }
    createSuccessToaster("Post successfully created", "Created a new post using website");
});
