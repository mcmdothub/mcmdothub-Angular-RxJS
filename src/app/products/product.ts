/* Defines the product entity */
export interface Product {
  id: number;
  productName: string;
  productCode?: string;           // "?"" may or not exist in the retrieve data = nullable fields
  description?: string;
  price?: number;
  categoryId?: number;
  quantityInStock?: number;
  searchKey?: string[];
  supplierIds?: number[];
}
