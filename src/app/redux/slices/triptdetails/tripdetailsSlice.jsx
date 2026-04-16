import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewTripReq,
  deleteTripReq,
  fetchTripListReq,
  updateTripReq,
  Fileattachments,
} from "../../../../api/tripdetailsApi/tripdetailsReq";
import { publicAxios, authAxios } from "../../../../api/config";
import { ApiKey } from "../../../../api/endpoints";
export const Tripslice = createSlice({
  name: "TripList",
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

export const { setLoading, addData, setError } = Tripslice.actions;
export default Tripslice.reducer;

export const addNewTrip = async (data, dispatch) => {
  try {
    const res = await addNewTripReq(data);
    dispatch(fetchTripList());
    return res;
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

export const updateTrip = async (data, dispatch) => {
  try {
    debugger;
    const res = await updateTripReq(data);
    dispatch(fetchTripList());
    return res;
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

export const deleteTrip = async (data, dispatch) => {
  try {
    debugger;
    const res = await deleteTripReq(data);
    dispatch(fetchTripList());
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

export const fetchTripList = () => async (dispatch) => {
  try {
   
    dispatch(setLoading());
    const res = await fetchTripListReq();
    dispatch(addData(res.data));
  } catch (error) {
    dispatch(setError());
   // dispatch(setLoading());

  }
};
export const uploadAttachments = async (id, files,dispatch) => {
  debugger;
  try {
    const fileFormData = new FormData();

    fileFormData.append("id", id); // Attach the Trip ID
    fileFormData.append("TypeofUser", "Trip");
    // Check if FormFiles (array of files) exists and append each file
    for (let i = 0; i < files.length; i++) {
      fileFormData.append("FormFiles", files[i]);
    }
    const response = await fetch(
      "https://gkamaraj-001-site1.qtempurl.com/api/attachmentDto",
      {
        method: "POST",
        body: fileFormData,
      }
    );

    if (response.status === 200) {
      const text = await response.text();
      dispatch(fetchTripList());
    } else if (response.status === 400) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
      return null;
    }
  } catch (error) {
    console.log(error);

    Swal.fire({
      title: "Error!",
      text: "Somethings went wrong. Please try again.",
      icon: "error",
    });
//throw new Error("");
    
  }
};

export const deleteAttachments = async (id, files) => {
  debugger;

  try {
    //const fileName = files.split('|')[0];
    const response = await publicAxios.get(`${ApiKey.deleteAttachment}/${id}/${"Trip"}/${files}`) 
     /*(
     "http://prasath-001-site3.ftempurl.com/api/attachmentDto/deleteAttachment",
      {
        method: "GET",
        body: body,
      }
    );*/

    if (response.status===204) {
      console.log("File deleted successfully");
      //dispatch(fetchTripList());
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: "Error!",
      text: "Something went wrong. Please try again.",
      icon: "error",
    });
    throw new Error("");
   
  }
};
/* const response = await publicAxios.post(`${ApiKey.Attachment}`, fileFormData, {
      headers: {
        "Content-Type": "multipart/form-data", // Automatically handled by Axios
      },
    });
    console.log("Upload Response:", response.data);
    if (response.status === 200) {
      console.log("File uploaded successfully");
      // You can handle the response if necessary, such as showing a success message
    } else {
      console.error("Failed to upload the file", response);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
    
};*/

/*export const uploadAttachments = async  (TripId) => {
  debugger;
  
  // Check if there are files to upload
  if (!Array.isArray(selectedFile) || selectedFile.length < 1) {
    dispatch(fetchRawMaterialList()); // Fetch updated list
    closePopup();
    clearState();
    return;
  }

  // Prepare FormData for the file upload
  const formData = new FormData();
  
  selectedFile.forEach((file) => {
    formData.append("FormFiles", file);
  });

  // Add additional parameters
  formData.append("TypeofUser", "Trip");
  formData.append("id", TripId);

  try {
    debugger;
    // Call the file upload API
    const response = await Fileattachments(formData);

    if (response.error) {
      console.error("File upload failed:", response.message);
    } else {
      console.log("Files uploaded successfully");
    }
  } catch (error) {
    console.error("Attachment Upload Error:", error);
  }
};*/
