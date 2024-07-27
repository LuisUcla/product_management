import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Product } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly _http = inject(HttpClient)
  private readonly apiUrl = environment.apiUrl;

  public getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.apiUrl}/products/?sort=desc`)
  }

  public addProduct(product: Product): Observable<any> {
    return this._http.post<Product>(`${this.apiUrl}/products`, product)
  }

  public updateProduct(id: string, product: Product): Observable<any> {
    return this._http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  public checkOutProduct(id: string): Observable<any> {
    return this._http.patch<Product>(`${this.apiUrl}/products/${id}/status`, { status: 'Defectuoso' });
  }


}
