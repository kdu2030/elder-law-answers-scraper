type PutUserPermissionsRequest = {
  userId: number;
  canViewAdmin: boolean;
  canEditConfig: boolean;
};

type PutUserPermissionsResponse = {
  isError: boolean;
};

const putUserPermissions = async (
  request: PutUserPermissionsRequest,
  csrfToken: string
): Promise<PutUserPermissionsResponse> => {
  const url = "/api/permissions";

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(request),
      method: "PUT",
    });

    return response.json() as Promise<PutUserPermissionsResponse>;
  } catch (error) {
    return { isError: true };
  }
};
