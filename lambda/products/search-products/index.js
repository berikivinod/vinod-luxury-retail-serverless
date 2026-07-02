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

const ddb =
  DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

  const searchText =
    (
      event.queryStringParameters?.q || ""
    ).toLowerCase();

  const result =
    await ddb.send(
      new ScanCommand({
        TableName: "vlr-products"
      })
    );

  const products =
    result.Items || [];

  const matches =
    products
      .filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(searchText) ||

          product.brand
            .toLowerCase()
            .includes(searchText) ||

          product.category
            .toLowerCase()
            .includes(searchText)
      )
      .slice(0, 5);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods":
        "GET,OPTIONS"
    },
    body: JSON.stringify(matches)
  };
};