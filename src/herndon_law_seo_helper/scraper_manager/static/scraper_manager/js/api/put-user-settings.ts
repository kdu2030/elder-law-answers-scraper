type PutUserSettingsRequest = {
  username?: string;
  email?: string;
  password?: string;
};

type PutUserSettingsResponse = {
  isError: boolean;
};

export const putUserSettings = async (
  request: PutUserSettingsRequest,
  csrfToken: string
): Promise<PutUserSettingsResponse> => {
  const url = "/api/user-settings";

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(request),
    });

    return response.json() as Promise<PutUserSettingsResponse>;
  } catch (error) {
    return { isError: true };
  }
};