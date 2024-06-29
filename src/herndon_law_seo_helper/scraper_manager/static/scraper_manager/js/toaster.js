const SUCCESS_TOASTER_ID = "base-success-toaster";
const SUCCESS_TOASTER_HEADER = "base-success-toaster-header";
const SUCCESS_TOASTER_BODY = "base-success-toaster-body";

const ERROR_TOASTER_ID = "base-error-toaster";
const ERROR_TOASTER_HEADER = "base-error-toaster-header";
const ERROR_TOASTER_BODY = "base-error-toaster-body";

const createSuccessToaster = (headerMsg, bodyMsg) => {
  const successToaster = document.getElementById(SUCCESS_TOASTER_ID);
  const toasterHeader = document.getElementById(SUCCESS_TOASTER_HEADER);
  const toasterBody = document.getElementById(SUCCESS_TOASTER_BODY);

  toasterHeader.innerText = headerMsg;
  toasterBody.innerText = bodyMsg;

  const toaster = new bootstrap.Toast(successToaster);
  toaster.show();
};

const createErrorToaster = (headerMsg, bodyMsg) => {
  const errorToaster = document.getElementById(ERROR_TOASTER_ID);
  const toasterHeader = document.getElementById(ERROR_TOASTER_HEADER);
  const toasterBody = document.getElementById(ERROR_TOASTER_BODY);

  toasterHeader.innerText = headerMsg;
  toasterBody.innerText = bodyMsg;

  const toaster = new bootstrap.Toast(errorToaster);
  toaster.show();
}

