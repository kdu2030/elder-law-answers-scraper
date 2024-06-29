enum ElaSettingsIds {
    emailForm = "ela-email-form",
    changeEmailButton = "ela-change-email-button"
}

const onChangeEmailClick = () => {
    const emailForm = document.getElementById(ElaSettingsIds.emailForm);
    const changeEmailButton = document.getElementById(ElaSettingsIds.changeEmailButton);

    if(!emailForm || !changeEmailButton){
        return;
    }

    changeEmailButton.classList.add("d-none");
    emailForm.classList.remove("d-none");
}

const onEmailCancelClick = () => {
    const emailForm = document.getElementById(ElaSettingsIds.emailForm);
    const changeEmailButton = document.getElementById(ElaSettingsIds.changeEmailButton);

    if(!emailForm || !changeEmailButton){
        return;
    }

    changeEmailButton.classList.remove("d-none");
    emailForm.classList.add("d-none")
}

