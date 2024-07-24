enum AdminBaseIds {
  passwordForm = "admin-password-form",
}

type EditUserForm = {
  userId?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  isPasswordVisible: boolean;
};

type EditUserFormErrors = {
  [K in keyof EditUserForm]?: string;
};

const editUserForm: EditUserForm = { isPasswordVisible: false };
const editUserErrors: EditUserFormErrors = {};

const onClickUserEdit = (userId: string) => {
  editUserForm.userId = userId;
};

const onChangeEditPassword = (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  const shouldChangePassword = eventTarget.value === "true";
  const passwordForm = document.getElementById(
    `${AdminBaseIds.passwordForm}-${editUserForm.userId}`
  );

  if (shouldChangePassword) {
    editUserForm.isPasswordVisible = true;
    passwordForm?.classList.remove("d-none");
    return;
  }

  editUserForm.isPasswordVisible = false;
  passwordForm?.classList.add("d-none");
};
