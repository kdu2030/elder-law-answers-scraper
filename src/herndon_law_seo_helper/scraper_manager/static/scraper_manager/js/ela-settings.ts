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
  usernameForm = "ela-username-form",
  changeUsernameButton = "ela-change-username-button",
  usernameErrorMessage = "ela-username-error-message",
  usernameInput = "ela-username-input",
  elaUsernameSpinner = "ela-username-spinner",
  changeUsernameReadMode = "ela-change-username-read-mode",
  existingUsernameValue = "ela-existing-username-value",
  changePasswordReadMode = "ela-change-password-read-mode",
  passwordForm = "ela-password-form",
  passwordInput = "ela-password-input",
  confirmPasswordInput = "ela-confirm-password-input",
  passwordErrorMessage = "ela-password-error-message",
  confirmPasswordErrorMessage = "ela-confirm-password-error-message",
  elaPasswordSpinner = "ela-password-spinner",
  passwordReadMessage = "ela-password-message",
  testScrapeSpinner = "ela-test-scrape-spinner",
}

const csrfTokenName = "csrfmiddlewaretoken";

const onChangeUsernameClick = () => {
  const usernameForm = document.getElementById(ElaSettingsIds.usernameForm);
  const changeUsernameReadMode = document.getElementById(
    ElaSettingsIds.changeUsernameReadMode
  );

  if (!usernameForm || !changeUsernameReadMode) {
    return;
  }

  changeUsernameReadMode.classList.add("d-none");
  usernameForm.classList.remove("d-none");
};

const onUsernameCancelClick = () => {
  const usernameForm = document.getElementById(ElaSettingsIds.usernameForm);
  const changeUsernameReadMode = document.getElementById(
    ElaSettingsIds.changeUsernameReadMode
  );

  if (!usernameForm || !changeUsernameReadMode) {
    return;
  }

  changeUsernameReadMode.classList.remove("d-none");
  usernameForm.classList.add("d-none");
};

const validateUsername = (value: string): string | undefined => {
  if (!value || value.trim().length === 0) {
    return "Username is required.";
  }
  return;
};

const onElaUsernameBlur = (event: FocusEvent) => {
  const errorMessageDiv = document.getElementById(
    ElaSettingsIds.usernameErrorMessage
  ) as HTMLDivElement;

  if (!event.target || !errorMessageDiv) {
    return;
  }
  const usernameInput = event.target as HTMLInputElement;
  const value = usernameInput.value;
  const errorMessage = validateUsername(value);

  if (errorMessage) {
    addErrorMessage(usernameInput, errorMessageDiv, errorMessage);
  } else {
    removeErrorMessage(usernameInput, errorMessageDiv);
  }
};

const UsernameSave = async () => {
  const userInput = document.getElementById(
    ElaSettingsIds.usernameInput
  ) as HTMLInputElement;
  const userErrorMessageDiv = document.getElementById(
    ElaSettingsIds.usernameErrorMessage
  ) as HTMLDivElement;

  const csrfTokenInput = document.getElementsByName(
    csrfTokenName
  )[0] as HTMLInputElement;
  const csrfToken = csrfTokenInput?.value;

  if (!userInput || !userErrorMessageDiv || !csrfToken) {
    return;
  }

  const errorMessage = validateEmail(userInput.value);

  if (errorMessage) {
    addErrorMessage(userInput, userErrorMessageDiv, errorMessage);
    return;
  }

  removeErrorMessage(userInput, userErrorMessageDiv);

  const spinner = document.getElementById(ElaSettingsIds.elaUsernameSpinner);
  spinner?.classList.remove("d-none");

  const response = await postElaSettings(
    { username: userInput.value },
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

  const existingUsernameValue = document.getElementById(
    ElaSettingsIds.existingUsernameValue
  );

  if (existingUsernameValue) {
    existingUsernameValue.innerText = userInput.value;
  }

  onUsernameCancelClick();
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

const onTestElaScrapeClick = async () => {
  const spinner = document.getElementById(ElaSettingsIds.testScrapeSpinner);
  spinner?.classList.remove("d-none");

  const response = await getScrapeElaArticle();

  spinner?.classList.add("d-none");

  if (response.isError) {
    createErrorToaster(
      "Post creation failed",
      response.error ?? "Unable to create post using Elder Law Answers"
    );
    return;
  }

  if (response.isWarning) {
    createWarningToaster(
      "Post creation unsuccessful",
      response.warning ?? "Unable to create post using Elder Law Answers"
    );
    return;
  }

  createSuccessToaster(
    "Post successfully created",
    "Created a new post using Elder Law Answers"
  );
};
