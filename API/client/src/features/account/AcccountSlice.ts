import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import agent from "../../app/api/agent";
import { FieldValues } from "react-hook-form";
import { router } from "../../app/Router/routes";
import { toast } from "react-toastify";

interface AccountState {
    user: User | null; // can be null
}

const initialState: AccountState = {
    user: null
}
//passing data as object will give error in Login.tsx  { data: FieldValues }
// 'account/signInUser' for redux dev tools
export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const user = await agent.Account.login(data);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        // set token in redux state->agent.ts interceptor
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {   // method to control whether asyncThunk should be executed
        // do not make network request if we don't have JWT user key in local storage (not logged in)
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder => {
        // session expired, log user out, give toast message and navigate to home
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again')
            router.navigate('/');
        })
        // research addMatcher
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
        // _state tells linter state isn't required
        builder.addMatcher(isAnyOf(signInUser.rejected), (_state, action) => {
        console.log(action.payload);
        });
    })
})

export const {signOut, setUser} = accountSlice.actions;