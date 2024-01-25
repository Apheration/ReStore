/* eslint-disable @typescript-eslint/no-explicit-any */

import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";


//fragment is div tag used to put block of code under parent element (get error  otherwise)
//props allows using product property under app.tsx
// { products, addProduct }: allows us to remove props. from props.products. "Destructuring"
export default function Catalog() { 
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();



    // callback function: not returning anything so just ()
    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [dispatch, productsLoaded]) //reruns if something changes from these dependencies
    // dependency tells react how many times to run. empty array = just once

    if (status.includes('pending')) return <LoadingComponent message='Loading products...' />
   
    return (
        <>
            <ProductList products={products} />
         </>
    )
}