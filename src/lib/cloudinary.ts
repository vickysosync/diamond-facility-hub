import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "diamond_facility"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
}

export default cloudinary;
