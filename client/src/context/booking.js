const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole nights between two dates; negative or zero means an invalid range. */
export const nightsBetween = (checkInDate, checkOutDate) =>
  Math.round((new Date(checkOutDate) - new Date(checkInDate)) / MS_PER_DAY);

let idCounter = 0;

/** Session-unique id for records created client side. */
export const createId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${idCounter++}`;
