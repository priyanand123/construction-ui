import FileSaver from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import XLSX from "sheetjs-style";

export const clipBoardDataFormat = (column = [], rows = []) => {
  const newColumn = [...column];
  let newData = [newColumn];
  for (let i = 0; i < rows.length; i++) {
    const element = [...rows[i]];
    newData.push(element);
  }

  console.log(newData, "clipBoardDataFormat tableDataIs");

  const _data = newData
    .map((item, index) => {
      if (item[0] != "#") {
        item[0] = "\n" + item[0];
      }
      return item.join("   "); // Joining each item with multiple spaces
    })
    .join("");

  return _data;
};

export const exportToExcel = async (headerData, rowData, sheetName) => {
  const fileExtension = ".xlsx";
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const tableDataIs = [headerData, ...rowData];
  // Convert BrandData to worksheet
  const ws = XLSX.utils.aoa_to_sheet(tableDataIs);

  // Apply bold styling to the header row
  const headerCellStyle = { font: { bold: true } };
  const headerRange = XLSX.utils.decode_range(ws["!ref"]);
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    ws[cellAddress].s = headerCellStyle;
  }

  const wb = {
    Sheets: { [sheetName]: ws }, // Use the extracted name
    SheetNames: [sheetName],
  };

  // Write the workbook to Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const filedata = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(filedata, `${sheetName}${fileExtension}`); // Use the extracted name
};

export const exportToPdf = async (headerData, rowData, fileName) => {
  const title = fileName;
  let _headerData = [...headerData];
  let _rowData = new Array(...rowData); //[...rowData];

  let orientation = "portrait";
  if (_headerData.length > 9) {
    orientation = "landscape";
  }
  if (_headerData.length > 11) {
    // Limit _headerData and rowData to 11 columns
    _headerData = _headerData.slice(0, 11);
    _rowData.forEach((row) => {
      row.splice(11); // Limit each row to 12 columns
    });
  }

  const doc = new jsPDF({ orientation });

  let content = {
    startY: 20,
    head: [_headerData],
    body: _rowData,
    title: title,
  };

  // Calculate title width
  const titleWidth = doc.getTextWidth(`${title}`);
  const pageWidth = doc.internal.pageSize.width;

  // Align title to center
  const titleX = (pageWidth - titleWidth) / 2;

  doc.text(`${title}`, titleX, 15); // Center aligned title
  doc.autoTable(content);
  doc.save(`${title}`);
};
