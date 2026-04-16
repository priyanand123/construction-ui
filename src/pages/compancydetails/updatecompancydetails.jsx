
import React, { useEffect, useState  } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import ModalForm from "../../app/components/modalForm/modalForm";
import {
  DropdownFilter,
  TextSearchFilter,
} from "../../app/components/tableCmp/filters";
import TableCmp from "../../app/components/tableCmp/tableCmp";
import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";
/*import {
  addNewUserManagement,
  deleteUserManagement,
  fetchCompanydetailsListAction,
  updateUserManagement,
} from "../../app/redux/slices/companydetails/companydetailsSlice";*/
//import CryptoJS from 'crypto-js';
import { API } from "../../api/endpoints";
//import ProfileCard from "./profilecard";
import CompancyDetails from "./compancyDetails";
import { fetchCompanydetailsListAction,updateCompancyDetails } from "../../app/redux/slices/companydetails/companydetailsSlice";
const UpdateCompancyDetails=() =>{

    const dispatch = useDispatch();
   
    //const userName = auth?.data?.username || "";
    //const userID = auth?.data?.userId || "";
   const { compancydetails, } = useSelector((_state) => _state);
   console.log(compancydetails,"compancy");
  //const [formItems, setFormItems] = useState([]);
    const CompancyName = compancydetails?.data?.companyName || "";
    
    //const userID = compancydetails?.data?.userId || "";
    const [showModalForm, setshowModalForm] = useState(false);
    const [dataToEdit, setdataToEdit] = useState(null);
    const [viewOnly, setviewOnly] = useState(false);
  
    const [roleOptions, setroleOptions] = useState([]);
    const [regionOptions, setregionOptions] = useState([]);
    const [storeOptions, setstoreOptions] = useState([]);
    const [stateOptions, setstateOptions] = useState([]);
    const [countryOptions, setcountryOptions] = useState([]);
  
    const [formatedData, setformatedData] = 
    useState(compancydetails?.data || []);
 
    const [dataLoading, setdataLoading] = useState(true);
   // const [labourType, setlabourType] = useState("");
    //const [extraFields, setExtraFields] = useState(false);
    
  
   useEffect(() => {
      if (!compancydetails?.loading) return setdataLoading(false);
    }, [compancydetails.loading]);
  
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
    const secretKey = process.env.SECRET_KEY || 'default-backup-key';
  
    /*const createData = async (formData) => {

      try {
        debugger;
       
         
        const dataBody = {
          id: formData?.id || 0,
          name: formData?.name || "",
          qualification: formData?.qualification || "",
          aadharNo: formData?.aadharNo || "",
          roleId: formData?.labourType === "UnSkilled" ? 1 : formData?.roleId || 0,      
          mobileNo: formData?.mobileNo || "",
          emergencyNo: formData?.emergencyNo || "",
          labourType : formData?.labourType ||"",
          panNo: formData?.panNo || "",
          address: formData?.address || "",    
          userName: formData?.userName || "",
          password: formData?.password || "",     
          
          //photo: imageFile,
          //photoName: photoName,
          createdBy: formData?.createdBy||"",
          //*createdDate: new Date(),
        };
  
        const resp = await addNewUserManagement(dataBody, dispatch);
        Swal.fire({
          title: "Awesome!",
          text: `New ${configData.masterTitle} Added`,
          icon: "success",
        });
        closeModal();
        setdataLoading(true);
      } catch (error) {
        console.log(error);
        closeModal();
      }
    };*/
  
    const updateData = async (formData) => {
      try {
        
        const dataBody = {
          id: formData?.id || 0,
          companyName: formData?.companyName || "",
          address: formData?.address || "",
          manufacturersOf: formData?.manufacturersOf || "",
          cgstPercentage: formData?.cgstPercentage || 0,         
          sgstOrUtgstPercentage: formData?.sgstOrUtgstPercentage || 0,         

          mobileNo1: formData?.mobileNo1 || "",
          mobileNo2: formData?.mobileNo2 || "",
          email: formData?.email || "",
          website: formData?.website || "",
          address: formData?.address || "",    
          gstin: formData?.gstin || "",
          bankName: formData?.bankName || "", 
          
          accountHolderName: formData?.accountHolderName || "",
          accountNo: formData?.accountNo || "",    
          branch: formData?.branch || "",
          ifseCode: formData?.ifseCode || "", 

          upiId1: formData?.upiId1 || "",
          upiId2: formData?.upiId2 || "", 
          //isClear: !!formData?.clear,
          hsnsac: parseInt(formData?.hsnsac )|| 0,
  
          ModifiedBy: formData?.createdBy,
        };
       const resp = await updateCompancyDetails(dataBody, dispatch);
        closeModal();
        Swal.fire({
          title: "Awesome!",
          text: `${configData.masterTitle} Updated`,
          icon: "success",
        });
        setdataLoading(true);
      } catch (error) {
        console.log(error);
        closeModal();
      }
    };
  
    /*const deleteRowData = async (rowData) => {
      try {
        const result = await Swal.fire({
          text: `Are you sure you want to delete this ${configData.masterTitle}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#f46a6a",
          cancelButtonColor: "#808185",
          confirmButtonText: "OK",
          reverseButtons: true,
          color: "#555",
        });
        if (!result.isConfirmed) return;
       await deleteUserManagement(rowData.id, dispatch);
        Swal.fire({
          title: "Awesome!",
          text: `${configData.masterTitle} Deleted`,
          icon: "success",
        });
        setdataLoading(true);
      } catch (error) {
        Swal.fire({
          text: "Error! Try Again!",
          icon: "error",
        });
      }
  
      console.log(rowData, "deleteRowData");
    };*/
    // const decryptPassword = (encryptedPassword) => {
    //   const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    //   return bytes.toString(CryptoJS.enc.Utf8);
    // }
    const editRowData = (rowData) => {
      debugger;
    //   const decryptedPassword = rowData.password 
    // ? decryptPassword(rowData.password)
    // : '';

  
      const maskedRowData = {
        ...rowData,
       // password: decryptedPassword  , // Display '****' if there is a password, otherwise show empty
      };
      setshowModalForm(true);
      setdataToEdit(maskedRowData);
    };
    const viewRowData = (rowData) => {
      // const decryptedPassword = rowData.password 
      // ? decryptPassword(rowData.password)
      // : '';
  
    
        const maskedRowData = {
          ...rowData,
         // password: decryptedPassword  , // Display '****' if there is a password, otherwise show empty
        };
      setshowModalForm(true);
      setdataToEdit(maskedRowData);
      setviewOnly(true);
    };
    const closeModal = () => {
      setdataToEdit(null);
      setshowModalForm(false);
      setviewOnly(false);
     // setlabourType("");
    };
    
    useEffect(() => {
     
      if (compancydetails?.data?.length < 1) return;
      setformatedData(compancydetails.data);
    }, [compancydetails.data]);
  
    useEffect(() => {
        debugger;
      setdataLoading(true);
      dispatch(fetchCompanydetailsListAction());
     
      /*(async () => {
        try {
          const res = await selectOptionsReq(API.getUserRoles);
          setroleOptions(res.data || []);
        } catch (error) {}
      })();*/
    }, []);
  
    const columns = React.useMemo(
      () => [
        {
          Header: "Comapany Name",
          accessor: "companyName",
          Filter: TextSearchFilter,
        },
        {
          Header: "Email",
          accessor: "email",
          Filter: TextSearchFilter,
        },
        {
          Header: "Primary Mobile Number",
          accessor: "mobileNo1",
          Filter: TextSearchFilter,
        },
  
        {
          Header: "Website",
          accessor: "website",
          Filter: TextSearchFilter,
        },
        
        
      ],
      []
    );
  
    const configData = React.useMemo(
      () => ({
        masterTitle: "Comapancy Details",
       
      }),
      []
    );
    //useEffect(() => {
      // Basic form items
    const formItems = [
      {
      
        label: "Company Name",
        name: "companyName",
        type: "text",      
        maxLength: 1000,
        //required: true,
        placeholder: "Max 1000 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Email",
        name: "email",
        type: "text",
        maxLength: 200,
        //required: true,
        placeholder: "Max 200 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Manufacturers Of",
        name: "manufacturersOf",
       
        type: "text",
        
       
        //required: true,
        placeholder: "Max 4000 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Website",
        name: "website",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 1000,       
        //required: true,
        placeholder: "Max 1000 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Primary Mobile No",
        name: "mobileNo1",
        type: "tel",
        pattern: /^\d{0,15}$/,
        maxLength: 10,
        required: true,
        placeholder: "",
        className: "col-lg-6 col-md-12",
        placeholder: "Max 10 characters",
      },
      {
        label: "Secondary Mobile No",
        name: "mobileNo2",
        type: "tel",
        pattern: /^\d{0,15}$/,
        maxLength: 10,
        required: false,
        placeholder: "",
        className: "col-lg-6 col-md-12",
        placeholder: "Max 10 characters",
      },
       {
        label: "Bank Name",
        name: "bankName",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 1000,       
        //required: true,
        placeholder: "Max 1000 characters",
        className: "col-lg-6 col-md-12",
      }, {
        label: "Account Number",
        name: "accountNo",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 60,       
        //required: true,
        placeholder: "Max 60 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Account Holder Name",
        name: "accountHolderName",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 150,       
        //required: true,
        placeholder: "Max 150 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Branch",
        name: "branch",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 150,       
        //required: true,
        placeholder: "Max 150 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "IFSC CODE",
        name: "ifseCode",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 300,       
        //required: true,
        placeholder: "Max 300 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "GST IN",
        name: "gstin",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 600,       
        //required: true,
        placeholder: "Max 600 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Primary UPI ID",
        name: "upiId1",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 300,       
        //required: true,
        placeholder: "Max 300 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Secondary UPI Id",
        name: "upiId2",       
        type: "text",
        //pattern: /^\d{0,10}$/,
        maxLength: 300,       
        //required: true,
        placeholder: "Max 300 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "CGST Percentage",
        name: "cgstPercentage",       
        type: "number",
        maxLength: 4, 
        placeholder: "Max 4 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "SGST/UTGST Percentage",
        name: "sgstOrUtgstPercentage",       
        type: "number",       
        maxLength: 4,     
       
        placeholder: "Max 4 characters",
        className: "col-lg-6 col-md-12",
      },   
      {
        label: "HSN/SAC",
        name: "hsnsac",      
        type: "number",      
        maxLength: 4,    
        placeholder: "Max 4 characters",
        className: "col-lg-6 col-md-12",
      },        
                      
      {
        label: "Address",
        name: "address",
        type: "textarea",
        maxLength: null,
        required: true,
        placeholder: "",
        className: "col-lg-12 col-md-12",
        maxLength: 8000,
        placeholder: "Max 8000 characters",
      },
      
    ];
    
   

   
    //const valDupFields = React.useMemo(() => ["emailAddress"], []);
  
    return (
        <div className="main-content p-4">
        <div className="row">
         
         
            
            <div className="col-lg-8">
              <CompancyDetails data={formatedData} onEdit={(dt) => editRowData(dt)} />
            </div>
          
        </div>
        <ModalForm
          title={configData.masterTitle}
          formItems={formItems}
          show={showModalForm}
          onHide={closeModal}
          onEditData={formatedData}
          onSave={() => {}}
          onUpdate={updateData}
          masterData={formatedData}
          //valDupFields={valDupFields}
          viewOnly={viewOnly}
        />
      </div>
    );
  };


export default UpdateCompancyDetails;
const TableContainer = styled.div``;