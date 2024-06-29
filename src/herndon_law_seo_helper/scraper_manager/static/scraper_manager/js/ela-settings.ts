/// <reference path="./sign-in.ts">
/// <reference path="./api/post-ela-settings.ts">

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
    // @ts-ignore
    createErrorToaster(
      "Unable to save data",
      "Unable to save Elder Law Answers username"
    );
    return;
  }

  // @ts-ignore
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
