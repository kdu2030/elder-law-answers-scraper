"use strict";
/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">
/// <reference path="./api/put-user-settings.ts">
/// <reference path="./api/put-user-permissions.ts">
/// <reference path="./api/post-user.ts">
/// <reference path="./api/delete-user.ts">
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
var AdminBaseIds;
(function (AdminBaseIds) {
    AdminBaseIds["passwordForm"] = "admin-password-form";
    AdminBaseIds["editUserForm"] = "admin-edit-user-form";
    AdminBaseIds["editUserSaveSpinner"] = "edit-user-save-spinner";
    AdminBaseIds["editUserModal"] = "admin-edit-user-modal";
    AdminBaseIds["deleteUserModal"] = "admin-delete-user-modal";
    AdminBaseIds["deleteSpinner"] = "delete-user-save-spinner";
})(AdminBaseIds || (AdminBaseIds = {}));
const EDIT_FIELDS_WITH_VALIDATION = [
    "username",
    "email",
    "password",
    "confirmPassword",
];
let editUserForm = { shouldChangePassword: false };
let initialEditForm;
let loggedInUserId;
const onClickUserEdit = (initialForm, userId) => {
    editUserForm = Object.assign(Object.assign({}, editUserForm), initialForm);
    initialEditForm = initialForm;
    loggedInUserId = userId;
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
    if (editUserForm.userId == null) {
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
    if (editUserForm.userId == null) {
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
    if (userId !== 0) {
        const shouldChangePassword = document.querySelector(`#${AdminBaseIds.editUserForm}-${userId} input[name=shouldChangePassword]`);
        shouldChangePassword.checked = true;
        const passwordForm = document.getElementById(`${AdminBaseIds.passwordForm}-${userId}`);
        passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.add("d-none");
    }
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
const toggleSaveSpinner = (userId, showSpinner, baseId) => {
    const spinner = document.getElementById(`${baseId !== null && baseId !== void 0 ? baseId : AdminBaseIds.editUserSaveSpinner}-${userId}`);
    if (showSpinner) {
        spinner === null || spinner === void 0 ? void 0 : spinner.classList.remove("d-none");
        return;
    }
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.add("d-none");
};
const toggleCancelDisabled = (userId, isDisabled, baseModalId) => {
    const cancelButtons = document.querySelectorAll(`#${baseModalId !== null && baseModalId !== void 0 ? baseModalId : AdminBaseIds.editUserModal}-${userId} button[data-bs-dismiss='modal']`);
    cancelButtons.forEach((cancelButton) => {
        cancelButton.disabled = isDisabled;
    });
};
const saveEditUserForm = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
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
        editUserForm.password = undefined;
        editUserForm.confirmPassword = undefined;
    }
    updateFormErrorMessages(userId, formErrors);
    if (Object.keys(formErrors).find((key) => typeof formErrors[key] === "string")) {
        return;
    }
    toggleSaveSpinner(userId, true);
    toggleCancelDisabled(userId, true);
    const userRequest = {
        userId: editUserForm.userId,
        username: editUserForm.username,
        email: editUserForm.email,
        password: editUserForm.password,
    };
    const putUserPermissionsRequest = {
        userId: (_c = editUserForm.userId) !== null && _c !== void 0 ? _c : -1,
        canEditConfig: (_d = editUserForm.canEditConfig) !== null && _d !== void 0 ? _d : false,
        canViewAdmin: (_e = editUserForm.canViewAdmin) !== null && _e !== void 0 ? _e : false,
    };
    const [settingsResponse, permissionsResponse] = yield Promise.all([
        putUserSettings(userRequest, csrfToken),
        putUserPermissions(putUserPermissionsRequest, csrfToken),
    ]);
    toggleSaveSpinner(userId, false);
    if (settingsResponse.formErrors) {
        updateFormErrorMessages(userId, settingsResponse.formErrors);
    }
    if (settingsResponse.isError || permissionsResponse.isError) {
        createErrorToaster("Unable to save data", "Unable to save updated user settings");
        toggleCancelDisabled(userId, false);
        return;
    }
    createSuccessToaster("User data successfully saved", "Successfully updated user settings. The page will load momentarily with the updated users.");
    yield new Promise((resolve) => setTimeout(() => resolve(), 2000));
    if (loggedInUserId === editUserForm.userId && !editUserForm.canViewAdmin) {
        window.location.href = "/dashboard";
        return;
    }
    location.reload();
});
const saveAddUserForm = () => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j, _k, _l;
    const userId = 0;
    const formErrors = validateEditUserForm(editUserForm);
    updateFormErrorMessages(userId, formErrors);
    const csrfToken = (_f = getCsrfToken()) !== null && _f !== void 0 ? _f : "";
    if (Object.keys(formErrors).find((key) => typeof formErrors[key] === "string")) {
        return;
    }
    toggleSaveSpinner(userId, true);
    toggleCancelDisabled(userId, true);
    const request = {
        username: (_g = editUserForm.username) !== null && _g !== void 0 ? _g : "",
        email: (_h = editUserForm.email) !== null && _h !== void 0 ? _h : "",
        password: (_j = editUserForm.password) !== null && _j !== void 0 ? _j : "",
        canViewAdmin: (_k = editUserForm.canViewAdmin) !== null && _k !== void 0 ? _k : false,
        canEditConfig: (_l = editUserForm.canEditConfig) !== null && _l !== void 0 ? _l : false,
    };
    const response = yield postUser(request, csrfToken);
    toggleSaveSpinner(userId, false);
    if (response.formErrors) {
        updateFormErrorMessages(userId, response.formErrors);
    }
    if (response.isError) {
        createErrorToaster("Unable to save user data", "Unable to add a new user.");
        toggleCancelDisabled(userId, false);
        return;
    }
    createSuccessToaster("Successfully saved user data", "New user added. The page will load momentarily with the updated users.");
    yield new Promise((resolve) => setTimeout(() => resolve(), 2000));
    location.reload();
});
const saveDeleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    const csrfToken = (_m = getCsrfToken()) !== null && _m !== void 0 ? _m : "";
    toggleSaveSpinner(userId, true, AdminBaseIds.deleteSpinner);
    toggleCancelDisabled(userId, true, AdminBaseIds.deleteUserModal);
    const response = yield deleteUser(userId, csrfToken);
    toggleSaveSpinner(userId, false, AdminBaseIds.deleteSpinner);
    if (response.isError) {
        createErrorToaster("Unable to delete data", "Unable to delete user.");
        toggleCancelDisabled(userId, false, AdminBaseIds.deleteUserModal);
        return;
    }
    createSuccessToaster("Successfully deleted user.", "User was deleted. The page will load momentarily with the updated users.");
    yield new Promise((resolve) => setTimeout(() => resolve(), 2000));
    location.reload();
});
