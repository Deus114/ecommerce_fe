import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    carts: [],
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;
            let isExitIndex = carts.findIndex(c => c._id === item._id);
            if (isExitIndex > -1)
                carts[isExitIndex].quantity = carts[isExitIndex].quantity + item.quantity;
            else
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail });
            state.carts = carts;
        },
    },
    extraReducers: (builder) => {
    },
});

export const { } = orderSlice.actions;

export default orderSlice.reducer;