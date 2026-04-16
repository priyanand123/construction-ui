import { createSlice } from "@reduxjs/toolkit";
import { fetchCompanydetailsListReq ,updateCompanydetailsReq} from "../../../../api/companydetailsApi/companydetailsReq";
import Swal from "sweetalert2";
export const CompanydetailsSlice = createSlice({
  name: "Companydetails",
  initialState: {
    loading: false,
    error: false,
    data: []   ,  
    
  },
  reducers: {
    setLoading: (state) => {

      state.loading = true;
    },
    addData: (state, { payload }) => {
      debugger;
      state.loading = false;
      state.error = false;
      state.data = payload;
      return state;
      },

     
    
    setError: (state) => {
      state.error = true;
      state.loading = false;
      return state;
    },
  },
});

export const {
  setLoading,
  addData,
 
  setError,
} = CompanydetailsSlice.actions;
export default CompanydetailsSlice.reducer;





export const updateCompancyDetails = async (data, dispatch) => {
  try {
    debugger;
    const res = await updateCompanydetailsReq(data);
    dispatch(fetchCompanydetailsListAction());
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


export const fetchCompanydetailsListAction = () => async (dispatch) => {
  try {
    debugger;
    dispatch(setLoading());
    const res = await fetchCompanydetailsListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
  }
};
