import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewUserManagementReq,
  deleteUserManagementReq,
  fetchUserListReq,
  updateUserManagementReq,
  fetchUserByIdReq
} from "../../../../api/userApi/userRequest";

export const userslice = createSlice({
  name: "userManagementList",
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

export const { setLoading, addData, setError } = userslice.actions;
export default userslice.reducer;

export const addNewUserManagement = async (data, dispatch) => {
  try {
    const res = await addNewUserManagementReq(data);
    dispatch(fetchUserManagementList());
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

export const updateUserManagement = async (data, dispatch) => {
  try {
    debugger;
    const res = await updateUserManagementReq(data);
    dispatch(fetchUserManagementList());
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
// header profile
export const updateUserProfileAction = async (data, dispatch) => {
  try {
    const res = await updateUserManagementReq(data);
    dispatch(fetchUserManagementListbyId(data?.id));
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

export const deleteUserManagement = async (data, dispatch) => {
  try {
    debugger;
    const res = await deleteUserManagementReq(data);
    dispatch(fetchUserManagementList());
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

export const fetchUserManagementList = () => async (dispatch) => {
  try {
    
    dispatch(setLoading());
    const res = await fetchUserListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
  }
};
export const fetchUserManagementListbyId = (userId) => async (dispatch) => {
  try {
    const res = await fetchUserByIdReq(userId);
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
    dispatch(setLoading());
  }
};