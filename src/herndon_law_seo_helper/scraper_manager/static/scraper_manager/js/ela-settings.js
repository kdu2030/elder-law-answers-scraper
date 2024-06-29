"use strict";
/// <reference path="./sign-in.ts">
var ElaSettingsIds;
(function (ElaSettingsIds) {
    ElaSettingsIds["emailForm"] = "ela-email-form";
    ElaSettingsIds["changeEmailButton"] = "ela-change-email-button";
    ElaSettingsIds["emailErrorMessage"] = "ela-email-error-message";
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
