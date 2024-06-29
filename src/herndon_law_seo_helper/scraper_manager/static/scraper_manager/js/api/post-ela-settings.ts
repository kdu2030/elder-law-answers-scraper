type PostElaSettingsRequest = {
  email?: string;
  password?: string;
};

type PostElaSettingsResponse = {
  isError: boolean;
};

const postElaSettings = async (
  elaSettingsRequest: PostElaSettingsRequest,
  csrfToken: string
): Promise<PostElaSettingsResponse> => {
  const url = "/api/ela-settings";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(elaSettingsRequest),
    });

    return response.json() as Promise<PostElaSettingsResponse>;
  } catch (error) {
    return { isError: true };
  }
};
