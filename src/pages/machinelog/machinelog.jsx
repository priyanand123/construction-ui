import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import ModalForm from "../../app/components/modalForm/agmodelform";
import MaterialGrid from "../../app/components/modalForm/materialGrid";
import {
  DropdownFilter,
  TextSearchFilter,
} from "../../app/components/tableCmp/filters";
import TableCmp from "../../app/components/tableCmp/tableCmp";
import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";
import {
  addNewMachinelog,
  deleteMachinelog,
  fetchMachinelogList,
  updateMachinelog, //from "../../app/redux/slices/"
} from "../../app/redux/slices/machinelog/machinelogslice";
import { ApiKey } from "../../api/endpoints";
import { selectOptionsReq } from "../../api/dropdownApi/dropdownreq";
import dayjs from "dayjs";
import moment from "moment";
import { useLocation } from "react-router-dom";
//import { useForm, Controller, useWatch } from "react-hook-form";
const MachineLog = () => {
  const dispatch = useDispatch();
  const [pressingCount, setPressingCount] = useState(0);
   const [stockOptions, setstockOptions] = useState([]);
  //const [damagedBrickCount, setDamagedBrickCount] = useState(0);
  
 let totalBricksCount;
 let damagedBricksCount=0;
 let actualBricksCount ;

  const location = useLocation();
  const { formData } = location.state || {}; // Retrieve the formData from the state

  console.log(formData, "materialdata");
  const { machinelog } = useSelector((_state) => _state);
  const RoleNames = localStorage.getItem("username");
  const [showModalForm, setshowModalForm] = useState(false);
  const [dataToEdit, setdataToEdit] = useState(null);
  const [viewOnly, setviewOnly] = useState(false);
  const [dataLoading, setdataLoading] = useState(true);
  const [formatedData, setformatedData] = useState(machinelog?.data || []);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [unitsOptions, setUnitsOptions] = useState([]);
  const [materialData, setmaterialData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  
const addMaterial = () => {

    debugger;
    const newMaterial = {
      materialName: "",
      unit: "",
      quantity: 0,
    };
    setmaterialData((prevData) => [...prevData, newMaterial]);
  };
 
  const onGridReady = (params) => {
    setGridApi(params.api); // Set the gridApi from the grid's params
  };

  const onRemoveMaterial = () => {
    debugger;
    const selectedRows = gridApi.getSelectedRows();
    setmaterialData((prevData) =>
      prevData.filter((row) => !selectedRows.includes(row))
    );
  };

  // const onRemoveMaterial = (Id) => {
  //     setmaterialData((materialData) => materialData.filter((item) => item.id !== Id));
  // };
  useEffect(() => {
    if (!machinelog.loading) return setdataLoading(false);
  }, [machinelog?.loading]);

  // Define the function to handle changes in material data
  const handleMaterialDataChange = (updatedData) => {
    setmaterialData(updatedData); // Update state with the modified material data
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
    try {
      debugger;

      const normalizeTimeSpan = (value) => {
        if (!value || typeof value !== "string") return "00:00:00";
        const timePattern = /^(\d{1,2}):(\d{2}):(\d{2})$/;
        if (timePattern.test(value)) return value; // Already in correct format
        return "00:00:00"; // Default fallback
      };
      totalBricksCount = (formData?.pressingCount || 0) * 12;
      console.log("total", totalBricksCount);
      // Extract damagedBricksCount from formData
     damagedBricksCount = formData?.damagedBricksCount || 0;

      // Calculate actualBricks
      actualBricksCount =
        damagedBricksCount === 0 ? totalBricksCount : totalBricksCount - damagedBricksCount;
      const dataBody = {
        id: formData?.id || 0,
        logDate: formData?.logDate || "",
        startTime: formData?.startTime || "00:00:00",
        stopTime: formData?.stopTime || "00:00:00",
        totalWorkingTime: normalizeTimeSpan(formData?.totalWorkingTime),
        materialData: JSON.stringify(formData?.materialData) || "",
        eBMeterStartReading: formData?.eBMeterStartReading || "",
        eBMeterEndReading:formData?.eBMeterEndReading ||"",
        totalEBUnitsUsedToday: formData?.totalEBUnitsUsedToday || 0, 
        averageWeightOfBricks: formData?.averageWeightOfBricks || 0,
        pressingCount: formData?.pressingCount || 0,
        noOfMixtures:formData?.noOfMixtures ||0,
        reasonForShutdown: formData?.reasonForShutdown || "",
        totalBricksCount: totalBricksCount,
        damagedBricksCount: damagedBricksCount,
        actualBricksCount: actualBricksCount,

        createdBy: RoleNames || "",
        //*createdDate: new Date(),
      };

      const resp = await addNewMachinelog(dataBody, dispatch);
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
      debugger;
      const normalizeTimeSpan = (value) => {
        if (!value || typeof value !== "string") return "00:00:00";
        const timePattern = /^(\d{1,2}):(\d{2}):(\d{2})$/;
        if (timePattern.test(value)) return value; // Already in correct format
        return "00:00:00"; // Default fallback
      };
      totalBricksCount = (formData?.pressingCount || 0) * 12;
      console.log("total", totalBricksCount);
      // Extract damagedBricksCount from formData
     damagedBricksCount = formData?.damagedBricksCount || 0;

      // Calculate actualBricks
      actualBricksCount =
        damagedBricksCount === 0 ? totalBricksCount : totalBricksCount - damagedBricksCount;
      const dataBody = {
        //id: formData?.id || 0,
        id: formData?.id || 0,
        logDate: formData?.logDate || "",
        startTime: formData?.startTime || "00:00:00",
        stopTime: formData?.stopTime || "00:00:00",
        totalWorkingTime: normalizeTimeSpan(formData?.totalWorkingTime),
        materialData: JSON.stringify(formData?.materialData) || "",
        eBMeterStartReading: formData?.eBMeterStartReading || "",
        eBMeterEndReading:formData?.eBMeterEndReading ||"",
        totalEBUnitsUsedToday: formData?.totalEBUnitsUsedToday || 0, 
        averageWeightOfBricks: formData?.averageWeightOfBricks || 0, 
        pressingCount: formData?.pressingCount || 0,
        noOfMixtures:formData?.noOfMixtures ||0,
        reasonForShutdown: formData?.reasonForShutdown || "",
        totalBricksCount: totalBricksCount,
        damagedBricksCount: damagedBricksCount,
        actualBricksCount: actualBricksCount,
        ModifiedBy: RoleNames || "",
      };
      const resp = await updateMachinelog(dataBody, dispatch);
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
      await deleteMachinelog(rowData.id, dispatch);
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
    debugger;

    setshowModalForm(true);
    //setdataToEdit(rowData);
    setdataToEdit({
      ...rowData,
      logDate: moment(rowData.logDate).format("YYYY-MM-DD"),
    })
    setmaterialData(JSON.parse(rowData.materialData));
   
  };
  const viewRowData = (rowData) => {
    setshowModalForm(true);
    setdataToEdit({
      ...rowData,
      logDate: moment(rowData.logDate).format("YYYY-MM-DD"),
    })
    setviewOnly(true);
    setmaterialData(JSON.parse(rowData.materialData));
  };
  const closeModal = () => {
    debugger;
    setdataToEdit(null);
    setshowModalForm(false);
    setviewOnly(false);
    setmaterialData([]);
  };
  useEffect(() => {
    debugger;
    if (machinelog?.data && machinelog.data.length > 0) {
      setformatedData(machinelog.data);
    const formatted = machinelog.data.map((item) => ({
      ...item,
      logDate: moment(item.logDate).format("YYYY-MM-DD"),
    }));
    setdataLoading(false);
  }
  }, [machinelog?.data]);

  useEffect(() => {
    setdataLoading(true);
    dispatch(fetchMachinelogList());
    (async () => {
      try {
        const materialRes = await selectOptionsReq(ApiKey.RawMaterial);
        setMaterialOptions(materialRes.data || []);
        console.log(materialRes.data);
      } catch (error) {}
    })();
    (async () => {
      try {
        debugger;
        const res = await selectOptionsReq(ApiKey.Units);
        setUnitsOptions(res.data || []);
      } catch (error) {}
    })();
    (async () => {
              try {
                const stockres = await selectOptionsReq(ApiKey.getStock);
                setstockOptions(stockres.data || []);
                console.log(stockres.data);
              } catch (error) {}
            })();
  }, []);
  
  const columns = React.useMemo(
    () => [
      {
        Header: "Pressing Count",
        accessor: "pressingCount",
        Filter: TextSearchFilter,
      },

      {
        Header: "Start Time",
        accessor: "startTime",
        Filter: DropdownFilter,
      },
      {
        Header: "Stop Time",
        accessor: "stopTime",
        Filter: DropdownFilter,
      },
      {
        Header: "Damaged Bricks Count",
        accessor: "damagedBricksCount",
        Filter: TextSearchFilter,
      },

      {
        Header: "log Date",
        accessor: "logDate",
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
      masterTitle: "Machine Log",
    }),
    []
  );
   // Dynamically modify formItems based on your business logic
  
   const formItems = [
    {
      label: "Log Date",
      name: "logDate",
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
      label: "Start Time",
      name: "startTime",
      type: "time",
      //min: dayjs().format("YYYY-MM-DD"),
      maxLength: null,
      required: true,
      placeholder: "Max 50 characters",
      className: "col-lg-4 col-md-12",
      //defaultValue: dayjs().format("YYYY-MM-DD"),
      //disabled: disableFieldsForUser(),
    },
    {
      label: "Stop Time",
      name: "stopTime",
      type: "time",
      //min: dayjs().format("YYYY-MM-DD"),
      maxLength: null,
      required: true,
      placeholder: "Max 50 characters",
      className: "col-lg-4 col-md-12",
      // defaultValue: dayjs().format("YYYY-MM-DD"),
      //disabled: disableFieldsForUser(),
    },
    {
      label: "Total Working Time",
      name: "totalWorkingTime",
      type: "time",
      //maxLength: 25,
      required: true,
      placeholder: "Max 25 characters",
      className: "col-lg-4 col-md-12",
    },

    {
      label: "Start EB Reading",
      name: "eBMeterStartReading",
      type: "text",
      maxLength: 100,
      required: true,
      placeholder: "Max 100 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Stop EB Reading",
      name: "eBMeterEndReading",
      type: "text",
      maxLength: 100,
      required: true,
      placeholder: "Max 100 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Total EB Units Used",
      name: "totalEBUnitsUsedToday",
      type: "text",
      maxLength: 100,
      required: true,
      placeholder: "Max 100 characters",
      className: "col-lg-4 col-md-12",
    },
    {
      label: "No of Mixture",
      name: "noOfMixtures",
      type: "number",
      maxLength: 5,
      //required: true,  
      //value: pressingCount,  
      className: "col-lg-4 col-md-12",
      //onChange: (e) => setPressingCount(Number(e.target.value) || 0),
      
    },
    

    {
      label: "Pressing Count",
      name: "pressingCount",
      type: "number",
      maxLength: 5,
      required: true,  
      //value: pressingCount,  
      className: "col-lg-4 col-md-12",
      //onChange: (e) => setPressingCount(Number(e.target.value) || 0),
      
    },
    
   /* {
      label: "Total Bricks",
      name: "totalBricksCount",
      type: "number",
      maxLength: 5,
      required: true,
      readOnly: true,
      
      className: "col-lg-4 col-md-12",
    },
    {
      label: "Actual Bricks Count",
      name: "actualBricksCount",
      type: "number",
      maxLength: 5,
      required: true,
      className: "col-lg-4 col-md-12",
    },*/
    
    {
      label: "Average weight of bricks",
      name: "averageWeightOfBricks",
      type: "text",
      maxLength: 100,
      required: true,  
      //value: pressingCount,  
      className: "col-lg-4 col-md-12",
      //onChange: (e) => setPressingCount(Number(e.target.value) || 0),
      
    },
    {
      label: "Damaged Bricks Count",
      name: "damagedBricksCount",
      type: "number",
      maxLength: 5,
      //value:damagedBricksCount,
      className: "col-lg-4 col-md-12",
      defaultValue: 0,
    },
    
    {
      label: "Reason For Shutdown",
      name: "reasonForShutdown",
      type: "text",
      maxLength: 2000,
     // required: true,
      placeholder: "Max 2000 characters",
      className: "col-lg-4 col-md-12",
    },

    
  ];
    
  if (viewOnly) {
    debugger;
    formItems.push(
      {
        label: "Total Bricks",
        name: "totalBricksCount",
        type: "number",
        maxLength: 5,
        required: true,
        readOnly: true,
        className: "col-lg-4 col-md-12",
        dynamicField: true,
        dynamicRules: [
        {
          filedName: "pressingCount",
          condition: (value) => value !== "" ,
         // condition: (damagedBrickCount) => damagedBrickCount > 10,
        },
      ],
      },
      {
        label: "Actual Bricks Count",
        name: "actualBricksCount",
        type: "number",
        maxLength: 5,
        required: true,
        className: "col-lg-4 col-md-12",
        dynamicField: true,
      dynamicRules: [
        {
          filedName: "pressingCount",
          condition: (value) => value !== "",
        },
      ],
      }
    );
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
        title={"Machine Log"}
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
        materialData={Array.isArray(materialData) ? materialData : []}
        onMaterialDataChange={handleMaterialDataChange} // Pass the handler here
        onAddMaterial={addMaterial} // Pass add function
        onRemoveMaterial={onRemoveMaterial} // Pass remove function
        materialOptions={materialOptions}
        unitsOptions={unitsOptions}
        GridReady={onGridReady}
        stockOptions={stockOptions}
        
      />
       
      
    </div>
  );
};

export default MachineLog;
const TableContainer = styled.div``;
