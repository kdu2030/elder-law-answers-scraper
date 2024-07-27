/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">
/// <reference path="./api/put-user-settings.ts">

enum AdminBaseIds {
  passwordForm = "admin-password-form",
  editUserForm = "admin-edit-user-form",
  editUserSaveSpinner = "edit-user-save-spinner",
  editUserModal = "admin-edit-user-modal",
}

type EditUserForm = {
  userId?: number;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  shouldChangePassword: boolean;
  canViewAdmin?: boolean;
  canEditConfig?: boolean;
};

const EDIT_FIELDS_WITH_VALIDATION = [
  "username",
  "email",
  "password",
  "confirmPassword",
];

type EditUserFormErrors = {
  [K in keyof EditUserForm]?: string;
};

let editUserForm: EditUserForm = { shouldChangePassword: false };
let initialEditForm: EditUserForm;

const onClickUserEdit = (initialForm: EditUserForm) => {
  editUserForm = {
    ...editUserForm,
    ...initialForm,
  };

  initialEditForm = initialForm;
};

const validateRequiredString = (
  fieldName: string,
  stringValue: string | undefined,
  allowWhitespace: boolean = false
) => {
  const errorMessage = `${fieldName} is required.`;
  if (!stringValue) {
    return errorMessage;
  }

  if (!allowWhitespace && stringValue.trim().length <= 0) {
    return errorMessage;
  }

  return;
};

const validateEditUserForm = (
  editUserForm: EditUserForm
): EditUserFormErrors => {
  const usernameErrorMessage = validateRequiredString(
    "Username",
    editUserForm.username
  );

  const emailErrorMessage = validateEmail(editUserForm.email);

  const { passwordError, confirmPasswordError } = validatePasswords(
    editUserForm.password,
    editUserForm.confirmPassword
  );

  return {
    username: usernameErrorMessage,
    email: emailErrorMessage,
    password: passwordError,
    confirmPassword: confirmPasswordError,
  };
};

const updateEditUserErrorMessage = (
  userId: number,
  fieldName: string | undefined,
  errorMessage: string | undefined
) => {
  const inputElement = document.querySelector(
    `#${AdminBaseIds.editUserForm}-${userId} input[name=${fieldName}]`
  ) as HTMLInputElement;

  const errorMessageDiv = document.querySelector(
    `#${AdminBaseIds.editUserForm}-${userId} #${fieldName}-error-message`
  ) as HTMLDivElement;

  if (errorMessage) {
    addErrorMessage(inputElement, errorMessageDiv, errorMessage);
    return;
  }

  removeErrorMessage(inputElement, errorMessageDiv);
};

const updateFormErrorMessages = (
  userId: number,
  formErrors: EditUserFormErrors,
  targetFieldName?: string
) => {
  if (targetFieldName) {
    updateEditUserErrorMessage(
      userId,
      targetFieldName,
      formErrors[targetFieldName as keyof EditUserFormErrors]
    );
    return;
  }

  EDIT_FIELDS_WITH_VALIDATION.forEach((fieldName) => {
    updateEditUserErrorMessage(
      userId,
      fieldName,
      formErrors[fieldName as keyof EditUserFormErrors]
    );
  });
};

const onEditUserTextFieldBlur = (event: FocusEvent) => {
  const eventTarget = event.target as HTMLInputElement;
  const value = eventTarget.value;
  const fieldName = eventTarget.name;

  editUserForm = Object.assign(editUserForm, { [fieldName]: value });
  const formErrors = validateEditUserForm(editUserForm);

  if (!editUserForm.userId) {
    return;
  }

  updateFormErrorMessages(editUserForm.userId, formErrors, fieldName);
};

const onEditUserPasswordBlur = (event: FocusEvent) => {
  const eventTarget = event.target as HTMLInputElement;
  const value = eventTarget.value;
  const fieldName = eventTarget.name;

  editUserForm = Object.assign(editUserForm, { [fieldName]: value });
  const formErrors = validateEditUserForm(editUserForm);

  if (!editUserForm.userId) {
    return;
  }

  updateFormErrorMessages(editUserForm.userId, formErrors, "password");
  updateFormErrorMessages(editUserForm.userId, formErrors, "confirmPassword");
};

