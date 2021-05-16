"use strict";

const AWS = require("aws-sdk");
const bucket = "funner-bucket";
AWS.config.update({ region: "us-west-2" });

let S3 = new AWS.S3();

exports.handler = async (event) => {
  let downloaded = await download();
  let list = downloaded.body;
  console.log("LIST", list);
  console.log("Body:", list, typeof list);

  let metadata = event.Records[0].s3.object;
  let metaJSON = JSON.stringify(metadata, null, 2);

  console.log("Metadata:", metaJSON);
  list.push(metaJSON);
  //   await uploadOnS3("images.json", list);
  console.log("Image List: ", list);
  await putObjectToS3(bucket, "images.json", list);
};

async function download() {
  try {
    const data = await S3.getObject({
      Bucket: bucket,
      Key: "images.json",
    }).promise();

    return {
      statusCode: 200,
      body: JSON.parse(data.Body.toString("utf-8")),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: err.message || JSON.stringify(err.message),
    };
  }
}

async function putObjectToS3(bucket, key, data) {
  var s3 = new AWS.S3();
  var bucketParams = {
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(data),
  };

  await s3.putObject(bucketParams, function (err, data) {
    if (err) {
      console.log("error", err);
    } else {
      console.log("success", data);
    }
  });
}
