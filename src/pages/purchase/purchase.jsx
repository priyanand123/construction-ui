import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { exportToExcel } from "../../app/components/tableCmp/_functions";
import Swal from "sweetalert2";
import ModalForm from "../../app/components/modalForm/purchasemodelForm";
import {
  DropdownFilter,
  TextSearchFilter,
} from "../../app/components/tableCmp/filters";
import TableCmp from "../../app/components/tableCmp/tableCmp";
import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";
import {
  addNewPurchase,
  deletePurchase,
  fetchPurchaseList,
  updatePurchase,
  uploadAttachments,
  deleteAttachments,
} from "../../app/redux/slices/purchase/purchaseslice";
import { ApiKey } from "../../api/endpoints";
import { selectOptionsReq } from "../../api/dropdownApi/dropdownreq";
import dayjs from "dayjs";
import moment from "moment";
import { FaDownload } from "react-icons/fa";
const Purchase = () => {
  const dispatch = useDispatch();
  let imageFile = null;
  const { purchase } = useSelector((_state) => _state);
  const RoleNames = localStorage.getItem("username");
  const [showModalForm, setshowModalForm] = useState(false);
  const [dataToEdit, setdataToEdit] = useState(null);
  const [viewOnly, setviewOnly] = useState(false);
  const [dataLoading, setdataLoading] = useState(true);
  const [formatedData, setformatedData] = useState(purchase?.data || []);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [unitsOptions, setunitsOptions] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [files, setFiles] = useState([]);
  // useState(purchase?.data || []);
  useEffect(() => {

    if (!purchase.loading) return setdataLoading(false);
  }, [purchase?.loading]);

  const handleFullExport = (filteredData) => {
  const fullData =
    filteredData && filteredData.length > 0
      ? filteredData   // ✅ filtered table data
      : purchase.data; // fallback (all data)

  const headers = [
    "Material Name",
    "Units",
    "Brand Name",
    "Purchase Company",
    "Purchase Date",
    "Bill No",
    "Bill Date",
    "GST No",
    "GST %",
    "GST Amount",
    "Amount",
    "Loading Cost",
    "Total",
    "Vehicle No",
    "Vehicle Phone",
    "Payment Details",
    "Address",
    "Transport Details"
  ];

  const rows = fullData.map((item) => [
    item.materialName,
    item.unitId,
    item.brandName,
    item.purchaseCompany,
    item.purchaseDate,
    item.billNo,
    item.billDate,
    item.gstNo,
    item.gstPercentage,
    item.gstAmount,
    item.amount,
    item.loadingAndUnloadingCost,
    item.totalCost,
    item.vehicleNo,
    item.vehiclephoneNo,
    item.paymentDetails,
    item.address,
    item.transportDetails
  ]);

  exportToExcel(headers, rows, "Purchase_Data");
};
  const handleFieldChange = (fieldName, value, formValues) => {
    debugger;
    if (fieldName === "amount" || fieldName === "gstPercentage" || fieldName === "loadingAndUnloadingCost") {
      const amount = parseFloat(formValues.amount || 0);
      const gstPercentage = parseFloat(formValues.gstPercentage || 0);
      const loadingAndUnloadingCost = parseFloat(formValues.loadingAndUnloadingCost || 0);

      const gstAmount = ((amount * gstPercentage) / 100);
      const totalCost = amount + gstAmount + loadingAndUnloadingCost;

      return {
        gstAmount: isNaN(gstAmount) ? "" : gstAmount.toFixed(2),
        totalCost: isNaN(totalCost) ? "" : totalCost.toFixed(2),
      };
    }
    return {};
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const createData = async (formData) => {
    debugger;
    try {
      /*let photoName = "";
          let imageFile = null;     
       
          if (formData?.files && formData?.files.length > 0 && formData?.files[0]?.name) {
            photoName = formData?.clear ? "" : formData?.files[0]?.name;
            imageFile = formData?.clear ? null : formData?.files[0];  
          }     
         
          if (!formData?.files || formData?.files.length < 1 || typeof formData?.files === "string") {
            photoName = formData?.clear ? "" : formData?.photoName || "";
            imageFile = formData?.clear ? null : formData?.files || null;  
          }*/
      let photoNames = [];
      let imageFiles = [];

      // Check if 'files' exists and is a valid array with at least one file
      if (
        formData?.files &&
        Array.isArray(formData.files) &&
        formData.files.length > 0
      ) {
        if (formData?.clear) {
          photoNames = [];
          imageFiles = [];
        } else {
          photoNames = formData.files.map((file) => file?.name || ""); // Extract file names
          imageFiles = formData.files.map((file) => file || null); // Use file objects directly
        }
      }

      // Handle the case where files is not an array or no files are provided
      if (!Array.isArray(formData?.files) || formData?.files.length < 1) {
        if (formData?.clear) {
          photoNames = [];
          imageFiles = [];
        } else {
          photoNames = formData?.photoName ? [formData.photoName] : []; // Handle single photoName as array
          imageFiles = formData?.files ? [formData.files] : []; // Handle single file as array
        }
      }
      const dataBody = {
        id: formData?.id || 0,
        materialId: Number(formData?.materialId) || 0,
        billNo: formData?.billNo || "",
        billDate: formData?.billDate || "",
        brandName: formData?.brandName || "",
        gstPercentage: formData?.gstPercentage || "",
        gstAmount: Number(formData?.gstAmount) || 0,
        purchaseDate: formData?.purchaseDate || "",
        purchaseCompany: formData?.purchaseCompany || "",
        address: formData?.address || "",
        gstNo: formData?.gstNo || "",
        website: formData?.website || "",
        email: formData?.email || "",
        unitId: Number(formData?.unitId) || 0,
        phoneNo: formData?.phoneNo || "",
        vehicleNo: formData?.vehicleNo || "",
        vehiclephoneNo: formData?.vehiclephoneNo || "",
        transportDetails: formData?.transportDetails || "",
        quantity: Number(formData?.quantity) || 0,
        amount: Number(formData?.amount) || 0,
        loadingAndUnloadingCost: Number(formData?.loadingAndUnloadingCost) || 0,
        totalCost: Number(formData?.totalCost) || 0,
        paymentDetails: formData?.paymentDetails || "",
        //isClear: !!formData?.clear,

        createdBy: RoleNames || "",
        //*createdDate: new Date(),
      };

      const resp = await addNewPurchase(dataBody, dispatch);
      debugger;
      if (resp.error === false && resp.data.id > 0) {
        debugger;

        if (imageFiles) {
          await uploadAttachments(Number(resp.data.id), formData.files);
          //  console.log("File uploaded successfully");
        }

        Swal.fire({
          title: "Awesome!",
          text: `New ${configData.masterTitle} Added`,
          icon: "success",
        });
      }
      closeModal();
      dispatch(fetchPurchaseList());
      setdataLoading(true);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
      closeModal();
    }
  };

  const updateData = async (formData) => {
    try {
      debugger;
      let photoNames = []; // Store names of all files
      let imageFiles = []; // Store all file objects
      if (formData?.files && formData?.files.length > 0) {
        // If there are multiple files
        if (!formData?.clear?.[0]) {
          // Split the fileName string into individual file names
          photoNames = formData?.fileName.split("|").map(name => name.trim()).filter(Boolean);
          // Assuming formData?.files is an object, we'll create an array of file objects
          imageFiles = Object.values(formData?.files).map(file => file);
        } else {
          photoNames = [];
          imageFiles = [];
        }
      } else if (typeof formData?.files === "string") {
        // If it's a single file (e.g., a single fileName string)
        photoNames = formData?.clear?.[0] ? [] : [formData?.fileName];
        imageFiles = formData?.clear?.[0] ? [] : [formData?.files];
      } else {
        // No fileName or empty files object
        photoNames = [];
        imageFiles = [];
      }
      const dataBody = {
        id: formData?.id || 0,
        materialId: Number(formData?.materialId) || 0,
        billNo: formData?.billNo || "",
        billDate: formData?.billDate || "",
        brandName: formData?.brandName || "",
        gstPercentage: formData?.gstPercentage || "",
        gstAmount: Number(formData?.gstAmount) || 0,
        purchaseDate: formData?.purchaseDate || "",
        purchaseCompany: formData?.purchaseCompany || "",
        address: formData?.address || "",
        gstNo: formData?.gstNo || "",
        website: formData?.website || "",
        email: formData?.email || "",
        unitId: Number(formData?.unitId) || 0,
        phoneNo: formData?.phoneNo || "",
        vehicleNo: formData?.vehicleNo || "",
        vehiclephoneNo: formData?.vehiclephoneNo || "",
        transportDetails: formData?.transportDetails || "",
        quantity: Number(formData?.quantity) || 0,
        amount: Number(formData?.amount) || 0,
        loadingAndUnloadingCost: Number(formData?.loadingAndUnloadingCost) || 0,
        totalCost: Number(formData?.totalCost) || 0,
        paymentDetails: formData?.paymentDetails || "",
        isClear: !!formData?.clear,

        ModifiedBy: RoleNames || "",
      };
      const resp = await updatePurchase(dataBody, dispatch);
      if (resp.error === false && resp.data === 204) {
        debugger;

        if (imageFiles && imageFiles.length > 0) {
          await uploadAttachments(formData.id, formData.files);
          //  console.log("File uploaded successfully");
        }
        if (Array.isArray(formData.clear) && formData.clear.length > 0) {
          const fileNames = formData.fileName
            ? formData.fileName.split("|").filter((fileName) => fileName.trim() !== "")
            : [];

          /*formData.clear.forEach((isClear, index) => {
            if (isClear) {
              
              
              if (fileNames[index]) {
                try {
                  // Call deleteAttachments if clear is true and file exists
                  await  deleteAttachments(formData.id, fileNames[index]);
                  console.log(`File ${fileNames[index]} deleted successfully`);
                } catch (error) {
                  console.error(`Error deleting file ${fileNames[index]}:`, error);
                }
              }
            }
          });*/
          for (let index = 0; index < formData.clear.length; index++) {
            const isClear = formData.clear[index];
            if (isClear && fileNames[index]) {
              try {
                // Await deleteAttachments to ensure deletion completes before proceeding
                await deleteAttachments(formData.id, fileNames[index]);
                console.log(`File ${fileNames[index]} deleted successfully`);
              } catch (error) {
                console.error(`Error deleting file ${fileNames[index]}:`, error);
              }
            }
          }
        }
      }

      Swal.fire({
        title: "Awesome!",
        text: `${configData.masterTitle} Updated`,
        icon: "success",
      });
      closeModal();
      dispatch(fetchPurchaseList());
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
      await deletePurchase(rowData.id, dispatch);
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

  const editRowData = (rowData) => {


    setshowModalForm(true);
    setdataToEdit(rowData);
  };
  const viewRowData = (rowData) => {
    setshowModalForm(true);
    setdataToEdit(rowData);
    setviewOnly(true);
  };
  const closeModal = () => {
    setdataToEdit(null);
    setshowModalForm(false);
    setviewOnly(false);
  };
  useEffect(() => {

    if (purchase?.data?.length < 1) return;
    setformatedData(purchase.data);
  }, [purchase.data]);
  useEffect(() => {

    setdataLoading(true);
    dispatch(fetchPurchaseList());
    (async () => {
      try {
        const res = await selectOptionsReq(ApiKey.RawMaterial);
        const filteredData = (res.data || []).filter(item => !item.isManufacturingMaterial);
        setMaterialOptions(filteredData);
        // setMaterialOptions(res.data || []);
      } catch (error) { }
    })();
    (async () => {
      try {
        const res = await selectOptionsReq(ApiKey.Units);
        setunitsOptions(res.data || []);
      } catch (error) { }
    })();
  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Material Name",
        accessor: "materialName",
        Filter: DropdownFilter,
      },
      {
        Header: "Bill No",
        accessor: "billNo",
        Filter: TextSearchFilter,
      },
      {
        Header: "Purchase Company",
        accessor: "purchaseCompany",
        Filter: TextSearchFilter,
      },
      {
        Header: "Email Address",
        accessor: "email",
        Filter: TextSearchFilter,
      },

      {
        Header: "Purchase Date",
        accessor: "purchaseDate",
        Filter: TextSearchFilter,
        Cell: (props) =>
          props.value
            ? moment.utc(props.value).local().format("DD/MM/YYYY")
            : "",
      },
    ],
    []
  );

  const configData = React.useMemo(
    () => ({
      masterTitle: "Purchase",
    }),
    []
  );

  const formItems = [
    {
      label: "Matrial Name",
      name: "materialId",
      type: "select",
      options: materialOptions,
      valueKey: "id",
      labelKey: "materialName",
      required: true,
      placeholder: "Max 20 characters",
      className: "col-lg-4 col-md-12",
      //altValue:"unitId"
    },
    {
      label: "Units",
      name: "unitId",
      type: "select",
      options: materialOptions,
      valueKey: "unitId",
      labelKey: "unit",
      required: true,
      placeholder: "Max 20 characters",
      className: "col-lg-4 col-md-12",
      disabled: !viewOnly,
      //filterOptsBasedOn: "materialId",
    },
    {
      label: "Brand Name",
      name: "brandName",
      type: "text",
      maxLength: 50,
      placeholder: "Max 50 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Purchase Company",
      name: "purchaseCompany",
      type: "text",
      maxLength: 250,
      required: true,
      placeholder: "Max 250 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Purchase Date",
      name: "purchaseDate",
      type: "date",
      //min: dayjs().format("YYYY-MM-DD"),
      maxLength: null,
      required: true,
      placeholder: "Max 50 characters",
      className: "col-lg-4 col-md-12",
      defaultValue: dayjs().format("YYYY-MM-DD"),
      //disabled: disableFieldsForUser(),
    },

    {
      label: "Bill No",
      name: "billNo",
      type: "text",
      maxLength: 100,
      required: true,
      placeholder: "Max 100 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Bill Date",
      name: "billDate",
      type: "date",
      //min: dayjs().format("YYYY-MM-DD"),
      maxLength: null,
      required: true,
      placeholder: "Max 50 characters",
      className: "col-lg-4 col-md-12",
      defaultValue: dayjs().format("YYYY-MM-DD"),
      //disabled: disableFieldsForUser(),
    },
    {
      label: "Gst No",
      name: "gstNo",
      type: "text",
      maxLength: 15,
      required: true,
      placeholder: "Please Enter gst no here",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Purchase  Amount",
      name: "amount",
      type: "text",

      //  maxLength: 9,
      required: true,
      placeholder: null,
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Loading & Unloading Cost",
      name: "loadingAndUnloadingCost",
      type: "text",

      //maxLength: 5,
      required: true,
      placeholder: null,
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Gst Percentage",
      name: "gstPercentage",
      type: "text",
      maxLength: 10,
      placeholder: "Please Enter gst percentage",
      className: "col-lg-4 col-md-12",
    },


    {
      label: "Gst Amount",
      name: "gstAmount",
      type: "text",
      maxLength: 25,
      placeholder: "Please Enter gst Amount",
      className: "col-lg-4 col-md-12",
      readOnly: true
    },

    {
      label: "Website",
      name: "website",
      type: "text",
      maxLength: 1000,
      //required: true,
      placeholder: "Max 1000 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      maxLength: 100,
      //required: true,
      placeholder: "Max 100 characters",
      className: "col-lg-4 col-md-12",
    },

    {
      label: "Phone No",
      name: "phoneNo",
      type: "tel",
      pattern: /^\d{0,15}$/,
      maxLength: 10,
      minLength: 10,
      //max:10,
      required: true,
      placeholder: "Max 10 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "number",

      // maxLength: 5,
      required: true,
      placeholder: null,
      className: "col-lg-4 col-md-12",
    },



    {
      label: "Total Amount",
      name: "totalCost",
      type: "number",
      // maxLength: 9,
      required: true,
      placeholder: null,
      className: "col-lg-4 col-md-12",
      readOnly: true
    },

    {
      label: "Vechile No",
      name: "vehicleNo",
      type: "text",
      //maxLength: 1000,
      required: true,
      placeholder: "Max 15 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Vechile Phone No",
      name: "vehiclephoneNo",
      type: "tel",
      maxLength: 10,
      minLength: 10,
      //max:10,
      //required: true,
      placeholder: "Max 10 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Payment Details",
      name: "paymentDetails",
      type: "textarea",
      maxLength: 250,
      required: true,
      placeholder: "Max 250 characters",
      className: "col-lg-12 col-md-12",
    },
    {
      label: "Address",
      name: "address",
      type: "textarea",
      maxLength: 3000,
      required: true,
      placeholder: "Max 3000 characters",
      className: "col-lg-12 col-md-12",
    },
    {
      label: "Transport Details",
      name: "transportDetails",
      type: "textarea",
      maxLength: 1000,
      required: true,
      placeholder: "Max 1000 characters",
      className: "col-lg-12 col-md-12",
    },
  ];

  if (!dataToEdit) {
    formItems.push({
      label: "Photo",
      name: "files",
      type: "file",
      maxLength: null,
      required: false,
      placeholder: "",
      accept: "image/*",
      multiple: true, // Set to true to enable multiple file selection
      className: `col-lg-4 col-md-12`,
    });
  }

  if (!!dataToEdit) {

    // const filePath = h:\\root\\home\\prasath-001\\www\\feedback\\Purchase\\Purchase-${dataToEdit.id};
    formItems.push({
      label: "Photo",
      name: "files",
      type: "file",
      multiple: true, // Changed to 'text' to display as plain text
      mediaName: `${dataToEdit?.fileName}`, // Extract only the file name before '|'
      // url: filePath, // Provide the file URL
      url: `${dataToEdit && dataToEdit?.id}`,
      // urlName: "Click to view image",
      //id:`${dataToEdit?.id}`,
      maxLength: null,
      required: false,
      placeholder: "",
      className: "col-lg-9 col-md-12",
    });
  }


  //  const valDupFields = React.useMemo(() => ["emailAddress"], []);
  return (
    <div className="main-content p-4 position-static">
      {dataLoading && (
        <div className="table-loader">
          <div className="spinner-border text-primary"></div>
          <label className="mt-2">Loading..</label>
        </div>
      )}
      <UserMgmtPageHeader
        title={"Purchase"}
        configData={configData}
        onAdd={() => setshowModalForm(true)}
        onValidation={() => { }}
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
            onFullExport={handleFullExport}   // ✅ ADD THIS LINE
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
        onFieldChange={handleFieldChange}
      />
    </div>
  );
};

export default Purchase;
const TableContainer = styled.div`
  .download-icon {
    color: blue;
    text-decoration: none;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .download-icon:hover {
    color: darkblue;
    text-decoration: underline;
  }
`;
