import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { CategoryModel } from 'src/app/core/models/categories.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { CategoryService } from 'src/app/shared/services/category-service/category.service';
import { ProductService } from 'src/app/shared/services/product-service/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  captionText = 'List of products';
  listOfProducts: Array<ProductModel> = [];
  listOfCategories: CategoryModel[] = [];
  totalValue: number;

  constructor(private readonly productService: ProductService,
              private readonly categoryService: CategoryService) { }

  ngOnInit(): void {
    this.callServices();
    this.listenerChanges();
  }

  callServices(): void {
    this.getAllCategories().pipe(
      mergeMap( (categories: CategoryModel[]) => {
        console.log('Executing mergeMap ...');
        return this.getAllProductos();
      })
    ).subscribe();
  }

  getAllCategories(): Observable<CategoryModel[]> {
    return this.categoryService.getCategory().pipe(
      tap((categories: CategoryModel[]) => {
        console.log('Executing categories ...');
        this.listOfCategories = [...categories];
      })
    );
  }

  getAllProductos(): Observable<ProductModel[]> {
    return this.productService.getAllProducts().pipe(
      tap((products: ProductModel[]) => {
        console.log('Executing getAllProducts...');
        this.listOfProducts = [...products];
        console.log('ListOfProducts', this.listOfProducts);
      })
    );
  }

  listenerChanges(): void {
    this.productService.getChanges().pipe(
      mergeMap( (change: boolean) => change ? this.getAllProductos() : of() )
    ).subscribe();
  }

  transformType(typeId: number): string | number {
    const categoryForChange = this.listOfCategories.find((category: CategoryModel) => category.id == typeId);
    return categoryForChange ? categoryForChange.name : typeId;
  }

  calculateDiscount(price: number, discount: number): number{
    this.totalValue = price - (price * (discount / 100));
    return this.totalValue;
  }

  trackByItems(index: number, item: ProductModel): number {
    return item.productId;
  }

}
