const {
  DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
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

    const result =
      await ddb.send(
        new GetCommand({
          TableName: "vlr-cart",
          Key: {
            userId: body.userId
          }
        })
      );

    let cart = result.Item;
    console.log(
      "Cart From DynamoDB:",
      JSON.stringify(cart, null, 2)
    );

    if (!cart) {

      cart = {
        userId: body.userId,
        items: [
          {
            productId: Number(body.productId),
            quantity: Number(body.quantity)
          }
        ]
      };

    } else {

      const existingItem =
        cart.items.find(
          item =>
            Number(item.productId) ===
            Number(body.productId)
        );

      if (existingItem) {

        existingItem.quantity =
          Number(existingItem.quantity) +
          Number(body.quantity);

      } else {

        cart.items.push({
          productId: Number(body.productId),
          quantity: Number(body.quantity)
        });

      }

    }

    console.log(
      "Cart Before Put:",
      JSON.stringify(cart, null, 2)
    );

    await ddb.send(
      new PutCommand({
        TableName: "vlr-cart",
        Item: cart
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify(cart)
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
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({
        message: error.message
      })
    };

  }

};