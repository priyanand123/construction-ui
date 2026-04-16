import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewUnitsReq,
  deleteUnitsReq,
  fetchUnitsListReq,
  updateUnitsReq,
} from "../../../../api/unitsApi/units";

export const unitsslice = createSlice({
  name: "unitsList",
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

export const { setLoading, addData, setError } = unitsslice.actions;
export default unitsslice.reducer;

export const addNewUnits = async (data, dispatch) => {
  try {
    const res = await addNewUnitsReq(data);
    dispatch(fetchUnitsList());
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

export const updateUnits = async (data, dispatch) => {
  try {
    debugger;
    const res = await updateUnitsReq(data);
    dispatch(fetchUnitsList());
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

export const deleteUnits = async (data, dispatch) => {
  try {
    debugger;
    const res = await deleteUnitsReq(data);
    dispatch(fetchUnitsList());
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

export const fetchUnitsList = () => async (dispatch) => {
  try {
    
    dispatch(setLoading());
    const res = await fetchUnitsListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
  }
};
