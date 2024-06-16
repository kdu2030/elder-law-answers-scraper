enum SignInFormId {
  EmailErrorMessage = "email-error-message",
  EmailInput = "signin-email-input",
  PasswordInput = "signin-password-input",
  PasswordErrorMessage = "password-error-message",
  Spinner = "signin-submit-spinner",
}

const addErrorMessage = (
  inputElement: HTMLInputElement,
  errorMessageElement: HTMLDivElement,
  errorMessage: string
) => {
  inputElement.classList.add("is-invalid");
  errorMessageElement.innerText = errorMessage;
};

const removeErrorMessage = (
  inputElement: HTMLInputElement,
  errorMessageElement: HTMLDivElement
) => {
  inputElement.classList.remove("is-invalid");
  errorMessageElement.innerText = "";
};

const validateEmail = (
  emailAddress: string | undefined
): string | undefined => {
  if (!emailAddress || emailAddress.trim().length <= 0) {
    return "Email is required.";
  }

  if (
    !emailAddress.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm)
  ) {
    return "Email address is invalid.";
  }
};

const validatePassword = (password: string | undefined): string | undefined => {
  if (!password || password.trim().length === 0) {
    return "Password is required.";
  }
};

const onEmailBlur = (event: FocusEvent) => {
  const errorMessageDiv = document.getElementById(
    SignInFormId.EmailErrorMessage
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

const onPasswordBlur = (event: FocusEvent) => {
  const passwordErrorDiv = document.getElementById(
    SignInFormId.PasswordErrorMessage
  ) as HTMLDivElement;

  const passwordInput = event.target as HTMLInputElement;

  if (!passwordErrorDiv || !passwordInput) {
    return;
  }

  const errorMessage = validatePassword(passwordInput.value);

  if (errorMessage) {
    addErrorMessage(passwordInput, passwordErrorDiv, errorMessage);
    return;
  }

  removeErrorMessage(passwordInput, passwordErrorDiv);
};

const onSubmit = (event: SubmitEvent) => {
  const emailInput = document.getElementById(
    SignInFormId.EmailInput
  ) as HTMLInputElement;

  const passwordInput = document.getElementById(
    SignInFormId.PasswordInput
  ) as HTMLInputElement;

  const emailErrorDiv = document.getElementById(
    SignInFormId.EmailErrorMessage
  ) as HTMLDivElement;

  const passwordErrorDiv = document.getElementById(
    SignInFormId.PasswordErrorMessage
  ) as HTMLDivElement;

  if (!emailInput || !passwordInput) {
    return;
  }

  const emailErrorMessage = validateEmail(emailInput.value);
  const passwordErrorMessage = validatePassword(passwordInput.value);

  if (emailErrorMessage) {
    addErrorMessage(emailInput, emailErrorDiv, emailErrorMessage);
  }

  if (passwordErrorMessage) {
    addErrorMessage(passwordInput, passwordErrorDiv, passwordErrorMessage);
  }

  if (emailErrorMessage || passwordErrorMessage) {
    event.preventDefault();
  }

  const spinner = document.getElementById(SignInFormId.Spinner);
  spinner?.classList.remove("d-none");
};
