export function isDate(value: any) {
  return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
}

export function toDate(value: any) {
  if (isDate(value)) {
    return new Date(value.getTime());
  }
  if (value == null) {
    return new Date(NaN);
  }
  return new Date(value);
}

export function isValidDate(value: any) {
  return isDate(value) && !isNaN(value.getTime());
}
