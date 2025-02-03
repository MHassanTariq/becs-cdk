import { Handler } from "aws-cdk-lib/aws-lambda";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ScanCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// Set the DynamoDB Local Endpoint
const isLocal = process.env.IS_OFFLINE === "true"; // Use an env variable to check if running locally
// const dynamoDBConfig = isLocal
//   ? { region: "eu-north-1", endpoint: "http://localhost:8000" } // Local DynamoDB
//   : { region: "eu-north-1" }; // AWS DynamoDB
const dynamoDBConfig = {
  region: "eu-north-1",
  endpoint: "http://docker.for.mac.localhost:8000",
};

const client = new DynamoDBClient(dynamoDBConfig);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "products";

export const getProducts: Handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Fetching products from DynamoDB...");

    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        products: response.Items || [],
      }),
    };
  } catch (error) {
    console.error("Error fetching products:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to retrieve products",
        error: (error as Error).message,
      }),
    };
  }
};

export const createProduct: Handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("event http method: ", event.httpMethod);
    console.log("endpoint: ", dynamoDBConfig);
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const { name, price } = JSON.parse(event.body);

    if (!name || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing product name or price" }),
      };
    }

    // Create new product object
    const newProduct = {
      Id: uuidv4(),
      name,
      price,
      createdAt: new Date().toISOString(),
    };

    // Insert into DynamoDB
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newProduct,
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: "Product created successfully",
        product: newProduct,
      }),
    };
  } catch (error) {
    console.error("Error creating product:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to create product",
        error: (error as Error).message,
      }),
    };
  }
};
