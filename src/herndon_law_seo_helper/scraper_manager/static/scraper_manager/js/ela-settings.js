var ElaSettingsIds;
(function (ElaSettingsIds) {
    ElaSettingsIds["emailForm"] = "ela-email-form";
    ElaSettingsIds["changeEmailButton"] = "ela-change-email-button";
})(ElaSettingsIds || (ElaSettingsIds = {}));
var onChangeEmailClick = function () {
    var emailForm = document.getElementById(ElaSettingsIds.emailForm);
    var changeEmailButton = document.getElementById(ElaSettingsIds.changeEmailButton);
    if (!emailForm || !changeEmailButton) {
        return;
    }
    changeEmailButton.classList.add("d-none");
    emailForm.classList.remove("d-none");
};
var onEmailCancelClick = function () {
    var emailForm = document.getElementById(ElaSettingsIds.emailForm);
    var changeEmailButton = document.getElementById(ElaSettingsIds.changeEmailButton);
    if (!emailForm || !changeEmailButton) {
        return;
    }
    changeEmailButton.classList.remove("d-none");
    emailForm.classList.add("d-none");
};
