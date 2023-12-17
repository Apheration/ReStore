import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Link, Typography } from "@mui/material";
import { Product } from "../../app/models/product";


interface Props {
    product: Product;
}

// passing product property from parent component
// charAt(0).toUpperCase() first character to uppercase
export default function ProductCard({product}: Props) {
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
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / { product.type }
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Add to cart</Button>
                <Button component={Link} href={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card> 
    )
}
/*
                    Severity	Code	Description	Project	File	Line	Suppression State
Error	TS2769(TS) No overload matches this call.
    Overload 1 of 3, '(props: { href: string; } & ButtonOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref"> & { ...; }, "className" | ... 24 more ... | "startIcon">): Element', gave the following error.
        Type '{ children: string; component: OverridableComponent<LinkTypeMap<{}, "a">>; to: string; size: "small"; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & ButtonOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
            Property 'component' does not exist on type 'IntrinsicAttributes & { href: string; } & ButtonOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
                Overload 2 of 3, '(props: { component: OverridableComponent<LinkTypeMap<{}, "a">>; } & ButtonOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
                    Type '{ children: string; component: OverridableComponent<LinkTypeMap<{}, "a">>; to: string; size: "small"; }' is not assignable to type 'IntrinsicAttributes & { component: OverridableComponent<LinkTypeMap<{}, "a">>; } & ButtonOwnProps & Omit<...> & CommonProps & Omit<...>'.
                        Property 'to' does not exist on type 'IntrinsicAttributes & { component: OverridableComponent<LinkTypeMap<{}, "a">>; } & ButtonOwnProps & Omit<...> & CommonProps & Omit<...>'.
                            Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<ButtonTypeMap<{}, "button">>>): Element | null', gave the following error.
                                Type '{ children: string; component: OverridableComponent<LinkTypeMap<{}, "a">>; to: string; size: "small"; }' is not assignable to type 'IntrinsicAttributes & ButtonOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
                                    Property 'component' does not exist on type 'IntrinsicAttributes & ButtonOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.D: \Code\ReStore\API\client\tsconfig.json	D: \Code\ReStore\API\client\src\features\catalog\ProductCard.tsx	41	Active
*/