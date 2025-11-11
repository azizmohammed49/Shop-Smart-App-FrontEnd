import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  success: false,
  data: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signout: (state) => {
      state = initialState;
    },
    login: (state, action) => {
      state.data = action.payload.data;
      state.success = action.payload.success;
    },
  },
});

export const { signout, login } = userSlice.actions;
export default userSlice.reducer;
