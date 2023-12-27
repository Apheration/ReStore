/* eslint-disable @typescript-eslint/no-explicit-any */

import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useEffect, useState } from "react";


//fragment is div tag used to put block of code under parent element (get error  otherwise)
//props allows using product property under app.tsx
// { products, addProduct }: allows us to remove props. from props.products. "Destructuring"
export default function Catalog() { 
    const [products, setProducts] = useState<Product[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true);

    // callback function: not returning anything so just ()
    useEffect(() => {
        agent.Catalog.list()
            .then(products => setProducts(products))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, []) //add an empty array as dependency so it only runs once
    // dependency tells react how many times to run. empty array = just once

    if (loading) return <LoadingComponent message='Loading products...' />
   
    return (
        <>
            <ProductList products={products} />
         </>
    )
}