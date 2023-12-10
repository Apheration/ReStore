import {  Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
    products: Product[];
}

//grid system xs={4} so 12/4 = 3 cards per row
export default function ProductList({ products }: Props) {
    return (
        <Grid container spacing={4}>
            {products.map(product => (
                <Grid item xs={3} key={product.id}>
                    <ProductCard  product={product} />
                </Grid>
                
            ))}
        </Grid>

    )

}