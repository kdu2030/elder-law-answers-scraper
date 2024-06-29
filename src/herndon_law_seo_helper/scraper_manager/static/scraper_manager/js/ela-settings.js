"use strict";
/// <reference path="./sign-in.ts">
var ElaSettingsIds;
(function (ElaSettingsIds) {
    ElaSettingsIds["emailForm"] = "ela-email-form";
    ElaSettingsIds["changeEmailButton"] = "ela-change-email-button";
    ElaSettingsIds["emailErrorMessage"] = "ela-email-error-message";
    ElaSettingsIds["emailInput"] = "ela-email-input";
})(ElaSettingsIds || (ElaSettingsIds = {}));
const onChangeEmailClick = () => {
    const emailForm = document.getElementById(ElaSettingsIds.emailForm);
    const changeEmailButton = document.getElementById(ElaSettingsIds.changeEmailButton);
    if (!emailForm || !changeEmailButton) {
        return;
    }
    changeEmailButton.classList.add("d-none");
    emailForm.classList.remove("d-none");
};
const onEmailCancelClick = () => {
    const emailForm = document.getElementById(ElaSettingsIds.emailForm);
    const changeEmailButton = document.getElementById(ElaSettingsIds.changeEmailButton);
    if (!emailForm || !changeEmailButton) {
        return;
    }
    changeEmailButton.classList.remove("d-none");
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
const onElaEmailSave = () => {
    const emailInput = document.getElementById(ElaSettingsIds.emailInput);
    const emailErrorMessageDiv = document.getElementById(ElaSettingsIds.emailErrorMessage);
    if (!emailInput || !emailErrorMessageDiv) {
        return;
    }
    const errorMessage = validateEmail(emailInput.value);
    if (errorMessage) {
        addErrorMessage(emailInput, emailErrorMessageDiv, errorMessage);
        return;
    }
    removeErrorMessage(emailInput, emailErrorMessageDiv);
};
