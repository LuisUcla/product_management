import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StockStore } from './shared/store/products.store';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let stockStore: jasmine.SpyObj<StockStore>;
  beforeEach(async () => {
    const stockStoreSpy = jasmine.createSpyObj('StockStore', ['getProducts']);
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        AppComponent, // Importar el componente en lugar de declararlo
        RouterOutlet,
        HeaderComponent
      ],
      providers: [
        { provide: StockStore, useValue: stockStoreSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    stockStore = TestBed.inject(StockStore) as jasmine.SpyObj<any>;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
