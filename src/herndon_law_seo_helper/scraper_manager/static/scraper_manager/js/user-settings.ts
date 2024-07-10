/// <reference path="./sign-in.ts">

enum UserSettingsId {
  emailForm = "user-settings-email-form",
  changeEmailButton = "user-settings-change-email-button",
  emailErrorMessage = "user-settings-email-error-message",
  emailInput = "user-settings-email-input",
  emailSpinner = "user-settings-email-spinner",
  emailReadMode = "user-settings-change-email-read-mode",
  existingEmailValue = "user-settings-existing-email-value",
  passwordReadMode = "user-settings-change-password-read-mode",
  passwordForm = "user-settings-password-form",
  passwordInput = "user-settings-password-input",
  confirmPasswordInput = "user-settings-confirm-password-input",
  passwordErrorMessage = "user-settings-password-error-message",
  confirmPasswordErrorMessage = "user-settings-confirm-password-error-message",
  passwordSpinner = "user-settings-password-spinner",
  existingPasswordValue = "user-settings-password-message",
}

const onChangeEmailClick = () => {
  const emailForm = document.getElementById(UserSettingsId.emailForm);
  const emailReadMode = document.getElementById(UserSettingsId.emailReadMode);

  emailForm?.classList.remove("d-none");
  emailReadMode?.classList.add("d-none");
};

const onChangeEmailCancel = () => {
  const emailForm = document.getElementById(UserSettingsId.emailForm);
  const emailReadMode = document.getElementById(UserSettingsId.emailReadMode);

  emailForm?.classList.add("d-none");
  emailReadMode?.classList.remove("d-none");
};

const onChangeEmailBlur = (event: FocusEvent) => {
  const emailInput = event.target as HTMLInputElement;

  const emailValue = emailInput.value;
  const emailErrorMessage = document.getElementById(
    UserSettingsId.emailErrorMessage
  ) as HTMLDivElement;

  const errorMessage = validateEmail(emailValue);

  if (errorMessage) {
    addErrorMessage(emailInput, emailErrorMessage, errorMessage);
    return;
  }

  removeErrorMessage(emailInput, emailErrorMessage);
};
