import { createSlice } from "@reduxjs/toolkit";
//import { fetchSummarysListReq } from "../../../../api/summaryApi/summaryReq";
import {
    fetchUserByIdReq,
    updateUserManagementReq,
} from "../../../../api/userApi/userRequest";
import Swal from "sweetalert2";

export const profileSlice = createSlice({
  name: "profile",
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
    },
  },
});

export const { setLoading, addData, setError } = profileSlice.actions;
export default profileSlice.reducer;

export const fetchUserProfileAction = (userId) => async (dispatch) => {
  try {
    const res = await fetchUserByIdReq(userId);
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
    dispatch(setLoading());
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
  


