import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CategoryModel } from 'src/app/core/models/categories.model';
import { DiscountModel } from 'src/app/core/models/discount.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { CategoryService } from 'src/app/shared/services/category-service/category.service';
import { DiscountService } from 'src/app/shared/services/discount-service/discount.service';
import { ProductService } from 'src/app/shared/services/product-service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  form: FormGroup;
  listOfDiscounts: DiscountModel[] = [];
  listOfCategories: CategoryModel[] = [];
  suscribe$: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllCategories();
    this.getAllDiscounts();
    this.listenerFieldTypeOfProduct();
  }

  createForm(): void {
    this.form = this.fb.group({
      productId: ['', [Validators.required]],
      typeOfProduct: [undefined, [Validators.required]],
      name: ['', [Validators.required]],
      price: [0, [Validators.required]],
      discount: [0],
      discountApply: [false]
    });
  }

  onClickSave(): void {
    if (this.form.valid) {
      const product: ProductModel = { ...this.form.value };
      this.productService.saveProduct(product).subscribe(
        (product: ProductModel) => {
          // logic - if request is success
          this.form.reset();
          alert(`Se ha guardado con exito el producto: ${product.productId} - ${product.name}` );
          this.productService.setChanges(true);
        }
      );
    } else {
      alert('El Formulario no se encuentra valido.');
    }
  }

  getAllCategories(): void {
    this.categoryService.getCategory().subscribe(
      (categories: CategoryModel[]) => {
        console.log('Executing getCategories...', categories);
        this.listOfCategories = [...categories];
        console.log('List of categories', this.listOfCategories);
      });
  }

  getAllDiscounts(): void {
    this.discountService.getAllDiscount().subscribe(
      (discounts: DiscountModel[]) => {
        console.log('Executing getAllDiscounts...', discounts);
        this.listOfDiscounts = [...discounts];
        console.log('List of discounts', this.listOfDiscounts);
      });
  }

  validateDiscount(): void{
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.listOfDiscounts.length; i++){
      if(this.form.get('typeOfProduct').value == this.listOfDiscounts[i].idProduct){
        this.form.get('discount').setValue(this.listOfDiscounts[i].value);
        this.form.get('discountApply').setValue(this.listOfDiscounts[i].discountApply);
      }
    }
  }

  onChangeTypeOfProduct(): void{
    console.log(this.form.get('typeOfProduct').value);
  }

  listenerFieldTypeOfProduct(): void{
    this.suscribe$ = this.form.get('typeOfProduct').valueChanges.subscribe(
      (typeOfProduct: string) => {
        this.validateDiscount();
      }
    );
  }

  ngOnDestroy(): void {
    this.suscribe$.unsubscribe();
  }
}
