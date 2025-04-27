class InventoryError extends Error {
  constructor(message, {invalidValue = null, expectedValues = []} = {}) {
    super(message);
    this.name = "InventoryError";
    this.invalidValue = invalidValue;
    this.expectedValues = expectedValues;
    this.hint = expectedValues.length
      ? `Expected one of: ${expectedValues.join(", ")}`
      : null;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InventoryError);
    }
  }

  toString() {
    return `${this.name}: ${this.message}${
      this.hint ? `\nHint: ${this.hint}` : ""
    }`;
  }
}

export default InventoryError;
