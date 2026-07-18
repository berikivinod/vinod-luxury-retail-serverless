const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    GetCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: "us-east-2"
});

const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

    try {

        const orderId = event.pathParameters?.orderId;

        if (!orderId) {

            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    message: "orderId is required."
                })
            };

        }

        const result = await ddb.send(
            new GetCommand({
                TableName: "vlr-orders",
                Key: {
                    orderId
                }
            })
        );

        if (!result.Item) {

            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    message: "Order not found."
                })
            };

        }

        return {

            statusCode: 200,

            headers: {
                "Access-Control-Allow-Origin": "*"
            },

            body: JSON.stringify(result.Item)

        };

    }
    catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            headers: {
                "Access-Control-Allow-Origin": "*"
            },

            body: JSON.stringify({
                message: error.message
            })

        };

    }

};