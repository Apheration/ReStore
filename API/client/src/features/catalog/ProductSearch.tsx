import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";


export default function ProductSearch() {
    const { productParams } = useAppSelector(state => state.catalog) //redux
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm)
    const dispatch = useAppDispatch();

    // wait for 1000ms after typing anything in textfield
    const debouncedSearch = debounce((event: any) => {
        //send updated search term parameters from what user is typing in text field
        dispatch(setProductParams({searchTerm: event.target.value})) // current targeted form value
    }, 1000)

    return (
        <TextField
            label='search products'
            variant='outlined'
            fullWidth
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }
}
        />
    )
}