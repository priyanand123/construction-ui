import { forwardRef } from "react";
import { useState } from "react"; // For loading state
import { publicAxios } from "../../../api/config";
import { ApiKey } from "../../../api/endpoints";
import { FaDownload } from "react-icons/fa";
export const TextInput = forwardRef(({ error, ...props }, ref) => (
  <input
    className={`textinput form-control ${!!error && "border-danger"}`}
    ref={ref}
    {...props}
  />
));

export const TextArea = forwardRef(({ error, ...props }, ref) => (
  <textarea
    className={`form-control h-auto ${!!error && "border-danger"}`}
    ref={ref}
    id="exampleFormControlTextarea1"
    rows="4"
    {...props}
  />
));

export const SelectField = forwardRef(
  ({ options, valueKey, labelKey, error, hasDefaultValue,...props }, ref) => (
    <select
      className={`form-control ${!!error && "border-danger"}`}
      ref={ref}
     
      {...props}
    >
      {!hasDefaultValue && <option value="">---------</option>}
      {options.map((option, idx) => (
        <option key={idx} value={option[valueKey]}>
          {option[labelKey]}
        </option>
      ))}
    </select>
  )
);

export const CheckboxField = forwardRef(({ error, label, ...props }, ref) => (
  <div className="h-100 d-flex align-items-end">
    <label>
      <input
        type="checkbox"
        ref={ref}
        {...props}
        className="form-check-input me-2"
      />
      {label}
    </label>
    {!!error && <p style={{ color: "red" }}>{error.message}</p>}
  </div>
));
export const ButtonField = ({ label, loading, isDisabled,onClick, ...props }) => {
  return (
    <div className="btn p-0 me-3 my-0">
      <button
        {...props}
        className="btn_dark"
        disabled={isDisabled || loading}
        onClick={onClick}  // Disable button if loading or other conditions are met
        style={{ cursor: "pointer", padding: "10px 20px" }}
      >
        {loading ? "Downloading..." : label}
      </button>
    </div>
  );
};

