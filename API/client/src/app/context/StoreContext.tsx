/// allowing shopping cart (basket) state available to rest of app

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket"

interface StoreContextValue {
    removeItem: (productId: number, quantity: number) => void;
    setBasket: (basket: Basket) => void; //method signature void setBasket(Basket basket)
    basket: Basket | null;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() { // rest of app can acces StoreContext directly using this hook useStoreContext
    const context = useContext(StoreContext);

    if (context === undefined) {
        throw Error('Oops - we do not seem to be inside the provider');
    }

    return context;
}
//passing children object as prop to StoreProvider
export function StoreProvider({ children }: PropsWithChildren<unknown>) {
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number) {
        if (!basket) return;
        const items = [...basket.items]; //creates new copy of array inside items
        const itemIndex = items.findIndex(i => i.productId === productId);
        if (itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if (items[itemIndex].quantity === 0) items.splice(itemIndex, 1) // remove the item from the array
            setBasket(prevState => {
                return {...prevState!, items} // prevState is non-null, will be accessible, otherwise compile error.
            })
        }
    }

    //providing basket, setbasket and removeitem in children prop
    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}