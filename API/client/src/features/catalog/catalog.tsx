/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useEffect, useState } from "react";


//fragment is div tag used to put block of code under parent element (get error  otherwise)
//props allows using product property under app.tsx
// { products, addProduct }: allows us to remove props. from props.products. "Destructuring"
export default function Catalog() { 
    const [products, setProducts] = useState<Product[]>([]);

    // callback function: not returning anything so just ()
    useEffect(() => {
        fetch('http://localhost:5000/api/products') //fetch returns a promise
            .then(response => response.json())
            .then(data => setProducts(data))
    }, []) //add an empty array as dependency so it only runs once

   
    return (
        <>
            <ProductList products={products} />
         </>
    )
}