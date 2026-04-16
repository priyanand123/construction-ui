import React, { memo, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import RenderIf from "../renderif.jsx";
import { DynamicFieldsBlock } from "./formElements";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import AgGrid from "./aggrid.jsx";

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
    onAddMaterial,
    onRemoveMaterial,
    viewOnly,
    roleBaseDisable,
    GridReady,
    materialsData,
    materialOptions,
    unitsOptions,
    onMaterialDataChange,
    
  } = props;

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, reset, setError, watch, control } = useForm({
    defaultValues: formItems.reduce((acc, item) => {
      if (item.defaultValue) acc[item.name] = item.defaultValue;
      return acc;
    }, {}),
  });

  const handleAddMaterial = () => {
    const newRow = { materialId: "", unitId: "", quantity: 0 };
    onMaterialDataChange([...materialsData, newRow]);
  };

  const handleRemoveMaterial = () => {
    const updatedData = materialsData.slice(0, -1);
    onMaterialDataChange(updatedData);
  };

  const onSubmitData = (data) => {
    setLoading(true);
    if (onEditData) {
      onUpdate({ ...onEditData, ...data });
    } else {
      onSave(data);
    }
  };

  const onClose = () => {
    onHide();
    reset();
  };

  useEffect(() => {
    if (onEditData) {
      reset();
      formItems.forEach(item => setValue(item.name, onEditData[item.name]));
    }
  }, [onEditData]);

  return (
    <>
      <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} centered size={size || "lg"}>
        <Modal.Header closeButton>
          <Modal.Title>{viewOnly ? `View ${title}` : onEditData ? `Edit ${title}` : `Add ${title}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalFormContainer onSubmit={handleSubmit(onSubmitData)}>
            <div className="modal-body" id="load_add_form">
              <div className="row">
                {formItems.map((item) => (
                  <div key={item.name} className={item.className}>
                    {item.customType === "agGrid" ? (
                      <AgGrid
                        materialData={materialsData}
                        onMaterialDataChange={onMaterialDataChange}
                        materialOptions={materialOptions}
                        unitsOptions={unitsOptions}
                        onAddMaterial={handleAddMaterial}
                        onRemoveMaterial={handleRemoveMaterial}
                        onGridReady={GridReady}
                      />
                    ) : (
                      <div>
                        <RenderIf isShow={item.type !== "checkbox"}>
                          <label htmlFor={item.name} className="requiredField">
                            {item.label}
                            {item.required && <span className="asteriskField">*</span>}
                          </label>
                        </RenderIf>
                        <DynamicFieldsBlock
                          item={item}
                          errors={errors}
                          viewOnly={viewOnly}
                          roleBaseDisable={roleBaseDisable}
                          register={register}
                          watch={watch}
                          control={control}
                        />
                        {errors[item.name] && (
                          <p style={{ color: "red" }}>{errors[item.name].message}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <RenderIf isShow={!viewOnly}>
              <div className="modal-footer">
                <Button className="btn btn-light" onClick={onClose}>Cancel</Button>
                <Button className="btn_dark" type="submit">
                  {onEditData ? "Update" : "Save"}
                  {loading && <div className="spinner-border text-light" role="status"></div>}
                </Button>
              </div>
            </RenderIf>
          </ModalFormContainer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(ModalForm);

const ModalFormContainer = styled.form`
  font-family: "GT-Walsheim" !important;
  p { font-size: smaller; }
  h6, h5 { font-family: "GT-Walsheim" !important; }
  .modal-body {
    font-size: 13px;
    padding-top: 12px;
  }
  .btn {
    cursor: pointer;
  }
`;
