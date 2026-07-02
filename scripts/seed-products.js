const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const products =
  require("../data/products.json");

const client =
  new DynamoDBClient({
    region: "us-east-2",
  });

const docClient =
  DynamoDBDocumentClient.from(client);

async function seedProducts() {

  for (const product of products) {

    await docClient.send(
      new PutCommand({
        TableName: "vlr-products",
        Item: product,
      })
    );

    console.log(
      `Inserted ${product.name}`
    );
  }

  console.log(
    "Products seeded successfully"
  );
}

seedProducts();