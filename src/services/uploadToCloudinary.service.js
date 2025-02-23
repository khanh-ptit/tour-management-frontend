export const uploadToCloudinary = async (file) => {
  if (!file) {
    console.error("No file selected for upload.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "quockhanhvhs"); // Đổi nếu cần

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dk8jxr6be/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${data.error?.message || response.statusText}`
      );
    }

    console.log("Upload successful:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
