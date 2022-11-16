import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  // now that we are planning on binding to an observable we can change to the ChangeDetectionStrategy
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';

  // after defining our strategy in the component decorator and we bind to an observable products$
  // we dont need this anymore
  //product: Product | null = null;
  productSuppliers: Supplier[] | null = null;

  // we declare a product$ stream & assign it to the stream we created in the product.service
  // AND INCLUDED EXCEPTION HANDLING
  product$ = this.productService.selectedProducts$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(private productService: ProductService) { }

}
