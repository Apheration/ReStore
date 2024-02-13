import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/CounterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/Basket/BasketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountSlice } from "../../features/account/AcccountSlice";

/*export function ConfigureStore() {
    return createStore(counterReducer);
}*/ // ctrl+shift+/

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer
    }
})

// get type of what store.getState returns
export type RootState = ReturnType<typeof store.getState>; //method return
export type AppDispatch = typeof store.dispatch; // property returned

// huh?
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/*
dispatch - allows us to dispatch actions(functions) that update the state in the store
selector - allows us to select(listen to) the state that is in the store.
*/