import { Icon } from "@iconify/react";
import { matchSorter } from "match-sorter";
import React, { memo } from "react";
import { FaEdit, FaTrashAlt, FaEye,FaDownload } from "react-icons/fa";
import { publicAxios } from "../../../api/config.js";
import { ApiKey } from "../../../api/endpoints.js";
import TableCmpHeader from "./tableHeader";
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import styled from "styled-components";
import PaginationComp from "./paginationComp";

const TableCmp = ({
  tableColumns,
  tableData,
  configData,
  onDeleteRow,
  onEditRow,
  onView,
  viewable,
  editable,
  deleteable,
  hideDownloadBtns,
  hideSearchFilter,
  hideSerialNo,
  disablePagination, // Add the new prop here
  manualFilters,
  onColumnFilter,
  masterTitle
}) => {
console.log(masterTitle,"masterTitle") ;  
  const defaultColumn = React.useMemo(
    () => ({
      Filter: "",
    }),
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      rankedMatchSorter: (rows, id, filterValue) =>
        matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] }),
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    setcolumnFilter,
    visibleColumns,
    state,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, filters },
    setFilter,
    setAllFilters,
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: {
        pageIndex: 0,
        pageSize: disablePagination ? tableData.length : 10,
      }, // Set initial state conditionally
      defaultColumn,
      filterTypes,
      manualFilters: manualFilters,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const startIndex = pageIndex * pageSize + 1;
  const endIndex = Math.min((pageIndex + 1) * pageSize, rows.length);

  const globalSearchDebounce = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  React.useEffect(() => {
    if (!manualFilters || filters?.length < 1) return;
    const filtersWithKeys = filters.reduce((acc, filter) => {
      const column = tableColumns.find((col) => col.accessor === filter.id);
      if (column) {
        acc[column.filterKey] = filter.value;
      }
      return acc;
    }, {});
    onColumnFilter(filtersWithKeys);
    // alert(JSON.stringify(filtersWithKeys) + " " + filters?.length);
  }, [filters]);
 const fetchDownload = async (id) => {
    try {
        debugger;
        //const fileNames = fileName.split('|')[0];
        const response = await publicAxios.get(`${ApiKey.downloadDeliverychallan}/${id}`, {
            responseType: 'blob', // Ensure we receive the file as a blob
          });
          
          console.log(response, "res");
      
          // Ensure the correct MIME type for .docx files
          const blob = response.data;
        const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
          //const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute("download", "Delivery Challan" ); // Specify the file name (e.g., fileName.jpg)
          document.body.appendChild(link);
          link.click(); // Trigger the download
      
          // Cleanup the URL object
          window.URL.revokeObjectURL(url);
      
        
        }
    catch (error) {
        console.error("Download failed:", error);
      }
    };
  return (
    <TableContainer>
      <TableCmpHeader
        configData={configData}
        onPageSizeChange={(pz) =>
          tableData.length > 0 &&
          setPageSize(Number(pz === "All" ? tableData.length + 1 : pz))
        }
        onGlobalSearchChange={(val) => globalSearchDebounce(val)}
        displayedTableData={page.map((row) => row.original)}
        displayedPageData={page}
        column={headerGroups}
        tableDataChange={tableData}
        hideDownloadBtns={!!hideDownloadBtns}
        hideSearchFilter={!!hideSearchFilter}
      />
      <div className="table-responsive">
        <table
          {...getTableProps()}
          className="pageUp table table-striped dt-responsive nowrap w-100 dataTable no-footer dtr-inline mt-2"
          role="grid"
          id="data_datatable"
          aria-describedby="data_datatable_info"
        >
          <thead>
            {headerGroups.map((headerGroup, idx1) => (
              <tr key={idx1} role="row" {...headerGroup.getHeaderGroupProps()}>
                {!hideSerialNo && <th className="pb-0 border-bottom-0">#</th>}
                {headerGroup.headers.map((column, idx2) => (
                  <th
                    key={idx2}
                    className="pb-0 border-bottom-0"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div>
                      {column.render("Header")}{" "}
                      <span style={{ float: "right" }}>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <Icon icon="ph:arrow-up" />
                          ) : (
                            <Icon icon="ph:arrow-down" />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
            {headerGroups.map((headerGroup, idx1) => (
              <tr
                className=""
                key={idx1}
                role="row"
                {...headerGroup.getHeaderGroupProps()}
              >
                {!hideSerialNo && <th className="py-0"></th>}
                {headerGroup.headers.map((column, idx3) => (
                  <th key={idx3} className="py-0" {...column.getHeaderProps()}>
                    <div className="my-2">
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {page?.length === 0 ? (
            <tbody className="border-0">
              <tr className="border-0">
                <td colSpan={tableColumns.length + 2} className="border-0">
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="border-top-0" {...getTableBodyProps()}>
              {page?.map((row, i) => {
                prepareRow(row);

                return (
                  <tr {...row?.getRowProps()}>
                    {!hideSerialNo && <td>{`${startIndex + i}`}</td>}
                    {row.cells.map((cell) => (
                      <td className="text-black" {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                    {(!!editable || !!deleteable || !!viewable) && (
                      <td>
                        <div className="d-flex ">
                          {!!viewable && (
                            <span
                              onClick={() => onView(row.original)}
                              className="btn btn_dark me-4 px-2 py-1"
                            >
                              <FaEye color="#fff" size={13} />
                            </span>
                          )}
                          {!!editable && (
                            <span
                              onClick={() => onEditRow(row.original)}
                              className="btn btn_dark me-4 px-2 py-1"
                            >
                              <FaEdit color="#fff" size={14} />
                            </span>
                          )}
                          {masterTitle==="Delivery Challan"&& (
                            <span
                                                        onClick={() => fetchDownload(row.original.id)}
                                                        className="btn btn_dark me-4 px-2 py-1"
                                                      >
                                                        <FaDownload color="#fff" size={13} />
                                                      </span>
                          )}
                          {!!deleteable && (
                            <span
                              onClick={() => onDeleteRow(row.original)}
                              className="btn btn-danger px-2 py-1"
                            >
                              <FaTrashAlt color="#fff" size={12} />
                            </span>
                          )}
                          
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      {!disablePagination && ( // Conditionally render pagination
        <div className="table_header_div d-flex flex-md-row flex-column align-items-center mt-3">
          <span className="py-1">
            Showing{" "}
            <strong>
              {page?.length === 0 ? 0 : startIndex} to {endIndex}
            </strong>{" "}
            of {rows.length} entries
          </span>
          <div
            className="dataTables_paginate paging_simple_numbers "
            id="data_datatable_paginate"
          >
            <PaginationComp
              canPreviousPage={canPreviousPage}
              pageIndex={pageIndex}
              previousPage={previousPage}
              canNextPage={canNextPage}
              nextPage={nextPage}
              pageCount={pageCount}
              gotoPage={gotoPage}
            />
          </div>
        </div>
      )}
    </TableContainer>
  );
};

export default memo(TableCmp);

const TableContainer = styled.div`
  thead,
  tr,
  td,
  th {
    font-family: "GT-Walsheim" !important;
  }
  th:not(:first-child) {
    min-width: 150px;
  }
`;
