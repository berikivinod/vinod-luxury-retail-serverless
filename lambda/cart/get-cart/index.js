const {
    DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    GetCommand,
    ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: "us-east-2"
});

const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

    try {

        const userId = String(
            event.queryStringParameters?.userId
        );

        const result =
            await ddb.send(
                new GetCommand({
                    TableName: "vlr-cart",
                    Key: {
                        userId
                    }
                })
            );

        const cart =
            result.Item || {
                userId,
                items: []
            };

        const productResult =
            await ddb.send(
                new ScanCommand({
                    TableName: "vlr-products"
                })
            );

        const products =
            productResult.Items || [];

        const items =
            cart.items.map(cartItem => {

                const product =
                    products.find(
                        p =>
                            p.id ===
                            cartItem.productId
                    );

                return {

                    productId:
                        cartItem.productId,

                    quantity:
                        cartItem.quantity,

                    name:
                        product?.name,

                    brand:
                        product?.brand,

                    image:
                        product?.image,

                    price:
                        product?.price,

                    category:
                        product?.category

                };

            });

        return {

            statusCode: 200,

            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods":
                    "GET,OPTIONS"
            },

            body: JSON.stringify({

                userId,

                items

            })

        };

    } catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods":
                    "GET,OPTIONS"
            },

            body: JSON.stringify({
                message: error.message
            })

        };

    }

};