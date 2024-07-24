enum AdminBaseIds {
  passwordForm = "admin-password-form",
}

let isPasswordVisible = false;

const onChangeEditPassword = (event: Event, userId: number) => {
  const eventTarget = event.target as HTMLInputElement;
  const shouldChangePassword = eventTarget.value === "true";
  const passwordForm = document.getElementById(
    `${AdminBaseIds.passwordForm}-${userId}`
  );

  if (shouldChangePassword) {
    isPasswordVisible = true;
    passwordForm?.classList.remove("d-none");
    return;
  }

  isPasswordVisible = false;
  passwordForm?.classList.add("d-none");
};
