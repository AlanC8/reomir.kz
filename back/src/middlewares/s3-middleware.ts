import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const s3 = new S3({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export const uploadFile = async (
  bucketName: string,
  fileBuffer: Buffer,
  key: string
): Promise<string | undefined> => {
  try {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: "application/octet-stream",
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    const result = await upload.done();
    console.log(`File uploaded successfully to ${bucketName}/${key}`);
    return `https://s3.amazonaws.com/${bucketName}/${key}`;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
};
