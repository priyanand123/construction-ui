import React, { memo, useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm ,Controller } from "react-hook-form";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react"; // Import AgGridReact
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import RenderIf from "../renderif.jsx";
import { DynamicFieldsBlock } from "./formElements";
import { useNavigate } from "react-router-dom";
const ModalForm = (props) => {
  
  const {
    show,
    size,
    onHide,
    formItems,
    onEditData,
    onSave,
    onUpdate,
    title,
    masterData,
    valDupFields,
    viewOnly,
    roleBaseDisable,
    materialOptions, // Pass materialOptions as a prop
    unitsOptions, // Pass unitsOptions as a prop
    stockOptions,
  } = props;

  const [showMediaModal, setshowMediaModal] = useState(false);
  const [mediaDataIs, setmediaDataIs] = useState("");
  const [loading, setloading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const gridApi = useRef(null);
  const gridColumnApi = useRef(null);
  //const [viewOnly, setViewOnly] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
    value,
    onChange
  } = useForm({
    defaultValues: formItems.reduce((acc, item) => {
      if (item.defaultValue) acc[item.name] = item.defaultValue;
      return acc;
    }, {}),
  });
  const navigate = useNavigate();
  /*const pressingCount = watch("pressingCount");
 
  const hasMounted = useRef(false);

  useEffect(() => {
    debugger;
    // Run the effect only if the component is mounted and pressingCount changes
    if (pressingCount !== "" && !hasMounted.current) {
      // Dynamically calculate and set the `totalBricksCount`
      const totalBricks = Number(pressingCount) * 12; // Calculate total bricks
      setValue("totalBricksCount", totalBricks); // Set the calculated value
      hasMounted.current = true;  // Mark that the component has mounted
    } else if (pressingCount !== "") {
      // Recalculate totalBricksCount if pressingCount changes
      const totalBricks = Number(pressingCount) * 12;
      setValue("totalBricksCount", totalBricks);
    }
  }, [pressingCount, setValue]);*/
  // Define columns for Ag-Grid
  const columns = [
    { headerName: "Id", field: "id", editable: !viewOnly,required: true, },
    {
      headerName: "Material",
      field: "materialId",
      //editable: true,
      editable: !viewOnly,
      required: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        
        values: materialOptions.filter((material) => !material.isManufacturingMaterial)
        .map((material) => material.materialName),
      },
      valueGetter: (params) => {
        const material = materialOptions.find(
          (m) => m.id === params.data.materialId
        );
        return material ? material.materialName : "";
      },
      valueSetter: (params) => {
        if (viewOnly) return false;
        const selectedMaterial = materialOptions.find(
          (material) => material.materialName === params.newValue
        );
        if (selectedMaterial) {
          params.data.materialId = selectedMaterial.id;
          params.data.materialName = selectedMaterial.materialName;
          params.data.unitId = selectedMaterial.unitId;
          params.data.unit = selectedMaterial.unit; // Set default unit based on material
          return true;
        }
        return false;
      },
    },
    {
      headerName: "Unit",
      field: "unitId",
      editable: !viewOnly,
      required: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: unitsOptions.map((unit) => unit.unit),
      },
      valueGetter: (params) => {
        const unit = unitsOptions.find((u) => u.id === params.data.unitId);
        return unit ? unit.unit : "";
      },
      valueSetter: (params) => {
        if (viewOnly) return false;
        const selectedUnit = unitsOptions.find(
          (unit) => unit.unit === params.newValue
        );
        if (selectedUnit) {
          params.data.unitId = selectedUnit.id;
          params.data.unit = selectedUnit.unit;
          return true;
        }
        return false;
      },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      editable: !viewOnly,
      required: true,
      valueGetter: (params) => {
        debugger;
        // Display the current stock value for the selected material
        const material = stockOptions.find(
          (m) => m.materialId === params.data.materialId
        );
        return params.data.quantity ||(material ? material.currentStocks : 0);
      },
      valueSetter: (params) => {
        if (viewOnly) return false;
    
        // Parse the new value as an integer
    const newQuantity = parseInt(params.newValue, 10);

    // Validate the new quantity
    const material = stockOptions.find(
      (m) => m.materialId === params.data.materialId
    );

    if (!isNaN(newQuantity) && material) {
      if (newQuantity <= material.currentStocks) {
        params.data.quantity = newQuantity; // Update the value
        return true; // Indicate the value was successfully set
      } else {
        alert(
          `The entered quantity (${newQuantity}) exceeds the available stock (${material.currentStocks}).`
        );
        return false; // Reject the value
      }
    }
        return false;
      },
    },
    /*{
      headerName: "Actions",
      field: "actions",
      cellRendererFramework: (params) => {
        return <Button onClick={() => handleDeleteRow(params)}>Delete</Button>;
      }
    }*/
  ];

  // Handle row addition
  const handleAddRow = () => {
    if (!viewOnly) {
      const newRow = {
        id: gridData.length + 1, // Use index-based ID (index + 1)
        materialName: "",
        unit: "",
        quantity: 0,
      };
      setGridData([...gridData, newRow]);
    }
  };

  // Handle row deletion for selected rows using applyTransaction
  const handleDeleteRow = () => {
    if (!viewOnly && gridApi.current) {
      // Get selected rows using getSelectedNodes (alternative to getSelectedRows)
      const selectedNodes = gridApi.current.getSelectedNodes();

      if (selectedNodes.length > 0) {
        // Extract row data of selected rows
        const selectedData = selectedNodes.map((node) => node.data);
        // Filter out selected rows from grid data
        const updatedData = gridData.filter(
          (item) => !selectedData.includes(item)
        );

        // Apply the transaction to remove the selected rows from gridData
        gridApi.current.applyTransaction({ remove: selectedData });

        // Update gridData state
        setGridData(updatedData);
      } else {
        alert("Please select a row to delete.");
      }
    } else {
      alert("Grid API not available.");
    }
  };

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;
    if (viewOnly) {
      params.api.forEachNode((node) => {
        node.setRowSelectable(false); // Disable row selection in view mode
      });
    }
  };

  const onShowModal = () => {
    debugger;
    !onEditData && reset();
    setloading(false);
    setGridData([]);
  };
  const openMedia = (data) => {
    setshowMediaModal(true);
    setmediaDataIs(data);
  };

  /*const onSubmitData = (data) => {
    setloading(true);
    if (onEditData) {
      onUpdate({ ...onEditData, ...data });
    } else {
      onSave(data);
    }
  };*/
  const onSubmitData = (data) => {
    setloading(true);
    const hasEmptyFields = gridData.some((row) => {
      return Object.keys(row).some((key) => {
        const column = columns.find((col) => col.field === key);
        return column?.required && !row[key]; // Check required fields
      });
    });
  
    if (hasEmptyFields) {
      setloading(false);
      alert("All fields in the grid are required.");
      return;
    }
    // Add the grid data (material data) to the form data
    const formData = { ...data, materialData: gridData };
    //navigate("main/machinelog", { state: { formData } });
    // If editing, update the record; otherwise, save it
    if (onEditData) {
      onUpdate({ ...onEditData, ...formData });
    } else {
      onSave(formData);
    }
  };

  const onClose = () => {
    debugger;
    onHide();
    reset();
    setGridData([]);
  };

  /* useEffect(() => {
    if (onEditData) {
      reset();
      formItems.forEach((item) => {
        setValue(item.name, onEditData[item.name]);
      });

      // Set the grid data if available in onEditData
      setGridData(onEditData.materialData || []);
    }
  }, [onEditData]);*/
  useEffect(() => {
    debugger;
    if (onEditData) {
      reset();
     /* formItems.forEach((item) => {
        debugger;
        if (item?.name === "pressingCount") {
          debugger;
          const pressingCount = onEditData["pressingCount"] || 0;
          setValue(item.name, pressingCount);
          // Ensure pressingCount exists
          const totalBricks = pressingCount * 12;
          // Calculate total bricks
          setValue("totalBricksCount", totalBricks);
          return;
         
          // Set calculated value
        }
        setValue(item.name, onEditData[item.name]);
      });*/
      formItems.forEach((item) => {
        setValue(item.name, onEditData[item.name]);
      });
      // Check if materialData exists and is a string, then parse it into an array
      let gridMaterialData = [];
      try {
       debugger;
        gridMaterialData = Array.isArray(onEditData?.materialData)
          ? onEditData?.materialData
          : JSON.parse(onEditData?.materialData || "[]"); // Default to empty array if parsing fails
      } catch (error) {
        console.error("Error parsing materialData:", error);
      }

      // Ensure the materialData array is correctly populated
      setGridData(
        gridMaterialData.map((material) => ({
          id: material.id, // Ensure there's an id for each material
          materialId: material.materialId,
          //materialName: material.materialName,
          unitId: material.unitId,
         // unit: material.unit,
          quantity: material.quantity || 0, // Set quantity to 0 if undefined
        }))
      );
    }
  }, [onEditData, formItems, reset, setValue]);


 
  return (
    <>
      <Modal
        show={show && !showMediaModal}
        onHide={onClose}
        onShow={onShowModal}
        backdrop="static"
        keyboard={false}
        centered
        size={size ? size : "lg"}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {viewOnly
              ? `View ${title}`
              : onEditData
              ? `Edit ${title}`
              : `Add ${title}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalFormContainer onSubmit={handleSubmit(onSubmitData)}>
            <div className="modal-body" id="load_add_form">
              <div className="row">
                
                {formItems.map((item, idx) => {
                  if (
                    !!item?.dynamicField &&
                    item?.dynamicRules &&
                    item?.dynamicRules?.length > 0
                  ) {
                    let ruleMatched;
                    item?.dynamicRules?.forEach((rule) => {
                      const formValue = watch(rule.filedName);
                      ruleMatched = formValue == rule.value;
                    });
                    /*const fieldValue =
          rule.fieldName === "pressingCount" ? pressingCount : null; // Fetch field value
        return rule.condition(fieldValue); // Evaluate condition
      });
      return true;*/
                    //if (!ruleMatched) return;
                  }
                  return (
                    <div
                      key={idx}
                      className={item?.className && item?.className}
                    >
                      <RenderIf isShow={item.type !== "checkbox"}>
                        <label htmlFor={item.name} className="requiredField">
                          {item.label}
                          {!!item.required && (
                            <span className="asteriskField">*</span>
                          )}
                        </label>
                      </RenderIf>
                      <DynamicFieldsBlock
                        item={item}
                        errors={errors}
                        viewOnly={viewOnly}
                        roleBaseDisable={roleBaseDisable}
                        register={register}
                        watch={watch}
                        openImage={(mediaData) => openMedia(item)}
                        control={control}
                        value={value || ""}
                        onChange={onChange}
                      />
                      {errors[item.name] && (
                        <p style={{ color: "red" }}>
                          {errors[item.name].message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Render AgGrid */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                
                    <Button
                      variant="primary"
                      onClick={handleAddRow}
                      style={{ marginRight: "3px" }}
                      disabled={viewOnly}
                    >
                      Add Material
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleDeleteRow}
                      style={{ marginRight: "3px" }}
                      disabled={viewOnly}
                    >
                      Delete Material
                    </Button>
                 
              
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: "100%" }}
              >
                 
                <AgGridReact
                  onGridReady={onGridReady}
                  columnDefs={columns}
                  rowData={gridData}
                  domLayout="autoHeight"
                  rowSelection={viewOnly ? "none" : "multiple"} // Disable row selection in view-only mode
                  suppressRowClickSelection={viewOnly} // Prevent row clicks in view-only mode
                  editable={!viewOnly} // Disable cell editing in view-only mode
                  pagination={false} // Removed pagination as requested
                />
               
              </div>
            </div>
            {/* Add Material Button */}

            {/* Submit Button */}
            <RenderIf isShow={!viewOnly}>
              <div className="modal-footer">
                <Button className="btn btn-light" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="btn_dark" type="submit">
                  {!!onEditData ? "Update" : "Save"}{" "}
                  {loading && (
                    <div class="spinner-border text-light" role="status"></div>
                  )}
                </Button>
              </div>
            </RenderIf>
          </ModalFormContainer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(ModalForm);

const ModalFormContainer = styled.form`
  font-family: "GT-Walsheim" !important;
  p {
    font-family: "GT-Walsheim" !important;
    font-size: smaller;
  }
  h6,
  h5 {
    font-family: "GT-Walsheim" !important;
  }
`;
