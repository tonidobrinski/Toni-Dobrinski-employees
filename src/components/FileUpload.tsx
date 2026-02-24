import Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseDate } from "../utils/dateUtils";
import type { EmployeeRecord } from "../types";

type Props = {
  onDataLoaded: (data: EmployeeRecord[]) => void;
};

const FileUpload = ({ onDataLoaded }: Props) => {
  const processRows = (rows: any[]) => {
    const cleaned = rows
      .filter((row) => row.EmpID !== undefined || row[0] !== undefined)
      .map((row) => {
        // Support both header-based and index-based parsing
        const empId = row.EmpID ?? row[0];
        const projectId = row.ProjectID ?? row[1];
        const dateFrom = row.DateFrom ?? row[2];
        const dateTo = row.DateTo ?? row[3];

        return {
          empId: Number(empId),
          projectId: Number(projectId),
          dateFrom: parseDate(dateFrom),
          dateTo: parseDate(dateTo),
        };
      })
      .filter(
        (r) =>
          !isNaN(r.empId) &&
          !isNaN(r.projectId) &&
          r.dateFrom instanceof Date &&
          r.dateTo instanceof Date,
      );

    onDataLoaded(cleaned);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split(".").pop()?.toLowerCase();

    if (fileType === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          processRows(result.data);
        },
      });
    } else if (
      fileType === "xlsx" ||
      fileType === "xls" ||
      fileType === "xlsm"
    ) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        });

        processRows(jsonData);
      };

      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file format");
    }
  };

  return (
    <input type="file" accept=".csv,.xlsx,.xls,.xlsm" onChange={handleFile} />
  );
};

export default FileUpload;
