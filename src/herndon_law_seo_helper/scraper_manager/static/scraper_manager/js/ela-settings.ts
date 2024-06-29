/// <reference path="./sign-in.ts">

enum ElaSettingsIds {
    emailForm = "ela-email-form",
    changeEmailButton = "ela-change-email-button",
    emailErrorMessage = "ela-email-error-message"
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


const onElaEmailBlur = (event: FocusEvent) => {
    const errorMessageDiv = document.getElementById(
      ElaSettingsIds.emailErrorMessage
    ) as HTMLDivElement;
  
    if (!event.target || !errorMessageDiv) {
      return;
    }
    const emailInput = event.target as HTMLInputElement;
    const value = emailInput.value;
    const errorMessage = validateEmail(value);
  
    if (errorMessage) {
      addErrorMessage(emailInput, errorMessageDiv, errorMessage);
    } else {
      removeErrorMessage(emailInput, errorMessageDiv);
    }
  };