export const DynamicFieldsBlock = ({
  
  item,
  register,
  errors,
  viewOnly,
  onEditData,
  watch,
  openImage,
  roleBaseDisable,
  setValue,
  //handleDownload, 
}) => {
  
  console.log(item,"item");
 
  const [loading, setLoading] = useState(false);
  // Initialize the state for damagedBrickCount
  const handleDownload = async (id,files) => {
    try {
    
      //const id = watch('id'); // Assuming 'id' is one of the form fields
      //const fileName = watch('fileName'); // Assuming 'fileName' is another field

      //const fileNames = files.split('|')[0];

      const response = await publicAxios.get(`${ApiKey.downloadAttachment}/${id}/${"Purchase"}/${files}`, {
        responseType: 'blob', // Ensure we receive the file as a blob
      });
      
      console.log(response, "res");

      // Ensure the correct MIME type for .docx files
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', files); // Specify the file name (e.g., fileName.jpg)
      document.body.appendChild(link);
      link.click(); // Trigger the download

      // Cleanup the URL object
      window.URL.revokeObjectURL(url);
      
      setLoading(false);
    } catch (error) {
      console.error("Download failed:", error);
      setLoading(false);
    }
  };
  if (item.type === "link") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    return (
      <div>
        {!!item?.mediaName && (
          <div className="d-flex  align-items-center">
            <h6 className="p-0 me-3 my-0">
              Currently:
              <span
                class="link-opacity-100 text-primary"
               // onClick={() => openImage(item?.url)}
              >
                <b> {item?.mediaName}</b>
              </span>
            </h6>
           {/* <div className="mb-2 p-0 me-3 my-2">
              <CheckboxField
                label={"Clear"}
                {...register("clear")}
                disabled={isDisabled}
              />
            </div>
            <div className="p-0 me-3 my-2">
            <ButtonField
              label={loading ? "Downloading..." : "Download Attachment"}
              style={{
                backgroundColor: "#2a3042 !important",
                border: "0px",  
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s",
                width:"250px"
              }}
              onClick={handleDownload(onEditData.id,onEditData.fileName)}
              disabled={isDisabled || loading} // Disable button if loading or other conditions are met
            />
          </div>*/}
          </div>
        )}
        
      </div>
    );
  }
  if (item.type === "file") {
    
  
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;
    const fileNames = item?.mediaName 
    ? item.mediaName.split('|').filter((fileName) => fileName.trim() !== "") 
    : [];    
    return (
      <div>
       {fileNames.map((fileName, index) => (
        <div className="d-flex  align-items-center">
          <h6 className="p-0 me-3 my-0">
           {/* Currently:*/}
            <span
              class="link-opacity-100 text-primary"
             // onClick={() => openImage(item?.url)}
            >
              <b> {fileName}</b>
            </span>
          </h6>
          <div className="mb-2 p-0 me-3 my-2">
            <CheckboxField
              label={"Clear"}
              {...register(`clear[${index}]`, {
                setValueAs: (value) => !!value, // Convert to boolean
              })}
              disabled={isDisabled}
            />
          </div>
          <div className="p-0 me-3 my-2">
         { /*<ButtonField
            label={loading ? "Downloading..." : "Download Attachment"}
            style={{
              backgroundColor: "#2a3042 !important",
              border: "0px",  
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
              width:"250px"
            }}
            onClick={handleDownload}
            disabled={isDisabled || loading} // Disable button if loading or other conditions are met
          />*/}
          <FaDownload size={20}  disabled={isDisabled} onClick={() => {
                if (!isDisabled) {
                  handleDownload(Number(item.url), fileName);
                }
              }}  /> Download
        </div>
        </div>
      ))}
      
  
 

  <TextInput
          type={"file"}
          accept={item?.accept && item?.accept}
          multiple 
          {...register(item.name, {
            validate: (value) => {

             /* if (!value[0]?.type) return true;
              if (item?.accept.includes(value[0].type?.split("|")[0])) {
                return true;
              }
              return `Please select ${item?.accept?.split("|")[0]} file`;
            },*/

            if (!value[0]?.type) return true;

            // Check if 'accept' is a string or array and perform validation accordingly
            if (item?.accept) {
              if (Array.isArray(item?.accept)) {
                // If 'accept' is an array, check if the file type is in the array
                return item?.accept.includes(value[0].type?.split("/")[0]) || `Please select ${item?.accept.join(', ')} file`;
              } else if (typeof item?.accept === 'string') {
                // If 'accept' is a string, check if it contains the type
                return item?.accept.split("/")[0] === value[0].type?.split("/")[0] || `Please select ${item?.accept.split("/")[0]} file`;
              }
            }
            return true; // If no validation is needed
          },
          })}
          required={!!item.required}
          error={errors[item.name]}
          disabled={isDisabled}
        />
          </div>
      );
    }
  if (item.type === "checkbox") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;
    return (
      <CheckboxField
        label={item.label}
        {...register(item.name)}
        error={errors[item.name]}
        disabled={isDisabled}
      />
    );
  }
  if (item.type === "select") {
    
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;
    
    let opts;
    if (item?.filterOptsBasedOn) {
      const filterVal = watch(item?.filterOptsBasedOn);
      opts = item?.options?.filter(
        (i) => `${i[item?.filterOptsBasedOn]}` === `${filterVal}`
      );
    } else {
      opts = item.options;
    }
    if (!item?.disableSorting) {
      opts =
        opts?.length > 0
          ? [...opts].sort((a, b) =>
              a[item.labelKey].localeCompare(b[item.labelKey])
            )
          : [];
    }
    return (
      <SelectField
        options={opts}
        valueKey={item.valueKey}
        labelKey={item.labelKey}
        {...register(item.name)}
        required={!!item.required}
        error={errors[item.name]}
        disabled={isDisabled}
        hasDefaultValue={!!item?.defaultValue}
        defaultValue={item?.defaultValue && item.defaultValue}
      />
    );
  }
  if (item.type === "multiSelect") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    let opts;
    if (item?.filterOptsBasedOn) {
      const filterVal = watch(item?.filterOptsBasedOn);
      opts = item?.options?.filter(
        (i) => `${i[item?.filterOptsBasedOn]}` === `${filterVal}`
      );
    } else {
      opts = item.options;
    }
    opts =
      opts?.length > 0
        ? [...opts].sort((a, b) =>
            a[item.labelKey].localeCompare(b[item.labelKey])
          )
        : [];
    return (
      <SelectField
        multiple={true}
        options={opts}
        valueKey={item.valueKey}
        labelKey={item.labelKey}
        {...register(item.name)}
        required={!!item.required}
        error={errors[item.name]}
        disabled={isDisabled}
        hasDefaultValue={true}
        defaultValue={item?.defaultValue && [item.defaultValue]}
      />
    );
  }
  if (item.type === "textarea") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    return (
      <TextArea
        type={item.type}
        {...register(item.name, {
          maxLength: {
            value: item?.maxLength,
            message: `Max length is ${item?.maxLength} characters`,
          },
          pattern: {
            value: /^[^<>]+$/,
            message: "HTML tags like <li> or <tag> are not allowed",
          },
        })}
        required={!!item.required}
        maxLength={item.maxLength}
        placeholder={item.placeholder || ""}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
      />
    );
  }
  if (item.type === "text") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;
    
    return (
      <TextInput
        type={item.type}
        {...register(item.name, {
          minLength: {
            value: item?.minLength, // Set the minimum length
            message: `Minimum length is ${item?.minLength} characters`, // Validation message
          },
          maxLength: {
            value: item?.maxLength,
            message: `Max length is ${item?.maxLength} characters`,
          },
          pattern: {
            value: /^[^<>]+$/,
            message: "HTML tags like <li> or <tag> are not allowed",
          },
        })}
        required={!!item.required}
        maxLength={item.maxLength}
        placeholder={item.placeholder || ""}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
       
      />
    );
  }
  if (item.type === "number") {
 
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;
    
    const handleAutofillChange = (event) => {
      const value = event.target.value;
      if (!isNaN(value)) {
        item.onChange(parseFloat(value));
      }
    };
    return (
      <TextInput
        type={item.type}
        {...register(item.name, {
          maxLength: {
            value: item?.maxLength,
            message: `Max length is ${item?.maxLength} characters`,
          },
        })}
        min={0}
        max={item?.max && item?.max}
        required={!!item.required}
        maxLength={item.maxLength}
        placeholder={item.placeholder || ""}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
        step=".00001"
        value={item.value}
        /*onChange={(e) => {
          if (typeof item.onChange === "function") {
            item.onChange(e.target.value);
          }
          handleAutofillChange(e);
        }}*/
        //onBlur={handleBlur}
        //onChange={!isDisabled ? handleChange : undefined}
        onChange={item.onChange}
        
      />
    );
  }
  if (item.type === "file") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    return (
      <TextInput
        type={item.type}
        {...register(item.name, {
          validate: (value) => {
            if (!value[0]?.type) return true;
            if (!item?.accept) return true;
            if (item?.accept?.includes(value[0].type?.split("/")[0])) {
              return true;
            }
            return `Please select ${item?.accept?.split("/")[0]} file`;
          },
        })}
        accept={item?.accept && item?.accept}
        required={!!item.required}
        placeholder={item.placeholder || ""}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
      />
    );
  }
  if (item.type === "email") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    return (
      <TextInput
        type={item.type}
        {...register(item.name, {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Enter a valid email address",
          },
          maxLength: {
            value: item?.maxLength,
            message: `Max length is ${item?.maxLength} characters`,
          },
        })}
        accept={item?.accept && item?.accept}
        required={!!item.required}
        maxLength={item.maxLength}
        placeholder={item.placeholder || ""}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
      />
    );
  }
  if (item.type === "date") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    return (
      <TextInput
        type={item.type}
        {...register(item.name)}
        min={item?.min && item?.min}
        max={item?.max && item?.max}
        accept={item?.accept && item?.accept}
        required={!!item.required}
        maxLength={item.maxLength}
        placeholder={item.placeholder || ""}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
      />
    );
  }
  if (item.type === "time") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    return (
      <TextInput
        type={item.type}
        {...register(item.name)}
        step="1"
        required={!!item.required}
        placeholder={item.placeholder || ""}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
      />
    );
  }
  if (item.type === "tel") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;
  
    return (
      <TextInput
        type={item.type}
        {...register(item.name, {
          required: !!item.required,
          maxLength: {
            value: 10,
            message: "Phone number must be exactly 10 digits.",
          },
          minLength: {
            value: 10,
            message: "Phone number must be exactly 10 digits.",
          },
          pattern: {
            value: /^[0-9]{10}$/,
            message: "Phone number must contain only digits.",
          },
        })}
        maxLength={10} // Ensures the input doesn't accept more than 10 characters
        placeholder={item.placeholder || "Enter phone number"}
        error={errors[item.name]}
        defaultValue={item?.defaultValue && item.defaultValue}
        disabled={isDisabled}
      />
    );
  }
  if (item.type === "year") {
    let isDisabled = false;
    if (item?.removeDisable) isDisabled = false;
    else isDisabled = item?.disabled || viewOnly || roleBaseDisable;

    const startYear = 2000; // Start year
    const endYear = new Date().getFullYear(); // Current year
    const yearRange = Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => {
        const year = startYear + index;
        return { label: year.toString(), value: year.toString() };
      }
    ).reverse();
    return (
      <SelectField
        options={yearRange}
        valueKey={"value"}
        labelKey={"label"}
        {...register(item.name)}
        required={!!item.required}
        error={errors[item.name]}
        disabled={isDisabled}
        hasDefaultValue={!!item?.defaultValue}
        defaultValue={item?.defaultValue && item.defaultValue}
      />
    );
  }

  return (
    <TextInput
      type={item.type}
      {...register(item.name, {
        pattern: {
          value: item?.pattern ? item?.pattern : null,
          message: `Enter a valid ${item?.label}`,
        },
        maxLength: {
          value: item?.maxLength,
          message: `Max length is ${item?.maxLength} characters`,
        },
      })}
      min={item?.min && item?.min}
      max={item?.max && item?.max}
      accept={item?.accept && item?.accept}
      required={!!item.required}
      maxLength={item.maxLength}
      placeholder={item.placeholder || ""}
      error={errors[item.name]}
      defaultValue={item?.defaultValue && item.defaultValue}
      disabled={item?.disabled || viewOnly || roleBaseDisable}
    />
  );
};
