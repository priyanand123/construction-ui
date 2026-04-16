import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import TripModalForm from "../../app/components/modalForm/tripmodelForm";
import DieselModalForm from "../../app/components/modalForm/dieselmodelForm";
import { Tabs, Tab } from "react-bootstrap";
import {
  fetchTripList,
  addNewTrip,
  updateTrip,
  deleteTrip,
} from "../../app/redux/slices/triptdetails/tripdetailsSlice";
import {
  fetchDieselList,
  addNewDiesel,
  updateDiesel,
  deleteDiesel,
} from "../../app/redux/slices/diesel/dieselSlice";
import TableCmp from "../../app/components/tableCmp/tableCmp";
import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";
import { TextSearchFilter } from "../../app/components/tableCmp/filters";
import moment from "moment";

const Trip = () => {
  const dispatch = useDispatch();
  const RoleNames = localStorage.getItem("username");

  const { data: tripData = [], loading: tripLoading = false } = useSelector((state) => state.trip || {});
  const { data: dieselData = [], loading: dieselLoading = false } = useSelector((state) => state.diesel || {});

  const [showModalForm, setShowModalForm] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [activeKey, setActiveKey] = useState("trip");
  const [formType, setFormType] = useState(null);
  const configData = useMemo(() => {
    return activeKey === "trip"
      ? { masterTitle: "Trip" }
      : { masterTitle: "Diesel and Maintenance" };
  }, [activeKey]);


  useEffect(() => {
    dispatch(fetchTripList());
    dispatch(fetchDieselList());
  }, [dispatch]);

  const tripColumns = [

    {
      Header: "Start Meter",
      accessor: "startMeterReading",
      Filter: TextSearchFilter,
    },
    {
      Header: "End Meter",
      accessor: "endMeterReading",
      Filter: TextSearchFilter,
    },
    {
      Header: "Total Used",
      accessor: "totalUsedMeterReading",
      Filter: TextSearchFilter,
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ value }) => value ? moment.utc(value).local().format("DD/MM/YYYY") : "",
      Filter: TextSearchFilter,
    },
    {
      Header: "Person",
      accessor: "personName",
      Filter: TextSearchFilter,
    },
  ];

  const dieselColumns = [
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ value }) => value ? moment.utc(value).local().format("DD/MM/YYYY") : "",
      Filter: TextSearchFilter,
    },
    { Header: "Day", accessor: "day", Filter: TextSearchFilter },
    { Header: "Amount", accessor: "dieselAmount", Filter: TextSearchFilter },
    { Header: "Liters", accessor: "liters", Filter: TextSearchFilter },
    { Header: "Person", accessor: "personName", Filter: TextSearchFilter },
    { Header: "Maintenance Cost", accessor: "maintenanceCost", Filter: TextSearchFilter },


  ];

  const tripFormItems = [
    { label: "Start Meter Reading", name: "startMeterReading", type: "number", required: true, className: "col-lg-6" },
    { label: "End Meter Reading", name: "endMeterReading", type: "number", required: true, className: "col-lg-6" },
    { label: "Total Used Meter", name: "totalUsedMeterReading", type: "number", required: true, className: "col-lg-6" },
    { label: "Date", name: "date", type: "date", required: true, className: "col-lg-6" },
    { label: "Person Name", name: "personName", type: "text", required: true, className: "col-lg-6" },
  ];

  const dieselFormItems = [
    { label: "Date", name: "date", type: "date", required: true, className: "col-lg-6" },
    { label: "Day", name: "day", type: "text", required: true, className: "col-lg-6" },
    { label: "Amount", name: "dieselAmount", type: "number", required: true, className: "col-lg-6" },
    { label: "Liters", name: "liters", type: "number", required: true, className: "col-lg-6" },
    { label: "Person Name", name: "personName", type: "text", required: true, className: "col-lg-6" },
    { label: "Maintenance Cost", name: "maintenanceCost", type: "number", required: true, className: "col-lg-6" },

  ];

  const createData = async (formData) => {
    try {
      let resp;
      if (activeKey === "trip") {
        const body = {

          startMeterReading: parseFloat(formData.startMeterReading),
          endMeterReading: parseFloat(formData.endMeterReading),
          totalUsedMeterReading: parseFloat(formData.totalUsedMeterReading),
          date: formData.date,
          personName: formData.personName,
          createdBy: RoleNames || "",

        };
        resp = await addNewTrip(body, dispatch);
      } else {
        const body = {

          date: formData.date,
          day: formData.day,
          dieselAmount: parseFloat(formData.dieselAmount),
          liters: parseFloat(formData.liters),
          personName: formData.personName,
          maintenanceCost: formData.maintenanceCost,
          createdBy: RoleNames || "",
        };
        resp = await addNewDiesel(body, dispatch);
      }

      if (resp.data?.id > 0) {
        Swal.fire("Success", "Record added successfully", "success");
        closeModal();
        dispatch(fetchTripList());
        dispatch(fetchDieselList());
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const updateData = async (formData) => {
    try {
      let resp;
      if (activeKey === "trip") {
        const body = {
          id: formData.id,
          startMeterReading: parseFloat(formData.startMeterReading),
          endMeterReading: parseFloat(formData.endMeterReading),
          totalUsedMeterReading: parseFloat(formData.totalUsedMeterReading),
          date: formData.date,
          personName: formData.personName,
          modifiedBy: RoleNames || "",
        };
        resp = await updateTrip(body, dispatch);
      } else {
        const body = {
          id: formData.id,
          date: formData.date,
          day: formData.day,
          dieselAmount: parseFloat(formData.dieselAmount),
          liters: parseFloat(formData.liters),
          personName: formData.personName,
          maintenanceCost: formData.maintenanceCost,
          modifiedBy: RoleNames || "",
        };
        resp = await updateDiesel(body, dispatch);
      }

      if (resp.data) {
        Swal.fire("Updated", "Record updated successfully", "success");
        closeModal();
        dispatch(fetchTripList());
        dispatch(fetchDieselList());
      }
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  const deleteRowData = async (rowData) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      if (activeKey === "trip") await deleteTrip(rowData.id, dispatch);
      else await deleteDiesel(rowData.id, dispatch);

      Swal.fire("Deleted", "Record deleted", "success");
      dispatch(fetchTripList());
      dispatch(fetchDieselList());
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const viewRowData = (rowData) => {
    const type = activeKey;
    const safeRow = {
      ...rowData,
      date: rowData?.date ? moment(rowData.date).format("YYYY-MM-DD") : "",
    };
    setFormType(type);
    setDataToEdit(safeRow);
    setViewOnly(true);
    setShowModalForm(true);
  };

  const editRowData = (rowData) => {
    const type = activeKey;
    const safeRow = {
      ...rowData,
      date: rowData?.date ? moment(rowData.date).format("YYYY-MM-DD") : "",
    };
    setFormType(type);
    setDataToEdit(safeRow);
    setViewOnly(false);
    setShowModalForm(true);
  };


  const closeModal = () => {
    setShowModalForm(false);
    setDataToEdit(null);
    setViewOnly(false);
  };

  return (
    <div className="main-content p-4 position-static">
      {(tripLoading || dieselLoading) && (
        <div className="table-loader">
          <div className="spinner-border text-primary"></div>
          <label className="mt-2">Loading..</label>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 px-3 py-2 border border-black rounded bg-light flex-wrap">
        <h4 className="card-title mb-0">Trip and Diesel Details</h4>


        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              setActiveKey("trip");
              setFormType("trip");
              setDataToEdit(null);
              setViewOnly(false);
              setShowModalForm(true);
            }}
          >
            + Add Trip Details
          </button>

          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              setActiveKey("diesel");
              setFormType("diesel"); // 👈 ADD THIS
              setDataToEdit(null);
              setViewOnly(false);
              setShowModalForm(true);
            }}
          >
            + Add Diesel and Maintanance Details
          </button>

        </div>
      </div>





      <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k)} className="mb-3" fill>
        <Tab eventKey="trip" title="Trip Details">
          <TableContainer>
            <TableCmp
              tableData={tripData}
              tableColumns={tripColumns}
              configData={configData}
              onDeleteRow={deleteRowData}
              onEditRow={editRowData}
              onView={viewRowData}
              editable
              deleteable
              viewable
            />
          </TableContainer>
        </Tab>

        <Tab eventKey="diesel" title="Diesel and Maintenance">
          <TableContainer>
            <TableCmp
              tableData={dieselData}
              tableColumns={dieselColumns}
              configData={{ masterTitle: "Diesel and Maintenance" }}
              onDeleteRow={deleteRowData}
              onEditRow={editRowData}
              onView={viewRowData}
              editable
              deleteable
              viewable
            />
          </TableContainer>
        </Tab>
      </Tabs>
      {formType === "trip" && (
        <TripModalForm
          show={showModalForm}
          onHide={closeModal}
          onEditData={dataToEdit}
          onSave={createData}
          onUpdate={updateData}
          viewOnly={viewOnly}
        />
      )}

      {formType === "diesel" && (
        <DieselModalForm
          show={showModalForm}
          onHide={closeModal}
          onEditData={dataToEdit}
          onSave={createData}
          onUpdate={updateData}
          viewOnly={viewOnly}
        />
      )}


    </div>
  );
};

export default Trip;

const TableContainer = styled.div`
  height: 65vh;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;
