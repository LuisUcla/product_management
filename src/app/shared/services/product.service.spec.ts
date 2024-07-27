import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.interface';
import { environment } from '../../../environments/environment.development';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  // Define los datos de ejemplo para las pruebas
  const mockProducts: Product[] = [
    { id: '1', name: 'Product A', type: 'Elaborado a mano',status: 'En stock' },
    { id: '2', name: 'Product B', type: 'Elaborado a mano',status: 'En stock' }
  ];

  const mockProduct: Product = { id: '1', name: 'Product A',type: 'Elaborado a mano', status: 'En stock' };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica si hay solicitudes pendientes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/?sort=desc`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a product', () => {
    service.addProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should update a product', () => {
    service.updateProduct('1', mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should mark product as defective', () => {
    const updatedProduct = { ...mockProduct, status: 'Defectuoso' };

    service.checkOutProduct('1').subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'Defectuoso' });
    req.flush(updatedProduct);
  });

});
