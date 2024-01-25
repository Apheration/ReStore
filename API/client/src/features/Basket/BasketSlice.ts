import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

interface BasketState {
    basket: Basket | null
    status: string
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}
// quantity is optional parameter with default value of 1
export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItemAsync',
    async ({ productId, quantity = 1}, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error) {
            return typeof error === 'object'
                && error !== null
                && 'data' in error
                ? thunkAPI.rejectWithValue({ error: error.data })
                : console.log(error);
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, {
    productId: number, quantity: number, name?: string }>(
    'basket/removeItemAsync',
    async ({ productId, quantity }, thunkAPI) => {
        try {
            await agent.Basket.removeItem(productId, quantity);
        }
        catch (error) {
            return typeof error === 'object'
                && error !== null
                && 'data' in error
                ? thunkAPI.rejectWithValue({ error: error.data })
                : console.log(error);
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        },

    },
    //Pending, fullfilled, rejected
    // meta.arg gets data from BasketPages removeitemasync passing the parameter.
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
//            console.log(action);
            state.status = 'pendingAddItem' + action.meta.arg.productId;
            console.log(`productId: ${action.meta.arg.productId}`);
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            console.log(`quantity: ${action.meta.arg.quantity}`);

            state.basket = action.payload; //payload becomes Basket type from CreateThunk method
            state.status = 'idle';
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {  //allow to target specific button we clicked
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity } = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            console.log(`quantity: ${ quantity }`);
            console.log(`itemIndex: ${itemIndex}`);
            if (itemIndex === -1 || itemIndex === undefined) return console.log('Not Fulfilled! itemIndex: ', itemIndex);
            console.log(`state.basket!.items[itemIndex]: ${state.basket!.items[itemIndex]} \n 
                        state.basket!.items[itemIndex].quantity: ${state.basket!.items[itemIndex].quantity}`);
            state.basket!.items[itemIndex].quantity -= quantity; // if items are available so is basket (! = for sure not null)
                                                                  // also, quantity is set to 1 in all included methods, so can override                                     warning with '!'
            console.log(`quantity: ${quantity}`);
            console.log(`itemIndex: ${itemIndex}`);
            if (state.basket?.items[itemIndex].quantity === 0)
                state.basket.items.splice(itemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
    })
})

export const {setBasket} = basketSlice.actions;