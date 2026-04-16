import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import TableCmp from "../../app/components/tableCmp/tableCmp";
import UserMgmtPageHeader from "../../app/components/pageHeader/userMgmtPageHeader";
import { fetchMaterialHistoryList } from "../../app/redux/slices/materialhistory/materialhistoryslice";
import moment from "moment";
import {
  DropdownFilter,
  TextSearchFilter,
  ManufactureDropdownFilter,
} from "../../app/components/tableCmp/filters";
import { ApiKey } from "../../api/endpoints";

import { selectOptionsReq } from "../../api/dropdownApi/dropdownreq";

const MaterialHistory = () => {
  const dispatch = useDispatch();
  const { materialhistory } = useSelector((_state) => _state); 
  const [formattedData, setFormattedData] = useState(materialhistory?.data || []);
  const [dataLoading, setdataLoading] = useState(true);
  const [unitsOptions, setunitsOptions] = useState([]);

  // Monitor loading state of materialhistory to toggle dataLoading
  useEffect(() => {
    if (!materialhistory?.loading) setdataLoading(false);
  }, [materialhistory.loading]);

  const createData = async (formData) => {
    try {
      debugger;

      const dataBody = {
        id: formData?.id || 0,
        materialName: formData?.materialName || "",
        isManufacturingMaterial: formData?.isManufacturingMaterial || false,             
        createdBy: formData?.createdBy || "",
        //*createdDate: new Date(),
      };
    } catch (error) {
      console.error(error);
    }
  };

  // Update formatted data if materialhistory data changes
  useEffect(() => {
    if (materialhistory?.data?.length < 1) return;
    setFormattedData(materialhistory.data);
  }, [materialhistory.data]);

  useEffect(() => {
    debugger;
    setdataLoading(true);
    dispatch(fetchMaterialHistoryList());
    /*(async () => {
      try {
        debugger;
        const res = await selectOptionsReq(ApiKey.getUnits);
        setunitsOptions(res.data || []);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    })();*/
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
        Header: "Stock Status",
        accessor: "stockAddedOrUtilized",
        Filter: DropdownFilter,
      },
      {
        Header: "Stock Count",
        accessor: "stockAddedOrUtilizedCount",
        Filter: TextSearchFilter,
      },
      {
        Header: "Is Manufacturing Material",
        accessor: "isManufacturingMaterial",
        Cell: (props) => (props.value ? "True" : "False"),
        Filter: ManufactureDropdownFilter, // Attach the custom filter
        filter: "equals", // Specify the filter type

      },
    ],
    []
  );

  

  const configData = { masterTitle: "Material History" };

  return (
    <div className="main-content p-4 position-static">
      {dataLoading ? (
        <div className="table-loader">
          <div className="spinner-border text-primary"></div>
          <label className="mt-2">Loading...</label>
        </div>
      ) : (
        <>
          <UserMgmtPageHeader title="Material History" configData={configData} />
          <TableContainer className="bg-white px-3 py-2">
            <TableCmp tableData={formattedData} tableColumns={columns} configData={configData} />
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default MaterialHistory;

const TableContainer = styled.div``;
