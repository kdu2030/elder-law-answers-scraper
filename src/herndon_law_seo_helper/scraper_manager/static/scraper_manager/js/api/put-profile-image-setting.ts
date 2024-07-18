type PutProfileImageSettingRequest = {
  imageUrl: string;
  fileName: string;
};

type PutProfileImageSettingResponse = {
  isError: boolean;
};

const putProfileImageSetting = async (
  request: PutProfileImageSettingRequest,
  csrfToken: string
): Promise<PutProfileImageSettingResponse> => {
  const url = `/api/profile-image`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(request),
    });

    return response.json();
  } catch (error) {
    return { isError: true };
  }
};
