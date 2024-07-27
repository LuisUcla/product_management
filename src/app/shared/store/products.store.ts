import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Product } from "../models/product.interface";
import { ProductService } from "../services/product.service";

export interface StockStore {
    productsList: Product[];
    product: any
    error: boolean
    loading: boolean
}

const initialState: StockStore = {
    productsList: [],
    error: false,
    loading: false,
    product: {}
}

export const StockStore = signalStore(
    { providedIn: 'root' },
    withState((initialState)),
    withComputed(({ productsList }) => ({
        productsLength: computed(() => calculatedProductLength(productsList())),
    })),

    withMethods(({ productsList, product, ...store }, productService = inject(ProductService)) => ({
        getProducts() {
            patchState(store, { loading: true });
            productService.getProducts().subscribe((products: Product[]) => {
                patchState(store, { loading: false });
                patchState(store, { productsList: [...productsList(), ...products] })
            });
        },
        getProductsById(id: string) {
            patchState(store, { loading: true });
            const product = productsList().find(product => product.id == id);
            if (product) {
                patchState(store, { loading: false });
                patchState(store, { product })
            }
        },
        addProductToStock(product: Product) {
            patchState(store, { loading: true });
            productService.addProduct(product).subscribe(() => {
                patchState(store, { productsList: [...productsList(), product] })
                patchState(store, { loading: false });
            });
        },
        updateProductInStock(id: string, product: Product) {
            patchState(store, { loading: true });
            productService.updateProduct(id, product).subscribe(() => {
                patchState(store, { loading: true });
                const isProduct = productsList().find(productItem => productItem.id == id);

                if (isProduct) {
                    isProduct.name = product.name;
                    isProduct.type = product.type;
                    isProduct.status = product.status;
                    patchState(store, { productsList: [...productsList()] })
                }
                patchState(store, { loading: false });
            });
        },
        checkProductInStock(id) { // producto defectuoso
            patchState(store, { loading: true });
            productService.checkOutProduct(id).subscribe((res: any) => {
                const isProduct = productsList().find(productItem => productItem.id == id);

                if (isProduct) {
                    isProduct.status = res.status
                    patchState(store, { productsList: [...productsList()] })
                }
                patchState(store, { loading: false });
            })
        }
    }))

)

function calculatedProductLength(product: Product[]): number {
    return product.length
}
