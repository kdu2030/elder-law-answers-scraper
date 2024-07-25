/// <reference path="./sign-in.ts">
/// <reference path="./ela-settings.ts">

enum AdminBaseIds {
  passwordForm = "admin-password-form",
}

type EditUserForm = {
  userId?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  shouldChangePassword: boolean;
};

type EditUserFormErrors = {
  [K in keyof EditUserForm]?: string;
};

let editUserForm: EditUserForm = { shouldChangePassword: false };
let editUserErrors: EditUserFormErrors = {};

const onClickUserEdit = (initialForm: EditUserForm) => {
  editUserForm = {
    ...editUserForm,
    ...initialForm,
  };
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

  if (!allowWhitespace || stringValue.trim().length > 0) {
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

const onEditUsernameBlur = (event: FocusEvent) => {
  const eventTarget = event.target as HTMLInputElement;
  const username = eventTarget.value;

  editUserForm.username = username;
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
