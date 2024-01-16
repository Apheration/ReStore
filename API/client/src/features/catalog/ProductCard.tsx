import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Link, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from  '../../app/util/Util';
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync} from "../Basket/BasketSlice";

interface Props {
    product: Product;
}

// passing product property from parent component
// charAt(0).toUpperCase() first character to uppercase
export default function ProductCard({ product }: Props) {
    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

 /*   function handleAddItem(productId: number) {
        setLoading(true);
        agent.Basket.addItem(productId)
            .then(basket => dispatch(setBasket(basket))) // update state in redux
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }*/
    return (
        
        <Card>
          
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                        }
                title={product.name}
                titleTypographyProps={{
                    sx: {fontWeight: 'bold', color: 'primary.main'}
                } }
            />

            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={ product.name }
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">
                    {currencyFormat(product.price) }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / { product.type }
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton
                    loading={status.includes('pendingAddItem' + product.id)}
                    onClick={() => dispatch(addBasketItemAsync({productId: product.id }))}
                    size="small">Add to cart</LoadingButton>
                <Button component={Link} href={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card> 
    )

}

/*
function uesStoreContext(): { setBasket: any; } {
    throw new Error("Function not implemented.");
}

*/