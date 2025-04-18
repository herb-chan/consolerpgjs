export default class ItemError extends Error {
  constructor(message, { invalidValue = null, expectedValues = [] } = {}) {
    super(message);
    this.name = "ItemError";
    this.invalidValue = invalidValue;
    this.expectedValues = expectedValues;
    this.hint = expectedValues.length
      ? `Expected one of: ${expectedValues.join(", ")}`
      : null;

    // Captures where the error occurred (excluding this constructor)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ItemError);
    }
  }

  toString() {
    return `${this.name}: ${this.message}${
      this.hint ? `\nHint: ${this.hint}` : ""
    }`;
  }
}
