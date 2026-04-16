import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

const DieselModalForm = ({ show, onHide, onEditData, onSave, onUpdate, viewOnly }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  React.useEffect(() => {
    if (onEditData) {
      Object.entries(onEditData).forEach(([key, value]) => {
        setValue(key, value);
      });
    } else {
      reset();
    }
  }, [onEditData]);

  const [saving, setSaving] = React.useState(false);
  
  const onSubmit = async (data) => {
    if (saving) return; 
    setSaving(true);
  
    try {
      if (onEditData) {
        await onUpdate({ ...onEditData, ...data }); 
      } else {
        await onSave(data); 
      }
    } catch (error) {
      console.error("Error saving trip:", error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {viewOnly
            ? "View Diesel & Maintenance"
            : onEditData
            ? "Edit Diesel Entry"
            : "Add Diesel Entry"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="row">
          <div className="col-md-6">
            <label>Date *</label>
            <input
              type="date"
              {...register("date", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.date && <p className="text-danger">Required</p>}
          </div>

          <div className="col-md-6">
            <label>Day *</label>
            <input
              type="text"
              {...register("day", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.day && <p className="text-danger">Required</p>}
          </div>

          <div className="col-md-6">
            <label>Amount *</label>
            <input
              type="number"
              {...register("dieselAmount", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.dieselAmount && <p className="text-danger">Required</p>}
          </div>

          <div className="col-md-6">
            <label>Liters *</label>
            <input
              type="number"
              {...register("liters", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.liters && <p className="text-danger">Required</p>}
          </div>

          <div className="col-md-6">
            <label>Person Name *</label>
            <input
              type="text"
              {...register("personName", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.personName && <p className="text-danger">Required</p>}
          </div>
          <div className="col-md-6">
            <label>Maintenance Cost </label>
            <input
              type="text"
              {...register("maintenanceCost", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
          </div>

          {!viewOnly && (
            <div className="modal-footer">
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
               <Button type="submit" variant="primary" disabled={saving}>
               {saving ? "Saving..." : onEditData ? "Update" : "Save"}
                </Button>
            </div>
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DieselModalForm;
