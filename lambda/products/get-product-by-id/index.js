const { DynamoDBClient } =
  require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand
} = require("@aws-sdk/lib-dynamodb");

const client =
  new DynamoDBClient({
    region: "us-east-2"
  });

const docClient =
  DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

  const id =
    Number(event.pathParameters.id);

  const result =
    await docClient.send(
      new GetCommand({
        TableName: "vlr-products",
        Key: {
          id: id
        }
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
      result.Item
    )
  };
};