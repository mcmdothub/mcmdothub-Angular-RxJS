import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BehaviorSubject, catchError, combineLatest, EMPTY, filter, map, Observable, of, startWith, Subject } from 'rxjs';
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

  // Implementing Reacting to Actions
  // Follow 3 steps
  // 1. Create an action stream
  // we want the action stream to emit the selectedCategoryId every time the user selects the category
  // that ID is a number so we create a new subject of number
  // mo other code should use this subject so we define it as private
  // private is not obligatory because we declare it inside a component and not a service but is helpful to follow the same pattern when creating a subject
  //private categorySelectedSubject = new Subject<number>();

  // this is the second solution for setting the default value for drop-down using BahaviorSubject
  private categorySelectedSubject = new BehaviorSubject<number>(0);

  // then we expose the subject's observable using asObservable
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // 2. next step to combine the action stream with our data stream
  // instead of setting products$ to just the data stream
  // we set it to the combination of the data stream and action stream
  products$ = combineLatest([
    this.productService.productsWithCategory$,      // stream1(emits the array of products inside map): we use productsWithCategory because we want to display the category string not the ID
    this.categorySelectedAction$                    // stream2(emits the selectedCategoryId every time the user select a category from the drop-down): we specify our newly created action stream
    // one way to select default value for drop-down is pipe, second way is using BahaviorSubject
    //.pipe(
      // we pipe our action stream through the startWith operator with the value of 0
      // now the default drop-down is set to 0: display all
      //startWith(0)
    //)
  ])
  .pipe(
    // inside the pipe line we perform our filter
    // we first destructure the array elements [products, selectedCategoryId] emitted from combineLatest
    map(([products, selectedCategoryId]) =>
    // then use the products array filter method to filter our list
      products.filter(product => selectedCategoryId ? product.categoryId === selectedCategoryId : true)
    ),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  //selectedCategoryId = 1;

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
  // products$ = this.productService.productsWithCategory$
  //   .pipe(
  //     catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })
  //   );

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
  //productsSimpleFilter$ = this.productService.productsWithCategory$
    //.pipe(
      // map operator to map the emitted array
      //map(products =>
        // use the array's filter method to filter the elements in this array
        // returns only those products with the selected category ID
        //products.filter(product =>
          // if ? there is a selectedCategoryId we check the product.categoryId against the selectedCategoryId
          // otherwise there is no selectedCategoryId  we return true to select all products
          //this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
          //)
        //)
    //);

  // Implementing Reacting to Actions


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

  //onSelected(categoryId: string): void {
    // we set the selectedCategoryId to the ID that user selected
    // we use + to cast it to a number.The + is required or "===" in the filter function won't match our value
    //this.selectedCategoryId = + categoryId;
    //console.log('Product-category.service => onSelected method:', this.selectedCategoryId);
  //}

  // Implementing Reacting to Actions

  // 3. last step is to emit a value to the action stream every time an action occurs
  // onSelected method is called every time the user selected an item from the category drop-down
  onSelected(categoryId: string): void {
    // we use the subject's next method to emit the selectedCategoryId to the stream
    // add the + to cast the ID (which is string) to a number
    this.categorySelectedSubject.next(+categoryId);
  }
}
