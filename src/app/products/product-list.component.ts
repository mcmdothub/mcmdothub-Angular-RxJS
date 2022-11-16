import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { catchError, EMPTY, filter, map, Observable, of } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush       // we set the change detection strategy here in the Component decorator
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  //local categories property
  //categories: ProductCategory[] = [];

  // hardcode a default category selection
  selectedCategoryId = 1;

  //products: Product[] = [];
  // Implement Async Pipe
  // $ indicates that is an Observable and not a simple Array
  // undefiend means we dont need to initialize it
  //products$: Observable<Product[]> | undefined;

  // using Declarative Pattern for Data Retrieval
  // products$ = this.productService.products$
  //   .pipe(
  //     catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })
  //   );

  // productsWithCategory provids the same array of products but with extra category property
  products$ = this.productService.productsWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  // property for the product category data stream
  // we assign it to the productCategories Observable defined in the productCategoryService & include exception handling
  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  // new Observable for our filtered list
  productsSimpleFilter$ = this.productService.productsWithCategory$
    .pipe(
      // map operator to map the emitted array
      map(products =>
        // use the array's filter method to filter the elements in this array
        // returns only those products with the selected category ID
        products.filter(product =>
          // if ? there is a selectedCategoryId we check the product.categoryId against the selectedCategoryId
          // otherwise there is no selectedCategoryId  we return true to select all products
          this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
          )
        )
    );


  //sub!: Subscription;

  // inject productService & productCategoryService
  constructor(private productService: ProductService,
    private productCategoryService: ProductCategoryService) { }

  // After using Declarative Pattern for Data Retrieval we dont need ngOnInit anymore
  //ngOnInit(): void {
    // this.sub = this.productService.getProducts()
    //   .subscribe({
    //     next: products => this.products = products,
    //     error: err => this.errorMessage = err
    //   });
    // Implement Async Pipe
    //this.products$ = this.productService.getProducts()
    // we want to catch any errors thrown from the service so we pipe the observable through the catchError operator function
    //.pipe(
      // catchError takes in the error: err
      // we'll assign any returned error message to our errorMessage property
      //catchError(err => {
        //this.errorMessage = err;      // catch the error and assign the error message
        // replace the observable with a new one
        // if we have an error => we have no products so we could return an observable that emits an empty array "of([])"
        //return of([]);
        //return EMPTY;                 // alternative we can use the empty RxJs constant
        // in "product.service" if you delete an s from productsUrl = 'api/products'
        // console will return an error: "error:"Collection 'product' not found"" => our handle errors works
        // even UI will return an error: "Backend returned code 404: undefined"
      //})
    //)
  //}

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    // we set the selectedCategoryId to the ID that user selected
    // we use + to cast it to a number.The + is required or "===" in the filter function won't match our value
    this.selectedCategoryId = + categoryId;
    console.log('Product-category.service => onSelected method:', this.selectedCategoryId);
  }
}
