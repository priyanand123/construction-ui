import React from "react";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";

const CompancyDetails = ({ data, onEdit }) => {
  const {
    companyName,
    address,   
    manufacturersOf,
    mobileNo1,
    mobileNo2,
    email,
    website,
    gstin,
    bankName,    
    accountHolderName,
    accountNo,  
    branch,
    ifseCode,
    upiId1,
    upiId2,
    cgstPercentage,
    sgstOrUtgstPercentage,
    hsnsac
  } = data;

  return (
    <CardContainer className="card shadow">
      <div className="card-body">
        <div className="d-flex justify-content-between align-item-baseline">
          <div>
            <h4 className="card-title mb-4">Company Information</h4>

            <p className="text-muted mb-4">
              Hi {companyName || ""}, here is where you can check out and update
              your profile.{" "}
            </p>
          </div>
          <div>
            <button
              className="btn btn-dark text-white"
              onClick={() => onEdit(data)}
            >
              <FaEdit color="#fff" size={14} /> Edit
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <tbody>
              <tr>
                <th scope="row">Company Name:</th>
                <td>{companyName || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Address:</th>
                <td>{address || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Manufacturers Of:</th>
                <td>{manufacturersOf || "-"}</td>
              </tr>
              
              <tr>
                <th scope="row">Mobile No:</th>
                <td>{mobileNo1 || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Secondary Mobile No:</th>
                <td>{mobileNo2 || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Email:</th>
                <td>{email || "-"}</td>
              </tr>
             
              <tr>
                <th scope="row">Website:</th>
                <td>{website || "-"}</td>
              </tr>
              <tr>
                <th scope="row">GST IN:</th>
                <td>{gstin || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Bank Name:</th>
                <td>{bankName || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Account Holder Name:</th>
                <td>{accountHolderName || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Account Number:</th>
                <td>{accountNo || "-"}</td>
              </tr>

             
              <tr>
                <th scope="row">Branch:</th>
                <td>{branch || "-"}</td>
              </tr>
              <tr>
                <th scope="row">IFSC CODE:</th>
                <td>{ifseCode || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Primary UPI Id:</th>
                <td>{upiId1 || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Secondary UPI Id:</th>
                <td>{upiId2 || "-"}</td>
              </tr>
              <tr>
                <th scope="row">CGST Percentage:</th>
                <td>{cgstPercentage || "-"}</td>
              </tr>
              <tr>
                <th scope="row">SGST/ UTGST Percentage:</th>
                <td>{sgstOrUtgstPercentage || "-"}</td>
              </tr>
              <tr>
                <th scope="row">HSN/SAC:</th>
                <td>{hsnsac || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CardContainer>
  );
};

export default CompancyDetails;
const CardContainer = styled.div`
  font-family: "GT-Walsheim" !important;
  p,
  th,
  td {
    font-family: "GT-Walsheim" !important;
  }
`;
