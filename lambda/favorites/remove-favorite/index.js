const {
  DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  DeleteCommand
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
    const productId = Number(event.pathParameters?.productId);

    console.log(
      "UserId:",
      userId
    );

    console.log(
      "ProductId:",
      productId
    );

    if (!userId || !productId) {

      return {

        statusCode: 400,

        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "DELETE,OPTIONS"
        },

        body: JSON.stringify({
          message: "userId and productId are required."
        })

      };

    }

    await ddb.send(
      new DeleteCommand({

        TableName: "vlr-favorites",

        Key: {

          userId,

          productId

        },

        ConditionExpression:
          "attribute_exists(userId) AND attribute_exists(productId)"

      })
    );

    return {

      statusCode: 200,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS"
      },

      body: JSON.stringify({

        message: "Favorite removed successfully."

      })

    };

  } catch (error) {

    console.error(
      "ERROR:",
      error
    );

    if (error.name === "ConditionalCheckFailedException") {

      return {

        statusCode: 404,

        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "DELETE,OPTIONS"
        },

        body: JSON.stringify({

          message: "Favorite not found."

        })

      };

    }

    return {

      statusCode: 500,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS"
      },

      body: JSON.stringify({

        message: error.message

      })

    };

  }

};