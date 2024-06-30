/// <reference path="./sign-in.ts">
/// <reference path="./api/post-ela-settings.ts">
/// <reference path="./toaster.ts">
/// <reference path="./api/get-scrape-ela-article.ts">

type PasswordErrorMessages = {
  passwordError?: string;
  confirmPasswordError?: string;
};

type PasswordElements = {
  passwordInput: HTMLInputElement;
  passwordErrorDiv: HTMLDivElement;
  confirmPasswordInput: HTMLInputElement;
  confirmPasswordErrorDiv: HTMLDivElement;
};

enum ElaSettingsIds {
  emailForm = "ela-email-form",
  changeEmailButton = "ela-change-email-button",
  emailErrorMessage = "ela-email-error-message",
  emailInput = "ela-email-input",
  elaEmailSpinner = "ela-email-spinner",
  changeEmailReadMode = "ela-change-email-read-mode",
  existingEmailValue = "ela-existing-email-value",
  changePasswordReadMode = "ela-change-password-read-mode",
  passwordForm = "ela-password-form",
  passwordInput = "ela-password-input",
  confirmPasswordInput = "ela-confirm-password-input",
  passwordErrorMessage = "ela-password-error-message",
  confirmPasswordErrorMessage = "ela-confirm-password-error-message",
  elaPasswordSpinner = "ela-password-spinner",
  passwordReadMessage = "ela-password-message",
}

const csrfTokenName = "csrfmiddlewaretoken";

const onChangeEmailClick = () => {
  const emailForm = document.getElementById(ElaSettingsIds.emailForm);
  const changeEmailReadMode = document.getElementById(
    ElaSettingsIds.changeEmailReadMode
  );

  if (!emailForm || !changeEmailReadMode) {
    return;
  }

  changeEmailReadMode.classList.add("d-none");
  emailForm.classList.remove("d-none");
};

const onEmailCancelClick = () => {
  const emailForm = document.getElementById(ElaSettingsIds.emailForm);
  const changeEmailReadMode = document.getElementById(
    ElaSettingsIds.changeEmailReadMode
  );

  if (!emailForm || !changeEmailReadMode) {
    return;
  }

  changeEmailReadMode.classList.remove("d-none");
  emailForm.classList.add("d-none");
};

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

const onElaEmailSave = async () => {
  const emailInput = document.getElementById(
    ElaSettingsIds.emailInput
  ) as HTMLInputElement;
  const emailErrorMessageDiv = document.getElementById(
    ElaSettingsIds.emailErrorMessage
  ) as HTMLDivElement;

  const csrfTokenInput = document.getElementsByName(
    csrfTokenName
  )[0] as HTMLInputElement;
  const csrfToken = csrfTokenInput?.value;

  if (!emailInput || !emailErrorMessageDiv || !csrfToken) {
    return;
  }

  const errorMessage = validateEmail(emailInput.value);

  if (errorMessage) {
    addErrorMessage(emailInput, emailErrorMessageDiv, errorMessage);
    return;
  }

  removeErrorMessage(emailInput, emailErrorMessageDiv);

  const spinner = document.getElementById(ElaSettingsIds.elaEmailSpinner);
  spinner?.classList.remove("d-none");

  const response = await postElaSettings(
    { email: emailInput.value },
    csrfToken
  );

  spinner?.classList.add("d-none");

  if (response.isError) {
    createErrorToaster(
      "Unable to save data",
      "Unable to save Elder Law Answers username"
    );
    return;
  }

  createSuccessToaster(
    "Data saved successfully",
    "Elder Law Answers username changed"
  );

  const existingEmailValue = document.getElementById(
    ElaSettingsIds.existingEmailValue
  );

  if (existingEmailValue) {
    existingEmailValue.innerText = emailInput.value;
  }

  onEmailCancelClick();
};

const onElaPasswordClick = () => {
  const passwordReadMode = document.getElementById(
    ElaSettingsIds.changePasswordReadMode
  );
  const passwordEditMode = document.getElementById(ElaSettingsIds.passwordForm);

  if (!passwordReadMode || !passwordEditMode) {
    return;
  }

  passwordReadMode.classList.add("d-none");
  passwordEditMode.classList.remove("d-none");
};

