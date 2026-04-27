import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import Swal from "sweetalert2";

import ModalForm from "../../app/components/modalForm/billingaggridmodelForm";
import { exportToExcel } from "../../app/components/tableCmp/_functions";

import {

  DropdownFilter,

  TextSearchFilter,

} from "../../app/components/tableCmp/filters";

import TableCmp from "../../app/components/tableCmp/tableCmpbilling";

import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";

import {

  addNewBilling,

  deleteBilling,

  fetchBillingList,

  updateBilling,

} from "../../app/redux/slices/billing/billingslice";

import dayjs from "dayjs";

import AgGrid from "../../app/components/modalForm/billingaggridmodelForm";

import moment from "moment";

import { ApiKey } from "../../api/endpoints";

import { selectOptionsReq } from "../../api/dropdownApi/dropdownreq";


const Billing = () => {

  const dispatch = useDispatch();

  const [stockOptions, setstockOptions] = useState([]);

  // Safely retrieve Redux state

  const billing = useSelector(

    (state) => state.billing || { data: [], loading: false }

  );

  const RoleNames = localStorage.getItem("username");

  const CgstPercentage = localStorage.getItem("cgstPercentage");

  const SgstPercentage = localStorage.getItem("sgstOrUtgstPercentage");

  const hsnsac = localStorage.getItem("hsnsac");

  // Local state

  const [showModalForm, setshowModalForm] = useState(false);

  const [dataToEdit, setdataToEdit] = useState(null);

  const [viewOnly, setviewOnly] = useState(false);

  const [dataLoading, setdataLoading] = useState(true);

  const [formatedData, setformatedData] = useState(billing?.data || []);

  const [goodsInformation, setgoodsInformation] = useState([]);

  const [gridData, setGridData] = useState([]);

  const [gridApi, setGridApi] = useState(null);

  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const [isChecked, setIsChecked] = useState(true);

  //const gridApi = useRef(null);

  const gridColumnApi = useRef(null);

  let Percentage = 6;

  // Fetch billing data on component mount

  useEffect(() => {

    setdataLoading(true);

    dispatch(fetchBillingList());

    (async () => {

      try {

        const stockres = await selectOptionsReq(ApiKey.getStock);

        setstockOptions(stockres.data || []);

        console.log(stockres.data);

      } catch (error) { }

    })();

  }, [dispatch]);



  // Update local state when billing data changes

  useEffect(() => {
    if (billing?.data && billing.data.length > 0) {

      const formattedData = billing.data.map((item) => ({
        ...item,

        // ✅ FIX GST VALUE
        isGSTInclude: Number(item.isGSTInclude) === 1 ? 1 : 0,
        DocType:
          Number(item.isGSTInclude) === 1 ? "WithGST" : "WithoutGST",
        dated: moment(item.dated).format("YYYY-MM-DD"),
        buyersOrderNoDated: moment(item.buyersOrderNoDated).format("YYYY-MM-DD"),
        deliveryNoteDate: moment(item.deliveryNoteDate).format("YYYY-MM-DD"),
        referenceDate: moment(item.referenceDate).format("YYYY-MM-DD"),
      }));

      setformatedData(formattedData);   // ✅ USE THIS
      setdataLoading(false);
    }
  }, [billing?.data]);
const handleFullExportBilling = (filteredData) => {
  const fullData =
    filteredData && filteredData.length > 0
      ? filteredData
      : formatedData;

  if (!fullData || fullData.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = [
    "Invoice No",
    "Consignee Details",
    "Date",
    "Delivery Note",
    "Reference No",
    "Buyer Order No",
    "Total Qty",
    "Total Amount",
    "CGST",
    "SGST",
    "Taxable Value",
    "Total Tax Amount",
    "Vehicle No",
    "Delivery Person",
    "Phone No",
    "Terms Of Delivery"
  ];

  const rows = fullData.map((item) => [
    item.dispatchDocNo || "",
    item.consigneeDetails || "",
    item.dated || "",
    item.deliveryNote || "",
    item.referenceNo || "",
    item.buyersOrderNo || "",
    item.totalQty || "",
    item.totalAmount || "",
    item.CGSTAmount || "",
    item.SGSTAmount || "",
    item.taxableValue || "",
    item.totalTaxAmount || "",
    item.motorVehicleNo || "",
    item.deliveryManName || "",
    item.deliveryManPhoneNo || "",
    item.termsOfDelivery || ""
  ]);

  exportToExcel(headers, rows, "Billing_Data");
};
  const handleMaterialDataChange = (updatedData) => {

    setgoodsInformation(updatedData); // Update state with the modified material data

  };

  // Update loading state based on Redux state

  useEffect(() => {

    if (!billing.loading) setdataLoading(false);

  }, [billing?.loading]);



  const closeModal = () => {

    setdataToEdit(null);

    setshowModalForm(false);

    setviewOnly(false);

    setShowDownloadButton(false);

    setgoodsInformation([]);

  };



  const addMaterial = () => {

    debugger;

    const newMaterial = {

      descriptionofgoods: "",

      hsnsac: "",

      quantity: 0,

      rate: 0,

      per: 0,

      amount: 0,

    };

    setgoodsInformation((prevData) => [...prevData, newMaterial]);

  };



  const onGridReady = (params) => {

    setGridApi(params.api); // Set the gridApi from the grid's params

  };



  const onRemoveMaterial = () => {

    debugger;

    const selectedRows = gridApi.getSelectedRows();

    setgoodsInformation((prevData) =>

      prevData.filter((row) => !selectedRows.includes(row))

    );

  };



  // Shared calculation helper used by both createData and updateData

  const calculateTotals = (formData) => {

    const isGST =

      formData?.isGSTInclude === true ||

      formData?.isGSTInclude == 1;



    const totalAmount =

      formData?.goodsInformation?.reduce((total, item) => {

        return total + (Number(item.amount) || 0);

      }, 0) || 0;



    const totalQty =

      formData?.goodsInformation?.reduce((qty, item) => {

        return qty + (Number(item.quantity) || 0);

      }, 0) || 0;



    // GST fields — only populated when isGSTInclude is true

    const CGSTAmount = isGST ? (totalAmount * CgstPercentage) / 100 : 0.0;

    const SGSTAmount = isGST ? (totalAmount * SgstPercentage) / 100 : 0.0;

    const taxableValue = CGSTAmount + SGSTAmount;

    const totalTaxableAmount = isGST ? totalAmount + taxableValue : totalAmount;



    return { totalAmount, totalQty, CGSTAmount, SGSTAmount, taxableValue, totalTaxableAmount, isGST };

  };



  const createData = async (formData) => {

    try {

      const {

        totalAmount,

        totalQty,

        CGSTAmount,

        SGSTAmount,

        taxableValue,

        totalTaxableAmount,

        isGST,

      } = calculateTotals(formData);



      const dataBody = {

        id: formData?.id || 0,

        consigneeDetails: formData?.consigneeDetails || "",

        invoiceNo: formData?.dispatchDocNo || "",

        dated: formData?.dated || "",

        deliveryNote: formData?.deliveryNote || "",

        modeTermsOfPayment: formData?.modeTermsOfPayment || "",

        referenceNo: formData?.referenceNo || "",

        companyGstNo: formData?.companyGstNo || "",

        referenceDate: formData?.referenceDate || "",

        otherReferences: formData?.otherReferences || "",

        buyersOrderNo: formData?.buyersOrderNo || "",

        buyersOrderNoDated: formData?.buyersOrderNoDated || "",

        dispatchDocNo: formData?.dispatchDocNo || "",

        deliveryNoteDate: formData?.deliveryNoteDate || "",

        dispatchedThrough: formData?.dispatchedThrough || "",

        destination: formData?.destination || "",

        billOfLadingLrRrNo: formData?.billOfLadingLrRrNo || "",

        hsnOrSac: parseInt(hsnsac) || "",

        totalQty: totalQty,

        totalAmount: totalAmount,

        taxAmountInWords: formData?.taxAmountInWords || "",

        totalAmountInWords: formData?.totalAmountInWords || "",

        CGSTAmount: CGSTAmount,

        SGSTAmount: SGSTAmount,

        taxableValue: taxableValue,

        totalTaxAmount: totalTaxableAmount,

        motorVehicleNo: formData?.motorVehicleNo || "",

        termsOfDelivery: formData?.termsOfDelivery || "",

        goodsInformation: JSON.stringify(formData?.goodsInformation) || "",

        deliveryManName: formData?.deliveryManName,

        deliveryManPhoneNo: formData?.deliveryManPhoneNo,

        isGSTInclude: isGST ? 1 : 0,

        createdBy: RoleNames || "",

      };



      await addNewBilling(dataBody, dispatch);

      Swal.fire("Success", "New Billing added!", "success");

      closeModal();

      setdataLoading(true);

    } catch (error) {

      console.error(error);

      closeModal();

    }

  };



  const updateData = async (formData) => {

    try {

      const {

        totalAmount,

        totalQty,

        CGSTAmount,

        SGSTAmount,

        taxableValue,

        totalTaxableAmount,

        isGST,

      } = calculateTotals(formData);



      const dataBody = {

        ...formData,

        totalQty: totalQty,

        totalAmount: totalAmount,

        CGSTAmount: CGSTAmount,

        SGSTAmount: SGSTAmount,

        taxableValue: taxableValue,

        totalTaxAmount: totalTaxableAmount,

        isGSTInclude: isGST ? 1 : 0,

        goodsInformation: JSON.stringify(formData?.goodsInformation),

        modifiedBy: RoleNames || "",

      };



      await updateBilling(dataBody, dispatch);

      Swal.fire("Success", "Billing updated!", "success");

      closeModal();

      setdataLoading(true);

    } catch (error) {

      console.error(error);

      closeModal();

    }

  };



  const deleteRowData = async (rowData) => {

    try {

      const result = await Swal.fire({

        text: "Are you sure you want to delete this billing?",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#f46a6a",

        cancelButtonColor: "#808185",

        confirmButtonText: "OK",

        reverseButtons: true,

      });

      if (!result.isConfirmed) return;



      await deleteBilling(rowData.id, dispatch);

      Swal.fire("Success", "Billing deleted!", "success");

      setdataLoading(true);

    } catch (error) {

      Swal.fire("Error", "Something went wrong. Try again!", "error");

    }

  };



  const editRowData = (rowData) => {

    debugger;



    setshowModalForm(true);

    setdataToEdit({

      ...rowData,

      dated: moment(rowData.dated).format("YYYY-MM-DD"),

      buyersOrderNoDated: moment(rowData.buyersOrderNoDated).format("YYYY-MM-DD"),

      deliveryNoteDate: moment(rowData.deliveryNoteDate).format("YYYY-MM-DD"),

      referenceDate: moment(rowData.referenceDate).format("YYYY-MM-DD"),

    });

    setviewOnly(false);

    setShowDownloadButton(true); // Show download button

    setgoodsInformation(JSON.parse(rowData.goodsInformation));

  };



  const viewRowData = (rowData) => {

    setshowModalForm(true);

    setdataToEdit({

      ...rowData,

      dated: moment(rowData.dated).format("YYYY-MM-DD"),

      buyersOrderNoDated: moment(rowData.buyersOrderNoDated).format("YYYY-MM-DD"),

      deliveryNoteDate: moment(rowData.deliveryNoteDate).format("YYYY-MM-DD"),

      referenceDate: moment(rowData.referenceDate).format("YYYY-MM-DD"),

    });

    setviewOnly(true);

    // setViewOnly(false);

    setShowDownloadButton(true); // Show download button

    setgoodsInformation(JSON.parse(rowData.goodsInformation));

  };



  const columns = React.useMemo(

    () => [

      {

        Header: "Invoice No",

        accessor: "dispatchDocNo",

        Filter: TextSearchFilter,

      },

      {

        Header: "Consignee Details",

        accessor: "consigneeDetails",

        Filter: TextSearchFilter,

      },

      {

        Header: "Delivery Person Name",

        accessor: "deliveryManName",

        Filter: TextSearchFilter,

      },

      {

        Header: "Date",

        accessor: "dated",

        Filter: TextSearchFilter,

        Cell: (props) =>

          props.value

            ? moment.utc(props.value).local().format("DD/MM/YYYY")

            : "",

      },

      {
        Header: "Bill Type",
        accessor: "DocType",   // ✅ CHANGE HERE

        Filter: ({ column: { filterValue, setFilter } }) => (
          <select
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            style={{
              width: "100%",
              height: "35px",
              borderRadius: "5px",
              borderColor: "#ced4da",
            }}
          >
            <option value="">All</option>
            <option value="WithGST">With GST</option>
            <option value="WithoutGST">Without GST</option>
          </select>
        ),

        Cell: (props) =>
          props.value === "WithGST" ? "With GST" : "Without GST",
      }
    ],

    []

  );



  const configData = React.useMemo(

    () => ({

      masterTitle: "Billing",

    }),

    []

  );



  const formItems = [




    {

      label: "Invoice No",

      name: "dispatchDocNo",

      type: "text",

      maxLength: 50,

      required: true,

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

    },

    /*{

      label: "Invoice Date",

      name: "dated",

      type: "date", 

      required: true,   

      className: "col-lg-4 col-md-12",

      defaultValue: dayjs().format("yyyy-dd-mm"),

    },*/

    {

      label: "Invoice Date",

      name: "dated",

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

      label: "Reference No",

      name: "referenceNo",

      type: "text",

      maxLength: 50,

      required: true,

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Reference Date",

      name: "referenceDate",

      type: "date",

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

      defaultValue: dayjs().format("YYYY-MM-DD"),

    },

    {

      label: "Other References",

      name: "otherReferences",

      type: "text",

      maxLength: 255,

      required: true,

      placeholder: "Max 255 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Mode Terms Of Payment",

      name: "modeTermsOfPayment",

      type: "text",

      maxLength: 200,

      required: true,

      placeholder: "Max 200 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Buyers Order No",

      name: "buyersOrderNo",

      type: "text",

      maxLength: 50,

      required: true,

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Buyers Order No dated",

      name: "buyersOrderNoDated",

      type: "date",



      maxLength: null,

      required: true,

      //placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

      defaultValue: dayjs().format("YYYY-MM-DD"),

    },



    {

      label: "Dispatch Doc No",

      name: "dispatchDocNo",

      type: "text",

      maxLength: 50,

      required: true,

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

    },



    {

      label: "Dispatched Through",

      name: "dispatchedThrough",

      type: "text",

      maxLength: 100,

      required: true,

      placeholder: "Max 100 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Destination",

      name: "destination",

      type: "text",

      maxLength: 255,

      required: true,

      placeholder: "Max 255 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Bill Of Lading/ LR RR No",

      name: "billOfLadingLrRrNo",

      type: "text",

      maxLength: 50,

      required: true,

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Motor Vehicle No",

      name: "motorVehicleNo",

      type: "text",

      maxLength: 50,

      required: true,

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Terms Of Delivery",

      name: "termsOfDelivery",

      type: "text",

      maxLength: 100,

      required: true,

      placeholder: "Max 100 characters",

      className: "col-lg-4 col-md-12",

    },



    {

      label: "Delivery Person Name",

      name: "deliveryManName",

      type: "text",

      maxLength: 150,

      required: true,

      placeholder: "Max 150 characters",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "DeliveryMan Phone No",

      name: "deliveryManPhoneNo",

      type: "tel",

      pattern: /^\d{0,15}$/,

      maxLength: 10,

      minLength: 10,

      required: true,

      placeholder: "Max 10 characters",

      className: "col-lg-4 col-md-12",

    },



    {

      label: "Delivery Note Date",

      name: "deliveryNoteDate",

      type: "date",



      required: true,

      placeholder: "Max 50 characters",

      className: "col-lg-4 col-md-12",

      defaultValue: dayjs().format("YYYY-MM-DD"),

    },

    {

      label: "Company GST No",

      name: "companyGstNo",

      type: "text",

      maxLength: 15,

      required: true,

      placeholder: "Enter GSTIN",

      className: "col-lg-4 col-md-12",

    },

    {

      label: "Delivery Note",

      name: "deliveryNote",

      type: "textarea",

      maxLength: 1000,

      required: true,

      placeholder: "Max 2000 characters",

      className: "col-lg-6 col-md-12",

    },

    {

      label: "With GST",

      name: "isGSTInclude",

      type: "checkbox",



      required: true,



      className: "col-lg-6 col-md-12",

    },



    {

      label: "Consignee Details",

      name: "consigneeDetails",

      type: "textarea",

      maxLength: 2000,

      required: true,

      placeholder: "Max 510 characters",

      className: "col-lg-6 col-md-12",

    },

    {

      label: "Buyer(Bill to)",

      name: "buyer",

      type: "textarea",

      maxLength: 1000,

      required: true,

      placeholder: "Max 2000 characters",

      className: "col-lg-6 col-md-12",

    },

  ];



  return (
    <div className="main-content p-4 position-static">

      {dataLoading && (
        <div className="table-loader">
          <div className="spinner-border text-primary"></div>
          <label className="mt-2">Loading...</label>
        </div>

      )}

      {<UserMgmtPageHeader

        title={"Billing"}

        configData={configData}

        onAdd={() => setshowModalForm(true)}

      />}
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
onFullExport={handleFullExportBilling}         />
      </TableContainer>
      <ModalForm

        title={configData.masterTitle}

        formItems={formItems}

        show={showModalForm}

        onHide={closeModal}

        onEditData={dataToEdit}

        onSave={createData}

        onUpdate={updateData}

        masterData={formatedData}

        viewOnly={viewOnly}

        goodsInformation={

          Array.isArray(goodsInformation) ? goodsInformation : []

        }

        onMaterialDataChange={handleMaterialDataChange} // Pass the handler here

        onAddMaterial={addMaterial} // Pass add function

        onRemoveMaterial={onRemoveMaterial} // Pass remove function

        GridReady={onGridReady}

        stockOptions={stockOptions}

      />
    </div>

  );

};



export default Billing;



const TableContainer = styled.div``;



