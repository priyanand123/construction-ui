import React, { memo, useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react"; // Import AgGridReact
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import RenderIf from "../renderif.jsx";
import { DynamicFieldsBlock } from "./formElements";
import { useNavigate } from "react-router-dom";
import { fetchStockList } from "../../redux/slices/stock/stockslice.jsx";
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
    stockOptions, // Pass materialOptions as a prop
    unitsOptions, // Pass unitsOptions as a prop
  } = props;
console.log(formItems,"formItems");
console.log(stockOptions,"stock");
  const [showMediaModal, setshowMediaModal] = useState(false);
  const [mediaDataIs, setmediaDataIs] = useState("");
  const [loading, setloading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const gridApi = useRef(null);
  const gridColumnApi = useRef(null);
  let  taxableValue = 0;
  let totalQty =0;
  //const [viewOnly, setViewOnly] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    defaultValues: formItems.reduce((acc, item) => {
      if (item.defaultValue) acc[item.name] = item.defaultValue;
      return acc;
    }, {}),
  });
  const navigate = useNavigate();

  // Define columns for Ag-Grid
  const columns = [
    { headerName: "SI.No", field: "sno", editable: !viewOnly, required: true },
  {
    headerName: "Description of Goods",
    field: "descriptionofgoods",
    editable: !viewOnly,
    required: true,
  },
  {
    headerName: "HSN/SAC",
    field: "hsnsac",
    editable: false,
    required: true,
  },
  {
    headerName: "Quantity",
    field: "quantity",
    editable: !viewOnly,
    //required: true,
    valueGetter: (params) => {
      debugger;
      const stock = stockOptions.find(
        (stock) => stock.materialName === "ReadyToDispatchBricks"
      );
      return params.data.quantity || (stock ? stock.currentStocks : 0);
    },
    /*valueSetter: (params) => {
      debugger;
      const stock = stockOptions.find(
        (stock) => stock.materialName === "ReadyToDispatchBricks"
      );
      if (stock) {
        const newQuantity = parseInt(params.newValue, 10);
          const oldQuantity = stock.currentStocks ;
        // Avoid recursion by checking if the value is actually different
        if (params.data.quantity !== newQuantity) {
          params.data.quantity = newQuantity;
          params.data.oldQuantity = oldQuantity;
          /*const stockIndex = stockOptions.findIndex(
            (stock) => stock.materialName === "ReadyToDispatchBricks"
          );
          if (stockIndex !== -1) {
            stockOptions[stockIndex].currentStocks = newQuantity;
          }*/
    
          /*params.node.setDataValue("quantity", newQuantity);
        }
    
        return true;
      }
      return false;*/
      valueSetter: (params) => {
        debugger;
        const stock = stockOptions.find(
          (stock) => stock.materialName === "ReadyToDispatchBricks"
        );
    
        if (stock) {
          debugger;
          const newQuantity = parseInt(params.newValue, 10); // Parse the new value
          const oldQuantity = stock.currentStocks;
    
          // Validate the input
          if (!isNaN(newQuantity) && newQuantity <= stock.currentStocks) {
            if (params.data.quantity !== newQuantity) {
              params.data.quantity = newQuantity; // Update the value
              params.data.oldQuantity = oldQuantity;
    
              params.node.setDataValue("quantity", newQuantity); // Update grid display
              
            }
            return true; // Indicate success
          } else {
            // Notify the user if the input exceeds the current stock
            alert(
              `The entered quantity (${newQuantity}) exceeds the available stock (${stock.currentStocks}).`
            );
            return false; // Reject the input
          }
        }
        return false; // Reject the input if stock is not found
      },
    },
     
  
    { headerName: "Rate", field: "rate", editable: !viewOnly , required: true,},
    /*{
      headerName: "Rate",
      field: "rate",
      editable: !viewOnly,
      required: true,
      valueSetter: (params) => {
        debugger;
        const { rowIndex, data } = params;
        // Update the rate
        updateAmount(rowIndex, data.rate, data.quantity); 
        return true;
      },
    },*/
    { headerName: "Per", field: "per", editable: false , required: true,},
    {
      headerName: "Amount",
      field: "amount",
      valueGetter: (params) => {
        const stock = stockOptions.find(
          (stock) => stock.materialName === "ReadyToDispatchBricks"
        );
        const quantity = params.data.quantity || (stock ? stock.currentStocks : 0);
        const rate = params.data.rate || 0;
        return quantity * rate; // Calculate the amount based on quantity and rate
      },
    },
    //{ headerName: "Amount", field: "amount", editable: !viewOnly, required: true,}
        
    
  ];
  
  const hsnsac = localStorage.getItem("hsnsac");


  // Handle row addition
  const handleAddRow = () => {
    if (!viewOnly) {
      
      const newRow = {
        sno: gridData.length + 1, // Use index-based ID (index + 1)
        descriptionofgoods: "",
        hsnsac: hsnsac,
        quantity: 0,
        rate:0,
        per:"Nos",
        amount:0

      };
      setGridData([...gridData, newRow]);
    }
  };
