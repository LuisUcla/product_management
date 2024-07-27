import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StockStore } from '../../shared/store/products.store';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css'
})
export default class StockListComponent {
  
  private readonly stockStore = inject(StockStore);
  products = this.stockStore.productsList;
  private readonly router = inject(Router);
  
  
  editProduct(id?: string) {
    this.router.navigate(['/updateProduct', id]);
  }

  toggleProduct(event: any) {
    const id = event.target.value
    this.stockStore.checkProductInStock(id);
  }

}
