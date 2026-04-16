
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
  addNewUserManagement,
  deleteUserManagement,
  fetchUserManagementList,
  updateUserManagement,
} from "../../app/redux/slices/user/userslice";
//import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';


import { API } from "../../api/endpoints";
import { min } from "moment";

const Users=() =>{

    const dispatch = useDispatch();
   const { user } = useSelector((_state) => _state);
  //const [formItems, setFormItems] = useState([]);
   // const userName = auth?.data?.username || "";
   const RoleNames = localStorage.getItem("username");
   console.log("RoleNames");
    const [showModalForm, setshowModalForm] = useState(false);
    const [dataToEdit, setdataToEdit] = useState(null);
    const [viewOnly, setviewOnly] = useState(false);
  
    const [roleOptions, setroleOptions] = useState([]);
    const [regionOptions, setregionOptions] = useState([]);
    const [storeOptions, setstoreOptions] = useState([]);
    const [stateOptions, setstateOptions] = useState([]);
    const [countryOptions, setcountryOptions] = useState([]);
  
    const [formatedData, setformatedData] = 
    useState(user?.data || []);
 
    const [dataLoading, setdataLoading] = useState(true);
   // const [labourType, setlabourType] = useState("");
    //const [extraFields, setExtraFields] = useState(false);
    
  
   useEffect(() => {
      if (!user.loading) return setdataLoading(false);
    }, [user?.loading]);
  
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
    /*const secretKey = process.env.SECRET_KEY || 'default-backup-key';
    //const secretKey = "MySecretKey123"; // Replace with a strong secret key

    const encryptPassword = (password) => {
      return CryptoJS.AES.encrypt(password, secretKey).toString();
    };*/

    const encryptPassword = (password) => {
      const salt = bcrypt.genSaltSync(10); // Generate salt
      return bcrypt.hashSync(password, salt); // Hash the password
    };
    const createData = async (formData) => {

      try {
        debugger;
       // const encryptedPassword = encryptPassword(formData?.password || "");
        const roleId = formData?.labourType === "UnSkilled" ? 3 : formData?.roleId || 0;
        const dataBody = {
          id: formData?.id || 0,
          name: formData?.name || "",
          qualification: formData?.qualification || "",
          aadharNo: formData?.aadharNo || "",
          roleId: roleId,         
          mobileNo: formData?.mobileNo || "",
          emergencyNo: formData?.emergencyNo||"",
          labourType: formData?.labourType || "",
          panNo: formData?.panNo || "",
          address: formData?.address || "",    
          userName: formData?.userName || "",
          password: formData?.password || "", 
          
          //photo: imageFile,
          //photoName: photoName,
          createdBy: RoleNames||"",
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
    };
  
    const updateData = async (formData) => {
      try {
        const encryptedPassword = encryptPassword(formData?.password || "");
        const dataBody = {
          id: formData?.id || 0,
          name: formData?.name || "",
          qualification: formData?.qualification || "",
          aadharNo: formData?.aadharNo || "",
          roleId: formData?.roleId || 0,         
          mobileNo: formData?.mobileNo || "",
          emergencyNo: formData?.emergencyNo||"",
          labourType: formData?.labourType || "",
          panNo: formData?.panNo || "",
          address: formData?.address || "",    
          userName: formData?.userName || "",
          //password: formData?.password || "",     

          //isClear: !!formData?.clear,
  
          ModifiedBy: RoleNames ||"",
        };
       const resp = await updateUserManagement(dataBody, dispatch);
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
  
    const deleteRowData = async (rowData) => {
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
    };
    // const decryptPassword = (encryptedPassword) => {
    //   const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    //   return bytes.toString(CryptoJS.enc.Utf8);
    // }

    
    
    const editRowData = (rowData) => {
      debugger;
      //const decryptedPassword = decryptPassword(rowData.password);
   
    const sanitizedEmergencyNo = rowData?.emergencyNo?.trim() || "";
  
      const maskedRowData = {
        ...rowData,
        emergencyNo: sanitizedEmergencyNo, 
       password: "****"  , // Display '****' if there is a password, otherwise show empty
      };
      setshowModalForm(true);
      setdataToEdit(maskedRowData);
    };
    const viewRowData = (rowData) => {
      const sanitizedEmergencyNo = rowData?.emergencyNo?.trim() || "";
  
  
    
        const maskedRowData = {
          ...rowData,
          emergencyNo: sanitizedEmergencyNo,
          password: "****"  , // Display '****' if there is a password, otherwise show empty
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
     
      if (user?.data?.length < 1) return;
      setformatedData(user.data);
    }, [user.data]);
  
    useEffect(() => {
      setdataLoading(true);
      dispatch(fetchUserManagementList());
     
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
       
        //required: true,
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
        //required: true,
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
       // required: true,
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
       // required: true,
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
    
   /* if (labourType === "Skilled"||(showModalForm === true && showModalForm?.labourType?.valueKey === "Skilled")) {
      items.push(
        {
          label: "Additional Field 1",
          name: "additionalField1",
          type: "text",
          maxLength: 50,
        //  required: true,
          placeholder: "Enter additional info",
        },
        {
          label: "Additional Field 2",
          name: "additionalField2",
          type: "text",
          maxLength: 50,
          //required: true,
          placeholder: "Enter additional info",
        }
      );
    }
     
    setFormItems(items);
  }, [dataToEdit]);*/


   
    //const valDupFields = React.useMemo(() => ["emailAddress"], []);
  
    return (
      <div className="main-content p-4 position-static">
        {dataLoading && (
          <div className="table-loader">
            <div className="spinner-border text-primary"></div>
            <label className="mt-2">Loading..</label>
          </div>
        )}
       <UserMgmtPageHeader
        title={"Users"}
        configData={configData}
        onAdd={() => setshowModalForm(true)}
        onValidation={() => {}}
      />
        <TableContainer
          className={`bg-white px-3 py-2 ${dataLoading && "d-none"}`}
        >
          <TableCmp
            tableData={formatedData || []}
            tableColumns={columns}
            configData={configData}
            onDeleteRow={deleteRowData}
            onEditRow={editRowData}
            onView={viewRowData}
            editable={true}
            deleteable={true}
            viewable={true}
          />
        </TableContainer>
        <ModalForm
          title={configData.masterTitle}
          formItems={formItems}
         /* formItems={[
            ...formItems,
            ...(selectedLabourType === "Skilled" ? skilledFields : []),
          ]}*/
          show={showModalForm}
          onHide={closeModal}
          onEditData={dataToEdit}
          onSave={createData}
          onUpdate={updateData}
          masterData={formatedData}
          //valDupFields={valDupFields}
          viewOnly={viewOnly}
        />
      </div>
    );
  };


export default Users;
const TableContainer = styled.div``;