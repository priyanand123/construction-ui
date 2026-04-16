import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { json } from "react-router";

const AgGrid = ({ materialData, onMaterialDataChange, materialOptions, unitsOptions, onAddMaterial, onRemoveMaterial, onGridReady}) => {

  const [rowData, setRowData]=useState(materialData);
  const columnDefs = useMemo(() => [{
    headerName: "Id", // Serial Number column header
    valueGetter: "node.rowIndex + 1", // Adds 1 to make it 1-based instead of 0-based
    sortable: false,
    filter: false,
    width: 60,
  },
    {
      headerName: "Material",
      field: "materialId",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: materialOptions.map((material) => material.materialName),
      },
      valueGetter: (params) => {
        const material = materialOptions.find(
          (m) => m.id === params.data.materialId
        );
        return material ? material.materialName : "";
      },
      valueSetter: (params) => {
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
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: unitsOptions.map((unit) => unit.unit),
      },
      valueGetter: (params) => {
        const unit = unitsOptions.find(
          (u) => u.id === params.data.unitId
        );
        return unit ? unit.unit : "";
      },
      valueSetter: (params) => {
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
      editable: true,
    }
    // },
    // {
    //   headerName: "Actions",
    //   cellRendererFramework: (params) => (
    //     <button onClick={() => onRemoveMaterial(params.data.Id)}>
    //       Remove
    //     </button>
    //   ),
    // },
], [materialOptions, unitsOptions]);


  return (
    <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
      <button onClick={onAddMaterial}>Add Material</button>
      <button onClick={onRemoveMaterial}>Remove</button>
      <AgGridReact
        rowData={rowData}
        onGridReady={onGridReady}
        columnDefs={columnDefs}
        onCellValueChanged={({ data }) => onMaterialDataChange(data)}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default AgGrid;