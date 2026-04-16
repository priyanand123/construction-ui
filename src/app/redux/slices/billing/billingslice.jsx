import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewBillingReq,
  deleteBillingReq,
  fetchBillingListReq,
  updateBillingReq,
} from "../../../../api/billingApi/billingReq";

export const billingslice = createSlice({
  name: "billingList",
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

      //console.log(payload);
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

export const { setLoading, addData, setError } = billingslice.actions;
export default billingslice.reducer;

export const addNewBilling = async (data, dispatch) => {
  try {
    const res = await addNewBillingReq(data);
    dispatch(fetchBillingList());
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

export const updateBilling = async (data, dispatch) => {
  try {
    debugger;
    const res = await updateBillingReq(data);
    dispatch(fetchBillingList());
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

export const deleteBilling = async (data, dispatch) => {
  try {
    debugger;
    const res = await deleteBillingReq(data);
    dispatch(fetchBillingList());
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

export const fetchBillingList = () => async (dispatch) => {
  try {

    dispatch(setLoading());
    const res = await fetchBillingListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
  }
};
