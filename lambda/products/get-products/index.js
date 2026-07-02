/*exports.handler = async () => {

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Products Lambda Working"
    })
  };

};*/
const {
  DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const client =
  new DynamoDBClient({
    region: "us-east-2"
  });

const docClient =
  DynamoDBDocumentClient.from(client);

exports.handler = async () => {

  const result =
    await docClient.send(
      new ScanCommand({
        TableName: "vlr-products"
      })
    );

  return {
    statusCode: 200,
     headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
  },
    body: JSON.stringify(
      result.Items
    )
  };
};