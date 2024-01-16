import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeItem, setBasket } from "../Basket/BasketSlice";

export default function ProductDetails() {
    //    debugger; // for using debugger in chrome, better to use console.log
    const { basket } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const item = basket?.items.find(i => i.productId === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity); // populate textfield with set quantity from cart
        // uses promise so use .then
        // id && - checks if id is true then executes right side statement/operand
        id && agent.Catalog.details(parseInt(id))  // if id = true then
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id, item])


    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (parseInt(event.currentTarget.value) >= 0) { // do not allow going lower than 0
            setQuantity(parseInt(event.currentTarget.value));

        }
    }

    function handleUpdateCart() {
        if (!product) return;
        setSubmitting(true); // turn on loading flag
        // if we don't have the item/local state is greater (adding quantity) than what server shows
        if (!item || quantity > item.quantity) {

            const updatedQuantity = item ? quantity - item.quantity : quantity;
            agent.Basket.addItem(product.id, updatedQuantity) // cannot use this func unless product is defined
                .then(basket => dispatch(setBasket((basket))))
                .catch(error => console.log(error))
                .finally(() => setSubmitting(false))
        } else { // removing quantity
            const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product.id, updatedQuantity)
                .then(() => dispatch(removeItem({productId: product.id, quantity: updatedQuantity}))) // { } to pass only 1 argument
                .catch(error => console.log(error))
                .finally(() => setSubmitting(false));
        }
    }

    if (loading) return <LoadingComponent message='Loading Product...' />
    if (!product) return <NotFound />

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100' }} />

            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='h4' color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleInputChange}
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}
                            />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            disabled={item?.quantity === quantity}
                            loading={submitting}
                            onClick={handleUpdateCart}
                            sx={{ height: '55px' }}
                            color='primary'
                            variant='contained'
                            fullWidth

                        >
                            {item ? 'Update Quantity' : 'Add to Cart' }
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
