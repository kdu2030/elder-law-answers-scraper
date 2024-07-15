type PostProfileImageResponse =
  | {
      isError: true;
    }
  | { isError: false; url: string };

const postProfileImage = async (
  csrfToken: string,
  imageFile: File
): Promise<PostProfileImageResponse> => {
  const url = "https://herndonlawfileservice.pythonanywhere.com/file-upload";
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    });

    return response.json() as Promise<PostProfileImageResponse>;
  } catch (error) {
    return { isError: true };
  }
};
