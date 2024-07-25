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
