/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">

enum AdminBaseIds {
  passwordForm = "admin-password-form",
  editUserForm = "admin-edit-user-form",
}

type EditUserForm = {
  userId?: string;
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
let editUserErrors: EditUserFormErrors = {};
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
  userId: string,
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
  userId: string,
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
      formErrors[targetFieldName as keyof EditUserFormErrors]
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
  userId: string,
  fieldName: string,
  value: string | undefined
) => {
  const inputElement = document.querySelector(
    `#${AdminBaseIds.editUserForm}-${userId} input[name=${fieldName}]`
  ) as HTMLInputElement;

  inputElement.value = value ?? "";
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
