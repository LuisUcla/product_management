import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockStore } from '../../shared/store/products.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-and-update-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-and-update-product.component.html',
  styleUrl: './add-and-update-product.component.css'
})
export default class AddAndUpdateProductComponent implements OnInit {

  form: FormGroup;
  private builder = inject(FormBuilder)
  private readonly stockStore = inject(StockStore);
  private readonly router = inject(Router);
  productId = input<string>('', { alias: 'id' })
  buttomText = signal<string>('Agregar');
  title = signal<string>('Agrega un nuevo producto');

  constructor() {
    this.form = this.builder.group({
      id: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required]
    })
   }
  ngOnInit(): void {
    if (this.productId()) {
      // editar
      this.buttomText.set('Actualizar');
      this.title.set('Editar Producto');
      this.stockStore.getProductsById(this.productId());
      this.form.setValue({
        id: this.stockStore.product().id,
        name: this.stockStore.product().name,
        type: this.stockStore.product().type,
        status: this.stockStore.product().status
      });
    }
  }

   submit() {
    if (this.productId()) { // editar
      this.stockStore.updateProductInStock(this.productId(), this.form.value);
      this.router.navigate(['/']);
    } else { // agregar
      const length = this.stockStore.productsLength();
      this.form.controls['id'].setValue((length + 1).toString());
      this.stockStore.addProductToStock(this.form.value);
      this.router.navigate(['/']);
    }
   }
}
