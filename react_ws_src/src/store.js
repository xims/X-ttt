import { configureStore, createSlice } from "@reduxjs/toolkit";

// Create app slice with reducers
const appSlice = createSlice({
  name: "app",
  initialState: {
    ws_conf: null,
    loading: true,
  },
  reducers: {
    setWSConf: (state, action) => {
      state.ws_conf = action.payload;
      state.loading = false;
    },
  },
});

// Export actions
export const { setWSConf } = appSlice.actions;

// Create the store with configureStore
const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export default store;
