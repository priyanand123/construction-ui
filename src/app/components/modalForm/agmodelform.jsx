import React, { memo, useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
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
    materialOptions,
    unitsOptions,
    stockOptions,
  } = props;

  const [showMediaModal, setshowMediaModal] = useState(false);
  const [mediaDataIs, setmediaDataIs] = useState("");
  const [loading, setloading] = useState(false);
  const [gridData, setGridData] = useState([]);

  const gridApi = useRef(null);
  const gridColumnApi = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
    value,
    onChange,
  } = useForm({
    defaultValues: formItems.reduce((acc, item) => {
      if (item.defaultValue) {
        acc[item.name] = item.defaultValue;
      }
      return acc;
    }, {}),
  });

  const navigate = useNavigate();

  // ============================================================
  // AG GRID COLUMNS
  // ============================================================

  const columns = [
    // ==========================================================
    // ID
    // ==========================================================
    {
      headerName: "Id",
      field: "id",
      editable: !viewOnly,
      required: true,
    },

    // ==========================================================
    // MATERIAL
    // ==========================================================
    {
      headerName: "Material",
      field: "materialId",
      editable: !viewOnly,
      required: true,

      cellEditor: "agSelectCellEditor",

      cellEditorParams: {
        values: materialOptions
          .filter(
            (material) =>
              !material.isManufacturingMaterial
          )
          .map(
            (material) =>
              material.materialName
          ),
      },

      valueGetter: (params) => {
        const material =
          materialOptions.find(
            (m) =>
              Number(m.id) ===
              Number(params.data.materialId)
          );

        return material
          ? material.materialName
          : "";
      },

      valueSetter: (params) => {
        if (viewOnly) {
          return false;
        }

        const selectedMaterial =
          materialOptions.find(
            (material) =>
              material.materialName ===
              params.newValue
          );

        if (selectedMaterial) {
          params.data.materialId =
            selectedMaterial.id;

          params.data.materialName =
            selectedMaterial.materialName;

          params.data.unitId =
            selectedMaterial.unitId;

          params.data.unit =
            selectedMaterial.unit;

          /*
           * IMPORTANT:
           *
           * When a material is selected,
           * get its current stock.
           *
           * Example:
           *
           * Cement stock = 245
           * Mettur Ash stock = 46431
           *
           * The Quantity column will display
           * this stock automatically.
           */

          const materialStock =
            stockOptions.find(
              (stock) =>
                Number(stock.materialId) ===
                Number(selectedMaterial.id)
            );

          if (materialStock) {
            params.data.quantity =
              Number(
                materialStock.currentStocks
              );
          } else {
            params.data.quantity = null;
          }

          return true;
        }

        return false;
      },
    },

    // ==========================================================
    // UNIT
    // ==========================================================
    {
      headerName: "Unit",
      field: "unitId",
      editable: !viewOnly,
      required: true,

      cellEditor: "agSelectCellEditor",

      cellEditorParams: {
        values: unitsOptions.map(
          (unit) => unit.unit
        ),
      },

      valueGetter: (params) => {
        const unit =
          unitsOptions.find(
            (u) =>
              Number(u.id) ===
              Number(params.data.unitId)
          );

        return unit ? unit.unit : "";
      },

      valueSetter: (params) => {
        if (viewOnly) {
          return false;
        }

        const selectedUnit =
          unitsOptions.find(
            (unit) =>
              unit.unit === params.newValue
          );

        if (selectedUnit) {
          params.data.unitId =
            selectedUnit.id;

          params.data.unit =
            selectedUnit.unit;

          return true;
        }

        return false;
      },
    },

    // ==========================================================
    // QUANTITY
    // ==========================================================
    {
      headerName: "Quantity",
      field: "quantity",
      editable: !viewOnly,
      required: true,

      // --------------------------------------------------------
      // DISPLAY QUANTITY
      // --------------------------------------------------------
      valueGetter: (params) => {
        const material =
          stockOptions.find(
            (m) =>
              Number(m.materialId) ===
              Number(params.data.materialId)
          );

        /*
         * If quantity already exists,
         * display that quantity.
         */
        if (
          params.data.quantity !==
          undefined &&
          params.data.quantity !== null &&
          params.data.quantity !== ""
        ) {
          return Number(
            params.data.quantity
          );
        }

        /*
         * If quantity is empty,
         * display current stock.
         */
        return material
          ? Number(
            material.currentStocks
          )
          : 0;
      },

      // --------------------------------------------------------
      // VALIDATE QUANTITY
      // --------------------------------------------------------
      valueSetter: (params) => {
        if (viewOnly) {
          return false;
        }

        // Convert entered quantity to number
        const newQuantity =
          Number(params.newValue);

        // Find stock for selected material
        const material =
          stockOptions.find(
            (m) =>
              Number(m.materialId) ===
              Number(params.data.materialId)
          );

        console.log(
          "=============================="
        );

        console.log(
          "Entered Quantity:",
          params.newValue
        );

        console.log(
          "New Quantity Number:",
          newQuantity
        );

        console.log(
          "Selected Material ID:",
          params.data.materialId
        );

        console.log(
          "Stock Object:",
          material
        );

        console.log(
          "Available Stock:",
          material?.currentStocks
        );

        console.log(
          "Available Stock Number:",
          Number(
            material?.currentStocks
          )
        );

        console.log(
          "=============================="
        );

        // ------------------------------------------------------
        // STOCK NOT FOUND
        // ------------------------------------------------------
        if (!material) {
          alert(
            "Stock information not found for the selected material."
          );

          return false;
        }

        // ------------------------------------------------------
        // AVAILABLE STOCK
        // ------------------------------------------------------
        const availableStock =
          Number(
            material.currentStocks
          );

        // ------------------------------------------------------
        // INVALID NUMBER
        // ------------------------------------------------------
        if (
          Number.isNaN(newQuantity)
        ) {
          alert(
            "Please enter a valid quantity."
          );

          return false;
        }

        // ------------------------------------------------------
        // NEGATIVE QUANTITY
        // ------------------------------------------------------
        if (newQuantity < 0) {
          alert(
            "Quantity cannot be negative."
          );

          return false;
        }

        // ------------------------------------------------------
        // EXCEEDS STOCK
        //
        // IMPORTANT:
        //
        // Use > here.
        //
        // 245 <= 245  = allowed
        // 244 <= 245  = allowed
        // 243 <= 245  = allowed
        // 246 > 245   = rejected
        //
        // Same:
        //
        // 46431 <= 46431 = allowed
        // ------------------------------------------------------
        if (
          newQuantity >
          availableStock
        ) {
          alert(
            `The entered quantity (${newQuantity}) exceeds the available stock (${availableStock}).`
          );

          return false;
        }

        // ------------------------------------------------------
        // VALID QUANTITY
        // ------------------------------------------------------
        params.data.quantity =
          newQuantity;

        return true;
      },
    },
  ];

  // ============================================================
  // ADD MATERIAL ROW
  // ============================================================

  const handleAddRow = () => {
    if (!viewOnly) {
      const newRow = {
        id: gridData.length + 1,

        materialName: "",
        materialId: null,

        unit: "",
        unitId: null,

        /*
         * IMPORTANT:
         *
         * Use null instead of 0.
         *
         * This allows the Quantity column
         * to display the selected material's
         * available stock.
         */
        quantity: null,
      };

      setGridData([
        ...gridData,
        newRow,
      ]);
    }
  };

  // ============================================================
  // DELETE MATERIAL ROW
  // ============================================================

  const handleDeleteRow = () => {
    if (
      !viewOnly &&
      gridApi.current
    ) {
      const selectedNodes =
        gridApi.current.getSelectedNodes();

      if (
        selectedNodes.length > 0
      ) {
        const selectedData =
          selectedNodes.map(
            (node) => node.data
          );

        const updatedData =
          gridData.filter(
            (item) =>
              !selectedData.includes(
                item
              )
          );

        gridApi.current.applyTransaction(
          {
            remove: selectedData,
          }
        );

        setGridData(
          updatedData
        );
      } else {
        alert(
          "Please select a row to delete."
        );
      }
    } else {
      alert(
        "Grid API not available."
      );
    }
  };

  // ============================================================
  // GRID READY
  // ============================================================

  const onGridReady = (params) => {
    gridApi.current =
      params.api;

    gridColumnApi.current =
      params.columnApi;

    if (viewOnly) {
      params.api.forEachNode(
        (node) => {
          node.setRowSelectable(
            false
          );
        }
      );
    }
  };

  // ============================================================
  // MODAL SHOW
  // ============================================================

  const onShowModal = () => {
    debugger;

    if (!onEditData) {
      reset();
    }

    setloading(false);

    /*
     * Don't clear existing edit data here.
     */
    if (!onEditData) {
      setGridData([]);
    }
  };

  // ============================================================
  // MEDIA
  // ============================================================

  const openMedia = (data) => {
    setshowMediaModal(true);
    setmediaDataIs(data);
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const onSubmitData = (data) => {
    setloading(true);

    // ----------------------------------------------------------
    // Check required grid fields
    // ----------------------------------------------------------

    const hasEmptyFields =
      gridData.some((row) => {
        return Object.keys(row).some(
          (key) => {
            const column =
              columns.find(
                (col) =>
                  col.field === key
              );

            return (
              column?.required &&
              (
                row[key] ===
                undefined ||
                row[key] === null ||
                row[key] === ""
              )
            );
          }
        );
      });

    if (hasEmptyFields) {
      setloading(false);

      alert(
        "All fields in the grid are required."
      );

      return;
    }

    // ----------------------------------------------------------
    // Add grid data to form
    // ----------------------------------------------------------

    const formData = {
      ...data,
      materialData:
        gridData,
    };

    // ----------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------

    if (onEditData) {
      onUpdate({
        ...onEditData,
        ...formData,
      });
    }

    // ----------------------------------------------------------
    // SAVE
    // ----------------------------------------------------------

    else {
      onSave(formData);
    }
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const onClose = () => {
    debugger;

    onHide();

    reset();

    setGridData([]);
  };

  // ============================================================
  // LOAD EDIT DATA
  // ============================================================

  useEffect(() => {
    debugger;

    if (onEditData) {
      reset();

      // Set form fields
      formItems.forEach(
        (item) => {
          setValue(
            item.name,
            onEditData[
            item.name
            ]
          );
        }
      );

      let gridMaterialData =
        [];

      try {
        gridMaterialData =
          Array.isArray(
            onEditData?.materialData
          )
            ? onEditData?.materialData
            : JSON.parse(
              onEditData?.materialData ||
              "[]"
            );
      } catch (error) {
        console.error(
          "Error parsing materialData:",
          error
        );
      }

      // --------------------------------------------------------
      // Restore material grid
      // --------------------------------------------------------

      setGridData(
        gridMaterialData.map(
          (material) => ({
            id: material.id,

            materialId:
              material.materialId,

            materialName:
              material.materialName,

            unitId:
              material.unitId,

            unit:
              material.unit,

            quantity:
              material.quantity !==
                undefined &&
                material.quantity !==
                null
                ? Number(
                  material.quantity
                )
                : null,
          })
        )
      );
    }
  }, [
    onEditData,
    formItems,
    reset,
    setValue,
  ]);

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <>
      <Modal
        show={
          show &&
          !showMediaModal
        }
        onHide={onClose}
        onShow={onShowModal}
        backdrop="static"
        keyboard={false}
        centered
        size={
          size
            ? size
            : "lg"
        }
      >
        {/* ======================================================
            MODAL HEADER
        ====================================================== */}

        <Modal.Header
          closeButton
        >
          <Modal.Title>
            {viewOnly
              ? `View ${title}`
              : onEditData
                ? `Edit ${title}`
                : `Add ${title}`}
          </Modal.Title>
        </Modal.Header>

        {/* ======================================================
            MODAL BODY
        ====================================================== */}

        <Modal.Body>
          <ModalFormContainer
            onSubmit={handleSubmit(
              onSubmitData
            )}
          >
            <div
              className="modal-body"
              id="load_add_form"
            >
              {/* =================================================
                  NORMAL FORM FIELDS
              ================================================= */}

              <div className="row">
                {formItems.map(
                  (item, idx) => {
                    if (
                      !!item?.dynamicField &&
                      item?.dynamicRules &&
                      item?.dynamicRules
                        ?.length > 0
                    ) {
                      let ruleMatched;

                      item?.dynamicRules?.forEach(
                        (rule) => {
                          const formValue =
                            watch(
                              rule.filedName
                            );

                          ruleMatched =
                            formValue ==
                            rule.value;
                        }
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className={
                          item?.className &&
                          item?.className
                        }
                      >
                        <RenderIf
                          isShow={
                            item.type !==
                            "checkbox"
                          }
                        >
                          <label
                            htmlFor={
                              item.name
                            }
                            className="requiredField"
                          >
                            {item.label}

                            {!!item.required && (
                              <span className="asteriskField">
                                *
                              </span>
                            )}
                          </label>
                        </RenderIf>

                        <DynamicFieldsBlock
                          item={item}
                          errors={errors}
                          viewOnly={
                            viewOnly
                          }
                          roleBaseDisable={
                            roleBaseDisable
                          }
                          register={
                            register
                          }
                          watch={watch}
                          openImage={(
                            mediaData
                          ) =>
                            openMedia(
                              item
                            )
                          }
                          control={
                            control
                          }
                          value={
                            value || ""
                          }
                          onChange={
                            onChange
                          }
                        />

                        {errors[
                          item.name
                        ] && (
                            <p
                              style={{
                                color:
                                  "red",
                              }}
                            >
                              {
                                errors[
                                  item.name
                                ].message
                              }
                            </p>
                          )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* =================================================
                  MATERIAL BUTTONS
              ================================================= */}

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  marginTop:
                    "10px",
                  marginBottom:
                    "10px",
                  alignItems:
                    "center",
                }}
              >
                <Button
                  variant="primary"
                  onClick={
                    handleAddRow
                  }
                  style={{
                    marginRight:
                      "3px",
                  }}
                  disabled={
                    viewOnly
                  }
                >
                  Add Material
                </Button>

                <Button
                  variant="primary"
                  onClick={
                    handleDeleteRow
                  }
                  style={{
                    marginRight:
                      "3px",
                  }}
                  disabled={
                    viewOnly
                  }
                >
                  Delete Material
                </Button>
              </div>

              {/* =================================================
                  MATERIAL GRID
              ================================================= */}

              <div
                className="ag-theme-alpine"
                style={{
                  height: 400,
                  width: "100%",
                }}
              >
                <AgGridReact
                  onGridReady={
                    onGridReady
                  }
                  columnDefs={
                    columns
                  }
                  rowData={
                    gridData
                  }
                  domLayout="autoHeight"
                  rowSelection={
                    viewOnly
                      ? "none"
                      : "multiple"
                  }
                  suppressRowClickSelection={
                    viewOnly
                  }
                  editable={
                    !viewOnly
                  }
                  pagination={
                    false
                  }
                />
              </div>
            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <RenderIf
              isShow={
                !viewOnly
              }
            >
              <div className="modal-footer">
                <Button
                  className="btn btn-light"
                  onClick={
                    onClose
                  }
                >
                  Cancel
                </Button>

                <Button
                  className="btn_dark"
                  type="submit"
                >
                  {!!onEditData
                    ? "Update"
                    : "Save"}

                  {loading && (
                    <div
                      className="spinner-border text-light"
                      role="status"
                    ></div>
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

export default memo(
  ModalForm
);

// ============================================================
// STYLES
// ============================================================

const ModalFormContainer =
  styled.form`
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