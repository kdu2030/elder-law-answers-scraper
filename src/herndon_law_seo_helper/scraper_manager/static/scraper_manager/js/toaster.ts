const SUCCESS_TOASTER_ID = "base-success-toaster";
const SUCCESS_TOASTER_HEADER = "base-success-toaster-header";
const SUCCESS_TOASTER_BODY = "base-success-toaster-body";

const ERROR_TOASTER_ID = "base-error-toaster";
const ERROR_TOASTER_HEADER = "base-error-toaster-header";
const ERROR_TOASTER_BODY = "base-error-toaster-body";

enum WarningToasterIds {
  toasterBase = "base-warning-toaster",
  header = "base-warning-toaster-header",
  body = "base-warning-toaster-body",
}

const createSuccessToaster = (headerMsg: string, bodyMsg: string) => {
  const successToaster = document.getElementById(SUCCESS_TOASTER_ID);
  const toasterHeader = document.getElementById(SUCCESS_TOASTER_HEADER);
  const toasterBody = document.getElementById(SUCCESS_TOASTER_BODY);

  if (!toasterHeader || !toasterBody) {
    return;
  }

  toasterHeader.innerText = headerMsg;
  toasterBody.innerText = bodyMsg;

  //@ts-ignore
  const toaster = new bootstrap.Toast(successToaster);
  toaster.show();
};

const createErrorToaster = (headerMsg: string, bodyMsg: string) => {
  const errorToaster = document.getElementById(ERROR_TOASTER_ID);
  const toasterHeader = document.getElementById(ERROR_TOASTER_HEADER);
  const toasterBody = document.getElementById(ERROR_TOASTER_BODY);

  if (!toasterHeader || !toasterBody) {
    return;
  }

  toasterHeader.innerText = headerMsg;
  toasterBody.innerText = bodyMsg;

  // @ts-ignore
  const toaster = new bootstrap.Toast(errorToaster);
  toaster.show();
};

const createWarningToaster = (headerMsg: string, bodyMsg: string) => {
  const warningToaster = document.getElementById(WarningToasterIds.toasterBase);
  const toasterHeader = document.getElementById(WarningToasterIds.header);
  const toasterBody = document.getElementById(WarningToasterIds.body);

  if (!warningToaster || !toasterHeader || !toasterBody) {
    return;
  }

  toasterHeader.innerText = headerMsg;
  toasterBody.innerText = bodyMsg;

  //@ts-ignore
  const toaster = new bootstrap.Toast(warningToaster);
  toaster.show();
};
