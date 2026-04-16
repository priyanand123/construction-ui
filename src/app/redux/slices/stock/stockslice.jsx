import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { fetchstockListReq,updatestockListReq} from "../../../../api/stockApi/stockreq";

export const stockslice = createSlice({
  name: "stockList",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
      return state;
    },
    setError: (state) => {
      state.error = true;
      state.loading = false;
    },
  },
});

export const { setLoading, addData, setError } = stockslice.actions;
export default stockslice.reducer;

export const fetchStockList = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await fetchstockListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
    
  }
};
export const updateStockList = async (data, dispatch) => {
  try {
    debugger;
    const res = await updatestockListReq(data);
    dispatch(fetchStockList());
  } catch (error) {
    dispatch(setError());
    dispatch(setLoading());
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw new Error("");
  }
};
