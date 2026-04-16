import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import ModalForm from "../../app/components/modalForm/billingaggridmodelForm";
import {
  DropdownFilter,
  TextSearchFilter,
} from "../../app/components/tableCmp/filters";
import TableCmp from "../../app/components/tableCmp/tableCmp";
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

const DeliveryChalen = () => {
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
    console.log("API DATA:", billing.data);
    if (billing?.data) {

      const formattedData = billing.data.map((item) => ({
        ...item,
        dated: moment(item.dated).format("YYYY-MM-DD"),
        buyersOrderNoDated: moment(item.buyersOrderNoDated).format("YYYY-MM-DD"),
        deliveryNoteDate: moment(item.deliveryNoteDate).format("YYYY-MM-DD"),
        referenceDate: moment(item.referenceDate).format("YYYY-MM-DD"),
        DocType:
          item.isGSTInclude === 1 || item.isGSTInclude === "1"
            ? "WithGST"
            : "WithoutGST"
      }));

      // ✅ Ensure old → new (new record last)
      // const sortedData = [...formattedData].sort(
      // (a, b) => new Date(a.dated) - new Date(b.dated)
      // );

      // setformatedData(sortedData);
      const sortedData = formattedData.sort(
        (a, b) => Number(a.id) - Number(b.id)
      );
      setformatedData([...formattedData]);

      setdataLoading(false);
    }
  }, [billing?.data]);

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

  const createData = async (formData) => {
    try {
      debugger;
      // Calculate taxable value from goodsInformation
      /*const taxableValue =
        formData?.goodsInformation?.reduce((total, item) => {
          const amount = item.amount || 0; // Ensure there's an amount to sum
          return total + amount;
        }, 0) || 0;
      

      // Calculate totalAmount, CGST, SGST, totalTaxAmount

      const CGSTAmount = (1000 * Percentage) / 100 || 0.0;
      const SGSTAmount = (1000 * Percentage) / 100 || 0.0;
      const totalAmount = CGSTAmount + SGSTAmount + taxableValue || 0.0;
      const totalTaxAmount = CGSTAmount + SGSTAmount || 0.0;*/
      const totalAmount =
        formData?.goodsInformation?.reduce((total, item) => {
          const amount = item.amount || 0; // Ensure there's an amount to sum
          return total + amount;
        }, 0) || 0;
      const totalQty =
        formData?.goodsInformation?.reduce((quantitytotal, item) => {
          const quantity = item.quantity || 0; // Ensure there's an amount to sum
          return quantitytotal + quantity;
        }, 0) || 0;
      const CGSTAmount = (totalAmount * CgstPercentage) / 100 || 0.0;
      const SGSTAmount = (totalAmount * SgstPercentage) / 100 || 0.0;
      const taxableValue = CGSTAmount + SGSTAmount;
      const totalTaxableAmount = totalAmount + taxableValue;
      const IsGSTInclude = formData?.isGSTInclude === true ? 1 : 0;
      const dataBody = {
        id: formData?.id || 0,
        consigneeDetails: formData?.consigneeDetails || "",
        invoiceNo: formData?.invoiceNo || "",
        dated: formData?.dated || new Date(),
        deliveryNote: formData?.deliveryNote || "",
        modeTermsOfPayment: formData?.modeTermsOfPayment || "",
        referenceNo: formData?.referenceNo || "",
        referenceDate: formData?.referenceDate || new Date(),
        otherReferences: formData?.otherReferences || "",
        buyersOrderNo: formData?.buyersOrderNo || "",
        buyersOrderNoDated: formData?.buyersOrderNoDated || new Date(),
        // dispatchDocNo: formData?.dispatchDocNo || "",
        deliveryNoteDate: formData?.deliveryNoteDate || new Date(),
        dispatchedThrough: formData?.dispatchedThrough || "",
        destination: formData?.destination || "",
        billOfLadingLrRrNo: formData?.billOfLadingLrRrNo || "",
        hsnOrSac: hsnsac || "",
        totalQty: totalQty || 0,
        totalAmount: totalAmount, // Use the calculated totalAmount
        taxAmountInWords: formData?.taxAmountInWords || "",
        totalAmountInWords: formData?.totalAmountInWords || "",
        CGSTAmount: CGSTAmount, // Use the calculated CGSTAmount
        SGSTAmount: SGSTAmount, // Use the calculated SGSTAmount
        taxableValue: taxableValue, // Use the calculated taxableValue
        totalTaxAmount: totalTaxableAmount, // Use the calculated totalTaxAmount
        motorVehicleNo: formData?.motorVehicleNo || "",
        termsOfDelivery: formData?.termsOfDelivery || "",
        goodsInformation: JSON.stringify(formData?.goodsInformation) || "",
        deliveryManName: formData?.deliveryManName,
        deliveryManPhoneNo: formData?.deliveryManPhoneNo,
        isGSTInclude: IsGSTInclude,
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
      debugger;
      const dataBody = {
        ...formData,
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
      await dispatch(fetchBillingList());
      Swal.fire("Success", "Billing deleted!", "success");

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
        Header: "Dispatch Order No",
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
        Header: "GST Status",
        accessor: "DocType",
        Filter: ({ column: { filterValue, setFilter } }) => (
          <select
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            style={{ width: "100%", height: "35px", borderRadius: "5px", borderColor: "#ced4da" }}
          >
            <option value="">All</option>
            <option value="WithGST">With GST</option>
            <option value="WithoutGST">Without GST</option>
          </select>
        ),
        Cell: (props) => props.value === "WithGST" ? "With GST" : props.value || "Without GST"
      }
    ],
    []
  );

  const configData = React.useMemo(
    () => ({
      masterTitle: "Delivery Challan",
    }),
    []
  );

  const formItems = [




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
      label: "Motor Vehicle No",
      name: "motorVehicleNo",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "Max 50 characters",
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
      label: "With GST",
      name: "isGSTInclude",
      type: "checkbox",
      className: "col-lg-4 col-md-12",
      defaultValue: true, // or false depending on default
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
      label: "Consignee Details",
      name: "consigneeDetails",
      type: "textarea",
      maxLength: 2000,
      required: true,
      placeholder: "Max 510 characters",
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
      <UserMgmtPageHeader
        title={"Delivery Challan"}
        configData={configData}
        onAdd={() => setshowModalForm(true)}
      />
      <TableContainer className="bg-white px-3 py-2">
        <TableCmp
          tableData={formatedData || []}
          tableColumns={columns}
          masterTitle={configData.masterTitle}
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

export default DeliveryChalen;

const TableContainer = styled.div``;