const onEditUserCheckboxChange = (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  const checked = eventTarget.checked;
  const fieldName = eventTarget.name;
  editUserForm = Object.assign(editUserForm, { [fieldName]: checked });
};

const updateStringInputValue = (
  userId: number,
  fieldName: string,
  value: string | undefined
) => {
  const inputElement = document.querySelector(
    `#${AdminBaseIds.editUserForm}-${userId} input[name=${fieldName}]`
  ) as HTMLInputElement;

  inputElement.value = value ?? "";
};

const setEditUserCheckboxValues = (editUserForm: EditUserForm) => {
  const userId = editUserForm.userId;
  const canViewAdminInput = document.querySelector(
    `#${AdminBaseIds.editUserForm}-${userId} input[name=canViewAdmin]`
  ) as HTMLInputElement;
  const canEditConfig = document.querySelector(
    `#${AdminBaseIds.editUserForm}-${userId} input[name=canEditConfig]`
  ) as HTMLInputElement;

  canViewAdminInput.checked = editUserForm.canViewAdmin ?? false;
  canEditConfig.checked = editUserForm.canEditConfig ?? false;
};

const onCancelEditUser = () => {
  const userId = editUserForm.userId ?? -1;
  if (userId === -1) {
    return;
  }

  const shouldChangePassword = document.querySelector(
    `#${AdminBaseIds.editUserForm}-${userId} input[name=shouldChangePassword]`
  ) as HTMLInputElement;
  shouldChangePassword.checked = true;

  const passwordForm = document.getElementById(
    `${AdminBaseIds.passwordForm}-${userId}`
  );
  passwordForm?.classList.add("d-none");

  setEditUserCheckboxValues(initialEditForm);

  EDIT_FIELDS_WITH_VALIDATION.forEach((fieldName) => {
    updateStringInputValue(
      userId,
      fieldName,
      initialEditForm[fieldName as keyof EditUserForm] as string | undefined
    );
  });

  updateFormErrorMessages(userId, {});
};

const onChangeEditPassword = (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  const shouldChangePassword = eventTarget.value === "true";
  const passwordForm = document.getElementById(
    `${AdminBaseIds.passwordForm}-${editUserForm.userId}`
  );

  if (shouldChangePassword) {
    editUserForm.shouldChangePassword = true;
    passwordForm?.classList.remove("d-none");
    return;
  }

  editUserForm.shouldChangePassword = false;
  passwordForm?.classList.add("d-none");
};

const toggleSaveSpinner = (userId: number, showSpinner: boolean) => {
  const spinner = document.getElementById(
    `${AdminBaseIds.editUserSaveSpinner}-${userId}`
  );

  if (showSpinner) {
    spinner?.classList.remove("d-none");
    return;
  }

  spinner?.classList.add("d-none");
};

const toggleCancelEnabled = (userId: number, isDisabled: boolean) => {
  const cancelButtons = document.querySelectorAll<HTMLButtonElement>(
    `#${AdminBaseIds.editUserModal}-${userId} button[data-bs-dismiss='modal']`
  );

  cancelButtons.forEach((cancelButton) => {
    cancelButton.disabled = isDisabled;
  });
};

const saveEditUserForm = async () => {
  const userId = editUserForm.userId ?? -1;
  const shouldChangePassword = editUserForm.shouldChangePassword ?? false;
  const formErrors = validateEditUserForm(editUserForm);
  const csrfToken = getCsrfToken();

  if (!csrfToken) {
    return;
  }

  if (!shouldChangePassword) {
    formErrors.password = undefined;
    formErrors.confirmPassword = undefined;
  }

  updateFormErrorMessages(userId, formErrors);

  if (
    Object.keys(formErrors).find(
      (key) => typeof formErrors[key as keyof EditUserFormErrors] === "string"
    )
  ) {
    return;
  }

  toggleSaveSpinner(userId, true);
  toggleCancelEnabled(userId, true);

  const userRequest: PutUserSettingsRequest = {
    userId: editUserForm.userId,
    username: editUserForm.username,
    email: editUserForm.email,
    password: editUserForm.password,
  };

  const response = await putUserSettings(userRequest, csrfToken);
  console.log(response);

  toggleSaveSpinner(userId, false);
  toggleCancelEnabled(userId, false);
};
