import { authAxios } from "../config";
import { ApiKey } from "../endpoints";

export const fetchNotificationListReq = async (userId) => {
  try {
    const res = await authAxios.get(`${ApiKey.getNotificationList}`);
    const _data = res?.data || [];
    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
export const updateNotificationReq = async () => {
  try {
    const res = await authAxios.put(`${ApiKey.updateNotification}`);
    const _data = res?.data || [];
    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
