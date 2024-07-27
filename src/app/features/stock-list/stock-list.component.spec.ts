import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import StockListComponent from './stock-list.component';
import { StockStore } from '../../shared/store/products.store';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('StockListComponent', () => {
  let component: StockListComponent;
  let fixture: ComponentFixture<StockListComponent>;
  let stockStore: jasmine.SpyObj<StockStore>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear un espía para el StockStore
    const stockStoreSpy = jasmine.createSpyObj('StockStore', ['checkProductInStock'], {
      productsList: of([{ id: '1', name: 'Product 1', status: 'Available' }])
    });

    // Crear un espía para el Router
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [StockListComponent, RouterTestingModule],
      //declarations: [StockListComponent],
      providers: [
        { provide: StockStore, useValue: stockStoreSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StockListComponent);
    component = fixture.componentInstance;
    stockStore = TestBed.inject(StockStore) as jasmine.SpyObj<any>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate when editProduct is called', () => {
    component.editProduct('1');
    expect(router.navigate).toHaveBeenCalledWith(['/updateProduct', '1']);
  });

  it('should call stockStore.checkProductInStock when toggleProduct is called', () => {
    const event = { target: { value: '1' } };
    component.toggleProduct(event);
    expect(stockStore.productsList).toHaveBeenCalledWith('1');
  });

  it('should initialize productsList', () => {
    component.products.call((products: string | any[]) => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Product 1');
    });
  });
});
