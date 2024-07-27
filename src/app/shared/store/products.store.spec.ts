import { TestBed } from '@angular/core/testing';
import { StockStore } from './products.store';
import { ProductService } from '../services/product.service';
import { of } from 'rxjs';
import { Product } from '../models/product.interface';

describe('StockStore', () => {
  let stockStore: StockStore;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'getProductsById',
      'addProduct',
      'updateProduct',
      'checkOutProduct'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        StockStore
      ]
    });

    stockStore = TestBed.inject(StockStore) as jasmine.SpyObj<any>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  it('should create', () => {
    expect(stockStore).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should set loading to true and then to false', () => {
      productService.getProducts.and.returnValue(of([]));
      stockStore.productsList = [ Object({ id: '1', name: 'Product 1', type: 'Type 1', status: 'Available' }) ];
      expect(stockStore.loading).toBeTrue();
      expect(productService.getProducts).toHaveBeenCalled();
      productService.getProducts().subscribe(() => {
        expect(stockStore.loading).toBeFalse();
      });
    });

    it('should update productsList', () => {
      const products: Product[] = [{ id: '1', name: 'Product 1', type: 'Type 1', status: 'Available' }];
      productService.getProducts.and.returnValue(of(products));
      //stockStore.getProducts();
      expect(productService.getProducts).toHaveBeenCalled();
      productService.getProducts().subscribe(() => {
        expect(stockStore.productsList).toEqual(products);
      });
    });
  });

  describe('getProductsById', () => {
    it('should set loading to true and then to false', () => {
      const product: Product = { id: '1', name: 'Product 1', type: 'Type 1', status: 'Available' };
      stockStore.productsList = [product];
     // stockStore.getProductsById('1');
      expect(stockStore.loading).toBeTrue();
      expect(stockStore.product).toEqual(product);
      expect(stockStore.loading).toBeFalse();
    });

    it('should find product by id', () => {
      const product: Product = { id: '1', name: 'Product 1', type: 'Type 1', status: 'Available' };
      stockStore.productsList = [product];
    //   stockStore.getProductsById('1');
      expect(stockStore.product).toEqual(product);
    });
  });

  describe('addProductToStock', () => {
    it('should add a product to the stock', () => {
      const product: Product = { id: '2', name: 'Product 2', type: 'Type 2', status: 'Available' };
      productService.addProduct.and.returnValue(of(product));
    //   stockStore.addProductToStock(product);
      expect(productService.addProduct).toHaveBeenCalledWith(product);
      productService.addProduct(product).subscribe(() => {
        expect(stockStore.productsList).toContain(product);
      });
    });
  });

  describe('updateProductInStock', () => {
    it('should update an existing product', () => {
      const product: Product = { id: '1', name: 'Updated Product', type: 'Updated Type', status: 'Updated Status' };
      stockStore.productsList = [{ id: '1', name: 'Product 1', type: 'Type 1', status: 'Available' }];
      productService.updateProduct.and.returnValue(of(product));
      //stockStore.updateProductInStock('1', product);
      expect(productService.updateProduct).toHaveBeenCalledWith('1', product);
      productService.updateProduct('1', product).subscribe(() => {
        expect(stockStore.productsList[0]).toEqual(product);
      });
    });
  });

  describe('checkProductInStock', () => {
    it('should update the status of a product to Defectuoso', () => {
      const product: Product = { id: '1', name: 'Product 1', type: 'Type 1', status: 'Available' };
      const updatedProduct = { ...product, status: 'Defectuoso' };
      stockStore.productsList = [product];
      productService.checkOutProduct.and.returnValue(of(updatedProduct));
      //stockStore.checkProductInStock('1');
      expect(productService.checkOutProduct).toHaveBeenCalledWith('1');
      productService.checkOutProduct('1').subscribe(() => {
        expect(stockStore.productsList[0].status).toEqual('Defectuoso');
      });
    });
  });
});
