import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routePath } from "../../routes/routepath";
import { Spinner } from "react-bootstrap"; 
import { publicAxios } from "../../../api/config.js";
import { ApiKey } from "../../../api/endpoints.js";
const PdfViewerPage = () => {
 
    const [isChecked, setIsChecked] = useState(true); // Initially, checkbox is checked
  const [isLoading, setIsLoading] = useState(false); 
    const location = useLocation();
    const { pdfFile,userId } = location.state || {};
    const navigate = useNavigate();
   console.log(pdfFile,"pdffile");
   const [WithoutGstpdfFile, setWithoutGstpdfFile] = useState(null); 
   
  
    const handleCheckboxChange = async (event) => {
      debugger;
      setIsChecked(event.target.checked); // Update checkbox state
  
      if (!event.target.checked) {
        setIsLoading(true); // Start loading state
        try {
          // Call your API here
          const response = await publicAxios.get(`${ApiKey.BillingWithoutgstreport}/${userId}`, {
            responseType: "blob",
          });// Replace with your actual API call
  
          // Create a Blob URL for the PDF file
          const url = URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
          );
  
          setWithoutGstpdfFile(url); // Set the PDF URL
        } catch (error) {
          console.error("Failed to fetch document:", error);
        } finally {
          setIsLoading(false); // End loading state
        }
      }
    };

    if (!pdfFile) {
      return (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontWeight: 'bold',
            fontSize: '24px',
            textAlign: 'center',
          }}
        >
          No PDF file found. Please go back and try again.
        </div>
      );
    }
    const handlePrint = () => {
      navigate("/main/billing");
    };
  
    return (
      <div style={{ padding: "20px", maxHeight:"700px", fontFamily: "Arial, sans-serif" }}>

         {/* Show loading spinner when API call is in progress */}
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
        {/* PDF Viewer */}
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            maxHeight: "700px",
            overflow: "auto",
          }}
        >
          <embed src={pdfFile} type="application/pdf" width="100%" height="500px" />
       {/* Conditionally display the correct PDF */}
       {/*{isChecked ? (
          <embed src={pdfFile} type="application/pdf" width="100%" height="500px" />
        ) : (
          WithoutGstpdfFile && <embed src={WithoutGstpdfFile} type="application/pdf" width="100%" height="500px" />
        )}
        </div>
  
        
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
    <input 
      type="checkbox" 
      checked={isChecked}
      onChange={handleCheckboxChange} // Ensures the checkbox is checked by default
      style={{ marginRight: "10px" }} 
    />
    With GST
  </label>*/}
          <button
            onClick={handlePrint}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  };
  export default PdfViewerPage;