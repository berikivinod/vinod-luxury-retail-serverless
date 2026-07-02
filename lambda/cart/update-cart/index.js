const {
    DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: "us-east-2"
});

const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

    try {

        const body =
            JSON.parse(event.body);

        const userId =
            String(body.userId);

        const productId =
            Number(body.productId);

        const quantity =
            Number(body.quantity);

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
            result.Item;

        if (!cart) {

            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "PUT,OPTIONS"
                },
                body: JSON.stringify({
                    message: "Cart not found."
                })
            };

        }

        const item =
            cart.items.find(
                p =>
                    Number(p.productId) === productId
            );

        if (!item) {

            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "PUT,OPTIONS"
                },
                body: JSON.stringify({
                    message: "Product not found in cart."
                })
            };

        }

        item.quantity = quantity;

        cart.items =
            cart.items.filter(
                p => p.quantity > 0
            );

        await ddb.send(
            new PutCommand({
                TableName: "vlr-cart",
                Item: cart
            })
        );

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
                            Number(p.id) ===
                            Number(cartItem.productId)
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
                "Access-Control-Allow-Methods": "PUT,OPTIONS"
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
                "Access-Control-Allow-Methods": "PUT,OPTIONS"
            },

            body: JSON.stringify({
                message: error.message
            })

        };

    }

};