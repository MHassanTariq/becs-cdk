import { aws_lambda } from "aws-cdk-lib";
import path = require("path");
import { LambdaConfigurations } from "../types/default";

export const functionSettings = (
  accountId: string,
  lambdaConfig: LambdaConfigurations
) => {
  const [filePath, handler] = lambdaConfig.handler.split(".");
  return {
    entry: path.join(__dirname, `../../${filePath}.ts`),
    handler: handler,
    runtime: aws_lambda.Runtime.NODEJS_20_X,
    memorySize: 1028,
    tracing: aws_lambda.Tracing.ACTIVE,
    bundling: {
      minify: true,
    },
    environment: {
      AWS_ACCOUNT_ID: accountId,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  };
};
