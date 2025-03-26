export const uploadToCloudinary = async (file) => {
  if (!file) {
    console.error("No file selected for upload.");
    return null;
  }

  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Missing Cloudinary environment variables.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
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
