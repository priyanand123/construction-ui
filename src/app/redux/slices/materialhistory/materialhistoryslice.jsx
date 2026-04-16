import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { fetchmaterialHistoryListReq} from "../../../../api/materialhistoryApi/materialhistoryreq";

export const materialhistoryslice = createSlice({
  name: "materialhistoryList",
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

export const { setLoading, addData, setError } = materialhistoryslice.actions;
export default materialhistoryslice.reducer;

export const fetchMaterialHistoryList = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await fetchmaterialHistoryListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
    
  }
};
