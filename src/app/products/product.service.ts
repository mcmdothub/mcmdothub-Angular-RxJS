import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, combineLatest, map, Observable, tap, throwError } from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  // using Declarative Pattern for Data Retrieval
  // remove the method getProducts()
  // we define a property for the products observable
  // convention: any property referencing and observable end with $
  //products$ = this.http.get<Product[]>(this.productsUrl)                  // http.get returns an array of Products
  //.pipe(
    // use the map operator to multiply each product's price by 1.5
    //map(item => item.price*1.5),
    //map(products =>
      // we use product's array map method to access each array element
     //products.map(product => ({
      // spread operator "...product" to copy the product properties and values ( properties that we want to keep as original)
      // spread replace all this:
      // id: product.id,
      // productName: product.productName,
      // productCode: productCode:
      // description: product.description,
      //...product,
      // we need to handle the possibillíty of null or undefined price
      // will do that with a conditional operator: if the product price has a value you multiply otherwise return 0
      //price: product.price ? product.price * 1.5 : 0,
      //searchKey: [product.productName]
     //} as Product))),             // we add as Product to cast a new object literal to the product type
    //tap(data => console.log('Products: ', JSON.stringify(data))),
    //catchError(this.handleError)      // we call the handleError method
  //);

  products$ = this.http.get<Product[]>(this.productsUrl)
  .pipe(
    // we use the mapping on our combined observable
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  // combineLatest emits 1 item: an array containing the products array (first element) and categories array in the second element
  productsWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$
  ]).pipe(
    // use destructuring "([products, categories])" to define a name for each of the array elements
    map(([products, categories]) =>
      products.map(product => ({
        ...product,
        price: product.price ? product.price * 1.5 : 0,
        // we add to the maping the category field and used the find method on the categories array to find the products category using the category ID
        // and assing the found category name to the product's category property only if ? the find finds the category
        category: categories.find(c => product.categoryId === c.id)?.name,
        searchKey: [product.productName]
      } as Product))
    )
  );

  constructor(private http: HttpClient,
    private productCategoryService: ProductCategoryService
    ) { }

  // method getProducts return an Observable of type "Product"
  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       catchError(this.handleError)      // we call the handleError method
  //     );
  // }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  // inside hendleError method we build a custom error message
  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);

    // we use throw to throw the error to the subscriber(in our case our component)
    return throwError(() => errorMessage);
  }

}
