import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import TableCmp from "../../app/components/tableCmp/tableCmp";
import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";
import { fetchStockList } from "../../app/redux/slices/stock/stockslice";
import moment from "moment";
import {
  DropdownFilter,
  TextSearchFilter,
  ManufactureDropdownFilter
} from "../../app/components/tableCmp/filters";


const Stock = () => {
  const dispatch = useDispatch();
  const { stock } = useSelector((_state) => _state); 
  const [formattedData, setFormattedData] = useState(stock?.data || []);
  const [dataLoading, setdataLoading] = useState(true);

  // Monitor loading state of stock to toggle dataLoading
  useEffect(() => {
    if (!stock?.loading) setdataLoading(false);
  }, [stock.loading]);

  // Update formatted data if stock data changes
  useEffect(() => {
    if (stock?.data?.length < 1) return;
    setFormattedData(stock.data);
  }, [stock.data]);

  

  useEffect(() => {
     
    if (stock?.data?.length < 1) return;
    setFormattedData(stock.data);
  }, [stock.data]);

  useEffect(() => {
    setdataLoading(true);
    dispatch(fetchStockList());
   
    
  }, []);

  

  const columns = React.useMemo(
    () => [
      {
        Header: "Material Name",
        accessor: "materialName",
        Filter: TextSearchFilter,
      },
      {
        Header: "Is Manufacturing Material",
        accessor: "isManufacturingMaterial",
         Cell: (props) => (props.value ? "True" : "False"),
                Filter: ManufactureDropdownFilter, // Attach the custom filter
                filter: "equals", // Specify the filter type

      },
      {
        Header: "Unit",
        accessor: "unit",
        Filter: DropdownFilter,

      },
      {
        Header: "Current Stock",
        accessor: "currentStocks",
        Filter: TextSearchFilter,

      },
      
    ],
    []
  );
   const configData = { masterTitle: "Stock" };

  return (
    <div className="main-content p-4 position-static">
      {dataLoading ? (
        <div className="table-loader">
          <div className="spinner-border text-primary"></div>
          <label className="mt-2">Loading...</label>
        </div>
      ) : (
        <>
          <UserMgmtPageHeader title="Stock" configData={configData} />
          <TableContainer className="bg-white px-3 py-2">
            <TableCmp tableData={formattedData} tableColumns={columns} configData={configData} />
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default Stock;

const TableContainer = styled.div``;
