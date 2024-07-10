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

type FormField = {
  isValid: boolean;
  value?: string;
};

type UserSettingsPasswordForm = {
  password: FormField;
  confirmPassword: FormField;
};

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

const onChangeEmailBlur = (): FormField => {
  const emailInput = document.getElementById(
    UserSettingsId.emailInput
  ) as HTMLInputElement;

  const emailValue = emailInput.value;
  const emailErrorMessage = document.getElementById(
    UserSettingsId.emailErrorMessage
  ) as HTMLDivElement;

  const errorMessage = validateEmail(emailValue);

  if (errorMessage) {
    addErrorMessage(emailInput, emailErrorMessage, errorMessage);
    return { isValid: false, value: emailValue };
  }

  removeErrorMessage(emailInput, emailErrorMessage);
  return { isValid: true, value: emailValue };
};

const onChangeEmailSave = () => {
  const { isValid, value } = onChangeEmailBlur();

  if (!isValid) {
    return;
  }

  const existingEmailValue = document.getElementById(
    UserSettingsId.existingEmailValue
  );

  if (!existingEmailValue || !value) {
    return;
  }

  existingEmailValue.innerText = value;
  onChangeEmailCancel();
};

const onChangePasswordClick = () => {
  const passwordReadMode = document.getElementById(
    UserSettingsId.passwordReadMode
  );
  const passwordForm = document.getElementById(UserSettingsId.passwordForm);

  passwordReadMode?.classList.add("d-none");
  passwordForm?.classList.remove("d-none");
};

const onChangePasswordCancel = () => {
  const passwordReadMode = document.getElementById(
    UserSettingsId.passwordReadMode
  );
  const passwordForm = document.getElementById(UserSettingsId.passwordForm);

  passwordReadMode?.classList.remove("d-none");
  passwordForm?.classList.add("d-none");
};

const fetchUserSettingsPasswordElements = (): PasswordElements => {
  const passwordInput = document.getElementById(
    UserSettingsId.passwordInput
  ) as HTMLInputElement;

  const passwordErrorDiv = document.getElementById(
    UserSettingsId.passwordErrorMessage
  ) as HTMLDivElement;

  const confirmPasswordInput = document.getElementById(
    UserSettingsId.confirmPasswordInput
  ) as HTMLInputElement;

  const confirmPasswordErrorDiv = document.getElementById(
    UserSettingsId.confirmPasswordErrorMessage
  ) as HTMLDivElement;

  return {
    passwordInput,
    passwordErrorDiv,
    confirmPasswordInput,
    confirmPasswordErrorDiv,
  };
};

const onChangePasswordBlur = (): UserSettingsPasswordForm => {
  const passwordElements = fetchUserSettingsPasswordElements();
  const passwordValue = passwordElements.passwordInput.value;
  const confirmPasswordValue = passwordElements.confirmPasswordInput.value;

  const passwordErrorMessages = validatePasswords(
    passwordValue,
    confirmPasswordValue
  );

  updatePasswordErrorMessages(passwordElements, passwordErrorMessages);

  const passwordField: FormField = {
    isValid: !passwordErrorMessages?.passwordError,
    value: passwordValue,
  };

  const confirmPasswordField: FormField = {
    isValid: !passwordErrorMessages?.confirmPasswordError,
    value: confirmPasswordValue,
  };

  return {
    password: passwordField,
    confirmPassword: confirmPasswordField,
  };
};

const onChangePasswordSave = () => {
  const { password, confirmPassword } = onChangePasswordBlur();

  if (!password.isValid || !confirmPassword.isValid) {
    return;
  }

  const existingPasswordValue = document.getElementById(
    UserSettingsId.existingPasswordValue
  );

  if (existingPasswordValue) {
    existingPasswordValue.innerText = "**********";
  }
  onChangePasswordCancel();
};
