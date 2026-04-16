import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { runAllTriggersReq } from "../../api/triggerApi/triggerListReq";
import { toast } from "react-toastify";

const PageHeader = ({
  title,
  addBtnLabel,
  dropdownValue,
  dropdownOptions,
  onSelect,
  onAdd,
  runTriggerBtn,
}) => {
  const [selectedOpt, setselectedOpt] = useState();
  const [trigerLoading, settrigerLoading] = useState(false);

  const runAllTriggersFun = async () => {
    try {
      // settrigerLoading(true);
      toast.success("Trigger execution process started successfully.");
      const res = await runAllTriggersReq();
      // settrigerLoading(false);
    } catch (error) {
      // toast.success(error?.errorMsg);
      // settrigerLoading(false);
    }
  };

  const changeDropDownVal = (val) => {
    setselectedOpt(val);
    onSelect(val);
  };

  return (
    <MasterHeaderContainer className="border border-black d-flex flex-column px-3 py-2 rounded">
      <div className="d-flex flex-1 justify-content-between align-items-center flex-wrap">
        <div className="">
          <h4 className="card-title heading_font">{title}</h4>
        </div>
        <div className="d-flex flex-wrap">
          {!!runTriggerBtn && (
            <div className="me-2">
              <button
                className="t_btn"
                onClick={runAllTriggersFun}
                disabled={!!trigerLoading}
              >
                Run All Triggers
                {trigerLoading && (
                  <div className="spinner-border text-white ms-2"></div>
                )}
              </button>
            </div>
          )}
          {!!addBtnLabel && (
            <div className="">
              <button className="t_btn" onClick={onAdd}>
                + Add {addBtnLabel}
              </button>
            </div>
          )}
        </div>
        {(dropdownValue === "" || dropdownValue) && (
          <div className="">
            <select
              class="form-select bg-transparent"
              aria-label="Default select example"
              value={selectedOpt}
              onChange={(e) => changeDropDownVal(e.target.value)}
              defaultValue={dropdownValue}
            >
              {dropdownOptions?.map((opt, idx) => (
                <option key={idx} value={opt?.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </MasterHeaderContainer>
  );
};

export default PageHeader;

const MasterHeaderContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.03);
  select {
    min-width: 180px;
    font-size: 15px;
    font-weight: 600;
  }
  .card-title {
    color: #2a3042;
    font-size: 20px;
  }
`;
