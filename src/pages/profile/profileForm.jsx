import React from "react";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";

const ProfileForm = ({ data, onEdit }) => {
  const {
    name,
    qualification,   
    aadharNo,
    labourType,
    roleName,
    userName,
    password,
    panNo,
    //regionCode,    
    mobileNo,
    emergencyNo,  
    address,
   
  } = data;

  return (
    <CardContainer className="card shadow">
      <div className="card-body">
        <div className="d-flex justify-content-between align-item-baseline">
          <div>
            <h4 className="card-title mb-4">Personal Information</h4>

            <p className="text-muted mb-4">
              Hi {name || ""}, here is where you can check out and update
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
                <th scope="row">Name:</th>
                <td>{name || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Qualification:</th>
                <td>{qualification || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Labour Type:</th>
                <td>{labourType || "-"}</td>
              </tr>
              {labourType==="Skilled" &&(
                <>
              <tr>
                <th scope="row">User Name:</th>
                <td>{userName || "-"}</td>
              </tr>
              {/*<tr>
                <th scope="row">Password:</th>
                <td>{password || "-"}</td>
              </tr>*/}
              <tr>
                <th scope="row">Role Name:</th>
                <td>{roleName || "-"}</td>
              </tr>
              </>
              )}
              <tr>
                <th scope="row">Aadhar No:</th>
                <td>{aadharNo || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Pan No:</th>
                <td>{panNo || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Phone (Primary):</th>
                <td>{mobileNo || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Emergency (Secondary):</th>
                <td>{emergencyNo || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Address:</th>
                <td>{address || "-"}</td>
              </tr>

             
            </tbody>
          </table>
        </div>
      </div>
    </CardContainer>
  );
};

export default ProfileForm;
const CardContainer = styled.div`
  font-family: "GT-Walsheim" !important;
  p,
  th,
  td {
    font-family: "GT-Walsheim" !important;
  }
`;
