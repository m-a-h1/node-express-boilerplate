const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const config = require("../config/config");

const bucketName = config.s3.bucketName;
const domain = `https://${bucketName}.parspack.net`;
const baseUrl = `${domain}/${bucketName}`;

const privateBucketName = config.s3Private.bucketName;
const privateDomain = `https://${privateBucketName}.parspack.net`;
const privateBaseUrl = `${privateDomain}/${privateBucketName}`;

const s3 = new S3Client({
  region: "default",
  endpoint: domain,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretAccessKey,
  },
});

const s3Private = new S3Client({
  region: "default",
  endpoint: privateDomain,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.s3Private.accessKey,
    secretAccessKey: config.s3Private.secretAccessKey,
  },
});

exports.uploadFile = async (filepath, s3path) => {
  const fileStream = fs.createReadStream(filepath);
  const key = `${s3path}/${path.basename(filepath)}`;
  const params = {
    Bucket: bucketName,
    Body: fileStream,
    Key: key,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  // handle error in file streaming
  fileStream.on("error", (err) => {
    console.log("File Error", err);
  });

  await s3.send(new PutObjectCommand(params));
  return { path: key, url: `${baseUrl}${key}` };
};

exports.removeFile = (filePath) =>
  s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filePath,
    })
  );

exports.getListPrivate = async () => {
  const response = await s3Private.send(
    new ListObjectsCommand({
      Bucket: privateBucketName,
    })
  );
  return response;
};

exports.uploadFilePrivate = async (filepath, fileRoot) => {
  const fileStream = fs.createReadStream(filepath);
  const s3Path = `/backup/${fileRoot}/${filepath.split("/").pop()}`;
  const params = {
    Bucket: privateBucketName,
    Body: fileStream,
    Key: s3Path,
  };

  // handle error in file streaming
  fileStream.on("error", (err) => {
    console.log("File Error", err);
  });

  await s3Private.send(new PutObjectCommand(params));
  return { path: s3Path, url: `${privateBaseUrl}${s3Path}` };
};

exports.removeFilePrivate = (filePath) =>
  s3Private.send(
    new DeleteObjectCommand({
      Bucket: privateBucketName,
      Key: filePath,
    })
  );
