import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";


const productsAdapter = createEntityAdapter<Product>();

//_ = void
export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.list();
        } catch (error) {
            // type checking or we get property data does not exist on type {} error.data
            // or just do this in .eslintrc.cjs  '@typescript-eslint/no-explicit-any': "off"
            return typeof error === 'object'
                && error !== null
                && 'data' in error
                ? thunkAPI.rejectWithValue({ error: error.data })
                : console.log("unable to obtain error information: " + error);
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error) {
            // type checking or we get property data does not exist on type {} error.data
            return typeof error === 'object'
                && error !== null
                && 'data' in error
                ? thunkAPI.rejectWithValue({ error: error.data })
                : console.log("unable to obtain error information: " + error);
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle',

    }),
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            console.log(action);
            state.status = 'idle';

        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action)
            state.status = 'idle';
        })
    })
})
                                           // RootState - get type of what store.getState returns
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);