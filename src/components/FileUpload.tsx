import { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseDate } from "../utils/dateUtils";
import type { EmployeeRecord } from "../types";
import "../styles/FileUpload.css";

type Props = {
  onDataLoaded: (data: EmployeeRecord[]) => void;
};

const FileUpload = ({ onDataLoaded }: Props) => {
  const [fileName, setFileName] = useState<string>("No file selected");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processRows = (rows: any[]) => {
    const cleaned = rows
      .filter((row) => row.EmpID !== undefined || row[0] !== undefined)
      .map((row: any) => {
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
      .filter((r) => !isNaN(r.empId) && !isNaN(r.projectId));

    onDataLoaded(cleaned);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

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
          raw: true,
        });

        processRows(jsonData);
      };

      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file format");
    }
  };

  const handleRemoveFile = () => {
    setFileName("No file selected");
    onDataLoaded([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="custom-file-upload">
      <label className="upload-button btn-grad">
        <div className="inner-wrapper">
          <img
            src="/uploadIcon.webp"
            alt="Upload Icon"
            className="icon-upload"
          />
          <p>Upload File</p>
        </div>

        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept=".csv,.xlsx,.xls,.xlsm"
          onChange={handleFile}
          hidden
        />
      </label>

      {fileName !== "No file selected" && (
        <div className="file-tag">
          <span className="file-tag-name">{fileName}</span>
          <button className="file-tag-remove" onClick={handleRemoveFile}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
