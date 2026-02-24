export type EmployeeRecord = {
  empId: number;
  projectId: number;
  dateFrom: Date;
  dateTo: Date;
};

export type ProjectOverlap = {
  emp1: number;
  emp2: number;
  projectId: number;
  daysWorked: number;
};
