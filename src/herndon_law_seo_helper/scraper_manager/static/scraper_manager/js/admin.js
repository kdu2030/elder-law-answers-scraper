"use strict";
/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">
var AdminBaseIds;
(function (AdminBaseIds) {
    AdminBaseIds["passwordForm"] = "admin-password-form";
    AdminBaseIds["editUserForm"] = "admin-edit-user-form";
})(AdminBaseIds || (AdminBaseIds = {}));
const EDIT_FIELDS_WITH_VALIDATION = [
    "username",
    "email",
    "password",
    "confirmPassword",
];
let editUserForm = { shouldChangePassword: false };
let editUserErrors = {};
const onClickUserEdit = (initialForm) => {
    editUserForm = Object.assign(Object.assign({}, editUserForm), initialForm);
};
const validateRequiredString = (fieldName, stringValue, allowWhitespace = false) => {
    const errorMessage = `${fieldName} is required.`;
    if (!stringValue) {
        return errorMessage;
    }
    if (!allowWhitespace || stringValue.trim().length > 0) {
        return errorMessage;
    }
    return;
};
const validateEditUserForm = (editUserForm) => {
    const usernameErrorMessage = validateRequiredString("Username", editUserForm.username);
    const emailErrorMessage = validateEmail(editUserForm.email);
    const { passwordError, confirmPasswordError } = validatePasswords(editUserForm.password, editUserForm.confirmPassword);
    return {
        username: usernameErrorMessage,
        email: emailErrorMessage,
        password: passwordError,
        confirmPassword: confirmPasswordError,
    };
};
const updateEditUserErrorMessage = (userId, fieldName, errorMessage) => {
    const inputElement = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} input[name=${fieldName}]`);
    const errorMessageDiv = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} #${fieldName}-error-message`);
    if (errorMessage) {
        addErrorMessage(inputElement, errorMessageDiv, errorMessage);
        return;
    }
    removeErrorMessage(inputElement, errorMessageDiv);
};
const addErrorMessageToForm = (userId, formErrors, targetFieldName) => {
    if (targetFieldName) {
        updateEditUserErrorMessage(userId, targetFieldName, formErrors[targetFieldName]);
    }
    EDIT_FIELDS_WITH_VALIDATION.forEach((fieldName) => {
        updateEditUserErrorMessage(userId, fieldName, formErrors[targetFieldName]);
    });
};
const onEditUsernameBlur = (event) => {
    const eventTarget = event.target;
    const username = eventTarget.value;
    editUserForm.username = username;
};
const onChangeEditPassword = (event) => {
    const eventTarget = event.target;
    const shouldChangePassword = eventTarget.value === "true";
    const passwordForm = document.getElementById(`${AdminBaseIds.passwordForm}-${editUserForm.userId}`);
    if (shouldChangePassword) {
        editUserForm.shouldChangePassword = true;
        passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.remove("d-none");
        return;
    }
    editUserForm.shouldChangePassword = false;
    passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.add("d-none");
};
