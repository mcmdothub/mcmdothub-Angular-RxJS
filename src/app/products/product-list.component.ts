import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { catchError, EMPTY, Observable, of } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';

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
  categories: ProductCategory[] = [];

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


  //sub!: Subscription;

  constructor(private productService: ProductService) { }

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
    console.log('Not yet implemented');
  }
}
