import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useDispatch } from "react-redux";
//import { fileUploadConfigReq } from "../../api/uploadsApi/configReq";
//import { downloadSampleFileFormatReq } from "../../api/uploadsApi/sampleFileFormatReq";
/*import {
  uploadFileReq,
  uploadFileStatusReq,
} from "../../api/uploadsApi/uploadfilesReq";*/
//import { excelFileValidation } from "../../constants/excelFileValidation";
//import ProgressModal from "../uploadCmp/progressModal";

const UserMgmtPageHeader = ({ onAdd, configData, onValidation, title }) => {
  const dispatch = useDispatch();
  const masterName = configData?.masterTitle;
  const fileName = configData?.fileName;
  const fileInputRef = useRef();
  const progressToastId = useRef(null);

  const [progressBarVal, setprogressBarVal] = useState(0);
  const [showProgress, setshowProgress] = useState(false);
  const [errorInUpload, seterrorInUpload] = useState();
  const [statusData, setstatusData] = useState([
    {
      uploadId: "",
      taskId: 1,
      taskName: "File Upload",
      status: "Success",
      isCompleted: false,
      percentCompleted: 0,
    },
  ]);

  const [userValidationConfig, setuserValidationConfig] = useState([]);

  const showChoosefile = () => {
    fileInputRef.current.click();
    fileInputRef.current.value = "";
  };

  const downloadSampleFile = async () => {
    try {
      // await downloadSampleFileFormatReq("users");
    } catch (error) { }
  };

  /* const handelFile = (e) => {
     const fileTypes = [
       "text/csv",
       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
       "application/vnd.ms-excel",
     ];
 
     let selectedFile = e.target.files[0];
     let nameOfFile = e.target.files[0]?.name || "";
     if (selectedFile) {
       // if (fileName + ".csv" !== nameOfFile)
       //   return toast.error(`Please select ${fileName}.csv file`);
       if (selectedFile && fileTypes.includes(selectedFile.type)) {
         let reader = new FileReader();
         reader.readAsArrayBuffer(selectedFile);
         reader.onload = async (evt) => {
           const validFile = excelFileValidation(
             evt.target.result,
             userValidationConfig,
             false
           );
           if (!validFile) return onValidation(false);
           if (validFile) return uploadFile(e.target.files);
         };
       } else {
         toast.error("Please select valid file types");
       }
     } else {
       toast.error("Please select the file");
     }
   };*/

  /* const uploadFile = async (files) => {
     setshowProgress(true);
     progressToastId.current = toast.warn(
       `${masterName} file upload in progress`
     );
     let AllFiles = [...files];
     console.log(AllFiles, "AllFiles to upload");
     const formData = new FormData();
     formData.append("FormFile", AllFiles[0]);
     formData.append("UploadType", "Users");
 
     try {
       const res = await uploadFileReq(formData);
       seterrorInUpload(false);
       if (!res?.data?.uploadId) throw new Error("No uploadId present");
       getUploadStatusFun(res?.data?.uploadId);
       const _res = await uploadFileStatusReq(res?.data?.uploadId);
       setstatusData(_res?.data);
     } catch (error) {
       seterrorInUpload(true);
       toast.dismiss(progressToastId.current);
 
       toast.error(`${masterName} failed to upload`);
       hideProgressWindow();
     }
   };*/

  /*const getUploadStatusFun = (uploadId) => {
    const timerId = setInterval(() => {
      (async () => {
        try {
          const res = await uploadFileStatusReq(uploadId);
          let totalProgress = 0;
          res?.data?.forEach(
            (item) =>
              (totalProgress = totalProgress + Number(item?.percentCompleted))
          );
          setprogressBarVal(totalProgress / res?.data?.length);
          setstatusData(res?.data);
          if (!res?.data || !res?.data[0] || res?.data[0]?.isCompleted) {
            clearInterval(timerId);
            toast.dismiss(progressToastId.current);
            hideProgressWindow();
            if (!res?.data || !res?.data[0])
              toast.warn("File will be uploaded in sometime");
          }
        } catch (error) {
          clearInterval(timerId);
          seterrorInUpload(true);
          toast.dismiss(progressToastId.current);
          hideProgressWindow();
        }
      })();
    }, 5000);
  };*/

  const hideProgressWindow = () => {
    setTimeout(() => {
      setshowProgress(false);
    }, 1500);
  };

  /*useEffect(() => {
    (async () => {
      try {
        const res = await fileUploadConfigReq("Users", "Users");
        const dataModify = res?.data?.map((item) => ({
          key: item?.displayColumnName,
          type: item?.columnType,
          required: item?.isRequired,
          maxLength: item?.maxLength,
          columnIndex: item?.columnIndex,
        }));
        setuserValidationConfig(dataModify);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
*/
  return (
    <MasterHeaderContainer className="border border-black d-flex flex-column px-3 py-2 rounded">
      <div className="d-flex flex-1 flex-wrap justify-content-between align-items-center">
        <div className="">

          <h4 className="card-title">{title || configData?.masterTitle}</h4>
        </div>
        <div className="d-flex flex-wrap">
          {/* <button
            type="button"
            className="t_btn ms-2 my-1"
            onClick={downloadSampleFile}
          >
            Download Sample File Format
          </button>
          <button
            type="button"
            className="t_btn ms-2 my-1"
            onClick={showChoosefile}
          >
            Upload CSV
          </button> */}
          <input
            id="storeuploads"
            className="upload-file"
            type="file"
            name="file_name"
            style={{ display: "none" }}
            ref={fileInputRef}
          // onChange={handelFile}
          />
          {configData?.masterTitle?.toLowerCase() !== 'stock' &&
            configData?.masterTitle?.toLowerCase() !== 'material history' &&
            configData?.masterTitle?.toLowerCase() !== 'billing' && (
              <button type="button" className="t_btn ms-2 my-1" onClick={onAdd}>
                + Add {configData?.masterTitle}
              </button>
            )}

        </div>
      </div>
      {/* {showProgress && (
        <>
          <ProgressModal
            title={"Users"}
            statusData={statusData}
            error={errorInUpload}
            onClose={() => setshowProgress(false)}
          />
        </>
      )}*/}
    </MasterHeaderContainer>
  );
};

export default UserMgmtPageHeader;

const MasterHeaderContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.03);

  .card-title {
    color: #2a3042;
    font-size: 20px;
  }
`;
