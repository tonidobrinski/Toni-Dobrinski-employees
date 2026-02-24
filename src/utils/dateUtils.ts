//  Normalize to local midnight (removes time component)
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

//  Proper Excel serial date conversion
const excelSerialToDate = (serial: number): Date => {
  // Excel epoch starts at 1899-12-30
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  return normalizeDate(date_info);
};

export const parseDate = (
  value: string | number | Date | null | undefined,
): Date => {
  // NULL / empty => today
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && value.trim().toLowerCase() === "null")
  ) {
    return normalizeDate(new Date());
  }

  // Excel numeric serial
  if (typeof value === "number") {
    return excelSerialToDate(value);
  }

  // Excel sometimes gives Date object
  if (value instanceof Date) {
    return normalizeDate(value);
  }

  const str = value.toString().trim();

  // If numeric string (Excel sometimes converts number to string)
  if (!isNaN(Number(str))) {
    return excelSerialToDate(Number(str));
  }

  // ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return normalizeDate(new Date(str));
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [day, month, year] = str.split("/");
    return normalizeDate(new Date(`${year}-${month}-${day}`));
  }

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    const [day, month, year] = str.split("-");
    return normalizeDate(new Date(`${year}-${month}-${day}`));
  }

  const parsed = new Date(str);

  if (!isNaN(parsed.getTime())) {
    return normalizeDate(parsed);
  }

  // Final fallback
  return normalizeDate(new Date());
};
