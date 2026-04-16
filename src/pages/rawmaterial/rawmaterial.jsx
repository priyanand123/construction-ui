import React, { useEffect, useState  } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import ModalForm from "../../app/components/modalForm/modalForm";
import {
  DropdownFilter,
  TextSearchFilter,
  ManufactureDropdownFilter
} from "../../app/components/tableCmp/filters";
import TableCmp from "../../app/components/tableCmp/tableCmp";
import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";
import {
    addNewRawMaterial,
    deleteRawMaterial,
    fetchRawMaterialList,
    updateRawMaterial,
  } from "../../app/redux/slices/rawmaterial/rawmaterialslice.jsx";
  import { ApiKey } from "../../api/endpoints";
  import {selectOptionsReq} from "../../api/dropdownApi/dropdownreq";
const RawMaterial=()=> {
    const dispatch = useDispatch();
    const { rawmaterial } = useSelector((_state) => _state);
    const RoleNames = localStorage.getItem("username");
    const [showModalForm, setshowModalForm] = useState(false);
    const [dataToEdit, setdataToEdit] = useState(null);
    const [viewOnly, setviewOnly] = useState(false);
    const [dataLoading, setdataLoading] = useState(true);
    const [formatedData, setformatedData] = useState(rawmaterial?.data || []);
    const [unitsOptions, setunitsOptions] = useState([]);

   // useState(rawmaterial?.data || []);
   useEffect(() => {
    if (!rawmaterial.loading) return setdataLoading(false);
  }, [rawmaterial?.loading]);
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
            materialName: formData?.materialName || "",
            unitId: Number(formData?.unitId) || 0,
            isManufacturingMaterial: formData?.isManufacturingMaterial || false,             
            
           
            createdBy: RoleNames||"",
            //*createdDate: new Date(),
          };
    
         const resp = await addNewRawMaterial(dataBody, dispatch);
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
            materialName: formData?.materialName || "",
            unitId: Number(formData?.unitId) || 0,
            isManufacturingMaterial: formData?.isManufacturingMaterial || false,     
            //isClear: !!formData?.clear,
    
            ModifiedBy: RoleNames||"",
          };
         const resp = await updateRawMaterial(dataBody, dispatch);
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
         await deleteRawMaterial(rowData.id, dispatch);
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
     
        if (rawmaterial?.data?.length < 1) return;
        setformatedData(rawmaterial.data);
      }, [rawmaterial.data]);
      
      useEffect(() => {
        setdataLoading(true);
        dispatch(fetchRawMaterialList());
       
        (async () => {
          try {
            debugger;
            const res = await selectOptionsReq(ApiKey.Units);
            setunitsOptions(res.data || []);
          } catch (error) {}
        })();
      }, []);
      const columns = React.useMemo(
        () => [
          {
            Header: "Material Name",
            accessor: "materialName",
            Filter: TextSearchFilter,
          },
          {
            Header: "Units",
            accessor: "unit",
            Filter: DropdownFilter,
          },
          {
            Header: "Is Manufacturing Material",
            accessor: "isManufacturingMaterial",
            //Filter: DropdownFilter,
            //Cell: ({ value }) => String(value) 
             Cell: (props) => (props.value ? "True" : "False"),
                    Filter: ManufactureDropdownFilter, // Attach the custom filter
                    filter: "equals", // Specify the filter type
            
          },
    
          
        ],
        []
      );
    
      const configData = React.useMemo(
        () => ({
          masterTitle: "Raw Material",
          
        }),
        []
      );
      const formItems = [
        {
        
          label: "Material Name",
          name: "materialName",
          type: "text",         
          maxLength: 250,
          required: true,
          placeholder: "Max 250 characters",
          className: "col-lg-6 col-md-12",
        },
        {
          label: "Units",
          name: "unitId",
          type: "select",
          options: unitsOptions,        
          valueKey: "id",
          labelKey: "unit",
          required: true,          
          className: "col-lg-6 col-md-12",
        },
        
        {
          label: "Is Manufacturing Material",
          name: "isManufacturingMaterial",
          type: "checkbox",
          maxLength: null,
          required: true,
          placeholder: "",
          className: "col-lg-12 col-md-12",
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
      title={"Raw Material"}
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

export default RawMaterial;
const TableContainer = styled.div``;