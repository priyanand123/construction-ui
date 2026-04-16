import React from "react";
import styled from "styled-components";

const PageHeader = (props) => {
  const { configData, onAdd } = props;
  return (
    <MasterHeaderContainer className="border border-black d-flex flex-column px-3 py-2 rounded">
      <div className="d-flex flex-1 justify-content-between align-items-center">
        <div className="">
          <h4 className="card-title">{configData?.masterTitle}</h4>
        </div>
        <div className="">
          <button className="t_btn" onClick={onAdd}>
            + Add {configData?.masterTitle}
          </button>
        </div>
      </div>
    </MasterHeaderContainer>
  );
};

export default PageHeader;

const MasterHeaderContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.03);

  .card-title {
    color: #2a3042;
    font-size: 20px;
  }
`;
