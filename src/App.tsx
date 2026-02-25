import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ResultsTable from "./components/ResultsTable";
import type { EmployeeRecord, ProjectOverlap } from "./types";
import { calculateLongestPair } from "./utils/calculateLongestPair";
import "./App.css";

function App() {
  const [results, setResults] = useState<ProjectOverlap[]>([]);

  const handleData = (data: EmployeeRecord[]) => {
    console.log("Parsed data:", data);
    const res = calculateLongestPair(data);
    console.log("Results:", res);
    setResults(res);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Employees Longest Working Pair</h1>
      <FileUpload onDataLoaded={handleData} />
      <ResultsTable data={results} />
    </div>
  );
}

export default App;
