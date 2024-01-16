// action types
export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";


export interface CounterState {
    data: number;
    title: string;
}

// initialize state using CounterState interface
const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another redux counter)'
}

// Action creators
export function increment(amount = 1) {
    return {
        type: INCREMENT_COUNTER,
        payload: amount // argument
    }
}

export function decrement(amount = 1) {
    return {
        type: DECREMENT_COUNTER,
        payload: amount // argument
    }
}

// specifying type for action parameter (TS typesafety)
interface CounterAction {
    type: string,
    payload: number
}

//dispatch actions to store
export default function counterReducer(state = initialState, action: CounterAction) {
    //cannot mutating state with redux
    switch (action.type) {
        case INCREMENT_COUNTER:
            return {
                ...state, // create new copy of state
                data: state.data + action.payload
            }
        case DECREMENT_COUNTER:
            return {
                ...state, // create new copy of state
                data: state.data - action.payload
            }

        default:
            return state;
    }

}