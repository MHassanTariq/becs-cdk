import { APIGatewayEvent } from "aws-lambda";
import { fetchReports, createReport } from "./service";
import { reportsValidator } from "./types";

const TABLE_NAME = "products";

export const getProductList = async (event: APIGatewayEvent) => {
  const response = await fetchReports();
  console.log(response.ConsumedCapacity);
  return response.Items;
};

export const createReportController = async (event: APIGatewayEvent) => {
  const report = reportsValidator(JSON.parse(event.body ?? ""));
  const response = await createReport(report);
  return response;
};
