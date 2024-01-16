import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

// initialize state using CounterState interface
const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another redux toolkit)'
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.data += action.payload //emma library to update state automatically
        },
        decrement: (state, action) => {
            state.data -= action.payload //emma library to update state automatically
        }
    }
})

// destructuring
export const { increment, decrement } = counterSlice.actions;

