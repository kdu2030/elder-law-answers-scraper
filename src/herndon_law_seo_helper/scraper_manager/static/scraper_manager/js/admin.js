"use strict";
var AdminBaseIds;
(function (AdminBaseIds) {
    AdminBaseIds["passwordForm"] = "admin-password-form";
})(AdminBaseIds || (AdminBaseIds = {}));
const editUserForm = { shouldChangePassword: false };
const editUserErrors = {};
const onClickUserEdit = (userId) => {
    editUserForm.userId = userId;
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
