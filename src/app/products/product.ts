/* Defines the product entity */
export interface Product {
  id: number;
  productName: string;
  productCode?: string;           // "?"" may or not exist in the retrieve data = nullable fields
  description?: string;
  price?: number;
  categoryId?: number;
  category?: string,              // property for category Name and make it optional "?" since it won't populate until we map it
  quantityInStock?: number;
  searchKey?: string[];
  supplierIds?: number[];
}
