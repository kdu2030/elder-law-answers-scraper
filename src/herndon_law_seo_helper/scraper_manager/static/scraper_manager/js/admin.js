"use strict";
var AdminBaseIds;
(function (AdminBaseIds) {
    AdminBaseIds["passwordForm"] = "admin-password-form";
})(AdminBaseIds || (AdminBaseIds = {}));
let isPasswordVisible = false;
const onChangeEditPassword = (event, userId) => {
    const eventTarget = event.target;
    const shouldChangePassword = eventTarget.value === "true";
    const passwordForm = document.getElementById(`${AdminBaseIds.passwordForm}-${userId}`);
    if (shouldChangePassword) {
        isPasswordVisible = true;
        passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.remove("d-none");
        return;
    }
    isPasswordVisible = false;
    passwordForm === null || passwordForm === void 0 ? void 0 : passwordForm.classList.add("d-none");
};
