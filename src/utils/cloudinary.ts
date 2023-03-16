import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: `dmvhjd3e5`,
  api_key: "478684633832122",
  api_secret: "TxCBXbjIf5vVBtIkU7hfHWEpbp4",
  background_removal: 1,
  background_color: "white",
});
const cloudinaryUploadImg = async (fileToUploads: any) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUploads);
    return result.url;
  } catch (err) {
    console.log(err);
  }

  //   });
};
const cloudinaryDeleteImg = async (fileToDelete: any) => {
  const result = await cloudinary.uploader.destroy(fileToDelete);
  return result;
};

export { cloudinaryUploadImg, cloudinaryDeleteImg };
