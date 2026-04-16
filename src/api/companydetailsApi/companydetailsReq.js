import { authAxios, publicAxios } from "../config";
import { ApiKey } from "../endpoints";

export const fetchCompanydetailsListReq = async () => {
  debugger;
  try {
    const res = await publicAxios.get(`${ApiKey.getCompanydetailsList}`);
    const _data = {
      id:res?.data?.[0].id|| 0,
      companyName:res?.data?.[0].companyName ||"",
      address:res?.data?.[0].address ||"",
      manufacturersOf:res?.data?.[0].manufacturersOf ||"",
      mobileNo1:res?.data?.[0].mobileNo1 ||"",
      mobileNo2:res?.data?.[0].mobileNo2 ||"",
      email:res?.data?.[0].email ||"",
      website:res?.data?.[0].website ||"",
      gstin:res?.data?.[0].gstin ||"",
      bankName:res?.data?.[0].bankName ||"",
      accountHolderName:res?.data?.[0].accountHolderName ||"",
      accountNo:res?.data?.[0].accountNo ||"",
      branch:res?.data?.[0].branch ||"",
      ifseCode:res?.data?.[0].ifseCode ||"",
      upiId1:res?.data?.[0].upiId1 ||"",
      upiId2:res?.data?.[0].upiId2 ||"",
      cgstPercentage:res?.data?.[0].cgstPercentage ||0,
      sgstOrUtgstPercentage:res?.data?.[0].sgstOrUtgstPercentage ||0,
      createdBy:res?.data?.[0].createdBy ||"",
      modifiedBy:res?.data?.[0].modifiedBy ||"",
      createdDate:res?.data?.[0].createdDate ||"",
      modifiedDate:res?.data?.[0].modifiedDate ||"",
      hsnsac:res?.data?.[0].hsnsac ||0,
        };
    
    localStorage.setItem("companyName", _data?.companyName);
    localStorage.setItem("address", _data?.address);
    localStorage.setItem("manufacturersOf", _data?.manufacturersOf);
    localStorage.setItem("gstin", _data?.gstin);
    localStorage.setItem("email", _data?.email);
    localStorage.setItem("website", _data?.website);
    localStorage.setItem("mobileNo1", _data?.mobileNo1);
    localStorage.setItem("mobileNo2", _data?.mobileNo2);
    localStorage.setItem("cgstPercentage", _data?.cgstPercentage);
    localStorage.setItem("sgstOrUtgstPercentage", _data?.sgstOrUtgstPercentage);
    localStorage.setItem("hsnsac",_data?.hsnsac);
    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
export const updateCompanydetailsReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.put(`${ApiKey.updateCompanydetails}`,data);
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
