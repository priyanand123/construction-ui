
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
import {
  
  fetchUserManagementListbyId,
  updateUserProfileAction,
} from "../../app/redux/slices/profile/profileslice";
//import CryptoJS from 'crypto-js';
import { API } from "../../api/endpoints";
import ProfileCard from "./profilecard";
import ProfileForm from "./profileForm";
const UsersProfile=() =>{
  document.title = "BrikingSolution : " + "Profile";
    const dispatch = useDispatch();
   
    //const userName = auth?.data?.username || "";
    //const userID = auth?.data?.userId || "";
   const { profile,auth } = useSelector((_state) => _state);
  //const [formItems, setFormItems] = useState([]);
    const userName = auth?.data?.username || "";
    const userID = auth?.data?.userId || "";
    const [showModalForm, setshowModalForm] = useState(false);
    const [dataToEdit, setdataToEdit] = useState(null);
    const [viewOnly, setviewOnly] = useState(false);
  
    const [roleOptions, setroleOptions] = useState([]);
    const [regionOptions, setregionOptions] = useState([]);
    const [storeOptions, setstoreOptions] = useState([]);
    const [stateOptions, setstateOptions] = useState([]);
    const [countryOptions, setcountryOptions] = useState([]);
  
    const [formatedData, setformatedData] = 
    useState(profile?.data || []);
 
   // const [dataLoading, setdataLoading] = useState(true);
   // const [labourType, setlabourType] = useState("");
    //const [extraFields, setExtraFields] = useState(false);
    
  
   
  
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
    //const secretKey = process.env.SECRET_KEY || 'default-backup-key';
  
    
  
    const updateData = async (formData) => {
      try {
        
        const dataBody = {
          id: formData?.id || 0,
          name: formData?.name || "",
          qualification: formData?.qualification || "",
          aadharNo: formData?.aadharNo || "",
          roleId: formData?.roleId || 0,         
          mobileNo: formData?.mobileNo || "",
          emergencyNo: formData?.emergencyNo || "",
          labourType: formData?.labourType || "",
          panNo: formData?.panNo || "",
          address: formData?.address || "",    
          userName: formData?.userName || "",
          //password: formData?.password || "",     
          //isClear: !!formData?.clear,
  
          ModifiedBy: formData?.createdBy,
        };
       const resp = await updateUserProfileAction(dataBody, dispatch);
        closeModal();
        Swal.fire({
          title: "Awesome!",
          text: `${configData.masterTitle} Updated`,
          icon: "success",
        });
        console.log(dataBody, "updateData dataBody");
        closeModal();
      } catch (error) {
        console.log(error);
        closeModal();
      }
    };
  
   
   
    /*const editRowData = (rowData) => {
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
     
      if (profile?.data?) return;
      setformatedData(profile.data);
    }, [profile.data]);*/

    
    const editRowData = (rowData) => {
      setshowModalForm(true);
    
      const maskedPassword = rowData.password ? "****" : "";
    
      const updatedData = {
        ...rowData,
        password: maskedPassword, // Mask the password
      };
    
      setformatedData(updatedData);
    };
    

  const closeModal = () => {
    setshowModalForm(false);
    // setviewOnly(false);
  };

  useEffect(() => {
    if (!profile?.data) return;
    setformatedData(profile.data);
  }, [profile.data]);

  
    useEffect(() => {
      //setdataLoading(true);
      dispatch(fetchUserManagementListbyId(userID));
     
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
          Header: "Name",
          accessor: "name",
          Filter: TextSearchFilter,
        },
        {
          Header: "Qualification",
          accessor: "qualification",
          Filter: TextSearchFilter,
        },
        {
          Header: "Phone Number",
          accessor: "mobileNo",
          Filter: TextSearchFilter,
        },
  
        {
          Header: "Role",
          accessor: "roleName",
          Filter: DropdownFilter,
        },
        {
          Header: "Labour Type",
          accessor: "labourType",
          Filter: DropdownFilter,
        },
        
      ],
      []
    );
  
    const configData = React.useMemo(
      () => ({
        masterTitle: "User",
        fileName: "users",
      }),
      []
    );
    //useEffect(() => {
      // Basic form items
    const formItems = [
      {
      
        label: "Name",
        name: "name",
        type: "text",
        type: "text",
        maxLength: 150,
        required: true,
        placeholder: "Max 150 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Qualification",
        name: "qualification",
        type: "text",
        maxLength: 100,
        required: true,
        placeholder: "Max 100 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Aadhar No",
        name: "aadharNo",
       
        type: "text",
        pattern: /^\d{0,15}$/,
        maxLength: 12,
        minLength:12,
        required: true,
        placeholder: "Max 12 characters",
        className: "col-lg-6 col-md-12",
      },
      {
        label: "Pan No",
        name: "panNo",
       
        type: "text",
        pattern: /^\d{0,10}$/,
        maxLength: 10,
        minLength:10,
        required: true,
        placeholder: "Max 10 characters",
        className: "col-lg-6 col-md-12",
      },
      
      
      {
        label: "Labour Type",
        name: "labourType",
        type: "select",
        options: [
         // { label: "--------",  },
          { label: "Skilled Type", value: "Skilled" },
          { label: "UnSkilled Type", value: "UnSkilled" },
        ],
        valueKey: "value",
        labelKey: "label",
        required: true,
        className: "col-lg-6 col-md-12",
        
       
      },   
      {
        label: "UserName",
        name: "userName",
        type: "text",
        maxLength: 300,
        required: true,
        placeholder: "Max 300 characters",
        className: "col-lg-6 col-md-12",
        dynamicField: true,
      dynamicRules: [
        {
          filedName: "labourType",
          value: "Skilled",
        },
      ],
      },
      {
        label: "Password",
        name: "password",
        type: "text",
        maxLength: 400,
        required: true,
        placeholder: "Max 400 characters",
        className: "col-lg-6 col-md-12",
        dynamicField: true,
        dynamicRules: [
          {
            filedName: "labourType",
            value: "Skilled",
          },
        ],
      },
      {
        label: "Role",
        name: "roleId",
        type: "select",
        //options: roleOptions,
        options: [
          // { label: "--------",  },
           { label: "Admin", value: 2 },
           { label: "User", value: 1 },
         ],
        //valueKey: "id",
        //labelKey: "roleName",
        valueKey: "value",
        labelKey: "label",
        required: true,
        className: "col-lg-6 col-md-12",
        dynamicField: true,
        dynamicRules: [
          {
            filedName: "labourType",
            value: "Skilled",
          },
        ],
      
      },
      
      
      {
        label: "Phone (Primary)",
        name: "mobileNo",
        type: "tel",
        pattern: /^\d{0,15}$/,
        maxLength: 10,
      minLength:10,
        required: true,
        placeholder: "",
        className: "col-lg-6 col-md-12",
        placeholder: "Max 10 characters",
      },
      {
        label: "Emergency (Secondary)",
        name: "emergencyNo",
        type: "tel",
        pattern: /^\d{0,15}$/,
        maxLength: 10,
      minLength:10,
        required: false,
        placeholder: "",
        className: "col-lg-6 col-md-12",
        placeholder: "Max 10 characters",
      },
      {
        label: "Address",
        name: "address",
        type: "textarea",
        maxLength: null,
        required: true,
        placeholder: "",
        className: "col-lg-12 col-md-12",
        maxLength: 1000,
        placeholder: "Max 1000 characters",
      },
    ];
    
   

   
    //const valDupFields = React.useMemo(() => ["emailAddress"], []);
  
    return (
        <div className="main-content p-4">
        <div className="row">
          <div className="col-lg-4">
            <ProfileCard
              data={formatedData}
             // onChangePswd={() => setshowChngPswd(true)}
            />
          </div>
         
            {/*<div className="col-lg-8">
              <div className="card shadow position-relative rounded">
                <div className="p-4 position-absolute end-0">
                  <div className="">
                    <button
                      className="btn btn-dark text-white"
                     // onClick={() => setshowChngPswd(false)}
                    >
                      Back
                    </button>
                  </div>
                </div>
                {/*<ChangePasswordPage
                  data={{ userEmail: formatedData?.emailAddress }}
                  asComponent={true}
                />*/}
              {/*</div>
            </div>*/}
          
            <div className="col-lg-8">
              <ProfileForm data={formatedData} onEdit={(dt) => editRowData(dt)} />
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


export default UsersProfile;
const TableContainer = styled.div``;