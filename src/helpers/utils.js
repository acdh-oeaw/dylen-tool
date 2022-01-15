export function roundToMaxDigit(number, maxDigits) {
    let roundedNumber = Math.round(
        (number + Number.EPSILON) *
        Math.pow(10, maxDigits)
    ) / Math.pow(10, maxDigits);

    return maxDigits > 10
        ? number
        : roundedNumber == 0 && number != 0 ? number.toExponential(2) : roundedNumber;
}

export function camelCaseToSpaces(text) {
    let result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}

export function camelToSnake (str){
  return str.replace(/[A-Z]/g, group =>
    `_${group.toLowerCase()}`
  );
}
export function snakeToCamel (str){
  return str.replace(/([-_][a-z])/g, group =>
  group
    .toUpperCase()
    .replace('-', '')
    .replace('_', '')
  );
}