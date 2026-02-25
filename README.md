# Employees Longest Working Pair

A React 18 application that identifies the pair of employees who have worked together on common projects for the longest period of time.

---

## Overview

This application allows users to upload a CSV or Excel file containing employee project assignments.  
It calculates overlapping work periods and determines which pair of employees has worked together for the longest total duration.

After uploading a file, the application displays all common projects of the longest-working pair in a data grid.

---

## Problem Statement

Given input data in the format:

```
EmpID, ProjectID, DateFrom, DateTo
```

The application must:

- Treat `DateTo = NULL` as today's date
- Support multiple date formats
- Calculate overlapping work periods
- Identify the pair with the longest total overlap
- Display all overlapping projects for that pair

---

## Supported File Formats

- `.csv`
- `.xlsx`
- `.xls`
- `.xlsm`

Excel serial dates are properly converted.

---

## Technologies Used

- React 18
- TypeScript
- Vite
- PapaParse (CSV parsing)
- SheetJS (XLSX parsing)
- MUI DataGrid
- Custom CSS styling

---

## Installation

Clone the repository:

```bash
git clone https://github.com/tonidobrinski/Toni-Dobrinski-employees.git
```

Navigate into the project:

```bash
cd FirstName-LastName-employees
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## How It Works

### File Upload

- User uploads CSV or Excel file
- File can be removed/reset

### Date Handling

The system supports:

- ISO format (`YYYY-MM-DD`)
- `DD/MM/YYYY`
- `DD-MM-YYYY`
- Excel serial dates
- NULL / empty values (treated as today's date)

All dates are normalized to avoid timezone issues.

### Longest Pair Detection

- Employees are grouped per project
- All valid overlaps are calculated
- Total days per pair are accumulated
- The pair with the maximum total days is selected
- All their overlapping projects are displayed

---

## 📌 Example Output

| Employee ID #1 | Employee ID #2 | Project ID | Days Worked |
| -------------- | -------------- | ---------- | ----------- |
| 600            | 700            | 40         | 1882        |

- There is an example file to test in /src/mock-data/employees.xlsx

---
