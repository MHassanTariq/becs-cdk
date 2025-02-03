import { HttpMethod } from "aws-cdk-lib/aws-events";
import { LambdaConfigurations } from "../../types/default";

export const productsLambdaConfigs: LambdaConfigurations[] = [
  {
    id: "GetProductsFunction",
    handler: "src/handlers/products/controller.getProducts",
    method: HttpMethod.GET,
    path: "/products",
  },
  {
    id: "CreateProductFunction",
    handler: "src/handlers/products/controller.createProduct",
    method: HttpMethod.POST,
    path: "/products",
  },
];
