import { HttpMethod } from "aws-cdk-lib/aws-events";

export type LambdaEvent = {
  httpMethod: string;
  body: any;
  queryStringParameters: any;
};

export type LambdaConfigurations = {
  id: string; // identifier of lambda
  handler: `src/${string}.${string}`; // example: "src/handlers/products/index.createProduct"
  method: HttpMethod;
  path: `/${string}`; // example: "/products"
};
