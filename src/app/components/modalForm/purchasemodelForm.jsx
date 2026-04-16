import dayjs from "dayjs";
import React, {
  memo,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import RenderIf from "../renderif.jsx";
import { DynamicFieldsBlock } from "./formElements";
import { ApiKey } from "../../../api/endpoints.js";
import { publicAxios } from "../../../api/config.js";
import { debounce } from "lodash";
import JSZip from "jszip";
const ModalForm = (props) => {
  const {
    size,
    show,
    onHide,
    formItems,
    onEditData,
    onSave,
    onUpdate,
    title,
    masterData,
    valDupFields,
    viewOnly,
    roleBaseDisable,
    onFieldChange,
  } = props;
  const [showMediaModal, setshowMediaModal] = useState(false);
  const [mediaDataIs, setmediaDataIs] = useState("");
  const [loading, setloading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState({ label: "", value: "" });
  const [isUserTriggered, setIsUserTriggered] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
    watch,
    control,
  } = useForm({
    defaultValues: formItems.reduce((acc, item) => {
      if (item.defaultValue) acc[item.name] = item.defaultValue;
      return acc;
    }, {}),
  });

  const [materialOptions, setMaterialOptions] = useState([]);
  console.log(materialOptions, "materialOptions");
  const companyName = watch("purchaseCompany");
  const materialId = watch("materialId");
  const [dropdownloading, setdropdownloading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  // 👇 Watch & auto-calculate GST + Total
  useEffect(() => {
    if (!onFieldChange) return;

    const subscription = watch((formValues, { name, type }) => {
      const updates = onFieldChange(name, formValues[name], formValues); // pass fieldName, value, allFormValues
      if (updates) {
        Object.entries(updates).forEach(([key, value]) => {
          setValue(key, value);
          console.log("setting", key, "=", value);

        });
      }

    });

    return () => subscription.unsubscribe();
  }, [watch, onFieldChange, setValue]);
  useEffect(() => {
    // 👉 when input is cleared
    if (!companyName || companyName.trim() === "") {

      // ✅ allow typing again
      setIsUserTriggered(true);

      // ✅ clear dropdown
      setDropdownOptions([]);
      setIsDropdownVisible(false);

      // ✅ clear all autofilled fields
      setValue("email", "");
      setValue("address", "");
      setValue("gstNo", "");
      setValue("phoneNo", "");
      setValue("website", "");
    }

  }, [companyName, setValue]);
  useEffect(() => {
    debugger;
    if (materialId === "") {
      // Clear the "unitId" field if materialId is empty
      setValue("unitId", "");
      return; // Exit early
    }
    if (materialId) {
      // Filter materialOptions to find the matching record
      const matchingRecord = materialOptions.find(
        (option) => option.id === parseInt(materialId)
      );

      // If a matching record is found, set the value for UnitId
      if (matchingRecord) {
        setValue("unitId", matchingRecord.unitId); // Set the "UnitId" field value
      } else {
        // Clear "unitId" if no matching record is found
        setValue("unitId", "");
      }
    }

  }, [materialId, materialOptions, setValue]);
  // Function to fetch company data
  const fetchCompanyData = async (name) => {
    debugger;
    if (!isUserTriggered || name?.trim().length < 3) return;
    try {
      setloading(true);
      const response = await publicAxios.get(
        `${ApiKey.getpuchasecompanylist}/${name}`
      );
      const companyData = response.data;
      if (companyData.length > 0) {
        debugger;

        const dropdownOptions = companyData.map((item) => ({
          label: `${item.purchaseCompany}`,
          value: item.id, // Use unique ID for value
        }));
        setDropdownOptions(dropdownOptions);
        //setdropdownloading(false);
        setIsDropdownVisible(true);
      }
      else {
        setDropdownOptions([]);
        setIsDropdownVisible(false);
      }
      // Add more fields as necessary
    } catch (error) {
      console.error("Error fetching company data:", error);
      setDropdownOptions([]);
      setIsDropdownVisible(false);
    } finally {
      setloading(false); // End loading
    }
  };

  // Debounced API call for better performance
  const debouncedFetchCompanyData = useCallback(
    debounce(fetchCompanyData, 500),
    []
  );
  /*if(!!onEditData)
    {
      if(companyName?.trim() )
      {
        setIsUserTriggered(true);
        debouncedFetchCompanyData(companyName);
      }
    }*/
  // Watch for changes in the company name field and trigger the debounced API call
  useEffect(() => {
    debugger;

    // ✅ Step 1: check minimum 3 letters
    if (companyName?.trim().length < 3) {
      setDropdownOptions([]);
      setIsDropdownVisible(false);
      return;
    }

    // ✅ Step 2: call API only if valid
    if (
      !viewOnly &&
      !onEditData &&
      isUserTriggered &&
      companyName?.trim().length >= 3
    ) {
      debouncedFetchCompanyData(companyName);
    } else {
      setDropdownOptions([]);
      setIsDropdownVisible(false);
    }

  }, [companyName, viewOnly, onEditData, isUserTriggered, debouncedFetchCompanyData]);

  // Handle the toggle for edit/view mode
  const toggleEditMode = () => {
    setIsEditMode(prevMode => !prevMode);
  };

  const onSubmitData = (data) => {
    let dupFieldName = null;
    let dupFieldTitle = null;
    valDupFields &&
      valDupFields?.map((fieldIs) => {
        for (let i = 0; i < masterData.length; i++) {
          // Convert both strings to lowercase and remove whitespace

          const masterDataFieldValue = masterData[i][fieldIs]
            ?.toLowerCase()
            .replace(/\s/g, "");
          const dataFieldValue = data[fieldIs]
            ?.toLowerCase()
            .replace(/\s/g, "");
          const presentFieldValue =
            onEditData &&
            onEditData[fieldIs]?.toLowerCase()?.replace(/\s/g, "");
          if (
            masterDataFieldValue === dataFieldValue &&
            dataFieldValue !== presentFieldValue
          ) {
            dupFieldName = fieldIs;

            dupFieldTitle = formItems?.find(
              (item) => item?.name === fieldIs && item?.label
            );
            break;
          }
        }
      });
    if (dupFieldName) {
      setError(dupFieldName, {
        type: "custom",
        message: `*This ${dupFieldTitle?.label?.toLowerCase()} already in use`,
      });


      return;
    }

    if (onEditData) {
      debugger;
      setloading(true);
      onUpdate({ ...onEditData, ...data });
      setIsUserTriggered(true);  // Set to true after save
    }
    if (!onEditData) {
      setloading(true);

      onSave(data);
      setIsUserTriggered(true);  // Set to true after save
    }
  };

  const openMedia = (data) => {
    setshowMediaModal(true);
    setmediaDataIs(data);
  };

  const onClose = () => {
    debugger;
    setIsUserTriggered(true);
    onHide();
    reset();

  };
  const onShowModal = () => {
    debugger;
    !onEditData && reset();
    setloading(false);
    setloading(false);
    setDropdownOptions([]);
    setIsDropdownVisible(false);
    //setIsUserTriggered(false);
  };

  const handleDownload = async (id) => {
    try {

      //const fileNames = fileName.split('|')[0];
      const response = await publicAxios.get(
        `${ApiKey.downloadAttachmentZip}/${id}/${"Purchase"}`,
        {
          responseType: "blob", // Ensure we receive the file as a blob
        }
      );

      console.log(response, "res");

      // Ensure the correct MIME type for .docx files
      const blob = response.data;
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/zip" })
      );
      //const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.zip"); // Specify the file name (e.g., fileName.jpg)
      document.body.appendChild(link);
      link.click(); // Trigger the download

      // Cleanup the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    debugger;
    if (!onEditData) return;
    reset();
    setIsUserTriggered(false);

    formItems?.forEach((item) => {
      const value = onEditData[item.name];
      if (!value) return;
      if (item?.name === "materialId") {
        //const materialName = watch("materialId");
        const unit = item.options.find((opt) => opt.id == value);
        setValue("unitId", unit.unitId);
        //  console.log(materialName,"materialName");
      }
      if (item?.name === "photo") return setValue(item.name, value);
      if (item?.type === "multiSelect")
        return setValue(item.name, value?.split(","));

      // Regular expression to check if the value is in YYYY-MM-DD format
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/;

      if (dateFormatRegex.test(value)) {
        // If the value matches the YYYY-MM-DD format, it's treated as a date
        setValue(item.name, dayjs(value).format("YYYY-MM-DD"));
      } else if (!isNaN(Number(value))) {
        // If the value is a number, it's treated as a non-date numeric value
        setValue(item.name, value);
      } else {
        // If the value is not a date or a number, it's treated as text
        setValue(item.name, value);
      }
    });
  }, [onEditData]);

  const handleDropdownSelect = (option) => {
    const data = masterData.find(d => d.id === option.value);

    if (!data) return;

    setIsUserTriggered(false);

    setValue("purchaseCompany", data.purchaseCompany);
    setValue("email", data.email);
    setValue("address", data.address);
    setValue("gstNo", data.gstNo);
    setValue("phoneNo", data.phoneNo);
    setValue("website", data.website);

    setIsDropdownVisible(false);
    setDropdownOptions([]);
  };
  return (
    <>
      <Modal
        show={show && !showMediaModal}
        onHide={onClose}
        onShow={onShowModal}
        backdrop="static"
        keyboard={false}
        centered
        size={size ? size : "lg"}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: "GT-Walsheim" }}>
            {viewOnly
              ? `View ${title}`
              : !!onEditData
                ? `Edit ${title}`
                : `Add ${title}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalFormContainer onSubmit={handleSubmit(onSubmitData)}>
            <div className="modal-body" id="load_add_form">
              <div className="row">
                {formItems.map((item, idx) => {

                  if (
                    !!item?.dynamicField &&
                    item?.dynamicRules &&
                    item?.dynamicRules?.length > 0
                  ) {
                    let ruleMatched;
                    item?.dynamicRules?.forEach((rule) => {
                      const formValue = watch(rule.filedName);
                      ruleMatched = formValue == rule.value;
                    });
                    if (!ruleMatched) return;
                  }
                  if (item.name === "materialId") {
                    // If options exist, update materialOptions
                    if (item.options && item.options.length > 0) {
                      // Prevent redundant updates
                      if (
                        JSON.stringify(materialOptions) !==
                        JSON.stringify(item.options)
                      ) {
                        setMaterialOptions(item.options);
                      }
                    } else {
                      // Handle when item.options is undefined or empty
                      if (
                        formItems[0]?.options &&
                        JSON.stringify(materialOptions) !==
                        JSON.stringify(formItems[0].options)
                      ) {
                        setMaterialOptions(formItems[0].options);
                      }
                    }
                  }
                  const onSubmit = (data) => {
                    console.log("Form data submitted:", data);
                  };
                  return (
                    <div
                      key={idx}
                      className={item?.className && item?.className}
                    >
                      <RenderIf isShow={item.type !== "checkbox"}>
                        <label htmlFor={item.name} className="requiredField">
                          {item.label}
                          {!!item.required && (
                            <span className="asteriskField">*</span>
                          )}
                        </label>
                      </RenderIf>
                      {item.name === "purchaseCompany" ? (
                        <div className="col-lg-12 col-md-12" style={{ position: "relative" }}>

                          {/* ✅ INPUT ALWAYS */}
                          <input
                            type="text"
                            name={item.name}
                            className="form-control"
                            {...register(item.name)}
                            disabled={viewOnly}
                          />

                          {/* ✅ LOADING */}
                          {loading && (
                            <div className="loading-text">Loading...</div>
                          )}

                          {/* ✅ DROPDOWN BELOW */}
                          {isDropdownVisible && dropdownOptions.length > 0 && (
                            <div
                              style={{
                                border: "1px solid #ccc",
                                position: "absolute",
                                width: "100%",
                                background: "white",
                                maxHeight: "150px",
                                overflowY: "auto",
                                zIndex: 1000
                              }}
                            >
                              {dropdownOptions.map((option, index) => (
                                <div
                                  key={index}
                                  style={{ padding: "8px", cursor: "pointer" }}
                                  onClick={() => handleDropdownSelect(option)}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      ) : (
                        <DynamicFieldsBlock
                          item={item}
                          errors={errors}
                          viewOnly={viewOnly}
                          roleBaseDisable={roleBaseDisable}
                          register={register}
                          watch={watch}
                          openImage={(mediaData) => openMedia(item)}
                          control={control}
                          setValue={setValue}
                        />
                      )}
                      {errors[item.name] && (
                        <p style={{ color: "red" }}>
                          {errors[item.name].message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <RenderIf isShow={!viewOnly}>
              <div className="modal-footer">
                <Button className="btn btn-light" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="btn_dark" type="submit">
                  {!!onEditData ? "Update" : "Save"}{" "}
                  {loading && (
                    <div class="spinner-border text-light" role="status"></div>
                  )}
                </Button>
                {onEditData && onEditData.fileName?.trim() !== "" && (
                  <Button
                    className="btn_dark"
                    onClick={() => handleDownload(onEditData?.id)}
                  >
                    Download Attachments
                  </Button>
                )}
              </div>
            </RenderIf>
          </ModalFormContainer>
        </Modal.Body>
      </Modal>
      <Modal
        show={showMediaModal}
        onHide={() => setshowMediaModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{mediaDataIs.mediaName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "80vh", width: "100%" }}>
            <img
              className="m-0 p-0"
              src={`data:image/jpeg;base64,${mediaDataIs.url}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(ModalForm);

const ModalFormContainer = styled.form`
  font-family: "GT-Walsheim" !important;
  p {
    font-family: "GT-Walsheim" !important;
    font-size: smaller;
  }
  h6,
  h5 {
    font-family: "GT-Walsheim" !important;
  }
    select {
  white-space: pre-wrap; /* Allows line breaks for option labels */
}
`;
