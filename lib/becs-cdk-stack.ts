import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import { handlerLambdaConfigs } from "../src/api/handlerConfigs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { LambdaConfigurations } from "../src/utils/types";
import path = require("path");

export class BecsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: Move this under each API endpint
    // Define DynamoDB Table matching local configuration
    const productsTable = new dynamodb.Table(this, "ProductsTable", {
      tableName: "products",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING }, // Match local setup
      billingMode: dynamodb.BillingMode.PROVISIONED, // Provisioned throughput
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN for production
    });

    // Define an API Gateway RestApi
    const api = new apigateway.RestApi(this, "BecsApiGateway", {
      restApiName: "BECS API Gateway",
      description: "API Gateway with BECS Lambdas.",
    });

    // Create Lambdas and routes
    handlerLambdaConfigs.forEach((config) => {
      // configurations
      const functionConfig = functionSettings(
        cdk.Stack.of(this).account,
        config
      );

      // Create the Lambda function
      const lambdaFunction = new lambdaNodeJs.NodejsFunction(
        this,
        config.id,
        functionConfig
      );

      // TODO: This will be updated as well
      // Grant Lambda permissions to access DynamoDB
      productsTable.grantReadWriteData(lambdaFunction);

      // Add a resource and method to the API Gateway
      const resource = api.root.resourceForPath(config.path);
      resource.addMethod(
        config.method,
        new apigateway.LambdaIntegration(lambdaFunction)
      );
    });
  }
}

export const functionSettings = (
  accountId: string,
  lambdaConfig: LambdaConfigurations
) => {
  const [filePath, handler] = lambdaConfig.handler.split(".");
  return {
    entry: path.join(__dirname, `../../${filePath}.ts`),
    handler: handler,
    runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
    memorySize: 1028,
    tracing: cdk.aws_lambda.Tracing.ACTIVE,
    bundling: {
      minify: true,
    },
    environment: {
      AWS_ACCOUNT_ID: accountId,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  };
};
