import { publicAxios,authAxios } from "../config";
import { ApiKey } from "../endpoints";

export const fetchRawMaterialListReq = async () => {
  try {
    
    const res = await publicAxios.get(`${ApiKey.RawMaterial}`);

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
      `${ApiKey.RawMaterial}/${userId}`
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
export const addNewRawMaterialReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.post(`${ApiKey.RawMaterial}`, data);

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
export const updateRawMaterialReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.put(`${ApiKey.RawMaterial}`, data);

    const msg = res?.data?.message;
    const _data = res?.data;
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

export const deleteRawMaterialReq = async (userId) => {
  try {
    const res = await publicAxios.delete(
      `${ApiKey.RawMaterial}/${userId}`
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