const onElaPasswordCancel = () => {
  const passwordReadMode = document.getElementById(
    ElaSettingsIds.changePasswordReadMode
  );
  const passwordEditMode = document.getElementById(ElaSettingsIds.passwordForm);

  if (!passwordReadMode || !passwordEditMode) {
    return;
  }

  passwordReadMode.classList.remove("d-none");
  passwordEditMode.classList.add("d-none");
};

const validatePasswords = (
  password: string | undefined,
  confirmPassword: string | undefined
): PasswordErrorMessages | undefined => {
  const passwordError = validatePassword(password);

  if (passwordError) {
    return { passwordError };
  }

  if (!confirmPassword || confirmPassword.length === 0) {
    return { confirmPasswordError: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { confirmPasswordError: "Passwords do not match." };
  }
};

const updatePasswordErrorMessages = (
  passwordElements: PasswordElements,
  errorMessages: PasswordErrorMessages | undefined
) => {
  const {
    passwordInput,
    passwordErrorDiv,
    confirmPasswordErrorDiv,
    confirmPasswordInput,
  } = passwordElements;

  if (errorMessages?.passwordError) {
    addErrorMessage(
      passwordInput,
      passwordErrorDiv,
      errorMessages.passwordError
    );
  } else {
    removeErrorMessage(passwordInput, passwordErrorDiv);
  }

  if (errorMessages?.confirmPasswordError) {
    addErrorMessage(
      confirmPasswordInput,
      confirmPasswordErrorDiv,
      errorMessages.confirmPasswordError
    );
  } else {
    removeErrorMessage(confirmPasswordInput, confirmPasswordErrorDiv);
  }
};

const fetchPasswordElements = (): PasswordElements | undefined => {
  const passwordInput = document.getElementById(
    ElaSettingsIds.passwordInput
  ) as HTMLInputElement;
  const passwordErrorDiv = document.getElementById(
    ElaSettingsIds.passwordErrorMessage
  ) as HTMLDivElement;

  const confirmPasswordInput = document.getElementById(
    ElaSettingsIds.confirmPasswordInput
  ) as HTMLInputElement;
  const confirmPasswordErrorDiv = document.getElementById(
    ElaSettingsIds.confirmPasswordErrorMessage
  ) as HTMLDivElement;

  if (
    !passwordInput ||
    !passwordErrorDiv ||
    !confirmPasswordInput ||
    !confirmPasswordErrorDiv
  ) {
    return;
  }

  return {
    passwordInput,
    passwordErrorDiv,
    confirmPasswordInput,
    confirmPasswordErrorDiv,
  };
};

const onElaPasswordBlur = (): PasswordErrorMessages | undefined => {
  const passwordElements = fetchPasswordElements();
  if (!passwordElements) {
    return;
  }

  const { passwordInput, confirmPasswordInput } = passwordElements;

  const errorMessages = validatePasswords(
    passwordInput.value,
    confirmPasswordInput.value
  );

  updatePasswordErrorMessages(passwordElements, errorMessages);

  return errorMessages;
};

const onElaPasswordSave = async () => {
  const passwordInputElement = document.getElementById(
    ElaSettingsIds.passwordInput
  ) as HTMLInputElement;
  const csrfTokenInput = document.getElementsByName(
    csrfTokenName
  )[0] as HTMLInputElement;

  const errorMessages = onElaPasswordBlur();

  if (errorMessages || !csrfTokenInput) {
    return;
  }

  const spinner = document.getElementById(ElaSettingsIds.elaPasswordSpinner);
  spinner?.classList.remove("d-none");

  const response = await postElaSettings(
    {
      password: passwordInputElement.value,
    },
    csrfTokenInput.value
  );

  spinner?.classList.add("d-none");

  if (response.isError) {
    createErrorToaster(
      "Unable to save data",
      "Unable to save Elder Law Answers password"
    );

    return;
  }

  createSuccessToaster(
    "Data successfully saved",
    "Elder Law Answers password changed."
  );

  const passwordReadMessage = document.getElementById(
    ElaSettingsIds.passwordReadMessage
  );

  if (!passwordReadMessage) {
    return;
  }
  passwordReadMessage.innerText = "**********";
  onElaPasswordCancel();
};
