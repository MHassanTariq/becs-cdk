import { APIGatewayEvent } from "aws-lambda";

export async function errorHandler(
  func: (param: APIGatewayEvent) => Promise<any>,
  event: APIGatewayEvent
) {
  try {
    const response = await func(event);
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
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
}
