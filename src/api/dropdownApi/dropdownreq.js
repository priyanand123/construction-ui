import { publicAxios } from "../config";

export const selectOptionsReq = async (apiKey) => {
  try {
    debugger;
    const res = await publicAxios.get(apiKey);

    return { error: false, data: res?.data, message: "" };
  } catch (err) {
    let error;
    if (err?.response)
      error = err?.response?.data?.message || "Response error in" + apiKey;
    else if (err?.request) error = "Request error in " + apiKey || err?.request;
    else
      error = "Something went wrong in " + apiKey + " please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
