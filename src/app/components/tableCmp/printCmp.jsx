import React, { useRef } from "react";
import { Modal } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";

const PrintCmp = (props) => {
  const { tableColumn, tableRows, filename } = props;
  const printTableRef = useRef(null);

  const handleprint = useReactToPrint({
    content: () => printTableRef.current,
    documentTitle:  filename,
    pageStyle: "print",
  });

  return (
    <>
      <button
        type="button"
        className="dt-button buttons-csv buttons-html5 btn btn-primary t_btn rounded-1 btn-sm my-1"
        onClick={handleprint}
      >
        <i class="fa fa-print"></i> Print
      </button>
      <PrintTable className="d-none">
        {/* <Modal show={false}> */}
        <div ref={printTableRef}>
          <h1 style={{ fontFamily: "GT-Walsheim" }}>{filename}</h1>
          <table className="w-100">
            <thead className="border border-0">
              <tr className=" border border-top-0 border-end-0 border-start-0">
                {tableColumn?.map((item, idx) => (
                  <td
                    className="p-2 fw-bold fs-6"
                    key={idx}
                    style={{ fontFamily: "GT-Walsheim" }}
                  >
                    {item}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows?.map((row, index) => (
                <tr
                  key={index}
                  className=" border border-top-0 border-end-0 border-start-0"
                >
                  {row?.map((item, idx) => (
                    <td
                      className="p-2 fs-6"
                      key={idx}
                      style={{ fontFamily: "GT-Walsheim" }}
                    >
                      {item}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* </Modal> */}
      </PrintTable>
    </>
  );
};

export default PrintCmp;

const PrintTable = styled.div`
  font-family: "GT-Walsheim" !important;
  thead,
  tr,
  td,
  th {
    font-family: "GT-Walsheim" !important;
  }
  thead tr td {
    min-width: 200px;
  }
`;
