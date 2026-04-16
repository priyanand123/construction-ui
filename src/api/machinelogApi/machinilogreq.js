import { publicAxios,authAxios } from "../config";
import { ApiKey } from "../endpoints";

export const fetchMachinelogListReq = async () => {
  try {
    
    const res = await publicAxios.get(`${ApiKey.Machinelog}`);

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
      `${ApiKey.Machinelog}/${userId}`
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
export const addNewMachinelogReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.post(`${ApiKey.Machinelog}`, data);

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
export const updateMachinelogReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.put(`${ApiKey.Machinelog}`, data);

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

export const deleteMachinelogReq = async (userId) => {
  try {
    const res = await publicAxios.delete(
      `${ApiKey.Machinelog}/${userId}`
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
