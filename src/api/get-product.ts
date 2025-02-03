// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Hassan event: ", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Lambda!",
      event: event.httpMethod,
    }),
  };
};
