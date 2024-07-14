type PostProfileImageResponse =
  | {
      isError: true;
    }
  | { isError: false; profileImageUrl: string };

const postProfileImage = async (
  csrfToken: string,
  imageFile: File
): Promise<PostProfileImageResponse> => {
  const url = "/api/profile-image";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: imageFile,
    });

    return response.json() as Promise<PostProfileImageResponse>;
  } catch (error) {
    return { isError: true };
  }
};
