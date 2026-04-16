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
    addNewUnits,
    deleteUnits,
    fetchUnitsList,
    updateUnits,
  } from "../../app/redux/slices/units/unitslice";
  import { ApiKey } from "../../api/endpoints";
  import {selectOptionsReq} from "../../api/dropdownApi/dropdownreq";
const Units=()=> {
    const dispatch = useDispatch();
    const { units } = useSelector((_state) => _state);
    const RoleNames = localStorage.getItem("username");
    const [showModalForm, setshowModalForm] = useState(false);
    const [dataToEdit, setdataToEdit] = useState(null);
    const [viewOnly, setviewOnly] = useState(false);
    const [dataLoading, setdataLoading] = useState(true);
    const [formatedData, setformatedData] =useState(units?.data || []);
   

   
   useEffect(() => {
    if (!units.loading) return setdataLoading(false);
  }, [units?.loading]);
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
          
    
          const dataBody = {
            id: formData?.id || 0,
            unit: formData?.unit || "",               
            
           
            createdBy: RoleNames||"",
            //*createdDate: new Date(),
          };
    
         const resp = await addNewUnits(dataBody, dispatch);
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
          
    
          const dataBody = {
            id: formData?.id || 0,
            unit: formData?.unit || "",      
            //isClear: !!formData?.clear,
    
            ModifiedBy: RoleNames || "",
          };
         const resp = await updateUnits(dataBody, dispatch);
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
         await deleteUnits(rowData.id, dispatch);
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
     
        if (units?.data?.length < 1) return;
        setformatedData(units.data);
      }, [units.data]);
      useEffect(() => {
        setdataLoading(true);
        dispatch(fetchUnitsList());       
       
      }, []);
      const columns = React.useMemo(
        () => [
          {
            Header: "Units",
            accessor: "unit",
            Filter: DropdownFilter,
          },
          
    
          
        ],
        []
      );
    
      const configData = React.useMemo(
        () => ({
          masterTitle: "Units",
          
        }),
        []
      );
      const formItems = [
        {
        
          label: "Units",
          name: "unit",
          type: "text",         
          maxLength: 20,
          required: true,
          placeholder: "Max 20 characters",
          className: "col-lg-6 col-md-12",
        },
        
      ];
  return (
    <div className="main-content p-4 position-static">
      {dataLoading && (
        <div className="table-loader">
          <div className="spinner-border text-primary"></div>
          <label className="mt-2">Loading..</label>
        </div>
      )}
     <UserMgmtPageHeader
      title={"Units"}
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

export default Units;
const TableContainer = styled.div``;