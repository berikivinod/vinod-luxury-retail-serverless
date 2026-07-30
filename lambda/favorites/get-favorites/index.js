const {
  DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchGetCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-2"
});

const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true
  }
});

exports.handler = async (event) => {

  try {

    const userId = event.queryStringParameters?.userId;

    console.log(
      "UserId:",
      userId
    );

    if (!userId) {

      return {

        statusCode: 400,

        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS"
        },

        body: JSON.stringify({
          message: "userId is required."
        })

      };

    }

    const favorites = await ddb.send(
      new QueryCommand({

        TableName: "vlr-favorites",

        KeyConditionExpression:
          "userId = :userId",

        ExpressionAttributeValues: {

          ":userId": userId

        }

      })
    );

    console.log(
      "Favorites:",
      JSON.stringify(favorites.Items, null, 2)
    );

    if (!favorites.Items || favorites.Items.length === 0) {

      return {

        statusCode: 200,

        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS"
        },

        body: JSON.stringify([])

      };

    }

    const keys = favorites.Items.map(item => ({
      id: item.productId
    }));

    console.log(
      "Product Keys:",
      JSON.stringify(keys, null, 2)
    );

    const products = await ddb.send(
      new BatchGetCommand({

        RequestItems: {

          "vlr-products": {

            Keys: keys

          }

        }

      })
    );

    const productList = products.Responses["vlr-products"] || [];

    // Preserve the same order as the favorites table
    const orderedProducts = keys
      .map(key =>
        productList.find(product => product.id === key.id)
      )
      .filter(Boolean);

    console.log(
      "Products:",
      JSON.stringify(orderedProducts, null, 2)
    );

    return {

      statusCode: 200,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
      },

      body: JSON.stringify(orderedProducts)

    };

  } catch (error) {

    console.error(
      "ERROR:",
      error
    );

    return {

      statusCode: 500,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
      },

      body: JSON.stringify({
        message: error.message
      })

    };

  }

};