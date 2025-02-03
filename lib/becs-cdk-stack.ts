import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import { functionSettings } from "../src/default/config";
import { handlerLambdaConfigs } from "../src/handlers/handlerConfigs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class BecsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define DynamoDB Table matching local configuration
    const productsTable = new dynamodb.Table(this, "ProductsTable", {
      tableName: "products",
      partitionKey: { name: "Id", type: dynamodb.AttributeType.STRING }, // Match local setup
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
      const lambdaFunction = new lambdaNodeJs.NodejsFunction(this, config.id, {
        ...functionConfig,
        environment: {
          ...functionConfig.environment,
          TABLE_NAME: productsTable.tableName, // Pass table name as an env variable
        },
      });

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
