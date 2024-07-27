import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import  AddAndUpdateProductComponent  from './add-and-update-product.component';
import { StockStore } from '../../shared/store/products.store';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddAndUpdateProductComponent', () => {
  let component: AddAndUpdateProductComponent;
  let fixture: ComponentFixture<AddAndUpdateProductComponent>;
  let stockStore: jasmine.SpyObj<StockStore>;
  let router: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    // Crear espías para StockStore y Router
    const stockStoreSpy = jasmine.createSpyObj('StockStore', ['getProductsById', 'updateProductInStock', 'addProductToStock', 'product', 'productsLength'], {
      productList: of({ id: '1', name: 'Product A', type: 'Elaborado a mano', status: 'En stock' }),
      productsLength: () => 1
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      imports: [
        AddAndUpdateProductComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: StockStore, useValue: stockStoreSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAndUpdateProductComponent);
    component = fixture.componentInstance;
    stockStore = TestBed.inject(StockStore) as jasmine.SpyObj<any>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form for editing when productId is provided', () => {
    //component.productId().includes('1');
    component.ngOnInit();

    expect(component.buttomText()).toBe('Actualizar');
    expect(component.title()).toBe('Editar Producto');
    //expect(stockStore.getProductsById).toHaveBeenCalledWith('1');
    
    // Simulate the async call completion
    fixture.whenStable().then(() => {
      expect(component.form.value).toEqual({
        id: '1',
        name: 'Product 1',
        type: 'Type 1',
        status: 'Available'
      });
    });
  });

  it('should add a new product when submit is called without productId', () => {
    //component.productId.set('');
    component.form.setValue({
      id: '2',
      name: 'Product A',
      type: 'Elaborado a mano',
      status: 'En stock'
    });

    component.submit();

    expect(stockStore.loading).toHaveBeenCalledWith({
      id: '2',
      name: 'Product A',
      type: 'Elaborado a mano',
      status: 'En stock'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should update existing product when submit is called with productId', () => {
   // component.productId.set('1');
    component.form.setValue({
      id: '1',
      name: 'Updated Product',
      type: 'Updated Type',
      status: 'Updated Status'
    });

    component.submit();

    expect(stockStore.productsList).toHaveBeenCalledWith('1', {
      id: '1',
      name: 'Updated Product',
      type: 'Updated Type',
      status: 'Updated Status'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
