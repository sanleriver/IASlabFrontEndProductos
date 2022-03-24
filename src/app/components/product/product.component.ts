import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class ProductComponent implements OnInit {
  form: FormGroup;
  listOfDiscounts: DiscountModel[] = [];
  listOfCategories: CategoryModel[] = [];

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
  }

  createForm(): void {
    this.form = this.fb.group({
      productId: ['', [Validators.required]],
      typeOfProduct: [undefined, [Validators.required]],
      name: ['', [Validators.required]],
      price: [0, [Validators.required]],
      discount: [{value: 0, disabled: true}],
      discountApply: [{value: false, disabled: true}]
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
    for (let i = 0; i < this.listOfDiscounts.length; i++){
      if(this.form.get('typeOfProduct').value == this.listOfDiscounts[i].idProduct){
        this.form.get('discount').setValue(this.listOfDiscounts[i].value);
        this.form.get('discountApply').setValue(this.listOfDiscounts[i].discountApply);
      }
    }
  }
}
