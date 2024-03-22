import { Button, Grid, Link, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";

export default function BasketPage() {
    const { basket } = useAppSelector(state => state.basket);

    


    if (!basket) return <Typography variant='h3'>Your cart is empty</Typography>

    return (
        <>
            <BasketTable items={basket.items} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary />
                    <Button
                        component={Link}
                        href='/checkout'
                        variant='contained'
                        size='large'
                        fullWidth
                    >
                    Checkout
                    </Button>
                </Grid>
            </Grid>

        </>
     
    )

}