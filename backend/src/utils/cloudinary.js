import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "djtgukoor",
  api_key: "857813186736768",
  api_secret: "vAzmSowIDl4tc5LodNd4h9S3B0M",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file uploaded successfully
    // console.log("file has been uploaded sucessfully:", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    fs.unlinkSync(localFilePath); //remove locally saved file
    return null;
  }
};

export { uploadOnCloudinary };
