const {
  DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  PutCommand
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

    const body = JSON.parse(event.body);

    console.log(
      "Request Body:",
      JSON.stringify(body, null, 2)
    );

    const favorite = {

      userId: body.userId,

      productId: Number(body.productId)

    };

    console.log(
      "Favorite Before Put:",
      JSON.stringify(favorite, null, 2)
    );

    await ddb.send(
      new PutCommand({

        TableName: "vlr-favorites",

        Item: favorite,

        ConditionExpression:
          "attribute_not_exists(userId) AND attribute_not_exists(productId)"

      })
    );

    return {

      statusCode: 200,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },

      body: JSON.stringify({
        message: "Favorite added successfully.",
        favorite
      })

    };

  } catch (error) {

    console.error(
      "ERROR:",
      error
    );

    if (error.name === "ConditionalCheckFailedException") {

      return {

        statusCode: 409,

        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS"
        },

        body: JSON.stringify({
          message: "Product is already in favorites."
        })

      };

    }

    return {

      statusCode: 500,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },

      body: JSON.stringify({
        message: error.message
      })

    };

  }

};