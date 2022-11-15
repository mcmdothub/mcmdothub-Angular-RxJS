import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];

  //products: Product[] = [];
  // Implement Async Pipe
  // $ indicates that is an Observable and not a simple Array
  // undefiend means we dont need to initialize it
  products$: Observable<Product[]> | undefined;

  //sub!: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // this.sub = this.productService.getProducts()
    //   .subscribe({
    //     next: products => this.products = products,
    //     error: err => this.errorMessage = err
    //   });
    // Implement Async Pipe
    this.products$ = this.productService.getProducts();
  }

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
