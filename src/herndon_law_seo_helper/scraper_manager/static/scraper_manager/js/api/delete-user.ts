type DeleteUserResponse = {
  isError: boolean;
};

const deleteUser = async (
  userId: number,
  csrfToken: string
): Promise<DeleteUserResponse> => {
  const url = `/api/${userId}/delete-user`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      method: "DELETE",
    });

    return response.json() as Promise<DeleteUserResponse>;
  } catch (error) {
    console.log(error);
    return { isError: true };
  }
};
