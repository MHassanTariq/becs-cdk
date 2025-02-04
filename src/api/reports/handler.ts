import { APIGatewayEvent } from "aws-lambda";
import { errorHandler } from "../../utils/errorHandling";
import { createReportController, getProductList } from "./controller";

export const getReportListHandler = async (event: APIGatewayEvent) => {
  return errorHandler(getProductList, event);
};

export const createReportHandler = async (event: APIGatewayEvent) => {
  return errorHandler(createReportController, event);
};
