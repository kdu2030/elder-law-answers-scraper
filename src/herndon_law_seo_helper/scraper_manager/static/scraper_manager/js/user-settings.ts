/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">
/// <reference path="./api/put-user-settings.ts">
/// <reference path="./api/post-profile-image.ts">
/// <reference path="./toaster.ts">

enum UserSettingsId {
  usernameEmailForm = "user-settings-username-email-form",
  changeUsernameEmailButton = "user-settings-change-username-email-button",
  emailErrorMessage = "user-settings-email-error-message",
  emailInput = "user-settings-email-input",
  usernameEmailSpinner = "user-settings-username-email-spinner",
  usernameInput = "user-settings-username-input",
  usernameErrorMessage = "user-settings-username-error-message",
  existingUsernameValue = "user-settings-existing-username-value",
  usernameEmailReadMode = "user-settings-username-email-read-mode",
  existingEmailValue = "user-settings-existing-email-value",
  passwordReadMode = "user-settings-change-password-read-mode",
  passwordForm = "user-settings-password-form",
  passwordInput = "user-settings-password-input",
  confirmPasswordInput = "user-settings-confirm-password-input",
  passwordErrorMessage = "user-settings-password-error-message",
  confirmPasswordErrorMessage = "user-settings-confirm-password-error-message",
  passwordSpinner = "user-settings-password-spinner",
  existingPasswordValue = "user-settings-password-message",
  navbarUsername = "navbar-username",
  uploadUserProfile = "user-settings-upload-profile-image",
  uploadErrorMessage = "user-settings-upload-error",
}

const MAX_PROFILE_PICTURE_BYTES = 2 * 1024 * 1024;

type FormField = {
  isValid: boolean;
  value?: string;
};

type UserSettingsPasswordForm = {
  password: FormField;
  confirmPassword: FormField;
};

const onChangeUsernameEmailClick = () => {
  const usernameEmailForm = document.getElementById(
    UserSettingsId.usernameEmailForm
  );
  const usernameEmailReadMode = document.getElementById(
    UserSettingsId.usernameEmailReadMode
  );

  usernameEmailForm?.classList.remove("d-none");
  usernameEmailReadMode?.classList.add("d-none");
};

const onChangeUsernameEmailCancel = () => {
  const usernameEmailForm = document.getElementById(
    UserSettingsId.usernameEmailForm
  );
  const readMode = document.getElementById(
    UserSettingsId.usernameEmailReadMode
  );

  usernameEmailForm?.classList.add("d-none");
  readMode?.classList.remove("d-none");
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

const onChangeUsernameBlur = (): FormField => {
  const userInput = document.getElementById(
    UserSettingsId.usernameInput
  ) as HTMLInputElement | null;

  const userErrorMessageDiv = document.getElementById(
    UserSettingsId.usernameErrorMessage
  ) as HTMLDivElement | null;

  if (!userInput || !userErrorMessageDiv) {
    return { isValid: false };
  }

  const usernameErrorMessage = validateUsername(userInput.value);

  if (usernameErrorMessage) {
    addErrorMessage(userInput, userErrorMessageDiv, usernameErrorMessage);
  } else {
    removeErrorMessage(userInput, userErrorMessageDiv);
  }

  return {
    isValid: usernameErrorMessage == null,
    value: userInput.value,
  };
};

const addFormErrorsFromApi = (formErrors: UserSettingsFormErrors) => {
  const usernameInput = document.getElementById(
    UserSettingsId.usernameInput
  ) as HTMLInputElement;
  const usernameErrorDiv = document.getElementById(
    UserSettingsId.usernameErrorMessage
  ) as HTMLDivElement;

  const emailInput = document.getElementById(
    UserSettingsId.emailInput
  ) as HTMLInputElement;
  const emailErrorDiv = document.getElementById(
    UserSettingsId.emailErrorMessage
  ) as HTMLDivElement;

  if (formErrors.username) {
    addErrorMessage(usernameInput, usernameErrorDiv, formErrors.username);
  }

  if (formErrors.email) {
    addErrorMessage(emailInput, emailErrorDiv, formErrors.email);
  }
};

const onUsernameEmailSave = async () => {
  const { isValid: isEmailValid, value: emailValue } = onChangeEmailBlur();
  const { isValid: isUsernameValid, value: usernameValue } =
    onChangeUsernameBlur();
  const spinner = document.getElementById(UserSettingsId.usernameEmailSpinner);
  const csrfToken = getCsrfToken();

  if (!isEmailValid || !isUsernameValid || !csrfToken) {
    return;
  }

  spinner?.classList.remove("d-none");

  const response = await putUserSettings(
    {
      username: usernameValue,
      email: emailValue,
    },
    csrfToken
  );

  spinner?.classList.add("d-none");

  if (response.isError) {
    createErrorToaster(
      "Unable to save user data",
      "Unable to save username or email"
    );
    response.formErrors && addFormErrorsFromApi(response.formErrors);
    return;
  }

  createSuccessToaster(
    "Successfully saved user data",
    "Saved updated username and email"
  );

  const existingEmailValue = document.getElementById(
    UserSettingsId.existingEmailValue
  );
  const existingUsernameValue = document.getElementById(
    UserSettingsId.existingUsernameValue
  );

  const navbarUsername = document.getElementById(UserSettingsId.navbarUsername);

  if (!existingEmailValue || !existingUsernameValue || !navbarUsername) {
    return;
  }

  existingEmailValue.innerText = emailValue ?? "";
  existingUsernameValue.innerText = usernameValue ?? "";
  navbarUsername.innerText = usernameValue ?? "";

  onChangeUsernameEmailCancel();
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

const onChangePasswordSave = async () => {
  const { password, confirmPassword } = onChangePasswordBlur();
  const csrfToken = getCsrfToken();

  if (!password.isValid || !confirmPassword.isValid || !csrfToken) {
    return;
  }

  const spinner = document.getElementById(UserSettingsId.passwordSpinner);
  spinner?.classList.remove("d-none");

  const response = await putUserSettings(
    { password: password.value ?? "" },
    csrfToken
  );

  spinner?.classList.add("d-none");

  if (response.isError) {
    createErrorToaster(
      "Unable to save user data",
      "Unable to save updated password."
    );
    return;
  }

  createSuccessToaster(
    "User data saved successfully",
    "Updated password saved successfully."
  );

  const existingPasswordValue = document.getElementById(
    UserSettingsId.existingPasswordValue
  );

  if (existingPasswordValue) {
    existingPasswordValue.innerText = "**********";
  }
  onChangePasswordCancel();
};

const onChangeProfileImageClick = () => {
  const profileInput = document.getElementById(
    UserSettingsId.uploadUserProfile
  );
  profileInput?.click();
};

const updateProfileImageErrorMessage = (errorMessage: string | undefined) => {
  const errorMessageElement = document.getElementById(
    UserSettingsId.uploadErrorMessage
  ) as HTMLParagraphElement | null;

  if (!errorMessageElement) {
    return;
  }

  errorMessageElement.innerText = errorMessage ?? "";

  if (errorMessage) {
    errorMessageElement.classList.remove("d-none");
  } else {
    errorMessageElement.classList.add("d-none");
  }
};

const onUploadProfileImage = async (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  const files = eventTarget.files;

  if (!files || files.length < 1) {
    updateProfileImageErrorMessage(
      "An image is required to change your profile picture."
    );
    return;
  }

  const csrfToken = getCsrfToken();
  const profileImage = files[0];

  if (!csrfToken) {
    return;
  }

  await postProfileImage(csrfToken, profileImage);
};
