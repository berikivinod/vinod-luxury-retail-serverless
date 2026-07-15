const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    DeleteCommand,
    ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: "us-east-2"
});

const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

    try {

        const body = JSON.parse(event.body);

        const userId = String(body.userId);

        const cartResult =
            await ddb.send(
                new GetCommand({
                    TableName: "vlr-cart",
                    Key: {
                        userId
                    }
                })
            );

        const cart = cartResult.Item;

        if (!cart || !cart.items || cart.items.length === 0) {

            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    message: "Shopping cart is empty."
                })
            };

        }

        const productsResult =
            await ddb.send(
                new ScanCommand({
                    TableName: "vlr-products"
                })
            );

        const products = productsResult.Items || [];

        let subtotal = 0;

        const orderItems = cart.items.map(cartItem => {

            const product =
                products.find(
                    p => p.id === cartItem.productId
                );

            const lineTotal =
                product.price * cartItem.quantity;

            subtotal += lineTotal;

            return {

    productId: product.id,

    productName: product.productName,

    brand: product.brand,

    image: product.image,

    quantity: cartItem.quantity,

    price: product.price,

    lineTotal

};

        });

        const tax =
            Number((subtotal * 0.08).toFixed(2));

        const shipping = 0;

        const total =
            subtotal + tax + shipping;

        const orderId =
            `ORD-${Date.now()}`;

        const order = {

            orderId,

            userId,

            orderDate:
                new Date().toISOString(),

            status: "PLACED",

            subtotal,

            tax,

            shipping,

            total,

            items: orderItems

        };

        await ddb.send(
            new PutCommand({

                TableName: "vlr-orders",

                Item: order

            })
        );

        await ddb.send(
            new DeleteCommand({

                TableName: "vlr-cart",

                Key: {
                    userId
                }

            })
        );

        return {

    statusCode: 200,

    headers: {
        "Access-Control-Allow-Origin": "*"
    },

    body: JSON.stringify({

        success: true,

        orderId,

        orderDate: order.orderDate,

        status: order.status,

        subtotal,

        tax,

        shipping,

        total

    })

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