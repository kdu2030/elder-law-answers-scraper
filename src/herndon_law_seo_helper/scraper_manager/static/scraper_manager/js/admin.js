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
let initialEditForm;
const onClickUserEdit = (initialForm) => {
    editUserForm = Object.assign(Object.assign({}, editUserForm), initialForm);
    initialEditForm = initialForm;
};
const validateRequiredString = (fieldName, stringValue, allowWhitespace = false) => {
    const errorMessage = `${fieldName} is required.`;
    if (!stringValue) {
        return errorMessage;
    }
    if (!allowWhitespace && stringValue.trim().length <= 0) {
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
const updateFormErrorMessages = (userId, formErrors, targetFieldName) => {
    if (targetFieldName) {
        updateEditUserErrorMessage(userId, targetFieldName, formErrors[targetFieldName]);
        return;
    }
    EDIT_FIELDS_WITH_VALIDATION.forEach((fieldName) => {
        updateEditUserErrorMessage(userId, fieldName, formErrors[targetFieldName]);
    });
};
const onEditUserTextFieldBlur = (event) => {
    const eventTarget = event.target;
    const value = eventTarget.value;
    const fieldName = eventTarget.name;
    editUserForm = Object.assign(editUserForm, { [fieldName]: value });
    const formErrors = validateEditUserForm(editUserForm);
    if (!editUserForm.userId) {
        return;
    }
    updateFormErrorMessages(editUserForm.userId, formErrors, fieldName);
};
const onEditUserPasswordBlur = (event) => {
    const eventTarget = event.target;
    const value = eventTarget.value;
    const fieldName = eventTarget.name;
    editUserForm = Object.assign(editUserForm, { [fieldName]: value });
    const formErrors = validateEditUserForm(editUserForm);
    if (!editUserForm.userId) {
        return;
    }
    updateFormErrorMessages(editUserForm.userId, formErrors, "password");
    updateFormErrorMessages(editUserForm.userId, formErrors, "confirmPassword");
};
const updateStringInputValue = (userId, fieldName, value) => {
    const inputElement = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} input[name=${fieldName}]`);
    inputElement.value = value !== null && value !== void 0 ? value : "";
};
const onCancelEditUser = () => {
    var _a;
    const userId = (_a = editUserForm.userId) !== null && _a !== void 0 ? _a : -1;
    if (userId === -1) {
        return;
    }
    const shouldChangePassword = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} input[name=shouldChangePassword]`);
    shouldChangePassword.checked = true;
    const passwordForm = document.getElementById(`${AdminBaseIds.passwordForm}-${userId}`);
    passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.add("d-none");
    EDIT_FIELDS_WITH_VALIDATION.forEach((fieldName) => {
        updateStringInputValue(userId, fieldName, initialEditForm[fieldName]);
    });
    updateFormErrorMessages(userId, {});
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
