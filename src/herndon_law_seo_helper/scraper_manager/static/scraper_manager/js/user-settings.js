"use strict";
var UserSettingsId;
(function (UserSettingsId) {
    UserSettingsId["emailForm"] = "user-settings-email-form";
    UserSettingsId["changeEmailButton"] = "user-settings-change-email-button";
    UserSettingsId["emailErrorMessage"] = "user-settings-email-error-message";
    UserSettingsId["emailInput"] = "user-settings-email-input";
    UserSettingsId["emailSpinner"] = "user-settings-email-spinner";
    UserSettingsId["emailReadMode"] = "user-settings-change-email-read-mode";
    UserSettingsId["existingEmailValue"] = "user-settings-existing-email-value";
    UserSettingsId["passwordReadMode"] = "user-settings-change-password-read-mode";
    UserSettingsId["passwordForm"] = "user-settings-password-form";
    UserSettingsId["passwordInput"] = "user-settings-password-input";
    UserSettingsId["confirmPasswordInput"] = "user-settings-confirm-password-input";
    UserSettingsId["passwordErrorMessage"] = "user-settings-password-error-message";
    UserSettingsId["confirmPasswordErrorMessage"] = "user-settings-confirm-password-error-message";
    UserSettingsId["passwordSpinner"] = "user-settings-password-spinner";
    UserSettingsId["existingPasswordValue"] = "user-settings-password-message";
})(UserSettingsId || (UserSettingsId = {}));
const onChangeEmailClick = () => {
    const emailForm = document.getElementById(UserSettingsId.emailForm);
    const emailReadMode = document.getElementById(UserSettingsId.emailReadMode);
    emailForm === null || emailForm === void 0 ? void 0 : emailForm.classList.remove("d-none");
    emailReadMode === null || emailReadMode === void 0 ? void 0 : emailReadMode.classList.add("d-none");
};
const onChangeEmailCancel = () => {
    const emailForm = document.getElementById(UserSettingsId.emailForm);
    const emailReadMode = document.getElementById(UserSettingsId.emailReadMode);
    emailForm === null || emailForm === void 0 ? void 0 : emailForm.classList.add("d-none");
    emailReadMode === null || emailReadMode === void 0 ? void 0 : emailReadMode.classList.remove("d-none");
};
