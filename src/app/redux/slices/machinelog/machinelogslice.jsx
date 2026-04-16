import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewMachinelogReq,
  deleteMachinelogReq,
  fetchMachinelogListReq,
  updateMachinelogReq,
} from "../../../../api/machinelogApi/machinilogreq";

export const machinelogslice = createSlice({
  name: "machinelogList",
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

export const { setLoading, addData, setError } = machinelogslice.actions;
export default machinelogslice.reducer;

export const addNewMachinelog = async (data, dispatch) => {
  try {
    const res = await addNewMachinelogReq(data);
    dispatch(fetchMachinelogList());
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

export const updateMachinelog = async (data, dispatch) => {
  try {
    debugger;
    const res = await updateMachinelogReq(data);
    dispatch(fetchMachinelogList());
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

export const deleteMachinelog = async (data, dispatch) => {
  try {
    debugger;
    const res = await deleteMachinelogReq(data);
    dispatch(fetchMachinelogList());
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

export const fetchMachinelogList = () => async (dispatch) => {
  try {
    
    dispatch(setLoading());
    const res = await fetchMachinelogListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
  }
};
