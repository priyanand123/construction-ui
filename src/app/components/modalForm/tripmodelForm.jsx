import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";

const TripModalForm = ({ show, onHide, onEditData, onSave, onUpdate, viewOnly }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm();

  // 👇 Watch the start and end meter values
  const start = useWatch({ control, name: "startMeterReading" });
  const end = useWatch({ control, name: "endMeterReading" });

  // 👇 Auto calculate totalUsed
  React.useEffect(() => {
    const s = parseFloat(start);
    const e = parseFloat(end);
    if (!isNaN(s) && !isNaN(e)) {
      const totalUsed = e - s;
      setValue("totalUsedMeterReading", totalUsed.toFixed(2));
    }
  }, [start, end]);

  // Load edit data
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
          {viewOnly ? "View Trip Details" : onEditData ? "Edit Trip" : "Add Trip"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="row">
          <div className="col-md-6">
            <label>Start Meter Reading *</label>
            <input
              type="number"
              step="any"
              {...register("startMeterReading", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.startMeterReading && <p className="text-danger">Required</p>}
          </div>

          <div className="col-md-6">
            <label>End Meter Reading *</label>
            <input
              type="number"
              step="any"
              {...register("endMeterReading", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.endMeterReading && <p className="text-danger">Required</p>}
          </div>

          <div className="col-md-6">
            <label>Total Used Meter *</label>
            <input
              type="number"
              step="any"
              {...register("totalUsedMeterReading", { required: true })}
              className="form-control"
              disabled
            />
            {errors.totalUsedMeterReading && <p className="text-danger">Required</p>}
          </div>

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
            <label>Person Name *</label>
            <input
              type="text"
              {...register("personName", { required: true })}
              className="form-control"
              disabled={viewOnly}
            />
            {errors.personName && <p className="text-danger">Required</p>}
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

export default TripModalForm;
