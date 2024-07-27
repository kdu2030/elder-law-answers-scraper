type PostUserRequest = {
  username: string;
  email: string;
  password: string;
  canViewAdmin: boolean;
  canEditConfig: boolean;
};

type AddUserFormErrors = {
  username?: string;
  email?: string;
};

type PostUserResponse = {
  isError: boolean;
  formErrors?: AddUserFormErrors;
};

const postUser = async (
  request: PostUserRequest,
  csrfToken: string
): Promise<PostUserResponse> => {
  const url = "/api/user";

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      method: "POST",
      body: JSON.stringify(request),
    });

    return response.json() as Promise<PostUserResponse>;
  } catch (error) {
    console.log(error);
    return { isError: true };
  }
};