// Function to update the row dynamically
const updateAmount = (index, rate, quantity) => {
  debugger;
    const updatedGridData = [...gridData];
   /* updatedGridData[index].rate = parseFloat(rate) || 0;
    updatedGridData[index].quantity = parseFloat(quantity) || 0;
    updatedGridData[index].amount = updatedGridData[index].rate * updatedGridData[index].quantity;
  
    setGridData(updatedGridData); // Update grid data
    recalculateTaxableValue(updatedGridData); // Update taxable value*/
    const stock = stockOptions.find(
      (stock) => stock.materialName === "ReadyToDispatchBricks"
    );
  
    // If rate changes, calculate amount using current stock * rate
    if (rate) {
      updatedGridData[index].rate = parseFloat(rate) || 0;
      updatedGridData[index].amount =
        (stock ? stock.currentStocks : 0) * parseFloat(rate);
    }
  
    // If quantity changes, use the entered quantity to calculate the amount
    if (quantity) {
      updatedGridData[index].quantity = parseFloat(quantity) || 0;
      updatedGridData[index].amount =
        updatedGridData[index].rate * updatedGridData[index].quantity;
    }
  
    setGridData(updatedGridData); // Update grid data
    recalculateTaxableValue(updatedGridData); // Update taxable value
  };
  
  
  // Function to recalculate taxableValue
  const recalculateTaxableValue = (data) => {
    const total = data.reduce((sum, row) => sum + (row.amount || 0), 0);
    taxableValue = total; // Update taxableValue variable
    const quantitytotal = data.reduce((sum, row) => sum + (row.quantity || 0), 0);
    totalQty=quantitytotal;
    console.log("Taxable Value:", taxableValue);
  };
  
  // Event Handler for Cell Value Changes
  const handleCellValueChanged = (params) => {
    debugger;
    if (params.colDef.field === "rate" || params.colDef.field === "quantity" ) {
      const { rowIndex, data } = params;
      updateAmount(rowIndex, data.rate, data.quantity);
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
  const [saving, setSaving] = useState(false);

const onSubmitData = async (data) => {
  if (saving) return; 

  const hasEmptyFields = gridData.some((row) => {
    return Object.keys(row).some((key) => {
      const column = columns.find((col) => col.field === key);
      return column?.required && !row[key];
    });
  });

  if (hasEmptyFields) {
    alert("All fields in the grid are required.");
    return;
  }

  setSaving(true); 

  try {
    const formData = {
      ...data,
      goodsInformation: gridData,
      taxableValue: taxableValue,
      totalQty: totalQty,
    };

    if (onEditData) {
      await onUpdate({ ...onEditData, ...formData }); 
    } else {
      await onSave(formData); 
    }
  } catch (error) {
    console.error("Submit failed:", error);
  } finally {
    setSaving(false); 
  }
};


  const onClose = () => {
    onHide();
    reset();
    setGridData([]);
  };
  /*const handleDownload = async (userId) => {
    try {
        debugger;
        const response = await publicAxios.get(`${ApiKey.Billingreport}/${userId}`, {
            responseType: 'blob', // Ensure we receive the file as a blob
          });
          
          console.log(response, "res");
      
          // Ensure the correct MIME type for .docx files
          const blob = response.data;
          const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
      
          // Create a link element to trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${title}.docx`); // Specify the file name and extension
          document.body.appendChild(link);
          link.click(); // Trigger the download
      
          // Cleanup the URL object
          window.URL.revokeObjectURL(url);
        }
    catch (error) {
        console.error("Download failed:", error);
      }
    };*/
  /* useEffect(() => {
    if (onEditData) {
      reset();
      formItems.forEach((item) => {
        setValue(item.name, onEditData[item.name]);
      });

      // Set the grid data if available in onEditData
      setGridData(onEditData.goodsInformation || []);
    }
  }, [onEditData]);*/
  useEffect(() => {
    debugger;
    if (onEditData) {
      reset();
      formItems.forEach((item) => {
        setValue(item.name, onEditData[item.name]);
      });

      // Check if goodsInformation exists and is a string, then parse it into an array
      let gridgoodsInformation = [];
      try {
        // Parse goodsInformation if it's a string
        gridgoodsInformation = Array.isArray(onEditData?.goodsInformation)
          ? onEditData?.goodsInformation
          : JSON.parse(onEditData?.goodsInformation || "[]"); // Default to empty array if parsing fails
      } catch (error) {
        console.error("Error parsing goodsInformation:", error);
      }

      // Ensure the goodsInformation array is correctly populated
      setGridData(
        gridgoodsInformation.map((goodsInformation) => ({
            sno: goodsInformation.sno, // Ensure there's an id for each material
            descriptionofgoods: goodsInformation.descriptionofgoods,
            hsnsac: goodsInformation.hsnsac,
            rate: goodsInformation.rate,
          per: goodsInformation.per,
          quantity: goodsInformation.quantity || 0,
          amount:goodsInformation.amount // Set quantity to 0 if undefined
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
        <Modal.Title style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div>
            {viewOnly
              ? `View ${title}`
              : onEditData
              ? `Edit ${title}`
              : `Add ${title}`}
          </div>
          {/*{(viewOnly || onEditData) && (
            <Button
              variant="primary"
              size="sm"
              style={{ marginLeft: "auto" }}
              onClick={() => handleDownload(formItems?.id || onEditData?.id)}
            >
              Download
            </Button>
          )}*/}
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
                    if (!ruleMatched) return;
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
                  onCellValueChanged={handleCellValueChanged}
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
                <Button className="btn_dark" type="submit" disabled={saving}>
                {!!onEditData ? "Update" : "Save"}{" "}
               {saving && (
               <div className="spinner-border text-light" role="status"></div>
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
