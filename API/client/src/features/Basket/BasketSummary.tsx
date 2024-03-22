import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { addDollarSign } from '../../app/util/Util';
import { useAppSelector } from "../../app/store/configureStore";

interface Props {
    subtotal?: number;
}

export default function BasketSummary({ subtotal }: Props) {
    const { basket } = useAppSelector(state => state.basket);

    // ?? return 0 otherwise reduce doesn't know if basket is undefined
        subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * (item.price / 100)), 0) ?? 0;
    if (subtotal === undefined)
        subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0;
    const deliveryFee = subtotal > 100 ? 0 : 5;

   

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{addDollarSign(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{addDollarSign(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{addDollarSign(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}