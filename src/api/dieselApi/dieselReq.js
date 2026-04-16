import { publicAxios,authAxios } from "../config";
import { ApiKey } from "../endpoints";

export const fetchDieselListReq = async () => {
  try {
    
    const res = await publicAxios.get(`${ApiKey.Diesel}`);

    const _data = res.data;

    return {
      error: false,
      data: _data,
      message: "",
      errorMsg: "",
    };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
export const fetchUserByIdReq = async (userId) => {
  try {
    const res = await authAxios.get(
      `${ApiKey.Diesel}/${userId}`
    );

    const _data = res?.data[0];

    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
export const addNewDieselReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.post(`${ApiKey.Diesel}`, data);

    const msg = res.data.message;
    const _data = res.data;
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
export const updateDieselReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.put(`${ApiKey.Diesel}`, data);

    const msg = res?.data?.message;
    const _data = res?.status;
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

export const deleteDieselReq = async (userId) => {
  try {
    const res = await publicAxios.delete(
      `${ApiKey.Diesel}/${userId}`
    );

    const msg = res.data?.message;
    const _data = res.data;
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
export const Fileattachments = async (fileFormData) => {
  try {
    debugger;
    const res = await publicAxios.post(`${ApiKey.Attachment}`, fileFormData);
    const msg = res?.data?.message;
    const _data = res?.data;
    console.log("File upload successful: ", _data); // Debugging successful upload
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong, please try again later";
    console.error("Error in Fileattachments: ", error); // Debugging error
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};