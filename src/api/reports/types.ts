export type BecsReport = {
  timestamp: string;
  quantity: number;
  productId: string;
  region: string;
  instanceType: string;
};
export function reportsValidator(value: any): BecsReport {
  if (!value.timestamp) {
    throw new Error("Timestamp is required");
  }
  if (!value.quantity) {
    throw new Error("Quantity is required");
  }
  if (!value.productId) {
    throw new Error("Product ID is required");
  }
  if (!value.region) {
    throw new Error("Region is required");
  }
  if (!value.instanceType) {
    throw new Error("Instance Type is required");
  }
  return value;
}
