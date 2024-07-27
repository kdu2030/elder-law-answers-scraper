"use strict";
/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">
/// <reference path="./api/put-user-settings.ts">
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var AdminBaseIds;
(function (AdminBaseIds) {
    AdminBaseIds["passwordForm"] = "admin-password-form";
    AdminBaseIds["editUserForm"] = "admin-edit-user-form";
    AdminBaseIds["editUserSaveSpinner"] = "edit-user-save-spinner";
    AdminBaseIds["editUserModal"] = "admin-edit-user-modal";
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
        updateEditUserErrorMessage(userId, fieldName, formErrors[fieldName]);
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
const onEditUserCheckboxChange = (event) => {
    const eventTarget = event.target;
    const checked = eventTarget.checked;
    const fieldName = eventTarget.name;
    editUserForm = Object.assign(editUserForm, { [fieldName]: checked });
};
const updateStringInputValue = (userId, fieldName, value) => {
    const inputElement = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} input[name=${fieldName}]`);
    inputElement.value = value !== null && value !== void 0 ? value : "";
};
const setEditUserCheckboxValues = (editUserForm) => {
    var _a, _b;
    const userId = editUserForm.userId;
    const canViewAdminInput = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} input[name=canViewAdmin]`);
    const canEditConfig = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} input[name=canEditConfig]`);
    canViewAdminInput.checked = (_a = editUserForm.canViewAdmin) !== null && _a !== void 0 ? _a : false;
    canEditConfig.checked = (_b = editUserForm.canEditConfig) !== null && _b !== void 0 ? _b : false;
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
    setEditUserCheckboxValues(initialEditForm);
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
const toggleSaveSpinner = (userId, showSpinner) => {
    const spinner = document.getElementById(`${AdminBaseIds.editUserSaveSpinner}-${userId}`);
    if (showSpinner) {
        spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
        return;
    }
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.add("d-none");
};
const toggleCancelEnabled = (userId, isDisabled) => {
    const cancelButtons = document.querySelectorAll(`#${AdminBaseIds.editUserModal}-${userId} button[data-bs-dismiss='modal']`);
    cancelButtons.forEach((cancelButton) => {
        cancelButton.disabled = isDisabled;
    });
};
const saveEditUserForm = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = editUserForm.userId) !== null && _a !== void 0 ? _a : -1;
    const shouldChangePassword = (_b = editUserForm.shouldChangePassword) !== null && _b !== void 0 ? _b : false;
    const formErrors = validateEditUserForm(editUserForm);
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
        return;
    }
    if (!shouldChangePassword) {
        formErrors.password = undefined;
        formErrors.confirmPassword = undefined;
    }
    updateFormErrorMessages(userId, formErrors);
    if (Object.keys(formErrors).find((key) => typeof formErrors[key] === "string")) {
        return;
    }
    toggleSaveSpinner(userId, true);
    toggleCancelEnabled(userId, true);
    const userRequest = {
        userId: editUserForm.userId,
        username: editUserForm.username,
        email: editUserForm.email,
        password: editUserForm.password,
    };
    const response = yield putUserSettings(userRequest, csrfToken);
    console.log(response);
    toggleSaveSpinner(userId, false);
    toggleCancelEnabled(userId, false);
});
