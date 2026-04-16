import React, { useEffect, useState } from "react";

export const TextSearchFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const [text, setText] = useState(filterValue);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFilter(text);
    }, 1500);
    return () => clearTimeout(timerId);
  }, [text]);

  return (
    <input
      className="form-control"
      value={text || ""}
      placeholder={`...`}
      onChange={(e) => {
        setText(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      style={{ maxWidth: "300px" }}
    />
  );
};

export const DropdownFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {

  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      style={{ maxWidth: "300px", minWidth: "150px" }}
    >
      <option value="">...</option>
      {options?.length > 0 &&
        [...options]
          .sort((a, b) => a?.toString().localeCompare(b))
          .map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
    </select>
  );
};
export const ManufactureDropdownFilter = ({

    column: { filterValue, setFilter, preFilteredRows, id }
  }) => {
    // Calculate the options for filtering
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options];
    }, [id, preFilteredRows]);
  
    // Render the dropdown
    return (
      <select
        className="form-select"
        aria-label="Default select example"
        value={filterValue}
        onChange={(e) => {
          const value = e.target.value;
          setFilter(value === "" ? undefined : value === "true");
        }}
        style={{ maxWidth: "300px", minWidth: "150px" }}
      >
        <option value="">...</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  };