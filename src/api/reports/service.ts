import docClient from "../../db/config";
import { BecsReport } from "./types";
import { getId } from "../../utils/helper";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "reports";

export async function fetchReports() {
  const command = new ScanCommand({ TableName: TABLE_NAME, Limit: 10 });
  const response = await docClient.send(command);
  return response;
}

export async function createReport(report: BecsReport) {
  // Create new product object
  const newReport = {
    Id: getId(),
    ...report,
    createdAt: new Date().toISOString(),
  };

  // Insert into DynamoDB
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: newReport,
  });

  await docClient.send(command);
}
