import { HttpMethod } from "aws-cdk-lib/aws-events";
import { LambdaConfigurations } from "../../utils/types";

export const reportsRoutes: LambdaConfigurations[] = [
  {
    id: "GetReportsFunction",
    handler: "src/api/reports/handler.getReportListHandler",
    method: HttpMethod.GET,
    path: "/reports",
  },
  {
    id: "CreateProductFunction",
    handler: "src/api/reports/handler.createReportHandler",
    method: HttpMethod.POST,
    path: "/reports",
  },
];
