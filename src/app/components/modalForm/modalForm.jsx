import dayjs from "dayjs";
import React, { memo, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import RenderIf from "../renderif.jsx";
import { DynamicFieldsBlock } from "./formElements";

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
   
  } = props;
  const [showMediaModal, setshowMediaModal] = useState(false);
  const [mediaDataIs, setmediaDataIs] = useState("");
  const [loading, setloading] = useState(false);
  
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
      setloading(true);
      onUpdate({ ...onEditData, ...data });
    }
    if (!onEditData) {
      debugger;
      setloading(true);

      onSave(data);
    }
  };

  const openMedia = (data) => {
    debugger;
    setshowMediaModal(true);
    setmediaDataIs(data);
  };

  const onClose = () => {
    onHide();
    reset();
  };
  const onShowModal = () => {
    debugger;
    !onEditData && reset();
    setloading(false);
  };

  useEffect(() => {
    debugger;
    if (!onEditData) return;
    reset();
    formItems?.forEach((item) => {
      const value = onEditData[item.name];
      if (!value) return;
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

  // useEffect(() => {
  //   let timerId = 0;
  //   if (!onEditData) {
  //     timerId = setTimeout(() => {
  //       formItems?.forEach((item) => {
  //         console.log(item, "item?.defaultValue");
  //         !!item?.defaultValue && setValue(item?.name, item?.defaultValue);
  //       });
  //     }, 1000);
  //   }
  //   return () => clearTimeout(timerId);
  // }, []);

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
                      
                      <DynamicFieldsBlock
                        item={item}
                        errors={errors}
                        viewOnly={viewOnly}
                        roleBaseDisable={roleBaseDisable}
                        disabled={viewOnly || roleBaseDisable} // Pass the disabled prop
                        register={register}
                        watch={watch}
                        openImage={(mediaData) => openMedia(item)}
                        control={control}
                      />
                  
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
`;
