import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewRawMaterialReq,
  deleteRawMaterialReq,
  fetchRawMaterialListReq,
  updateRawMaterialReq,
} from "../../../../api/rawmaterialApi/rawmaterialreq";

export const rawmaterialslice = createSlice({
  name: "rawmaterialList",
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

export const { setLoading, addData, setError } = rawmaterialslice.actions;
export default rawmaterialslice.reducer;

export const addNewRawMaterial = async (data, dispatch) => {
  try {
    const res = await addNewRawMaterialReq(data);
  
    dispatch(fetchRawMaterialList());
    
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

export const updateRawMaterial = async (data, dispatch) => {
  try {
    debugger;
    const res = await updateRawMaterialReq(data);
    dispatch(fetchRawMaterialList());
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

export const deleteRawMaterial = async (data, dispatch) => {
  try {
    debugger;
    const res = await deleteRawMaterialReq(data);
    dispatch(fetchRawMaterialList());
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

export const fetchRawMaterialList = () => async (dispatch) => {
  try {
    
    dispatch(setLoading());
    const res = await fetchRawMaterialListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
  }
};
