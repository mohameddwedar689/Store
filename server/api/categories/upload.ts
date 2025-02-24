import { createWriteStream } from "fs";
import { join } from "path";
import { defineEventHandler, readMultipartFormData } from "h3";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  if (!formData) {
    return { success: false, message: "No file uploaded" };
  }

  const file = formData.find((item) => item.name === "file");
  if (!file || !file.filename) {
    return { success: false, message: "Invalid file uploaded" };
  }

  const fileExtension = file.filename.split(".").pop();
  const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  if (
    !fileExtension ||
    !allowedExtensions.includes(fileExtension.toLowerCase())
  ) {
    return { success: false, message: "Invalid file type" };
  }

  const uniqueFilename = `${Date.now()}-${file.filename}`;
  const filePath = join("public/uploads", uniqueFilename);

  const writeStream = createWriteStream(filePath);
  writeStream.write(file.data);

  const fileUrl = `/uploads/${uniqueFilename}`;

  return {
    success: true,
    filePath: fileUrl,
  };
});
