import React, { forwardRef, memo, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const ModalForm = (props) => {
  const {
    show,
    onHide,
    formItems,
    onEditData,
    onSave,
    onUpdate,
    title,
    masterData,
    valDupFields,
  } = props;
  const [isEditingData, setisEditingData] = useState(!!onEditData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
  } = useForm();

  const onSubmitData = (data) => {
    let dupFieldName = null;
    let dupFieldTitle = null;
    valDupFields.map((fieldIs) => {
      for (let i = 0; i < masterData.length; i++) {
        // Convert both strings to lowercase and remove whitespace

        const masterDataFieldValue = masterData[i][fieldIs]
          ?.toLowerCase()
          .replace(/\s/g, "");
        const dataFieldValue = data[fieldIs]?.toLowerCase().replace(/\s/g, "");
        const presentFieldValue =
          onEditData && onEditData[fieldIs]?.toLowerCase()?.replace(/\s/g, "");
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
      onUpdate({ ...onEditData, ...data });
    }
    if (!onEditData) {
      onSave(data);
    }
  };
  const resetForm = () => {
    setTimeout(() => {
      reset();
    }, 2000);
  };
  const onClose = () => {
    onHide();
    reset();
  };

  useEffect(() => {
    if (!onEditData) return;
    formItems?.map((item) => {
      setValue(item.name, onEditData[item.name]);
    });
  }, [onEditData]);

  const TextInput = forwardRef(({ error, ...props }, ref) => (
    <input
      className={`textinput form-control ${!!error && "border-danger"}`}
      ref={ref}
      {...props}
    />
  ));

  const SelectField = forwardRef(
    ({ options, valueKey, labelKey, error, ...props }, ref) => (
      <select
        className={`form-control ${!!error && "border-danger"}`}
        ref={ref}
        {...props}
      >
        <option value="">---------</option>
        {options.map((option, idx) => (
          <option key={idx} value={option[valueKey]}>
            {option[labelKey]}
          </option>
        ))}
      </select>
    )
  );
  return (
    <Modal
      show={show}
      onHide={onClose}
      onShow={() => !onEditData && reset()}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
     
        <Modal.Title>{isEditingData ? "Edit" : `Add new ${title}`}</Modal.Title>
      
      </Modal.Header>
      <Modal.Body>
        <ModalFormContainer onSubmit={handleSubmit(onSubmitData)}>
          <div className="modal-body" id="load_add_form">
            {formItems.map((item, idx) => (
              <div key={idx}>
                <label htmlFor={item.name} className="requiredField">
                  {item.label}
                  {!!item.required && <span className="asteriskField">*</span>}
                </label>
                {item.type === "select" ? (
                  <SelectField
                    label="Select Color"
                    options={item.options}
                    valueKey={item.valueKey}
                    labelKey={item.labelKey}
                    {...register(item.name)}
                    required={!!item.required}
                    error={errors[item.name]}
                  />
                ) : (
                  <TextInput
                    type={item.type}
                    {...register(item.name, {
                      maxLength: {
                        value: item?.maxLength,
                        message: `Max length is ${item?.maxLength} characters`,
                      },
                    })}
                    required={!!item.required}
                    maxLength={item.maxLength}
                    placeholder={item.placeholder || ""}
                    error={errors[item.name]}
                  />
                )}
                {errors[item.name] && (
                  <p style={{ color: "red" }}>{errors[item.name].message}</p>
                )}
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <Button className="btn btn-light" onClick={onClose}>
              Cancel
            </Button>
            <Button className="t_btn" type="submit">
              Save
            </Button>
          </div>
        </ModalFormContainer>
      </Modal.Body>
    </Modal>
  );
};

export default memo(ModalForm);

const ModalFormContainer = styled.form`
  p {
    font-family: "GT-Walsheim", "Open Sans" !important;
    font-size: smaller;
  }
`;
