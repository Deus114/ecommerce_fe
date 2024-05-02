import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

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
            if (isExitIndex > -1) {
                carts[isExitIndex].quantity = carts[isExitIndex].quantity + item.quantity;
                if (carts[isExitIndex].quantity > carts[isExitIndex].detail.quantity) {
                    carts[isExitIndex].quantity = carts[isExitIndex].detail.quantity
                }
            }
            else
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail });
            state.carts = carts;
            message.success("Thêm sản phẩm vào giỏ hàng thành công !");
        },

        doUpdateCartAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;
            let isExitIndex = carts.findIndex(c => c._id === item._id);
            if (isExitIndex > -1) {
                carts[isExitIndex].quantity = item.quantity;
                if (carts[isExitIndex].quantity > carts[isExitIndex].detail.quantity) {
                    carts[isExitIndex].quantity = carts[isExitIndex].detail.quantity
                }
            }
            else
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail });
            state.carts = carts;
        },

        doDeleteCartAction: (state, action) => {
            state.carts = state.carts.filter(c => c._id !== action.payload._id);
        }
    },
    extraReducers: (builder) => {
    },
});

export const { doAddBookAction, doUpdateCartAction, doDeleteCartAction } = orderSlice.actions;

export default orderSlice.reducer;