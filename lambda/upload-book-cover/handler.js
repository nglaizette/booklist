"use strict";

const AWS = require("aws-sdk");
const { S3 } = AWS;

const path = require("path");

const Jimp = require("jimp").default;
const uuid = require("uuid/v4");
const awsMultiPartParser = require("lambda-multipart-parser");

const checkLogin = require("../util/checkLoginToken");

const CorsResponse = obj => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  },
  body: JSON.stringify(obj)
});

const uploadToS3 = (fileName, body) => {
  const s3 = new S3({});
  var params = { Bucket: "my-library-cover-uploads", Key: `${fileName}`, Body: body };

  return new Promise(res => {
    s3.upload(params, function(err, data) {
      if (err) {
        return res(CorsResponse({ error: true, message: err }));
      }
      res(CorsResponse({ success: true, url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` }));
    });
  });
};

module.exports.upload = async event => {
  const formPayload = await awsMultiPartParser.parse(event);
  const size = formPayload.size;
  const loginToken = formPayload.loginToken;
  const userId = formPayload.userId;

  if (!checkLogin(userId, loginToken)) {
    return CorsResponse({});
  }

  const MAX_WIDTH = size == "small" ? 50 : size == "medium" ? 106 : 200;

  return new Promise(res => {
    Jimp.read(formPayload.files[0].content, function(err, image) {
      if (err || !image) {
        return res(CorsResponse({ error: true, message: err }));
      }

      const newName = `bookCovers/${userId}/${uuid()}${path.extname(formPayload.files[0].filename)}`;

      if (image.bitmap.width > MAX_WIDTH) {
        image.resize(MAX_WIDTH, Jimp.AUTO);

        image.getBuffer(image.getMIME(), (err, body) => {
          if (err) {
            return res(CorsResponse({ error: true, message: err }));
          }

          return res(uploadToS3(newName, body));
        });
      } else {
        image.getBuffer(image.getMIME(), (err, body) => {
          if (err) {
            return res(CorsResponse({ error: true, message: err }));
          }

          return res(uploadToS3(newName, body));
        });
      }
    });
  }).catch(err => CorsResponse({ error: true, message: err }));
};
