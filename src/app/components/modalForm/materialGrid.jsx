import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const MaterialGrid = ({ materialData, setMaterialData }) => {
  const [gridApi, setGridApi] = useState(null);

  // Define columns for the material data
  const columns = [
    {
      headerName: "S No",
      field: "sNo",
      editable: false,
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    { headerName: "Material Name", field: "materialName", editable: true },
    { headerName: "Unit", field: "unit", editable: true },
    { headerName: "Available Qty", field: "quantity", editable: true, type: "numberColumn" },
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const addRow = () => {
    const newRow = { materialName: "New Item", unit: "", quantity: 1 };
    const updatedData = [...materialData, newRow];
    setMaterialData(updatedData);
    gridApi.setRowData(updatedData);
  };

  const removeSelectedRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    const updatedData = materialData.filter(row => !selectedRows.includes(row));
    setMaterialData(updatedData);
    gridApi.setRowData(updatedData);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 200, width: "100%" }}>
      <button onClick={addRow}>Add</button>
      <button onClick={removeSelectedRows}>Remove</button>
      <AgGridReact
        rowData={materialData}
        columnDefs={columns}
        rowSelection="single"
        onGridReady={onGridReady}
        suppressRowClickSelection={true}
      />
    </div>
  );
};

export default MaterialGrid;
