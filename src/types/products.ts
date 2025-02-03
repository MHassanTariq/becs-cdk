export type ProductsRequest = {
  prod_category: string;
};

export type ProductsResponse = {
  product_names: string[];
  count: number;
};
