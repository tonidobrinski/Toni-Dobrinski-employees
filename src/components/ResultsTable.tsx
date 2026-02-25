import { DataGrid } from "@mui/x-data-grid";
import type { ProjectOverlap } from "../types";
import "../styles/ResultsTable.css";

type Props = {
  data: ProjectOverlap[];
};

const ResultsTable = ({ data }: Props) => {
  const columns = [
    { field: "emp1", headerName: "Employee ID #1", flex: 1 },
    { field: "emp2", headerName: "Employee ID #2", flex: 1 },
    { field: "projectId", headerName: "Project ID", flex: 1 },
    { field: "daysWorked", headerName: "Days Worked", flex: 1 },
  ];

  return (
    <div className="data-grid-wrapper">
      <DataGrid
        className="results-section"
        getRowId={(row) => `${row.emp1}-${row.emp2}-${row.projectId}`}
        rows={data}
        columns={columns}
      />
    </div>
  );
};

export default ResultsTable;
