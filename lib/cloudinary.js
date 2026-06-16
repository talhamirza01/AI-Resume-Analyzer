import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadResume(buffer, fileName, userId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: `resumes/${userId}`,
        public_id: fileName.replace(/\.pdf$/i, ""),
        format: "pdf",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteResume(publicId) {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}

export default cloudinary;
