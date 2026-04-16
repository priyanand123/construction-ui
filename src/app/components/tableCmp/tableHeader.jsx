import dayjs from "dayjs";
import React, { memo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { clipBoardDataFormat, exportToExcel, exportToPdf } from "./_functions";
import PrintTableCmp from "./printCmp";
import moment from "moment";

const TableCmpHeader = (props) => {
  const {
    configData,
    onPageSizeChange,
    onGlobalSearchChange,
    displayedPageData,
    column,
    tableDataChange,
    hideDownloadBtns,
    hideSearchFilter,
  } = props;

  const [pageSize, setpageSize] = useState(10);
  const [globalSearchText, setglobalSearchText] = useState("");
  const [displayedRows, setdisplayedRows] = useState(null);
  const [displayedColumn, setdisplayedColumn] = useState(null);

  const onPageSizeChangeFun = (e) => {
    setpageSize(e.target.value);
    onPageSizeChange(e.target.value);
  };

  const onGlobalSearch = (e) => {
    setglobalSearchText(e.target.value);
  };

  const clipBoardData =
    displayedRows &&
    displayedColumn &&
    clipBoardDataFormat(displayedColumn, displayedRows);

  const dataFormater = () => {
    const displayedData = displayedPageData.map((row, rowIndex) =>
      [rowIndex + 1].concat(
        row.cells.map((cell) => {
          const dateRegex =
            /^(\d{4})[-/](\d{2})[-/](\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;
          if (dateRegex.test(cell.value)) {
            const formattedDate = dayjs(cell.value).format("DD/MM/YYYY");
            const formattedTime = moment
              .utc(cell.value)
              .local()
              .format("hh:mm:ss");
            const timeIsNotMidnight = formattedTime !== "12:00:00";
            return timeIsNotMidnight
              ? `${formattedDate} ${formattedTime}`
              : formattedDate;
          }
          return cell.value;
        })
      )
    );

    const displayedColumns = column.map((headerGroup) =>
      headerGroup.headers.map((column) => column.render("Header"))
    );
    console.log("Displayed Data:", displayedData);
    console.log("Displayed Columns:", displayedColumns);
    setdisplayedRows([...displayedData]);
    setdisplayedColumn(["#", ...displayedColumns[0]]);
  };

  React.useEffect(() => {
    dataFormater();
  }, [displayedPageData]);

  React.useEffect(() => {
    if (!globalSearchText) return;
    setglobalSearchText("");
  }, [tableDataChange]);

  React.useEffect(() => {
    onGlobalSearchChange(globalSearchText);
  }, [globalSearchText]);

  return (
    <TableHeaderContainer className="d-flex flex-column ">
      <div
        className={`${
          hideSearchFilter ? "d-none" : "d-flex"
        }  flex-row flex-grow-1`}
      >
        <div>
          <label className="">Show</label>
          <select
            className="select"
            value={pageSize}
            onChange={onPageSizeChangeFun}
          >
            {[10, 20, 50, 100, "All"].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex flex-1 flex-grow-1"></div>
        <div className="ms-2">
          <label>Search</label>
          <input
            className="form-control"
            type="text"
            value={globalSearchText}
            onChange={onGlobalSearch}
          />
        </div>
      </div>

     <div
        className={`${
          hideDownloadBtns ? "d-none" : "d-flex"
        } d-flex mt-1 action_btn_block flex-wrap`}
      >
        <div className=" m-1">
          <CopyToClipboard text={clipBoardData}>
            <button type="button" className="t_btn rounded-1 btn-sm my-1">
              <i class="fa fa-copy"></i> Copy
            </button>
          </CopyToClipboard>
        </div>
        <div className=" m-1">
          <button
            type="button"
            className="t_btn rounded-1 btn-sm my-1"
            onClick={() =>
              exportToExcel(displayedColumn, displayedRows, configData.masterTitle)
            }
          >
            <i class="fa fa-file-excel-o"></i> Excel
          </button>
        </div>
        <div className=" m-1">
          <button
            type="button"
            className="t_btn rounded-1 btn-sm my-1"
            onClick={() =>
              exportToPdf(displayedColumn, displayedRows, configData.masterTitle)
            }
          >
            <i class="fa fa-file-pdf-o"></i> Pdf
          </button>
        </div>
        <div className=" m-1">
          {displayedRows instanceof Array && (
            <CSVLink
              className=" btn btn-primary t_btn rounded-1 btn-sm my-1"
              filename={`${configData?.masterTitle}`}
              data={[displayedColumn, ...displayedRows]}
            >
              <i class="fa fa-print"></i> CSV
            </CSVLink>
          )}
        </div>
        <div className=" m-1">
          <PrintTableCmp
            tableColumn={displayedColumn}
            tableRows={displayedRows}
            filename={configData?.masterTitle}
          />
        </div>
      </div>
    </TableHeaderContainer>
  );
};

export default memo(TableCmpHeader);

const TableHeaderContainer = styled.div`
  .select {
    border-radius: 0.2rem;
    min-width: 80px;
    display: block;
    padding: 0.47rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .form-control {
    min-width: 80px;
  }
  .action_btn_block button {
    font-size: 0.71094rem;
  }
  .t_btn {
    background-color: #2a3042;
    border: 0px;
    outline: none;
  }
  .t_btn:hover {
    background-color: #1f95eb;
  }
`;
