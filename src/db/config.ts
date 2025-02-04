import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Set the DynamoDB Local Endpoint
const dynamoDBConfig = {
  region: "eu-north-1",
  endpoint: "http://docker.for.mac.localhost:8000",
};

const client = new DynamoDBClient(dynamoDBConfig);
const docClient = DynamoDBDocumentClient.from(client);
export default docClient;
